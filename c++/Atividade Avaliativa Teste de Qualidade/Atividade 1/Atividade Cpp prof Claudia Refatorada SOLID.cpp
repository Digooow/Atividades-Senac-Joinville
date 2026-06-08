#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#ifdef _WIN32
#include <windows.h>
#endif

using namespace std;

class Produto
{
private:
  string nome;
  double preco;

public:
  Produto(const string &nome, double preco) : nome(nome), preco(preco) {}

  string getNome() const { return nome; }
  double getPreco() const { return preco; }
};

class ItemPedido
{
private:
  Produto produto;
  int quantidade;

public:
  ItemPedido(const Produto &produto, int quantidade)
      : produto(produto), quantidade(quantidade) {}

  void adicionarQuantidade(int quantidadeAdicionada)
  {
    quantidade += quantidadeAdicionada;
  }

  double getSubtotal() const
  {
    return produto.getPreco() * quantidade;
  }

  string getNomeProduto() const
  {
    return produto.getNome();
  }

  int getQuantidade() const
  {
    return quantidade;
  }
};

class CalculadoraDesconto
{
public:
  double calcular(double valor) const
  {

    if (valor >= 300.00)
      return valor * 0.10;
    if (valor >= 150.00)
      return valor * 0.05;
    return 0.0;
  }
};

class CalculadoraTaxaServico
{
public:
  double calcular(double valor) const
  {
    return valor * 0.10;
  }
};

class Mesa
{
private:
  int numero;
  bool aberta;
  vector<ItemPedido> pedidos;

public:
  Mesa(int numero)
      : numero(numero), aberta(false)
  {
  }

  int getNumero() const
  {
    return numero;
  }

  bool estaAberta() const
  {
    return aberta;
  }

  void abrir()
  {
    aberta = true;
    pedidos.clear();
  }

  void fechar()
  {
    aberta = false;
    pedidos.clear();
  }

  void adicionarItem(const Produto &produto, int quantidade)
  {
    for (auto &item : pedidos)
    {
      if (item.getNomeProduto() == produto.getNome())
      {
        item.adicionarQuantidade(quantidade);
        return;
      }
    }
    pedidos.emplace_back(produto, quantidade);
  }

  double calcularSubtotal() const
  {

    double total = 0.0;

    for (const auto &item : pedidos)
    {
      total += item.getSubtotal();
    }

    return total;
  }

  const vector<ItemPedido> &getPedidos() const
  {
    return pedidos;
  }
};

class ContaMesa
{
private:
  const Mesa &mesa;
  const CalculadoraDesconto calcDesconto;
  const CalculadoraTaxaServico calcTaxa;

public:

  ContaMesa(const Mesa &mesa) 
    : mesa(mesa), calcDesconto(), calcTaxa()
  {
  }

  void imprimirConta()
  {
    double subtotal = mesa.calcularSubtotal();
    double desconto = calcDesconto.calcular(subtotal);
    double parcial = subtotal - desconto;

    cout << "\n===== CONTA =====\n";

    for (const auto &item : mesa.getPedidos())
    {
      int quantidade = item.getQuantidade();
      double precoUnidade;

      if (quantidade > 0) {
        precoUnidade = item.getSubtotal() / quantidade;
      } else {
        precoUnidade = 0.0;
      } 
      

      cout << item.getQuantidade() << "x " 
           << item.getNomeProduto() 
           << " (R$ " << precoUnidade << ")"
           << " - R$ " <<item.getSubtotal() << "\n"; 
    }

    cout << "-----------------\n";
    cout << "Subtotal: R$ " << subtotal << "\n";
    cout << "Desconto: R$ " << desconto << "\n";

    double taxaServico = 0.0;
    char opcao;

    if (subtotal > 0)
    {
      do
      {
        cout << "Deseja pagar a taxa de serviço de 10%? (S/N): ";
        cin >> opcao;
      } while (opcao != 'S' && opcao != 's' && opcao != 'N' && opcao != 'n');

      if (opcao == 'S' || opcao == 's')
      {
        taxaServico = calcTaxa.calcular(parcial);
      }
    }

    double totalFinal = parcial + taxaServico;

    cout << "Taxa de Serviço: R$ " << taxaServico << "\n";
    cout << "Total a Pagar: R$ " << totalFinal << "\n";
    cout << "=================\n";
  }
};

class GerenciadorRestaurante
{
private:
  vector<Mesa> mesas;
  vector<Produto> cardapio;

