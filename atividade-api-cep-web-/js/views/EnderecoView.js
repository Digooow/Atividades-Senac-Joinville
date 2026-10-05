class EnderecoView {
    constructor() {
        this.cepInput = document.getElementById("cep");
        this.logradouroInput = document.getElementById("logradouro");
        this.numeroInput = document.getElementById("numero");
        this.bairroInput = document.getElementById("bairro");
        this.cidadeInput = document.getElementById("cidade");
        this.estadoInput = document.getElementById("estado");
        this.btnBuscar = document.getElementById("btnBuscar");
        this.btnSalvar = document.getElementById("btnSalvar");
        this.mensagem = document.getElementById("mensagem");

        this.campoBusca = document.getElementById("buscaCadastrados");
        this.listaEnderecos = document.getElementById("listaEnderecos");
        this.contadorEnderecos = document.getElementById("contadorEnderecos");
        this.btnLimparBusca = document.getElementById("btnLimparBusca");
    }

    getCep() {
        return this.cepInput ? this.cepInput.value : "";
    }

    getDadosFormulario() {
        return {
            cep: this.cepInput ? this.cepInput.value.trim() : "",
            logradouro: this.logradouroInput ? this.logradouroInput.value.trim() : "",
            numero: this.numeroInput ? this.numeroInput.value.trim() : "",
            bairro: this.bairroInput ? this.bairroInput.value.trim() : "",
            cidade: this.cidadeInput ? this.cidadeInput.value.trim() : "",
            estado: this.estadoInput ? this.estadoInput.value.trim() : ""
        };
    }

    preencherCampos(dados) {
        if (dados.cep && this.cepInput) this.cepInput.value = dados.cep;
        if (this.logradouroInput) this.logradouroInput.value = dados.logradouro || "";
        if (this.numeroInput) this.numeroInput.value = dados.numero || "";
        if (this.bairroInput) this.bairroInput.value = dados.bairro || "";
        if (this.cidadeInput) this.cidadeInput.value = dados.cidade || "";
        if (this.estadoInput) this.estadoInput.value = dados.estado || "";

        if (this.numeroInput) {
            this.numeroInput.focus();
        }
    }

    limparCampos() {
        if (this.logradouroInput) this.logradouroInput.value = "";
        if (this.numeroInput) this.numeroInput.value = "";
        if (this.bairroInput) this.bairroInput.value = "";
        if (this.cidadeInput) this.cidadeInput.value = "";
        if (this.estadoInput) this.estadoInput.value = "";
    }

    mostrarMensagem(texto, tipo = "erro") {
        if (!this.mensagem) return;
        this.mensagem.textContent = texto;
        this.mensagem.style.color = tipo === "erro" ? "#d9534f" : "#16a34a";
    }

    limparMensagem() {
        if (!this.mensagem) return;
        this.mensagem.textContent = "";
        this.mensagem.style.color = "";
    }

    getTermoBusca() {
        return this.campoBusca ? this.campoBusca.value.trim() : "";
    }

    limparCampoBusca() {
        if (this.campoBusca) {
            this.campoBusca.value = "";
        }
    }

    renderizarLista(enderecos, onSelecionar) {
        if (!this.listaEnderecos) return;

        this.listaEnderecos.innerHTML = "";

        if (this.contadorEnderecos) {
            this.contadorEnderecos.textContent = `${enderecos.length} registro(s)`;
        }

        if (!enderecos || enderecos.length === 0) {
            this.listaEnderecos.innerHTML = `<div class="item-vazio">Nenhum endereço encontrado.</div>`;
            return;
        }

        enderecos.forEach((item) => {
            const card = document.createElement("div");
            card.className = "card-endereco";

            const logradouroTexto = item.logradouro
                ? `${item.logradouro}${item.numero ? ", " + item.numero : ""}`
                : "Logradouro não informado";

            const localTexto = [item.bairro, item.cidade, item.estado].filter(Boolean).join(" - ");

            card.innerHTML = `
                <div class="card-endereco-header">
                    <span class="badge-cep">${item.cep}</span>
                    <span class="data-consulta">${item.dataConsulta || ""}</span>
                </div>
                <div class="card-endereco-rua">${logradouroTexto}</div>
                <div class="card-endereco-local">${localTexto}</div>
                <button type="button" class="btn-selecionar">Usar este endereço</button>
            `;

            const btnUsar = card.querySelector(".btn-selecionar");
            btnUsar.addEventListener("click", () => {
                if (typeof onSelecionar === "function") {
                    onSelecionar(item);
                }
            });

            this.listaEnderecos.appendChild(card);
        });
    }
}
