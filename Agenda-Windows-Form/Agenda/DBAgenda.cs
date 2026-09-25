using System.Data;
using System.Data.SQLite;

namespace Agenda
{
    internal static class DBAgenda
    {
        public static string DatabasePath { get; set; } =
            Path.Combine(AppContext.BaseDirectory, "banco.sqlite");

        private static SQLiteConnection DataBaseconnection()
        {
            var connection = new SQLiteConnection($"Data Source={DatabasePath}");
            connection.Open();
            return connection;
        }

        public static void CriarDataBase()
        {
            if (!File.Exists(DatabasePath))
                SQLiteConnection.CreateFile(DatabasePath);
        }

        public static void CriarTabela()
        {
            using var conn = DataBaseconnection();
            const string sql = """
                CREATE TABLE IF NOT EXISTS Contatos (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Nome VARCHAR(50) NOT NULL,
                    Telefone VARCHAR(50) NOT NULL
                )
                """;
            using var cmd = new SQLiteCommand(sql, conn);
            cmd.ExecuteNonQuery();
        }

        public static DataTable GetContatos()
        {
            using var conn = DataBaseconnection();
            using var cmd = new SQLiteCommand(
                "SELECT Id, Nome, Telefone FROM Contatos ORDER BY Nome", conn);
            return FillTable(cmd);
        }

        public static DataTable GetContatoById(int id)
        {
            using var conn = DataBaseconnection();
            using var cmd = new SQLiteCommand(
                "SELECT Id, Nome, Telefone FROM Contatos WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            return FillTable(cmd);
        }

        public static DataTable PesquisarContatos(string nome, string telefone)
        {
            using var conn = DataBaseconnection();
            using var cmd = new SQLiteCommand(
                """
                SELECT Id, Nome, Telefone
                FROM Contatos
                WHERE (@Nome = '' OR Nome LIKE @NomeBusca)
                  AND (@Telefone = '' OR Telefone LIKE @TelefoneBusca)
                ORDER BY Nome
                """, conn);
            var nomeBusca = nome.Trim();
            var telefoneBusca = telefone.Trim();
            cmd.Parameters.AddWithValue("@Nome", nomeBusca);
            cmd.Parameters.AddWithValue("@NomeBusca", $"%{nomeBusca}%");
            cmd.Parameters.AddWithValue("@Telefone", telefoneBusca);
            cmd.Parameters.AddWithValue("@TelefoneBusca", $"%{telefoneBusca}%");
            return FillTable(cmd);
        }

        public static int InserirContato(Contato contato)
        {
            using var conn = DataBaseconnection();
            const string sql =
                "INSERT INTO Contatos (Nome, Telefone) VALUES (@Nome, @Telefone); SELECT last_insert_rowid();";
            using var cmd = new SQLiteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Nome", contato.Nome.Trim());
            cmd.Parameters.AddWithValue("@Telefone", contato.Telefone.Trim());
            return Convert.ToInt32(cmd.ExecuteScalar());
        }

        public static void AlterarContato(Contato contato)
        {
            using var conn = DataBaseconnection();
            const string sql =
                "UPDATE Contatos SET Nome = @Nome, Telefone = @Telefone WHERE Id = @Id";
            using var cmd = new SQLiteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Id", contato.Id);
            cmd.Parameters.AddWithValue("@Nome", contato.Nome.Trim());
            cmd.Parameters.AddWithValue("@Telefone", contato.Telefone.Trim());
            cmd.ExecuteNonQuery();
        }

        public static void ExcluirContato(int id)
        {
            using var conn = DataBaseconnection();
            using var cmd = new SQLiteCommand("DELETE FROM Contatos WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
        }

        private static DataTable FillTable(SQLiteCommand command)
        {
            using var adapter = new SQLiteDataAdapter(command);
            var table = new DataTable();
            adapter.Fill(table);
            return table;
        }
    }
}
