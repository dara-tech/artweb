Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class SubReportCTransfter
    Dim Rdr As MySqlDataReader
    Private Sub SubReportCTransfter_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim Mydata As New DataSet
        If frmTransferOutReport.Id = "" Then Exit Sub
        Dim CmdSearch As New MySqlCommand("select * from tblpatienttest where tblPatientTest.ClinicID='" & frmTransferOutReport.Id & "' order by dat desc", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            'Mydata.test.AddtestRow(Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy"), Format(CDate(Rdr.GetValue(4).ToString), "dd-MM-yyyy"), Rdr.GetValue(5).ToString.Trim, Rdr.GetValue(6).ToString.Trim, Rdr.GetValue(7).ToString.Trim, Rdr.GetValue(8).ToString.Trim, Rdr.GetValue(9).ToString.Trim, "")
            Mydata.test.AddtestRow(Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy"), Format(CDate(Rdr.GetValue(4).ToString), "dd-MM-yyyy"), Rdr.GetValue(6).ToString.Trim, Rdr.GetValue(7).ToString.Trim, Rdr.GetValue(8).ToString.Trim, Rdr.GetValue(9).ToString.Trim, Rdr.GetValue(10).ToString.Trim, "")
        End While
        Rdr.Close()

        DataSource = Mydata.test
        XrTableCell4.DataBindings.Add("Text", DataSource, "Dat")
        XrTableCell5.DataBindings.Add("Text", DataSource, "DatCollect")
        XrTableCell6.DataBindings.Add("Text", DataSource, "CD4")
        XrTableCell11.DataBindings.Add("Text", DataSource, "Cop")
        XrTableCell12.DataBindings.Add("Text", DataSource, "Lo")
        XrTableCell13.DataBindings.Add("Text", DataSource, "Hcop")
        XrTableCell14.DataBindings.Add("Text", DataSource, "Hlo")
    End Sub
End Class