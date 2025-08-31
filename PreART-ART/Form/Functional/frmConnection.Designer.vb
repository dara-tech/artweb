<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmConnection
    Inherits DevExpress.XtraEditors.XtraForm

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        If disposing AndAlso components IsNot Nothing Then
            components.Dispose()
        End If
        MyBase.Dispose(disposing)
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.btnCancel = New DevExpress.XtraEditors.SimpleButton()
        Me.tbnTest = New DevExpress.XtraEditors.SimpleButton()
        Me.btnConnect = New DevExpress.XtraEditors.SimpleButton()
        Me.MarqueeProgressBarControl1 = New DevExpress.XtraEditors.MarqueeProgressBarControl()
        Me.txtPassword = New DevExpress.XtraEditors.TextEdit()
        Me.txtUserName = New DevExpress.XtraEditors.TextEdit()
        Me.txtServerName = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl3 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl2 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl1 = New DevExpress.XtraEditors.LabelControl()
        Me.btnrestore = New DevExpress.XtraEditors.SimpleButton()
        Me.CheckEdit1 = New DevExpress.XtraEditors.CheckEdit()
        Me.OpenFileDialog1 = New System.Windows.Forms.OpenFileDialog()
        CType(Me.MarqueeProgressBarControl1.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtPassword.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtUserName.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtServerName.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.CheckEdit1.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'btnCancel
        '
        Me.btnCancel.Location = New System.Drawing.Point(337, 95)
        Me.btnCancel.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.btnCancel.Name = "btnCancel"
        Me.btnCancel.Size = New System.Drawing.Size(97, 34)
        Me.btnCancel.TabIndex = 49
        Me.btnCancel.Text = "Cancel"
        '
        'tbnTest
        '
        Me.tbnTest.Location = New System.Drawing.Point(337, 50)
        Me.tbnTest.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.tbnTest.Name = "tbnTest"
        Me.tbnTest.Size = New System.Drawing.Size(97, 34)
        Me.tbnTest.TabIndex = 48
        Me.tbnTest.Text = "Test"
        '
        'btnConnect
        '
        Me.btnConnect.Location = New System.Drawing.Point(337, 7)
        Me.btnConnect.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.btnConnect.Name = "btnConnect"
        Me.btnConnect.Size = New System.Drawing.Size(97, 34)
        Me.btnConnect.TabIndex = 47
        Me.btnConnect.Text = "Connect"
        '
        'MarqueeProgressBarControl1
        '
        Me.MarqueeProgressBarControl1.EditValue = "Connecting to Server"
        Me.MarqueeProgressBarControl1.Location = New System.Drawing.Point(8, 191)
        Me.MarqueeProgressBarControl1.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.MarqueeProgressBarControl1.Name = "MarqueeProgressBarControl1"
        Me.MarqueeProgressBarControl1.Properties.ProgressAnimationMode = DevExpress.Utils.Drawing.ProgressAnimationMode.Cycle
        Me.MarqueeProgressBarControl1.Properties.ReadOnly = True
        Me.MarqueeProgressBarControl1.Properties.ShowTitle = True
        Me.MarqueeProgressBarControl1.Size = New System.Drawing.Size(426, 23)
        Me.MarqueeProgressBarControl1.TabIndex = 46
        '
        'txtPassword
        '
        Me.txtPassword.Location = New System.Drawing.Point(105, 100)
        Me.txtPassword.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.txtPassword.Name = "txtPassword"
        Me.txtPassword.Properties.PasswordChar = Global.Microsoft.VisualBasic.ChrW(35)
        Me.txtPassword.Size = New System.Drawing.Size(195, 22)
        Me.txtPassword.TabIndex = 45
        '
        'txtUserName
        '
        Me.txtUserName.Location = New System.Drawing.Point(105, 60)
        Me.txtUserName.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.txtUserName.Name = "txtUserName"
        Me.txtUserName.Size = New System.Drawing.Size(195, 22)
        Me.txtUserName.TabIndex = 44
        '
        'txtServerName
        '
        Me.txtServerName.Location = New System.Drawing.Point(105, 17)
        Me.txtServerName.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.txtServerName.Name = "txtServerName"
        Me.txtServerName.Size = New System.Drawing.Size(196, 22)
        Me.txtServerName.TabIndex = 43
        '
        'LabelControl3
        '
        Me.LabelControl3.Location = New System.Drawing.Point(8, 96)
        Me.LabelControl3.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.LabelControl3.Name = "LabelControl3"
        Me.LabelControl3.Size = New System.Drawing.Size(64, 16)
        Me.LabelControl3.TabIndex = 42
        Me.LabelControl3.Text = "Password :"
        '
        'LabelControl2
        '
        Me.LabelControl2.Location = New System.Drawing.Point(8, 62)
        Me.LabelControl2.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.LabelControl2.Name = "LabelControl2"
        Me.LabelControl2.Size = New System.Drawing.Size(68, 16)
        Me.LabelControl2.TabIndex = 41
        Me.LabelControl2.Text = "User Name:"
        '
        'LabelControl1
        '
        Me.LabelControl1.Location = New System.Drawing.Point(8, 25)
        Me.LabelControl1.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.LabelControl1.Name = "LabelControl1"
        Me.LabelControl1.Size = New System.Drawing.Size(84, 16)
        Me.LabelControl1.TabIndex = 40
        Me.LabelControl1.Text = "Server Name :"
        '
        'btnrestore
        '
        Me.btnrestore.Enabled = False
        Me.btnrestore.Location = New System.Drawing.Point(337, 142)
        Me.btnrestore.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.btnrestore.Name = "btnrestore"
        Me.btnrestore.Size = New System.Drawing.Size(97, 34)
        Me.btnrestore.TabIndex = 50
        Me.btnrestore.Text = "Start Restore"
        '
        'CheckEdit1
        '
        Me.CheckEdit1.Enabled = False
        Me.CheckEdit1.Location = New System.Drawing.Point(31, 146)
        Me.CheckEdit1.Name = "CheckEdit1"
        Me.CheckEdit1.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.CheckEdit1.Properties.Appearance.Options.UseFont = True
        Me.CheckEdit1.Properties.Caption = "If don't have database please restore"
        Me.CheckEdit1.Size = New System.Drawing.Size(279, 24)
        Me.CheckEdit1.TabIndex = 51
        '
        'OpenFileDialog1
        '
        Me.OpenFileDialog1.FileName = "OpenFileDialog1"
        '
        'frmConnection
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(7.0!, 16.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(456, 227)
        Me.Controls.Add(Me.CheckEdit1)
        Me.Controls.Add(Me.btnrestore)
        Me.Controls.Add(Me.btnCancel)
        Me.Controls.Add(Me.tbnTest)
        Me.Controls.Add(Me.btnConnect)
        Me.Controls.Add(Me.MarqueeProgressBarControl1)
        Me.Controls.Add(Me.txtPassword)
        Me.Controls.Add(Me.txtUserName)
        Me.Controls.Add(Me.txtServerName)
        Me.Controls.Add(Me.LabelControl3)
        Me.Controls.Add(Me.LabelControl2)
        Me.Controls.Add(Me.LabelControl1)
        Me.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.MaximizeBox = False
        Me.MinimizeBox = False
        Me.Name = "frmConnection"
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "Connection"
        CType(Me.MarqueeProgressBarControl1.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtPassword.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtUserName.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtServerName.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.CheckEdit1.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents btnCancel As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents tbnTest As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents btnConnect As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents MarqueeProgressBarControl1 As DevExpress.XtraEditors.MarqueeProgressBarControl
    Friend WithEvents txtPassword As DevExpress.XtraEditors.TextEdit
    Friend WithEvents txtUserName As DevExpress.XtraEditors.TextEdit
    Friend WithEvents txtServerName As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl3 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl2 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl1 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents btnrestore As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents CheckEdit1 As DevExpress.XtraEditors.CheckEdit
    Friend WithEvents OpenFileDialog1 As OpenFileDialog
End Class
