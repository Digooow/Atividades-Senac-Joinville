#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#ifdef _WIN32
#include <windows.h>
#endif

using namespace std;

struct ItemPedido {
    string nome;
    int quantidade;
    double subtotalItem;
};

struct Produto {
  string nome;
  double preco;
};

class Mesa {
  private:
    int numero;
    bool aberta = false;
    vector<ItemPedido> historico;
    double totalAcumulado = 0.0;

  public:
    Mesa(int num) : numero(num) {}

    bool estaAberta() const { return aberta; }
    double getTotalAcumulado() const { return totalAcumulado; }

    void abrir() {
      aberta = true;
      totalAcumulado = 0.0;
      historico.clear();
    }

    void limparDados() {
      aberta = false;
      totalAcumulado = 0.0;
      historico.clear();
    }

    double calcularDesconto() const {
      if (totalAcumulado >= 300.00) return totalAcumulado * 0.10;
      if (totalAcumulado >= 150.00) return totalAcumulado * 0.05;
      return 0.0;
    }

    double calcularTotalComDesconto() const {
      return totalAcumulado - calcularDesconto();
    }

    void adicionarItem(const Produto& prod, int quantidade) {
      double valorPedido = prod.preco * quantidade;
      totalAcumulado += valorPedido;

      for (auto& item : historico) {
        if (item.nome == prod.nome) {
          item.quantidade += quantidade;
          item.subtotalItem += valorPedido;
          return;
        }
      }
      historico.push_back({prod.nome, quantidade, valorPedido});
    }
    

  void processarContaMesa(){
 
      
    cout << "\n===================\n"
        << " Conta da Mesa " << numero << "\n"
        << "===================\n";

    if (historico.empty()) {
      cout << " Nenhum pedido foi realizado nesta mesa.\n";
    } else {
      for (const auto& item : historico) {
        cout << " " << item.quantidade << "x " << item.nome 
        << " - Subtotal: R$ " << item.subtotalItem << "\n";
      }
    }

    double subtotalOriginal = totalAcumulado;
    double valorDesconto = calcularDesconto();
    double subtotalComDesconto = calcularTotalComDesconto();

    cout << " -------------------" << "\n";
    cout << " Subtotal: R$ " << subtotalOriginal << "\n";

    if (valorDesconto > 0.0) {
      cout << " Desconto aplicado: -R$ " << valorDesconto << "\n";
      cout << " Subtotal com desconto: R$ " << subtotalComDesconto << "\n";
    }

    double taxaServico = 0.0;
    char pagarTaxa;

   
if (subtotalOriginal > 0) {
    do {
        cout << "Deseja pagar a taxa de serviço de 10%? (s/n): ";
        cin >> pagarTaxa;

        if (cin.fail()) {
            cin.clear();
            cin.ignore(256, '\n');
        }

    } while (pagarTaxa != 's' && pagarTaxa != 'S' &&
             pagarTaxa != 'n' && pagarTaxa != 'N');

    if (pagarTaxa == 's' || pagarTaxa == 'S') {
        taxaServico = subtotalComDesconto * 0.10;
        cout << "Taxa de serviço (10%): R$ "
             << taxaServico << "\n";
    }
}


    double totalFinal = subtotalComDesconto + taxaServico;
    cout << "--------------------" << "\n";
    cout << "Total a pagar: R$ " << totalFinal << "\n";
    cout << "====================" << "\n";

    limparDados();
    cout << "Mesa " << numero << " fechada e pronta para novos pedidos." << "\n";
  }
};

class GerenciadorRestaurante {
  private:
    vector<Mesa> mesas;
    vector<Produto> cardapio;

    void limparBuffer() {
      cin.clear();
      cin.ignore(256, '\n');
    }
  
  public:
    GerenciadorRestaurante() {
      for (int i = 1; i <= 10; i++) {
        mesas.push_back(Mesa(i));
      }
      cardapio = {
        {"Hambúguer", 25.00},
        {"Pizza", 40.00},
        {"Refrigerante", 8.00},
        {"Suco", 7.00},
        {"Sobremesa", 12.00}
      };
    }
    
    void apresentacao(){
      cout << "=========================================" << "\n";
      cout << " Bem-vindo ao Restaurante Sabor e Código!" << "\n";
      cout << "=========================================" << "\n";
    }

