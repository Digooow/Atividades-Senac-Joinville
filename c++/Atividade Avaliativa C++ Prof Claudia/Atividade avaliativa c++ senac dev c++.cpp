#include <iostream>
#include <vector>
#include <string>
#include <windows.h>
#include <iomanip>
using namespace std;

struct ItemPedido {
		string nome;
		int qtd;
		float subtotalItem;
};

vector<vector<ItemPedido>> historicoMesas(11);
bool mesas[11] = {false};
float totalMesas[11] = {0.0f};

void limparBuffer(){
	cin.clear();
	cin.ignore(256, '\n');
}

void apresentacao (){
	cout << "=========================================" << endl;
	cout << "Bem vindos ao restaurante Sabor e Código!" << endl;
}

int menuPrincipal (){
	int opcao;
	cout << "\n1. Abrir mesa." << endl;
	cout << "2. Adicionar pedido." << endl;
	cout << "3. Fechar mesa." << endl;
	cout << "4. Consultar extrato. " << endl;
	cout << "5. Sair." << endl;
	cout << "===Escolha uma opção.=== " << endl;
	cin >> opcao;
	
	if (cin.fail()){
		limparBuffer();
		return -1;
	}
	
return opcao;
}

void cadastroMesas(){
	int mesaEscolhida;
	
		bool temMesaDisponivel = false;
		cout << "\nMesas disponiveis no momento:" << endl;
		for (int i = 1; i <= 10; i++){
			if (!mesas[i]){
				cout << "[ " << i << " ] ";
				temMesaDisponivel = true;
			}
		}
		cout << endl;
		
		if (!temMesaDisponivel){
			cout << "Todas as mesas estão ocupadas no momento!" << endl;
			return;
		}
		cout << "\nDigite o número da mesa que deseja abrir: " << endl;
		cout << "Ou digite 11 para abrir todas as mesas." << endl;
		cout << "Para voltar ao menu principal, digite 0." << endl;
		
	do {
	
		
		cin >> mesaEscolhida;
		
		if (cin.fail()){
			cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10)." << endl;
			cout << "Digite 11 para abrir todas as mesas disponíveis e 0 para sair." << endl;
			limparBuffer();
			continue;
		}
		
		if (mesaEscolhida == 0 ){
			break;
		}
		
		if (mesaEscolhida == 11) {
			int contador = 0;
			for (int i = 1; i <= 10; i++){
				if (!mesas[i]){
					mesas[i] = true;
					totalMesas[i] = 0.0f;
					historicoMesas[i].clear();
					contador++;
				}
			}
			cout << "Sucesso: Foram abertas " << contador << " mesas." << endl;
			break;
		}
		
		if (mesaEscolhida >= 1 && mesaEscolhida <= 10){
			if(!mesas[mesaEscolhida]){
				mesas[mesaEscolhida] = true;
				totalMesas[mesaEscolhida] = 0.0f;
				historicoMesas[mesaEscolhida].clear();
				cout << "Sucesso: Mesa " << mesaEscolhida << " foi aberta!" << endl;
			} else {
				cout << "Erro: A mesa " << mesaEscolhida << " já está ocupada!" << endl;
			}
		} else {
			cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10, 11 para TODAS e 0 para sair)." << endl;
		}
} while (mesaEscolhida !=0);
}

