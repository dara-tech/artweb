Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class AdultStatus
    Dim Rdr As MySqlDataReader

    Private Sub AdultStatus_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim Mydata As New DataSet
        Mydata.test.Clear()
        'Dim CmdSearch As New MySqlCommand("SELECT tblaimain.ClinicID, tblaart.ART, tblaimain.Sex, tblavpatientstatus.Status, tblavpatientstatus.Da, tblavpatientstatus.Place, tblavpatientstatus.Cause FROM         tblaart RIGHT OUTER JOIN tblavpatientstatus ON tblaart.ClinicID = tblavpatientstatus.ClinicID LEFT OUTER JOIN tblaimain ON tblavpatientstatus.ClinicID = tblaimain.ClinicID where tblavpatientstatus.Da BETWEEN '" & Format(frmPatientStatus.Sdate, "yyyy-MM-dd") & "' AND '" & Format(frmPatientStatus.Edate, "yyyy-MM-dd") & "' ", Cnndb)
        'Rdr = CmdSearch.ExecuteReader
        Dim CmdSearch As New MySqlCommand("SELECT tblaimain.ClinicID, tblaart.ART, tblaimain.Sex, tblavpatientstatus.Status, tblavpatientstatus.Da, tblavpatientstatus.Place, tblavpatientstatus.Cause, substring_index(tblavpatientstatus.Cause,'/',-1) as CauseSplit, tblcausedeath.Cause FROM tblaart RIGHT OUTER JOIN tblavpatientstatus ON tblaart.ClinicID = tblavpatientstatus.ClinicID LEFT OUTER JOIN tblaimain ON tblavpatientstatus.ClinicID = tblaimain.ClinicID LEFT OUTER JOIN tblcausedeath ON cast(substring_index(tblavpatientstatus.Cause,'/',-1) as unsigned)= tblcausedeath.ID where tblavpatientstatus.Da BETWEEN '" & Format(frmPatientStatus.Sdate, "yyyy-MM-dd") & "' AND '" & Format(frmPatientStatus.Edate, "yyyy-MM-dd") & "' ", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Dim Sx, S, h, p As String
            h = "" : p = "" : S = ""
            Select Case Val(Rdr.GetValue(2).ToString)
                Case 0
                    Sx = "Female"
                Case 1
                    Sx = "Male"
            End Select
            Select Case CDbl(Rdr.GetValue(3).ToString)
                    'Lost
                Case 0
                    S = "Lost"
                    If Rdr.GetValue(1).ToString.Trim <> "" Then
                        XrTableCell26.Text = Val(XrTableCell26.Text) + 1
                    Else
                        XrTableCell17.Text = Val(XrTableCell17.Text) + 1
                    End If
                         'Death
                Case 1
                    S = "Death"
                    'Sithorn.............
                    If Rdr.GetValue(8).ToString.Trim = "" Then
                        p = Rdr.GetValue(7).ToString.Trim
                    Else
                        p = Rdr.GetValue(8).ToString.Trim
                    End If
                    '....................
                    'p = Rdr.GetValue(6).ToString.Trim 'B Phana
                    'Test Negative
                    If Rdr.GetValue(1).ToString.Trim <> "" Then
                        XrTableCell28.Text = Val(XrTableCell28.Text) + 1
                    Else
                        XrTableCell19.Text = Val(XrTableCell19.Text) + 1
                    End If
                Case 2
                    S = "HIV Test Nagative"
                    XrTableCell16.Text = Val(XrTableCell16.Text) + 1
                       '  transter out
                Case 3
                    S = "Transfer Out"
                    h = Rdr.GetValue(6)
                    XrTableCell27.Text = Val(XrTableCell27.Text) + 1
            End Select
            Select Case CDbl(Rdr.GetValue(5).ToString)
                Case 0
                    h = "Home"
                Case 1
                    h = "Hosptial"
                Case 2
                    h = "Other"
            End Select
            Mydata.test.AddtestRow(Format(Val(Rdr.GetValue(0).ToString), "000000"), Rdr.GetValue(1).ToString, Sx, S, h, p, Format(CDate(Rdr.GetValue(4).ToString), "dd-MM-yyyy"), "")
        End While
        Rdr.Close()
        lbldate.Text = frmPatientStatus.Sdate & " To " & frmPatientStatus.Edate
        DataSource = Mydata.test
        XrTableCell6.DataBindings.Add("Text", DataSource, "Dat")
        XrTableCell8.DataBindings.Add("Text", DataSource, "DatCollect")
        XrTableCell9.DataBindings.Add("Text", DataSource, "CD4")
        XrTableCell10.DataBindings.Add("Text", DataSource, "Cop")
        XrTableCell12.DataBindings.Add("Text", DataSource, "Lo")
        XrTableCell13.DataBindings.Add("Text", DataSource, "Hcop")
        XrTableCell14.DataBindings.Add("Text", DataSource, "Hlo")

    End Sub
End Class