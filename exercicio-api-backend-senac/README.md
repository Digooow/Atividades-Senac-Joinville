# Exercício de API Backend com Node.js

Atividade prática desenvolvida nas aulas do curso técnico do Senac Joinville
para estudar a criação e a organização de uma API REST utilizando Node.js,
Express e o padrão arquitetural MVC (Model-View-Controller).

Neste projeto, a API trabalha com o recurso `marcas`, representado por nomes
de marcas de veículos.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- JavaScript com módulos ES (`import` e `export`)
- API REST
- Arquitetura em camadas inspirada no padrão MVC

## Como o projeto está organizado

```text
exercicio-api-backend-senac/
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
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

O caminho de uma requisição é:

1. O cliente envia uma requisição HTTP.
2. O `marcasRouter.js` identifica o método e a URL.
3. O `marcasController.js` recebe `req` e `res`.
4. O controller chama o `marcasService.js`.
5. O service encaminha a operação para o `marcasModel.js`.
6. O model consulta ou altera o array de marcas.
7. A resposta volta pelo controller para o cliente em JSON ou texto.

Essa separação evita colocar todas as responsabilidades em um único arquivo:
as rotas cuidam dos endereços, o controller cuida do HTTP, o service faz a
ponte da regra da aplicação e o model cuida dos dados.

## Explicação dos arquivos

### 1. `index.js`

O arquivo [index.js](./index.js) é o ponto de entrada da aplicação. Ele é o
primeiro arquivo executado quando o servidor é iniciado.

#### Importações

```js
import express from 'express';
import router from './src/router/marcasRouter.js';
```

- `express` importa o framework Express, usado para criar o servidor HTTP.
- `router` importa o conjunto de rotas criado em `marcasRouter.js`.
- A extensão `.js` é utilizada porque o projeto trabalha com módulos ES.

#### Criação da aplicação

```js
const app = express();
const port = 3000;
```

- `express()` cria a aplicação Express.
- `app` passa a ser o objeto que recebe configurações, middlewares e rotas.
- `port` define que o servidor escutará na porta `3000`.

#### Leitura de JSON

```js
app.use(express.json());
```

`express.json()` é um middleware que permite interpretar o corpo de
requisições enviadas no formato JSON. Ele é necessário, por exemplo, para que
o controller consiga acessar `req.body.marca` em uma requisição `POST` ou
`PUT`.

#### Prefixo das rotas

```js
app.use('/api', router);
```

Esse comando registra o router na aplicação usando o prefixo `/api`. Portanto,
a rota declarada no router como `/marcas` fica disponível externamente como
`/api/marcas`.

#### Inicialização do servidor

```js
app.listen(port, (req, res) => {
    console.log(`Servidor rodando em https://localhost:${port}`)
});
```

`app.listen` inicia o servidor na porta `3000`. Quando o servidor começa a
escutar, a mensagem é exibida no terminal.

> A aplicação está configurada como HTTP, não HTTPS. Portanto, as requisições
> devem ser feitas em `http://localhost:3000`, mesmo que a mensagem exibida no
> terminal atualmente contenha `https://`.

### 2. `src/router/marcasRouter.js`

O arquivo [marcasRouter.js](./src/router/marcasRouter.js) define os endereços
da API e associa cada combinação de método HTTP e URL a um método do
controller.

#### Importações e criação do router

```js
import express from "express";
import ControllerMarca from "../controller/marcasController.js";

const router = express.Router();
```

- `express` fornece a função usada para criar um router separado.
- `ControllerMarca` importa o controller que executará cada operação.
- `express.Router()` cria um objeto para agrupar as rotas de marcas.

#### Rotas disponíveis

```js
router.get('/marcas', ControllerMarca.Buscar);
router.get('/marcas/:id', ControllerMarca.BuscarPorId);
router.post('/marcas', ControllerMarca.Criar);
router.put('/marcas/:id', ControllerMarca.Atualizar);
router.delete('/marcas/:id', ControllerMarca.Deletar);
```

- `GET /marcas`: chama `Buscar` para listar todas as marcas.
- `GET /marcas/:id`: chama `BuscarPorId`. O trecho `:id` é um parâmetro
  dinâmico, acessível pelo controller através de `req.params.id`.
- `POST /marcas`: chama `Criar` para adicionar uma marca.
- `PUT /marcas/:id`: chama `Atualizar` para substituir uma marca existente.
- `DELETE /marcas/:id`: chama `Deletar` para remover uma marca.

