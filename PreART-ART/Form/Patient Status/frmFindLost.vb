Imports MySql.Data.MySqlClient
Public Class frmFindLost
    Dim Rdr, Trdr As MySqlDataReader
    Dim Ex, Cp, Ca, Ap, Aa As Int16
    Dim TempConn As MySqlConnection
    Private Sub btnClose_Click(sender As Object, e As EventArgs) Handles btnClose.Click
        Me.Close()
    End Sub

    Private Sub btnSearch_Click(sender As Object, e As EventArgs) Handles btnSearch.Click
        TempConn = New MySqlConnection(connString)
        TempConn.Open()
        checkAdult()
        CheckChild()
        CheckExpose()
        MessageBox.Show("Thanks", "Finish", MessageBoxButtons.OK, MessageBoxIcon.Information)
        TempConn.Close()
    End Sub
#Region "CheckPatient"
    Private Sub checkAdult()

        Dim Cmd1 As New MySqlCommand("Delete from tbltemp ", TempConn)
        Cmd1.ExecuteNonQuery()
        Dim CmdCheck As New MySqlCommand("SELECT    tblavmain.DaApp, tblavmain.ClinicID, tblavmain.Vid, tblavmain.ARTnum, tblavpatientstatus.Status FROM  tblavmain LEFT OUTER JOIN tblavpatientstatus ON tblavmain.ClinicID = tblavpatientstatus.ClinicID  where (tblavpatientstatus.Status IS NULL) order by tblavmain.DatVisit DESC", Cnndb)
        Rdr = CmdCheck.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdSave As New MySqlCommand("Insert into tbltemp values('" & Rdr.GetValue(1).ToString.Trim & "','" & Rdr.GetValue(2).ToString.Trim & "','" & Rdr.GetValue(3).ToString.Trim & "','','','" & Format(CDate(Rdr.GetValue(0).ToString.Trim), "yyyy/MM/dd") & "','" & Format(CDate(Rdr.GetValue(0).ToString.Trim), "yyyy/MM/dd") & "')", TempConn)
                CmdSave.ExecuteNonQuery()
            Catch ex As Exception

            End Try
        End While
        Rdr.Close()
        lblaPreART.Text = 0 : lblaART.Text = 0

        Dim CmdLost As New MySqlCommand("Select * from tbltemp", Cnndb)
        Rdr = CmdLost.ExecuteReader
        While Rdr.Read
            ' Dim tt As String = DateDiff(DateInterval.Month, CDate(Rdr.GetValue(0).ToString), Date.Now.Date)
            Select Case Rdr.GetValue(2).ToString.Trim
                Case ""

                    If Val(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(5).ToString), Date.Now.Date)) > Ap Then 'B Phana >=Ap
                        '  Dim xx As String = Rdr.GetValue(0).ToString
                        Dim CmdInsertLost As New MySqlCommand("Insert into tblavpatientstatus values('" & Rdr.GetValue(0).ToString.Trim & "','" & "0" & "','-1','','" & Format(Now.Date, "yyyy/MM/dd") & "','','" & Rdr.GetValue(1).ToString.Trim & "')", TempConn)
                        CmdInsertLost.ExecuteNonQuery()
                        lblaPreART.Text = Val(lblaPreART.Text) + 1
                    End If
                Case Else

                    If Val(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(5).ToString), Date.Now.Date)) > Aa Then 'B Phana >=Aa
                        '  Dim xx As String = Rdr.GetValue(0).ToString
                        Dim CmdInsertLost As New MySqlCommand("Insert into tblavpatientstatus values('" & Rdr.GetValue(0).ToString.Trim & "','" & "0" & "','-1','','" & Format(Now.Date, "yyyy/MM/dd") & "','','" & Rdr.GetValue(1).ToString.Trim & "')", TempConn)
                        CmdInsertLost.ExecuteNonQuery()
                        lblaART.Text = Val(lblaART.Text) + 1
                    End If
            End Select
        End While
        Rdr.Close()
        'Dim Cmd As New MySqlCommand("Delete from tbltemp ", Cnndb)
        'Cmd.ExecuteNonQuery()
    End Sub

    Private Sub frmFindLost_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Dim CmdSearch As New MySqlCommand("Select * from tblsetlost", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(5).ToString) = 0 Then
                Ex = Rdr.GetValue(0).ToString
            Else
                Ex = Rdr.GetValue(0).ToString * 30
            End If
            If Val(Rdr.GetValue(6).ToString) = 0 Then
                Cp = Rdr.GetValue(1).ToString
                Ca = Rdr.GetValue(2).ToString
            Else
                Cp = Rdr.GetValue(1).ToString * 30
                Ca = Rdr.GetValue(2).ToString * 30
            End If
            If Val(Rdr.GetValue(7).ToString) = 0 Then
                Ap = Rdr.GetValue(3).ToString
                Aa = Rdr.GetValue(4).ToString
            Else
                Ap = Rdr.GetValue(3).ToString * 30
                Aa = Rdr.GetValue(4).ToString * 30
            End If
        End While
        Rdr.Close()

    End Sub
    Private Sub CheckChild()
        Dim Cmd1 As New MySqlCommand("Delete from tbltemp ", Cnndb)
        Cmd1.ExecuteNonQuery()
        Dim CmdChild As New MySqlCommand("SELECT    tblcvmain.DaApp, tblcvmain.ClinicID, tblcvmain.Vid, tblcvmain.ARTnum, tblcvpatientstatus.Status FROM  tblcvmain LEFT OUTER JOIN tblcvpatientstatus ON tblcvmain.ClinicID = tblcvpatientstatus.ClinicID  where (tblcvpatientstatus.Status IS NULL) order by tblcvmain.DatVisit DESC", Cnndb)
        Rdr = CmdChild.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdSave As New MySqlCommand("Insert into tbltemp values('" & Rdr.GetValue(1).ToString.Trim & "','" & Rdr.GetValue(2).ToString.Trim & "','" & Rdr.GetValue(3).ToString.Trim & "','','','" & Format(CDate(Rdr.GetValue(0).ToString.Trim), "yyyy/MM/dd") & "','" & Format(CDate(Rdr.GetValue(0).ToString.Trim), "yyyy/MM/dd") & "')", TempConn)
                CmdSave.ExecuteNonQuery()
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()
        lblCPreART.Text = 0 : lblCART.Text = 0
        Dim CmdLost As New MySqlCommand("Select * from tbltemp ", ConnectionDB.Cnndb)
        Rdr = CmdLost.ExecuteReader
        While Rdr.Read
            Select Case Rdr.GetValue(2).ToString.Trim
                Case ""
                    If Val(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(5).ToString), Now.Date)) > Cp Then 'B Phana >=Cp
                        Dim CmdInsertLost As New MySqlCommand("Insert into tblcvpatientstatus values('" & Rdr.GetValue(0).ToString.Trim & "','" & "0" & "','-1','','" & Format(Now.Date, "yyyy/MM/dd") & "','','" & Rdr.GetValue(1).ToString.Trim & "')", TempConn)
                        CmdInsertLost.ExecuteNonQuery()
                        lblCPreART.Text = Val(lblCPreART.Text) + 1
                    End If
                Case Else
                    If Val(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(5).ToString), Now.Date)) > Ca Then 'B Phana >Ca
                        Dim CmdInsertLost As New MySqlCommand("Insert into tblcvpatientstatus values('" & Rdr.GetValue(0).ToString.Trim & "','" & "0" & "','-1','','" & Format(Now.Date, "yyyy/MM/dd") & "','','" & Rdr.GetValue(1).ToString.Trim & "')", TempConn)
                        CmdInsertLost.ExecuteNonQuery()
                        lblCART.Text = Val(lblCART.Text) + 1
                    End If
            End Select
        End While
        Rdr.Close()
        Dim Cmd As New MySqlCommand("Delete from tbltemp ", Cnndb)
        Cmd.ExecuteNonQuery()
    End Sub
    Private Sub CheckExpose()
        Dim Cmd1 As New MySqlCommand("Delete from tbltemp ", ConnectionDB.Cnndb)
        Cmd1.ExecuteNonQuery()
        'Dim CmdChild As New MySqlCommand("SELECT    tblevmain.DaApp, tblevmain.ClinicID, tblevmain.Vid, tblevpatientstatus.Status FROM  tblevmain LEFT OUTER JOIN tblevpatientstatus ON tblevmain.ClinicID = tblevpatientstatus.ClinicID  where (tblevpatientstatus.Status IS NULL) order by tblevmain.DatVisit DESC", Cnndb)
        'Rdr = CmdChild.ExecuteReader

        Dim CmdChild As New MySqlCommand("SELECT    tblevmain.DaApp, tblevmain.ClinicID, tblevmain.Vid, tblevpatientstatus.Status,tbleimain.DaBirth FROM  tblevmain LEFT OUTER JOIN tbleimain on tblevmain.ClinicID=tbleimain.ClinicID LEFT OUTER JOIN tblevpatientstatus ON tblevmain.ClinicID = tblevpatientstatus.ClinicID  where (tblevpatientstatus.Status IS NULL) order by tblevmain.DatVisit DESC", Cnndb)
        Rdr = CmdChild.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdSave As New MySqlCommand("Insert into tbltemp values('" & Rdr.GetValue(1).ToString.Trim & "','" & Rdr.GetValue(2).ToString.Trim & "','" & "" & "','','','" & Format(CDate(Rdr.GetValue(4).ToString.Trim), "yyyy/MM/dd") & "','" & Format(CDate(Rdr.GetValue(0).ToString.Trim), "yyyy/MM/dd") & "')", TempConn)
                CmdSave.ExecuteNonQuery()
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()
        lblExposed.Text = 0
        Dim CmdLost As New MySqlCommand("Select * from tbltemp ", Cnndb)
        Rdr = CmdLost.ExecuteReader
        While Rdr.Read
            If Val(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(5).ToString), Date.Now.Date)) > Ex Then 'B Phana >=Ex
                Dim CmdInsertLost As New MySqlCommand("Insert into tblevpatientstatus values('" & Rdr.GetValue(0).ToString.Trim & "','" & "4" & "','" & Format(Now.Date, "yyyy/MM/dd") & "','" & Rdr.GetValue(1).ToString.Trim & "')", TempConn)
                CmdInsertLost.ExecuteNonQuery()
                lblExposed.Text = Val(lblExposed.Text) + 1
            End If
        End While
        Rdr.Close()
        Dim Cmd As New MySqlCommand("Delete from tbltemp ", ConnectionDB.Cnndb)
        Cmd.ExecuteNonQuery()
    End Sub
#End Region
End Class