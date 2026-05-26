#include <iostream>

using namespace std;

int main() {
float num1, tabuada;

cout << "Digite um numero para ver a tabuada: ";
cin >> num1;
for (int i = 1; i <= 10; i++) {
    tabuada = num1 * i;
    cout << num1 << " x " << i << " = " << tabuada << endl;
}


    return 0;
}