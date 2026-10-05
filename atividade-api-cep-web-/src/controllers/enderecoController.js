import { EnderecoModel } from "../models/enderecoModel.js";

export class EnderecoController {
    static async listar(req, res) {
        try {
            const { busca } = req.query;
            const enderecos = await EnderecoModel.filtrar(busca);
            return res.status(200).json(enderecos);
        } catch {
            return res.status(500).json({ mensagem: "Erro ao consultar os endereços salvos." });
        }
    }

    static async salvar(req, res) {
        try {
            const { cep, logradouro, numero, bairro, cidade, estado } = req.body;

            if (!cep) {
                return res.status(400).json({ mensagem: "O CEP é obrigatório." });
            }

            const salvo = await EnderecoModel.salvar({
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                estado
            });

            return res.status(201).json(salvo);
        } catch {
            return res.status(500).json({ mensagem: "Erro ao salvar a consulta." });
        }
    }
}
