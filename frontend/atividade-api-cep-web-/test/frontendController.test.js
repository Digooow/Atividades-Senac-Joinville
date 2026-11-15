import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import vm from "vm";

async function carregarController() {
    const caminho = new URL("../js/controllers/EnderecoController.js", import.meta.url);
    const codigo = await fs.readFile(caminho, "utf8");
    const contexto = {
        AbortController,
        clearTimeout,
        setTimeout
    };

    vm.runInNewContext(codigo, contexto);
    return contexto.EnderecoController;
}

test("EnderecoController mantém sucesso do cadastro quando a atualização da lista falha", async () => {
    const EnderecoController = await carregarController();
    const mensagens = [];
    const controller = Object.create(EnderecoController.prototype);

    controller.model = {
        salvarNoBackend: async () => ({ id: "1" })
    };
    controller.view = {
        btnSalvar: { disabled: false, textContent: "Salvar Endereço", dataset: {} },
        limparMensagem: () => {},
        getDadosFormulario: () => ({ cep: "89221-340" }),
        mostrarMensagem: (mensagem, tipo) => mensagens.push({ mensagem, tipo }),
        definirCarregando: () => {}
    };
    controller.carregarCadastrados = async () => ({ status: "erro" });

    await controller.salvarEndereco();

    assert.deepEqual(mensagens, [
        { mensagem: "Endereço salvo com sucesso!", tipo: "sucesso" },
        { mensagem: "Endereço salvo, mas a lista não pôde ser atualizada.", tipo: "erro" }
    ]);
});

test("EnderecoController não salva formulário inválido", async () => {
    const EnderecoController = await carregarController();
    let salvamentos = 0;
    const controller = Object.create(EnderecoController.prototype);

    controller.model = {
        salvarNoBackend: async () => {
            salvamentos += 1;
        }
    };
    controller.view = {
        form: { reportValidity: () => false },
        limparMensagem: () => {},
        mostrarMensagem: () => {},
        definirCarregando: () => {},
        btnSalvar: null
    };

    await controller.salvarEndereco();

    assert.equal(salvamentos, 0);
});

test("EnderecoController desabilita o botão durante a busca", async () => {
    const EnderecoController = await carregarController();
    let resolver;
    const estados = [];
    const controller = Object.create(EnderecoController.prototype);

    controller.model = {
        buscarViaCep: () => new Promise((resolve) => {
            resolver = resolve;
        })
    };
    controller.view = {
        btnBuscar: { disabled: false, textContent: "Buscar CEP", dataset: {} },
        limparMensagem: () => {},
        getCep: () => "89221-340",
        preencherCampos: () => {},
        mostrarMensagem: () => {},
        limparCampos: () => {},
        definirCarregando: (botao, carregando) => {
            estados.push({ botao, carregando });
        }
    };

    const busca = controller.buscarCep();
    assert.equal(estados[0].carregando, true);
    resolver({ cep: "89221-340" });
    await busca;
    assert.equal(estados.at(-1).carregando, false);
});
