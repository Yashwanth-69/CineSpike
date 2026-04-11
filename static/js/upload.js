/**
 * upload.js — CineSpike upload page logic
 *
 * Frontend team: this file handles:
 *  - Drag-and-drop file selection
 *  - Form submission to /api/analyze
 *  - Processing overlay with animated progress messages
 *  - DB health status from /api/health
 *
 * To change the upload behavior or UX, edit this file.
 * To change the visual look, edit static/css/style.css.
 */

'use strict';

// ── DOM refs ────────────────────────────────────────────────────────────────
const dropZone         = document.getElementById('dropZone');
const trailerInput     = document.getElementById('trailerInput');
const filePreview      = document.getElementById('filePreview');
const filePreviewName  = document.getElementById('filePreviewName');
const removeFileBtn    = document.getElementById('removeFile');
const analyzeBtn       = document.getElementById('analyzeBtn');
const processingOverlay = document.getElementById('processingOverlay');
const processingMsg    = document.getElementById('processingMsg');
const progressBar      = document.getElementById('progressBar');
const dbStatus         = document.getElementById('dbStatus');

let selectedFile = null;

// ── Health check ─────────────────────────────────────────────────────────────
(async () => {
  try {
    const res  = await fetch('/api/health');
    const data = await res.json();
    if (data.db_movies > 0) {
      dbStatus.textContent = `✔ Vector DB ready — ${data.db_movies.toLocaleString()} films indexed`;
      dbStatus.style.color = '#4ade80';
    } else {
      dbStatus.textContent = '⚠ Vector DB empty — run python ingest.py to index movies';
      dbStatus.style.color = '#fbbf24';
    }
  } catch {
    dbStatus.textContent = 'Could not reach backend';
  }
})();

// ── Drag-and-drop ─────────────────────────────────────────────────────────────
dropZone.addEventListener('dragover',  (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop',      (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});
dropZone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') trailerInput.click(); });
trailerInput.addEventListener('change', () => { if (trailerInput.files[0]) setFile(trailerInput.files[0]); });

// ── File selection helpers ────────────────────────────────────────────────────
function setFile(file) {
  const allowed = ['mp4', 'mov', 'avi', 'mkv'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) {
    alert('Unsupported file type. Please upload an MP4, MOV, AVI, or MKV.');
    return;
  }
  selectedFile = file;
  filePreviewName.textContent = `${file.name}  (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
  dropZone.classList.add('hidden');
  filePreview.classList.remove('hidden');
  analyzeBtn.disabled = false;
}

removeFileBtn.addEventListener('click', () => {
  selectedFile = null;
  trailerInput.value = '';
  filePreview.classList.add('hidden');
  dropZone.classList.remove('hidden');
  analyzeBtn.disabled = true;
});

// ── Submit ────────────────────────────────────────────────────────────────────
analyzeBtn.addEventListener('click', submitAnalysis);

async function submitAnalysis() {
  if (!selectedFile) return;
  showOverlay();

  const form = new FormData();
  form.append('trailer', selectedFile);

  // Collect manual tag selections (if any)
  document.querySelectorAll('input[name="genres[]"]:checked').forEach(cb => form.append('genres[]', cb.value));
  document.querySelectorAll('input[name="emotions[]"]:checked').forEach(cb => form.append('emotions[]', cb.value));

  try {
    const res  = await fetch('/api/analyze', { method: 'POST', body: form });
    const data = await res.json();

    if (!res.ok) {
      hideOverlay();
      alert(data.error || 'Analysis failed. Please try again.');
      return;
    }

    // Redirect to results page
    window.location.href = `/results/${data.analysis_id}`;

  } catch (err) {
    hideOverlay();
    alert('Network error — check that the Flask server is running.');
    console.error(err);
  }
}

// ── Processing overlay ────────────────────────────────────────────────────────
const STEPS = [
  { msg: 'Extracting genre and emotion tags…',       pct: 20 },
  { msg: 'Querying vector database…',                pct: 45 },
  { msg: 'Building audience profile…',               pct: 65 },
  { msg: 'Generating release strategy…',             pct: 85 },
  { msg: 'Saving results…',                          pct: 95 },
];

let stepTimer = null;

function showOverlay() {
  processingOverlay.classList.remove('hidden');
  analyzeBtn.disabled = true;
  let i = 0;
  const tick = () => {
    if (i < STEPS.length) {
      processingMsg.textContent = STEPS[i].msg;
      progressBar.style.width  = STEPS[i].pct + '%';
      i++;
      stepTimer = setTimeout(tick, 1800);
    }
  };
  tick();
}

function hideOverlay() {
  clearTimeout(stepTimer);
  processingOverlay.classList.add('hidden');
  analyzeBtn.disabled = false;
}
