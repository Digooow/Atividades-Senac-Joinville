# 📋 Organização da Atividade: Seminário Técnico Angular

Este documento reúne o planejamento estratégico, a divisão de papéis, o cronograma minuto a minuto, o roteiro narrativo de apresentação e as respostas formais para os requisitos da atividade acadêmica sobre o framework **Angular**.

---

## 🎯 1. Visão Geral e Diretrizes da Atividade

* **Tema:** Framework Frontend Angular (Google)
* **Tempo Total de Apresentação:** 30 minutos (rigorosamente cronometrados)
* **Formato de Entrega:**
  1. Apresentação teórica em slides (**obrigatoriamente exportada em PDF** para garantir fidelidade visual e fontes preservadas em qualquer máquina).
  2. Demonstração prática funcional (*Live Demo* no navegador via Visual Studio Code).
  3. Código-fonte documentado e estruturado conforme os padrões oficiais da documentação do Angular.
* **Critérios Avaliados:** Domínio técnico, clareza didática, qualidade visual, organização arquitetural do código e sincronia da equipe.

---

## 👥 2. Divisão de Papéis e Responsabilidades

Para garantir que todos os 3 integrantes tenham protagonismo equilibrado, a carga de trabalho foi dividida em especialidades complementares:

| Integrante | Papel Principal | Responsabilidades Chave |
| :--- | :--- | :--- |
| **Membro 1** | *Narrador Técnico & Teórico* | Introdução do seminário, contextualização histórica (AngularJS vs Angular 2+), posicionamento de mercado (vs React/Vue/Vanilla JS), vantagens corporativas e co-condução da conclusão. |
| **Membro 2** | *Desenvolvedor Lead* | Preparação do ambiente (Node.js e Angular CLI), arquitetura de arquivos do projeto, codificação prática da SPA interativa (*Angular Interactive Showcase & Toolkit*), explicação do TypeScript/HTML/CSS e execução do *Live Demo*. |
| **Membro 3** | *Designer & Relator* | Estruturação e design dos slides em PDF (tema escuro e visual limpo), boas práticas do Angular, controle do cronômetro de 30 minutos e encerramento com considerações finais. |

> **Metodologia de Alinhamento:** *Daily Standups* diárias de 10 minutos para validação de bloqueios técnicos e passagem de bastão entre os tópicos.

---

## ⏱️ 3. Cronograma da Apresentação (30 Minutos)

A apresentação segue uma divisão estrita de 3 blocos de 10 minutos:

```
[00:00 - 10:00] Bloco 1: Conhecendo a Tecnologia (Membro 1)
[10:00 - 20:00] Bloco 2: Ambiente & Demonstração Prática (Membro 2)
[20:00 - 30:00] Bloco 3: Boas Práticas, Arquitetura & Conclusão (Membro 3 + Grupo)
```

### Detalhamento Minuto a Minuto

| Minutos | Bloco / Responsável | Tópicos Abordados |
| :--- | :--- | :--- |
| **00:00 - 02:00** | Abertura (*Membro 1*) | Apresentação da equipe, tema e introdução ao problema das aplicações web antigas (MPAs e recarregamento constante). |
| **02:00 - 05:00** | Origem e História (*Membro 1*) | O surgimento do AngularJS (2010, Miško Hevery / Google) e a virada para o Angular 2+ (2016, reescrita total com TypeScript). |
| **05:00 - 08:00** | O Que É e Pilares (*Membro 1*) | Framework *"Batteries Included"*, tipagem forte com TypeScript, Injeção de Dependências, Componentes e Data Binding. |
| **08:00 - 10:00** | Mercado e Comparativo (*Membro 1*) | Angular vs React vs Vue; Angular vs Vanilla JS; Casos de uso enterprise (Google, Microsoft, bancos). **Passagem de bastão para o Membro 2.** |
| **10:00 - 12:00** | Setup e Estrutura (*Membro 2*) | Pré-requisitos (Node.js, NPM, Angular CLI), comandos de geração e anatomia dos arquivos (`src/app`, `angular.json`). |
| **12:00 - 15:00** | Dissecando o Código (*Membro 2*) | Apresentação da SPA interativa autoexplicativa (*Angular Interactive Showcase*), módulos de Data Binding, Signals, Control Flow moderno (`@if`, `@for`, `@switch`), Pipes nativos e Injeção de Dependências. |
| **15:00 - 18:00** | Live Demo (*Membro 2*) | Navegação no painel em execução, demonstração dos **Cards Dinâmicos** reagindo aos inputs, botões e calculadoras reativas com Signals em tempo real. |
| **18:00 - 20:00** | Modificação ao Vivo (*Membro 2*) | Alteração rápida de uma variável ou estilo no VS Code evidenciando o *Hot Module Replacement (HMR)* e a atualização seletiva do DOM. **Passagem de bastão para o Membro 3.** |
| **20:00 - 23:00** | Design e Recursos (*Membro 3*) | Apresentação do design dos slides em PDF e ergonomia visual aplicada aos cards dinâmicos do showcase. |
| **23:00 - 26:00** | Boas Práticas (*Membro 3*) | Performance, detecção de mudanças cirúrgica com Signals, compilação AOT (*Ahead-Of-Time*) e segurança nativa contra XSS. |
| **26:00 - 28:00** | Conclusão Técnica (*Grupo*) | Maiores facilidades vs maiores dificuldades encontradas; comparação declarativa vs imperativa com JS puro. |
| **28:00 - 30:00** | Encerramento (*Grupo*) | Frase de impacto final, agradecimentos e abertura para perguntas do professor e dos colegas. |

