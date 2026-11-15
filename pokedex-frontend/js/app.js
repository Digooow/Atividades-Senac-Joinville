"use strict";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEAPI_CATALOGO_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const TEMPO_LIMITE_MS = 10000;
const TEMPO_TROCA_CENARIO_MS = 12000;
const DURACAO_GIRO_POKEDEX_MS = 1260;
const TAMANHO_LOTE_CATALOGO = 150;
const MAX_RESULTADOS_FILTRADOS = 120;
const TOTAL_SLOTS_AZUIS = 10;
const TITULO_PADRAO = "Pokédex — Pesquisa de Pokémon";
const CENARIOS_IDS = ["hoenn", "cidade", "vila", "floresta"];
const CHAVE_CENARIO_SALVO = "pokedex_cenario_ativo";
const CHAVE_AUTO_SALVO = "pokedex_cenario_auto";
const CHAVE_SLOTS_SALVOS = "pokedex_slots_salvos";
const SELETOR_AREAS_INTERNAS_POKEDEX =
  ".painel-busca, .painel-resultado, .controle-interativo";
const SELETOR_AREAS_PRESERVADAS =
  `${SELETOR_AREAS_INTERNAS_POKEDEX}, .barra-cenarios, .rodape`;
const ATTR_ARIA_PRESSED = "aria-pressed";
const ATTR_ARIA_CURRENT = "aria-current";
const ATTR_ARIA_LABEL = "aria-label";
const ATTR_ARIA_DESCRIBEDBY = "aria-describedby";
const ATTR_ARIA_BUSY = "aria-busy";
const NOME_ERRO_ABORT = "AbortError";
const TIPO_FUNCAO = "function";
const MODO_CATALOGO_TODOS = "todos";
const NIVEL_TELAS = "telas";
const NIVEL_ITENS = "itens";
const NIVEL_EDICAO = "edicao";
const TELA_BUSCA = "busca";
const TELA_LISTA = "lista";
const TELA_VISOR = "visor";
const TELA_SLOTS = "slots";
const DIR_CIMA = "cima";
const DIR_BAIXO = "baixo";
const DIR_ESQUERDA = "esquerda";
const DIR_DIREITA = "direita";
const CLASSE_SCANNING = "is-scanning";
const CLASSE_ANIMANDO = "is-animando";
const CLASSE_TRANSICIONANDO = "is-transicionando";
const CLASSE_RPG_TELA = "is-rpg-tela-cursor";
const CLASSE_RPG_FOCO = "is-rpg-foco";
const CLASSE_VISOR_SELECIONANDO = "is-selecionando-pokemon";
const CLASSE_SLOT_FORM_INPUT = "slot-form-input";
const TIPO_ERRO_NAO_ENCONTRADO = "nao_encontrado";
const TIPO_ERRO_COMUNICACAO = "comunicacao";
const MAPA_PROXIMA_TELA_DESKTOP = {
  [TELA_BUSCA]: { [DIR_DIREITA]: TELA_VISOR, [DIR_BAIXO]: TELA_LISTA },
  [TELA_LISTA]: { [DIR_CIMA]: TELA_BUSCA, [DIR_DIREITA]: TELA_SLOTS },
  [TELA_VISOR]: { [DIR_ESQUERDA]: TELA_BUSCA, [DIR_BAIXO]: TELA_SLOTS },
  [TELA_SLOTS]: { [DIR_CIMA]: TELA_VISOR, [DIR_ESQUERDA]: TELA_LISTA }
};
const ORDEM_TELAS_MOBILE = [TELA_BUSCA, TELA_LISTA, TELA_VISOR, TELA_SLOTS];
const DESLOCAMENTO_LISTA = { [DIR_CIMA]: -1, [DIR_BAIXO]: 1, [DIR_ESQUERDA]: -5, [DIR_DIREITA]: 5 };
const MAPA_SETAS_TECLADO = {
  ArrowUp: DIR_CIMA,
  ArrowDown: DIR_BAIXO,
  ArrowLeft: DIR_ESQUERDA,
  ArrowRight: DIR_DIREITA
};

const pokedexAparelho = document.getElementById("pokedex-aparelho");
const tampaFrente = document.getElementById("tampa-frente");
const btnAbrirPokedex = document.getElementById("btn-abrir-pokedex");
const alaBase = document.getElementById("pokedex-ala-base");
const alaScanner = document.getElementById("pokedex-ala-scanner");
const painelBuscaForm = document.getElementById("painel-busca-form");
const pokemonCatalogoArea = document.getElementById("pokemon-catalogo-area");
const painelResultado = document.getElementById("resultado-area");
const pokedexRodapeDireito = document.getElementById("pokedex-rodape-direito");

const formPokedex = document.getElementById("form-pokedex");
const inputPokemon = document.getElementById("pokemon-input");
const btnBuscar = document.getElementById("btn-buscar");
const statusBadge = document.getElementById("status-badge");
const resultadoConteudo = document.getElementById("resultado-conteudo");

const catalogoLista = document.getElementById("pokemon-catalogo");
const catalogoStatus = document.getElementById("catalogo-status");
const btnRecarregarCatalogo = document.getElementById("btn-recarregar-catalogo");

const btnDpadCima = document.getElementById("btn-dpad-cima");
const btnDpadBaixo = document.getElementById("btn-dpad-baixo");
const btnDpadEsquerda = document.getElementById("btn-dpad-esquerda");
const btnDpadDireita = document.getElementById("btn-dpad-direita");
const btnControleSelecionar = document.getElementById("btn-controle-selecionar");
const btnLimparForm = document.getElementById("btn-limpar-form");
const btnLimparVisor = document.getElementById("btn-limpar-visor");
const botoesSlotsAzuis = [...document.querySelectorAll(".btn-slot-azul")];
const btnConfigSlots = document.getElementById("btn-config-slots");

const imagensCenario = [...document.querySelectorAll(".cenario-imagem")];
const botoesCenario = [...document.querySelectorAll(".btn-cenario")];
const btnAutoCenario = document.getElementById("btn-auto-cenario");

const anunciadorErroCampo = document.createElement("div");
anunciadorErroCampo.setAttribute("aria-live", "polite");
anunciadorErroCampo.className = "visually-hidden";
document.body.append(anunciadorErroCampo);

let controladorAtual = null;
let ultimaBuscaRealizada = "";
let pokemonAtivoNome = "";
let pokemonAtualDados = null;
let ultimoPayloadPokemon = null;
let temporizadorAnuncio = null;
let erroJaAnunciado = false;

let cenarioAtualId = CENARIOS_IDS[0];
let modoAutoAtivo = true;
let temporizadorCenario = null;
let alternandoTampa = false;
let temporizadorTampa = null;
let ponteiroIniciouEmAreaPreservada = false;

let catalogoPokemon = [];
let catalogoCarregado = false;
let catalogoCarregando = false;
let itensCatalogoVisiveis = [];
let limiteCatalogoAtual = TAMANHO_LOTE_CATALOGO;
let modoFiltroAtual = MODO_CATALOGO_TODOS;
let indiceCursorLista = 0;

function criarListaSlotsVazia() {
  return Array.from({ length: TOTAL_SLOTS_AZUIS }, () => null);
}

let slotsSalvos = criarListaSlotsVazia();
let configSlotsAberta = false;
let slotEmEdicao = -1;

let rpgNivel = NIVEL_TELAS;
let rpgTela = TELA_BUSCA;
const rpgIndices = { busca: 0, visor: 0, slots: 0, edicao: 0 };

