#include <iostream>
#include <cassert>

using namespace std;

double calcularEstacionamento(int horas, int dia, bool vip) {

  if (dia < 1 || dia > 7) return -1;

  if (dia == 1){
    return 0;
  }

  double valor = 0;

  if (horas <= 0) valor = 0;
  else if (horas <= 1) valor = 5;
  else if (horas <= 3) valor = 10;
  else if (horas <= 10) valor = 15;
  else valor = 30;

  if (vip) {
    valor *= 0.5;
  }
  
  return valor;
}



void testarCalcularEstacionamento() {
  
  assert(calcularEstacionamento(-1, 2, false) == 0);
  assert(calcularEstacionamento(0, 3, false) == 0);
  assert(calcularEstacionamento(1, 4, false) == 5);
  assert(calcularEstacionamento(3, 5, false) == 10);
  assert(calcularEstacionamento(5, 6, false) == 15);
  assert(calcularEstacionamento(10, 7, true) == 7.5);
  assert(calcularEstacionamento(11, 2, true) == 15);
  assert(calcularEstacionamento(11, 1, true) == 0);
  assert(calcularEstacionamento(9, 1, false) == 0);
  assert(calcularEstacionamento(9, 8, true) == -1);
  assert(calcularEstacionamento(9, 8, false) == -1);

  cout << "Todos os testes passaram!" << endl;
}



int main() {

  testarCalcularEstacionamento();

  return 0;
}