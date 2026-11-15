import Pessoa from '../model/pessoa.js'

class ServicePessoa {


    async Buscar() {
        return Pessoa.findAll()
    }



    async BuscarUm(id) {
        if (!id || isNaN(id)) {
            throw new Error("Id incorreto.")
        }
        return await Pessoa.findByPk(id)
    }




    async Criar(nome, idade) {
        if (!nome) {
            throw new Error("Favor informar o nome")
        }
        if (!idade) {
            throw new Error("Favor informar a idade")
        }

        await Pessoa.create({ nome, idade })
    }



    async Alterar(id, nome) {
        if (!id || isNaN(id) || !nome) {
            throw new Error("Informar todos os dados corretamente")
        }
        const pessoaAlterar = await Pessoa.findByPk(id)
        if (!pessoaAlterar) {
            throw new Error("Pessoa não encontrada")
        }
        pessoaAlterar.nome = nome
        await pessoaAlterar.save()
    }


    async Deletar(id) {
        if (!id || isNaN(id)) {
            throw new Error("Informar o Id corretamente")
        }

        const pessoaDelete = await Pessoa.findByPk(id)
        if (!pessoaDelete) {
            throw new Error("Pessoa não encontrada")
        }
        
        await pessoaDelete.destroy()
    }


}

export default new ServicePessoa()