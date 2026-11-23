/* ==========================================================================
   GITHUB TELEMETRY — Integração Completa com a GitHub REST API v3
   Sincroniza Workflows, Todos os Repositórios Públicos (incluindo Forks) e Linguagens
   ========================================================================== */

const REPO_OWNER = 'Digooow';
const PAGES_REPO = 'Atividades-Senac-Joinville';
const WORKFLOW_FILE = 'deploy.yml';
const CACHE_TTL_MS = 15 * 60 * 1000;
const LANG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let apiRateLimited = false;

const LANGUAGE_COLORS = {
  'C#': '#178600',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'SCSS': '#c6538c',
  'Jupyter Notebook': '#DA5B0B',
  'SQL': '#e38c00',
  'TSQL': '#e38c00',
  'PLpgSQL': '#336790',
  'Shell': '#89e051',
  'PowerShell': '#012456',
  'Batchfile': '#C1F12E',
  'Dockerfile': '#384d54',
  'Java': '#b07219',
  'Kotlin': '#A97BFF',
  'C++': '#f34b7d',
  'C': '#555555',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
  'Dart': '#00B4AB',
  'Swift': '#F05138',
  'Vue': '#41b883',
  'Svelte': '#ff3e00',
  'Makefile': '#427819',
  'Lua': '#000080'
};

const FALLBACK_NARRATIVES = {
  'digooow.github.io': {
    title: 'O Próprio Reino (Portfólio & CI/CD)',
    badge: 'DevOps & Front-End',
    icon: 'fa-solid fa-wand-magic-sparkles',
    desc: 'A estrutura viva que você está navegando agora: animações em Canvas 2D, consumo assíncrono da API do GitHub e entrega contínua com Quality Gates e auditoria Lighthouse CI.',
    extraTags: ['HTML5', 'Tailwind CSS', 'ES Modules', 'GitHub Actions']
  },
  'digooow': {
    title: 'O Pergaminho de Apresentação (Profile)',
    badge: 'Config & Docs',
    icon: 'fa-solid fa-scroll',
    desc: 'Repositório especial que dá boas-vindas a quem visita o perfil principal no GitHub, reunindo estatísticas, stack tecnológica e atalhos da jornada.',
    extraTags: ['Markdown', 'GitHub Profile', 'Documentação']
  }
};

