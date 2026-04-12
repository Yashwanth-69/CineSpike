/**
 * results.js — CineSpike results page
 *
 * Fetches /api/results/<id> and renders all four sections:
 *   1. Tags (badges + confidence chart)
 *   2. Top 10 Similar Movies (card grid)
 *   3. Audience Profile (subreddits, demographics, posts, box office)
 *   4. Release Strategy (recommendation, reasoning, charts, comparable table)
 *
 * Frontend team:
 *  - To change what data is displayed, edit the render* functions below.
 *  - To change how it looks, edit static/css/style.css.
 *  - The analysis ID is injected by Flask as window.CINESPIKE_ANALYSIS_ID.
 */

'use strict';

// ── Boot ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const res = await fetch(`/api/results/${window.CINESPIKE_ANALYSIS_ID}`);
    if (!res.ok) throw new Error((await res.json()).error || 'Not found');
    const data = await res.json();
    renderAll(data);
  } catch (err) {
    show('errorState');
    document.getElementById('errorMsg').textContent = `Error: ${err.message}`;
  } finally {
    hide('loadingState');
  }
})();

// ── Master render ─────────────────────────────────────────────────────────────
function renderAll(data) {
  renderMeta(data);
  renderTags(data.tags);
  renderMovies(data.top_movies);
  renderAudience(data.audience);
  renderRelease(data.release_plan);
  if (data.campaign) renderCampaign(data.campaign);
  show('resultsContainer');
}

// ── Section 0: Meta banner ────────────────────────────────────────────────────
function renderMeta({ filename, timestamp }) {
  set('metaFilename', filename);
  set('metaTimestamp', new Date(timestamp).toLocaleString());
}

// ── Section 1: Tags ───────────────────────────────────────────────────────────
function renderTags(tags) {
  if (!tags) return;

  // Method badge
  const methodEl = document.getElementById('tagMethod');
  if (methodEl) {
    methodEl.textContent = tags.method || 'manual';
    methodEl.style.display = 'inline';
  }

  // Genre badges
  renderBadges('genreBadges',   (tags.genres   || []), 'badge-genre');
  renderBadges('emotionBadges', (tags.emotions || []), 'badge-emotion');
  renderBadges('keywordBadges', (tags.keywords || []), 'badge-keyword');

  // Confidence chart (genres)
  const scores = tags.confidence_scores || {};
  const genreScores = scores.genres || {};
  if (Object.keys(genreScores).length) {
    const labels = Object.keys(genreScores);
    const values = Object.values(genreScores);
    makeBarChart('confidenceChart', labels, values, 'Confidence (%)', '#e94560');
  } else {
    hide('confidenceChartCard');
  }
}

