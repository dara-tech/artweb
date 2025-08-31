Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class ChildFamily
    Dim Rdr As MySqlDataReader

    Private Sub ChildFamily_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim Mydata As New DataSet
        If frmTransferOutReport.Id = "" Then Exit Sub
        Dim CmdFc As New MySqlCommand("Select * from tblcifamily where clinicid='" & frmTransferOutReport.Id & "'", Cnndb)
        Rdr = CmdFc.ExecuteReader
        While Rdr.Read
            Dim f, h, s, a, p, t As String
            Select Case CDbl(Rdr.GetValue(1).ToString)
                Case 0
                    f = "Mother"
                Case 1
                    f = "Father"
            End Select
            Select Case CDbl(Rdr.GetValue(3).ToString)
                Case 0
                    h = "Negative"
                Case 1
                    h = "Postive"
                Case 2
                    h = "Unknown"
            End Select
            Select Case CDbl(Rdr.GetValue(4).ToString)
                Case 0
                    s = "Dead"
                Case 1
                    s = "Alive"
                Case 2
                    s = "Unknown"
            End Select
            Select Case CDbl(Rdr.GetValue(5).ToString)
                Case 0
                    a = "Yes"
                Case 1
                    a = "No"
                Case 2
                    a = "Unknown"
            End Select
            Select Case CDbl(Rdr.GetValue(6).ToString)
                Case 0
                    p = "During pregnancy"
                Case 1
                    p = "During delivery"
                Case 2
                    p = "After delivery"
            End Select
            Select Case CDbl(Rdr.GetValue(8).ToString)
                Case 0
                    t = "Yes"
                Case 1
                    t = "No"
                Case 2
                    t = "Unknown"
            End Select
            Mydata.test.AddtestRow(f, Rdr.GetValue(2).ToString, h, s, a, p, t, Rdr.GetValue(7).ToString)
        End While
        Rdr.Close()
        DataSource = Mydata.test
        XrTableCell5.DataBindings.Add("Text", DataSource, "Dat")
        XrTableCell6.DataBindings.Add("Text", DataSource, "DatCollect")
        XrTableCell11.DataBindings.Add("Text", DataSource, "CD4")
        XrTableCell12.DataBindings.Add("Text", DataSource, "Cop")
        XrTableCell13.DataBindings.Add("Text", DataSource, "Lo")
        XrTableCell14.DataBindings.Add("Text", DataSource, "Hcop")
        XrTableCell16.DataBindings.Add("Text", DataSource, "Hlo")
        XrTableCell15.DataBindings.Add("Text", DataSource, "Blank")
    End Sub
End Class