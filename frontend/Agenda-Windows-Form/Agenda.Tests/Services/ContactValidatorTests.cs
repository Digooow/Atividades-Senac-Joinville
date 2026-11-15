using Microsoft.VisualStudio.TestTools.UnitTesting;
using Agenda.Models;
using Agenda.Services;

namespace Agenda.Tests.Services;

[TestClass]
public class ContactValidatorTests
{
    [TestMethod]
    public void DeveRejeitarNomeVazio()
    {
        var contato = new Contact { Telefone = "(47) 99999-9999" };

        Assert.IsFalse(ContactValidator.Validar(contato, out var mensagem));
        StringAssert.Contains(mensagem, "Nome");
    }

    [TestMethod]
    public void DeveRejeitarTelefoneComPoucosDigitos()
    {
        var contato = new Contact { Nome = "Ana", Telefone = "123456789" };

        Assert.IsFalse(ContactValidator.Validar(contato, out var mensagem));
        StringAssert.Contains(mensagem, "Telefone");
    }

    [TestMethod]
    public void DeveAceitarContatoValido()
    {
        var contato = new Contact { Nome = "Ana", Telefone = "(47) 99999-9999" };

        Assert.IsTrue(ContactValidator.Validar(contato, out var mensagem));
        Assert.AreEqual(string.Empty, mensagem);
    }
}
