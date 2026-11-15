import ServiceFilmes from "../Services/filmesServices.js";


class ControllerFilmes {

    Buscar(req, res) {
        try {
            const filme = ServiceFilmes.Buscar();
            res.send( {filme} );
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    BuscarPorId(req, res) {
        try {
            const id = req.params.id;
            const filme = ServiceFilmes.BuscarPorId(id);

            res.send(filme);
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

    Criar(req, res) {
        try {
            const titulo = req.body.titulo;
            const classificacaoIndicativa = req.body.classificacaoIndicativa;
            const descricao = req.body.descricao;
            const lancamento = req.body.lancamento;
            ServiceFilmes.Criar(titulo, classificacaoIndicativa, descricao, lancamento)

            
            res.send({ message: 'Marca registrada com sucesso!' });
        }   catch (error)   {
            res.status(500).send({ error: error.message});
        }

    }

    Atualizar(req, res) {

        try {
            const id = req.params.id;
            const titulo = req.body.titulo;
            const classificacaoIndicativa = req.body.classificacaoIndicativa;
            const descricao = req.body.descricao;
            ServiceFilmes.Atualizar(id, titulo, classificacaoIndicativa, descricao)

            
            res.send({ message: 'Filme atualizado com sucesso!'});

        }   catch (error) {
            res.send({ error: error.message});
        }
    }

    Deletar(req, res)   {
        try {
            const id = req.params.id;
            ServiceFilmes.Deletar(id);
            res.send({ message: 'Filme deletado com sucesso'});
        } catch (error) {
            res.send({ message: error.message});
        }
    }

}

export default new ControllerFilmes();