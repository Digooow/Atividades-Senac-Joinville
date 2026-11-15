import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventLoggerService } from './services/event-logger.service';
import { LifecycleDemoComponent } from './components/lifecycle-demo.component';

export interface TarefaDemo {
  id: number;
  titulo: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  concluida: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LifecycleDemoComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Injeção de dependência do serviço de Logs
  readonly logger = inject(EventLoggerService);
  private fb = inject(FormBuilder);

  // 1. DATA BINDING STATE
  textoInterpolar: string = 'Angular 21 - Framework Enterprise';
  tamanhoFonte: number = 18;
  botaoDesabilitado: boolean = false;
  imagemUrl: string = 'https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png';
  textoTwoWay: string = 'Sincronização Bidirecional';
  contadorEventos: number = 0;
  ultimoEvento: string = 'Nenhum clique até o momento';

  // 2. MODERN SIGNALS STATE
  quantidadeSignal = signal<number>(2);
  precoUnitarioSignal = signal<number>(49.90);
  cupomDescontoSignal = signal<number>(10); // 10%
  
  // Computed Signal reativo
  subtotal = computed(() => this.quantidadeSignal() * this.precoUnitarioSignal());
  descontoValor = computed(() => (this.subtotal() * this.cupomDescontoSignal()) / 100);
  totalFinal = computed(() => this.subtotal() - this.descontoValor());

  // 3. CONTROL FLOW (@if, @for, @switch) STATE
  tarefas: TarefaDemo[] = [
    { id: 1, titulo: 'Apresentar arquitetura de componentes', prioridade: 'ALTA', concluida: true },
    { id: 2, titulo: 'Demonstrar Data Binding e Signals em tempo real', prioridade: 'ALTA', concluida: false },
    { id: 3, titulo: 'Validar formulário reativo sem recarregar tela', prioridade: 'MEDIA', concluida: false },
    { id: 4, titulo: 'Explicar injeção de dependências corporativa', prioridade: 'BAIXA', concluida: false }
  ];
  novaTarefaTitulo: string = '';
  novaTarefaPrioridade: 'BAIXA' | 'MEDIA' | 'ALTA' = 'MEDIA';
  filtroPrioridade: string = 'TODAS';

  // 4. PIPES STATE
  valorMonetario: number = 15990.85;
  dataAtual: Date = new Date();
  textoParaPipes: string = 'Ecossistema Angular Completo';
  objetoParaPipe = {
    framework: 'Angular',
    versao: '21.x',
    tipo: 'Full Battery Included',
    mantenedor: 'Google Inc.',
    suporte: ['Signals', 'Pipes', 'DI', 'SSR', 'Control Flow']
  };

  // 5. REACTIVE FORMS STATE
  cadastroForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    nivelExperiencia: ['Iniciante', Validators.required],
    aceiteTermos: [false, Validators.requiredTrue]
  });
  cadastroSucesso: boolean = false;

  // 6. LIFECYCLE & DI STATE
  exibirFilho: boolean = true;
  ultimaMsgFilho: string = 'Nenhum evento emitido ainda.';

  constructor() {
    this.logger.log('App Root', 'constructor()', 'Aplicação principal inicializada');
  }

  // --- MÉTODOS DE BINDING ---
  aoDigitarInterpolar(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.textoInterpolar = valor;
    this.logger.log('DataBinding', 'Interpolation Input', valor);
  }

  alternarDesabilitado(): void {
    this.botaoDesabilitado = !this.botaoDesabilitado;
    this.logger.log('PropertyBinding', '[disabled]', `Botão desabilitado: ${this.botaoDesabilitado}`);
  }

  alterarTamanhoFonte(delta: number): void {
    this.tamanhoFonte = Math.max(12, Math.min(32, this.tamanhoFonte + delta));
    this.logger.log('PropertyBinding', '[style.fontSize.px]', `${this.tamanhoFonte}px`);
  }

  dispararClique(nomeBotao: string): void {
    this.contadorEventos++;
    this.ultimoEvento = `Botão "${nomeBotao}" acionado às ${new Date().toLocaleTimeString()}`;
    this.logger.log('EventBinding', '(click)', this.ultimoEvento);
  }

  aoMudarTwoWay(): void {
    this.logger.log('TwoWayBinding', '[(ngModel)]', this.textoTwoWay);
  }

  // --- MÉTODOS DE SIGNALS ---
  alterarQuantidade(delta: number): void {
    const novaQtd = Math.max(1, this.quantidadeSignal() + delta);
    this.quantidadeSignal.set(novaQtd);
    this.logger.log('Signals', 'quantidadeSignal.set()', novaQtd);
  }

  alterarPreco(novoPreco: number): void {
    this.precoUnitarioSignal.set(novoPreco);
    this.logger.log('Signals', 'precoUnitarioSignal.set()', `R$ ${novoPreco}`);
  }

  alterarDesconto(novoDesconto: number): void {
    this.cupomDescontoSignal.set(novoDesconto);
    this.logger.log('Signals', 'cupomDescontoSignal.set()', `${novoDesconto}%`);
  }

  // --- MÉTODOS DE CONTROL FLOW ---
  adicionarTarefa(): void {
    if (!this.novaTarefaTitulo.trim()) return;

    const nova: TarefaDemo = {
      id: Date.now(),
      titulo: this.novaTarefaTitulo.trim(),
      prioridade: this.novaTarefaPrioridade,
      concluida: false
    };

    this.tarefas.push(nova);
    this.logger.log('ControlFlow', '@for Add Item', nova.titulo);
    this.novaTarefaTitulo = '';
  }

  alternarConclusao(tarefa: TarefaDemo): void {
    tarefa.concluida = !tarefa.concluida;
    this.logger.log('ControlFlow', 'Toggle Concluída', `${tarefa.titulo}: ${tarefa.concluida}`);
  }

  removerTarefa(id: number): void {
    const item = this.tarefas.find(t => t.id === id);
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    this.logger.log('ControlFlow', '@for Remove Item', item?.titulo || id);
  }

  obterTarefasFiltradas(): TarefaDemo[] {
    if (this.filtroPrioridade === 'TODAS') {
      return this.tarefas;
    }
    return this.tarefas.filter(t => t.prioridade === this.filtroPrioridade);
  }

  // --- MÉTODOS DE FORMULÁRIO REATIVO ---
  submeterCadastro(): void {
    if (this.cadastroForm.valid) {
      this.cadastroSucesso = true;
      this.logger.log('ReactiveForms', 'form.valid Submit', this.cadastroForm.value);
    } else {
      this.cadastroForm.markAllAsTouched();
      this.logger.log('ReactiveForms', 'form.invalid Submit Attempt', this.cadastroForm.errors);
    }
  }

  resetarFormulario(): void {
    this.cadastroForm.reset({
      nome: '',
      email: '',
      nivelExperiencia: 'Iniciante',
      aceiteTermos: false
    });
    this.cadastroSucesso = false;
    this.logger.log('ReactiveForms', 'form.reset()', 'Campos restaurados ao padrão');
  }

  // --- MÉTODOS DE LIFECYCLE ---
  alternarComponenteFilho(): void {
    this.exibirFilho = !this.exibirFilho;
    this.logger.log('Lifecycle', '@if Toggle Filho', `exibirFilho = ${this.exibirFilho}`);
  }

  receberMensagemFilho(msg: string): void {
    this.ultimaMsgFilho = msg;
    this.logger.log('App Root', 'Recebeu @Output do Filho', msg);
  }

  limparLogs(): void {
    this.logger.clear();
  }
}