Como o router é registrado com `/api` no `index.js`, as URLs completas são,
por exemplo, `/api/marcas` e `/api/marcas/2`.

#### Exportação

```js
export default router;
```

Exporta o router para que o `index.js` possa registrá-lo na aplicação.

### 3. `src/controller/marcasController.js`

O arquivo [marcasController.js](./src/controller/marcasController.js) é a
camada que conversa diretamente com o Express. Ele recebe a requisição,
retira os dados necessários, chama o service e envia a resposta.

#### Instância do service

```js
import ServiceMarca from '../service/marcasService.js';

const marcas = new ServiceMarca();
```

O controller importa a classe do service e cria uma instância. A variável
`marcas` será utilizada para chamar os métodos de negócio.

#### Método `Buscar`

```js
Buscar(req, res) {
    try {
        const nomes = marcas.Buscar();
        res.send(nomes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
```

Esse método atende ao `GET /api/marcas`.

- `req` representa a requisição recebida e `res` representa a resposta.
- `marcas.Buscar()` solicita ao service a lista completa.
- `res.send(nomes)` envia a lista ao cliente.
- Se ocorrer um erro, o bloco `catch` retorna o status HTTP `500` com a
  mensagem do erro.

#### Método `BuscarPorId`

```js
const { id } = req.params;
const marca = marcas.BuscarPorId(id);
res.send(marca);
```

Esse método atende ao `GET /api/marcas/:id`.

- `req.params` contém os parâmetros escritos na URL.
- A desestruturação obtém o valor de `id`.
- O controller passa o ID ao service.
- O resultado é enviado ao cliente.

#### Método `Criar`

```js
const marca = req.body.marca;
marcas.Criar(marca);
res.send({ message: 'Marca registrada com sucesso!' });
```

Esse método atende ao `POST /api/marcas`.

- `express.json()` interpreta o JSON enviado.
- `req.body.marca` acessa a propriedade `marca` do corpo.
- O valor é enviado ao service para ser adicionado.
- Depois, o controller retorna uma mensagem de sucesso.

Exemplo de corpo:

```json
{
  "marca": "Volkswagen"
}
```

#### Método `Atualizar`

```js
const id = req.params.id;
const marca = req.body.marca;
marcas.Atualizar(id, marca);
res.send({ message: 'Marca atualizada com sucesso!' });
```

Esse método atende ao `PUT /api/marcas/:id`. Ele obtém o ID da URL e o novo
nome do corpo JSON, envia os dois valores ao service e retorna uma mensagem
confirmando a atualização.

#### Método `Deletar`

```js
const id = req.params.id;
marcas.Deletar(id);
res.send({ message: 'Marca deletada com sucesso!' });
```

Esse método atende ao `DELETE /api/marcas/:id`. Ele obtém o ID, chama o service
para remover o item e retorna uma mensagem de sucesso.

#### Exportação do controller

```js
export default new ControllerMarca();
```

Em vez de exportar a classe, o arquivo exporta uma única instância dela. Assim,
o router consegue usar diretamente `ControllerMarca.Buscar`,
`ControllerMarca.Criar` e os demais métodos.

### 4. `src/service/marcasService.js`

O arquivo [marcasService.js](./src/service/marcasService.js) representa a
camada de serviço. Seu papel é fazer a ponte entre o controller e o model.
Neste exercício, os métodos ainda são simples encaminhamentos, mas essa é a
camada onde normalmente ficam validações e regras de negócio.

#### Importação e instância do model

```js
import MarcasModel from '../model/marcasModel.js';

const marcas = new MarcasModel();
```

O service importa o model e cria uma instância dele. A partir daí, cada método
do service pode chamar o método equivalente do model.

#### Métodos de encaminhamento

```js
Buscar() {
    return marcas.Buscar();
}
```

Retorna ao controller o resultado da consulta feita pelo model.

```js
BuscarPorId(id) {
    return marcas.BuscarPorId(id);
}
```

Recebe um ID e solicita ao model a marca correspondente.

```js
Criar(marca) {
    return marcas.Criar(marca);
}
```

Envia uma nova marca para o model. O `return` permite repassar ao controller
qualquer resultado que o model venha a retornar.

```js
Atualizar(id, marca) {
    return marcas.Atualizar(id, marca);
}
```

Envia o ID e o novo valor para o model atualizar o item.

