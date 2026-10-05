class EnderecoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.iniciar();
    }

    iniciar() {
        if (this.view.btnBuscar) {
            this.view.btnBuscar.addEventListener("click", () => this.buscarCep());
        }

        if (this.view.btnSalvar) {
            this.view.btnSalvar.addEventListener("click", () => this.salvarEndereco());
        }

        if (this.view.cepInput) {
            this.view.cepInput.addEventListener("keypress", (evento) => {
                if (evento.key === "Enter") {
                    evento.preventDefault();
                    this.buscarCep();
                }
            });
        }

        if (this.view.campoBusca) {
            this.view.campoBusca.addEventListener("input", () => this.filtrarCadastrados());
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

        try {
            const dados = await this.model.buscarViaCep(cep);
            this.view.preencherCampos(dados);
            this.view.mostrarMensagem("CEP localizado e consulta registrada!", "sucesso");

            await this.model.salvarNoBackend(dados);
            await this.carregarCadastrados();
        } catch (erro) {
            this.view.limparCampos();
            this.view.mostrarMensagem(erro.message, "erro");
        }
    }

    async salvarEndereco() {
        this.view.limparMensagem();
        const dados = this.view.getDadosFormulario();

        if (!dados.cep) {
            this.view.mostrarMensagem("Informe um CEP antes de salvar.", "erro");
            return;
        }

        const salvo = await this.model.salvarNoBackend(dados);

        if (salvo) {
            this.view.mostrarMensagem("Endereço salvo com sucesso!", "sucesso");
            await this.carregarCadastrados();
        } else {
            this.view.mostrarMensagem("Não foi possível salvar no servidor.", "erro");
        }
    }

    async carregarCadastrados() {
        const termo = this.view.getTermoBusca();
        const enderecos = await this.model.listarCadastrados(termo);
        this.view.renderizarLista(enderecos, (item) => this.selecionarEndereco(item));
    }

    async filtrarCadastrados() {
        const termo = this.view.getTermoBusca();
        const enderecos = await this.model.listarCadastrados(termo);
        this.view.renderizarLista(enderecos, (item) => this.selecionarEndereco(item));
    }

    selecionarEndereco(endereco) {
        this.view.preencherCampos(endereco);
        this.view.mostrarMensagem(`Endereço ${endereco.cep} carregado no formulário.`, "sucesso");
    }
}
