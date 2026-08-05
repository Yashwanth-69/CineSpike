"""
eval_retrieval.py — retrieval quality + end-to-end latency for CineSpike's
ChromaDB movie-similarity search.

This script does NOT modify any repo source file. It imports the production
code path (`vector_store.query_similar_movies`) and the production tag
vocabulary (`tag_generator`) so the numbers describe the real system.

Eval set (all queries come from the repo's own data — nothing synthetic):
  SET A — one query per genre in tag_generator.GENRE_PROMPTS (10 queries),
          built through tag_generator.manual_tags(), i.e. exactly what the
          Flask /api/analyze manual-override path produces.
  SET B — every tags dict that a real CLIP run actually produced and that is
          persisted in the local SQLite analyses table (filmspike.db).

Relevance judgement for precision@k (automatic, not human):
  A retrieved movie is RELEVANT iff its TMDB `genres` metadata (stored in
  ChromaDB at ingest time, ingest.py:266) intersects the TMDB genre label(s)
  that the query's genre tag maps to. The mapping is 1:1 and unambiguous
  (see PROMPT_TO_TMDB below). TMDB genre labels are dataset ground truth, not
  a model judgement.

A random-draw baseline is computed for every query so precision@5 can be read
against chance rather than against nothing.

Run:  python eval/eval_retrieval.py
"""

import json
import os
import sqlite3
import statistics
import sys
import time

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, REPO_ROOT)

from tag_generator import GENRE_PROMPTS, manual_tags          # noqa: E402
from vector_store import query_similar_movies, collection_count  # noqa: E402

CHROMA_SQLITE = os.path.join(REPO_ROOT, "chroma_db", "chroma.sqlite3")
ANALYSES_DBS = ["filmspike.db", "cinespike.db"]
OUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results",
                        "retrieval_eval.json")

# tag_generator prompt string -> TMDB genre label used in the corpus metadata
PROMPT_TO_TMDB = {
    "action movie":         "Action",
    "comedy film":          "Comedy",
    "horror movie":         "Horror",
    "science fiction film": "Science Fiction",
    "romance movie":        "Romance",
    "drama film":           "Drama",
    "thriller movie":       "Thriller",
    "animated film":        "Animation",
    "fantasy movie":        "Fantasy",
    "crime movie":          "Crime",
}

LATENCY_REPEATS = 10   # timed repeats per query, after a warm-up call


# ── Corpus stats (for the random baseline) ───────────────────────────────────
def corpus_genre_sets():
    """[{genre labels}] for every indexed movie, straight out of chroma.sqlite3."""
    conn = sqlite3.connect(CHROMA_SQLITE)
    rows = conn.execute(
        "SELECT string_value FROM embedding_metadata WHERE key = 'genres'"
    ).fetchall()
    conn.close()
    return [{g.strip() for g in (v or "").split(",") if g.strip()} for (v,) in rows]


def random_baseline(corpus, wanted):
    """P(a uniformly random corpus movie is relevant) for this query."""
    if not corpus:
        return None
    hits = sum(1 for gs in corpus if gs & wanted)
    return hits / len(corpus)


# ── Eval set construction ────────────────────────────────────────────────────
def build_set_a():
    """One manual_tags() query per production genre prompt."""
    queries = []
    for prompt in GENRE_PROMPTS:
        queries.append({
            "set": "A_manual_genre",
            "name": prompt,
            "tags": manual_tags([prompt], []),
        })
    return queries


def build_set_b():
    """Real CLIP tag dicts persisted by past /api/analyze runs."""
    queries = []
    for db_name in ANALYSES_DBS:
        path = os.path.join(REPO_ROOT, db_name)
        if not os.path.exists(path):
            continue
        conn = sqlite3.connect(path)
        try:
            rows = conn.execute(
                "SELECT id, filename, tags_json FROM analyses"
            ).fetchall()
        except sqlite3.Error:
            rows = []
        conn.close()
        for _id, filename, tags_json in rows:
            tags = json.loads(tags_json or "{}")
            if not tags.get("genres"):
                continue
            queries.append({
                "set": "B_logged_clip",
                "name": f"{db_name}:{filename}:{tags.get('method')}",
                "tags": tags,
            })
    return queries


def wanted_labels(tags):
    """TMDB labels a query's genre tags map to. Unmappable tags are dropped."""
    out = set()
    for g in tags.get("genres", []):
        label = PROMPT_TO_TMDB.get(g.lower())
        if label:
            out.add(label)
    return out


