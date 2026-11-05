import ServiceAtendimento from '../service/atendimento.js'


class ControllerAtendimento {

    async Buscar(req, res) {
        try {
            const nomes = await ServiceAtendimento.Buscar()

            res.send({ nomes})
        } catch (error) {
            res.send({ message:error.message})
        }
    }

    async BuscarUm(req, res) {

        try{
            const id = req.params.id
            const nome = await ServiceAtendimento.BuscarUm(id)
            res.send({ nome })
        }catch (error) {
            res.send({ message: error.message})
        }
    }

    async Criar(req,res) {

        try{
            
            const data = req.body.data
            const valor = req.body.valor
            const concluido = req.body.concluido

            await ServiceAtendimento.Criar(data, valor, concluido)

            res.send({ message: "Criado com sucesso!"})

        } catch(error) {
            res.send({ message:error.message })
        }
    }

    async Alterar(req,res) {

        try {
            const id = req.params.id
            const data = req.body.data
            const valor = req.body.valor
            const concluido = req.body.concluido

            await ServiceAtendimento.Alterar(id, data, valor, concluido)
            res.send({ message: "alterado com Sucesso"})
        } catch (error) {
            res.send({ message:error.message })
        }

    }

        async Deletar() {

            try{
                const id = req.params.id

                await ServiceAtendimento.Deletar(id)
                res.send({ message: "deletado com sucesso!"})

            } catch(error) {
                res.send({ message: error.message})
            }
        }
}

export default new ControllerAtendimento()