function prefereMovimentoReduzido() {
  return Boolean(globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

function lerPreferencia(chave) {
  try {
    return globalThis.localStorage?.getItem(chave) ?? null;
  } catch {
    return null;
  }
}

function salvarPreferencia(chave, valor) {
  try {
    globalThis.localStorage?.setItem(chave, valor);
    return true;
  } catch {
    return false;
  }
}

function tratarRejeicaoInesperada(erro) {
  if (erro?.name === NOME_ERRO_ABORT) {
    return;
  }
  console.error(erro);
}

function pertenceArea(alvo, seletor) {
  return typeof alvo?.closest === TIPO_FUNCAO && Boolean(alvo.closest(seletor));
}

function aplicarCenario(cenarioId) {
  const idValido = CENARIOS_IDS.includes(cenarioId) ? cenarioId : CENARIOS_IDS[0];
  cenarioAtualId = idValido;

  for (const imagem of imagensCenario) {
    const ativa = imagem.dataset.cenarioId === idValido;
    imagem.classList.toggle("is-active", ativa);
  }

  for (const botao of botoesCenario) {
    const ativo = botao.dataset.cenario === idValido;
    botao.classList.toggle("is-active", ativo);
    botao.setAttribute(ATTR_ARIA_PRESSED, ativo ? "true" : "false");
  }

  salvarPreferencia(CHAVE_CENARIO_SALVO, idValido);
}

function avancarProximoCenario() {
  if (document.hidden) return;
  const indiceAtual = CENARIOS_IDS.indexOf(cenarioAtualId);
  const proximoIndice = (indiceAtual + 1) % CENARIOS_IDS.length;
  aplicarCenario(CENARIOS_IDS[proximoIndice]);
}

function sincronizarTemporizadorCenario() {
  clearInterval(temporizadorCenario);
  temporizadorCenario = null;

  if (modoAutoAtivo && !document.hidden) {
    temporizadorCenario = setInterval(avancarProximoCenario, TEMPO_TROCA_CENARIO_MS);
  }
}

function definirModoAuto(ativo) {
  modoAutoAtivo = Boolean(ativo);
  if (btnAutoCenario) {
    btnAutoCenario.setAttribute(ATTR_ARIA_PRESSED, modoAutoAtivo ? "true" : "false");
    btnAutoCenario.textContent = modoAutoAtivo ? "Auto: ON" : "Auto: OFF";
  }
  salvarPreferencia(CHAVE_AUTO_SALVO, modoAutoAtivo ? "true" : "false");
  sincronizarTemporizadorCenario();
}

function inicializarCenarios() {
  const cenarioSalvo = lerPreferencia(CHAVE_CENARIO_SALVO);
  const autoSalvo = lerPreferencia(CHAVE_AUTO_SALVO);

  aplicarCenario(cenarioSalvo ?? CENARIOS_IDS[0]);

  if (autoSalvo !== null) {
    definirModoAuto(autoSalvo === "true");
  } else {
    definirModoAuto(!prefereMovimentoReduzido());
  }
}

function executarGiroPokedex(alterarEstadoDom, aoFinalizar) {
  clearTimeout(temporizadorTampa);

  if (prefereMovimentoReduzido()) {
    pokedexAparelho.classList.remove(CLASSE_TRANSICIONANDO, CLASSE_ANIMANDO);
    alterarEstadoDom();
    alternandoTampa = false;
    aoFinalizar();
    return;
  }

  pokedexAparelho.classList.remove(CLASSE_TRANSICIONANDO);
  pokedexAparelho.classList.add(CLASSE_ANIMANDO);
  pokedexAparelho.getBoundingClientRect?.();
  pokedexAparelho.classList.add(CLASSE_TRANSICIONANDO);
  alterarEstadoDom();

  alternandoTampa = true;
  temporizadorTampa = setTimeout(() => {
    alternandoTampa = false;
    pokedexAparelho.classList.remove(CLASSE_TRANSICIONANDO, CLASSE_ANIMANDO);
    aoFinalizar();
  }, DURACAO_GIRO_POKEDEX_MS);
}

function aplicarEstadoAberturaDom(aberta) {
  if (tampaFrente) tampaFrente.inert = aberta;
  if (alaBase) alaBase.inert = !aberta;
  if (alaScanner) alaScanner.inert = !aberta;
  if (btnAbrirPokedex) {
    btnAbrirPokedex.disabled = aberta;
    btnAbrirPokedex.setAttribute("aria-expanded", String(aberta));
  }
  if (pokedexAparelho) {
    pokedexAparelho.dataset.aberta = String(aberta);
  }
}

function abrirPokedex(moverFoco = true) {
  if (!pokedexAparelho || alternandoTampa) {
    return;
  }
  if (pokedexAparelho.dataset.aberta === "true") {
    return;
  }

  garantirCatalogoCarregado().catch(tratarRejeicaoInesperada);
  rpgNivel = NIVEL_TELAS;
  rpgTela = TELA_BUSCA;

  executarGiroPokedex(
    () => aplicarEstadoAberturaDom(true),
    () => {
      sincronizarCursorRpg(false);
      if (moverFoco) {
        inputPokemon?.focus();
      }
    }
  );
}

function fecharPokedex(moverFoco = true) {
  if (pokedexAparelho?.dataset.aberta !== "true" || alternandoTampa) {
    return;
  }

  executarGiroPokedex(
    () => {
      aplicarEstadoAberturaDom(false);
      sincronizarCursorRpg(false);
    },
    () => {
      if (moverFoco) {
        btnAbrirPokedex?.focus();
      }
    }
  );
}

function normalizarNomePokemon(valor) {
  return valor.trim().toLowerCase().replaceAll(/\s+/g, "-");
}

function limparTextoComparacao(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, "");
}

function gerarChaveFonetica(texto) {
  return limparTextoComparacao(texto)
    .replaceAll("ph", "f")
    .replaceAll("ch", "x")
    .replaceAll("qu", "k")
    .replaceAll("y", "i")
    .replaceAll("w", "u")
    .replaceAll(/c(?=[ei])/g, "s")
    .replaceAll("z", "s")
    .replaceAll("k", "c")
    .replaceAll(/(.)\1+/g, "$1");
}

function calcularCelulaDamerau(dp, origem, destino, i, j) {
  const custo = origem[i - 1] === destino[j - 1] ? 0 : 1;
  let melhor = Math.min(
    dp[i - 1][j] + 1,
    dp[i][j - 1] + 1,
    dp[i - 1][j - 1] + custo
  );

  const houveTransposicao =
    i > 1 &&
    j > 1 &&
    origem[i - 1] === destino[j - 2] &&
    origem[i - 2] === destino[j - 1];

  if (houveTransposicao) {
    melhor = Math.min(melhor, dp[i - 2][j - 2] + custo);
  }

  return melhor;
}

function calcularDistanciaDamerau(origem, destino, limiteMaximo) {
  const m = origem.length;
  const n = destino.length;

  if (Math.abs(m - n) > limiteMaximo) {
    return limiteMaximo + 1;
  }

  const dp = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => 0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      dp[i][j] = calcularCelulaDamerau(dp, origem, destino, i, j);
    }
  }

  return dp[m][n];
}

function extrairIdDaUrl(url) {
  const match = /\/(\d+)\/?$/.exec(String(url ?? ""));
  return match ? Number(match[1]) : 0;
}

