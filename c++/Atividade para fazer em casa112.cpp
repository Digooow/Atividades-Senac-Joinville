#include <iostream>
#include <string>

using namespace std;

int main() {
    string senha;

    do {
        cout << "Digite a senha: ";
        cin >> senha;

        if (senha != "2024") {
            cout << "Senha incorreta. Tente novamente." << endl;
        }
    } while (senha != "2024");

    cout << "Senha correta. Acesso concedido!" << endl;


    
    return 0;
}
