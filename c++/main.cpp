#include <iostream>
#include <string>

using namespace std;


int main() {
    cout << "Olá! Este é um programa C++ básico." << endl;
    cout << "Digite seu nome: ";

    string nome;
    getline(cin, nome);

    cout << "Olá, " << nome << "!" << endl;
    cout << "Vamos somar dois números." << endl;

    int a, b;
    cout << "Digite o primeiro número: ";
    cin >> a;
    cout << "Digite o segundo número: ";
    cin >> b;

    cout << "Resultado: " << a << " + " << b << " = " << (a + b) << endl;
    return 0;
}
