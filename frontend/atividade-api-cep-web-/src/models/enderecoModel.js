import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const arquivoJson = path.resolve(diretorioAtual, "..", "..", "dados", "enderecos.json");
let filaGravacao = Promise.resolve();

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

export class EnderecoModel {
    static async obterTodos() {
        try {
            const conteudo = await fs.readFile(arquivoJson, "utf-8");
            const dados = JSON.parse(conteudo);
            if (!Array.isArray(dados)) {
                throw new Error("O arquivo de endereços deve conter uma lista.");
            }
            return dados;
        } catch (erro) {
            if (erro.code !== "ENOENT") {
                throw erro;
            }

            await fs.mkdir(path.dirname(arquivoJson), { recursive: true });
            await fs.writeFile(arquivoJson, JSON.stringify([]));
            return [];
        }
    }

    static async filtrar(termo, opcoes = {}) {
        const lista = await this.obterTodos();
        let resultados = lista;

        if (termo) {
            const termoNormalizado = normalizarTexto(termo.trim());
            if (!termoNormalizado) {
                resultados = [];
            } else {
                resultados = lista.filter((item) => {
                    const cepLimpo = (item.cep || "").replace(/\D/g, "");
                    const buscaLimpa = termoNormalizado.replace(/\D/g, "");

                    return (
                        (buscaLimpa && cepLimpo.includes(buscaLimpa)) ||
                        normalizarTexto(item.logradouro).includes(termoNormalizado) ||
                        normalizarTexto(item.bairro).includes(termoNormalizado) ||
                        normalizarTexto(item.cidade).includes(termoNormalizado) ||
                        normalizarTexto(item.estado).includes(termoNormalizado)
                    );
                });
            }
        }

        if (opcoes.pagina === undefined && opcoes.limite === undefined) {
            return resultados;
        }

        const limite = opcoes.limite || 20;
        const pagina = opcoes.pagina || 1;
        const inicio = (pagina - 1) * limite;
        return resultados.slice(inicio, inicio + limite);
    }

    static async salvar(dados) {
        const salvar = async () => {
            const lista = await this.obterTodos();
            const cepNormalizado = String(dados.cep).replace(/\D/g, "");
            const numeroNormalizado = String(dados.numero || "").trim().toLowerCase();

            const duplicado = lista.some((item) => {
                const cepExistente = String(item.cep || "").replace(/\D/g, "");
                const numeroExistente = String(item.numero || "").trim().toLowerCase();

                return cepExistente === cepNormalizado && numeroExistente === numeroNormalizado;
            });

            if (duplicado) {
                const erro = new Error("Este CEP e número já estão cadastrados.");
                erro.statusCode = 409;
                throw erro;
            }

            const novoEndereco = {
                id: randomUUID(),
                cep: dados.cep,
                logradouro: dados.logradouro || "",
                numero: dados.numero || "",
                bairro: dados.bairro || "",
                cidade: dados.cidade || "",
                estado: dados.estado || "",
                dataConsulta: new Date().toISOString()
            };

            lista.unshift(novoEndereco);
            await fs.writeFile(arquivoJson, JSON.stringify(lista, null, 2), "utf-8");
            return novoEndereco;
        };

        const operacao = filaGravacao.then(salvar, salvar);
        filaGravacao = operacao.catch(() => {});
        return operacao;
    }
}
