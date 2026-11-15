# Atividade: Publicação de um repositório no GitHub

## Sobre a atividade

Esta atividade apresenta o fluxo básico de trabalho com **Git** e **GitHub**. O objetivo é configurar o Git no computador, transformar uma pasta local em um repositório, criar um repositório remoto no GitHub e publicar os arquivos locais nele.

Ao final, o projeto estará disponível tanto no computador quanto em uma página do GitHub, permitindo armazenar o código, acompanhar alterações e compartilhá-lo.

## Conceitos principais

- **Git:** sistema de controle de versão instalado no computador.
- **GitHub:** serviço online que hospeda repositórios Git.
- **Repositório local:** pasta do projeto controlada pelo Git no computador.
- **Repositório remoto:** cópia do projeto hospedada no GitHub.
- **Commit:** registro permanente de um conjunto de alterações.
- **Push:** envio dos commits locais para o repositório remoto.

## Pré-requisitos

Antes de começar, é necessário ter:

1. Uma conta no [GitHub](https://github.com/).
2. O [Git](https://git-scm.com/downloads) instalado.
3. Uma pasta com os arquivos do projeto.
4. Um terminal, como PowerShell, Prompt de Comando ou Git Bash.

Para confirmar se o Git está instalado, execute:

```bash
git --version
```

## Tutorial: configurar o repositório local

### 1. Abrir o terminal na pasta do projeto

Entre na pasta que contém os arquivos do projeto:

```bash
cd "caminho/para/Atividade GitHub"
```

No Windows, também é possível clicar com o botão direito na pasta e escolher **Abrir no Terminal**.

### 2. Configurar nome e e-mail do Git

Essas informações serão associadas aos commits realizados:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

Para conferir a configuração:

```bash
git config --global --list
```

### 3. Inicializar o repositório

Na pasta do projeto, execute:

```bash
git init
```

Esse comando cria a pasta oculta `.git`, que armazena o histórico e as configurações do repositório local.

### 4. Verificar os arquivos

```bash
git status
```

O Git mostrará os arquivos que ainda não foram adicionados ao controle de versão.

### 5. Adicionar os arquivos ao staging

Para adicionar todos os arquivos da pasta:

```bash
git add .
```

Também é possível adicionar um arquivo específico:

```bash
git add nome-do-arquivo
```

### 6. Criar o primeiro commit

```bash
git commit -m "Adiciona arquivos iniciais do projeto"
```

O commit salva uma versão do projeto no histórico local.

## Tutorial: criar o repositório no GitHub

1. Acesse [github.com](https://github.com/) e entre na sua conta.
2. Clique em **New** ou em **+ > New repository**.
3. Informe um nome para o repositório, por exemplo `atividade-github`.
4. Escolha se o repositório será público ou privado.
5. **Não marque** as opções de adicionar README, `.gitignore` ou licença, pois o projeto local já possui esses arquivos.
6. Clique em **Create repository**.

Depois da criação, o GitHub exibirá a URL do repositório. Ela será usada para conectar o projeto local ao remoto.

## Tutorial: publicar o projeto no GitHub

Na pasta do projeto, execute os comandos abaixo. Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub e `NOME_DO_REPOSITORIO` pelo nome criado no passo anterior:

```bash
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### O que cada comando faz?

- `git remote add origin ...`: associa o repositório local ao repositório remoto chamado `origin`.
- `git branch -M main`: define `main` como o nome da branch principal.
- `git push -u origin main`: envia os commits locais para o GitHub e configura a branch remota padrão.

Durante o primeiro envio, o GitHub poderá solicitar autenticação. Para conexões HTTPS, use um **Personal Access Token (PAT)** no lugar da senha, pois o GitHub não aceita mais senhas comuns para operações Git. Outra opção é configurar uma chave SSH ou utilizar o [GitHub CLI](https://cli.github.com/).

## Conferir o resultado

Após o `push`, atualize a página do repositório no GitHub. Os arquivos do projeto deverão aparecer online.

Para conferir a URL configurada no projeto local:

```bash
git remote -v
```

Para consultar o estado atual:

```bash
git status
```

Uma mensagem como `Your branch is up to date with 'origin/main'` indica que o repositório local está sincronizado com o GitHub.

## Fluxo para alterações futuras

Depois de modificar ou criar arquivos, repita este fluxo:

```bash
git status
git add .
git commit -m "Descreve a alteração realizada"
git push
```

É recomendável usar mensagens de commit claras e objetivas, facilitando a compreensão do histórico do projeto.

## Resumo dos comandos

```bash
# Configuração inicial
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"

# Criar o repositório local
git init
git add .
git commit -m "Adiciona arquivos iniciais do projeto"

# Conectar e publicar no GitHub
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git branch -M main
git push -u origin main
```

## Resultado esperado

Ao concluir a atividade, o projeto deverá:

- estar configurado como um repositório Git local;
- possuir pelo menos um commit;
- estar conectado a um repositório remoto no GitHub;
- ter seus arquivos publicados na branch `main`.
