# Rodrigo da Cruz Godinho — Portfólio Interativo & Engenharia DevOps

![CI/CD Pipeline](https://img.shields.io/github/actions/workflow/status/Digooow/Atividades-Senac-Joinville/deploy.yml?branch=main&style=for-the-badge&label=CI%2FCD%20Deploy)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Edge%20CDN-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Lighthouse CI](https://img.shields.io/badge/Audit-Lighthouse%20CI-F44B21?style=for-the-badge&logo=lighthouse&logoColor=white)
![ES Modules](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)

Aplicação web estática, interativa e orientada a telemetria em tempo real, desenvolvida na disciplina de **DevOps com IA** para demonstrar na prática um ciclo completo de **Integração Contínua e Entrega Contínua (CI/CD)** no GitHub Actions, aliado a consumo assíncrono da **GitHub REST API v3**, animações procedurais em Canvas 2D e auditoria automatizada pós-deploy com **Lighthouse CI**.

---

## Sobre o Projeto

A página foi estruturada como uma jornada narrativa dividida em **cinco capítulos** (*O Prólogo*, *As Cinco Provações de um Commit*, *Crônicas & Construções*, *O Console dos Bastidores* e *Quem Escreve Esta História*), unindo uma atmosfera visual de fantasia a dados reais de engenharia de software e infraestrutura.

Mesmo sendo hospedada em um ambiente 100% estático (**Cloudflare Pages**), a aplicação atua como um painel vivo do ecossistema do autor no GitHub:

- **Sincronização Completa de Repositórios (Autorais & Forks):** Consulta paginada na API pública do GitHub (`/users/Digooow/repos?type=owner`) para listar **todos os repositórios públicos** da conta, incluindo **forks** identificados com badge próprio e filtros interativos (`Todos`, `Autorais` e `Forks`).
- **Detalhamento Multi-Linguagem por Projeto:** Consulta o endpoint `/repos/Digooow/{repo}/languages` com cache vinculado ao `pushed_at` para exibir **todas as linguagens de programação utilizadas**, calculando suas proporções em porcentagem e renderizando uma barra visual multicolorida em cada card.
- **Resiliência a Rate-Limit:** Controle em lotes de concorrência e *fallback* automático para cache local caso o limite de requisições anônimas da GitHub API seja atingido.
- **Telemetria Real da Pipeline CI/CD:** Hidrata o cabeçalho e o painel da esteira com o número real da última execução (`Run #`), hash curto do commit (`SHA`), duração do build e status do workflow (`/actions/runs`).
- **Console CLI Assíncrono:** Um terminal interativo no navegador com suporte a autocompletar (`Tab`), histórico de comandos (`↑` / `↓`) e comandos que executam diagnósticos reais de rede (`ping`), runtime/DOM (`inspect`), histórico de commits (`git log`) e catálogo de repositórios (`repos`).

---

## Tecnologias Utilizadas

### Front-End & Runtime no Navegador

- **HTML5 Semântico & Acessível** — estrutura validada estaticamente, atributos de segurança (`rel="noopener noreferrer"` e SRI em CDN) e regiões dinâmicas com `aria-live="polite"`.
- **CSS3 & Tailwind CSS** — *glassmorphism*, tipografia responsiva (`text-wrap: balance` e `text-wrap: pretty`), animações suaves e *scrollbars* padronizadas com fallback progressivo.
- **JavaScript Moderno (ES Modules)** — arquitetura modular sem dependências pesadas de runtime e gerador CSPRNG em buffer (`crypto.getRandomValues`) para partículas visuais.
- **GitHub REST API v3** — integração client-side com cache inteligente em `localStorage` (TTL de 15 minutos) para respeitar limites de *rate-limiting*.
- **HTML5 Canvas 2D & Performance API** — motor gráfico de partículas com controle de FPS e leitura de métricas reais de carregamento (`PerformanceNavigationTiming`).

### DevOps, Qualidade & Infraestrutura

- **GitHub Actions** — orquestração automatizada da esteira de CI/CD na raiz do monorepo ([`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)) com Actions em Node 24.
- **Node.js 24 & `html-validate 10.17.0`** — *Quality Gate* de análise estática (SAST) de sintaxe HTML e verificação sintática dos ES Modules (`node --check`).
- **Cloudflare Pages (Edge CDN) & Wrangler** — hospedagem distribuída globalmente com TLS 1.3 e publicação automatizada via `cloudflare/wrangler-action`.
- **Lighthouse CI** — auditoria automatizada pós-deploy avaliando Performance, Acessibilidade, Boas Práticas e SEO sobre a URL publicada.

---

## Estrutura do Projeto no Monorepo

```text
Atividades-Senac-Joinville/
├── .github/
│   └── workflows/
│       └── deploy.yml                              # Pipeline CI/CD (Quality Gate, Cloudflare Pages e Lighthouse CI)
└── devops-agile-develop-ia/
    └── Digooow.github.io/
        ├── assets/
        │   ├── css/
        │   │   └── style.css                       # Estilos personalizados, animações e glassmorphism
        │   ├── img/                                # Cenários panorâmicos de fundo
        │   └── js/
        │       ├── main.js                         # Ponto de entrada e inicialização dos módulos
        │       ├── random.js                       # Gerador CSPRNG em buffer para partículas 2D
        │       ├── github-telemetry.js             # Cliente da GitHub REST API (Runs, Commits, Repos e Languages)
        │       ├── terminal-cli.js                 # Shell assíncrono interativo e inspeção dos nós de CI/CD
        │       ├── background-switcher.js          # Transição suave e lazy hydration de cenários no scroll
        │       ├── canvas-engine.js                # Loop de renderização 2D e gerenciamento de partículas
        │       ├── fairy.js                        # Entidades luminosas com física de voo orgânica
        │       └── mote.js                         # Partículas ambientais de profundidade
        ├── index.html                              # Página principal estruturada em 5 capítulos
        ├── robots.txt                              # Diretiva para rastreadores e SEO
        └── readme.md                               # Documentação técnica do projeto
```

---

## Comandos do Console Interativo (`terminal-cli.js`)

Na seção **O Console dos Bastidores**, o visitante pode interagir via teclado (com suporte a `Tab` para autocompletar e setas `↑`/`↓` para histórico) ou pelos botões de atalho rápido:

| Comando | Descrição |
| :--- | :--- |
| `help` | Lista todos os comandos disponíveis no console. |
| `story` | Exibe o prólogo narrativo (*"Era uma vez..."*) que inspira a página. |
| `devops` | Mostra a arquitetura do pipeline e os dados reais da última execução do GitHub Actions. |
| `repos` | Consulta a API do GitHub e lista todos os repositórios públicos sincronizados, com tamanho e data de push. |
| `git log` | Busca em tempo real os últimos 5 commits da branch `main` via GitHub REST API. |
| `ping` | Dispara 3 sondas HTTP (`HEAD`) e calcula a latência real (`min/avg/max` em ms) até a CDN. |
| `inspect` | Lê a `PerformanceNavigationTiming` API para exibir TTFB, tempo de *DOM Interactive*, contagem de nós DOM e threads de CPU. |
| `skills` | Apresenta o arsenal tecnológico em Backend (.NET/C#), Frontend, DevOps e Dados/IA. |
| `about` | Resumo da trajetória acadêmica e profissional do autor. |
| `contact` | Links diretos para GitHub, LinkedIn e LeetCode. |
| `clear` | Limpa o histórico visual do terminal. |

---

## Arquitetura da Pipeline CI/CD

O workflow está definido em [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) na raiz do monorepo e é acionado automaticamente a cada `push` na branch `main` que altere `devops-agile-develop-ia/Digooow.github.io/**` ou o próprio workflow (ou manualmente via `workflow_dispatch`).

### 1. Quality Gate (`quality-gate`)

1. Faz o checkout do código com `actions/checkout`.
2. Provisiona o **Node.js 24** com `actions/setup-node`.
3. Instala o validador `html-validate@10.17.0` utilizando a flag de segurança `--ignore-scripts` (mitigando execução arbitrária de scripts de pós-instalação).
4. Executa `html-validate "devops-agile-develop-ia/Digooow.github.io/*.html"` e valida a sintaxe dos módulos JavaScript com `node --check`. Qualquer violação bloqueia imediatamente o deploy.
5. Todas as Actions de terceiros são fixadas por **hash SHA completo de commit**, garantindo imutabilidade e segurança da cadeia de suprimentos (*Supply Chain Security*).

### 2. Empacotamento e Deploy (`deploy`)

Executado somente após a aprovação do `quality-gate`:

1. Valida as credenciais da Cloudflare e verifica via Cloudflare REST API se o projeto no Pages já existe (criando-o automaticamente com `production_branch: "main"` na primeira execução, caso ainda não exista).
2. Copia apenas os arquivos públicos (`index.html`, `robots.txt` e `assets/`) para um diretório temporário limpo (`$RUNNER_TEMP/pages-dist`).
3. Publica nos servidores de borda do **Cloudflare Pages** via `cloudflare/wrangler-action` (`pages deploy --commit-dirty=true`) com controle de concorrência (`group: "cloudflare-pages-portfolio"`).

### 3. Auditoria Pós-Deploy (`lighthouse-audit`)

Após aguardar a propagação de TLS e edge da URL gerada pelo deploy (`*.pages.dev`, com janela de até 180 segundos), o job `lighthouse-audit` executa o **Lighthouse CI** contra essa URL, auditando métricas de performance, acessibilidade, boas práticas e SEO.

### Secrets necessários no GitHub

Em **Settings → Secrets and variables → Actions** do repositório `Atividades-Senac-Joinville`:

- `CLOUDFLARE_API_TOKEN` — token de API da Cloudflare com permissão **Account → Cloudflare Pages → Edit**.
- `CLOUDFLARE_ACCOUNT_ID` — Account ID da sua conta Cloudflare.
- *(Opcional)* Variable `CF_PAGES_PROJECT_NAME` — nome do projeto no Cloudflare Pages (padrão: `digooow-portfolio`, gerando `https://digooow-portfolio.pages.dev`).

---

## Execução e Validação Local

Clone o repositório:

```bash
git clone https://github.com/Digooow/Atividades-Senac-Joinville.git
cd Atividades-Senac-Joinville
```

Como o projeto utiliza **ES Modules** (`<script type="module">`), sirva a pasta `devops-agile-develop-ia/Digooow.github.io` com um servidor HTTP local (por exemplo, a extensão **Live Server** do VS Code ou `npx serve devops-agile-develop-ia/Digooow.github.io`).

Para reproduzir localmente a mesma checagem do **Quality Gate** da esteira:

```bash
npm install --global --ignore-scripts html-validate@10.17.0
html-validate "devops-agile-develop-ia/Digooow.github.io/*.html"
```

---

## Autor

**Rodrigo da Cruz Godinho**  
Qualificação Profissional em Desenvolvimento de Sistemas (Programa Jovem Programador) — Faculdade de Tecnologia SENAC Joinville (SC)

- **Repositório:** [Digooow/Atividades-Senac-Joinville](https://github.com/Digooow/Atividades-Senac-Joinville)
- **GitHub:** [@Digooow](https://github.com/Digooow)
- **LinkedIn:** [linkedin.com/in/digooow](https://linkedin.com/in/digooow)
- **LeetCode:** [leetcode.com/digooow](https://leetcode.com/digooow)

---

[← Voltar ao módulo DevOps, Ágil & IA](../README.md) · [← Voltar ao repositório principal](../../README.md)
