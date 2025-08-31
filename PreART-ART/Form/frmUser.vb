Imports MySql.Data.MySqlClient
Imports System.Data.SqlTypes
Imports DevExpress.XtraGrid.Views.Grid
Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Public Class frmUser
    Dim Rdr As MySqlDataReader
    Private dt As DataTable
    Dim ui As Integer

    Private Sub frmUser_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        LoadHead()
    End Sub
#Region "Function"
    Private Sub Clear()
        txtUserName.Text = ""
        txtFullName.Text = ""
        txtPassword.Text = ""
        txtRepassword.Text = ""
        txtOldPassword.Text = ""
        txtUserName.Enabled = True
        txtOldPassword.Enabled = False
        rdStatus.SelectedIndex = 0
        txtUserName.Focus()
    End Sub
    Private Sub LoadHead()
        dt = New DataTable
        dt.Columns.Add("No")
        dt.Columns.Add("UserName")
        dt.Columns.Add("Full Name")
        dt.Columns.Add("Status")
        dt.Columns.Add("Uid")
        GridControl2.DataSource = dt
        GridView2.Columns("Uid").Visible = False

        Dim x As String
        Dim f As Integer
        'Dim CmdSearch As New MySqlCommand("SELECT  * from tblUser where Username='" & frmMain.us & "'   ", Cnndb)
        'Rdr = CmdSearch.ExecuteReader
        'While Rdr.Read

        '    f = f + 1
        '    If Val(Rdr.GetValue(4).ToString) = 1 Then
        '        x = "Disactive"
        '    Else
        '        x = "Active"
        '    End If
        '    Dim dr As DataRow = dt.NewRow()
        '    dr(0) = f
        '    dr(1) = Rdr.GetValue(1).ToString.Trim
        '    dr(2) = Rdr.GetValue(2).ToString.Trim
        '    dr(3) = x
        '    dr(4) = Rdr.GetValue(0).ToString.Trim

        '    dt.Rows.Add(dr)
        '    GridView2.BestFitColumns(True)

        'End While
        'GridControl2.DataSource = dt
        'Rdr.Close()
        ' GridView2.Columns("Uid").Visible = False

    End Sub
    Private Sub Save()
        Dim modSec As New modEncrypt
        Dim sPassword As String
        If vbYes = MsgBox("Do you want to create User Name.", MsgBoxStyle.Exclamation + MsgBoxStyle.YesNo, "Create User") Then
            Dim cmdSearch As New MySqlCommand("Select * from tblUser where username='" & txtUserName.Text & "'", Cnndb)
            Rdr = cmdSearch.ExecuteReader
            If Rdr.HasRows Then
                MessageBox.Show("Sorry this UserName already exist in the database.", "Create User", MessageBoxButtons.OK, MessageBoxIcon.Warning)
            Else
                Rdr.Close()
                sPassword = New SqlString(modSec.EncryptText(txtRepassword.Text))
                Dim CmdSave As New MySqlCommand("Insert into tblUser values(Null,'" & txtUserName.Text.Trim & "','" & sPassword & "','" & txtFullName.Text.Trim & "','" & rdStatus.SelectedIndex & "')", Cnndb)
                CmdSave.ExecuteNonQuery()
                Clear()
                MsgBox("New User has been inserted into the database successfully", MsgBoxStyle.Information, "Create User")
                Exit Sub
            End If
            Rdr.Close()
        End If
    End Sub
    Private Sub Edit()
        Dim modSec As New modEncrypt
        Dim sPassword As String
        Dim Cmdsearch As New MySqlCommand("Select * from tblUser where UserName='" & txtUserName.Text & "' and Pass='" & modSec.EncryptText(txtOldPassword.Text) & "' ", Cnndb)
        Rdr = Cmdsearch.ExecuteReader
        If Rdr.HasRows Then
            Rdr.Close()
            sPassword = New SqlString(modSec.EncryptText(txtRepassword.Text))
            Dim cmdSave As New MySqlCommand("Update tblUser set fullname='" & txtFullName.Text & "', Pass='" & sPassword & "',status='" & rdStatus.SelectedIndex & "' where uid='" & ui & "'", Cnndb)
            cmdSave.ExecuteNonQuery()
            MessageBox.Show("Update data is successfully!", "Edit Data", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        Else
            MessageBox.Show("Invalid Old Password !", "modify User", MessageBoxButtons.OK, MessageBoxIcon.Warning)
            Rdr.Close()
        End If

    End Sub

#End Region
    Private hitInfo As GridHitInfo = Nothing

    Private Sub tsbLoadData_Click(sender As Object, e As EventArgs) Handles tsbLoadData.Click
        Dim x As String
        Dim f As Integer

        GridControl2.DataSource = ""
        dt.Clear()
        Dim CmdSearch As New MySqlCommand("SELECT  * from tblUser    ", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read

            f = f + 1
            If Val(Rdr.GetValue(4).ToString) = 1 Then
                x = "Disactive"
            Else
                x = "Active"
            End If
            Dim dr As DataRow = dt.NewRow()
            dr(0) = f
            dr(1) = Rdr.GetValue(1).ToString.Trim
            dr(2) = Rdr.GetValue(3).ToString.Trim
            dr(3) = x
            dr(4) = Rdr.GetValue(0).ToString.Trim

            dt.Rows.Add(dr)
            GridView2.BestFitColumns(True)

        End While
        GridControl2.DataSource = dt
        Rdr.Close()
    End Sub
    Protected Overrides Function ProcessCmdKey(ByRef msg As Message, keyData As Keys) As Boolean
        Select Case keyData
            Case Keys.F1
                tsbSave_Click(tsbSave, New EventArgs)
            Case Keys.F2
                Clear()
            Case Keys.F3
                '    tsbDelete_Click(tsbDelete, New EventArgs())
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function
    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        If txtUserName.Text.Trim = "" Then MessageBox.Show("Please Input Username", "Create User", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtFullName.Text.Trim = "" Then MessageBox.Show("Please Input Full Name", "Create User", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtPassword.Text.Trim = "" Then MessageBox.Show("Please Input Password", "Create User", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtRepassword.Text.Trim = "" Then MessageBox.Show("Please Input Re-Password", "Create User", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtPassword.Text <> txtRepassword.Text Then MessageBox.Show("Password does not match", "Create User", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtOldPassword.Text.Trim = "" And txtOldPassword.Enabled = True Then MessageBox.Show("Please Input old Password", "Create User", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        If txtUserName.Enabled = True Then
            Save()
        Else
            Edit()
        End If
    End Sub

    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
    End Sub
    Private Sub GridControl2_DoubleClick(sender As Object, e As EventArgs) Handles GridControl2.DoubleClick
        txtUserName.Text = GridView2.GetRowCellValue(hitInfo.RowHandle(), "UserName")
        If txtUserName.Text.Trim = "" Then
            Exit Sub
        Else
            txtUserName.Enabled = False
            txtOldPassword.Enabled = True
        End If
        txtFullName.Text = GridView2.GetRowCellValue(hitInfo.RowHandle(), "Full Name")
        If GridView2.GetRowCellValue(hitInfo.RowHandle(), "Status") = "Active" Then
            rdStatus.SelectedIndex = 0
        Else
            rdStatus.SelectedIndex = 1
        End If
        ui = GridView2.GetRowCellValue(hitInfo.RowHandle(), "Uid")
    End Sub

    Private Sub GridControl2_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl2.MouseDown
        hitInfo = GridView2.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub txtUserName_EditValueChanged(sender As Object, e As EventArgs) Handles txtUserName.EditValueChanged

    End Sub

    Private Sub txtUserName_KeyDown(sender As Object, e As KeyEventArgs) Handles txtUserName.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtFullName_EditValueChanged(sender As Object, e As EventArgs) Handles txtFullName.EditValueChanged

    End Sub

    Private Sub txtFullName_KeyDown(sender As Object, e As KeyEventArgs) Handles txtFullName.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtOldPassword_EditValueChanged(sender As Object, e As EventArgs) Handles txtOldPassword.EditValueChanged

    End Sub

    Private Sub txtOldPassword_KeyDown(sender As Object, e As KeyEventArgs) Handles txtOldPassword.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtPassword_EditValueChanged(sender As Object, e As EventArgs) Handles txtPassword.EditValueChanged

    End Sub

    Private Sub txtPassword_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPassword.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtRepassword_EditValueChanged(sender As Object, e As EventArgs) Handles txtRepassword.EditValueChanged

    End Sub

    Private Sub txtRepassword_KeyDown(sender As Object, e As KeyEventArgs) Handles txtRepassword.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub GridControl2_Click(sender As Object, e As EventArgs) Handles GridControl2.Click

    End Sub
End Class