using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Agenda.Tests;

[TestClass]
public class DBAgendaTests
{
    private string databasePath = string.Empty;

    [TestInitialize]
    public void SetUp()
    {
        databasePath = Path.Combine(Path.GetTempPath(), $"agenda-{Guid.NewGuid():N}.sqlite");
        Agenda.DBAgenda.DatabasePath = databasePath;
        Agenda.DBAgenda.CriarDataBase();
        Agenda.DBAgenda.CriarTabela();
    }

    [TestCleanup]
    public void TearDown()
    {
        if (File.Exists(databasePath))
            File.Delete(databasePath);
    }

    [TestMethod]
    public void DeveExecutarCrudDeContato()
    {
        var contato = new Agenda.Contato { Nome = "D'Ávila", Telefone = "(47) 99999-9999" };
        var id = Agenda.DBAgenda.InserirContato(contato);

        Assert.AreEqual(1, Agenda.DBAgenda.GetContatos().Rows.Count);
        Assert.AreEqual(1, Agenda.DBAgenda.PesquisarContatos("D'Ávila", "").Rows.Count);

        contato.Id = id;
        contato.Nome = "Maria";
        Agenda.DBAgenda.AlterarContato(contato);
        Assert.AreEqual("Maria", Agenda.DBAgenda.GetContatoById(id).Rows[0]["Nome"]);

        Agenda.DBAgenda.ExcluirContato(id);
        Assert.AreEqual(0, Agenda.DBAgenda.GetContatos().Rows.Count);
    }
}
