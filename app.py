"""
CineSpike - Movie Trailer Analysis Platform
app.py: Flask application with API-first architecture.

All data routes return JSON, so the frontend team can work
independently without touching this file.
"""

import os
import json
import uuid
import sqlite3
import threading
from datetime import datetime

from flask import Flask, render_template, request, jsonify, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

# ── App Config ──────────────────────────────────────────────────────────────
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = os.getenv("UPLOAD_FOLDER", "uploads")
app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024  # 500 MB
app.config["ALLOWED_EXTENSIONS"] = {"mp4", "mov", "avi", "mkv"}
app.config["DB_PATH"] = os.getenv("DB_PATH", "cinespike.db")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change_me_in_production")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "").strip()
cors_origins = [frontend_origin] if frontend_origin else "*"
CORS(app, resources={r"/api/*": {"origins": cors_origins}})

_ingest_lock = threading.Lock()
_ingest_state = {
    "running": False,
    "last_started": None,
    "last_completed": None,
    "last_error": None,
    "last_count": 0,
}

# ── DB helpers ───────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(app.config["DB_PATH"])
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    db_dir = os.path.dirname(app.config["DB_PATH"])
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id              TEXT PRIMARY KEY,
                filename        TEXT NOT NULL,
                timestamp       TEXT NOT NULL,
                tags_json       TEXT,
                top_movies_json TEXT,
                audience_json   TEXT,
                release_json    TEXT,
                campaign_json   TEXT
            )
        """)
        # Auto-migrate if column doesn't exist
        try:
            conn.execute("ALTER TABLE analyses ADD COLUMN campaign_json TEXT")
            print("[DB] Migrated: added campaign_json column.")
        except sqlite3.OperationalError:
            pass # Column already exists
    print("[DB] Database ready.")


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]
    )


def init_storage():
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    init_db()


def _ingest_status_payload():
    return {
        "running": _ingest_state["running"],
        "last_started": _ingest_state["last_started"],
        "last_completed": _ingest_state["last_completed"],
        "last_error": _ingest_state["last_error"],
        "db_movies": _ingest_state["last_count"],
    }


def _run_ingest_job():
    try:
        from ingest import ingest as run_ingest
        run_ingest()
        try:
            from vector_store import collection_count
            count = collection_count()
        except Exception:
            count = 0

        with _ingest_lock:
            _ingest_state["last_count"] = count
            _ingest_state["last_error"] = None
    except Exception as exc:
        with _ingest_lock:
            _ingest_state["last_error"] = str(exc)
    finally:
        with _ingest_lock:
            _ingest_state["running"] = False
            _ingest_state["last_completed"] = datetime.now().isoformat()


# ── Page Routes (thin shells — all data fetched by JS) ───────────────────────
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/results/<analysis_id>")
def results(analysis_id):
    return render_template("results.html", analysis_id=analysis_id)


@app.route("/history")
def history():
    return render_template("history.html")


# ── API: Upload & Analyze ────────────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    """
    Accepts multipart form with:
      - trailer (file, required)
      - genres[]  (optional manual override, multi-value)
      - emotions[] (optional manual override, multi-value)
    Returns: {"analysis_id": "<uuid>"}
    """
    if "trailer" not in request.files:
        return jsonify({"error": "No trailer file provided"}), 400

    file = request.files["trailer"]
    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file. Accepted: mp4, mov, avi, mkv"}), 400

    # Save file
    filename = secure_filename(file.filename)
    analysis_id = str(uuid.uuid4())
    save_name = f"{analysis_id}_{filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], save_name)
    file.save(filepath)

    # ── Tag Generation ──────────────────────────────────────────────────────
    manual_genres = request.form.getlist("genres[]")
    manual_emotions = request.form.getlist("emotions[]")

    from tag_generator import generate_tags, manual_tags

    if manual_genres:
        tags = manual_tags(manual_genres, manual_emotions or [])
    else:
        tags = generate_tags(filepath)

    # ── Vector Similarity Search ────────────────────────────────────────────
    from vector_store import query_similar_movies
    top_movies = query_similar_movies(tags)

    # ── Audience Profile ────────────────────────────────────────────────────
    from reddit_mapper import get_audience_profile
    audience = get_audience_profile(tags, top_movies)

    # ── Release Planner ─────────────────────────────────────────────────────
    from release_planner import suggest_release_window
    release_plan = suggest_release_window(top_movies, tags)

    # ── Persist to SQLite ───────────────────────────────────────────────────
    with get_db() as conn:
        conn.execute(
            "INSERT INTO analyses VALUES (?,?,?,?,?,?,?,?)",
            (
                analysis_id,
                filename,
                datetime.now().isoformat(),
                json.dumps(tags),
                json.dumps(top_movies),
                json.dumps(audience),
                json.dumps(release_plan),
                None, # campaign_json is null initially
            ),
        )

    return jsonify({"analysis_id": analysis_id})


# ── API: Get Results ─────────────────────────────────────────────────────────
@app.route("/api/results/<analysis_id>")
def api_results(analysis_id):
    """
    Returns full analysis result as JSON.
    Frontend team: this is the ONLY endpoint the results page needs.
    """
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM analyses WHERE id = ?", (analysis_id,)
        ).fetchone()

    if not row:
        return jsonify({"error": "Analysis not found"}), 404

    return jsonify({
        "id":           row["id"],
        "filename":     row["filename"],
        "timestamp":    row["timestamp"],
        "tags":         json.loads(row["tags_json"] or "{}"),
        "top_movies":   json.loads(row["top_movies_json"] or "[]"),
        "audience":     json.loads(row["audience_json"] or "{}"),
        "release_plan": json.loads(row["release_json"] or "{}"),
        "campaign":     json.loads(row["campaign_json"] or "null"),
    })


# ── API: Generate Campaign (On-Demand) ───────────────────────────────────────
@app.route("/api/generate_campaign/<analysis_id>", methods=["POST"])
def api_generate_campaign(analysis_id):
    """
    On-demand AI deep-dive campaign generation using Groq.
    """
    with get_db() as conn:
        row = conn.execute(
            "SELECT tags_json, top_movies_json, audience_json FROM analyses WHERE id = ?", 
            (analysis_id,)
        ).fetchone()

    if not row:
        return jsonify({"error": "Analysis not found"}), 404

    tags       = json.loads(row["tags_json"] or "{}")
    top_movies = json.loads(row["top_movies_json"] or "[]")
    audience   = json.loads(row["audience_json"] or "{}")

    # Call Groq-backed campaign generator
    from release_planner import generate_ai_campaign
    try:
        campaign = generate_ai_campaign(tags, top_movies, audience)
    except Exception as e:
        return jsonify({"error": f"Failed to generate campaign: {str(e)}"}), 500

    # Save to SQLite
    with get_db() as conn:
        conn.execute(
            "UPDATE analyses SET campaign_json = ? WHERE id = ?",
            (json.dumps(campaign), analysis_id)
        )

    return jsonify(campaign)


# ── API: History ─────────────────────────────────────────────────────────────
@app.route("/api/history")
def api_history():
    """Returns list of all past analyses (id, filename, timestamp)."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, filename, timestamp FROM analyses ORDER BY timestamp DESC"
        ).fetchall()
    return jsonify([dict(r) for r in rows])


