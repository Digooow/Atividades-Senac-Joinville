using System;
using System.Data;
using System.Windows.Forms;
using Agenda.Data;
using Agenda.Models;
using Agenda.Services;

namespace Agenda.Forms
{
    public partial class MainForm : Form
    {
        private int idSelecionado = 0;

        public MainForm()
        {
            InitializeComponent();

            mtbTelefone.Mask = "(00) 00000-0000";
            mtbTelefone.HidePromptOnLeave = true;
            mtbTelefone.TextMaskFormat = MaskFormat.IncludeLiterals;

            
            btLocalizar.Enabled = false;
            btAlterar.Enabled = false;
            btExcluir.Enabled = false;
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            AgendaDatabase.CriarDataBase();
            AgendaDatabase.CriarTabela();
            ExibirDados();
        }

        private void ExibirDados()
        {
            try
            {
                dGDados.DataSource = AgendaDatabase.GetContatos();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void btInserir_Click(object sender, EventArgs e)
        {
            try
            {
                Contact contato = new Contact
                {
                    Nome = mtbNome.Text,
                    Telefone = mtbTelefone.Text
                };

                if (!ContactValidator.Validar(contato, out string mensagem))
                {
                    MessageBox.Show(mensagem, "Validação", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    if (string.IsNullOrWhiteSpace(contato.Nome))
                        mtbNome.Focus();
                    else
                        mtbTelefone.Focus();
                    return;
                }

                AgendaDatabase.InserirContato(contato);
                ExibirDados();

                mtbNome.Clear();
                mtbTelefone.Clear();
                mtbNome.Focus();

                btAlterar.Enabled = false;
                btExcluir.Enabled = false;
                btLocalizar.Enabled = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro ao inserir: " + ex.Message);
            }
        }

        private void btAlterar_Click(object sender, EventArgs e)
        {
            try
            {
                if (idSelecionado == 0)
                {
                    MessageBox.Show("Selecione um contato para alterar.", "Aviso", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                Contact contato = new Contact
                {
                    Id = idSelecionado,
                    Nome = mtbNome.Text,
                    Telefone = mtbTelefone.Text
                };

                if (!ContactValidator.Validar(contato, out string mensagem))
                {
                    MessageBox.Show(mensagem, "Validação", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    if (string.IsNullOrWhiteSpace(contato.Nome))
                        mtbNome.Focus();
                    else
                        mtbTelefone.Focus();
                    return;
                }

                AgendaDatabase.AlterarContato(contato);
                ExibirDados();

                idSelecionado = 0;
                mtbNome.Clear();
                mtbTelefone.Clear();
                btAlterar.Enabled = false;
                btExcluir.Enabled = false;
                btLocalizar.Enabled = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro ao alterar: " + ex.Message);
            }
        }

        private void btLocalizar_Click(object sender, EventArgs e)
        {
            try
            {
                if (idSelecionado == 0)
                {
                    MessageBox.Show("Selecione um contato para localizar.", "Aviso", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                var table = AgendaDatabase.PesquisarContatos(mtbNome.Text, mtbTelefone.Text);
                dGDados.DataSource = table;
                if (table.Rows.Count == 0)
                {
                    MessageBox.Show("Nenhum contato encontrado.", "Pesquisa",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return;
                }

                idSelecionado = 0;
                btAlterar.Enabled = false;
                btExcluir.Enabled = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void btExcluir_Click(object sender, EventArgs e)
        {
            try
            {
                if (idSelecionado == 0)
                {
                    MessageBox.Show("Selecione um contato para excluir.", "Aviso", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                DialogResult resultado = MessageBox.Show(
                    $"Tem certeza que deseja excluir o contato ID {idSelecionado}?",
                    "Confirmar Exclusão",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Question
                );

                if (resultado != DialogResult.Yes)
                    return;

                AgendaDatabase.ExcluirContato(idSelecionado);
                ExibirDados();

                idSelecionado = 0;
                mtbNome.Clear();
                mtbTelefone.Clear();
                btAlterar.Enabled = false;
                btExcluir.Enabled = false;
                btLocalizar.Enabled = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro ao excluir: " + ex.Message);
            }
        }

        private void btNext_Click(object sender, EventArgs e)
        {
            var aboutForm = new AboutForm();
            aboutForm.Show();
        }

        private void dGDados_SelectionChanged(object sender, EventArgs e)
        {
            if (dGDados.SelectedRows.Count > 0)
            {
                DataGridViewRow row = dGDados.SelectedRows[0];
                if (!row.IsNewRow)
                {
                    idSelecionado = Convert.ToInt32(row.Cells["Id"].Value);
                    mtbNome.Text = row.Cells["Nome"].Value?.ToString() ?? "";
                    mtbTelefone.Text = row.Cells["Telefone"].Value?.ToString() ?? "";

                    btAlterar.Enabled = true;
                    btExcluir.Enabled = true;
                    btLocalizar.Enabled = true;
                }
            }
        }



        private void mtbId_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter) { mtbNome.Focus(); e.SuppressKeyPress = true; }
        }

        private void mtbNome_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter) { mtbTelefone.Focus(); e.SuppressKeyPress = true; }
        }

        private void mtbTelefone_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter) { btInserir.Focus(); e.SuppressKeyPress = true; }
        }

        private void dGDados_CellContentClick(object sender, DataGridViewCellEventArgs e) { }
        private void label1_Click(object sender, EventArgs e) { }
        private void label2_Click(object sender, EventArgs e) { }
        private void mtbTelefone_TextChanged(object sender, EventArgs e) { }
        private void maskedTextBox1_MaskInputRejected(object sender, MaskInputRejectedEventArgs e) { }
    }
}