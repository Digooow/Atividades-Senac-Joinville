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

void apresentacao () {
    cout << "=========================================" << endl;
    cout << "Bem vindos ao restaurante Sabor e Código!" << endl;
}

int menuPrincipal () {
    int opcao;
    cout << "\n1. Abrir mesa." << endl;
    cout << "2. Adicionar pedido." << endl;
    cout << "3. Fechar mesa." << endl;
    cout << "4. Sair." << endl;
    cout << "===Escolha uma opção.=== " << endl;
    cin >> opcao;
    return opcao;
}

void cadastroMesas() {
    int mesaEscolhida;

    cout << "\nMesas disponiveis no momento:" << endl;

    for (int i = 1; i <= 10; i++) {
        if (mesas[i] == false) {
            cout << "[ " << i << " ] ";
        }
    }
    cout << "\nDigite o número da mesa que deseja abrir: ";
    cin >> mesaEscolhida;

    if (mesaEscolhida >= 1 && mesaEscolhida <= 10) {
        if (mesas[mesaEscolhida] == false) {
            mesas[mesaEscolhida] = true;
            totalMesas[mesaEscolhida] = 0.0f;
            historicoMesas[mesaEscolhida].clear();
            cout << "Sucesso: Mesa " << mesaEscolhida << " foi aberta!" << endl;
        } else {
            cout << "Erro: A mesa " << mesaEscolhida << " já está ocupada!" << endl;
        }
    } else {
        cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10)." << endl;
    }
}

void adicionarPedido() {
    int mesaEscolhida;
    int itemEscolhido;
    bool temMesaAberta = false;

    cout << "\nMesas abertas no momento que podem receber pedidos: " << endl;
    for (int i = 1; i <= 10; i++) {
        if (mesas[i] == true) {
            cout << "[ " << i << " ] ";
            temMesaAberta = true;
        }
    }

    cout << endl;

    if (!temMesaAberta) {
        cout << "Erro: Não há nenhuma mesa aberta no momento!" << endl;
        return;
    }

    cout << "Digite o número da mesa para adicionar o pedido: ";
    cin >> mesaEscolhida;

    if (mesaEscolhida < 1 || mesaEscolhida > 10 || !mesas[mesaEscolhida]) {
        cout << "Erro: Mesa não está aberta ou é inválida!" << endl;
        return;
    }

    vector<string> produtos = {"Hambúrguer", "Pizza", "Refrigerante", "Suco", "Sobremesa"};
    vector<float> precos = {25.00, 40.00, 8.00, 7.00, 12.00};

    do {
        cout << "\n========== CARDÁPIO ==========" << endl;
        for (size_t i = 0; i < produtos.size(); i++) {
            cout << i + 1 << ". " << produtos[i] << " - R$ " << fixed << setprecision(2) << precos[i] << endl;
        }
        cout << "Digite 0 para voltar ao menu principal." << endl;

        cout << "Escolha o número do produto: ";
        cin >> itemEscolhido;

        if (itemEscolhido == 0) {
            break;
        }

        if (itemEscolhido >= 1 && itemEscolhido <= (int)produtos.size()) {
            int quantidade;
            cout << "Digite a quantidade desejada: ";
            cin >> quantidade;

            if (quantidade > 0) {
                float valorTotalPedido = precos[itemEscolhido - 1] * quantidade;
                totalMesas[mesaEscolhida] += valorTotalPedido;

                ItemPedido novoItem;
                novoItem.nome = produtos[itemEscolhido - 1];
                novoItem.qtd = quantidade;
                novoItem.subtotalItem = valorTotalPedido;
                historicoMesas[mesaEscolhida].push_back(novoItem);

                cout << " Sucesso: " << quantidade << "x " << produtos[itemEscolhido - 1] << " adicionado(s)!" << endl;
                cout << " Valor deste pedido: R$ " << fixed << setprecision(2) << valorTotalPedido << endl;
                cout << " Total acumulado da Mesa " << mesaEscolhida << ": R$" << totalMesas[mesaEscolhida] << endl;
                cout << "=========================" << endl;

                cout << "\nPressione ENTER para continuar comprando...";
                cin.ignore();
                cin.get();
            } else {
                cout << "Erro: Quantidade deve ser maior que zero!" << endl;
            }
        } else {
            cout << "Erro: Produto inválido!" << endl;
        }
    } while (itemEscolhido != 0);
}

void fecharMesa() {
    int mesaEscolhida;
    cout << "\nDigite o número da mesa que deseja fechar: ";
    cin >> mesaEscolhida;

    if (mesaEscolhida >= 1 && mesaEscolhida <= 10 && mesas[mesaEscolhida]) {
        cout << "\n ===========" << endl;
        cout << "Conta da Mesa " << mesaEscolhida << endl;
        cout << "==============" << endl;

        for (size_t i = 0; i < historicoMesas[mesaEscolhida].size(); i++) {
            cout << " " << historicoMesas[mesaEscolhida][i].qtd << "x "
                 << historicoMesas[mesaEscolhida][i].nome << " -> R$ "
                 << fixed << setprecision(2) << historicoMesas[mesaEscolhida][i].subtotalItem << endl;
        }

        cout << endl;
        cout << " Total à pagar: R$ " << fixed << setprecision(2) << totalMesas[mesaEscolhida] << endl;
        cout << endl;

        mesas[mesaEscolhida] = false;
        totalMesas[mesaEscolhida] = 0.0f;
        historicoMesas[mesaEscolhida].clear();
        cout << "Mesa " << mesaEscolhida << " encerrada com sucesso!" << endl;
    } else {
        cout << "Erro: Mesa não está ocupada ou número inválido!" << endl;
    }
}

int main () {
    SetConsoleOutputCP(CP_UTF8);
    int escolha;

    apresentacao();

    do {
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
                break;
            default:
                cout << "Opção inválida! Por favor, escolha uma opção entre 1 e 4." << endl;
        }
    } while (escolha != 4);

    cout << "Agradecemos a preferência!" << endl;

    return 0;
}