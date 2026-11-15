import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import enderecoRoutes from "./src/routes/enderecoRoutes.js";

const app = express();
const porta = process.env.PORT || 3000;
const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
    origin: process.env.CORS_ORIGIN || true
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.static(diretorioAtual));

app.use("/api", enderecoRoutes);

app.use((erro, req, res, next) => {
    if (erro.type === "entity.too.large") {
        return res.status(413).json({
            mensagem: "O corpo da requisição excede o limite de 10 KB."
        });
    }

    if (erro instanceof SyntaxError && erro.status === 400 && "body" in erro) {
        return res.status(400).json({ mensagem: "O corpo da requisição contém JSON inválido." });
    }

    return next(erro);
});

app.use((erro, req, res, next) => {
    if (res.headersSent) {
        return next(erro);
    }

    return res.status(500).json({ mensagem: "Erro interno do servidor." });
});

const arquivoAtual = fileURLToPath(import.meta.url);
const arquivoExecutado = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (arquivoAtual === arquivoExecutado) {
    app.listen(porta, () => {
        console.log(`Servidor rodando em http://localhost:${porta}`);
    });
}

export default app;
