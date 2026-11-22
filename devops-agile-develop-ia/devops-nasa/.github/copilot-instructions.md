# Instruções do Projeto — Diário do Cosmos (NASA APOD)

Este documento define as diretrizes técnicas, arquiteturais, visuais e de segurança que o GitHub Copilot (e qualquer pessoa desenvolvedora) deve seguir obrigatoriamente neste repositório.

---

## 1. Tecnologias Utilizadas

### O que será utilizado
- **Backend / Servidor Web:** Node.js (v18+) com **Express** (`express`) e **dotenv** (`dotenv`).
- **Cliente HTTP no Backend:** API nativa `fetch` do Node.js (v18+) para consultar `https://api.nasa.gov/planetary/apod`.
- **Frontend — Estrutura:** HTML5 semântico (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`, `<figcaption>`).
- **Frontend — Estilização:** CSS3 puro com Custom Properties (variáveis CSS), Flexbox, CSS Grid e Media Queries (abordagem Mobile-First).
- **Frontend — Lógica:** JavaScript Vanilla (ES6+), usando `fetch` com `async/await` e manipulação segura da árvore DOM (`document.createElement` e `textContent`).

### O que NÃO será utilizado
- **Proibido no Frontend:** Frameworks ou bibliotecas de UI (React, Vue, Angular, Svelte), bibliotecas CSS externas (Tailwind CSS, Bootstrap, Material UI), jQuery, TypeScript ou ferramentas de build/bundlers (Webpack, Vite) para manter o frontend leve e direto.
- **Proibido para chamadas à NASA:** Chamadas `fetch` diretas do navegador para `https://api.nasa.gov/planetary/apod`. Toda comunicação com a API da NASA deve passar obrigatoriamente pelo backend.
- **Proibido no Backend:** Bancos de dados externos (SQL/NoSQL) ou ORMs; a aplicação é stateless com cache opcional apenas em memória (`Map`).

### Justificativas das Escolhas
1. **Node.js + Express:** A API APOD exige uma chave (`api_key`). Como código JavaScript executado no navegador é público, é indispensável um servidor backend que atue como proxy (BFF — *Backend for Frontend*) para guardar e injetar a chave com segurança via variáveis de ambiente.
2. **HTML5, CSS3 e JavaScript Vanilla:** O escopo da aplicação é focado (exibir o APOD diário, navegar por datas, suportar imagem/vídeo, estados de carregamento/erro e responsividade). Evitar frameworks reduz complexidade, elimina etapas de compilação no cliente e facilita auditar cada linha sugerida pelo Copilot.
3. **Variáveis de ambiente com `dotenv`:** Permite separar segredos locais (`.env`) do código-fonte versionado e fornece um modelo claro (`.env.example`) para quem for rodar o projeto.

---

## 2. Arquitetura do Sistema

### Organização de Diretórios e Arquivos
```text
/
├── .github/
│   └── copilot-instructions.md   # Regras objetivas do projeto
├── public/                       # Arquivos estáticos servidos pelo Express (Frontend)
│   ├── index.html                # Estrutura HTML5 semântica
│   ├── styles.css                # Folha de estilos responsiva
│   └── app.js                    # Lógica de interface e consumo do endpoint local
├── server/
│   └── server.js                 # Servidor Express, proxy APOD e validações
├── .env                          # Variáveis locais com a chave real (NÃO versionado)
├── .env.example                  # Modelo de variáveis de ambiente (versionado)
├── .gitignore                    # Lista de arquivos/pastas ignorados pelo Git
├── INTERACOES_COPILOT.md         # Registro das 5 interações com o Copilot Chat
├── README.md                     # Guia de instalação, configuração e execução
└── package.json                  # Dependências e scripts Node.js
```

### Responsabilidades por Camada (Padrão BFF / API Proxy)
1. **Backend (`server/server.js`)**:
   - Servir os arquivos estáticos da pasta `public/`.
   - Expor o endpoint interno `GET /api/apod` (aceitando opcionalmente o query parameter `?date=YYYY-MM-DD`).
   - Validar o parâmetro `date` antes de consultar a NASA.
   - Ler `process.env.NASA_API_KEY` (com fallback apenas de desenvolvimento para `DEMO_KEY` caso não esteja definida, exibindo aviso no terminal do servidor).
   - Consultar `https://api.nasa.gov/planetary/apod` enviando `api_key` e `thumbs=true` (para obter miniaturas de vídeos).
   - Utilizar cache em memória (`Map`) indexado por data para reduzir requisições repetidas e evitar bloqueios por limite de taxa (rate limit).
   - Retornar ao frontend **apenas** os campos necessários e seguros em JSON: `title`, `date`, `explanation`, `media_type`, `url`, `hdurl`, `thumbnail_url` e `copyright`.
   - Traduzir erros HTTP (400, 404, 429, 500, 502) em respostas JSON padronizadas (`{ "error": "mensagem clara em português" }`).

2. **Frontend (`public/index.html`, `public/styles.css`, `public/app.js`)**:
   - Consumir exclusivamente `GET /api/apod` ou `GET /api/apod?date=YYYY-MM-DD`.
   - Gerenciar de forma explícita e mutuamente exclusiva os três estados da interface: **Carregando** (`loading`), **Sucesso** (`content`) e **Erro** (`error`).
   - Permitir ao usuário selecionar uma data no `<input type="date">`, voltar para "Hoje", navegar entre "Dia Anterior" / "Próximo Dia" e explorar uma "Data Aleatória".
   - Renderizar dinamicamente a mídia de acordo com `media_type`:
     - `image`: elemento `<img>` com `alt` descritivo e link opcional para `hdurl` (alta definição).
     - `video`: `<video controls>` para arquivos diretos (`.mp4`, `.webm`, `.ogg`) ou `<iframe>` responsivo (16:9) para embeds (YouTube/Vimeo) + link alternativo seguro para abrir o vídeo externamente.
     - `other` (ou ausência de mídia embutível): exibir `thumbnail_url` (quando existir) e aviso amigável com link externo seguro.

---

## 3. Estilização do Frontend

### Identidade Visual ("Deep Space")
- A interface deve utilizar tema escuro espacial definido via variáveis CSS em `:root`:
  - Fundo principal: `--bg-primary: #0b0d17`
  - Fundo de cartões/painéis: `--bg-card: #14192d`
  - Fundo elevado/controles: `--bg-elevated: #1c233d`
  - Texto principal: `--text-primary: #f1f5f9` (alto contraste sobre fundo escuro)
  - Texto secundário: `--text-secondary: #94a3b8`
  - Cor de destaque (accent): `--accent: #38bdf8`
  - Cor de erro: `--error: #f87171`
  - Borda sutil: `--border-color: rgba(148, 163, 184, 0.2)`
- Tipografia: fontes sans-serif nativas modernas (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`) com `line-height` mínimo de `1.65` para a explicação astronômica, garantindo leitura confortável.

### Regras de Construção e Responsividade
- **Mobile-First obrigatório:** Os estilos base devem ser projetados para telas estreitas (`320px`–`480px`), expandindo com `@media (min-width: 768px)` e `@media (min-width: 1024px)`.
- **Controles amigáveis ao toque:** Todos os botões e inputs interativos devem possuir altura mínima de `44px` (`min-height: 44px`) e espaçamento adequado para uso no celular.
- **Mídia responsiva:**
  - Imagens (`img`) devem usar `max-width: 100%; height: auto; display: block;` dentro do contêiner, sem distorção.
  - Vídeos (`iframe` e `video`) devem ser renderizados dentro de um contêiner com proporção fixa responsiva (`aspect-ratio: 16 / 9; width: 100%;`), proibindo larguras/alturas fixas em pixels que quebrem o layout mobile.
- **Feedback visual e acessibilidade:**
  - Estado de carregamento com indicador animado (`spinner`) e mensagem descritiva (`aria-live="polite"`).
  - Estado de erro visível com contraste claro, mensagem orientativa e botão de "Tentar novamente" (`aria-live="assertive"`).
  - Foco visível (`:focus-visible`) em todos os elementos interativos para navegação por teclado.
- **Proibido:** Estilos inline (`style="..."`) no HTML ou CSS em strings JavaScript; toda estilização pertence ao arquivo `public/styles.css`.

---

## 4. Segurança

### Proteção da Chave da API (`NASA_API_KEY`)
- **Regra 1 (Proibido no cliente):** A chave da API da NASA **NUNCA** pode aparecer em arquivos dentro de `public/`, em respostas JSON de `/api/apod`, em cabeçalhos HTTP ou em parâmetros de URL acessados pelo navegador.
- **Regra 2 (Proibido no Git):** O arquivo `.env` deve constar obrigatoriamente no `.gitignore`. Apenas `.env.example` (com valor placeholder `SUA_CHAVE_AQUI`) pode ser commitado.
- **Regra 3 (Logs seguros):** O servidor nunca deve imprimir a URL completa com `api_key=...` nem objetos de erro brutos de requisições externas no console ou nas respostas HTTP enviadas ao cliente.

### Validação de Entradas e Proteção contra XSS
- **Validação estrita de data no backend:**
  - Quando `req.query.date` for enviado, validar o formato exato `YYYY-MM-DD` via expressão regular `/^\d{4}-\d{2}-\d{2}$/`.
  - Verificar se a data existe no calendário real (ex.: rejeitar `2024-02-30` ou `2024-13-01`).
  - Rejeitar datas anteriores a `1995-06-16` (data do primeiro registro histórico do APOD) com status HTTP `400`.
  - Rejeitar datas futuras posteriores à data máxima suportada com status HTTP `400`.
- **Prevenção de XSS no frontend (`public/app.js`):**
  - Nunca usar `innerHTML` com dados vindos da API (`title`, `explanation`, `copyright`, `date`, `url`). Utilizar sempre `textContent` para textos e `document.createElement` para construir elementos.
  - Validar todas as URLs (`url`, `hdurl`, `thumbnail_url`) com `new URL(...)` garantindo protocolo `https:` ou `http:` antes de atribuí-las a `src` ou `href` (bloqueando `javascript:` ou `data:`).
  - Links externos abertos em nova aba (`target="_blank"`) devem incluir obrigatoriamente `rel="noopener noreferrer"`.
- **Sanitização de erros:** Mensagens retornadas ao usuário pelo backend devem ser claras e amigáveis, nunca expondo stack traces ou caminhos internos do sistema.
