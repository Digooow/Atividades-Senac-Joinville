#include <iostream>
#include <vector>
#include <iomanip>

using namespace std;

int main() {
    int qtdNotas;
    cout << "Quantas notas deseja inserir? ";
    cin >> qtdNotas;

    vector<float> notas(qtdNotas);
    float soma = 0;

    for (int i = 0; i < qtdNotas; i++) {
        cout << "Digite a nota " << i + 1 << ": ";
        cin >> notas[i];
        soma += notas[i];
    }

    float media = soma / qtdNotas;

    cout << fixed << setprecision(2);
    cout << "\nA média final é: " << media << endl;

    if (media >= 7.0) {
        cout << "Status: Aprovado!" << endl;
    } else {
        cout << "Status: Reprovado." << endl;
    }

    return 0;
}