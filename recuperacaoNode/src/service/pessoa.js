import Pessoa from '../model/pessoa.js'

class ServicePessoa {


    Buscar() {
        return Pessoa.Buscar()
    }


    BuscarUm(id) {
        if (!id || isNaN(id)) {
            throw new Error("Id incorreto.")
        }
        return Pessoa.BuscarUm(id)
    }


    Criar(nome) {
        if (!nome) {
            throw new Error("Favor informar o nome")
        }

        Pessoa.Criar(nome)
    }


    Alterar(id, nome) {
        if (!id || isNaN(id) || !nome) {
            throw new Error("Informar todos os dados corretamente")
        }
        
        Pessoa.Alterar(id, nome)
    }


    Deletar(id) {
        if (!id || isNaN(id)) {
            throw new Error("Informar o Id corretamente")
        }
        
        Pessoa.Deletar(id)
    }


}

export default new ServicePessoa()