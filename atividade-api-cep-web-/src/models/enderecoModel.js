import fs from "fs/promises";
import path from "path";

const arquivoJson = path.resolve("dados", "enderecos.json");

export class EnderecoModel {
    static async obterTodos() {
        try {
            const conteudo = await fs.readFile(arquivoJson, "utf-8");
            return JSON.parse(conteudo);
        } catch {
            await fs.mkdir(path.dirname(arquivoJson), { recursive: true });
            await fs.writeFile(arquivoJson, JSON.stringify([]));
            return [];
        }
    }

    static async filtrar(termo) {
        const lista = await this.obterTodos();
        if (!termo) {
            return lista;
        }

        const termoNormalizado = termo.toLowerCase().trim();
        return lista.filter((item) => {
            const cepLimpo = (item.cep || "").replace(/\D/g, "");
            const buscaLimpa = termoNormalizado.replace(/\D/g, "");

            return (
                (buscaLimpa && cepLimpo.includes(buscaLimpa)) ||
                (item.logradouro && item.logradouro.toLowerCase().includes(termoNormalizado)) ||
                (item.bairro && item.bairro.toLowerCase().includes(termoNormalizado)) ||
                (item.cidade && item.cidade.toLowerCase().includes(termoNormalizado)) ||
                (item.estado && item.estado.toLowerCase().includes(termoNormalizado))
            );
        });
    }

    static async salvar(dados) {
        const lista = await this.obterTodos();

        const novoEndereco = {
            id: Date.now(),
            cep: dados.cep,
            logradouro: dados.logradouro || "",
            numero: dados.numero || "",
            bairro: dados.bairro || "",
            cidade: dados.cidade || "",
            estado: dados.estado || "",
            dataConsulta: new Date().toLocaleString("pt-BR")
        };

        lista.unshift(novoEndereco);
        await fs.writeFile(arquivoJson, JSON.stringify(lista, null, 2), "utf-8");
        return novoEndereco;
    }
}
