# Recuperação da Recuperação — API REST de Filmes em Memória

![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.3-000000?style=for-the-badge&logo=express&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-MVC-6366F1?style=for-the-badge)

API REST desenvolvida com **Node.js** e **Express 5** para praticar a criação de endpoints CRUD em arquitetura MVC (`router`, `controller`, `service` e `model`) manipulando um catálogo de filmes em memória.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/) com ES Modules (`"type": "module"`)
- [Express 5.3](https://expressjs.com/)

## Estrutura do projeto

```text
recuperacao-da-recuperacao/
├── index.js
├── package.json
├── readme.md
└── src/
    ├── controller/
    │   └── filmes.js
    ├── model/
    │   └── filmes.js
    ├── router/
    │   └── filmes.js
    └── service/
        └── filmes.js
```

## Modelo de dados em memória

O arquivo [`src/model/filmes.js`](./src/model/filmes.js) inicializa uma lista em memória com a trilogia *O Poderoso Chefão*, onde cada filme possui:

- `titulo` (string)
- `classificacao` (número)
- `descricao` (string)
- `lancamento` (booleano)

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor:

   ```bash
   node index.js
   ```

3. Acesse em `http://localhost:3000`.

## Endpoints da API

Todas as rotas estão montadas sob o prefixo `/api`:

| Método | Rota | Corpo (JSON) | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/buscar` | — | Lista todos os filmes (`200 { "filmes": [...] }`) |
| `GET` | `/api/buscarPorId/:id` | — | Retorna o filme pelo índice (`200` ou `404`) |
| `POST` | `/api/criar` | `{"titulo", "classificacao", "descricao", "lancamento"}` | Cadastra um novo filme (`201`) |
| `PUT` | `/api/alterar/:id` | `{"titulo", "classificacao", "descricao", "lancamento"}` | Atualiza todos os campos do filme (`200`) |
| `PUT` | `/api/alterarstatus/:id` | — | Alterna o status no model (`200`) |
| `DELETE` | `/api/deletar/:id` | — | Remove o filme pelo índice (`200`) |

## Exemplos com cURL

```bash
# Listar filmes
curl http://localhost:3000/api/buscar

# Buscar filme por índice
curl http://localhost:3000/api/buscarPorId/0

# Criar novo filme
curl -X POST http://localhost:3000/api/criar \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Matrix","classificacao":14,"descricao":"Ficção científica.","lancamento":false}'

# Atualizar filme
curl -X PUT http://localhost:3000/api/alterar/0 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"O Poderoso Chefão (Remaster)","classificacao":18,"descricao":"Clássico.","lancamento":true}'

# Deletar filme
curl -X DELETE http://localhost:3000/api/deletar/0
```

---

[← Voltar ao repositório principal](../../README.md)
