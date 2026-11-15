import test, { beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import { EnderecoModel } from "../src/models/enderecoModel.js";

const arquivoJson = path.resolve("dados", "enderecos.json");

beforeEach(async () => {
    await fs.mkdir(path.dirname(arquivoJson), { recursive: true });
    await fs.writeFile(arquivoJson, JSON.stringify([]));
});

after(async () => {
    await fs.writeFile(arquivoJson, JSON.stringify([]));
});

test("EnderecoModel.obterTodos deve retornar um array vazio inicialmente", async () => {
    const lista = await EnderecoModel.obterTodos();
    assert.deepEqual(lista, []);
});

test("EnderecoModel.salvar deve cadastrar um novo endereço com id e data", async () => {
    const endereco = {
        cep: "89221-340",
        logradouro: "Rua Joaçaba",
        numero: "150",
        bairro: "Saguaçu",
        cidade: "Joinville",
        estado: "Santa Catarina"
    };

    const salvo = await EnderecoModel.salvar(endereco);

    assert.ok(salvo.id);
    assert.equal(salvo.cep, "89221-340");
    assert.equal(salvo.logradouro, "Rua Joaçaba");
    assert.equal(salvo.numero, "150");
    assert.match(salvo.dataConsulta, /^\d{4}-\d{2}-\d{2}T/);

    const lista = await EnderecoModel.obterTodos();
    assert.equal(lista.length, 1);
    assert.equal(lista[0].cep, "89221-340");
});

test("EnderecoModel.obterTodos deve propagar JSON corrompido", async () => {
    await fs.writeFile(arquivoJson, "{ inválido");

    await assert.rejects(
        EnderecoModel.obterTodos(),
        SyntaxError
    );
});

test("EnderecoModel.filtrar deve retornar os endereços correspondentes ao termo", async () => {
    await EnderecoModel.salvar({
        cep: "89221-340",
        logradouro: "Rua Joaçaba",
        bairro: "Saguaçu",
        cidade: "Joinville",
        estado: "Santa Catarina"
    });

    await EnderecoModel.salvar({
        cep: "01001-000",
        logradouro: "Praça da Sé",
        bairro: "Sé",
        cidade: "São Paulo",
        estado: "São Paulo"
    });

    const resultadoJoinville = await EnderecoModel.filtrar("joinville");
    assert.equal(resultadoJoinville.length, 1);
    assert.equal(resultadoJoinville[0].cidade, "Joinville");

    const resultadoSemAcento = await EnderecoModel.filtrar("sao paulo");
    assert.equal(resultadoSemAcento.length, 1);
    assert.equal(resultadoSemAcento[0].cidade, "São Paulo");

    const resultadoPontuacao = await EnderecoModel.filtrar("---");
    assert.equal(resultadoPontuacao.length, 0);

    const resultadoCep = await EnderecoModel.filtrar("01001");
    assert.equal(resultadoCep.length, 1);
    assert.equal(resultadoCep[0].cidade, "São Paulo");

    const resultadoInexistente = await EnderecoModel.filtrar("Curitiba");
    assert.equal(resultadoInexistente.length, 0);
});
