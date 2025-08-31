Imports MySql.Data.MySqlClient
Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Public Class frmAdultInA1
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim Tid As String
    Private Sub frmAdultInA1_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        LoadData()
        Clear()
    End Sub
    Private Sub LoadData()
        Dim Cmdadd As New MySqlCommand("select * from tblProvince ORDER BY Pid", Cnndb)
        Rdr = Cmdadd.ExecuteReader
        While Rdr.Read
            cboProvince.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        Dim CmdOcc As New MySqlCommand("Select * from tbloccupation order by Name asc", Cnndb)
        Rdr = CmdOcc.ExecuteReader
        While Rdr.Read
            cboOccupation.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        dt = New DataTable
        dt.Columns.Add("No", GetType(Double))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Date Update", GetType(Date))
        dt.Columns.Add("Age", GetType(Int32))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Marital Status", GetType(String))
        dt.Columns.Add("Occupation", GetType(String))
        dt.Columns.Add("NGO ?", GetType(Boolean))
        dt.Columns.Add("AUID", GetType(Double))
        dt.Columns.Add("Dob", GetType(Date))
        GridControl1.DataSource = dt
        GridView1.Columns("AUID").Visible = False
        GridView1.Columns("Dob").Visible = False
    End Sub
    Private Sub cboProvince_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboProvince.SelectedIndexChanged
        cbodistric.Properties.Items.Clear()
        cbodistric.SelectedIndex = -1
        cboCommune.SelectedIndex = -1
        cbovillage.SelectedIndex = -1
        '  txtstreet.Text = ""
        '  txthouse.Text = ""
        Dim CmdSearch As New MySqlCommand("Select      tblDistrict.DistrictENg FROM    tblProvince INNER JOIN    tblDistrict On  tblProvince.pid =  tblDistrict.pid WHERE     ( tblProvince.ProvinceENg = '" & cboProvince.Text & "') ORDER BY  tblDistrict.did", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            cbodistric.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub cboCommune_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboCommune.SelectedIndexChanged
        cbovillage.Properties.Items.Clear()
        cbovillage.SelectedIndex = -1
        Dim Cmdsearch As New MySqlCommand("SELECT    tblVillage.VillageEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did INNER JOIN    tblVillage ON  tblCommune.cid =  tblVillage.cid WHERE     ( tblProvince.ProvinceENg = '" & cboProvince.Text & "') AND ( tblDistrict.DistrictENg = '" & cbodistric.Text.Replace("'", "''") & "') AND ( tblCommune.CommuneEN = '" & cboCommune.Text.Replace("'", "''") & "') ORDER BY  tblVillage.vid", Cnndb)
        Rdr = Cmdsearch.ExecuteReader
        While Rdr.Read
            cbovillage.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub cbodistric_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cbodistric.SelectedIndexChanged
        cboCommune.Properties.Items.Clear()
        cboCommune.SelectedIndex = -1
        Dim CmdSearch As New MySqlCommand("SELECT   tblCommune.CommuneEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did WHERE     ( tblProvince.ProvinceENg = '" & cboProvince.Text & "') AND ( tblDistrict.DistrictENg = '" & cbodistric.Text.Replace("'", "''") & "') ORDER BY  tblCommune.cid", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            cboCommune.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub Clear()
        txtClinicID.Text = ""
        txtClinicID.Focus()
        DaUpdate.Text = "01/01/1900"
        DaDob.Text = "01/01/1900"
        txtAge.Text = ""
        RdSex.SelectedIndex = -1
        RdMarital.SelectedIndex = -1
        cboOccupation.SelectedIndex = -1
        txtGroup.Text = ""
        txthouse.Text = ""
        txtstreet.Text = ""
        cboProvince.SelectedIndex = -1
        txtPhone.Text = ""
        txtCont1.Text = ""
        txtContPhone1.Text = ""
        txtCont2.Text = ""
        txtContPhone2.Text = ""
        ChkNGO.Checked = False
        txtNameNGO.Text = ""
        '   txtNameNGO.Enabled = False
        RdMarital.Enabled = False
        cboOccupation.Enabled = False
        txtGroup.Enabled = False
        txthouse.Enabled = False
        txtstreet.Enabled = False
        cboProvince.Enabled = False
        txtPhone.Enabled = False
        txtCont1.Enabled = False
        txtContPhone1.Enabled = False
        txtCont2.Enabled = False
        txtContPhone2.Enabled = False
        ChkNGO.Enabled = False
        txtNameNGO.Enabled = False
        cbodistric.Enabled = False
        cboCommune.Enabled = False
        cbovillage.Enabled = False
        tsbDelete.Enabled = False
        RdHIVshow.SelectedIndex = -1

    End Sub
    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
    End Sub

    Private Sub ChkNGO_CheckedChanged(sender As Object, e As EventArgs) Handles ChkNGO.CheckedChanged
        If ChkNGO.Checked Then
            txtNameNGO.Enabled = True
        Else
            txtNameNGO.Enabled = False
            txtNameNGO.Text = ""
        End If
    End Sub

    Private Sub DaUpdate_EditValueChanged(sender As Object, e As EventArgs) Handles DaUpdate.EditValueChanged
        If CDate(DaDob.EditValue) <= CDate("01/01/1900") Then Exit Sub
        If CDate(DaUpdate.EditValue) > Now.Date Then DaUpdate.Text = "01/01/1900"
        If CDate(DaUpdate.EditValue) <= CDate("01/01/1999") Then
            '  Clear()
            Exit Sub
        Else
            txtGroup.Enabled = True
            txthouse.Enabled = True
            txtstreet.Enabled = True
            cboProvince.Enabled = True
            cbodistric.Enabled = True
            cboCommune.Enabled = True
            cbovillage.Enabled = True
            ChkNGO.Enabled = True
            RdMarital.Enabled = True
            cboOccupation.Enabled = True
            txtPhone.Enabled = True
            txtCont1.Enabled = True
            txtContPhone1.Enabled = True
            txtCont2.Enabled = True
            txtContPhone2.Enabled = True
            RdHIVshow.Enabled = True
        End If
        txtAge.Text = DateDiff(DateInterval.Year, CDate(DaDob.Text), CDate(DaUpdate.Text))
        If CDec(txtAge.EditValue) < 14 Or CDec(txtAge.EditValue) > 100 Then
            MessageBox.Show("Invalid date of Update !", "Check Date Update", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
            Exit Sub
        End If
    End Sub
    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        If Len(txtClinicID.Text) <= 6 And Val(txtClinicID.Text) <> 0 Then
            txtClinicID.Text = Format(Val(txtClinicID.Text), "000000")
            CheckPat()
        End If
    End Sub
    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub Search()
        Dim CmdSearch As New MySqlCommand("Select * from tblaumain where AUID='" & Tid & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        Dim p, d, c, v As String
        While Rdr.Read
            '  DaUpdate.Text = CDate(Rdr.GetValue(1).ToString).Date
            RdMarital.SelectedIndex = Rdr.GetValue(2).ToString
            RdHIVshow.SelectedIndex = Rdr.GetValue(4).ToString
            chkRelative.Checked = Rdr.GetValue(5).ToString
            ChkFamily.Checked = Rdr.GetValue(6).ToString
            chkcommunity.Checked = Rdr.GetValue(7).ToString
            txtGroup.Text = Rdr.GetValue(8).ToString
            txthouse.Text = Rdr.GetValue(9).ToString
            txtstreet.Text = Rdr.GetValue(10).ToString
            v = Rdr.GetValue(11).ToString
            c = Rdr.GetValue(12).ToString
            d = Rdr.GetValue(13).ToString
            p = Rdr.GetValue(14).ToString
            txtPhone.Text = Rdr.GetValue(15).ToString
            txtCont1.Text = Rdr.GetValue(16).ToString
            txtContPhone1.Text = Rdr.GetValue(17).ToString
            txtCont2.Text = Rdr.GetValue(18).ToString
            txtContPhone2.Text = Rdr.GetValue(19).ToString
            txtNameNGO.Text = Rdr.GetValue(21).ToString
        End While
        Rdr.Close()
        cboProvince.Text = p
        cbodistric.Text = d
        cboCommune.Text = c
        cbovillage.Text = v
    End Sub
#Region "function"
    Private Sub CheckPat()
        Dim CmdSearch As New MySqlCommand("Select * from tblavpatientstatus where ClinicID='" & Val(txtClinicID.Text) & "'", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
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
            '      D1 = False
            txtClinicID.Text = ""
            Exit Sub
        End While
        Rdr.Close()
        '   DaVisit.Focus()
        Dim CmdSearchAI As New MySqlCommand("Select * from tblaimain where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        While Rdr.Read
            txtAge.Text = CType(DateDiff(DateInterval.Year, CDate(Rdr.GetValue(5).ToString), CDate(Rdr.GetValue(1).ToString)), String)
            RdSex.SelectedIndex = Rdr.GetValue(6).ToString
            DaDob.EditValue = CDate(Rdr.GetValue(5).ToString)
            Rdr.Close()
            Exit Sub
        End While
        Rdr.Close()
        MessageBox.Show("មិនមានលេខកូដអ្នកជំងឺនេះក្នុងប្រពន្ធយើងខ្មុំទេ ឬទិន្នន័យរបស់អ្នកជំងឺនេះអត់ទាន់បានបញ្ចូល។", "Check In Adult initial visit first", MessageBoxButtons.OK, MessageBoxIcon.Error)
        txtClinicID.Text = ""
        txtClinicID.Focus()
    End Sub
    Private Sub Save()
        'Dim c As Integer = 0
        'If ChkNGO.Checked Then
        '    c = 1
        'End If
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Do you want to save ?", "Save...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                '     Try
                Dim CmdSave As New MySqlCommand("insert into tblaumain values('" & txtClinicID.EditValue & "','" & Format(CDate(DaUpdate.EditValue), "yyyy/MM/dd") & "','" & RdMarital.SelectedIndex & "','" & cboOccupation.Text & "','" & RdHIVshow.SelectedIndex & "','" & chkRelative.Checked & "','" & ChkFamily.Checked & "','" & chkcommunity.Checked & "','" & txtGroup.Text.Trim & "','" & txthouse.Text.Trim & "','" & txtstreet.Text & "','" & cbovillage.Text.Replace("'", "''") & "'," &
                                        "'" & cboCommune.Text.Replace("'", "''") & "','" & cbodistric.Text.Replace("'", "''") & "','" & cboProvince.Text & "','" & txtPhone.Text & "','" & txtCont1.Text & "','" & txtContPhone1.Text & "','" & txtCont2.Text & "','" & txtContPhone2.Text & "','" & ChkNGO.Checked & "','" & txtNameNGO.Text & "','" & txtClinicID.Text & Format(CDate(DaUpdate.EditValue), "ddMMyy") & "')", Cnndb)
                CmdSave.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAUmain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
                MessageBox.Show("Success for save...", "Save...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                'Catch ex As Exception
                '    MessageBox.Show("All the data have already exit or have something worng with database", "Error...", MessageBoxButtons.OK, MessageBoxIcon.Error)
                '    '      Clear()
                'End Try
            End If
        Else
            If MessageBox.Show("Are you sure do you want to Edit ?", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim CmdEdit As New MySqlCommand("Update tblaumain set Daupdate='" & Format(CDate(DaUpdate.EditValue), "yyyy/MM/dd") & "',Marital='" & RdMarital.SelectedIndex & "',Occupation='" & cboOccupation.Text & "',HIVshow='" & RdHIVshow.SelectedIndex & "',Relative='" & chkRelative.Checked & "',Family='" & ChkFamily.Checked & "',Community='" & chkcommunity.Checked & "',Grou='" & txtGroup.Text.Trim & "',House='" & txthouse.Text.Trim & "',Street='" & txtstreet.Text & "',Village='" & cbovillage.Text.Replace("'", "''") & "'," &
                                        "Commune='" & cboCommune.Text.Replace("'", "''") & "',District='" & cbodistric.Text.Replace("'", "''") & "', Province ='" & cboProvince.Text & "', Phone ='" & txtPhone.Text & "', AddCont1 ='" & txtCont1.Text & "',Phone1='" & txtContPhone1.Text & "',AddCont2='" & txtCont2.Text & "',Phone2='" & txtContPhone2.Text & "',NGO='" & ChkNGO.Checked & "',NameNGO='" & txtNameNGO.Text & "' where AUID='" & Tid & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAUmain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
                MessageBox.Show("Success for Edit...", "Edit...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If
        End If
    End Sub
    Private Sub ViewData()
        Dim i As Int64
        Dim CmdSearch As New MySqlCommand("SELECT  tblaumain.ClinicID, tblaumain.Daupdate, tblaimain.DaBirth, tblaimain.Sex, tblaumain.Marital , tblaumain.Occupation , tblaumain.NGO,tblaumain.AUID FROM   tblaimain RIGHT OUTER JOIN tblaumain ON tblaimain.ClinicID = tblaumain.ClinicID ORDER BY tblaumain.Daupdate, tblaumain.ClinicID", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            If CDec(Rdr.GetValue(0).ToString) <> 0 Then
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
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
                        dr(5) = "Single"
                    Case 1
                        dr(5) = "Married"
                    Case 2
                        dr(5) = "Divorced"
                    Case 3
                        dr(5) = "Window(er)"
                End Select
                dr(6) = Rdr.GetValue(5).ToString.Trim
                'Select Case Val(Rdr.GetValue(6).ToString)
                '    Case 0
                Try
                    dr(7) = Rdr.GetValue(6).ToString
                Catch ex As Exception
                End Try

                '    Case 1
                '        dr(7) = True
                'End Select
                dr(8) = Rdr.GetValue(7).ToString
                dr(9) = CDate(Rdr.GetValue(2).ToString)
                dt.Rows.Add(dr)
            End If
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub

    Private Sub Del()
        If MessageBox.Show("Are you sure do you want to delete ?", "Delete....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
            Dim Cmddel As New MySqlCommand("Delete from tblaumain where AUID='" & Tid & "'", Cnndb)
            Cmddel.ExecuteNonQuery()
            MessageBox.Show("Data is Deleted..", "Delete..", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAUmain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            Clear()
        End If
    End Sub
#End Region
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
        Tid = GridView1.GetRowCellValue(hitInfo.RowHandle(), "AUID")
        DaDob.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Dob")
        DaUpdate.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date Update")
        Try
            ChkNGO.Checked = GridView1.GetRowCellValue(hitInfo.RowHandle(), "NGO ?")
        Catch ex As Exception
        End Try
        cboOccupation.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Occupation")
        XtraTabControl1.SelectedTabPageIndex = 1
        tsbDelete.Enabled = True
        Search()
    End Sub
    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Del()
    End Sub
    Protected Overrides Function ProcessCmdKey(ByRef msg As Message, keyData As Keys) As Boolean
        Select Case keyData
            Case Keys.F1
                Save()
            Case Keys.F2
                Clear()
            Case Keys.F3
                Del()
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function


    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Int64
            Dim CmdSearch As New MySqlCommand("SELECT  tblaumain.ClinicID, tblaumain.Daupdate, tblaimain.DaBirth, tblaimain.Sex, tblaumain.Marital , tblaumain.Occupation , tblaumain.NGO,tblaumain.AUID FROM   tblaimain RIGHT OUTER JOIN tblaumain ON tblaimain.ClinicID = tblaumain.ClinicID where tblaumain.ClinicID='" & tspClinicID.Text & "' ORDER BY tblaumain.Daupdate, tblaumain.ClinicID", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                If CDec(Rdr.GetValue(0).ToString) <> 0 Then
                    i = i + 1
                    Dim dr As DataRow = dt.NewRow()
                    dr(0) = i
                    dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                    dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
                    dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString))
                    Select Case Val(Rdr.GetValue(3).ToString)
                        Case 0
                            dr(4) = "Female"
                        Case 1
                            dr(4) = "Male"
                    End Select
                    Select Case CDec(Rdr.GetValue(4).ToString)
                        Case 0
                            dr(5) = "Single"
                        Case 1
                            dr(5) = "Married"
                        Case 2
                            dr(5) = "Divorced"
                        Case 3
                            dr(5) = "Window(er)"
                    End Select
                    dr(6) = Rdr.GetValue(5).ToString.Trim
                    'Select Case Val(Rdr.GetValue(6).ToString)
                    '    Case 0
                    Try
                        dr(7) = Rdr.GetValue(6).ToString
                        '    Case 1
                        '        dr(7) = True
                        'End Select
                    Catch ex As Exception
                    End Try
                    dr(8) = Rdr.GetValue(7).ToString
                    dr(9) = CDate(Rdr.GetValue(2).ToString)
                    dt.Rows.Add(dr)
                End If
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub tscView_Click(sender As Object, e As EventArgs) Handles tscView.Click

    End Sub

    Private Sub DaUpdate_KeyDown(sender As Object, e As KeyEventArgs) Handles DaUpdate.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            DaUpdate_EditValueChanged(DaUpdate, New EventArgs)
        End If
    End Sub

    Private Sub RdHIVshow_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdHIVshow.SelectedIndexChanged
        chkRelative.Enabled = False
        chkRelative.Checked = False
        ChkFamily.Enabled = False
        ChkFamily.Checked = False
        chkcommunity.Enabled = False
        chkcommunity.Checked = False
        If RdHIVshow.SelectedIndex = 0 Then
            chkRelative.Enabled = True
            ChkFamily.Enabled = True
            chkcommunity.Enabled = True
        End If
    End Sub

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub

End Class