import MarcasModel from '../model/marcasModel.js';

const marcas = new MarcasModel();

class ServiceMarca {

    Buscar() {
        return marcas.Buscar();
    }

    BuscarPorId(id) {
        return marcas.BuscarPorId(id);
    }

    Criar(marca) {
        return marcas.Criar(marca);
    }

    Atualizar(id, marca) {
        return marcas.Atualizar(id, marca);
    }

    Deletar(id) {
        return marcas.Deletar(id);
    }
}

export default ServiceMarca;