void adicionarPedido(){
	
	int mesaEscolhida;
	int itemEscolhido;
	bool temMesaAberta = false;
	
	cout << "\nMesas abertas no momento que podem receber pedidos: " << endl;
	for (int i = 1; i <= 10; i++){
		if (mesas[i] == true){
			cout << "[ " << i << " ] ";
			temMesaAberta = true;
		}
	}
	
	cout << endl;
	
	if (!temMesaAberta){
		cout << "Erro: Não há nenhuma mesa aberta no momento!" << endl;
		return;
	}
	
	cout << "Digite o número da mesa para adicionar o pedido: " << endl;
	cin >> mesaEscolhida;
	
	if (cin.fail() || mesaEscolhida < 1 || mesaEscolhida > 10 || !mesas[mesaEscolhida]){
		cout << "Erro: Mesa não está aberta ou é inválida!" << endl;
		limparBuffer();
		return;
	}
	
	vector<string> produtos = {"Hambúrguer", "Pizza", "Refrigerante", "Suco", "Sobremesa"};
	vector<float> precos = {25.00, 40.00, 8.00, 7.00, 12.00};


		
	do{
		
		cout << "\n========== CARDÁPIO ==========" << endl;
		for (size_t i = 0; i < produtos.size(); i++){
			cout << i + 1 << ". " << produtos[i] << " - R$ " << fixed << setprecision(2) << precos[i] << endl;
		}
		cout << "Digite 0 para voltar ao menu principal." << endl;
		
		cout << "Escolha o número do produto: " << endl;
		cin >> itemEscolhido;
		
		if (cin.fail()){
			cout << "Erro: Entrada inválida!" << endl;
			limparBuffer();
			continue;
		}
		
		if (itemEscolhido == 0){
			break;
		}
		
		if (itemEscolhido >= 1 && itemEscolhido <= (int)produtos.size()){
			int quantidade;
			cout << "Digite à quantidade desejada: " << endl;
			cin >> quantidade;
			
			if (cin.fail () || quantidade <= 0){
				cout << "Erro: Quantidade deve ser um número maior que zero!" << endl;
				limparBuffer();
				continue;
			}
			
			float valorTotalPedido = precos[itemEscolhido - 1] * quantidade;
			totalMesas[mesaEscolhida] += valorTotalPedido;
			
			bool itemJaExiste = false;
			for (size_t i = 0; i < historicoMesas[mesaEscolhida].size(); i++){
				if (historicoMesas[mesaEscolhida][i].nome == produtos[itemEscolhido - 1]){
					historicoMesas[mesaEscolhida][i].qtd += quantidade;
					historicoMesas[mesaEscolhida][i].subtotalItem += valorTotalPedido;
					itemJaExiste = true;
					break;
				}
			}
			
			if (!itemJaExiste){
				ItemPedido novoItem;
				novoItem.nome = produtos[itemEscolhido - 1];
				novoItem.qtd = quantidade;
				novoItem.subtotalItem = valorTotalPedido;
				historicoMesas[mesaEscolhida].push_back(novoItem);
			}
			
			cout << " Sucesso: " << quantidade << "x " << produtos[itemEscolhido - 1] << " adicionado(s)!" << endl;
			cout << " Valor desde pedido: R$ " << fixed << setprecision(2) << valorTotalPedido << endl;
			cout << " Total acumulado da Mesa " << mesaEscolhida << ": R$ " << totalMesas[mesaEscolhida] << endl;
			cout << "=========================" << endl;
					
		}else {
			cout << "Erro: Produto inválido!" << endl;
		}
	}while (itemEscolhido !=0);
}

void processarContaMesa(int m) {
	cout << "\n =====================" << endl;
	cout << " 	conta da Mesa	" << m << endl;
	cout << "========================" << endl;
	
	if (historicoMesas[m].empty()) {
		cout << " Nenhum pedido foi realizado nesta mesa." << endl;
	}else{
		for (size_t i = 0; i < historicoMesas[m].size(); i++){
			cout << " " << historicoMesas[m][i].qtd << "x "
						<< historicoMesas[m][i].nome << " -> R$ "
						<< fixed << setprecision(2) << historicoMesas[m][i].subtotalItem << endl;
		}
	}
	
	float subtotalOriginal = totalMesas[m];
	float valorDesconto = 0.0f;
	
	if (subtotalOriginal > 300.00f) {
		valorDesconto = subtotalOriginal * 0.10f;
	} else if (subtotalOriginal > 150.00f) {
		valorDesconto = subtotalOriginal * 0.05f;
	}
	
	float subtotalComDesconto = subtotalOriginal - valorDesconto;
	
	cout << "====================" << endl;
	cout << " Subtotal dos itens: R$" << fixed << setprecision(2) << subtotalOriginal << endl;
	
	if (valorDesconto > 0.0f) {
		cout << " Desconto aplicado: -R$ " <<  valorDesconto << endl;
		cout << " Subtotal com desconto: R$ " << subtotalComDesconto << endl;
	}
	
	float taxaServico = 0.0f;
	char pagarTaxa;
	
	if (subtotalOriginal > 0) {
		cout << "Deseja pagar à taxa de serviço de 10%? (S/N): ";
		cin >> pagarTaxa;
		
		if (pagarTaxa == 'S' || pagarTaxa == 's'){
			taxaServico = subtotalComDesconto * 0.10f;
			cout << "Taxa de servicço (10%): R$ " << fixed << setprecision(2) << taxaServico << endl;
		} else if (pagarTaxa != 'N' && pagarTaxa != 'n'){
			cout << "Opção inválida. Taxa de serviço não será aplicada." << endl;
			limparBuffer();
		}
	}
	
	float totalFinal = subtotalComDesconto + taxaServico;
	cout << "--------------------" << endl;
	cout << "Total à pagar: R$ " << fixed << setprecision(2) << totalFinal << endl;
	cout << "====================" << endl;
	
	mesas[m] = false;
	totalMesas[m] = 0.0f;
	historicoMesas[m].clear();
	cout << "Mesa " << m << "encerrada com sucesso!" << endl;
}

