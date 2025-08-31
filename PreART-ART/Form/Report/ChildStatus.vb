Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class ChildStatus
    Dim rdr As MySqlDataReader
    Private Sub ChildStatus_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim Mydata As New DataSet
        Mydata.test.Clear()
        'Dim CmdSearch As New MySqlCommand("SELECT tblcimain.ClinicID, tblcart.ART, tblcimain.Sex, tblcvpatientstatus.Status, tblcvpatientstatus.Da, tblcvpatientstatus.Place, tblcvpatientstatus.Cause FROM tblcart RIGHT OUTER JOIN tblcvpatientstatus ON tblcart.ClinicID = tblcvpatientstatus.ClinicID LEFT OUTER JOIN tblcimain ON tblcvpatientstatus.ClinicID = tblcimain.ClinicID where tblcvpatientstatus.Da BETWEEN '" & Format(frmPatientStatus.Sdate, "yyyy-MM-dd") & "' AND '" & Format(frmPatientStatus.Edate, "yyyy-MM-dd") & "' ", Cnndb)
        'rdr = CmdSearch.ExecuteReader
        Dim CmdSearch As New MySqlCommand("SELECT tblcimain.ClinicID, tblcart.ART, tblcimain.Sex, tblcvpatientstatus.Status, tblcvpatientstatus.Da, tblcvpatientstatus.Place, tblcvpatientstatus.Cause, substring_index(tblcvpatientstatus.Cause,'/',-1) as CauseSplit, tblcausedeath.Cause FROM tblcart RIGHT OUTER JOIN tblcvpatientstatus ON tblcart.ClinicID = tblcvpatientstatus.ClinicID LEFT OUTER JOIN tblcimain ON tblcvpatientstatus.ClinicID = tblcimain.ClinicID LEFT OUTER JOIN tblcausedeath ON cast(substring_index(tblcvpatientstatus.Cause,'/',-1) as unsigned)= tblcausedeath.ID where tblcvpatientstatus.Da BETWEEN '" & Format(frmPatientStatus.Sdate, "yyyy-MM-dd") & "' AND '" & Format(frmPatientStatus.Edate, "yyyy-MM-dd") & "' ", Cnndb)
        rdr = CmdSearch.ExecuteReader
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
                    If rdr.GetValue(8).ToString.Trim = "" Then
                        p = rdr.GetValue(7).ToString.Trim
                    Else
                        p = rdr.GetValue(8).ToString.Trim
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
            Mydata.test.AddtestRow(rdr.GetValue(0).ToString, rdr.GetValue(1).ToString, Sx, S, h, p, Format(CDate(rdr.GetValue(4).ToString), "dd-MM-yyyy"), "")
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