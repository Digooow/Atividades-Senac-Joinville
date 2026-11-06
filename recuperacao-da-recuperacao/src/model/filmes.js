const filmes = new Array(
    {titulo: 'O Poderoso Chefão', classificacao: 18, descricao: 'Um épico do crime organizado.', lancamento: true},
    {titulo: 'O Poderoso Chefão 2', classificacao: 18, descricao: 'A continuação da história do Poderoso Chefão.', lancamento: false},
    {titulo: 'O Poderoso Chefão 3', classificacao: 18, descricao: 'A conclusão da saga do Poderoso Chefão.', lancamento: true}
);
class Filmes {

    Buscar() {
        return filmes;
    }

    BuscarPorId(id) {
        return filmes[id];
    }

    Criar(titulo, classificacao, descricao, lancamento) {
        filmes.push({titulo, classificacao, descricao, lancamento});
    }

    Alterar(id, titulo, classificacao, descricao, lancamento) {
        filmes[id].titulo = titulo;
        filmes[id].classificacao = classificacao;
        filmes[id].descricao = descricao;
        filmes[id].lancamento = lancamento;
    }

    AlterarStatus(id) {
        filmes[id].classificacao = !filmes[id].classificacao;
    }

    Deletar(id) {
        filmes.splice(id, 1);
    }
}

export default new Filmes();