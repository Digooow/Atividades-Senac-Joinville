#include <iostream>
#include <vector>
#include <string>
#include <windows.h>
using namespace std;

bool mesas[11] = {false};


void apresentacao (){
	cout << "=========================================" << endl;
	cout << "Bem vindos ao restaurante Sabor e Código!" << endl;
}

int menuPrincipal (){
	int opcao;
	cout << "\n1. Abrir mesa." << endl;
	cout << "2. Adicionar pedido." << endl;
	cout << "3. Fechar mesa." << endl;
	cout << "4. Sair." << endl;
	cout << "===Escolha uma opção.=== " << endl;
	cin >> opcao;
return opcao;
}

void cadastroMesas(){
	int mesaEscolhida;
	
	cout << "\nMesas disponiveis no momento:" << endl;
	
	for (int i = 1; i <= 10; i++){
		if (mesas[i] == false){
			cout << "[ " << i << " ] ";
		}
	}
	cout << "\nDigite o número da mesa que deseja abrir: ";
	cin >> mesaEscolhida;
	
	if (mesaEscolhida >= 1 && mesaEscolhida <= 10){
		if (mesas[mesaEscolhida] == false) {
			mesas[mesaEscolhida] = true;
			cout << "Sucesso: Mesa " << mesaEscolhida << " foi aberta!" << endl;
	} 	else {
			cout << "Erro: A mesa " << mesaEscolhida << " já está ocupada!" << endl;
	}
}	else {
		cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10)." << endl;
}
}

int main (){
	SetConsoleOutputCP(CP_UTF8);
	int escolha;
	
	apresentacao();
	do{	escolha = menuPrincipal();	
	}while(escolha != 4);
	cout << "Agradecemos à preferência!" << endl;
	
	switch (escolha) {
		case 1:
			cadastroMesas();
			break;
		case 2:
			cout << "Opção de adicionar pedido selecionada." << endl;
			break;
		case 3:
			cout << "Opção de fechar mesa selecionada." << endl;
			break;
		case 4:
			cout << "Saindo do sistema..." << endl;
			break;
		default:
			cout << "Opção inválida! Por favor, escolha uma opção entre 1 e 4." << endl;
	}
	
	
	
	
	
return 0;
}