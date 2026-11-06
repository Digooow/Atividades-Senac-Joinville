import ServiceCliente from '../service/cliente.js'

class ControllerCliente {

    async Buscar(req, res) {
        try {
            const nomes = await ServiceCliente.Buscar()
            return res.status(200).send({ nomes })
        } catch (error) {
            return res.status(500).send({ message: error.message })
        }
    }

    async BuscarUm(req, res) {
        try {
            const id = req.params.id
            const cliente = await ServiceCliente.BuscarUm(id)
            if (!cliente) {
                return res.status(404).send({ message: 'Cliente não encontrado.' })
            }
            return res.status(200).send({ cliente })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }

    async Criar(req, res) {
        try {
            const { nome, email, senha } = req.body
            await ServiceCliente.Criar(nome, email, senha)
            return res.status(201).send({ message: "Criado com sucesso!" })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }

    async Alterar(req, res) {
        try {
            const id = req.params.id
            const { nome, email, senha } = req.body
            await ServiceCliente.Alterar(id, nome, email, senha)
            return res.status(200).send({ message: "alterado com Sucesso" })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }

    async Deletar(req, res) {
        try {
            const id = req.params.id
            await ServiceCliente.Deletar(id)
            return res.status(200).send({ message: "deletado com sucesso!" })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }
}

export default new ControllerCliente()