function formatarTextoApi(texto) {
  if (typeof texto !== "string" || !texto.trim()) {
    return "Não informado";
  }

  return texto
    .split("-")
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function criarCopiaCatalogoSemFiltro() {
  return {
    modo: MODO_CATALOGO_TODOS,
    itens: catalogoPokemon.map((item) => ({ ...item, aproximado: false }))
  };
}

function filtrarCatalogoPorNumero(consultaNumerica) {
  const idExato = Number(consultaNumerica);
  const idTexto = String(idExato);
  const matches = [];

  for (const pokemon of catalogoPokemon) {
    const strId = String(pokemon.id);
    if (pokemon.id === idExato) {
      matches.push({ ...pokemon, pontuacao: 0, aproximado: false });
    } else if (strId.startsWith(idTexto)) {
      matches.push({ ...pokemon, pontuacao: 100 + pokemon.id, aproximado: false });
    } else if (strId.includes(idTexto)) {
      matches.push({ ...pokemon, pontuacao: 200 + pokemon.id, aproximado: false });
    }
  }

  matches.sort((a, b) => a.pontuacao - b.pontuacao);
  return { modo: "exato", itens: matches.slice(0, MAX_RESULTADOS_FILTRADOS) };
}

function avaliarMatchExato(pokemon, ctx) {
  if (pokemon.name === ctx.normalizado || pokemon.compactName === ctx.compacto) {
    return { ...pokemon, pontuacao: 0, aproximado: false };
  }

  const bonusFormaBase = pokemon.name.includes("-") ? 20 : 0;
  if (pokemon.name.startsWith(ctx.normalizado) || pokemon.compactName.startsWith(ctx.compacto)) {
    return {
      ...pokemon,
      pontuacao: 100 + bonusFormaBase + Math.abs(pokemon.compactName.length - ctx.compacto.length),
      aproximado: false
    };
  }

  const posSubstring = pokemon.compactName.indexOf(ctx.compacto);
  if (posSubstring !== -1) {
    return {
      ...pokemon,
      pontuacao: 300 + posSubstring + bonusFormaBase,
      aproximado: false
    };
  }

  return null;
}

function avaliarMatchAproximado(pokemon, ctx) {
  if (ctx.fonetica.length >= 3 && pokemon.phoneticName === ctx.fonetica) {
    return { ...pokemon, pontuacao: 400 + pokemon.id, aproximado: true };
  }

  if (ctx.fonetica.length >= 3 && pokemon.phoneticName.startsWith(ctx.fonetica)) {
    return {
      ...pokemon,
      pontuacao: 500 + Math.abs(pokemon.phoneticName.length - ctx.fonetica.length),
      aproximado: true
    };
  }

  if (ctx.limiteDistancia <= 0) {
    return null;
  }

  const distRaw = calcularDistanciaDamerau(ctx.compacto, pokemon.compactName, ctx.limiteDistancia);
  const distFonetica = ctx.fonetica
    ? calcularDistanciaDamerau(ctx.fonetica, pokemon.phoneticName, ctx.limiteDistancia)
    : ctx.limiteDistancia + 1;
  const distMin = Math.min(distRaw, distFonetica);

  if (distMin > ctx.limiteDistancia) {
    return null;
  }

  const bonusFormaBase = pokemon.name.includes("-") ? 10 : 0;
  return {
    ...pokemon,
    pontuacao: 600 + distMin * 100 + bonusFormaBase + Math.abs(pokemon.compactName.length - ctx.compacto.length),
    aproximado: true
  };
}

function filtrarCatalogo(termoBruto) {
  const consulta = termoBruto.trim();
  if (!consulta) {
    return criarCopiaCatalogoSemFiltro();
  }

  const consultaNumerica = consulta.replace(/^#/, "");
  if (/^\d+$/.test(consultaNumerica)) {
    return filtrarCatalogoPorNumero(consultaNumerica);
  }

  const compacto = limparTextoComparacao(consulta);
  if (!compacto) {
    return criarCopiaCatalogoSemFiltro();
  }

  const limiteDistancia = compacto.length >= 3
    ? Math.min(4, Math.max(1, Math.floor(compacto.length * 0.45)))
    : 0;
  const ctx = {
    normalizado: normalizarNomePokemon(consulta),
    compacto,
    fonetica: gerarChaveFonetica(consulta),
    limiteDistancia
  };

  const exatos = [];
  const aproximados = [];

  for (const pokemon of catalogoPokemon) {
    const matchExato = avaliarMatchExato(pokemon, ctx);
    if (matchExato) {
      exatos.push(matchExato);
      continue;
    }

    const matchAproximado = avaliarMatchAproximado(pokemon, ctx);
    if (matchAproximado) {
      aproximados.push(matchAproximado);
    }
  }

  if (exatos.length > 0) {
    exatos.sort((a, b) => a.pontuacao - b.pontuacao || a.id - b.id);
    return { modo: "exato", itens: exatos.slice(0, MAX_RESULTADOS_FILTRADOS) };
  }

  aproximados.sort((a, b) => a.pontuacao - b.pontuacao || a.id - b.id);
  return { modo: "aproximado", itens: aproximados.slice(0, MAX_RESULTADOS_FILTRADOS) };
}

function buscarSugestoesAproximadas(termoBruto, quantidade = 4) {
  if (!catalogoCarregado || catalogoPokemon.length === 0) {
    return [];
  }
  const resultado = filtrarCatalogo(termoBruto);
  return resultado.itens.slice(0, quantidade);
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

function atualizarItemCatalogoVisual(li, idx, listaAtiva) {
  const botao = li.children?.[0];
  if (!botao?.dataset?.pokemonName) return null;

  const selecionado = Boolean(pokemonAtivoNome) && botao.dataset.pokemonName === pokemonAtivoNome;
  const comCursor = idx === indiceCursorLista;

  botao.classList.toggle("is-selecionado", selecionado);
  botao.classList.toggle("is-cursor", comCursor);
  botao.classList.toggle(CLASSE_RPG_FOCO, listaAtiva && comCursor);

  if (selecionado) {
    botao.setAttribute(ATTR_ARIA_CURRENT, "true");
  } else {
    botao.removeAttribute(ATTR_ARIA_CURRENT);
  }
  return comCursor ? botao : null;
}

function sincronizarEstadoLista(rolarParaCursor = false) {
  if (!catalogoLista?.children) return;

  let botaoCursor = null;
  const listaAtiva = rpgNivel === NIVEL_ITENS && rpgTela === TELA_LISTA;

  for (const [idx, li] of [...catalogoLista.children].entries()) {
    const destacado = atualizarItemCatalogoVisual(li, idx, listaAtiva);
    if (destacado) {
      botaoCursor = destacado;
    }
  }

  if (rolarParaCursor && typeof botaoCursor?.scrollIntoView === TIPO_FUNCAO) {
    botaoCursor.scrollIntoView({
      block: "nearest",
      behavior: prefereMovimentoReduzido() ? "auto" : "smooth"
    });
  }
}

function atualizarStatusCatalogo(totalVisivel) {
  if (!catalogoStatus) return;

  const termoAtual = inputPokemon?.value.trim() ?? "";
  if (!termoAtual) {
    catalogoStatus.textContent = `Todos os Pokémon (${catalogoPokemon.length})`;
    return;
  }
  if (totalVisivel === 0) {
    catalogoStatus.textContent = `Nenhum match para "${termoAtual}"`;
    return;
  }
  if (modoFiltroAtual === "aproximado") {
    catalogoStatus.textContent = `Sugestões aproximadas (${totalVisivel})`;
    return;
  }
  catalogoStatus.textContent = `${totalVisivel} Pokémon encontrados`;
}

function criarItemCatalogoLista(pokemon, indice) {
  const li = criarElemento("li", "catalogo-item-wrapper");
  const selecionado = pokemon.name === pokemonAtivoNome;
  const comCursor = indice === indiceCursorLista;
  const classes = ["catalogo-item"];
  if (comCursor) classes.push("is-cursor");
  if (selecionado) classes.push("is-selecionado");

  const botao = criarElemento("button", classes.join(" "));
  botao.type = "button";
  botao.dataset.pokemonName = pokemon.name;
  if (selecionado) {
    botao.setAttribute(ATTR_ARIA_CURRENT, "true");
  }

  const esquerda = criarElemento("span", "catalogo-item-esquerda");
  const badgeId = criarElemento(
    "span",
    "catalogo-item-id",
    pokemon.id > 0 ? `#${String(pokemon.id).padStart(4, "0")}` : "#----"
  );
  const nome = criarElemento("span", "catalogo-item-nome", pokemon.displayName);
  esquerda.append(badgeId, nome);
  botao.append(esquerda);

  if (pokemon.aproximado) {
    botao.append(criarElemento("span", "catalogo-item-tag", "Aproximado"));
  }

  botao.addEventListener("click", (evento) => {
    evento.stopPropagation?.();
    const jaDestacado =
      rpgNivel === NIVEL_ITENS && rpgTela === TELA_LISTA && indiceCursorLista === indice;
    rpgNivel = NIVEL_ITENS;
    rpgTela = TELA_LISTA;
    indiceCursorLista = indice;

    if (!jaDestacado && Number(evento?.detail ?? 1) < 2) {
      sincronizarCursorRpg(false);
      return;
    }

    if (inputPokemon) {
      inputPokemon.value = pokemon.name;
      atualizarEstadoValidacaoCampo(false, false);
    }
    executarPesquisa(pokemon.name).catch(tratarRejeicaoInesperada);
  });

  li.append(botao);
  return li;
}

function criarBotaoCarregarMais(restantes) {
  const liMais = criarElemento("li", "catalogo-item-wrapper");
  const btnMais = criarElemento(
    "button",
    "btn-catalogo-mais",
    `Carregar mais Pokémon (restam ${restantes})`
  );
  btnMais.type = "button";
  btnMais.addEventListener("click", (evento) => {
    evento.stopPropagation?.();
    limiteCatalogoAtual += TAMANHO_LOTE_CATALOGO;
    renderizarListaCatalogo();
  });
  liMais.append(btnMais);
  return liMais;
}

function renderizarListaCatalogo() {
  if (!catalogoLista || !catalogoCarregado) {
    return;
  }

  const totalVisivel = itensCatalogoVisiveis.length;
  atualizarStatusCatalogo(totalVisivel);

  if (totalVisivel === 0) {
    indiceCursorLista = 0;
    const avisoVazio = criarElemento(
      "li",
      "catalogo-vazio",
      "Nenhum Pokémon parecido foi localizado na lista. Você ainda pode pesquisar diretamente acima."
    );
    catalogoLista.replaceChildren(avisoVazio);
    return;
  }

  if (indiceCursorLista >= totalVisivel) {
    indiceCursorLista = 0;
  }

  const limiteEfetivo = modoFiltroAtual === MODO_CATALOGO_TODOS
    ? Math.min(limiteCatalogoAtual, totalVisivel)
    : totalVisivel;

  const elementos = [];
  for (let i = 0; i < limiteEfetivo; i += 1) {
    elementos.push(criarItemCatalogoLista(itensCatalogoVisiveis[i], i));
  }

  if (modoFiltroAtual === MODO_CATALOGO_TODOS && limiteEfetivo < totalVisivel) {
    elementos.push(criarBotaoCarregarMais(totalVisivel - limiteEfetivo));
  }

  catalogoLista.replaceChildren(...elementos);
}

function atualizarFiltroCatalogo() {
  if (!catalogoCarregado) return;
  limiteCatalogoAtual = TAMANHO_LOTE_CATALOGO;
  indiceCursorLista = 0;
  const resultado = filtrarCatalogo(inputPokemon?.value ?? "");
  modoFiltroAtual = resultado.modo;
  itensCatalogoVisiveis = resultado.itens;
  renderizarListaCatalogo();
}

async function moverCursorLista(deslocamento) {
  if (!catalogoCarregado) {
    await garantirCatalogoCarregado();
  }
  if (!catalogoCarregado || itensCatalogoVisiveis.length === 0) {
    return;
  }

  const totalDisponivel = itensCatalogoVisiveis.length;
  const proximoIndice = Math.max(0, Math.min(totalDisponivel - 1, indiceCursorLista + deslocamento));
  indiceCursorLista = proximoIndice;

  if (modoFiltroAtual === MODO_CATALOGO_TODOS && proximoIndice >= limiteCatalogoAtual) {
    limiteCatalogoAtual = Math.min(totalDisponivel, proximoIndice + TAMANHO_LOTE_CATALOGO);
    renderizarListaCatalogo();
    sincronizarEstadoLista(true);
    return;
  }

  sincronizarEstadoLista(true);
}

async function selecionarCursorAtual() {
  if (!catalogoCarregado) {
    await garantirCatalogoCarregado();
  }
  const alvo = itensCatalogoVisiveis[indiceCursorLista];
  if (!alvo) {
    inputPokemon?.focus();
    return;
  }

  if (inputPokemon) {
    inputPokemon.value = alvo.name;
    atualizarEstadoValidacaoCampo(false, false);
  }
  await executarPesquisa(alvo.name);
}

async function garantirCatalogoCarregado() {
  if (!catalogoLista || catalogoCarregado || catalogoCarregando) {
    return;
  }

  catalogoCarregando = true;
  if (btnRecarregarCatalogo) btnRecarregarCatalogo.hidden = true;
  if (catalogoStatus) catalogoStatus.textContent = "Carregando lista da PokéAPI...";

  try {
    const resposta = await fetch(POKEAPI_CATALOGO_URL);
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();
    const resultados = Array.isArray(dados?.results) ? dados.results : [];

    catalogoPokemon = resultados
      .filter((item) => typeof item?.name === "string" && item.name.trim())
      .map((item) => {
        const name = item.name.toLowerCase();
        return {
          name,
          displayName: formatarTextoApi(name),
          id: extrairIdDaUrl(item.url),
          compactName: limparTextoComparacao(name),
          phoneticName: gerarChaveFonetica(name)
        };
      });

    catalogoCarregado = true;
    atualizarFiltroCatalogo();
  } catch {
    if (catalogoStatus) {
      catalogoStatus.textContent = "Não foi possível carregar a lista completa agora.";
    }
    if (btnRecarregarCatalogo) {
      btnRecarregarCatalogo.hidden = false;
    }
  } finally {
    catalogoCarregando = false;
  }
}

function carregarSlotsSalvos() {
  const bruto = lerPreferencia(CHAVE_SLOTS_SALVOS);
  if (!bruto) {
    sincronizarSlotsAzuis();
    return;
  }

  try {
    const parsed = JSON.parse(bruto);
    if (Array.isArray(parsed)) {
      slotsSalvos = Array.from({ length: TOTAL_SLOTS_AZUIS }, (_, idx) => {
        const item = parsed[idx];
        if (typeof item !== "object" || typeof item?.name !== "string") {
          return null;
        }
        return {
          name: item.name.toLowerCase(),
          id: Number(item.id) || 0,
          displayName: typeof item.displayName === "string" && item.displayName
            ? item.displayName
            : formatarTextoApi(item.name),
          apelido: typeof item.apelido === "string" ? item.apelido : ""
        };
      });
    }
  } catch {
    slotsSalvos = criarListaSlotsVazia();
  }

  sincronizarSlotsAzuis();
}

function salvarSlotsNoStorage() {
  salvarPreferencia(CHAVE_SLOTS_SALVOS, JSON.stringify(slotsSalvos));
}

function sincronizarSlotsAzuis() {
  for (const [idx, botao] of botoesSlotsAzuis.entries()) {
    const slot = slotsSalvos[idx];
    const numeroPadrao = String(idx + 1).padStart(2, "0");
    botao.textContent = "";

    if (slot) {
      const ativo = Boolean(pokemonAtivoNome) && slot.name === pokemonAtivoNome;
      botao.classList.add("is-ocupado");
      botao.classList.toggle("is-ativo", ativo);
      const detalheNome = slot.apelido ? `${slot.apelido} (${slot.displayName})` : slot.displayName;
      botao.title = `Slot ${numeroPadrao} (utilizado): ${detalheNome} — clique para abrir`;
      botao.setAttribute(ATTR_ARIA_LABEL, `Slot ${numeroPadrao} utilizado: ${detalheNome}. Clique para exibir.`);
    } else {
      botao.classList.remove("is-ocupado", "is-ativo");
      botao.title = `Slot ${numeroPadrao} (livre) — clique para gravar o Pokémon exibido`;
      botao.setAttribute(ATTR_ARIA_LABEL, `Slot ${numeroPadrao} livre. Clique para gravar o Pokémon exibido.`);
    }
  }
}

function gravarPokemonNoSlot(indice, origemPokemon, apelidoOpcional = "") {
  if (indice < 0 || indice >= TOTAL_SLOTS_AZUIS || !origemPokemon) return;
  slotsSalvos[indice] = {
    name: origemPokemon.name,
    id: Number(origemPokemon.id) || 0,
    displayName: origemPokemon.displayName || formatarTextoApi(origemPokemon.name),
    apelido: apelidoOpcional.trim()
  };
  salvarSlotsNoStorage();
  sincronizarSlotsAzuis();
}

function removerSlotSalvo(indice) {
  if (indice < 0 || indice >= TOTAL_SLOTS_AZUIS) return;
  slotsSalvos[indice] = null;
  if (slotEmEdicao === indice) {
    slotEmEdicao = -1;
  }
  salvarSlotsNoStorage();
  sincronizarSlotsAzuis();
}

function fecharPainelConfigSlots() {
  if (!configSlotsAberta) return;
  configSlotsAberta = false;
  slotEmEdicao = -1;
  if (rpgNivel === NIVEL_EDICAO) {
    rpgNivel = NIVEL_ITENS;
  }
  btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "false");

  if (ultimoPayloadPokemon) {
    renderizarPokemon(ultimoPayloadPokemon);
  } else {
    atualizarBadgeStatus("Aguardando busca", "aguardando");
    renderizarEstadoVazioVisor();
  }
  sincronizarCursorRpg(false);
}

const CLASSE_BOTAO_SLOT = "btn-slot-acao";

function criarBotaoSlot(texto, aoClicar, perigo = false) {
  const classe = perigo ? `${CLASSE_BOTAO_SLOT} ${CLASSE_BOTAO_SLOT}--perigo` : CLASSE_BOTAO_SLOT;
  const botao = criarElemento("button", classe, texto);
  botao.type = "button";
  botao.addEventListener("click", (evento) => {
    evento.stopPropagation?.();
    aoClicar();
  });
  return botao;
}

async function salvarEdicaoSlot({ indice, slotAtual, inputNome, inputApelido, msgErro, btnSalvar }) {
  const novoTermo = normalizarNomePokemon(inputNome.value);
  const novoApelido = inputApelido.value.trim();

  if (!novoTermo) {
    msgErro.textContent = "Informe um nome ou ID válido da PokéAPI.";
    msgErro.hidden = false;
    return;
  }

  if (novoTermo === slotAtual.name) {
    gravarPokemonNoSlot(indice, slotAtual, novoApelido);
    slotEmEdicao = -1;
    rpgNivel = NIVEL_ITENS;
    renderizarConfiguracaoSlots();
    sincronizarCursorRpg(true);
    return;
  }

  btnSalvar.disabled = true;
  msgErro.hidden = true;
  try {
    const dadosApi = await buscarPokemonNaApi(novoTermo);
    gravarPokemonNoSlot(
      indice,
      {
        id: dadosApi.id,
        name: dadosApi.name.toLowerCase(),
        displayName: formatarTextoApi(dadosApi.name)
      },
      novoApelido
    );
    slotEmEdicao = -1;
    rpgNivel = NIVEL_ITENS;
    renderizarConfiguracaoSlots();
    sincronizarCursorRpg(true);
  } catch {
    msgErro.textContent = "Pokémon não encontrado na PokéAPI. Verifique o nome ou ID.";
    msgErro.hidden = false;
    btnSalvar.disabled = false;
  }
}

function criarFormularioEdicaoSlot(slot, idx) {
  const formEditar = criarElemento("form", "slot-form-editar");
  const campos = criarElemento("div", "slot-form-campos");

  const inputNomeSlot = criarElemento("input", CLASSE_SLOT_FORM_INPUT);
  inputNomeSlot.type = "text";
  inputNomeSlot.value = slot.name;
  inputNomeSlot.placeholder = "Nome ou ID na PokéAPI";
  inputNomeSlot.setAttribute(ATTR_ARIA_LABEL, `Nome ou ID da PokéAPI para o slot ${idx + 1}`);

  const inputApelidoSlot = criarElemento("input", CLASSE_SLOT_FORM_INPUT);
  inputApelidoSlot.type = "text";
  inputApelidoSlot.value = slot.apelido;
  inputApelidoSlot.placeholder = "Apelido opcional";
  inputApelidoSlot.setAttribute(ATTR_ARIA_LABEL, `Apelido opcional para o slot ${idx + 1}`);

  const msgErro = criarElemento("p", "slot-form-erro");
  msgErro.hidden = true;

  const btnSalvar = criarElemento("button", CLASSE_BOTAO_SLOT, "Salvar");
  btnSalvar.type = "submit";

  const btnCancelar = criarBotaoSlot("Cancelar", () => {
    slotEmEdicao = -1;
    rpgNivel = NIVEL_ITENS;
    renderizarConfiguracaoSlots();
    sincronizarCursorRpg(true);
  });

  formEditar.addEventListener("submit", (evento) => {
    evento.preventDefault();
    evento.stopPropagation?.();
    salvarEdicaoSlot({
      indice: idx,
      slotAtual: slot,
      inputNome: inputNomeSlot,
      inputApelido: inputApelidoSlot,
      msgErro,
      btnSalvar
    }).catch(tratarRejeicaoInesperada);
  });

  campos.append(inputNomeSlot, inputApelidoSlot, btnSalvar, btnCancelar);
  formEditar.append(campos, msgErro);
  return formEditar;
}

function criarBotoesAcaoSlot(slot, idx) {
  const botoes = criarElemento("div", "slot-config-botoes");

  if (slot) {
    const btnAbrir = criarBotaoSlot("Abrir", () => {
      configSlotsAberta = false;
      slotEmEdicao = -1;
      btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "false");
      if (inputPokemon) {
        inputPokemon.value = slot.name;
        atualizarEstadoValidacaoCampo(false, false);
      }
      executarPesquisa(slot.name).catch(tratarRejeicaoInesperada);
    });

    const btnEditar = criarBotaoSlot("Editar", () => {
      const abrindoEdicao = slotEmEdicao !== idx;
      slotEmEdicao = abrindoEdicao ? idx : -1;
      rpgTela = TELA_VISOR;
      rpgNivel = abrindoEdicao ? NIVEL_EDICAO : NIVEL_ITENS;
      rpgIndices.edicao = 0;
      renderizarConfiguracaoSlots();
      if (abrindoEdicao) {
        sincronizarCursorRpg(true);
      }
    });
    btnEditar.dataset.acaoSlot = "editar";

    const btnRemover = criarBotaoSlot(
      "Remover",
      () => {
        removerSlotSalvo(idx);
        renderizarConfiguracaoSlots();
      },
      true
    );

    botoes.append(btnAbrir, btnEditar, btnRemover);
    return botoes;
  }

  if (pokemonAtualDados) {
    const btnGravar = criarBotaoSlot(`Gravar ${pokemonAtualDados.displayName}`, () => {
      gravarPokemonNoSlot(idx, pokemonAtualDados);
      renderizarConfiguracaoSlots();
    });
    botoes.append(btnGravar);
  }

  return botoes;
}

function criarItemSlotConfiguracao(slot, idx) {
  const item = criarElemento("li", "slot-config-item");
  const linha = criarElemento("div", "slot-config-linha");

  const info = criarElemento("div", "slot-config-info");
  info.append(criarElemento("span", "slot-config-num", `#${String(idx + 1).padStart(2, "0")}`));

  if (slot) {
    const idSufixo = slot.id > 0 ? ` (#${String(slot.id).padStart(4, "0")})` : "";
    const textoNome = slot.apelido
      ? `${slot.apelido} — ${slot.displayName}`
      : `${slot.displayName}${idSufixo}`;
    info.append(criarElemento("span", "slot-config-nome", textoNome));
  } else {
    info.append(criarElemento("span", "slot-config-nome slot-config-nome--vazio", "Slot vazio"));
  }

  linha.append(info, criarBotoesAcaoSlot(slot, idx));
  item.append(linha);

  if (slot && slotEmEdicao === idx) {
    item.append(criarFormularioEdicaoSlot(slot, idx));
  }

  return item;
}

function renderizarConfiguracaoSlots() {
  if (!resultadoConteudo) return;

  configSlotsAberta = true;
  btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "true");
  atualizarBadgeStatus("Botões Azuis", "aviso");

  const painel = criarElemento("div", "slots-config-painel");
  const topo = criarElemento("div", "slots-config-topo");
  topo.append(criarElemento("h3", "slots-config-titulo", "Configurar Pokémon Salvos"));

  const acoesGlobais = criarElemento("div", "slots-config-acoes-globais");
  if (slotsSalvos.some(Boolean)) {
    const btnLimparTodos = criarBotaoSlot(
      "Limpar todos",
      () => {
        slotsSalvos = criarListaSlotsVazia();
        slotEmEdicao = -1;
        salvarSlotsNoStorage();
        sincronizarSlotsAzuis();
        renderizarConfiguracaoSlots();
      },
      true
    );
    acoesGlobais.append(btnLimparTodos);
  }

  acoesGlobais.append(criarBotaoSlot("Voltar ao visor", fecharPainelConfigSlots));
  topo.append(acoesGlobais);
  painel.append(topo);

  const lista = criarElemento("ul", "slots-config-lista");
  for (const [idx, slot] of slotsSalvos.entries()) {
    lista.append(criarItemSlotConfiguracao(slot, idx));
  }

  painel.append(lista);
  resultadoConteudo.replaceChildren(painel);
  sincronizarCursorRpg(false);
}

