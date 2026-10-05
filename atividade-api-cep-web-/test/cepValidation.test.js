import test from "node:test";
import assert from "node:assert/strict";

function validarELimparCep(cep) {
    if (typeof cep !== "string") {
        throw new Error("O CEP deve ser uma string.");
    }

    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        throw new Error("Digite um CEP válido com 8 dígitos.");
    }

    return cepLimpo;
}

test("validarELimparCep deve limpar máscara e retornar 8 dígitos", () => {
    assert.equal(validarELimparCep("89221-340"), "89221340");
    assert.equal(validarELimparCep("89.221-340"), "89221340");
    assert.equal(validarELimparCep("89221340"), "89221340");
});

test("validarELimparCep deve lançar erro para CEP com menos de 8 dígitos", () => {
    assert.throws(() => validarELimparCep("1234"), {
        message: "Digite um CEP válido com 8 dígitos."
    });
});

test("validarELimparCep deve lançar erro para CEP com mais de 8 dígitos", () => {
    assert.throws(() => validarELimparCep("123456789"), {
        message: "Digite um CEP válido com 8 dígitos."
    });
});

test("validarELimparCep deve lançar erro para valores não textuais", () => {
    assert.throws(() => validarELimparCep(12345678), {
        message: "O CEP deve ser uma string."
    });
});
