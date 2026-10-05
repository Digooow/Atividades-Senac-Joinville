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

test("GET / deve servir a aplicação independentemente do diretório atual", async () => {
    const resposta = await fetch(baseUrl.replace("/api/enderecos", "/"));
    const html = await resposta.text();

    assert.equal(resposta.status, 200);
    assert.match(html, /Cadastro de Endereço/);
});

test("POST /api/enderecos deve retornar 201 e salvar novo endereço", async () => {
    const novo = {
        cep: "89221-340",
        logradouro: "Rua Joaçaba",
        numero: "200",
        bairro: "Saguaçu",
        cidade: "Joinville",
        estado: "SC"
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

test("POST /api/enderecos duplicado por CEP e número deve retornar status 409", async () => {
    const endereco = {
        cep: "89221-340",
        logradouro: "Rua Joaçaba",
        numero: "200",
        bairro: "Saguaçu",
        cidade: "Joinville",
        estado: "SC"
    };

    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(endereco)
    });

    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...endereco, cep: "89221340" })
    });
    const dados = await resposta.json();

    assert.equal(resposta.status, 409);
    assert.equal(dados.mensagem, "Este CEP e número já estão cadastrados.");
});

test("GET /api/enderecos?busca=Joinville deve filtrar os registros retornados", async () => {
    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cep: "89221-340",
            logradouro: "Rua Joaçaba",
            numero: "200",
            bairro: "Saguaçu",
            cidade: "Joinville",
            estado: "SC"
        })
    });

    await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cep: "01001-000",
            logradouro: "Praça da Sé",
            numero: "1",
            bairro: "Sé",
            cidade: "São Paulo",
            estado: "SP"
        })
    });

    const resposta = await fetch(`${baseUrl}?busca=Joinville`);
    const dados = await resposta.json();

    assert.equal(resposta.status, 200);
    assert.equal(dados.length, 1);
    assert.equal(dados[0].cidade, "Joinville");
});

test("GET /api/enderecos deve rejeitar busca repetida", async () => {
    const resposta = await fetch(`${baseUrl}?busca=Joinville&busca=Curitiba`);
    const dados = await resposta.json();

    assert.equal(resposta.status, 400);
    assert.equal(dados.mensagem, "O parâmetro busca deve ser um texto único.");
});

test("GET /api/enderecos deve paginar os resultados", async () => {
    for (const numero of ["1", "2", "3"]) {
        await fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cep: `89221-34${numero}`,
                logradouro: "Rua Teste",
                numero,
                bairro: "Centro",
                cidade: "Joinville",
                estado: "SC"
            })
        });
    }

    const resposta = await fetch(`${baseUrl}?pagina=2&limite=2`);
    const dados = await resposta.json();

    assert.equal(resposta.status, 200);
    assert.equal(dados.length, 1);
    assert.equal(dados[0].numero, "1");
});

test("GET /api/enderecos deve rejeitar paginação inválida", async () => {
    const resposta = await fetch(`${baseUrl}?pagina=zero&limite=10`);
    const dados = await resposta.json();

    assert.equal(resposta.status, 400);
    assert.equal(dados.mensagem, "O parâmetro pagina deve ser um número inteiro positivo.");
});

test("POST /api/enderecos com CEP inválido deve retornar status 400", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cep: "abc",
            logradouro: "Rua Teste",
            numero: "1",
            bairro: "Centro",
            cidade: "Joinville",
            estado: "SC"
        })
    });

    assert.equal(resposta.status, 400);
});

test("POST /api/enderecos com tipos inválidos deve retornar status 400", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cep: "89221-340",
            logradouro: "Rua Teste",
            numero: 1,
            bairro: "Centro",
            cidade: "Joinville",
            estado: "SC"
        })
    });

    assert.equal(resposta.status, 400);
});

test("POST /api/enderecos sem campos obrigatórios deve retornar status 400", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cep: "89221-340",
            logradouro: "Rua Teste",
            numero: "",
            bairro: "Centro",
            cidade: "Joinville",
            estado: "SC"
        })
    });

    assert.equal(resposta.status, 400);
});

test("POST /api/enderecos com estado inválido deve retornar status 400", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cep: "89221-340",
            logradouro: "Rua Teste",
            numero: "1",
            bairro: "Centro",
            cidade: "Joinville",
            estado: "XX"
        })
    });

    assert.equal(resposta.status, 400);
});

test("POST /api/enderecos com JSON inválido deve retornar JSON com status 400", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"cep":'
    });
    const dados = await resposta.json();

    assert.equal(resposta.status, 400);
    assert.equal(dados.mensagem, "O corpo da requisição contém JSON inválido.");
});

test("POST /api/enderecos com corpo vazio deve retornar status 400", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: ""
    });

    assert.equal(resposta.status, 400);
});

test("POST /api/enderecos acima do limite deve retornar status 413", async () => {
    const resposta = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dados: "x".repeat(11000) })
    });
    const dados = await resposta.json();

    assert.equal(resposta.status, 413);
    assert.equal(dados.mensagem, "O corpo da requisição excede o limite de 10 KB.");
});