function createEl(tag, className = '', text = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function createIcon(className) {
  const icon = document.createElement('i');
  icon.className = className;
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function getCacheEntry(key, { allowStale = false, ttlMs = CACHE_TTL_MS } = {}) {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const isExpired = Date.now() - parsed.timestamp > ttlMs;
    if (isExpired && !allowStale) return null;
    return parsed;
  } catch (err) {
    console.debug('Cache read skipped:', err);
    return null;
  }
}

function getCachedData(key, options = {}) {
  const entry = getCacheEntry(key, options);
  return entry ? entry.data : null;
}

function setCachedData(key, data, extra = {}) {
  try {
    globalThis.localStorage?.setItem(
      key,
      JSON.stringify({ timestamp: Date.now(), data, ...extra })
    );
  } catch (err) {
    console.debug('Cache write skipped:', err);
  }
}

function checkRateLimit(response) {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  if (response.status === 403 || response.status === 429 || remaining === '0') {
    apiRateLimited = true;
  }
}

function formatDateBR(isoString) {
  if (!isoString) return 'Recente';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Recente';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatSize(sizeKb) {
  if (!sizeKb || sizeKb <= 0) return 'Código leve';
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${sizeKb} KB`;
}

function humanizeRepoName(name) {
  return name
    .replaceAll(/[-_]+/g, ' ')
    .replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildSingleLanguageFallback(fallbackLang) {
  if (!fallbackLang) return [];
  return [{
    name: fallbackLang,
    pct: 100,
    numericPct: 100,
    color: LANGUAGE_COLORS[fallbackLang] || '#10b981'
  }];
}

function computeLanguageBreakdown(bytesMap) {
  const entries = Object.entries(bytesMap);
  if (!entries.length) return [];

  const totalBytes = entries.reduce((acc, [, bytes]) => acc + bytes, 0);
  if (totalBytes <= 0) return [];

  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([lang, bytes]) => {
      const rawPct = (bytes / totalBytes) * 100;
      const pct = rawPct < 1 ? '<1' : Math.round(rawPct);
      return {
        name: lang,
        pct,
        numericPct: Math.max(2, Math.round(rawPct)),
        color: LANGUAGE_COLORS[lang] || '#10b981'
      };
    });
}

/**
 * Busca todas as linguagens de programação de um repositório (endpoint /languages)
 * usando cache inteligente vinculado ao pushed_at para economizar requisições.
 */
export async function fetchRepoLanguages(repoName, fallbackLang, pushedAt = '') {
  const cacheKey = `gh_repo_langs_${repoName.toLowerCase()}_v3`;
  const cachedEntry = getCacheEntry(cacheKey, { ttlMs: LANG_CACHE_TTL_MS });
  if (cachedEntry && (!pushedAt || cachedEntry.pushedAt === pushedAt)) {
    return cachedEntry.data;
  }

  if (apiRateLimited) {
    return cachedEntry ? cachedEntry.data : buildSingleLanguageFallback(fallbackLang);
  }

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${encodeURIComponent(repoName)}/languages`;
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    checkRateLimit(response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const bytesMap = await response.json();
    const breakdown = computeLanguageBreakdown(bytesMap);
    const result = breakdown.length > 0 ? breakdown : buildSingleLanguageFallback(fallbackLang);

    setCachedData(cacheKey, result, { pushedAt });
    return result;
  } catch (err) {
    console.debug(`Language fetch fallback for ${repoName}:`, err);
    const staleEntry = getCacheEntry(cacheKey, { allowStale: true });
    if (staleEntry && Array.isArray(staleEntry.data) && staleEntry.data.length > 0) {
      return staleEntry.data;
    }
    return buildSingleLanguageFallback(fallbackLang);
  }
}

/**
 * Busca a última execução do GitHub Actions para alimentar a Pipeline e o Terminal.
 */
export async function fetchLatestWorkflowRun() {
  const cacheKey = 'gh_pages_latest_run_v4';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${PAGES_REPO}/actions/workflows/${encodeURIComponent(WORKFLOW_FILE)}/runs?per_page=1`;
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    checkRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API HTTP ${response.status}`);
    }

    const json = await response.json();
    const run = json.workflow_runs?.[0];
    if (!run) return null;

    const started = new Date(run.run_started_at || run.created_at).getTime();
    const updated = new Date(run.updated_at || run.created_at).getTime();
    const durationSec = Math.max(12, Math.round((updated - started) / 1000));
    const fallbackConclusion = run.status === 'completed' ? 'success' : run.status;

    const summary = {
      runNumber: run.run_number,
      status: run.status,
      conclusion: run.conclusion || fallbackConclusion,
      shortSha: (run.head_sha || '').slice(0, 7),
      commitMsg: (run.display_title || 'Deploy automático').slice(0, 60),
      durationSec,
      updatedAt: run.updated_at,
      formattedDate: formatDateBR(run.updated_at),
      htmlUrl: run.html_url || `https://github.com/${REPO_OWNER}/${PAGES_REPO}/actions/workflows/${WORKFLOW_FILE}`
    };

    setCachedData(cacheKey, summary);
    return summary;
  } catch (err) {
    const stale = getCachedData(cacheKey, { allowStale: true });
    if (stale) return stale;
    throw err;
  }
}

/**
 * Busca os últimos commits reais do repositório para o comando `git log`.
 */
