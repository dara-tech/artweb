
Imports System.Drawing.Printing
Imports DevExpress.XtraCharts
Imports MySql.Data.MySqlClient
Public Class AdultSummary
    Dim Rdr As MySqlDataReader
    Private Sub AdultSummary_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim df As Date
        Dim vi As Double
        Dim CmdSearch As New MySqlCommand("SELECT   tblaimain.ClinicID, tblaimain.DafirstVisit, tblaimain.DaBirth, tblaimain.Sex, tblaimain.Education, tblaimain.Rea, tblaimain.Write, tblaimain.Referred, tblaimain.DaHIV, tblaumain.Marital, tblaumain.Occupation, tblaumain.Daupdate , tblaart.ART, tblaart.DaArt FROM         tblaimain LEFT OUTER JOIN  tblaart ON tblaimain.ClinicID = tblaart.ClinicID LEFT OUTER JOIN  tblaumain ON tblaimain.ClinicID = tblaumain.ClinicID WHERE (tblaimain.ClinicID = '" & frmSummaryAdult.id & "')  ORDER BY tblaumain.Daupdate DESC", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            XrLabel4.Text = "ClinicID: " & Format(frmSummaryAdult.id, "000000")
            Select Case Val(Rdr.GetValue(3).ToString)
                Case 0
                    XrLabel5.Text = "Sex: " + "Female"
                Case 1
                    XrLabel5.Text = "Sex: " + "Male"
            End Select
            XrLabel7.Text = "Date of birth: " + Format(CDate(Rdr.GetValue(2).ToString), "dd-MM-yyyy")
            XrLabel6.Text = "Date first visit: " + Format(CDate(Rdr.GetValue(1).ToString), "dd-MM-yyyy")
            df = Rdr.GetValue(2).ToString
            Select Case Val(Rdr.GetValue(7).ToString)
                Case 0
                    XrLabel13.Text = "Referred From: " + "Self Referral"
                Case 1
                    XrLabel13.Text = "Referred From: " + "HBC"
                Case 2
                    XrLabel13.Text = "Referred From: " + "VCCT"
                Case 3
                    XrLabel13.Text = "Referred From: " + "PMTCT"
                Case 4
                    XrLabel13.Text = "Referred From: " + "TB Program"
                Case 5
                    XrLabel13.Text = "Referred From: " + "Blood Bank"
                Case 6
                    XrLabel13.Text = "Referred From: " + "Other"
            End Select
            Select Case Val(Rdr.GetValue(4).ToString)
                Case 0
                    XrLabel10.Text = "Education: " + "None"
                Case 1
                    XrLabel10.Text = "Education: " + "Primary"
                Case 2
                    XrLabel10.Text = "Education: " & "Secondary"
                Case 3
                    XrLabel10.Text = "Education: " & "University"
            End Select
            Select Case Val(Rdr.GetValue(5).ToString)
                Case 0
                    XrLabel11.Text = "Read: " + "No"
                Case 1
                    XrLabel11.Text = "Read: " + "Yes"
            End Select
            Select Case Val(Rdr.GetValue(6).ToString)
                Case 0
                    XrLabel12.Text = "Write: " + "No"
                Case 1
                    XrLabel12.Text = "Write: " + "Yes"
            End Select
            XrLabel14.Text = "Date Confirm Positive: " + Format(CDate(Rdr.GetValue(8).ToString), "dd-MM-yyyy")
            XrLabel16.Text = "Occupation: " + Rdr.GetValue(10).ToString
            Select Case Val(Rdr.GetValue(9).ToString)
                Case 0
                    XrLabel15.Text = "Marital Status: " + "Single"
                Case 1
                    XrLabel15.Text = "Marital Status: " + "Married"
                Case 2
                    XrLabel15.Text = "Marital Status: " + "Divorced"
                Case 3
                    XrLabel15.Text = "Marital Status: " + "Window(er)"
            End Select
            XrLabel17.Text = "ART Number: " + Rdr.GetValue(12).ToString
            If Rdr.GetValue(12).ToString.Trim <> "" Then XrLabel18.Text = "Date start: " + Format(CDate(Rdr.GetValue(13).ToString), "dd-MM-yyyy")
        End While
        Rdr.Close()
        Dim CmdSV As New MySqlCommand("Select * from tblavmain where clinicid='" & frmSummaryAdult.id & "' order by datvisit desc limit 1", Cnndb)
        Rdr = CmdSV.ExecuteReader
        While Rdr.Read
            XrLabel9.Text = "Date last visit: " + Format(CDate(Rdr.GetValue(2).ToString), "dd-MM-yyyy")
            XrLabel8.Text = "Age: " & DateDiff(DateInterval.Year, df, CDate(Rdr.GetValue(2).ToString))
            XrLabel19.Text = "WHO: " & Val(Rdr.GetValue(44).ToString) + 1
            vi = Rdr.GetValue(78).ToString
        End While
        Rdr.Close()
        Dim i As Integer
        Dim dg As String
        Dim CmdDr As New MySqlCommand("Select * from tblavarvdrug where vid='" & vi & "' and status in (0,2) order by DrugName", Cnndb)
        Rdr = CmdDr.ExecuteReader
        While Rdr.Read
            If i = 0 Then
                dg = Rdr.GetValue(0).ToString
            Else
                dg = dg & "+" & Rdr.GetValue(0).ToString.Trim
            End If
            i = 1
        End While
        Rdr.Close()
        i = 0
        XrLabel20.Text = "ARV drug: " & dg
        dg = ""
        Dim CmdDo As New MySqlCommand("Select * from tblavoidrug where vid='" & vi & "' and status in (0,2) order by DrugName", Cnndb)
        Rdr = CmdDo.ExecuteReader
        While Rdr.Read
            If i = 0 Then
                dg = Rdr.GetValue(0).ToString
            Else
                dg = dg & "---" & Rdr.GetValue(0).ToString.Trim
            End If
            i = 1
        End While
        Rdr.Close()
        XrLabel21.Text = "OI drug: " & dg
        dg = ""
        i = 0
        Dim CmdDv As New MySqlCommand("Select * from tblavhydrug where vid='" & vi & "' and status in (0,2) order by DrugName", Cnndb)
        Rdr = CmdDv.ExecuteReader
        While Rdr.Read
            If i = 0 Then
                dg = Rdr.GetValue(0).ToString
            Else
                dg = dg & "---" & Rdr.GetValue(0).ToString.Trim
            End If
            i = 1
        End While
        Rdr.Close()
        XrLabel22.Text = "HCV drug: " & dg
    End Sub

    Private Sub XrChart1_BeforePrint(sender As Object, e As PrintEventArgs) Handles XrChart1.BeforePrint
        Dim series1 As New Series("Weight", ViewType.Line)
        Dim i As Integer
        Dim CmdSearch As New MySqlCommand("Select Weight,datvisit from tblavmain where clinicid ='" & frmSummaryAdult.id & "' order by datvisit", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            'i = i + 1
            series1.Points.Add(New SeriesPoint(CDate(Rdr.GetValue(1).ToString), Val(Rdr.GetValue(0).ToString)))
        End While
        Rdr.Close()
        XrChart1.Series.Add(series1)
        series1.ArgumentScaleType = ScaleType.DateTime
        series1.ValueScaleType = ScaleType.Numerical

        Dim diagram As XYDiagram = TryCast(XrChart1.Diagram, XYDiagram)
        diagram.AxisX.DateTimeScaleOptions.GridAlignment = DateTimeGridAlignment.Month
        diagram.AxisX.DateTimeScaleOptions.MeasureUnit = DateTimeMeasureUnit.Month
        diagram.AxisX.Label.TextPattern = "{V:MMM/yyyy}"
    End Sub

    Private Sub XrChart2_BeforePrint(sender As Object, e As PrintEventArgs) Handles XrChart2.BeforePrint
        Dim series1 As New Series("CD4", ViewType.Line)
        Dim i As Integer
        'Dim CmdCD4 As New MySqlCommand("Select CD4,dat from tblpatienttest where clinicid='" & Format(frmSummaryAdult.id, "000000") & "' and CD4 <>'' order by dat", Cnndb)
        Dim CmdCD4 As New MySqlCommand("Select CD4,dat from tblpatienttest where clinicid='" & frmSummaryAdult.id & "' and CD4 <>'' order by dat", Cnndb)
        Rdr = CmdCD4.ExecuteReader
        While Rdr.Read
            '  i = i + 1
            series1.Points.Add(New SeriesPoint(CDate(Rdr.GetValue(1).ToString), Val(Rdr.GetValue(0).ToString)))
        End While
        Rdr.Close()
        XrChart2.Series.Add(series1)
        series1.ArgumentScaleType = ScaleType.DateTime
        series1.ValueScaleType = ScaleType.Numerical

        Dim diagram As XYDiagram = TryCast(XrChart2.Diagram, XYDiagram)
        diagram.AxisX.DateTimeScaleOptions.GridAlignment = DateTimeGridAlignment.Month
        diagram.AxisX.DateTimeScaleOptions.MeasureUnit = DateTimeMeasureUnit.Month
        diagram.AxisX.Label.TextPattern = "{V:MMM/yyyy}"
    End Sub

    Private Sub XrChart3_BeforePrint(sender As Object, e As PrintEventArgs) Handles XrChart3.BeforePrint
        Dim series1 As New Series("Log", ViewType.Line)
        Dim series2 As New Series("Copy", ViewType.Line)
        Dim i As Date
        'Dim CmdCD4 As New MySqlCommand("Select HIVLoad,HIVLog,dat from tblpatienttest where clinicid='" & Format(frmSummaryAdult.id, "000000") & "' and HIVLoad <>'' order by dat", Cnndb)
        Dim CmdCD4 As New MySqlCommand("Select HIVLoad,HIVLog,dat from tblpatienttest where clinicid='" & frmSummaryAdult.id & "' and HIVLoad <>'' order by dat", Cnndb)
        Rdr = CmdCD4.ExecuteReader
        While Rdr.Read
            i = Rdr.GetValue(2).ToString
            series1.Points.Add(New SeriesPoint(i, Val(Rdr.GetValue(1).ToString)))
            series2.Points.Add(New SeriesPoint(i, Val(Rdr.GetValue(0).ToString)))
        End While
        Rdr.Close()
        XrChart3.Series.Add(series1)
        XrChart3.Series.Add(series2)
        series1.ArgumentScaleType = ScaleType.DateTime
        series1.ValueScaleType = ScaleType.Numerical

        series2.ArgumentScaleType = ScaleType.DateTime
        series2.ValueScaleType = ScaleType.Numerical

        Dim diagram As XYDiagram = TryCast(XrChart3.Diagram, XYDiagram)
        diagram.AxisX.DateTimeScaleOptions.GridAlignment = DateTimeGridAlignment.Month
        diagram.AxisX.DateTimeScaleOptions.MeasureUnit = DateTimeMeasureUnit.Month
        diagram.AxisX.Label.TextPattern = "{V:MMM/yyyy}"


    End Sub
End Class