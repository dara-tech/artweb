Public Class frmRefusing
    Private Sub frmRefusing_Load(sender As Object, e As EventArgs) Handles MyBase.Load

        Adult()
    End Sub
    Private Sub Adult()
        Dim report As New Patientrefuges
        report.CreateDocument()
        DocumentViewer1.DocumentSource = report
        frmNationalRoption.Close()
    End Sub
End Class