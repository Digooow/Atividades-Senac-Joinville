import cliente from '../model/cliente.js'
import Cliente from '../model/cliente.js'

class ServiceCliente {

    async Buscar(){
        return Cliente.findAll()
    }

    async BuscarUm(id) {
        if (!id || isNaN(id)) {
            throw new Error("Id incorreto.")
        }
        return await Cliente.findByPk(id)
    }

    async Criar(nome, email, senha) {
        if (!nome) {
            throw new Error("Favor informar o nome")
        }
        if (!email) {
            throw new Error("Favor informar o email")
        }
        if (!senha) {
            throw new Error("Favor informar a senha")
        }

        await Cliente.create({ nome, email, senha })

    }

    async Alterar(id, nome, email, senha) {
        if (!id || isNaN(id) || !nome || !email || !senha) {
            throw new Error("Informar todos os dados corretamente")
        }
        const clienteAlterar = await Cliente.findByPk(id)
        if (!clienteAlterar) {
            throw new Error("Pessoa não encontrada")
        }
        clienteAlterar.nome = nome
        clienteAlterar.email = email
        clienteAlterar.senha = senha
    
        await clienteAlterar.save()

    }

    async Deletar(id) {
        if (!id || isNaN(id)) {
            throw new Error("Informar o Id corretamente")
        }

        const clienteDelete = await Cliente.findByPk(id)
        if (!clienteDelete) {
            throw new Error("Cliente não encontrado")
        }

        await clienteDelete.destroy()
    }

}

export default new ServiceCliente()