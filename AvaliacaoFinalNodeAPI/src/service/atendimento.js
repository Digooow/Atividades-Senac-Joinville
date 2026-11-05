import Atendimento from '../model/atendimento.js'

class ServiceAtendimento {

    async Buscar(){
        return Atendimento.findAll()
    }

    async BuscarUm(id) {
        if (!id || isNaN(id)) {
            throw new Error("Id incorreto.")
        }
        return await Atendimento.findByPk(id)
    }

    async Criar(data, valor, concluido) {
        if (!data) {
            throw new Error("Favor informar o nome")
        }
        if (!valor) {
            throw new Error("Favor informar o valor")
        }
        if (!concluido) {
            throw new Error("Favor informar a concluido")
        }

        await Atendimento.create({ data, valor, concluido })

    }

    async Alterar(id, data, valor, concluido) {
        if (!id || isNaN(id) || !data || !valor || !concluido) {
            throw new Error("Informar todos os dados corretamente")
        }
        const atendimentoAlterar = await Atendimento.findByPk(id)
        if (!atendimentoAlterar) {
            throw new Error("Pessoa não encontrada")
        }
        atendimentoAlterar.data = data
        atendimentoAlterar.valor = valor
        atendimentoAlterar.concluido = concluido
    
        await atendimentoAlterar.save()

    }

    async Deletar(id) {
        if (!id || isNaN(id)) {
            throw new Error("Informar o Id corretamente")
        }

        const atendimentoDelete = await Atendimento.findByPk(id)
        if (!atendimentoDelete) {
            throw new Error("Atendimento não encontrado")
        }

        await atendimentoDelete.destroy()
    }

}

export default new ServiceAtendimento()