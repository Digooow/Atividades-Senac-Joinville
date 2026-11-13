import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_PATH = path.join(__dirname, "frontend.html");

// Banco de dados em memória (reinicia ao reiniciar o servidor)
let proximoId = 4;
const livros = [
  { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", disponivel: true },
  { id: 2, titulo: "Domain-Driven Design", autor: "Eric Evans", disponivel: true },
  { id: 3, titulo: "O Programador Pragmático", autor: "Andrew Hunt & David Thomas", disponivel: false },
];

/**
 * Envia uma resposta JSON com headers de CORS liberados.
 */
function enviarJson(res, statusCode, dados) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (statusCode === 204 || dados === null) {
    res.end();
    return;
  }

  res.end(JSON.stringify(dados));
}

/**
 * Lê e converte o corpo da requisição de JSON para objeto JS.
 */
function lerCorpoJson(req) {
  return new Promise((resolve, reject) => {
    let corpo = "";
    const LIMITE_BYTES = 1024 * 1024; // 1 MB

    req.on("data", (chunk) => {
      corpo += chunk;
      if (Buffer.byteLength(corpo, "utf8") > LIMITE_BYTES) {
        reject(new Error("BODY_TOO_LARGE"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!corpo.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(corpo));
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });

    req.on("error", reject);
  });
}

/**
 * Extrai e valida o ID numérico da rota /livros/:id.
 */
function extrairIdLivro(pathname) {
  const match = /^\/livros\/(\d+)$/.exec(pathname);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const { pathname } = url;
  const metodo = req.method;

  // Pré-requisição CORS (preflight) enviada automaticamente pelos navegadores
  if (metodo === "OPTIONS") {
    enviarJson(res, 204, null);
    return;
  }

  // Opcional: serve o front-end se você acessar http://localhost:3000 diretamente
  if (metodo === "GET" && pathname === "/") {
    fs.readFile(FRONTEND_PATH, "utf8", (err, html) => {
      if (err) {
        enviarJson(res, 404, { erro: "Arquivo frontend.html não encontrado." });
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
    return;
  }

  // GET /livros -> Lista todos os livros
  if (metodo === "GET" && pathname === "/livros") {
    console.log(`[GET] /livros -> 200 (${livros.length} itens)`);
    enviarJson(res, 200, livros);
    return;
  }

  // POST /livros -> Cadastra um novo livro
  if (metodo === "POST" && pathname === "/livros") {
    try {
      const dados = await lerCorpoJson(req);
      const titulo = typeof dados.titulo === "string" ? dados.titulo.trim() : "";
      const autor = typeof dados.autor === "string" ? dados.autor.trim() : "";

      if (!titulo || !autor) {
        console.log("[POST] /livros -> 400 (dados inválidos)");
        enviarJson(res, 400, { erro: "Os campos 'titulo' e 'autor' são obrigatórios." });
        return;
      }

      const novoLivro = {
        id: proximoId++,
        titulo,
        autor,
        disponivel: typeof dados.disponivel === "boolean" ? dados.disponivel : true,
      };

      livros.push(novoLivro);
      console.log(`[POST] /livros -> 201 (id=${novoLivro.id})`);
      enviarJson(res, 201, novoLivro);
    } catch (err) {
      const status = err.message === "BODY_TOO_LARGE" ? 413 : 400;
      enviarJson(res, status, { erro: "JSON inválido ou muito grande." });
    }
    return;
  }

  // Rotas com ID: /livros/:id
  const id = extrairIdLivro(pathname);
  if (id !== null) {
    const indice = livros.findIndex((item) => item.id === id);

    if (indice === -1) {
      console.log(`[${metodo}] ${pathname} -> 404 (não encontrado)`);
      enviarJson(res, 404, { erro: `Livro com id ${id} não encontrado.` });
      return;
    }

    // GET /livros/:id -> Busca um livro específico
    if (metodo === "GET") {
      console.log(`[GET] ${pathname} -> 200`);
      enviarJson(res, 200, livros[indice]);
      return;
    }

    // PATCH /livros/:id -> Atualiza parcialmente um livro
    if (metodo === "PATCH") {
      try {
        const dados = await lerCorpoJson(req);
        const livro = livros[indice];

        if (typeof dados.titulo === "string" && dados.titulo.trim()) {
          livro.titulo = dados.titulo.trim();
        }
        if (typeof dados.autor === "string" && dados.autor.trim()) {
          livro.autor = dados.autor.trim();
        }
        if (typeof dados.disponivel === "boolean") {
          livro.disponivel = dados.disponivel;
        }

        console.log(`[PATCH] ${pathname} -> 200`);
        enviarJson(res, 200, livro);
      } catch (err) {
        const status = err.message === "BODY_TOO_LARGE" ? 413 : 400;
        enviarJson(res, status, { erro: "JSON inválido." });
      }
      return;
    }

    // DELETE /livros/:id -> Remove um livro
    if (metodo === "DELETE") {
      livros.splice(indice, 1);
      console.log(`[DELETE] ${pathname} -> 204`);
      enviarJson(res, 204, null);
      return;
    }
  }

  // Rota não encontrada
  console.log(`[${metodo}] ${pathname} -> 404`);
  enviarJson(res, 404, { erro: "Rota não encontrada." });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Erro: a porta ${PORT} já está em uso. Tente rodar com outra porta, ex.: $env:PORT=3001; node backend.js`);
    process.exit(1);
  }
  console.error("Erro no servidor:", err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`API REST da Biblioteca rodando em http://localhost:${PORT}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET    http://localhost:${PORT}/livros`);
  console.log(`  GET    http://localhost:${PORT}/livros/:id`);
  console.log(`  POST   http://localhost:${PORT}/livros`);
  console.log(`  PATCH  http://localhost:${PORT}/livros/:id`);
  console.log(`  DELETE http://localhost:${PORT}/livros/:id`);
});
