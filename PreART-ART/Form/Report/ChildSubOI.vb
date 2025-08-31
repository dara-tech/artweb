Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class ChildSubOI
    Dim Rdr As MySqlDataReader
    Dim dbtem As MySqlConnection
    Dim Sdate, Edate As Date
    Private Sub ChildSubOI_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint

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

        'Dim CmdSearch As New MySqlCommand("SELECT count(tblcvoidrug.DrugName) as Num, tblcvoidrug.DrugName  FROM   childpatientactive LEFT OUTER JOIN  tblcvoidrug ON childpatientactive.Vid = tblcvoidrug.Vid WHERE  (tblcvoidrug.Status IN (0, 2)) and childpatientactive.DaFirstVisit <= '" & Format(Edate, "yyyy-MM-dd") & "' group by tblcvoidrug.DrugName ORDER BY Num desc", Cnndb)
        'Rdr = CmdSearch.ExecuteReader
        'Dim q1 As String
        'While Rdr.Read
        '    Mydata.Regimen.AddRegimenRow(" " & Rdr.GetValue(1).ToString.Trim, Rdr.GetValue(0).ToString)
        'End While
        'Rdr.Close()
        'dbtem.Close()

        'DataSource = Mydata.Regimen
        'XrTableCell5.DataBindings.Add("Text", DataSource, "Drug")
        'XrTableCell6.DataBindings.Add("Text", DataSource, "Num")
        ''    frmNationalRoption.Close()

        Dim CmdSearch As New MySqlCommand("SELECT count(tblcvoidrug.DrugName) as Num, tblcvoidrug.DrugName  FROM(select mv.Vid,mv.DatVisit,ai.ClinicID,ap.Status,mv.weight,ai.DafirstVisit,mv.ARTnum,ai.Sex from" &
        "(select v.ClinicID,v.DatVisit,v.ARTnum,v.Weight,v.Vid from tblcvmain v " &
        "inner join(select ClinicID,max(DatVisit) as DatVisit,Vid from tblcvmain where DatVisit<='" & Format(Edate, "yyyy-MM-dd") & "' group by ClinicID ) vv " &
        "on v.ClinicID=vv.ClinicID and v.DatVisit=vv.DatVisit) mv " &
        "left join tblcimain ai on ai.ClinicID=mv.ClinicID " &
        "left join(select * from tblcvpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') ap on ai.ClinicID=ap.ClinicID " &
        "where ap.Status is null) childpatientactive LEFT OUTER JOIN  tblcvoidrug ON childpatientactive.Vid = tblcvoidrug.Vid WHERE  (tblcvoidrug.Status IN (0, 2)) and childpatientactive.DaFirstVisit <= '" & Format(Edate, "yyyy-MM-dd") & "' group by tblcvoidrug.DrugName ORDER BY Num desc", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        Dim q1 As String
        While Rdr.Read
            Mydata.Regimen.AddRegimenRow(" " & Rdr.GetValue(1).ToString.Trim, Rdr.GetValue(0).ToString)
        End While
        Rdr.Close()
        dbtem.Close()

        DataSource = Mydata.Regimen
        XrTableCell5.DataBindings.Add("Text", DataSource, "Drug")
        XrTableCell6.DataBindings.Add("Text", DataSource, "Num")
    End Sub
End Class