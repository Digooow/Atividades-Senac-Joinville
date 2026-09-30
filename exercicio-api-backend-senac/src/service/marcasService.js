import MarcasModel from '../model/marcasModel.js';

class ServiceMarca {

    Buscar() {
        return MarcasModel.Buscar();
    }

    BuscarPorId(id) {
        return MarcasModel.BuscarPorId(id);
    }

    Criar(marca) {
        return MarcasModel.Criar(marca);
    }

    Atualizar(id, marca) {
        return MarcasModel.Atualizar(id, marca);
    }

    Deletar(id) {
        return MarcasModel.Deletar(id);
    }
}

export default new ServiceMarca();