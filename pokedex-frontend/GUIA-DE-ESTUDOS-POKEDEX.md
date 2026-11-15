# Guia Completo de Estudos e Defesa Técnica — Pokédex Interativa 3D

Este guia é a sua "cola" completa de tudo o que existe nos arquivos [index.html](index.html), [css/style.css](css/style.css) e [js/app.js](js/app.js). Ele foi estruturado para você conseguir explicar **linha por linha, decisão por decisão**, qualquer pergunta técnica que a professora fizer na apresentação ou arguição.

---

## Índice Rápido

1. [Arquitetura Geral do Projeto](#1-arquitetura-geral-do-projeto)
2. [Estrutura HTML5 Semântica e Acessibilidade (`index.html`)](#2-estrutura-html5-semântica-e-acessibilidade-indexhtml)
3. [Design System, Camadas CSS, Flexbox e Container Queries (`css/style.css`)](#3-design-system-camadas-css-flexbox-e-container-queries-cssstylecss)
4. [Como Foi Feita a Pokédex 3D e o Movimento sem Borrão](#4-como-foi-feita-a-pokédex-3d-e-o-movimento-sem-borrão)
5. [Como Foi Feita a Troca de Background em Tela Cheia](#5-como-foi-feita-a-troca-de-background-em-tela-cheia)
6. [Consumo da PokéAPI com `fetch()`, `AbortController` e Tratamento de Erros](#6-consumo-da-pokéapi-com-fetch-abortcontroller-e-tratamento-de-erros)
7. [Catálogo Completo, Filtro Fonético e Algoritmo Damerau-Levenshtein](#7-catálogo-completo-filtro-fonético-e-algoritmo-damerau-levenshtein)
8. [Controles Físicos, Navegação Estilo RPG e Proteção de Clique/Scroll](#8-controles-físicos-navegação-estilo-rpg-e-proteção-de-cliquescroll)
9. [Os 10 Botões de Slot da Direita (Cores por Estado) e Editor no Botão Amarelo](#9-os-10-botões-de-slot-da-direita-cores-por-estado-e-editor-no-botão-amarelo)
10. [Sabatina: Perguntas Difíceis da Professora e Como Responder](#10-sabatina-perguntas-difíceis-da-professora-e-como-responder)

---

## 1. Arquitetura Geral do Projeto

O projeto foi feito **100% em HTML5, CSS3 e JavaScript puro (Vanilla JS)**, sem frameworks (React/Bootstrap) e sem bibliotecas externas (jQuery, Axios, Tailwind). Isso significa que tudo roda direto no navegador, sem etapa de compilação (`build`).

### Estrutura de pastas
- [index.html](index.html): define toda a marcação semântica, os elementos da Pokédex (tampa frontal, ala esquerda de busca/controles e ala direita de resultados/slots), os cenários de fundo e o rodapé.
- [css/style.css](css/style.css): define os tokens visuais, camadas CSS (`@layer`), animações 3D e 2D, Flexbox, Container Queries, estados visuais e acessibilidade.
- [js/app.js](js/app.js): contém toda a lógica da aplicação em modo estrito (`"use strict"`): giro 3D, consumo assíncrono da PokéAPI, filtro tolerante a erros de digitação, máquina de estados RPG dos controles, gravação em `localStorage` e troca dos cenários.
- `assets/backgrounds/`: guarda os 4 cenários locais em alta resolução (`mirante-hoenn.jpg`, `cidade-anime.jpg`, `vila-pallet.jpg` e `floresta-sol.jpg`).
- `assets/favicon.svg`: ícone vetorial da Pokébola exibido na aba do navegador via `<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">`.

### Por que o `<script>` está no `<head>` com `defer`?
No [index.html](index.html), temos:
```html
<script src="js/app.js" defer></script>
```
- Sem atributo nenhum no `<head>`, o navegador pausaria a leitura do HTML para baixar e rodar o JS (e os `document.getElementById(...)` retornariam `null` porque os elementos ainda não existiriam).
- Com `defer`, o navegador **baixa o arquivo em paralelo** enquanto constrói o HTML e garante que o JavaScript **só execute depois que todo o DOM foi analisado**, preservando a ordem dos scripts.

### Por que `"use strict";` no topo do `app.js`?
Ativa o **Modo Estrito** do JavaScript: impede criação acidental de variáveis globais sem `let`/`const`, transforma falhas silenciosas em erros visíveis durante desenvolvimento e torna o código mais seguro.

---

## 2. Estrutura HTML5 Semântica e Acessibilidade (`index.html`)

### Tags semânticas usadas e o porquê de cada uma
| Tag | Onde é usada | Para que serve |
| --- | --- | --- |
| `<nav>` | `.barra-cenarios` | Agrupa os botões de navegação dos cenários de fundo com `aria-label="Cenários de fundo"`. |
| `<main>` | `#conteudo-principal` | Conteúdo principal da página (`tabindex="-1"` para poder receber foco quando o usuário ativa o Skip Link). |
| `<section>` | `#pokedex-aparelho`, `.painel-busca`, `#resultado-area` | Divide blocos temáticos distintos ligados por `aria-labelledby` aos seus títulos (`<h2>`). |
| `<header>` | `.ala-topo--base`, `.ala-topo--scanner` | Cabeçalho de cada ala da Pokédex (com título `<h1>Pokédex</h1>` na base e luzes/título no scanner). |
| `<search>` | Envolvendo `#form-pokedex` | Tag semântica moderna do HTML5 específica para delimitar regiões de pesquisa/filtro. |
| `<form>` | `#form-pokedex` | Agrupa o `<label>`, `<input>` e botão `type="submit"` para permitir envio com a tecla `Enter`. |
| `<fieldset>` + `<legend>` | `.controle-dpad` e `#grade-slots-azuis` | Agrupa semanticamente conjuntos de botões relacionados (as 4 setas do D-Pad e os 10 slots de memória), usando `<legend class="visually-hidden">` invisível na tela, mas lido por leitores de tela. |
| `<article>` | `.pokemon-ficha` (criado via JS) | Representa uma ficha independente e completa do Pokémon encontrado. |
| `<ul>` e `<li>` | `#pokemon-catalogo`, `#pokemon-dados`, `.pokemon-tipos`, `.lista-habilidades` | Estruturam listas reais (catálogo da PokéAPI, dados obrigatórios do Pokémon, tipos e habilidades). |
| `<footer>` | `.rodape` | Rodapé discreto informando as tecnologias usadas e link seguro para a PokéAPI (`target="_blank" rel="noopener noreferrer"`). |

> **Atenção para pergunta da professora:** *"Por que você usou `rel="noopener noreferrer"` no link `target="_blank"`?"*
> Porque, sem `noopener`, a aba recém-aberta poderia acessar `window.opener` e manipular a página de origem (risco de segurança *tabnabbing*); `noreferrer` também omite o cabeçalho `Referer` por privacidade.

### Validação HTML + Controle no JavaScript (`novalidate` e `pattern`)
No `<form id="form-pokedex" novalidate>`:
- O `<input id="pokemon-input">` tem `required` e `pattern=".*\S.*"` (expressão regular HTML que exige **pelo menos um caractere que não seja espaço em branco**, impedindo submissão de `"   "`).
- O `<form>` usa `novalidate` para **desligar o balão de erro padrão do navegador** (que varia de estilo e posição em cada SO/navegador). Em vez disso, o JS intercepta o evento `"submit"` com `evento.preventDefault()`, valida e exibe a mensagem acessível `#pokemon-erro-campo` dentro do próprio card, além do CSS poder reagir à pseudo-classe `:user-invalid`.
- Outros atributos úteis no `<input>`:
  - `autocorrect="off"`, `autocapitalize="none"`, `spellcheck="false"`: impedem que celulares corrijam nomes como *"pikachu"* para palavras em português.
  - `enterkeyhint="search"`: muda o ícone do botão Enter do teclado virtual no celular para lupa/buscar.

### Atributos WAI-ARIA usados no projeto
- **`aria-hidden="true"`**: aplicado em todos os elementos puramente visuais (imagens de fundo `.cenarios-fundo`, luzes LED, Pokébola da capa, saída de som, emojis `🔎` / `⚠️` / `❌`, `<svg>` da Pokébola vazia) para que leitores de tela não anunciem decoração.
- **`aria-label` e `aria-labelledby`**: fornecem nomes acessíveis para regiões e para botões sem texto visível (botões direcionais ▲▶▼◀, botão vermelho, botão azul e os 10 botões de slot da direita).
- **`aria-expanded` e `aria-controls`**: no `#btn-abrir-pokedex`, indicam aos leitores de tela se a tampa está aberta (`true`) ou fechada (`false`) e quais IDs de painel ela controla (`pokedex-ala-base pokedex-ala-scanner`).
- **`aria-pressed`**: transforma botões comuns em botões de alternância (*toggle*), usado nos botões de cenário, no botão `Auto: ON/OFF` e no botão compacto amarelo de edição (`#btn-config-slots`).
- **`aria-current="true"`**: marca qual Pokémon da lista corresponde ao Pokémon exibido no visor no momento.
- **`aria-live="polite"` e `aria-busy`**: no `#resultado-conteudo`. `aria-live="polite"` faz o leitor de tela anunciar resultados quando terminam sem interromper a fala atual; `aria-busy="true"` indica carregamento em andamento durante o `fetch`.
- **`role="alert"`**: usado somente em erros críticos de comunicação (`renderizarMensagemErro`), anunciando falhas de conexão imediatamente.
- **`aria-invalid` + `aria-describedby` + `data-error` (`vincularErroAcessivel`)**: quando o campo está inválido, o JS concatena `pokemon-erro-campo` ao `aria-describedby` existente (`pokemon-dica`), fazendo o leitor de tela ler primeiro a dica e depois o erro.
- **Atributo nativo `inert`**: aplicado em `#pokedex-ala-base` e `#pokedex-ala-scanner` quando fechada, e em `#tampa-frente` quando aberta. Diferente de apenas esconder com `opacity: 0`, `inert` bloqueia cliques, foco de teclado (`Tab`) e leitura por leitores de tela nos elementos da face que está escondida/virada.
- **Skip Link (`.skip-link.visually-hidden`)**: oculto visualmente com `clip-path: inset(50%)`, mas ao pressionar `Tab` logo ao entrar na página ele aparece no canto superior esquerdo e leva direto para `#conteudo-principal`.

---

## 3. Design System, Camadas CSS, Flexbox e Container Queries (`css/style.css`)

### 1. CSS Cascade Layers (`@layer reset, base, components, utilities;`)
Define explicitamente a **prioridade entre blocos inteiros do CSS**, independente da especificidade de seletores individuais:
1. `reset`: aplica `box-sizing: border-box` apenas nos elementos usados (sem seletor universal `*`, evitando custo desnecessário em árvores grandes), zera margens/paddings padrão e define `min-inline-size: 0` no `fieldset` (corrige um comportamento histórico dos navegadores em que `<fieldset>` não encolhe abaixo do conteúdo mínimo em layouts Flex).
2. `base`: estiliza o `body` (`display: flex`, `flex-direction: column`, `min-height: 100dvh`), tipografia base, links e foco visível `:focus-visible`.
3. `components`: todo o estilo dos cenários, Pokédex 3D, formulários, lista, controles físicos, slots, visor LCD e realces RPG.
4. `utilities`: garante `[hidden] { display: none; }`, o utilitário `.visually-hidden:where(:not(:focus-within, :active))` para leitores de tela e `@media (prefers-reduced-motion: reduce)` **sem nenhum `!important`** — porque regras da última camada (`utilities`) sempre vencem as camadas anteriores pela arquitetura CSS Cascade Layers.

### 2. Design Tokens no `:root`
Em vez de repetir códigos hexadecimais espalhados pelo CSS, o projeto organiza variáveis CSS (`--nome`) em duas camadas:
- **Camada 1 — Primitivos:** paleta pura de cores (`--palette-red-600`, `--palette-slate-950`, `--palette-gb-100`..`--palette-gb-850`, `--palette-sky-400`, `--palette-sky-800`, `--palette-emerald-500`, `--palette-amber-400`, etc.).
- **Camada 2 — Semânticos:** dão significado ao uso (`--bg-carcaca-ala`, `--bg-formulario`, `--bg-subpainel-busca-form`, `--bg-catalogo-area`, `--bg-resultado`, `--texto-subpainel-busca`, `--texto-formulario`, `--texto-lcd-principal`, `--cor-destaque`, `--borda-visor-acento`, `--espaco-1`..`--espaco-6`, `--raio-*`, `--z-*`, `--duracao-giro-tampa`, `--curva-cadencia-humana`).
- Se amanhã você quiser mudar a cor da carcaça ou a velocidade do giro, muda **uma única variável no `:root`**.

### 3. Unidades Modernas e Funções Matemáticas CSS
- **`dvh` (`100dvh`, `76dvh`):** *Dynamic Viewport Height*. No celular, quando a barra de endereço aparece ou some, `100vh` estoura a altura da tela; `100dvh` se ajusta automaticamente ao espaço visível real.
- **`min()`, `clamp()`, `calc()`:**
  - `--wing-w: min(23.5rem, calc(100vw - 1.5rem));` no mobile garante que a Pokédex nunca passe da largura da tela.
  - `--wing-w: min(27.5rem, 44vw);` e `--wing-h: clamp(35rem, 76dvh, 43.5rem);` no desktop travam exatamente o mesmo tamanho para as duas asas abertas e para a tampa fechada.

### 4. Flexbox e o segredo de `min-height: 0` e `min-width: 0`
- Toda a estrutura interna da Pokédex usa `display: flex` + `flex-direction: column` + `gap` + `padding` + `margin`.
- **Por que `min-height: 0` aparece na `.painel-busca`, `.pokemon-catalogo-area`, `.painel-resultado`, `.resultado-conteudo` e `#pokemon-catalogo`?**
  Por padrão no Flexbox, todo item tem `min-height: auto` (e `min-width: auto`). Se um filho tiver uma lista gigante (como os 1.300 Pokémon ou a ficha longa no visor), o item Flex **se estica** em vez de ativar `overflow-y: auto`. Ao colocar `min-height: 0` e `flex: 1`, dizemos ao Flex: *"pode encolher para caber no espaço disponível e crie barra de rolagem interna!"*.
- Mesmo motivo para `min-width: 0` e `overflow-wrap: anywhere` nos textos: impedem que nomes compridos ou badges quebrem o layout horizontal.

### 5. Container Queries (`@container visor (min-width: 340px)`)
Diferente de `@media` (que olha a largura da **janela inteira**), `.painel-resultado` declara:
```css
container-type: inline-size;
container-name: visor;
```
Assim, `@container visor (min-width: 340px)` reorganiza o cabeçalho da ficha do Pokémon (`.pokemon-cabecalho` de coluna para linha, texto centralizado para alinhado à esquerda, `.pokemon-lista-dados` com itens lado a lado) **baseado exclusivamente na largura interna do visor LCD**, e não da tela do monitor!

### 6. Detalhes Visuais com CSS Puro (sem imagens extras) e Acessibilidade
- **Scanlines no LCD (`.painel-resultado::after`):** usa `repeating-linear-gradient(0deg, ...)` com `pointer-events: none` (nunca bloqueia cliques nem scroll!).
- **Cantoneiras da caixa do sprite (`.pokemon-imagem-box::before` / `::after`):** dois pseudo-elementos com apenas 2 lados de borda (`border-width: 2px 0 0 2px` e `0 2px 2px 0`), formando a mira de scanner.
- **Trava amarela da capa (`.trava-triangulo`):** triângulo criado via `clip-path: polygon(100% 0, 0 50%, 100% 100%)`.
- **Saída de som superior direita e câmera ótica frente/verso na aba esquerda (`.saidas-som`, `.saidas-som--superior`, `.camera-lente-principal`, `.luz-trio`):** linhas criadas com `repeating-linear-gradient(90deg, ...)` nos rodapés e no topo direito (`.ala-topo--base`), enquanto a câmera ótica multicamadas (anel metálico, barril escuro, vidro de safira antirreflexo e flashes em xênon vermelho/amarelo/verde) aparece exclusivamente na aba giratória esquerda — como câmera frontal na tampa fechada (`.ala-topo--capa`, na extremidade direita) e câmera traseira espelhada na extremidade esquerda quando aberta (`.ala-topo--scanner`).
- **Skeleton Loading:** blocos animados com `linear-gradient` deslizando (`@keyframes pulsar-skeleton`) enquanto a PokéAPI responde, evitando salto visual (*CLS*).
- **`:user-invalid`:** ao contrário de `:invalid` (que já começa vermelho com a página recém-aberta), `:user-invalid` só estiliza o input com erro **depois** que o usuário interagiu com o campo.
- **`tabular-nums` (`font-variant-numeric: tabular-nums`):** faz todos os dígitos numéricos (`#0025`, altura, peso) ocuparem exatamente a mesma largura horizontal para colunas/listas não "dançarem".
- **`prefers-reduced-motion: reduce`:** zera durações de animações e transições para pessoas com sensibilidade a movimento (também lido via JS com `matchMedia("(prefers-reduced-motion: reduce)")`, desativando o giro 3D e o auto-ciclo de fundo por padrão).
- **`forced-colors: active`:** suporta o modo Alto Contraste do Windows, ocultando imagens de fundo e restaurando bordas sólidas com `ButtonText` / `Highlight`.

### 7. Relevo da Carcaça, Simetria, Cores por Polaridade e Foco RPG sem borda grossa
- **Capa rígida estática e relevo eletrônico na carcaça:** a tampa fechada (`.pokedex-tampa-fechada`) simula plástico rígido sem escala nem mudança de cor ao passar o mouse (`:hover`), mantendo câmera e flashes na ponta direita (câmera externa e flashes vermelho, amarelo e verde da direita para a esquerda), microtextura em pontilhado, parafusos nos 4 cantos, placa frontal rebaixada, trava lateral e grade eletrônica inferior.
- **Simetria interna e sombra dividida sem sangramento na dobradiça:** no modo aberto (`[data-aberta="true"]:not(.is-animando)`), as alas dividem o `box-shadow` apenas para os lados externos (`-14px` à esquerda no scanner, `+14px` à direita na base) e alturas mínimas idênticas nos cabeçalhos (`.ala-topo { min-height: 4.15rem; }`) e baías inferiores (`min-height: 4.8rem`), eliminando o falso gradiente na dobradiça e alinhando as duas telas pixel a pixel.
- **Mesmo tom mais escuro nos cards da esquerda e mais claro no Visor escuro:**
  - `"Pesquisar Pokémon"` usa cinza-grafite escuro (`#3f4752`) com texto claro de alto contraste (`#f8fafc` / `#e2e8f0`) e escurece para `#2b313a` quando selecionado (`.painel-busca-form.is-rpg-tela-cursor`).
  - `"Todos os Pokémon"` usa cinza claro fosco (`#cfd6dc`, itens `#eaefec`) e escurece para `#b5bfc8` quando selecionado (`.pokemon-catalogo-area.is-rpg-tela-cursor`) com cursor `#cfe3f5`.
  - `"Visor de Resultados"` usa preto/cinza escuro retrô inspirado em telas clássicas de portáteis e celulares antigos (`#181c22`, células internas `#111418`/`#1d222a`/`#0d1014`, bordas metálicas `--borda-visor-acento`) e **clareia dentro do mesmo tom** quando selecionado: `#232933` em `.is-selecionando-pokemon` e `#2c3340` em `.is-rpg-tela-cursor` ou `.is-scanning`.
- `.is-rpg-foco` usa `outline: 2px solid` (`--palette-sky-800` sobre o fundo claro de `.pokemon-catalogo-area` e `--palette-amber-400` sobre os fundos escuros da busca `#3f4752`, do visor e dos controles) com `outline-offset: 2px` para botões e inputs sem engrossar com sombras múltiplas.
- `.catalogo-item.is-rpg-foco` mantém o exato visual fino de `.catalogo-item.is-cursor`: `border: 2px solid var(--palette-sky-800)` + barra lateral âmbar `inset 6px 0 0 var(--palette-amber-500)`.

---

## 4. Como Foi Feita a Pokédex 3D e o Movimento sem Borrão

Essa é uma das partes mais legais (e uma das favoritas para perguntas difíceis em avaliação!).

### Estrutura de 3 camadas físicas sobrepostas
Dentro de `.pokedex-palco-3d` (`perspective: 1800px`) existe `.pokedex-livro` (`transform-style: preserve-3d`), com largura `--wing-w` e altura `--wing-h` fixas (exatamente do tamanho de **uma** ala). Dentro dele vivem dois blocos:

1. **Card de Baixo fixo (`.pokedex-ala--base`):**
   - É a ala direita (Visor de Resultados + 10 botões da direita + botão compacto amarelo `#btn-config-slots` + saída de som).
   - Quando a Pokédex está fechada (`data-aberta="false"`), ele fica escondido atrás da capa fechada em `translateZ(1px)` — **nunca usando `translateZ` negativo**, evitando que a tampa fique transparente ou atravesse a base no eixo Z durante o giro!
2. **Card Giratório 3D (`.pokedex-aba-giratoria`):**
   - Possui **duas faces dentro do mesmo cartão** (`.aba-face--frente` e `.aba-face--verso`), ambas com **`backface-visibility: hidden`** (quando uma face gira mais de 90° e fica "de costas" para a câmera, ela desaparece automaticamente e revela a outra face!).
   - `.aba-face--frente` é a **Capa Fechada** (`rotateY(0deg) translateZ(6px)` no desktop).
   - `.aba-face--verso` é o **Interior da Ala Esquerda** (`Módulo de Busca`, lista e D-pad), que já nasce virado **180 graus ao contrário** (`rotateY(180deg) translateZ(6px)`).

### Como o giro acontece ao abrir e fechar
- **No Desktop (`>= 880px`):**
  - O pivô de rotação da aba é a borda esquerda (`transform-origin: left center`), simulando uma dobradiça física.
  - Ao abrir (`[data-aberta="true"]`), `.pokedex-aba-giratoria` gira de `0deg` para `rotateY(-180deg)`, abrindo para a esquerda e desvirando `.aba-face--verso` perfeitamente de frente para o usuário!
  - Ao mesmo tempo, `.pokedex-livro` desliza para a direita em `translateX(calc(var(--wing-w) / 2))` com `transition-delay: 60ms` (e `70ms` ao fechar), mantendo a Pokédex inteira (agora com `2 * --wing-w` de largura) exatamente no meio da tela, em movimento orgânico ("cadência humana": `1240ms` no giro, `1160ms` no deslize, curva `cubic-bezier(0.28, 0.72, 0.28, 1)`).
- **No Mobile (`< 880px`):**
  - Não cabe abrir duas metades lado a lado na horizontal sem esmagar tudo! Por isso, no mobile, o eixo muda para a dobradiça superior (`transform-origin: top center`), gira no eixo X (`rotateX(180deg)`), e `.pokedex-aparelho` anima `padding-top: var(--wing-h)` para abrir espaço acima da base.

### Como foi garantido que a ala esquerda ficasse 100% nítida (sem desfoque!)
Se `.pokedex-aba-giratoria` permanecesse para sempre com `perspective: 1800px`, `transform-style: preserve-3d` e `rotateY(-180deg) translateZ(6px)`, os navegadores baseados em Chromium (Chrome, Edge, Opera, Brave) continuariam rasterizando toda a ala esquerda como uma textura 3D projetada na GPU, aplicando subpixel interpolation (`1800 / 1806`) e deixando os textos da esquerda levemente borrados comparados aos da direita!

**A solução técnica em `executarGiroPokedex()` ([js/app.js](js/app.js)) e [css/style.css](css/style.css):**
1. Antes de iniciar o movimento, o JS adiciona `.is-animando`, chama `pokedexAparelho.getBoundingClientRect()` (isso força um *reflow* para o navegador registrar a posição inicial 3D sem pular direto ao fim) e adiciona `.is-transicionando`.
2. Durante os `1260ms` (`DURACAO_GIRO_POKEDEX_MS`), a animação 3D roda normalmente.
3. Assim que o `setTimeout` de `1260ms` termina (ou imediatamente se `prefers-reduced-motion` estiver ativo), o JS **remove** `.is-animando` e `.is-transicionando`.
4. Sem `.is-animando` (`:not(.is-animando)`), o CSS troca instantaneamente para o modo **2D plano nítido**:
   - `.pokedex-palco-3d { perspective: none; }`
   - `transform-style: flat; transform: none;` em todas as faces e alas;
   - As posições equivalentes finais passam a ser posicionamento CSS 2D puro (`left: calc(var(--wing-w) / 2)` no `.pokedex-livro` e `left: calc(-1 * var(--wing-w))` na aba aberta em desktop; `top: calc(-1 * var(--wing-h))` no mobile).
5. Resultado visual: zero salto ao terminar a animação e nitidez cristalina idêntica dos dois lados!

### Câmera ótica e flashes reativos (`.is-scanning`)
Durante uma consulta na API, `executarPesquisa()` adiciona a classe `.is-scanning` ao `#pokedex-aparelho`, ativando `@keyframes pulso-lente` no vidro de safira `.camera-vidro-safira` e `@keyframes flash-disparo` escalonado nos flashes vermelho, amarelo e verde da câmera da aba esquerda (frente e verso). Quando a consulta acaba (`finally`), a classe é removida.

---

## 5. Como Foi Feita a Troca de Background em Tela Cheia

1. **HTML:** inside `<div class="cenarios-fundo" aria-hidden="true">`, todas as 4 imagens ficam pré-declaradas com `data-cenario-id` (`hoenn`, `cidade`, `vila`, `floresta`). A inicial (`hoenn`) tem `class="cenario-imagem is-active"` e `fetchpriority="high"` (para o navegador priorizar o carregamento dela — bom para *LCP*), enquanto as outras usam `decoding="async"` para não travar a renderização.
2. **CSS (Crossfade sem recarregar):** `.cenarios-fundo` usa `position: fixed; inset: 0; pointer-events: none;`. Cada `.cenario-imagem` ocupa `width: 100%; height: 100%; object-fit: cover;` com enquadramento próprio por `object-position` (`45%`, `62%`, `55%`, `center`). Todas têm `opacity: 0`, e somente `.cenario-imagem.is-active` tem `opacity: 1` com `transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)`. Sobre elas, `.cenario-vinheta` aplica gradientes suaves para destacar os controles externos.
3. **JS:**
   - `aplicarCenario(cenarioId)` alterna `.is-active` nas imagens e botões, sincroniza `aria-pressed` e salva em `localStorage` (`pokedex_cenario_ativo`).
   - `avancarProximoCenario()` usa aritmética modular `(indiceAtual + 1) % CENARIOS_IDS.length` para girar em loop circular (`0 -> 1 -> 2 -> 3 -> 0`).
   - `sincronizarTemporizadorCenario()` cria um `setInterval` a cada `12000ms` **somente** quando `modoAutoAtivo === true` e `!document.hidden`.
   - `document.addEventListener("visibilitychange", sincronizarTemporizadorCenario)` **pausa o temporizador automaticamente** quando você troca de aba no navegador (economia de CPU e bateria!).
   - Ao clicar manualmente em qualquer botão de cenário (`Hoenn`, `Cidade`, `Vila`, `Floresta`), `definirModoAuto(false)` desativa o modo automático para respeitar sua escolha manual.

---

## 6. Consumo da PokéAPI com `fetch()`, `AbortController` e Tratamento de Erros

### Os 2 endpoints oficiais consumidos
1. **Busca de Pokémon individual:** `https://pokeapi.co/api/v2/pokemon/{nomeOuId}` (`buscarPokemonNaApi`).
2. **Catálogo de nomes e IDs:** `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0` (`garantirCatalogoCarregado`). *Obs.:* essa listagem traz `name` e `url` (`https://pokeapi.co/api/v2/pokemon/25/`), e `extrairIdDaUrl()` usa a expressão regular `/\/(\d+)\/?$/` para extrair o número `#0025` sem precisar fazer 1.300 requisições separadas!

### Por que usar `AbortController` + `setTimeout`?
Em aplicações com busca, existem **dois problemas clássicos** que `AbortController` resolve juntos:
1. **Race Condition (Condição de Corrida):** se você pesquisar "charizard" e logo depois clicar em "pikachu", a primeira requisição ainda pode estar viajando pela rede. Se ela voltar *depois* da segunda, mostraria o Charizard errado na tela! Com `controladorAtual?.abort()` antes de abrir a nova chamada + checagem `if (controladorAtual !== controller) return;`, a requisição antiga é abortada no nível de rede do navegador.
2. **Timeout real (`10000ms`):** o `fetch()` nativo não tem timeout curto embutido. Um `setTimeout` muda `expirouPorTempo = true` e chama `controller.abort()`, fazendo o `catch` identificar se o `AbortError` veio de timeout (mostra erro ao usuário com botão **Tentar novamente**) ou de cancelamento intencional por uma busca mais nova (ignora silenciosamente).

### Tratamento semântico de erros (`class ErroApi extends Error`)
- **`resposta.status === 404`:** não existe esse Pokémon -> lança `ErroApi` com `tipo = "nao_encontrado"`, mantém o status `"Não encontrado"` e calcula até 4 botões clicáveis *"Você quis dizer:"* via `buscarSugestoesAproximadas`.
- **`!resposta.ok` (500, 502, 429, etc.) ou erro de rede (`fetch` rejeitado) ou JSON inesperado:** lança `ErroApi` com `tipo = "comunicacao"`, exibe `role="alert"` e botão **Tentar novamente** que reexecuta `executarPesquisa(ultimaBuscaRealizada)`.
- **Bloco `finally`:** sempre limpa o `clearTimeout(temporizador)` e, se aquela requisição ainda for a atual (`controladorAtual === controller`), destrava o botão `Buscar Pokémon`, desliga `aria-busy` e desativa os flashes `.is-scanning`.

### Conversão de unidades da PokéAPI (`formatarMedidaDecimal`) e Sprites
- A PokéAPI retorna **altura em decímetros (`dm`)** e **peso em hectogramas (`hg`)**.
  - `height: 4` -> `4 / 10 = 0,4 m (4 dm)`
  - `weight: 60` -> `60 / 10 = 6,0 kg (60 hg)`
  - Formatação usando `Intl.NumberFormat("pt-BR")` (vírgula decimal correta em português!).
- **Sprites (`selecionarSpritePokemon`):** busca em cascata a melhor imagem oficial (`official-artwork`, depois `home`, depois `dream_world`, depois `front_default`). Se nenhuma URL existir ou se a imagem falhar ao carregar (`evento "error"` na `<img>`), troca por fallback textual seguro sem quebrar o layout.

### Segurança contra XSS (Cross-Site Scripting)
- **Zero `innerHTML`** no projeto inteiro!
- Todos os elementos retornados da API passam por helpers `criarElemento()` / `criarElementoSvg()` com **`textContent`** (nunca interpretado como HTML pelo navegador) e são inseridos com `.replaceChildren(...)`.

---

## 7. Catálogo Completo, Filtro Fonético e Algoritmo Damerau-Levenshtein

Quando o usuário abre a Pokédex ou foca o campo de busca pela primeira vez (*lazy loading* — não gasta banda antes de abrir!), `garantirCatalogoCarregado()` baixa a lista de todos os Pokémon disponíveis na API. Para evitar múltiplas chamadas simultâneas se clicar rápido, usa `catalogoCarregando` e cache local `catalogoPokemon`.

### Como a busca funciona mesmo se você digitar errado (`filtrarCatalogo`)
1. **Limpeza (`limparTextoComparacao`):**
   - Usa `.normalize("NFD").replace(/[\u0300-\u036f]/g, "")` (separa acentos das letras no Unicode e remove os acentos) e mantém apenas `[a-z0-9]`.
2. **Chave fonética simplificada (`gerarChaveFonetica`):**
   - Converte grafias comuns de quem escreve como se fala em português para aproximar do nome em inglês:
     `ph -> f`, `ch -> x`, `qu -> k`, `y -> i`, `w -> u`, `c` antes de `e/i -> s`, `z -> s`, `k -> c`, e colapsa letras dobradas (`/(.)\1+/g -> "$1"`).
   - Exemplo real: `"pikaxu"` vira `"picaxu"`, que é idêntico à chave fonética de `"pikachu"`! `"charisard"` vira `"xarisard"`, igual a `"charizard"`.
3. **Distância de Damerau-Levenshtein (`calcularDistanciaDamerau`):**
   - Matriz de programação dinâmica (`dp[m + 1][n + 1]`) que calcula quantas edições mínimas transformam a palavra digitada no nome do Pokémon.
   - Aceita **4 operações com custo 1**: inserção (`pika_chu`), remoção (`pikaachu`), substituição (`pikaxhu`) e **transposição adjacente** (trocar duas letras vizinhas de ordem, ex.: `pikahcu` -> `pikachu`!).
   - Tem **early exit** (`if (Math.abs(m - n) > limiteMaximo) return limiteMaximo + 1`): se a diferença de tamanho já for maior que o limite aceito, nem aloca a matriz!
4. **Sistema de pontuação (Ranking):**
   - `0`: match exato.
   - `100+`: começa com (`startsWith`), priorizando formas base antes de variações com hífen (`bonusFormaBase`).
   - `300+`: contém no meio da palavra (`indexOf`).
   - `400+` / `500+`: match fonético exato ou prefixo fonético.
   - `600+`: distância de Damerau menor que `limiteDistancia` (proporcional ao tamanho do termo, entre 1 e 4).
   - Se o termo for só números (ou `#25`), `filtrarCatalogoPorNumero` busca direto por ID exato, prefixo ou substring do ID.

### Renderização em lotes + Infinite Scroll
Como a PokéAPI retorna mais de 1.300 entradas, inserir todos os `<li>` no DOM de uma vez deixaria a abertura mais pesada.
- Sem filtro (`modoFiltroAtual === "todos"`), renderiza em lotes de **`150` itens** (`TAMANHO_LOTE_CATALOGO`), exibindo um botão **Carregar mais** no fim e carregando mais lotes automaticamente no evento `"scroll"` de `catalogoLista` quando `scrollHeight - scrollTop - clientHeight < 120`.
- Quando há filtro digitado, limita aos **`120` melhores resultados** (`MAX_RESULTADOS_FILTRADOS`).

---

## 8. Controles Físicos, Navegação Estilo RPG e Proteção de Clique/Scroll

### 1. Como o fechamento por clique externo funciona sem fechar ao usar a barra de rolagem
- **Áreas que preservam a Pokédex aberta ao clicar:**
  - `SELETOR_AREAS_INTERNAS_POKEDEX`: `".painel-busca, .painel-resultado, .controle-interativo"` (telas e todos os botões físicos). Qualquer clique *na carcaça vermelha fora* dessas áreas dentro de `#pokedex-aparelho` fecha a Pokédex!
  - `SELETOR_AREAS_PRESERVADAS`: adiciona `.barra-cenarios` e `.rodape`, para que trocar o cenário de fundo ou clicar no link do rodapé também não feche o aparelho sem querer.
- **O truque para proteger o arraste do scroll (`pointerdown` / `mousedown`):**
  Se o usuário aperta o mouse dentro do visor (ou na barra de rolagem do visor), arrasta um pouco para fora e solta o botão fora da tela, o evento `click` nasce no local onde soltou — ou seja, fora do visor!
  Por isso, `registrarInicioPonteiro` salva `ponteiroIniciouEmAreaPreservada = pertenceArea(evento.target, SELETOR_AREAS_PRESERVADAS)` logo no `pointerdown` / `mousedown`. Quando o `click` chega, se `iniciouPreservado` for `true` ou se `alvo.isConnected === false` (caso o elemento clicado tenha acabado de ser removido do DOM durante o clique, como "Carregar mais" ou sugestões 404), **o fechamento é bloqueado**.
- Também fecha ao pressionar a tecla **`Escape`** (`keydown`).

### 2. Sistema de Menus em Camadas Estilo RPG
A navegação inteira responde ao **Joystick D-Pad** (`#btn-dpad-cima/baixo/esquerda/direita`), ao **botão redondo de seleção** (`#btn-controle-selecionar`, sem texto impresso sobre o relevo circular), aos **botões vermelho/azul** (`#btn-limpar-form` / `#btn-limpar-visor`) e ao **teclado** (`↑ ↓ ← →`, `Enter`, `Backspace`, `Escape`).

Tudo gira em torno de 3 variáveis de estado:
- `rpgNivel`: controla a profundidade atual do menu:
  1. **`"telas"` (raiz):** escolhe qual das 4 telas controlar (`"busca"`, `"lista"`, `"visor"` ou `"slots"`).
  2. **`"itens"`:** navega nos botões/itens/slots *dentro* da tela escolhida.
  3. **`"edicao"`:** navega nos campos (`nome`, `apelido`, `Salvar`, `Cancelar`) ao editar um slot no painel de configuração.
- `rpgTela`: guarda qual das 4 telas está ativa.
- `rpgIndices`: objeto `{ busca: 0, visor: 0, slots: 0, edicao: 0 }` que lembra qual item estava destacado em cada painel (e na lista usa `indiceCursorLista`).

#### Movimentação entre telas (Desktop 2D vs. Mobile 1D)
- `estaModoDesktopRpg()` verifica `matchMedia("(min-width: 880px)").matches`.
- **Desktop (mapa em grade 2×2 — `MAPA_PROXIMA_TELA_DESKTOP`):**
  - `busca` <-> `direita` <-> `visor`
  - `lista` <-> `direita` <-> `slots`
  - `busca` <-> `baixo` <-> `lista` e `visor` <-> `baixo` <-> `slots`
- **Mobile (carrossel linear 1D — `ORDEM_TELAS_MOBILE`):**
  - Navega sequencialmente entre `["busca", "lista", "visor", "slots"]`.

#### Navegação dentro de cada tela (`navegarRpg`)
- **Lista (`"lista"`):** `DESLOCAMENTO_LISTA` faz `▲`/`▼` andar `1` item por vez e `◀`/`▶` saltar `5` itens por vez (`moverCursorLista`), chamando `scrollIntoView({ block: "nearest" })` para rolar a lista acompanhando o cursor.
- **Grade de Slots + Botão Amarelo (`"slots"`):** `calcularProximoIndiceSlots` entende a grade física de 2 linhas por 5 colunas (`0..4` na 1ª linha, `5..9` na 2ª linha, índice `10` = botão compacto amarelo `#btn-config-slots`). `▲`/`▼` pula de linha (1ª <-> 2ª <-> botão amarelo) e `◀`/`▶` anda horizontalmente entre botões vizinhos!
- **Visor sem botões (`"visor"` com Pokémon aberto):** quando não há botões interativos dentro do LCD, `▲`/`▼` rola suavemente o visor (`resultadoConteudo.scrollTop += 72 / -72`).
- **Busca (`"busca"`) e Edição (`"edicao"`):** anda entre os botões e inputs visíveis coletados dinamicamente por `coletarControlesInterativos()`.

#### Duplo uso dos botões Vermelho e Azul + Seleção Redonda / `Enter` / `Backspace`
- **Botão Redondo de Seleção (`#btn-controle-selecionar`) / Tecla `Enter` (`confirmarCursorRpg`):**
  - Na raiz (`"telas"`): entra na tela destacada (`entrarTelaRpg`).
  - Dentro de `"itens"` ou `"edicao"`: ativa o controle destacado (`confirmarElementoControle`) — busca o Pokémon selecionado na lista, foca ou submete o input, ativa o slot selecionado, abre o painel de edição pelo botão amarelo ou envia o formulário de edição.
- **Botão Azul (`#btn-limpar-visor` -> `avancarOuLimparVisorRpg`):**
  - **1º uso (Avançar menu):** sempre que estiver em `"telas"` ou com foco em um controle que abre submenu (`controleAtualAbreSubmenu()`, ou seja, `#btn-config-slots` nos slots ou botão `Editar` dentro da configuração), ele **entra** no menu/submenu selecionado.
  - **2º uso (Limpar visor):** quando já está em uma tela folha sem submenu (por exemplo, dentro da lista, dentro do campo de busca, em um slot comum ou na ficha do visor), limpa o Visor de Resultados (`limparVisorResultados()`).
- **Botão Vermelho (`#btn-limpar-form`) / Tecla `Backspace` fora de `<input>` (`voltarMenuRpg`):**
  - **1º uso (Voltar menu):** em `"edicao"` volta para a lista de configuração em `"visor"`; em `"itens"` volta para a raiz `"telas"`.
  - **2º uso (Limpar formulário):** quando já está na raiz `"telas"`, limpa o campo de pesquisa e restaura o catálogo (`limparFormulario()`).
- **`sincronizarTooltipsFenda()`** atualiza os `title` desses dois botões conforme o contexto atual do menu.

#### Lista em 2 cliques vs. Slots em 1 clique
- **Lista (`.catalogo-item`):** clicar uma vez em um Pokémon da lista (`!jaDestacado && detail < 2`) apenas destaca aquele Pokémon (`indiceCursorLista = indice`, `rpgTela = "lista"`, `rpgNivel = "itens"`); clicar novamente no item já selecionado (ou duplo clique, ou pressionar o botão redondo de seleção/`Enter`) executa a busca na API.
- **Slots da direita (`ativarSlotAzul`):** mantém ação imediata em 1 clique — se o slot estiver livre e houver Pokémon aberto, grava na hora; se estiver utilizado, carrega o Pokémon imediatamente.

---

## 9. Os 10 Botões de Slot da Direita (Cores por Estado) e Editor no Botão Amarelo

### Sinalização apenas por cor (sem números visíveis)
Os 10 botões em `#grade-slots-azuis` não mostram mais números nem nomes escritos por cima:
- **Livre (vazio):** azul clássico da Pokédex (`--palette-sky-400`, borda `--palette-sky-950`).
- **Utilizado (gravado):** verde LED aceso (`--palette-emerald-500`, borda `--palette-emerald-950` com leve brilho superior).
- **Utilizado e aberto agora no Visor (`.is-ocupado.is-ativo`):** verde-menta mais claro (`--palette-emerald-300`) com borda branca para indicar qual slot corresponde ao Pokémon exibido.
- **Acessibilidade e tooltip preservados:** `sincronizarSlotsAzuis()` preenche `title` e `aria-label` informando o número do slot (`01..10`), estado (`livre` ou `utilizado`) e o nome/apelido do Pokémon salvo.

### Persistência segura em `localStorage`
- Os dados são guardados em JSON na chave `"pokedex_slots_salvos"` (`salvarSlotsNoStorage`).
- Na inicialização (`carregarSlotsSalvos`), um bloco `try/catch` faz `JSON.parse()` e valida cada posição manualmente (`typeof item.name === "string"` etc.) para a página nunca quebrar se o `localStorage` estiver corrompido ou bloqueado por navegação anônima restrita (`lerPreferencia`/`salvarPreferencia`).

### Painel de gerenciamento no botão amarelo (`#btn-config-slots`)
- `btnConfigSlots` (mantido compacto e sem texto visível, identificado via `aria-label` e `title`) alterna `renderizarConfiguracaoSlots()` / `fecharPainelConfigSlots()` no próprio visor LCD (`configSlotsAberta`), permitindo: **Abrir**, **Editar** (trocar nome/ID do Pokémon gravado ou dar um apelido), **Remover** individualmente, **Limpar todos** ou **Voltar ao visor**.

---

## 10. Sabatina: Perguntas Difíceis da Professora e Como Responder

Use esta tabela para responder rápido e com segurança se a professora apertar você na defesa oral:

### 1. *"Por que você não usou `innerHTML` para montar a ficha do Pokémon?"*
> **Resposta:** Porque montar HTML concatenando strings com dados vindos de fora abre brecha para **XSS (Cross-Site Scripting)** caso um dado contenha tags `<script>` ou atributos maliciosos. Usando `document.createElement()` (ou `createElementNS` para SVG) com **`textContent`** e `.replaceChildren()`, o navegador trata todo texto da API estritamente como texto literal, nunca como código executável.

### 2. *"O que aconteceria se alguém digitasse 'charizard' e logo em seguida 'pikachu' antes da primeira resposta voltar?"*
> **Resposta:** Sem controle de concorrência (*race condition*), a resposta mais lenta poderia chegar depois e sobrescrever o Pikachu na tela com os dados do Charizard. Para evitar isso, cada busca cria um **`AbortController`** próprio (`controladorAtual`). Antes de iniciar uma nova busca, `controladorAtual?.abort()` cancela a requisição anterior aberta no navegador, além de validar `if (controladorAtual !== controller) return;` antes de renderizar.

### 3. *"Como você diferenciou timeout de um cancelamento por nova pesquisa?"*
> **Resposta:** Quando o `AbortController` cancela uma requisição, ambos caem no `catch` com `erro.name === "AbortError"`. Eu mantenho uma flag booleana local `expirouPorTempo`: só quem liga ela para `true` é o `setTimeout` de `10000ms` antes de chamar `controller.abort()`. Assim, no `tratarErroPesquisa`, se `AbortError && !expirouPorTempo`, retorno em silêncio sem mostrar erro falso; se `expirouPorTempo` for `true`, aviso ao usuário e ofereço o botão "Tentar novamente".

### 4. *"Como você lidou com HTTP 404 vs. erro de rede no `fetch()`?"*
> **Resposta:** Uma pegadinha clássica do `fetch()` é que **ele NÃO rejeita a Promise em status 404 ou 500** — ele só rejeita em falha de rede ou cancelamento (`AbortError`). Por isso testo `resposta.status === 404` e `!resposta.ok` manualmente, lançando minha subclasse `ErroApi` com um `tipo` específico (`nao_encontrado` vs `comunicacao`) para renderizar UI diferente em cada caso.

### 5. *"Por que você colocou `novalidate` no `<form>`? Não era para validar em HTML5?"*
> **Resposta:** O `<input>` **continua** com validação semântica HTML5 (`required` e `pattern=".*\S.*"` para barrar só espaços), inclusive estilizada via `:user-invalid` no CSS. O `novalidate` vai no `<form>` apenas para desativar aqueles pop-ups flutuantes padrão que mudam de visual entre navegadores, permitindo que o nosso JavaScript exiba o erro integrado dentro do layout e ligado por `aria-describedby` e `aria-invalid`.

### 6. *"Como funciona o efeito de abrir e fechar em 3D sem que o verso apareça ao contrário nem deixe as letras borradas?"*
> **Resposta:** A aba esquerda tem duas faces no mesmo container 3D: frente (`rotateY(0deg)`) e verso (`rotateY(180deg)`), ambas com `backface-visibility: hidden`. Quando o container gira `-180deg` em `transform-origin: left center`, a frente some ao passar de 90° e o verso termina em `0deg` de frente para o usuário. Além disso, o card de baixo usa `translateZ(1px)` e as faces usam `translateZ(6px)` para evitar interseção no eixo Z. Quando o giro de `1260ms` acaba, o JS remove `.is-animando`, desligando `perspective` e `transform-style: preserve-3d` no CSS — isso força o navegador a desenhar tudo em plano 2D puro e impede o desfoque de textura 3D que ocorria só na metade esquerda.

### 7. *"Por que tem `pokedexAparelho.getBoundingClientRect()` ali no meio de `executarGiroPokedex` sem nem guardar o retorno?"*
> **Resposta:** Para forçar um **reflow síncrono** controlado. Quando adiciono `.is-animando` (que liga o palco 3D) e logo em seguida `.is-transicionando` (que liga a transição), alguns navegadores juntam as duas mudanças no mesmo frame e pulam a animação direto para o estado final. Ler o layout com `getBoundingClientRect()` obriga o navegador a calcular o frame inicial antes de aplicar a transição.

### 8. *"Por que você usou `inert` em vez de só `display: none`?"*
> **Resposta:** Se eu colocasse `display: none` na base ou na tampa durante o movimento, ela sumiria instantaneamente e quebraria o giro 3D! Com o atributo nativo **`inert`**, o elemento continua existindo visualmente para animar em 3D, mas fica **completamente bloqueado** para clique, foco por teclado (`Tab`) e leitores de tela enquanto está oculto atrás da tampa.

### 9. *"Como você garantiu que arrastar a barra de rolagem do visor não fechasse a Pokédex?"*
> **Resposta:** Se o usuário pressiona o botão do mouse dentro do visor (ou na barra de rolagem) e solta fora da Pokédex, o evento `click` é disparado no elemento onde o mouse foi solto (fora da Pokédex!). Por isso escuto `pointerdown` e `mousedown` antes do `click` e registro em `ponteiroIniciouEmAreaPreservada` se o clique **começou** em `.painel-busca`, `.painel-resultado`, controles, barra de cenários ou rodapé. No `click`, se começou em área preservada (ou se o elemento foi removido dinamicamente como botões de paginação, `isConnected === false`), o fechamento é cancelado.

### 10. *"Como o projeto corrige erros de digitação como 'pikaxu'?"*
> **Resposta:** São 3 camadas combinadas depois que o catálogo completo da PokéAPI é baixado: (1) normalização Unicode `NFD` removendo acentos e pontuação; (2) uma chave fonética adaptada para grafia de brasileiro (`ph->f`, `ch->x`, `qu->k`, `y->i`, letras duplicadas); e (3) **distância de Damerau-Levenshtein** por programação dinâmica, que mede quantas inserções, exclusões, trocas ou inversões de letras vizinhas separam o termo digitado dos nomes reais da API.

### 11. *"Por que carregar só 150 itens por vez na lista em vez de todos os 1.300 Pokémon de uma vez?"*
> **Resposta:** Para reduzir o custo inicial de construção do DOM (*Document Object Model*) no navegador e manter a interface fluida em dispositivos mais fracos. Conforme o usuário rola até `120px` do final da lista (`scrollHeight - scrollTop - clientHeight < 120`) ou aperta **Carregar mais** / navega com o direcional para baixo, novos lotes de `150` são anexados progressivamente.

### 12. *"Qual a diferença entre `@media` e `@container` no seu CSS?"*
> **Resposta:** `@media (min-width: 880px)` verifica a largura da **janela inteira do navegador** (usado para decidir se a Pokédex abre lado a lado no desktop ou de cima para baixo no mobile). Já `@container visor (min-width: 340px)` olha apenas a largura da **caixa específica `.painel-resultado`** (`container-type: inline-size`), adaptando o layout interno da ficha do Pokémon mesmo que ela esteja dentro de uma janela estreita.

### 13. *"Para que serve `@layer` no topo do CSS?"*
> **Resposta:** Organiza a cascata em níveis fixos (`reset`, `base`, `components`, `utilities`). Regras de uma camada posterior sempre vencem regras de uma camada anterior sem depender de aumentar especificidade de seletores ou espalhar `!important`.

### 14. *"Para que servem `min-height: 0` e `min-width: 0` dentro do Flexbox?"*
> **Resposta:** Em Flexbox, o padrão de `min-height`/`min-width` é `auto`, impedindo o filho de ficar menor que seu conteúdo interno — o que faz listas grandes esticarem o card em vez de gerar barra de rolagem interna. Definir `0` libera o `flex: 1` para encolher o container e ativar `overflow-y: auto` corretamente.

### 15. *"O que acontece se o navegador bloquear o `localStorage` (ex.: aba anônima restrita) ou se alguém editar os dados salvos à mão?"*
> **Resposta:** Tanto `lerPreferencia` quanto `salvarPreferencia` e `carregarSlotsSalvos` estão envolvidos em blocos `try/catch` e validação de tipos campo a campo (`Array.isArray`, `typeof item.name === "string"`). Se falhar ou vier dado inválido, a aplicação não trava: assume os padrões seguros e segue funcionando em memória na sessão atual.

### 16. *"Como você evita carregar as 1.300 imagens dos Pokémon ao listar o catálogo?"*
> **Resposta:** O catálogo completo vem de um único endpoint leve (`?limit=100000&offset=0`) que só traz nome e URL, de onde extraio o ID por Regex (`/\/(\d+)\/?$/`). As imagens (`sprites`) só são buscadas sob demanda quando o usuário confirma um Pokémon específico.

### 17. *"Como a acessibilidade funciona para quem usa só teclado ou leitor de tela?"*
> **Resposta:** Toda a Pokédex pode ser operada pelo teclado (`Tab`, `Enter`, `Escape`, `Backspace` e setas `↑ ↓ ← →` estilo RPG), tem *Skip Link* no início da página, esconde lados inativos com `inert`, usa `aria-live="polite"` para resultados, `role="alert"` para falhas de rede, `aria-label` nos botões visuais sem texto (setas, pílulas vermelho/azul e slots sem número), `:focus-visible`, `@media (prefers-reduced-motion: reduce)` e `@media (forced-colors: active)`.

### 18. *"Qual a diferença entre `:invalid` e `:user-invalid` no CSS?"*
> **Resposta:** `:invalid` já marca o campo `required` como vermelho assim que a página carrega antes mesmo da pessoa digitar qualquer coisa. `:user-invalid` só aplica o estilo de erro **depois** que o usuário interagiu com o campo e saiu dele ou tentou enviar inválido.

### 19. *"Para que servem os pseudo-elementos `::before` e `::after` usados aqui?"*
> **Resposta:** Para criar ornamentos visuais sem poluir o HTML com `<div>` vazias desnecessárias: as scanlines retro em `.painel-resultado::after`, as cantoneiras de mira em `.pokemon-imagem-box::before/.after`, o brilho do botão central `.dpad-miolo::after` e a costura/dobradiça na tampa.

### 20. *"Por que usar `Math.floor` / módulo `%` em `avancarProximoCenario()`?"*
> **Resposta:** `(indiceAtual + 1) % CENARIOS_IDS.length` faz o índice voltar a `0` automaticamente depois do último item (`(3 + 1) % 4 === 0`), criando um carrossel circular infinito sem precisar escrever `if (indice >= tamanho) indice = 0`.
