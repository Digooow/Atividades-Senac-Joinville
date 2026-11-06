import ServiceFilmes from '../service/filmes.js';

class ControllerFilmes {

    Buscar(req, res) {
        try {
            const filmes = ServiceFilmes.Buscar();
            return res.status(200).send({ filmes });
        } catch (error) {
            return res.status(500).send({ mensagem: error.message });
        }
    }

    BuscarPorId(req, res) {
        try {
            const id = req.params.id;
            const filme = ServiceFilmes.BuscarPorId(id);
            if (!filme) {
                return res.status(404).send({ mensagem: 'Filme não encontrado.' });
            }
            return res.status(200).send({ filme });
        } catch (error) {
            return res.status(400).send({ mensagem: error.message });
        }
    }

    Criar(req, res) {
        try {
            const { titulo, classificacao, descricao, lancamento } = req.body;
            ServiceFilmes.Criar(titulo, classificacao, descricao, lancamento);
            return res.status(201).send({ mensagem: 'Filme criado com sucesso!' });
        } catch (error) {
            return res.status(400).send({ mensagem: error.message });
        }
    }

    Alterar(req, res) {
        try {
            const id = req.params.id;
            const { titulo, classificacao, descricao, lancamento } = req.body;
            ServiceFilmes.Alterar(id, titulo, classificacao, descricao, lancamento);
            return res.status(200).send({ mensagem: 'Filme alterado com sucesso!' });
        } catch (error) {
            return res.status(400).send({ mensagem: error.message });
        }
    }

    AlterarStatus(req, res) {
        try {
            const id = req.params.id;
            ServiceFilmes.AlterarStatus(id);
            return res.status(200).send({ mensagem: 'Status do filme alterado com sucesso!' });
        } catch (error) {
            return res.status(400).send({ mensagem: error.message });
        }
    }

    Deletar(req, res) {
        try {
            const id = req.params.id;
            ServiceFilmes.Deletar(id);
            return res.status(200).send({ mensagem: 'Filme deletado com sucesso!' });
        } catch (error) {
            return res.status(400).send({ mensagem: error.message });
        } 
    }
}

export default new ControllerFilmes();
