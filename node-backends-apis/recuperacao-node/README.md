# Recuperação da Atividade - Node.js

Projeto de recuperação da atividade de Node.js, desenvolvido com Express para simular um CRUD de pessoas em memória.

## Objetivo

A aplicação permite realizar operações básicas de gerenciamento de nomes de pessoas:

- listar todos os registros;
- buscar um registro por ID;
- criar novo registro;
- alterar um registro existente;
- deletar um registro.

## Tecnologias utilizadas

- Node.js
- Express
- JavaScript ES Modules

## Estrutura do projeto

```text
recuperacaoNode/
├── index.js
├── package.json
├── README.md
└── src/
    ├── controller/
    │   └── pessoa.js
    ├── model/
    │   └── pessoa.js
    ├── router/
    │   └── pessoa.js
    └── service/
        └── pessoa.js
```

### Descrição das pastas

- `index.js`: inicializa o servidor Express e registra as rotas da API.
- `src/model/pessoa.js`: contém a estrutura de dados em memória e as operações do CRUD.
- `src/service/pessoa.js`: aplica validações e encaminha as ações para o model.
- `src/controller/pessoa.js`: recebe a requisição HTTP, chama o service e retorna a resposta ao cliente.
- `src/router/pessoa.js`: define as rotas da API.

## Como executar

1. Abra o terminal na pasta do projeto.
2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor:

```bash
npm run dev
```

4. Acesse a API em:

```text
http://localhost:3000
```

## Endpoints

A API está montada em `/api`.

### 1. Listar todos

- Método: `GET`
- Rota: `/api/buscar`

Resposta esperada:

```json
{
  "nomes": ["Ana", "Batata", "Abacaxi"]
}
```

### 2. Buscar por ID

- Método: `GET`
- Rota: `/api/buscarUm/:id`

Exemplo:

```text
GET /api/buscarUm/0
```

Resposta esperada:

```json
{
  "nome": "Ana"
}
```

### 3. Criar pessoa

- Método: `POST`
- Rota: `/api/criar`
- Corpo da requisição:

```json
{
  "nome": "Carlos"
}
```

Resposta esperada:

```json
{
  "message": "Criado com sucesso!"
}
```

### 4. Alterar pessoa

- Método: `PUT`
- Rota: `/api/alterar/:id`
- Corpo da requisição:

```json
{
  "nome": "Maria"
}
```

Resposta esperada:

```json
{
  "message": "Alterado com sucesso!"
}
```

### 5. Deletar pessoa

- Método: `DELETE`
- Rota: `/api/deletar/:id`

Exemplo:

```text
DELETE /api/deletar/1
```

Resposta esperada:

```json
{
  "message": "Deletado com sucesso!"
}
```

## Observações de implementação

- Os dados são armazenados em memória em um array localizado no model.
- A estrutura segue o padrão MVC (Model-View-Controller), com a separação de responsabilidades em model, service e controller.
- O projeto usa `Express.Router` para organizar as rotas e manter a API modularizada.

## Exemplo de uso com cURL

### Listar nomes

```bash
curl http://localhost:3000/api/buscar
```

### Criar novo nome

```bash
curl -X POST http://localhost:3000/api/criar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos"}'
```

### Alterar nome

```bash
curl -X PUT http://localhost:3000/api/alterar/0 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria"}'
```

### Deletar nome

```bash
curl -X DELETE http://localhost:3000/api/deletar/1
```

## Conclusão

Este projeto demonstra a criação de uma API REST simples em Node.js com Express, organizada em camadas para facilitar a manutenção e o entendimento do código. Ele serve como base para desenvolvimento de aplicações mais complexas com rotas, validações e manipulação de dados.
