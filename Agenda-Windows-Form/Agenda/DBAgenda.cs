using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SQLite;
using System.Data;

namespace Agenda
{
    internal class DBAgenda
    {
        public static string path = Directory.GetCurrentDirectory() + "\\banco.sqlite";
        private static SQLiteConnection connection;

        private static SQLiteConnection DataBaseconnection()
        {
            connection = new SQLiteConnection("Data Source=" + path);
            connection.Open();
            return connection;
        }

        public static void CriarDataBase()
        {
            try
            {
                if (!File.Exists(path))
                {
                    SQLiteConnection.CreateFile(path);
                }
            }
            catch (Exception error)
            {
                Console.WriteLine("Erro ao criar o banco de dados: " + error.Message);
            }
        }



        public static void CriarTabela()
        {
            try
            {
                using (var conn = DataBaseconnection())
                {
                    string sql = "CREATE TABLE IF NOT EXISTS Contatos (Id INTEGER PRIMARY KEY AUTOINCREMENT, Nome VARCHAR(50) NOT NULL, Telefone VARCHAR(50) NOT NULL)";
                    using (var cmd = new SQLiteCommand(sql, conn))
                    {
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception error)
            {
                Console.WriteLine("Erro ao criar a tabela: " + error.Message);
            }
        }

        public static DataTable GetContatos()
        {
            SQLiteDataAdapter adapter = null;
            DataTable table = new DataTable();
            try
            {
                using (var conn = DataBaseconnection())
                {
                    string sql = "SELECT * FROM Contatos";
                    using (var cmd = new SQLiteCommand(sql, conn))
                    {
                        adapter = new SQLiteDataAdapter(cmd);
                        adapter.Fill(table);
                        return table;
                    }
                }
            }
            catch (Exception error)
            {
                Console.WriteLine("Erro selecionar dados: " + error.Message);
                return null;
            }
        }

        public static DataTable GetContatoById(int id)
        {
            SQLiteDataAdapter adapter = null;
            DataTable table = new DataTable();
            try
            {
                using (var conn = DataBaseconnection())
                {
                    string sql = "SELECT * FROM Contatos WHERE Id = " + id;
                    using (var cmd = new SQLiteCommand(sql, conn))
                    {
                        adapter = new SQLiteDataAdapter(cmd);
                        adapter.Fill(table);
                        return table;
                    }
                }
            }
            catch (Exception error)
            {
                Console.WriteLine("Erro selecionar dado: " + error.Message);
                return null;
            }
        }

        public static int InserirContato(Contato contato)
        {
            try
            {
                using (var conn = DataBaseconnection())
                {
                    string sql = "INSERT INTO Contatos (Nome, Telefone) VALUES (@Nome, @Telefone); SELECT last_insert_rowid();";
                    using (var cmd = new SQLiteCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@Nome", contato.Nome);
                        cmd.Parameters.AddWithValue("@Telefone", contato.Telefone);
                        return Convert.ToInt32(cmd.ExecuteScalar());
                    }
                }
            }
            catch (Exception error)
            {
                Console.WriteLine("Erro inserir dado: " + error.Message);
                return -1;
            }
        }

        public static void AlterarContato(Contato contato)
        {
            try
            {
                using (var conn = DataBaseconnection())
                {
                    string sql = "UPDATE Contatos SET Nome = '" + contato.Nome + "', Telefone = '" + contato.Telefone + "' WHERE Id = " + contato.Id;
                    using (var cmd = new SQLiteCommand(sql, conn))
                    {
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception error)
            {
                Console.WriteLine("Erro alterar dado: " + error.Message);
            }
        }

        public static void ExcluirContato(int id)
        {
            try
            {
                using (var conn = DataBaseconnection())
                {
                    string sql = "DELETE FROM Contatos WHERE Id = " + id;
                    using (var cmd = new SQLiteCommand(sql, conn))
                    {
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception error)
            {
                Console.WriteLine("Erro deletar dado: " + error.Message);
            }
        }

    }
}
