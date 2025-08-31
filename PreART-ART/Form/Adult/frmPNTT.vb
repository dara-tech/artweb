Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Public Class frmPNTT
    Dim b, d As Boolean
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim Dob, fvdate As Date
    Dim Aid, Pid, Cid As Double
    Private Sub frmPNTT_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Clear()
        LoadData()
        XtraTabControl1.SelectedTabPage = XtraTabPage1
    End Sub

#Region "Function"
    Private Sub Clear()
        XtraTabControl1.SelectedTabPage = XtraTabPage2
        txtClinicID.Text = ""
        txtClinicID.Focus()
        txtClinicID.Enabled = True
        DaVisit.Text = "01/01/1900"
        'If b = False Then
        RdAgree.SelectedIndex = -1
        'End If
        RdSexHIV.SelectedIndex = -1
        RdSexM.SelectedIndex = -1
        RdSexTran.SelectedIndex = -1
        RdSex4.SelectedIndex = -1
        RdDrug.SelectedIndex = -1
        RdPill.SelectedIndex = -1
        RdSexMoney.SelectedIndex = -1
        RdSexProvice.SelectedIndex = -1
        RdWOut.SelectedIndex = -1
        CboPartner.SelectedIndex = -1
        CboPartner.Enabled = False
        CboPartner.Properties.Items.Clear()
        CboPartner.Properties.Items.AddRange({1, 2, 3, 4, 5, 6, 7, 8})
        RdSexHIV.Enabled = False
        RdWsex.Enabled = False
        RdSexM.Enabled = False
        RdSexTran.Enabled = False
        RdSex4.Enabled = False
        RdDrug.Enabled = False
        RdPill.Enabled = False
        RdSexMoney.Enabled = False
        RdSexProvice.Enabled = False
        RdWOut.Enabled = False
        txtAge.Text = ""
        RdSex.SelectedIndex = -1
        txtGroup.Text = ""
        txthouse.Text = ""
        txtstreet.Text = ""
        cboProvince.SelectedIndex = -1
        txtPhone.Text = ""
        RdRelaPatient.SelectedIndex = -1
        RdHid.SelectedIndex = -1
        RdWan.SelectedIndex = -1
        Rdforce.SelectedIndex = -1
        DaNotiPartner.Text = "01/01/1900"
        DaNotiCoporat.Text = "01/01/1900"
        DaR1.Text = "01/01/1900"
        RdT1.SelectedIndex = -1
        RdCon1.SelectedIndex = -1
        txtEx1.Text = ""
        DaR2.Text = "01/01/1900"
        DaR3.Text = "01/01/1900"
        DaR4.Text = "01/01/1900"
        RdT2.SelectedIndex = -1
        RdT3.SelectedIndex = -1
        RdT4.SelectedIndex = -1
        RdCon2.SelectedIndex = -1
        RdCon3.SelectedIndex = -1
        RdCon4.SelectedIndex = -1
        txtEx2.Text = ""
        txtEx3.Text = ""
        txtEx4.Text = ""
        RdAgreeTest.SelectedIndex = -1
        RdResult.SelectedIndex = -1
        CboChild.SelectedIndex = -1
        CboChild.Enabled = False
        CboChild.Properties.Items.Clear()
        CboChild.Properties.Items.AddRange({1, 2, 3, 4, 5})
        txtCage.Text = ""
        RdCsex.SelectedIndex = -1
        txtCgroup.Text = ""
        txtCHouse.Text = ""
        txtCStreet.Text = ""
        CboCprovince.SelectedIndex = -1
        txtCphone.Text = ""
        DaCc1.Text = "01/01/1900"
        DaCc2.Text = "01/01/1900"
        DaCc3.Text = "01/01/1900"
        DaCc4.Text = "01/01/1900"
        DaCc5.Text = "01/01/1900"
        DaCc6.Text = "01/01/1900"
        RdCp1.SelectedIndex = -1
        RdCp2.SelectedIndex = -1
        RdCp3.SelectedIndex = -1
        RdCp4.SelectedIndex = -1
        RdCp5.SelectedIndex = -1
        RdCp6.SelectedIndex = -1
        RdCc1.SelectedIndex = -1
        RdCc2.SelectedIndex = -1
        RdCc3.SelectedIndex = -1
        RdCc4.SelectedIndex = -1
        RdCc5.SelectedIndex = -1
        RdCc6.SelectedIndex = -1
        txtCcon1.Text = ""
        txtCcon2.Text = ""
        txtCcon3.Text = ""
        txtCcon4.Text = ""
        txtCcon5.Text = ""
        txtCcon6.Text = ""
        RdCagreeTest.SelectedIndex = -1
        RdCresult.SelectedIndex = -1
        RdWsex.SelectedIndex = -1
        fvdate = "01/01/1900"
        Aid = 0
        Pid = 0
        Cid = 0
        tsbDelete.Enabled = False
        tsbDelete1.Enabled = False
        RdNotification.SelectedIndex = -1
        RdSipv.SelectedIndex = -1
        RdSfirst.SelectedIndex = -1
        RdStransfer.SelectedIndex = -1
        RdTypTest.SelectedIndex = -1
        RdTreatment.SelectedIndex = -1
        RdCvisit.SelectedIndex = -1
        RdCtreatment.SelectedIndex = -1
        DaVisit.Enabled = False
        TxtARTnum.Text = ""
        RdAgree.Enabled = False
        'txtNumChild.Text = ""
        'txtPartnersex.Text = ""
        RdWsex.SelectedIndex = -1
        'txtNumDrug.Text = ""

    End Sub
    Private Sub LoadData()
        Dim Cmdadd As New MySqlCommand("select * from tblProvince ORDER BY Pid", Cnndb)
        Rdr = Cmdadd.ExecuteReader
        While Rdr.Read
            cboProvince.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboCprovince.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        dt = New DataTable
        'dt.Columns.Add("No", GetType(Double))
        'dt.Columns.Add("ClinicID", GetType(String))
        'dt.Columns.Add("ART Number", GetType(String))
        'dt.Columns.Add("Date", GetType(Date))
        'dt.Columns.Add("Agree PNTT", GetType(Boolean))
        'dt.Columns.Add("Age Partner", GetType(Double))
        'dt.Columns.Add("Sex", GetType(String))
        'dt.Columns.Add("No. Partner", GetType(String))
        'dt.Columns.Add("Result Test", GetType(String))
        'dt.Columns.Add("No. Child", GetType(String))
        'dt.Columns.Add("Asid", GetType(String))
        'dt.Columns.Add("Apid", GetType(String))
        'dt.Columns.Add("Cid", GetType(String))
        'GridControl1.DataSource = dt
        'GridView1.Columns("Asid").Visible = False
        'GridView1.Columns("Apid").Visible = False
        'GridView1.Columns("Cid").Visible = False

        dt.Columns.Add("No", GetType(Double))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("ART Number", GetType(String))
        dt.Columns.Add("Date", GetType(Date))
        dt.Columns.Add("Agree PNTT", GetType(String))
        dt.Columns.Add("Status", GetType(String))
        dt.Columns.Add("Orders", GetType(String))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Age", GetType(String))
        dt.Columns.Add("Clinic_ID", GetType(String))
        dt.Columns.Add("ARTnumber", GetType(String))
        dt.Columns.Add("Result", GetType(String))
        dt.Columns.Add("Asid", GetType(String))
        dt.Columns.Add("Apid", GetType(String))
        dt.Columns.Add("Cid", GetType(String))
        GridControl1.DataSource = dt
        GridView1.Columns("Asid").Visible = False
        GridView1.Columns("Apid").Visible = False
        GridView1.Columns("Cid").Visible = False
    End Sub
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
            'txtClinicID.Text = ""
            Clear()
            Exit Sub
        End While
        Rdr.Close()

        Dim cmdART As New MySqlCommand("Select * from tblaart where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = cmdART.ExecuteReader()
        While Rdr.Read
            TxtARTnum.Text = Rdr.GetValue(1).ToString.Trim
        End While
        Rdr.Close()
        'DaVisit.Focus()
        Dim CmdSearchAI As New MySqlCommand("Select * from tblaimain where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        While Rdr.Read
            '   Dob = CDate(Rdr.GetValue(3).ToString)
            fvdate = CDate(Rdr.GetValue(1).ToString)
            txtClinicID.Enabled = False
            DaVisit.Enabled = True
            Rdr.Close()
            Exit Sub
        End While
        Rdr.Close()
        MessageBox.Show("មិនមានលេខកូដអ្នកជំងឺនេះក្នុងប្រពន្ធយើងខ្មុំទេ ឬទិន្នន័យរបស់អ្នកជំងឺនេះអត់ទាន់បានបញ្ចូល។", "Check In Adult initial visit first", MessageBoxButtons.OK, MessageBoxIcon.Error)
        txtClinicID.Text = ""
        txtClinicID.Focus()
    End Sub
    Private Sub Save()
        If tsbDelete.Enabled = False Then
            Dim B, C As Boolean
            Dim Pid As Double = txtClinicID.Text & Format(CDate(DaVisit.Text), "ddMMyy")
            If txtClinicID.Text.Trim = "" Then MessageBox.Show("សូមបញ្ចូលលេខកូដអ្នកជំងឺ​ ?", "មិនដំណើរការ.....", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
            If CDate(DaVisit.Text) < CDate("01-01-2018") Then MessageBox.Show("សូមបញ្ចូលថ្ងៃខែឆ្នាំពិនិត្យ PNTT​ ?", "មិនដំណើរការ.....", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
            If RdAgree.SelectedIndex = -1 Then MessageBox.Show("សូមជ្រើសរើសនៃការជួនដំណឹង​?", "មិនដំណើរការ.....", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
            If CboPartner.SelectedIndex <> 0 Then
                If txtAge.Text = "" And txtAge.Enabled = True Then MessageBox.Show("សូមបញ្ចូលអាយុដៃគូ!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
                If RdSex.SelectedIndex = -1 And RdSex.Enabled = True Then MessageBox.Show("សូម​​ជ្រើសរើសភេទដៃគូ!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub

                If RdAgreeTest.SelectedIndex = 2 And RdTypTest.SelectedIndex = -1 Then MessageBox.Show("សូម​​ជ្រើសរើសប្រភេទនៃការធ្វើតេស្ត!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
                If RdTypTest.Enabled = True And RdTypTest.SelectedIndex <> -1 And RdResult.SelectedIndex = -1 Then MessageBox.Show("សូម​​ជ្រើសរើសលទ្ធផលតេស្ត!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
                If RdResult.SelectedIndex <> -1 And RdTreatment.Enabled = True And RdTreatment.SelectedIndex = -1 Then MessageBox.Show("សូម​​ជ្រើសរើសការចុះឈ្មោះទទួលការព្យាបាល!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
            End If
            If CboChild.SelectedIndex <> 0 Then
                If txtCage.Text = "" And txtCage.Enabled = True Then MessageBox.Show("សូមបញ្ចូលអាយុកូន!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
                If Val(txtCage.Text) > 18 Then MessageBox.Show("អាចបញ្ចូលអាយុបានក្រោម ១៩ ឆ្នាំ!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
                If RdCsex.SelectedIndex = -1 And RdCsex.Enabled = True Then MessageBox.Show("សូម​​ជ្រើសរើសភេទកូន!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub

                If RdCagreeTest.SelectedIndex = 2 And RdCresult.SelectedIndex = -1 Then MessageBox.Show("សូម​​ជ្រើសរើសលទ្ធផលតេស្ត!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
                If RdCresult.SelectedIndex <> -1 And RdCtreatment.Enabled = True And RdCtreatment.SelectedIndex = -1 Then MessageBox.Show("សូម​​ជ្រើសរើសការចុះឈ្មោះទទួលការព្យាបាល!", "Required..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
            End If

            If MessageBox.Show("តើលោកអ្នកពិតជាចង់រក្សាទុកមែនទេ ?", "Save.....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                    Try
                        Dim cmdSave As New MySqlCommand("Insert into tblapntt values('" & txtClinicID.Text & "','" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "','" & RdSexHIV.SelectedIndex & "','" & RdWsex.SelectedIndex & "'," &
                                            "'" & RdSexM.SelectedIndex & "','" & RdSexTran.SelectedIndex & "','" & RdSex4.SelectedIndex & "','" & RdDrug.SelectedIndex & "','" & RdPill.SelectedIndex & "','" & RdSexMoney.SelectedIndex & "','" & RdSexProvice.SelectedIndex & "'," &
                                            "'" & RdWOut.SelectedIndex & "','" & RdAgree.SelectedIndex & "','" & Pid & "')", Cnndb)
                        cmdSave.ExecuteNonQuery()
                    Catch ex As Exception
                    End Try
                    Dim Aid As Double = Pid & CboPartner.EditValue
                    ' Try
                    If Val(CboPartner.Text) > 0 Then
                        Try
                        Dim CmdPart As New MySqlCommand("insert into tblapnttpart values('" & Pid & "','" & txtPartnersex.Text & "','" & txtNumDrug.Text & "','" & txtNumChild.Text & "','" & CboPartner.Text & "','" & txtAge.Text & "','" & RdSex.SelectedIndex & "','" & txtGroup.Text.Trim & "','" & txthouse.Text.Trim & "','" & txtstreet.Text & "','" & cbovillage.Text.Replace("'", "''") & "'," &
                                        "'" & cboCommune.Text.Replace("'", "''") & "','" & cbodistric.Text.Replace("'", "''") & "','" & cboProvince.Text & "','" & txtPhone.Text & "','" & RdRelaPatient.SelectedIndex & "','" & txtOtherRpat.Text & "','" & RdHid.SelectedIndex & "','" & RdWan.SelectedIndex & "','" & Rdforce.SelectedIndex & "'," &
                                        "'" & RdSipv.SelectedIndex & "','" & RdSfirst.SelectedIndex & "','" & RdStransfer.SelectedIndex & "','" & RdNotification.SelectedIndex & "','" & Format(CDate(DaNotiPartner.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaNotiCoporat.EditValue), "yyyy/MM/dd") & "','" & RdAgreeTest.SelectedIndex & "','" & RdTypTest.SelectedIndex & "','" & RdResult.SelectedIndex & "','" & RdTreatment.SelectedIndex & "'," &
                                        "'" & Val(txtClinicID1.Text) & "','" & txtART.Text & "','" & txtOther.Text & "','" & Aid & "')", Cnndb)
                        CmdPart.ExecuteNonQuery()
                            If CDate(DaR1.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttpartcont values('" & Format(CDate(DaR1.EditValue), "yyyy/MM/dd") & "','" & RdT1.SelectedIndex & "','" & RdCon1.SelectedIndex & "','" & txtEx1.Text & "','" & Aid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaR2.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttpartcont values('" & Format(CDate(DaR2.EditValue), "yyyy/MM/dd") & "','" & RdT2.SelectedIndex & "','" & RdCon2.SelectedIndex & "','" & txtEx2.Text & "','" & Aid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaR3.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttpartcont values('" & Format(CDate(DaR3.EditValue), "yyyy/MM/dd") & "','" & RdT3.SelectedIndex & "','" & RdCon3.SelectedIndex & "','" & txtEx3.Text & "','" & Aid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaR4.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttpartcont values('" & Format(CDate(DaR4.EditValue), "yyyy/MM/dd") & "','" & RdT4.SelectedIndex & "','" & RdCon4.SelectedIndex & "','" & txtEx4.Text & "','" & Aid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                        Catch ex As Exception
                            MessageBox.Show("ទិន្នន័យអ្នកជំងឺនេះមានរួចហើយ!", "Check partner", MessageBoxButtons.OK, MessageBoxIcon.Error)
                            B = True
                            '   Exit Sub
                        End Try
                    End If




                    If Val(CboChild.Text) > 0 Then
                        Try
                            Dim Cid As Double = Pid & CboChild.Text
                        Dim CmdChild As New MySqlCommand("insert into tblapnttchild values('" & Aid & "','" & CboChild.Text & "','" & txtCage.Text & "','" & RdCsex.SelectedIndex & "','" & txtCgroup.Text.Trim & "','" & txtCHouse.Text.Trim & "','" & txtCStreet.Text & "','" & CboCvillage.Text.Replace("'", "''") & "'," &
                                                "'" & CboCcommune.Text.Replace("'", "''") & "','" & CboCdistrict.Text.Replace("'", "''") & "','" & CboCprovince.Text & "','" & txtCphone.Text & "','" & RdCvisit.SelectedIndex & "','" & Format(CDate(DaCfamily.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaCtogether.EditValue), "yyyy/MM/dd") & "'," &
                                                 "'" & RdCagreeTest.SelectedIndex & "','" & RdCresult.SelectedIndex & "','" & RdCtreatment.SelectedIndex & "','" & txtCclinicId.Text & "','" & txtCart.Text & "','" & txtCother.Text & "','" & Cid & "','" & Pid & "')", Cnndb)
                        CmdChild.ExecuteNonQuery()
                            If CDate(DaCc1.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttchildcont values('" & Format(CDate(DaCc1.EditValue), "yyyy/MM/dd") & "','" & RdCp1.SelectedIndex & "','" & RdCc1.SelectedIndex & "','" & RdCc1.Text & "','" & Cid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaCc2.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttchildcont values('" & Format(CDate(DaCc2.EditValue), "yyyy/MM/dd") & "','" & RdCp2.SelectedIndex & "','" & RdCc2.SelectedIndex & "','" & RdCc2.Text & "','" & Cid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaCc3.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttchildcont values('" & Format(CDate(DaCc3.EditValue), "yyyy/MM/dd") & "','" & RdCp3.SelectedIndex & "','" & RdCc3.SelectedIndex & "','" & RdCc3.Text & "','" & Cid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaCc4.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttchildcont values('" & Format(CDate(DaCc4.EditValue), "yyyy/MM/dd") & "','" & RdCp4.SelectedIndex & "','" & RdCc4.SelectedIndex & "','" & RdCc4.Text & "','" & Cid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaCc5.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttchildcont values('" & Format(CDate(DaCc5.EditValue), "yyyy/MM/dd") & "','" & RdCp5.SelectedIndex & "','" & RdCc5.SelectedIndex & "','" & RdCc5.Text & "','" & Cid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                            If CDate(DaCc6.Text) > CDate("01/01/2005") Then
                                Dim CmdCon As New MySqlCommand("insert into tblapnttchildcont values('" & Format(CDate(DaCc6.EditValue), "yyyy/MM/dd") & "','" & RdCp6.SelectedIndex & "','" & RdCc6.SelectedIndex & "','" & RdCc6.Text & "','" & Cid & "')", Cnndb)
                                CmdCon.ExecuteNonQuery()
                            End If
                        Catch ex As Exception
                            MessageBox.Show("ទិន្នន័យអ្នកកូនក្មេងនេះបញ្ចូលរួចហើយ!", "Check Child", MessageBoxButtons.OK, MessageBoxIcon.Error)
                            C = True
                        End Try
                    End If

                    Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblapntt','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    Cmdlog.ExecuteNonQuery()
                    If B = False And C = False Then
                        MessageBox.Show("ទិន្នន័យរក្សាទុកបានរួចរាល់...", "Save...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                        Clear()
                        Exit Sub
                    End If
                    If B = False Then
                        MessageBox.Show("The data of partner saving completed", "Save.. Partner", MessageBoxButtons.OK, MessageBoxIcon.Information)
                        Clear()
                    End If
                    If C = False Then
                        MessageBox.Show("The data of child saving completed", "Save.. child", MessageBoxButtons.OK, MessageBoxIcon.Information)
                        Clear()
                    End If
                End If
                Else
                If MessageBox.Show("តើលោកអ្នកចង់កែរតម្រូវមែនទេ ?", "Edit.....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then

                    Dim cmdSave As New MySqlCommand("Update  tblapntt set DaVisit='" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "',SexHIV='" & RdSexHIV.SelectedIndex & "',Wsex='" & RdWsex.SelectedIndex & "'," &
                                            "SexM='" & RdSexM.SelectedIndex & "',SexTran='" & RdSexTran.SelectedIndex & "',Sex4='" & RdSex4.SelectedIndex & "',Drug='" & RdDrug.SelectedIndex & "',Pill='" & RdPill.SelectedIndex & "',SexMoney='" & RdSexMoney.SelectedIndex & "',SexProvice='" & RdSexProvice.SelectedIndex & "'," &
                                            "WOut='" & RdWOut.SelectedIndex & "',Agree='" & RdAgree.SelectedIndex & "' where AsID='" & Pid & "'", Cnndb)
                    cmdSave.ExecuteNonQuery()
                    'Dim CmdDelco As New MySqlCommand("Delete from tblapnttchildcont", Cnndb)
                    'CmdDelco.ExecuteNonQuery()
                    'Dim CmdDelC As New MySqlCommand("Delete from tblapnttchild ", Cnndb)
                    'CmdDelC.ExecuteNonQuery()

                    ' MessageBox.Show("Udate Aid: " & Aid)
                    ' MessageBox.Show("Udate CboPart Text:  " & CboPartner.Text)
                    If CboPartner.Text <> "" And Aid > 0 Then
                    Dim CmdPart As New MySqlCommand("Update tblapnttpart set NumSexPart='" & txtPartnersex.Text & "',NumPin='" & txtNumDrug.Text & "',NumChildren='" & txtNumChild.Text & "',NumPart='" & CboPartner.Text & "',Age='" & txtAge.Text & "',Sex='" & RdSex.SelectedIndex & "',Grou='" & txtGroup.Text.Trim & "',House='" & txthouse.Text.Trim & "',Street='" & txtstreet.Text & "',Village='" & cbovillage.Text.Replace("'", "''") & "'," &
                                                "Commune='" & cboCommune.Text.Replace("'", "''") & "',District='" & cbodistric.Text.Replace("'", "''") & "',Province='" & cboProvince.Text & "',Phone='" & txtPhone.Text & "',RePatient='" & RdRelaPatient.SelectedIndex & "',OtherPatient='" & txtOtherRpat.Text & "',IpvHit='" & RdHid.SelectedIndex & "',IpvThreat='" & RdWan.SelectedIndex & "',IpvSex='" & Rdforce.SelectedIndex & "'," &
                                                "ProIPV='" & RdSipv.SelectedIndex & "',SupIPV='" & RdSfirst.SelectedIndex & "',RefIPV='" & RdStransfer.SelectedIndex & "',NotificationIPV='" & RdNotification.SelectedIndex & "',PatientDate='" & Format(CDate(DaNotiPartner.EditValue), "yyyy/MM/dd") & "',SeviceDate='" & Format(CDate(DaNotiCoporat.EditValue), "yyyy/MM/dd") & "',StatusHIV='" & RdAgreeTest.SelectedIndex & "',HTS='" & RdTypTest.SelectedIndex & "',Result='" & RdResult.SelectedIndex & "',RegTreat='" & RdTreatment.SelectedIndex & "'," &
                                                "ClinicID='" & Val(txtClinicID1.Text) & "',ArtNumber='" & txtART.Text & "',Other='" & txtOther.Text & "' where APID='" & Aid & "'", Cnndb)
                    CmdPart.ExecuteNonQuery()
                        If CDate(DaR1.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand(" update tblapnttpartcont set Dat='" & Format(CDate(DaR1.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdT1.SelectedIndex & "',Contact='" & RdCon1.SelectedIndex & "',Confirm='" & txtEx1.Text & "' where APID='" & Aid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaR2.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand(" update tblapnttpartcont set Dat='" & Format(CDate(DaR2.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdT2.SelectedIndex & "',Contact='" & RdCon2.SelectedIndex & "',Confirm='" & txtEx2.Text & "' where APID='" & Aid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaR3.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand(" update tblapnttpartcont set Dat='" & Format(CDate(DaR3.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdT3.SelectedIndex & "',Contact='" & RdCon3.SelectedIndex & "',Confirm='" & txtEx3.Text & "' where APID='" & Aid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaR4.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand(" update tblapnttpartcont set Dat='" & Format(CDate(DaR4.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdT4.SelectedIndex & "',Contact='" & RdCon4.SelectedIndex & "',Confirm='" & txtEx4.Text & "' where APID='" & Aid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                    End If

                    ' MessageBox.Show("Udate Cid:  " & Cid)
                    ' MessageBox.Show("Udate CboChild Text: " & CboChild.Text)
                    If CboChild.Text <> "" And Cid > 0 Then
                    Dim CmdChild As New MySqlCommand("UPdate tblapnttchild set NumChild='" & CboChild.Text & "',Age='" & txtCage.Text & "',Sex='" & RdCsex.SelectedIndex & "',Grou='" & txtCgroup.Text.Trim & "',House='" & txtCHouse.Text.Trim & "',Street='" & txtCStreet.Text & "',Village='" & CboCvillage.Text.Replace("'", "''") & "'," &
                                                "Commune='" & CboCcommune.Text.Replace("'", "''") & "',District='" & CboCdistrict.Text.Replace("'", "''") & "',Province='" & CboCprovince.Text & "',Phone='" & txtCphone.Text & "',PlanChild='" & RdCvisit.SelectedIndex & "',PatientDate='" & Format(CDate(DaCfamily.EditValue), "yyyy/MM/dd") & "',SeviceDate='" & Format(CDate(DaCtogether.EditValue), "yyyy/MM/dd") & "'," &
                                                 "StatusHIV='" & RdCagreeTest.SelectedIndex & "',Result='" & RdCresult.SelectedIndex & "',RegTreat='" & RdCtreatment.SelectedIndex & "',ClinicID='" & txtCclinicId.Text & "',ArtNumber='" & txtCart.Text & "',Other='" & txtCother.Text & "' where CAPID='" & Cid & "'", Cnndb)
                    CmdChild.ExecuteNonQuery()
                        If CDate(DaCc1.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand("Update tblapnttchildcont set Dat='" & Format(CDate(DaCc1.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdCp1.SelectedIndex & "',Contact='" & RdCc1.SelectedIndex & "',Confirm='" & RdCc1.Text & "' where CAPID='" & Cid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaCc2.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand("Update tblapnttchildcont set Dat='" & Format(CDate(DaCc2.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdCp2.SelectedIndex & "',Contact='" & RdCc2.SelectedIndex & "',Confirm='" & RdCc2.Text & "' where CAPID='" & Cid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaCc3.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand("Update tblapnttchildcont set Dat='" & Format(CDate(DaCc3.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdCp3.SelectedIndex & "',Contact='" & RdCc3.SelectedIndex & "',Confirm='" & RdCc3.Text & "' where CAPID='" & Cid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaCc4.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand("Update tblapnttchildcont set Dat='" & Format(CDate(DaCc4.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdCp4.SelectedIndex & "',Contact='" & RdCc4.SelectedIndex & "',Confirm='" & RdCc4.Text & "' where CAPID='" & Cid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaCc5.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand("Update tblapnttchildcont set Dat='" & Format(CDate(DaCc5.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdCp5.SelectedIndex & "',Contact='" & RdCc5.SelectedIndex & "',Confirm='" & RdCc5.Text & "' where CAPID='" & Cid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                        If CDate(DaCc6.Text) > CDate("01/01/2005") Then
                            Dim CmdCon As New MySqlCommand("Update tblapnttchildcont set Dat='" & Format(CDate(DaCc6.EditValue), "yyyy/MM/dd") & "',TypeContact='" & RdCp6.SelectedIndex & "',Contact='" & RdCc6.SelectedIndex & "',Confirm='" & RdCc6.Text & "' where CAPID='" & Cid & "'", Cnndb)
                            CmdCon.ExecuteNonQuery()
                        End If
                    End If
                    Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblapntt','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    Cmdlog.ExecuteNonQuery()
                    MessageBox.Show("All the data Edit completed...", "Edit...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                    Clear()
                End If
                End If
                End Sub

    Private Sub ViewData()
        'Try
        '    Dim i As Double
        '    Dim CmdSearch As New MySqlCommand("SELECT tblapntt.ClinicID, tblapntt.DaVisit, tblapntt.Agree, tblapnttpart.Age, tblapnttpart.Sex, tblapnttpart.NumPart, tblapnttpart.Result," &
        '                 " tblapnttpart.APID, tblapnttchild.NumChild, tblapnttchild.CAPID AS Cid,tblapntt.AsID,tblaart.ART FROM   tblapntt LEFT OUTER JOIN tblaart ON tblapntt.ClinicID = tblaart.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID  ORDER BY tblapntt.ClinicID, tblapnttpart.NumPart, Cid, tblapntt.DaVisit", Cnndb)

        '    'Select  a.ClinicID, a.DaVisit, a.Agree, ap.Age, ap.Sex, ap.NumPart, ap.Result,ap.APID, ac.NumChild,ac.CAPID, a.AsID,ar.ART FROM tblapntt a
        '    '                                    Left  Join tblaart ar ON a.ClinicID = ar.ClinicID 
        '    '                                    Left  Join(select distinct AsID, count(AsID) As NumPart, Age, Sex, Result, APID  from tblapnttpart group by AsID ) ap on a.AsID=ap.AsID
        '    '                                    Left  Join(select distinct APID, count(APID) As NumChild, AsID, CAPID  from tblapnttchild group by APID ) ac on a.AsID=ac.AsID
        '    '                                    order by a.ClinicID, a.DaVisit, ap.NumPart, ac.NumChild;

        '    Rdr = CmdSearch.ExecuteReader
        '    While Rdr.Read
        '        i = i + 1
        '        Dim dr As DataRow = dt.NewRow()
        '        dr(0) = i
        '        dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
        '        dr(2) = Rdr.GetValue(11).ToString
        '        dr(3) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
        '        Select Case CDec(Rdr.GetValue(2).ToString)
        '            Case 0
        '                dr(4) = True
        '            Case 1
        '                dr(4) = False
        '        End Select

        '        If Rdr.GetValue(4).ToString.Trim <> "" Then
        '            dr(5) = Val(Rdr.GetValue(3).ToString)
        '            Select Case CDec(Rdr.GetValue(4).ToString)
        '                Case 0
        '                    dr(6) = "Female"
        '                Case 1
        '                    dr(6) = "Male"
        '            End Select
        '        End If

        '        If Rdr.GetValue(5).ToString.Trim <> "" Then dr(7) = Rdr.GetValue(5).ToString
        '        If Rdr.GetValue(6).ToString.Trim <> "" Then
        '            Select Case CDec(Rdr.GetValue(6).ToString)
        '                Case 0
        '                    dr(8) = "+"
        '                Case 1
        '                    dr(8) = "-"
        '                Case 2
        '                    dr(8) = "+/-"
        '            End Select
        '        End If
        '        dr(9) = Rdr.GetValue(8).ToString.Trim
        '        dr(10) = Rdr.GetValue(10).ToString
        '        dr(11) = Rdr.GetValue(7)
        '        dr(12) = Rdr.GetValue(9).ToString
        '        dt.Rows.Add(dr)
        '    End While
        '    Rdr.Close()
        '    GridControl1.DataSource = dt
        '    '    GridView1.Columns("ClinicID").Group()
        '    ' GridView1.Columns("Date").Group()
        'Catch ex As Exception
        'End Try

        Try
            Dim i As Double
            Dim CmdSearch As New MySqlCommand("select tblapntt.ClinicID as ClinicID,tblaart.ART, tblapntt.DaVisit as DaVisit, if(tblapntt.Agree=0,'Yes','No') as AgreePNTT,if(pc.APID<>'','Partner',if(pc.CAPID<>'','Child','')) as Status, pc.Orders, if(pc.Sex=0,'Female',if(pc.Sex=1,'Male','')) as Sex, pc.Age, pc.ClinicID as Clinic_ID, pc.Artnumber as ARTnumber, if(pc.Result=0,'+',if(pc.Result=1,'-','')) as Result,
tblapntt.AsID,pc.APID,pc.CAPID FROM tblapntt 
left join tblaart ON tblapntt.ClinicID = tblaart.ClinicID 
left join(
select APID,'' as CAPID,AsID,NumPart as Orders, Sex, Age, if(ClinicID=0,'',ClinicID) as ClinicID, ArtNumber , Result from tblapnttpart   
union all
select '' as APID, CAPID,AsID, NumChild as Orders, Sex, Age, ClinicID, ArtNumber, Result from tblapnttchild) pc on pc.AsID=tblapntt.AsID
order by ClinicID, DaVisit, Status desc, Orders;", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                dr(2) = Rdr.GetValue(1).ToString
                dr(3) = Format(CDate(Rdr.GetValue(2).ToString), "dd/MM/yyyy")
                dr(4) = Rdr.GetValue(3).ToString
                dr(5) = Rdr.GetValue(4).ToString
                dr(6) = Rdr.GetValue(5).ToString
                dr(7) = Rdr.GetValue(6).ToString
                dr(8) = Rdr.GetValue(7).ToString
                dr(9) = Rdr.GetValue(8).ToString
                dr(10) = Rdr.GetValue(9).ToString
                dr(11) = Rdr.GetValue(10).ToString
                dr(12) = Rdr.GetValue(11).ToString
                dr(13) = Rdr.GetValue(12).ToString
                dr(14) = Rdr.GetValue(13).ToString
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        Catch ex As Exception

        End Try
    End Sub

    Private Sub Search()
        'MessageBox.Show("Search Pid:    " & Pid)
        Dim CmdP As New MySqlCommand("Select * from tblapntt where AsID='" & Pid & "'", Cnndb)
        Rdr = CmdP.ExecuteReader()
        While Rdr.Read
            RdSexHIV.SelectedIndex = Rdr.GetValue(2).ToString
            RdWsex.SelectedIndex = Rdr.GetValue(3).ToString
            RdSexM.SelectedIndex = Rdr.GetValue(4).ToString
            RdSexTran.SelectedIndex = Rdr.GetValue(5).ToString
            RdSex4.SelectedIndex = Rdr.GetValue(6).ToString
            RdDrug.SelectedIndex = Rdr.GetValue(7).ToString
            RdPill.SelectedIndex = Rdr.GetValue(8).ToString
            RdSexMoney.SelectedIndex = Rdr.GetValue(9).ToString
            RdSexProvice.SelectedIndex = Rdr.GetValue(10).ToString
            RdWOut.SelectedIndex = Rdr.GetValue(11).ToString
            RdAgree.SelectedIndex = Rdr.GetValue(12).ToString
        End While
        Rdr.Close()
        Dim p, d, c, v As String
        'MessageBox.Show("Search Aid: " & Aid)
        Dim CmdPart As New MySqlCommand("Select * from tblapnttpart where APID='" & Aid & "'", Cnndb)
        Rdr = CmdPart.ExecuteReader
        While Rdr.Read
            txtPartnersex.Text = Rdr.GetValue(1).ToString
            txtNumDrug.Text = Rdr.GetValue(2).ToString
            txtNumChild.Text = Rdr.GetValue(3).ToString
            CboPartner.Text = Rdr.GetValue(4).ToString
            txtAge.Text = Rdr.GetValue(5).ToString
            RdSex.SelectedIndex = Rdr.GetValue(6).ToString
            txtGroup.Text = Rdr.GetValue(7).ToString.Trim
            txthouse.Text = Rdr.GetValue(8).ToString.Trim
            txtstreet.Text = Rdr.GetValue(9).ToString.Trim
            v = Rdr.GetValue(10).ToString
            c = Rdr.GetValue(11).ToString
            d = Rdr.GetValue(12).ToString
            p = Rdr.GetValue(13).ToString
            txtPhone.Text = Rdr.GetValue(14).ToString
            RdRelaPatient.SelectedIndex = Rdr.GetValue(15).ToString
            txtOtherRpat.Text = Rdr.GetValue(16).ToString.Trim
            RdHid.SelectedIndex = Rdr.GetValue(17).ToString
            RdWan.SelectedIndex = Rdr.GetValue(18).ToString
            Rdforce.SelectedIndex = Rdr.GetValue(19).ToString
            RdSipv.SelectedIndex = Rdr.GetValue(20).ToString
            RdSfirst.SelectedIndex = Rdr.GetValue(21).ToString
            RdStransfer.SelectedIndex = Rdr.GetValue(22).ToString
            RdNotification.SelectedIndex = Rdr.GetValue(23).ToString
            DaNotiPartner.Text = CDate(Rdr.GetValue(24).ToString).Date
            DaNotiCoporat.Text = CDate(Rdr.GetValue(25).ToString).Date
            RdAgreeTest.SelectedIndex = Rdr.GetValue(26).ToString
            RdTypTest.SelectedIndex = Rdr.GetValue(27).ToString
            RdResult.SelectedIndex = Rdr.GetValue(28).ToString
            RdTreatment.SelectedIndex = Rdr.GetValue(29).ToString
            txtClinicID1.Text = Rdr.GetValue(30).ToString.Trim
            txtART.Text = Rdr.GetValue(31).ToString.Trim
            txtOther.Text = Rdr.GetValue(32).ToString.Trim
        End While
        Rdr.Close()
        cboProvince.Text = p
        cbodistric.Text = d
        cboCommune.Text = c
        cbovillage.Text = v
        Dim i As Integer = 0
        Dim CmdPcon As New MySqlCommand("select * from tblapnttpartcont where APID='" & Aid & "'", Cnndb)
        Rdr = CmdPcon.ExecuteReader
        While Rdr.Read
            i = i + 1
            If i = 1 Then
                DaR1.EditValue = CDate(Rdr.GetValue(0).ToString)
                RdT1.SelectedIndex = Rdr.GetValue(1).ToString
                RdCon1.SelectedIndex = Rdr.GetValue(2).ToString
                txtEx1.Text = Rdr.GetValue(3).ToString
            End If
            If i = 2 Then
                DaR2.EditValue = CDate(Rdr.GetValue(0).ToString)
                RdT2.SelectedIndex = Rdr.GetValue(1).ToString
                RdCon2.SelectedIndex = Rdr.GetValue(2).ToString
                txtEx2.Text = Rdr.GetValue(3).ToString
            End If
            If i = 3 Then
                DaR3.EditValue = CDate(Rdr.GetValue(0).ToString)
                RdT3.SelectedIndex = Rdr.GetValue(1).ToString
                RdCon3.SelectedIndex = Rdr.GetValue(2).ToString
                txtEx3.Text = Rdr.GetValue(3).ToString
            End If
            If i = 4 Then
                DaR4.EditValue = CDate(Rdr.GetValue(0).ToString)
                RdT4.SelectedIndex = Rdr.GetValue(1).ToString
                RdCon4.SelectedIndex = Rdr.GetValue(2).ToString
                txtEx4.Text = Rdr.GetValue(3).ToString
            End If
        End While
        Rdr.Close()
        'MessageBox.Show("Search Cid: " & Cid)
        Dim CmdC As New MySqlCommand("Select * from tblapnttchild where CAPID='" & Cid & "'", Cnndb)
        Rdr = CmdC.ExecuteReader
        While Rdr.Read
            CboChild.Text = Rdr.GetValue(1).ToString
            txtCage.Text = Rdr.GetValue(2).ToString
            RdCsex.SelectedIndex = Rdr.GetValue(3).ToString
            txtCgroup.Text = Rdr.GetValue(4).ToString.Trim
            txtCHouse.Text = Rdr.GetValue(5).ToString.Trim
            txtCStreet.Text = Rdr.GetValue(6).ToString.Trim
            v = Rdr.GetValue(7).ToString
            c = Rdr.GetValue(8).ToString
            d = Rdr.GetValue(9).ToString
            p = Rdr.GetValue(10).ToString
            txtCphone.Text = Rdr.GetValue(11).ToString
            RdCvisit.SelectedIndex = Rdr.GetValue(12).ToString
            DaCfamily.Text = CDate(Rdr.GetValue(13).ToString).Date
            DaCtogether.Text = CDate(Rdr.GetValue(14).ToString).Date
            RdCagreeTest.SelectedIndex = Rdr.GetValue(15).ToString
            RdCresult.SelectedIndex = Rdr.GetValue(16).ToString
            RdCtreatment.SelectedIndex = Rdr.GetValue(17).ToString
            txtCclinicId.Text = Rdr.GetValue(18).ToString
            txtCart.Text = Rdr.GetValue(19).ToString
            txtCother.Text = Rdr.GetValue(20).ToString
        End While
        Rdr.Close()
        If Cid = 0 Then
            p = ""
            d = ""
            c = ""
            v = ""
        End If
        CboCprovince.Text = p
        CboCdistrict.Text = d
        CboCcommune.Text = c
        CboCvillage.Text = v
        i = 0
        Dim Cmdcc As New MySqlCommand("Select * from tblapnttchildcont where  CAPID='" & Cid & "'", Cnndb)
        Rdr = Cmdcc.ExecuteReader
        While Rdr.Read
            i = i + 1
            Select Case i
                Case 1
                    DaCc1.EditValue = CDate(Rdr.GetValue(0).ToString)
                    RdCp1.SelectedIndex = Rdr.GetValue(1).ToString
                    RdCc1.SelectedIndex = Rdr.GetValue(2).ToString
                    txtCcon1.Text = Rdr.GetValue(3).ToString
                Case 2
                    DaCc2.EditValue = CDate(Rdr.GetValue(0).ToString)
                    RdCp2.SelectedIndex = Rdr.GetValue(1).ToString
                    RdCc2.SelectedIndex = Rdr.GetValue(2).ToString
                    txtCcon2.Text = Rdr.GetValue(3).ToString
                Case 3
                    DaCc3.EditValue = CDate(Rdr.GetValue(0).ToString)
                    RdCp3.SelectedIndex = Rdr.GetValue(1).ToString
                    RdCc3.SelectedIndex = Rdr.GetValue(2).ToString
                    txtCcon3.Text = Rdr.GetValue(3).ToString
                Case 4
                    DaCc4.EditValue = CDate(Rdr.GetValue(0).ToString)
                    RdCp4.SelectedIndex = Rdr.GetValue(1).ToString
                    RdCc4.SelectedIndex = Rdr.GetValue(2).ToString
                    txtCcon4.Text = Rdr.GetValue(3).ToString
                Case 5
                    DaCc5.EditValue = CDate(Rdr.GetValue(0).ToString)
                    RdCp5.SelectedIndex = Rdr.GetValue(1).ToString
                    RdCc5.SelectedIndex = Rdr.GetValue(2).ToString
                    txtCcon5.Text = Rdr.GetValue(3).ToString
                Case 6
                    DaCc6.EditValue = CDate(Rdr.GetValue(0).ToString)
                    RdCp6.SelectedIndex = Rdr.GetValue(1).ToString
                    RdCc6.SelectedIndex = Rdr.GetValue(2).ToString
                    txtCcon6.Text = Rdr.GetValue(3).ToString
            End Select
        End While
        Rdr.Close()
    End Sub

    Private Sub Del()
        'If d = True Then
        '    Dim valuedelete As String = ""
        '    MessageBox.Show("Pid " & Pid & "   Aid " & Aid & "   Cid " & Cid)
        '    Exit Sub
        'End If
        Dim p, c As Boolean
        If MessageBox.Show("Are you sure do you want to delete ?", "Delete...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = vbYes Then
            If Cid <> 0 Then
                Dim CmdDelco As New MySqlCommand("Delete from tblapnttchildcont where CAPID='" & Cid & "'", Cnndb)
                CmdDelco.ExecuteNonQuery()
                Dim CmdDelC As New MySqlCommand("Delete from tblapnttchild where CAPID='" & Cid & "'", Cnndb)
                CmdDelC.ExecuteNonQuery()
                MessageBox.Show("Deleted.....", "Child was deleted", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If
            If Aid <> 0 Then
                Dim CmdDelpco As New MySqlCommand("Delete from tblapnttpartcont where APID='" & Aid & "'", Cnndb)
                Dim CmdDelP As New MySqlCommand("Delete from tblapnttpart where APID='" & Aid & "'", Cnndb)
                CmdDelP.ExecuteNonQuery()
                MessageBox.Show("Deleted.....", "Partner was deleted", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If

            Dim cmdSearchPart As New MySqlCommand("Select * from tblapnttpart where AsID='" & Pid & "'", Cnndb)
            Rdr = cmdSearchPart.ExecuteReader()
            If Rdr.Read Then
                p = True
            Else
                p = False
            End If
            Rdr.Close()

            Dim cmdSearchChild As New MySqlCommand("Select * from tblapnttchild where AsID='" & Pid & "'", Cnndb)
            Rdr = cmdSearchChild.ExecuteReader()
            If Rdr.Read Then
                c = True
            Else
                c = False
            End If
            Rdr.Close()

            If p = False And c = False Then
                Dim CmdDel As New MySqlCommand("Delete from tblapntt where AsID='" & Pid & "'", Cnndb)
                CmdDel.ExecuteNonQuery()
                'MessageBox.Show("Deleted.....", "PNTT was deleted", MessageBoxButtons.OK, MessageBoxIcon.Information)
            End If

            ' MessageBox.Show("Deleted.....", "Deleted PNTT", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblapntt','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
            End If

    End Sub

#End Region
    Private Sub cboProvince_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboProvince.SelectedIndexChanged
        cbodistric.Properties.Items.Clear()
        cbodistric.SelectedIndex = -1
        cboCommune.SelectedIndex = -1
        cbovillage.SelectedIndex = -1
        '    txtstreet.Text = ""
        '   txthouse.Text = ""
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

    Private Sub cbocProvince_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboCprovince.SelectedIndexChanged
        CboCdistrict.Properties.Items.Clear()
        CboCdistrict.SelectedIndex = -1
        CboCcommune.SelectedIndex = -1
        CboCvillage.SelectedIndex = -1
        '  txtCStreet.Text = ""
        '  txtCHouse.Text = ""
        Dim CmdSearch As New MySqlCommand("Select      tblDistrict.DistrictENg FROM    tblProvince INNER JOIN    tblDistrict On  tblProvince.pid =  tblDistrict.pid WHERE     ( tblProvince.ProvinceENg = '" & CboCprovince.Text & "') ORDER BY  tblDistrict.did", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            CboCdistrict.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub cbocCommune_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboCcommune.SelectedIndexChanged
        CboCvillage.Properties.Items.Clear()
        CboCvillage.SelectedIndex = -1
        Dim Cmdsearch As New MySqlCommand("SELECT    tblVillage.VillageEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did INNER JOIN    tblVillage ON  tblCommune.cid =  tblVillage.cid WHERE     ( tblProvince.ProvinceENg = '" & CboCprovince.Text & "') AND ( tblDistrict.DistrictENg = '" & CboCdistrict.Text.Replace("'", "''") & "') AND ( tblCommune.CommuneEN = '" & CboCcommune.Text.Replace("'", "''") & "') ORDER BY  tblVillage.vid", Cnndb)
        Rdr = Cmdsearch.ExecuteReader
        While Rdr.Read
            CboCvillage.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub

    Private Sub cbocdistrict_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboCdistrict.SelectedIndexChanged
        CboCcommune.Properties.Items.Clear()
        CboCcommune.SelectedIndex = -1
        Dim CmdSearch As New MySqlCommand("SELECT   tblCommune.CommuneEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did WHERE     ( tblProvince.ProvinceENg = '" & CboCprovince.Text & "') AND ( tblDistrict.DistrictENg = '" & CboCdistrict.Text.Replace("'", "''") & "') ORDER BY  tblCommune.cid", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            CboCcommune.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub

    Private Sub RdAgree_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdAgree.SelectedIndexChanged
        If RdAgree.SelectedIndex = 1 Or RdAgree.SelectedIndex = -1 Then
            CboPartner.Enabled = False
            txtAge.Enabled = False
            RdSex.Enabled = False
            txtGroup.Enabled = False
            txthouse.Enabled = False
            txtstreet.Enabled = False
            cboProvince.Enabled = False
            txtPhone.Enabled = False
            RdRelaPatient.Enabled = False
            RdHid.Enabled = False
            RdWan.Enabled = False
            Rdforce.Enabled = False
            DaNotiPartner.Enabled = False
            DaNotiCoporat.Enabled = False
            DaR1.Enabled = False
            RdT1.Enabled = False
            RdCon1.Enabled = False
            txtEx1.Enabled = False
            DaR2.Enabled = False
            DaR3.Enabled = False
            DaR4.Enabled = False
            RdT2.Enabled = False
            RdT3.Enabled = False
            RdT4.Enabled = False
            RdCon2.Enabled = False
            RdCon3.Enabled = False
            RdCon4.Enabled = False
            txtEx2.Enabled = False
            txtEx3.Enabled = False
            txtEx4.Enabled = False
            RdAgreeTest.Enabled = False
            CboChild.Enabled = False
            btnAdd.Enabled = False
            txtCage.Enabled = False
            RdCsex.Enabled = False
            txtCgroup.Enabled = False
            txtCHouse.Enabled = False
            txtCStreet.Enabled = False
            CboCprovince.Enabled = False
            txtCphone.Enabled = False
            DaCc1.Enabled = False
            DaCc2.Enabled = False
            DaCc3.Enabled = False
            DaCc4.Enabled = False
            DaCc5.Enabled = False
            DaCc6.Enabled = False
            RdCp1.Enabled = False
            RdCp2.Enabled = False
            RdCp3.Enabled = False
            RdCp4.Enabled = False
            RdCp5.Enabled = False
            RdCp6.Enabled = False
            RdCc1.Enabled = False
            RdCc2.Enabled = False
            RdCc3.Enabled = False
            RdCc4.Enabled = False
            RdCc5.Enabled = False
            RdCc6.Enabled = False
            txtCcon1.Enabled = False
            txtCcon2.Enabled = False
            txtCcon3.Enabled = False
            txtCcon4.Enabled = False
            txtCcon5.Enabled = False
            txtCcon6.Enabled = False
            RdCagreeTest.Enabled = False
            CboCdistrict.Enabled = False
            CboCcommune.Enabled = False
            CboCvillage.Enabled = False
            cbodistric.Enabled = False
            cboCommune.Enabled = False
            cbovillage.Enabled = False

            txtAge.Text = ""
            RdSex.SelectedIndex = -1
            txtGroup.Text = ""
            txthouse.Text = ""
            txtstreet.Text = ""
            cboProvince.SelectedIndex = -1
            txtPhone.Text = ""
            RdRelaPatient.SelectedIndex = -1
            RdHid.SelectedIndex = -1
            RdWan.SelectedIndex = -1
            Rdforce.SelectedIndex = -1
            DaNotiPartner.Text = "01/01/1900"
            DaNotiCoporat.Text = "01/01/1900"
            DaR1.Text = "01/01/1900"
            RdT1.SelectedIndex = -1
            RdCon1.SelectedIndex = -1
            txtEx1.Text = ""
            DaR2.Text = "01/01/1900"
            DaR3.Text = "01/01/1900"
            DaR4.Text = "01/01/1900"
            RdT2.SelectedIndex = -1
            RdT3.SelectedIndex = -1
            RdT4.SelectedIndex = -1
            RdCon2.SelectedIndex = -1
            RdCon3.SelectedIndex = -1
            RdCon4.SelectedIndex = -1
            txtEx2.Text = ""
            txtEx3.Text = ""
            txtEx4.Text = ""
            RdAgreeTest.SelectedIndex = -1
            RdResult.SelectedIndex = -1
            CboChild.SelectedIndex = -1
            txtCage.Text = ""
            RdCsex.SelectedIndex = -1
            txtCgroup.Text = ""
            txtCHouse.Text = ""
            txtCStreet.Text = ""
            CboCprovince.SelectedIndex = -1
            txtCphone.Text = ""
            DaCc1.Text = "01/01/1900"
            DaCc2.Text = "01/01/1900"
            DaCc3.Text = "01/01/1900"
            DaCc4.Text = "01/01/1900"
            DaCc5.Text = "01/01/1900"
            DaCc6.Text = "01/01/1900"
            RdCp1.SelectedIndex = -1
            RdCp2.SelectedIndex = -1
            RdCp3.SelectedIndex = -1
            RdCp4.SelectedIndex = -1
            RdCp5.SelectedIndex = -1
            RdCp6.SelectedIndex = -1
            RdCc1.SelectedIndex = -1
            RdCc2.SelectedIndex = -1
            RdCc3.SelectedIndex = -1
            RdCc4.SelectedIndex = -1
            RdCc5.SelectedIndex = -1
            RdCc6.SelectedIndex = -1
            txtCcon1.Text = ""
            txtCcon2.Text = ""
            txtCcon3.Text = ""
            txtCcon4.Text = ""
            txtCcon5.Text = ""
            txtCcon6.Text = ""
            RdCagreeTest.SelectedIndex = -1
            RdCresult.SelectedIndex = -1
            txtPartnersex.Text = ""
            txtNumDrug.Text = ""
            txtNumChild.Text = ""
            RdNotification.Enabled = False
            CboPartner.SelectedIndex = -1
            txtPartnersex.Enabled = False
            txtNumDrug.Enabled = False
            txtNumChild.Enabled = False
        ElseIf RdAgree.SelectedIndex = 0 Then
            CboPartner.Enabled = True
            CboChild.Enabled = True
            txtPartnersex.Enabled = True
            txtNumDrug.Enabled = True
            txtNumChild.Enabled = True
            '  RdNotification.Enabled = True
        End If
    End Sub

    Private Sub RdAgreeTest_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdAgreeTest.SelectedIndexChanged
        txtClinicID1.Enabled = False
        txtART.Enabled = False
        txtART.Text = ""
        txtClinicID1.Text = ""
        RdTypTest.Enabled = False
        txtOther.Enabled = False
        txtOther.Text = ""
        RdTypTest.SelectedIndex = -1
        If RdAgreeTest.SelectedIndex = 0 Then
            txtClinicID1.Enabled = True
            txtART.Enabled = True
        ElseIf RdAgreeTest.SelectedIndex = 2 Then
            RdTypTest.Enabled = True
        ElseIf RdAgreeTest.SelectedIndex = 3 Then
            txtOther.Enabled = True
        End If
    End Sub

    Private Sub tsbClear_Click(sender As Object, e As EventArgs) Handles tsbClear.Click
        Clear()
    End Sub

    Private Sub RdCagreeTest_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdCagreeTest.SelectedIndexChanged
        txtCclinicId.Enabled = False
        txtCart.Enabled = False
        txtCclinicId.Text = ""
        txtCart.Text = ""
        RdCresult.Enabled = False
        txtCother.Enabled = False
        txtCother.Text = ""
        RdCresult.SelectedIndex = -1
        If RdCagreeTest.SelectedIndex = 0 Then
            txtCclinicId.Enabled = True
            txtCart.Enabled = True
        ElseIf RdCagreeTest.SelectedIndex = 2 Then
            RdCresult.Enabled = True
        ElseIf RdCagreeTest.SelectedIndex = 3 Then
            txtCother.Enabled = True
        End If
    End Sub

    Private Sub tsbClear1_Click(sender As Object, e As EventArgs) Handles tsbClear1.Click
        Clear()
    End Sub

    Private Sub CboPartner_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboPartner.SelectedIndexChanged
        RdSipv.Enabled = False
        RdSfirst.Enabled = False
        RdStransfer.Enabled = False
        RdNotification.Enabled = False

        If CboPartner.SelectedIndex <> -1 Then
            EnablePartnerForm()
        End If

    End Sub
    Private Sub EnablePartnerForm()
        cbodistric.Enabled = True
        cboCommune.Enabled = True
        cbovillage.Enabled = True
        txtAge.Enabled = True
        RdSex.Enabled = True
        txtGroup.Enabled = True
        txthouse.Enabled = True
        txtstreet.Enabled = True
        cboProvince.Enabled = True
        txtPhone.Enabled = True
        RdRelaPatient.Enabled = True
        RdHid.Enabled = True
        RdWan.Enabled = True
        Rdforce.Enabled = True
        DaR1.Enabled = True
        RdT1.Enabled = True
        RdCon1.Enabled = True
        txtEx1.Enabled = True
        DaR2.Enabled = True
        DaR3.Enabled = True
        DaR4.Enabled = True
        RdT2.Enabled = True
        RdT3.Enabled = True
        RdT4.Enabled = True
        RdCon2.Enabled = True
        RdCon3.Enabled = True
        RdCon4.Enabled = True
        txtEx2.Enabled = True
        txtEx3.Enabled = True
        txtEx4.Enabled = True
        RdAgreeTest.Enabled = True
        RdNotification.Enabled = True
        RdSipv.Enabled = True
        RdSfirst.Enabled = True
        RdStransfer.Enabled = True
        'CboChild.Enabled = True
    End Sub
    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        If Len(txtClinicID.Text) <= 6 And CDec(txtClinicID.Text) <> 0 And tsbDelete.Enabled = False Then
            txtClinicID.Text = Format(Val(txtClinicID.Text), "000000")
            CheckPat()
        End If
    End Sub

    Private Sub DaVisit_Leave(sender As Object, e As EventArgs) Handles DaVisit.Leave
        If fvdate = CDate("01/01/1900") Or CDate(DaVisit.EditValue) = CDate("01/01/1900") Then Exit Sub
        If CDate(DaVisit.EditValue).Date < fvdate.Date Then
            MessageBox.Show("Invalid Date Adult initial Visit greater then Date PNTT", "Check date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaVisit.Focus()
            Exit Sub
        End If
        RdAgree.Enabled = True
        RdAgree.Enabled = True
        RdSexHIV.Enabled = True
        RdWsex.Enabled = True
        RdSexM.Enabled = True
        RdSexTran.Enabled = True
        RdSex4.Enabled = True
        RdDrug.Enabled = True
        RdPill.Enabled = True
        RdSexMoney.Enabled = True
        RdSexProvice.Enabled = True
        RdWOut.Enabled = True
        RdWsex.Enabled = True
        Dim Pid As Double = txtClinicID.Text & Format(CDate(DaVisit.Text), "ddMMyy")
        Dim CmdP As New MySqlCommand("Select * from tblapntt where AsID='" & Pid & "'", Cnndb)
        Rdr = CmdP.ExecuteReader()
        While Rdr.Read
            RdSexHIV.SelectedIndex = Rdr.GetValue(2).ToString
            RdWsex.SelectedIndex = Rdr.GetValue(3).ToString
            RdSexM.SelectedIndex = Rdr.GetValue(4).ToString
            RdSexTran.SelectedIndex = Rdr.GetValue(5).ToString
            RdSex4.SelectedIndex = Rdr.GetValue(6).ToString
            RdDrug.SelectedIndex = Rdr.GetValue(7).ToString
            RdPill.SelectedIndex = Rdr.GetValue(8).ToString
            RdSexMoney.SelectedIndex = Rdr.GetValue(9).ToString
            RdSexProvice.SelectedIndex = Rdr.GetValue(10).ToString
            RdWOut.SelectedIndex = Rdr.GetValue(11).ToString
        End While
        Rdr.Close()
    End Sub

    Private Sub CboChild_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboChild.SelectedIndexChanged
        RdCvisit.Enabled = False
        If CboChild.SelectedIndex <> -1 Then
            EnableChildForm()
        End If
    End Sub

    Private Sub EnableChildForm()
        'btnAdd.Enabled = True
        btnAdd.Enabled = True
        txtCage.Enabled = True
        RdCsex.Enabled = True
        txtCgroup.Enabled = True
        txtCHouse.Enabled = True
        txtCStreet.Enabled = True
        CboCprovince.Enabled = True
        txtCphone.Enabled = True
        DaCc1.Enabled = True
        DaCc2.Enabled = True
        DaCc3.Enabled = True
        DaCc4.Enabled = True
        DaCc5.Enabled = True
        DaCc6.Enabled = True
        RdCp1.Enabled = True
        RdCp2.Enabled = True
        RdCp3.Enabled = True
        RdCp4.Enabled = True
        RdCp5.Enabled = True
        RdCp6.Enabled = True
        RdCc1.Enabled = True
        RdCc2.Enabled = True
        RdCc3.Enabled = True
        RdCc4.Enabled = True
        RdCc5.Enabled = True
        RdCc6.Enabled = True
        txtCcon1.Enabled = True
        txtCcon2.Enabled = True
        txtCcon3.Enabled = True
        txtCcon4.Enabled = True
        txtCcon5.Enabled = True
        txtCcon6.Enabled = True
        RdCagreeTest.Enabled = True
        'ChkChiv.Enabled = True
        'ChkCother.Enabled = True
        CboCdistrict.Enabled = True
        CboCcommune.Enabled = True
        CboCvillage.Enabled = True
        RdCvisit.Enabled = True
    End Sub
    Private Sub RdRelaPatient_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdRelaPatient.SelectedIndexChanged
        If RdRelaPatient.SelectedIndex = 4 Then
            txtOtherRpat.Enabled = True
        Else
            txtOtherRpat.Enabled = False
            txtOtherRpat.Text = ""
        End If
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub

    Private Sub tsbSave1_Click(sender As Object, e As EventArgs) Handles tsbSave1.Click
        Save()
    End Sub

    Private Sub DaVisit_KeyDown(sender As Object, e As KeyEventArgs) Handles DaVisit.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
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
        Del()
    End Sub

    Private Sub tsbDelete1_Click(sender As Object, e As EventArgs) Handles tsbDelete1.Click
        Del()
    End Sub
    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        'Clear()
        'RdSexHIV.Enabled = True
        'RdWsex.Enabled = True
        'RdSexM.Enabled = True
        'RdSexTran.Enabled = True
        'RdSex4.Enabled = True
        'RdDrug.Enabled = True
        'RdPill.Enabled = True
        'RdSexMoney.Enabled = True
        'RdSexProvice.Enabled = True
        'RdWOut.Enabled = True
        ''RdAgree.Enabled = True
        'tsbDelete.Enabled = True
        'tsbDelete1.Enabled = True
        'txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        'txtClinicID.Enabled = False
        'If txtClinicID.Text = "" Then Exit Sub
        'TxtARTnum.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ART Number")
        'DaVisit.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date")
        ''DaVisit.Focus()
        'Try
        '    txtAge.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Age Partner")
        '    Select Case GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex")
        '        Case "Female"
        '            RdSex.SelectedIndex = 0
        '        Case Else
        '            RdSex.SelectedIndex = 1
        '    End Select
        '    DaVisit.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date")

        'Catch ex As Exception
        'End Try

        'CboPartner.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Partner").ToString.Trim
        ''MessageBox.Show("Part DataGrid: " & GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Partner").ToString)
        ''MessageBox.Show("CboPart text: " & CboPartner.Text)
        'Pid = If(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Asid").ToString = "", 0, CDbl(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Asid")))
        '' MessageBox.Show("Pid: " & Pid)
        'Aid = If(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Apid").ToString.Trim = "", 0, CDbl(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Apid")))
        '' MessageBox.Show("Aid: " & Aid)
        'If GridView1.GetRowCellValue(hitInfo.RowHandle(), "Agree PNTT") = True Then
        '    RdAgree.SelectedIndex = 0
        'Else
        '    RdAgree.SelectedIndex = 1
        'End If
        ''Try
        'CboChild.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Child")
        '' MessageBox.Show("Child DataGrid: " & GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Child").ToString)
        '' MessageBox.Show("CboChild text: " & CboChild.Text)
        ''Catch ex As Exception
        ''End Try
        'Cid = If(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Cid").ToString = "", 0, CDbl(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Cid")))
        '' MessageBox.Show("Cid: " & Cid)
        'XtraTabControl1.SelectedTabPageIndex = 1

        'Search()

        ''CboPartner.Enabled = False
        ''CboChild.Enabled = False
        ' Sithorn...................................................
        Clear()
        RdSexHIV.Enabled = True
        RdWsex.Enabled = True
        RdSexM.Enabled = True
        RdSexTran.Enabled = True
        RdSex4.Enabled = True
        RdDrug.Enabled = True
        RdPill.Enabled = True
        RdSexMoney.Enabled = True
        RdSexProvice.Enabled = True
        RdWOut.Enabled = True
        ''RdAgree.Enabled = True
        tsbDelete.Enabled = True
        tsbDelete1.Enabled = True
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        txtClinicID.Enabled = False
        If txtClinicID.Text = "" Then Exit Sub
        TxtARTnum.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ART Number")
        DaVisit.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date")
        ''DaVisit.Focus()
        'Try
        '    txtAge.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Age")
        '    Select Case GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex")
        '        Case "Female"
        '            RdSex.SelectedIndex = 0
        '        Case Else
        '            RdSex.SelectedIndex = 1
        '    End Select
        '    DaVisit.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date")

        'Catch ex As Exception
        'End Try

        'CboPartner.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Partner").ToString.Trim
        'MessageBox.Show("Part DataGrid: " & GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Partner").ToString)
        'MessageBox.Show("CboPart text: " & CboPartner.Text)
        Pid = If(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Asid").ToString = "", 0, CDbl(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Asid")))
        'MessageBox.Show("Pid: " & Pid)
        Aid = If(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Apid").ToString.Trim = "", 0, CDbl(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Apid")))
        'MessageBox.Show("Aid: " & Aid)
        'If GridView1.GetRowCellValue(hitInfo.RowHandle(), "Agree PNTT") = "Yes" Then
        '    RdAgree.SelectedIndex = 0
        'Else
        '    RdAgree.SelectedIndex = 1
        'End If
        'Try
        'CboChild.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Child")
        ' MessageBox.Show("Child DataGrid: " & GridView1.GetRowCellValue(hitInfo.RowHandle(), "No. Child").ToString)
        ' MessageBox.Show("CboChild text: " & CboChild.Text)
        'Catch ex As Exception
        'End Try
        Cid = If(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Cid").ToString = "", 0, CDbl(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Cid")))
        'MessageBox.Show("Cid: " & Cid)
        XtraTabControl1.SelectedTabPageIndex = 1

        Search()
        CboPartner.Enabled = False
        EnablePartnerForm()
        CboChild.Enabled = False
        EnableChildForm()
        ' Sithorn...................................................
    End Sub

    Private Sub RdNotification_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdNotification.SelectedIndexChanged
        DaNotiPartner.Enabled = False
        DaNotiCoporat.Enabled = False
        If RdNotification.SelectedIndex = 3 Then
            DaNotiPartner.Enabled = True
        ElseIf RdNotification.SelectedIndex = 4 Then
            DaNotiCoporat.Enabled = True
        End If
    End Sub

    Private Sub RdTypTest_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTypTest.SelectedIndexChanged
        RdResult.Enabled = False
        RdResult.SelectedIndex = -1
        If RdTypTest.SelectedIndex <> -1 Then
            RdResult.Enabled = True
        End If
    End Sub

    Private Sub RdResult_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdResult.SelectedIndexChanged
        RdTreatment.Enabled = False
        RdTreatment.SelectedIndex = -1
        If RdResult.SelectedIndex = 0 Then
            RdTreatment.Enabled = True
        End If
    End Sub

    Private Sub RdCvisit_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdCvisit.SelectedIndexChanged
        DaCfamily.Enabled = False
        DaCtogether.Enabled = False
        If RdCvisit.SelectedIndex = 2 Then
            DaCfamily.Enabled = True
        ElseIf RdCvisit.SelectedIndex = 3 Then
            DaCtogether.Enabled = True
        End If
    End Sub

    Private Sub RdCresult_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdCresult.SelectedIndexChanged
        RdCtreatment.Enabled = False
        RdCtreatment.SelectedIndex = -1
        If RdCresult.SelectedIndex = 0 Then
            RdCtreatment.Enabled = True
        End If
    End Sub

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

    End Sub

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub

    Private Sub tscView_Click(sender As Object, e As EventArgs) Handles tscView.Click

    End Sub

    Private Sub DaVisit_EditValueChanged(sender As Object, e As EventArgs) Handles DaVisit.EditValueChanged

    End Sub

    Private Sub txtClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtClinicID.EditValueChanged

    End Sub



    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
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
            'Try
            '    Dim i As Double
            '    Dim CmdSearch As New MySqlCommand("SELECT     tblapntt.ClinicID, tblapntt.DaVisit, tblapntt.Agree, tblapnttpart.Age, tblapnttpart.Sex, tblapnttpart.NumPart, tblapnttpart.Result," &
            '             " tblapnttpart.APID, tblapnttchild.NumChild, tblapnttchild.CAPID AS Cid,tblapntt.AsID,tblaart.ART FROM   tblapntt LEFT OUTER JOIN tblaart ON tblapntt.ClinicID = tblaart.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID where tblapntt.ClinicID='" & tspClinicID.Text & "' ORDER BY tblapnttpart.NumPart, Cid, tblapntt.DaVisit", Cnndb)
            '    Rdr = CmdSearch.ExecuteReader
            '    While Rdr.Read
            '        i = i + 1
            '        Dim dr As DataRow = dt.NewRow()
            '        dr(0) = i
            '        dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
            '        dr(2) = Rdr.GetValue(11).ToString
            '        dr(3) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
            '        Select Case CDec(Rdr.GetValue(2).ToString)
            '            Case 0
            '                dr(4) = True
            '            Case 1
            '                dr(4) = False
            '        End Select

            '        If Rdr.GetValue(4).ToString.Trim <> "" Then
            '            dr(5) = Val(Rdr.GetValue(3).ToString)
            '            Select Case CDec(Rdr.GetValue(4).ToString)
            '                Case 0
            '                    dr(6) = "Female"
            '                Case 1
            '                    dr(6) = "Male"
            '            End Select
            '        End If

            '        If Rdr.GetValue(5).ToString.Trim <> "" Then dr(7) = Rdr.GetValue(5).ToString
            '        If Rdr.GetValue(6).ToString.Trim <> "" Then
            '            Select Case CDec(Rdr.GetValue(6).ToString)
            '                Case 0
            '                    dr(8) = "+"
            '                Case 1
            '                    dr(8) = "-"
            '                Case 2
            '                    dr(8) = "+/-"
            '            End Select
            '        End If
            '        dr(9) = Rdr.GetValue(8).ToString.Trim
            '        dr(10) = Rdr.GetValue(10).ToString
            '        dr(11) = Rdr.GetValue(7)
            '        dr(12) = Rdr.GetValue(9).ToString
            '        dt.Rows.Add(dr)
            '    End While
            '    Rdr.Close()
            '    GridControl1.DataSource = dt
            '    ' GridView1.Columns("ClinicID").Group()
            '    'GridView1.Columns("Date").Group()
            'Catch ex As Exception
            'End Try
            Try
                Dim i As Double
                Dim CmdSearch As New MySqlCommand("select tblapntt.ClinicID as ClinicID,tblaart.ART, tblapntt.DaVisit as DaVisit, if(tblapntt.Agree=0,'Yes','No') as AgreePNTT,if(pc.APID<>'','Partner',if(pc.CAPID<>'','Child','')) as Status, pc.Orders, if(pc.Sex=0,'Female',if(pc.Sex=1,'Male','')) as Sex, pc.Age, pc.ClinicID as Clinic_ID, pc.Artnumber as ARTnumber, if(pc.Result=0,'+',if(pc.Result=1,'-','')) as Result,
tblapntt.AsID,pc.APID,pc.CAPID FROM tblapntt 
left join tblaart ON tblapntt.ClinicID = tblaart.ClinicID 
left join(
select APID,'' as CAPID,AsID,NumPart as Orders, Sex, Age, if(ClinicID=0,'',ClinicID) as ClinicID, ArtNumber , Result from tblapnttpart   
union all
select '' as APID, CAPID,AsID, NumChild as Orders, Sex, Age, ClinicID, ArtNumber, Result from tblapnttchild) pc on pc.AsID=tblapntt.AsID
where tblapntt.ClinicID='" & tspClinicID.Text & "'
order by ClinicID, DaVisit, Status desc, Orders;", Cnndb)
                '  '" & tspClinicID.Text & "'
                Rdr = CmdSearch.ExecuteReader
                While Rdr.Read
                    i = i + 1
                    Dim dr As DataRow = dt.NewRow()
                    dr(0) = i
                    dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                    dr(2) = Rdr.GetValue(1).ToString
                    dr(3) = Format(CDate(Rdr.GetValue(2).ToString), "dd/MM/yyyy")
                    dr(4) = Rdr.GetValue(3).ToString
                    dr(5) = Rdr.GetValue(4).ToString
                    dr(6) = Rdr.GetValue(5).ToString
                    dr(7) = Rdr.GetValue(6).ToString
                    dr(8) = Rdr.GetValue(7).ToString
                    dr(9) = Rdr.GetValue(8).ToString
                    dr(10) = Rdr.GetValue(9).ToString
                    dr(11) = Rdr.GetValue(10).ToString
                    dr(12) = Rdr.GetValue(11).ToString
                    dr(13) = Rdr.GetValue(12).ToString
                    dr(14) = Rdr.GetValue(13).ToString
                    dt.Rows.Add(dr)
                End While
                Rdr.Close()
                GridControl1.DataSource = dt
            Catch ex As Exception

            End Try
        End If
    End Sub



    Private Sub txtPartnersex_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPartnersex.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtNumDrug_KeyDown(sender As Object, e As KeyEventArgs) Handles txtNumDrug.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub



    Private Sub txtNumChild_KeyDown(sender As Object, e As KeyEventArgs) Handles txtNumChild.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtPartnersex_Leave(sender As Object, e As EventArgs) Handles txtPartnersex.Leave
        Dim Tindex As Integer = 0
        If txtPartnersex.Text <> "" Then
            CboPartner.Properties.Items.Clear()
            CboPartner.Properties.Items.Add("")
            For index As Integer = 1 To CInt(txtPartnersex.Text)
                CboPartner.Properties.Items.Add(index)
            Next
        End If
        If txtNumDrug.Text <> "" And txtPartnersex.Text <> "" Then
            CboPartner.Properties.Items.Clear()
            CboPartner.Properties.Items.Add("")
            Tindex = CInt(txtNumDrug.Text) + CInt(txtPartnersex.Text)
            For index As Integer = 1 To Tindex
                CboPartner.Properties.Items.Add(index)
            Next
        End If
    End Sub
    Private Sub txtNumChild_Leave(sender As Object, e As EventArgs) Handles txtNumChild.Leave
        If txtNumChild.Text <> "" Then
            CboChild.Properties.Items.Clear()
            CboChild.Properties.Items.Add("")
            For index As Integer = 1 To CInt(txtNumChild.Text)
                CboChild.Properties.Items.Add(index)
            Next
        End If
    End Sub

    Private Sub txtNumDrug_Leave(sender As Object, e As EventArgs) Handles txtNumDrug.Leave
        Dim Tindex As Integer = 0
        If txtNumDrug.Text <> "" Then
            CboPartner.Properties.Items.Clear()
            CboPartner.Properties.Items.Add("")
            For index As Integer = 1 To CInt(txtNumDrug.Text)
                CboPartner.Properties.Items.Add(index)
            Next
        End If
        If txtNumDrug.Text <> "" And txtPartnersex.Text <> "" Then
            CboPartner.Properties.Items.Clear()
            CboPartner.Properties.Items.Add("")
            Tindex = CInt(txtNumDrug.Text) + CInt(txtPartnersex.Text)
            For index As Integer = 1 To Tindex
                CboPartner.Properties.Items.Add(index)
            Next
        End If
    End Sub
End Class