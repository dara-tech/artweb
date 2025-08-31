Public Class frmClinicID
    '  Public B As Boolean = False
    Private Sub btnCancel_Click(sender As Object, e As EventArgs) Handles btnCancel.Click
        '   B = True
        Me.Close()
    End Sub

    Private Sub BtnOk_Click(sender As Object, e As EventArgs) Handles BtnOk.Click
        Me.Close()
    End Sub

    Private Sub BtnOk_KeyDown(sender As Object, e As KeyEventArgs) Handles BtnOk.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            Me.Close()
        End If
    End Sub

    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            Me.Close()
        End If
    End Sub

End Class