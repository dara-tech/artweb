Imports MySql.Data.MySqlClient

Public Class frmSite
    Dim Rdr As MySqlDataReader
    Dim b As Boolean
    Private Sub BtnOk_Click(sender As Object, e As EventArgs) Handles BtnOk.Click
        If txtNameEn.Text.Trim = "" Then MessageBox.Show("Please Input Site Name (Latin)", "Save Site Name", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        If txtNameKh.Text.Trim = "" Then MessageBox.Show("Please Input Site Name (Khmer)", "Save Site Name", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        If txtCode.Text.Trim = "" Then MessageBox.Show("Please Input Site Code", "Save Site Name", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        If cboProvince.SelectedIndex = -1 Then MessageBox.Show("Please Select Province ", "Save Site Name", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        If cbodistric.SelectedIndex = -1 Then MessageBox.Show("Please Select District ", "Save Site Name", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        If CboODName.SelectedIndex = -1 Then MessageBox.Show("Please Select OD ", "Save Site Name", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        frmMain.Art = txtCode.Text
        If b = False Then
            Dim CmdSave As New MySqlCommand("Insert into tblsitename values('" & txtNameEn.Text & "',N'" & txtNameKh.Text & "','" & txtCode.Text & "','" & cboProvince.Text & "','" & cbodistric.Text & "','" & CboODName.Text & "')", Cnndb)
            CmdSave.ExecuteNonQuery()
        Else
            Dim CmdSave As New MySqlCommand("Update tblsitename set NameEn='" & txtNameEn.Text & "',NameKh=N'" & txtNameKh.Text & "', SiteCode ='" & txtCode.Text & "', Province ='" & cboProvince.Text & "', District ='" & cbodistric.Text & "', ODname ='" & CboODName.Text & "'", Cnndb)
            CmdSave.ExecuteNonQuery()
        End If
        Me.Close()
    End Sub

    Private Sub frmSite_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Dim Cmdadd As New MySqlCommand("select * from tblprovince ORDER BY Pid", Cnndb)
        Rdr = Cmdadd.ExecuteReader
        While Rdr.Read
            cboProvince.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        Dim Pro, Od, dis As String
        Dim CmdSearchsite As New MySqlCommand("Select * from tblsitename", Cnndb)
        Rdr = CmdSearchsite.ExecuteReader
        While Rdr.Read
            txtNameEn.Text = Rdr.GetValue(0).ToString.Trim
            txtNameKh.Text = Rdr.GetValue(1).ToString.Trim
            txtCode.Text = Rdr.GetValue(2).ToString.Trim
            Pro = Rdr.GetValue(3).ToString.Trim
            dis = Rdr.GetValue(4).ToString.Trim
            Od = Rdr.GetValue(5).ToString.Trim
            b = True
        End While
        Rdr.Close()
        cboProvince.Text = Pro
        CboODName.Text = Od
        cbodistric.Text = dis
    End Sub
    Private Sub cboProvince_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboProvince.SelectedIndexChanged
        cbodistric.Properties.Items.Clear()
        cbodistric.SelectedIndex = -1
        Dim CmdSearch As New MySqlCommand("SELECT      tblDistrict.DistrictENg FROM    tblProvince INNER JOIN    tblDistrict ON  tblProvince.pid =  tblDistrict.pid WHERE     ( tblProvince.ProvinceENg = '" & cboProvince.Text & "') ORDER BY  tblDistrict.did", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            cbodistric.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
            CboODName.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub txtNameEn_KeyDown(sender As Object, e As KeyEventArgs) Handles txtNameEn.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub
    Private Sub txtNameKh_KeyDown(sender As Object, e As KeyEventArgs) Handles txtNameKh.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub
    Private Sub txtCode_KeyDown(sender As Object, e As KeyEventArgs) Handles txtCode.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub
    Private Sub cboProvince_KeyDown(sender As Object, e As KeyEventArgs) Handles cboProvince.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub
    Private Sub cbodistric_KeyDown(sender As Object, e As KeyEventArgs) Handles cbodistric.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

End Class