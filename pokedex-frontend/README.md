# Pokédex

Aplicação web desenvolvida com **HTML5**, **CSS3** e **JavaScript puro** no formato de **Pokédex 3D interativa** sobre 4 cenários Pokémon em alta resolução, consumindo em tempo real a API pública [PokéAPI](https://pokeapi.co/).

## Requisitos e Funcionalidades

- **Estrutura HTML semântica**:
  - Título principal (`<h1>`) com o nome do sistema (**Pokédex**).
  - Formulário (`<form>`) dentro de `<search>` com campo de texto (`<input type="text">`) e botão de pesquisa (`<button type="submit">`).
  - Área dedicada para exibição dos resultados (`#resultado-area`).
  - Lista HTML (`<ul>`) apresentando nome, número de identificação (ID), altura, peso e habilidades (*abilities*) obtidos da API.
- **Consumo de API pública (`fetch`)**:
  - Consulta dinâmica ao endpoint `https://pokeapi.co/api/v2/pokemon/NOME_DO_POKEMON` utilizando `fetch()`, `async/await` e `AbortController` (para cancelamento de buscas concorrentes e timeout).
  - Carregamento completo dos nomes disponíveis na PokéAPI via `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`, exibidos em uma lista selecionável dentro do módulo de busca com filtragem tolerante a erros de digitação (fonética e distância Damerau-Levenshtein).
  - Câmera ótica principal (frente na capa e verso na ala esquerda) com flashes vermelho/amarelo/verde reativos (`.is-scanning`) durante a busca na API.
  - Nenhum dado de Pokémon é cadastrado manualmente no código.
- **Controles Interativos da Pokédex**:
  - **Direcional (D-Pad) à esquerda e botão circular de seleção à direita**: navegam no estilo menu RPG pelas telas (`busca`, `lista`, `visor` e `slots`), itens do catálogo da PokéAPI (`.is-cursor`), botões de slot e campos de edição, confirmando pelo botão redondo ou pela tecla `Enter`.
  - **Botões centrais (vermelho e azul)**: no modo RPG, o botão azul entra na tela/submenu destacado e limpa o visor de resultados quando já está em uma tela sem submenu; o botão vermelho recua um nível do menu e limpa o formulário de busca quando está na raiz.
  - **10 botões de gravação rápida à direita + botão amarelo compacto**: sinalizam por cor se o slot está livre (azul) ou utilizado (verde), permitindo gravar/carregar com um clique ou abrir o editor no visor pelo botão amarelo para alterar nome/apelido ou remover registros salvos em `localStorage`.
- **Estilização CSS e Experiência Pokédex 3D**:
  - Uso explícito de `background-color`, `padding`, `margin` e `display: flex`.
  - **Cards giratórios em 3D (`preserve-3d`) sobrepostos com dimensões travadas**: a capa fechada e a ala esquerda (módulo de busca + lista) ocupam as duas faces do mesmo card giratório (`rotateY(-180deg)` no desktop / `rotateX(180deg)` no mobile) acima do card sólido do visor de resultados, mantendo as duas alas simétricas e com abertura/fechamento cadenciados.
  - **Proteção de scroll e fechamento intuitivo**: clicar e rolar dentro do visor de resultados (incluindo arraste pela barra de rolagem) não fecha o aparelho; clicar em partes externas às telas e controles ou pressionar `Escape` gira a tampa de volta.
  - **4 cenários em alta resolução** (`2500px` a `4096px`) em `assets/backgrounds/` com seletor discreto no canto superior direito e alternância automática configurável.
- **Tratamento de situações**:
  - Validação para campo vazio ou somente espaços.
  - Mensagem dedicada quando o Pokémon não é encontrado (HTTP `404`), com sugestões clicáveis *"Você quis dizer"* baseadas na lista da API.
  - Mensagem amigável com botão **Tentar novamente** quando ocorre falha de comunicação ou tempo limite excedido.

## Estrutura de Arquivos

```text
recuperacao-frontend/
├── assets/
│   ├── backgrounds/
│   └── favicon.svg
├── css/
│   └── style.css
├── js/
│   └── app.js
├── GUIA-DE-ESTUDOS-POKEDEX.md
├── index.html
└── README.md
```

## Como Executar

Não há dependências externas nem etapa de build:

1. Abra o arquivo `index.html` diretamente no navegador (ou utilize a extensão **Live Server** no VS Code).
2. Clique na **capa fechada da Pokédex** (ou pressione `Enter`) para abri-la no movimento 3D.
3. Digite o nome ou número de um Pokémon, use o direcional para navegar pela lista e pressione o botão circular à direita ou **Buscar Pokémon**; salve seus favoritos nas teclas azuis e gerencie-os pelo botão amarelo.
4. Para fechar e voltar a visualizar o cenário inteiro, clique em qualquer área da carcaça fora das telas e controles (ou fora da Pokédex) ou pressione `Escape`.
