class EnderecoView {
    constructor() {
        this.form = document.getElementById("formEndereco");
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

    formatarCep() {
        if (!this.cepInput) return;
        const cep = this.cepInput.value.replace(/\D/g, "").slice(0, 8);
        this.cepInput.value = cep.length > 5
            ? `${cep.slice(0, 5)}-${cep.slice(5)}`
            : cep;
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
        if (this.estadoInput) {
            const nomesEstados = {
                "ACRE": "AC",
                "ALAGOAS": "AL",
                "AMAPA": "AP",
                "AMAZONAS": "AM",
                "BAHIA": "BA",
                "CEARA": "CE",
                "DISTRITO FEDERAL": "DF",
                "ESPIRITO SANTO": "ES",
                "GOIAS": "GO",
                "MARANHAO": "MA",
                "MATO GROSSO": "MT",
                "MATO GROSSO DO SUL": "MS",
                "MINAS GERAIS": "MG",
                "PARA": "PA",
                "PARAIBA": "PB",
                "PARANA": "PR",
                "PERNAMBUCO": "PE",
                "PIAUI": "PI",
                "RIO DE JANEIRO": "RJ",
                "RIO GRANDE DO NORTE": "RN",
                "RIO GRANDE DO SUL": "RS",
                "RONDONIA": "RO",
                "RORAIMA": "RR",
                "SANTA CATARINA": "SC",
                "SAO PAULO": "SP",
                "SERGIPE": "SE",
                "TOCANTINS": "TO"
            };
            const estadoInformado = String(dados.estado || "")
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toUpperCase();
            const estado = nomesEstados[estadoInformado] || estadoInformado;
            const estados = Array.from(this.estadoInput.options).map((option) => option.value);
            this.estadoInput.value = estados.includes(estado) ? estado : "";
        }

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
        this.mensagem.setAttribute("role", tipo === "erro" ? "alert" : "status");
        this.mensagem.style.color = tipo === "erro" ? "#d9534f" : "#16a34a";
        if (tipo === "erro") {
            this.mensagem.focus();
        }
    }

    definirCarregando(botao, carregando, texto) {
        if (!botao) return;
        botao.disabled = carregando;
        if (carregando) {
            botao.dataset.textoOriginal = botao.textContent;
            botao.textContent = texto;
        } else if (botao.dataset.textoOriginal) {
            botao.textContent = botao.dataset.textoOriginal;
            delete botao.dataset.textoOriginal;
        }
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

        const lista = Array.isArray(enderecos) ? enderecos : [];
        this.listaEnderecos.innerHTML = "";

        if (this.contadorEnderecos) {
            this.contadorEnderecos.textContent = `${lista.length} registro(s)`;
        }

        if (lista.length === 0) {
            const vazio = document.createElement("div");
            vazio.className = "item-vazio";
            vazio.textContent = "Nenhum endereço encontrado.";
            this.listaEnderecos.appendChild(vazio);
            return;
        }

        lista.forEach((item) => {
            const card = document.createElement("div");
            card.className = "card-endereco";

            const logradouroTexto = item.logradouro
                ? `${item.logradouro}${item.numero ? ", " + item.numero : ""}`
                : "Logradouro não informado";

            const localTexto = [item.bairro, item.cidade, item.estado].filter(Boolean).join(" - ");

            const cabecalho = document.createElement("div");
            cabecalho.className = "card-endereco-header";
            const cep = document.createElement("span");
            cep.className = "badge-cep";
            cep.textContent = item.cep || "";
            const data = document.createElement("span");
            data.className = "data-consulta";
            data.textContent = this.formatarData(item.dataConsulta);
            cabecalho.append(cep, data);

            const rua = document.createElement("div");
            rua.className = "card-endereco-rua";
            rua.textContent = logradouroTexto;
            const local = document.createElement("div");
            local.className = "card-endereco-local";
            local.textContent = localTexto;
            const btnUsar = document.createElement("button");
            btnUsar.type = "button";
            btnUsar.className = "btn-selecionar";
            btnUsar.textContent = "Usar este endereço";

            card.append(cabecalho, rua, local, btnUsar);
            btnUsar.addEventListener("click", () => {
                if (typeof onSelecionar === "function") {
                    onSelecionar(item);
                }
            });

            this.listaEnderecos.appendChild(card);
        });
    }

    formatarData(valor) {
        if (!valor) return "";

        const data = new Date(valor);
        if (Number.isNaN(data.getTime())) {
            return String(valor);
        }

        return data.toLocaleString("pt-BR");
    }

    definirListaCarregando(carregando) {
        if (this.listaEnderecos) {
            this.listaEnderecos.setAttribute("aria-busy", String(carregando));
        }
    }
}

this.EnderecoView = EnderecoView;
