const filmes = new Array(
    {
        titulo: 'A volta dos que não foram',
        classificacaoIndicativa: '18',
        descricao: '2424',
        lancamento: '2024'
    })



class FilmesModel {

    Buscar() {
        return filmes;
    }

    BuscarPorId(id) {
        return filmes[id];
    }

    Criar(titulo, classificacaoIndicativa, descricao, lancamento) {
        filmes.push(titulo, classificacaoIndicativa, descricao, lancamento)
    }

    Atualizar(id, titulo, classificacaoIndicativa, descricao, lancamento) {
        filmes[id].titulo = titulo;
        filmes[id].classificacaoIndicativa = classificacaoIndicativa;
        filmes[id].descricao = descricao;
        filmes[id].lancamento = lancamento;
    }

    Deletar(id) {
        filmes.splice(id, 1);
    }
}

export default FilmesModel;