#include <iostream>
#include <vector>
#include <string>

using namespace std;

string menuPrincipal(){
  string opcao;
  cout << "\n=========== SABOR & CODIGO ===========" << endl;
  cout << "1. Abrir mesa." << endl;
  cout << "2. Adicionar pedido." << endl;
  cout << "3. Fechar conta." << endl;
  cout << "4. Sair." << endl;
  cout << "Escolha uma opção: ";
  cin >> opcao;
  return opcao;
}

void cardapio(){
  vector<string> itensCardapio = {"1. Pizza", "2. Hambúrguer", "3. Salada", "4. Refrigerante", "5. Sobremesa"};
  vector<double> precos = {40.00, 25.00, 12.00, 5.99, 8.99};
  cout << "Cardápio:" << endl;
  for (size_t i = 0; i < itensCardapio.size(); ++i) {
    cout << i + 1 << ". " << itensCardapio[i] << " - R$ " << precos[i] << endl;
  }
}

void abrirMesa(bool mesaOcupada[11]){
  int numeroMesa;
  cout << "Digite o número da mesa (1 a 10): ";
  cin >> numeroMesa;

  if (numeroMesa < 1 || numeroMesa > 10) {
    cout << "Número de mesa inválido. Por favor, escolha entre 1 e 10." << endl;
    return;
  }  
  else if (mesaOcupada[numeroMesa]) {
    cout << "Mesa " << numeroMesa << " já está ocupada." << endl;
  } else {
    mesaOcupada[numeroMesa] = true;
    cout << "Mesa " << numeroMesa << " agora está ocupada." << endl;
  }

}

int main(){
  bool mesaOcupada[11] = {false};
  string opcao;

  cout << "Bem-vindo ao Sabor & Código!" << endl;

  do {
    opcao = menuPrincipal();

    if (opcao == "1") {
      abrirMesa(mesaOcupada);
    } else if (opcao == "2") {
      cardapio();
    } else if (opcao == "3") {
      cout << "Fechando conta..." << endl;
    } else if (opcao == "4") {
      cout << "Saindo do sistema. Obrigado por visitar o Sabor & Código!" << endl;
    } else {
      cout << "Opção inválida. Por favor, escolha uma opção válida." << endl;
    }
  } while (opcao != "4");


  return 0;
}