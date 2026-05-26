#include <iostream>
#include <cassert>
using namespace std;

double calcularDesconto(double valorCompra){
	if (valorCompra < 100){
		return 0;	
	} else if (valorCompra < 500){
	return valorCompra * 0.10;	
} else {
	return valorCompra * 0.20;
}
}


void testarCalcularDesconto(){
	assert(calcularDesconto(50) == 0);
	assert(calcularDesconto(100) == 10);
	assert(calcularDesconto(200) == 20);
	assert(calcularDesconto(500) == 100);
	assert(calcularDesconto(1000) == 200);
	
	cout << "Todos os testes passaram com sucesso!" << endl;
	
}

int main(){
	testarCalcularDesconto();
	
	return 0;
}