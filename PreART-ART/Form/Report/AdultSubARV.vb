Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class AdultSubARV
    Dim Rdr As MySqlDataReader
    Dim dbtem As MySqlConnection
    Dim Sdate, Edate As Date
    Private Sub AdultSubARV_AfterPrint(sender As Object, e As EventArgs) Handles Me.AfterPrint


    End Sub


    Private Sub AdultSubARV_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim Mydata As New DataSet
        Mydata.Regimen.Clear()
        dbtem = New MySqlConnection(connString)
        dbtem.Open()
        With frmNationalRoption
            If .TabControl1.SelectedIndex = 0 Then
                '   xtcyear.Text = .cboYear.Text
                '  xtcQuarter.Text = .cboQuarter.Text
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
                '   xtcyear.Text = .daStart.Text & " To  " & .daEnd.Text
                Sdate = CDate(.daStart.Text)
                Edate = CDate(.daEnd.Text)
            End If
        End With

        'Dim Cmddel1 As New MySqlCommand("Delete from tbltemp ", Cnndb)
        'Cmddel1.ExecuteNonQuery()
        'Dim CmdSearch As New MySqlCommand("SELECT patientactive.ClinicID, tblavarvdrug.DrugName, tblavarvdrug.Dose, tblavarvdrug.Status  FROM   patientactive LEFT OUTER JOIN  tblavarvdrug ON patientactive.Vid = tblavarvdrug.Vid WHERE  (tblavarvdrug.Status IN (0, 2)) and patientactive.DafirstVisit <= '" & Format(Edate, "yyyy-MM-dd") & "'  ORDER BY patientactive.ClinicID, tblavarvdrug.DrugName", Cnndb)
        'Rdr = CmdSearch.ExecuteReader
        'Dim q1 As String
        'While Rdr.Read
        '    Try
        '        Dim Cmdinsert As New MySqlCommand("insert into tbltemp values('" & Rdr.GetValue(0).ToString.Trim & "','" & Rdr.GetValue(1).ToString.Trim & "','" & Rdr.GetValue(2).ToString.Trim & "','','','1900/01/01','1900/01/01')", dbtem)
        '        Cmdinsert.ExecuteNonQuery()
        '        q1 = ""
        '        q1 = Rdr.GetValue(1).ToString.Trim
        '    Catch ex As Exception
        '        q1 = q1 & "+" & Rdr.GetValue(1).ToString.Trim
        '        Dim Cmdupdate As New MySqlCommand("update tbltemp set f1='" & q1 & "' where f='" & Rdr.GetValue(0).ToString.Trim & "'", dbtem)
        '        Cmdupdate.ExecuteNonQuery()
        '    End Try
        'End While
        'Rdr.Close()
        'dbtem.Close()

        'Dim CmdSearch1 As New MySqlCommand("SELECT count(f1) as num ,f1  FROM tbltemp group by f1 order by num desc; ", Cnndb)
        'Rdr = CmdSearch1.ExecuteReader
        'While Rdr.Read
        '    Mydata.Regimen.AddRegimenRow(" " & Rdr.GetValue(1).ToString.Trim, Rdr.GetValue(0).ToString)
        'End While
        'Rdr.Close()
        'DataSource = Mydata.Regimen
        'XrTableCell5.DataBindings.Add("Text", DataSource, "Drug")
        'XrTableCell6.DataBindings.Add("Text", DataSource, "Num")
        'Dim Cmddel As New MySqlCommand("Delete from tbltemp ", Cnndb)
        'Cmddel.ExecuteNonQuery()

        Dim CmdSearch1 As New MySqlCommand("select * from (select c.regimen,count(c.regimen) as number_of_Reg from (" &
            "select distinct v.clinicid,v.DatVisit,v.vid,dr.regimen,v.DaApp from tblavmain v inner join" &
            "(Select distinct clinicid,max(DatVisit) as datvisit from tblavmain " &
            "where DatVisit<='" & Format(Edate, "yyyy-MM-dd") & "' group by clinicid) mv on mv.clinicid=v.clinicid and mv.datvisit=v.DatVisit left outer join(" &
            "SELECT distinct vid,group_concat(DrugName order by DrugName separator ' + ') as regimen FROM preart.tblavarvdrug " &
            "where Status<>1 group by vid) dr on dr.vid=v.vid " &
            "left outer join (select * from tblavpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') st on st.clinicid=v.ClinicID " &
            "where st.Status is null) c group by c.regimen ) lp order by number_of_Reg desc;", Cnndb)
        Rdr = CmdSearch1.ExecuteReader
        While Rdr.Read
            Mydata.Regimen.AddRegimenRow(" " & Rdr.GetValue(0).ToString.Trim, Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        DataSource = Mydata.Regimen
        XrTableCell5.DataBindings.Add("Text", DataSource, "Drug")
        XrTableCell6.DataBindings.Add("Text", DataSource, "Num")
    End Sub
End Class