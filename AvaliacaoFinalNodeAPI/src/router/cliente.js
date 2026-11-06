import express from "express"
import ControllerCliente from '../controller/cliente.js'

const router = express.Router()

router.get('/buscar', ControllerCliente.Buscar );
router.get('/buscarUm/:id', ControllerCliente.BuscarUm );
router.post('/criar', ControllerCliente.Criar );
router.put('/alterar/:id', ControllerCliente.Alterar );
router.delete('/deletar/:id', ControllerCliente.Deletar)

export default router