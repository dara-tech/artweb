Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient

Public Class frmChildInA1
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim Tid As String
    Private Sub frmChildInA1_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        LoadData()
        Clear()
    End Sub
#Region "Function"
    Private Sub Clear()

        txtClinicID.Text = ""
        DaDob.Text = "01/01/1900"
            txtAge.Text = ""
        RdSex.SelectedIndex = -1
        DaUpdate.Text = "01/01/1900"
        RdGuardian.SelectedIndex = -1
        txtGroup.Text = ""
        txtHouse.Text = ""
        txtHouse.Text = ""
        CboProvince.SelectedIndex = -1
        txtContactAddress.Text = ""
        txtPhone.Text = ""
        RdChildStatus.SelectedIndex = -1
        CboFatherOcc.SelectedIndex = -1
        CboMotherOcc.SelectedIndex = -1
        RdEducation.SelectedIndex = -1
        txtfacility.Text = ""
        RdVaccin.SelectedIndex = -1

        RdGuardian.Enabled = False
        txtGroup.Enabled = False
        txtHouse.Enabled = False
        txtStreet.Enabled = False
        CboProvince.Enabled = False
        cbodistric.Enabled = False
        cboCommune.Enabled = False
        cbovillage.Enabled = False
        txtContactAddress.Enabled = False
        txtPhone.Enabled = False
        RdChildStatus.Enabled = False
        CboFatherOcc.Enabled = False
        CboMotherOcc.Enabled = False
        RdEducation.Enabled = False
        txtfacility.Enabled = False
        RdVaccin.Enabled = False
        tsbDelete.Enabled = False
        Tid = ""
    End Sub
    Private Sub LoadData()
        Dim Cmdadd As New MySqlCommand("select * from tblProvince ORDER BY Pid", Cnndb)
        Rdr = Cmdadd.ExecuteReader
        While Rdr.Read
            CboProvince.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        Dim CmdOcc As New MySqlCommand("Select * from tbloccupation order by Name asc", Cnndb)
        Rdr = CmdOcc.ExecuteReader
        While Rdr.Read
            CboFatherOcc.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboMotherOcc.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Date Update", GetType(Date))
        dt.Columns.Add("Age", GetType(Int32))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Child Status", GetType(String))
        dt.Columns.Add("Education", GetType(String))
        dt.Columns.Add("Vaccinations", GetType(String))
        dt.Columns.Add("CUID", GetType(String))
        dt.Columns.Add("Dob", GetType(Date))
        GridControl1.DataSource = dt
        GridView1.Columns("CUID").Visible = False
        GridView1.Columns("Dob").Visible = False
    End Sub
    Private Sub Checkpat()
        Dim CmdSearchAI As New MySqlCommand("Select * from tblcimain where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        While Rdr.Read
            txtAge.Text = CType(DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(1).ToString)), String)
            DaDob.Text = CDate(Rdr.GetValue(3).ToString).Date
            RdSex.SelectedIndex = Rdr.GetValue(4).ToString
        End While
        Rdr.Close()
    End Sub
    Private Sub Save()
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Do you want to save ?", "Save...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Try
                    Dim CmdSave As New MySqlCommand("insert into tblcumain values('" & txtClinicID.Text & "','" & Format(CDate(DaUpdate.EditValue), "yyyy/MM/dd") & "','" & RdGuardian.SelectedIndex & "','" & txtGroup.Text.Trim & "','" & txtHouse.Text.Trim & "','" & txtStreet.Text & "','" & cbovillage.Text.Replace("'", "''") & "'," &
                                        "'" & cboCommune.Text.Replace("'", "''") & "','" & cbodistric.Text.Replace("'", "''") & "','" & CboProvince.Text & "','" & txtContactAddress.Text.Trim & "','" & txtPhone.Text.Trim & "','" & RdChildStatus.SelectedIndex & "','" & CboFatherOcc.SelectedIndex & "','" & CboMotherOcc.SelectedIndex & "'," &
                                        "'" & RdEducation.SelectedIndex & "','" & txtfacility.Text.Trim & "','" & RdVaccin.SelectedIndex & "','" & txtClinicID.Text.Trim & Format(CDate(DaUpdate.EditValue), "ddMMyy") & "')", Cnndb)
                    CmdSave.ExecuteNonQuery()
                    Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblcumain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    Cmdlog.ExecuteNonQuery()
                    Clear()
                    MessageBox.Show("Success for save...", "Save...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Catch ex As Exception
                    MessageBox.Show("All the data have already exit!", "Dublicated...", MessageBoxButtons.OK, MessageBoxIcon.Error)
                    Clear()
                End Try
            End If
        Else
            If MessageBox.Show("Are you sure do you want to Edit ?", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim CmdEdit As New MySqlCommand("Update tblcumain set Daupdate= '" & Format(CDate(DaUpdate.EditValue), "yyyy/MM/dd") & "',AddGuardian='" & RdGuardian.SelectedIndex & "',Grou='" & txtGroup.Text.Trim & "',House='" & txtHouse.Text.Trim & "',Street='" & txtStreet.Text & "',Village='" & cbovillage.Text.Replace("'", "''") & "'," &
                                        "Commune='" & cboCommune.Text.Replace("'", "''") & "',District='" & cbodistric.Text.Replace("'", "''") & "',Province='" & CboProvince.Text & "',AddContact='" & txtContactAddress.Text.Trim & "',Phone='" & txtPhone.Text.Trim & "',ChildStatus='" & RdChildStatus.SelectedIndex & "',Foccupation='" & CboFatherOcc.SelectedIndex & "',Moccupation='" & CboMotherOcc.SelectedIndex & "'," &
                                        "Education='" & RdEducation.SelectedIndex & "',ChildSupport='" & txtfacility.Text.Trim & "',Vaccine='" & RdVaccin.SelectedIndex & "'  where CUID='" & Tid & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblcumain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
                MessageBox.Show("Success for Edit...", "Edit...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If
        End If
    End Sub
    Private Sub ViewData()
        Dim i As Int64
        Dim CmdSearch As New MySqlCommand("SELECT    preart.tblcumain.ClinicID, preart.tblcumain.Daupdate, preart.tblcimain.DaBirth, preart.tblcimain.Sex, preart.tblcumain.ChildStatus, preart.tblcumain.Education,  preart.tblcumain.Vaccine,preart.tblcumain.CUID FROM         preart.tblcimain RIGHT OUTER JOIN  preart.tblcumain ON preart.tblcimain.ClinicID = preart.tblcumain.ClinicID ORDER BY preart.tblcumain.Daupdate, preart.tblcumain.ClinicID", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Rdr.GetValue(0).ToString
            dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
            dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString))
            Select Case CDec(Rdr.GetValue(3).ToString)
                Case 0
                    dr(4) = "Female"
                Case 1
                    dr(4) = "Male"
            End Select
            Select Case CDec(Rdr.GetValue(4).ToString)
                Case 0
                    dr(5) = "Both Parents alive"
                Case 1
                    dr(5) = "Mother deceased"
                Case 2
                    dr(5) = "Father deceased"
                Case 3
                    dr(5) = "Both parents deceased"
            End Select
            Select Case CDec(Rdr.GetValue(5).ToString)
                Case 0
                    dr(6) = "None"
                Case 1
                    dr(6) = "Kindergarden"
                Case 2
                    dr(6) = "Primary"
                Case 3
                    dr(6) = "Secondary"
            End Select
            Select Case CDec(Rdr.GetValue(6).ToString)
                Case 0
                    dr(7) = "Routine vaccinations"
                Case 1
                    dr(7) = "Vaccination on going"
                Case 2
                    dr(7) = "Missing"
                Case 3
                    dr(7) = "None"
                Case 4
                    dr(7) = "Unknown"
            End Select
            dr(8) = Rdr.GetValue(7).ToString
            dr(9) = CDate(Rdr.GetValue(2).ToString)
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub
    Private Sub Search()
        Dim CmdSearch As New MySqlCommand("Select * from tblcumain where CUID='" & Tid & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        Dim p, d, c, v As String
        While Rdr.Read
            DaUpdate.Text = CDate(Rdr.GetValue(1).ToString).Date
            RdGuardian.SelectedIndex = Rdr.GetValue(2).ToString
            txtGroup.Text = Rdr.GetValue(3).ToString
            txtHouse.Text = Rdr.GetValue(4).ToString
            txtStreet.Text = Rdr.GetValue(5).ToString
            v = Rdr.GetValue(6).ToString
            c = Rdr.GetValue(7).ToString
            d = Rdr.GetValue(8).ToString
            p = Rdr.GetValue(9).ToString
            txtContactAddress.Text = Rdr.GetValue(10).ToString
            txtPhone.Text = Rdr.GetValue(11).ToString
            RdChildStatus.SelectedIndex = Rdr.GetValue(12).ToString
            CboFatherOcc.SelectedIndex = Rdr.GetValue(13).ToString
            CboMotherOcc.SelectedIndex = Rdr.GetValue(14).ToString
            RdEducation.SelectedIndex = Rdr.GetValue(15).ToString
            txtfacility.Text = Rdr.GetValue(16).ToString
            RdVaccin.SelectedIndex = Rdr.GetValue(17).ToString
        End While
        Rdr.Close()
        CboProvince.Text = p
        cbodistric.Text = d
        cboCommune.Text = c
        cbovillage.Text = v
    End Sub
    Private Sub Del()
        If MessageBox.Show("Are you sure do you want to delete ?", "Delete....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
            Dim Cmddel As New MySqlCommand("Delete from tblcumain where CUID='" & Tid & "'", Cnndb)
            Cmddel.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblcumain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Data is Deleted..", "Delete..", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub
#End Region
    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        If txtClinicID.Text = "" Then Exit Sub
        txtAge.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Age")
        Select Case GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex")
            Case "Female"
                RdSex.SelectedIndex = 0
            Case Else
                RdSex.SelectedIndex = 1
        End Select
        Tid = GridView1.GetRowCellValue(hitInfo.RowHandle(), "CUID")
        DaDob.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Dob")
        XtraTabControl1.SelectedTabPageIndex = 1
        tsbDelete.Enabled = True
        Search()
    End Sub
    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub XtraTabControl1_Click(sender As Object, e As EventArgs) Handles XtraTabControl1.Click
        If XtraTabControl1.SelectedTabPageIndex = 1 Then
            txtClinicID.Focus()
        End If
    End Sub
    Private Sub cboProvince_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboProvince.SelectedIndexChanged
        cbodistric.Properties.Items.Clear()
        cbodistric.SelectedIndex = -1
        cboCommune.SelectedIndex = -1
        cbovillage.SelectedIndex = -1
        '   txtStreet.Text = ""
        '   txtHouse.Text = ""
        Dim CmdSearch As New MySqlCommand("Select      tblDistrict.DistrictENg FROM    tblProvince INNER JOIN    tblDistrict On  tblProvince.pid =  tblDistrict.pid WHERE     ( tblProvince.ProvinceENg = '" & CboProvince.Text & "') ORDER BY  tblDistrict.did", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            cbodistric.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub cboCommune_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboCommune.SelectedIndexChanged
        cbovillage.Properties.Items.Clear()
        cbovillage.SelectedIndex = -1
        Dim Cmdsearch As New MySqlCommand("SELECT    tblVillage.VillageEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did INNER JOIN    tblVillage ON  tblCommune.cid =  tblVillage.cid WHERE     ( tblProvince.ProvinceENg = '" & CboProvince.Text & "') AND ( tblDistrict.DistrictENg = '" & cbodistric.Text.Replace("'", "''") & "') AND ( tblCommune.CommuneEN = '" & cboCommune.Text.Replace("'", "''") & "') ORDER BY  tblVillage.vid", Cnndb)
        Rdr = Cmdsearch.ExecuteReader
        While Rdr.Read
            cbovillage.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub cbodistric_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cbodistric.SelectedIndexChanged
        cboCommune.Properties.Items.Clear()
        cboCommune.SelectedIndex = -1
        Dim CmdSearch As New MySqlCommand("SELECT   tblCommune.CommuneEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did WHERE     ( tblProvince.ProvinceENg = '" & CboProvince.Text & "') AND ( tblDistrict.DistrictENg = '" & cbodistric.Text.Replace("'", "''") & "') ORDER BY  tblCommune.cid", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            cboCommune.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        If IsNumeric(txtClinicID.Text) Then
            txtClinicID.Text = "P" & Format(Val(txtClinicID.Text), "000000")
            If txtClinicID.Text = "P000000" Then
                MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                txtClinicID.Text = ""
                Exit Sub
            End If
            Checkpat()
        End If
    End Sub
    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
    End Sub
    Private Sub txtClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtClinicID.EditValueChanged

    End Sub
    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            Checkpat()
        End If
    End Sub
    Private Sub DaUpdate_EditValueChanged(sender As Object, e As EventArgs) Handles DaUpdate.EditValueChanged
        If CDate(DaDob.EditValue) <= CDate("01/01/1900") Then Exit Sub
        If CDate(DaUpdate.EditValue) > Now.Date Then DaUpdate.Text = "01/01/1900"
        If CDate(DaUpdate.EditValue) <= CDate("01/01/1999") Then
            'RdGuardian.Enabled = False
            'txtGroup.Enabled = False
            'txtHouse.Enabled = False
            'txtStreet.Enabled = False
            'CboProvince.Enabled = False
            'cbodistric.Enabled = False
            'cboCommune.Enabled = False
            'cbovillage.Enabled = False
            'txtContactAddress.Enabled = False
            'txtPhone.Enabled = False
            'RdChildStatus.Enabled = False
            'CboFatherOcc.Enabled = False
            'CboMotherOcc.Enabled = False
            'RdEducation.Enabled = False
            'txtfacility.Enabled = False
            'RdVaccin.Enabled = False
            '   Clear()
            Exit Sub
        Else
            RdGuardian.Enabled = True
            txtGroup.Enabled = True
            txtHouse.Enabled = True
            txtStreet.Enabled = True
            CboProvince.Enabled = True
            cbodistric.Enabled = True
            cboCommune.Enabled = True
            cbovillage.Enabled = True
            txtContactAddress.Enabled = True
            txtPhone.Enabled = True
            RdChildStatus.Enabled = True
            CboFatherOcc.Enabled = True
            CboMotherOcc.Enabled = True
            RdEducation.Enabled = True
            txtfacility.Enabled = True
            RdVaccin.Enabled = True
        End If
        txtAge.Text = DateDiff(DateInterval.Year, CDate(DaDob.Text), CDate(DaUpdate.Text))
        If CDec(txtAge.EditValue) < 0 Then
            MessageBox.Show("Invalid date of Update !", "Check Date Update", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DaUpdate.Text = "01/01/1900"
            Exit Sub
        End If
    End Sub
    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub
    Private Sub tscView_SelectedIndexChanged(sender As Object, e As EventArgs) Handles tscView.SelectedIndexChanged
        If tscView.SelectedIndex = 1 Then
            dt.Clear()
            ViewData()
        Else
            GridControl1.DataSource = ""
            dt.Clear()
        End If
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Del
    End Sub

    Protected Overrides Function ProcessCmdKey(ByRef msg As Message, keyData As Keys) As Boolean
        Select Case keyData
            Case Keys.F1
                Save()
            Case Keys.F2
                Clear()
            Case Keys.F3
                Del
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

    End Sub

    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Int64
            If IsNumeric(tspClinicID.Text) Then
                tspClinicID.Text = "P" & Format(Val(tspClinicID.Text), "000000")
                If tspClinicID.Text = "P000000" Then
                    MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                    tspClinicID.Text = ""
                    Exit Sub
                End If
            End If
            Dim CmdSearch As New MySqlCommand("SELECT    preart.tblcumain.ClinicID, preart.tblcumain.Daupdate, preart.tblcimain.DaBirth, preart.tblcimain.Sex, preart.tblcumain.ChildStatus, preart.tblcumain.Education,  preart.tblcumain.Vaccine,preart.tblcumain.CUID FROM         preart.tblcimain RIGHT OUTER JOIN  preart.tblcumain ON preart.tblcimain.ClinicID = preart.tblcumain.ClinicID where tblcumain.ClinicID='" & tspClinicID.Text & "' ORDER BY preart.tblcumain.Daupdate, preart.tblcumain.ClinicID", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Rdr.GetValue(0).ToString
                dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
                dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString))
                Select Case CDec(Rdr.GetValue(3).ToString)
                    Case 0
                        dr(4) = "Female"
                    Case 1
                        dr(4) = "Male"
                End Select
                Select Case CDec(Rdr.GetValue(4).ToString)
                    Case 0
                        dr(5) = "Both Parents alive"
                    Case 1
                        dr(5) = "Mother deceased"
                    Case 2
                        dr(5) = "Father deceased"
                    Case 3
                        dr(5) = "Both parents deceased"
                End Select
                Select Case CDec(Rdr.GetValue(5).ToString)
                    Case 0
                        dr(6) = "None"
                    Case 1
                        dr(6) = "Kindergarden"
                    Case 2
                        dr(6) = "Primary"
                    Case 3
                        dr(6) = "Secondary"
                End Select
                Select Case CDec(Rdr.GetValue(6).ToString)
                    Case 0
                        dr(7) = "Routine vaccinations"
                    Case 1
                        dr(7) = "Vaccination on going"
                    Case 2
                        dr(7) = "Missing"
                    Case 3
                        dr(7) = "None"
                    Case 4
                        dr(7) = "Unknown"
                End Select
                dr(8) = Rdr.GetValue(7).ToString
                dr(9) = CDate(Rdr.GetValue(2).ToString)
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub DaUpdate_KeyDown(sender As Object, e As KeyEventArgs) Handles DaUpdate.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            DaUpdate_EditValueChanged(DaUpdate, New EventArgs)
        End If
    End Sub
End Class