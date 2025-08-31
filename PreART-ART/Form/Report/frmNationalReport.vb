Public Class frmNationalReport
    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

    End Sub

    Private Sub frmNationalReport_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        frmNationalRoption.ShowDialog()
        Adult()
    End Sub
    Private Sub Adult()
        Dim report As New RTNational
        report.CreateDocument()
        DocumentViewer1.DocumentSource = report
        frmNationalRoption.Close()
    End Sub
End Class