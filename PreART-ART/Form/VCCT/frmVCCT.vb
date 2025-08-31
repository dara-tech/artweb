Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Imports DevExpress.XtraEditors
Imports DevExpress.XtraGrid
Public Class frmVCCT
    Dim Rdr As MySqlDataReader
    Dim dt, dt1 As DataTable
    Dim Vcctid As Integer
    Dim VCCTcode, ARTCodePartner As String
    Dim vc As Boolean = False
    Dim vSite As String = ""
    'Dim vCode As String = ""


    Private Sub frmVCCT_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        LoadData()
        Clear()
    End Sub

    Private Sub LoadData()

        'rdMaritalStatus.Properties.Items.Add(New DevExpress.XtraEditors.Controls.RadioGroupItem("45", "ffghhk"))
        Dim CmdVsite As New MySqlCommand("SELECT * FROM tblcenter", Cnndb)
        Rdr = CmdVsite.ExecuteReader
        While Rdr.Read
            vSite = Rdr.GetValue(3).ToString.Trim + " -- " + Rdr.GetValue(4).ToString.Trim
        End While
        Rdr.Close()
        txtVCCTcode.Text = vSite
        'cboNamePlace.Properties.Items.Clear()
        'Dim CmdSearchHc As New MySqlCommand("Select * from tblhealth where ODname ='" & frmMain.odname & "' order by HealthName", Cnndb)
        'Rdr = CmdSearchHc.ExecuteReader
        'While Rdr.Read
        '    cboNamePlace.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
        'End While
        'Rdr.Close()
        'cboNamePlace.Properties.Items.Add("Other")

        Dim Cmdadd As New MySqlCommand("select * from tblProvince ORDER BY Pid", Cnndb)
        Rdr = Cmdadd.ExecuteReader
        While Rdr.Read
            cboProvince.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()

        Dim Cmdartsite As New MySqlCommand("SELECT * FROM preart.tblartsite order by Sid", Cnndb)
        Rdr = Cmdartsite.ExecuteReader
        While Rdr.Read
            cboARTCodePartner.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim + " -- " + Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()

        Dim CmdCoun As New MySqlCommand("SELECT Cid, Name FROM tblcounselor where status= 1 order by Cid", Cnndb)
        Rdr = CmdCoun.ExecuteReader
        dt1 = New DataTable
        dt1.Columns.Add("Cid", GetType(Integer))
        dt1.Columns.Add("Name", GetType(String))
        While Rdr.Read
            Dim dr1 As DataRow = dt1.NewRow()
            dr1(0) = CInt(Rdr.GetValue(0).ToString)
            dr1(1) = Rdr.GetValue(1).ToString
            dt1.Rows.Add(dr1)
        End While
        Rdr.Close()
        Luecounsellor.Properties.DataSource = dt1
        Luecounsellor.Properties.DisplayMember = "Name"
        Luecounsellor.Properties.ValueMember = "Cid"
        'Luecounsellor.Properties.PopulateColumns()
        Luecounsellor.Properties.Columns("Cid").Visible = False

        dt = New DataTable
        dt.Columns.Add("No", GetType(Double))
        dt.Columns.Add("VCCT-ID", GetType(String))
        'dt.Columns.Add("VCCT-SiteCode", GetType(String))
        dt.Columns.Add("Date-Reg", GetType(Date))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Age", GetType(Int32))
        dt.Columns.Add("Marital Status", GetType(String))
        dt.Columns.Add("Result-Test", GetType(String))
        dt.Columns.Add("Refer To", GetType(String))
        dt.Columns.Add("Result-ReTest", GetType(String))
        dt.Columns.Add("Type of Patient", GetType(String))
        dt.Columns.Add("Refer From", GetType(String))
        dt.Columns.Add("RTRI Result", GetType(String))
        dt.Columns.Add("Do Viralload", GetType(String))
        dt.Columns.Add("Result Viralload", GetType(String))
        dt.Columns.Add("RITA Status", GetType(String))


        GridControl1.DataSource = dt
        'GridView1.Columns("VCCT-SiteCode").Visible = False
        'GridView1.Columns("Dob").Visible = False
        Dim gridFormatRule As New GridFormatRule()
        Dim formatConditionRuleExpression As New FormatConditionRuleExpression()
        gridFormatRule.Column = GridView1.Columns(6)
        gridFormatRule.ApplyToRow = True
        formatConditionRuleExpression.PredefinedName = "Red Text"
        formatConditionRuleExpression.Expression = "[Result-Test] == 'Positive'"
        gridFormatRule.Rule = formatConditionRuleExpression
        GridView1.FormatRules.Add(gridFormatRule)
    End Sub

    Private Sub Clear()
        tsbDelete.Enabled = False
        txtVcctID.Text = ""
        txtVcctID.Enabled = True
        DaReg.EditValue = Now.Date
        rdSex.SelectedIndex = -1
        txtAge.Text = ""
        DaDob.EditValue = "01/01/1900"
        'CboVCCTcode.SelectedIndex = -1
        'CboVCCTcode.Enabled = True
        txtHTScode.Text = ""
        txtUuic.Text = ""
        rdMaritalStatus.SelectedIndex = -1
        rdEducation.SelectedIndex = -1
        cboOccupation.SelectedIndex = -1
        txtOccOther.Enabled = False
        txtCobOther.Text = ""
        'cboServiceTest.SelectedIndex = -1
        'cboNamePlace.SelectedIndex = -1
        'cboVcctCome.SelectedIndex = -1
        'DaTest1.Text = "01/01/1900"
        txtPmrs.Text = ""
        txtGroup.Text = ""
        txtHouse.Text = ""
        txtStreet.Text = ""
        cboProvince.SelectedIndex = -1
        cbodistric.SelectedIndex = -1
        cboCommune.SelectedIndex = -1
        cbovillage.SelectedIndex = -1
        rdReferFrom.SelectedIndex = -1
        rdCob.SelectedIndex = -1
        chRS1.Checked = False
        chRS2.Checked = False
        chRS3.Checked = False
        chRS4.Checked = False
        chRS5.Checked = False
        chRS6.Checked = False
        chRS7.Checked = False
        chRS8.Checked = False
        chRS9.Checked = False
        chRS10.Checked = False
        chRS11.Checked = False
        chRS12.Checked = False
        chRS13.Checked = False
        chRS14.Checked = False
        rdC1.SelectedIndex = -1
        rdC2.SelectedIndex = -1
        rdC3.SelectedIndex = -1
        rdC4.SelectedIndex = -1
        rdC5.SelectedIndex = -1
        rdC6.SelectedIndex = -1
        rdC7.SelectedIndex = -1
        rdC8.SelectedIndex = -1
        rdC9.SelectedIndex = -1
        rdC10.SelectedIndex = -1
        rdC11.SelectedIndex = -1
        rdC12.SelectedIndex = -1
        rdC13.SelectedIndex = -1
        rdC14.SelectedIndex = -1
        rdC15.SelectedIndex = -1
        rdC16.SelectedIndex = -1
        rdC17.SelectedIndex = -1
        rdC18.SelectedIndex = -1
        rdTPatient.SelectedIndex = -1
        rdHAgreeTest.EditValue = 0
        rdHPartnerResult1.EditValue = 0
        rdHPartnerResult2.EditValue = 0
        rdAgreeTestHIV.EditValue = 0
        rdAgreeTestVL.EditValue = 0
        rdCounselling.EditValue = 0
        DaCounselling.EditValue = Now.Date
        rdTransferTo.EditValue = 0
        rdTransferTo.Properties.Items(0).Enabled = True
        rdTransferTo.Properties.Items(1).Enabled = True
        rdTransferTo.Properties.Items(2).Enabled = True
        rdTransferTo.Properties.Items(3).Enabled = True
        rdTransferTo.Properties.Items(4).Enabled = True
        txtTransferOther.Text = ""
        Luecounsellor.EditValue = 0
        GroupBox5.Enabled = True
        GroupBox3.Enabled = True
        GroupBox7.Enabled = True
        GroupBox6.Enabled = True
        GroupBox8.Enabled = True
        GroupBox9.Enabled = True
        GroupBox2.Enabled = True
        GroupBox1.Enabled = True
    End Sub

    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Clear()
    End Sub

    Private Sub RdSex_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdSex.SelectedIndexChanged
        If rdSex.SelectedIndex = 0 Then
            rdTPatient.Properties.Items(0).Enabled = False
            rdTPatient.Properties.Items(7).Enabled = False
            rdTPatient.Properties.Items(1).Enabled = True
            rdTPatient.Properties.Items(2).Enabled = True
            rdTPatient.Properties.Items(6).Enabled = True
        ElseIf rdSex.SelectedIndex = 1 Then
            rdTPatient.Properties.Items(0).Enabled = True
            rdTPatient.Properties.Items(7).Enabled = True
            rdTPatient.Properties.Items(1).Enabled = False
            rdTPatient.Properties.Items(2).Enabled = False
            rdTPatient.Properties.Items(6).Enabled = False
        Else
            rdTPatient.Properties.Items(0).Enabled = True
            rdTPatient.Properties.Items(7).Enabled = True
            rdTPatient.Properties.Items(1).Enabled = True
            rdTPatient.Properties.Items(2).Enabled = True
            rdTPatient.Properties.Items(6).Enabled = True
        End If
    End Sub

    'Private Sub BtnPlace_Click(sender As Object, e As EventArgs)
    '    cboNamePlace.Properties.Items.Clear()
    '    Dim CmdSearchHc As New MySqlCommand("Select * from tblhealth  order by HealthName", Cnndb)
    '    Rdr = CmdSearchHc.ExecuteReader
    '    While Rdr.Read
    '        cboNamePlace.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
    '    End While
    '    Rdr.Close()
    '    cboNamePlace.Properties.Items.Add("Other")
    'End Sub
    'Private Sub chrs12_CheckedChanged(sender As Object, e As EventArgs) Handles chRS12.CheckedChanged
    '    LabelControl23.Visible = False
    '    txtClinicIDPartner.Visible = False
    '    LabelControl22.Visible = False
    '    cboARTCodePartner.Visible = False
    '    If chRS12.Checked Then
    '        LabelControl23.Visible = True
    '        txtClinicIDPartner.Visible = True
    '        LabelControl22.Visible = True
    '        cboARTCodePartner.Visible = True
    '    End If
    '    If cboARTCodePartner.Visible = False Then
    '        txtClinicIDPartner.Text = ""
    '        cboARTCodePartner.SelectedIndex = -1
    '    End If
    'End Sub

    Private Sub chRS4_CheckedChanged(sender As Object, e As EventArgs) Handles chRS4.CheckedChanged
        LabelControl23.Visible = False
        txtClinicIDPartner.Visible = False
        LabelControl22.Visible = False
        cboARTCodePartner.Visible = False
        If chRS4.Checked Then
            LabelControl23.Visible = True
            txtClinicIDPartner.Visible = True
            LabelControl22.Visible = True
            cboARTCodePartner.Visible = True
        End If
        If cboARTCodePartner.Visible = False Then
            txtClinicIDPartner.Text = ""
            cboARTCodePartner.SelectedIndex = -1
        End If
    End Sub

    Private Sub cboProvince_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboProvince.SelectedIndexChanged
        cbodistric.Properties.Items.Clear()
        cbodistric.SelectedIndex = -1
        cboCommune.SelectedIndex = -1
        cbovillage.SelectedIndex = -1
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

    Private Sub RdHtest_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdHAgreeTest.SelectedIndexChanged
        If Val(rdHAgreeTest.EditValue) = 2 Then
            rdHTestResult.Enabled = True
        Else
            rdHTestResult.Enabled = False
            rdHTestResult.EditValue = 0
        End If
    End Sub

    Private Sub Rdagreetesthiv_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdAgreeTestHIV.SelectedIndexChanged
        If Val(rdAgreeTestHIV.EditValue) = 1 Then
            rdCombo.Enabled = True
        Else
            rdCombo.Enabled = False
            rdCombo.EditValue = 0
            chComboAb.Enabled = False
            chComboAb.Checked = False
            chComboAg.Enabled = False
            chComboAg.Checked = False
            rdHIVResult.Enabled = False
            rdHIVResult.EditValue = 0
            Lbtestremark.Visible = False
            rdAgreeRTRITest.Enabled = False
            rdAgreeRTRITest.EditValue = 0
        End If
    End Sub

    Private Sub rdcambo_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdCombo.SelectedIndexChanged
        If Val(rdCombo.EditValue) = 2 Then
            chComboAb.Enabled = True
            chComboAg.Enabled = True
            rdHIVResult.Enabled = True
            rdHIVResult.EditValue = 0
            rdTransferTo.Properties.Items(0).Enabled = True
        ElseIf Val(rdCombo.EditValue) = 1 Then
            chComboAb.Enabled = False
            chComboAb.Checked = False
            chComboAg.Enabled = False
            chComboAg.Checked = False
            rdHIVResult.SelectedIndex = 0
            rdHIVResult.Enabled = False
            rdTransferTo.Properties.Items(0).Enabled = False
        End If
    End Sub

    Private Sub RdResultHIV_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdHIVResult.SelectedIndexChanged
        If Val(rdHIVResult.EditValue) = 1 Then
            rdAgreeRTRITest.Enabled = False
            Lbtestremark.Visible = False
            rdAgreeRTRITest.EditValue = 0
            rdTransferTo.EditValue = 0
            rdTransferTo.Properties.Items(0).Enabled = False
            rdTransferTo.Properties.Items(1).Enabled = True
            rdTransferTo.Properties.Items(2).Enabled = True
            rdTransferTo.Properties.Items(3).Enabled = True
            rdTransferTo.Properties.Items(4).Enabled = True
        ElseIf Val(rdHIVResult.EditValue) = 2 Then
            If Val(txtAge.Text) > 14 Then
                rdAgreeRTRITest.Enabled = True
            Else
                rdAgreeRTRITest.Enabled = False
            End If
            Lbtestremark.Visible = False
            rdTransferTo.EditValue = 0
            rdTransferTo.Properties.Items(0).Enabled = True
            rdTransferTo.Properties.Items(1).Enabled = False
            rdTransferTo.Properties.Items(2).Enabled = False
            rdTransferTo.Properties.Items(3).Enabled = False
            rdTransferTo.Properties.Items(4).Enabled = False
        ElseIf Val(rdHIVResult.EditValue) = 3 Then
            Lbtestremark.Visible = True
            rdAgreeRTRITest.Enabled = False
            rdAgreeRTRITest.EditValue = 0
            rdTransferTo.EditValue = 0
            rdTransferTo.Properties.Items(0).Enabled = False
            rdTransferTo.Properties.Items(1).Enabled = True
            rdTransferTo.Properties.Items(2).Enabled = True
            rdTransferTo.Properties.Items(3).Enabled = True
            rdTransferTo.Properties.Items(4).Enabled = True
        End If
    End Sub

    Private Sub Rgagreertritest_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdAgreeRTRITest.SelectedIndexChanged
        If Val(rdAgreeRTRITest.EditValue) = 1 Then
            chLControl.Enabled = True
            chLPositive.Enabled = True
            chLLongTerm.Enabled = True
            rdResultRTRI.Enabled = True
        Else
            chLControl.Enabled = False
            chLControl.Checked = False
            chLPositive.Enabled = False
            chLPositive.Checked = False
            chLLongTerm.Enabled = False
            chLLongTerm.Checked = False
            rdResultRTRI.Enabled = False
            rdResultRTRI.EditValue = 0
        End If
    End Sub

    Private Sub RdResultRtri_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdResultRTRI.SelectedIndexChanged
        If Val(rdResultRTRI.EditValue) = 4 Then
            Chfirstinvalid.Enabled = True
        ElseIf Val(rdResultRTRI.EditValue) = 2 Then
            rdAgreeTestVL.Enabled = True
        Else
            Chfirstinvalid.Enabled = False
            Chfirstinvalid.Checked = False
            rdAgreeTestVL.Enabled = False
            rdAgreeTestVL.EditValue = 0
        End If
    End Sub

    Private Sub RdCounselling_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdCounselling.SelectedIndexChanged
        If Val(rdCounselling.EditValue) = 1 Then
            DaCounselling.Enabled = True
        Else
            DaCounselling.Enabled = False
            DaCounselling.EditValue = "01/01/1900"
        End If
    End Sub

    Private Sub rdTransferTo_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdTransferTo.SelectedIndexChanged
        If Val(rdTransferTo.EditValue) = 99 Then
            txtTransferOther.Enabled = True
        Else
            txtTransferOther.Enabled = False
            txtTransferOther.Text = ""
        End If
    End Sub


    Private Sub txtVcctID_Leave(sender As Object, e As EventArgs) Handles txtVcctID.Leave
        If Len(txtVcctID.Text) <= 6 And Val(txtVcctID.Text) <> 0 Then
            txtVcctID.Text = Format(Val(txtVcctID.Text), "000000")
        End If
    End Sub

    Private Sub txtAge_Leave(sender As Object, e As EventArgs) Handles txtAge.Leave
        If txtAge.Text <> "" Then
            If CDate(DaReg.Text) < CDate("01/01/1960") Then
                DaReg.EditValue = Now.Date
            End If
            DaDob.EditValue = DateAdd(DateInterval.Year, -Val(txtAge.EditValue), CDate(DaReg.EditValue))
            If Val(txtAge.EditValue) < 2 Or Val(txtAge.EditValue) > 100 Then
                MessageBox.Show("Invalid age of client.", "Check Age", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
                DaDob.EditValue = "01/01/1900"
                DaReg.EditValue = Now.Date
                txtAge.Text = ""
                Exit Sub
            End If
        End If
    End Sub

    Private Sub DaDob_EditValueChanged(sender As Object, e As EventArgs) Handles DaDob.EditValueChanged
        If CDate(DaDob.EditValue) <= CDate("01/01/1930") Then Exit Sub
        If CDate(DaDob.EditValue) > Now.Date Then DaDob.EditValue = "01/01/1900"
        txtAge.EditValue = DateDiff(DateInterval.Year, CDate(DaDob.EditValue), CDate(DaReg.EditValue))
        If Val(txtAge.EditValue) < 2 Or Val(txtAge.EditValue) > 100 Then
            MessageBox.Show("Invalid Date of Birth", "Check Date of Birth", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DaDob.EditValue = "01/01/1900"
            Exit Sub
        End If
    End Sub

    Private Sub txtVcctID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtVcctID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicIDPartner.Leave
        If Len(txtClinicIDPartner.Text) <= 6 And Val(txtClinicIDPartner.Text) <> 0 Then
            txtClinicIDPartner.Text = Format(Val(txtClinicIDPartner.Text), "000000")
        End If
    End Sub

    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicIDPartner.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click

        FormValidation()
        If vc = True Then
            vc = False
            Exit Sub
        Else
            Save()
        End If



    End Sub

    Private Sub Save()
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Are you sure do you want to save !", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Information) = DialogResult.Yes Then
                'Dim occ As Integer
                'occ = If(cboOccupation.Text = "ផ្សេងៗ", 99, cboOccupation.SelectedIndex + 1)
                'MessageBox.Show(cboARTCodePartner.Text.Substring(0, 5)) : Exit Sub

                Dim CmdVcct As New MySqlCommand("Insert into tblvcct values('" & txtVcctID.Text.Trim & "','" &
                                                Format(CDate(DaReg.EditValue), "yyyy-MM-dd") & "','" &
                                                txtPmrs.Text.Trim & "','" &
                                                txtHTScode.Text.Trim & "','" &
                                                txtUuic.Text.Trim & "','" &
                                                rdSex.EditValue.ToString & "','" &
                                                Format(CDate(DaDob.EditValue), "yyyy-MM-dd") & "','" &
                                                rdMaritalStatus.EditValue.ToString & "','" &
                                                cboOccupation.Text & "','" &
                                                txtCobOther.Text.Trim & "','" &
                                                rdEducation.EditValue.ToString & "','" &
                                                cboProvince.Text & "','" &
                                                cbodistric.Text.Replace("'", "''") & "','" &
                                                cboCommune.Text.Replace("'", "''") & "','" &
                                                cbovillage.Text.Replace("'", "''") & "','" &
                                                txtGroup.Text.Trim & "','" &
                                                txtHouse.Text.Trim & "','" &
                                                txtStreet.Text.Trim & "','" &
                                                rdCob.EditValue.ToString & "','" &
                                                txtCobOther.Text.Trim & "','" &
                                                rdReferFrom.EditValue.ToString & "','" &
                                                rdTPatient.EditValue.ToString & "','" &
                                                rdHAgreeTest.EditValue.ToString & "','" &
                                                rdHTestResult.EditValue.ToString & "','" &
                                                rdHPartnerResult1.EditValue.ToString & "','" &
                                                rdHPartnerResult2.EditValue.ToString & "','" &
                                                rdAgreeTestHIV.EditValue.ToString & "','" &
                                                rdCombo.EditValue.ToString & "','" &
                                                rdHIVResult.EditValue.ToString & "','" &
                                                rdAgreeRTRITest.EditValue.ToString & "','" &
                                                rdResultRTRI.EditValue.ToString & "','" &
                                                If(Chfirstinvalid.Checked, 1, 2) & "','" &
                                                rdAgreeTestVL.EditValue.ToString & "','" &
                                                rdVLResult.EditValue.ToString & "','" &
                                                rdRITAResult.EditValue.ToString & "','" &
                                                rdCounselling.EditValue.ToString & "','" &
                                                Format(CDate(DaCounselling.EditValue), "yyyy-MM-dd") & "','" &
                                                rdTransferTo.EditValue.ToString & "','" &
                                                txtTransferOther.Text.Trim & "','" &
                                                Luecounsellor.EditValue.ToString & "')", Cnndb)

                CmdVcct.ExecuteNonQuery()

                Dim Cmdreason As New MySqlCommand("Insert into tblreasontoservice values('" & txtVcctID.Text.Trim & "','" &
                                                  If(chRS1.Checked, 1, 2) & "','" &
                                                  If(chRS2.Checked, 1, 2) & "','" &
                                                  If(chRS3.Checked, 1, 2) & "','" &
                                                  If(chRS4.Checked, 1, 2) & "','" &
                                                  If(chRS5.Checked, 1, 2) & "','" &
                                                  If(chRS6.Checked, 1, 2) & "','" &
                                                  If(chRS7.Checked, 1, 2) & "','" &
                                                  If(chRS8.Checked, 1, 2) & "','" &
                                                  If(chRS9.Checked, 1, 2) & "','" &
                                                  If(chRS10.Checked, 1, 2) & "','" &
                                                  If(chRS11.Checked, 1, 2) & "','" &
                                                  If(chRS12.Checked, 1, 2) & "','" &
                                                  txtClinicIDPartner.Text.Trim & "','" &
                                                  If(cboARTCodePartner.Text = "", "", cboARTCodePartner.Text.Substring(0, 5)) & "','" &
                                                  If(chRS13.Checked, 1, 2) & "','" &
                                                  If(chRS14.Checked, 1, 2) & "')", Cnndb)

                Cmdreason.ExecuteNonQuery()

                Dim Cmdeval As New MySqlCommand("Insert into tblveval values('" & txtVcctID.Text.Trim & "','" &
                                                rdC1.EditValue.ToString & "','" &
                                                rdC2.EditValue.ToString & "','" &
                                                rdC3.EditValue.ToString & "','" &
                                                rdC4.EditValue.ToString & "','" &
                                                rdC5.EditValue.ToString & "','" &
                                                rdC6.EditValue.ToString & "','" &
                                                rdC7.EditValue.ToString & "','" &
                                                rdC8.EditValue.ToString & "','" &
                                                rdC9.EditValue.ToString & "','" &
                                                rdC10.EditValue.ToString & "','" &
                                                rdC11.EditValue.ToString & "','" &
                                                rdC12.EditValue.ToString & "','" &
                                                rdC13.EditValue.ToString & "','" &
                                                rdC14.EditValue.ToString & "','" &
                                                rdC15.EditValue.ToString & "','" &
                                                rdC16.EditValue.ToString & "','" &
                                                rdC17.EditValue.ToString & "','" &
                                                rdC18.EditValue.ToString & "')", Cnndb)
                Cmdeval.ExecuteNonQuery()

                Dim Cmdline As New MySqlCommand("Insert into tblline values('" & txtVcctID.Text & "','" &
                                                If(chLControl.Checked, 1, 2) & "','" &
                                                If(chLPositive.Checked, 1, 2) & "','" &
                                                If(chLLongTerm.Checked, 1, 2) & "','" &
                                                If(chComboAg.Checked, 1, 2) & "','" &
                                                If(chComboAb.Checked, 1, 2) & "')", Cnndb)
                Cmdline.ExecuteNonQuery()

                MessageBox.Show("Data Saved Successfully!")
                Clear()
            End If
        Else
            If MessageBox.Show("Are you sure do you want to update !", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Information) = DialogResult.Yes Then
                'Dim occ As Integer
                'occ = If(cboOccupation.Text = "ផ្សេងៗ", 99, cboOccupation.SelectedIndex + 1)

                'MessageBox.Show(rdHAgreeTest.EditValue.ToString) : Exit Sub
                Dim CmdVcctUp As New MySqlCommand("Update tblvcct Set DaReg='" & Format(CDate(DaReg.EditValue), "yyyy-MM-dd") &
                                                "',PMRS='" & txtPmrs.Text.Trim &
                                                "',HTSCode='" & txtHTScode.Text.Trim &
                                                "',UUICcode='" & txtUuic.Text.ToString &
                                                "',Sex='" & rdSex.EditValue.ToString &
                                                "',DaDob='" & Format(CDate(DaDob.EditValue), "yyyy-MM-dd") &
                                                "',MaritalStatus='" & rdMaritalStatus.EditValue.ToString &
                                                "',Occupation='" & cboOccupation.Text &
                                                "',Ocpother='" & txtCobOther.Text.Trim &
                                                "',Education='" & rdEducation.EditValue.ToString &
                                                "',Province='" & cboProvince.Text &
                                                "',District='" & cbodistric.Text.Replace("'", "''") &
                                                "',Commune='" & cboCommune.Text.Replace("'", "''") &
                                                "',Village='" & cbovillage.Text.Replace("'", "''") &
                                                "',Grou='" & txtGroup.Text.Trim &
                                                "',House='" & txtHouse.Text.Trim &
                                                "',Street='" & txtStreet.Text.Trim &
                                                "',Cob='" & rdCob.EditValue.ToString &
                                                "',CobOther='" & txtCobOther.Text.Trim &
                                                "',ReferFrom='" & rdReferFrom.EditValue.ToString &
                                                "',TPatient='" & rdTPatient.EditValue.ToString &
                                                 "',HTest='" & rdHAgreeTest.EditValue.ToString &
                                                 "',HTestResult='" & rdHTestResult.EditValue.ToString &
                                                 "',HPartnerresult1='" & rdHPartnerResult1.EditValue.ToString &
                                                 "',HPartnerresult2='" & rdHPartnerResult2.EditValue.ToString &
                                                 "',AgreeTestHIV='" & rdAgreeTestHIV.EditValue.ToString &
                                                 "',ComboResult='" & rdCombo.EditValue.ToString &
                                                 "',HIVResult='" & rdHIVResult.EditValue.ToString &
                                                 "',AgreeTestRTRI='" & rdAgreeRTRITest.EditValue.ToString &
                                                 "',RTRIResult='" & rdResultRTRI.EditValue.ToString &
                                                 "',Firstinvalid='" & If(Chfirstinvalid.Checked, 1, 2) &
                                                 "',AgreeTestVL='" & rdAgreeTestVL.EditValue.ToString &
                                                 "',VLResult='" & rdVLResult.EditValue.ToString &
                                                 "',RITAResult='" & rdRITAResult.EditValue.ToString &
                                                 "',Counselor='" & rdCounselling.EditValue.ToString &
                                                 "',DaCounselor='" & Format(CDate(DaCounselling.EditValue), "yyyy-MM-dd") &
                                                 "',TransferTo='" & rdTransferTo.EditValue.ToString &
                                                 "',OtherTransfer='" & txtTransferOther.Text.Trim &
                                                 "',NameCounselor='" & Luecounsellor.EditValue.ToString & "' where Vcctid='" & Vcctid & "'", Cnndb)
                CmdVcctUp.ExecuteNonQuery()


                'Dim CmdReadID As New MySqlCommand("select e.vcctid from tblreasontoservice r 
                'left join tblveval e on r.vcctid=e.vcctid
                'left join tblline l on l.Vcctid=r.vcctid
                'where r.vcctid='" & Vcctid & "'and r.VCCTcode='" & VCCTcode & "'", Cnndb)
                'Rdr = CmdReadID.ExecuteReader

                'If Rdr.Read = True Then



                Dim Cmdreason As New MySqlCommand("Update tblreasontoservice Set
                                                  RS1='" & If(chRS1.Checked, 1, 2) &
                                                  "',RS2='" & If(chRS2.Checked, 1, 2) &
                                                 "',RS3='" & If(chRS3.Checked, 1, 2) &
                                                 "',RS4='" & If(chRS4.Checked, 1, 2) &
                                                 "',RS5='" & If(chRS5.Checked, 1, 2) &
                                                 "',RS6='" & If(chRS6.Checked, 1, 2) &
                                                 "',RS7='" & If(chRS7.Checked, 1, 2) &
                                                 "',RS8='" & If(chRS8.Checked, 1, 2) &
                                                 "',RS9='" & If(chRS9.Checked, 1, 2) &
                                                 "',RS10='" & If(chRS10.Checked, 1, 2) &
                                                 "',RS11='" & If(chRS11.Checked, 1, 2) &
                                                 "',RS12='" & If(chRS12.Checked, 1, 2) &
                                                 "',clinicIDPart='" & txtClinicIDPartner.Text.Trim &
                                                  "',artCodePart='" & If(cboARTCodePartner.Text = "", "", cboARTCodePartner.Text.Substring(0, 5)) &
                                                 "',RS13='" & If(chRS13.Checked, 1, 2) &
                                                 "',RS14='" & If(chRS14.Checked, 1, 2) & "' where Vcctid='" & Vcctid & "'", Cnndb)
                Cmdreason.ExecuteNonQuery()

                Dim Cmdeval As New MySqlCommand("Update tblveval Set
                                                C1='" & rdC1.EditValue.ToString &
                                                "',C2='" & rdC2.EditValue.ToString &
                                                "',C3='" & rdC3.EditValue.ToString &
                                                 "',C4='" & rdC4.EditValue.ToString &
                                                 "',C5='" & rdC5.EditValue.ToString &
                                                 "',C6='" & rdC6.EditValue.ToString &
                                                 "',C7='" & rdC7.EditValue.ToString &
                                                 "',C8='" & rdC8.EditValue.ToString &
                                                 "',C9='" & rdC9.EditValue.ToString &
                                                 "',C10='" & rdC10.EditValue.ToString &
                                                 "',C11='" & rdC11.EditValue.ToString &
                                                 "',C12='" & rdC12.EditValue.ToString &
                                                 "',C13='" & rdC13.EditValue.ToString &
                                                 "',C14='" & rdC14.EditValue.ToString &
                                                 "',C15='" & rdC15.EditValue.ToString &
                                                 "',C16='" & rdC16.EditValue.ToString &
                                                 "',C17='" & rdC17.EditValue.ToString &
                                                 "',C18='" & rdC18.EditValue.ToString & "' where Vcctid='" & Vcctid & "'", Cnndb)
                Cmdeval.ExecuteNonQuery()

                Dim Cmdline As New MySqlCommand("Update tblline Set
                                                Lcontrol='" & If(chLControl.Checked, 1, 2) &
                                                "',Lpositive='" & If(chLPositive.Checked, 1, 2) &
                                                 "',LLongterm='" & If(chLLongTerm.Checked, 1, 2) &
                                                 "',CamboAg='" & If(chComboAg.Checked, 1, 2) &
                                                 "',CamboAb='" & If(chComboAb.Checked, 1, 2) & "' where Vcctid='" & Vcctid & "'", Cnndb)
                Cmdline.ExecuteNonQuery()


                'Else
                '    Rdr.Close()
                '    Dim Cmdreason As New MySqlCommand("Insert into tblreasontoservice values('" & txtVcctID.Text.Trim & "','" &
                '                                  If(chRS1.Checked, 1, 2) & "','" &
                '                                  If(chRS2.Checked, 1, 2) & "','" &
                '                                  If(chRS3.Checked, 1, 2) & "','" &
                '                                  If(chRS4.Checked, 1, 2) & "','" &
                '                                  If(chRS5.Checked, 1, 2) & "','" &
                '                                  If(chRS6.Checked, 1, 2) & "','" &
                '                                  If(chRS7.Checked, 1, 2) & "','" &
                '                                  If(chRS8.Checked, 1, 2) & "','" &
                '                                  If(chRS9.Checked, 1, 2) & "','" &
                '                                  If(chRS10.Checked, 1, 2) & "','" &
                '                                  If(chRS11.Checked, 1, 2) & "','" &
                '                                  If(chRS12.Checked, 1, 2) & "','" &
                '                                  txtClinicIDPartner.Text.Trim & "','" &
                '                                  If(cboARTCodePartner.Text = "", "", cboARTCodePartner.Text.Substring(0, 5)) & "','" &
                '                                  If(chRS13.Checked, 1, 2) & "','" &
                '                                  If(chRS14.Checked, 1, 2) & "','" &
                '                                  CboVCCTcode.Text.Substring(0, 7) & "')", Cnndb)
                '    Cmdreason.ExecuteNonQuery()

                '    Dim Cmdeval As New MySqlCommand("Insert into tblveval values('" & txtVcctID.Text.Trim & "','" &
                '                                rdC1.EditValue.ToString & "','" &
                '                                rdC2.EditValue.ToString & "','" &
                '                                rdC3.EditValue.ToString & "','" &
                '                                rdC4.EditValue.ToString & "','" &
                '                                rdC5.EditValue.ToString & "','" &
                '                                rdC6.EditValue.ToString & "','" &
                '                                rdC7.EditValue.ToString & "','" &
                '                                rdC8.EditValue.ToString & "','" &
                '                                rdC9.EditValue.ToString & "','" &
                '                                rdC10.EditValue.ToString & "','" &
                '                                rdC11.EditValue.ToString & "','" &
                '                                rdC12.EditValue.ToString & "','" &
                '                                rdC13.EditValue.ToString & "','" &
                '                                rdC14.EditValue.ToString & "','" &
                '                                rdC15.EditValue.ToString & "','" &
                '                                rdC16.EditValue.ToString & "','" &
                '                                rdC17.EditValue.ToString & "','" &
                '                                rdC18.EditValue.ToString & "','" &
                '                                CboVCCTcode.Text.Substring(0, 7) & "')", Cnndb)
                '    Cmdeval.ExecuteNonQuery()

                '    Dim Cmdline As New MySqlCommand("Insert into tblline values('" & txtVcctID.Text & "','" &
                '                                If(chLControl.Checked, 1, 2) & "','" &
                '                                If(chLPositive.Checked, 1, 2) & "','" &
                '                                If(chLLongTerm.Checked, 1, 2) & "','" &
                '                                If(chComboAg.Checked, 1, 2) & "','" &
                '                                If(chComboAb.Checked, 1, 2) & "','" &
                '                                 CboVCCTcode.Text.Substring(0, 7) & "')", Cnndb)
                '    Cmdline.ExecuteNonQuery()

                'End If


                MessageBox.Show("Data Update Successfully!")
                Clear()
            End If
        End If
    End Sub

    Private Sub Delete()
        If vbYes = MessageBox.Show("តើលោកអ្នកពិតជាចង់លប់ទិន្នន័យនេះមែនទេ ?", "Delete..", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
            Dim CmdHy As New MySqlCommand("Delete from tblvcct where Vcctid='" & Vcctid & "'", Cnndb)
            CmdHy.ExecuteNonQuery()
            Dim CmdDels As New MySqlCommand("Delete from tblreasontoservice where Vcctid='" & Vcctid & "'", Cnndb)
            CmdDels.ExecuteNonQuery()
            Dim CmdDelARV As New MySqlCommand("Delete from tblveval where Vcctid='" & Vcctid & "'", Cnndb)
            CmdDelARV.ExecuteNonQuery()
            Dim CmdOI As New MySqlCommand("Delete from tblline where Vcctid='" & Vcctid & "'", Cnndb)
            CmdOI.ExecuteNonQuery()

            'Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtVcctID.Text) & "','tblvcct','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            'Cmdlog.ExecuteNonQuery()
            MessageBox.Show("លេខកូដអតិថិជន  " & Vcctid & " នេះត្រូវបានលប់ហើយ...", "Delete....", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub

    Private Sub FormValidation()
        If txtVcctID.Text.Trim = "" Then
            MessageBox.Show("សូមជ្រើសរើស លេខកូដអតិថិជន", "ចាំបាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            txtVcctID.Focus()
            vc = True
            Exit Sub
        End If
        If DaReg.Text = "" Then
            MessageBox.Show("សូមបំពេញ ថ្ងៃខែចុះបញ្ជី", "ចាំបាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            DaReg.Focus()
            vc = True
            Exit Sub
        End If
        If rdSex.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស ភេទ", "ចាំបាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdSex.Focus()
            vc = True
            Exit Sub
        End If
        If txtAge.Text.Trim = "" Then
            MessageBox.Show("សូមបញ្ចូល អាយុ ឬ ថ្ងៃខែឆ្នាំកំណើត", "ចាំបាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            txtAge.Focus()
            vc = True
            Exit Sub
        End If
        'If CboVCCTcode.SelectedIndex = -1 Then
        '    MessageBox.Show("សូមជ្រើសរើស ឈ្មោះ VCCT", "ចាំបាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        '    CboVCCTcode.Focus()
        '    vc = True
        '    Exit Sub
        'End If
        If rdMaritalStatus.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើសស្ថានភាពអាពាហ៍ពិពាហ៍", "ចាំបាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdMaritalStatus.Focus()
            vc = True
            Exit Sub
        End If
        If cboOccupation.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស មុខរបរ", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            cboOccupation.Focus()
            vc = True
            Exit Sub
        End If
        If rdEducation.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស កម្រិតវប្បធម៏", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdEducation.Focus()
            vc = True
            Exit Sub
        End If
        If cboProvince.SelectedIndex = -1 Or cbodistric.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស អាស័យដ្ឋាន យ៉ាងហោចត្រឹមស្រុក", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            cboProvince.Focus()
            vc = True
            Exit Sub
        End If
        If rdCob.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស ប្រទេសកំណើត", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdCob.Focus()
            vc = True
            Exit Sub
        End If
        If rdReferFrom.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស​ ​បញ្ចូនមកពី", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdReferFrom.Focus()
            vc = True
            Exit Sub
        End If
        If chRS1.Checked = False And
            chRS2.Checked = False And
            chRS3.Checked = False And
            chRS4.Checked = False And
            chRS5.Checked = False And
            chRS6.Checked = False And
            chRS7.Checked = False And
            chRS8.Checked = False And
            chRS9.Checked = False And
            chRS10.Checked = False And
            chRS11.Checked = False And
            chRS12.Checked = False And
            chRS13.Checked = False And
            chRS14.Checked = False Then
            MessageBox.Show("សូមជ្រើសរើស មូលហេតុរកសេវា", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            chRS1.Focus()
            vc = True
            Exit Sub
        End If
        If rdC1.SelectedIndex = -1 Or
            rdC2.SelectedIndex = -1 Or
            rdC3.SelectedIndex = -1 Or
            rdC4.SelectedIndex = -1 Or
            rdC5.SelectedIndex = -1 Or
            rdC6.SelectedIndex = -1 Or
            rdC7.SelectedIndex = -1 Or
            rdC8.SelectedIndex = -1 Or
            rdC9.SelectedIndex = -1 Or
            rdC10.SelectedIndex = -1 Or
            rdC11.SelectedIndex = -1 Or
            rdC12.SelectedIndex = -1 Or
            rdC13.SelectedIndex = -1 Or
            rdC14.SelectedIndex = -1 Or
            rdC15.SelectedIndex = -1 Or
            rdC16.SelectedIndex = -1 Or
            rdC17.SelectedIndex = -1 Or
            rdC18.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស វាយតម្លៃការប្រឈមមុខ ១២ខែចុងក្រោយ", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdC1.Focus()
            vc = True
            Exit Sub
        End If
        If rdTPatient.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស ប្រភេទអតិថិជន", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdTPatient.Focus()
            vc = True
            Exit Sub
        End If
        If rdHAgreeTest.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស ប្រវត្តិធ្វើតេស្ត", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdHAgreeTest.Focus()
            vc = True
            Exit Sub
        End If
        If rdHTestResult.Enabled = True And rdHTestResult.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស លទ្ធផលប្រវត្តិធ្វើតេស្ត", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdHTestResult.Focus()
            vc = True
            Exit Sub
        End If
        If rdAgreeTestHIV.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស​ ផ្តល់ការធ្វើតេស្ត HIV", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdAgreeTestHIV.Focus()
            vc = True
            Exit Sub
        End If
        If rdCombo.Enabled = True And rdCombo.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស លទ្ធផល HIV Alere Combo Assay", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdCombo.Focus()
            vc = True
            Exit Sub
        End If
        If (chComboAg.Enabled = True And chComboAb.Enabled = True) And (chComboAg.Checked = False And chComboAb.Checked = False) Then
            MessageBox.Show("សូមជ្រើសរើស ខ្សែបន្ទាត់ HIV Alere Combo យ៉ាងហោចមួយ", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            chComboAg.Focus()
            vc = True
            Exit Sub
        End If
        If rdHIVResult.Enabled = True And rdHIVResult.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស រោគវិនិច្ឆ័យ HIV", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdHIVResult.Focus()
            vc = True
            Exit Sub
        End If
        If rdAgreeRTRITest.Enabled = True And rdAgreeRTRITest.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស តេស្ត RTRI", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdAgreeRTRITest.Focus()
            vc = True
            Exit Sub
        End If
        If (chLControl.Enabled = True And chLPositive.Enabled = True And chLLongTerm.Enabled = True) And (chLControl.Checked = False And chLPositive.Checked = False And chLLongTerm.Checked = False) Then
            MessageBox.Show("សូមជ្រើសរើស ខ្សែបន្ទាត់ RTRI", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            chLControl.Focus()
            vc = True
            Exit Sub
        End If
        If rdResultRTRI.Enabled = True And rdResultRTRI.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស លទ្ធផល RTRI", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdResultRTRI.Focus()
            vc = True
            Exit Sub
        End If
        If rdAgreeTestVL.Enabled = True And rdAgreeTestVL.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស តេស្ត VL", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdAgreeTestVL.Focus()
            vc = True
            Exit Sub
        End If
        If rdVLResult.Enabled = True And rdVLResult.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស លទ្ធផល VL", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdVLResult.Focus()
            vc = True
            Exit Sub
        End If
        If rdRITAResult.Enabled = True And rdRITAResult.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស លទ្ធផល RITA", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdRITAResult.Focus()
            vc = True
            Exit Sub
        End If
        If rdCounselling.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស ការផ្តល់ប្រឹក្សាក្រោយពេលធ្វើតេស្ត", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdCounselling.Focus()
            vc = True
            Exit Sub
        End If
        If rdTransferTo.Properties.Items(0).Enabled = True And rdTransferTo.SelectedIndex = -1 Then
            MessageBox.Show("សូមជ្រើសរើស បញ្ចូនទៅកាន់", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            rdTransferTo.Focus()
            vc = True
            Exit Sub
        End If
        If Val(Luecounsellor.EditValue) = 0 Then
            MessageBox.Show("សូមជ្រើសរើស ឈ្មោះអ្នកផ្តល់ប្រឹក្សា", "ចាំចាច់.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            Luecounsellor.Focus()
            vc = True
            Exit Sub
        End If

    End Sub

    Private Sub ViewData()
        'MessageBox.Show(vSite.Substring(0, 6))
        Dim i As Int64
        Dim CmdSearch As New MySqlCommand("SELECT v.Vcctid,v.DaReg,v.Sex, v.DaDob,v.MaritalStatus,v.HIVResult, v.TransferTo, r.Result, v.TPatient, v.ReferFrom, v.RTRIResult, v.AgreeTestVL, v.VLResult, v.RITAResult  FROM preart.tblvcct v
left join (select * from tblretest where VCCTCode='" & vSite.Substring(0, 6) & "') r on v.Vcctid=r.Vcctid order by v.Vcctid, v.DaReg desc;", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")

            dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
            Select Case Val(Rdr.GetValue(2).ToString)
                Case 0
                    dr(3) = "Female"
                Case 1
                    dr(3) = "Male"
            End Select
            dr(4) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(1).ToString))
            Select Case Val(Rdr.GetValue(4).ToString)
                Case 1
                    dr(5) = "Single"
                Case 2
                    dr(5) = "Married"
                Case 3
                    dr(5) = "Window(er)"
            End Select
            Select Case Val(Rdr.GetValue(5).ToString)
                Case 1
                    dr(6) = "Negative"
                Case 2
                    dr(6) = "Positive"
                Case 3
                    dr(6) = "Unknown"
            End Select
            Select Case Val(Rdr.GetValue(6).ToString)
                Case 1
                    dr(7) = "សេវាART"
                Case 2
                    dr(7) = "គ្លីនិកកាមរោគ"
            End Select
            Select Case Val(Rdr.GetValue(7).ToString)
                Case 1
                    dr(8) = "Negative"
                Case 2
                    dr(8) = "Positive"
                Case 3
                    dr(8) = "Unknown"
            End Select
            Select Case Val(Rdr.GetValue(8).ToString)
                Case 1
                    dr(9) = "FEW"
                Case 2
                    dr(9) = "MSM"
                Case 3
                    dr(9) = "TG"
                Case 4
                    dr(9) = "PWUD"
                Case 5
                    dr(9) = "PWID"
                Case 6
                    dr(9) = "GP"
                Case 7
                    dr(9) = "MEW"
                Case 8
                    dr(9) = "PPW"
            End Select
            Select Case Val(Rdr.GetValue(9).ToString)
                Case 1
                    dr(10) = "មកដោយខ្លួនឯង"
                Case 2
                    dr(10) = "សេវាពន្យាកំណើត"
                Case 3
                    dr(10) = "ផ្នែកវះកាត់"
                Case 4
                    dr(10) = "ផ្នែកពិគ្រោះជំងឺក្រៅ"
                Case 5
                    dr(10) = "ផ្នែកជំងឺឆ្លង"
                Case 6
                    dr(10) = "ផ្នែកជំងឺទូទៅ"
                Case 7
                    dr(10) = "ផ្នែកព្យាបាលជំងឺកុមារ"
                Case 8
                    dr(10) = "ផ្នែកព្យាបាលជំងឺស្បែក"
                Case 9
                    dr(10) = "ផ្នែកព្យាបាលមាត់ធ្មេញ"
                Case 10
                    dr(10) = "អង្គការNGO"
                Case 11
                    dr(10) = "ផ្នែកសម្ភព"
                Case 12
                    dr(10) = "មណ្ឌលសុខភាព"
                Case 13
                    dr(10) = "គ្លីនិកកាមរោគ"
                Case 14
                    dr(10) = "កម្មវិធីរបេង"
                Case 15
                    dr(10) = "ផ្នែកពិនិត្យផ្ទៃពោះ"
                Case 16
                    dr(10) = "សេវាឯកជន"
                Case 17
                    dr(10) = "សង្គ្រោះបន្ទាន់"
                Case 18
                    dr(10) = "PNTT/ART"
                Case 19
                    dr(10) = "HIVST"
                Case 20
                    dr(10) = "មណ្ឌលផ្តល់ឈាម"
            End Select
            Select Case Val(Rdr.GetValue(10).ToString)
                Case 1
                    dr(11) = "ឆ្លងយូរ"
                Case 2
                    dr(11) = "ឆ្លងថ្មី"
                Case 3
                    dr(11) = "មិនអាចកំណត់បាន"
                Case 4
                    dr(11) = "មិនអាចយកជាការបាន"
            End Select
            Select Case Val(Rdr.GetValue(11).ToString)
                Case 1
                    dr(12) = "យល់ព្រម"
                Case 2
                    dr(12) = "មិនយល់ព្រម"
            End Select
            Select Case Val(Rdr.GetValue(12).ToString)
                Case 1
                    dr(13) = "<1000 copies/ml"
                Case 2
                    dr(13) = ">=1000 copies/ml"
            End Select
            Select Case Val(Rdr.GetValue(13).ToString)
                Case 1
                    dr(14) = "ឆ្លងយូរ"
                Case 2
                    dr(14) = "ឆ្លងថ្មី"
            End Select

            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
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
        Clear()
        tsbDelete.Enabled = True
        Vcctid = CInt(GridView1.GetRowCellValue(hitInfo.RowHandle(), "VCCT-ID"))
        'MessageBox.Show("VcctID: " & Vcctid)
        If Vcctid = Nothing And VCCTcode = Nothing Then Exit Sub
        TabControl1.SelectedIndex = 1
        txtVcctID.Enabled = False
        Search()
    End Sub

    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub Search()
        Dim CmdVcct As New MySqlCommand("Select * from tblvcct where vcctid='" & Vcctid & "'", Cnndb)
        Rdr = CmdVcct.ExecuteReader
        Dim p As String = ""
        Dim d As String = ""
        Dim c As String = ""
        Dim v As String = ""
        While Rdr.Read
            txtVcctID.EditValue = Vcctid
            DaReg.EditValue = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
            txtPmrs.Text = Rdr.GetValue(2).ToString
            txtHTScode.Text = Rdr.GetValue(3).ToString
            txtUuic.Text = Rdr.GetValue(4).ToString
            'MessageBox.Show("Sex Index: " & rdSex.Properties.Items.GetItemIndexByValue(Rdr.GetValue(5).ToString) & " Sex Value: " & Rdr.GetValue(5).ToString)
            'rdSex.SelectedIndex = rdSex.Properties.Items.GetItemIndexByValue(Rdr.GetValue(5).ToString)
            rdSex.EditValue = Rdr.GetValue(5).ToString
            txtAge.EditValue = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(6).ToString), CDate(Rdr.GetValue(1).ToString))
            DaDob.EditValue = Format(CDate(Rdr.GetValue(6).ToString), "dd/MM/yyyy")
            rdMaritalStatus.EditValue = Rdr.GetValue(7).ToString
            cboOccupation.Text = Rdr.GetValue(8).ToString
            'If(Rdr.GetValue(8).ToString = "99", 11, CInt(Rdr.GetValue(8).ToString) - 1)
            txtOccOther.Text = Rdr.GetValue(9).ToString
            rdEducation.EditValue = Rdr.GetValue(10).ToString
            p = Rdr.GetValue(11).ToString
            d = Rdr.GetValue(12).ToString
            c = Rdr.GetValue(13).ToString
            v = Rdr.GetValue(14).ToString
            txtGroup.Text = Rdr.GetValue(15).ToString
            txtHouse.Text = Rdr.GetValue(16).ToString
            txtStreet.Text = Rdr.GetValue(17).ToString
            rdCob.EditValue = Rdr.GetValue(18).ToString
            txtCobOther.Text = Rdr.GetValue(19).ToString
            rdReferFrom.EditValue = Rdr.GetValue(20).ToString
            rdTPatient.EditValue = Rdr.GetValue(21).ToString

            rdHAgreeTest.EditValue = Rdr.GetValue(22).ToString
            rdHTestResult.EditValue = Rdr.GetValue(23).ToString

            rdHPartnerResult1.EditValue = Rdr.GetValue(24).ToString
            rdHPartnerResult2.EditValue = Rdr.GetValue(25).ToString
            rdAgreeTestHIV.EditValue = Rdr.GetValue(26).ToString
            rdCombo.EditValue = Rdr.GetValue(27).ToString
            rdHIVResult.EditValue = Rdr.GetValue(28).ToString
            rdAgreeRTRITest.EditValue = Rdr.GetValue(29).ToString
            rdResultRTRI.EditValue = Rdr.GetValue(30).ToString
            If CInt(Rdr.GetValue(31).ToString) = 1 Then Chfirstinvalid.Checked = True
            rdAgreeTestVL.EditValue = Rdr.GetValue(32).ToString
            rdVLResult.EditValue = Rdr.GetValue(33).ToString
            rdRITAResult.EditValue = Rdr.GetValue(34).ToString
            rdCounselling.EditValue = Rdr.GetValue(35).ToString
            DaCounselling.EditValue = Format(CDate(Rdr.GetValue(36).ToString), "dd/MM/yyyy")
            rdTransferTo.EditValue = Rdr.GetValue(37).ToString
            txtothertransfer.Text = Rdr.GetValue(38).ToString
            Luecounsellor.EditValue = CInt(Rdr.GetValue(39).ToString)

        End While
        Rdr.Close()
        cboProvince.Text = p
        cbodistric.Text = d
        cboCommune.Text = c
        cbovillage.Text = v



        'Checked Retest before ARV
        Dim CmdRebeforARV As New MySqlCommand("SELECT * FROM tblretest where vcctid='" & Vcctid & "'and VCCTcode='" & vSite.Substring(0, 6) & "'", Cnndb)
        Rdr = CmdRebeforARV.ExecuteReader
        If Rdr.HasRows Then
            chRS9.Checked = True
        End If
        Rdr.Close()

        Dim Cmdreason As New MySqlCommand("Select * from tblreasontoservice where vcctid='" & Vcctid & "'", Cnndb)
        Rdr = Cmdreason.ExecuteReader
        Dim IDpartner As String = ""
        Dim ARTpartner As String = ""
        While Rdr.Read
            If CInt(Rdr.GetValue(1).ToString) = 1 Then chRS1.Checked = True
            If CInt(Rdr.GetValue(2).ToString) = 1 Then chRS2.Checked = True
            If CInt(Rdr.GetValue(3).ToString) = 1 Then chRS3.Checked = True
            If CInt(Rdr.GetValue(4).ToString) = 1 Then chRS4.Checked = True
            If CInt(Rdr.GetValue(5).ToString) = 1 Then chRS5.Checked = True
            If CInt(Rdr.GetValue(6).ToString) = 1 Then chRS6.Checked = True
            If CInt(Rdr.GetValue(7).ToString) = 1 Then chRS7.Checked = True
            If CInt(Rdr.GetValue(8).ToString) = 1 Then chRS8.Checked = True
            If CInt(Rdr.GetValue(9).ToString) = 1 Then chRS9.Checked = True
            If CInt(Rdr.GetValue(10).ToString) = 1 Then chRS10.Checked = True
            If CInt(Rdr.GetValue(11).ToString) = 1 Then chRS11.Checked = True
            If CInt(Rdr.GetValue(12).ToString) = 1 Then
                chRS12.Checked = True
                IDpartner = Rdr.GetValue(13).ToString
                ARTpartner = Rdr.GetValue(14).ToString
            End If

            If CInt(Rdr.GetValue(15).ToString) = 1 Then chRS13.Checked = True
            If CInt(Rdr.GetValue(16).ToString) = 1 Then chRS14.Checked = True

        End While
        Rdr.Close()
        txtClinicIDPartner.Text = IDpartner

        Dim Cmdartsite As New MySqlCommand("SELECT * FROM preart.tblartsite where Sid='" & ARTpartner & "' order by Sid", Cnndb)
        Rdr = Cmdartsite.ExecuteReader
        While Rdr.Read
            ARTpartner = Rdr.GetValue(0).ToString.Trim + " -- " + Rdr.GetValue(1).ToString.Trim
        End While
        Rdr.Close()
        cboARTCodePartner.Text = ARTpartner

        Dim Cmdeval As New MySqlCommand("Select * from tblveval where vcctid='" & Vcctid & "'", Cnndb)
        Rdr = Cmdeval.ExecuteReader
        While Rdr.Read
            rdC1.EditValue = Rdr.GetValue(1).ToString
            rdC2.EditValue = Rdr.GetValue(2).ToString
            rdC3.EditValue = Rdr.GetValue(3).ToString
            rdC4.EditValue = Rdr.GetValue(4).ToString
            rdC5.EditValue = Rdr.GetValue(5).ToString
            rdC6.EditValue = Rdr.GetValue(6).ToString
            rdC7.EditValue = Rdr.GetValue(7).ToString
            rdC8.EditValue = Rdr.GetValue(8).ToString
            rdC9.EditValue = Rdr.GetValue(9).ToString
            rdC10.EditValue = Rdr.GetValue(10).ToString
            rdC11.EditValue = Rdr.GetValue(11).ToString
            rdC12.EditValue = Rdr.GetValue(12).ToString
            rdC13.EditValue = Rdr.GetValue(13).ToString
            rdC14.EditValue = Rdr.GetValue(14).ToString
            rdC15.EditValue = Rdr.GetValue(15).ToString
            rdC16.EditValue = Rdr.GetValue(16).ToString
            rdC17.EditValue = Rdr.GetValue(17).ToString
            rdC18.EditValue = Rdr.GetValue(18).ToString
        End While
        Rdr.Close()

        Dim Cmdline As New MySqlCommand("Select * from tblline where vcctid='" & Vcctid & "'", Cnndb)
        Rdr = Cmdline.ExecuteReader
        While Rdr.Read
            If CInt(Rdr.GetValue(1).ToString) = 1 Then chLControl.Checked = True
            If CInt(Rdr.GetValue(2).ToString) = 1 Then chLPositive.Checked = True
            If CInt(Rdr.GetValue(3).ToString) = 1 Then chLLongTerm.Checked = True
            If CInt(Rdr.GetValue(4).ToString) = 1 Then chComboAg.Checked = True
            If CInt(Rdr.GetValue(5).ToString) = 1 Then chComboAb.Checked = True
        End While
        Rdr.Close()
    End Sub

    Private Sub LabelControl41_Click(sender As Object, e As EventArgs) Handles LabelControl41.Click
        rdC1.SelectedIndex = 1
        rdC2.SelectedIndex = 1
        rdC3.SelectedIndex = 1
        rdC4.SelectedIndex = 1
        rdC5.SelectedIndex = 1
        rdC6.SelectedIndex = 1
    End Sub

    Private Sub LabelControl59_Click(sender As Object, e As EventArgs) Handles LabelControl59.Click
        rdC7.SelectedIndex = 1
        rdC8.SelectedIndex = 1
        rdC9.SelectedIndex = 1
        rdC10.SelectedIndex = 1
        rdC11.SelectedIndex = 1
        rdC12.SelectedIndex = 1
    End Sub

    Private Sub LabelControl61_Click(sender As Object, e As EventArgs) Handles LabelControl61.Click
        rdC13.SelectedIndex = 1
        rdC14.SelectedIndex = 1
        rdC15.SelectedIndex = 1
        rdC16.SelectedIndex = 1
        rdC17.SelectedIndex = 1
        rdC18.SelectedIndex = 1
    End Sub

    Private Sub tspVCCTID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspVCCTID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Int64
            Dim CmdSearch As New MySqlCommand("SELECT v.Vcctid,v.DaReg,v.Sex, v.DaDob,v.MaritalStatus,v.HIVResult, v.TransferTo, r.Result, v.TPatient, v.ReferFrom, v.RTRIResult, v.AgreeTestVL, v.VLResult, v.RITAResult  FROM preart.tblvcct v
left join tblretest r on v.Vcctid=r.Vcctid where v.Vcctid='" & tspVCCTID.Text & "'order by v.Vcctid;", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")

                dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
                Select Case Val(Rdr.GetValue(2).ToString)
                    Case 0
                        dr(3) = "Female"
                    Case 1
                        dr(3) = "Male"
                End Select
                dr(4) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(1).ToString))
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 1
                        dr(5) = "Single"
                    Case 2
                        dr(5) = "Married"
                    Case 3
                        dr(5) = "Window(er)"
                End Select
                Select Case Val(Rdr.GetValue(5).ToString)
                    Case 1
                        dr(6) = "Negative"
                    Case 2
                        dr(6) = "Positive"
                    Case 3
                        dr(6) = "Unknown"
                End Select
                Select Case Val(Rdr.GetValue(6).ToString)
                    Case 1
                        dr(7) = "សេវាART"
                    Case 2
                        dr(7) = "គ្លីនិកកាមរោគ"
                End Select
                Select Case Val(Rdr.GetValue(7).ToString)
                    Case 1
                        dr(8) = "Negative"
                    Case 2
                        dr(8) = "Positive"
                    Case 3
                        dr(8) = "Unknown"
                End Select
                Select Case Val(Rdr.GetValue(8).ToString)
                    Case 1
                        dr(9) = "FEW"
                    Case 2
                        dr(9) = "MSM"
                    Case 3
                        dr(9) = "TG"
                    Case 4
                        dr(9) = "PWUD"
                    Case 5
                        dr(9) = "PWID"
                    Case 6
                        dr(9) = "GP"
                    Case 7
                        dr(9) = "MEW"
                    Case 8
                        dr(9) = "PPW"
                End Select
                Select Case Val(Rdr.GetValue(9).ToString)
                    Case 1
                        dr(10) = "មកដោយខ្លួនឯង"
                    Case 2
                        dr(10) = "សេវាពន្យាកំណើត"
                    Case 3
                        dr(10) = "ផ្នែកវះកាត់"
                    Case 4
                        dr(10) = "ផ្នែកពិគ្រោះជំងឺក្រៅ"
                    Case 5
                        dr(10) = "ផ្នែកជំងឺឆ្លង"
                    Case 6
                        dr(10) = "ផ្នែកជំងឺទូទៅ"
                    Case 7
                        dr(10) = "ផ្នែកព្យាបាលជំងឺកុមារ"
                    Case 8
                        dr(10) = "ផ្នែកព្យាបាលជំងឺស្បែក"
                    Case 9
                        dr(10) = "ផ្នែកព្យាបាលមាត់ធ្មេញ"
                    Case 10
                        dr(10) = "អង្គការNGO"
                    Case 11
                        dr(10) = "ផ្នែកសម្ភព"
                    Case 12
                        dr(10) = "មណ្ឌលសុខភាព"
                    Case 13
                        dr(10) = "គ្លីនិកកាមរោគ"
                    Case 14
                        dr(10) = "កម្មវិធីរបេង"
                    Case 15
                        dr(10) = "ផ្នែកពិនិត្យផ្ទៃពោះ"
                    Case 16
                        dr(10) = "សេវាឯកជន"
                    Case 17
                        dr(10) = "សង្គ្រោះបន្ទាន់"
                    Case 18
                        dr(10) = "PNTT/ART"
                    Case 19
                        dr(10) = "HIVST"
                    Case 20
                        dr(10) = "មណ្ឌលផ្តល់ឈាម"
                End Select
                Select Case Val(Rdr.GetValue(10).ToString)
                    Case 1
                        dr(11) = "ឆ្លងយូរ"
                    Case 2
                        dr(11) = "ឆ្លងថ្មី"
                    Case 3
                        dr(11) = "មិនអាចកំណត់បាន"
                    Case 4
                        dr(11) = "មិនអាចយកជាការបាន"
                End Select
                Select Case Val(Rdr.GetValue(11).ToString)
                    Case 1
                        dr(12) = "យល់ព្រម"
                    Case 2
                        dr(12) = "មិនយល់ព្រម"
                End Select
                Select Case Val(Rdr.GetValue(12).ToString)
                    Case 1
                        dr(13) = "<1000 copies/ml"
                    Case 2
                        dr(13) = ">=1000 copies/ml"
                End Select
                Select Case Val(Rdr.GetValue(13).ToString)
                    Case 1
                        dr(14) = "ឆ្លងយូរ"
                    Case 2
                        dr(14) = "ឆ្លងថ្មី"
                End Select

                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If

    End Sub

    Private Sub cboOccupation_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboOccupation.SelectedIndexChanged
        If cboOccupation.SelectedIndex = 11 Then
            txtOccOther.Enabled = True
        Else
            txtOccOther.Enabled = False
        End If
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Delete()
    End Sub


    Private Sub rdCob_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdCob.SelectedIndexChanged
        If rdCob.SelectedIndex = 3 Then
            txtCobOther.Enabled = True
        Else
            txtCobOther.Enabled = False
        End If
    End Sub



    Private Sub rdAgreetestVL_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdAgreeTestVL.SelectedIndexChanged
        If Val(rdAgreeTestVL.EditValue) = 1 Then
            rdVLResult.Enabled = True
            rdRITAResult.Enabled = True
        Else
            rdVLResult.Enabled = False
            rdVLResult.EditValue = 0
            rdRITAResult.Enabled = False
            rdRITAResult.EditValue = 0
        End If
    End Sub

    'Private Sub CboVCCTcode_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboVCCTcode.SelectedIndexChanged
    '    vCode = If(CboVCCTcode.SelectedIndex = -1, "", CboVCCTcode.Text.Substring(0, 6))

    '    If vSite <> vCode Then
    '        GroupBox5.Enabled = False
    '        GroupBox3.Enabled = False
    '        GroupBox7.Enabled = False
    '        GroupBox6.Enabled = False
    '        GroupBox8.Enabled = False
    '        GroupBox9.Enabled = False
    '        GroupBox2.Enabled = False
    '        GroupBox1.Enabled = False
    '    Else
    '        GroupBox5.Enabled = True
    '        GroupBox3.Enabled = True
    '        GroupBox7.Enabled = True
    '        GroupBox6.Enabled = True
    '        GroupBox8.Enabled = True
    '        GroupBox9.Enabled = True
    '        GroupBox2.Enabled = True
    '        GroupBox1.Enabled = True
    '    End If
    'End Sub
End Class