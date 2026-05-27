#include <iostream>
#include <string>
#include <cassert>
#include <cctype>
using namespace std;

bool senhaValida(string senha){
	
	if(senha.length() < 8){
		return false;
	}
	
	bool possuiNumero = false;
	bool temLetraMaiuscula = false;
	bool temCaractereEspecial = false;
	bool temEspaco = false;
	
	for (char c : senha){
		if (isdigit(c)){
			possuiNumero = true;
		}
		if (isupper(c)) {
			temLetraMaiuscula = true;
		}	
		if (!isalnum(c)) {
			temCaractereEspecial = true;
		}
		if (isspace(c)) {
			temEspaco = true;
		}
	}
	return possuiNumero && temLetraMaiuscula && temCaractereEspecial && !temEspaco;

}

void testarSenhaValida(){
	
	assert(senhaValida("abc1") == false);
	assert(senhaValida("abcefgh") == false);
	assert(senhaValida("abc12345") == false);
	assert(senhaValida("abc1234d") == false);
	assert(senhaValida("12345678") == false);
	assert(senhaValida("Abce1234") == false);
	assert(senhaValida("Abce123 ") == false);
	assert(senhaValida("Abce123!") == true);
	
	cout << "Todos os testes passaram!" << endl;
}

int main(){
	
	testarSenhaValida();
	
	return 0;
}