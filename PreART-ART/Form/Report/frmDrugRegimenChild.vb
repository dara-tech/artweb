Public Class frmDrugRegimenChild
    Private Sub frmDrugRegimenChild_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        frmNationalRoption.ShowDialog()

    End Sub




    Private Sub DocumentViewer1_MouseMove(sender As Object, e As MouseEventArgs) Handles DocumentViewer1.MouseMove
        frmNationalRoption.Close()
    End Sub
End Class