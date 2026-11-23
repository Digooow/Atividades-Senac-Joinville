# API REST de Pessoas — Node.js, Sequelize & PostgreSQL

![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

Projeto de recuperação da disciplina de Backend em Node.js do curso **Jovem Programador (SENAC Joinville)**. A aplicação implementa uma API REST em camadas (MVC) utilizando **Express 5**, **Sequelize ORM** e **PostgreSQL** para gerenciar o cadastro de pessoas.

## Objetivo

Fornecer operações completas de CRUD persistidas em banco relacional PostgreSQL:

- listar todas as pessoas cadastradas;
- buscar uma pessoa específica por ID;
- cadastrar uma nova pessoa (`nome` e `idade`);
- atualizar o nome de um registro existente;
- excluir um registro por ID.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/) com ES Modules (`"type": "module"`)
- [Express 5](https://expressjs.com/)
- [Sequelize 6](https://sequelize.org/)
- [PostgreSQL (`pg`)](https://www.postgresql.org/)

## Estrutura do projeto

```text
recuperacao-node/
├── index.js
├── package.json
├── README.md
└── src/
    ├── config/
    │   └── database.js
    ├── controller/
    │   └── pessoa.js
    ├── model/
    │   └── pessoa.js
    ├── router/
    │   └── pessoa.js
    └── service/
        └── pessoa.js
```

### Responsabilidade das camadas

- [`index.js`](./index.js): cria a aplicação Express, desabilita o header `x-powered-by`, habilita JSON, monta as rotas em `/api`, sincroniza o Sequelize (`sync({ force: false })`) e inicia o servidor na porta `3000`.
- [`src/config/database.js`](./src/config/database.js): configura a instância do Sequelize com PostgreSQL via variáveis de ambiente.
- [`src/model/pessoa.js`](./src/model/pessoa.js): define o modelo `pessoa` com os campos `id` (chave primária auto-incremento), `nome` (`STRING`) e `idade` (`INTEGER`).
- [`src/service/pessoa.js`](./src/service/pessoa.js): valida os parâmetros (`id`, `nome`, `idade`) e executa as operações no ORM.
- [`src/controller/pessoa.js`](./src/controller/pessoa.js): recebe `req` e `res`, aciona o service e retorna os status HTTP adequados (`200`, `201`, `400`, `404`, `500`).
- [`src/router/pessoa.js`](./src/router/pessoa.js): declara os endpoints da API.

## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente (PostgreSQL)

A conexão em [`src/config/database.js`](./src/config/database.js) lê as seguintes variáveis de ambiente (com valores padrão de desenvolvimento):

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `DB_HOST` | `localhost` | Host do servidor PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_NAME` | `exemplodb_ij8o` | Nome do banco de dados |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `""` | Senha do banco |
| `DB_SSL` | `false` | Defina `true` para conexões com SSL obrigatório |

### 3. Iniciar o servidor

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

## Endpoints da API

Todas as rotas utilizam o prefixo `/api`.

| Método | Rota | Corpo (JSON) | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/buscar` | — | Lista todas as pessoas (`200 { "nomes": [...] }`) |
| `GET` | `/api/buscarUm/:id` | — | Busca uma pessoa pelo ID (`200 { "pessoa": {...} }` ou `404`) |
| `POST` | `/api/criar` | `{"nome": "Carlos", "idade": 25}` | Cadastra uma nova pessoa (`201`) |
| `PUT` | `/api/alterar/:id` | `{"nome": "Maria"}` | Atualiza o nome da pessoa (`200`) |
| `DELETE` | `/api/deletar/:id` | — | Remove o registro informado (`200`) |

## Exemplos de uso com cURL

```bash
# Listar todas as pessoas
curl http://localhost:3000/api/buscar

# Buscar pessoa por ID
curl http://localhost:3000/api/buscarUm/1

# Criar nova pessoa
curl -X POST http://localhost:3000/api/criar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos","idade":25}'

# Alterar nome por ID
curl -X PUT http://localhost:3000/api/alterar/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria"}'

# Deletar pessoa por ID
curl -X DELETE http://localhost:3000/api/deletar/1
```

---

[← Voltar ao repositório principal](../../README.md)
