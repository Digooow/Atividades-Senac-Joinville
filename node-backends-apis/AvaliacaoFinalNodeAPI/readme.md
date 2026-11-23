# Avaliação Final Node API — Clientes & Atendimentos

![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

Projeto da avaliação final da disciplina de Backend em Node.js do curso **Jovem Programador (SENAC Joinville)**. A aplicação é uma API REST multi-recurso construída com **Express 5**, **Sequelize ORM** e **PostgreSQL**, seguindo a arquitetura em camadas (Router → Controller → Service → Model) para gerenciar **Clientes** e **Atendimentos**.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/) com ES Modules (`"type": "module"`)
- [Express 5](https://expressjs.com/)
- [Sequelize 6](https://sequelize.org/)
- [PostgreSQL (`pg`)](https://www.postgresql.org/)

## Estrutura do projeto

```text
AvaliacaoFinalNodeAPI/
├── index.js
├── package.json
├── readme.md
└── src/
    ├── config/
    │   └── database.js
    ├── controller/
    │   ├── atendimento.js
    │   └── cliente.js
    ├── model/
    │   ├── atendimento.js
    │   └── cliente.js
    ├── router/
    │   ├── atendimento.js
    │   └── cliente.js
    └── service/
        ├── atendimento.js
        └── cliente.js
```

## Modelos de dados (Sequelize)

- **Cliente ([`src/model/cliente.js`](./src/model/cliente.js))**:
  - `id`: `INTEGER` (chave primária, auto-incremento)
  - `nome`: `STRING`
  - `email`: `STRING`
  - `senha`: `STRING`
- **Atendimento ([`src/model/atendimento.js`](./src/model/atendimento.js))**:
  - `id`: `INTEGER` (chave primária, auto-incremento)
  - `data`: `STRING`
  - `valor`: `INTEGER`
  - `concluido`: `BOOLEAN`

## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente (PostgreSQL)

Configuradas em [`src/config/database.js`](./src/config/database.js):

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `DB_HOST` | `localhost` | Host do banco PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_NAME` | `exemplodb_ij8o` | Nome do banco |
| `DB_USER` | `postgres` | Usuário de acesso |
| `DB_PASSWORD` | `""` | Senha de acesso |
| `DB_SSL` | `false` | Defina `true` para conexões que exigem SSL |

### 3. Iniciar a aplicação

```bash
npm run dev
```

O servidor sincroniza as tabelas automaticamente (`sync({ force: false })`) e inicia em `http://localhost:3000`.

## Endpoints da API

### Recurso: Clientes (`/api/cliente`)

| Método | Rota | Corpo (JSON) | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cliente/buscar` | — | Lista todos os clientes (`200 { "nomes": [...] }`) |
| `GET` | `/api/cliente/buscarUm/:id` | — | Busca cliente por ID (`200 { "cliente": {...} }` ou `404`) |
| `POST` | `/api/cliente/criar` | `{"nome", "email", "senha"}` | Cria um novo cliente (`201`) |
| `PUT` | `/api/cliente/alterar/:id` | `{"nome", "email", "senha"}` | Atualiza os dados do cliente (`200`) |
| `DELETE` | `/api/cliente/deletar/:id` | — | Remove um cliente por ID (`200`) |

### Recurso: Atendimentos (`/api/atendimento`)

| Método | Rota | Corpo (JSON) | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/atendimento/buscar` | — | Lista todos os atendimentos |
| `GET` | `/api/atendimento/buscarUm/:id` | — | Busca atendimento por ID |
| `POST` | `/api/atendimento/criar` | `{"data", "valor", "concluido"}` | Cadastra um novo atendimento |
| `PUT` | `/api/atendimento/alterar/:id` | `{"data", "valor", "concluido"}` | Atualiza um atendimento existente |
| `DELETE` | `/api/atendimento/deletar/:id` | — | Rota registrada para exclusão de atendimento |

> **Observações do código atual:** Em `src/service/atendimento.js`, a validação usa verificação truthy (`!concluido`), exigindo `concluido: true` na criação/edição; em `src/controller/atendimento.js`, o método `Deletar()` foi declarado sem os parâmetros `(req, res)`.

## Exemplos com cURL

```bash
# Cadastrar cliente
curl -X POST http://localhost:3000/api/cliente/criar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rodrigo","email":"rodrigo@example.com","senha":"123"}'

# Listar clientes
curl http://localhost:3000/api/cliente/buscar

# Cadastrar atendimento
curl -X POST http://localhost:3000/api/atendimento/criar \
  -H "Content-Type: application/json" \
  -d '{"data":"2026-08-20","valor":150,"concluido":true}'
```

---

[← Voltar ao repositório principal](../../README.md)
