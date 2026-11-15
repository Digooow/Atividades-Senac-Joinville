import test from "node:test";
import assert from "node:assert/strict";
import { normalizarEndereco, validarEndereco } from "../src/utils/enderecoValidation.js";

const enderecoValido = {
    cep: "89221-340",
    logradouro: "Rua Joaçaba",
    numero: "200",
    bairro: "Saguaçu",
    cidade: "Joinville",
    estado: "SC"
};

test("validarEndereco aceita um endereço completo", () => {
    assert.equal(validarEndereco(enderecoValido), null);
});

test("validarEndereco rejeita CEP com formato inválido", () => {
    assert.equal(
        validarEndereco({ ...enderecoValido, cep: "123" }),
        "Digite um CEP válido com 8 dígitos."
    );
});

test("validarEndereco rejeita campos que não são textos", () => {
    assert.equal(
        validarEndereco({ ...enderecoValido, numero: 200 }),
        "O campo numero deve ser um texto."
    );
});

test("validarEndereco rejeita campo obrigatório vazio", () => {
    assert.equal(
        validarEndereco({ ...enderecoValido, cidade: " " }),
        "O campo cidade é obrigatório."
    );
});

test("normalizarEndereco remove espaços externos dos campos", () => {
    const resultado = normalizarEndereco({
        ...enderecoValido,
        cidade: " Joinville "
    });

    assert.equal(resultado.cidade, "Joinville");
});

test("validarEndereco rejeita sigla de estado inválida", () => {
    assert.equal(
        validarEndereco({ ...enderecoValido, estado: "XX" }),
        "Informe uma sigla de estado válida."
    );
});

test("normalizarEndereco padroniza a sigla do estado", () => {
    const resultado = normalizarEndereco({
        ...enderecoValido,
        estado: " sc "
    });

    assert.equal(resultado.estado, "SC");
});
