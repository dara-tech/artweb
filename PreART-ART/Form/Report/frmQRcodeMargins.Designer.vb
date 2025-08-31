<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmQRcodeMargins
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
        Me.PanelControl1 = New DevExpress.XtraEditors.PanelControl()
        Me.txtBottom = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl4 = New DevExpress.XtraEditors.LabelControl()
        Me.txtTop = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl3 = New DevExpress.XtraEditors.LabelControl()
        Me.txtRight = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl2 = New DevExpress.XtraEditors.LabelControl()
        Me.txtLeft = New DevExpress.XtraEditors.TextEdit()
        Me.LabelControl1 = New DevExpress.XtraEditors.LabelControl()
        Me.btnOk = New DevExpress.XtraEditors.SimpleButton()
        Me.btnCancel = New DevExpress.XtraEditors.SimpleButton()
        Me.LabelControl5 = New DevExpress.XtraEditors.LabelControl()
        CType(Me.PanelControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.PanelControl1.SuspendLayout()
        CType(Me.txtBottom.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtTop.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtRight.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.txtLeft.Properties, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'PanelControl1
        '
        Me.PanelControl1.Controls.Add(Me.txtBottom)
        Me.PanelControl1.Controls.Add(Me.LabelControl4)
        Me.PanelControl1.Controls.Add(Me.txtTop)
        Me.PanelControl1.Controls.Add(Me.LabelControl3)
        Me.PanelControl1.Controls.Add(Me.txtRight)
        Me.PanelControl1.Controls.Add(Me.LabelControl2)
        Me.PanelControl1.Controls.Add(Me.txtLeft)
        Me.PanelControl1.Controls.Add(Me.LabelControl1)
        Me.PanelControl1.Location = New System.Drawing.Point(12, 34)
        Me.PanelControl1.Name = "PanelControl1"
        Me.PanelControl1.Size = New System.Drawing.Size(499, 153)
        Me.PanelControl1.TabIndex = 0
        '
        'txtBottom
        '
        Me.txtBottom.Location = New System.Drawing.Point(337, 89)
        Me.txtBottom.Name = "txtBottom"
        Me.txtBottom.Properties.MaskSettings.Set("MaskManagerType", GetType(DevExpress.Data.Mask.NumericMaskManager))
        Me.txtBottom.Properties.MaskSettings.Set("MaskManagerSignature", "allowNull=False")
        Me.txtBottom.Properties.MaskSettings.Set("mask", "f")
        Me.txtBottom.Size = New System.Drawing.Size(140, 24)
        Me.txtBottom.TabIndex = 7
        '
        'LabelControl4
        '
        Me.LabelControl4.Location = New System.Drawing.Point(277, 92)
        Me.LabelControl4.Name = "LabelControl4"
        Me.LabelControl4.Size = New System.Drawing.Size(53, 18)
        Me.LabelControl4.TabIndex = 6
        Me.LabelControl4.Text = "Bottom:"
        '
        'txtTop
        '
        Me.txtTop.Location = New System.Drawing.Point(89, 89)
        Me.txtTop.Name = "txtTop"
        Me.txtTop.Properties.MaskSettings.Set("MaskManagerType", GetType(DevExpress.Data.Mask.NumericMaskManager))
        Me.txtTop.Properties.MaskSettings.Set("MaskManagerSignature", "allowNull=False")
        Me.txtTop.Properties.MaskSettings.Set("mask", "f")
        Me.txtTop.Size = New System.Drawing.Size(140, 24)
        Me.txtTop.TabIndex = 5
        '
        'LabelControl3
        '
        Me.LabelControl3.Location = New System.Drawing.Point(29, 92)
        Me.LabelControl3.Name = "LabelControl3"
        Me.LabelControl3.Size = New System.Drawing.Size(31, 18)
        Me.LabelControl3.TabIndex = 4
        Me.LabelControl3.Text = "Top:"
        '
        'txtRight
        '
        Me.txtRight.Location = New System.Drawing.Point(337, 34)
        Me.txtRight.Name = "txtRight"
        Me.txtRight.Properties.MaskSettings.Set("MaskManagerType", GetType(DevExpress.Data.Mask.NumericMaskManager))
        Me.txtRight.Properties.MaskSettings.Set("MaskManagerSignature", "allowNull=False")
        Me.txtRight.Properties.MaskSettings.Set("mask", "f")
        Me.txtRight.Size = New System.Drawing.Size(140, 24)
        Me.txtRight.TabIndex = 3
        '
        'LabelControl2
        '
        Me.LabelControl2.Location = New System.Drawing.Point(277, 37)
        Me.LabelControl2.Name = "LabelControl2"
        Me.LabelControl2.Size = New System.Drawing.Size(37, 18)
        Me.LabelControl2.TabIndex = 2
        Me.LabelControl2.Text = "Right:"
        '
        'txtLeft
        '
        Me.txtLeft.Location = New System.Drawing.Point(89, 34)
        Me.txtLeft.Name = "txtLeft"
        Me.txtLeft.Properties.MaskSettings.Set("MaskManagerType", GetType(DevExpress.Data.Mask.NumericMaskManager))
        Me.txtLeft.Properties.MaskSettings.Set("MaskManagerSignature", "allowNull=False")
        Me.txtLeft.Properties.MaskSettings.Set("mask", "f")
        Me.txtLeft.Size = New System.Drawing.Size(140, 24)
        Me.txtLeft.TabIndex = 1
        '
        'LabelControl1
        '
        Me.LabelControl1.Location = New System.Drawing.Point(29, 37)
        Me.LabelControl1.Name = "LabelControl1"
        Me.LabelControl1.Size = New System.Drawing.Size(30, 18)
        Me.LabelControl1.TabIndex = 0
        Me.LabelControl1.Text = "Left:"
        '
        'btnOk
        '
        Me.btnOk.Appearance.ForeColor = System.Drawing.Color.Black
        Me.btnOk.Appearance.Options.UseForeColor = True
        Me.btnOk.Location = New System.Drawing.Point(237, 208)
        Me.btnOk.Name = "btnOk"
        Me.btnOk.Size = New System.Drawing.Size(105, 32)
        Me.btnOk.TabIndex = 1
        Me.btnOk.Text = "Ok"
        '
        'btnCancel
        '
        Me.btnCancel.Location = New System.Drawing.Point(379, 208)
        Me.btnCancel.Name = "btnCancel"
        Me.btnCancel.Size = New System.Drawing.Size(105, 32)
        Me.btnCancel.TabIndex = 2
        Me.btnCancel.Text = "Cancel"
        '
        'LabelControl5
        '
        Me.LabelControl5.Location = New System.Drawing.Point(13, 12)
        Me.LabelControl5.Name = "LabelControl5"
        Me.LabelControl5.Size = New System.Drawing.Size(44, 18)
        Me.LabelControl5.TabIndex = 3
        Me.LabelControl5.Text = "Inches"
        '
        'frmQRcodeMargins
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(8.0!, 18.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(525, 264)
        Me.Controls.Add(Me.LabelControl5)
        Me.Controls.Add(Me.btnCancel)
        Me.Controls.Add(Me.btnOk)
        Me.Controls.Add(Me.PanelControl1)
        Me.IconOptions.ShowIcon = False
        Me.Name = "frmQRcodeMargins"
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "QRcodeMargins"
        CType(Me.PanelControl1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.PanelControl1.ResumeLayout(False)
        Me.PanelControl1.PerformLayout()
        CType(Me.txtBottom.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtTop.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtRight.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.txtLeft.Properties, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents PanelControl1 As DevExpress.XtraEditors.PanelControl
    Friend WithEvents txtBottom As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl4 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents txtTop As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl3 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents txtRight As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl2 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents txtLeft As DevExpress.XtraEditors.TextEdit
    Friend WithEvents LabelControl1 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents btnOk As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents btnCancel As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents LabelControl5 As DevExpress.XtraEditors.LabelControl
End Class
