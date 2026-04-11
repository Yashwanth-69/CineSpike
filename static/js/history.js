/**
 * history.js — CineSpike history page
 *
 * Fetches /api/history and renders a table of past analyses.
 * Frontend team: add columns or formatting here.
 */

'use strict';

const tbody         = document.getElementById('historyBody');
const historyTable  = document.getElementById('historyTable');
const historyEmpty  = document.getElementById('historyEmpty');
const historyLoading = document.getElementById('historyLoading');

(async () => {
  try {
    const res  = await fetch('/api/history');
    const rows = await res.json();

    historyLoading.classList.add('hidden');

    if (!rows.length) {
      historyEmpty.classList.remove('hidden');
      return;
    }

    rows.forEach((row, idx) => {
      const ts  = new Date(row.timestamp).toLocaleString();
      const tr  = document.createElement('tr');
      tr.innerHTML = `
        <td>${rows.length - idx}</td>
        <td>${escHtml(row.filename)}</td>
        <td>${escHtml(ts)}</td>
        <td>
          <a class="btn btn-outline" style="padding:.35rem .8rem;font-size:.8rem"
             href="/results/${escHtml(row.id)}">View</a>
          <button class="btn btn-icon delete-btn" data-id="${escHtml(row.id)}"
                  style="color:#f87171;margin-left:.4rem" title="Delete">🗑</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    historyTable.classList.remove('hidden');

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this analysis?')) return;
        const id  = btn.dataset.id;
        await fetch(`/api/analysis/${id}`, { method: 'DELETE' });
        btn.closest('tr').remove();
        if (!tbody.children.length) {
          historyTable.classList.add('hidden');
          historyEmpty.classList.remove('hidden');
        }
      });
    });

  } catch (err) {
    historyLoading.classList.add('hidden');
    historyEmpty.classList.remove('hidden');
    console.error(err);
  }
})();

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
