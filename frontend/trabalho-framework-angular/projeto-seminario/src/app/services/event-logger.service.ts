import { Injectable, signal } from '@angular/core';

export interface LogEntry {
  id: number;
  timestamp: string;
  source: string;
  action: string;
  payload: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventLoggerService {
  private currentId = 0;
  
  // Usando Signal para gerenciar estado reativo do serviço global
  readonly logs = signal<LogEntry[]>([]);

  log(source: string, action: string, payload: unknown = ''): void {
    const formattedPayload = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR') + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const entry: LogEntry = {
      id: ++this.currentId,
      timestamp: timeStr,
      source,
      action,
      payload: formattedPayload
    };

    // Mantém no máximo os últimos 20 eventos
    this.logs.update(current => [entry, ...current.slice(0, 19)]);
  }

  clear(): void {
    this.logs.set([]);
  }
}

