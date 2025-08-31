Public Class frmDrugRegimen
    Private Sub frmDrugRegimen_Activated(sender As Object, e As EventArgs) Handles Me.Activated

    End Sub

    Private Sub frmDrugRegimen_Click(sender As Object, e As EventArgs) Handles Me.Click

    End Sub

    Private Sub frmDrugRegimen_FormClosed(sender As Object, e As FormClosedEventArgs) Handles Me.FormClosed

    End Sub

    Private Sub frmDrugRegimen_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        frmNationalRoption.ShowDialog()
        ' Adult()

    End Sub

    Private Sub DocumentViewer1_MouseMove(sender As Object, e As MouseEventArgs) Handles DocumentViewer1.MouseMove
        frmNationalRoption.Close()
    End Sub

    Private Sub DocumentViewer1_Load(sender As Object, e As EventArgs) Handles DocumentViewer1.Load

    End Sub
End Class