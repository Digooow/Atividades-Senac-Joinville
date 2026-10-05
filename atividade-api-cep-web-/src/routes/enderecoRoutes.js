import { Router } from "express";
import { EnderecoController } from "../controllers/enderecoController.js";

const router = Router();

router.get("/enderecos", EnderecoController.listar);
router.post("/enderecos", EnderecoController.salvar);

export default router;