function formatarMedidaDecimal(valorApi, divisor, unidadePrincipal, unidadeOriginal) {
  if (typeof valorApi !== "number" || Number.isNaN(valorApi)) {
    return "Não informado";
  }

  const valorConvertido = (valorApi / divisor).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  return `${valorConvertido} ${unidadePrincipal} (${valorApi} ${unidadeOriginal})`;
}

function vincularErroAcessivel(campo, exibirErro) {
  const errorId = campo.dataset.error;
  if (!errorId) return;

  const idsAtuais = (campo.getAttribute(ATTR_ARIA_DESCRIBEDBY) ?? "")
    .split(/\s+/)
    .filter((id) => id && id !== errorId);

  if (exibirErro) {
    idsAtuais.push(errorId);
  }

  if (idsAtuais.length > 0) {
    campo.setAttribute(ATTR_ARIA_DESCRIBEDBY, idsAtuais.join(" "));
  } else {
    campo.removeAttribute(ATTR_ARIA_DESCRIBEDBY);
  }
}

function atualizarEstadoValidacaoCampo(forcarExibicao, anunciarParaLeitor) {
  const termoValido = normalizarNomePokemon(inputPokemon.value).length > 0;
  const invalidoNativo = inputPokemon.matches(":user-invalid");
  const mostrarErro = !termoValido && (forcarExibicao || invalidoNativo);

  inputPokemon.classList.toggle("user-invalid-fallback", mostrarErro);
  inputPokemon.setAttribute("aria-invalid", mostrarErro ? "true" : "false");
  vincularErroAcessivel(inputPokemon, mostrarErro);

  if (mostrarErro && anunciarParaLeitor && !erroJaAnunciado) {
    erroJaAnunciado = true;
    clearTimeout(temporizadorAnuncio);
    anunciadorErroCampo.textContent = "";
    temporizadorAnuncio = setTimeout(() => {
      anunciadorErroCampo.textContent =
        "Nome do Pokémon: Informe o nome de um Pokémon antes de pesquisar.";
    }, 450);
  }

  if (termoValido) {
    erroJaAnunciado = false;
    clearTimeout(temporizadorAnuncio);
    anunciadorErroCampo.textContent = "";
  }

  return termoValido;
}

