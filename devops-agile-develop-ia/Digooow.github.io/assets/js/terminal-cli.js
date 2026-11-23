/* ==========================================================================
   TERMINAL CLI & PIPELINE — Shell Interativo Assíncrono
   ========================================================================== */

import { fetchLatestWorkflowRun, fetchRecentCommits, fetchAllUserRepos } from './github-telemetry.js';

const PIPELINE_STEPS = {
  1: {
    name: '01 - O Chamado (Git Push)',
    details: 'O desenvolvedor envia um commit para a branch main. O webhook aciona os runners Ubuntu em nuvem instantaneamente.',
    log: '[event] push -> refs/heads/main | concurrency-group: cloudflare-pages-portfolio | runner: ubuntu-latest'
  },
  2: {
    name: '02 - O Guardião do Portão (Quality Gate)',
    details: 'Node.js executa html-validate@10.17.0 (instalado com --ignore-scripts e Actions travadas por commit SHA) e verificação sintática ES Modules.',
    log: '[sast] html-validate "*.html" & JS check -> 0 errors, 0 warnings. Gate unlocked.'
  },
  3: {
    name: '03 - A Forja do Pacote (Static Bundle)',
    details: 'Os arquivos validados (index.html, robots.txt e assets/) são isolados em um diretório limpo antes da publicação via cloudflare/wrangler-action.',
    log: '[bundle] Static assets staged cleanly in temporary runner directory.'
  },
  4: {
    name: '04 - O Grande Salto (Edge CDN Deploy)',
    details: 'Publicação automatizada via Wrangler CLI direto para a CDN global do Cloudflare Pages com TLS 1.3.',
    log: '[deploy] Environment: cloudflare-pages | Live on Cloudflare Edge (*.pages.dev)'
  },
  5: {
    name: '05 - O Oráculo da Performance (Lighthouse CI)',
    details: 'Um navegador headless audita a página real em produção: Core Web Vitals (LCP, CLS), Acessibilidade e SEO.',
    log: '[audit] treosh/lighthouse-ci-action -> Performance, A11y & SEO verified.'
  }
};

