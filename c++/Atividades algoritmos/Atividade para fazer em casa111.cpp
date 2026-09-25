#include <iostream>
#include <windows.h>
#include <string>

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

        if (entrada == "n" || entrada == "N") {
            break;
        }

        try {
            int num = stoi(entrada);
            total += num;
            cout << "Subtotal: " << total << endl;
        } catch (...) {
            cout << "Entrada inválida! Digite um número ou 'n' para sair." << endl;
        }
    }

    cout << "\n--------------------------" << endl;
    cout << "Soma Final: " << total << endl;
    cout << "Programa encerrado. Até logo!" << endl;

    return 0;
}