function atualizarBadgeStatus(texto, variante) {
  statusBadge.textContent = texto;
  statusBadge.className = `status-badge status-badge--${variante}`;
}

function criarElementoSvg(tag, atributos) {
  const elemento = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [chave, valor] of Object.entries(atributos)) {
    elemento.setAttribute(chave, valor);
  }
  return elemento;
}

function renderizarEstadoVazioVisor() {
  if (!resultadoConteudo) return;
  const vazio = criarElemento("div", "estado-vazio");

  if (typeof document.createElementNS === TIPO_FUNCAO) {
    const estiloTraco = { fill: "none", stroke: "currentColor", "stroke-width": "4" };
    const icone = criarElementoSvg("svg", {
      class: "estado-icone",
      viewBox: "0 0 64 64",
      width: "44",
      height: "44",
      "aria-hidden": "true"
    });

    icone.append(
      criarElementoSvg("circle", { cx: "32", cy: "32", r: "28", ...estiloTraco }),
      criarElementoSvg("path", { d: "M4 32h20m16 0h20", ...estiloTraco }),
      criarElementoSvg("circle", { cx: "32", cy: "32", r: "8", ...estiloTraco })
    );
    vazio.append(icone);
  }

  vazio.append(
    criarElemento("h3", "", "Nenhum Pokémon no visor"),
    criarElemento(
      "p",
      "",
      "Pesquise um Pokémon no módulo de busca ao lado ou selecione um da lista para exibir os dados da PokéAPI aqui no visor."
    )
  );
  resultadoConteudo.replaceChildren(vazio);
}

function limparFormulario() {
  if (!inputPokemon) return;
  inputPokemon.value = "";
  atualizarEstadoValidacaoCampo(false, false);
  indiceCursorLista = 0;
  if (catalogoCarregado) {
    atualizarFiltroCatalogo();
  }
  inputPokemon.focus();
}

function limparVisorResultados() {
  if (controladorAtual) {
    controladorAtual.abort();
    controladorAtual = null;
  }

  ultimaBuscaRealizada = "";
  pokemonAtivoNome = "";
  pokemonAtualDados = null;
  ultimoPayloadPokemon = null;
  configSlotsAberta = false;
  slotEmEdicao = -1;

  btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "false");
  if (btnBuscar) {
    btnBuscar.disabled = false;
    btnBuscar.textContent = "Buscar Pokémon";
  }
  resultadoConteudo?.setAttribute(ATTR_ARIA_BUSY, "false");
  pokedexAparelho?.classList.remove(CLASSE_SCANNING);

  document.title = TITULO_PADRAO;
  atualizarBadgeStatus("Aguardando busca", "aguardando");
  renderizarEstadoVazioVisor();
  sincronizarEstadoLista(false);
  sincronizarSlotsAzuis();
}

function renderizarCarregando() {
  atualizarBadgeStatus("Buscando...", "carregando");
  resultadoConteudo.setAttribute(ATTR_ARIA_BUSY, "true");

  const card = criarElemento("div", "skeleton-card");
  card.setAttribute(ATTR_ARIA_LABEL, "Carregando dados do Pokémon na PokéAPI");

  const cabecalho = criarElemento("div", "skeleton-cabecalho");
  cabecalho.append(criarElemento("div", "skeleton-bloco skeleton-imagem"));

  const resumo = criarElemento("div", "skeleton-resumo");
  resumo.append(
    criarElemento("div", "skeleton-bloco skeleton-linha skeleton-linha--curta"),
    criarElemento("div", "skeleton-bloco skeleton-linha skeleton-linha--media"),
    criarElemento("div", "skeleton-bloco skeleton-linha skeleton-linha--curta")
  );
  cabecalho.append(resumo);

  const lista = criarElemento("div", "skeleton-lista");
  lista.append(...Array.from({ length: 5 }, () => criarElemento("div", "skeleton-bloco skeleton-item")));

  card.append(cabecalho, lista);
  resultadoConteudo.replaceChildren(card);
}

function renderizarMensagemErro({ tipo, titulo, descricao, permitirTentarNovamente, sugestoes = [] }) {
  const ehNaoEncontrado = tipo === TIPO_ERRO_NAO_ENCONTRADO;
  pokemonAtivoNome = "";
  pokemonAtualDados = null;
  ultimoPayloadPokemon = null;
  configSlotsAberta = false;
  btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "false");
  sincronizarEstadoLista(false);
  sincronizarSlotsAzuis();

  atualizarBadgeStatus(ehNaoEncontrado ? "Não encontrado" : "Erro na API", ehNaoEncontrado ? "aviso" : "erro");
  document.title = ehNaoEncontrado ? "Pokémon não encontrado | Pokédex" : "Erro de comunicação | Pokédex";

  const caixa = criarElemento(
    "div",
    `estado-alerta ${ehNaoEncontrado ? "estado-alerta--aviso" : "estado-alerta--erro"}`
  );

  if (!ehNaoEncontrado) {
    caixa.setAttribute("role", "alert");
  }

  const icone = criarElemento("span", "alerta-icone", ehNaoEncontrado ? "🔎" : "⚠️");
  icone.setAttribute("aria-hidden", "true");

  const heading = criarElemento("h3", "", titulo);
  const paragrafo = criarElemento("p", "", descricao);

  caixa.append(icone, heading, paragrafo);

  if (ehNaoEncontrado && sugestoes.length > 0) {
    const blocoSugestoes = criarElemento("div", "sugestoes-404");
    blocoSugestoes.append(criarElemento("span", "sugestoes-404-titulo", "Você quis dizer:"));
    const listaBotoes = criarElemento("div", "sugestoes-404-lista");

    for (const sugestao of sugestoes) {
      const prefixo = sugestao.id > 0 ? `#${String(sugestao.id).padStart(4, "0")} ` : "";
      const btnSugestao = criarElemento("button", "btn-sugestao", `${prefixo}${sugestao.displayName}`);
      btnSugestao.type = "button";
      btnSugestao.addEventListener("click", (evento) => {
        evento.stopPropagation?.();
        if (inputPokemon) {
          inputPokemon.value = sugestao.name;
          atualizarEstadoValidacaoCampo(false, false);
        }
        executarPesquisa(sugestao.name).catch(tratarRejeicaoInesperada);
      });
      listaBotoes.append(btnSugestao);
    }

    blocoSugestoes.append(listaBotoes);
    caixa.append(blocoSugestoes);
  }

  if (permitirTentarNovamente && ultimaBuscaRealizada) {
    const btnTentarNovamente = criarElemento("button", "btn-secundario", "Tentar novamente");
    btnTentarNovamente.type = "button";
    btnTentarNovamente.addEventListener("click", (evento) => {
      evento.stopPropagation?.();
      executarPesquisa(ultimaBuscaRealizada).catch(tratarRejeicaoInesperada);
    });
    caixa.append(btnTentarNovamente);
  }

  resultadoConteudo.replaceChildren(caixa);
  rpgIndices.visor = 0;
  sincronizarCursorRpg(false);
}

function criarItemDado(rotulo, valorTexto) {
  const item = criarElemento("li", "pokemon-dado-item");
  const spanRotulo = criarElemento("span", "dado-rotulo", rotulo);
  const spanValor = criarElemento("span", "dado-valor numero-tabular", valorTexto);
  item.append(spanRotulo, spanValor);
  return item;
}

function criarCaixaImagemPokemon(dados, nomeFormatado) {
  const caixaImagem = criarElemento("div", "pokemon-imagem-box");
  const artworkOficial = dados.sprites?.other?.["official-artwork"]?.front_default;
  const spritePadrao = dados.sprites?.front_default;
  const srcInicial = artworkOficial || spritePadrao;

  if (!srcInicial) {
    caixaImagem.append(criarElemento("p", "pokemon-imagem-fallback", "Imagem indisponível na API"));
    return caixaImagem;
  }

  const imagem = document.createElement("img");
  imagem.className = "pokemon-imagem";
  imagem.src = srcInicial;
  imagem.alt = `Ilustração oficial de ${nomeFormatado}`;
  imagem.width = 124;
  imagem.height = 124;
  imagem.setAttribute("fetchpriority", "high");

  let tentouFallback = false;
  imagem.addEventListener("error", () => {
    if (!tentouFallback && spritePadrao && imagem.src !== spritePadrao) {
      tentouFallback = true;
      imagem.src = spritePadrao;
      return;
    }

    caixaImagem.replaceChildren(
      criarElemento("p", "pokemon-imagem-fallback", "Não foi possível carregar a imagem")
    );
  });

  caixaImagem.append(imagem);
  return caixaImagem;
}

