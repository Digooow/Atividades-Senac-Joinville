# Exercício de API Backend com Node.js

Atividade prática desenvolvida nas aulas do curso técnico do Senac Joinville
para estudar a criação e a organização de uma API REST utilizando Node.js,
Express e o padrão arquitetural **MVC (Model-View-Controller)**.

> **Status da atividade:** em desenvolvimento.
> A implementação será finalizada durante as aulas ao longo da semana. Este
> README documenta a organização atual do projeto e a proposta da atividade,
> sem antecipar funcionalidades que ainda não foram implementadas.

## Objetivo da atividade

O objetivo é aprender a estruturar um projeto backend separando cada
responsabilidade em sua própria camada. A API deste exercício está sendo
organizada para trabalhar com o recurso de **marcas**.

Com essa separação, o fluxo esperado de uma requisição é:

1. O cliente envia uma requisição HTTP para a API.
2. O **router** identifica a rota e o método HTTP.
3. O **controller** recebe a requisição, acessa os dados enviados e prepara a
   resposta.
4. O **service** concentra as regras de negócio.
5. O **model** representa e manipula os dados do recurso.
6. A API devolve uma resposta HTTP ao cliente em formato JSON.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- JavaScript com módulos ES (`import`/`export`)
- API REST
- Arquitetura MVC

## Estrutura de pastas

```text
exercicio-api-backend-senac/
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── src/
    ├── controller/
    │   └── marcasController.js
    ├── model/
    │   └── marcasModel.js
    ├── router/
    │   └── marcasRouter.js
    └── service/
        └── marcasService.js
```

### Responsabilidade de cada arquivo

- **`index.js`**: ponto de entrada da aplicação. Cria o servidor Express,
  habilita o recebimento de JSON e registra o router no prefixo `/api`.
- **`src/router/marcasRouter.js`**: responsável por declarar as rotas do
  recurso `marcas` e encaminhar cada requisição para o controller.
- **`src/controller/marcasController.js`**: camada responsável por interpretar
  requisições HTTP, chamar o service e montar as respostas.
- **`src/service/marcasService.js`**: camada destinada às regras de negócio,
  validações e operações do recurso.
- **`src/model/marcasModel.js`**: camada destinada à representação e ao acesso
  aos dados de marcas.

## Organização MVC

### Model

O model representa os dados da aplicação. Neste exercício, ele será utilizado
para definir como uma marca será armazenada e consultada. A camada de model
deve evitar concentrar regras de requisição HTTP, mantendo seu foco nos dados.

### View

Em uma API REST, a view não é necessariamente uma página HTML. A resposta
enviada pelo controller, normalmente em JSON, cumpre o papel de apresentar os
dados ao cliente.

### Controller

O controller funciona como intermediário entre as requisições e as regras da
aplicação. Ele deve receber os parâmetros, o corpo da requisição e os dados
necessários, chamar o service adequado e retornar o status HTTP e a resposta.

### Service

O service concentra a lógica da aplicação. Essa separação permite que as
regras de negócio não fiquem misturadas com os detalhes do Express ou das
rotas.

## API REST planejada

O recurso trabalhado é `marcas`. As operações previstas no controller atual
indicam a implementação das seguintes ações:

| Método              | Rota planejada      | Objetivo                            |
| -------------------- | ------------------- | ----------------------------------- |
| `GET`              | `/api/marcas`     | Listar marcas                       |
| `GET`              | `/api/marcas/:id` | Buscar uma marca pelo identificador |
| `POST`             | `/api/marcas`     | Criar uma marca                     |
| `PUT` ou `PATCH` | `/api/marcas/:id` | Atualizar uma marca                 |

Essas rotas são uma referência da atividade e ainda dependem da finalização do
router, do service, do model e das validações correspondentes.

## Como executar o projeto

1. Instale o Node.js.
2. Abra um terminal na pasta do projeto.
3. Instale as dependências:

   ```bash
   npm install
   ```
4. Inicie a aplicação:

   ```bash
   npm run dev
   ```

   O script `dev` inicia o servidor com `node --watch`, reiniciando a
   aplicação automaticamente quando os arquivos forem alterados. Para executar
   o arquivo diretamente, sem esse reinício automático, também é possível usar
   `node index.js`.

O servidor está configurado para utilizar a porta `3000`. Quando a
implementação estiver concluída, as requisições poderão ser feitas no endereço:

```text
http://localhost:3000/api
```

> No estado atual, a atividade ainda não está pronta para uso completo. A
> existência do arquivo de entrada não significa que todas as rotas e
> operações já estejam disponíveis.

## Pendências para a próxima aula

- Finalizar o model de marcas.
- Implementar as operações do service.
- Completar e exportar o router.
- Ajustar a integração entre router, controller, service e model.
- Revisar os nomes dos caminhos de importação.
- Implementar as operações de listar, buscar por ID, criar e atualizar.
- Definir a estrutura dos objetos de marca e suas validações.
- Padronizar os códigos de status e as mensagens de erro.
- Testar as rotas com uma ferramenta de requisições HTTP.
- Adicionar testes automatizados quando a implementação estiver concluída.

## Aprendizados da aula

Esta atividade reforça:

- a importância de separar responsabilidades em pastas;
- o funcionamento básico de uma API HTTP com Express;
- o papel de cada camada do padrão MVC;
- a diferença entre rota, controller, service e model;
- a organização de endpoints seguindo a ideia de uma API REST;
- a manutenção e a evolução de um projeto backend com uma estrutura mais clara.

## Observação

O projeto representa o andamento da atividade em sala de aula. As partes
incompletas são intencionais e serão desenvolvidas posteriormente durante a
semana.
