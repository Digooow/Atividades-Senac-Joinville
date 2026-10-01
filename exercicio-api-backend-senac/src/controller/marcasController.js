import ServiceMarca from '../service/marcasService.js';

const marcas = new ServiceMarca();
class ControllerMarca {

    Buscar(req, res) {
        try {
            const nomes = marcas.Buscar();

            res.send(nomes);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    BuscarPorId(req, res) {
        try {
            const { id } = req.params;
            const marca = marcas.BuscarPorId(id);

            res.send(marca);
        } catch (error) {
            res.status(500).send({ error: error.message})
        }
    }

    Criar(req, res) {

        try {
            const marca = req.body.marca;

            marcas.Criar(marca);
            res.send({ message: 'Marca registrada com sucesso!' });
        } catch (error) {
            res.status(500).send({ error: error.message});
        }
    }

    Atualizar(req, res) {
        
        try {
            const id = req.params.id;
            const marca = req.body.marca;

            marcas.Atualizar(id, marca);
            res.send({ message: 'Marca atualizada com sucesso!' });

        } catch (error) {
            res.send({ error: error.message });
        }
    }

    Deletar(req, res) {
        try {
            const id = req.params.id;
            marcas.Deletar(id);
            res.send({ message: 'Marca deletada com sucesso!' });
        } catch (error) {
            res.send({ message: error.message });
        }
    }
}

export default new ControllerMarca();