#include <iostream>
#include <string>
#include <cassert>
using namespace std;

bool senhaValida(string senha){
	
	if(senha.length() < 8){
		return false;
	}
	
	bool possuiNumero = false;
	
	for (char c : senha){
		if (isdigit(c)){
			possuiNumero = true;
		}
	}
	return possuiNumero;
}

void testarSenhaValida(){
	
	assert(senhaValida("abc1") == false);
	assert(senhaValida("abcefgh") == false);
	assert(senhaValida("abc12345") == true);
	assert(senhaValida("abc1234d") == true);
	assert(senhaValida("12345678") == true);
	assert(senhaValida("12345678") == true);
	
	cout << "Todos os testes passaram!" << endl;
}

int main(){
	
	testarSenhaValida();
	
	return 0;
}