void fecharMesa(){
	int mesaEscolhida;
	
	do{
		bool temMesaAberta = false;
		
		cout << "\nMesas abertas: " << endl;
		for (int i = 1; i <= 10; i++){
			if (mesas[i]){
				cout << "[ " << i << " ] ";
				temMesaAberta = true;
			}
		}
		cout<< endl;
		
		if (!temMesaAberta){
			cout << "Erro: Não há nenhuma mesa aberta." << endl;
			return;
		}
	
		cout << "\nDigite o número da mesa que deseja fechar: " << endl;
		cout << "Para fechar todas digite 11, para sair digite 0" << endl;
		cin >> mesaEscolhida;
		
		
		if (cin.fail()){
			cout << "Erro: Comando inválido!" << endl;
			limparBuffer();
			continue;
		}
		
		if (mesaEscolhida == 0){
			break;
		}
		
		if (mesaEscolhida == 11){
			cout << "\nFechando todas as mesas ocupadas..." << endl;
			for (int i = 1; i <= 10; i++){
				if (mesas[i]){
					processarContaMesa(i);
				}
			}
			break;
		}
		 
		if (mesaEscolhida >= 1 && mesaEscolhida <= 10 && mesas[mesaEscolhida]){
			processarContaMesa(mesaEscolhida);
		} else {
			cout << "Erro: Mesa não está ocupada ou número inválido!" << endl;
		}
		
	} while (mesaEscolhida != 0);
}

void consultarMesa(){
	cout << "\n===================================" << endl;
	cout << " Painel geral de consumo " << endl;
	cout << "=====================================" << endl;
	
	float faturamentoParcialTotal = 0.0f;
	
	for (int i = 1; i <= 10; i++){
		cout << " Mesa " << setfill('0') << setw(2) << i << " : ";
		cout << setfill(' ');
		
		if (!mesas[i]){
			cout << "[ Livre ]" << endl;
		}else {
			float atual = totalMesas[i];
			float desconto = 0.0f;
			
			if (atual > 300.00f) desconto = atual * 0.10f;
			else if (atual > 150.00f) desconto = atual * 0.05f;
			
			float parcialComDesconto = atual - desconto;
			faturamentoParcialTotal += parcialComDesconto;
			
			cout << "[ Ocupada ] - Consumo Atual: R$ " << fixed << setprecision(2) << parcialComDesconto;
			if (desconto > 0.0f) {
				cout << " (Desconto aplicado: R$ " << desconto << ")";
			}
			cout << endl;
		}
	}
	
	cout << "-------------------------------------" << endl;
	cout << " Total ativo em mesas R$ " << fixed << setprecision(2) << faturamentoParcialTotal << endl;
	cout << "=====================================" << endl;
	cout << "Valores parciais sem taxa de serviço." << endl;
}
	
int main (){
	SetConsoleOutputCP(CP_UTF8);
	int escolha;
	
	apresentacao();
	
	do{	
		escolha = menuPrincipal();
		
		switch (escolha) {
			
			case 1:
				cadastroMesas();
				break;
			case 2:
				adicionarPedido();
				break;
			case 3:
				fecharMesa();
				break; 
			case 4:
				consultarMesa();
				break;		
			case 5:
				break;
			default:
				cout << "Opção inválida! Por favor, escolha uma opção entre 1 e 4." << endl;
		}	
					
	}while(escolha != 5);
	
	cout << "Agradecemos à preferência!" << endl;	
	return 0;
}