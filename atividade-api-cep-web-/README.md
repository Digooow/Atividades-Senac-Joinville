# Cadastro e Consulta de Endereços — ViaCEP com Node.js

Atividade prática desenvolvida no SENAC Joinville com o objetivo de construir um sistema de cadastro e consulta de endereços integrado à API pública do ViaCEP, aplicando o padrão arquitetural MVC (Model-View-Controller) tanto no front-end quanto no back-end em Node.js, persistindo as consultas em um arquivo JSON e incluindo suíte de testes automatizados.

---

## Objetivo da Atividade

1. Permitir que o usuário informe um CEP.
2. Consultar a API pública ViaCEP (https://viacep.com.br/ws/[CEP]/json/).
3. Preencher automaticamente os campos de endereço:
   - Rua (logradouro)
   - Bairro (bairro)
   - Cidade (cidade / localidade)
   - Estado (estado / uf)
4. Tratar erros de CEP inexistente, exibindo mensagem amigável e limpando os campos.
5. Permitir salvar as consultas realizadas em um arquivo JSON através de uma API em Node.js.
6. Permitir salvar o endereço completo informando o número, evitando duplicidade para o mesmo CEP e número.
7. Disponibilizar na interface uma área para consultar, filtrar e recarregar os endereços cadastrados no histórico.
8. Garantir a confiabilidade com testes automatizados para o modelo, rotas da API e validação de dados.

---

## Arquitetura MVC

O projeto é dividido em camadas desacopladas seguindo o padrão Model-View-Controller:

### Front-end

- Model (js/models/EnderecoModel.js): gerencia a validação de formato do CEP, requisição assíncrona à API do ViaCEP e comunicação com a API REST do back-end para listar e salvar os endereços.
- View (js/views/EnderecoView.js): gerencia os elementos do DOM, renderização do formulário, mensagens de status, lista de endereços cadastrados e preenchimento automático ao selecionar um endereço.
- Controller (js/controllers/EnderecoController.js): orquestra os eventos do usuário (buscar CEP, salvar endereço completo, filtrar e selecionar endereços).
- App (js/app.js): inicializa as instâncias do Model, View e Controller ao carregar o DOM.

### Back-end

- Model (src/models/enderecoModel.js): gerencia a leitura e escrita no arquivo dados/enderecos.json e a filtragem por termo de busca.
- Controller (src/controllers/enderecoController.js): trata as requisições HTTP (GET e POST), valida os dados e retorna as respostas em formato JSON com status HTTP correspondentes.
- Routes (src/routes/enderecoRoutes.js): define as rotas da API REST (/api/enderecos).
- Server (server.js): configura o servidor Express, middlewares (CORS e JSON), entrega de arquivos estáticos e inicialização na porta 3000.

---

## Estrutura de Arquivos

```text
atividade-api-cep-web-/
│
├── index.html
├── README.md
├── package.json
├── server.js
│
├── dados/
│   └── enderecos.json
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── controllers/
│   │   └── EnderecoController.js
│   ├── models/
│   │   └── EnderecoModel.js
│   └── views/
│       └── EnderecoView.js
│
├── src/
│   ├── controllers/
│   │   └── enderecoController.js
│   ├── models/
│   │   └── enderecoModel.js
│   ├── routes/
│       └── enderecoRoutes.js
│   └── utils/
│       └── enderecoValidation.js
│
└── test/
    ├── cepValidation.test.js
    ├── enderecoApi.test.js
    ├── enderecoModel.test.js
    ├── enderecoValidation.test.js
    ├── frontendModel.test.js
    ├── frontendController.test.js
    └── frontendView.test.js
```

---

## Rotas da API Back-end

- GET /api/enderecos: retorna todos os endereços salvos no arquivo JSON.
- GET /api/enderecos?busca=joinville: filtra os endereços por CEP, rua, bairro, cidade ou estado.
- GET /api/enderecos?pagina=1&limite=20: retorna uma página com até 20 registros.
- POST /api/enderecos: salva um novo endereço no arquivo JSON e retorna 409 quando o mesmo CEP e número já estão cadastrados.

Os dados recebidos pelo POST são validados no backend. O CEP precisa conter oito dígitos, todos os campos do endereço devem ser textos, logradouro, número, bairro e cidade não podem ficar vazios e o estado deve ser uma das 27 siglas oficiais brasileiras. A busca do histórico ignora diferenças entre maiúsculas, minúsculas e acentos.

O servidor aceita a variável `CORS_ORIGIN` para restringir a origem permitida. Sem essa variável, o CORS permanece aberto para facilitar o desenvolvimento local. O corpo JSON é limitado a 10 KB; requisições acima desse limite retornam HTTP 413. Erros inesperados da API retornam respostas JSON padronizadas. Os arquivos públicos e o arquivo JSON são resolvidos a partir da localização do projeto, independentemente do diretório em que o comando é executado.

---

## Como Executar

### 1. Instalar as dependências

No terminal da pasta do projeto, execute:

```bash
npm install
```

### 2. Iniciar o servidor Node.js

Para iniciar o servidor:

```bash
npm start
```

Ou em modo de desenvolvimento com monitoramento automático:

```bash
npm run dev
```

O servidor iniciará em http://localhost:3000.

### 3. Acessar a aplicação

Abra o navegador no endereço:

http://localhost:3000

Também é possível abrir diretamente o arquivo index.html no navegador ou através da extensão Live Server no VS Code, pois a API possui suporte a CORS habilitado.

Para restringir o CORS em um ambiente específico, defina a variável antes de iniciar o servidor:

```bash
CORS_ORIGIN=http://localhost:5500 npm start
```

No PowerShell do Windows, use:

```powershell
$env:CORS_ORIGIN = "http://localhost:5500"
npm start
```

O caminho dos arquivos públicos e de `dados/enderecos.json` é resolvido a partir da localização do projeto, e não do diretório em que o comando foi executado.

## Limitações da persistência em JSON

A persistência em arquivo JSON atende ao objetivo didático da atividade, mas não é indicada para produção. Embora a API ofereça paginação na leitura, o arquivo não possui índices, requisições de processos diferentes podem disputar a escrita e o arquivo pode ser corrompido em caso de interrupção durante a gravação. Em uma aplicação real, recomenda-se utilizar um banco de dados com transações, índices e controle de concorrência.

---

## Testes Automatizados

O projeto utiliza o executor nativo de testes do Node.js (node:test e node:assert), dispensando bibliotecas adicionais.

Para executar todos os testes automatizados:

```bash
npm test
```

### Cobertura dos testes:

- test/cepValidation.test.js: validação de tamanho, formato, limpeza de máscara e tratamento de erros do campo CEP.
- test/enderecoModel.test.js: testes unitários de persistência, leitura, escrita e filtragem no arquivo JSON.
- test/enderecoApi.test.js: testes de integração das rotas HTTP (GET e POST de /api/enderecos), verificando status codes e respostas.
- A suíte também verifica CEP inválido, tipos incorretos, campos obrigatórios e duplicidade por CEP e número.
- Os testes de frontend verificam a API relativa, propagação de falhas, cancelamento de buscas, renderização de dados incompletos e o comportamento após falha na atualização do histórico. A API também testa limite de corpo, paginação, parâmetros inválidos e execução independente do diretório atual.

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js (com node:test e node:assert nativos)
- Express
- CORS
- API ViaCEP
- Persistência em JSON (fs/promises)
