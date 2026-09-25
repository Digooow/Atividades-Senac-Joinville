# Metodologias Ágeis — Projeto Integrador 2

## Sobre a atividade

Esta pasta registra a atividade da disciplina de **Metodologias Ágeis** aplicada
ao **Projeto Integrador 2** do curso Jovem Programador do SENAC Joinville.

O projeto desenvolvido foi um **Sistema de Reserva de Salas** para uma unidade
de ensino. A proposta não era apenas criar um programa, mas aplicar um processo
de desenvolvimento ágil: entender um problema real, levantar as necessidades
dos usuários, transformar essas necessidades em histórias, priorizar entregas,
dividir o trabalho em sprints e validar o resultado continuamente.

> O sistema pronto está na pasta [`../Projeto-Integrador2`](../Projeto-Integrador2).
> Este README documenta somente o processo da disciplina e a evolução da
> atividade, não a implementação técnica do sistema.

## Problema identificado

A coordenação precisava organizar as salas por meio de mensagens, planilhas e
anotações manuais. Esse processo dificultava:

- saber quais salas estavam livres;
- evitar duas reservas no mesmo horário;
- controlar reservas recorrentes;
- conferir a capacidade e os recursos de cada sala;
- aprovar ou rejeitar solicitações;
- informar aos alunos onde cada aula estava acontecendo.

A partir desse problema, definimos como objetivo criar um fluxo centralizado de
solicitação, aprovação e acompanhamento das reservas.

## Como aplicamos as metodologias ágeis

### 1. Identificação dos usuários e do problema

Começamos olhando para a situação da coordenação e dos demais envolvidos no
processo:

- **coordenação:** analisa conflitos e aprova solicitações;
- **professores e colaboradores:** solicitam salas e acompanham seus pedidos;
- **alunos:** consultam onde as aulas estão acontecendo;
- **responsáveis pela estrutura:** mantêm salas e recursos cadastrados.

Essa etapa ajudou a manter o projeto focado em uma necessidade concreta, em vez
de criar funcionalidades sem relação com o uso real.

### 2. História de usuário

As necessidades foram descritas pelo ponto de vista de quem usaria o sistema.
Um exemplo central foi:

> Como professor ou colaborador, quero solicitar uma sala informando data,
> horário, finalidade e quantidade de pessoas, para organizar minha atividade
> sem depender de mensagens para a coordenação.

Também foram consideradas histórias para aprovação, cancelamento, reservas
recorrentes, cadastro de salas e visualização pública das aulas.

### 3. Backlog do produto

As histórias foram organizadas em um backlog e priorizadas pelo valor que
entregavam:

1. registrar usuários, salas e recursos;
2. solicitar uma reserva;
3. validar capacidade e conflitos;
4. aprovar, rejeitar e cancelar solicitações;
5. tratar reservas recorrentes;
6. exibir a agenda completa;
7. criar o painel público para os alunos;
8. melhorar segurança, testes, integração e publicação.

Assim, o time pôde entregar primeiro o fluxo essencial de reserva e deixar
melhorias e recursos complementares para as etapas seguintes.

### 4. Sprints e incrementos

O trabalho foi dividido em pequenos ciclos. Em cada sprint, o objetivo era
selecionar uma parte do backlog, desenvolver um incremento, verificar o
resultado e registrar o que ainda precisava ser melhorado.

### 5. Revisão e melhoria contínua

As análises do projeto registraram o que estava concluído, os problemas
encontrados, as prioridades e as próximas ações. Quando percebemos que o
frontend e o backend estavam separados, por exemplo, a integração passou a ser
uma prioridade da sprint seguinte.

## Roadmap das sprints e aulas

Os arquivos do projeto preservam registros consolidados de **22/08, 26/08 e
28/08 de 2026**, mas não contêm um diário completo com o número exato de cada
aula. Por isso, o roteiro abaixo é uma reconstrução organizada a partir do
backlog, das análises e dos roadmaps registrados no projeto.

### Sprint 1 — Descoberta e definição do produto

**Objetivo:** entender o problema e definir o que deveria ser construído.

**Aula 1 — Levantamento do problema**

- identificamos as dificuldades da coordenação com planilhas e mensagens;
- mapeamos os usuários envolvidos;
- definimos o Sistema de Reserva de Salas como produto;
- discutimos o valor que o sistema entregaria para a instituição.

**Aula 2 — Requisitos e histórias de usuário**

- transformamos necessidades em histórias de usuário;
- descrevemos o fluxo ideal de uma solicitação;
- levantamos regras importantes, como capacidade da sala e conflito de horário;
- definimos a visão pública para os alunos.

**Resultado da sprint:** visão do produto, público-alvo, problema documentado e
primeiro conjunto de histórias de usuário.

### Sprint 2 — Backlog e primeira solução

**Objetivo:** organizar o trabalho e criar o primeiro incremento funcional.

