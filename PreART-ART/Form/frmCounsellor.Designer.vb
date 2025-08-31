<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmCounsellor
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
        Me.ToolStrip2 = New System.Windows.Forms.ToolStrip()
        Me.tsbSave = New System.Windows.Forms.ToolStripButton()
        Me.tbsClear = New System.Windows.Forms.ToolStripButton()
        Me.ToolStripButton3 = New System.Windows.Forms.ToolStripButton()
        Me.ToolStripSeparator2 = New System.Windows.Forms.ToolStripSeparator()
        Me.tsbReload = New System.Windows.Forms.ToolStripButton()
        Me.SplitContainerControl1 = New DevExpress.XtraEditors.SplitContainerControl()
        Me.RdCounsellorSex = New DevExpress.XtraEditors.RadioGroup()
        Me.DaCounsellor = New DevExpress.XtraEditors.DateEdit()
        Me.LabelControl5 = New DevExpress.XtraEditors.LabelControl()
        Me.txtCounsellorPhone = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl4 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl2 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl1 = New DevExpress.XtraEditors.LabelControl()
        Me.txtCounsellorName = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl3 = New DevExpress.XtraEditors.LabelControl()
        Me.CboCounsellorStatus = New DevExpress.XtraEditors.ComboBoxEdit()
        Me.GridControl1 = New DevExpress.XtraGrid.GridControl()
        Me.GridView1 = New DevExpress.XtraGrid.Views.Grid.GridView()
        Me.ToolStrip2.SuspendLayout()
        CType(Me.SplitContainerControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.SplitContainerControl1.Panel1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SplitContainerControl1.Panel1.SuspendLayout()
        CType(Me.SplitContainerControl1.Panel2, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SplitContainerControl1.Panel2.SuspendLayout()
        Me.SplitContainerControl1.SuspendLayout()
        CType(Me.RdCounsellorSex.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.DaCounsellor.Properties.CalendarTimeProperties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.DaCounsellor.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtCounsellorPhone.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtCounsellorName.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.CboCounsellorStatus.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.GridControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.GridView1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'ToolStrip2
        '
        Me.ToolStrip2.ImageScalingSize = New System.Drawing.Size(24, 24)
        Me.ToolStrip2.Items.AddRange(New System.Windows.Forms.ToolStripItem() {Me.tsbSave, Me.tbsClear, Me.ToolStripButton3, Me.ToolStripSeparator2, Me.tsbReload})
        Me.ToolStrip2.Location = New System.Drawing.Point(0, 0)
        Me.ToolStrip2.Name = "ToolStrip2"
        Me.ToolStrip2.Padding = New System.Windows.Forms.Padding(0, 0, 3, 0)
        Me.ToolStrip2.Size = New System.Drawing.Size(797, 32)
        Me.ToolStrip2.TabIndex = 4
        Me.ToolStrip2.Text = "ToolStrip2"
        '
        'tsbSave
        '
        Me.tsbSave.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.tsbSave.Image = Global.ART.My.Resources.Resources.Ribbon_Save_16x16
        Me.tsbSave.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.tsbSave.Name = "tsbSave"
        Me.tsbSave.Size = New System.Drawing.Size(32, 28)
        Me.tsbSave.Text = "Save"
        '
        'tbsClear
        '
        Me.tbsClear.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.tbsClear.Image = Global.ART.My.Resources.Resources.New_16x16
        Me.tbsClear.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.tbsClear.Name = "tbsClear"
        Me.tbsClear.Size = New System.Drawing.Size(32, 28)
        Me.tbsClear.Text = "New"
        '
        'ToolStripButton3
        '
        Me.ToolStripButton3.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.ToolStripButton3.Image = Global.ART.My.Resources.Resources.Trash_16x16
        Me.ToolStripButton3.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.ToolStripButton3.Name = "ToolStripButton3"
        Me.ToolStripButton3.Size = New System.Drawing.Size(32, 28)
        Me.ToolStripButton3.Text = "Delete"
        Me.ToolStripButton3.Visible = False
        '
        'ToolStripSeparator2
        '
        Me.ToolStripSeparator2.Name = "ToolStripSeparator2"
        Me.ToolStripSeparator2.Size = New System.Drawing.Size(6, 32)
        '
        'tsbReload
        '
        Me.tsbReload.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.tsbReload.Image = Global.ART.My.Resources.Resources.refresh2_32x32
        Me.tsbReload.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.tsbReload.Name = "tsbReload"
        Me.tsbReload.Size = New System.Drawing.Size(32, 28)
        Me.tsbReload.Text = "Reload Data"
        '
        'SplitContainerControl1
        '
        Me.SplitContainerControl1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.SplitContainerControl1.Location = New System.Drawing.Point(0, 32)
        Me.SplitContainerControl1.Margin = New System.Windows.Forms.Padding(4)
        Me.SplitContainerControl1.Name = "SplitContainerControl1"
        '
        'SplitContainerControl1.Panel1
        '
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.RdCounsellorSex)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.DaCounsellor)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl5)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.txtCounsellorPhone)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl4)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl2)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl1)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.txtCounsellorName)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.LabelControl3)
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.CboCounsellorStatus)
        Me.SplitContainerControl1.Panel1.Text = "Panel1"
        '
        'SplitContainerControl1.Panel2
        '
        Me.SplitContainerControl1.Panel2.Controls.Add(Me.GridControl1)
        Me.SplitContainerControl1.Panel2.Text = "Panel2"
        Me.SplitContainerControl1.Size = New System.Drawing.Size(797, 472)
        Me.SplitContainerControl1.SplitterPosition = 385
        Me.SplitContainerControl1.TabIndex = 0
        Me.SplitContainerControl1.Text = "SplitContainerControl1"
        '
        'RdCounsellorSex
        '
        Me.RdCounsellorSex.Location = New System.Drawing.Point(140, 63)
        Me.RdCounsellorSex.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.RdCounsellorSex.Name = "RdCounsellorSex"
        Me.RdCounsellorSex.Properties.AllowMouseWheel = False
        Me.RdCounsellorSex.Properties.Appearance.BackColor = System.Drawing.Color.Transparent
        Me.RdCounsellorSex.Properties.Appearance.Font = New System.Drawing.Font("Tahoma", 8.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.RdCounsellorSex.Properties.Appearance.Options.UseBackColor = True
        Me.RdCounsellorSex.Properties.Appearance.Options.UseFont = True
        Me.RdCounsellorSex.Properties.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.NoBorder
        Me.RdCounsellorSex.Properties.Items.AddRange(New DevExpress.XtraEditors.Controls.RadioGroupItem() {New DevExpress.XtraEditors.Controls.RadioGroupItem("1", "Male"), New DevExpress.XtraEditors.Controls.RadioGroupItem("0", "Female")})
        Me.RdCounsellorSex.Size = New System.Drawing.Size(219, 40)
        Me.RdCounsellorSex.TabIndex = 2
        '
        'DaCounsellor
        '
        Me.DaCounsellor.EditValue = "01/01/1900"
        Me.DaCounsellor.Location = New System.Drawing.Point(140, 168)
        Me.DaCounsellor.Name = "DaCounsellor"
        Me.DaCounsellor.Properties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.DaCounsellor.Properties.CalendarTimeProperties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.DaCounsellor.Properties.MaskSettings.Set("mask", "d")
        Me.DaCounsellor.Size = New System.Drawing.Size(219, 24)
        Me.DaCounsellor.TabIndex = 4
        '
        'LabelControl5
        '
        Me.LabelControl5.Location = New System.Drawing.Point(16, 172)
        Me.LabelControl5.Margin = New System.Windows.Forms.Padding(4)
        Me.LabelControl5.Name = "LabelControl5"
        Me.LabelControl5.Size = New System.Drawing.Size(36, 18)
        Me.LabelControl5.TabIndex = 14
        Me.LabelControl5.Text = "Date:"
        '
        'txtCounsellorPhone
        '
        Me.txtCounsellorPhone.EditValue = "0"
        Me.txtCounsellorPhone.Location = New System.Drawing.Point(140, 124)
        Me.txtCounsellorPhone.Margin = New System.Windows.Forms.Padding(4)
        Me.txtCounsellorPhone.Name = "txtCounsellorPhone"
        Me.txtCounsellorPhone.Properties.MaskSettings.Set("MaskManagerType", GetType(DevExpress.Data.Mask.RegExpMaskManager))
        Me.txtCounsellorPhone.Properties.MaskSettings.Set("mask", "\d+")
        Me.txtCounsellorPhone.Properties.MaskSettings.Set("MaskManagerSignature", "isOptimistic=False")
        Me.txtCounsellorPhone.Size = New System.Drawing.Size(219, 24)
        Me.txtCounsellorPhone.TabIndex = 3
        '
        'LabelControl4
        '
        Me.LabelControl4.Location = New System.Drawing.Point(16, 128)
        Me.LabelControl4.Margin = New System.Windows.Forms.Padding(4)
        Me.LabelControl4.Name = "LabelControl4"
        Me.LabelControl4.Size = New System.Drawing.Size(45, 18)
        Me.LabelControl4.TabIndex = 12
        Me.LabelControl4.Text = "Phone:"
        '
        'LabelControl2
        '
        Me.LabelControl2.Location = New System.Drawing.Point(16, 75)
        Me.LabelControl2.Margin = New System.Windows.Forms.Padding(4)
        Me.LabelControl2.Name = "LabelControl2"
        Me.LabelControl2.Size = New System.Drawing.Size(29, 18)
        Me.LabelControl2.TabIndex = 10
        Me.LabelControl2.Text = "Sex:"
        '
        'LabelControl1
        '
        Me.LabelControl1.Location = New System.Drawing.Point(16, 29)
        Me.LabelControl1.Margin = New System.Windows.Forms.Padding(4)
        Me.LabelControl1.Name = "LabelControl1"
        Me.LabelControl1.Size = New System.Drawing.Size(49, 18)
        Me.LabelControl1.TabIndex = 4
        Me.LabelControl1.Text = "Name :"
        '
        'txtCounsellorName
        '
        Me.txtCounsellorName.Location = New System.Drawing.Point(140, 27)
        Me.txtCounsellorName.Margin = New System.Windows.Forms.Padding(4)
        Me.txtCounsellorName.Name = "txtCounsellorName"
        Me.txtCounsellorName.Size = New System.Drawing.Size(219, 24)
        Me.txtCounsellorName.TabIndex = 1
        '
        'LabelControl3
        '
        Me.LabelControl3.Location = New System.Drawing.Point(16, 216)
        Me.LabelControl3.Margin = New System.Windows.Forms.Padding(4)
        Me.LabelControl3.Name = "LabelControl3"
        Me.LabelControl3.Size = New System.Drawing.Size(51, 18)
        Me.LabelControl3.TabIndex = 8
        Me.LabelControl3.Text = "Status :"
        '
        'CboCounsellorStatus
        '
        Me.CboCounsellorStatus.Location = New System.Drawing.Point(140, 213)
        Me.CboCounsellorStatus.Margin = New System.Windows.Forms.Padding(4)
        Me.CboCounsellorStatus.Name = "CboCounsellorStatus"
        Me.CboCounsellorStatus.Properties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.CboCounsellorStatus.Properties.Items.AddRange(New Object() {"Disactive", "Active"})
        Me.CboCounsellorStatus.Properties.TextEditStyle = DevExpress.XtraEditors.Controls.TextEditStyles.DisableTextEditor
        Me.CboCounsellorStatus.Size = New System.Drawing.Size(219, 24)
        Me.CboCounsellorStatus.TabIndex = 5
        '
        'GridControl1
        '
        Me.GridControl1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.GridControl1.EmbeddedNavigator.Margin = New System.Windows.Forms.Padding(4)
        Me.GridControl1.Location = New System.Drawing.Point(0, 0)
        Me.GridControl1.MainView = Me.GridView1
        Me.GridControl1.Margin = New System.Windows.Forms.Padding(4)
        Me.GridControl1.Name = "GridControl1"
        Me.GridControl1.Size = New System.Drawing.Size(399, 472)
        Me.GridControl1.TabIndex = 0
        Me.GridControl1.ViewCollection.AddRange(New DevExpress.XtraGrid.Views.Base.BaseView() {Me.GridView1})
        '
        'GridView1
        '
        Me.GridView1.DetailHeight = 485
        Me.GridView1.GridControl = Me.GridControl1
        Me.GridView1.Name = "GridView1"
        Me.GridView1.OptionsBehavior.Editable = False
        Me.GridView1.OptionsSelection.MultiSelect = True
        Me.GridView1.OptionsView.ShowGroupPanel = False
        '
        'frmCounsellor
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(8.0!, 18.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(797, 504)
        Me.Controls.Add(Me.SplitContainerControl1)
        Me.Controls.Add(Me.ToolStrip2)
        Me.Margin = New System.Windows.Forms.Padding(4)
        Me.Name = "frmCounsellor"
        Me.Text = "Counselor"
        Me.ToolStrip2.ResumeLayout(False)
        Me.ToolStrip2.PerformLayout()
        CType(Me.SplitContainerControl1.Panel1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainerControl1.Panel1.ResumeLayout(False)
        Me.SplitContainerControl1.Panel1.PerformLayout()
        CType(Me.SplitContainerControl1.Panel2, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainerControl1.Panel2.ResumeLayout(False)
        CType(Me.SplitContainerControl1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainerControl1.ResumeLayout(False)
        CType(Me.RdCounsellorSex.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.DaCounsellor.Properties.CalendarTimeProperties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.DaCounsellor.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtCounsellorPhone.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtCounsellorName.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.CboCounsellorStatus.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.GridControl1, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.GridView1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents ToolStrip2 As ToolStrip
    Friend WithEvents tsbSave As ToolStripButton
    Friend WithEvents tbsClear As ToolStripButton
    Friend WithEvents ToolStripButton3 As ToolStripButton
    Friend WithEvents ToolStripSeparator2 As ToolStripSeparator
    Friend WithEvents tsbReload As ToolStripButton
    Friend WithEvents SplitContainerControl1 As DevExpress.XtraEditors.SplitContainerControl
    Friend WithEvents LabelControl1 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents txtCounsellorName As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl3 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents CboCounsellorStatus As DevExpress.XtraEditors.ComboBoxEdit
    Friend WithEvents GridControl1 As DevExpress.XtraGrid.GridControl
    Friend WithEvents GridView1 As DevExpress.XtraGrid.Views.Grid.GridView
    Friend WithEvents txtCounsellorPhone As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl4 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl2 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl5 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents DaCounsellor As DevExpress.XtraEditors.DateEdit
    Friend WithEvents RdCounsellorSex As DevExpress.XtraEditors.RadioGroup
End Class
