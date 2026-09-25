# Atividades de C++ e Portugol

Conjunto de exercícios desenvolvidos durante as aulas de lógica de programação do curso Jovem Programador do SENAC Joinville. Os arquivos praticam entrada e saída de dados, variáveis, estruturas condicionais, repetição, vetores, funções de biblioteca e testes automatizados.

## Organização

### `Atividades algoritmos`

Exercícios introdutórios em C++:

- `Atividade para fazer em casa111.cpp`: soma continuamente números informados pelo usuário, trata entradas inválidas e encerra quando `n` é digitado.
- `Atividade para fazer em casa112.cpp`: solicita uma senha até que o valor correto seja informado.
- `Atividade para fazer em casa113.cpp`: exibe a tabuada de um número de 1 a 10.
- `Atividade para fazer em casa114.cpp`: calcula a média de várias notas e informa se o aluno foi aprovado ou reprovado.
- `Atividade para fazer em casa115.cpp`: simula uma compra em uma padaria, calculando o total, o troco ou o valor restante.
- `Atividade para fazer em casa116.cpp`: recebe notas entre 0 e 10, lista os valores e calcula a média.

### `Atividades Portugol`

Algoritmos em Visualg usados para exercitar a lógica antes da implementação em uma linguagem compilada:

- `Calculadora.visualg`: realiza operações de adição, subtração, multiplicação e divisão, permitindo continuar a conta.
- `Escolha o número e direi o mês.visualg` e `Escolha o número e direi o mês (1).visualg`: relacionam um número ao mês correspondente.
- `Leia a nota do aluno.visualg`: recebe uma nota e trabalha sua classificação.
- `Leia um numero e faça tabuada.visualg`: gera a tabuada de um número informado.
- `Leia um número e diga se ele é impar o par.visualg`: identifica se o número é par ou ímpar.
- `Meu número premiado.visualg`: soma números até que o valor zero seja informado.

### `Atividade Avaliativa C++ Prof Claudia`

Reúne exercícios avaliativos em C++ com problemas de lógica e interação pelo console. Os arquivos com nomes semelhantes representam versões desenvolvidas e uma versão final da atividade.

### `Atividade Avaliativa Teste de Qualidade`

Aplica práticas de qualidade de software ao código:

- `Atividade avaliativa TESTE UNITARIO.cpp`: introdução a testes unitários com asserções.
- `Atividade avaliativa TESTE UNITARIO2.cpp` e `Atividade avaliativa TESTE UNITARIO2 Resolvida.cpp`: versões de um exercício com testes e sua resolução.
- `Atividade avaliativa TESTE UNITARIO3.cpp` e `Atividade avaliativa TESTE UNITARIO4.cpp`: exercícios adicionais de validação automatizada.
- `Atividade 1/Atividade Cpp prof Claudia Refatorada SOLID.cpp`: refatoração de uma atividade aplicando os princípios SOLID.
- `Atividade 1/Atividade Escrita Teste de qualidade.docx`: atividade teórica relacionada à qualidade e aos testes.

## Como executar os arquivos C++

É necessário ter um compilador C++ instalado. Alguns programas usam `windows.h`, portanto foram preparados para execução no Windows.

No terminal, entre na pasta que contém o arquivo e compile com:

```bash
g++ "nome-do-arquivo.cpp" -o programa.exe
```

Depois, execute o programa:

```bash
./programa.exe
```

No Windows PowerShell, também é possível usar:

```powershell
.\programa.exe
```

Os arquivos `.visualg` devem ser abertos no Visualg ou em um interpretador compatível com a sintaxe Portugol.

## Objetivo dos exercícios

As atividades formam uma sequência prática de aprendizagem: começam com algoritmos simples em Portugol, avançam para programas interativos em C++ e terminam com avaliação de qualidade, refatoração e testes. Os executáveis presentes nas pastas são resultados de compilações anteriores; para reproduzir os programas, recomenda-se compilar novamente os arquivos-fonte `.cpp`.
