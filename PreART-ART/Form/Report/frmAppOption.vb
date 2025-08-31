Public Class frmAppOption
    Private Sub btnclose_Click(sender As Object, e As EventArgs) Handles btnclose.Click
        Me.Close()
    End Sub

    Private Sub btnReport_Click(sender As Object, e As EventArgs) Handles btnReport.Click
        frmAppReport.MdiParent = frmMain
        frmAppReport.WindowState = FormWindowState.Maximized
        frmAppReport.Show()
        Me.Close()

    End Sub

    Private Sub frmAppOption_Load(sender As Object, e As EventArgs) Handles MyBase.Load

    End Sub
End Class