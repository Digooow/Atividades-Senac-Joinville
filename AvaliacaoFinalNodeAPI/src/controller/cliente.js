import ServiceCliente from '../service/cliente.js'


class ControllerCliente {

    async Buscar(req, res) {
        try {
            const nomes = await ServiceCliente.Buscar()

            res.send({ nomes})
        } catch (error) {
            res.send({ message:error.message})
        }
    }

    async BuscarUm(req, res) {

        try{
            const id = req.params.id
            const soma = await ServiceeCliente.BuscarUm(id)
            res.send({ nome })
        }catch (error) {
            res.send({ message: error.message})
        }
    }

    async Criar(req,res) {

        try{
            
            const nome = req.body.nome
            const email = req.body.email
            const senha = req.body.senha

            await ServiceCliente.Criar(nome, email, senha)

            res.send({ message: "Criado com sucesso!"})

        } catch(error) {
            res.send({ message:error.message })
        }
    }

    async Alterar(req,res) {

        try {
            const id = req.params.id
            const nome = req.body.nome
            const email = req.body.email
            const senha = req.body.senha

            await ServiceCliente.Alterar(id, nome, email, senha)
            res.send({ message: "alterado com Sucesso"})
        } catch (error) {
            res.send({ message:error.message })
        }

    }

        async Deletar() {

            try{
                const id = req.params.id

                await ServiceCliente.Deletar(id)
                res.send({ message: "deletado com sucesso!"})

            } catch(error) {
                res.send({ message: error.message})
            }
        }
}

export default new ControllerCliente()