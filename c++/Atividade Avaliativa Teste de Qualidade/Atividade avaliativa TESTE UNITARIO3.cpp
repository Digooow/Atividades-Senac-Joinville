#include <iostream>
#include <cassert>

using namespace std;

double calcularEstacionamento(int horas) {

  if (horas <= 0) {
    return 0;
  }

  if (horas <= 1) {
    return 5;
  }

  if (horas <= 3) {
    return 10;
  }

  return 15;

}

void testarCalcularEstacionamento() {
  
  assert(calcularEstacionamento(-1) == 0);
  assert(calcularEstacionamento(0) == 0);
  assert(calcularEstacionamento(1) == 5);
  assert(calcularEstacionamento(3) == 10);
  assert(calcularEstacionamento(4) == 15);

  cout << "Todos os testes passaram!" << endl;
}

int main() {

  testarCalcularEstacionamento();

  return 0;
}