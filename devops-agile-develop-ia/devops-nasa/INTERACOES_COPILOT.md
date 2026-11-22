# Registro das Cinco Interações com o GitHub Copilot

Este documento registra cinco interações importantes realizadas com o GitHub Copilot Chat durante o desenvolvimento do projeto **Diário do Cosmos**, detalhando o pedido feito, a resposta sugerida pelo Copilot e as revisões/correções aplicadas após testes e conferência frente às regras definidas em [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

---

## Interação 1 — Criação do servidor Express e rota proxy `/api/apod` (`server/server.js`)

### O que foi pedido
> "Crie o arquivo `server/server.js` usando Express e `dotenv` para servir os arquivos estáticos de `public/` e expor a rota `GET /api/apod` (aceitando `?date=YYYY-MM-DD`), consumindo a API APOD da NASA com `NASA_API_KEY` sem expor a chave para o navegador."

### O que o Copilot respondeu
O Copilot sugeriu uma estrutura inicial de servidor Express com `express.static('public')`, leitura de `process.env.NASA_API_KEY` e uma chamada `fetch` para `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`, retornando diretamente o JSON bruto recebido da NASA e enviando `error.message` no bloco `catch`.

### O que foi alterado após revisão e conferência
1. **Parâmetro `thumbs=true`:** O Copilot não havia incluído `thumbs=true` na consulta à API da NASA; o parâmetro foi adicionado via `URLSearchParams` para garantir o recebimento de `thumbnail_url` quando o APOD do dia for um vídeo.
2. **Validação estrita de data (`validateDateParam`):** Foi implementada a verificação com regex `/^\d{4}-\d{2}-\d{2}$/`, checagem de data real de calendário em UTC, limite mínimo `1995-06-16` e bloqueio de datas futuras com retorno `400`.
3. **Sanitização de payload e erros:** Em vez de repassar o JSON bruto e mensagens cruas de exceção (que poderiam vazar URLs contendo `api_key` em falhas de rede), foi criada a função `sanitizeApodPayload` (limitando os campos retornados) e `mapUpstreamError` (mapeando códigos HTTP `400/404`, `403`, `429` e timeout com `AbortController` para mensagens seguras em português).
4. **Cache em memória (`Map`):** Adicionado cache por data e cache com TTL para a consulta de hoje, reduzindo o risco de atingir o limite de taxa (`429`) da API.

---

## Interação 2 — Estrutura HTML5 semântica e barra de seleção de datas (`public/index.html`)

### O que foi pedido
> "Crie o HTML5 semântico em `public/index.html` com cabeçalho, seletor de data (`input[type='date']`), botões de navegação entre datas, áreas dedicadas para carregamento e erro, e o cartão de exibição do APOD."

### O que o Copilot respondeu
O Copilot gerou uma página HTML funcional com o formulário de data, blocos de `loading`, `error` e exibição do card, mas incluiu atributos `style="display: none;"` diretamente nas tags de status e não definiu limites no seletor de data nem atributos ARIA para leitores de tela.

### O que foi alterado após revisão e conferência
1. **Remoção de estilos inline:** Conforme a regra de estilização de `.github/copilot-instructions.md` ("Proibido estilos inline `style='...'` no HTML"), todos os atributos `style` foram removidos e substituídos pelo atributo nativo `hidden` combinado com a regra `[hidden] { display: none !important; }` no CSS.
2. **Acessibilidade (`aria-live` e semântica):** Foram adicionados `role="status"` + `aria-live="polite"` no card de carregamento e `role="alert"` + `aria-live="assertive"` no card de erro, além de tags semânticas `<article>`, `<figure>`, `<figcaption>` e `<time>`.
3. **Limites e controles adicionais:** Adicionado `min="1995-06-16"` no `<input type="date" id="apod-date">` e incluídos os botões `◀ Dia Anterior`, `Hoje`, `Próximo Dia ▶` e `Data Aleatória` para facilitar a navegação histórica.

---

## Interação 3 — Estilização CSS3 Mobile-First e contêiner responsivo de vídeo (`public/styles.css`)

### O que foi pedido
> "Escreva o arquivo `public/styles.css` seguindo o tema escuro Deep Space, abordagem Mobile-First e layout responsivo para celular e desktop, incluindo suporte a imagens e vídeos."

### O que o Copilot respondeu
O Copilot gerou as variáveis CSS de tema escuro e um layout em Grid para desktop, porém definiu altura fixa em pixels para o `iframe` (`height: 450px`) e botões com `padding` pequeno (`6px 10px`), o que quebrava a proporção em telas estreitas de celular e ficava abaixo da altura mínima de toque recomendada.

### O que foi alterado após revisão e conferência
1. **Proporção responsiva `16:9` para vídeos:** Substituída a altura fixa do `iframe` por uma classe `.video-wrapper` com `width: 100%; aspect-ratio: 16 / 9;`, garantindo adaptação automática em smartphones e monitores widescreen.
2. **Conformidade com alvos de toque:** Ajustados todos os botões (`.btn`) e o seletor de data (`input[type='date']`) para `min-height: 44px`, seguindo o requisito objetivo da seção de estilização para uso confortável em dispositivos móveis.
3. **Refinamento Mobile-First e foco:** Reorganizadas as regras base para coluna única no mobile, expandindo com `@media (min-width: 768px)` e `@media (min-width: 1024px)`, além de incluir `:focus-visible` com alto contraste em todos os elementos interativos.

---

## Interação 4 — Renderização de Imagem e Vídeo com prevenção de XSS (`public/app.js`)

### O que foi pedido
> "Implemente em `public/app.js` a função `renderMedia(data)` para exibir corretamente quando `media_type` for `'image'`, `'video'` (YouTube, Vimeo ou vídeo direto) ou outro formato, exibindo também link para alta definição quando disponível."

### O que o Copilot respondeu
O Copilot propôs montar o player usando template strings atribuídas a `mediaContainer.innerHTML = \`<iframe src="${data.url}">...\` e `<img src="${data.url}" alt="${data.title}">`, sem verificar o protocolo da URL nem tratar links `watch?v=` ou `youtu.be/` do YouTube.

### O que foi alterado após revisão e conferência
1. **Eliminação total de `innerHTML`:** Para cumprir a regra de segurança contra XSS de `.github/copilot-instructions.md`, o código foi reescrito usando exclusivamente `document.createElement`, `replaceChildren()` e `textContent`.
2. **Validação de URLs (`isSafeHttpUrl`):** Adicionada validação com `new URL(...)` aceitando apenas `https:` e `http:` antes de definir `src` ou `href`, e adicionando `rel="noopener noreferrer"` em todos os links com `target="_blank"`.
3. **Normalização de vídeos e fallbacks (`normalizeEmbedVideoUrl`):** Implementado tratamento para vídeos diretos (`.mp4`, `.webm`, `.ogg` via `<video controls>`), conversão de links do YouTube (`watch?v=` e `youtu.be/`) e Vimeo para URLs `/embed/`, além de um bloco de fallback seguro com `thumbnail_url` e link externo quando a mídia não permite incorporação ou falha ao carregar.

---

## Interação 5 — Estados de carregamento, tratamento de erros e sincronização de datas (`public/app.js`)

### O que foi pedido
> "Adicione em `public/app.js` o consumo da rota `/api/apod`, controle explícito de estados de carregamento e erro com botão 'Tentar novamente', além da navegação entre dias anterior/próximo e sincronização do seletor de datas."

### O que o Copilot respondeu
O Copilot criou a função assíncrona `fetchApod(date)` com `try/catch`, mas não bloqueava os botões durante uma requisição em andamento, não atualizava o atributo `max` do `<input type="date">` nem tratava a aritmética de datas em UTC (o que poderia causar desvios de um dia dependendo do fuso horário).

### O que foi alterado após revisão e conferência
1. **Bloqueio de concorrência durante carregamento:** Em `setLoading(true)` e `updateControlsAvailability()`, os controles de data e navegação ficam desabilitados até o retorno da requisição, e os botões `◀ Dia Anterior` / `Próximo Dia ▶` são automaticamente desabilitados nos limites (`1995-06-16` e data máxima atual).
2. **Aritmética segura em UTC (`shiftIsoDate`):** Criado helper operando exclusivamente com `Date.UTC` para avançar e recuar dias sem sofrer interferência de fuso horário local ou horário de verão.
3. **Sincronização do limite máximo e retry:** Ao carregar o APOD inicial (sem parâmetro `date`), o frontend armazena a data retornada pela API como `maxDate`, aplica no atributo `max` do input e registra `lastRequestedDate` para que o botão **Tentar novamente** repita exatamente a última consulta que falhou.