function criarListaTiposPokemon(tipos) {
  const listaTipos = criarElemento("ul", "pokemon-tipos");
  listaTipos.setAttribute(ATTR_ARIA_LABEL, "Tipos do Pokémon");

  for (const itemTipo of tipos) {
    const nomeTipo = formatarTextoApi(itemTipo?.type?.name);
    listaTipos.append(criarElemento("li", "tipo-badge", nomeTipo));
  }

  return listaTipos;
}

function criarCabecalhoPokemon(dados, nomeFormatado, idFormatado, tipos) {
  const cabecalho = criarElemento("div", "pokemon-cabecalho");
  const caixaImagem = criarCaixaImagemPokemon(dados, nomeFormatado);
  const resumo = criarElemento("div", "pokemon-resumo");

  resumo.append(
    criarElemento("span", "pokemon-id-destaque", idFormatado),
    criarElemento("h3", "pokemon-nome", nomeFormatado)
  );

  if (tipos.length > 0) {
    resumo.append(criarListaTiposPokemon(tipos));
  }

  cabecalho.append(caixaImagem, resumo);
  return cabecalho;
}

function criarItemHabilidadesPokemon(habilidades) {
  const itemHabilidades = criarElemento("li", "pokemon-dado-item pokemon-dado-item--habilidades");
  itemHabilidades.append(criarElemento("span", "dado-rotulo", "Habilidades (abilities):"));

  if (habilidades.length === 0) {
    itemHabilidades.append(criarElemento("span", "dado-valor", "Nenhuma habilidade informada pela API."));
    return itemHabilidades;
  }

  const listaHabilidades = criarElemento("ul", "lista-habilidades");
  for (const itemHabilidade of habilidades) {
    const nomeHabilidade = formatarTextoApi(itemHabilidade?.ability?.name);
    const sufixoOculta = itemHabilidade?.is_hidden ? " (oculta)" : "";
    listaHabilidades.append(criarElemento("li", "habilidade-item", `${nomeHabilidade}${sufixoOculta}`));
  }

  itemHabilidades.append(listaHabilidades);
  return itemHabilidades;
}

function sincronizarPosicaoCatalogo(nomePokemon) {
  if (!nomePokemon || !catalogoCarregado) {
    sincronizarEstadoLista(false);
    return;
  }

  const idxEncontrado = itensCatalogoVisiveis.findIndex((item) => item.name === nomePokemon);
  if (idxEncontrado < 0) {
    sincronizarEstadoLista(false);
    return;
  }

  indiceCursorLista = idxEncontrado;
  if (modoFiltroAtual === MODO_CATALOGO_TODOS && idxEncontrado >= limiteCatalogoAtual) {
    limiteCatalogoAtual = Math.min(itensCatalogoVisiveis.length, idxEncontrado + TAMANHO_LOTE_CATALOGO);
    renderizarListaCatalogo();
  }
  sincronizarEstadoLista(true);
}

function renderizarPokemon(dados) {
  const nomeFormatado = formatarTextoApi(dados.name);
  const idNumero = dados.id;
  const idFormatado = `#${String(idNumero).padStart(4, "0")}`;
  const alturaFormatada = formatarMedidaDecimal(dados.height, 10, "m", "dm");
  const pesoFormatado = formatarMedidaDecimal(dados.weight, 10, "kg", "hg");
  const habilidades = Array.isArray(dados.abilities) ? dados.abilities : [];
  const tipos = Array.isArray(dados.types) ? dados.types : [];

  pokemonAtivoNome = typeof dados.name === "string" ? dados.name.toLowerCase() : "";
  pokemonAtualDados = {
    id: Number(idNumero) || 0,
    name: pokemonAtivoNome,
    displayName: nomeFormatado
  };
  ultimoPayloadPokemon = dados;
  configSlotsAberta = false;
  if (rpgNivel === NIVEL_EDICAO) {
    rpgNivel = NIVEL_ITENS;
  }
  btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "false");
  sincronizarPosicaoCatalogo(pokemonAtivoNome);
  sincronizarSlotsAzuis();

  atualizarBadgeStatus("Encontrado", "sucesso");
  document.title = `${nomeFormatado} (${idFormatado}) | Pokédex`;

  const ficha = criarElemento("article", "pokemon-ficha");
  const cabecalho = criarCabecalhoPokemon(dados, nomeFormatado, idFormatado, tipos);

  const listaDados = criarElemento("ul", "pokemon-lista-dados");
  listaDados.id = "pokemon-dados";
  listaDados.setAttribute(ATTR_ARIA_LABEL, "Dados do Pokémon");

  listaDados.append(
    criarItemDado("Nome:", nomeFormatado),
    criarItemDado("Número de identificação (ID):", `${idFormatado} (${idNumero})`),
    criarItemDado("Altura:", alturaFormatada),
    criarItemDado("Peso:", pesoFormatado),
    criarItemHabilidadesPokemon(habilidades)
  );

  ficha.append(cabecalho, listaDados);
  resultadoConteudo.replaceChildren(ficha);
  rpgIndices.visor = 0;
  sincronizarCursorRpg(false);
}

class ErroApi extends Error {
  constructor(mensagem, tipo = TIPO_ERRO_COMUNICACAO, status = null) {
    super(mensagem);
    this.name = "ErroApi";
    this.tipo = tipo;
    this.status = status;
  }
}

async function buscarPokemonNaApi(nomeNormalizado, signal) {
  const url = `${POKEAPI_BASE_URL}${encodeURIComponent(nomeNormalizado)}`;
  const resposta = await fetch(url, signal ? { signal } : undefined);

  if (resposta.status === 404) {
    throw new ErroApi("Pokémon não encontrado", TIPO_ERRO_NAO_ENCONTRADO, 404);
  }

  if (!resposta.ok) {
    throw new ErroApi(`Erro HTTP ${resposta.status}`, TIPO_ERRO_COMUNICACAO, resposta.status);
  }

  const dados = await resposta.json();

  if (typeof dados !== "object" || typeof dados?.name !== "string" || typeof dados?.id !== "number") {
    throw new ErroApi("Formato de resposta inesperado da API", TIPO_ERRO_COMUNICACAO);
  }

  return dados;
}

function tratarErroPesquisa(erro, termoLimpo, expirouPorTempo) {
  if (erro?.name === NOME_ERRO_ABORT && !expirouPorTempo) {
    return;
  }

  if (erro?.tipo === TIPO_ERRO_NAO_ENCONTRADO) {
    renderizarMensagemErro({
      tipo: TIPO_ERRO_NAO_ENCONTRADO,
      titulo: "Pokémon não encontrado",
      descricao: `Não encontramos nenhum Pokémon com o nome "${termoLimpo}". Verifique a ortografia ou escolha uma sugestão na lista ao lado.`,
      permitirTentarNovamente: false,
      sugestoes: buscarSugestoesAproximadas(termoLimpo, 4)
    });
    return;
  }

  const detalheStatus = erro?.status ? ` (código HTTP ${erro.status})` : "";
  const mensagemConexao = expirouPorTempo
    ? "A PokéAPI demorou mais que o esperado para responder. Verifique sua conexão com a internet e tente novamente."
    : `Não foi possível concluir a comunicação com a PokéAPI no momento${detalheStatus}. Verifique sua conexão com a internet e tente novamente.`;

  renderizarMensagemErro({
    tipo: TIPO_ERRO_COMUNICACAO,
    titulo: "Erro na comunicação com a API",
    descricao: mensagemConexao,
    permitirTentarNovamente: true
  });
}

async function executarPesquisa(termoDigitado) {
  const termoLimpo = termoDigitado.trim();
  const nomeNormalizado = normalizarNomePokemon(termoLimpo);

  if (!nomeNormalizado) {
    atualizarEstadoValidacaoCampo(true, false);
    inputPokemon.focus();
    return;
  }

  ultimaBuscaRealizada = termoLimpo;
  configSlotsAberta = false;
  btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "false");

  controladorAtual?.abort();

  const controller = new AbortController();
  controladorAtual = controller;
  let expirouPorTempo = false;

  const temporizador = setTimeout(() => {
    expirouPorTempo = true;
    controller.abort();
  }, TEMPO_LIMITE_MS);

  btnBuscar.disabled = true;
  btnBuscar.textContent = "Buscando...";
  pokedexAparelho?.classList.add(CLASSE_SCANNING);
  renderizarCarregando();

  try {
    const dadosPokemon = await buscarPokemonNaApi(nomeNormalizado, controller.signal);
    if (controladorAtual !== controller) return;
    renderizarPokemon(dadosPokemon);
  } catch (error_) {
    tratarErroPesquisa(error_, termoLimpo, expirouPorTempo);
  } finally {
    clearTimeout(temporizador);
    if (controladorAtual === controller) {
      controladorAtual = null;
      btnBuscar.disabled = false;
      btnBuscar.textContent = "Buscar Pokémon";
      resultadoConteudo.setAttribute(ATTR_ARIA_BUSY, "false");
      pokedexAparelho?.classList.remove(CLASSE_SCANNING);
    }
  }
}

function estaModoDesktopRpg() {
  return globalThis.matchMedia?.("(min-width: 880px)").matches ?? true;
}

function coletarControlesInterativos(raiz, incluirInputs = false) {
  if (!raiz) return [];
  const lista = [];
  const percorrer = (no) => {
    if (!no) return;
    if (no.hidden) return;
    const tag = no.tagName?.toUpperCase?.() ?? "";
    const ehBotao = tag === "BUTTON" && !no.disabled;
    const ehInput = incluirInputs && tag === "INPUT" && !no.disabled;
    if (ehBotao || ehInput) {
      lista.push(no);
    }
    for (const filho of no.children ?? []) {
      percorrer(filho);
    }
  };
  percorrer(raiz);
  return lista;
}

function obterFormularioEdicaoAtivo() {
  if (!resultadoConteudo || !configSlotsAberta || slotEmEdicao < 0) {
    return null;
  }
  const fila = [resultadoConteudo];
  while (fila.length > 0) {
    const atual = fila.shift();
    if (atual?.classList?.contains("slot-form-editar")) {
      return atual;
    }
    fila.push(...(atual?.children ?? []));
  }
  return null;
}

