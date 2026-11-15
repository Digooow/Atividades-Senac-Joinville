function calcular(operacao) {
  const number1 = parseFloat(document.getElementById('number1').value);
  const number2 = parseFloat(document.getElementById('number2').value);
  const result = document.getElementById('result');
  const error = document.getElementById('error');

  error.textContent = '';

  if (isNaN(number1) || isNaN(number2)) {
    error.textContent = 'Por favor, insira números válidos.';
    return;
  }

  let res;
  switch (operacao) {
    case '+':
      res = number1 + number2;
      break;
    case '-':
      res = number1 - number2;
      break;
    case '*':
      res = number1 * number2;
      break;
    case '/':
      if (number2 === 0) {
        error.textContent = 'Divisão por zero não é permitida.';
        return;
      }
      res = number1 / number2;
      break;
    default:
      error.textContent = 'Operação inválida.';
      return;
  }

  result.textContent = res.toFixed(2);
}

function limpar() {
  document.getElementById('number1').value = '';
  document.getElementById('number2').value = '';
  document.getElementById('result').textContent = '0';
  document.getElementById('error').textContent = '';
}