Public Class frmRPNTT
    Private Sub frmRPNTT_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        frmNationalRoption.ShowDialog()
        PNTT()
    End Sub
    Private Sub PNTT()
        Dim report As New PNTT
        report.CreateDocument()
        DocumentViewer1.DocumentSource = report
        frmNationalRoption.Close()
    End Sub


End Class