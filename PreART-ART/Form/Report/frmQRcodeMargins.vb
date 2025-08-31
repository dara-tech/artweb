Imports MySql.Data.MySqlClient
Public Class frmQRcodeMargins
    Dim Rdr As MySqlDataReader
    Private Sub btnCancel_Click(sender As Object, e As EventArgs) Handles btnCancel.Click
        Me.Close()
    End Sub

    Private Sub btnOk_Click(sender As Object, e As EventArgs) Handles btnOk.Click
        If txtLeft.Text = "" Then
            MessageBox.Show("Input left margins.")
            txtLeft.Focus()
            Exit Sub
        End If
        If txtRight.Text = "" Then
            MessageBox.Show("Input right margins.")
            txtRight.Focus()
            Exit Sub
        End If
        If txtTop.Text = "" Then
            MessageBox.Show("Input top margins.")
            txtTop.Focus()
            Exit Sub
        End If
        If txtBottom.Text = "" Then
            MessageBox.Show("Input bottom margins.")
            txtBottom.Focus()
            Exit Sub
        End If
        Dim Cmd1 As New MySqlCommand("delete from preart.tblmargins;", Cnndb)
        Cmd1.ExecuteNonQuery()
        Dim CmdInsertmargin As New MySqlCommand("Insert into preart.tblmargins values(" & txtLeft.Text & "," & txtRight.Text & "," & txtTop.Text & "," & txtBottom.Text & ")", Cnndb)
        CmdInsertmargin.ExecuteNonQuery()
        Me.Close()
    End Sub

    Private Sub frmQRcodeMargins_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Dim CmdRead As New MySqlCommand("select * from preart.tblmargins;", Cnndb)
        Rdr = CmdRead.ExecuteReader()
        While Rdr.Read
            txtLeft.Text = Rdr.GetValue(0).ToString
            txtRight.Text = Rdr.GetValue(1).ToString
            txtTop.Text = Rdr.GetValue(2).ToString
            txtBottom.Text = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()
    End Sub
End Class