Public Class frmSummaryChild
    Public id As String
    Private Sub frmSummaryChild_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Dim f As New frmClinicID
        f.Text = "Child Patient Summary"
        f.ShowDialog()
        If f.txtClinicID.Text <> "" Then
            If IsNumeric(f.txtClinicID.Text) Then
                id = "P" & Format(Val(f.txtClinicID.Text), "000000")
            Else
                id = f.txtClinicID.Text
            End If

            Dim report As New ChildSummary
            report.CreateDocument()
            DocumentViewer1.DocumentSource = report
        End If
    End Sub
End Class