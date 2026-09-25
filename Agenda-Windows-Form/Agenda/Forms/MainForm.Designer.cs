namespace Agenda
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle2 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle3 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle4 = new DataGridViewCellStyle();
            label1 = new Label();
            label2 = new Label();
            label3 = new Label();
            btInserir = new Button();
            btAlterar = new Button();
            btLocalizar = new Button();
            btExcluir = new Button();
            dGDados = new DataGridView();
            btNext = new Button();
            mtbTelefone = new MaskedTextBox();
            mtbNome = new MaskedTextBox();
            label4 = new Label();
            ((System.ComponentModel.ISupportInitialize)dGDados).BeginInit();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(25, 9);
            label1.Name = "label1";
            label1.Size = new Size(63, 15);
            label1.TabIndex = 0;
            label1.Text = "Id Contato";
            label1.Click += label1_Click;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(25, 41);
            label2.Name = "label2";
            label2.Size = new Size(40, 15);
            label2.TabIndex = 2;
            label2.Text = "Nome";
            label2.Click += label2_Click;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(25, 70);
            label3.Name = "label3";
            label3.Size = new Size(52, 15);
            label3.TabIndex = 4;
            label3.Text = "Telefone";
            // 
            // btInserir
            // 
            btInserir.BackColor = SystemColors.MenuHighlight;
            btInserir.BackgroundImageLayout = ImageLayout.None;
            btInserir.Cursor = Cursors.Hand;
            btInserir.Location = new Point(26, 109);
            btInserir.Name = "btInserir";
            btInserir.Size = new Size(75, 23);
            btInserir.TabIndex = 6;
            btInserir.Text = "Inserir";
            btInserir.TextAlign = ContentAlignment.TopCenter;
            btInserir.UseVisualStyleBackColor = false;
            btInserir.Click += btInserir_Click;
            // 
            // btAlterar
            // 
            btAlterar.BackColor = SystemColors.MenuHighlight;
            btAlterar.Location = new Point(107, 109);
            btAlterar.Name = "btAlterar";
            btAlterar.Size = new Size(75, 23);
            btAlterar.TabIndex = 7;
            btAlterar.Text = "Alterar";
            btAlterar.UseVisualStyleBackColor = false;
            btAlterar.Click += btAlterar_Click;
            // 
            // btLocalizar
            // 
            btLocalizar.BackColor = SystemColors.MenuHighlight;
            btLocalizar.Location = new Point(188, 109);
            btLocalizar.Name = "btLocalizar";
            btLocalizar.Size = new Size(75, 23);
            btLocalizar.TabIndex = 8;
            btLocalizar.Text = "Localizar";
            btLocalizar.UseVisualStyleBackColor = false;
            btLocalizar.Click += btLocalizar_Click;
            // 
            // btExcluir
            // 
            btExcluir.BackColor = SystemColors.Highlight;
            btExcluir.Location = new Point(269, 109);
            btExcluir.Name = "btExcluir";
            btExcluir.Size = new Size(75, 23);
            btExcluir.TabIndex = 9;
            btExcluir.Text = "Excluir";
            btExcluir.UseVisualStyleBackColor = false;
            btExcluir.Click += btExcluir_Click;
            // 
            // dGDados
            // 
            dGDados.AllowUserToAddRows = false;
            dGDados.AllowUserToDeleteRows = false;
            dGDados.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
            dGDados.AutoSizeRowsMode = DataGridViewAutoSizeRowsMode.AllCells;
            dGDados.BackgroundColor = SystemColors.GradientActiveCaption;
            dGDados.BorderStyle = BorderStyle.Fixed3D;
            dGDados.CellBorderStyle = DataGridViewCellBorderStyle.Sunken;
            dataGridViewCellStyle1.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = SystemColors.ActiveCaption;
            dataGridViewCellStyle1.Font = new Font("Segoe UI", 9F);
            dataGridViewCellStyle1.ForeColor = SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = SystemColors.ActiveCaption;
            dataGridViewCellStyle1.WrapMode = DataGridViewTriState.True;
            dGDados.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            dataGridViewCellStyle2.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = SystemColors.ActiveCaption;
            dataGridViewCellStyle2.Font = new Font("Segoe UI", 9F);
            dataGridViewCellStyle2.ForeColor = SystemColors.ActiveCaptionText;
            dataGridViewCellStyle2.SelectionBackColor = SystemColors.Highlight;
            dataGridViewCellStyle2.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = DataGridViewTriState.False;
            dGDados.DefaultCellStyle = dataGridViewCellStyle2;
            dGDados.ImeMode = ImeMode.On;
            dGDados.Location = new Point(28, 173);
            dGDados.MinimumSize = new Size(397, 150);
            dGDados.Name = "dGDados";
            dGDados.ReadOnly = true;
            dataGridViewCellStyle3.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = SystemColors.ActiveCaption;
            dataGridViewCellStyle3.Font = new Font("Segoe UI", 9F);
            dataGridViewCellStyle3.ForeColor = SystemColors.WindowText;
            dataGridViewCellStyle3.SelectionBackColor = SystemColors.Highlight;
            dataGridViewCellStyle3.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = DataGridViewTriState.True;
            dGDados.RowHeadersDefaultCellStyle = dataGridViewCellStyle3;
            dataGridViewCellStyle4.BackColor = SystemColors.ActiveCaption;
            dGDados.RowsDefaultCellStyle = dataGridViewCellStyle4;
            dGDados.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dGDados.Size = new Size(397, 150);
            dGDados.TabIndex = 10;
            dGDados.TabStop = false;
            dGDados.CellClick += dGDados_SelectionChanged;
            dGDados.CellContentClick += dGDados_CellContentClick;
            // 
            // btNext
            // 
            btNext.BackColor = SystemColors.Highlight;
            btNext.Location = new Point(350, 109);
            btNext.Name = "btNext";
            btNext.Size = new Size(75, 23);
            btNext.TabIndex = 11;
            btNext.Text = "Próxima";
            btNext.UseVisualStyleBackColor = false;
            btNext.Click += btNext_Click;
            // 
            // mtbTelefone
            // 
            mtbTelefone.BackColor = SystemColors.GradientActiveCaption;
            mtbTelefone.Location = new Point(94, 67);
            mtbTelefone.Name = "mtbTelefone";
            mtbTelefone.Size = new Size(207, 23);
            mtbTelefone.TabIndex = 12;
            mtbTelefone.MaskInputRejected += maskedTextBox1_MaskInputRejected;
            // 
            // mtbNome
            // 
            mtbNome.BackColor = SystemColors.GradientActiveCaption;
            mtbNome.Location = new Point(94, 38);
            mtbNome.Name = "mtbNome";
            mtbNome.Size = new Size(207, 23);
            mtbNome.TabIndex = 13;
            // 
            // label4
            // 
            label4.Anchor = AnchorStyles.Bottom | AnchorStyles.Left;
            label4.BackColor = SystemColors.GradientActiveCaption;
            label4.BorderStyle = BorderStyle.Fixed3D;
            label4.Location = new Point(94, 5);
            label4.Margin = new Padding(3);
            label4.Name = "label4";
            label4.Size = new Size(207, 23);
            label4.TabIndex = 15;
            label4.Text = "Id gerado automaticamente.";
            label4.TextAlign = ContentAlignment.MiddleLeft;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = SystemColors.GradientInactiveCaption;
            ClientSize = new Size(800, 450);
            Controls.Add(label4);
            Controls.Add(mtbNome);
            Controls.Add(mtbTelefone);
            Controls.Add(btNext);
            Controls.Add(dGDados);
            Controls.Add(btExcluir);
            Controls.Add(btLocalizar);
            Controls.Add(btAlterar);
            Controls.Add(btInserir);
            Controls.Add(label3);
            Controls.Add(label2);
            Controls.Add(label1);
            ForeColor = SystemColors.ActiveCaptionText;
            Name = "Form1";
            Text = "Agenda";
            Load += Form1_Load;
            ((System.ComponentModel.ISupportInitialize)dGDados).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private Label label2;
        private Label label3;
        private Button btInserir;
        private Button btAlterar;
        private Button btLocalizar;
        private Button btExcluir;
        private DataGridView dGDados;
        private Button btNext;
        private MaskedTextBox mtbTelefone;
        private MaskedTextBox mtbNome;
        private Label label4;
    }
}
