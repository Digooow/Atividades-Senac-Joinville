

console.log("Hello, World!");

import express from 'express';
const app = express();
const port = 3000;

app.use(express.json()); 

// Exercicio 1: Rota para somar dois números

app.post('/api/somar', (req, res) => {
    const num1 = req.body.num1;
    const num2 = req.body.num2;
    const soma = num1 + num2;
    res.send({message: soma});
}
  

);
// Exercicio 2: Rota para calcular o salário de um funcionário
app.post('/api/salario', (req, res) => {
    const valor = req.body.valor;
    const hora = req.body.hora;
    const salario = valor * hora;
    res.send({message: salario});
  
});

// Exercicio 3: Rota para calcular a média de peso de 5 pessoas
app.post('/api/peso/pessoas', (req, res) => {
    const peso1 = req.body.peso1;
    const peso2 = req.body.peso2;
    const peso3 = req.body.peso3;
    const peso4 = req.body.peso4;
    const peso5 = req.body.peso5;

    const media = (peso1 + peso2 + peso3 + peso4 + peso5) / 5;
    res.send({message: media});
});


// Exercicio 4: Peça uma temperatura em Celsius e converta para Fahrenheit. A fórmula de conversão é: F = (C * 9/5) + 32
app.post('/api/conversor', (req, res) => {
    const celsius = (req.body.celsius);
    const fahrenheit = (celsius * 9/5) + 32;
    res.send({message: fahrenheit});
});


// Exercicio 5: Peça uma distância em milhas e converta para quilômetros. A fórmula de conversão é: km = milha * 1.60934
app.post('/api/distancia', (req, res) => {
    const milha = (req.body.milha);
    const quilometro = milha * 1.60934;
    res.send({message: quilometro});
});


// Exercicio 6: Peça uma duração em segundos e converta para horas, minutos e segundos.
app.post('/api/duracao', (req, res) => {
    const segundos = (req.body.segundos);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    res.send({message: horas + " horas, " + (minutos % 60) + " minutos, " + (segundos % 60) + " segundos"});
});


// Exercicio 7: Peça uma distância em quilômetros e converta para metros e centímetros.
app.post('/api/distanciametro', (req, res) => {
    const quilometro = (req.body.quilometro);
    const metros = quilometro * 1000;
    const centimetros = metros * 100;
    res.send({message: quilometro + " Quilometros é igual a " + metros + " metros, " + centimetros + " centímetros"});
});


// Exercicio 8: Peça um número e retorne a tabuada desse número de 1 a 10.
app.post('/api/tabuada', (req, res) => {
    const numero = (req.body.numero);
    let tabuada = [];

    for (let i = 1; i <= 10; i++) {
        tabuada.push({ multiplicando: numero, multiplicador: i, resultado: numero * i });
    }

    res.send({ message: tabuada });
});

// Desafio 0: Peça a idade de uma pessoa em anos e mostre a mesma idade em meses e em dias. 
app.post('/api/idade', (req, res) => {
    const anos = req.body.anos;
    const meses = anos * 12;
    const dias = anos * 365;
    res.send({message: anos + " anos é igual a " + meses + " meses, " + dias + " dias"});
});

// Desafio 1: Peça dois valores (A e B), mostre os valores originais, troque os conteúdos das variáveis e mostre os valores após a troca.
app.post('/api/troca', (req, res) => {
    let a = req.body.a;
    let b = req.body.b;
    const originalA = a;
    const originalB = b;

    // Troca os valores
    a = b;
    b = originalA;

    res.send({ message: `Valores após a troca: A = ${a}, B = ${b}` });
});

// Desafio 2: Peça dois números inteiros e mostre qual deles é o maior.
app.post('/api/maior', (req, res) => {
    const num1 = req.body.num1;
    const num2 = req.body.num2;

    if (num1 > num2) {
        res.send({ message: `O maior número é: ${num1}` });
    } else if (num2 > num1) {
        res.send({ message: `O maior número é: ${num2}` });
    } else {
        res.send({ message: "Os números são iguais." });
    }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor em http://localhost:${port}`);
});
