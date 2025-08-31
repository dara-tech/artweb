<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmNationalRoption
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.TabControl1 = New System.Windows.Forms.TabControl()
        Me.TabPage1 = New System.Windows.Forms.TabPage()
        Me.cboQuarter = New System.Windows.Forms.ComboBox()
        Me.cboYear = New System.Windows.Forms.ComboBox()
        Me.Label18 = New System.Windows.Forms.Label()
        Me.Label4 = New System.Windows.Forms.Label()
        Me.TabPage2 = New System.Windows.Forms.TabPage()
        Me.daEnd = New System.Windows.Forms.DateTimePicker()
        Me.daStart = New System.Windows.Forms.DateTimePicker()
        Me.Label1 = New System.Windows.Forms.Label()
        Me.Label2 = New System.Windows.Forms.Label()
        Me.btnclose = New DevExpress.XtraEditors.SimpleButton()
        Me.btnReport = New DevExpress.XtraEditors.SimpleButton()
        Me.TabControl1.SuspendLayout()
        Me.TabPage1.SuspendLayout()
        Me.TabPage2.SuspendLayout()
        Me.SuspendLayout()
        '
        'TabControl1
        '
        Me.TabControl1.Controls.Add(Me.TabPage1)
        Me.TabControl1.Controls.Add(Me.TabPage2)
        Me.TabControl1.Location = New System.Drawing.Point(0, 0)
        Me.TabControl1.Name = "TabControl1"
        Me.TabControl1.SelectedIndex = 0
        Me.TabControl1.Size = New System.Drawing.Size(235, 130)
        Me.TabControl1.TabIndex = 0
        '
        'TabPage1
        '
        Me.TabPage1.Controls.Add(Me.cboQuarter)
        Me.TabPage1.Controls.Add(Me.cboYear)
        Me.TabPage1.Controls.Add(Me.Label18)
        Me.TabPage1.Controls.Add(Me.Label4)
        Me.TabPage1.Location = New System.Drawing.Point(4, 22)
        Me.TabPage1.Name = "TabPage1"
        Me.TabPage1.Padding = New System.Windows.Forms.Padding(3)
        Me.TabPage1.Size = New System.Drawing.Size(227, 104)
        Me.TabPage1.TabIndex = 0
        Me.TabPage1.Text = "Quarter"
        Me.TabPage1.UseVisualStyleBackColor = True
        '
        'cboQuarter
        '
        Me.cboQuarter.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.cboQuarter.FormattingEnabled = True
        Me.cboQuarter.Items.AddRange(New Object() {"1", "2", "3", "4"})
        Me.cboQuarter.Location = New System.Drawing.Point(65, 59)
        Me.cboQuarter.Name = "cboQuarter"
        Me.cboQuarter.Size = New System.Drawing.Size(97, 21)
        Me.cboQuarter.TabIndex = 153
        '
        'cboYear
        '
        Me.cboYear.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.cboYear.FormattingEnabled = True
        Me.cboYear.Location = New System.Drawing.Point(65, 17)
        Me.cboYear.Name = "cboYear"
        Me.cboYear.Size = New System.Drawing.Size(98, 21)
        Me.cboYear.TabIndex = 152
        '
        'Label18
        '
        Me.Label18.AutoSize = True
        Me.Label18.BackColor = System.Drawing.Color.Transparent
        Me.Label18.Font = New System.Drawing.Font("Microsoft Sans Serif", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label18.Location = New System.Drawing.Point(9, 15)
        Me.Label18.Name = "Label18"
        Me.Label18.Size = New System.Drawing.Size(35, 13)
        Me.Label18.TabIndex = 150
        Me.Label18.Text = "(Year)"
        '
        'Label4
        '
        Me.Label4.AutoSize = True
        Me.Label4.BackColor = System.Drawing.Color.Transparent
        Me.Label4.Font = New System.Drawing.Font("Microsoft Sans Serif", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label4.Location = New System.Drawing.Point(11, 69)
        Me.Label4.Name = "Label4"
        Me.Label4.Size = New System.Drawing.Size(48, 13)
        Me.Label4.TabIndex = 151
        Me.Label4.Text = "(Quarter)"
        '
        'TabPage2
        '
        Me.TabPage2.Controls.Add(Me.daEnd)
        Me.TabPage2.Controls.Add(Me.daStart)
        Me.TabPage2.Controls.Add(Me.Label1)
        Me.TabPage2.Controls.Add(Me.Label2)
        Me.TabPage2.Location = New System.Drawing.Point(4, 22)
        Me.TabPage2.Name = "TabPage2"
        Me.TabPage2.Padding = New System.Windows.Forms.Padding(3)
        Me.TabPage2.Size = New System.Drawing.Size(227, 104)
        Me.TabPage2.TabIndex = 1
        Me.TabPage2.Text = "Option"
        Me.TabPage2.UseVisualStyleBackColor = True
        '
        'daEnd
        '
        Me.daEnd.Format = System.Windows.Forms.DateTimePickerFormat.[Short]
        Me.daEnd.Location = New System.Drawing.Point(77, 59)
        Me.daEnd.Name = "daEnd"
        Me.daEnd.Size = New System.Drawing.Size(106, 20)
        Me.daEnd.TabIndex = 155
        Me.daEnd.Value = New Date(1900, 1, 1, 0, 0, 0, 0)
        '
        'daStart
        '
        Me.daStart.Format = System.Windows.Forms.DateTimePickerFormat.[Short]
        Me.daStart.Location = New System.Drawing.Point(81, 18)
        Me.daStart.Name = "daStart"
        Me.daStart.Size = New System.Drawing.Size(103, 20)
        Me.daStart.TabIndex = 154
        Me.daStart.Value = New Date(1900, 1, 1, 0, 0, 0, 0)
        '
        'Label1
        '
        Me.Label1.AutoSize = True
        Me.Label1.BackColor = System.Drawing.Color.Transparent
        Me.Label1.Font = New System.Drawing.Font("Microsoft Sans Serif", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label1.Location = New System.Drawing.Point(13, 20)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(61, 13)
        Me.Label1.TabIndex = 152
        Me.Label1.Text = "Date Start :"
        '
        'Label2
        '
        Me.Label2.AutoSize = True
        Me.Label2.BackColor = System.Drawing.Color.Transparent
        Me.Label2.Font = New System.Drawing.Font("Microsoft Sans Serif", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label2.Location = New System.Drawing.Point(15, 63)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(58, 13)
        Me.Label2.TabIndex = 153
        Me.Label2.Text = "Date End :"
        '
        'btnclose
        '
        Me.btnclose.Location = New System.Drawing.Point(253, 78)
        Me.btnclose.Name = "btnclose"
        Me.btnclose.Size = New System.Drawing.Size(59, 28)
        Me.btnclose.TabIndex = 155
        Me.btnclose.Text = "Close"
        '
        'btnReport
        '
        Me.btnReport.Location = New System.Drawing.Point(253, 22)
        Me.btnReport.Name = "btnReport"
        Me.btnReport.Size = New System.Drawing.Size(59, 27)
        Me.btnReport.TabIndex = 154
        Me.btnReport.Text = "Report"
        '
        'frmNationalRoption
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(319, 130)
        Me.ControlBox = False
        Me.Controls.Add(Me.btnclose)
        Me.Controls.Add(Me.TabControl1)
        Me.Controls.Add(Me.btnReport)
        Me.MaximizeBox = False
        Me.MinimizeBox = False
        Me.Name = "frmNationalRoption"
        Me.ShowIcon = False
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "Option For Report"
        Me.TabControl1.ResumeLayout(False)
        Me.TabPage1.ResumeLayout(False)
        Me.TabPage1.PerformLayout()
        Me.TabPage2.ResumeLayout(False)
        Me.TabPage2.PerformLayout()
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents TabControl1 As TabControl
    Friend WithEvents TabPage1 As TabPage
    Friend WithEvents Label18 As Label
    Friend WithEvents Label4 As Label
    Friend WithEvents TabPage2 As TabPage
    Friend WithEvents Label1 As Label
    Friend WithEvents Label2 As Label
    Friend WithEvents btnclose As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents btnReport As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents cboQuarter As ComboBox
    Friend WithEvents cboYear As ComboBox
    Friend WithEvents daEnd As DateTimePicker
    Friend WithEvents daStart As DateTimePicker
End Class