export async function fetchRecentCommits(limit = 5) {
  const cacheKey = `gh_pages_commits_${limit}_v4`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${PAGES_REPO}/commits?per_page=${limit}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    checkRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API HTTP ${response.status}`);
    }

    const commits = await response.json();
    const mapped = commits.map((c) => ({
      sha: (c.sha || '').slice(0, 7),
      author: c.commit?.author?.name || REPO_OWNER,
      date: formatDateBR(c.commit?.author?.date),
      message: (c.commit?.message || '').split('\n')[0].slice(0, 68)
    }));

    setCachedData(cacheKey, mapped);
    return mapped;
  } catch (err) {
    const stale = getCachedData(cacheKey, { allowStale: true });
    if (stale) return stale;
    throw err;
  }
}

/**
 * Busca todos os repositórios públicos do usuário no GitHub (incluindo forks),
 * com suporte a paginação e fallback para cache em caso de rate-limit.
 */
export async function fetchAllUserRepos() {
  const cacheKey = 'gh_user_repos_list_v4';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const allRaw = [];
    const maxPages = 5;

    for (let page = 1; page <= maxPages; page += 1) {
      const url = `https://api.github.com/users/${REPO_OWNER}/repos?type=owner&per_page=100&sort=updated&page=${page}`;
      const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      checkRateLimit(response);

      if (!response.ok) {
        throw new Error(`GitHub API HTTP ${response.status}`);
      }

      const batch = await response.json();
      if (!Array.isArray(batch) || batch.length === 0) break;

      allRaw.push(...batch);
      if (batch.length < 100) break;
    }

    const list = allRaw.map((r) => ({
      name: r.name,
      lowerName: r.name.toLowerCase(),
      description: r.description || '',
      htmlUrl: r.html_url,
      homepage: r.homepage || '',
      language: r.language || '',
      topics: Array.isArray(r.topics) ? r.topics : [],
      size: formatSize(r.size),
      stars: r.stargazers_count || 0,
      forksCount: r.forks_count || 0,
      isFork: Boolean(r.fork),
      archived: Boolean(r.archived),
      updatedAt: formatDateBR(r.pushed_at || r.updated_at),
      pushedAtRaw: r.pushed_at || r.updated_at || '',
      defaultBranch: r.default_branch || 'main'
    }));

    setCachedData(cacheKey, list);
    return list;
  } catch (err) {
    const stale = getCachedData(cacheKey, { allowStale: true });
    if (stale) return stale;
    throw err;
  }
}

function appendMissingLanguageBadges(badgesContainer, langBreakdown) {
  if (!badgesContainer || langBreakdown.length === 0) return;

  const existingBadges = new Set(
    Array.from(badgesContainer.querySelectorAll('.badge-tag'))
      .map((el) => el.textContent.trim().toLowerCase())
  );

  for (const item of langBreakdown.slice(0, 6)) {
    const key = item.name.toLowerCase();
    if (!existingBadges.has(key)) {
      badgesContainer.appendChild(createEl('span', 'badge-tag', item.name));
      existingBadges.add(key);
    }
  }
}

function createLanguageProgressBar(langBreakdown) {
  const bar = createEl('div', 'w-full h-1.5 rounded-full bg-black/50 overflow-hidden flex mb-2');
  bar.setAttribute('role', 'img');
  bar.setAttribute('aria-label', 'Proporção de linguagens do repositório');

  for (const lang of langBreakdown) {
    const segment = document.createElement('div');
    segment.style.width = `${Number(lang.numericPct) || 2}%`;
    segment.style.backgroundColor = lang.color;
    segment.title = `${lang.name}: ${lang.pct}%`;
    bar.appendChild(segment);
  }
  return bar;
}

function appendLanguageLabels(row, repoMeta, langBreakdown) {
  const visibleLangs = langBreakdown.slice(0, 6);
  if (visibleLangs.length === 0) {
    row.appendChild(createEl('span', 'text-emerald-300', repoMeta.language || 'Multi-stack'));
    return;
  }

  visibleLangs.forEach((lang, index) => {
    if (index > 0) {
      row.appendChild(createEl('span', 'text-slate-600', '•'));
    }
    const item = createEl('span', 'inline-flex items-center gap-1 text-slate-200');
    const dot = createEl('span', 'w-2 h-2 rounded-full');
    dot.style.backgroundColor = lang.color;
    item.append(dot, createEl('span', '', lang.name), createEl('span', 'text-slate-400', `${lang.pct}%`));
    row.appendChild(item);
  });

  const hiddenCount = Math.max(0, langBreakdown.length - visibleLangs.length);
  if (hiddenCount > 0) {
    row.appendChild(createEl('span', 'text-slate-400', `+${hiddenCount}`));
  }
}

