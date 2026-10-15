import Filmes from '../model/filmes.js';
class ServiceFilmes {

    Buscar() {
        return Filmes.Buscar();
    }

    BuscarPorId(id) {
    if (!id || isNaN(id)) {
        throw new Error('Informe um ID válido para buscar o filme.');
    }

        return Filmes.BuscarPorId(id);
    }

    Criar(titulo, classificacao, descricao, lancamento) {
        if (!titulo || !classificacao || !descricao || lancamento === undefined) {
            throw new Error('Todos os campos são obrigatórios para criar um filme.');
        }

        Filmes.Criar(titulo, classificacao, descricao, lancamento);
    }

    Alterar(id, titulo, classificacao, descricao, lancamento) {
        if (!id || isNaN(id) || !titulo || !classificacao || !descricao || lancamento === undefined) {
            throw new Error('Todos os campos são obrigatórios para alterar o filme.');
        }
        Filmes.Alterar(id, titulo, classificacao, descricao, lancamento);
    }

    AlterarStatus(id) {
        if (!id || isNaN(id)) {
            throw new Error('Informe um ID válido para alterar o status do filme.');
        }

        Filmes.AlterarStatus(id);
    }

    Deletar(id) {
        if (!id || isNaN(id)) {
            throw new Error('Informe um ID válido para deletar o filme.');
        }
        Filmes.Deletar(id);
    }
}

export default new ServiceFilmes();