def is_relevant(movie, wanted):
    got = {g.strip() for g in (movie.get("genres") or "").split(",") if g.strip()}
    return bool(got & wanted)


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    n_indexed = collection_count()
    if n_indexed == 0:
        print("BLOCKED: ChromaDB collection is empty. Run `python ingest.py` first.")
        return 1

    corpus = corpus_genre_sets()
    queries = build_set_a() + build_set_b()

    print(f"corpus size (indexed movies): {n_indexed}")
    print(f"corpus rows read for baseline: {len(corpus)}")
    print(f"eval set size: {len(queries)} queries "
          f"({sum(1 for q in queries if q['set'] == 'A_manual_genre')} manual, "
          f"{sum(1 for q in queries if q['set'] == 'B_logged_clip')} logged-CLIP)")
    print(f"latency repeats per query: {LATENCY_REPEATS}\n")

    # Warm up: first call loads the SentenceTransformer + opens Chroma. In the
    # Flask process these are module-level globals, so steady-state latency is
    # the honest number to report.
    query_similar_movies(queries[0]["tags"], n=10)

    per_query = []
    all_latencies = []

    for q in queries:
        wanted = wanted_labels(q["tags"])
        if not wanted:
            print(f"SKIP (no mappable genre): {q['name']}")
            continue

        latencies = []
        results = None
        for _ in range(LATENCY_REPEATS):
            t0 = time.perf_counter()
            results = query_similar_movies(q["tags"], n=10)
            latencies.append((time.perf_counter() - t0) * 1000.0)
        all_latencies.extend(latencies)

        top5 = results[:5]
        top10 = results[:10]
        rel5 = sum(1 for m in top5 if is_relevant(m, wanted))
        rel10 = sum(1 for m in top10 if is_relevant(m, wanted))

        rec = {
            "set": q["set"],
            "query": q["name"],
            "query_text_genres": q["tags"].get("genres"),
            "wanted_tmdb_labels": sorted(wanted),
            "n_returned": len(results),
            "precision_at_5": rel5 / 5.0,
            "precision_at_10": rel10 / 10.0,
            "random_baseline_precision": random_baseline(corpus, wanted),
            "median_latency_ms": statistics.median(latencies),
            "top5_titles": [m.get("title") for m in top5],
            "top5_relevant": [is_relevant(m, wanted) for m in top5],
            "top1_similarity_score": top5[0].get("similarity_score") if top5 else None,
        }
        per_query.append(rec)
        print(f"[{rec['set']}] {rec['query']}")
        print(f"    want={sorted(wanted)}  p@5={rec['precision_at_5']:.2f}  "
              f"p@10={rec['precision_at_10']:.2f}  "
              f"chance={rec['random_baseline_precision']:.3f}  "
              f"median={rec['median_latency_ms']:.1f} ms")
        print(f"    top5={rec['top5_titles']}")

    if not per_query:
        print("BLOCKED: no query in the eval set had a mappable genre.")
        return 1

    p5 = [r["precision_at_5"] for r in per_query]
    p10 = [r["precision_at_10"] for r in per_query]
    base = [r["random_baseline_precision"] for r in per_query]

    summary = {
        "corpus_size": n_indexed,
        "eval_set_size": len(per_query),
        "eval_set_breakdown": {
            "A_manual_genre": sum(1 for r in per_query if r["set"] == "A_manual_genre"),
            "B_logged_clip": sum(1 for r in per_query if r["set"] == "B_logged_clip"),
        },
        "relevance_judge": "TMDB genre-label overlap from ChromaDB metadata (automatic)",
        "mean_precision_at_5": statistics.mean(p5),
        "mean_precision_at_10": statistics.mean(p10),
        "mean_random_baseline_precision": statistics.mean(base),
        "latency_measurements": len(all_latencies),
        "median_latency_ms": statistics.median(all_latencies),
        "p95_latency_ms": sorted(all_latencies)[int(0.95 * len(all_latencies)) - 1],
        "min_latency_ms": min(all_latencies),
        "max_latency_ms": max(all_latencies),
        "latency_scope": "vector_store.query_similar_movies() only: "
                         "MiniLM encode + Chroma HNSW top-10 + metadata assembly. "
                         "Excludes CLIP tagging, file upload, SQLite write, HTTP.",
    }

    print("\n" + "=" * 72)
    for k, v in summary.items():
        print(f"{k}: {v}")

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump({"summary": summary, "per_query": per_query}, f, indent=2)
    print(f"\nwrote {OUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