---

## 🎤 4. Roteiro Narrativo e Argumentação (Guia do Apresentador)

Este roteiro serve como mapa mental para a fala inicial do Bloco 1.

### 4.1. A Narrativa de Origem: O Problema da Web Antiga
* **Antes das SPAs:** Todo clique resultava em requisição ao servidor e recarregamento total da página (telas brancas piscando). O JavaScript era usado para scripts simples.
* **O Código Espaguete:** Conforme as interfaces exigiam interatividade complexa, a manipulação direta do DOM com JavaScript puro tornou os projetos frágeis, despadronizados e difíceis de manter.
* **O Nascimento do AngularJS (2010):** Criado por Miško Hevery na Google com o objetivo de automatizar a sincronização de dados e tela (*Two-Way Data Binding*).
* **A Grande Ruptura — Angular 2+ (2016):** Em vez de colocar remendos em um motor defasado, a Google reescreveu o framework do zero. O AngularJS (versão 1.x) foi abandonado em favor do **Angular** (versão 2 em diante), adotando **TypeScript por padrão** e uma arquitetura estritamente baseada em **Componentes**.

### 4.2. O Que É vs. O Que NÃO É o Angular
* **O que É:**
  * Um framework web completo (*"Batteries Included"*): roteador, cliente HTTP, formulários reativos, pipes, injeção de dependência e ferramentas de teste já vêm nativos, sem necessidade de selecionar 20 bibliotecas de terceiros.
  * Um framework fortemente opinionado: impõe padrões de arquitetura corporativa para que qualquer equipe fale o mesmo idioma.
  * Uma plataforma voltada para aplicações de missão crítica e grande escala (SPAs, painéis administrativos, bancos).
* **O que NÃO É:**
  * Não é apenas uma biblioteca de renderização de interface (diferente do React, que cuida apenas da camada de visualização).
  * Não é um servidor/backend: roda prioritariamente no navegador (*client-side*), embora suporte *Server-Side Rendering* (SSR) via Angular SSR.
  * Não é JavaScript puro: a base é TypeScript estrito.

### 4.3. Por que Angular e não Vanilla JS, React ou Vue?
* **Em relação a JavaScript Puro:**
  * *Vanilla JS:* Exige manipulação imperativa manual do DOM (`document.getElementById`, `addEventListener`). Código propenso a falhas de sincronização de estado.
  * *Angular:* Paradigma declarativo. Você altera a propriedade na memória e o framework re-renderiza exatamente o nó afetado.
* **Em relação a React:**
  * *React:* Biblioteca minimalista e flexível. O desenvolvedor precisa decidir qual roteador, qual gerenciador de estado e qual pacote de requisições adotar.
  * *Angular:* Suíte corporativa integrada. A equipe do Google mantém as ferramentas essenciais, reduzindo fragmentação tecnológica.
* **Em relação a Vue.js:**
  * *Vue:* Leve e com curva de aprendizado mais suave, ideal para projetos menores.
  * *Angular:* Curva inicial mais íngreme, porém com arquitetura preparada para suportar centenas de desenvolvedores no mesmo repositório.

### 4.4. Empresas e Frase de Encerramento da Fala
* **Quem usa:** Google (Gmail, Google Cloud Console), Microsoft (Office Web), PayPal, Forbes, Deutsche Bank.
* **Frase de Impacto para a Transição:**
  > *"O Angular não foi desenhado para ser a ferramenta mais leve de um site estático de uma página. Ele é a fortaleza arquitetural definitiva para sistemas de grande porte onde estabilidade, segurança e manutenibilidade a longo prazo são prioridades inegociáveis."*

---

## 📝 5. Respostas Formais às 4 Partes do Seminário Acadêmico