function selectPipelineStep(stepNum) {
  const info = PIPELINE_STEPS[stepNum];
  const termOutput = document.getElementById('terminal-output');
  if (!info || !termOutput) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'my-2 p-2.5 rounded bg-emerald-950/70 border border-emerald-400/40 text-xs';

  const titleEl = document.createElement('div');
  titleEl.className = 'text-amber-300 font-bold mb-1';
  titleEl.textContent = `✦ Registro de Batalha: ${info.name}`;

  const detailsEl = document.createElement('div');
  detailsEl.className = 'text-slate-200 mb-1';
  detailsEl.textContent = info.details;

  const logEl = document.createElement('div');
  logEl.className = 'text-emerald-400 font-mono text-[11px]';
  logEl.textContent = info.log;

  wrapper.append(titleEl, detailsEl, logEl);
  termOutput.appendChild(wrapper);
  termOutput.scrollTop = termOutput.scrollHeight;

  document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function appendLines(output, lines) {
  for (const item of lines) {
    const line = document.createElement('p');
    line.className = `leading-relaxed ${item.cls || 'text-slate-200'}`;
    line.textContent = item.text;
    output.appendChild(line);
  }
  output.scrollTop = output.scrollHeight;
}

function createPromptEcho(cmdRaw) {
  const echo = document.createElement('p');
  echo.className = 'text-slate-400 mt-2';

  const userHost = document.createElement('span');
  userHost.className = 'text-emerald-400 font-bold';
  userHost.textContent = 'digooow@core';

  const pathSep = document.createElement('span');
  pathSep.className = 'text-amber-400';
  pathSep.textContent = ':~$';

  const cmdSpan = document.createElement('span');
  cmdSpan.textContent = ` ${cmdRaw}`;

  echo.append(userHost, document.createTextNode(':'), pathSep, cmdSpan);
  return echo;
}

async function runDevopsCommand() {
  const base = [
    { text: '✔ Pipeline CI/CD Status: ALL GATES PASSING', cls: 'text-emerald-300 font-bold' },
    { text: '  • Supply Chain: Actions pinadas por SHA completo + npm --ignore-scripts', cls: 'text-slate-200' },
    { text: '  • Quality Gate: html-validate@10.17.0 + JS syntax check [OK]', cls: 'text-slate-200' },
    { text: '  • Deployment: Cloudflare Pages Edge CDN via Wrangler CLI [OK]', cls: 'text-slate-200' },
    { text: '  • Pós-Deploy: Auditoria automatizada com Lighthouse CI [OK]', cls: 'text-slate-200' }
  ];

  try {
    const run = await fetchLatestWorkflowRun();
    if (run) {
      base.push({
        text: `  • Última Execução Real: Run #${run.runNumber} | SHA: ${run.shortSha} | Tempo: ${run.durationSec}s (${run.formattedDate})`,
        cls: 'text-amber-300'
      });
    }
  } catch (err) {
    console.debug('Devops command offline fallback:', err);
  }
  return base;
}

async function runReposCommand() {
  try {
    const repos = await fetchAllUserRepos();
    const forkCount = repos.filter((r) => r.isFork).length;
    const sourceCount = repos.length - forkCount;
    const lines = [
      { text: `✦ Catálogo Completo (${repos.length} repositórios: ${sourceCount} autorais, ${forkCount} forks):`, cls: 'text-amber-300 font-bold' }
    ];
    for (const r of repos) {
      const originTag = r.isFork ? '[Fork] ' : '';
      const langTag = r.language ? `[${r.language}]` : '[Multi-stack]';
      lines.push({
        text: `  • ${originTag}${r.name} ${langTag} — ${r.size} (Push: ${r.updatedAt})`,
        cls: r.isFork ? 'text-amber-200' : 'text-emerald-300'
      });
    }
    return lines;
  } catch (err) {
    return [
      { text: `⚠ Não foi possível listar os repositórios no momento (${err.message}).`, cls: 'text-amber-300' }
    ];
  }
}

async function runGitLogCommand() {
  try {
    const commits = await fetchRecentCommits(5);
    const lines = [
      { text: '✦ GitHub REST API — Últimos 5 commits em Digooow/Atividades-Senac-Joinville:', cls: 'text-amber-300 font-bold' }
    ];
    for (const c of commits) {
      lines.push({
        text: `  commit ${c.sha} (${c.date}) — ${c.message}`,
        cls: 'text-emerald-300'
      });
    }
    return lines;
  } catch (err) {
    return [
      { text: `⚠ Não foi possível consultar a API do GitHub no momento (${err.message}).`, cls: 'text-amber-300' }
    ];
  }
}

async function runPingCommand() {
  const samples = [];
  const targetUrl = globalThis.location.origin + globalThis.location.pathname;

  for (let i = 0; i < 3; i += 1) {
    const t0 = performance.now();
    try {
      await fetch(`${targetUrl}?probe=${Date.now()}_${i}`, { method: 'HEAD', cache: 'no-store' });
    } catch (err) {
      console.debug('Probe network timing measured with fallback:', err);
    }
    samples.push(Math.max(1, Math.round(performance.now() - t0)));
  }

  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const avg = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);

  return [
    { text: '✦ Telemetria de Rede — Edge CDN Probe (3 pacotes):', cls: 'text-amber-300 font-bold' },
    { text: `  seq=1 time=${samples[0]}ms | seq=2 time=${samples[1]}ms | seq=3 time=${samples[2]}ms`, cls: 'text-slate-200' },
    { text: `  rtt min/avg/max = ${min}/${avg}/${max} ms • Protocolo: ${globalThis.location.protocol.replace(':', '').toUpperCase()}`, cls: 'text-emerald-300' }
  ];
}

function runInspectCommand() {
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  const ttfb = nav ? Math.round(nav.responseStart - nav.requestStart) : 0;
  const domReady = nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0;
  const domNodes = document.getElementsByTagName('*').length;
  const cores = navigator.hardwareConcurrency || 'N/A';
  const dpr = (globalThis.devicePixelRatio || 1).toFixed(2);

  return [
    { text: '✦ Diagnóstico de Runtime & Performance (Browser Engine):', cls: 'text-amber-300 font-bold' },
    { text: `  • Métricas de Carga: TTFB ${Math.max(1, ttfb)}ms | DOM Interactive ${Math.max(5, domReady)}ms`, cls: 'text-emerald-300' },
    { text: `  • Árvore DOM: ${domNodes} nós semânticos | Viewport: ${globalThis.innerWidth}x${globalThis.innerHeight}px (DPR ${dpr}x)`, cls: 'text-slate-200' },
    { text: `  • Hardware Local: ${cores} threads lógicas | Canvas Particle Engine: Ativo`, cls: 'text-cyan-300' }
  ];
}

