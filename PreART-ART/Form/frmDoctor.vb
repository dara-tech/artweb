Imports MySql.Data.MySqlClient
Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Public Class frmDoctor
    Dim dt As DataTable
    Dim Rdr As MySqlDataReader
    Dim Did, s As Integer
    Dim su As Boolean = True
    Dim n As String

    Private Sub frmDoctor_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("Doctor Name", GetType(String))
        dt.Columns.Add("Status", GetType(String))
        dt.Columns.Add("Did", GetType(Integer))
        GridControl1.DataSource = dt
        GridView1.Columns("Did").Visible = False
    End Sub
    Private Sub Clear()
        txtDoctor.Text = ""
        CboStatus.SelectedIndex = -1
    End Sub

    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Clear()
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        If txtDoctor.Text.Trim = "" Then MessageBox.Show("Please input doctor name !", "Doctor Name", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If CboStatus.SelectedIndex = -1 Then MessageBox.Show("Please select status !", "Doctor Name", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        Dim a As Integer
        If CboStatus.Text = "Active" Then
            a = 1
        Else
            a = 0
        End If
        If su = True Then
            If MessageBox.Show("Are you sure do you want to save ?", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = vbYes Then
                'Dim a As Integer
                'If CboStatus.Text = "Active" Then
                '    a = 1
                'Else
                '    a = 0
                'End If
                Dim CmdSave As New MySqlCommand("Insert into tbldoctor values(Null,'" & txtDoctor.Text & "','" & a & "')", Cnndb)
                CmdSave.ExecuteNonQuery()
                Clear()
                MessageBox.Show("Saving Completed...", "Doctor...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If
        Else
            If MessageBox.Show("Are you sure do you want to edit ?", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = vbYes Then
                Dim CmdUpdate As New MySqlCommand("UPDATE `preart`.`tbldoctor` SET `Name`='" & txtDoctor.Text & "', `Status`='" & a & "' WHERE `Did`='" & Did & "' and`Name`='" & n & "' and`Status`='" & s & "';", Cnndb)
                CmdUpdate.ExecuteNonQuery()
                Clear()
                MessageBox.Show("Edeting Completed...", "Doctor...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                su = True
            End If
        End If
    End Sub

    Private Sub tsbReload_Click(sender As Object, e As EventArgs) Handles tsbReload.Click
        dt.Clear()
        Dim i As Int32
        Dim CmdSearch As New MySqlCommand("select * from tbldoctor ", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i

            dr(1) = Rdr.GetValue(1).ToString
            Select Case Val(Rdr.GetValue(2).ToString)
                Case 0
                    dr(2) = "Disactive"
                Case 1
                    dr(2) = "Active"
            End Select
            dr(3) = Rdr.GetValue(0).ToString
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub

    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        txtDoctor.Text = CStr(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Doctor Name"))
        n = txtDoctor.Text
        If GridView1.GetRowCellValue(hitInfo.RowHandle(), "Status").Equals("Active") Then
            CboStatus.SelectedIndex = 1
        Else
            CboStatus.SelectedIndex = 0
        End If
        s = CboStatus.SelectedIndex
        Did = CInt(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Did"))
        su = False
    End Sub

    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Protected Overrides Function ProcessCmdKey(ByRef msg As Message, keyData As Keys) As Boolean
        Select Case keyData
            Case Keys.F1
                tsbSave_Click(tsbSave, New EventArgs)
            Case Keys.F2
                Clear()
            Case Keys.F3
                '  tsbDelete_Click(tsbDelete, New EventArgs())
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function
End Class