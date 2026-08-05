"""
eval_pipeline_latency.py — end-to-end latency of the CineSpike analysis
pipeline, stage by stage, on the real trailer files in ./uploads.

This reproduces everything /api/analyze does between receiving the saved file
and writing the SQLite row (app.py:105-142):

    tag_generator.generate_tags(path)          # CLIP zero-shot over sampled frames
    vector_store.query_similar_movies(tags)    # MiniLM encode + Chroma HNSW
    reddit_mapper.get_audience_profile(...)    # pure lookup, no I/O
    release_planner.suggest_release_window(...)# pure rules, no I/O

It deliberately excludes the HTTP round trip and the multipart upload, since
those depend on the client and network rather than on the system.

NOTE on a real property of the code: tag_generator._clip_tags loads
CLIPModel/CLIPProcessor from_pretrained on EVERY call (tag_generator.py:89-90),
so there is no warm path for the tagging stage in production. Both the first
call and later calls are reported.

Run:  python eval/eval_pipeline_latency.py
"""

import glob
import json
import os
import statistics
import sys
import time

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, REPO_ROOT)

from reddit_mapper import get_audience_profile          # noqa: E402
from release_planner import suggest_release_window      # noqa: E402
from tag_generator import generate_tags                 # noqa: E402
from vector_store import query_similar_movies           # noqa: E402

UPLOADS = os.path.join(REPO_ROOT, "uploads")
OUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results",
                        "pipeline_latency.json")
REPEATS = 3   # repeats per video


def ms(t0):
    return (time.perf_counter() - t0) * 1000.0


def main():
    videos = sorted(
        p for p in glob.glob(os.path.join(UPLOADS, "*"))
        if os.path.splitext(p)[1].lower() in {".mp4", ".mov", ".avi", ".mkv"}
    )
    if not videos:
        print("BLOCKED: no trailer files in ./uploads — nothing real to time.")
        return 1

    print(f"videos found: {len(videos)}")
    for v in videos:
        print(f"  {os.path.basename(v)}  ({os.path.getsize(v)/1e6:.1f} MB)")
    print(f"repeats per video: {REPEATS}\n")

    runs = []
    for path in videos:
        for r in range(REPEATS):
            t_all = time.perf_counter()

            t0 = time.perf_counter()
            tags = generate_tags(path)
            t_tag = ms(t0)

            t0 = time.perf_counter()
            movies = query_similar_movies(tags)
            t_ret = ms(t0)

            t0 = time.perf_counter()
            audience = get_audience_profile(tags, movies)
            t_aud = ms(t0)

            t0 = time.perf_counter()
            plan = suggest_release_window(movies, tags)
            t_rel = ms(t0)

            total = ms(t_all)
            rec = {
                "video": os.path.basename(path),
                "repeat": r,
                "tagging_method": tags.get("method"),
                "tagging_ms": t_tag,
                "retrieval_ms": t_ret,
                "audience_ms": t_aud,
                "release_planner_ms": t_rel,
                "total_ms": total,
                "n_movies_returned": len(movies),
                "recommended_month": plan.get("recommended_month_name"),
                "n_primary_subreddits": len(audience.get("primary_subreddits", [])),
            }
            runs.append(rec)
            print(f"{rec['video']} r{r}: method={rec['tagging_method']} "
                  f"tag={t_tag:.0f}ms retrieval={t_ret:.1f}ms "
                  f"audience={t_aud:.2f}ms release={t_rel:.2f}ms "
                  f"TOTAL={total:.0f}ms")

    if any(r["tagging_method"] != "clip" for r in runs):
        print("\nWARNING: at least one run fell back off the CLIP path. "
              "Latency below is NOT the CLIP pipeline for those runs.")

    totals = [r["total_ms"] for r in runs]
    later = [r["total_ms"] for r in runs if r["repeat"] > 0]

    summary = {
        "n_videos": len(videos),
        "repeats_per_video": REPEATS,
        "n_runs": len(runs),
        "tagging_methods_observed": sorted({r["tagging_method"] for r in runs}),
        "median_total_ms": statistics.median(totals),
        "min_total_ms": min(totals),
        "max_total_ms": max(totals),
        "median_total_ms_excluding_first_repeat": (
            statistics.median(later) if later else None),
        "median_tagging_ms": statistics.median([r["tagging_ms"] for r in runs]),
        "median_retrieval_ms": statistics.median([r["retrieval_ms"] for r in runs]),
        "median_audience_ms": statistics.median([r["audience_ms"] for r in runs]),
        "median_release_ms": statistics.median([r["release_planner_ms"] for r in runs]),
        "scope": "generate_tags + query_similar_movies + get_audience_profile + "
                 "suggest_release_window. Excludes HTTP, multipart upload, "
                 "SQLite insert, and the on-demand Groq campaign call.",
    }

    print("\n" + "=" * 72)
    for k, v in summary.items():
        print(f"{k}: {v}")

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump({"summary": summary, "runs": runs}, f, indent=2)
    print(f"\nwrote {OUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
