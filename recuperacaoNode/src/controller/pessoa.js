import ServicePessoa from '../service/pessoa.js'

class ControllerPessoa {

    async Buscar(req, res) {
        try {
            const nomes = await ServicePessoa.Buscar()
            return res.status(200).send({ nomes })
        } catch (error) {
            return res.status(500).send({ message: error.message })
        }
    }

    async BuscarUm(req, res) {
        try {
            const id = req.params.id
            const pessoa = await ServicePessoa.BuscarUm(id)
            if (!pessoa) {
                return res.status(404).send({ message: 'Pessoa não encontrada.' })
            }
            return res.status(200).send({ pessoa })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }

    async Criar(req, res) {
        try {
            const { nome, idade } = req.body
            await ServicePessoa.Criar(nome, idade)
            return res.status(201).send({ message: "Criado com sucesso!" })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }

    async Alterar(req, res) {
        try {
            const id = req.params.id
            const { nome } = req.body
            await ServicePessoa.Alterar(id, nome)
            return res.status(200).send({ message: "Alterado com sucesso!" })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }

    async Deletar(req, res) {
        try {
            const id = req.params.id
            await ServicePessoa.Deletar(id)
            return res.status(200).send({ message: "Deletado com sucesso!" })
        } catch (error) {
            return res.status(400).send({ message: error.message })
        }
    }
}

export default new ControllerPessoa()
