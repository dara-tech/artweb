<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmReTest
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
        Me.TabControl1 = New System.Windows.Forms.TabControl()
        Me.TabPage1 = New System.Windows.Forms.TabPage()
        Me.GridControl1 = New DevExpress.XtraGrid.GridControl()
        Me.GridView1 = New DevExpress.XtraGrid.Views.Grid.GridView()
        Me.ToolStrip1 = New System.Windows.Forms.ToolStrip()
        Me.ToolStripLabel1 = New System.Windows.Forms.ToolStripLabel()
        Me.tscView = New System.Windows.Forms.ToolStripComboBox()
        Me.ToolStripSeparator1 = New System.Windows.Forms.ToolStripSeparator()
        Me.ToolStripLabel2 = New System.Windows.Forms.ToolStripLabel()
        Me.tspVCCTID = New System.Windows.Forms.ToolStripTextBox()
        Me.TabPage2 = New System.Windows.Forms.TabPage()
        Me.Panel1 = New System.Windows.Forms.Panel()
        Me.PanelControl1 = New DevExpress.XtraEditors.PanelControl()
        Me.LabelControl5 = New DevExpress.XtraEditors.LabelControl()
        Me.rdResultHIV = New DevExpress.XtraEditors.RadioGroup()
        Me.chkStatus = New DevExpress.XtraEditors.CheckEdit()
        Me.txtVcctID = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl1 = New DevExpress.XtraEditors.LabelControl()
        Me.cboVCCTCode = New DevExpress.XtraEditors.ComboBoxEdit()
        Me.LabelControl4 = New DevExpress.XtraEditors.LabelControl()
        Me.rdSex = New DevExpress.XtraEditors.RadioGroup()
        Me.LabelControl27 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl7 = New DevExpress.XtraEditors.LabelControl()
        Me.DaTest = New DevExpress.XtraEditors.DateEdit()
        Me.txtAge = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl3 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl32 = New DevExpress.XtraEditors.LabelControl()
        Me.LabelControl2 = New DevExpress.XtraEditors.LabelControl()
        Me.ToolStrip2 = New System.Windows.Forms.ToolStrip()
        Me.tsbSave = New System.Windows.Forms.ToolStripButton()
        Me.tbsClear = New System.Windows.Forms.ToolStripButton()
        Me.tsbDelete = New System.Windows.Forms.ToolStripButton()
        Me.TabControl1.SuspendLayout()
        Me.TabPage1.SuspendLayout()
        CType(Me.GridControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.GridView1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.ToolStrip1.SuspendLayout()
        Me.TabPage2.SuspendLayout()
        Me.Panel1.SuspendLayout()
        CType(Me.PanelControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.PanelControl1.SuspendLayout()
        CType(Me.rdResultHIV.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.chkStatus.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtVcctID.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.cboVCCTCode.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.rdSex.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.DaTest.Properties.CalendarTimeProperties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.DaTest.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtAge.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.ToolStrip2.SuspendLayout()
        Me.SuspendLayout()
        '
        'TabControl1
        '
        Me.TabControl1.Controls.Add(Me.TabPage1)
        Me.TabControl1.Controls.Add(Me.TabPage2)
        Me.TabControl1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.TabControl1.Location = New System.Drawing.Point(0, 0)
        Me.TabControl1.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.TabControl1.Name = "TabControl1"
        Me.TabControl1.SelectedIndex = 0
        Me.TabControl1.Size = New System.Drawing.Size(956, 610)
        Me.TabControl1.TabIndex = 1
        '
        'TabPage1
        '
        Me.TabPage1.Controls.Add(Me.GridControl1)
        Me.TabPage1.Controls.Add(Me.ToolStrip1)
        Me.TabPage1.Location = New System.Drawing.Point(4, 27)
        Me.TabPage1.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.TabPage1.Name = "TabPage1"
        Me.TabPage1.Padding = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.TabPage1.Size = New System.Drawing.Size(948, 579)
        Me.TabPage1.TabIndex = 0
        Me.TabPage1.Text = "Detail"
        Me.TabPage1.UseVisualStyleBackColor = True
        '
        'GridControl1
        '
        Me.GridControl1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.GridControl1.Font = New System.Drawing.Font("Khmer OS Content", 8.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.GridControl1.Location = New System.Drawing.Point(3, 42)
        Me.GridControl1.MainView = Me.GridView1
        Me.GridControl1.Name = "GridControl1"
        Me.GridControl1.Size = New System.Drawing.Size(942, 533)
        Me.GridControl1.TabIndex = 4
        Me.GridControl1.ViewCollection.AddRange(New DevExpress.XtraGrid.Views.Base.BaseView() {Me.GridView1})
        '
        'GridView1
        '
        Me.GridView1.Appearance.ColumnFilterButton.Font = New System.Drawing.Font("Tahoma", 8.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.GridView1.Appearance.ColumnFilterButton.Options.UseFont = True
        Me.GridView1.Appearance.Row.Font = New System.Drawing.Font("Khmer OS Content", 8.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.GridView1.Appearance.Row.Options.UseFont = True
        Me.GridView1.DetailHeight = 332
        Me.GridView1.GridControl = Me.GridControl1
        Me.GridView1.Name = "GridView1"
        Me.GridView1.OptionsBehavior.Editable = False
        Me.GridView1.OptionsMenu.ShowConditionalFormattingItem = True
        Me.GridView1.OptionsSelection.MultiSelect = True
        Me.GridView1.OptionsView.ShowFooter = True
        Me.GridView1.OptionsView.ShowGroupPanel = False
        '
        'ToolStrip1
        '
        Me.ToolStrip1.ImageScalingSize = New System.Drawing.Size(24, 24)
        Me.ToolStrip1.Items.AddRange(New System.Windows.Forms.ToolStripItem() {Me.ToolStripLabel1, Me.tscView, Me.ToolStripSeparator1, Me.ToolStripLabel2, Me.tspVCCTID})
        Me.ToolStrip1.Location = New System.Drawing.Point(3, 4)
        Me.ToolStrip1.Name = "ToolStrip1"
        Me.ToolStrip1.Size = New System.Drawing.Size(942, 38)
        Me.ToolStrip1.TabIndex = 3
        Me.ToolStrip1.Text = "ToolStrip1"
        '
        'ToolStripLabel1
        '
        Me.ToolStripLabel1.Font = New System.Drawing.Font("Khmer OS Freehand", 8.0!)
        Me.ToolStripLabel1.Name = "ToolStripLabel1"
        Me.ToolStripLabel1.Size = New System.Drawing.Size(108, 34)
        Me.ToolStripLabel1.Text = "មើលទិន្នន័យ"
        '
        'tscView
        '
        Me.tscView.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.tscView.Items.AddRange(New Object() {"មិនមើល", "មើលទាំងអស់"})
        Me.tscView.Name = "tscView"
        Me.tscView.Size = New System.Drawing.Size(159, 38)
        '
        'ToolStripSeparator1
        '
        Me.ToolStripSeparator1.Name = "ToolStripSeparator1"
        Me.ToolStripSeparator1.Size = New System.Drawing.Size(6, 38)
        '
        'ToolStripLabel2
        '
        Me.ToolStripLabel2.Name = "ToolStripLabel2"
        Me.ToolStripLabel2.Size = New System.Drawing.Size(72, 34)
        Me.ToolStripLabel2.Text = "VCCT-ID:"
        '
        'tspVCCTID
        '
        Me.tspVCCTID.Font = New System.Drawing.Font("Segoe UI", 9.0!)
        Me.tspVCCTID.Name = "tspVCCTID"
        Me.tspVCCTID.Size = New System.Drawing.Size(132, 38)
        '
        'TabPage2
        '
        Me.TabPage2.Controls.Add(Me.Panel1)
        Me.TabPage2.Controls.Add(Me.ToolStrip2)
        Me.TabPage2.Location = New System.Drawing.Point(4, 27)
        Me.TabPage2.Margin = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.TabPage2.Name = "TabPage2"
        Me.TabPage2.Padding = New System.Windows.Forms.Padding(3, 4, 3, 4)
        Me.TabPage2.Size = New System.Drawing.Size(948, 579)
        Me.TabPage2.TabIndex = 1
        Me.TabPage2.Text = "Page1"
        Me.TabPage2.UseVisualStyleBackColor = True
        '
        'Panel1
        '
        Me.Panel1.AutoScroll = True
        Me.Panel1.Controls.Add(Me.PanelControl1)
        Me.Panel1.Controls.Add(Me.LabelControl2)
        Me.Panel1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.Panel1.Location = New System.Drawing.Point(3, 36)
        Me.Panel1.Name = "Panel1"
        Me.Panel1.Size = New System.Drawing.Size(942, 539)
        Me.Panel1.TabIndex = 4
        '
        'PanelControl1
        '
        Me.PanelControl1.Controls.Add(Me.LabelControl5)
        Me.PanelControl1.Controls.Add(Me.rdResultHIV)
        Me.PanelControl1.Controls.Add(Me.chkStatus)
        Me.PanelControl1.Controls.Add(Me.txtVcctID)
        Me.PanelControl1.Controls.Add(Me.LabelControl1)
        Me.PanelControl1.Controls.Add(Me.cboVCCTCode)
        Me.PanelControl1.Controls.Add(Me.LabelControl4)
        Me.PanelControl1.Controls.Add(Me.rdSex)
        Me.PanelControl1.Controls.Add(Me.LabelControl27)
        Me.PanelControl1.Controls.Add(Me.LabelControl7)
        Me.PanelControl1.Controls.Add(Me.DaTest)
        Me.PanelControl1.Controls.Add(Me.txtAge)
        Me.PanelControl1.Controls.Add(Me.LabelControl3)
        Me.PanelControl1.Controls.Add(Me.LabelControl32)
        Me.PanelControl1.Location = New System.Drawing.Point(44, 110)
        Me.PanelControl1.Name = "PanelControl1"
        Me.PanelControl1.Size = New System.Drawing.Size(810, 358)
        Me.PanelControl1.TabIndex = 186
        '
        'LabelControl5
        '
        Me.LabelControl5.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.0!)
        Me.LabelControl5.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl5.Appearance.Options.UseFont = True
        Me.LabelControl5.Appearance.Options.UseForeColor = True
        Me.LabelControl5.Location = New System.Drawing.Point(78, 191)
        Me.LabelControl5.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.LabelControl5.Name = "LabelControl5"
        Me.LabelControl5.Size = New System.Drawing.Size(69, 34)
        Me.LabelControl5.TabIndex = 186
        Me.LabelControl5.Text = "លទ្ធផល:"
        '
        'rdResultHIV
        '
        Me.rdResultHIV.EditValue = "0"
        Me.rdResultHIV.Location = New System.Drawing.Point(157, 180)
        Me.rdResultHIV.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.rdResultHIV.Name = "rdResultHIV"
        Me.rdResultHIV.Properties.AllowMouseWheel = False
        Me.rdResultHIV.Properties.Appearance.BackColor = System.Drawing.Color.Transparent
        Me.rdResultHIV.Properties.Appearance.Font = New System.Drawing.Font("Khmer OS Siemreap", 11.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.rdResultHIV.Properties.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(192, Byte), Integer), CType(CType(64, Byte), Integer), CType(CType(0, Byte), Integer))
        Me.rdResultHIV.Properties.Appearance.Options.UseBackColor = True
        Me.rdResultHIV.Properties.Appearance.Options.UseFont = True
        Me.rdResultHIV.Properties.Appearance.Options.UseForeColor = True
        Me.rdResultHIV.Properties.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.NoBorder
        Me.rdResultHIV.Properties.Items.AddRange(New DevExpress.XtraEditors.Controls.RadioGroupItem() {New DevExpress.XtraEditors.Controls.RadioGroupItem("1", "1.អវិជ្ជមាន"), New DevExpress.XtraEditors.Controls.RadioGroupItem("2", "2.វិជ្ជមាន"), New DevExpress.XtraEditors.Controls.RadioGroupItem("3", "3.មិនអាចកំណត់បាន")})
        Me.rdResultHIV.Size = New System.Drawing.Size(620, 56)
        Me.rdResultHIV.TabIndex = 185
        '
        'chkStatus
        '
        Me.chkStatus.Location = New System.Drawing.Point(229, 19)
        Me.chkStatus.Name = "chkStatus"
        Me.chkStatus.Properties.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.74627!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.chkStatus.Properties.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.chkStatus.Properties.Appearance.Options.UseFont = True
        Me.chkStatus.Properties.Appearance.Options.UseForeColor = True
        Me.chkStatus.Properties.Caption = "អ្នកជំងឺមកពី Site ផ្សេងធ្វើតេស្តបញ្ជាក់"
        Me.chkStatus.Size = New System.Drawing.Size(339, 42)
        Me.chkStatus.TabIndex = 0
        '
        'txtVcctID
        '
        Me.txtVcctID.EditValue = ""
        Me.txtVcctID.Location = New System.Drawing.Point(157, 69)
        Me.txtVcctID.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.txtVcctID.Name = "txtVcctID"
        Me.txtVcctID.Properties.Appearance.Font = New System.Drawing.Font("Segoe UI", 10.74627!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.txtVcctID.Properties.Appearance.Options.UseFont = True
        Me.txtVcctID.Properties.MaskSettings.Set("MaskManagerType", GetType(DevExpress.Data.Mask.NumericMaskManager))
        Me.txtVcctID.Properties.MaskSettings.Set("mask", "d")
        Me.txtVcctID.Properties.MaskSettings.Set("MaskManagerSignature", "allowNull=False")
        Me.txtVcctID.Size = New System.Drawing.Size(222, 34)
        Me.txtVcctID.TabIndex = 123
        '
        'LabelControl1
        '
        Me.LabelControl1.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.0!)
        Me.LabelControl1.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl1.Appearance.Options.UseFont = True
        Me.LabelControl1.Appearance.Options.UseForeColor = True
        Me.LabelControl1.Location = New System.Drawing.Point(17, 72)
        Me.LabelControl1.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.LabelControl1.Name = "LabelControl1"
        Me.LabelControl1.Size = New System.Drawing.Size(133, 34)
        Me.LabelControl1.TabIndex = 119
        Me.LabelControl1.Text = "លេខកូដអតិថិជន:"
        '
        'cboVCCTCode
        '
        Me.cboVCCTCode.Location = New System.Drawing.Point(521, 69)
        Me.cboVCCTCode.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.cboVCCTCode.Name = "cboVCCTCode"
        Me.cboVCCTCode.Properties.Appearance.Font = New System.Drawing.Font("Segoe UI", 10.74627!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.cboVCCTCode.Properties.Appearance.Options.UseFont = True
        Me.cboVCCTCode.Properties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.cboVCCTCode.Properties.TextEditStyle = DevExpress.XtraEditors.Controls.TextEditStyles.DisableTextEditor
        Me.cboVCCTCode.Size = New System.Drawing.Size(256, 34)
        Me.cboVCCTCode.TabIndex = 128
        '
        'LabelControl4
        '
        Me.LabelControl4.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.0!)
        Me.LabelControl4.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl4.Appearance.Options.UseFont = True
        Me.LabelControl4.Appearance.Options.UseForeColor = True
        Me.LabelControl4.Location = New System.Drawing.Point(388, 70)
        Me.LabelControl4.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.LabelControl4.Name = "LabelControl4"
        Me.LabelControl4.Size = New System.Drawing.Size(127, 34)
        Me.LabelControl4.TabIndex = 121
        Me.LabelControl4.Text = "លេខកូដ VCCT:"
        '
        'rdSex
        '
        Me.rdSex.Location = New System.Drawing.Point(157, 121)
        Me.rdSex.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.rdSex.Name = "rdSex"
        Me.rdSex.Properties.AllowMouseWheel = False
        Me.rdSex.Properties.Appearance.BackColor = System.Drawing.Color.Transparent
        Me.rdSex.Properties.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.74627!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.rdSex.Properties.Appearance.Options.UseBackColor = True
        Me.rdSex.Properties.Appearance.Options.UseFont = True
        Me.rdSex.Properties.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.NoBorder
        Me.rdSex.Properties.Items.AddRange(New DevExpress.XtraEditors.Controls.RadioGroupItem() {New DevExpress.XtraEditors.Controls.RadioGroupItem("1", "ប្រុស"), New DevExpress.XtraEditors.Controls.RadioGroupItem("0", "ស្រី")})
        Me.rdSex.Size = New System.Drawing.Size(255, 51)
        Me.rdSex.TabIndex = 125
        '
        'LabelControl27
        '
        Me.LabelControl27.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.0!)
        Me.LabelControl27.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl27.Appearance.Options.UseFont = True
        Me.LabelControl27.Appearance.Options.UseForeColor = True
        Me.LabelControl27.Location = New System.Drawing.Point(624, 131)
        Me.LabelControl27.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.LabelControl27.Name = "LabelControl27"
        Me.LabelControl27.Size = New System.Drawing.Size(19, 34)
        Me.LabelControl27.TabIndex = 134
        Me.LabelControl27.Text = "ឆ្នាំ"
        '
        'LabelControl7
        '
        Me.LabelControl7.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.0!)
        Me.LabelControl7.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl7.Appearance.Options.UseFont = True
        Me.LabelControl7.Appearance.Options.UseForeColor = True
        Me.LabelControl7.Location = New System.Drawing.Point(111, 129)
        Me.LabelControl7.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.LabelControl7.Name = "LabelControl7"
        Me.LabelControl7.Size = New System.Drawing.Size(36, 34)
        Me.LabelControl7.TabIndex = 127
        Me.LabelControl7.Text = "ភេទ:"
        '
        'DaTest
        '
        Me.DaTest.CausesValidation = False
        Me.DaTest.EditValue = "01/01/1900"
        Me.DaTest.Location = New System.Drawing.Point(159, 263)
        Me.DaTest.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.DaTest.Name = "DaTest"
        Me.DaTest.Properties.AllowMouseWheel = False
        Me.DaTest.Properties.Appearance.Font = New System.Drawing.Font("Segoe UI", 9.671641!)
        Me.DaTest.Properties.Appearance.Options.UseFont = True
        Me.DaTest.Properties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.DaTest.Properties.CalendarTimeProperties.Buttons.AddRange(New DevExpress.XtraEditors.Controls.EditorButton() {New DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)})
        Me.DaTest.Properties.EditFormat.FormatType = DevExpress.Utils.FormatType.Custom
        Me.DaTest.Properties.MaskSettings.Set("mask", "d")
        Me.DaTest.Properties.MaskSettings.Set("isAutoComplete", False)
        Me.DaTest.Properties.MaskSettings.Set("isOptimistic", False)
        Me.DaTest.Properties.MaskSettings.Set("placeholder", Global.Microsoft.VisualBasic.ChrW(45))
        Me.DaTest.Properties.Name = "DaReg"
        Me.DaTest.Properties.NullText = "dd-MM-yyyy"
        Me.DaTest.Size = New System.Drawing.Size(174, 32)
        Me.DaTest.TabIndex = 124
        Me.DaTest.UpdateSelectionWhenNavigating = True
        '
        'txtAge
        '
        Me.txtAge.Location = New System.Drawing.Point(521, 133)
        Me.txtAge.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.txtAge.Name = "txtAge"
        Me.txtAge.Properties.Appearance.Font = New System.Drawing.Font("Segoe UI", 10.74627!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.txtAge.Properties.Appearance.Options.UseFont = True
        Me.txtAge.Properties.MaskSettings.Set("MaskManagerType", GetType(DevExpress.Data.Mask.NumericMaskManager))
        Me.txtAge.Properties.MaskSettings.Set("MaskManagerSignature", "allowNull=False")
        Me.txtAge.Properties.MaskSettings.Set("mask", "d")
        Me.txtAge.Size = New System.Drawing.Size(91, 34)
        Me.txtAge.TabIndex = 126
        '
        'LabelControl3
        '
        Me.LabelControl3.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.0!)
        Me.LabelControl3.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl3.Appearance.Options.UseFont = True
        Me.LabelControl3.Appearance.Options.UseForeColor = True
        Me.LabelControl3.Location = New System.Drawing.Point(54, 264)
        Me.LabelControl3.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.LabelControl3.Name = "LabelControl3"
        Me.LabelControl3.Size = New System.Drawing.Size(96, 34)
        Me.LabelControl3.TabIndex = 120
        Me.LabelControl3.Text = "ថ្ងៃខែធ្វើតេស្ត:"
        '
        'LabelControl32
        '
        Me.LabelControl32.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 10.0!)
        Me.LabelControl32.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl32.Appearance.Options.UseFont = True
        Me.LabelControl32.Appearance.Options.UseForeColor = True
        Me.LabelControl32.Location = New System.Drawing.Point(463, 131)
        Me.LabelControl32.Margin = New System.Windows.Forms.Padding(5, 7, 5, 7)
        Me.LabelControl32.Name = "LabelControl32"
        Me.LabelControl32.Size = New System.Drawing.Size(49, 34)
        Me.LabelControl32.TabIndex = 131
        Me.LabelControl32.Text = "អាយុ :"
        '
        'LabelControl2
        '
        Me.LabelControl2.Appearance.Font = New System.Drawing.Font("Khmer OS Content", 18.26866!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.LabelControl2.Appearance.ForeColor = System.Drawing.Color.FromArgb(CType(CType(0, Byte), Integer), CType(CType(0, Byte), Integer), CType(CType(192, Byte), Integer))
        Me.LabelControl2.Appearance.Options.UseFont = True
        Me.LabelControl2.Appearance.Options.UseForeColor = True
        Me.LabelControl2.Location = New System.Drawing.Point(102, 26)
        Me.LabelControl2.Name = "LabelControl2"
        Me.LabelControl2.Size = New System.Drawing.Size(717, 64)
        Me.LabelControl2.TabIndex = 185
        Me.LabelControl2.Text = "ទំរង់បញ្ចូលអ្នកជំងឺដែលមកធ្វើតេស្តមុនចាប់ផ្តើម ART"
        '
        'ToolStrip2
        '
        Me.ToolStrip2.ImageScalingSize = New System.Drawing.Size(24, 24)
        Me.ToolStrip2.Items.AddRange(New System.Windows.Forms.ToolStripItem() {Me.tsbSave, Me.tbsClear, Me.tsbDelete})
        Me.ToolStrip2.Location = New System.Drawing.Point(3, 4)
        Me.ToolStrip2.Name = "ToolStrip2"
        Me.ToolStrip2.Size = New System.Drawing.Size(942, 32)
        Me.ToolStrip2.TabIndex = 2
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
        'tsbDelete
        '
        Me.tsbDelete.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.tsbDelete.Enabled = False
        Me.tsbDelete.Image = Global.ART.My.Resources.Resources.Trash_16x16
        Me.tsbDelete.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.tsbDelete.Name = "tsbDelete"
        Me.tsbDelete.Size = New System.Drawing.Size(32, 28)
        Me.tsbDelete.Text = "Delete"
        '
        'frmReTest
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(8.0!, 18.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(956, 610)
        Me.Controls.Add(Me.TabControl1)
        Me.Name = "frmReTest"
        Me.Text = "ReTest"
        Me.TabControl1.ResumeLayout(False)
        Me.TabPage1.ResumeLayout(False)
        Me.TabPage1.PerformLayout()
        CType(Me.GridControl1, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.GridView1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ToolStrip1.ResumeLayout(False)
        Me.ToolStrip1.PerformLayout()
        Me.TabPage2.ResumeLayout(False)
        Me.TabPage2.PerformLayout()
        Me.Panel1.ResumeLayout(False)
        Me.Panel1.PerformLayout()
        CType(Me.PanelControl1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.PanelControl1.ResumeLayout(False)
        Me.PanelControl1.PerformLayout()
        CType(Me.rdResultHIV.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.chkStatus.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtVcctID.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.cboVCCTCode.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.rdSex.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.DaTest.Properties.CalendarTimeProperties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.DaTest.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtAge.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ToolStrip2.ResumeLayout(False)
        Me.ToolStrip2.PerformLayout()
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents TabControl1 As TabControl
    Friend WithEvents TabPage1 As TabPage
    Friend WithEvents GridControl1 As DevExpress.XtraGrid.GridControl
    Friend WithEvents GridView1 As DevExpress.XtraGrid.Views.Grid.GridView
    Friend WithEvents ToolStrip1 As ToolStrip
    Friend WithEvents ToolStripLabel1 As ToolStripLabel
    Friend WithEvents tscView As ToolStripComboBox
    Friend WithEvents ToolStripSeparator1 As ToolStripSeparator
    Friend WithEvents ToolStripLabel2 As ToolStripLabel
    Friend WithEvents tspVCCTID As ToolStripTextBox
    Friend WithEvents TabPage2 As TabPage
    Friend WithEvents Panel1 As Panel
    Friend WithEvents PanelControl1 As DevExpress.XtraEditors.PanelControl
    Friend WithEvents chkStatus As DevExpress.XtraEditors.CheckEdit
    Friend WithEvents txtVcctID As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl1 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents cboVCCTCode As DevExpress.XtraEditors.ComboBoxEdit
    Friend WithEvents LabelControl4 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents rdSex As DevExpress.XtraEditors.RadioGroup
    Friend WithEvents LabelControl27 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl7 As DevExpress.XtraEditors.LabelControl
    Private WithEvents DaTest As DevExpress.XtraEditors.DateEdit
    Friend WithEvents txtAge As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl3 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl32 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl2 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents ToolStrip2 As ToolStrip
    Friend WithEvents tsbSave As ToolStripButton
    Friend WithEvents tbsClear As ToolStripButton
    Friend WithEvents tsbDelete As ToolStripButton
    Friend WithEvents LabelControl5 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents rdResultHIV As DevExpress.XtraEditors.RadioGroup
End Class
