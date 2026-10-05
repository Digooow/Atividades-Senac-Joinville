import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import app from "../server.js";

const arquivoJson = path.resolve("dados", "enderecos.json");
let servidor;
let baseUrl;

before(async () => {
    process.env.NODE_ENV = "test";
    await new Promise((resolve) => {
        servidor = app.listen(0, () => {
            const porta = servidor.address().port;
            baseUrl = `http://localhost:${porta}/api/enderecos`;
            resolve();
        });
    });
});

after(async () => {
    await new Promise((resolve) => servidor.close(resolve));
    await fs.writeFile(arquivoJson, JSON.stringify([]));
});

beforeEach(async () => {
    await fs.mkdir(path.dirname(arquivoJson), { recursive: true });
    await fs.writeFile(arquivoJson, JSON.stringify([]));
});

test("GET /api/enderecos deve retornar status 200 e lista vazia inicialmente", async () => {
    const resposta = await fetch(baseUrl);
    const dados = await resposta.json();

    assert.equal(resposta.status, 200);
    assert.deepEqual(dados, []);
});

test("POST /api/enderecos deve retornar 201 e salvar novo endereço", async () => {
    const novo = {
        cep: "89221-340",
        logradouro: "Rua Joaçaba",
        numero: "200",
        bairro: "Saguaçu",
        cidade: "Joinville",
        estado: "Santa Catarina"
    };

    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo)
    });

    const dados = await resposta.json();

    assert.equal(resposta.status, 201);
    assert.ok(dados.id);
    assert.equal(dados.cep, novo.cep);
    assert.equal(dados.logradouro, novo.logradouro);

    const respostaListagem = await fetch(baseUrl);
    const lista = await respostaListagem.json();
    assert.equal(lista.length, 1);
});

test("POST /api/enderecos sem CEP deve retornar status 400", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logradouro: "Rua Sem CEP" })
    });

    assert.equal(resposta.status, 400);
});

test("GET /api/enderecos?busca=Joinville deve filtrar os registros retornados", async () => {
    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: "89221-340", cidade: "Joinville" })
    });

    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: "01001-000", cidade: "São Paulo" })
    });

    const resposta = await fetch(`${baseUrl}?busca=Joinville`);
    const dados = await resposta.json();

    assert.equal(resposta.status, 200);
    assert.equal(dados.length, 1);
    assert.equal(dados[0].cidade, "Joinville");
});
