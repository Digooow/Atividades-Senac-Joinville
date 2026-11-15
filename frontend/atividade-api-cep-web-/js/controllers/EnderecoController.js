class EnderecoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.buscaTimer = null;
        this.listaRequestController = null;
        this.iniciar();
    }

    iniciar() {
        if (this.view.form) {
            this.view.form.addEventListener("submit", (evento) => evento.preventDefault());
        }

        if (this.view.btnBuscar) {
            this.view.btnBuscar.addEventListener("click", () => this.buscarCep());
        }

        if (this.view.btnSalvar) {
            this.view.btnSalvar.addEventListener("click", () => this.salvarEndereco());
        }

        if (this.view.cepInput) {
            this.view.cepInput.addEventListener("input", () => this.view.formatarCep());
            this.view.cepInput.addEventListener("keypress", (evento) => {
                if (evento.key === "Enter") {
                    evento.preventDefault();
                    this.buscarCep();
                }
            });
        }

        if (this.view.campoBusca) {
            this.view.campoBusca.addEventListener("input", () => {
                clearTimeout(this.buscaTimer);
                this.buscaTimer = setTimeout(() => this.filtrarCadastrados(), 250);
            });
        }

        if (this.view.btnLimparBusca) {
            this.view.btnLimparBusca.addEventListener("click", () => {
                this.view.limparCampoBusca();
                this.carregarCadastrados();
            });
        }

        this.carregarCadastrados();
    }

    async buscarCep() {
        this.view.limparMensagem();
        const cep = this.view.getCep();
        this.view.definirCarregando(this.view.btnBuscar, true, "Consultando...");

        try {
            const dados = await this.model.buscarViaCep(cep);
            this.view.preencherCampos(dados);
            this.view.mostrarMensagem("CEP localizado. Confira os dados e salve o endereço.", "sucesso");
        } catch (erro) {
            this.view.limparCampos();
            this.view.mostrarMensagem(erro.message, "erro");
        } finally {
            this.view.definirCarregando(this.view.btnBuscar, false);
        }
    }

    async salvarEndereco() {
        this.view.limparMensagem();

        if (this.view.form && !this.view.form.reportValidity()) {
            return;
        }

        const dados = this.view.getDadosFormulario();

        this.view.definirCarregando(this.view.btnSalvar, true, "Salvando...");

        try {
            await this.model.salvarNoBackend(dados);
            this.view.mostrarMensagem("Endereço salvo com sucesso!", "sucesso");
            const listaAtualizada = await this.carregarCadastrados(false);
            if (listaAtualizada.status === "erro") {
                this.view.mostrarMensagem("Endereço salvo, mas a lista não pôde ser atualizada.", "erro");
            }
        } catch (erro) {
            this.view.mostrarMensagem(erro.message, "erro");
        } finally {
            this.view.definirCarregando(this.view.btnSalvar, false);
        }
    }

    async carregarCadastrados(mostrarErro = true) {
        if (this.listaRequestController) {
            this.listaRequestController.abort();
        }

        const requestController = new AbortController();
        this.listaRequestController = requestController;
        this.view.definirListaCarregando(true);

        try {
            const termo = this.view.getTermoBusca();
            const enderecos = await this.model.listarCadastrados(
                termo,
                requestController.signal
            );
            this.view.renderizarLista(enderecos, (item) => this.selecionarEndereco(item));
            if (this.listaRequestController === requestController) {
                this.view.definirListaCarregando(false);
            }
            return { status: "sucesso" };
        } catch (erro) {
            if (erro.name === "AbortError") {
                if (this.listaRequestController === requestController) {
                    this.view.definirListaCarregando(false);
                }
                return { status: "cancelado" };
            }

            this.view.renderizarLista([], () => {});
            if (mostrarErro) {
                this.view.mostrarMensagem(erro.message, "erro");
            }
            if (this.listaRequestController === requestController) {
                this.view.definirListaCarregando(false);
            }
            return { status: "erro" };
        }
    }

    async filtrarCadastrados() {
        await this.carregarCadastrados();
    }

    selecionarEndereco(endereco) {
        this.view.preencherCampos(endereco);
        this.view.mostrarMensagem(`Endereço ${endereco.cep} carregado no formulário.`, "sucesso");
    }
}

this.EnderecoController = EnderecoController;
