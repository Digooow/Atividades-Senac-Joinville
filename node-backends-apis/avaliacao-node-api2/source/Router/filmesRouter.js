import express from "express";
import ControllerFilmes from "../Controller/filmesController.js"

const router = express.Router();

router.get('/filmes', ControllerFilmes.Buscar)
router.get('/filmes/:id', ControllerFilmes.BuscarPorId)
router.post('/filmes', ControllerFilmes.Criar)
router.put('/filmes/:id', ControllerFilmes.Atualizar)
router.delete('/filmes/:id', ControllerFilmes.Deletar)

export default router;