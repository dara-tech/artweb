<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmFindLost
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
        Dim resources As System.ComponentModel.ComponentResourceManager = New System.ComponentModel.ComponentResourceManager(GetType(frmFindLost))
        Dim ButtonImageOptions1 As DevExpress.XtraEditors.ButtonsPanelControl.ButtonImageOptions = New DevExpress.XtraEditors.ButtonsPanelControl.ButtonImageOptions()
        Me.SplitContainerControl1 = New DevExpress.XtraEditors.SplitContainerControl()
        Me.SplitContainerControl3 = New DevExpress.XtraEditors.SplitContainerControl()
        Me.GroupControl2 = New DevExpress.XtraEditors.GroupControl()
        Me.lblaART = New System.Windows.Forms.Label()
        Me.GroupControl1 = New DevExpress.XtraEditors.GroupControl()
        Me.lblaPreART = New System.Windows.Forms.Label()
        Me.LabelControl3 = New DevExpress.XtraEditors.LabelControl()
        Me.SplitContainerControl2 = New DevExpress.XtraEditors.SplitContainerControl()
        Me.lblExposed = New System.Windows.Forms.Label()
        Me.LabelControl1 = New DevExpress.XtraEditors.LabelControl()
        Me.btnClose = New DevExpress.XtraEditors.SimpleButton()
        Me.btnSearch = New DevExpress.XtraEditors.SimpleButton()
        Me.GroupControl3 = New DevExpress.XtraEditors.GroupControl()
        Me.lblCART = New System.Windows.Forms.Label()
        Me.GroupControl4 = New DevExpress.XtraEditors.GroupControl()
        Me.lblCPreART = New System.Windows.Forms.Label()
        Me.LabelControl2 = New DevExpress.XtraEditors.LabelControl()
        CType(Me.SplitContainerControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SplitContainerControl1.SuspendLayout()
        CType(Me.SplitContainerControl3, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SplitContainerControl3.SuspendLayout()
        CType(Me.GroupControl2, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.GroupControl2.SuspendLayout()
        CType(Me.GroupControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.GroupControl1.SuspendLayout()
        CType(Me.SplitContainerControl2, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SplitContainerControl2.SuspendLayout()
        CType(Me.GroupControl3, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.GroupControl3.SuspendLayout()
        CType(Me.GroupControl4, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.GroupControl4.SuspendLayout()
        Me.SuspendLayout()
        '
        'SplitContainerControl1
        '
        Me.SplitContainerControl1.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.[Default]
        Me.SplitContainerControl1.ContentImage = CType(resources.GetObject("SplitContainerControl1.ContentImage"), System.Drawing.Image)
        ButtonImageOptions1.Image = CType(resources.GetObject("ButtonImageOptions1.Image"), System.Drawing.Image)
        Me.SplitContainerControl1.CustomHeaderButtons.AddRange(New DevExpress.XtraEditors.ButtonPanel.IBaseButton() {New DevExpress.XtraEditors.ButtonsPanelControl.GroupBoxButton("Search..", True, ButtonImageOptions1, DevExpress.XtraBars.Docking2010.ButtonStyle.PushButton, "", -1, True, Nothing, True, False, True, Nothing, -1)})
        Me.SplitContainerControl1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.SplitContainerControl1.Location = New System.Drawing.Point(0, 0)
        Me.SplitContainerControl1.Name = "SplitContainerControl1"
        Me.SplitContainerControl1.Panel1.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.Flat
        Me.SplitContainerControl1.Panel1.Controls.Add(Me.SplitContainerControl3)
        Me.SplitContainerControl1.Panel2.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.Flat
        Me.SplitContainerControl1.Panel2.Controls.Add(Me.SplitContainerControl2)
        Me.SplitContainerControl1.Panel2.Text = "Panel2"
        Me.SplitContainerControl1.Size = New System.Drawing.Size(478, 222)
        Me.SplitContainerControl1.SplitterPosition = 156
        Me.SplitContainerControl1.TabIndex = 0
        '
        'SplitContainerControl3
        '
        Me.SplitContainerControl3.Dock = System.Windows.Forms.DockStyle.Fill
        Me.SplitContainerControl3.Horizontal = False
        Me.SplitContainerControl3.Location = New System.Drawing.Point(0, 0)
        Me.SplitContainerControl3.Name = "SplitContainerControl3"
        Me.SplitContainerControl3.Panel1.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.Simple
        Me.SplitContainerControl3.Panel1.Controls.Add(Me.GroupControl2)
        Me.SplitContainerControl3.Panel1.Controls.Add(Me.GroupControl1)
        Me.SplitContainerControl3.Panel1.Controls.Add(Me.LabelControl3)
        Me.SplitContainerControl3.Panel1.Text = "Panel1"
        Me.SplitContainerControl3.Panel2.Text = "Panel2"
        Me.SplitContainerControl3.Size = New System.Drawing.Size(152, 214)
        Me.SplitContainerControl3.SplitterPosition = 209
        Me.SplitContainerControl3.TabIndex = 3
        Me.SplitContainerControl3.Text = "SplitContainerControl3"
        '
        'GroupControl2
        '
        Me.GroupControl2.Controls.Add(Me.lblaART)
        Me.GroupControl2.Location = New System.Drawing.Point(17, 118)
        Me.GroupControl2.Name = "GroupControl2"
        Me.GroupControl2.Size = New System.Drawing.Size(117, 54)
        Me.GroupControl2.TabIndex = 4
        Me.GroupControl2.Text = "ART"
        '
        'lblaART
        '
        Me.lblaART.AutoSize = True
        Me.lblaART.Font = New System.Drawing.Font("Tahoma", 15.0!)
        Me.lblaART.Location = New System.Drawing.Point(28, 25)
        Me.lblaART.Name = "lblaART"
        Me.lblaART.Size = New System.Drawing.Size(17, 24)
        Me.lblaART.TabIndex = 2
        Me.lblaART.Text = "-"
        '
        'GroupControl1
        '
        Me.GroupControl1.Controls.Add(Me.lblaPreART)
        Me.GroupControl1.Location = New System.Drawing.Point(17, 39)
        Me.GroupControl1.Name = "GroupControl1"
        Me.GroupControl1.Size = New System.Drawing.Size(117, 54)
        Me.GroupControl1.TabIndex = 3
        Me.GroupControl1.Text = "PreART"
        '
        'lblaPreART
        '
        Me.lblaPreART.AutoSize = True
        Me.lblaPreART.Font = New System.Drawing.Font("Tahoma", 15.0!)
        Me.lblaPreART.Location = New System.Drawing.Point(28, 24)
        Me.lblaPreART.Name = "lblaPreART"
        Me.lblaPreART.Size = New System.Drawing.Size(17, 24)
        Me.lblaPreART.TabIndex = 0
        Me.lblaPreART.Text = "-"
        '
        'LabelControl3
        '
        Me.LabelControl3.Appearance.Font = New System.Drawing.Font("Tahoma", 9.0!, System.Drawing.FontStyle.Bold)
        Me.LabelControl3.Appearance.Options.UseFont = True
        Me.LabelControl3.Location = New System.Drawing.Point(58, 4)
        Me.LabelControl3.Name = "LabelControl3"
        Me.LabelControl3.Size = New System.Drawing.Size(34, 14)
        Me.LabelControl3.TabIndex = 2
        Me.LabelControl3.Text = "Adult"
        '
        'SplitContainerControl2
        '
        Me.SplitContainerControl2.Dock = System.Windows.Forms.DockStyle.Fill
        Me.SplitContainerControl2.Horizontal = False
        Me.SplitContainerControl2.Location = New System.Drawing.Point(0, 0)
        Me.SplitContainerControl2.Name = "SplitContainerControl2"
        Me.SplitContainerControl2.Panel1.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.Simple
        Me.SplitContainerControl2.Panel1.Controls.Add(Me.lblExposed)
        Me.SplitContainerControl2.Panel1.Controls.Add(Me.LabelControl1)
        Me.SplitContainerControl2.Panel1.Text = "Panel1"
        Me.SplitContainerControl2.Panel2.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.Simple
        Me.SplitContainerControl2.Panel2.Controls.Add(Me.btnClose)
        Me.SplitContainerControl2.Panel2.Controls.Add(Me.btnSearch)
        Me.SplitContainerControl2.Panel2.Controls.Add(Me.GroupControl3)
        Me.SplitContainerControl2.Panel2.Controls.Add(Me.GroupControl4)
        Me.SplitContainerControl2.Panel2.Controls.Add(Me.LabelControl2)
        Me.SplitContainerControl2.Panel2.Text = "Panel2"
        Me.SplitContainerControl2.Size = New System.Drawing.Size(309, 214)
        Me.SplitContainerControl2.SplitterPosition = 63
        Me.SplitContainerControl2.TabIndex = 0
        Me.SplitContainerControl2.Text = "SplitContainerControl2"
        '
        'lblExposed
        '
        Me.lblExposed.AutoSize = True
        Me.lblExposed.Font = New System.Drawing.Font("Tahoma", 15.0!)
        Me.lblExposed.Location = New System.Drawing.Point(105, 25)
        Me.lblExposed.Name = "lblExposed"
        Me.lblExposed.Size = New System.Drawing.Size(17, 24)
        Me.lblExposed.TabIndex = 1
        Me.lblExposed.Text = "-"
        '
        'LabelControl1
        '
        Me.LabelControl1.Appearance.Font = New System.Drawing.Font("Tahoma", 9.0!, System.Drawing.FontStyle.Bold)
        Me.LabelControl1.Appearance.Options.UseFont = True
        Me.LabelControl1.Location = New System.Drawing.Point(109, 1)
        Me.LabelControl1.Name = "LabelControl1"
        Me.LabelControl1.Size = New System.Drawing.Size(94, 14)
        Me.LabelControl1.TabIndex = 0
        Me.LabelControl1.Text = "Exposed Infant"
        '
        'btnClose
        '
        Me.btnClose.ImageOptions.Image = CType(resources.GetObject("btnClose.ImageOptions.Image"), System.Drawing.Image)
        Me.btnClose.Location = New System.Drawing.Point(152, 111)
        Me.btnClose.Name = "btnClose"
        Me.btnClose.Size = New System.Drawing.Size(79, 25)
        Me.btnClose.TabIndex = 7
        Me.btnClose.Text = "Close.."
        '
        'btnSearch
        '
        Me.btnSearch.ImageOptions.Image = CType(resources.GetObject("btnSearch.ImageOptions.Image"), System.Drawing.Image)
        Me.btnSearch.Location = New System.Drawing.Point(31, 111)
        Me.btnSearch.Name = "btnSearch"
        Me.btnSearch.Size = New System.Drawing.Size(79, 25)
        Me.btnSearch.TabIndex = 0
        Me.btnSearch.Text = "Search.."
        '
        'GroupControl3
        '
        Me.GroupControl3.BorderStyle = DevExpress.XtraEditors.Controls.BorderStyles.UltraFlat
        Me.GroupControl3.Controls.Add(Me.lblCART)
        Me.GroupControl3.Location = New System.Drawing.Point(168, 29)
        Me.GroupControl3.Name = "GroupControl3"
        Me.GroupControl3.Size = New System.Drawing.Size(117, 54)
        Me.GroupControl3.TabIndex = 6
        Me.GroupControl3.Text = "ART"
        '
        'lblCART
        '
        Me.lblCART.AutoSize = True
        Me.lblCART.Font = New System.Drawing.Font("Tahoma", 15.0!)
        Me.lblCART.Location = New System.Drawing.Point(37, 24)
        Me.lblCART.Name = "lblCART"
        Me.lblCART.Size = New System.Drawing.Size(17, 24)
        Me.lblCART.TabIndex = 2
        Me.lblCART.Text = "-"
        '
        'GroupControl4
        '
        Me.GroupControl4.Controls.Add(Me.lblCPreART)
        Me.GroupControl4.Location = New System.Drawing.Point(17, 29)
        Me.GroupControl4.Name = "GroupControl4"
        Me.GroupControl4.Size = New System.Drawing.Size(117, 54)
        Me.GroupControl4.TabIndex = 5
        Me.GroupControl4.Text = "PreART"
        '
        'lblCPreART
        '
        Me.lblCPreART.AutoSize = True
        Me.lblCPreART.Font = New System.Drawing.Font("Tahoma", 15.0!)
        Me.lblCPreART.Location = New System.Drawing.Point(36, 24)
        Me.lblCPreART.Name = "lblCPreART"
        Me.lblCPreART.Size = New System.Drawing.Size(17, 24)
        Me.lblCPreART.TabIndex = 2
        Me.lblCPreART.Text = "-"
        '
        'LabelControl2
        '
        Me.LabelControl2.Appearance.Font = New System.Drawing.Font("Tahoma", 9.0!, System.Drawing.FontStyle.Bold)
        Me.LabelControl2.Appearance.Options.UseFont = True
        Me.LabelControl2.Location = New System.Drawing.Point(122, 5)
        Me.LabelControl2.Name = "LabelControl2"
        Me.LabelControl2.Size = New System.Drawing.Size(50, 14)
        Me.LabelControl2.TabIndex = 1
        Me.LabelControl2.Text = "Children"
        '
        'frmFindLost
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(478, 222)
        Me.Controls.Add(Me.SplitContainerControl1)
        Me.MaximizeBox = False
        Me.MinimizeBox = False
        Me.Name = "frmFindLost"
        Me.ShowIcon = False
        Me.ShowInTaskbar = False
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "Search Lost Patients"
        CType(Me.SplitContainerControl1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainerControl1.ResumeLayout(False)
        CType(Me.SplitContainerControl3, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainerControl3.ResumeLayout(False)
        CType(Me.GroupControl2, System.ComponentModel.ISupportInitialize).EndInit()
        Me.GroupControl2.ResumeLayout(False)
        Me.GroupControl2.PerformLayout()
        CType(Me.GroupControl1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.GroupControl1.ResumeLayout(False)
        Me.GroupControl1.PerformLayout()
        CType(Me.SplitContainerControl2, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainerControl2.ResumeLayout(False)
        CType(Me.GroupControl3, System.ComponentModel.ISupportInitialize).EndInit()
        Me.GroupControl3.ResumeLayout(False)
        Me.GroupControl3.PerformLayout()
        CType(Me.GroupControl4, System.ComponentModel.ISupportInitialize).EndInit()
        Me.GroupControl4.ResumeLayout(False)
        Me.GroupControl4.PerformLayout()
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents SplitContainerControl1 As DevExpress.XtraEditors.SplitContainerControl
    Friend WithEvents LabelControl3 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents SplitContainerControl2 As DevExpress.XtraEditors.SplitContainerControl
    Friend WithEvents LabelControl1 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents LabelControl2 As DevExpress.XtraEditors.LabelControl
    Friend WithEvents SplitContainerControl3 As DevExpress.XtraEditors.SplitContainerControl
    Friend WithEvents btnSearch As DevExpress.XtraEditors.SimpleButton
    Friend WithEvents GroupControl2 As DevExpress.XtraEditors.GroupControl
    Friend WithEvents lblaART As Label
    Friend WithEvents GroupControl1 As DevExpress.XtraEditors.GroupControl
    Friend WithEvents lblaPreART As Label
    Friend WithEvents lblExposed As Label
    Friend WithEvents GroupControl3 As DevExpress.XtraEditors.GroupControl
    Friend WithEvents lblCART As Label
    Friend WithEvents GroupControl4 As DevExpress.XtraEditors.GroupControl
    Friend WithEvents lblCPreART As Label
    Friend WithEvents btnClose As DevExpress.XtraEditors.SimpleButton
End Class
