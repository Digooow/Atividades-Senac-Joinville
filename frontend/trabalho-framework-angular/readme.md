# 🚀 Guia Prático do Seminário: Framework Angular

## 1. Roteiro da Apresentação (Meta: 30 Minutos)

### Parte 1 — Conhecendo a tecnologia (Membro 1 | ~10 minutos)
* **O que é?** Um framework web completo mantido pelo Google. Diferente de uma simples biblioteca visual, ele fornece a fundação arquitetural completa da aplicação ("Batteries Included").
* **Para que serve e problemas que resolve?** Criação de Single Page Applications (SPAs) de alta escalabilidade. Resolve o "código espaguete" e o gargalo de manipulação manual do DOM comum no desenvolvimento tradicional com Vanilla JS.
* **Quem criou e quando?** Criado pelo Google. A versão original (AngularJS) nasceu em 2010. Em 2016, foi completamente reescrito e modernizado para o Angular atual com TypeScript por padrão.
* **Onde é utilizado?** Em sistemas corporativos de grande porte: Google Cloud Console, Gmail, bancos digitais, ERPs e plataformas de missão crítica.
* **Vantagens:** Arquitetura consistente baseada em componentes, injeção de dependências nativa, tipagem forte com TypeScript, reatividade moderna com Signals e ferramentas nativas de roteamento, validação e formulários.
* **Limitações:** Curva de aprendizado inicial mais íngreme e tamanho inicial de pacote superior ao de bibliotecas minimalistas.
* **Por que escolher Angular em vez de React/Vue?** Pela padronização corporativa. Em equipes médias e grandes, o Angular impõe uma convenção clara, permitindo que qualquer desenvolvedor leia e mantenha o código de outro colega com facilidade.
* **Por que não usar JavaScript puro?** O TypeScript traz tipagem estática, detecção de erros em tempo de compilação e autocomplete completo, evitando bugs em produção.

---

### Parte 2 — Preparando o ambiente (Membro 2 / 3 | ~5 minutos)
* **O que é necessário instalar?** Node.js (com o gerenciador NPM) e uma IDE moderna como o Visual Studio Code.
* **Como criar um projeto do zero?**
  * `npm install -g @angular/cli` (instala a CLI do Angular).
  * `ng new nome-do-projeto` (gera a estrutura completa de arquivos).
* **Principais pastas e arquivos:**
  * `src/`: Pasta com o código-fonte da aplicação.
  * `src/app/`: Onde ficam os componentes, serviços e templates.
  * `angular.json`: Arquivo de configuração de compilação da CLI.
  * `package.json`: Manifesto de dependências e scripts (`start`, `build`, `test`).
* **Como executar no navegador?** O comando `ng serve` (ou `npm start`) compila o projeto e inicia o servidor local em `http://localhost:4200` com *Hot Reload*.

---

### Parte 3 — Colocando a mão na massa (Membro 2 | ~10 minutos)
* **Apresentação do Exemplo:** Demonstrar no navegador a SPA **Angular Interactive Showcase & Toolkit**, uma aplicação autoexplicativa focada em revelar o poder do framework.
* **Explicação do Código e Funcionalidades:**
  1. **Data Binding Interativo:** Demonstrar no primeiro card os 4 pilares (Interpolação `{{ }}`, Property Binding `[disabled]`, Event Binding `(click)` e Two-Way Binding `[(ngModel)]`), acompanhando o Card Dinâmico que atualiza a memória em tempo real.
  2. **Reatividade Moderna com Signals:** Exibir o mini simulador de preços onde `signal()` e `computed()` recalculam subtotal e descontos cirurgicamente no DOM.
  3. **Diretivas Modernas de Controle de Fluxo (`@for`, `@if`, `@switch`):** Adicionar uma tarefa ao vivo e filtrar prioridades com o bloco `@empty`.
  4. **Pipes em Tempo Real:** Demonstrar como o Angular formata moedas (`| currency`), datas (`| date`) e JSON declarativamente na tela.
  5. **Formulários Reativos:** Mostrar a validação em tempo real de e-mail e regras de negócio com o estado do `FormGroup`.
  6. **Ciclo de Vida & DI:** Clicar no botão de desmontar o componente filho para provar a atuação do `ngOnDestroy()` limpando timers e o `EventLoggerService` registrando o histórico de eventos.
* **Modificação ao Vivo:** Alterar uma cor ou texto no VS Code e demonstrar a atualização instantânea pelo *Hot Module Replacement (HMR)*.

---

### Parte 4 — Conclusão (Todo o Grupo | ~5 minutos)
* **O que muda em relação a HTML, CSS e JavaScript puros?** Saída do modelo imperativo (manipulação manual elemento por elemento via `document.getElementById`) para o modelo reativo declarativo (a tela é consequência direta dos dados na memória).
* **Em que tipo de projeto seria útil?** SPAs corporativas, dashboards analíticos, plataformas financeiras e sistemas que precisam durar anos com estabilidade.
* **Maior facilidade encontrada:** O ecossistema integrado da CLI e a sintaxe intuitiva dos novos blocos `@if` e `@for`.
* **Maior dificuldade encontrada:** A compreensão inicial do ciclo de vida dos componentes e a mentalidade de injeção de dependências.

---

## 2. Como Executar a Aplicação

1. No terminal, acesse a pasta da aplicação:
   ```bash
   cd projeto-seminario
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```
3. Abra o navegador em `http://localhost:4200`.
