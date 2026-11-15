import express from "express";
import ControllerMarca from "../controller/marcasController.js";

const router = express.Router();

router.get('/marcas', ControllerMarca.Buscar);
router.get('/marcas/:id', ControllerMarca.BuscarPorId);
router.post('/marcas', ControllerMarca.Criar);
router.put('/marcas/:id', ControllerMarca.Atualizar);
router.delete('/marcas/:id', ControllerMarca.Deletar);

export default router;