Public Class frmRVCCT
    Private Sub frmRVCCT_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        frmNationalRoption.ShowDialog()
        VCCT()
        frmNationalRoption.Close()
    End Sub
    Private Sub VCCT()
        Dim report As New VCCT
        report.CreateDocument()
        DocumentViewer2.DocumentSource = report
    End Sub

End Class