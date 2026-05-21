#include <iostream>
#include <windows.h>
#include <string> // Necessário para manipular a entrada como texto

using namespace std;

int main() {
    SetConsoleOutputCP(CP_UTF8);
    
    string entrada;
    int total = 0;

    cout << "--- Somador Contínuo ---" << endl;
    cout << "Digite os números (ou 'n' para encerrar e ver o total):" << endl;

    while (true) {
        cout << "> ";
        cin >> entrada;

        // Verifica se o usuário quer sair
        if (entrada == "n" || entrada == "N") {
            break;
        }

        try {
            // Tenta converter o texto para número inteiro
            int num = stoi(entrada);
            total += num;
            cout << "Subtotal: " << total << endl;
        } catch (...) {
            // Se o usuário digitar qualquer outra letra que não seja 'n'
            cout << "Entrada inválida! Digite um número ou 'n' para sair." << endl;
        }
    }

    cout << "\n--------------------------" << endl;
    cout << "Soma Final: " << total << endl;
    cout << "Programa encerrado. Até logo!" << endl;

    return 0;
}