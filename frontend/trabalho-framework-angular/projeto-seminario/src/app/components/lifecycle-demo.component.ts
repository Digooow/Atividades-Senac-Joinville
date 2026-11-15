import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLoggerService } from '../services/event-logger.service';

@Component({
  selector: 'app-lifecycle-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lifecycle-box">
      <div class="box-header">
        <span class="status-badge">Componente Ativo no DOM</span>
        <span class="instance-name">{{ instanceName }}</span>
      </div>
      <p class="desc">
        Este componente filho foi instanciado dinamicamente via <code>&#64;if</code>.
        Ao clicar em desmontar, o hook <code>ngOnDestroy()</code> interceptará o descarte.
      </p>
      <div class="box-metrics">
        <div class="metric">
          <span class="lbl">Tempo de Vida:</span>
          <strong>{{ segundosVivos }}s</strong>
        </div>
        <div class="metric">
          <span class="lbl">Ticks de Timer:</span>
          <strong>{{ timerTicks }}</strong>
        </div>
      </div>
      <button class="btn-action" (click)="emitirAlerta()">
        Disparar Evento Filho para Pai (&#64;Output)
      </button>
    </div>
  `,
  styles: [`
    .lifecycle-box {
      background: #0f172a;
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 1rem;
      color: #f8fafc;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .status-badge {
      background: #064e3b;
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .instance-name {
      font-family: monospace;
      color: #94a3b8;
      font-size: 0.85rem;
    }
    .desc {
      font-size: 0.875rem;
      color: #cbd5e1;
      margin-bottom: 0.75rem;
    }
    code {
      background: #1e293b;
      padding: 2px 6px;
      border-radius: 4px;
      color: #38bdf8;
      font-family: monospace;
    }
    .box-metrics {
      display: flex;
      gap: 1.5rem;
      background: #1e293b;
      padding: 0.6rem 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }
    .metric {
      display: flex;
      flex-direction: column;
    }
    .metric .lbl {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .metric strong {
      color: #38bdf8;
      font-size: 1.1rem;
    }
    .btn-action {
      background: #0284c7;
      color: white;
      padding: 6px 12px;
      font-size: 0.85rem;
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
    }
    .btn-action:hover {
      background: #0369a1;
    }
  `]
})
export class LifecycleDemoComponent implements OnInit, OnDestroy {
  @Input() instanceName: string = 'ComponenteFilho';
  @Output() eventoDisparado = new EventEmitter<string>();

  segundosVivos: number = 0;
  timerTicks: number = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private logger: EventLoggerService) {
    this.logger.log('LifecycleDemoComponent', 'constructor()', 'Instância criada na memória');
  }

  ngOnInit(): void {
    this.logger.log('LifecycleDemoComponent', 'ngOnInit()', 'Componente inicializado e vinculado ao DOM');
    this.intervalId = setInterval(() => {
      this.segundosVivos++;
      this.timerTicks++;
    }, 1000);
  }

  emitirAlerta(): void {
    const msg = `Mensagem emitida do filho às ${new Date().toLocaleTimeString()}!`;
    this.eventoDisparado.emit(msg);
    this.logger.log('LifecycleDemoComponent', '@Output emit()', msg);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.logger.log('LifecycleDemoComponent', 'ngOnDestroy()', 'Componente descartado do DOM e timers limpos');
  }
}

