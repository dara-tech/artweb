Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class SubReportATransfter
    Dim Rdr As MySqlDataReader

    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

    End Sub

    Protected Overrides Sub Finalize()
        MyBase.Finalize()
    End Sub

    Private Sub SubReportATransfter_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        Dim Mydata As New DataSet
        Mydata.test.Clear()
        If frmTransferOutReport.Id = "" Then Exit Sub
        Dim CmdSearch As New MySqlCommand("select * from tblpatienttest where CAST(tblPatientTest.ClinicID as signed)='" & Val(frmTransferOutReport.Id) & "' order by dat desc", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Dim da As Date = "1/1/1900"
            If Rdr.GetValue(4).ToString.Trim <> "" Then
                da = Rdr.GetValue(4).ToString
            End If
            If Rdr.GetValue(5).ToString.Trim <> "" Or Rdr.GetValue(8).ToString.Trim <> "" Or Rdr.GetValue(9).ToString.Trim <> "" Or Rdr.GetValue(10).ToString.Trim <> "" Or Rdr.GetValue(11).ToString.Trim <> "" Then
                'Mydata.test.AddtestRow(Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy"), Format(da, "dd-MM-yyyy"), Rdr.GetValue(5).ToString.Trim, Rdr.GetValue(8).ToString.Trim, Rdr.GetValue(9).ToString.Trim, Rdr.GetValue(10).ToString.Trim, Rdr.GetValue(11).ToString.Trim, "")
                Mydata.test.AddtestRow(Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy"), Format(da, "dd-MM-yyyy"), Rdr.GetValue(6).ToString.Trim, Rdr.GetValue(9).ToString.Trim, Rdr.GetValue(10).ToString.Trim, Rdr.GetValue(11).ToString.Trim, Rdr.GetValue(12).ToString.Trim, "")
            End If
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