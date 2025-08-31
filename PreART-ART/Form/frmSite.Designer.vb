<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmSite
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
        Dim resources As System.ComponentModel.ComponentResourceManager = New System.ComponentModel.ComponentResourceManager(GetType(frmSite))
        Me.LabelControl1 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl2 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl3 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl4 = New DevExpress.XtraEditors.LabelControl()
        Me.Label1 = New System.Windows.Forms.Label()
        Me.txtNameEn = New DevExpress.XtraEditors.TextEdit()
        Me.txtNameKh = New DevExpress.XtraEditors.TextEdit()
        Me.txtCode = New DevExpress.XtraEditors.TextEdit()
        Me.cboProvince = New DevExpress.XtraEditors.ComboBoxEdit()
        Me.cbodistric = New DevExpress.XtraEditors.ComboBoxEdit()
        Me.BtnOk = New DevExpress.XtraEditors.SimpleButton()
        Me.CboODName = New DevExpress.XtraEditors.ComboBoxEdit()
        Me.Label2 = New System.Windows.Forms.Label()
        CType(Me.txtNameEn.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtNameKh.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtCode.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.cboProvince.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.cbodistric.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.CboODName.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'LabelControl1
        '
        Me.LabelControl1.Location = New System.Drawing.Point(15, 15)
        Me.LabelControl1.Name = "LabelControl1"
        Me.LabelControl1.Size = New System.Drawing.Size(89, 13)
        Me.LabelControl1.TabIndex = 0
        Me.LabelControl1.Text = "Site Name (Latin) :"
        '
        'LabelControl2
        '
        Me.LabelControl2.Location = New System.Drawing.Point(15, 57)
        Me.LabelControl2.Name = "LabelControl2"
        Me.LabelControl2.Size = New System.Drawing.Size(78, 13)
        Me.LabelControl2.TabIndex = 1
        Me.LabelControl2.Text = "Site Name (Kh) :"
        '
        'LabelControl3
        '
        Me.LabelControl3.Location = New System.Drawing.Point(15, 97)
        Me.LabelControl3.Name = "LabelControl3"
        Me.LabelControl3.Size = New System.Drawing.Size(53, 13)
        Me.LabelControl3.TabIndex = 2
        Me.LabelControl3.Text = "Site Code :"
        '
        'LabelControl4
        '
        Me.LabelControl4.Location = New System.Drawing.Point(15, 136)
        Me.LabelControl4.Name = "LabelControl4"
        Me.LabelControl4.Size = New System.Drawing.Size(51, 13)
        Me.LabelControl4.TabIndex = 3
        Me.LabelControl4.Text = "Province  :"
        '
        'Label1
        '
        Me.Label1.AutoSize = True
        Me.Label1.Location = New System.Drawing.Point(12, 212)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(59, 13)
        Me.Label1.TabIndex = 4
        Me.Label1.Text = "OD Name :"
        '
        'txtNameEn
        '
        Me.txtNameEn.Location = New System.Drawing.Point(109, 12)
        Me.txtNameEn.Name = "txtNameEn"
        Me.txtNameEn.Properties.MaxLength = 40
        Me.txtNameEn.Size = New System.Drawing.Size(258, 20)
        Me.txtNameEn.TabIndex = 1
        '
        'txtNameKh
        '
        Me.txtNameKh.Location = New System.Drawing.Point(109, 48)
        Me.txtNameKh.Name = "txtNameKh"
        Me.txtNameKh.Properties.Appearance.Font = New System.Drawing.Font("Khmer OS", 8.25!)
        Me.txtNameKh.Properties.Appearance.Options.UseFont = True
        Me.txtNameKh.Properties.MaxLength = 40
        Me.txtNameKh.Size = New System.Drawing.Size(258, 28)
        Me.txtNameKh.TabIndex = 2
        '
        'txtCode
        '
        Me.txtCode.Location = New System.Drawing.Point(109, 92)
        Me.txtCode.Name = "txtCode"
        Me.txtCode.Properties.MaxLength = 4
        Me.txtCode.Size = New System.Drawing.Size(63, 20)
        Me.txtCode.TabIndex = 3
        '
        'cboProvince
        '
        Me.cboProvince.Location = New System.Drawing.Point(109, 131)
        Me.cboProvince.Name = "cboProvince"
        Me.cboProvince.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 8.0!)
        Me.cboProvince.Properties.Appearance.Options.UseFont = True
        Me.cboProvince.Properties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.cboProvince.Properties.TextEditStyle = DevExpress.XtraEditors.Controls.TextEditStyles.DisableTextEditor
        Me.cboProvince.Size = New System.Drawing.Size(258, 20)
        Me.cboProvince.TabIndex = 4
        '
        'cbodistric
        '
        Me.cbodistric.Location = New System.Drawing.Point(109, 169)
        Me.cbodistric.Name = "cbodistric"
        Me.cbodistric.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 8.0!)
        Me.cbodistric.Properties.Appearance.Options.UseFont = True
        Me.cbodistric.Properties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.cbodistric.Properties.TextEditStyle = DevExpress.XtraEditors.Controls.TextEditStyles.DisableTextEditor
        Me.cbodistric.Size = New System.Drawing.Size(258, 20)
        Me.cbodistric.TabIndex = 5
        '
        'BtnOk
        '
        Me.BtnOk.Location = New System.Drawing.Point(157, 259)
        Me.BtnOk.Name = "BtnOk"
        Me.BtnOk.Size = New System.Drawing.Size(82, 30)
        Me.BtnOk.TabIndex = 54
        Me.BtnOk.Text = "Ok&"
        '
        'CboODName
        '
        Me.CboODName.Location = New System.Drawing.Point(109, 207)
        Me.CboODName.Name = "CboODName"
        Me.CboODName.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 8.0!)
        Me.CboODName.Properties.Appearance.Options.UseFont = True
        Me.CboODName.Properties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.CboODName.Size = New System.Drawing.Size(258, 20)
        Me.CboODName.TabIndex = 6
        '
        'Label2
        '
        Me.Label2.AutoSize = True
        Me.Label2.Location = New System.Drawing.Point(12, 174)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(47, 13)
        Me.Label2.TabIndex = 56
        Me.Label2.Text = "District :"
        '
        'frmSite
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(379, 313)
        Me.Controls.Add(Me.Label2)
        Me.Controls.Add(Me.CboODName)
        Me.Controls.Add(Me.BtnOk)
        Me.Controls.Add(Me.cboProvince)
        Me.Controls.Add(Me.cbodistric)
        Me.Controls.Add(Me.txtCode)
        Me.Controls.Add(Me.txtNameKh)
        Me.Controls.Add(Me.txtNameEn)
        Me.Controls.Add(Me.Label1)
        Me.Controls.Add(Me.LabelControl4)
        Me.Controls.Add(Me.LabelControl3)
        Me.Controls.Add(Me.LabelControl2)
        Me.Controls.Add(Me.LabelControl1)
        Me.FormBorderEffect = DevExpress.XtraEditors.FormBorderEffect.Shadow
        Me.Icon = CType(resources.GetObject("$this.Icon"), System.Drawing.Icon)
        Me.MaximizeBox = False
        Me.MinimizeBox = False
        Me.Name = "frmSite"
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "Site Name"
        CType(Me.txtNameEn.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtNameKh.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtCode.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.cboProvince.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.cbodistric.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.CboODName.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub
    Friend WithEvents LabelControl1 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl2 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl3 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl4 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents Label1 As Label
    Friend WithEvents txtNameEn As DevExpress.XtraEditors.TextEdit
    Friend WithEvents txtNameKh As DevExpress.XtraEditors.TextEdit
    Friend WithEvents txtCode As DevExpress.XtraEditors.TextEdit
    Friend WithEvents cboProvince As DevExpress.XtraEditors.ComboBoxEdit
    Friend WithEvents cbodistric As DevExpress.XtraEditors.ComboBoxEdit
    Friend WithEvents BtnOk As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents CboODName As DevExpress.XtraEditors.ComboBoxEdit
    Friend WithEvents Label2 As Label
End Class
