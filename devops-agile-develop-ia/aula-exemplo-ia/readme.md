# Biblioteca — API REST Nativa (`node:http`) & Cliente Web Interativo

![Node.js](https://img.shields.io/badge/Node.js-Zero%20Dependencies-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![REST API](https://img.shields.io/badge/API-REST%20JSON-0EA5E9?style=for-the-badge)

Projeto didático desenvolvido com auxílio de Inteligência Artificial na disciplina de **DevOps, Metodologias Ágeis & IA** do curso **Jovem Programador (SENAC Joinville)**. Demonstra uma arquitetura cliente-servidor completa **sem dependências externas (`node_modules`)**, utilizando apenas módulos nativos do Node.js no back-end e uma SPA leve em HTML/CSS/JavaScript puro no front-end.

## Funcionalidades

- **Back-End Nativo (`backend.js`):**
  - Servidor HTTP construído com `node:http`, `node:fs`, `node:path` e `node:url`.
  - CRUD completo de acervo de livros armazenado em memória (pré-populado com *Clean Code*, *Domain-Driven Design* e *O Programador Pragmático*).
  - Leitura segura de corpo JSON com limite de payload (`1 MB`), validação de entrada, suporte a `CORS` (`OPTIONS`) e tratamento para porta em uso (`EADDRINUSE`).
  - Entrega automática do arquivo [`frontend.html`](./frontend.html) na rota raiz (`GET /`).
- **Front-End Interativo (`frontend.html`):**
  - Cadastro de novos livros (`POST /livros`), consulta individual (`GET /livros/:id`), alternância de disponibilidade (*Emprestar* / *Devolver* via `PATCH /livros/:id`) e exclusão (`DELETE /livros/:id`).
  - **Painel de Telemetria HTTP em Tempo Real:** exibe método, URL, payload JSON enviado, status code e JSON retornado da última comunicação.
  - Alerta visual caso o servidor back-end esteja offline.

## Estrutura

```text
aula-exemplo-ia/
├── backend.js      # Servidor HTTP nativo Node.js + API REST (/livros)
├── frontend.html   # Interface web em tema escuro consumindo a API via fetch()
└── readme.md       # Documentação da atividade
```

## Endpoints da API

| Método | Rota | Corpo (JSON) | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | — | Serve a interface web `frontend.html` |
| `GET` | `/livros` | — | Lista todos os livros do acervo (`200`) |
| `GET` | `/livros/:id` | — | Busca um livro específico pelo `id` (`200` ou `404`) |
| `POST` | `/livros` | `{"titulo", "autor", "disponivel?"}` | Cadastra um novo livro (`201`) |
| `PATCH` | `/livros/:id` | `{"titulo?", "autor?", "disponivel?"}` | Atualiza parcialmente um livro (`200`) |
| `DELETE` | `/livros/:id` | — | Remove um livro pelo `id` (`204`) |

## Como executar

1. No terminal, acesse a pasta do projeto:

   ```bash
   cd devops-agile-develop-ia/aula-exemplo-ia
   ```

2. Inicie o servidor Node.js (porta padrão `3000`, configurável via variável `PORT`):

   ```bash
   node backend.js
   ```

3. Abra no navegador:

   ```text
   http://localhost:3000
   ```

---

[← Voltar ao módulo DevOps, Ágil & IA](../README.md) · [← Voltar ao repositório principal](../../README.md)
