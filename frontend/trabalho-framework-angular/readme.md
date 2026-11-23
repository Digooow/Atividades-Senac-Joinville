# 🚀 Seminário Técnico: Angular Interactive Showcase & Toolkit (Angular 21)

![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9%20Strict-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Signals](https://img.shields.io/badge/Reactivity-Angular%20Signals-8B5CF6?style=for-the-badge)
![Vitest](https://img.shields.io/badge/Tests-Vitest%204-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## 📌 Visão Geral do Software

O **Angular Interactive Showcase & Toolkit** é uma *Single Page Application* (SPA) interativa e autoexplicativa desenvolvida para o seminário técnico sobre o framework **Angular** no curso **Jovem Programador (SENAC Joinville)**.

Em vez de focar em uma regra de negócio externa genérica, a aplicação funciona como um **laboratório vivo das ferramentas do Angular**: cada bloco contém botões e formulários interativos que alimentam um **Card Dinâmico de Diagnóstico**, refletindo em tempo real o estado em memória do TypeScript e as atualizações cirúrgicas no DOM.

---

## 📂 Documentos e Materiais do Seminário

| Artefato | Descrição |
| :--- | :--- |
| [`projeto-seminario/`](./projeto-seminario/README.md) | Código-fonte da SPA em Angular 21 (`ng serve`, SSR e testes com Vitest) |
| [`ORGANIZACAO_SOFTWARE.md`](./ORGANIZACAO_SOFTWARE.md) | Especificação técnica completa da arquitetura, componentes e serviços |
| [`ORGANIZACAO_ATIVIDADE.md`](./ORGANIZACAO_ATIVIDADE.md) | Planejamento do seminário, divisão de papéis e cronograma de 30 minutos |
| [`Apresentação framework Angular.pdf`](./Apresenta%C3%A7%C3%A3o%20framework%20Angular.pdf) | Slides oficiais da apresentação |
| [`Roteiro de Leitura - Apresentação Angular.pdf`](./Roteiro%20de%20Leitura%20-%20Apresenta%C3%A7%C3%A3o%20Angular.pdf) | Roteiro de leitura para apoio durante a apresentação |

---

## 🛠️ Stack Tecnológica da SPA

- **Framework Frontend:** Angular 21.2 (Arquitetura moderna de *Standalone Components* e suporte a SSR)
- **Linguagem:** TypeScript 5.9 com tipagem estática rigorosa
- **Reatividade:** Signals nativos (`signal`, `computed`) com atualização granular do DOM
- **Marcação e Estilo:** HTML5 semântico com controle de fluxo moderno (`@if`, `@for`, `@switch`, `@empty`) e CSS3 encapsulado
- **Serviços Globais:** Injeção de dependências (`@Injectable`) com padrão Singleton (`EventLoggerService`)
- **Testes:** Vitest

---

## ✨ Os 6 Pilares Demonstrados na Aplicação

1. **Os 4 Pilares de Data Binding:** Interpolação (`{{ }}`), Property & Style Binding (`[disabled]`, `[style.fontSize.px]`), Event Binding (`(click)`) e Two-Way Data Binding (`[(ngModel)]`) com Card Dinâmico em tempo real.
2. **Reatividade com Signals (`signal()` e `computed()`):** Calculadora interativa com recalculo cirúrgico de subtotal, descontos e total final.
3. **Diretivas Modernas de Controle de Fluxo (`@for`, `@if`, `@switch`, `@empty`):** Lista de tarefas com adição, remoção e filtro dinâmico por prioridade.
4. **Pipes Nativos de Transformação:** Formatação declarativa com `uppercase`, `lowercase`, `currency:'BRL'`, `date:'fullDate'` e `json`.
5. **Formulários Reativos & Validação:** `FormGroup` com validação em tempo real e inspeção das propriedades `.valid`, `.dirty`, `.touched` e `.value`.
6. **Injeção de Dependências & Ciclo de Vida:** Demonstração de `ngOnInit()` e `ngOnDestroy()` no componente filho `<app-lifecycle-demo>`, comunicação via `@Output()` e stream de eventos no `EventLoggerService`.

---

## 🎤 Roteiro Resumido da Apresentação (30 Minutos)

1. **Parte 1 — Conhecendo a tecnologia (~10 min):** Origem (AngularJS 2010 → Angular 2+ em 2016), arquitetura *Batteries Included*, vantagens corporativas, limitações e comparativo com React, Vue e Vanilla JS.
2. **Parte 2 — Preparando o ambiente (~5 min):** Instalação de Node.js + `@angular/cli`, criação com `ng new` e anatomia das pastas (`src/app/`, `angular.json`, `package.json`).
3. **Parte 3 — Colocando a mão na massa (~10 min):** Live Demo dos 6 cards interativos da SPA e modificação ao vivo com *Hot Module Replacement (HMR)*.
4. **Parte 4 — Conclusão (~5 min):** Transição do modelo imperativo para o declarativo, casos de uso corporativos, facilidades e desafios do grupo.

---

## 💻 Como Executar a Aplicação

1. Acesse a pasta da aplicação Angular:

   ```bash
   cd frontend/trabalho-framework-angular/projeto-seminario
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor local de desenvolvimento:

   ```bash
   npm start
   ```

4. Abra o navegador em `http://localhost:4200`.

5. Para build de produção e testes unitários:

   ```bash
   npm run build
   npm test
   ```

---

[← Voltar ao repositório principal](../../README.md)
