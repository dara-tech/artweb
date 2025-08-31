Imports MySql.Data.MySqlClient
Public Class frmTransferOutReport
    Dim Rdr As MySqlDataReader
    Public Code, Id, Sex, Age As String
    Private Sub frmTransferOutReport_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        'Code = frmMain.Art
        Dim f As New frmClinicID
        f.Text = "Print Patient Transfer Out"
        f.ShowDialog()
        If f.txtClinicID.Text <> "" Then
            Id = f.txtClinicID.Text
            If IsNumeric(Id) Then
                ' LoadReport()
                Adult()
            Else
                Child()
            End If
        End If
    End Sub
    Private Sub Adult()
        Dim report As New Transferout
        report.CreateDocument()
        DocumentViewer1.DocumentSource = report
    End Sub
    Private Sub Child()
        Dim report As New TransferoutChild
        report.CreateDocument()
        DocumentViewer1.DocumentSource = report
    End Sub
End Class