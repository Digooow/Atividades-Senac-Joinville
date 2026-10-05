class EnderecoModel {
    constructor() {
        this.apiBackend = "/api/enderecos";
    }

    async buscarViaCep(cep) {
        const cepLimpo = String(cep || "").replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            throw new Error("Digite um CEP válido com 8 dígitos.");
        }

        const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        let resposta;

        try {
            resposta = await fetch(url, { signal: controller.signal });
        } catch (erro) {
            if (erro.name === "AbortError") {
                throw new Error("A consulta ao ViaCEP excedeu o tempo limite.");
            }

            throw new Error("Não foi possível conectar ao ViaCEP.");
        } finally {
            clearTimeout(timeout);
        }

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a API.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            throw new Error("CEP não encontrado.");
        }

        return {
            cep: dados.cep || cepLimpo,
            logradouro: dados.logradouro || "",
            bairro: dados.bairro || "",
            cidade: dados.localidade || "",
            estado: dados.uf || dados.estado || ""
        };
    }

    async listarCadastrados(busca = "", signal) {
        const url = busca ? `${this.apiBackend}?busca=${encodeURIComponent(busca)}` : this.apiBackend;
        let resposta;

        try {
            resposta = await fetch(url, { signal });
        } catch (erro) {
            if (erro.name === "AbortError") {
                throw erro;
            }
            throw new Error("Não foi possível conectar ao servidor.");
        }

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));
            throw new Error(erro.mensagem || "Não foi possível consultar os endereços.");
        }

        return await resposta.json();
    }

    async salvarNoBackend(dados) {
        try {
            const resposta = await fetch(this.apiBackend, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            if (!resposta.ok) {
                const erro = await resposta.json().catch(() => ({}));
                throw new Error(erro.mensagem || "Não foi possível salvar no servidor.");
            }

            return await resposta.json();
        } catch (erro) {
            if (erro instanceof Error) {
                throw erro;
            }

            throw new Error("Não foi possível conectar ao servidor.");
        }
    }

}

this.EnderecoModel = EnderecoModel;
