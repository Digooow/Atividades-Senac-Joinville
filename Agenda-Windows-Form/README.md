# Agenda

Aplicação desktop de agenda de contatos desenvolvida como atividade prática do
curso do Senac. O projeto foi criado em **C#**, utilizando **Windows Forms** para
a interface gráfica e **SQLite** para armazenar os dados localmente.

O objetivo da aplicação é demonstrar o funcionamento de um CRUD completo:

- **Create (Criar):** cadastrar novos contatos.
- **Read (Consultar):** listar e pesquisar contatos.
- **Update (Atualizar):** alterar os dados de um contato existente.
- **Delete (Excluir):** remover um contato após confirmação.

## Funcionalidades

### Cadastro de contatos

O usuário informa o nome e o telefone do contato na tela principal. Ao clicar em
**Inserir**, os dados são validados e gravados no banco de dados.

Cada registro recebe um ID automaticamente pelo SQLite. O ID não precisa ser
informado pelo usuário e é exibido na tabela de contatos.

### Listagem

Ao abrir a aplicação, todos os contatos cadastrados são carregados em uma tabela.
Os registros são exibidos com:

- ID;
- Nome;
- Telefone.

A listagem é ordenada alfabeticamente pelo nome do contato.

### Pesquisa

O botão **Localizar** permite filtrar os contatos utilizando:

- parte ou todo o nome;
- parte ou todo o telefone;
- nome e telefone ao mesmo tempo.

Os campos podem ser usados separadamente. Quando nenhum filtro é informado, a
consulta retorna todos os contatos. Caso nenhum registro corresponda à pesquisa,
a aplicação informa o usuário.

### Alteração

Para alterar um contato, basta selecionar uma linha da tabela. Os dados são
carregados nos campos do formulário. Depois de realizar a edição, o botão
**Alterar** atualiza o registro no banco.

### Exclusão

Ao selecionar um contato, o botão **Excluir** fica disponível. Antes de remover
o registro, a aplicação solicita uma confirmação para evitar exclusões
acidentais.

### Validação

Antes de inserir ou alterar um contato, são verificadas as seguintes regras:

- o nome não pode ficar vazio;
- o nome pode ter no máximo 50 caracteres;
- o telefone não pode ficar vazio;
- o telefone deve possuir pelo menos 10 dígitos.

O telefone utiliza a máscara `(00) 00000-0000` na interface.

### Tela Sobre

O botão **Próxima** abre uma segunda tela com informações resumidas sobre a
aplicação e a tecnologia utilizada.

## Banco de dados

O banco é criado automaticamente na primeira execução. O arquivo `banco.sqlite`
fica no diretório de execução da aplicação.

A tabela `Contatos` possui a seguinte estrutura:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `Id` | `INTEGER` | Identificador gerado automaticamente |
| `Nome` | `VARCHAR(50)` | Nome do contato |
| `Telefone` | `VARCHAR(50)` | Telefone do contato |

As consultas utilizam parâmetros SQL, evitando problemas com caracteres
especiais nos nomes e reduzindo o risco de injeção SQL.

## Organização do projeto

| Arquivo | Responsabilidade |
| --- | --- |
| `Agenda/Form1.cs` | Tela principal e operações do CRUD |
| `Agenda/Form1.Designer.cs` | Componentes visuais da tela principal |
| `Agenda/Form2.cs` | Tela Sobre |
| `Agenda/Contato.cs` | Modelo de dados de um contato |
| `Agenda/DBAgenda.cs` | Criação do banco e operações SQLite |
| `Agenda/ValidarContato.cs` | Regras de validação dos contatos |
| `Agenda/Program.cs` | Ponto de entrada da aplicação |
| `Agenda.Tests/` | Testes automatizados |

## Como executar

### Requisitos

- Windows;
- .NET SDK 10;
- Visual Studio com a carga de trabalho de desenvolvimento para desktop com
  .NET, ou o SDK instalado para execução via terminal.

### Pelo Visual Studio

1. Abra o arquivo `Agenda.slnx`.
2. Defina o projeto `Agenda` como projeto de inicialização, se necessário.
3. Execute com **F5** ou **Ctrl + F5**.

### Pelo terminal

Na pasta `Agenda-Windows-Form`, execute:

```powershell
dotnet run --project .\Agenda\Agenda.csproj
```

Para somente compilar a solução:

```powershell
dotnet build .\Agenda.slnx
```

Para executar os testes automatizados:

```powershell
dotnet test .\Agenda.Tests\Agenda.Tests.csproj
```

## Testes automatizados

Os testes verificam:

- rejeição de nome vazio;
- rejeição de telefone inválido;
- aceitação de um contato válido;
- inserção, pesquisa, alteração e exclusão de contatos;
- tratamento correto de nomes que possuem apóstrofo.