function hydrateCardWithLanguages(card, repoMeta, langBreakdown) {
  card.setAttribute('data-repo-type', repoMeta.isFork ? 'fork' : 'source');
  appendMissingLanguageBadges(card.querySelector('.repo-badges'), langBreakdown);

  const slot = card.querySelector('.repo-telemetry');
  if (!slot) return;

  const wrapper = createEl('div', 'w-full');
  if (langBreakdown.length > 0) {
    wrapper.appendChild(createLanguageProgressBar(langBreakdown));
  }

  const row = createEl('div', 'flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]');
  if (repoMeta.isFork) {
    const forkTag = createEl('span', 'text-amber-300/90 inline-flex items-center gap-1');
    forkTag.append(createIcon('fa-solid fa-code-fork text-[10px]'), document.createTextNode(' Fork'));
    row.append(forkTag, createEl('span', 'text-slate-500', '•'));
  }

  appendLanguageLabels(row, repoMeta, langBreakdown);
  row.append(
    createEl('span', 'text-slate-500', '•'),
    createEl('span', 'text-slate-400', repoMeta.size),
    createEl('span', 'text-slate-500', '•'),
    createEl('span', 'text-amber-200/80', `Push: ${repoMeta.updatedAt}`)
  );

  wrapper.appendChild(row);
  slot.replaceChildren(wrapper);
}

function resolveCardAppearance(repoMeta, custom) {
  const isFork = Boolean(repoMeta.isFork);

  let iconClass = isFork ? 'fa-solid fa-code-fork' : 'fa-solid fa-code-branch';
  if (custom?.icon) iconClass = custom.icon;

  let badgeText = repoMeta.language || 'Repositório';
  if (isFork) badgeText = 'Fork';
  if (custom?.badge) badgeText = custom.badge;

  const fallbackDesc = isFork
    ? `Repositório bifurcado (fork) explorado para estudo de arquitetura, testes e contribuição no ecossistema de ${repoMeta.name}.`
    : `Missão registrada nos arquivos do GitHub: código-fonte, experimentos práticos e evolução contínua no repositório ${repoMeta.name}.`;

  return {
    isFork,
    title: custom ? custom.title : humanizeRepoName(repoMeta.name),
    iconClass,
    iconContainerClass: isFork
      ? 'bg-amber-500/15 border-amber-300/35 text-amber-300'
      : 'bg-emerald-500/20 border-emerald-300/30 text-emerald-300',
    badgeText,
    badgeClass: isFork
      ? 'bg-amber-950/60 border-amber-400/35 text-amber-300'
      : 'bg-emerald-950/60 border-emerald-400/30 text-emerald-300',
    description: repoMeta.description || custom?.desc || fallbackDesc
  };
}

function buildInitialTags(repoMeta, custom) {
  const tags = [];
  if (repoMeta.language) tags.push(repoMeta.language);

  for (const tag of custom?.extraTags ?? []) {
    if (!tags.includes(tag)) tags.push(tag);
  }
  for (const topic of repoMeta.topics?.slice(0, 3) ?? []) {
    if (!tags.includes(topic)) tags.push(topic);
  }
  return tags;
}

