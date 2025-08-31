Imports MySql.Data.MySqlClient
Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Public Class frmCounsellor
    Dim dt As DataTable
    Dim Rdr As MySqlDataReader
    Dim Cid As Integer
    Private Sub frmDoctor_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("Cid", GetType(Int16))
        dt.Columns.Add("Name", GetType(String))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Phone", GetType(String))
        dt.Columns.Add("Date-Reg", GetType(Date))
        dt.Columns.Add("Status", GetType(String))
        GridControl1.DataSource = dt
        GridView1.Columns("Cid").Visible = False
    End Sub
    Private Sub Clear()
        Cid = Nothing
        txtCounsellorName.Text = ""
        txtCounsellorPhone.Text = "0"
        DaCounsellor.EditValue = "01/01/1900"
        RdCounsellorSex.SelectedIndex = -1
        CboCounsellorStatus.SelectedIndex = -1
    End Sub

    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Clear()
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        If Cid = Nothing Then
            If txtCounsellorName.Text.Trim = "" Then MessageBox.Show("Please input name !", "Counsellor Name", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
            If RdCounsellorSex.SelectedIndex = -1 Then MessageBox.Show("Please select sex !", "Counsellor Sex", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
            If CboCounsellorStatus.SelectedIndex = -1 Then MessageBox.Show("Please select status !", "Counsellor Name", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
            If MessageBox.Show("Are you sure do you want to save ?", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = vbYes Then
                Dim a As Integer
                If CboCounsellorStatus.Text = "Active" Then
                    a = 1
                Else
                    a = 0
                End If
                Dim CmdSave As New MySqlCommand("Insert into tblcounselor values(Null,'" & txtCounsellorName.Text & "','" & RdCounsellorSex.EditValue.ToString & "','" & txtCounsellorPhone.Text & "','" & Format(CDate(DaCounsellor.Text), "yyyy-MM-dd") & "','" & a & "')", Cnndb)
                CmdSave.ExecuteNonQuery()
                Clear()
                MessageBox.Show("Saving Completed...", "Counsellor...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If

        Else
            If MessageBox.Show("Are you sure do you want to Edit ?", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim a As Integer
                If CboCounsellorStatus.Text = "Active" Then
                    a = 1
                Else
                    a = 0
                End If
                Dim CmdEdit As New MySqlCommand("Update tblcounselor set Name='" & txtCounsellorName.Text & "',Sex='" & RdCounsellorSex.EditValue.ToString & "',Phone='" & txtCounsellorPhone.Text & "',Dat='" & Format(CDate(DaCounsellor.EditValue), "yyyy/MM/dd") & "',status='" & a & "' where Cid='" & Cid & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Clear()
                MessageBox.Show("Success for Edit...", "Edit...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If
            Cid = Nothing
        End If

    End Sub

    Private Sub tsbReload_Click(sender As Object, e As EventArgs) Handles tsbReload.Click
        dt.Clear()
        Dim i As Int32
        Dim CmdSearch As New MySqlCommand("select * from tblcounselor ", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Rdr.GetValue(0).ToString
            dr(2) = Rdr.GetValue(1).ToString
            Select Case Val(Rdr.GetValue(2).ToString)
                Case 0
                    dr(3) = "Female"
                Case 1
                    dr(3) = "Male"
            End Select
            dr(4) = Rdr.GetValue(3).ToString
            dr(5) = Format(CDate(Rdr.GetValue(4).ToString), "dd/MM/yyyy")
            Select Case Val(Rdr.GetValue(5).ToString)
                Case 0
                    dr(6) = "Disactive"
                Case 1
                    dr(6) = "Active"
            End Select
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
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

    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Cid = CType(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Cid"), Integer)
        txtCounsellorName.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Name")
        Select Case CType(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex"), String)
            Case "Female"
                RdCounsellorSex.SelectedIndex = 1
            Case Else
                RdCounsellorSex.SelectedIndex = 0
        End Select
        txtCounsellorPhone.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Phone")
        DaCounsellor.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date-Reg")
        CboCounsellorStatus.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Status")
    End Sub
    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub
End Class