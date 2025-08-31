<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmUser
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
        Dim resources As System.ComponentModel.ComponentResourceManager = New System.ComponentModel.ComponentResourceManager(GetType(frmUser))
        Me.ToolStrip2 = New System.Windows.Forms.ToolStrip()
        Me.tsbSave = New System.Windows.Forms.ToolStripButton()
        Me.tsbNew = New System.Windows.Forms.ToolStripButton()
        Me.ToolStripSeparator1 = New System.Windows.Forms.ToolStripSeparator()
        Me.tsbLoadData = New System.Windows.Forms.ToolStripButton()
        Me.ToolStripSeparator4 = New System.Windows.Forms.ToolStripSeparator()
        Me.ToolStripButton2 = New System.Windows.Forms.ToolStripButton()
        Me.ToolStripSeparator5 = New System.Windows.Forms.ToolStripSeparator()
        Me.SplitContainerControl1 = New DevExpress.XtraEditors.SplitContainerControl()
        Me.rdStatus = New DevExpress.XtraEditors.RadioGroup()
        Me.LabelControl5 = New DevExpress.XtraEditors.LabelControl()
        Me.txtOldPassword = New DevExpress.XtraEditors.TextEdit()
        Me.txtRepassword = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl4 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl2 = New DevExpress.XtraEditors.LabelControl()
        Me.txtPassword = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl1 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl3 = New DevExpress.XtraEditors.LabelControl()
        Me.txtUserName = New DevExpress.XtraEditors.TextEdit()
        Me.txtFullName = New DevExpress.XtraEditors.TextEdit()
        Me.GridControl2 = New DevExpress.XtraGrid.GridControl()
        Me.GridView2 = New DevExpress.XtraGrid.Views.Grid.GridView()
        Me.ToolStrip2.SuspendLayout()
        CType(Me.SplitContainerControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SplitContainerControl1.SuspendLayout()
        CType(Me.rdStatus.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtOldPassword.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtRepassword.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtPassword.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtUserName.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtFullName.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.GridControl2, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.GridView2, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'ToolStrip2
        '
        Me.ToolStrip2.ImageScalingSize = New System.Drawing.Size(20, 20)
        Me.ToolStrip2.Items.AddRange(New System.Windows.Forms.ToolStripItem() {Me.tsbSave, Me.tsbNew, Me.ToolStripSeparator1, Me.tsbLoadData, Me.ToolStripSeparator4, Me.ToolStripButton2, Me.ToolStripSeparator5})
        Me.ToolStrip2.Location = New System.Drawing.Point(0, 0)
        Me.ToolStrip2.Name = "ToolStrip2"
        Me.ToolStrip2.Size = New System.Drawing.Size(787, 27)
        Me.ToolStrip2.TabIndex = 3
        '
        'tsbSave
        '
        Me.tsbSave.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.tsbSave.Image = CType(resources.GetObject("tsbSave.Image"), System.Drawing.Image)
        Me.tsbSave.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.tsbSave.Name = "tsbSave"
        Me.tsbSave.Size = New System.Drawing.Size(24, 24)
        Me.tsbSave.Text = "&Save"
        '
        'tsbNew
        '
        Me.tsbNew.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.tsbNew.Image = CType(resources.GetObject("tsbNew.Image"), System.Drawing.Image)
        Me.tsbNew.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.tsbNew.Name = "tsbNew"
        Me.tsbNew.Size = New System.Drawing.Size(24, 24)
        Me.tsbNew.Text = "&New"
        '
        'ToolStripSeparator1
        '
        Me.ToolStripSeparator1.Name = "ToolStripSeparator1"
        Me.ToolStripSeparator1.Size = New System.Drawing.Size(6, 27)
        '
        'tsbLoadData
        '
        Me.tsbLoadData.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.tsbLoadData.Name = "tsbLoadData"
        Me.tsbLoadData.Size = New System.Drawing.Size(64, 24)
        Me.tsbLoadData.Text = "Load Data"
        '
        'ToolStripSeparator4
        '
        Me.ToolStripSeparator4.Name = "ToolStripSeparator4"
        Me.ToolStripSeparator4.Size = New System.Drawing.Size(6, 27)
        Me.ToolStripSeparator4.Visible = False
        '
        'ToolStripButton2
        '
        Me.ToolStripButton2.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.ToolStripButton2.Name = "ToolStripButton2"
        Me.ToolStripButton2.Size = New System.Drawing.Size(47, 24)
        Me.ToolStripButton2.Text = "Reload"
        Me.ToolStripButton2.Visible = False
        '
        'ToolStripSeparator5
        '
        Me.ToolStripSeparator5.Name = "ToolStripSeparator5"
        Me.ToolStripSeparator5.Size = New System.Drawing.Size(6, 27)
        Me.ToolStripSeparator5.Visible = False
        '
        'SplitContainerControl1
        '
        Me.SplitContainerControl1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.SplitContainerControl1.Location = New System.Drawing.Point(0, 27)
        Me.SplitContainerControl1.Name = "SplitContainerControl1"
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.rdStatus)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl5)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.txtOldPassword)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.txtRepassword)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl4)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl2)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.txtPassword)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl1)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl3)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.txtUserName)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.txtFullName)
        Me.SplitContainerControl1.Panel1.Text = "Panel1"
        Me.SplitContainerControl1.Panel2.Controls.Add(Me.GridControl2)
        Me.SplitContainerControl1.Panel2.Text = "Panel2"
        Me.SplitContainerControl1.Size = New System.Drawing.Size(787, 313)
        Me.SplitContainerControl1.SplitterPosition = 405
        Me.SplitContainerControl1.TabIndex = 8
        Me.SplitContainerControl1.Text = "SplitContainerControl1"
        '
        'rdStatus
        '
        Me.rdStatus.Location = New System.Drawing.Point(110, 175)
        Me.rdStatus.Name = "rdStatus"
        Me.rdStatus.Properties.Appearance.BackColor = System.Drawing.Color.Transparent
        Me.rdStatus.Properties.Appearance.Options.UseBackColor = True
        Me.rdStatus.Properties.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.NoBorder
        Me.rdStatus.Properties.GlyphAlignment = DevExpress.Utils.HorzAlignment.[Default]
        Me.rdStatus.Properties.Items.AddRange(New DevExpress.XtraEditors.Controls.RadioGroupItem() {New DevExpress.XtraEditors.Controls.RadioGroupItem(Nothing, "Active"), New DevExpress.XtraEditors.Controls.RadioGroupItem(Nothing, "DisActive")})
        Me.rdStatus.Size = New System.Drawing.Size(274, 32)
        Me.rdStatus.TabIndex = 6
        '
        'LabelControl5
        '
        Me.LabelControl5.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.LabelControl5.Appearance.Options.UseFont = True
        Me.LabelControl5.Location = New System.Drawing.Point(14, 75)
        Me.LabelControl5.Name = "LabelControl5"
        Me.LabelControl5.Size = New System.Drawing.Size(87, 16)
        Me.LabelControl5.TabIndex = 8
        Me.LabelControl5.Text = "Old Password :"
        '
        'txtOldPassword
        '
        Me.txtOldPassword.Enabled = False
        Me.txtOldPassword.Location = New System.Drawing.Point(110, 72)
        Me.txtOldPassword.Name = "txtOldPassword"
        Me.txtOldPassword.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.txtOldPassword.Properties.Appearance.Options.UseFont = True
        Me.txtOldPassword.Properties.MaxLength = 20
        Me.txtOldPassword.Properties.PasswordChar = Global.Microsoft.VisualBasic.ChrW(42)
        Me.txtOldPassword.Size = New System.Drawing.Size(274, 22)
        Me.txtOldPassword.TabIndex = 3
        '
        'txtRepassword
        '
        Me.txtRepassword.Location = New System.Drawing.Point(110, 138)
        Me.txtRepassword.Name = "txtRepassword"
        Me.txtRepassword.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.txtRepassword.Properties.Appearance.Options.UseFont = True
        Me.txtRepassword.Properties.MaxLength = 20
        Me.txtRepassword.Properties.PasswordChar = Global.Microsoft.VisualBasic.ChrW(42)
        Me.txtRepassword.Size = New System.Drawing.Size(274, 22)
        Me.txtRepassword.TabIndex = 5
        '
        'LabelControl4
        '
        Me.LabelControl4.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.LabelControl4.Appearance.Options.UseFont = True
        Me.LabelControl4.Location = New System.Drawing.Point(14, 141)
        Me.LabelControl4.Name = "LabelControl4"
        Me.LabelControl4.Size = New System.Drawing.Size(80, 16)
        Me.LabelControl4.TabIndex = 6
        Me.LabelControl4.Text = "Re-Password:"
        '
        'LabelControl2
        '
        Me.LabelControl2.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.LabelControl2.Appearance.Options.UseFont = True
        Me.LabelControl2.Location = New System.Drawing.Point(14, 47)
        Me.LabelControl2.Name = "LabelControl2"
        Me.LabelControl2.Size = New System.Drawing.Size(66, 16)
        Me.LabelControl2.TabIndex = 2
        Me.LabelControl2.Text = "Full Name :"
        '
        'txtPassword
        '
        Me.txtPassword.Location = New System.Drawing.Point(110, 105)
        Me.txtPassword.Name = "txtPassword"
        Me.txtPassword.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.txtPassword.Properties.Appearance.Options.UseFont = True
        Me.txtPassword.Properties.MaxLength = 20
        Me.txtPassword.Properties.PasswordChar = Global.Microsoft.VisualBasic.ChrW(42)
        Me.txtPassword.Size = New System.Drawing.Size(274, 22)
        Me.txtPassword.TabIndex = 4
        '
        'LabelControl1
        '
        Me.LabelControl1.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.LabelControl1.Appearance.Options.UseFont = True
        Me.LabelControl1.Location = New System.Drawing.Point(14, 17)
        Me.LabelControl1.Name = "LabelControl1"
        Me.LabelControl1.Size = New System.Drawing.Size(72, 16)
        Me.LabelControl1.TabIndex = 0
        Me.LabelControl1.Text = "User Name :"
        '
        'LabelControl3
        '
        Me.LabelControl3.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.LabelControl3.Appearance.Options.UseFont = True
        Me.LabelControl3.Location = New System.Drawing.Point(14, 108)
        Me.LabelControl3.Name = "LabelControl3"
        Me.LabelControl3.Size = New System.Drawing.Size(64, 16)
        Me.LabelControl3.TabIndex = 4
        Me.LabelControl3.Text = "Password :"
        '
        'txtUserName
        '
        Me.txtUserName.Location = New System.Drawing.Point(110, 14)
        Me.txtUserName.Name = "txtUserName"
        Me.txtUserName.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.txtUserName.Properties.Appearance.Options.UseFont = True
        Me.txtUserName.Properties.MaxLength = 15
        Me.txtUserName.Size = New System.Drawing.Size(274, 22)
        Me.txtUserName.TabIndex = 1
        '
        'txtFullName
        '
        Me.txtFullName.Location = New System.Drawing.Point(110, 44)
        Me.txtFullName.Name = "txtFullName"
        Me.txtFullName.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 10.0!)
        Me.txtFullName.Properties.Appearance.Options.UseFont = True
        Me.txtFullName.Properties.MaxLength = 20
        Me.txtFullName.Size = New System.Drawing.Size(274, 22)
        Me.txtFullName.TabIndex = 2
        '
        'GridControl2
        '
        Me.GridControl2.Dock = System.Windows.Forms.DockStyle.Fill
        Me.GridControl2.Location = New System.Drawing.Point(0, 0)
        Me.GridControl2.MainView = Me.GridView2
        Me.GridControl2.Name = "GridControl2"
        Me.GridControl2.Size = New System.Drawing.Size(377, 313)
        Me.GridControl2.TabIndex = 0
        Me.GridControl2.ViewCollection.AddRange(New DevExpress.XtraGrid.Views.Base.BaseView() {Me.GridView2})
        '
        'GridView2
        '
        Me.GridView2.GridControl = Me.GridControl2
        Me.GridView2.Name = "GridView2"
        Me.GridView2.OptionsBehavior.Editable = False
        Me.GridView2.OptionsView.ShowFooter = True
        Me.GridView2.OptionsView.ShowGroupPanel = False
        '
        'frmUser
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(787, 340)
        Me.Controls.Add(Me.SplitContainerControl1)
        Me.Controls.Add(Me.ToolStrip2)
        Me.Name = "frmUser"
        Me.Text = "User"
        Me.ToolStrip2.ResumeLayout(False)
        Me.ToolStrip2.PerformLayout()
        CType(Me.SplitContainerControl1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainerControl1.ResumeLayout(False)
        CType(Me.rdStatus.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtOldPassword.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtRepassword.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtPassword.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtUserName.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtFullName.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.GridControl2, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.GridView2, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents ToolStrip2 As ToolStrip
    Friend WithEvents tsbSave As ToolStripButton
    Friend WithEvents tsbNew As ToolStripButton
    Friend WithEvents ToolStripSeparator1 As ToolStripSeparator
    Friend WithEvents tsbLoadData As ToolStripButton
    Friend WithEvents ToolStripSeparator4 As ToolStripSeparator
    Friend WithEvents ToolStripButton2 As ToolStripButton
    Friend WithEvents ToolStripSeparator5 As ToolStripSeparator
    Friend WithEvents SplitContainerControl1 As DevExpress.XtraEditors.SplitContainerControl
    Friend WithEvents rdStatus As DevExpress.XtraEditors.RadioGroup
    Friend WithEvents LabelControl5 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents txtOldPassword As DevExpress.XtraEditors.TextEdit
    Friend WithEvents txtRepassword As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl4 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl2 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents txtPassword As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl1 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl3 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents txtUserName As DevExpress.XtraEditors.TextEdit
    Friend WithEvents txtFullName As DevExpress.XtraEditors.TextEdit
    Friend WithEvents GridControl2 As DevExpress.XtraGrid.GridControl
    Friend WithEvents GridView2 As DevExpress.XtraGrid.Views.Grid.GridView
End Class
