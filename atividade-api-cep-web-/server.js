import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import enderecoRoutes from "./src/routes/enderecoRoutes.js";

const app = express();
const porta = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(".")));

app.use("/api", enderecoRoutes);

const arquivoAtual = fileURLToPath(import.meta.url);
const arquivoExecutado = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (arquivoAtual === arquivoExecutado) {
    app.listen(porta, () => {
        console.log(`Servidor rodando em http://localhost:${porta}`);
    });
}

export default app;
