#include <iostream>
#include <windows.h>
#include <vector>
#include <string>
#include <numeric>
using namespace std;

int main() {
    SetConsoleOutputCP(CP_UTF8);

    vector<float> notas;
    string nota;


    while (true) {

    cout << "Digite a nota da atividade: ";
    cout << "(Digite 's' ou 'S' para sair)" << endl;
    cin >> nota;
    if (nota == "s" || nota == "S") {
        break;
    }
    float valorConvertido = stof(nota);
    
    if (valorConvertido >= 0 && valorConvertido <= 10) {
        notas.push_back(valorConvertido);
    } else {
        cout << "Nota inválida! Digite apenas valores entre 0 e 10." << endl;
    }


        cout << "Notas digitadas: " << endl;
        float soma = 0;
    for (size_t i = 0; i < notas.size(); i++) {
        cout << "Nota " << i + 1 << ": " << notas[i] << endl;
        soma += notas[i];
    }

    if (!notas.empty()) {
        float media = soma / notas.size();
        cout << "Média das notas: " << media << endl;
    } else {
        cout << "Nenhuma nota foi digitada." << endl;
    }
    
}
    return 0; 
}