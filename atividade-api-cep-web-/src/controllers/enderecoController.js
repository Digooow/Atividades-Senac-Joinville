import { EnderecoModel } from "../models/enderecoModel.js";
import { normalizarEndereco, validarEndereco } from "../utils/enderecoValidation.js";

export class EnderecoController {
    static async listar(req, res) {
        try {
            const { busca } = req.query;
            const pagina = req.query.pagina;
            const limite = req.query.limite;

            if (busca !== undefined && typeof busca !== "string") {
                return res.status(400).json({
                    mensagem: "O parâmetro busca deve ser um texto único."
                });
            }

            if (pagina !== undefined && !/^[1-9]\d*$/.test(pagina)) {
                return res.status(400).json({
                    mensagem: "O parâmetro pagina deve ser um número inteiro positivo."
                });
            }

            if (limite !== undefined && !/^[1-9]\d*$/.test(limite)) {
                return res.status(400).json({
                    mensagem: "O parâmetro limite deve ser um número inteiro positivo."
                });
            }

            const enderecos = await EnderecoModel.filtrar(busca, {
                pagina: pagina ? Number(pagina) : undefined,
                limite: limite ? Number(limite) : undefined
            });
            return res.status(200).json(enderecos);
        } catch {
            return res.status(500).json({ mensagem: "Erro ao consultar os endereços salvos." });
        }
    }

    static async salvar(req, res) {
        try {
            const { cep, logradouro, numero, bairro, cidade, estado } = req.body || {};
            const dados = { cep, logradouro, numero, bairro, cidade, estado };
            const erroValidacao = validarEndereco(dados);

            if (erroValidacao) {
                return res.status(400).json({ mensagem: erroValidacao });
            }

            const salvo = await EnderecoModel.salvar(normalizarEndereco(dados));

            return res.status(201).json(salvo);
        } catch (erro) {
            if (erro.statusCode === 409) {
                return res.status(409).json({ mensagem: erro.message });
            }

            return res.status(500).json({ mensagem: "Erro ao salvar a consulta." });
        }
    }
}
