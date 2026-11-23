# 🍍 DevOps Abacaxi — Fazenda de Abacaxis (Tema Fenda do Biquíni)

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=000000)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-MySQL%20%2F%20Postgres-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=000000)

Projeto full-stack didático criado para ensinar **deploy em nuvem no [Render](https://render.com)** usando **apenas o plano gratuito**, com interface temática interativa inspirada na **Fenda do Biquíni**, suporte a **3 idiomas (Português, Inglês e Chinês)** e API REST documentada com **Swagger UI (`/docs`)**.

O sistema controla uma fazenda de abacaxis: possui **login JWT**, registro de **colheitas** (data e quantidade), registro de **vendas** com validação dinâmica de estoque e painel de faturamento.

## O que tem neste projeto

```text
devops-abacaxi/
├── abacaxi-backend/    → API em Node.js + Express 5 + Sequelize + Swagger (MySQL local / PostgreSQL no Render)
├── abacaxi-frontend/   → SPA em React 18 + Vite 6 + Canvas/SVG interativo + i18n (PT/EN/ZH)
├── dev.js              → Orquestrador único que prepara .env, dependências, MySQL Docker e inicia API + Site
├── package.json        → Scripts de automação na raiz (npm run dev / setup / build)
└── README.md           → Documentação principal do projeto
```

O frontend e o backend estão **separados**: cada um é um projeto independente, com o próprio `package.json`, e é publicado como um **serviço diferente** no Render.

| Pasta | O que é | Serviço no Render (Free) | Documentação |
| :--- | :--- | :--- | :--- |
| [abacaxi-backend](abacaxi-backend) | API (regras, JWT, estoque, Swagger `/docs`, Sequelize) | **Web Service** + **Postgres** | [README do backend](abacaxi-backend/README.md) |
| [abacaxi-frontend](abacaxi-frontend) | Telas React, cenário Fenda do Biquíni e i18n (PT/EN/ZH) | **Static Site** | [README do frontend](abacaxi-frontend/README.md) · [STYLEGUIDE](abacaxi-frontend/STYLEGUIDE.md) |

## Arquitetura

```
 Navegador
    │
    ▼
┌──────────────────────┐   HTTPS (fetch)  ┌──────────────────────┐        ┌────────────────────┐
│  Static Site (Free)  │ ───────────────► │  Web Service (Free)  │ ─────► │  PostgreSQL (Free) │
│  abacaxi-frontend    │   VITE_API_URL   │  abacaxi-backend     │ DATA-  │  Render            │
│  React (dist/)       │ ◄─────────────── │  Node + Express      │ BASE_  │                    │
└──────────────────────┘   CORS:          └──────────────────────┘ URL    └────────────────────┘
                           FRONTEND_URL
```

No seu computador é igual, mas com **MySQL** no lugar do PostgreSQL.

---

## Passo 0 — Ter o projeto no seu GitHub

O Render faz o deploy a partir de um repositório **seu** no GitHub.

- **Se o professor passou o link do repositório:** clique em **Fork** no GitHub para criar uma cópia na sua conta.
- **Se você recebeu a pasta:** crie um repositório vazio chamado `devops-abacaxi` no GitHub e envie os arquivos:
  ```bash
  cd devops-abacaxi
  git init
  git add .
  git commit -m "Projeto inicial"
  git branch -M main
  git remote add origin https://github.com/SEU-USUARIO/devops-abacaxi.git
  git push -u origin main
  ```

Depois, clone na sua máquina, se ainda não tiver o projeto nela:

```bash
git clone https://github.com/SEU-USUARIO/devops-abacaxi.git
cd devops-abacaxi
```

## Rodando localmente

### Jeito rápido (um único terminal na raiz)

Com o Docker Desktop (ou MySQL local) aberto, execute na raiz do projeto (`devops-abacaxi/`):

```bash
npm run dev
```

Isso cria os `.env` e instala as dependências se necessário, sobe o MySQL pelo Docker (`docker compose up -d`), inicia a API em http://localhost:3001 e inicia o site em http://localhost:5173.

### Ou em dois terminais separados

| Terminal 1 — API | Terminal 2 — Site |
|---|---|
| `cd abacaxi-backend` | `cd abacaxi-frontend` |
| siga o [README do backend](abacaxi-backend/README.md#1-rodando-localmente-com-mysql) | siga o [README do frontend](abacaxi-frontend/README.md#1-rodando-localmente) |
| API em http://localhost:3001 | Site em http://localhost:5173 |

Login padrão: usuário **`admin`**, senha **`admin123`**.

## Deploy no Render: ordem dos passos

Siga **nesta ordem**, porque cada passo usa uma informação do anterior:

| # | O que fazer | Onde está explicado | Você vai anotar |
|---|---|---|---|
| 1 | Criar o banco **Postgres (Free)** | [backend → Etapa 1](abacaxi-backend/README.md#etapa-1--criar-o-banco-postgresql) | *Internal Database URL* |
| 2 | Criar o **Web Service** da API (Root Directory: `abacaxi-backend`) | [backend → Etapa 2](abacaxi-backend/README.md#etapa-2--criar-o-web-service-api) | URL da API |
| 3 | Criar o **Static Site** (Root Directory: `abacaxi-frontend`) | [frontend → Deploy](abacaxi-frontend/README.md#2-deploy-no-render-plano-gratuito) | URL do site |
| 4 | Colocar a URL do site em `FRONTEND_URL` na API (CORS) | [backend → Etapa 3](abacaxi-backend/README.md#etapa-3--liberar-o-frontend-no-cors) | — |

> ⚠️ Os dois serviços usam o **mesmo repositório** (`devops-abacaxi`). O que muda é o campo **Root Directory**, que diz ao Render em qual pasta está cada projeto. Se esquecer de preencher, o build falha dizendo que não encontrou o `package.json`.

## Plano gratuito: o que esperar

- A API **"dorme" após 15 min sem uso**. O primeiro acesso depois disso leva **cerca de 1 minuto**.
- O banco Postgres gratuito **expira 30 dias após a criação**, e cada conta só pode ter **1 banco gratuito**.
- O Static Site (frontend) é gratuito e não dorme.

Mais detalhes no [README do backend](abacaxi-backend/README.md) e no [README do frontend](abacaxi-frontend/README.md).

---

[← Voltar ao módulo DevOps, Ágil & IA](../README.md) · [← Voltar ao repositório principal](../../README.md)
