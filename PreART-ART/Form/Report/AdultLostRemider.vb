Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class AdultLostRemider
    Dim Rdr, Trdr As MySqlDataReader
    '  Dim Ex, Cp, Ca, Ap, Aa As Int16
    Dim TempConn As MySqlConnection

    Private Sub AdultLostRemider_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim Mydata As New DataSet
        Mydata.test.Clear()
        'Dim CmdSearch As New MySqlCommand("Select * from tblsetlost", Cnndb)
        'Rdr = CmdSearch.ExecuteReader
        'While Rdr.Read
        '    Ap = Val(Rdr.GetValue(3).ToString) - 1
        '    Aa = Val(Rdr.GetValue(4).ToString) - 1
        'End While
        'Rdr.Close()
        TempConn = New MySqlConnection(connString)
        TempConn.Open()
        Dim Cmd1 As New MySqlCommand("Delete from tbltemp ", TempConn)
        Cmd1.ExecuteNonQuery()

        Dim CmdCheck As New MySqlCommand("SELECT     tblavmain.DaApp, tblavmain.ClinicID, tblavmain.Vid, tblavmain.ARTnum, tblavmain.DatVisit, tblaimain.Sex FROM  tblavmain RIGHT OUTER JOIN  tblaimain ON tblavmain.ClinicID = tblaimain.ClinicID LEFT OUTER JOIN   tblavpatientstatus ON tblavmain.ClinicID = tblavpatientstatus.ClinicID WHERE (tblavpatientstatus.Status IS NULL) ORDER BY tblavmain.DatVisit DESC", Cnndb)
        Rdr = CmdCheck.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdSave As New MySqlCommand("Insert into tbltemp values('" & Rdr.GetValue(1).ToString.Trim & "','" & Rdr.GetValue(2).ToString.Trim & "','" & Rdr.GetValue(3).ToString.Trim & "','" & Rdr.GetValue(5).ToString & "','','" & Format(CDate(Rdr.GetValue(0).ToString.Trim), "yyyy/MM/dd") & "','" & Format(CDate(Rdr.GetValue(4).ToString.Trim), "yyyy/MM/dd") & "')", TempConn)
                CmdSave.ExecuteNonQuery()
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()
        Dim CmdLost As New MySqlCommand("Select * from tbltemp", Cnndb)
        Rdr = CmdLost.ExecuteReader
        While Rdr.Read
            Select Case Rdr.GetValue(2).ToString.Trim
                Case ""
                    If Val(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(5).ToString), Date.Now.Date)) < frmMain.ao - 8 Then '-30
                        Dim Cmd As New MySqlCommand("Delete from tbltemp where f='" & Rdr.GetValue(0).ToString & "' ", TempConn)
                        Cmd.ExecuteNonQuery()
                    End If
                Case Else
                    If Val(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(5).ToString), Date.Now.Date)) < frmMain.aa - 8 Then '-30
                        '   Dim xx As String = Rdr.GetValue(0).ToString
                        Dim Cmd As New MySqlCommand("Delete from tbltemp where f='" & Rdr.GetValue(0).ToString & "' ", TempConn)
                        Cmd.ExecuteNonQuery()
                    End If
            End Select
        End While
        Rdr.Close()
        Dim CmdSearch1 As New MySqlCommand("Select * from tbltemp", Cnndb)
        Rdr = CmdSearch1.ExecuteReader
        Dim x As String
        While Rdr.Read
            Select Case Val(Rdr.GetValue(3).ToString)
                Case 0
                    x = "Female"
                Case Else
                    x = "Male"
            End Select
            Mydata.test.AddtestRow(Format(Val(Rdr.GetValue(0).ToString), "000000"), Rdr.GetValue(2).ToString, x, Format(CDate(Rdr.GetValue(6).ToString), "dd-MM-yyyy"), Format(CDate(Rdr.GetValue(5).ToString), "dd-MM-yyyy"), "", "", "")
        End While
        DataSource = Mydata.test
        XrTableCell6.DataBindings.Add("Text", DataSource, "Dat")
        XrTableCell8.DataBindings.Add("Text", DataSource, "DatCollect")
        XrTableCell9.DataBindings.Add("Text", DataSource, "CD4")
        XrTableCell10.DataBindings.Add("Text", DataSource, "Cop")
        XrTableCell12.DataBindings.Add("Text", DataSource, "Lo")
        Rdr.Close()
        TempConn.Close()
        Dim Cmddel As New MySqlCommand("Delete from preart.tbltemp ", Cnndb)
        Cmddel.ExecuteNonQuery()
    End Sub

    Private Sub Detail_BeforePrint(sender As Object, e As PrintEventArgs) Handles Detail.BeforePrint

    End Sub
End Class