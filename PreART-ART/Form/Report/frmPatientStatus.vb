Public Class frmPatientStatus
    Public Sdate, Edate As Date
    Private Sub frmPatientStatus_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        frmNationalRoption.ShowDialog()
        With frmNationalRoption
            If .TabControl1.SelectedIndex = 0 Then

                Select Case Val(.cboQuarter.Text)
                    Case 1
                        Sdate = DateSerial(.cboYear.Text, 1, 1)
                        Edate = DateSerial(.cboYear.Text, 3, 31)
                    Case 2
                        Sdate = DateSerial(.cboYear.Text, 4, 1)
                        Edate = DateSerial(.cboYear.Text, 6, 30)
                    Case 3
                        Sdate = DateSerial(.cboYear.Text, 7, 1)
                        Edate = DateSerial(.cboYear.Text, 9, 30)
                    Case 4
                        Sdate = DateSerial(.cboYear.Text, 10, 1)
                        Edate = DateSerial(.cboYear.Text, 12, 31)
                End Select
            Else
                Sdate = CDate(.daStart.Text)
                Edate = CDate(.daEnd.Text)
            End If
        End With
        Adult()
        Child()
        '  PreviewBar3.Visible = False
        PreviewBar4.Visible = False
        PreviewBar5.Visible = False
        frmNationalRoption.Close()
    End Sub
    Private Sub Adult()
        Dim report As New AdultStatus
        report.CreateDocument()
        DocumentViewer1.DocumentSource = report
    End Sub

    Private Sub XtraTabControl1_Click(sender As Object, e As EventArgs) Handles XtraTabControl1.Click
        If XtraTabControl1.SelectedTabPageIndex = 1 Then
            PreviewBar1.Visible = False
            PreviewBar2.Visible = False
            '    PreviewBar3.Visible = True
            PreviewBar4.Visible = True
            PreviewBar5.Visible = True
        Else
            PreviewBar2.Visible = True
            PreviewBar1.Visible = True
            '    PreviewBar3.Visible = False
            PreviewBar4.Visible = False
            PreviewBar5.Visible = False
        End If

    End Sub

    Private Sub Child()
        Dim report As New ChildStatus
        report.CreateDocument()
        DocumentViewer2.DocumentSource = report
    End Sub
End Class