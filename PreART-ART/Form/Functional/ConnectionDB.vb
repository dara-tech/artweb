Imports System.IO
Imports MySql.Data.MySqlClient
Imports System

Module ConnectionDB
    Public Cnndb As MySqlConnection
    Public b As Boolean
    Public ser, us, pa As String
    Public connString As String

    Public Sub Check_Connection_Database()
        Dim FileWriter As StreamWriter
        Dim mydocpath As String = Directory.GetCurrentDirectory()
        Try
            Dim sr As New System.IO.StreamReader(mydocpath & "\" & "ART.sys")
            Dim str As String = ""
            ser = sr.ReadLine()
            us = sr.ReadLine
            pa = sr.ReadLine
            sr.Close()
        Catch ex As Exception
        End Try
        connString = "Server='" & ser & "'; Port='3306'; Uid='" & us & "' ; Pwd='" & pa & "' ; database=preart;Character Set=utf8;default command timeout=6200 ;pooling = false; convert zero datetime=True;allowPublicKeyRetrieval=true;SslMode=none"
        Cnndb = New MySqlConnection(connString)
        Try
            Cnndb.Open()
            b = False
        Catch OleDbExceptionErr As MySqlException
            'MessageBox.Show(OleDbExceptionErr.Message)
            If Not Application.OpenForms().OfType(Of frmConnection).Any Then
                frmConnection.ShowDialog()
            End If
            b = True
        End Try
    End Sub
End Module
