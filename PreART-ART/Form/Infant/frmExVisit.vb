Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Public Class frmExVisit
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim Dob, Vdate, DateApp, fvdate As Date
    Dim Vid, Tid, ApID As String
    Private Sub frmExVisit_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Clear()
        loadData()
        XtraTabControl1.SelectedTabPage = XtraTabPage1
        Dim tesdict As New Dictionary(Of Object, String)

    End Sub
#Region "Function"
    Private Sub Clear()
        txtClinicID.Text = ""
        txtClinicID.Enabled = True
        XtraTabControl1.SelectedTabPage = XtraTabPage2
        txtClinicID.Focus()
        DaVisit.Text = "01/01/1900"
        RdTypeVisit.SelectedIndex = -1
        txtAge.Text = ""
        RdSex.SelectedIndex = -1
        txtTemp.Text = ""
        txtPulse.Text = ""
        txtResp.Text = ""
        txtHead.Text = ""
        txtWeight.Text = ""
        txtHeight.Text = ""
        RdMalnutri.SelectedIndex = -1
        RdWH.SelectedIndex = -1
        RdBCG.SelectedIndex = -1
        RdOPV.SelectedIndex = -1
        RdMeasles.SelectedIndex = -1
        txtVaccinOther.Text = ""
        RdFeeding.SelectedIndex = -1
        RdDNA.SelectedIndex = -1
        DaDBS.Text = "01/01/1900"
        DaSentDBS.Text = "01/01/1900"
        DaReceive.Text = "01/01/1900"
        ' RdConfirm.SelectedIndex = -1
        RdResult.SelectedIndex = -1
        DaResult.Text = "01/01/1900"
        RdAntibody.SelectedIndex = -1
        DaAntibody.Text = "01/01/1900"
        RdOutcome.SelectedIndex = -1
        DaOutcome.Text = "01/01/1900"
        DaAppoint.Text = "01/01/1900"
        CboARVdrug1.SelectedIndex = -1
        RdARVdrugStatus1.SelectedIndex = -1
        RdARVdrugStatus2.SelectedIndex = -1
        RdARVdrugStatus3.SelectedIndex = -1
        RdARVdrugStatus4.SelectedIndex = -1
        RdARVdrugStatus5.SelectedIndex = -1
        RdARVdrugStatus6.SelectedIndex = -1
        Vid = ""
        ApID = ""
        tsbDelete.Enabled = False
        CboDoctore.Enabled = False
        CboMeetTime.Enabled = False
        CboDoctore.SelectedIndex = -1
        CboMeetTime.SelectedIndex = -1
        Rdpcrpos.SelectedIndex = -1
        RdDNA.Properties.Items(0).Enabled = True
        'RdDNA.Properties.Items(1).Enabled = True
        RdDNA.Properties.Items(2).Enabled = True
        RdDNA.Properties.Items(3).Enabled = True
        RdDNA.Properties.Items(4).Enabled = True
        RdDNA.Properties.Items(5).Enabled = True
        RdAntiaffeeding.Enabled = False
        RdAntiaffeeding.SelectedIndex = -1
        RdOutcome.Properties.Items(1).Enabled = False
        RdOutcome.Properties.Items(2).Enabled = False
        rdrdnapre.SelectedIndex = -1
    End Sub
    Private Sub Drug(cbodrug As DevExpress.XtraEditors.ComboBoxEdit, cbodrug1 As DevExpress.XtraEditors.ComboBoxEdit, cbodos As DevExpress.XtraEditors.ComboBoxEdit, txtquanlity As DevExpress.XtraEditors.TextEdit, cbofreq As DevExpress.XtraEditors.ComboBoxEdit, Cboform As DevExpress.XtraEditors.ComboBoxEdit, Rdstatu As DevExpress.XtraEditors.RadioGroup, Dat As DevExpress.XtraEditors.DateEdit, cboStop As DevExpress.XtraEditors.ComboBoxEdit, Cboremak As DevExpress.XtraEditors.ComboBoxEdit)
        If cbodrug.SelectedIndex >= 0 Then
            cbodrug1.Enabled = True
            cbodos.Enabled = True
            txtquanlity.Enabled = True
            cbofreq.Enabled = True
            Cboform.Enabled = True
            Rdstatu.Enabled = True
            Dat.Enabled = True
            cboStop.Enabled = True
            Cboremak.Enabled = True
        Else
            cbodrug1.Enabled = False
            cbodrug1.SelectedIndex = -1
            cbodos.Enabled = False
            cbodos.SelectedIndex = -1
            txtquanlity.Enabled = False
            txtquanlity.Text = ""
            cbofreq.Enabled = False
            cbofreq.SelectedIndex = -1
            Cboform.Enabled = False
            Cboform.SelectedIndex = -1
            Rdstatu.Enabled = False
            Rdstatu.SelectedIndex = -1
            Dat.Enabled = False
            Dat.Text = "01/01/1900"
            cboStop.Enabled = False
            cboStop.SelectedIndex = -1
            Cboremak.Enabled = False
            Cboremak.SelectedIndex = -1
        End If

    End Sub
    Private Sub BSA()
        txtBSA.Text = FormatNumber(Math.Sqrt(Val(txtWeight.Text) * Val(txtHeight.Text) / 3600), 2)
    End Sub
    Private Sub loadData()
        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Date Visit", GetType(Date))
        dt.Columns.Add("Type of Visit", GetType(String))
        dt.Columns.Add("Age(M)", GetType(Int32))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("DNA PCR", GetType(String))
        '   dt.Columns.Add("Result Antibody", GetType(String))
        dt.Columns.Add("Patient Status", GetType(String))
        dt.Columns.Add("Appointment-Date", GetType(Date))
        dt.Columns.Add("Vid", GetType(String))
        GridControl1.DataSource = dt
        GridView1.Columns("Vid").Visible = False

        CboARVdrug1.Properties.Items.Add("")
        CboARVdrug2.Properties.Items.Add("")
        CboARVdrug3.Properties.Items.Add("")
        CboARVdrug4.Properties.Items.Add("")
        CboARVdrug5.Properties.Items.Add("")
        CboARVdrug6.Properties.Items.Add("")
        Dim cmdDrug As New MySqlCommand("Select * from tbldrug  order by drugname", Cnndb)
        Rdr = cmdDrug.ExecuteReader
        While Rdr.Read
            If CDec(Rdr.GetValue(2).ToString) = 0 Or CDec(Rdr.GetValue(2).ToString) = 1 Then
                CboARVdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            End If
        End While
        Rdr.Close()

        'Dim CmdART As New MySqlCommand("Select * from tblartsite where status ='1' order by SiteName", Cnndb)
        'Rdr = CmdART.ExecuteReader
        'While Rdr.Read
        '    CboTransferOut.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        'End While
        'Rdr.Close()
        'CboTransferOut.Properties.Items.Add("Move to other site")
        'CboTransferOut.Properties.Items.Add("Move to other country")
        Dim CmdDoct As New MySqlCommand("Select * from tbldoctor where Status='1' ", Cnndb)
        Rdr = CmdDoct.ExecuteReader
        While Rdr.Read
            CboDoctore.Properties.Items.Add(Rdr.GetValue(0).ToString & "/ " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub Save()
        If txtClinicID.Text.Trim = "" Then Exit Sub
        If CDate(DaVisit.Text).Date >= CDate(DaAppoint.Text).Date Then
            MsgBox("Next Appointment Date must be greater than Visit Date", MsgBoxStyle.Critical, "Check Appointment")
            Exit Sub
        End If
        Dim otherDNA As String
        If UCase(txtOtherDNA.Text.Trim) = "OI" Or UCase(txtOtherDNA.Text.Trim) = "IO" Then
            otherDNA = "OI"
        Else
            otherDNA = txtOtherDNA.Text.Trim
        End If
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Are you sure do want to Save ?", "Save...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Vid = txtClinicID.Text & Format(CDate(DaVisit.Text), "ddMMyy")
                'Dim CmdSave As New MySqlCommand("insert into tblevmain values('" & txtClinicID.Text & "','" & Format(CDate(DaVisit.Text), "yyyy/MM/dd") & "','" & RdTypeVisit.SelectedIndex & "','" & txtTemp.Text & "','" & txtPulse.Text & "','" & txtResp.Text & "','" & txtHead.Text & "','" & txtWeight.Text & "','" & txtHeight.Text & "','" & RdMalnutri.SelectedIndex & "','" & RdWH.SelectedIndex & "','" & RdBCG.SelectedIndex & "','" & RdOPV.SelectedIndex & "','" & RdMeasles.SelectedIndex & "','" & txtVaccinOther.Text & "'," &
                '                        "'" & RdFeeding.SelectedIndex & "','" & If(CStr(RdDNA.EditValue) = Nothing, "-1", CStr(RdDNA.EditValue)) & "','" & Format(CDate(DaResult.EditValue), "yyyy/MM/dd") & "','" & Vid & "','" & Tid & "','" & Format(CDate(DaAppoint.EditValue), "yyyy/MM/dd") & "','" & RdAnitibody.SelectedIndex & "','" & Format(CDate(DaAntibody.EditValue), "yyyy/MM/dd") & "','" & txtOtherDNA.Text.Trim & "')", Cnndb)
                'CmdSave.ExecuteNonQuery()
                Dim CmdSave As New MySqlCommand("insert into tblevmain values('" & txtClinicID.Text & "','" & Format(CDate(DaVisit.Text), "yyyy/MM/dd") & "','" & RdTypeVisit.SelectedIndex & "','" & Val(txtTemp.Text) & "','" & Val(txtPulse.Text) & "','" & Val(txtResp.Text) & "','" & Val(txtHead.Text) & "','" & Val(txtWeight.Text) & "','" & Val(txtHeight.Text) & "','" & RdMalnutri.SelectedIndex & "','" & RdWH.SelectedIndex & "','" & RdBCG.SelectedIndex & "','" & RdOPV.SelectedIndex & "','" & RdMeasles.SelectedIndex & "','" & txtVaccinOther.Text & "'," &
                                        "'" & RdFeeding.SelectedIndex & "','" & If(CStr(RdDNA.EditValue) = Nothing, "-1", CStr(RdDNA.EditValue)) & "','" & Format(CDate("01/01/1900"), "yyyy/MM/dd") & "','" & Vid & "','" & If(Rdpcrpos.SelectedIndex = -1, "-1", CStr(Rdpcrpos.EditValue)) & "','" & Tid & "','" & Format(CDate(DaAppoint.EditValue), "yyyy/MM/dd") & "','" & RdAntibody.SelectedIndex & "','" & Format(CDate(DaAntibody.EditValue), "yyyy/MM/dd") & "','" & RdAntiaffeeding.SelectedIndex & "','" & otherDNA & "')", Cnndb)
                CmdSave.ExecuteNonQuery()
                If Trim(CboARVdrug1.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug1.Text & "','" & CboARVDose1.Text & "','" & Val(txtARVquan1.Text) & "','" & CboARVRFreq1.Text & "','" & CboARVform1.Text & "','" & RdARVdrugStatus1.SelectedIndex & "','" & Format(CDate(DaARV1.EditValue), "yyyy/MM/dd") & "','" & CboARVReason1.Text & "','" & CboARVRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug2.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug2.Text & "','" & CboARVDose2.Text & "','" & Val(txtARVquan2.Text) & "','" & CboARVRFreq2.Text & "','" & CboARVform2.Text & "','" & RdARVdrugStatus2.SelectedIndex & "','" & Format(CDate(DaARV2.EditValue), "yyyy/MM/dd") & "','" & CboARVReason2.Text & "','" & CboARVRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug3.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug3.Text & "','" & CboARVDose3.Text & "','" & Val(txtARVquan3.Text) & "','" & CboARVRFreq3.Text & "','" & CboARVform3.Text & "','" & RdARVdrugStatus3.SelectedIndex & "','" & Format(CDate(DaARV3.EditValue), "yyyy/MM/dd") & "','" & CboARVReason3.Text & "','" & CboARVRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug4.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug4.Text & "','" & CboARVDose4.Text & "','" & Val(txtARVquan4.Text) & "','" & CboARVRFreq4.Text & "','" & CboARVform4.Text & "','" & RdARVdrugStatus4.SelectedIndex & "','" & Format(CDate(DaARV4.EditValue), "yyyy/MM/dd") & "','" & CboARVReason4.Text & "','" & CboARVRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug5.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug5.Text & "','" & CboARVDose5.Text & "','" & Val(txtARVquan5.Text) & "','" & CboARVRFreq5.Text & "','" & CboARVform5.Text & "','" & RdARVdrugStatus5.SelectedIndex & "','" & Format(CDate(DaARV5.EditValue), "yyyy/MM/dd") & "','" & CboARVReason5.Text & "','" & CboARVRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug6.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug6.Text & "','" & CboARVDose6.Text & "','" & Val(txtARVquan6.Text) & "','" & CboARVRFreq6.Text & "','" & CboARVform6.Text & "','" & RdARVdrugStatus6.SelectedIndex & "','" & Format(CDate(DaARV6.EditValue), "yyyy/MM/dd") & "','" & CboARVReason6.Text & "','" & CboARVRemark6.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If RdOutcome.SelectedIndex <> -1 Then
                    Dim CmdStatus As New MySqlCommand("Insert into tblevpatientstatus values('" & txtClinicID.Text & "','" & RdOutcome.SelectedIndex & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & Vid & "')", Cnndb)
                    CmdStatus.ExecuteNonQuery()
                End If
                'Sithorn140824...................
                Select Case RdTypeVisit.SelectedIndex
                    Case 1
                        Dim CmdUpApp As New MySqlCommand("Update tblAppointment set Att='1' where vid='" & ApID & "'", Cnndb)
                        CmdUpApp.ExecuteNonQuery()
                    Case 2
                        Dim CmdUpApp As New MySqlCommand("Update tblAppointment set Att='2' where vid='" & ApID & "'", Cnndb)
                        CmdUpApp.ExecuteNonQuery()
                    Case 3
                        Dim CmdUpApp As New MySqlCommand("Update tblAppointment set Att='3' where vid='" & ApID & "'", Cnndb)
                        CmdUpApp.ExecuteNonQuery()
                End Select
                '........................
                Dim CmdApp As New MySqlCommand("Insert into tblAppointment values('" & Vid & "','" & CboDoctore.Text.Substring(0, CboDoctore.Text.IndexOf("/")) & "','" & CboMeetTime.SelectedIndex & "','0')", Cnndb)
                CmdApp.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblevmain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MessageBox.Show("Saving is Completed...", "Save...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Clear()
            End If
        Else
            If MessageBox.Show("Are you sure do you want to Edit....", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = vbYes Then
                'Dim CmdEdit As New MySqlCommand("Update tblevmain set DatVisit='" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "',TypeVisit='" & RdTypeVisit.SelectedIndex & "',Temp='" & txtTemp.Text & "',Pulse='" & txtPulse.Text & "',Resp='" & txtResp.Text & "',Head='" & txtHead.Text & "',Weight='" & txtWeight.Text & "',Height='" & txtHeight.Text & "',Malnutrition='" & RdMalnutri.SelectedIndex & "',WH='" & RdWH.SelectedIndex & "',BCG='" & RdBCG.SelectedIndex & "',OPV='" & RdOPV.SelectedIndex & "',Measles='" & RdMeasles.SelectedIndex & "',Other='" & txtVaccinOther.Text & "'," &
                '                        "Feeding='" & RdFeeding.SelectedIndex & "',DNA='" & If(CStr(RdDNA.EditValue) = Nothing, "-1", CStr(RdDNA.EditValue)) & "',DaResult='" & Format(CDate(DaResult.EditValue), "yyyy/MM/dd") & "',Antibody='" & RdAnitibody.SelectedIndex & "',DaAntibody='" & Format(CDate(DaAntibody.EditValue), "yyyy/MM/dd") & "',OtherDNA='" & txtOtherDNA.Text.Trim & "' where Vid='" & Vid & "'", Cnndb)
                'CmdEdit.ExecuteNonQuery()
                Dim CmdEdit As New MySqlCommand("Update tblevmain set DatVisit='" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "',TypeVisit='" & RdTypeVisit.SelectedIndex & "',Temp='" & Val(txtTemp.Text) & "',Pulse='" & Val(txtPulse.Text) & "',Resp='" & Val(txtResp.Text) & "',Head='" & Val(txtHead.Text) & "',Weight='" & Val(txtWeight.Text) & "',Height='" & Val(txtHeight.Text) & "',Malnutrition='" & RdMalnutri.SelectedIndex & "',WH='" & RdWH.SelectedIndex & "',BCG='" & RdBCG.SelectedIndex & "',OPV='" & RdOPV.SelectedIndex & "',Measles='" & RdMeasles.SelectedIndex & "',Other='" & txtVaccinOther.Text & "'," &
                                        "Feeding='" & RdFeeding.SelectedIndex & "',DNAPre='" & If(Rdpcrpos.SelectedIndex = -1, "-1", CStr(Rdpcrpos.EditValue)) & "',DNA='" & If(CStr(RdDNA.EditValue) = Nothing, "-1", CStr(RdDNA.EditValue)) & "',Antibody='" & RdAntibody.SelectedIndex & "',DaAntibody='" & Format(CDate(DaAntibody.EditValue), "yyyy/MM/dd") & "',Antiaffeeding='" & RdAntiaffeeding.SelectedIndex & "',OtherDNA='" & otherDNA & "' where Vid='" & Vid & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()

                Dim Cmddel As New MySqlCommand("Delete from tblevarvdrug where vid='" & Vid & "'", Cnndb)
                Cmddel.ExecuteNonQuery()

                If Trim(CboARVdrug1.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug1.Text & "','" & CboARVDose1.Text & "','" & txtARVquan1.Text & "','" & CboARVRFreq1.Text & "','" & CboARVform1.Text & "','" & RdARVdrugStatus1.SelectedIndex & "','" & Format(CDate(DaARV1.EditValue), "yyyy/MM/dd") & "','" & CboARVReason1.Text & "','" & CboARVRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug2.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug2.Text & "','" & CboARVDose2.Text & "','" & txtARVquan2.Text & "','" & CboARVRFreq2.Text & "','" & CboARVform2.Text & "','" & RdARVdrugStatus2.SelectedIndex & "','" & Format(CDate(DaARV2.EditValue), "yyyy/MM/dd") & "','" & CboARVReason2.Text & "','" & CboARVRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug3.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug3.Text & "','" & CboARVDose3.Text & "','" & txtARVquan3.Text & "','" & CboARVRFreq3.Text & "','" & CboARVform3.Text & "','" & RdARVdrugStatus3.SelectedIndex & "','" & Format(CDate(DaARV3.EditValue), "yyyy/MM/dd") & "','" & CboARVReason3.Text & "','" & CboARVRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug4.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug4.Text & "','" & CboARVDose4.Text & "','" & txtARVquan4.Text & "','" & CboARVRFreq4.Text & "','" & CboARVform4.Text & "','" & RdARVdrugStatus4.SelectedIndex & "','" & Format(CDate(DaARV4.EditValue), "yyyy/MM/dd") & "','" & CboARVReason4.Text & "','" & CboARVRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug5.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug5.Text & "','" & CboARVDose5.Text & "','" & txtARVquan5.Text & "','" & CboARVRFreq5.Text & "','" & CboARVform5.Text & "','" & RdARVdrugStatus5.SelectedIndex & "','" & Format(CDate(DaARV5.EditValue), "yyyy/MM/dd") & "','" & CboARVReason5.Text & "','" & CboARVRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug6.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblevarvdrug values('" & CboARVdrug6.Text & "','" & CboARVDose6.Text & "','" & txtARVquan6.Text & "','" & CboARVRFreq6.Text & "','" & CboARVform6.Text & "','" & RdARVdrugStatus6.SelectedIndex & "','" & Format(CDate(DaARV6.EditValue), "yyyy/MM/dd") & "','" & CboARVReason6.Text & "','" & CboARVRemark6.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If

                Dim CmdSt As New MySqlCommand("Delete from tblevpatientstatus where vid='" & Vid & "'", Cnndb)
                CmdSt.ExecuteNonQuery()

                If RdOutcome.SelectedIndex <> -1 Then
                    Dim CmdStatus As New MySqlCommand("Insert into tblevpatientstatus values('" & txtClinicID.Text & "','" & RdOutcome.SelectedIndex & "','" & Format(CDate(DaOutcome.Text), "yyyy-MM-dd") & "','" & Vid & "')", Cnndb)
                    CmdStatus.ExecuteNonQuery()
                End If
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblevmain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MsgBox("Update Is Successful", MsgBoxStyle.Information, "Successful")
                Clear()
            End If
        End If

    End Sub
    Private Sub CheckPat()
        Dim CmdSearch As New MySqlCommand("Select * from tblevpatientstatus where ClinicID='" & txtClinicID.Text & "'", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
        If (Rdr.HasRows) Then
            Dim statusstring = New String() {"DNA PCR Positive", "HIV Positive", "HIV Negative", "Death", "Lost"}
            Rdr.Read()
            MessageBox.Show("Sorry! " & statusstring(CInt(Rdr.GetValue(1).ToString)), " Patient Status", MessageBoxButtons.OK, MessageBoxIcon.Error)
            Rdr.Close()
            Clear()
            Exit Sub
        End If
        Rdr.Close()

        Dim CmdSearchAI As New MySqlCommand("Select * from tbleimain where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        If (Rdr.HasRows) Then
            Rdr.Read()
            txtAge.Text = CType(DateDiff(DateInterval.Month, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString)), String)
            'txtAge.Text = CType(Math.Round(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString)) / 30), String) 'sithorn
            RdSex.SelectedIndex = CInt(Rdr.GetValue(3).ToString)
            txtClinicID.Enabled = False
            Dob = CDate(Rdr.GetValue(2).ToString)
            fvdate = CDate(Rdr.GetValue(1).ToString)
            'If CDate(DaVisit.Text) <= CDate("01/01/1990") Then
            DaVisit.EditValue = CDate(Rdr.GetValue(1).ToString)
            'RdTypeVisit.SelectedIndex = 0
            'End If
            Rdr.Close()
            checkSeche()
        Else
            MessageBox.Show("No Patient is found with this Clinic ID. (Maybe no initial visit)", "Check In Exposed infant initial visit", MessageBoxButtons.OK, MessageBoxIcon.Error)
            Clear()
        End If
        Rdr.Close()
    End Sub
    Private Sub pcrpositive(clinicid As String, datevisit As Date)
        Dim cmdpcrpos As MySqlCommand = New MySqlCommand("select clinicid, DNAPcr from tbletest where clinicid='" & clinicid & "' and DaRresult<'" & Format(CDate(DaVisit.Text), "yyyy/MM/dd") & "' and Result=1 and DNAPcr!=4
                                                             order by DaRresult", ConnectionDB.Cnndb)
        Rdr = cmdpcrpos.ExecuteReader
        If Rdr.HasRows Then
            Rdr.Read()
            Rdpcrpos.EditValue = Rdr.GetValue(1).ToString()

        End If
        Rdr.Close()

    End Sub
    Private Sub checkSeche()
        Dim CmdSearch As MySqlCommand = New MySqlCommand("Select * from tblevmain where clinicID='" & txtClinicID.Text & "' ORDER BY DatVisit  DESC Limit 1", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Vdate = Rdr.GetValue(1).ToString()
            DaVisit.EditValue = Vdate 'sithorn change from DaVisit.Text to DaVisit.EditValue
            txtWeight.Text = Trim(Rdr.GetValue(7).ToString)
            txtHeight.Text = Trim(Rdr.GetValue(8).ToString)
            txtPulse.Text = Trim(Rdr.GetValue(4).ToString)
            txtResp.Text = Trim(Rdr.GetValue(5).ToString)
            txtHead.Text = Rdr.GetValue(6).ToString.Trim
            txtTemp.Text = Trim(Rdr.GetValue(3).ToString)
            DateApp = Rdr.GetValue(21).ToString

            Vid = Trim(Rdr.GetValue(18).ToString)
            ApID = Vid
        End While
        Rdr.Close()

        Dim orderDNA As Int32
        Dim CmdSearchDNA As MySqlCommand = New MySqlCommand("Select ClinicID,DatVisit,DNA,OtherDNA,DaApp,Vid from tblevmain where clinicID='" & txtClinicID.Text & "' ORDER BY DatVisit", ConnectionDB.Cnndb)
        Rdr = CmdSearchDNA.ExecuteReader
        While Rdr.Read
                orderDNA = CInt(Rdr.GetValue(2).ToString)
                Select Case orderDNA
                    Case 0 'at birth
                        orderDNA = 0
                    Case 1 '4 to 6 weeks
                        orderDNA = 2
                    Case 2 '3m after breastfeeding
                        orderDNA = 1
                    Case 3 'other
                        orderDNA = 3
                    Case 4 'confirm
                        orderDNA = 5
                    Case 5 '9m
                        orderDNA = 4
                End Select
                If orderDNA <> -1 Then
                    If orderDNA = 0 Then
                        RdDNA.Properties.Items(0).Enabled = False
                    ElseIf orderDNA = 1 Then
                        RdDNA.Properties.Items(1).Enabled = False
                    ElseIf orderDNA = 2 Then
                        RdDNA.Properties.Items(2).Enabled = False
                        'ElseIf orderDNA = 3 Then
                        'RdDNA.Properties.Items(3).Enabled = False
                    ElseIf orderDNA = 4 Then
                        RdDNA.Properties.Items(4).Enabled = False
                    End If
                End If
                'MessageBox.Show("Option DNA test:  " & Rdr.GetValue(2).ToString & "  Converted Index:  " & orderDNA & "  Vid:  " & Rdr.GetValue(5).ToString)
            End While
        Rdr.Close()
    End Sub
    Private Sub CheckPs()
        If DaVisit.Text.Trim = "" Or txtClinicID.Text.Trim = "" Then Exit Sub
        If CDate(DaVisit.Text).Date = CDate("1/1/1900") Then Exit Sub

        If CDate(DaVisit.Text).Date > Date.Now.Date Then
            MessageBox.Show("Invalid Visit Date greater Then Current Date " & Chr(13) & "Please Try again!", "Check Date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaVisit.Focus()
            DaVisit.Text = Now.Date
            Exit Sub
        End If
        If CDate(DaVisit.Text).Date < fvdate.Date Then
            MessageBox.Show("Invalid Date Child initial Visit greater Then Date Child Visit", "Check Date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaVisit.Focus()
            DaVisit.Text = Now.Date
            Exit Sub
        End If
        'txtAge.Text = DateDiff(DateInterval.Month, CDate(Dob), CDate(DaVisit.Text))
        txtAge.Text = Math.Round(DateDiff(DateInterval.Day, CDate(Dob), CDate(DaVisit.Text)) / 30) 'sithorn
        If Vdate.Date <= CDate(DaVisit.Text).Date Then

            If DateApp.Date <> #12:00:00 AM# Then
                If DateApp = CDate(DaVisit.Text).Date Then
                    RdTypeVisit.SelectedIndex = 2
                ElseIf DateApp < CDate(DaVisit.Text).Date Then
                    RdTypeVisit.SelectedIndex = 3
                ElseIf DateApp > CDate(DaVisit.Text).Date Then
                    RdTypeVisit.SelectedIndex = 1
                End If
            End If
            If b <> True Then
                CheckTest()
                'MessageBox.Show("Check infant test")
            End If
            SearchDrug()
        Else
            MessageBox.Show("Invalid Last Date Greater Then Date First Visit " & Chr(13) & "Please Try again!", "Check Date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            'daVisitDate.Value = Date.Now
            '  NewPatVisit()
            '  tabMain.SelectedIndex = 1
            txtClinicID.Focus()
            'daVisitDate.Value = CDate("1/1/1900")
        End If
    End Sub
    Private Sub Del()
        If MessageBox.Show("Are you sure Do you want To delete ?", "Delete...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
            Dim Cmddelmain As New MySqlCommand("delete from tblevmain where vid='" & Vid & "'", Cnndb)
            Cmddelmain.ExecuteNonQuery()
            Dim Cmddel As New MySqlCommand("Delete from tblevarvdrug where vid='" & Vid & "'", Cnndb)
            Cmddel.ExecuteNonQuery()
            Dim CmdApp As New MySqlCommand("Delete from tblAppointment where vid='" & Vid & "'", Cnndb)
            CmdApp.ExecuteNonQuery()
            Dim CmdSt As New MySqlCommand("Delete from tblevpatientstatus where vid='" & Vid & "'", Cnndb)
            CmdSt.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblevmain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Delete is successful..", "Delete...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub
    Private Sub ViewData()
        Dim i As Int64
        Dim CmdSearch As New MySqlCommand("SELECT tbleimain.ClinicID,tbleimain.Dabirth,tbleimain.Sex,tblevmain.DatVisit,
                                            tblevmain.TypeVisit,tblevpatientstatus.Status,tblevmain.DaApp,tblevmain.DNA,tblevmain.vid,tblevmain.OtherDNA,ifnull(DNAPre,'-1') as DNAPre FROM  tblevmain
                                            left OUTER JOIN tblevpatientstatus ON tblevpatientstatus.Vid = tblevmain.Vid 
                                            LEFT OUTER JOIN tbleimain ON tblevmain.ClinicID = tbleimain.ClinicID 
                                            ORDER BY tbleimain.ClinicID,tblevmain.DatVisit", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Rdr.GetValue(0).ToString
            dr(2) = Format(CDate(Rdr.GetValue(3).ToString), "dd/MM/yyyy")
            'dr(4) = DateDiff(DateInterval.Month, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString))
            dr(4) = Math.Round(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString)) / 30) 'sithorn
            Select Case CDec(Rdr.GetValue(2).ToString)
                Case 0
                    dr(5) = "Female"
                Case 1
                    dr(5) = "Male"
            End Select

            Select Case CDec(Rdr.GetValue(4).ToString)
                Case 0
                    dr(3) = "មកពិនិត្យដំបូង"
                Case 1
                    dr(3) = "មកមុនពេលកំណត់"
                Case 2
                    dr(3) = "មកពិនិត្យតាមការកំណត់"
                Case 3
                    dr(3) = "មកពិនិត្យយឺត"
            End Select
            Select Case CDec(Rdr.GetValue(7).ToString)
                Case 0
                    dr(6) = "នៅពេលកើត"
                Case 1
                    dr(6) = "ចន្លោះពី ៤​ ទៅ ៦ សប្តាហ៍"
                Case 2
                    dr(6) = "៦សប្តាហ៍ ក្រោយពេលផ្តាច់ដោះ"
                Case 3
                    If Rdr.GetValue(9).ToString = "OI" Then
                        dr(6) = "OI"
                    Else
                        dr(6) = "ផ្សេងទៀត"
                    End If
                Case 4
                    dr(6) = "តេស្តបញ្ជាក់"
                Case 5
                    dr(6) = "នៅអាយុ ៩ខែ"
            End Select
            If Rdr.GetValue(5).ToString.Trim <> "" Then
                Select Case CDec(Rdr.GetValue(5).ToString.Trim)
                    Case 0
                        dr(7) = "DNA PCR(+)"
                    Case 1
                        dr(7) = "HIV+"
                    Case 2
                        dr(7) = "HIV-"
                    Case 3
                        dr(7) = "Death"
                    Case 4
                        dr(7) = "Lost"
                End Select
            End If
            dr(8) = Rdr.GetValue(6).ToString
            dr(9) = Rdr.GetValue(8).ToString
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub

    Private Sub Search()
        Dim CmdSearch As New MySqlCommand("Select * from tblevmain where vid ='" & Vid & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        With Rdr
            While .Read
                RdTypeVisit.SelectedIndex = .GetValue(2).ToString
                txtTemp.Text = .GetValue(3).ToString
                txtPulse.Text = .GetValue(4).ToString
                txtResp.Text = .GetValue(5).ToString
                txtHead.Text = .GetValue(6).ToString
                txtWeight.Text = .GetValue(7).ToString
                txtHeight.Text = .GetValue(8).ToString
                RdMalnutri.SelectedIndex = .GetValue(9).ToString
                RdWH.SelectedIndex = .GetValue(10).ToString
                RdBCG.SelectedIndex = .GetValue(11).ToString
                RdOPV.SelectedIndex = .GetValue(12).ToString
                RdMeasles.SelectedIndex = .GetValue(13).ToString
                txtVaccinOther.Text = .GetValue(14).ToString
                RdFeeding.SelectedIndex = .GetValue(15).ToString
                RdDNA.EditValue = .GetValue(16).ToString
                DaResult.Text = CDate(.GetValue(17).ToString).Date
                Rdpcrpos.EditValue = CStr(.GetValue(19).ToString)
                Tid = .GetValue(19).ToString
                RdAntibody.SelectedIndex = .GetValue(22).ToString
                DaAntibody.Text = CDate(.GetValue(23).ToString).Date
                RdAntiaffeeding.SelectedIndex = .GetValue(24).ToString
                txtOtherDNA.Text = Trim(.GetValue(25).ToString)
            End While
            .Close()
        End With
        'Sithorn Copy...................................
        'Infant Test
        CheckTest()
        'Dim CmdTest As New MySqlCommand("Select * from tbletest where TID='" & Tid & "'", Cnndb)
        'Rdr = CmdTest.ExecuteReader
        'While Rdr.Read
        '    DaSentDBS.EditValue = CDate(Rdr.GetValue(7).ToString).Date
        '    DaDBS.EditValue = CDate(Rdr.GetValue(5).ToString).Date
        '    DaReceive.EditValue = CDate(Rdr.GetValue(10).ToString).Date
        '    If Rdr.GetValue(11).ToString = "True" Or Rdr.GetValue(12).ToString = "True" Or Rdr.GetValue(13).ToString = "True" Then
        '        RdResult.SelectedIndex = 2
        '    End If
        '    If CDec(Rdr.GetValue(9).ToString) = 0 Then
        '        RdResult.SelectedIndex = 1
        '    Else
        '        RdResult.SelectedIndex = 0
        '    End If
        'End While
        'Rdr.Close()
        SearchDrug()

        Dim CmdStatus As New MySqlCommand("Select * from tblevpatientstatus where vid='" & Vid & "'", Cnndb)
        Rdr = CmdStatus.ExecuteReader
        While Rdr.Read
            RdOutcome.SelectedIndex = Rdr.GetValue(1).ToString
            DaOutcome.EditValue = CDate(Rdr.GetValue(2).ToString)
        End While
        Rdr.Close()

        Dim CmdApp As New MySqlCommand("select * from tblappointment where vid='" & Vid & "'", Cnndb)
        Rdr = CmdApp.ExecuteReader
        While Rdr.Read
            For iI As Int16 = 0 To CboDoctore.Properties.Items.Count - 1
                If Rdr.GetValue(1).ToString.Trim = Mid(CboDoctore.Properties.Items(iI).ToString, 1, 1) Then
                    CboDoctore.SelectedIndex = iI
                    Exit For
                End If
            Next
            CboMeetTime.SelectedIndex = Rdr.GetValue(2).ToString
        End While
        Rdr.Close()
        '..........................................
    End Sub

    Private Sub SearchDrug()
        Dim commandstring As String
        If tsbDelete.Enabled = True Then
            commandstring = "Select * from tblevarvdrug where vid='" & Vid & "'"
        Else
            commandstring = "select * from tblevarvdrug vd
                            where vid in (select v.vid from tblevmain v inner join (select v.clinicid,max(DatVisit) as DatVisit from tblevmain v
                            where v.clinicid='" & txtClinicID.Text & "' group by v.clinicid) vv on vv.clinicid=v.clinicid and vv.DatVisit=v.DatVisit) and  vd.status!=1"
        End If

        Dim CmdARV As New MySqlCommand(commandstring, Cnndb)
        Rdr = CmdARV.ExecuteReader
        Dim i As Integer
        While Rdr.Read
            i = i + 1
            If i = 1 Then
                CboARVdrug1.Text = Trim(Rdr.GetValue(0).ToString)
                CboARVDose1.Text = Trim(Rdr.GetValue(1).ToString)
                txtARVquan1.Text = Trim(Rdr.GetValue(2).ToString)
                CboARVRFreq1.Text = Trim(Rdr.GetValue(3).ToString)
                CboARVform1.Text = Trim(Rdr.GetValue(4).ToString)
                RdARVdrugStatus1.SelectedIndex = Rdr.GetValue(5).ToString
                DaARV1.Text = CDate(DaVisit.EditValue).Date
                CboARVReason1.Text = Trim(Rdr.GetValue(7).ToString)
                CboARVRemark1.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 2 Then
                CboARVdrug2.Text = Trim(Rdr.GetValue(0).ToString)
                CboARVDose2.Text = Trim(Rdr.GetValue(1).ToString)
                txtARVquan2.Text = Trim(Rdr.GetValue(2).ToString)
                CboARVRFreq2.Text = Trim(Rdr.GetValue(3).ToString)
                CboARVform2.Text = Trim(Rdr.GetValue(4).ToString)
                RdARVdrugStatus2.SelectedIndex = Rdr.GetValue(5).ToString
                DaARV2.Text = CDate(DaVisit.EditValue).Date
                CboARVReason2.Text = Trim(Rdr.GetValue(7).ToString)
                CboARVRemark2.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 3 Then
                CboARVdrug3.Text = Trim(Rdr.GetValue(0).ToString)
                CboARVDose3.Text = Trim(Rdr.GetValue(1).ToString)
                txtARVquan3.Text = Trim(Rdr.GetValue(2).ToString)
                CboARVRFreq3.Text = Trim(Rdr.GetValue(3).ToString)
                CboARVform3.Text = Trim(Rdr.GetValue(4).ToString)
                RdARVdrugStatus3.SelectedIndex = Rdr.GetValue(5).ToString
                DaARV3.Text = CDate(DaVisit.EditValue).Date
                CboARVReason3.Text = Trim(Rdr.GetValue(7).ToString)
                CboARVRemark3.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 4 Then
                CboARVdrug4.Text = Trim(Rdr.GetValue(0).ToString)
                CboARVDose4.Text = Trim(Rdr.GetValue(1).ToString)
                txtARVquan4.Text = Trim(Rdr.GetValue(2).ToString)
                CboARVRFreq4.Text = Trim(Rdr.GetValue(3).ToString)
                CboARVform4.Text = Trim(Rdr.GetValue(4).ToString)
                RdARVdrugStatus4.SelectedIndex = Rdr.GetValue(5).ToString
                DaARV4.Text = CDate(DaVisit.EditValue).Date
                CboARVReason4.Text = Trim(Rdr.GetValue(7).ToString)
                CboARVRemark4.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 5 Then
                CboARVdrug5.Text = Trim(Rdr.GetValue(0).ToString)
                CboARVDose5.Text = Trim(Rdr.GetValue(1).ToString)
                txtARVquan5.Text = Trim(Rdr.GetValue(2).ToString)
                CboARVRFreq5.Text = Trim(Rdr.GetValue(3).ToString)
                CboARVform5.Text = Trim(Rdr.GetValue(4).ToString)
                RdARVdrugStatus5.SelectedIndex = Rdr.GetValue(5).ToString
                DaARV5.Text = CDate(DaVisit.EditValue).Date
                CboARVReason5.Text = Trim(Rdr.GetValue(7).ToString)
                CboARVRemark5.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 6 Then
                CboARVdrug6.Text = Trim(Rdr.GetValue(0).ToString)
                CboARVDose6.Text = Trim(Rdr.GetValue(1).ToString)
                txtARVquan6.Text = Trim(Rdr.GetValue(2).ToString)
                CboARVRFreq6.Text = Trim(Rdr.GetValue(3).ToString)
                CboARVform6.Text = Trim(Rdr.GetValue(4).ToString)
                RdARVdrugStatus6.SelectedIndex = Rdr.GetValue(5).ToString
                DaARV6.Text = CDate(DaVisit.EditValue).Date
                CboARVReason6.Text = Trim(Rdr.GetValue(7).ToString)
                CboARVRemark6.Text = Trim(Rdr.GetValue(8).ToString)
            End If
        End While
        Rdr.Close()
    End Sub
    Private Sub CheckTest()
        Tid = "" 'Sithorn
        Dim b1, b2, b3, b4, b5, b6 As Boolean
        Dim CmdTest As New MySqlCommand("Select ClinicID,DaBlood,DaReceive,Result,DaRresult,DBS,Technic,ResultIn,Other,TID,DaPcrArr,DNAPcr from tbletest where clinicID='" & txtClinicID.Text & "' AND DaRresult <= '" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "' and DaRresult <> '" & Format(CDate("01/01/1900"), "yyyy/MM/dd") & "' ORDER BY DaRresult desc limit 1", Cnndb)
        Rdr = CmdTest.ExecuteReader 'sithorn...
        While Rdr.Read
            DaSentDBS.EditValue = CDate(Rdr.GetValue(2).ToString).Date
            DaDBS.EditValue = CDate(Rdr.GetValue(1).ToString).Date
            DaReceive.EditValue = CDate(Rdr.GetValue(4).ToString).Date
            DaResult.EditValue = CDate(Rdr.GetValue(10).ToString).Date
            rdrdnapre.EditValue = Rdr.GetValue(11).ToString
            If Rdr.GetValue(5).ToString = "True" Or Rdr.GetValue(6).ToString = "True" Or Rdr.GetValue(7).ToString = "True" Or Rdr.GetValue(8).ToString <> "" Then
                RdResult.SelectedIndex = 2
            End If
            If CDec(Rdr.GetValue(3).ToString) = 0 Then
                RdResult.SelectedIndex = 1
            ElseIf CDec(Rdr.GetValue(3).ToString) = 1 Then
                RdResult.SelectedIndex = 0
            End If
            Tid = Rdr.GetValue(9).ToString.Trim
        End While
        Rdr.Close()
        pcrpositive(txtClinicID.Text, CDate(DaVisit.Text))
        Dim optTest, resPcr As Int32
        Dim CmdChtest As New MySqlCommand(" Select DNAPcr,Result From tbletest Where ClinicID ='" & txtClinicID.Text & "'" & " order by DaBlood;", Cnndb)
        Rdr = CmdChtest.ExecuteReader
        If Rdr.HasRows Then
            While Rdr.Read
                optTest = CInt(Rdr.GetValue(0).ToString)
                resPcr = CInt(Rdr.GetValue(1).ToString)
                If optTest <> -1 Then
                    If resPcr = 1 Then
                        RdDNA.Properties.Items(5).Enabled = True
                    Else
                        RdDNA.Properties.Items(5).Enabled = False
                    End If
                End If
            End While
            Rdr.Close()
        Else
            Rdr.Close()
            RdDNA.Properties.Items(5).Enabled = False
        End If
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
#End Region
    Private Sub CboARVdrug1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug1.SelectedIndexChanged
        Drug(CboARVdrug1, CboARVdrug2, CboARVDose1, txtARVquan1, CboARVRFreq1, CboARVform1, RdARVdrugStatus1, DaARV1, CboARVReason1, CboARVRemark1)
    End Sub

    Private Sub CboARVdrug2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug2.SelectedIndexChanged
        Drug(CboARVdrug2, CboARVdrug3, CboARVDose2, txtARVquan2, CboARVRFreq2, CboARVform2, RdARVdrugStatus2, DaARV2, CboARVReason2, CboARVRemark2)
    End Sub

    Private Sub CboARVdrug3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug3.SelectedIndexChanged
        Drug(CboARVdrug3, CboARVdrug4, CboARVDose3, txtARVquan3, CboARVRFreq3, CboARVform3, RdARVdrugStatus3, DaARV3, CboARVReason3, CboARVRemark3)
    End Sub

    Private Sub CboARVdrug4_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug4.SelectedIndexChanged
        Drug(CboARVdrug4, CboARVdrug5, CboARVDose4, txtARVquan4, CboARVRFreq4, CboARVform4, RdARVdrugStatus4, DaARV4, CboARVReason4, CboARVRemark4)
    End Sub

    Private Sub CboARVdrug5_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug5.SelectedIndexChanged
        Drug(CboARVdrug5, CboARVdrug6, CboARVDose5, txtARVquan5, CboARVRFreq5, CboARVform5, RdARVdrugStatus5, DaARV5, CboARVReason5, CboARVRemark5)
    End Sub

    Private Sub CboARVdrug6_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug6.SelectedIndexChanged
        Drug(CboARVdrug6, CboARVdrug6, CboARVDose6, txtARVquan6, CboARVRFreq6, CboARVform6, RdARVdrugStatus6, DaARV6, CboARVReason6, CboARVRemark6)
    End Sub
    Private Sub txtWeight_EditValueChanged(sender As Object, e As EventArgs) Handles txtWeight.EditValueChanged
        BSA()
    End Sub

    Private Sub txtHeiht_EditValueChanged(sender As Object, e As EventArgs) Handles txtHeight.EditValueChanged
        BSA()
    End Sub
    Private Sub RdOutcome_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdOutcome.SelectedIndexChanged
        If RdOutcome.SelectedIndex <> -1 Then
            DaOutcome.Enabled = True
        Else
            DaOutcome.Enabled = False
            DaOutcome.Text = "01/01/1900"
        End If
    End Sub
    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
    End Sub

    Private Sub tsbClear1_Click(sender As Object, e As EventArgs) Handles tsbClear1.Click
        Clear()
    End Sub

    Private Sub tbsSave_Click(sender As Object, e As EventArgs) Handles tbsSave.Click
        Save()
    End Sub

    Private Sub tsbSave1_Click(sender As Object, e As EventArgs) Handles tsbSave1.Click
        Save()
    End Sub

    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        tsbDelete.Enabled = True
        tsbDelete1.Enabled = True
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        If txtClinicID.Text = "" Then Exit Sub
        XtraTabControl1.SelectedTabPageIndex = 1
        DaVisit.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date Visit")
        txtAge.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Age(M)")
        If GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex") = "Female" Then
            RdSex.SelectedIndex = 0
        Else
            RdSex.SelectedIndex = 1
        End If
        DaAppoint.Text = CDate(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Appointment-Date")).Date
        Vid = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Vid")

        txtClinicID.Enabled = False
        If CDate(DaAppoint.Text) > CDate("01/01/2000") Then
            CboDoctore.Enabled = True
            CboMeetTime.Enabled = True
        End If
        Search()
    End Sub

    Private Sub tsbDelete1_Click(sender As Object, e As EventArgs) Handles tsbDelete1.Click
        Del()
    End Sub


    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        If IsNumeric(txtClinicID.Text) Then
            txtClinicID.Text = "E" & frmMain.Art & Format(Val(txtClinicID.Text), "0000")
            If txtClinicID.Text = "E000000" Then
                MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                txtClinicID.Text = ""
                txtClinicID.Focus()
                Exit Sub
            End If
            CheckPat()
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

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

    End Sub

    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaVisit_Leave(sender As Object, e As EventArgs) Handles DaVisit.Leave
        If tsbDelete.Enabled = False Then CheckPs()
    End Sub

    Private Sub DaVisit_KeyDown(sender As Object, e As KeyEventArgs) Handles DaVisit.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Int32
            If IsNumeric(tspClinicID.Text) Then
                tspClinicID.Text = "E" & frmMain.Art & Format(Val(tspClinicID.Text), "0000")
                If tspClinicID.Text = "E000000" Then
                    MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                    tspClinicID.Text = ""
                    Exit Sub
                End If
            End If
            Dim CmdSearch As New MySqlCommand("SELECT  tbleimain.ClinicID,tbleimain.Dabirth,tbleimain.Sex,tblevmain.DatVisit,tblevmain.TypeVisit,tblevpatientstatus.Status,tblevmain.DaApp,tblevmain.DNA,tblevmain.vid,tblevmain.OtherDNA FROM  tblevpatientstatus RIGHT OUTER JOIN tblevmain ON tblevpatientstatus.Vid = tblevmain.Vid LEFT OUTER JOIN tbleimain ON tblevmain.ClinicID = tbleimain.ClinicID where tbleimain.ClinicID='" & tspClinicID.Text & "' ORDER BY tbleimain.ClinicID,tblevmain.DatVisit", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Rdr.GetValue(0).ToString
                dr(2) = Format(CDate(Rdr.GetValue(3).ToString), "dd/MM/yyyy")
                'dr(4) = DateDiff(DateInterval.Month, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString))
                dr(4) = Math.Round(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString)) / 30) 'sithorn
                Select Case CDec(Rdr.GetValue(2).ToString)
                    Case 0
                        dr(5) = "Female"
                    Case 1
                        dr(5) = "Male"
                End Select

                Select Case CDec(Rdr.GetValue(4).ToString)
                    Case 0
                        dr(3) = "មកពិនិត្យដំបូង"
                    Case 1
                        dr(3) = "មកមុនពេលកំណត់"
                    Case 2
                        dr(3) = "មកពិនិត្យតាមការកំណត់"
                    Case 3
                        dr(3) = "មកពិនិត្យយឺត"
                End Select
                Select Case CDec(Rdr.GetValue(7).ToString)
                    Case 0
                        dr(6) = "នៅពេលកើត"
                    Case 1
                        dr(6) = "ចន្លោះពី ៤​ ទៅ ៦ សប្តាហ៍"
                    Case 2
                        dr(6) = "៦សប្តាហ៍ ក្រោយពេលផ្តាច់ដោះ"
                    Case 3
                        If Rdr.GetValue(9).ToString = "OI" Then
                            dr(6) = "OI"
                        Else
                            dr(6) = "ផ្សេងទៀត"
                        End If
                    Case 4
                        dr(6) = "តេស្តបញ្ជាក់"
                    Case 5
                        dr(6) = "នៅអាយុ ៩ខែ"
                End Select
                If Rdr.GetValue(5).ToString.Trim <> "" Then
                    Select Case CDec(Rdr.GetValue(5).ToString.Trim)
                        Case 0
                            dr(7) = "DNA PCR(+)"
                        Case 1
                            dr(7) = "HIV+"
                        Case 2
                            dr(7) = "HIV-"
                        Case 3
                            dr(7) = "Death"
                        Case 4
                            dr(7) = "Lost"
                    End Select
                End If
                dr(8) = Rdr.GetValue(6).ToString
                dr(9) = Rdr.GetValue(8).ToString
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
            tspClinicID.Select(tspClinicID.Text.Length, 0)
        End If
    End Sub

    Private Sub DaAppoint_Leave(sender As Object, e As EventArgs) Handles DaAppoint.Leave
        If Format(CDate(DaAppoint.Text), "dddd") = "Saturday" Then
            If vbNo = MessageBox.Show("Are you Sure !" & Chr(13) & "The appoinment date Is on Saturday", "Appoinment .... ", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation) Then
                DaAppoint.Text = "01/01/1900"
                Exit Sub
            End If
        End If
        If Format(CDate(DaAppoint.Text), "dddd") = "Sunday" Then
            If vbNo = MessageBox.Show("Are you Sure !" & Chr(13) & "The appoinment date Is on Sunday", "Appoinment......", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation) Then
                DaAppoint.Text = "01/01/1900"
                Exit Sub
            End If
        End If
        If CDate(DaAppoint.Text) >= DateAdd(DateInterval.Month, frmMain.ex, CDate(DaVisit.Text)) And CDate(DaAppoint.Text) > CDate("01/01/2000") Then
            MessageBox.Show("Invalid Date Appointment", "Check Date Appointment", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaAppoint.Text = CDate("01/01/1900")
        End If
        If CDate(DaAppoint.Text) > CDate("01/01/2006") Then
            CboDoctore.Enabled = True
            CboMeetTime.Enabled = True
        End If
    End Sub

    Private Sub DaAppoint_KeyDown(sender As Object, e As KeyEventArgs) Handles DaAppoint.KeyDown
        If e.KeyCode = Keys.Enter Then
            DaAppoint_Leave(DaAppoint, New EventArgs)
        End If
    End Sub

    Private Sub RdDNA_EditValueChanged(sender As Object, e As EventArgs) Handles RdDNA.EditValueChanged
        If Equals(RdDNA.EditValue, "3") Or Equals(RdDNA.EditValue, "4") Then
            txtOtherDNA.Enabled = True
        Else
            txtOtherDNA.Enabled = False
            txtOtherDNA.Text = ""
        End If
    End Sub

    Private Sub txtTemp_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtTemp.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtTemp.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtPulse_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtPulse.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtPulse.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtResp_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtResp.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtResp.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtHead_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtHead.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtHead.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtWeight_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtWeight.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtWeight.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtHeight_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtHeight.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtHeight.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtTemp_KeyDown(sender As Object, e As KeyEventArgs) Handles txtTemp.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtPulse_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPulse.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtResp_KeyDown(sender As Object, e As KeyEventArgs) Handles txtResp.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtHead_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHead.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub


    Private Sub SimpleButton1_Click(sender As Object, e As EventArgs) Handles SimpleButton1.Click
        RdOutcome.SelectedIndex = -1
        RdOutcome.Properties.Items(1).Enabled = False
        RdOutcome.Properties.Items(2).Enabled = False
        RdAntibody.SelectedIndex = -1
        DaAntibody.Text = "01/01/1900"
    End Sub

    Private Sub rdrdnapre_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdrdnapre.SelectedIndexChanged

    End Sub



    Private Sub txtWeight_KeyDown(sender As Object, e As KeyEventArgs) Handles txtWeight.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtHeight_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHeight.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub RdAnitibody_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdAntibody.SelectedIndexChanged
        If RdAntibody.SelectedIndex = 0 Then
            RdAntiaffeeding.Enabled = True
            RdOutcome.Properties.Items(1).Enabled = True
            RdOutcome.Properties.Items(2).Enabled = False
        ElseIf RdAntibody.SelectedIndex = 1 Then
            RdAntiaffeeding.Enabled = True
            RdOutcome.Properties.Items(2).Enabled = True
            RdOutcome.Properties.Items(1).Enabled = False
        Else
            RdAntiaffeeding.SelectedIndex = -1
            RdAntiaffeeding.Enabled = False
        End If
    End Sub

    Private Sub lbl3maffeeding_DoubleClick(sender As Object, e As EventArgs) Handles lbl3maffeeding.DoubleClick
        RdAntiaffeeding.SelectedIndex = -1
    End Sub

    Private Sub tspClinicID_KeyPress(sender As Object, e As KeyPressEventArgs) Handles tspClinicID.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub
End Class