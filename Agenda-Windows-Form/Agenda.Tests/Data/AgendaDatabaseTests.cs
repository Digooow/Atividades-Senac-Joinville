using Microsoft.VisualStudio.TestTools.UnitTesting;
using Agenda.Data;
using Agenda.Models;

namespace Agenda.Tests.Data;

[TestClass]
public class AgendaDatabaseTests
{
    private string databasePath = string.Empty;

    [TestInitialize]
    public void SetUp()
    {
        databasePath = Path.Combine(Path.GetTempPath(), $"agenda-{Guid.NewGuid():N}.sqlite");
        AgendaDatabase.DatabasePath = databasePath;
        AgendaDatabase.CriarDataBase();
        AgendaDatabase.CriarTabela();
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
        var contato = new Contact { Nome = "D'Ávila", Telefone = "(47) 99999-9999" };
        var id = AgendaDatabase.InserirContato(contato);

        Assert.AreEqual(1, AgendaDatabase.GetContatos().Rows.Count);
        Assert.AreEqual(1, AgendaDatabase.PesquisarContatos("D'Ávila", "").Rows.Count);

        contato.Id = id;
        contato.Nome = "Maria";
        AgendaDatabase.AlterarContato(contato);
        Assert.AreEqual("Maria", AgendaDatabase.GetContatoById(id).Rows[0]["Nome"]);

        AgendaDatabase.ExcluirContato(id);
        Assert.AreEqual(0, AgendaDatabase.GetContatos().Rows.Count);
    }
}