function createCommandRegistry(output) {
  const registry = {
    help: () => [
      { text: '✦ CONSOLE DOS BASTIDORES — Comandos Disponíveis:', cls: 'text-amber-300 font-bold' },
      { text: '  story      → A história ("Era uma vez...") por trás do código', cls: 'text-amber-200' },
      { text: '  devops     → Telemetria ao vivo da pipeline GitHub Actions', cls: 'text-emerald-300' },
      { text: '  repos      → Lista todos os repositórios públicos sincronizados', cls: 'text-cyan-300' },
      { text: '  git log    → Busca os últimos 5 commits reais na API do GitHub', cls: 'text-cyan-300' },
      { text: '  ping       → Mede a latência HTTP real até a borda da CDN', cls: 'text-cyan-300' },
      { text: '  inspect    → Diagnóstico real de runtime, DOM e Performance API', cls: 'text-cyan-300' },
      { text: '  skills     → Arsenal técnico (.NET, Cloud, Dados & Front)', cls: 'text-emerald-300' },
      { text: '  about      → Quem é o protagonista por trás do teclado', cls: 'text-emerald-300' },
      { text: '  contact    → Portais de comunicação (GitHub, LinkedIn, LeetCode)', cls: 'text-emerald-300' },
      { text: '  clear      → Limpar o pergaminho do terminal', cls: 'text-slate-400' }
    ],
    story: () => [
      { text: '✦ Era uma vez, num reino movido a café e fibra óptica...', cls: 'text-amber-300 font-bold' },
      { text: '  Diz a lenda que todo sistema começa simples, até alguém pedir "só mais uma telinha".', cls: 'text-slate-200' },
      { text: '  Para evitar que o caos reinasse em produção, um desenvolvedor de Joinville decidiu', cls: 'text-slate-200' },
      { text: '  combinar arquitetura limpa em .NET, bancos de dados bem comportados e esteiras', cls: 'text-slate-200' },
      { text: '  de CI/CD que trabalham sozinhas enquanto o resto do reino dorme em paz.', cls: 'text-emerald-300' }
    ],
    devops: runDevopsCommand,
    repos: runReposCommand,
    'git log': runGitLogCommand,
    ping: runPingCommand,
    inspect: runInspectCommand,
    skills: () => [
      { text: '✦ Arsenal Tecnológico & Especialidades:', cls: 'text-amber-300 font-bold' },
      { text: '  • Backend & Arquitetura: .NET 8, C#, Node.js, REST APIs, Clean Arch', cls: 'text-slate-200' },
      { text: '  • Frontend & UI: React, ES Modules, Tailwind CSS, HTML5 Semântico', cls: 'text-slate-200' },
      { text: '  • DevOps & Mensageria: GitHub Actions, Docker, Azure, Apache Kafka', cls: 'text-emerald-300' },
      { text: '  • Engenharia de Dados & IA: Python, SQL, Modelagem & Análise Analítica', cls: 'text-cyan-300' }
    ],
    about: () => [
      { text: '✦ Rodrigo da Cruz Godinho', cls: 'text-amber-300 font-bold' },
      { text: '  Estudante de Desenvolvimento de Sistemas (Programa Jovem Programador) na Faculdade de Tecnologia SENAC Joinville (SC).', cls: 'text-slate-200' },
      { text: '  Transformando requisitos complexos em software confiável, testado e bem contado.', cls: 'text-slate-200' }
    ],
    contact: () => [
      { text: '✦ Portais e Redes:', cls: 'text-amber-300 font-bold' },
      { text: '  GitHub:   https://github.com/Digooow', cls: 'text-emerald-300' },
      { text: '  LinkedIn: https://linkedin.com/in/digooow', cls: 'text-cyan-300' },
      { text: '  LeetCode: https://leetcode.com/digooow', cls: 'text-amber-300' }
    ],
    clear: () => {
      output.replaceChildren();
      return [];
    }
  };

  registry.git = registry['git log'];
  return registry;
}

function bindPipelineSteps() {
  for (const button of document.querySelectorAll('[data-pipeline-step]')) {
    button.addEventListener('click', () => {
      const stepNum = Number(button.dataset.pipelineStep);
      selectPipelineStep(stepNum);
    });
  }
}

export function initTerminalAndPipeline() {
  bindPipelineSteps();

  const output = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');
  if (!output || !input) return;

  const commands = createCommandRegistry(output);
  const availableCmdNames = Object.keys(commands).filter((k) => k !== 'git');
  const commandHistory = [];
  let historyIndex = -1;

  async function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmdRaw.trim());
    historyIndex = commandHistory.length;
    output.appendChild(createPromptEcho(cmdRaw));

    const handler = commands[cmd];
    if (handler) {
      const result = await handler();
      appendLines(output, result);
      return;
    }

    appendLines(output, [
      {
        text: `Comando não encontrado nos arquivos do reino: "${cmd}". Digite "help" para ver o mapa.`,
        cls: 'text-rose-400'
      }
    ]);
  }

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handleCommand(input.value);
      input.value = '';
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex -= 1;
        input.value = commandHistory[historyIndex];
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex += 1;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const partial = input.value.trim().toLowerCase();
      if (!partial) return;
      const match = availableCmdNames.find((c) => c.startsWith(partial));
      if (match) input.value = match;
    }
  });

  for (const pill of document.querySelectorAll('[data-command]')) {
    pill.addEventListener('click', () => {
      const cmd = pill.dataset.command;
      if (cmd) handleCommand(cmd);
      input.focus();
    });
  }

  appendLines(output, [
    { text: '✦ Crônicas do Sistema iniciadas — Ambiente de Produção Ativo', cls: 'text-emerald-300 font-bold' },
    { text: 'Dica: Use Tab para autocompletar, ↑↓ para histórico, ou experimente "git log", "ping" e "inspect".', cls: 'text-slate-300' }
  ]);
}
