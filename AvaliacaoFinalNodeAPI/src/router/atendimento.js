import express from "express"
import ControllerAtendimento from '../controller/atendimento.js'

const router = express.Router()

router.get('/buscar', ControllerAtendimento.Buscar );
router.get('/buscarUm/:id', ControllerAtendimento.BuscarUm );
router.post('/criar', ControllerAtendimento.Criar );
router.put('/alterar/:id', ControllerAtendimento.Alterar );
router.delete('/deletar/:id', ControllerAtendimento.Deletar)

export default router