# 🌐 Angular Interactive Showcase & Toolkit (SPA Didática)

![Angular](https://img.shields.io/badge/Angular-v21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Scoped-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 📌 Visão Geral do Software
O **Angular Interactive Showcase & Toolkit** é uma *Single Page Application* (SPA) interativa e autoexplicativa desenvolvida especificamente para a apresentação técnica sobre o framework **Angular**.

Em vez de focar em uma regra de negócio externa e genérica, a aplicação funciona como um **painel de controle vivo das ferramentas do Angular**: cada bloco contém botões e formulários interativos que, logo na sequência, alimentam um **Card Dinâmico de Diagnóstico** que reflete o funcionamento interno do motor de renderização e *Data Binding* do Angular.

---

## 🛠️ Stack Tecnológica
* **Frontend Framework:** Angular 21 (Arquitetura moderna de *Standalone Components*)
* **Linguagem:** TypeScript com tipagem estática rigorosa
* **Reatividade:** Signals nativos (`signal`, `computed`) combinados com *Change Detection*
* **Marcação e Estilo:** HTML5 semântico e CSS3 modular encapsulado
* **Serviços Globais:** Injeção de dependências (`@Injectable`) com padrão Singleton

---

## 🚀 Funcionalidades e Cards Autoexplicativos

A aplicação cobre os 6 pilares essenciais do ecossistema Angular:

1. **Os 4 Pilares de Data Binding:**
   * **Interpolação `{{ }}`:** Campo de digitação de texto com espelhamento instantâneo no HTML.
   * **Property & Style Binding `[disabled]` / `[style.fontSize.px]`:** Controle de atributos nativos e estilos dinâmicos pelo TypeScript.
   * **Event Binding `(click)`:** Captura de eventos do usuário com contador de execuções.
   * **Two-Way Data Binding `[(ngModel)]`:** Sincronização bidirecional em tempo real.
   * **Card Dinâmico de Binding:** Exibe o estado em memória da classe TypeScript e o reflexo nos nós do DOM.

2. **Reatividade com Signals (Fine-Grained Reactivity):**
   * Calculadora interativa de compra com seletores de quantidade, chips de preço e cupons de desconto.
   * **Card Dinâmico de Signals:** Mostra os nós computados reativamente (`subtotal`, `desconto` e `totalFinal`) que são atualizados cirurgicamente sem re-renderizar a página inteira.

3. **Diretivas Modernas de Controle de Fluxo (`@for`, `@if`, `@switch`, `@empty`):**
   * Adição e remoção de itens em uma lista de tarefas.
   * Filtro por prioridade (Alta, Média, Baixa) com visualização condicional via `@switch`.
   * **Card Dinâmico Estrutural:** Demonstra a manipulação eficiente de elementos no DOM pelo novo compilador do Angular.

4. **Pipes Nativos de Transformação:**
   * Formatação declarativa no HTML de texto (`uppercase`, `lowercase`), valores financeiros (`currency:'BRL'`), datas (`date:'fullDate'`) e inspeção de objetos com `json`.
   * **Card Dinâmico de Pipes:** Tabela comparativa entre a variável bruta no TypeScript e o resultado transformado pelo Pipe na tela.

5. **Formulários Reativos & Validação Rigorosa:**
   * Formulário com `FormGroup`, campos obrigatórios, tamanho mínimo e formato de e-mail.
   * **Card Dinâmico de Validação:** Inspeciona as propriedades `.valid`, `.dirty`, `.touched` e o objeto `.value` em tempo real.

6. **Injeção de Dependências & Ciclo de Vida:**
   * Demonstração prática dos hooks `ngOnInit()` e `ngOnDestroy()`, com botão para montar e desmontar dinamicamente um componente filho.
   * Comunicação Filho → Pai via `@Output()` e `EventEmitter`.
   * **Card Dinâmico de Logs:** Um serviço Singleton (`EventLoggerService`) que registra o histórico cronológico de cada evento ocorrido na aplicação.

---

## 💻 Como Executar Localmente

**Pré-requisitos:** Node.js (v18+) e NPM.

1. Acesse o diretório do projeto:
   ```bash
   cd projeto-seminario
   ```
2. Instale as dependências caso ainda não tenha feito:
   ```bash
   npm install
   ```
3. Inicie o servidor local:
   ```bash
   npm start
   ```
4. Abra o navegador em:
   ```text
   http://localhost:4200
   ```
*(O Angular possui Hot-Reload nativo: qualquer arquivo alterado no VS Code atualiza a interface instantaneamente sem perder o estado).*
