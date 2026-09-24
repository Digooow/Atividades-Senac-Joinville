import ServiceMarca from '../services/marcasService.js';

class ControllerMarca {

    Buscar(req, res) {
        try {
            const nomes = ServiceMarca.Buscar();

            res.send(marcas);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    BuscarPorId(req, res) {
        try {
            const { id } = req.params.id;
            const marca = ServiceMarca.BuscarPorId(id);

            res.send(marca);
        } catch (error) {
            res.status(500).send({ error: error.message})
        }
    }

    Criar(req, res) {

        try {
            const marca = req.body.marca;

            ServiceMarca.Criar(marca);
            res.send({ message: 'Marca registrada com sucesso!' });
        } catch (error) {
            res.status(500).send({ error: error.message});
        }
    }

    Atualizar(req, res) {
        
        try {
            const id = req.params.id;
            const marca = req.body.marca;

            ServiceMarca.Atualizar(id, marca);
            res.send({ message: 'Marca atualizada com sucesso!' });

        } catch (error) {
            res.send({ error: error.message });
        }
    }
}