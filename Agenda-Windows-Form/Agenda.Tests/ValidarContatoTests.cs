using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Agenda.Tests;

[TestClass]
public class ValidarContatoTests
{
    [TestMethod]
    public void DeveRejeitarNomeVazio()
    {
        var contato = new Agenda.Contato { Telefone = "(47) 99999-9999" };

        Assert.IsFalse(Agenda.ValidarContato.Validar(contato, out var mensagem));
        StringAssert.Contains(mensagem, "Nome");
    }

    [TestMethod]
    public void DeveRejeitarTelefoneComPoucosDigitos()
    {
        var contato = new Agenda.Contato { Nome = "Ana", Telefone = "123456789" };

        Assert.IsFalse(Agenda.ValidarContato.Validar(contato, out var mensagem));
        StringAssert.Contains(mensagem, "Telefone");
    }

    [TestMethod]
    public void DeveAceitarContatoValido()
    {
        var contato = new Agenda.Contato { Nome = "Ana", Telefone = "(47) 99999-9999" };

        Assert.IsTrue(Agenda.ValidarContato.Validar(contato, out var mensagem));
        Assert.AreEqual(string.Empty, mensagem);
    }
}
