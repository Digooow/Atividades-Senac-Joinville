import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import vm from "vm";

function criarElemento() {
    return {
        append() {},
        appendChild() {},
        addEventListener() {},
        className: "",
        dataset: {},
        setAttribute() {},
        style: {},
        textContent: "",
        value: ""
    };
}

test("EnderecoView renderiza registros incompletos sem lançar erro", async () => {
    const codigo = await fs.readFile(
        new URL("../js/views/EnderecoView.js", import.meta.url),
        "utf8"
    );
    const elementos = new Map();
    const lista = criarElemento();
    elementos.set("listaEnderecos", lista);
    elementos.set("contadorEnderecos", criarElemento());

    const contexto = {
        document: {
            createElement: criarElemento,
            getElementById: (id) => elementos.get(id) || null
        }
    };
    vm.runInNewContext(codigo, contexto);

    const view = new contexto.EnderecoView();

    assert.doesNotThrow(() => {
        view.renderizarLista([{}], () => {});
    });
});

test("EnderecoView formata datas ISO para exibição local", async () => {
    const codigo = await fs.readFile(
        new URL("../js/views/EnderecoView.js", import.meta.url),
        "utf8"
    );
    const contexto = {
        document: {
            createElement: criarElemento,
            getElementById: () => null
        }
    };
    vm.runInNewContext(codigo, contexto);

    const view = new contexto.EnderecoView();
    const resultado = view.formatarData("2026-01-02T03:04:05.000Z");

    assert.notEqual(resultado, "2026-01-02T03:04:05.000Z");
    assert.match(resultado, /\d{2}\/\d{2}\/\d{4}/);
});