**Aula 3 — Priorização do backlog**

- separamos funcionalidades essenciais das melhorias futuras;
- priorizamos o cadastro de usuários, salas, recursos e reservas;
- definimos aprovação e cancelamento como regras centrais;
- organizamos as tarefas em uma sequência de entrega.

**Aula 4 — Fluxo principal da reserva**

- estruturamos o fluxo de solicitar, analisar e aprovar uma reserva;
- definimos os papéis de professor, colaborador, coordenador e administrador;
- planejamos o tratamento de reservas recorrentes;
- validamos o primeiro recorte do produto com foco no usuário.

**Resultado da sprint:** backlog priorizado e fluxo principal definido para
orientar o desenvolvimento.

### Sprint 3 — Regras de negócio e validação

**Objetivo:** tornar o fluxo confiável e evitar erros de operação.

**Aula 5 — Conflitos, capacidade e recorrência**

- definimos a verificação de horários sobrepostos;
- relacionamos a capacidade da sala à quantidade de participantes;
- planejamos a criação de ocorrências para reservas recorrentes;
- definimos os estados de uma solicitação, como pendente, aprovada,
  rejeitada e cancelada.

**Aula 6 — Perfis e responsabilidades**

- refinamos as permissões de cada papel;
- definimos que apenas responsáveis autorizados poderiam aprovar;
- planejamos a desativação de usuários sem apagar o histórico;
- revisamos as histórias para verificar se atendiam ao problema original.

**Resultado da sprint:** regras de negócio priorizadas e critérios de aceitação
mais claros.

### Sprint 4 — Integração e entrega do incremento

**Objetivo:** conectar as partes do produto e aproximar a solução do uso real.

**Aula 7 — Integração frontend/backend**

Registrada no ciclo de 26/08:

- conectamos a interface à API;
- substituímos o armazenamento demonstrativo por comunicação com o backend;
- integramos usuários, salas, recursos e reservas;
- ajustamos o modelo para tratar cada ocorrência de uma série recorrente;
- implementamos paginação para a consulta de reservas.

**Aula 8 — Testes e validação do incremento**

- executamos o build da API;
- validamos o incremento com testes unitários e testes E2E;
- registramos o resultado de 9 testes aprovados;
- analisamos o que estava pronto e o que ainda precisava de validação em
  ambiente publicado.

**Resultado da sprint:** frontend e backend integrados, com o fluxo principal
funcional e validado localmente.

### Sprint 5 — Segurança, publicação e fechamento

**Objetivo:** preparar a entrega, revisar o produto e registrar pendências.

**Aula 9 — Autenticação e controle de acesso**

No ciclo final, trabalhamos em:

- login com credenciais;
- autenticação por token JWT;
- autorização conforme o papel do usuário;
- proteção das operações administrativas e de reservas;
- integração do login com JWT no frontend;
- identificação das validações que ainda precisavam ser feitas no ambiente
  publicado, como testes ponta a ponta e redeploy.

**Aula 10 — Revisão final e retrospectiva**

Registrada no status de 28/08:

- revisamos as funcionalidades concluídas;
- documentamos o estado atual do projeto;
- separamos entregas comprovadas de pendências reais;
- identificamos melhorias futuras, como CORS restrito, fuso horário, rate
  limiting e testes E2E contra o ambiente publicado;
- organizamos a apresentação e os registros finais.

**Resultado da sprint:** produto demonstrável, documentação do processo,
pendências conhecidas e próximos passos definidos.

## Entregas realizadas no processo ágil

Ao final da atividade, o processo resultou em:

- problema e usuários identificados;
- história de usuário principal documentada;
- backlog de funcionalidades;
- regras de negócio priorizadas;
- incrementos entregues por etapas;
- revisão do produto a cada ciclo;
- integração entre frontend e backend;
- testes para validar o incremento;
- registro de riscos, pendências e próximos passos;
- apresentação final do projeto.

## O que aprendemos

O principal aprendizado da atividade foi perceber que metodologia ágil não é
somente dividir tarefas ou usar um quadro. Ela envolve:

- desenvolver a partir de um problema real;
- ouvir e representar as necessidades do usuário;
- entregar valor em partes pequenas;
- validar antes de considerar algo concluído;
- adaptar o planejamento quando surgem novos problemas;
- manter transparência sobre o que está pronto e o que ainda falta;
- melhorar o produto e o processo continuamente.

## Referências usadas

- [Projeto Integrador 2](../Projeto-Integrador2)
- [História de usuário](../Projeto-Integrador2/frontend/historia_do_usuario.md)
- [Análise do projeto](../Projeto-Integrador2/ANALISE-PROJETO.md)
- [Roadmap de ações](../Projeto-Integrador2/ROADMAP-ACOES.md)
- [Roadmap atual](../Projeto-Integrador2/ROADMAP-ATUAL.md)