function obterControlesTelaAtual() {
  if (rpgNivel === NIVEL_EDICAO) {
    return coletarControlesInterativos(obterFormularioEdicaoAtivo(), true);
  }
  if (rpgTela === TELA_BUSCA) {
    return [
      inputPokemon,
      btnBuscar,
      ...(btnRecarregarCatalogo?.hidden ? [] : [btnRecarregarCatalogo])
    ].filter(Boolean);
  }
  if (rpgTela === TELA_SLOTS) {
    return [...botoesSlotsAzuis, btnConfigSlots].filter(Boolean);
  }
  if (rpgTela === TELA_VISOR) {
    return coletarControlesInterativos(resultadoConteudo, false);
  }
  return [];
}

function obterElementoTela(telaId) {
  const mapaTelas = {
    [TELA_BUSCA]: painelBuscaForm,
    [TELA_LISTA]: pokemonCatalogoArea,
    [TELA_VISOR]: painelResultado,
    [TELA_SLOTS]: pokedexRodapeDireito
  };
  return mapaTelas[telaId] ?? null;
}

function limparRealcesRpg() {
  for (const tela of [painelBuscaForm, pokemonCatalogoArea, painelResultado, pokedexRodapeDireito]) {
    tela?.classList.remove(CLASSE_RPG_TELA);
  }
  painelResultado?.classList.remove(CLASSE_VISOR_SELECIONANDO);
  for (const controle of coletarControlesInterativos(pokedexAparelho, true)) {
    controle.classList.remove(CLASSE_RPG_FOCO);
  }
}

function controleAtualAbreSubmenu() {
  if (rpgNivel === NIVEL_TELAS) return true;
  if (rpgNivel === NIVEL_ITENS && rpgTela === TELA_SLOTS) {
    return rpgIndices.slots === TOTAL_SLOTS_AZUIS;
  }
  if (rpgNivel === NIVEL_ITENS && rpgTela === TELA_VISOR) {
    const alvo = obterControlesTelaAtual()[rpgIndices.visor];
    return alvo?.dataset?.acaoSlot === "editar";
  }
  return false;
}

function sincronizarTooltipsFenda() {
  if (btnLimparForm) {
    btnLimparForm.title = rpgNivel === NIVEL_TELAS
      ? "Botão vermelho: limpar campo de busca"
      : "Botão vermelho: voltar menu/tela (na raiz, limpa a busca)";
  }
  if (btnLimparVisor) {
    btnLimparVisor.title = controleAtualAbreSubmenu()
      ? "Botão azul: entrar no menu destacado"
      : "Botão azul: limpar visor de resultados";
  }
}

function aplicarFocoElementoRpg(elemento) {
  if (!elemento) return;
  elemento.classList.add(CLASSE_RPG_FOCO);
  elemento.scrollIntoView?.({
    block: "nearest",
    behavior: prefereMovimentoReduzido() ? "auto" : "smooth"
  });
  if (elemento !== inputPokemon && typeof elemento.focus === TIPO_FUNCAO) {
    elemento.focus({ preventScroll: true });
  }
}

function sincronizarCursorRpg(moverFocoDom = false) {
  limparRealcesRpg();

  if (pokedexAparelho?.dataset.aberta !== "true") {
    sincronizarTooltipsFenda();
    return;
  }

  if (rpgNivel === NIVEL_TELAS) {
    obterElementoTela(rpgTela)?.classList.add(CLASSE_RPG_TELA);
    sincronizarTooltipsFenda();
    return;
  }

  if (rpgTela === TELA_LISTA) {
    painelResultado?.classList.add(CLASSE_VISOR_SELECIONANDO);
    sincronizarEstadoLista(moverFocoDom);
    const botaoLista = catalogoLista?.children?.[indiceCursorLista]?.children?.[0];
    if (moverFocoDom && botaoLista) {
      botaoLista.focus?.({ preventScroll: true });
    }
    sincronizarTooltipsFenda();
    return;
  }

  const controles = obterControlesTelaAtual();
  const chave = rpgNivel === NIVEL_EDICAO ? NIVEL_EDICAO : rpgTela;

  if (controles.length === 0) {
    obterElementoTela(rpgTela)?.classList.add(CLASSE_RPG_TELA);
    sincronizarTooltipsFenda();
    return;
  }

  const indiceSeguro = Math.max(0, Math.min(controles.length - 1, rpgIndices[chave] ?? 0));
  rpgIndices[chave] = indiceSeguro;
  const alvo = controles[indiceSeguro];

  if (moverFocoDom) {
    aplicarFocoElementoRpg(alvo);
    if (alvo === inputPokemon) {
      inputPokemon.focus();
    }
  } else {
    alvo.classList.add(CLASSE_RPG_FOCO);
  }
  sincronizarTooltipsFenda();
}

function entrarTelaRpg(telaId) {
  rpgTela = telaId;
  rpgNivel = NIVEL_ITENS;
  if (telaId === TELA_LISTA) {
    garantirCatalogoCarregado().catch(tratarRejeicaoInesperada);
  }
  sincronizarCursorRpg(true);
}

function ativarSlotAzul(idx) {
  const slot = slotsSalvos[idx];
  rpgNivel = NIVEL_ITENS;
  rpgTela = TELA_SLOTS;
  rpgIndices.slots = idx;

  if (slot) {
    configSlotsAberta = false;
    btnConfigSlots?.setAttribute(ATTR_ARIA_PRESSED, "false");
    if (inputPokemon) {
      inputPokemon.value = slot.name;
      atualizarEstadoValidacaoCampo(false, false);
    }
    executarPesquisa(slot.name).catch(tratarRejeicaoInesperada);
    sincronizarCursorRpg(false);
    return;
  }

  if (pokemonAtualDados) {
    gravarPokemonNoSlot(idx, pokemonAtualDados);
    atualizarBadgeStatus(`Salvo no slot ${String(idx + 1).padStart(2, "0")}`, "sucesso");
    if (configSlotsAberta) {
      renderizarConfiguracaoSlots();
    }
    sincronizarCursorRpg(false);
    return;
  }

  atualizarBadgeStatus("Busque p/ gravar", "aviso");
  sincronizarCursorRpg(false);
}

function abrirOuAlternarConfigSlotsRpg(moverFocoParaVisor = false) {
  if (configSlotsAberta) {
    fecharPainelConfigSlots();
    rpgTela = TELA_SLOTS;
    rpgNivel = NIVEL_ITENS;
    rpgIndices.slots = TOTAL_SLOTS_AZUIS;
    sincronizarCursorRpg(moverFocoParaVisor);
    return;
  }

  renderizarConfiguracaoSlots();
  rpgTela = TELA_VISOR;
  rpgNivel = NIVEL_ITENS;
  rpgIndices.visor = 0;
  sincronizarCursorRpg(moverFocoParaVisor);
}

function calcularProximoIndiceSlots(atual, direcao) {
  if (direcao === DIR_ESQUERDA) return Math.max(0, atual - 1);
  if (direcao === DIR_DIREITA) return Math.min(TOTAL_SLOTS_AZUIS, atual + 1);
  if (direcao === DIR_BAIXO) {
    return Math.min(TOTAL_SLOTS_AZUIS, atual + 5);
  }
  if (atual >= TOTAL_SLOTS_AZUIS) return 5;
  if (atual < 5) return atual;
  return atual - 5;
}

function navegarEntreTelasRpg(direcao) {
  if (estaModoDesktopRpg()) {
    const proxima = MAPA_PROXIMA_TELA_DESKTOP[rpgTela]?.[direcao];
    if (proxima) {
      rpgTela = proxima;
    }
    sincronizarCursorRpg(false);
    return;
  }

  const passo = direcao === DIR_CIMA || direcao === DIR_ESQUERDA ? -1 : 1;
  const idxAtual = ORDEM_TELAS_MOBILE.indexOf(rpgTela);
  const proximoIdx = Math.max(0, Math.min(ORDEM_TELAS_MOBILE.length - 1, idxAtual + passo));
  rpgTela = ORDEM_TELAS_MOBILE[proximoIdx];
  sincronizarCursorRpg(false);
}

function rolarVisorResultadoRpg(direcao) {
  if (!resultadoConteudo) return;
  if (direcao === DIR_BAIXO) {
    resultadoConteudo.scrollTop += 72;
  } else if (direcao === DIR_CIMA) {
    resultadoConteudo.scrollTop -= 72;
  }
}

function navegarRpg(direcao) {
  if (!direcao) return;

  if (rpgNivel === NIVEL_TELAS) {
    navegarEntreTelasRpg(direcao);
    return;
  }

  if (rpgNivel === NIVEL_ITENS && rpgTela === TELA_LISTA) {
    moverCursorLista(DESLOCAMENTO_LISTA[direcao] ?? 0).catch(tratarRejeicaoInesperada);
    sincronizarTooltipsFenda();
    return;
  }

  if (rpgNivel === NIVEL_ITENS && rpgTela === TELA_SLOTS) {
    rpgIndices.slots = calcularProximoIndiceSlots(rpgIndices.slots, direcao);
    sincronizarCursorRpg(true);
    return;
  }

  const controles = obterControlesTelaAtual();
  if (rpgNivel === NIVEL_ITENS && rpgTela === TELA_VISOR && controles.length === 0) {
    rolarVisorResultadoRpg(direcao);
    return;
  }

  const chave = rpgNivel === NIVEL_EDICAO ? NIVEL_EDICAO : rpgTela;
  const passo = direcao === DIR_CIMA || direcao === DIR_ESQUERDA ? -1 : 1;
  const maximo = Math.max(0, controles.length - 1);
  rpgIndices[chave] = Math.max(0, Math.min(maximo, (rpgIndices[chave] ?? 0) + passo));
  sincronizarCursorRpg(true);
}

function voltarMenuRpg() {
  if (rpgNivel === NIVEL_EDICAO) {
    slotEmEdicao = -1;
    rpgNivel = NIVEL_ITENS;
    rpgTela = TELA_VISOR;
    renderizarConfiguracaoSlots();
    sincronizarCursorRpg(true);
    return;
  }

  if (rpgNivel === NIVEL_ITENS) {
    inputPokemon?.blur?.();
    rpgNivel = NIVEL_TELAS;
    sincronizarCursorRpg(false);
    return;
  }

  limparFormulario();
  sincronizarCursorRpg(false);
}

