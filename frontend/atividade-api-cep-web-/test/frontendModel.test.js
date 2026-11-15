import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import vm from "vm";

async function carregarClasse(caminho, nome, temporizador = setTimeout) {
    const codigo = await fs.readFile(caminho, "utf8");
    const contexto = {
        AbortController,
        clearTimeout,
        encodeURIComponent,
        fetch: global.fetch,
        setTimeout: temporizador
    };

    vm.runInNewContext(codigo, contexto);
    return contexto[nome];
}

test("EnderecoModel usa a API relativa e propaga falhas na listagem", async () => {
    const chamadas = [];
    const fetchOriginal = global.fetch;
    global.fetch = async (url, opcoes) => {
        chamadas.push({ url, opcoes });
        return {
            ok: false,
            json: async () => ({ mensagem: "Falha de teste." })
        };
    };

    try {
        const EnderecoModel = await carregarClasse(
            new URL("../js/models/EnderecoModel.js", import.meta.url),
            "EnderecoModel"
        );
        const model = new EnderecoModel();

        await assert.rejects(
            model.listarCadastrados("Joinville"),
            { message: "Falha de teste." }
        );
        assert.equal(chamadas[0].url, "/api/enderecos?busca=Joinville");
    } finally {
        global.fetch = fetchOriginal;
    }
});

test("EnderecoModel preserva AbortError para cancelamento de busca", async () => {
    const fetchOriginal = global.fetch;
    global.fetch = async (url, opcoes) => {
        const erro = new Error("Abortado");
        erro.name = "AbortError";
        throw erro;
    };

    try {
        const EnderecoModel = await carregarClasse(
            new URL("../js/models/EnderecoModel.js", import.meta.url),
            "EnderecoModel"
        );
        const model = new EnderecoModel();

        await assert.rejects(
            model.listarCadastrados("", new AbortController().signal),
            { name: "AbortError" }
        );
    } finally {
        global.fetch = fetchOriginal;
    }
});

test("EnderecoModel informa timeout ao abortar a consulta do ViaCEP", async () => {
    const fetchOriginal = global.fetch;
    global.fetch = async () => {
        const erro = new Error("Tempo limite");
        erro.name = "AbortError";
        throw erro;
    };

    try {
        const EnderecoModel = await carregarClasse(
            new URL("../js/models/EnderecoModel.js", import.meta.url),
            "EnderecoModel"
        );
        const model = new EnderecoModel();

        await assert.rejects(
            model.buscarViaCep("89221-340"),
            { message: "A consulta ao ViaCEP excedeu o tempo limite." }
        );
    } finally {
        global.fetch = fetchOriginal;
    }
});

test("EnderecoModel aborta a consulta quando o temporizador dispara", async () => {
    const fetchOriginal = global.fetch;
    let temporizadorExecutado = false;
    global.fetch = async (url, opcoes) => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.equal(opcoes.signal.aborted, true);
        const erro = new Error("Abortado pelo timeout");
        erro.name = "AbortError";
        throw erro;
    };

    try {
        const EnderecoModel = await carregarClasse(
            new URL("../js/models/EnderecoModel.js", import.meta.url),
            "EnderecoModel",
            (funcao) => {
                temporizadorExecutado = true;
                funcao();
                return 1;
            }
        );
        const model = new EnderecoModel();

        await assert.rejects(
            model.buscarViaCep("89221-340"),
            { message: "A consulta ao ViaCEP excedeu o tempo limite." }
        );
        assert.equal(temporizadorExecutado, true);
    } finally {
        global.fetch = fetchOriginal;
    }
});
