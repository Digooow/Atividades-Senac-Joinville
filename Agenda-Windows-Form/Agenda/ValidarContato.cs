using System;
using System.Linq;
using System.Windows.Forms;

namespace Agenda
{
    internal class ValidarContato
    {
        public static bool Validar(Contato contato, out string mensagemErro)
        {
            mensagemErro = string.Empty;


            if (string.IsNullOrWhiteSpace(contato.Nome))
            {
                mensagemErro = "O campo Nome é obrigatório.";
                return false;
            }


            if (string.IsNullOrWhiteSpace(contato.Telefone))
            {
                mensagemErro = "O campo Telefone é obrigatório.";
                return false;
            }


            string apenasNumeros = new string(contato.Telefone.Where(char.IsDigit).ToArray());
            if (apenasNumeros.Length < 10)
            {
                mensagemErro = "Telefone inválido. Deve conter pelo menos 10 dígitos.";
                return false;
            }


            return true;
        }
    }
}