function confirmarElementoControle(alvo) {
  if (!alvo) return;
  if (alvo === inputPokemon) {
    if (inputPokemon.value.trim()) {
      executarPesquisa(inputPokemon.value).catch(tratarRejeicaoInesperada);
    } else {
      inputPokemon.focus();
    }
    return;
  }
  if (alvo === btnConfigSlots) {
    abrirOuAlternarConfigSlotsRpg(true);
    return;
  }
  if (alvo.dataset?.slotIndex !== undefined) {
    ativarSlotAzul(Number(alvo.dataset.slotIndex));
    return;
  }
  if (typeof alvo.click === TIPO_FUNCAO) {
    alvo.click();
  } else {
    alvo.dispatchEvent?.({ type: "click" });
  }
}

function avancarOuLimparVisorRpg() {
  if (rpgNivel === NIVEL_TELAS) {
    entrarTelaRpg(rpgTela);
    return;
  }
  if (controleAtualAbreSubmenu()) {
    const alvo = obterControlesTelaAtual()[rpgIndices[rpgTela]];
    confirmarElementoControle(alvo);
    return;
  }
  limparVisorResultados();
  sincronizarCursorRpg(false);
}

function confirmarCursorRpg() {
  if (rpgNivel === NIVEL_TELAS) {
    entrarTelaRpg(rpgTela);
    return;
  }

  if (rpgNivel === NIVEL_ITENS && rpgTela === TELA_LISTA) {
    selecionarCursorAtual().catch(tratarRejeicaoInesperada);
    return;
  }

  const controles = obterControlesTelaAtual();
  const chave = rpgNivel === NIVEL_EDICAO ? NIVEL_EDICAO : rpgTela;
  const alvo = controles[rpgIndices[chave]];
  if (!alvo) return;

  if (rpgNivel === NIVEL_EDICAO && alvo !== controles[3]) {
    const formAtivo = obterFormularioEdicaoAtivo();
    formAtivo?.dispatchEvent?.({ type: "submit", preventDefault() {}, stopPropagation() {} });
    return;
  }

  confirmarElementoControle(alvo);
}

function tratarTeclaEmInput(evento, direcao) {
  const alvo = evento.target;
  if (alvo === inputPokemon) {
    if (!direcao) return;
    if (rpgNivel === NIVEL_TELAS && !inputPokemon.value) {
      evento.preventDefault();
      inputPokemon.blur?.();
      navegarRpg(direcao);
      return;
    }
    if (direcao === DIR_BAIXO) {
      evento.preventDefault();
      inputPokemon.blur?.();
      entrarTelaRpg(TELA_LISTA);
      return;
    }
    if (direcao === DIR_CIMA) {
      evento.preventDefault();
      inputPokemon.blur?.();
      rpgNivel = NIVEL_TELAS;
      rpgTela = TELA_BUSCA;
      sincronizarCursorRpg(false);
    }
    return;
  }

  if (alvo?.classList?.contains(CLASSE_SLOT_FORM_INPUT) && (direcao === DIR_CIMA || direcao === DIR_BAIXO)) {
    evento.preventDefault();
    navegarRpg(direcao);
  }
}

function deveIgnorarEnterTeclado(alvo) {
  const controlesProprios = [
    btnDpadCima,
    btnDpadBaixo,
    btnDpadEsquerda,
    btnDpadDireita,
    btnControleSelecionar,
    btnLimparForm,
    btnLimparVisor,
    btnAbrirPokedex,
    btnAutoCenario,
    ...botoesCenario
  ];
  return controlesProprios.includes(alvo) || alvo?.tagName === "A";
}

function registrarInicioPonteiro(evento) {
  ponteiroIniciouEmAreaPreservada = pertenceArea(evento?.target, SELETOR_AREAS_PRESERVADAS);
}

document.addEventListener("pointerdown", registrarInicioPonteiro);
document.addEventListener("mousedown", registrarInicioPonteiro);

if (pokedexAparelho) {
  pokedexAparelho.addEventListener("click", (evento) => {
    if (alternandoTampa) return;

    const estaAberta = pokedexAparelho.dataset.aberta === "true";
    if (!estaAberta) {
      evento.stopPropagation?.();
      ponteiroIniciouEmAreaPreservada = false;
      abrirPokedex(true);
      return;
    }

    const alvo = evento.target;
    const iniciouPreservado = ponteiroIniciouEmAreaPreservada;
    ponteiroIniciouEmAreaPreservada = false;

    if (
      iniciouPreservado ||
      alvo?.isConnected === false ||
      pertenceArea(alvo, SELETOR_AREAS_INTERNAS_POKEDEX)
    ) {
      return;
    }

    evento.stopPropagation?.();
    fecharPokedex(true);
  });
}

document.addEventListener("click", (evento) => {
  const iniciouPreservado = ponteiroIniciouEmAreaPreservada;
  ponteiroIniciouEmAreaPreservada = false;

  if (pokedexAparelho?.dataset.aberta !== "true" || alternandoTampa) {
    return;
  }

  const alvo = evento.target;
  if (iniciouPreservado || alvo?.isConnected === false) {
    return;
  }

  if (!pertenceArea(alvo, SELETOR_AREAS_PRESERVADAS)) {
    fecharPokedex(true);
  }
});

document.addEventListener("keydown", (evento) => {
  if (pokedexAparelho?.dataset.aberta !== "true") {
    return;
  }

  if (evento.key === "Escape") {
    fecharPokedex(true);
    return;
  }

  const direcao = MAPA_SETAS_TECLADO[evento.key];
  const alvo = evento.target;

  if (alvo?.tagName === "INPUT") {
    tratarTeclaEmInput(evento, direcao);
    return;
  }

  if (direcao) {
    evento.preventDefault();
    navegarRpg(direcao);
    return;
  }

  if (evento.key === "Enter" && !deveIgnorarEnterTeclado(alvo)) {
    evento.preventDefault();
    confirmarCursorRpg();
    return;
  }

  if (evento.key === "Backspace") {
    evento.preventDefault();
    voltarMenuRpg();
  }
});

for (const botao of botoesCenario) {
  botao.addEventListener("click", () => {
    aplicarCenario(botao.dataset.cenario);
    definirModoAuto(false);
  });
}

if (btnAutoCenario) {
  btnAutoCenario.addEventListener("click", () => {
    const proximoEstado = !modoAutoAtivo;
    definirModoAuto(proximoEstado);
    if (proximoEstado) {
      avancarProximoCenario();
    }
  });
}

if (btnRecarregarCatalogo) {
  btnRecarregarCatalogo.addEventListener("click", (evento) => {
    evento.stopPropagation?.();
    garantirCatalogoCarregado().catch(tratarRejeicaoInesperada);
  });
}

if (catalogoLista) {
  catalogoLista.addEventListener("scroll", () => {
    if (!catalogoCarregado || modoFiltroAtual !== MODO_CATALOGO_TODOS) return;
    if (limiteCatalogoAtual >= itensCatalogoVisiveis.length) return;
    const distanciaFim = catalogoLista.scrollHeight - catalogoLista.scrollTop - catalogoLista.clientHeight;
    if (distanciaFim < 120) {
      limiteCatalogoAtual += TAMANHO_LOTE_CATALOGO;
      renderizarListaCatalogo();
    }
  });
}

btnDpadCima?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  inputPokemon?.blur?.();
  navegarRpg(DIR_CIMA);
});

btnDpadBaixo?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  inputPokemon?.blur?.();
  navegarRpg(DIR_BAIXO);
});

btnDpadEsquerda?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  inputPokemon?.blur?.();
  navegarRpg(DIR_ESQUERDA);
});

btnDpadDireita?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  inputPokemon?.blur?.();
  navegarRpg(DIR_DIREITA);
});

btnControleSelecionar?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  confirmarCursorRpg();
});

btnLimparForm?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  voltarMenuRpg();
});

btnLimparVisor?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  avancarOuLimparVisorRpg();
});

for (const [idx, botao] of botoesSlotsAzuis.entries()) {
  botao.addEventListener("click", (evento) => {
    evento.stopPropagation?.();
    ativarSlotAzul(idx);
  });
}

btnConfigSlots?.addEventListener("click", (evento) => {
  evento.stopPropagation?.();
  abrirOuAlternarConfigSlotsRpg(false);
});

painelBuscaForm?.addEventListener("click", (evento) => {
  rpgTela = TELA_BUSCA;
  rpgNivel = NIVEL_ITENS;
  const idx = obterControlesTelaAtual().indexOf(evento.target);
  rpgIndices.busca = Math.max(idx, 0);
  sincronizarCursorRpg(false);
});

pokemonCatalogoArea?.addEventListener("click", () => {
  rpgTela = TELA_LISTA;
  rpgNivel = NIVEL_ITENS;
  sincronizarCursorRpg(false);
});

painelResultado?.addEventListener("click", () => {
  if (rpgNivel === NIVEL_EDICAO) return;
  rpgTela = TELA_VISOR;
  rpgNivel = NIVEL_ITENS;
  sincronizarCursorRpg(false);
});

document.addEventListener("visibilitychange", sincronizarTemporizadorCenario);

formPokedex.addEventListener("submit", (evento) => {
  evento.preventDefault();
  executarPesquisa(inputPokemon.value).catch(tratarRejeicaoInesperada);
});

inputPokemon.addEventListener("focus", () => {
  garantirCatalogoCarregado().catch(tratarRejeicaoInesperada);
});

inputPokemon.addEventListener("blur", () => {
  if (inputPokemon.value.length > 0 || inputPokemon.matches(":user-invalid")) {
    atualizarEstadoValidacaoCampo(false, true);
  }
});

inputPokemon.addEventListener("input", () => {
  atualizarEstadoValidacaoCampo(false, false);
  rpgNivel = NIVEL_ITENS;
  rpgTela = TELA_BUSCA;
  rpgIndices.busca = 0;
  if (!catalogoCarregado) {
    garantirCatalogoCarregado().catch(tratarRejeicaoInesperada);
  } else {
    atualizarFiltroCatalogo();
  }
  sincronizarCursorRpg(false);
});

inicializarCenarios();
carregarSlotsSalvos();
document.title = TITULO_PADRAO;