  void limparBuffer()
  {
    cin.clear();
    cin.ignore(256, '\n');
  }

public:
  GerenciadorRestaurante()
  {
    for (int i = 1; i <= 10; i++)
    {
      mesas.emplace_back(i);
    }
    cardapio = {
        {"Hambúrguer", 25.00},
        {"Pizza", 40.00},
        {"Refrigerante", 8.00},
        {"Suco", 7.00},
        {"Sobremesa", 12.00}};
  }

  void apresentacao()
  {
    cout << "=========================================" << "\n";
    cout << " Bem-vindo ao Restaurante Sabor e Código!" << "\n";
    cout << "=========================================" << "\n";
  }

  int menuPrincipal()
  {
    int opcao;
    cout << "\n1. Abrir Mesa" << "\n";
    cout << "2. Adicionar Pedido" << "\n";
    cout << "3. Fechar Conta" << "\n";
    cout << "4. Consultar extrato." << "\n";
    cout << "5. Sair" << "\n";
    cout << "Escolha uma opção: ";
    cin >> opcao;

    if (cin.fail())
    {
      limparBuffer();
      return -1;
    }
    return opcao;
  }

  void cadastroMesas()
  {
    bool temMesaDisponivel = false;
    cout << "\nMesas disponíveis:" << "\n";
    for (int i = 1; i <= 10; i++)
    {
      if (!mesas[i - 1].estaAberta())
      {
        cout << "[ " << i << " ] ";
        temMesaDisponivel = true;
      }
    }
    cout << "\n";

    if (!temMesaDisponivel)
    {
      cout << "Todas as mesas estão ocupadas no momento!" << "\n";
      return;
    }
    cout << "\nDigite o número da mesa que deseja abrir: " << "\n";
    cout << "Para abrir todas as mesas digite 11." << "\n";
    cout << "Para voltar ao menu principal digite 0." << "\n";

    int mesaEscolhida;
    do
    {
      cin >> mesaEscolhida;

      if (cin.fail())
      {
        cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10)." << "\n";
        cout << "Digite 11 para abrir todas as mesas ou 0 para sair." << "\n";
        limparBuffer();
        continue;
      }

      if (mesaEscolhida == 0)
        break;

      if (mesaEscolhida == 11)
      {
        int contador = 0;
        for (int i = 1; i <= 10; i++)
        {
          if (!mesas[i - 1].estaAberta())
          {
            mesas[i - 1].abrir();
            contador++;
          }
        }
        cout << "Sucesso: Foram abertas " << contador << " mesas." << "\n";
        break;
      }

      if (mesaEscolhida >= 1 && mesaEscolhida <= 10)
      {
        if (!mesas[mesaEscolhida - 1].estaAberta())
        {
          mesas[mesaEscolhida - 1].abrir();
          cout << "Sucesso: Mesa " << mesaEscolhida << " foi aberta!" << "\n";
        }
        else
        {
          cout << "Erro: A mesa " << mesaEscolhida << " já está ocupada!" << "\n";
        }
      }
      else
      {
        cout << "Erro: Número de mesa inválido! (Escolha de 1 a 10)." << "\n";
        cout << "Digite 11 para abrir todas as mesas ou 0 para sair." << "\n";
      }
    } while (mesaEscolhida != 0);
  }

  void adicionarPedido()
  {
    int mesaEscolhida;
    bool temMesaAberta = false;

    cout << "\nMesas que podem receber pedidos:" << "\n";
    for (int i = 1; i <= 10; i++)
    {
      if (mesas[i - 1].estaAberta())
      {
        cout << "[ " << i << " ] ";
        temMesaAberta = true;
      }
    }
    cout << "\n";

    if (!temMesaAberta)
    {
      cout << "Erro: Não há nenhuma mesa disponível para receber pedidos!" << "\n";
      return;
    }

    cout << "Digite o número da mesa para adicionar o pedido: " << "\n";
    cin >> mesaEscolhida;

    if (cin.fail() || mesaEscolhida < 1 || mesaEscolhida > 10 || !mesas[mesaEscolhida - 1].estaAberta())
    {
      cout << "Erro: Mesa não está aberta ou é inválida!" << "\n";
      limparBuffer();
      return;
    }

    int itemEscolhido;
    do
    {
      cout << "\n================ Cardápio ================" << "\n";
      for (size_t i = 0; i < cardapio.size(); i++)
      {
        cout << i + 1 << ". " << cardapio[i].getNome() << " - R$ " << cardapio[i].getPreco() << "\n";
      }
      cout << "Digite 0 para voltar ao menu principal." << "\n";
      cout << "Escolha o número do produto: " << "\n";
      cin >> itemEscolhido;

      if (cin.fail())
      {
        cout << "Erro: Opção inválida!" << "\n";
        limparBuffer();
        continue;
      }

      if (itemEscolhido == 0)
        break;

      if (itemEscolhido >= 1 && itemEscolhido <= (int)cardapio.size())
      {
        int quantidade;
        cout << "Digite a quantidade desejada: " << "\n";
        cin >> quantidade;

        if (cin.fail() || quantidade <= 0)
        {
          cout << "Erro: Quantidade deve ser maior do que zero!" << "\n";
          limparBuffer();
          continue;
        }

        mesas[mesaEscolhida - 1].adicionarItem(cardapio[itemEscolhido - 1], quantidade);

        double valorTotalPedido = cardapio[itemEscolhido - 1].getPreco() * quantidade;
        cout << " Sucesso: " << quantidade << "x " << cardapio[itemEscolhido - 1].getNome() << " adicionado(s)!" << "\n";
        cout << " Valor desde pedido: R$ " << valorTotalPedido << "\n";
        cout << " Total da Mesa " << mesaEscolhida << ": R$ " << mesas[mesaEscolhida - 1].calcularSubtotal() << "\n";
        cout << "-----------------------------------------\n";
      }
      else
      {
        cout << "Erro: Opção de produto inválida!\n";
      }
    } while (itemEscolhido != 0);
  }

  void fecharMesa()
  {
    int mesaEscolhida;
    do
    {
      bool temMesaAberta = false;
      cout << "\nMesas abertas: \n";
      for (int i = 1; i <= 10; i++)
      {
        if (mesas[i - 1].estaAberta())
        {
          cout << "[ " << i << " ] ";
          temMesaAberta = true;
        }
      }
      cout << "\n";

      if (!temMesaAberta)
      {
        cout << "Erro: Nenhuma mesa está aberta.\n";
        return;
      }

      cout << "\nDigite o número da mesa que deseja fechar: \n";
      cout << "Para fechar todas digite 11, para sair digite 0.\n";
      cin >> mesaEscolhida;

      if (cin.fail())
      {
        cout << "Erro: Comando inválido!\n";
        limparBuffer();
        return;
      }

      if (mesaEscolhida == 0)
        break;

      if (mesaEscolhida == 11)
      {
        cout << "\nFechando todas as mesas ocupadas. \n";
        for (int i = 1; i <= 10; i++)
        {
          if (mesas[i - 1].estaAberta())
          {
            ContaMesa conta(mesas[i - 1]);
            conta.imprimirConta();
            mesas[i - 1].fechar();
          }
        }
        break;
      }

      if (mesaEscolhida >= 1 && mesaEscolhida <= 10 && mesas[mesaEscolhida - 1].estaAberta())
      {
        ContaMesa conta(mesas[mesaEscolhida - 1]);
        conta.imprimirConta();
        mesas[mesaEscolhida - 1].fechar();
      }
      else
      {
        cout << "Erro: Mesa não está ocupada ou o número é inválido!\n";
      }
    } while (mesaEscolhida != 0);
  }

  void consultarMesa()
  {
    cout << "\n ========================\n";
    cout << " Painel geral de consumo\n";
    cout << " ========================\n";

    double faturamentoParcialTotal = 0.0;

    CalculadoraDesconto calcDesconto;

    for (int i = 1; i <= 10; i++)
    {
      cout << " Mesa " << setw(2) << setfill('0') << i << setfill(' ') << " : ";

      if (!mesas[i - 1].estaAberta())
      {
        cout << "[ Livre ]\n";
      }
      else
      {
        double subtotal = mesas[i - 1].calcularSubtotal();

        double desconto = calcDesconto.calcular(subtotal);
        double parcial = subtotal - desconto;
        faturamentoParcialTotal += parcial;

        cout << "[ Ocupada ] - Total: R$ " << parcial;
        if (desconto > 0.0)
        {
          cout << " (Desconto aplicado: R$ " << desconto << ")";
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

int main()
{

#ifdef _WIN32
  SetConsoleOutputCP(CP_UTF8);
#endif

  cout << fixed << setprecision(2);
  GerenciadorRestaurante restaurante;
  restaurante.apresentacao();

  int escolha;
  do
  {
    escolha = restaurante.menuPrincipal();
    switch (escolha)
    {
    case 1:
      restaurante.cadastroMesas();
      break;
    case 2:
      restaurante.adicionarPedido();
      break;
    case 3:
      restaurante.fecharMesa();
      break;
    case 4:
      restaurante.consultarMesa();
      break;
    case 5:
      break;
    default:
      cout << "Opção inválida! Por favor, escolha uma opção entre 1 e 5.\n";
    }
  } while (escolha != 5);

  cout << "Agradecemos por utilizar o sistema do Restaurante Sabor e Código. Até a próxima!\n";
  return 0;
}