# ── API: Delete Analysis ──────────────────────────────────────────────────────
@app.route("/api/analysis/<analysis_id>", methods=["DELETE"])
def api_delete(analysis_id):
    with get_db() as conn:
        conn.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,))
    return jsonify({"success": True})


# ── API: Health Check ────────────────────────────────────────────────────────
@app.route("/api/health")
def api_health():
    """Quick health-check used by the upload page to verify backend."""
    db_movies = 0
    status = "ok"
    try:
        from vector_store import collection_count
        db_movies = collection_count()
    except Exception:
        # Keep health endpoint resilient so platform health checks don't fail
        # if vector dependencies are still warming up.
        status = "degraded"

    return jsonify({
        "status": status,
        "db_movies": db_movies,
        "timestamp": datetime.now().isoformat(),
    })


@app.route("/api/admin/ingest", methods=["GET", "POST"])
def api_admin_ingest():
    """
    Temporary endpoint for environments without shell access.
    - GET  => ingest job status
    - POST => trigger ingest in background thread (requires token)
    """
    if request.method == "GET":
        try:
            from vector_store import collection_count
            with _ingest_lock:
                _ingest_state["last_count"] = collection_count()
        except Exception:
            pass
        with _ingest_lock:
            return jsonify(_ingest_status_payload())

    expected_token = os.getenv("INGEST_TRIGGER_TOKEN", "").strip() or app.config["SECRET_KEY"]
    provided_token = request.headers.get("X-Ingest-Token", "").strip()
    if not expected_token or provided_token != expected_token:
        return jsonify({"error": "Unauthorized"}), 401

    with _ingest_lock:
        if _ingest_state["running"]:
            return jsonify({
                "status": "already_running",
                **_ingest_status_payload(),
            }), 202

        _ingest_state["running"] = True
        _ingest_state["last_started"] = datetime.now().isoformat()
        _ingest_state["last_error"] = None

    thread = threading.Thread(target=_run_ingest_job, daemon=True)
    thread.start()

    with _ingest_lock:
        return jsonify({
            "status": "started",
            **_ingest_status_payload(),
        }), 202


# ── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_storage()
    port = int(os.getenv("PORT", "5000"))
    app.run(debug=True, host="0.0.0.0", port=port)


init_storage()
