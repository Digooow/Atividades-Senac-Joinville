class EnderecoModel {
    constructor() {
        this.apiBackend = window.location.origin.includes("localhost:3000")
            ? "/api/enderecos"
            : "http://localhost:3000/api/enderecos";
    }

    async buscarViaCep(cep) {
        const cepLimpo = cep.replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            throw new Error("Digite um CEP válido com 8 dígitos.");
        }

        const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
        const resposta = await fetch(url);

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
            estado: dados.estado || dados.uf || ""
        };
    }

    async listarCadastrados(busca = "") {
        try {
            const url = busca ? `${this.apiBackend}?busca=${encodeURIComponent(busca)}` : this.apiBackend;
            const resposta = await fetch(url);
            if (!resposta.ok) {
                return [];
            }
            return await resposta.json();
        } catch {
            return [];
        }
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
                return null;
            }

            return await resposta.json();
        } catch {
            return null;
        }
    }
}
