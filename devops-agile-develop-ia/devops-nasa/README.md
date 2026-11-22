# Diário do Cosmos — NASA APOD

Aplicação web responsiva que exibe a **Imagem Astronômica do Dia (APOD — Astronomy Picture of the Day)** utilizando a API oficial da NASA (`https://api.nasa.gov/planetary/apod`), construída com o apoio do GitHub Copilot a partir de diretrizes técnicas e de segurança previamente definidas.

---

## Funcionalidades

- **APOD do Dia:** Exibe título, data formatada, mídia (imagem ou vídeo), créditos/copyright e explicação completa.
- **Seleção de Datas:** Permite escolher qualquer data a partir de **16/06/1995** (início do arquivo APOD) e navegar com botões de **◀ Dia Anterior**, **Hoje**, **Próximo Dia ▶** e **Data Aleatória**.
- **Suporte a Imagens e Vídeos:**
  - Imagens com link para versão em alta definição (`hdurl`, quando disponível) e fallback em caso de falha de carregamento.
  - Vídeos incorporados responsivamente em proporção `16:9` (YouTube, Vimeo ou arquivos diretos `.mp4`/`.webm`/`.ogg`), com miniatura e link alternativo seguro.
- **Feedback de Estado:** Indicador visual de carregamento durante as requisições e tratamento de erros amigável com botão **Tentar novamente**.
- **Design Responsivo (Mobile-First):** Adaptado para telas pequenas de celular e layouts amplos de desktop.
- **Segurança da Chave de API:** A chave da NASA fica protegida exclusivamente no backend em `.env` e **nunca** é exposta ao navegador ou ao repositório Git.

---

## Documentação e Arquitetura

- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — Regras objetivas de tecnologias, arquitetura, estilização e segurança seguidas no projeto.
- [`INTERACOES_COPILOT.md`](INTERACOES_COPILOT.md) — Registro das 5 interações importantes com o GitHub Copilot Chat (pedido, resposta e ajustes aplicados).

### Estrutura do Projeto

```text
devops-nasa/
├── .github/
│   └── copilot-instructions.md   # Diretrizes do projeto para o GitHub Copilot
├── public/
│   ├── index.html                # Estrutura HTML5 semântica e acessível
│   ├── styles.css                # Estilização CSS3 responsiva (Mobile-First)
│   └── app.js                    # Lógica frontend, consumo de /api/apod e renderização segura
├── server/
│   └── server.js                 # Servidor Express + proxy seguro para a API APOD
├── .env.example                  # Modelo de variáveis de ambiente (versionado)
├── .gitignore                    # Impede o versionamento de .env e node_modules
├── INTERACOES_COPILOT.md         # Registro das 5 interações com o Copilot
├── package.json                  # Dependências e scripts Node.js
└── README.md                     # Documentação de uso e execução
```

---

## Pré-requisitos

- **Node.js** versão `18.0.0` ou superior (necessário para suporte nativo a `fetch`)
- **npm** (instalado junto com o Node.js)
- Uma chave gratuita da API da NASA obtida em [https://api.nasa.gov/](https://api.nasa.gov/)

---

## Como Rodar o Projeto

### 1. Clonar o repositório e instalar as dependências

```bash
git clone <URL_DO_REPOSITORIO>
cd devops-nasa
npm install
```

### 2. Gerar sua chave gratuita da NASA e configurar o `.env`

1. Acesse [https://api.nasa.gov/](https://api.nasa.gov/), preencha o formulário **Generate API Key** e copie a chave enviada para o seu e-mail.
2. Na raiz do projeto, crie o arquivo `.env` copiando o modelo `.env.example`:

   - **Windows (PowerShell):**
     ```powershell
     Copy-Item .env.example .env
     ```
   - **Linux / macOS:**
     ```bash
     cp .env.example .env
     ```

3. Abra o arquivo `.env` e substitua `SUA_CHAVE_AQUI` pela sua chave real (para testes rápidos sem chave própria, também é possível usar `DEMO_KEY`, sujeita a limite menor de requisições):

   ```env
   PORT=3000
   NASA_API_KEY=sua_chave_gerada_em_api_nasa_gov
   ```

> **Importante:** O arquivo `.env` está listado no `.gitignore` e nunca deve ser commitado.

### 3. Iniciar a aplicação

```bash
npm start
```

Após iniciar, abra no navegador:

```text
http://localhost:3000
```

---

## Endpoints do Backend

- **`GET /api/apod`**  
  Retorna o APOD do dia atual em formato JSON (`title`, `date`, `explanation`, `media_type`, `url`, `hdurl`, `thumbnail_url`, `copyright`).
- **`GET /api/apod?date=YYYY-MM-DD`**  
  Valida a data informada (formato `YYYY-MM-DD`, calendário válido, entre `1995-06-16` e a data atual) e retorna o registro correspondente, utilizando cache em memória no servidor para evitar chamadas repetidas.

---

## Medidas de Segurança Implementadas

- **Ocultação da API Key (Padrão BFF / Proxy):** O navegador se comunica apenas com `/api/apod` no servidor Express; a variável `NASA_API_KEY` permanece apenas no ambiente do servidor (`process.env.NASA_API_KEY`).
- **Prevenção de XSS:** O frontend não utiliza `innerHTML` para dados externos; todos os textos usam `textContent` e todas as URLs de mídia são validadas (`http:` / `https:`) antes de serem atribuídas a `src` ou `href`.
- **Sanitização de Erros:** Falhas externas retornam mensagens tratadas em português sem expor chaves, URLs completas com parâmetros secretos ou stack traces.
