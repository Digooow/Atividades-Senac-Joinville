import ServiceFilmes from '../service/filmes.js';

class ControllerFilmes {

    Buscar(req, res) {
        try {
            const filmes = ServiceFilmes.Buscar();

            res.send({ filmes });
        } catch (error) {
            res.send({ mensagem: error.mensagem });
        }

    }

    BuscarPorId(req, res) {
        try {
            const id = req.params.id;
            const filme = ServiceFilmes.BuscarPorId(id);

            res.send({ filme });
        } catch (error) {
            res.send({ mensagem: error.mensagem });
        }
    }

    Criar(req, res) {
        try {
            
            const titulo = req.body.titulo;
            const classificacao = req.body.classificacao;
            const descricao = req.body.descricao;
            const lancamento = req.body.lancamento;

            ServiceFilmes.Criar(titulo, classificacao, descricao, lancamento);
            res.send({ mensagem: 'Filme criado com sucesso!' });

        } catch (error) {
            res.send({ mensagem: error.mensagem });
        }
    }

    Alterar(req, res) {
        try {

            const id = req.params.id;
            const titulo = req.body.titulo;
            const classificacao = req.body.classificacao;
            const descricao = req.body.descricao;
            const lancamento = req.body.lancamento;

            ServiceFilmes.Alterar(id, titulo, classificacao, descricao, lancamento);
            res.send({ mensagem: 'Filme alterado com sucesso!' });


        } catch (error) {
            res.send({ mensagem: error.mensagem });
        }
    }

    Deletar(req, res) {
        try {
            const id = req.params.id;
            ServiceFilmes.Deletar(id);
            res.send({ mensagem: 'Filme deletado com sucesso!' });
        } catch (error) {
            res.send({ mensagem: error.mensagem });
        } 
    }
}

export default new ControllerFilmes();