function createDynamicRepoCard(repoMeta) {
  const custom = FALLBACK_NARRATIVES[repoMeta.lowerName];
  const appearance = resolveCardAppearance(repoMeta, custom);
  const initialTags = buildInitialTags(repoMeta, custom);

  const card = createEl(
    'div',
    'md:col-span-1 lg:col-span-2 kama-card p-6 rounded-2xl flex flex-col justify-between group'
  );
  card.setAttribute('data-repo', repoMeta.name);
  card.setAttribute('data-repo-type', appearance.isFork ? 'fork' : 'source');

  const header = createEl('div', 'flex justify-between items-start gap-2 mb-4');
  const iconBox = createEl(
    'div',
    `w-10 h-10 rounded-lg border flex items-center justify-center text-xl group-hover:scale-110 transition-transform ${appearance.iconContainerClass}`
  );
  iconBox.appendChild(createIcon(appearance.iconClass));

  const badgeWrap = createEl('div', 'flex flex-wrap items-center justify-end gap-1.5');
  const badge = createEl(
    'span',
    `px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border inline-flex items-center gap-1 ${appearance.badgeClass}`
  );
  if (appearance.isFork) {
    badge.append(createIcon('fa-solid fa-code-fork text-[10px]'), document.createTextNode(' '));
  }
  badge.appendChild(document.createTextNode(appearance.badgeText));
  badgeWrap.appendChild(badge);
  header.append(iconBox, badgeWrap);

  const heading = createEl(
    'h3',
    'font-cinzel font-bold text-lg text-white group-hover:text-amber-200 transition-colors mb-2',
    appearance.title
  );
  const desc = createEl('p', 'text-slate-300 text-xs leading-relaxed mb-4', appearance.description);
  const badgesContainer = createEl('div', 'repo-badges flex flex-wrap gap-1.5 mb-4');
  for (const tag of initialTags) {
    badgesContainer.appendChild(createEl('span', 'badge-tag', tag));
  }

  const topSection = document.createElement('div');
  topSection.append(header, heading, desc, badgesContainer);

  const footer = createEl('div', 'pt-3 border-t border-emerald-500/15 flex flex-col gap-2.5');
  const telemetry = createEl('div', 'repo-telemetry flex items-center gap-1.5 font-mono text-[10px] text-slate-400');
  telemetry.append(
    createEl(
      'span',
      appearance.isFork ? 'text-amber-300' : 'text-emerald-300',
      repoMeta.language || 'Multi-stack'
    ),
    createEl('span', '', '•'),
    createEl('span', '', repoMeta.size)
  );

  const actionLink = createEl('a', 'card-action-link text-xs');
  actionLink.href = repoMeta.htmlUrl;
  actionLink.target = '_blank';
  actionLink.rel = 'noopener noreferrer';
  const actionLabel = appearance.isFork ? 'Acessar Fork' : 'Acessar Repositório';
  actionLink.append(
    createEl('span', '', `${actionLabel} (${repoMeta.name})`),
    createIcon('fa-solid fa-arrow-up-right-from-square text-[10px] ml-1.5')
  );

  footer.append(telemetry, actionLink);
  card.append(topSection, footer);
  return card;
}

function initRepoFilters(cards) {
  const filterBar = document.getElementById('repo-filters');
  if (!filterBar || !cards.length) return;

  const totalCount = cards.length;
  const forkCount = cards.filter((c) => c.getAttribute('data-repo-type') === 'fork').length;
  const sourceCount = totalCount - forkCount;

  const allEl = document.getElementById('filter-count-all');
  const sourceEl = document.getElementById('filter-count-source');
  const forkEl = document.getElementById('filter-count-fork');

  if (allEl) allEl.textContent = `(${totalCount})`;
  if (sourceEl) sourceEl.textContent = `(${sourceCount})`;
  if (forkEl) forkEl.textContent = `(${forkCount})`;

  filterBar.classList.remove('hidden');
  filterBar.classList.add('flex');

  const buttons = Array.from(filterBar.querySelectorAll('button[data-filter]'));
  const emptyState = document.getElementById('repos-empty-state');

  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-filter');

      for (const other of buttons) {
        const isSelected = other === btn;
        other.classList.toggle('active', isSelected);
        other.setAttribute('aria-pressed', String(isSelected));
      }

      let visible = 0;
      for (const card of cards) {
        const type = card.getAttribute('data-repo-type') || 'source';
        const show = target === 'all' || type === target;
        card.classList.toggle('hidden', !show);
        if (show) visible += 1;
      }

      if (emptyState) {
        emptyState.classList.toggle('hidden', visible > 0);
      }
    });
  }
}

