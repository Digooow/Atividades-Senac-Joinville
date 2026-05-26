#include <iostream>
#include <windows.h>
#include <vector>
#include <iomanip>
using namespace std;

int main() {
SetConsoleOutputCP(CP_UTF8);
cout << fixed << setprecision(2);

float precoPao = 1.20;
float precoSonho = 2.89;
float precoCafe = 4.29;



vector<float> precos = {precoPao, precoSonho, precoCafe};
vector<string> produtos = {"Pão francês", "Sonho", "Café"};

cout << "Bem vindos a nossa padaria!" << endl;
    cout << "Temos em nossas opções: " << endl;
    cout << "1 - " << produtos[0] << " - R$ " << precos[0] << endl;
    cout << "2 - " << produtos[1] << " - R$ " << precos[1] << endl;
    cout << "3 - " << produtos[2] << " - R$ " << precos[2] << endl;

    int opcao;
    int quantidade;
    float totalGeral = 0.0;
    char continuar = 's';


    while (continuar == 's' || continuar == 'S') {
    cout << "\nDigite o número do produto que você deseja comprar: ";
    cin >> opcao;

    if (opcao >= 1 && opcao <= 3) {
        cout << "Quantas unidades você deseja comprar de: " << produtos[opcao - 1] << "?" << endl;
        cin >> quantidade;

        float precoTotal = precos[opcao - 1] * quantidade;
        totalGeral += precoTotal;
        
        cout << "Deseja comprar mais algum produto? (s/n): ";
        cin >> continuar;
    }
    else {
        cout << "Opção inválida. Por favor, escolha um número entre 1 e 3." << endl;
    }
    }

    cout << "O total da compra é: R$ " << totalGeral << endl;

    cout << "Digite o valor que você irá pagar: R$ ";
    float valorPago;
    cin >> valorPago;

    if (valorPago >= totalGeral) {
        float troco = valorPago - totalGeral;
        cout << "Compra realizada com sucesso! Seu troco é: R$ " << troco << endl;  
    }
    else {
        float falta = totalGeral - valorPago;
        cout << "Valor insuficiente para realizar a compra. Faltam R$ " << falta << endl;
    }
    return 0;
}