// ── Section 2: Movies ─────────────────────────────────────────────────────────
function renderMovies(movies) {
  const grid = document.getElementById('moviesGrid');
  if (!grid || !movies?.length) return;

  movies.forEach((movie, idx) => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img class="movie-poster"
           src="${esc(movie.poster_url || '')}"
           alt="${esc(movie.title)} poster"
           loading="lazy"
           onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent((movie.title||'?').slice(0,2))}&size=300&background=15151f&color=e94560&bold=true&format=png'" />
      <div class="movie-info">
        <p class="movie-rank">#${idx + 1} match</p>
        <p class="movie-title">${esc(movie.title)}</p>
        <p class="movie-meta">${esc(movie.year || '')} &bull; ⭐ ${movie.vote_average || '??'}</p>
        <p class="movie-meta" style="margin-top:.2rem;font-size:.72rem">${esc(movie.genres || '')}</p>
        <span class="movie-score">${movie.similarity_score}% match</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── Section 3: Audience ───────────────────────────────────────────────────────
function renderAudience(audience) {
  if (!audience) return;

  // Subreddit lists
  renderSubredditList('primarySubs',   audience.primary_subreddits   || []);
  renderSubredditList('secondarySubs', audience.secondary_subreddits || []);

  // Demographics
  const demo = audience.demographics || {};
  set('demoAge', demo.age_range || '—');

  if (demo.gender_split) {
    const gLabels = Object.keys(demo.gender_split);
    const gValues = Object.values(demo.gender_split);
    makeDoughnutChart('genderChart', gLabels, gValues, ['#e94560', '#a855f7', '#3b82f6']);
  }

  // Box office
  const bo = audience.box_office_estimate || {};
  const boEl = document.getElementById('boRange');
  if (boEl) {
    boEl.innerHTML = `
      <div>Low:  <strong>$${fmtMoney(bo.low)}</strong></div>
      <div>Mid:  <strong>$${fmtMoney(bo.mid)}</strong></div>
      <div>High: <span class="bo-high">$${fmtMoney(bo.high)}</span></div>
    `;
  }

  // Marketing channels
  const mList = document.getElementById('marketingList');
  if (mList && audience.marketing_recommendations?.length) {
    audience.marketing_recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="platform-name">${esc(rec.platform)}</span>
                      <span class="hint">${esc(rec.strategy)}</span>`;
      mList.appendChild(li);
    });
  }

  // Sample posts
  const postsList = document.getElementById('postsList');
  if (postsList && audience.sample_posts?.length) {
    audience.sample_posts.forEach(post => {
      const div = document.createElement('div');
      div.className = 'post-item';
      div.innerHTML = `
        <div class="post-sub">${esc(post.subreddit)}</div>
        <div class="post-title">${esc(post.title)}</div>
        <div class="post-stats">▲ ${post.upvotes?.toLocaleString()} &bull; 💬 ${post.comments} comments</div>
      `;
      postsList.appendChild(div);
    });
  }

  // Total addressable audience
  set('totalAudience', (audience.total_addressable_audience || 0).toLocaleString());
}

// ── Section 4: Release ────────────────────────────────────────────────────────
function renderRelease(plan) {
  if (!plan) return;

  set('releaseMonth',   plan.recommended_month_name || '—');
  set('releaseQuarter', plan.recommended_quarter    || '');
  set('releaseSeason',  plan.season_label           || '');
  set('releaseReasoning', plan.reasoning            || 'No reasoning available.');

  // Method badge
  const methodEl = document.getElementById('releasePlannerMethod');
  if (methodEl) methodEl.textContent = plan.method === 'groq_llm' ? '🤖 Groq LLM' : '📐 Rule-based';

  // Avoid months badges
  renderBadges('avoidMonths', plan.avoid_months || [], 'badge-neutral');

  // Monthly distribution chart
  const dist = plan.monthly_distribution || {};
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthValues = Object.values(dist);
  const bgColors    = monthLabels.map((_, i) => {
    const m = i + 1;
    return m === plan.recommended_month ? '#e94560' : 'rgba(168,85,247,0.35)';
  });
  makeBarChartColored('releaseChart', monthLabels, monthValues, bgColors, 'Similar Films Released');

  // Comparable releases table
  const tbody = document.getElementById('comparableBody');
  if (tbody && plan.comparable_releases?.length) {
    plan.comparable_releases.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${esc(r.title)}</td>
        <td>${esc(r.date)}</td>
        <td>${r.revenue ? '$' + fmtMoney(r.revenue) : '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// ── Chart helpers ─────────────────────────────────────────────────────────────
function makeBarChart(canvasId, labels, values, label, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data: values, backgroundColor: color + '99', borderColor: color, borderWidth: 1, borderRadius: 6 }],
    },
    options: {
      responsive: true,
      plugins:    { legend: { display: false } },
      scales:     {
        x: { ticks: { color: '#8888aa', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#8888aa' },                      grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
      },
    },
  });
}

function makeBarChartColored(canvasId, labels, values, bgColors, label) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data: values, backgroundColor: bgColors, borderRadius: 6 }],
    },
    options: {
      responsive: true,
      plugins:    { legend: { display: false } },
      scales:     {
        x: { ticks: { color: '#8888aa', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#8888aa' },                      grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true, stepSize: 1 },
      },
    },
  });
}

function makeDoughnutChart(canvasId, labels, values, colors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#8888aa', boxWidth: 12, padding: 12 } },
      },
    },
  });
}

// ── DOM utilities ─────────────────────────────────────────────────────────────
function renderBadges(containerId, items, cls) {
  const el = document.getElementById(containerId);
  if (!el) return;
  items.forEach(item => {
    const span = document.createElement('span');
    span.className = `badge ${cls}`;
    span.textContent = item;
    el.appendChild(span);
  });
}

function renderSubredditList(containerId, subs) {
  const ul = document.getElementById(containerId);
  if (!ul) return;
  subs.forEach(sub => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <div class="sub-name">${esc(sub.name)}</div>
        <div class="sub-meta">${(sub.subscribers || 0).toLocaleString()} subscribers</div>
      </div>
      <span class="rel-score">⬆ ${sub.relevance}%</span>
    `;
    ul.appendChild(li);
  });
}

function set(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function show(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hide(id) { document.getElementById(id)?.classList.add('hidden'); }

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmtMoney(n) {
  if (!n) return '0';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  return n.toLocaleString();
}

// ── Section 5: AI Campaign (Groq) ────────────────────────────────────────────
const btnGenerateCampaign = document.getElementById('btnGenerateCampaign');
if (btnGenerateCampaign) {
  btnGenerateCampaign.addEventListener('click', async () => {
    const label = document.getElementById('btnGenerateCampaignLabel');
    label.textContent = 'Generating strategy...';
    btnGenerateCampaign.disabled = true;

    try {
      const res = await fetch(`/api/generate_campaign/${window.CINESPIKE_ANALYSIS_ID}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      
      renderCampaign(data);
    } catch (err) {
      alert(err.message);
      label.textContent = 'Generate AI Strategy';
      btnGenerateCampaign.disabled = false;
    }
  });
}

function renderCampaign(campaign) {
  if (!campaign) return;
  
  // Hide generate button & show result container
  hide('btnGenerateCampaign');
  show('campaignContainer');

  set('campaignOverview', campaign.overview || '');
  set('campaignReleaseAnalysis', campaign.release_analysis || '');
  set('campaignGuerrilla', campaign.guerrilla_marketing || '');

  const phasesGrid = document.getElementById('campaignPhasesGrid');
  if (phasesGrid && campaign.phases) {
    phasesGrid.innerHTML = '';
    campaign.phases.forEach((phase) => {
      const card = document.createElement('div');
      card.className = 'card';
      const tacticsHtml = (phase.tactics || []).map(t => `<li style="margin-bottom:0.5rem;font-size:0.92rem;color:var(--clr-text-muted)">• ${esc(t)}</li>`).join('');
      
      card.innerHTML = `
        <h3 class="card-subheading">${esc(phase.name)}</h3>
        <ul style="list-style:none;padding:0">${tacticsHtml}</ul>
      `;
      phasesGrid.appendChild(card);
    });
  }
}