### Parte 1 — Conhecendo a Tecnologia
1. **O que é?** Framework web completo de código aberto mantido pelo Google, baseado em componentes, reatividade com Signals e tipagem estática com TypeScript.
2. **Para que serve e quais problemas resolve?** Serve para a criação de Single Page Applications (SPAs) escaláveis e manuteníveis. Resolve a fragmentação arquitetural, o código espaguete e a sobrecarga de manipulação manual do DOM.
3. **Quem criou e ano de lançamento?** Criado por Miško Hevery (Google). AngularJS em 2010; modernizado e reescrito como Angular em 2016.
4. **Como evoluiu e onde é utilizada?** Evoluiu do modelo MVC legado para componentes reativos, compilação Ivy, Standalone Components e Signals de granularidade fina. Utilizada em plataformas bancárias, consoles de nuvem, ERPs e portais corporativos.
5. **Vantagens e Limitações:**
   * *Vantagens:* Tipagem estática robusta, injeção de dependências nativa, CLI poderosa, ecossistema tudo incluso e padronização corporativa.
   * *Limitações:* Curva de aprendizado inicial mais acentuada e tamanho de bundle base superior ao de micro-bibliotecas.

### Parte 2 — Preparando o Ambiente
1. **O que é necessário instalar?** Node.js (com NPM) e uma IDE (Visual Studio Code com extensões recomendadas de Angular).
2. **Como criar um projeto do zero?**
   * Instalação da CLI: `npm install -g @angular/cli`
   * Criação do projeto: `ng new nome-do-projeto`
3. **Principais pastas e arquivos:**
   * `src/app/`: Onde residem os componentes, serviços e regras da aplicação.
   * `angular.json`: Arquivo de configuração central do compilador e da CLI.
   * `package.json`: Manifesto de dependências e scripts de execução.
4. **Como executar no navegador?**
   * Comando `ng serve` (disponibiliza localmente em `http://localhost:4200` com *Hot Reload*).

### Parte 3 — Colocando a Mão na Massa
1. **Exemplo funcional escolhido:** *Angular Interactive Showcase & Toolkit* (SPA Autoexplicativa com Cards Dinâmicos de Feedback). Em vez de uma regra de negócio externa desnecessária, a aplicação expõe diretamente os motores do Angular: Data Binding, Signals, Control Flow moderno, Pipes nativos, Formulários Reativos e Injeção de Dependências.
2. **Partes mais importantes do código:** 
   * A integração dos 4 tipos de Data Binding com reflexo em tempo real no DOM.
   * A reatividade moderna com Signals (`signal()`, `computed()`) demonstrando cálculos cirúrgicos sem Zone.js.
   * O fluxo estrutural declarativo moderno (`@if`, `@for`, `@switch`).
   * A injeção de dependência via `EventLoggerService` e os hooks de ciclo de vida (`ngOnInit`, `ngOnDestroy`).
3. **Modificação ao vivo:** Alteração de parâmetros de estilo, valores no TypeScript ou templates para demonstrar o reflexo imediato no navegador sem recarregar a aba (*Hot Module Replacement*).

### Parte 4 — Conclusão
1. **Maior facilidade encontrada:** O ecossistema integrado da CLI (`ng generate`), a clareza do TypeScript e os blocos de fluxo de controle modernos (`@for`, `@if`), que eliminam a necessidade de configurações complexas de terceiros.
2. **Maior dificuldade encontrada:** A compreensão inicial do fluxo de ciclo de vida dos componentes, a injeção de dependências e a transição do pensamento imperativo (JavaScript puro) para o reativo declarativo.
3. **Em que tipo de projeto a tecnologia é útil?** Dashboards analíticos, sistemas corporativos multi-equipe, portais de autoatendimento, ERPs e aplicações de missão crítica com ciclo de vida de vários anos.
4. **O que muda em relação a HTML, CSS e JavaScript puros?** Passagem do modelo imperativo (manipulação manual elemento a elemento via `document.getElementById`) para o modelo reativo declarativo (a interface é consequência direta e automática do estado dos dados).

---

## 📅 6. Checklist Semanal de Execução (TODO List)

* [x] **Alinhamento de Base:**
  * Membro 1: Revisar e memorizar o roteiro narrativo do Bloco 1.
  * Membro 2: Garantir instalação do Node.js/CLI e validar o projeto funcional.
  * Membro 3: Definir o template visual dos slides (tema escuro, contraste para código).
* [x] **Produção dos Artefatos:**
  * Membro 1: Validar as respostas conceituais com os outros integrantes.
  * Membro 2: Implementar o *Angular Interactive Showcase* com cards dinâmicos autoexplicativos e validar a alteração ao vivo do Live Demo.
  * Membro 3: Montar os slides com diagramas e blocos de código destacados (sem excesso de texto corrido).
* [ ] **Refinamento e Exportação:**
  * Membro 3: **Exportar os slides obrigatoriamente em formato PDF**.
  * Todos: Ensaio de passagem de bastão (garantir que as transições de fala durem menos de 15 segundos).
* [ ] **Ensaio Geral:**
  * Todos: Simulação completa com cronômetro para cravar exatamente 30 minutos.
  * Membro 2: Testar a execução do projeto em ambiente desconectado (modo offline/sem dependência de Wi-Fi da faculdade).
