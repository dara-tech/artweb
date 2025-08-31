Public Class frmCheckTest
    Private Sub frmCheckTest_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        PreviewBar3.Visible = False
        PreviewBar4.Visible = False
    End Sub

    Private Sub XtraTabControl1_Click(sender As Object, e As EventArgs)
        If XtraTabControl1.SelectedTabPageIndex = 0 Then
            PreviewBar3.Visible = False
            PreviewBar4.Visible = False
            PreviewBar1.Visible = True
            PreviewBar2.Visible = True
        Else
            PreviewBar3.Visible = True
            PreviewBar4.Visible = True
            PreviewBar1.Visible = False
            PreviewBar2.Visible = False
        End If
    End Sub

    Private Sub DocumentViewer1_Load(sender As Object, e As EventArgs) Handles DocumentViewer1.Load

    End Sub

    Private Sub DocumentViewer2_Load(sender As Object, e As EventArgs) Handles DocumentViewer2.Load

    End Sub
End Class