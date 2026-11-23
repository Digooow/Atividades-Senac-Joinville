# Angular Interactive Showcase & Toolkit (`projeto-seminario`)

![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

Aplicação **Single Page Application (SPA)** desenvolvida em **Angular 21.2** com *Standalone Components* para demonstração prática durante o seminário técnico de Angular do curso **Jovem Programador (SENAC Joinville)**.

> Documentação completa do seminário e dos 6 cards interativos: [`../readme.md`](../readme.md) · [`../ORGANIZACAO_SOFTWARE.md`](../ORGANIZACAO_SOFTWARE.md)

## Estrutura Principal

```text
projeto-seminario/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── lifecycle-demo.component.ts   # Componente filho (ngOnInit / ngOnDestroy / @Output)
│   │   ├── services/
│   │   │   └── event-logger.service.ts       # Serviço Singleton reativo com Signals
│   │   ├── app.ts                            # Componente raiz standalone
│   │   ├── app.html                          # Template com os 6 pilares demonstrativos
│   │   ├── app.css                           # Estilos encapsulados
│   │   ├── app.config.ts                     # Configuração de provedores da aplicação
│   │   └── app.spec.ts                       # Testes unitários com Vitest
│   ├── main.ts                               # Bootstrap client-side
│   ├── main.server.ts                        # Bootstrap SSR
│   └── server.ts                             # Servidor Express para SSR
├── angular.json
└── package.json
```

## Scripts Disponíveis

Instale as dependências antes do primeiro uso:

```bash
npm install
```

| Comando | Descrição |
| :--- | :--- |
| `npm start` | Inicia o servidor de desenvolvimento (`ng serve`) em `http://localhost:4200` |
| `npm run build` | Gera o build otimizado de produção em `dist/projeto-seminario` |
| `npm run watch` | Compila continuamente em modo desenvolvimento |
| `npm test` | Executa os testes unitários com **Vitest** via `ng test` |
| `npm run serve:ssr:projeto-seminario` | Executa a versão SSR gerada pelo build em Node.js |

---

[← Voltar para trabalho-framework-angular](../readme.md) · [← Voltar ao repositório principal](../../../README.md)
