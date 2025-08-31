Public Class frmSummaryAdult
    Public id As Int16
    Private Sub frmSummaryAdult_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Dim f As New frmClinicID
        f.Text = " Adult Patient Summary"
        f.ShowDialog()
        If f.txtClinicID.Text <> "" Then
            id = f.txtClinicID.Text
            Dim report As New AdultSummary
            report.CreateDocument()
            DocumentViewer1.DocumentSource = report
        End If
    End Sub
End Class