Imports MySql.Data.MySqlClient
Public Class frmSetLost
    Dim Rdr As MySqlDataReader
    Dim b As Boolean
    Private Sub frmSetLost_Load(sender As Object, e As EventArgs) Handles MyBase.Load

        Search()
        ''  Try
        'Dim CmdSave As New MySqlCommand("insert into tbllostlog values('" & CboExposed.Text & "','" & CboChild.Text & "','" & CboChildARV.Text & "','" & CboAdult.Text & "','" & CboAdultARV.Text & "','" & Format(Now.Date, "yyyy-MM-dd") & "')", Cnndb)
        'CmdSave.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
    End Sub
    Private Sub Clear()
        CboExposed.SelectedIndex = -1
        CboChild.SelectedIndex = -1
        CboAdult.SelectedIndex = -1
    End Sub
    Protected Overrides Function ProcessCmdKey(ByRef msg As Message, keyData As Keys) As Boolean
        Select Case keyData
            Case Keys.F1
                tsbSave_Click(tsbSave, New EventArgs())
            Case Keys.F2
                Clear()
            Case Keys.F3
                '     Del()
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function
    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Clear()
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click



        If b = False Then
            Dim CmdSave As New MySqlCommand("insert into tblsetlost values('" & CboExposed.Text & "','" & CboChild.Text & "','" & CboChildARV.Text & "','" & CboAdult.Text & "','" & CboAdultARV.Text & "','" & CboIntype.SelectedIndex & "','" & cboChtype.SelectedIndex & "','" & cboAtype.SelectedIndex & "')", Cnndb)
            CmdSave.ExecuteNonQuery()
            Try
                Dim CmdLog As New MySqlCommand("insert into tbllostlog values('" & CboExposed.Text & "','" & CboChild.Text & "','" & CboChildARV.Text & "','" & CboAdult.Text & "','" & CboAdultARV.Text & "','" & CboIntype.SelectedIndex & "','" & cboChtype.SelectedIndex & "','" & cboAtype.SelectedIndex & "','" & Format(Now.Date, "yyyy-MM-dd") & "')", Cnndb)
                CmdLog.ExecuteNonQuery()
            Catch ex As Exception
            End Try
        Else
            Dim CmdDel As New MySqlCommand("Delete from tblsetlost", Cnndb)
            CmdDel.ExecuteNonQuery()
            Dim CmdSave As New MySqlCommand("insert into tblsetlost values('" & CboExposed.Text & "','" & CboChild.Text & "','" & CboChildARV.Text & "','" & CboAdult.Text & "','" & CboAdultARV.Text & "','" & CboIntype.SelectedIndex & "','" & cboChtype.SelectedIndex & "','" & cboAtype.SelectedIndex & "')", Cnndb)
            CmdSave.ExecuteNonQuery()
            Try
                Dim Cmdlog As New MySqlCommand("insert into tbllostlog values('" & CboExposed.Text & "','" & CboChild.Text & "','" & CboChildARV.Text & "','" & CboAdult.Text & "','" & CboAdultARV.Text & "','" & CboIntype.SelectedIndex & "','" & cboChtype.SelectedIndex & "','" & cboAtype.SelectedIndex & "','" & Format(Now.Date, "yyyy-MM-dd") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
            Catch ex As Exception
            End Try
        End If
    End Sub
    Private Sub Search()
        Dim CmdSearch As New MySqlCommand("Select * from tblsetlost", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Try
                CboIntype.SelectedIndex = Rdr.GetValue(5).ToString
                cboChtype.SelectedIndex = Rdr.GetValue(6).ToString
                cboAtype.SelectedIndex = Rdr.GetValue(7).ToString
                CboExposed.Text = Rdr.GetValue(0).ToString
                CboChild.Text = Rdr.GetValue(1).ToString
                CboChildARV.Text = Rdr.GetValue(2).ToString
                CboAdult.Text = Rdr.GetValue(3).ToString
                CboAdultARV.Text = Rdr.GetValue(4).ToString
            Catch ex As Exception
            End Try
            b = True
        End While
        Rdr.Close()
    End Sub

    Private Sub CboIntype_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboIntype.SelectedIndexChanged
        CboExposed.SelectedIndex = -1
        CboExposed.Properties.Items.Clear()
        Select Case CboIntype.SelectedIndex
            Case 0
                For i As Integer = 1 To 30
                    CboExposed.Properties.Items.Add(i)
                Next
            Case 1
                For i As Integer = 1 To 28
                    CboExposed.Properties.Items.Add(i)
                Next
        End Select
    End Sub
    Private Sub cboChtype_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboChtype.SelectedIndexChanged
        CboChild.SelectedIndex = -1
        CboChildARV.SelectedIndex = -1
        CboChild.Properties.Items.Clear()
        CboChildARV.Properties.Items.Clear()
        Select Case cboChtype.SelectedIndex
            Case 0
                For i As Integer = 1 To 30
                    CboChild.Properties.Items.Add(i)
                    CboChildARV.Properties.Items.Add(i)
                Next
            Case 1
                For i As Integer = 1 To 28
                    CboChild.Properties.Items.Add(i)
                    CboChildARV.Properties.Items.Add(i)
                Next
        End Select
    End Sub

    Private Sub cboAtype_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboAtype.SelectedIndexChanged
        CboAdult.SelectedIndex = -1
        CboAdultARV.SelectedIndex = -1
        CboAdult.Properties.Items.Clear()
        CboAdultARV.Properties.Items.Clear()
        Select Case cboAtype.SelectedIndex
            Case 0
                For i As Integer = 1 To 30
                    CboAdult.Properties.Items.Add(i)
                    CboAdultARV.Properties.Items.Add(i)
                Next
            Case 1
                For i As Integer = 1 To 28
                    CboAdult.Properties.Items.Add(i)
                    CboAdultARV.Properties.Items.Add(i)
                Next
        End Select
    End Sub
End Class