async function hydrateAllCardsInBatches(cards, repoMap, batchSize = 4) {
  for (let i = 0; i < cards.length; i += batchSize) {
    const chunk = cards.slice(i, i + batchSize);
    await Promise.allSettled(
      chunk.map(async (card) => {
        const repoAttr = (card.getAttribute('data-repo') || '').toLowerCase();
        const meta = repoMap.get(repoAttr);
        if (!meta) return;

        const langBreakdown = await fetchRepoLanguages(meta.name, meta.language, meta.pushedAtRaw);
        hydrateCardWithLanguages(card, meta, langBreakdown);
      })
    );
  }
}

function applyWorkflowTelemetry(run) {
  if (!run) return;

  const shaEl = document.getElementById('pipeline-live-sha');
  const statusEl = document.getElementById('pipeline-live-status');
  const timeEl = document.getElementById('pipeline-live-time');
  const linkEl = document.getElementById('pipeline-live-link');
  const navBadgeEl = document.getElementById('nav-ci-text');

  if (shaEl && run.shortSha) {
    shaEl.textContent = `Run #${run.runNumber} • commit ${run.shortSha}`;
  }
  if (timeEl) {
    timeEl.textContent = `${run.durationSec}s • ${run.formattedDate}`;
  }
  if (statusEl) {
    const isOk = run.conclusion === 'success' || run.status === 'in_progress';
    const icon = createIcon(isOk ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info');
    const text = isOk
      ? ' Quality Gate & Deploy: Verified'
      : ` Status: ${run.conclusion}`;
    statusEl.replaceChildren(icon, document.createTextNode(text));
  }
  if (linkEl && run.htmlUrl) {
    linkEl.href = run.htmlUrl;
  }
  if (navBadgeEl && run.shortSha) {
    navBadgeEl.textContent = `Build #${run.runNumber} (${run.shortSha}) • OK`;
  }
}

async function syncPipelineTelemetry() {
  try {
    const run = await fetchLatestWorkflowRun();
    applyWorkflowTelemetry(run);
  } catch (err) {
    console.debug('Pipeline telemetry offline fallback active:', err);
  }
}

async function syncRepositoriesGrid() {
  try {
    const allRepos = await fetchAllUserRepos();
    const repoMap = new Map(allRepos.map((repo) => [repo.lowerName, repo]));

    const forkCount = allRepos.filter((r) => r.isFork).length;
    const sourceCount = allRepos.length - forkCount;
    const countBadge = document.getElementById('repos-total-count');
    if (countBadge && allRepos.length > 0) {
      countBadge.textContent = forkCount > 0
        ? `${allRepos.length} Repositórios Públicos (${sourceCount} Autorais • ${forkCount} Forks)`
        : `${allRepos.length} Repositórios Públicos Sincronizados`;
    }

    const grid = document.getElementById('bento-repos-grid');
    const existingCards = Array.from(document.querySelectorAll('[data-repo]'));
    const renderedRepoNames = new Set(
      existingCards.map((c) => (c.getAttribute('data-repo') || '').toLowerCase())
    );

    for (const card of existingCards) {
      const meta = repoMap.get((card.getAttribute('data-repo') || '').toLowerCase());
      if (meta) {
        card.setAttribute('data-repo-type', meta.isFork ? 'fork' : 'source');
      }
    }

    const pendingRepos = allRepos
      .filter((r) => !renderedRepoNames.has(r.lowerName))
      .sort((a, b) => Number(a.isFork) - Number(b.isFork));

    if (grid) {
      for (const repoMeta of pendingRepos) {
        const newCard = createDynamicRepoCard(repoMeta);
        grid.appendChild(newCard);
        existingCards.push(newCard);
        renderedRepoNames.add(repoMeta.lowerName);
      }
    }

    initRepoFilters(existingCards);
    await hydrateAllCardsInBatches(existingCards, repoMap, 4);
  } catch (err) {
    console.debug('Repository telemetry offline fallback active:', err);
  }
}

/**
 * Inicializa toda a telemetria do GitHub na página.
 */
export async function initGitHubTelemetry() {
  await Promise.all([syncPipelineTelemetry(), syncRepositoriesGrid()]);
}
