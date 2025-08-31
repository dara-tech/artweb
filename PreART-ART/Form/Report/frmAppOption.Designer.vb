<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmAppOption
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
        Me.daStartDate = New System.Windows.Forms.DateTimePicker()
        Me.Label18 = New System.Windows.Forms.Label()
        Me.lblbgTitle2 = New System.Windows.Forms.Label()
        Me.lblCaption = New System.Windows.Forms.Label()
        Me.btnclose = New DevExpress.XtraEditors.SimpleButton()
        Me.btnReport = New DevExpress.XtraEditors.SimpleButton()
        Me.PictureBox1 = New System.Windows.Forms.PictureBox()
        CType(Me.PictureBox1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'daStartDate
        '
        Me.daStartDate.CustomFormat = "dd/MM/yyyy"
        Me.daStartDate.Font = New System.Drawing.Font("Microsoft Sans Serif", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.daStartDate.Format = System.Windows.Forms.DateTimePickerFormat.Custom
        Me.daStartDate.Location = New System.Drawing.Point(116, 41)
        Me.daStartDate.Name = "daStartDate"
        Me.daStartDate.Size = New System.Drawing.Size(94, 20)
        Me.daStartDate.TabIndex = 257
        '
        'Label18
        '
        Me.Label18.AutoSize = True
        Me.Label18.BackColor = System.Drawing.Color.GhostWhite
        Me.Label18.Font = New System.Drawing.Font("Microsoft Sans Serif", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label18.Location = New System.Drawing.Point(12, 43)
        Me.Label18.Name = "Label18"
        Me.Label18.Size = New System.Drawing.Size(98, 13)
        Me.Label18.TabIndex = 256
        Me.Label18.Text = "(Appointment Date)"
        '
        'lblbgTitle2
        '
        Me.lblbgTitle2.BackColor = System.Drawing.Color.FromArgb(CType(CType(74, Byte), Integer), CType(CType(126, Byte), Integer), CType(CType(166, Byte), Integer))
        Me.lblbgTitle2.Font = New System.Drawing.Font("Tahoma", 8.0!, System.Drawing.FontStyle.Bold)
        Me.lblbgTitle2.ForeColor = System.Drawing.Color.Black
        Me.lblbgTitle2.Location = New System.Drawing.Point(11, 2)
        Me.lblbgTitle2.Name = "lblbgTitle2"
        Me.lblbgTitle2.Size = New System.Drawing.Size(200, 23)
        Me.lblbgTitle2.TabIndex = 258
        Me.lblbgTitle2.TextAlign = System.Drawing.ContentAlignment.MiddleLeft
        '
        'lblCaption
        '
        Me.lblCaption.AutoSize = True
        Me.lblCaption.BackColor = System.Drawing.Color.FromArgb(CType(CType(74, Byte), Integer), CType(CType(126, Byte), Integer), CType(CType(166, Byte), Integer))
        Me.lblCaption.ForeColor = System.Drawing.Color.White
        Me.lblCaption.Location = New System.Drawing.Point(37, 7)
        Me.lblCaption.Name = "lblCaption"
        Me.lblCaption.Size = New System.Drawing.Size(135, 13)
        Me.lblCaption.TabIndex = 259
        Me.lblCaption.Text = "Appointment Report Option"
        '
        'btnclose
        '
        Me.btnclose.Location = New System.Drawing.Point(27, 79)
        Me.btnclose.Name = "btnclose"
        Me.btnclose.Size = New System.Drawing.Size(59, 28)
        Me.btnclose.TabIndex = 262
        Me.btnclose.Text = "Close"
        '
        'btnReport
        '
        Me.btnReport.Location = New System.Drawing.Point(129, 79)
        Me.btnReport.Name = "btnReport"
        Me.btnReport.Size = New System.Drawing.Size(59, 27)
        Me.btnReport.TabIndex = 261
        Me.btnReport.Text = "Report"
        '
        'PictureBox1
        '
        Me.PictureBox1.BackColor = System.Drawing.Color.FromArgb(CType(CType(74, Byte), Integer), CType(CType(126, Byte), Integer), CType(CType(166, Byte), Integer))
        Me.PictureBox1.Location = New System.Drawing.Point(16, 8)
        Me.PictureBox1.Name = "PictureBox1"
        Me.PictureBox1.Size = New System.Drawing.Size(10, 11)
        Me.PictureBox1.TabIndex = 260
        Me.PictureBox1.TabStop = False
        '
        'frmAppOption
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(237, 128)
        Me.ControlBox = False
        Me.Controls.Add(Me.btnclose)
        Me.Controls.Add(Me.btnReport)
        Me.Controls.Add(Me.PictureBox1)
        Me.Controls.Add(Me.lblCaption)
        Me.Controls.Add(Me.lblbgTitle2)
        Me.Controls.Add(Me.daStartDate)
        Me.Controls.Add(Me.Label18)
        Me.Name = "frmAppOption"
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "Appointment Option"
        CType(Me.PictureBox1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents daStartDate As DateTimePicker
    Friend WithEvents Label18 As Label
    Friend WithEvents lblbgTitle2 As Label
    Friend WithEvents lblCaption As Label
    Friend WithEvents PictureBox1 As PictureBox
    Friend WithEvents btnclose As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents btnReport As DevExpress.XtraEditors.SimpleButton
End Class
