Imports MySql.Data.MySqlClient
Public Class frmQRcode
    Dim Rdr As MySqlDataReader
    Public Code, Id, Sex, Age As String
    Private Sub frmQRcode_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        'Code = frmMain.Art
        Dim f As New frmClinicID
        f.Text = "Print QR code Option"
        f.ShowDialog()
        'If f.txtClinicID.Text <> "" Then
        '    Id = f.txtClinicID.Text
        '    If IsNumeric(Id) Then
        '        ' LoadReport()
        '        Adult()
        '    Else
        '        Child()
        '    End If
        'End If
        'Sithorn...................

        If f.txtClinicID.Text <> "" Then
            Id = f.txtClinicID.Text
            If IsNumeric(Id) Then
                ' LoadReport()
                Adult()
            ElseIf Id.Substring(0, 1) = "P" Then
                Child()
            ElseIf Id.Substring(0, 1) = "E" Then
                Expose()
            End If
        End If
        '..............................
    End Sub
#Region "Function"
    Private Sub Adult()
        Dim CmdSearch1 As New MySqlCommand("Select * from tblavpatientstatus where ClinicID='" & Val(Id) & "'", ConnectionDB.Cnndb)
        Rdr = CmdSearch1.ExecuteReader
        While Rdr.Read
            '    D1 = True
            Select Case CDec(Rdr.GetValue(1).ToString)
                Case 0
                    MessageBox.Show("Sorry! Patient was Losted", " Patient Lost", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Case 1
                    MessageBox.Show("Sorry! Patient was Dead", "Check Patient Dead", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Case 2
                    MessageBox.Show("Sorry! Patient is HIV Test Negative", "Check Patient Dead", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Case 3
                    MessageBox.Show("Sorry! Patient is Transfer Out", "Patient Transfer Out", MessageBoxButtons.OK, MessageBoxIcon.Error)
            End Select
            Rdr.Close()
            Exit Sub
        End While
        Rdr.Close()

        Dim cmdSearch As New MySqlCommand("Select * from tblAImain where ClinicID='" & Val(Id) & "'", Cnndb)
        Rdr = cmdSearch.ExecuteReader
        While Rdr.Read
            Id = Format(Val(Id), "000000")
            Age = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(5).ToString), Now.Date)
            Sex = Rdr.GetValue(6).ToString.Trim
        End While
        Rdr.Close()
        LoadReport()
    End Sub

    Private Sub LoadReport()
        'Dim report1 As New QRcode
        'DocumentViewer1.PrintingSystem = report1.PrintingSystem
        'report1.CreateDocument()
        '......
        Dim report1 As New QRcode
        DocumentViewer1.PrintingSystem = report1.PrintingSystem
        report1.CreateDocument()
        Dim left, right, bottom, top As Single
        Dim CmdSearch1 As New MySqlCommand("SELECT * FROM preart.tblmargins;", ConnectionDB.Cnndb)
        Rdr = CmdSearch1.ExecuteReader
        While Rdr.Read
            left = Convert.ToSingle(Rdr.GetValue(0).ToString.Trim) * 300
            right = Convert.ToSingle(Rdr.GetValue(1).ToString.Trim) * 300
            top = Convert.ToSingle(Rdr.GetValue(2).ToString.Trim) * 300
            bottom = Convert.ToSingle(Rdr.GetValue(3).ToString.Trim) * 300
        End While
        Rdr.Close()
        DocumentViewer1.ExecCommand(DevExpress.XtraPrinting.PrintingSystemCommand.PageMargins, New Object() {New DevExpress.XtraPrinting.Native.MarginsF(left, right, top, bottom)})
    End Sub

    Private Sub Child()
        Dim cmdSearch As New MySqlCommand("Select * from tblCImain where ClinicID='" & Id & "'", Cnndb)
        Rdr = cmdSearch.ExecuteReader
        While Rdr.Read
            Age = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), Now.Date)
            Sex = Rdr.GetValue(4).ToString.Trim
        End While
        Rdr.Close()
        LoadReport()
    End Sub
    'Sithorn.....................
    Private Sub Expose()
        Dim cmdSearch As New MySqlCommand("Select * from tbleimain where ClinicID='" & Id & "'", Cnndb)
        Rdr = cmdSearch.ExecuteReader
        While Rdr.Read
            Age = DateDiff(DateInterval.Month, CDate(Rdr.GetValue(2).ToString), Now.Date)
            Sex = Rdr.GetValue(3).ToString.Trim
        End While
        Rdr.Close()
        LoadReport()
    End Sub
    '............................
#End Region


End Class