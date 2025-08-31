Imports System.IO
Imports MySql.Data.MySqlClient
Public Class frmConnection
    Dim k As Integer
    Dim Cnndb As MySqlConnection
    Private Sub btnConnect_Click(sender As Object, e As EventArgs) Handles btnConnect.Click
        If txtServerName.Text.Trim = "" Then MessageBox.Show("Please Input Server Name", "Connection", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        If txtUserName.Text.Trim = "" Then MessageBox.Show("Please Input Username", "Connection", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        If txtPassword.Text = "" Then MessageBox.Show("Please Input Password", "Connection", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        Save()
        Check_Connection_Database()
        If ConnectionDB.b = False Then
            k = 1
            Me.Close()
        Else
            MsgBox("Connection failse" & Chr(13) & "Please try again!", MsgBoxStyle.Critical, "PreART-ART")
        End If
    End Sub

    Private Sub tbnTest_Click(sender As Object, e As EventArgs) Handles tbnTest.Click
        If txtServerName.Text.Trim = "" Then MessageBox.Show("Please Input Server Name", "Connection", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        If txtUserName.Text.Trim = "" Then MessageBox.Show("Please Input Username", "Connection", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        If txtPassword.Text = "" Then MessageBox.Show("Please Input Password", "Connection", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        Dim connString As String = "Data Source='" & txtServerName.Text & "' ; user id='" & txtUserName.Text & "' ; password='" & txtPassword.Text & "';Character Set=utf8;Pooling=True;"
        Cnndb = New MySqlConnection(connString)
        Try
            Cnndb.Open()
            MessageBox.Show("Connected..!", "Connect Database ", MessageBoxButtons.OK, MessageBoxIcon.Information)
            CheckEdit1.Enabled = True
        Catch OleDbExceptionErr As MySqlException
            'MsgBox("Connection failse" & Chr(13) & "Please tray again!", MsgBoxStyle.Critical, "PreART-ART")
            MessageBox.Show(OleDbExceptionErr.Message)
            CheckEdit1.Enabled = False
        End Try
    End Sub

    Private Sub btnCancel_Click(sender As Object, e As EventArgs) Handles btnCancel.Click
        If MessageBox.Show("Are you sure do you want to exit!", "Connect", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = MsgBoxResult.Yes Then
            Application.Exit()
        End If
    End Sub

    Private Sub frmConnection_FormClosing(sender As Object, e As FormClosingEventArgs) Handles Me.FormClosing
        If k <> 1 Then
            If MessageBox.Show("Are you sure do you want to exit!", "Connect", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = MsgBoxResult.Yes Then
                End
            Else
                e.Cancel = True

            End If
        End If
    End Sub

    Private Sub frmConnection_Load(sender As Object, e As EventArgs) Handles MyBase.Load

    End Sub
    Private Sub Save()
        Dim FileWriter As StreamWriter
        Dim mydocpath As String = Directory.GetCurrentDirectory()
        IO.File.CreateText(mydocpath & "\" & "ART.sys").Close()
        FileWriter = New StreamWriter(mydocpath & "\" & "ART.sys", False)
        FileWriter.WriteLine(txtServerName.Text)
        FileWriter.WriteLine(txtUserName.Text)
        FileWriter.WriteLine(txtPassword.Text)
        FileWriter.Close()
    End Sub

    Private Sub CheckEdit1_CheckedChanged(sender As Object, e As EventArgs) Handles CheckEdit1.CheckedChanged
        If CheckEdit1.Checked = True Then
            btnrestore.Enabled = True
        Else
            btnrestore.Enabled = False
        End If
    End Sub

    Private Sub btnrestore_Click(sender As Object, e As EventArgs) Handles btnrestore.Click
        'Dim Cnndb1 As MySqlConnection
        Try
            With OpenFileDialog1
                .FileName = ""
                .Filter = "Database Backup files (*.h149)|*.h149"
                If .ShowDialog() = DialogResult.OK Then

                    Dim cmddel As New MySqlCommand("DROP DATABASE if exists preart", Cnndb)
                    cmddel.ExecuteNonQuery()
                    Dim cmdcreate = New MySqlCommand("CREATE DATABASE preart DEFAULT CHARACTER SET utf8 ;", Cnndb)
                    cmdcreate.ExecuteNonQuery()
                    'Check_Connection_Database()

                    Dim cmd As New MySqlCommand()
                    Using mb As New MySqlBackup(cmd)
                        Cnndb.ChangeDatabase("preart")
                        cmd.Connection = Cnndb
                        mb.ImportInfo.EnableEncryption = True
                        mb.ImportInfo.EncryptionPassword = "090666847"
                        ' Dim file As String =re .FileName
                        System.IO.File.Copy(.FileName, "D:\h149.h149", True)
                        mb.ImportFromFile("D:\h149.h149")
                        System.IO.File.Delete("D:\h149.h149")
                    End Using
                    MessageBox.Show("Restore Completed Successfully ", "Restore file", MessageBoxButtons.OK, MessageBoxIcon.Information)
                End If
            End With
        Catch ex As Exception
            MessageBox.Show(ex.Message, ex.Source, MessageBoxButtons.OK)
        End Try
    End Sub
End Class