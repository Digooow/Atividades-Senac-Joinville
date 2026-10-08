import FilmesModel from '../Model/filmesModel.js'



class ServiceFilmes {
    
    Buscar() {
        return FilmesModel.Buscar();
    }

    BuscarPorId(id) {
        if(!id || isNaN(id)) {
            throw new Error("Informar somente números")
        }

        return FilmesModel.BuscarPorId(id);
    }

    Criar(titulo, classificacaoIndicativa, descricao, lancamento) {
        if(!titulo || !classificacaoIndicativa || !descricao || !lancamento) {
            throw new Error("Informar os dados corretamente")
        }

        FilmesModel.Criar(titulo, classificacaoIndicativa, descricao, lancamento);
    }

    Atualizar(id, titulo, classificacaoIndicativa, descricao, lancamento) {
        if(!id || isNaN(id) || !titulo, !classificacaoIndicativa, !descricao, !lancamento)
        FilmesModel.Atualizar(id, titulo, classificacaoIndicativa, descricao, lancamento);
    }

    Deletar(id) {
        FilmesModel.Deletar(id);
    }
}

export default new ServiceFilmes();