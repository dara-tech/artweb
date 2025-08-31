Imports MySql.Data.MySqlClient
Public Class frmNationalRoption
    Dim Rdr As MySqlDataReader
    Private Sub btnclose_Click(sender As Object, e As EventArgs) Handles btnclose.Click
        Me.Close()
    End Sub

    Private Sub btncloseO_Click(sender As Object, e As EventArgs)
        Me.Close()
    End Sub

    Private Sub btnReport_Click(sender As Object, e As EventArgs) Handles btnReport.Click

        If TabControl1.SelectedIndex = 0 Then
            If cboYear.SelectedIndex >= 0 Then
                Me.Cursor = Cursors.WaitCursor
                '  _daStart = DateSerial(cboYear.Text, cboQuarter.Text, cboQuarter.Text)
                GoTo k1
            Else
                MessageBox.Show("Please select year first.", "Report by Quarter", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Exit Sub
            End If
        Else
            If daStart.Value = CDate("01/01/1900") Then
                MessageBox.Show("Please Select Start Date!", "Report by Option", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Exit Sub
            End If
            If daEnd.Value = CDate("01/01/1900") Then
                MessageBox.Show("Please Select End Date!", "Report by Option", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Exit Sub
            End If
            If daStart.Value > daEnd.Value Then
                MessageBox.Show("The End date must be greater then Start Date", "Report by Option", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Exit Sub
            End If
            GoTo k1
        End If
k1:

        Me.Close()

    End Sub



    Private Sub frmNationalRoption_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        LoadYear()
    End Sub
    Private Sub LoadYear()
        '   Check_Connection_Database()
        Dim i, k As Integer
        Try
            Dim CmdYear As New MySqlCommand("Select  MIN(DaFirstVisit) AS MinDate from tblaimain ORDER BY MIN(DaFirstVisit) limit 1", Cnndb)
            Rdr = CmdYear.ExecuteReader
            Rdr.Read()
            If Rdr.GetValue(0).ToString = "" Then
                Rdr.Close()
                k = 1
                GoTo g
            End If
            i = Format(Rdr.GetValue(0), "yyyy")
            Rdr.Close()
            '   Cnndb.Close()
            cboYear.Items.Clear()
            For a As Integer = i To Format(Date.Now.Date, "yyyy")
                cboYear.Items.Add(a)
            Next
g:

            If k = 1 Then
                Dim CmdYear1 As New MySqlCommand("Select MIN(DaFirstVisit) AS MinDate from tblcimain ORDER BY MIN(DaFirstVisit) limit 1", Cnndb)
                Rdr = CmdYear1.ExecuteReader
                Rdr.Read()
                i = Format(Rdr.GetValue(0), "yyyy")
                Rdr.Close()
                '   Cnndb.Close()
                For a As Integer = i To Format(Date.Now.Date, "yyyy")
                    cboYear.Items.Add(a)
                Next
            End If
        Catch ex As Exception

        End Try
    End Sub
End Class