```js
Deletar(id) {
    return marcas.Deletar(id);
}
```

Envia o ID para o model remover a marca.

#### Exportação

```js
export default ServiceMarca;
```

Exporta a classe para que o controller possa criar sua instância.

### 5. `src/model/marcasModel.js`

O arquivo [marcasModel.js](./src/model/marcasModel.js) é responsável por
representar e manipular os dados. Neste projeto, os dados não são salvos em
um banco de dados: eles ficam em um array mantido na memória do processo.

#### Lista inicial

```js
const marcas = new Array(
  "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai",
  "Jeep", "Nissan", "Peugeot", "Renault", "Toyota"
);
```

Cria o array com dez marcas iniciais. Cada posição do array funciona como o
identificador usado pelas rotas. Por exemplo, `"Chevrolet"` está no índice
`0` e `"Fiat"` está no índice `1`.

#### Método `Buscar`

```js
Buscar() {
    return marcas;
}
```

Retorna o array completo com todas as marcas.

#### Método `BuscarPorId`

```js
BuscarPorId(id) {
    return marcas[id];
}
```

Usa o ID recebido como índice do array e retorna o item daquela posição. Como
os parâmetros de rota chegam como texto, o JavaScript converte valores como
`"2"` para o índice numérico correspondente.

#### Método `Criar`

```js
Criar(marca) {
    marcas.push(marca);
}
```

`push` adiciona a nova marca ao final do array.

#### Método `Atualizar`

```js
Atualizar(id, marca) {
    marcas[id] = marca;
}
```

Substitui o valor armazenado no índice indicado pelo ID.

#### Método `Deletar`

```js
Deletar(id) {
    marcas.splice(id, 1);
}
```

`splice` remove um item do array. O primeiro argumento indica a posição e o
segundo (`1`) indica que apenas um item deve ser removido.

#### Exportação

```js
export default MarcasModel;
```

Exporta a classe do model para ser utilizada pelo service.

> Como os dados ficam somente na memória, todas as marcas criadas, alteradas ou
> removidas são perdidas quando o servidor é encerrado ou reiniciado. Além
> disso, como o ID é o índice do array, a remoção de um item pode alterar os
> índices dos itens seguintes.

## Endpoints da API

Todas as rotas possuem o prefixo `/api`.

| Método    | Endpoint            | Função                     |
| ---------- | ------------------- | ---------------------------- |
| `GET`    | `/api/marcas`     | Lista todas as marcas        |
| `GET`    | `/api/marcas/:id` | Busca uma marca pelo índice |
| `POST`   | `/api/marcas`     | Adiciona uma marca           |
| `PUT`    | `/api/marcas/:id` | Atualiza uma marca           |
| `DELETE` | `/api/marcas/:id` | Remove uma marca             |

Exemplos usando `curl`:

```bash
# Listar marcas
curl http://localhost:3000/api/marcas

# Buscar a marca do índice 0
curl http://localhost:3000/api/marcas/0

# Criar uma marca
curl -X POST http://localhost:3000/api/marcas ^
  -H "Content-Type: application/json" ^
  -d "{\"marca\":\"Volkswagen\"}"

# Atualizar a marca do índice 0
curl -X PUT http://localhost:3000/api/marcas/0 ^
  -H "Content-Type: application/json" ^
  -d "{\"marca\":\"Chevrolet Atualizada\"}"

# Deletar a marca do índice 0
curl -X DELETE http://localhost:3000/api/marcas/0
```

## Como executar

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

O script `dev` utiliza `node --watch`, reiniciando a aplicação quando os
arquivos são alterados. Também é possível iniciar diretamente com:

```bash
node index.js
```

Depois, acesse a API em:

```text
http://localhost:3000/api/marcas
```

## Resumo da responsabilidade de cada arquivo

| Arquivo                                                    | Responsabilidade                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| [index.js](./index.js)                                      | Cria e inicia o servidor Express, habilita JSON e registra o router |
| [marcasRouter.js](./src/router/marcasRouter.js)             | Declara métodos HTTP e URLs                                        |
| [marcasController.js](./src/controller/marcasController.js) | Processa requisições e monta respostas                            |
| [marcasService.js](./src/service/marcasService.js)          | Faz a ponte e concentra regras da aplicação                       |
| [marcasModel.js](./src/model/marcasModel.js)                | Armazena e altera os dados em memória                              |
