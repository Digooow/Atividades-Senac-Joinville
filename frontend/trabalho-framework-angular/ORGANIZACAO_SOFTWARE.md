# 📊 Documentação do Software: Angular Interactive Showcase & Toolkit

Este documento contém a especificação técnica completa, arquitetura de componentes, recursos demonstrados, contratos de dados e guia de execução da Single Page Application desenvolvida para o seminário técnico de **Angular**.

---

## 📌 1. Visão Geral e Proposta Pedagógica

O **Angular Interactive Showcase & Toolkit** é uma *Single Page Application* (SPA) autoexplicativa projetada com um objetivo direto: **expor o potencial máximo das ferramentas nativas do Angular no navegador**.

### Propósito Técnico da Aplicação
Em vez de focar em uma regra de negócio externa desnecessária, cada seção da aplicação funciona como um laboratório visual interativo:
1. **Controles de Usuário:** O apresentador aciona botões, insere valores em inputs, seleciona opções e clica em gatilhos.
2. **Explicação Didática:** Cada bloco traz badges informando o conceito exato do framework em operação.
3. **Card Dinâmico Autoexplicativo:** Localizado logo abaixo de cada função, esse card utiliza os mecanismos de *Data Binding* do próprio Angular para exibir em tempo real a sincronização da memória TypeScript com a árvore do DOM.

---

## 🛠️ 2. Stack Tecnológica

* **Framework Frontend:** Angular (v21 - Standalone Components)
* **Linguagem:** TypeScript
* **Estilização:** CSS3 puro moderno com Scoped Styling e variáveis nativas
* **Tooling:** Node.js (LTS), Angular CLI e Angular Build
* **Arquitetura de Estado:** Reatividade híbrida (Signals nativos + Injeção de Dependência)

---

## 🏗️ 3. Arquitetura do Projeto

O software adota os padrões mais recentes do ecossistema Angular (dispensando `NgModule` legados e adotando componentes independentes e reatividade granular):

```text
projeto-seminario/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── lifecycle-demo.component.ts      # Componente filho para demonstração de ngOnInit/ngOnDestroy e @Output
│   │   ├── services/
│   │   │   └── event-logger.service.ts          # Serviço Singleton injetável (@Injectable) com histórico reativo via Signals
│   │   ├── app.ts                               # Componente raiz standalone com estados e regras de negócio
│   │   ├── app.html                             # Template semântico estruturado com os 6 cards autoexplicativos
│   │   ├── app.css                              # Estilos escuros modernos encapsulados
│   │   └── app.config.ts                        # Configurações de provedores da aplicação
│   ├── styles.css                               # Estilos globais e tokens de cores
│   └── index.html                               # Ponto de entrada Single Page
├── angular.json                                 # Configurações do compilador do Angular
└── package.json                                 # Dependências e scripts de execução
```

---

## 🚀 4. Módulos & Ferramentas Demonstradas na SPA

A aplicação é dividida em 6 seções interativas, cada uma com seu respectivo **Card Dinâmico**:

### 4.1. Pilar 1: Sincronização & Data Binding
* **Interpolação (`{{ expressao }}`):** Digitação de texto com reflexo imediato no template.
* **Property & Style Binding (`[disabled]`, `[style.fontSize.px]`):** Alteração dinâmica de propriedades de elementos HTML e estilos em linha direto pelo TypeScript.
* **Event Binding (`(click)`):** Captura de eventos do usuário com atualização de contadores e logs.
* **Two-Way Data Binding (`[(ngModel)]`):** A sintaxe "banana in a box", demonstrando a sincronização bidirecional instantânea entre template e classe.
* **Card Dinâmico de Binding:** Exibe o valor em tempo real na memória do TypeScript, o estado booleano da propriedade `disabled`, o último evento acionado e o texto bidirecional.

### 4.2. Pilar 2: Angular Signals (Fine-Grained Reactivity)
* **`signal()`:** Valores primitivos reativos (`quantidadeSignal`, `precoUnitarioSignal`, `cupomDescontoSignal`).
* **`computed()`:** Valores derivados reativos que se recalculam automaticamente e de forma cirúrgica (Subtotal, Valor do Desconto e Total Final).
* **Card Dinâmico de Signals:** Exibe o cálculo instantâneo sem necessidade de disparar ciclos de detecção de mudanças pesados na aplicação inteira.

### 4.3. Pilar 3: Diretivas Modernas de Controle de Fluxo
* **Bloco `@for` com `track`:** Renderização de listas com alta performance e semântica nativa.
* **Bloco `@if` e `@switch` / `@case`:** Renderização condicional de itens e badges visuais por nível de prioridade (Alta, Média, Baixa).
* **Bloco `@empty`:** Feedback automático exibido quando filtros não encontram resultados.
* **Card Dinâmico de Tarefas:** Permite adicionar itens, alternar o estado de conclusão (riscado) e filtrar por prioridade em tempo real.

### 4.4. Pilar 4: Pipes Nativos em Tempo Real
* Demonstração de transformação pura declarativa na camada visual sem alterar o dado na memória:
  * `| uppercase` e `| lowercase` para strings.
  * `| currency:'BRL'` para valores monetários formatados no padrão brasileiro.
  * `| date:'fullDate'` para datas completas legíveis.
  * `| json` para inspecionar objetos complexos no template.
* **Card Dinâmico de Pipes:** Tabela comparando lado a lado o dado bruto no TypeScript versus o resultado exibido na tela após passar pelo Pipe.

### 4.5. Pilar 5: Formulários Reativos & Validação Rigorosa
* Uso de `FormGroup`, `FormControl` e `Validators` nativos do Angular (`Validators.required`, `Validators.minLength(3)`, `Validators.email`, `Validators.requiredTrue`).
* Exibição condicional de mensagens de erro baseadas em `dirty`, `touched` e `invalid`.
* **Card Dinâmico de Validação:** Painel de diagnóstico que inspeciona o objeto do formulário em tempo real, exibindo `.valid`, `.dirty`, `.touched` e o payload JSON completo.

### 4.6. Pilar 6: Injeção de Dependências & Ciclo de Vida
* **Injeção de Dependências (`@Injectable`):** O serviço `EventLoggerService` atua como um barramento singleton global que armazena os eventos disparados por qualquer componente.
* **Ciclo de Vida (`ngOnInit` e `ngOnDestroy`):** Um botão permite montar e desmontar o componente filho `<app-lifecycle-demo>`. Ao montar, o `ngOnInit` ativa um timer; ao desmontar, o `ngOnDestroy` limpa o timer e emite aviso para prevenir vazamento de memória (*memory leak*).
* **Comunicação Filho → Pai (`@Output()` e `EventEmitter`):** Botão dentro do componente filho emite eventos que são ouvidos pelo componente pai.
* **Card Dinâmico de Telemetria:** Painel estilo stream de eventos que exibe o log cronológico formatado com timestamp de cada ação do usuário.

---

## 💻 5. Guia de Execução da Aplicação

### 5.1. Pré-requisitos
* Node.js (v18 ou superior) instalado.
* NPM instalado.

### 5.2. Passo a Passo
1. Acesse o diretório do projeto:
   ```bash
   cd projeto-seminario
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   *(ou `ng serve`)*
3. Acesse a aplicação no navegador através do endereço:
   ```text
   http://localhost:4200
   ```

### 5.3. Build para Produção
Para verificar se o código compila perfeitamente sem erros de tipagem estrita ou quebra de orçamentos:
```bash
npm run build
```
Os arquivos otimizados e minificados serão gerados no diretório `/dist/projeto-seminario`.
