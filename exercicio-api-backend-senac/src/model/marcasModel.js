const marcas = new Array("Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Jeep", "Nissan", "Peugeot", "Renault", "Toyota");

class MarcasService {

    Buscar() {
        return marcas;
    }

    BuscarPorId(id) {
        return marcas[id];
    }

    Criar(marca) {
        marcas.push(marca);
    }

    Atualizar(id, marca) {
        marcas[id] = marca;
    }

    Deletar(id) {
        marcas.splice(id, 1);
    }
}


export default MarcasService;