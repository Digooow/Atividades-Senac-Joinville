# Avaliação 2 — API REST de Filmes (Node.js)

![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-MVC-6366F1?style=for-the-badge)

Atividade avaliativa de Backend em Node.js do curso **Jovem Programador (SENAC Joinville)**. Implementa uma API REST para gerenciamento de um catálogo de filmes em memória com **Express 5** e separação de responsabilidades no padrão MVC dentro da pasta `source/`.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/) com ES Modules (`"type": "module"`)
- [Express 5](https://expressjs.com/)
- Coleção de ambiente [Postman](.postman/resources.yaml)

## Estrutura do projeto

```text
avaliacao-node-api2/
├── .postman/
│   └── resources.yaml
├── postman/
│   └── globals/
│       └── workspace.globals.yaml
├── source/
│   ├── Controller/
│   │   └── filmesController.js
│   ├── Model/
│   │   └── filmesModel.js
│   ├── Router/
│   │   └── filmesRouter.js
│   └── Services/
│       └── filmesServices.js
├── index.js
├── package.json
└── readme.md
```

## Modelo de dados

Os registros ficam em um array em memória em [`source/Model/filmesModel.js`](./source/Model/filmesModel.js), com os campos:

- `titulo`
- `classificacaoIndicativa`
- `descricao`
- `lancamento`

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor em modo desenvolvimento:

   ```bash
   npm run dev
   ```

3. O servidor escuta na porta **`3000`** (`http://localhost:3000`, usando HTTP simples).

## Endpoints da API

Todas as rotas estão montadas sob `/api`:

| Método | Rota | Corpo (JSON) | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/filmes` | — | Lista todos os filmes (`{ "filme": [...] }`) |
| `GET` | `/api/filmes/:id` | — | Busca o filme pelo índice `id` no array |
| `POST` | `/api/filmes` | `{"titulo", "classificacaoIndicativa", "descricao", "lancamento"}` | Adiciona um novo filme |
| `PUT` | `/api/filmes/:id` | `{"titulo", "classificacaoIndicativa", "descricao"}` | Atualiza um filme existente |
| `DELETE` | `/api/filmes/:id` | — | Remove um filme pelo índice `id` |

## Exemplos com cURL

```bash
# Listar filmes
curl http://localhost:3000/api/filmes

# Buscar filme de índice 0
curl http://localhost:3000/api/filmes/0

# Deletar filme de índice 0
curl -X DELETE http://localhost:3000/api/filmes/0
```

---

[← Voltar ao repositório principal](../../README.md)