    int menuPrincipal() {
      int opcao;
      cout << "\n1. Abrir Mesa" << "\n";
      cout << "2. Adicionar Pedido" << "\n";
      cout << "3. Fechar Conta" << "\n";
      cout << "4. Consultar extrato." << "\n";
      cout << "5. Sair" << "\n";
      cout << "Escolha uma opção: ";
      cin >> opcao;
    
      if (cin.fail()) {
        limparBuffer();
        return -1;
      }
      return opcao;
    }
    
    void cadastroMesas() {
      bool temMesaDisponivel = false;
      cout << "\nMesas disponíveis:" << "\n";
      for (int i = 1; i <= 10; i++) {
        if (!mesas[i - 1].estaAberta()) {
          cout << "[ " << i << " ] ";
          temMesaDisponivel = true;
        }
      }
      cout << "\n";

      if (!temMesaDisponivel) {
        cout << "Todas as mesas estão ocupadas no momento!" << "\n";
        return;
      }
      cout << "\nDigite o número da mesa que deseja abrir: " << "\n";
      cout << "Para abrir todas as mesas digite 11." << "\n";
      cout << "Para voltar ao menu principal digite 0." << "\n";

      int mesaEscolhida;
      do {
        cin >> mesaEscolhida;

        if (cin.fail()) {
          cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10)." << "\n";
          cout << "Digite 11 para abrir todas as mesas ou 0 para sair." << "\n";
          limparBuffer();
          continue;
        }

        if (mesaEscolhida == 0) break;

        if (mesaEscolhida == 11) {
          int contador = 0;
          for (int i = 1; i <= 10; i++) {
            if (!mesas[i - 1].estaAberta()) {
              mesas[i - 1].abrir();
              contador++;
            }
          }
          cout << "Sucesso: Foram abertas " << contador << " mesas." << "\n";
          break;
        }

        if (mesaEscolhida >= 1 && mesaEscolhida <= 10) {
          if (!mesas[mesaEscolhida - 1].estaAberta()) {
            mesas[mesaEscolhida - 1].abrir();
            cout << "Sucesso: Mesa " << mesaEscolhida << " foi aberta!" << "\n";
          } else {
            cout << "Erro: A mesa " << mesaEscolhida << " já está ocupada!" << "\n";
          }
        } else {
          cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10)." << "\n";
          cout << "Digite 11 para abrir todas as mesas ou 0 para sair." << "\n";
        }
      } while (mesaEscolhida != 0);
    }

    void adicionarPedido() {
      int mesaEscolhida;
      bool temMesaAberta = false;

      cout << "\nMesas que podem receber pedidos:" << "\n";
      for (int i = 1; i <= 10; i++) {
        if (mesas[i - 1].estaAberta()) {
          cout << "[ " << i << " ] ";
          temMesaAberta = true;
        }
      }
      cout << "\n";

      if (!temMesaAberta) {
        cout << "Erro: Não há nenhuma mesa disponível para receber pedidos!" << "\n";
        return;
      }

      cout << "Digite o número da mesa para adicionar o pedido: " << "\n";
      cin >> mesaEscolhida;

      if (cin.fail() || mesaEscolhida < 1 || mesaEscolhida > 10 || !mesas[mesaEscolhida - 1].estaAberta()) {
        cout << "Erro: Mesa não está aberta ou é inválida!" << "\n";
        limparBuffer();
        return;
      }

      int itemEscolhido;
      do {
        cout << "\n================ Cardápio ================" << "\n";
        for (size_t i = 0; i < cardapio.size(); i++) {
          cout << i + 1 << ". " << cardapio[i].nome << " - R$ " << cardapio[i].preco << "\n";
        }
        cout << "Digite 0 para voltar ao menu principal." << "\n";
        cout << "Escolha o número do produto: " << "\n";
        cin >> itemEscolhido;

        if (cin.fail()) {
          cout << "Erro: Opção inválida!" << "\n";
          limparBuffer();
          continue;
        }

        if (itemEscolhido == 0) break;

        if (itemEscolhido >= 1 && itemEscolhido <= (int)cardapio.size()) {
          int quantidade;
          cout << "Digite a quantidade desejada: " << "\n";
          cin >> quantidade;

          if (cin.fail() || quantidade <= 0) {
            cout << "Erro: Quantidade deve ser maior do que zero!" << "\n";
            limparBuffer();
            continue;
          }

          mesas[mesaEscolhida - 1].adicionarItem(cardapio[itemEscolhido - 1], quantidade);

          double valorTotalPedido = cardapio[itemEscolhido -1].preco * quantidade;
          cout << " Sucesso: " << quantidade << "x " << cardapio[itemEscolhido - 1].nome << " adicionado(s)!" << "\n";
          cout << " Valor desde pedido: R$ " << valorTotalPedido << "\n";
          cout << " Total da Mesa " << mesaEscolhida << ": R$ " << mesas[mesaEscolhida - 1].getTotalAcumulado() << "\n";
          cout << "-----------------------------------------\n";
        }else {
          cout << "Erro: Opção de produto inválida!\n";
        }
      } while (itemEscolhido != 0);
    }

    void fecharMesa() {
      int mesaEscolhida;
      do {
        bool temMesaAberta = false;
        cout << "\nMesas abertas: \n";
        for (int i = 1; i <= 10; i++) {
          if (mesas[i - 1].estaAberta()) {
            cout << "[ " << i << " ] ";
            temMesaAberta = true;
          }
        }
        cout << "\n";

        if (!temMesaAberta) {
          cout << "Erro: Nenhuma mesa está aberta.\n";
          return;
        }

        cout << "\nDigite o número da mesa que deseja fechar: \n";
        cout << "Para fechar todas digite 11, para sair digite 0.\n";
        cin >> mesaEscolhida;

        if (cin.fail()) {
          cout << "Erro: Comando inválido!\n";
          limparBuffer();
          return;
        }

        if (mesaEscolhida == 0) break;

        if (mesaEscolhida == 11) {
          cout << "\nFechando todas as mesas ocupadas. \n";
          for (int i = 1; i <= 10; i++) {
            if (mesas[i - 1].estaAberta()) {
              mesas[i - 1].processarContaMesa();
            }
          }
          break;
        }

        if (mesaEscolhida >= 1 && mesaEscolhida <= 10 && mesas[mesaEscolhida - 1].estaAberta()) {
            mesas[mesaEscolhida - 1].processarContaMesa();
        } else {
          cout << "Erro: Mesa não está ocupada ou o número é inválido!\n";
        }
      } while (mesaEscolhida != 0);
    }

    void consultarMesa() {
      cout << "\n ========================\n";
      cout << " Painel geral de consumo\n";
      cout << " ========================\n";

      double faturamentoParcialTotal = 0.0;

      for (int i = 1; i <= 10; i++) {
        cout << " Mesa " << setw(2) << setfill('0') << i << setfill(' ') <<  " : ";
      
        if (!mesas[i - 1].estaAberta()) {
          cout << "[ Livre ]\n";
        } else {
          double valorDesconto = mesas[i - 1].calcularDesconto();
          double parcialComDesconto = mesas[i - 1].calcularTotalComDesconto();
          faturamentoParcialTotal += parcialComDesconto;

          cout << "[ Ocupada ] - Total: R$ " << parcialComDesconto;
          if (valorDesconto > 0.0) {
            cout << " (Desconto aplicado: R$ " << valorDesconto << ")";
          }
          cout << "\n";
      }
    }

    cout << "---------------------------\n";
    cout << " Total ativo em mesas R$ " << faturamentoParcialTotal << "\n";
    cout << "---------------------------\n";
    cout << "Valores parciais sem taxa de serviço.\n";
  }
};

int main() {
  
#ifdef _WIN32
SetConsoleOutputCP(CP_UTF8);
#endif

  cout << fixed << setprecision(2);
  GerenciadorRestaurante restaurante;
  restaurante.apresentacao();

  int escolha;
  do {
    escolha = restaurante.menuPrincipal();
    switch (escolha) {
      case 1: restaurante.cadastroMesas(); break;
      case 2: restaurante.adicionarPedido(); break;
      case 3: restaurante.fecharMesa(); break;
      case 4: restaurante.consultarMesa(); break;
      case 5: break;
      default: cout << "Opção inválida! Por favor, escolha uma opção entre 1 e 5.\n";
    }
  } while (escolha != 5);

  cout << "Agradecemos por utilizar o sistema do Restaurante Sabor e Código. Até a próxima!\n";
  return 0;
}
  

