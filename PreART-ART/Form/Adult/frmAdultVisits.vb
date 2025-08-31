Imports System.ComponentModel
Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Public Class frmAdultVisits
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim Tid As String
    Dim Dob, Vdate, DateApp, fvdate, Daart As Date
    Dim Vid, ApID As Double
    Dim id, re As Integer
    'Sithorn.............
    Dim TyR As Integer
    'Sithorn.............
    Dim causedeath() As String = {}
    Dim dtCause, dtCountries As DataTable
    Private Sub tsbClear1_Click(sender As Object, e As EventArgs) Handles tsbClear1.Click
        Clear()
    End Sub

    Private Sub tsbClear_Click(sender As Object, e As EventArgs) Handles tsbClear.Click
        Clear()
    End Sub

    Dim Stage As Integer
    Private Sub frmAdultVisits_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Clear() ' First line
        loadData() ' Second line

    End Sub
    Private Sub TabControl1_Click(sender As Object, e As EventArgs) Handles TabControl1.Click
        If TabControl1.SelectedIndex = 1 Then
            txtClinicID.Focus()
        End If
    End Sub
    Private Sub RdUse_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdUse.SelectedIndexChanged

        RdPOC.Enabled = False
        txtDrug.Enabled = False
        RdPOC.SelectedIndex = -1
        txtCOC.Text = ""
        txtPOC.Text = ""
        txtDrug.Text = ""
        If RdUse.SelectedIndex = 0 Then
            RdPOC.Enabled = True
        ElseIf RdUse.SelectedIndex = 1 Then
            txtDrug.Enabled = True
        End If
    End Sub
    Private Sub RdPOC_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdPOC.SelectedIndexChanged
        txtPOC.Enabled = False
        txtPOC.Text = ""
        txtCOC.Enabled = False
        txtCOC.Text = ""
        RdPOCu.Enabled = False
        If RdPOC.SelectedIndex = 0 Then
            txtCOC.Enabled = True
        ElseIf RdPOC.SelectedIndex = 1 Then
            txtPOC.Enabled = True
        End If
    End Sub

    Private Sub RdUsing_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdUsing.SelectedIndexChanged
        RdPOCu.Enabled = False
        txtDrugu.Enabled = False
        txtDrugu.Text = ""
        RdPOCu.SelectedIndex = -1
        If RdUsing.SelectedIndex = 0 Then
            RdPOCu.Enabled = True
        ElseIf RdUsing.SelectedIndex = 1 Then
            txtDrugu.Enabled = True
        End If
    End Sub

    Private Sub RdPOCu_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdPOCu.SelectedIndexChanged
        txtCOCu.Enabled = False
        txtCOCu.Text = ""
        txtPOCu.Enabled = False
        txtPOCu.Text = ""
        If RdPOCu.SelectedIndex = 0 Then
            txtCOCu.Enabled = True
        ElseIf RdPOCu.SelectedIndex = 1 Then
            txtPOCu.Enabled = True
        End If
    End Sub

    Private Sub chkPlaceService_CheckedChanged(sender As Object, e As EventArgs) Handles chkPlaceService.CheckedChanged
        RdUsing.Enabled = False
        RdUsing.SelectedIndex = -1
        chkUmCondom.Checked = False
        chkUmCondom.Enabled = False
        chkUother.Enabled = False
        chkUother.Checked = False
        If chkPlaceService.Checked Then
            RdUsing.Enabled = True
            chkUmCondom.Enabled = True
            chkUother.Enabled = True
        End If
    End Sub


    Private Sub RdHospital_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdHospital.SelectedIndexChanged
        txtReasonHoptital.Enabled = False
        txtReasonHoptital.Text = ""
        txtNumHosptital.Enabled = False
        txtNumHosptital.Text = ""
        If RdHospital.SelectedIndex = 1 Then
            txtNumHosptital.Enabled = True
            txtReasonHoptital.Enabled = True
        End If
    End Sub

    Private Sub RdMissARV_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdMissARV.SelectedIndexChanged
        txtMissTime.Enabled = False
        txtMissTime.Text = ""
        If RdMissARV.SelectedIndex = 1 Then
            txtMissTime.Enabled = True
        End If
    End Sub

    Private Sub RdTB_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTB.SelectedIndexChanged
        RdTBresult.Enabled = False
        RdTBresult.SelectedIndex = -1
        RdTBtreat.Enabled = False
        RdTBtreat.SelectedIndex = -1
        DaTB.Enabled = False
        DaTB.Text = "01/01/1900"
        If RdTB.SelectedIndex <> -1 Then
            RdTBresult.Enabled = True
            RdTBtreat.Enabled = True
            DaTB.Enabled = True
        End If
    End Sub

    Private Sub ChkTestHIV_CheckedChanged(sender As Object, e As EventArgs) Handles ChkTestHIV.CheckedChanged
        If ChkTestHIV.Checked Then
            RdResultHIV.Enabled = True
        Else
            RdResultHIV.SelectedIndex = -1
            RdResultHIV.Enabled = False
        End If
    End Sub

    Private Sub ChkGrAG_CheckedChanged(sender As Object, e As EventArgs) Handles ChkGrAG.CheckedChanged
        'RdResultCrAG.Enabled = False
        If ChkGrAG.Checked Then
            RdResultCrAG.Enabled = True
        Else
            RdResultCrAG.Enabled = False
            RdResultCrAG.SelectedIndex = -1
        End If
    End Sub

    Private Sub RdRefer_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdRefer.SelectedIndexChanged
        txtReferOther.Enabled = False
        txtReferOther.Text = ""
        If RdRefer.SelectedIndex = 3 Then
            txtReferOther.Enabled = True
        End If
    End Sub



    Private Sub chkMediOther_CheckedChanged(sender As Object, e As EventArgs) Handles chkMediOther.CheckedChanged

        If chkMediOther.Checked Then
            txtMediOther.Enabled = True
        Else
            txtMediOther.Text = ""
            txtMediOther.Enabled = False
        End If
    End Sub

    Private Sub RdPatientStatus_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdPatientStatus.SelectedIndexChanged
        DaOutcome.Enabled = False
        DaOutcome.Text = "01/01/1900"
        txtOutDeath.Enabled = False
        RdPlaceDead.Enabled = False
        RdCauseDeath.Enabled = False 'add by sithorn
        txtOutDeath.Text = ""
        RdPlaceDead.SelectedIndex = -1
        RdCauseDeath.SelectedIndex = -1 'add by sithorn
        LueCauseDeath.EditValue = Nothing 'add by sithorn
        LueCauseDeath.Enabled = False 'add by sithorn
        CboTransferOut.Enabled = False
        CboTransferOut.SelectedIndex = -1
        If RdPatientStatus.SelectedIndex = 0 Then
            DaOutcome.Enabled = True
        ElseIf RdPatientStatus.SelectedIndex = 1 Then
            RdPlaceDead.Enabled = True
            RdCauseDeath.Enabled = True 'add by sithorn
            'txtOutDeath.Enabled = True 'hide by sithorn
            DaOutcome.Enabled = True
        ElseIf RdPatientStatus.SelectedIndex = 2 Then
            DaOutcome.Enabled = True
        ElseIf RdPatientStatus.SelectedIndex = 3 Then
            CboTransferOut.Enabled = True
        End If
    End Sub

    Private Sub RdPlaceDead_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdPlaceDead.SelectedIndexChanged
        txtOtherDead.Enabled = False
        txtOtherDead.Text = ""
        If RdPlaceDead.SelectedIndex = 2 Then
            txtOtherDead.Enabled = True
        End If
    End Sub

    Private Sub RdPatientStatus_DoubleClick(sender As Object, e As EventArgs) Handles RdPatientStatus.DoubleClick
        RdPatientStatus.SelectedIndex = -1
    End Sub

    Private Sub RdRefer_DoubleClick(sender As Object, e As EventArgs) Handles RdRefer.DoubleClick
        RdRefer.SelectedIndex = -1
    End Sub
    Private Sub loadData()
        TabControl1.SelectedIndex = 0
        dt = New DataTable
        dt.Columns.Add("No", GetType(Double))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Date Visit", GetType(Date))
        dt.Columns.Add("Type of Visit", GetType(String))
        dt.Columns.Add("Age", GetType(Int32))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Stage", GetType(Int16))
        dt.Columns.Add("ART Number", GetType(String))
        dt.Columns.Add("Patient Status", GetType(String))
        dt.Columns.Add("Appointment-Date", GetType(Date))
        dt.Columns.Add("Vid", GetType(Double))
        GridControl1.DataSource = dt
        GridView1.Columns("Vid").Visible = False

        CboARVdrug1.Properties.Items.Add("")
        CboARVdrug2.Properties.Items.Add("")
        CboARVdrug3.Properties.Items.Add("")
        CboARVdrug4.Properties.Items.Add("")
        CboARVdrug5.Properties.Items.Add("")
        CboARVdrug6.Properties.Items.Add("")
        CboARVdrug7.Properties.Items.Add("")
        CboARVdrug8.Properties.Items.Add("")

        CboOIdrug1.Properties.Items.Add("")
        CboOIdrug2.Properties.Items.Add("")
        CboOIdrug3.Properties.Items.Add("")
        CboOIdrug4.Properties.Items.Add("")
        CboOIdrug5.Properties.Items.Add("")

        cboTBdrug1.Properties.Items.Add("")
        cboTBdrug2.Properties.Items.Add("")
        cboTBdrug3.Properties.Items.Add("")

        cboHydrug1.Properties.Items.Add("")
        cboHydrug2.Properties.Items.Add("")
        cboHydrug3.Properties.Items.Add("")

        Dim cmdDrug As New MySqlCommand("Select * from tbldrug  order by drugname", Cnndb)
        Rdr = cmdDrug.ExecuteReader
        While Rdr.Read
            If CDec(Rdr.GetValue(2).ToString) = 0 Then
                CboARVdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug7.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboARVdrug8.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            ElseIf CDec(Rdr.GetValue(2).ToString) = 1 Then
                CboOIdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            ElseIf CDec(Rdr.GetValue(2).ToString) = 2 Then
                cboTBdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                cboTBdrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                cboTBdrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            ElseIf CDec(Rdr.GetValue(2).ToString) = 3 Then
                cboHydrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                cboHydrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                cboHydrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            ElseIf CDec(Rdr.GetValue(2).ToString) = 4 Then
                CboTPTdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboTPTdrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboTPTdrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboTPTdrug4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            End If
        End While
        Rdr.Close()
        CboTransferOut.Properties.Items.Add("")
        Dim CmdART As New MySqlCommand("Select * from tblartsite where status ='1' order by Sid", Cnndb)
        Rdr = CmdART.ExecuteReader
        While Rdr.Read
            CboTransferOut.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        CboTransferOut.Properties.Items.Add("Move to other site")
        CboTransferOut.Properties.Items.Add("Move to other country")
        CboTransferOut.Properties.Items.Add("Return to old site")
        Dim CmdDoct As New MySqlCommand("Select * from tbldoctor where Status='1' ", Cnndb)
        Rdr = CmdDoct.ExecuteReader
        While Rdr.Read
            CboDoctore.Properties.Items.Add(Rdr.GetValue(0).ToString & "/ " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()

        CboARVReason1.Properties.Items.Add("")
        CboARVReason2.Properties.Items.Add("")
        CboARVReason3.Properties.Items.Add("")
        CboARVReason4.Properties.Items.Add("")
        CboARVReason5.Properties.Items.Add("")
        CboARVReason6.Properties.Items.Add("")
        CboARVReason7.Properties.Items.Add("")
        CboARVReason8.Properties.Items.Add("")
        CboOIReason1.Properties.Items.Add("")
        CboOIReason2.Properties.Items.Add("")
        CboOIReason3.Properties.Items.Add("")
        CboOIReason4.Properties.Items.Add("")
        CboOIReason5.Properties.Items.Add("")
        CboTBReason1.Properties.Items.Add("")
        CboTBReason2.Properties.Items.Add("")
        CboTBReason3.Properties.Items.Add("")
        CboHyReason1.Properties.Items.Add("")
        CboHyReason2.Properties.Items.Add("")
        CboHyReason3.Properties.Items.Add("")
        Dim CmdReason As New MySqlCommand("Select * from tblreason", Cnndb)
        Rdr = CmdReason.ExecuteReader
        While Rdr.Read
            CboARVReason1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboARVReason2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboARVReason3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboARVReason4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboARVReason5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboARVReason6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboARVReason7.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboARVReason8.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboOIReason1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboOIReason2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboOIReason3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboOIReason4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboOIReason5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboTBReason1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboTBReason2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboTBReason3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboHyReason1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboHyReason2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboHyReason3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()


        dtCause = New DataTable
        dtCause.Columns.Add("ID", GetType(String))
        dtCause.Columns.Add("Cause", GetType(String))
        Dim CmdCause As New MySqlCommand("SELECT * FROM preart.tblcausedeath where Status=1 order by Ctype, Cause;", Cnndb)
        Rdr = CmdCause.ExecuteReader
        While Rdr.Read
            dtCause.Rows.Add(Rdr.GetValue(0).ToString.Trim, Rdr.GetValue(2).ToString.Trim)
        End While
        Rdr.Close()
        Dim n As Integer = dtCause.Rows.Count()
        If n < 7 Then
            LueCauseDeath.Properties.DropDownRows = n
        Else
            LueCauseDeath.Properties.DropDownRows = 7
        End If
        LueCauseDeath.Properties.DataSource = dtCause
        LueCauseDeath.Properties.DisplayMember = "Cause"
        LueCauseDeath.Properties.ValueMember = "ID"
        'LueCauseDeath.Properties.PopulateColumns()
        'LueCauseDeath.Properties.ShowHeader = False
        'LueCauseDeath.Properties.Columns("ID").Visible = False
        'LueCauseDeath.EditValue = 0

        dtCountries = New DataTable
        dtCountries.Columns.Add("ID", GetType(String))
        dtCountries.Columns.Add("Country", GetType(String))
        Dim CmdCountries As New MySqlCommand("SELECT * FROM preart.tblnationality order by Nid, Nationality;", Cnndb)
        Rdr = CmdCountries.ExecuteReader
        While Rdr.Read
            dtCountries.Rows.Add(Rdr.GetValue(0).ToString.Trim, Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        Dim c As Integer = dtCause.Rows.Count()
        If c < 7 Then
            LueCountries.Properties.DropDownRows = c
        Else
            LueCountries.Properties.DropDownRows = 7
        End If
        LueCountries.Properties.DataSource = dtCountries
        LueCountries.Properties.DisplayMember = "Country"
        LueCountries.Properties.ValueMember = "ID"
    End Sub
#Region "Function"
    Private Sub Clear()
        Stage = -1
        txtClinicID.Enabled = True
        txtClinicID.Text = ""
        TabControl1.SelectedIndex = 1
        txtClinicID.Focus()
        txtART.Text = ""
        txtAge.Text = ""
        DaVisit.Text = "01/01/1900"
        RdSex.SelectedIndex = -1
        RdVisitStatus.SelectedIndex = -1
        RdPregnantStatus.SelectedIndex = -1
        RdTypePregnant.SelectedIndex = -1
        DaPregnant.Text = "01/01/1900"
        txtWeight.Text = ""
        txtHeight.Text = ""
        txtTemp.Text = ""
        txtPulse.Text = ""
        txtResp.Text = ""
        txtBlood1.Text = ""
        txtBlood2.Text = ""
        chkPrevention.Checked = False
        chkAdherence.Checked = False
        chkspacing.Checked = False
        chkTBinfect.Checked = False
        chkpartner.Checked = False
        chkcondom.Checked = False
        RdTypeClient.SelectedIndex = -1
        DaUse.Text = "01/01/1900"
        RdUse.SelectedIndex = -1
        RdPOC.SelectedIndex = -1
        chkPlaceService.Checked = False
        RdUsing.SelectedIndex = -1
        RdPOCu.SelectedIndex = -1
        RdCough.SelectedIndex = -1
        RdFever.SelectedIndex = -1
        RdLostWeight.SelectedIndex = -1
        Rdsweet.SelectedIndex = -1
        RdUrine.SelectedIndex = -1
        RdGenital.SelectedIndex = -1
        RdChemnah.SelectedIndex = -1
        RdHospital.SelectedIndex = -1
        RdMissARV.SelectedIndex = -1
        RdWHO.SelectedIndex = -1
        RdEligible.SelectedIndex = -1
        txtCD4.Text = ""
        DaCD4.Text = "01/01/1900"
        txtViralload.Text = ""
        DaViralload.Text = "01/01/1900"
        RdFunction.SelectedIndex = -1
        RdTB.SelectedIndex = -1
        ChkGrAG.Checked = False
        ChkTestHIV.Checked = False
        RdTBresult.SelectedIndex = -1
        RdTBtreat.SelectedIndex = -1
        DaTB.Text = "01/01/1900"
        RdResultHIV.SelectedIndex = -1
        RdCD4.SelectedIndex = -1
        RdHivViral.SelectedIndex = -1
        RdHCVviral.SelectedIndex = -1
        RdResultCrAG.SelectedIndex = -1
        RdViralDetech.SelectedIndex = -1
        RdRefer.SelectedIndex = -1
        ChkModerate.Checked = False
        chkPeripheral.Checked = False
        chkABC.Checked = False
        chkTDF.Checked = False
        chkAZT.Checked = False
        chkATV.Checked = False
        chkRash.Checked = False
        chkLPV.Checked = False
        chkLactic.Checked = False
        chkMediOther.Checked = False
        chkHepatitis.Checked = False
        CboARVdrug1.SelectedIndex = -1
        CboARVdrug2.SelectedIndex = -1
        CboARVdrug3.SelectedIndex = -1
        CboARVdrug4.SelectedIndex = -1
        CboARVdrug5.SelectedIndex = -1
        CboARVdrug6.SelectedIndex = -1
        CboARVdrug7.SelectedIndex = -1
        CboARVdrug8.SelectedIndex = -1
        CboOIdrug1.SelectedIndex = -1
        CboOIdrug2.SelectedIndex = -1
        CboOIdrug3.SelectedIndex = -1
        CboOIdrug4.SelectedIndex = -1
        CboOIdrug5.SelectedIndex = -1
        cboTBdrug1.SelectedIndex = -1
        cboTBdrug2.SelectedIndex = -1
        cboTBdrug3.SelectedIndex = -1
        cboHydrug1.SelectedIndex = -1
        cboHydrug2.SelectedIndex = -1
        cboHydrug3.SelectedIndex = -1
        RdPatientStatus.SelectedIndex = -1
        RdPlaceDead.SelectedIndex = -1
        RdCauseDeath.SelectedIndex = -1 'add by sithorn
        CboTransferOut.SelectedIndex = -1
        DaAppoint.Text = "01/01/1900"
        RdARVdrugStatus1.SelectedIndex = -1
        RdARVdrugStatus2.SelectedIndex = -1
        RdARVdrugStatus3.SelectedIndex = -1
        RdARVdrugStatus4.SelectedIndex = -1
        RdARVdrugStatus5.SelectedIndex = -1
        RdARVdrugStatus6.SelectedIndex = -1
        RdARVdrugStatus7.SelectedIndex = -1
        RdARVdrugStatus8.SelectedIndex = -1
        RdOIdrugStatus1.SelectedIndex = -1
        RdOIdrugStatus2.SelectedIndex = -1
        RdOIdrugStatus3.SelectedIndex = -1
        RdOIdrugStatus4.SelectedIndex = -1
        RdOIdrugStatus5.SelectedIndex = -1
        RdTBdrugStatus1.SelectedIndex = -1
        RdTBdrugStatus2.SelectedIndex = -1
        RdTBdrugStatus3.SelectedIndex = -1
        RdPregnantStatus.Enabled = True
        txtART.Enabled = True
        txtClinicID.Enabled = True
        txtART.Enabled = True
        RdHydrugStatus1.SelectedIndex = -1
        RdHydrugStatus2.SelectedIndex = -1
        RdHydrugStatus3.SelectedIndex = -1
        RdResultHype.SelectedIndex = -1
        CboDoctore.Enabled = False
        CboMeetTime.Enabled = False
        CboMeetTime.SelectedIndex = -1
        CboDoctore.SelectedIndex = -1
        tsbDelete.Enabled = False
        tsbDelete1.Enabled = False
        ToolStripButton3.Enabled = False
        Vid = 0
        ApID = 0
        id = 0
        RdPregnantStatus.Enabled = False
        RdARVline.SelectedIndex = -1
        RdTPT.SelectedIndex = -1
        RdTBout.SelectedIndex = -1
        RdTPTdrugStatus1.SelectedIndex = -1
        RdTPTdrugStatus2.SelectedIndex = -1
        RdTPTdrugStatus3.SelectedIndex = -1
        RdTPTdrugStatus4.SelectedIndex = -1
        CboTPTdrug1.SelectedIndex = -1
        CboTPTdrug2.SelectedIndex = -1
        CboTPTdrug3.SelectedIndex = -1
        CboTPTdrug4.SelectedIndex = -1
        re = -1
        RdFoWorker.SelectedIndex = -1
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
    Private Sub Save()
        If CboDoctore.SelectedIndex = -1 And RdPatientStatus.SelectedIndex = -1 Then MessageBox.Show("Please Select Doctor Name", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If CboMeetTime.SelectedIndex = -1 And RdPatientStatus.SelectedIndex = -1 Then MessageBox.Show("Please Select time meet with doctor.", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If txtART.Text.Trim = "" And RdPatientStatus.SelectedIndex = 3 Then MessageBox.Show("Patient PreART can not select transfer out.", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        'add form cause of death by sithorn......
        'If RdPatientStatus.SelectedIndex = 1 And DaOutcome.EditValue Is "01/01/1900" Then MessageBox.Show("Please Input the date of death", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If CDate(DaVisit.EditValue) >= CDate("09/08/2023") Then
            If RdPatientStatus.SelectedIndex = 1 And RdCauseDeath.SelectedIndex = -1 Then MessageBox.Show("Please Select the cause type of death", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
            If RdPatientStatus.SelectedIndex = 1 And LueCauseDeath.EditValue Is Nothing Then MessageBox.Show("Please Select cause of death", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        End If

        Dim strCause As String = ""
        If LueCauseDeath.EditValue IsNot Nothing Then
            If String.Equals(LueCauseDeath.EditValue, "99") Then
                strCause = RdCauseDeath.SelectedIndex & "/" & txtOutDeath.Text
            Else
                strCause = RdCauseDeath.SelectedIndex & "/" & CStr(LueCauseDeath.EditValue)
            End If
        End If
        '........................
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("តើលោកអ្នកពិតជាចង់រក្សាទុកមែនទេ ?", "Save.....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                '   Dim x As String = Format(CDate(DaVisit.EditValue), "ddMMyy") & txtClinicID.Text
                If CDate(DaVisit.Text) >= CDate(DaAppoint.Text) And RdPatientStatus.SelectedIndex = -1 Then
                    MessageBox.Show("Next Appointment Date must be greater than Visit Date", "Check Appointment Date!", MessageBoxButtons.OK, MessageBoxIcon.Error)
                    Exit Sub
                End If
                Vid = Val(txtClinicID.Text) & Format(CDate(DaVisit.EditValue), "ddMMyy")
                Dim k1 As String = txtBlood1.Text & "/" & txtBlood2.Text
                Dim CmdMain As New MySqlCommand("Insert into tblavmain values('" & txtClinicID.Text & "','" & txtART.Text.Trim & "','" & Format(CDate(DaVisit.EditValue), "yyyy-MM-dd") & "','" & RdVisitStatus.SelectedIndex & "','" & RdPregnantStatus.SelectedIndex & "','" & RdTypePregnant.SelectedIndex & "','" & Format(CDate(DaPregnant.EditValue), "yyyy-MM-dd") & "','" & RdANC.SelectedIndex & "','" & Val(txtWeight.Text) & "','" & Val(txtHeight.Text) & "','" & Val(txtTemp.Text) & "','" & Val(txtPulse.Text) & "','" & Val(txtResp.Text) & "','" & k1 & "'," &
                                        " '" & chkPrevention.Checked & "','" & chkAdherence.Checked & "','" & chkspacing.Checked & "','" & chkTBinfect.Checked & "','" & chkpartner.Checked & "','" & chkcondom.Checked & "','" & RdTypeClient.SelectedIndex & "','" & Format(CDate(DaUse.EditValue), "yyyy-MM-dd") & "','" & txtCondom.Text & "','" & txtCOC.Text & "','" & txtPOC.Text & "','" & txtDrug.Text & "','" & chkPlaceService.Checked & "','" & txtCondomU.Text & "','" & txtCOCu.Text & "','" & txtPOCu.Text & "','" & txtDrugu.Text & "'," &
                                        "'" & txtOtherU.Text & "','" & RdCough.SelectedIndex & "','" & RdFever.SelectedIndex & "','" & RdLostWeight.SelectedIndex & "','" & Rdsweet.SelectedIndex & "','" & RdUrine.SelectedIndex & "','" & RdGenital.SelectedIndex & "','" & RdChemnah.SelectedIndex & "','" & RdHospital.SelectedIndex & "','" & txtNumHosptital.Text & "','" & txtReasonHoptital.Text & "','" & RdMissARV.SelectedIndex & "','" & txtMissTime.Text & "','" & RdWHO.SelectedIndex & "'," &
                                        "'" & RdEligible.SelectedIndex & "','" & Tid & "','" & RdFunction.SelectedIndex & "','" & RdTB.SelectedIndex & "','" & RdTBresult.SelectedIndex & "','" & RdTBtreat.SelectedIndex & "','" & Format(CDate(DaTB.EditValue), "yyyy-MM-dd") & "','" & ChkTestHIV.Checked & "','" & RdResultHIV.SelectedIndex & "','" & RdCD4.SelectedIndex & "','" & RdHivViral.SelectedIndex & "','" & RdHCVviral.SelectedIndex & "','" & ChkGrAG.Checked & "','" & RdResultCrAG.SelectedIndex & "'," &
                                        "'" & RdViralDetech.SelectedIndex & "','" & RdRefer.SelectedIndex & "','" & txtReferOther.Text.Trim & "','" & ChkModerate.Checked & "','" & chkTDF.Checked & "','" & chkRash.Checked & "','" & chkHepatitis.Checked & "','" & chkPeripheral.Checked & "','" & chkAZT.Checked & "','" & chkLPV.Checked & "','" & chkLactic.Checked & "','" & chkABC.Checked & "','" & chkATV.Checked & "','" & txtMediOther.Text & "','" & RdARVline.SelectedIndex & "','" & RdResultHype.SelectedIndex & "','" & RdTPT.SelectedIndex & "','" & RdTBout.SelectedIndex & "','" & Format(CDate(DaAppoint.EditValue), "yyyy-MM-dd") & "','" & Vid & "','" & RdFoWorker.SelectedIndex & "','" & CInt(LueCountries.EditValue) & "')", Cnndb)
                CmdMain.ExecuteNonQuery()
                Select Case RdPatientStatus.SelectedIndex
            'lost
                    Case 0
                        'death
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                    Case 1
                        'neg
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()

                    Case 2
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                'transfer
                    Case 3
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaVisit.EditValue), "yyyy-MM-dd") & "','" & CboTransferOut.Text & "','" & Vid & "')", Cnndb)
                        CmdStatus.ExecuteNonQuery()
                End Select

                If Trim(CboARVdrug1.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug1.Text & "','" & CboARVDose1.Text & "','" & Val(txtARVquan1.Text) & "','" & CboARVRFreq1.Text & "','" & CboARVform1.Text & "','" & RdARVdrugStatus1.SelectedIndex & "','" & Format(CDate(DaARV1.EditValue), "yyyy/MM/dd") & "','" & CboARVReason1.Text & "','" & CboARVRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug2.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug2.Text & "','" & CboARVDose2.Text & "','" & Val(txtARVquan2.Text) & "','" & CboARVRFreq2.Text & "','" & CboARVform2.Text & "','" & RdARVdrugStatus2.SelectedIndex & "','" & Format(CDate(DaARV2.EditValue), "yyyy/MM/dd") & "','" & CboARVReason2.Text & "','" & CboARVRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug3.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug3.Text & "','" & CboARVDose3.Text & "','" & Val(txtARVquan3.Text) & "','" & CboARVRFreq3.Text & "','" & CboARVform3.Text & "','" & RdARVdrugStatus3.SelectedIndex & "','" & Format(CDate(DaARV3.EditValue), "yyyy/MM/dd") & "','" & CboARVReason3.Text & "','" & CboARVRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug4.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug4.Text & "','" & CboARVDose4.Text & "','" & Val(txtARVquan4.Text) & "','" & CboARVRFreq4.Text & "','" & CboARVform4.Text & "','" & RdARVdrugStatus4.SelectedIndex & "','" & Format(CDate(DaARV4.EditValue), "yyyy/MM/dd") & "','" & CboARVReason4.Text & "','" & CboARVRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug5.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug5.Text & "','" & CboARVDose5.Text & "','" & Val(txtARVquan5.Text) & "','" & CboARVRFreq5.Text & "','" & CboARVform5.Text & "','" & RdARVdrugStatus5.SelectedIndex & "','" & Format(CDate(DaARV5.EditValue), "yyyy/MM/dd") & "','" & CboARVReason5.Text & "','" & CboARVRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug6.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug6.Text & "','" & CboARVDose6.Text & "','" & Val(txtARVquan6.Text) & "','" & CboARVRFreq6.Text & "','" & CboARVform6.Text & "','" & RdARVdrugStatus6.SelectedIndex & "','" & Format(CDate(DaARV6.EditValue), "yyyy/MM/dd") & "','" & CboARVReason6.Text & "','" & CboARVRemark6.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug1.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug1.Text & "','" & CboOIdose1.Text & "','" & Val(txtOIQuan1.Text) & "','" & CboOIFreq1.Text & "','" & CboOIForm1.Text & "','" & RdOIdrugStatus1.SelectedIndex & "','" & Format(CDate(DaOI1.EditValue), "yyyy/MM/dd") & "','" & CboOIReason1.Text & "','" & CboOIRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug2.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug2.Text & "','" & CboOIdose2.Text & "','" & Val(txtOIQuan2.Text) & "','" & CboOIFreq2.Text & "','" & CboOIForm2.Text & "','" & RdOIdrugStatus2.SelectedIndex & "','" & Format(CDate(DaOI2.EditValue), "yyyy/MM/dd") & "','" & CboOIReason2.Text & "','" & CboOIRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug3.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug3.Text & "','" & CboOIdose3.Text & "','" & Val(txtOIQuan3.Text) & "','" & CboOIFreq3.Text & "','" & CboOIForm3.Text & "','" & RdOIdrugStatus3.SelectedIndex & "','" & Format(CDate(DaOI3.EditValue), "yyyy/MM/dd") & "','" & CboOIReason3.Text & "','" & CboOIRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug4.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug4.Text & "','" & CboOIdose4.Text & "','" & Val(txtOIQuan4.Text) & "','" & CboOIFreq4.Text & "','" & CboOIForm4.Text & "','" & RdOIdrugStatus4.SelectedIndex & "','" & Format(CDate(DaOI4.EditValue), "yyyy/MM/dd") & "','" & CboOIReason4.Text & "','" & CboOIRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug5.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug5.Text & "','" & CboOIdose5.Text & "','" & Val(txtOIQuan5.Text) & "','" & CboOIFreq5.Text & "','" & CboOIForm5.Text & "','" & RdOIdrugStatus5.SelectedIndex & "','" & Format(CDate(DaOI5.EditValue), "yyyy/MM/dd") & "','" & CboOIReason5.Text & "','" & CboOIRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug1.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblavtbdrug values('" & cboTBdrug1.Text & "','" & CboTBdose1.Text & "','" & Val(txtTBQuan1.Text) & "','" & CboTBFreq1.Text & "','" & CboTBForm1.Text & "','" & RdTBdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTB1.EditValue), "yyyy/MM/dd") & "','" & CboTBReason1.Text & "','" & CboTBRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug2.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblavtbdrug values('" & cboTBdrug2.Text & "','" & CboTBdose2.Text & "','" & Val(txtTBQuan2.Text) & "','" & CboTBFreq2.Text & "','" & CboTBForm2.Text & "','" & RdTBdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTB2.EditValue), "yyyy/MM/dd") & "','" & CboTBReason2.Text & "','" & CboTBRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug3.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblavtbdrug values('" & cboTBdrug3.Text & "','" & CboTBdose3.Text & "','" & Val(txtTBQuan3.Text) & "','" & CboTBFreq3.Text & "','" & CboTBForm3.Text & "','" & RdTBdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTB3.EditValue), "yyyy/MM/dd") & "','" & CboTBReason3.Text & "','" & CboTBRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboHydrug1.Text) <> "" Then
                    Dim CmdInsertHy As MySqlCommand = New MySqlCommand("insert into tblavhydrug values('" & cboHydrug1.Text & "','" & CboHydose1.Text & "','" & Val(txtHyQuan1.Text) & "','" & CboHyFreq1.Text & "','" & CboHyForm1.Text & "','" & RdHydrugStatus1.SelectedIndex & "','" & Format(CDate(DaHy1.EditValue), "yyyy/MM/dd") & "','" & CboHyReason1.Text & "','" & CboHyRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertHy.ExecuteNonQuery()
                End If
                If Trim(cboHydrug2.Text) <> "" Then
                    Dim CmdInsertHy As MySqlCommand = New MySqlCommand("insert into tblavhydrug values('" & cboHydrug2.Text & "','" & CboHydose2.Text & "','" & Val(txtHyQuan2.Text) & "','" & CboHyFreq2.Text & "','" & CboHyForm2.Text & "','" & RdHydrugStatus2.SelectedIndex & "','" & Format(CDate(DaHy2.EditValue), "yyyy/MM/dd") & "','" & CboHyReason2.Text & "','" & CboHyRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertHy.ExecuteNonQuery()
                End If
                If Trim(cboHydrug3.Text) <> "" Then
                    Dim CmdInsertHy As MySqlCommand = New MySqlCommand("insert into tblavhydrug values('" & cboHydrug3.Text & "','" & CboHydose3.Text & "','" & Val(txtHyQuan3.Text) & "','" & CboHyFreq3.Text & "','" & CboHyForm3.Text & "','" & RdHydrugStatus3.SelectedIndex & "','" & Format(CDate(DaHy3.EditValue), "yyyy/MM/dd") & "','" & CboHyReason3.Text & "','" & CboHyRemark3.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertHy.ExecuteNonQuery()
                End If
                If CboTPTdrug1.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug1.Text & "','" & CboTPTdose1.Text & "','" & Val(txtTPTQuan1.Text) & "','" & CboTPTFreq1.Text & "','" & CboTPTForm1.Text & "','" & RdTPTdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTPT1.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason1.Text & "','" & CboTPTRemark1.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug2.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug2.Text & "','" & CboTPTdose2.Text & "','" & Val(txtTPTQuan2.Text) & "','" & CboTPTFreq2.Text & "','" & CboTPTForm2.Text & "','" & RdTPTdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTPT2.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason2.Text & "','" & CboTPTRemark2.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug3.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug3.Text & "','" & CboTPTdose3.Text & "','" & Val(txtTPTQuan3.Text) & "','" & CboTPTFreq3.Text & "','" & CboTPTForm3.Text & "','" & RdTPTdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTPT3.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason3.Text & "','" & CboTPTRemark3.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug4.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug4.Text & "','" & CboTPTdose4.Text & "','" & Val(txtTPTQuan4.Text) & "','" & CboTPTFreq4.Text & "','" & CboTPTForm4.Text & "','" & RdTPTdrugStatus4.SelectedIndex & "','" & Format(CDate(DaTPT4.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason4.Text & "','" & CboTPTRemark4.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                Try
                    If txtART.Enabled = True And txtART.Text.Trim <> "" Then
                        If id = 0 Then
                            Daart = CDate(DaVisit.EditValue)
                        End If
                        If TyR = 1 Then
                            Daart = CDate(DaVisit.EditValue)
                        End If
                        'MessageBox.Show("Daart: " & Daart)
                        Dim CmdSaveArt As New MySqlCommand("insert into tblaart values('" & txtClinicID.Text & "','" & txtART.Text & "','" & Format(Daart, "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                        CmdSaveArt.ExecuteNonQuery()
                    End If
                Catch ex As Exception
                End Try
                Select Case RdVisitStatus.SelectedIndex
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
                ' Try
                Dim CmdApp As New MySqlCommand("Insert into tblAppointment values('" & Vid & "','" & CboDoctore.Text.Substring(0, CboDoctore.Text.IndexOf("/")) & "','" & CboMeetTime.SelectedIndex & "','0')", Cnndb)
                CmdApp.ExecuteNonQuery()
                'Catch ex1 As Exception
                'End Try
                MessageBox.Show("រក្សាទុកបានជោគជ័យ..", "Save....", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAVmain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
            End If
        Else
            If MessageBox.Show("តើលោកអ្នកចង់កែតម្រូវទិន្នន័យនេះមែនទេ..?", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim k1 As String = txtBlood1.Text & "/" & txtBlood2.Text
                Dim CmdMain As New MySqlCommand("Update tblavmain set Womenstatus='" & RdPregnantStatus.SelectedIndex & "',PregStatus='" & RdTypePregnant.SelectedIndex & "',DaPreg='" & Format(CDate(DaPregnant.EditValue), "yyyy-MM-dd") & "',ANCservice='" & RdANC.SelectedIndex & "',Weight='" & Val(txtWeight.Text) & "',Height='" & Val(txtHeight.Text) & "',Temp='" & Val(txtTemp.Text) & "',Pulse='" & Val(txtPulse.Text) & "',Resp='" & Val(txtResp.Text) & "',Blood='" & k1 & "'," &
                                        " STIPreven='" & chkPrevention.Checked & "',ARTAdher='" & chkAdherence.Checked & "',Birthspac='" & chkspacing.Checked & "',TBinfect='" & chkTBinfect.Checked & "',Partner='" & chkpartner.Checked & "',Condoms='" & chkcondom.Checked & "',CMTypeClient='" & RdTypeClient.SelectedIndex & "',CMDaUse='" & Format(CDate(DaUse.EditValue), "yyyy-MM-dd") & "',CMCondom='" & txtCondom.Text & "',CoC='" & txtCOC.Text & "',Poc='" & txtPOC.Text & "',CMVaccine='" & txtDrug.Text & "',UseOther='" & chkPlaceService.Checked & "',OCMcondom='" & txtCondomU.Text & "',OCoc='" & txtCOCu.Text & "',OPoC='" & txtPOCu.Text & "',OCMVaccin='" & txtDrugu.Text & "'," &
                                        "OCMother='" & txtOtherU.Text & "',Cough='" & RdCough.SelectedIndex & "',Fever='" & RdFever.SelectedIndex & "',Wlost='" & RdLostWeight.SelectedIndex & "',Drenching='" & Rdsweet.SelectedIndex & "',Urine='" & RdUrine.SelectedIndex & "',Genital='" & RdGenital.SelectedIndex & "',Chemnah='" & RdChemnah.SelectedIndex & "',Hospital='" & RdHospital.SelectedIndex & "',NumDay='" & txtNumHosptital.Text & "',CauseHospital='" & txtReasonHoptital.Text & "',MissARV='" & RdMissARV.SelectedIndex & "',MissTime='" & txtMissTime.Text & "',WHO='" & RdWHO.SelectedIndex & "'," &
                                        "Eligible='" & RdEligible.SelectedIndex & "',`Function`='" & RdFunction.SelectedIndex & "',TB='" & RdTB.SelectedIndex & "',TypeTB='" & RdTBresult.SelectedIndex & "',TBtreat='" & RdTBtreat.SelectedIndex & "',DaTBtreat='" & Format(CDate(DaTB.EditValue), "yyyy-MM-dd") & "',TestHIV='" & ChkTestHIV.Checked & "',ResultHIV='" & RdResultHIV.SelectedIndex & "',ReCD4='" & RdCD4.SelectedIndex & "',ReVL='" & RdHivViral.SelectedIndex & "',ReHCV='" & RdHCVviral.SelectedIndex & "',CrAG='" & ChkGrAG.Checked & "',CrAGResult='" & RdResultCrAG.SelectedIndex & "'," &
                                        "VLDetectable='" & RdViralDetech.SelectedIndex & "',Referred='" & RdRefer.SelectedIndex & "',OReferred='" & txtReferOther.Text.Trim & "',Moderate='" & ChkModerate.Checked & "',Renal='" & chkTDF.Checked & "',Rash='" & chkRash.Checked & "',Hepatitis='" & chkHepatitis.Checked & "',Peripheral='" & chkPeripheral.Checked & "',Neutropenia='" & chkAZT.Checked & "',Hyperlipidemia='" & chkLPV.Checked & "',Lactic='" & chkLactic.Checked & "',Hypersensitivity='" & chkABC.Checked & "',Jaundice='" & chkATV.Checked & "',ARVreg='" & RdARVline.SelectedIndex & "',MTother='" & txtMediOther.Text & "',ResultHC='" & RdResultHype.SelectedIndex & "',TPTout='" & RdTPT.SelectedIndex & "',TBout='" & RdTBout.SelectedIndex & "',Foworker='" & RdFoWorker.SelectedIndex & "',Country='" & CInt(LueCountries.EditValue) & "' where Vid='" & Vid & "'", Cnndb)
                CmdMain.ExecuteNonQuery()
                Dim CmdApp As New MySqlCommand("Update tblAppointment set Doctore='" & CboDoctore.Text.Substring(0, CboDoctore.Text.IndexOf("/")) & "',Time='" & CboMeetTime.SelectedIndex & "' where Vid='" & Vid & "' ", Cnndb)
                CmdApp.ExecuteNonQuery()
                Dim CmdDels As New MySqlCommand("Delete from tblavpatientstatus where vid ='" & Vid & "'", Cnndb)
                CmdDels.ExecuteNonQuery()
                Select Case RdPatientStatus.SelectedIndex
            'lost
                    Case 0
                        'death
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                    Case 1
                        'neg
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()

                    Case 2
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                'transfer
                    Case 3
                        Dim CmdStatus As New MySqlCommand("Insert into tblavpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaVisit.EditValue), "yyyy-MM-dd") & "','" & CboTransferOut.Text & "','" & Vid & "')", Cnndb)
                        CmdStatus.ExecuteNonQuery()
                End Select

                Dim CmdDelARV As New MySqlCommand("Delete from tblavarvdrug where Vid='" & Vid & "'", Cnndb)
                CmdDelARV.ExecuteNonQuery()
                If Trim(CboARVdrug1.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug1.Text & "','" & CboARVDose1.Text & "','" & Val(txtARVquan1.Text) & "','" & CboARVRFreq1.Text & "','" & CboARVform1.Text & "','" & RdARVdrugStatus1.SelectedIndex & "','" & Format(CDate(DaARV1.EditValue), "yyyy/MM/dd") & "','" & CboARVReason1.Text & "','" & CboARVRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug2.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug2.Text & "','" & CboARVDose2.Text & "','" & Val(txtARVquan2.Text) & "','" & CboARVRFreq2.Text & "','" & CboARVform2.Text & "','" & RdARVdrugStatus2.SelectedIndex & "','" & Format(CDate(DaARV2.EditValue), "yyyy/MM/dd") & "','" & CboARVReason2.Text & "','" & CboARVRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug3.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug3.Text & "','" & CboARVDose3.Text & "','" & Val(txtARVquan3.Text) & "','" & CboARVRFreq3.Text & "','" & CboARVform3.Text & "','" & RdARVdrugStatus3.SelectedIndex & "','" & Format(CDate(DaARV3.EditValue), "yyyy/MM/dd") & "','" & CboARVReason3.Text & "','" & CboARVRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug4.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug4.Text & "','" & CboARVDose4.Text & "','" & Val(txtARVquan4.Text) & "','" & CboARVRFreq4.Text & "','" & CboARVform4.Text & "','" & RdARVdrugStatus4.SelectedIndex & "','" & Format(CDate(DaARV4.EditValue), "yyyy/MM/dd") & "','" & CboARVReason4.Text & "','" & CboARVRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug5.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug5.Text & "','" & CboARVDose5.Text & "','" & Val(txtARVquan5.Text) & "','" & CboARVRFreq5.Text & "','" & CboARVform5.Text & "','" & RdARVdrugStatus5.SelectedIndex & "','" & Format(CDate(DaARV5.EditValue), "yyyy/MM/dd") & "','" & CboARVReason5.Text & "','" & CboARVRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug6.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblavarvdrug values('" & CboARVdrug6.Text & "','" & CboARVDose6.Text & "','" & Val(txtARVquan6.Text) & "','" & CboARVRFreq6.Text & "','" & CboARVform6.Text & "','" & RdARVdrugStatus6.SelectedIndex & "','" & Format(CDate(DaARV6.EditValue), "yyyy/MM/dd") & "','" & CboARVReason6.Text & "','" & CboARVRemark6.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If

                Dim CmdOI As New MySqlCommand("Delete from tblavoidrug where vid ='" & Vid & "'", Cnndb)
                CmdOI.ExecuteNonQuery()
                If Trim(CboOIdrug1.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug1.Text & "','" & CboOIdose1.Text & "','" & Val(txtOIQuan1.Text) & "','" & CboOIFreq1.Text & "','" & CboOIForm1.Text & "','" & RdOIdrugStatus1.SelectedIndex & "','" & Format(CDate(DaOI1.EditValue), "yyyy/MM/dd") & "','" & CboOIReason1.Text & "','" & CboOIRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug2.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug2.Text & "','" & CboOIdose2.Text & "','" & Val(txtOIQuan2.Text) & "','" & CboOIFreq2.Text & "','" & CboOIForm2.Text & "','" & RdOIdrugStatus2.SelectedIndex & "','" & Format(CDate(DaOI2.EditValue), "yyyy/MM/dd") & "','" & CboOIReason2.Text & "','" & CboOIRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug3.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug3.Text & "','" & CboOIdose3.Text & "','" & Val(txtOIQuan3.Text) & "','" & CboOIFreq3.Text & "','" & CboOIForm3.Text & "','" & RdOIdrugStatus3.SelectedIndex & "','" & Format(CDate(DaOI3.EditValue), "yyyy/MM/dd") & "','" & CboOIReason3.Text & "','" & CboOIRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug4.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug4.Text & "','" & CboOIdose4.Text & "','" & Val(txtOIQuan4.Text) & "','" & CboOIFreq4.Text & "','" & CboOIForm4.Text & "','" & RdOIdrugStatus4.SelectedIndex & "','" & Format(CDate(DaOI4.EditValue), "yyyy/MM/dd") & "','" & CboOIReason4.Text & "','" & CboOIRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug5.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblavoidrug values('" & CboOIdrug5.Text & "','" & CboOIdose5.Text & "','" & Val(txtOIQuan5.Text) & "','" & CboOIFreq5.Text & "','" & CboOIForm5.Text & "','" & RdOIdrugStatus5.SelectedIndex & "','" & Format(CDate(DaOI5.EditValue), "yyyy/MM/dd") & "','" & CboOIReason5.Text & "','" & CboOIRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If

                Dim CmdTB As New MySqlCommand("Delete from tblavtbdrug where vid='" & Vid & "'", Cnndb)
                CmdTB.ExecuteNonQuery()
                If Trim(cboTBdrug1.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblavtbdrug values('" & cboTBdrug1.Text & "','" & CboTBdose1.Text & "','" & Val(txtTBQuan1.Text) & "','" & CboTBFreq1.Text & "','" & CboTBForm1.Text & "','" & RdTBdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTB1.EditValue), "yyyy/MM/dd") & "','" & CboTBReason1.Text & "','" & CboTBRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug2.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblavtbdrug values('" & cboTBdrug2.Text & "','" & CboTBdose2.Text & "','" & Val(txtTBQuan2.Text) & "','" & CboTBFreq2.Text & "','" & CboTBForm2.Text & "','" & RdTBdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTB2.EditValue), "yyyy/MM/dd") & "','" & CboTBReason2.Text & "','" & CboTBRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug3.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblavtbdrug values('" & cboTBdrug3.Text & "','" & CboTBdose3.Text & "','" & Val(txtTBQuan3.Text) & "','" & CboTBFreq3.Text & "','" & CboTBForm3.Text & "','" & RdTBdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTB3.EditValue), "yyyy/MM/dd") & "','" & CboTBReason3.Text & "','" & CboTBRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                Dim CmdHy As New MySqlCommand("Delete from tblavhydrug where vid='" & Vid & "'", Cnndb)
                CmdHy.ExecuteNonQuery()
                If Trim(cboHydrug1.Text) <> "" Then
                    Dim CmdInsertHy As MySqlCommand = New MySqlCommand("insert into tblavhydrug values('" & cboHydrug1.Text & "','" & CboHydose1.Text & "','" & Val(txtHyQuan1.Text) & "','" & CboHyFreq1.Text & "','" & CboHyForm1.Text & "','" & RdHydrugStatus1.SelectedIndex & "','" & Format(CDate(DaHy1.EditValue), "yyyy/MM/dd") & "','" & CboHyReason1.Text & "','" & CboHyRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertHy.ExecuteNonQuery()
                End If
                If Trim(cboHydrug2.Text) <> "" Then
                    Dim CmdInsertHy As MySqlCommand = New MySqlCommand("insert into tblavhydrug values('" & cboHydrug2.Text & "','" & CboHydose2.Text & "','" & Val(txtHyQuan2.Text) & "','" & CboHyFreq2.Text & "','" & CboHyForm2.Text & "','" & RdHydrugStatus2.SelectedIndex & "','" & Format(CDate(DaHy2.EditValue), "yyyy/MM/dd") & "','" & CboHyReason2.Text & "','" & CboHyRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertHy.ExecuteNonQuery()
                End If
                If Trim(cboHydrug3.Text) <> "" Then
                    Dim CmdInsertHy As MySqlCommand = New MySqlCommand("insert into tblavhydrug values('" & cboHydrug3.Text & "','" & CboHydose3.Text & "','" & Val(txtHyQuan3.Text) & "','" & CboHyFreq3.Text & "','" & CboHyForm3.Text & "','" & RdHydrugStatus3.SelectedIndex & "','" & Format(CDate(DaHy3.EditValue), "yyyy/MM/dd") & "','" & CboHyReason3.Text & "','" & CboHyRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertHy.ExecuteNonQuery()
                End If

                Dim CmdTP As New MySqlCommand("Delete from tblavtptdrug where vid='" & Vid & "'", Cnndb)
                CmdTP.ExecuteNonQuery()
                If CboTPTdrug1.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug1.Text & "','" & CboTPTdose1.Text & "','" & Val(txtTPTQuan1.Text) & "','" & CboTPTFreq1.Text & "','" & CboTPTForm1.Text & "','" & RdTPTdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTPT1.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason1.Text & "','" & CboTPTRemark1.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug2.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug2.Text & "','" & CboTPTdose2.Text & "','" & Val(txtTPTQuan2.Text) & "','" & CboTPTFreq2.Text & "','" & CboTPTForm2.Text & "','" & RdTPTdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTPT2.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason2.Text & "','" & CboTPTRemark2.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug3.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug3.Text & "','" & CboTPTdose3.Text & "','" & Val(txtTPTQuan3.Text) & "','" & CboTPTFreq3.Text & "','" & CboTPTForm3.Text & "','" & RdTPTdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTPT3.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason3.Text & "','" & CboTPTRemark3.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug4.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblavtptdrug values('" & CboTPTdrug4.Text & "','" & CboTPTdose4.Text & "','" & Val(txtTPTQuan4.Text) & "','" & CboTPTFreq4.Text & "','" & CboTPTForm4.Text & "','" & RdTPTdrugStatus4.SelectedIndex & "','" & Format(CDate(DaTPT4.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason4.Text & "','" & CboTPTRemark4.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                MessageBox.Show("កែតម្រូវបានជោគជ័យ!", "Edit....", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAVmain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
            End If
        End If
    End Sub

    Private Sub ViewData()
        Dim i As Double
        Dim CmdSearch As New MySqlCommand("SELECT     preart.tblaimain.ClinicID, preart.tblaimain.Dabirth, preart.tblaimain.Sex, preart.tblavmain.DatVisit, preart.tblavmain.TypeVisit, preart.tblavmain.WHO, preart.tblavmain.ARTnum, preart.tblavpatientstatus.Status, preart.tblavmain.DaApp ,preart.tblavmain.vid FROM         preart.tblavpatientstatus RIGHT OUTER JOIN preart.tblavmain ON preart.tblavpatientstatus.Vid = preart.tblavmain.Vid LEFT OUTER JOIN preart.tblaimain ON preart.tblavmain.ClinicID = preart.tblaimain.ClinicID ORDER BY preart.tblaimain.ClinicID,tblavmain.DatVisit", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
            dr(2) = Format(CDate(Rdr.GetValue(3).ToString), "dd/MM/yyyy")
            dr(4) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString))
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
            '  dr(6) = Rdr.GetValue(5).ToString.Trim
            dr(7) = Rdr.GetValue(6).ToString.Trim
            Select Case CDec(Rdr.GetValue(5).ToString)
                Case 0
                    dr(6) = 1
                Case 1
                    dr(6) = 2
                Case 2
                    dr(6) = 3
                Case 3
                    dr(6) = 4
            End Select
            If Rdr.GetValue(7).ToString.Trim <> "" Then
                Select Case CDec(Rdr.GetValue(7).ToString)
                    Case 0
                        dr(8) = "Lost"
                    Case 1
                        dr(8) = "Death"
                    Case 2
                        dr(8) = "HIV Negative"
                    Case 3
                        dr(8) = "Transfer Out"
                End Select
            End If
            dr(9) = Rdr.GetValue(8).ToString
            dr(10) = Rdr.GetValue(9).ToString
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub

    Private Sub checkSeche()
        Dim CmdSearch As MySqlCommand = New MySqlCommand("Select * from tblAVmain where clinicID='" & Val(txtClinicID.Text) & "' ORDER BY DatVisit  DESC Limit 1", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Vdate = Rdr.GetValue(2).ToString
            DaVisit.EditValue = Vdate
            txtWeight.Text = Trim(Rdr.GetValue(8).ToString)
            txtHeight.Text = Trim(Rdr.GetValue(9).ToString)
            txtTemp.Text = Trim(Rdr.GetValue(10).ToString)
            txtPulse.Text = Trim(Rdr.GetValue(11).ToString)
            txtResp.Text = Trim(Rdr.GetValue(12).ToString)
            Dim blood() As String = Split(Rdr.GetValue(13), "/")
            txtBlood1.Text = Trim(blood(0))
            txtBlood2.Text = Trim(blood(1))
            DateApp = Rdr.GetValue(77).ToString
            '    a = Trim(Rdr.GetValue(43).ToString)
            '   If CDec(Rdr.GetValue(45).ToString) = 0 Then
            RdEligible.SelectedIndex = Rdr.GetValue(45).ToString
            '  End If
            RdWHO.SelectedIndex = Rdr.GetValue(44).ToString
            Stage = Rdr.GetValue(44).ToString
            If CInt(Rdr.GetValue(59).ToString) <> 0 Then
                RdViralDetech.SelectedIndex = Rdr.GetValue(59).ToString 'sithorn
            End If
            re = Rdr.GetValue(73).ToString 'sithorn
            Vid = Trim(Rdr.GetValue(78).ToString)
            If Rdr.GetValue(52).ToString.Trim = "True" And CDec(Rdr.GetValue(53).ToString) = -1 Then
                ChkTestHIV.Checked = True
            End If
            ApID = Vid
        End While
        Rdr.Close()
    End Sub
    Private Sub CheckPat()
        If tsbDelete.Enabled = False Then
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
                ' txtClinicID.Text = ""
                Clear()
                txtClinicID.Focus()
                Exit Sub
            End While
            Rdr.Close()

            'sithorn......
            Dim CmdHasrw As New MySqlCommand("Select * from tblaumain where ClinicID='" & Val(txtClinicID.Text) & "'", ConnectionDB.Cnndb)
            Try
                Rdr = CmdHasrw.ExecuteReader
                If Not Rdr.HasRows Then
                    MessageBox.Show("Please input Adult Updated Info(A1)!", "Adult Updated Info", MessageBoxButtons.OK, MessageBoxIcon.Error)
                    Rdr.Close()
                    txtClinicID.Text = ""
                    txtClinicID.Focus()
                    Exit Sub
                End If
            Catch ex As Exception
            Finally
                Rdr.Close()
            End Try
            '.........
        End If

        If txtART.Enabled = True Then
            Rdr = New MySqlCommand("Select * from tblaart where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb).ExecuteReader
            While Rdr.Read
                txtART.Text = Rdr.GetValue(1).ToString.Trim
                Rdr.Close()
                txtART.Enabled = False
                '  rdat = CDate(Rdr.GetValue(2).ToString)
                RdEligible.SelectedIndex = 0
                Exit While
            End While
            Rdr.Close()
        End If
        checkSeche()

        txtClinicID.Enabled = False
        '   DaVisit.Focus()
        Dim CmdSearchAI As New MySqlCommand("Select * from tblaimain where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        While Rdr.Read
            txtAge.Text = CType(DateDiff(DateInterval.Year, CDate(Rdr.GetValue(5).ToString), CDate(Rdr.GetValue(1).ToString)), String)
            RdSex.SelectedIndex = Rdr.GetValue(6).ToString
            If Rdr.GetValue(19).ToString.Trim <> "" Then
                txtART.Text = Rdr.GetValue(19).ToString
                txtART.Enabled = False
                RdEligible.SelectedIndex = 0
            End If
            'Sithorn............
            TyR = Val(Rdr.GetValue(2).ToString)
            'Sithorn............
            id = Val(Rdr.GetValue(3).ToString)
            Dob = CDate(Rdr.GetValue(5).ToString)
            fvdate = CDate(Rdr.GetValue(1).ToString)
            If CDate(DaVisit.Text) <= CDate("01/01/1990") Then
                DaVisit.EditValue = CDate(Rdr.GetValue(1).ToString)
                RdVisitStatus.SelectedIndex = 0
            End If
            Rdr.Close()
            If id <> 0 And TyR <> 1 Then 'Add a condition: And Tyr<>1 by Sithorn
                Rdr = New MySqlCommand("Select * from tblaart where ClinicID='" & id & "'", Cnndb).ExecuteReader
                While Rdr.Read
                    txtART.Text = Rdr.GetValue(1).ToString.Trim
                    Daart = Rdr.GetValue(2).ToString
                    Rdr.Close()
                    RdEligible.SelectedIndex = 0
                    Exit While
                End While
                Rdr.Close()
            End If
            Exit Sub
        End While
        Rdr.Close()
        MessageBox.Show("មិនមានលេខកូដអ្នកជំងឺនេះក្នុងប្រពន្ធយើងខ្មុំទេ ឬទិន្នន័យរបស់អ្នកជំងឺនេះអត់ទាន់បានបញ្ចូល។", "Check In Adult initial visit first", MessageBoxButtons.OK, MessageBoxIcon.Error)
        Clear()
        ' txtClinicID.Text = ""
        txtClinicID.Focus()
    End Sub
    Private Sub CheckPs()
        If CDate(DaVisit.EditValue).Date = CDate("1/1/1900") Then Exit Sub
        If CDate(DaVisit.EditValue).Date > Date.Now.Date Then
            MessageBox.Show("ថ្ងៃខែឆ្នាំពិនិត្យធំជាងថ្ងៃនេះ " & Chr(13) & "Please try again!", "Check date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaVisit.Focus()
            DaVisit.Text = Now.Date
            Exit Sub
        End If
        If CDate(DaVisit.EditValue).Date < fvdate.Date Then
            MessageBox.Show("មិនត្រឹមត្រូវទេថ្ងៃខែឆ្នាំចុះឈ្មោះអ្នកជំងឺចូលដំបូងធំជាងថ្ងៃខែឆ្នាំមកពិនិត្យ", "Check date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaVisit.Focus()
            DaVisit.Text = Now.Date
            Exit Sub
        End If
        txtAge.Text = DateDiff(DateInterval.Year, CDate(Dob), CDate(DaVisit.Text))
        If Vdate.Date <= CDate(DaVisit.EditValue).Date Then
            If DateApp.Date <> #12:00:00 AM# Then
                If DateApp = CDate(DaVisit.Text).Date Then
                    RdVisitStatus.SelectedIndex = 2
                ElseIf DateApp < CDate(DaVisit.Text).Date Then
                    RdVisitStatus.SelectedIndex = 3
                ElseIf DateApp > CDate(DaVisit.Text).Date Then
                    RdVisitStatus.SelectedIndex = 1
                End If
            End If
            If b <> True Then
                CheckTest()
            End If
            SearchDrug()
        Else
            MessageBox.Show("Invalid Last Date Greater then Date First Visit " & Chr(13) & "Please try again!", "Check date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            txtClinicID.Focus()
        End If
    End Sub

    Private Sub Search()

        Dim CmdSm As New MySqlCommand("Select * from tblavmain where vid='" & Vid & "'", Cnndb)
        Rdr = CmdSm.ExecuteReader
        While Rdr.Read
            txtWeight.Focus()
            RdVisitStatus.SelectedIndex = Rdr.GetValue(3).ToString
            RdPregnantStatus.SelectedIndex = Rdr.GetValue(4).ToString
            RdTypePregnant.SelectedIndex = Rdr.GetValue(5).ToString
            DaPregnant.EditValue = CDate(Rdr.GetValue(6).ToString).Date
            RdANC.SelectedIndex = Rdr.GetValue(7).ToString
            txtWeight.Text = Rdr.GetValue(8).ToString
            txtHeight.Text = Rdr.GetValue(9).ToString
            txtTemp.Text = Rdr.GetValue(10).ToString
            txtPulse.Text = Rdr.GetValue(11).ToString
            txtResp.Text = Rdr.GetValue(12).ToString
            Dim blood() As String = Split(Rdr.GetValue(13).ToString, "/")
            txtBlood1.Text = Trim(blood(0))
            txtBlood2.Text = Trim(blood(1))
            chkPrevention.Checked = Rdr.GetValue(14).ToString
            chkAdherence.Checked = Rdr.GetValue(15).ToString
            chkspacing.Checked = Rdr.GetValue(16).ToString
            chkTBinfect.Checked = Rdr.GetValue(17).ToString
            chkpartner.Checked = Rdr.GetValue(18).ToString
            chkcondom.Checked = Rdr.GetValue(19).ToString
            RdTypeClient.SelectedIndex = Rdr.GetValue(20).ToString
            DaUse.EditValue = CDate(Rdr.GetValue(21).ToString).Date
            If Rdr.GetValue(22).ToString.Trim <> "" Then
                ChkMcondom.Checked = True
                txtCondom.Text = Rdr.GetValue(22).ToString
            End If
            If Rdr.GetValue(23).ToString.Trim <> "" Then
                RdUse.SelectedIndex = 0
                RdPOC.SelectedIndex = 0
                txtCOC.Text = Rdr.GetValue(23).ToString
            End If
            If Rdr.GetValue(24).ToString.Trim <> "" Then
                RdUse.SelectedIndex = 0
                RdPOC.SelectedIndex = 1
                txtPOC.Text = Rdr.GetValue(24).ToString
            End If
            If Rdr.GetValue(25).ToString.Trim <> "" Then
                RdUse.SelectedIndex = 1
                txtDrug.Text = Rdr.GetValue(25).ToString
            End If
            Try
                chkPlaceService.Checked = Rdr.GetValue(26).ToString
            Catch ex As Exception
            End Try
            If Rdr.GetValue(27).ToString.Trim <> "" Then
                chkUmCondom.Checked = True
                txtCondomU.Text = Rdr.GetValue(27).ToString
            End If
            If Rdr.GetValue(28).ToString.Trim <> "" Then
                RdUsing.SelectedIndex = 0
                RdPOCu.SelectedIndex = 0
                txtCOCu.Text = Rdr.GetValue(28).ToString
            End If
            If Rdr.GetValue(29).ToString.Trim <> "" Then
                RdUsing.SelectedIndex = 0
                RdPOCu.SelectedIndex = 1
                txtPOCu.Text = Rdr.GetValue(29).ToString
            End If
            If Rdr.GetValue(30).ToString.Trim <> "" Then
                RdUsing.SelectedIndex = 1
                txtDrugu.Text = Rdr.GetValue(30).ToString
            End If
            If Rdr.GetValue(31).ToString.Trim <> "" Then
                chkUother.Checked = True
                txtOtherU.Text = Rdr.GetValue(31).ToString
            End If
            RdCough.SelectedIndex = Rdr.GetValue(32).ToString
            RdFever.SelectedIndex = Rdr.GetValue(33).ToString
            RdLostWeight.SelectedIndex = Rdr.GetValue(34).ToString
            Rdsweet.SelectedIndex = Rdr.GetValue(35).ToString
            RdUrine.SelectedIndex = Rdr.GetValue(36).ToString
            RdGenital.SelectedIndex = Rdr.GetValue(37).ToString
            RdChemnah.SelectedIndex = Rdr.GetValue(38).ToString
            RdHospital.SelectedIndex = Rdr.GetValue(39).ToString
            txtNumHosptital.Text = Rdr.GetValue(40).ToString
            txtReasonHoptital.Text = Rdr.GetValue(41).ToString
            RdMissARV.SelectedIndex = Rdr.GetValue(42).ToString
            txtMissTime.Text = Rdr.GetValue(43).ToString
            RdWHO.SelectedIndex = Rdr.GetValue(44).ToString
            RdEligible.SelectedIndex = Rdr.GetValue(45).ToString
            Tid = Rdr.GetValue(46).ToString
            RdFunction.SelectedIndex = Rdr.GetValue(47).ToString
            RdTB.SelectedIndex = Rdr.GetValue(48).ToString
            RdTBresult.SelectedIndex = Rdr.GetValue(49).ToString
            RdTBtreat.SelectedIndex = Rdr.GetValue(50).ToString
            DaTB.EditValue = CDate(Rdr.GetValue(51).ToString).Date
            ' Try
            ChkTestHIV.Checked = Rdr.GetValue(52).ToString
            'Catch ex As Exception
            'End Try

            RdResultHIV.SelectedIndex = Rdr.GetValue(53).ToString
            RdCD4.SelectedIndex = Rdr.GetValue(54).ToString
            RdHivViral.SelectedIndex = Rdr.GetValue(55).ToString
            RdHCVviral.SelectedIndex = Rdr.GetValue(56).ToString
            'Try
            ChkGrAG.Checked = Rdr.GetValue(57).ToString
            'Catch ex As Exception
            'End Try
            RdResultCrAG.SelectedIndex = Rdr.GetValue(58).ToString
            RdViralDetech.SelectedIndex = Rdr.GetValue(59).ToString
            RdRefer.SelectedIndex = Rdr.GetValue(60).ToString
            txtReferOther.Text = Rdr.GetValue(61).ToString
            ' Try
            ChkModerate.Checked = Rdr.GetValue(62).ToString
            chkTDF.Checked = Rdr.GetValue(63).ToString
            'Catch ex As Exception
            'End Try
            chkRash.Checked = Rdr.GetValue(64).ToString
            chkHepatitis.Checked = Rdr.GetValue(65).ToString
            chkPeripheral.Checked = Rdr.GetValue(66).ToString
            chkAZT.Checked = Rdr.GetValue(67).ToString
            chkLPV.Checked = Rdr.GetValue(68).ToString
            chkLactic.Checked = Rdr.GetValue(69).ToString
            chkABC.Checked = Rdr.GetValue(70).ToString
            chkATV.Checked = Rdr.GetValue(71).ToString
            If Rdr.GetValue(72).ToString.Trim <> "" Then
                txtMediOther.EditValue = Rdr.GetValue(72).ToString
                chkMediOther.Checked = True
            End If
            re = Rdr.GetValue(73).ToString
            RdResultHype.SelectedIndex = Rdr.GetValue(74).ToString
            RdTPT.SelectedIndex = Rdr.GetValue(75).ToString
            RdTBout.SelectedIndex = Rdr.GetValue(76).ToString
            '.............
            RdFoWorker.SelectedIndex = Rdr.GetValue(79).ToString
            If Rdr.GetValue(80).ToString.Trim <> "0" Then
                LueCountries.EditValue = Rdr.GetValue(80).ToString
            End If
        End While
        Rdr.Close()
        Dim CmdTest As New MySqlCommand("Select * from tblpatienttest where testid='" & Tid & "'", Cnndb)
        Rdr = CmdTest.ExecuteReader
        While Rdr.Read
            txtCD4.EditValue = Rdr.GetValue(5).ToString
            DaCD4.EditValue = CDate(Rdr.GetValue(3).ToString).Date
            DaViralload.EditValue = CDate(Rdr.GetValue(3).ToString).Date
            txtViralload.EditValue = Rdr.GetValue(8).ToString
        End While
        Rdr.Close()

        Dim CmdStatus As New MySqlCommand("Select * from tblavpatientstatus where vid='" & Vid & "'", Cnndb)
        Rdr = CmdStatus.ExecuteReader
        While Rdr.Read
            If CDec(Rdr.GetValue(1).ToString) = 3 Then
                RdPatientStatus.SelectedIndex = Rdr.GetValue(1).ToString
                RdPlaceDead.SelectedIndex = Rdr.GetValue(2).ToString
                txtOtherDead.Text = Rdr.GetValue(3).ToString
                DaOutcome.EditValue = CDate(Rdr.GetValue(4).ToString)
                CboTransferOut.Text = Rdr.GetValue(5).ToString
            Else
                RdPatientStatus.SelectedIndex = Rdr.GetValue(1).ToString
                RdPlaceDead.SelectedIndex = Rdr.GetValue(2).ToString
                txtOtherDead.Text = Rdr.GetValue(3).ToString
                DaOutcome.EditValue = CDate(Rdr.GetValue(4).ToString)
                causedeath = Split(Rdr.GetValue(5).ToString, "/")
            End If

        End While
        Rdr.Close()

        'Sithorn.........................
        If causedeath.Length <> 0 Then
            If causedeath(0) Is "" Then
                txtOutDeath.Text = ""
            ElseIf Not IsNumeric(causedeath(0)) Then
                txtOutDeath.Text = Trim(causedeath(0))
            Else
                If IsNumeric(Trim(causedeath(1))) Then
                    RdCauseDeath.SelectedIndex = CInt(Trim(causedeath(0)))
                    LueCauseDeath.EditValue = Trim(causedeath(1))
                Else
                    RdCauseDeath.SelectedIndex = CInt(Trim(causedeath(0)))
                    LueCauseDeath.EditValue = "99"
                    txtOutDeath.Text = Trim(causedeath(1))
                End If
            End If
            causedeath = {}
        End If
        '................................
        SearchDrug()
        Dim CmdApp As New MySqlCommand("select * from tblappointment where vid='" & Vid & "'", Cnndb)
        Rdr = CmdApp.ExecuteReader
        While Rdr.Read
            '  CboDoctore.SelectedIndex = Val(Rdr.GetValue(1).ToString)
            For iI As Int16 = 0 To CboDoctore.Properties.Items.Count - 1
                If Rdr.GetValue(1).ToString.Trim = Mid(CboDoctore.Properties.Items(iI).ToString, 1, 1) Then
                    CboDoctore.SelectedIndex = iI
                    Exit For
                End If
            Next
            CboMeetTime.SelectedIndex = Rdr.GetValue(2).ToString
        End While
        Rdr.Close()
    End Sub
    Private Sub SearchDrug()
        Dim ia(2) As Integer
        If tsbDelete.Enabled = True Then
            ia = {0, 1, 2}
        Else
            ia = {0, 2, 2}
        End If
        Dim CmdARV As New MySqlCommand("Select * from tblavarvdrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
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
                'DaARV1.EditValue = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaARV1.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaARV1.Text = CDate(DaVisit.Text).Date
                End If
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
                'DaARV2.EditValue = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaARV2.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaARV2.Text = CDate(DaVisit.Text).Date
                End If
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
                'DaARV3.EditValue = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaARV3.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaARV3.Text = CDate(DaVisit.Text).Date
                End If
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
                'DaARV4.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaARV4.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaARV4.Text = CDate(DaVisit.Text).Date
                End If
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
                'DaARV5.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaARV5.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaARV5.Text = CDate(DaVisit.Text).Date
                End If
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
                'DaARV6.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaARV6.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaARV6.Text = CDate(DaVisit.Text).Date
                End If
                CboARVReason6.Text = Trim(Rdr.GetValue(7).ToString)
                CboARVRemark6.Text = Trim(Rdr.GetValue(8).ToString)
            End If

        End While
        Rdr.Close()
        Dim CmdOI As New MySqlCommand("Select * from tblavoidrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
        Rdr = CmdOI.ExecuteReader
        i = 0
        While Rdr.Read
            i = i + 1
            If i = 1 Then
                CboOIdrug1.Text = Trim(Rdr.GetValue(0).ToString)
                CboOIdose1.Text = Trim(Rdr.GetValue(1).ToString)
                txtOIQuan1.Text = Trim(Rdr.GetValue(2).ToString)
                CboOIFreq1.Text = Trim(Rdr.GetValue(3).ToString)
                CboOIForm1.Text = Trim(Rdr.GetValue(4).ToString)
                RdOIdrugStatus1.SelectedIndex = Rdr.GetValue(5).ToString
                'DaOI1.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaOI1.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaOI1.Text = CDate(DaVisit.Text).Date
                End If
                CboOIReason1.Text = Trim(Rdr.GetValue(7).ToString)
                CboOIRemark1.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 2 Then
                CboOIdrug2.Text = Trim(Rdr.GetValue(0).ToString)
                CboOIdose2.Text = Trim(Rdr.GetValue(1).ToString)
                txtOIQuan2.Text = Trim(Rdr.GetValue(2).ToString)
                CboOIFreq2.Text = Trim(Rdr.GetValue(3).ToString)
                CboOIForm2.Text = Trim(Rdr.GetValue(4).ToString)
                RdOIdrugStatus2.SelectedIndex = Rdr.GetValue(5).ToString
                'DaOI2.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaOI2.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaOI2.Text = CDate(DaVisit.Text).Date
                End If
                CboOIReason2.Text = Trim(Rdr.GetValue(7).ToString)
                CboOIRemark2.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 3 Then
                CboOIdrug3.Text = Trim(Rdr.GetValue(0).ToString)
                CboOIdose3.Text = Trim(Rdr.GetValue(1).ToString)
                txtOIQuan3.Text = Trim(Rdr.GetValue(2).ToString)
                CboOIFreq3.Text = Trim(Rdr.GetValue(3).ToString)
                CboOIForm3.Text = Trim(Rdr.GetValue(4).ToString)
                RdOIdrugStatus3.SelectedIndex = Rdr.GetValue(5).ToString
                'DaOI3.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaOI3.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaOI3.Text = CDate(DaVisit.Text).Date
                End If
                CboOIReason3.Text = Trim(Rdr.GetValue(7).ToString)
                CboOIRemark3.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 4 Then
                CboOIdrug4.Text = Trim(Rdr.GetValue(0).ToString)
                CboOIdose4.Text = Trim(Rdr.GetValue(1).ToString)
                txtOIQuan4.Text = Trim(Rdr.GetValue(2).ToString)
                CboOIFreq4.Text = Trim(Rdr.GetValue(3).ToString)
                CboOIForm4.Text = Trim(Rdr.GetValue(4).ToString)
                RdOIdrugStatus4.SelectedIndex = Rdr.GetValue(5).ToString
                'DaOI4.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaOI4.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaOI4.Text = CDate(DaVisit.Text).Date
                End If
                CboOIReason4.Text = Trim(Rdr.GetValue(7).ToString)
                CboOIRemark4.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 5 Then
                CboOIdrug5.Text = Trim(Rdr.GetValue(0).ToString)
                CboOIdose5.Text = Trim(Rdr.GetValue(1).ToString)
                txtOIQuan5.Text = Trim(Rdr.GetValue(2).ToString)
                CboOIFreq5.Text = Trim(Rdr.GetValue(3).ToString)
                CboOIForm5.Text = Trim(Rdr.GetValue(4).ToString)
                RdOIdrugStatus5.SelectedIndex = Rdr.GetValue(5).ToString
                'DaOI5.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaOI5.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaOI5.Text = CDate(DaVisit.Text).Date
                End If
                CboOIReason5.Text = Trim(Rdr.GetValue(7).ToString)
                CboOIRemark5.Text = Trim(Rdr.GetValue(8).ToString)
            End If
        End While
        Rdr.Close()
        Dim CmdTB As New MySqlCommand("Select * from tblavtbdrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
        Rdr = CmdTB.ExecuteReader
        i = 0
        While Rdr.Read
            i = i + 1
            If i = 1 Then
                cboTBdrug1.Text = Trim(Rdr.GetValue(0).ToString)
                CboTBdose1.Text = Trim(Rdr.GetValue(1).ToString)
                txtTBQuan1.Text = Trim(Rdr.GetValue(2).ToString)
                CboTBFreq1.Text = Trim(Rdr.GetValue(3).ToString)
                CboTBForm1.Text = Trim(Rdr.GetValue(4).ToString)
                RdTBdrugStatus1.SelectedIndex = Rdr.GetValue(5).ToString
                'DaTB1.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaTB1.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaTB1.Text = CDate(DaVisit.Text).Date
                End If
                CboTBReason1.Text = Trim(Rdr.GetValue(7).ToString)
                CboTBRemark1.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 2 Then
                cboTBdrug2.Text = Trim(Rdr.GetValue(0).ToString)
                CboTBdose2.Text = Trim(Rdr.GetValue(1).ToString)
                txtTBQuan2.Text = Trim(Rdr.GetValue(2).ToString)
                CboTBFreq2.Text = Trim(Rdr.GetValue(3).ToString)
                CboTBForm2.Text = Trim(Rdr.GetValue(4).ToString)
                RdTBdrugStatus2.SelectedIndex = Rdr.GetValue(5).ToString
                'DaTB2.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaTB2.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaTB2.Text = CDate(DaVisit.Text).Date
                End If
                CboTBReason2.Text = Trim(Rdr.GetValue(7).ToString)
                CboTBRemark2.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 3 Then
                cboTBdrug3.Text = Trim(Rdr.GetValue(0).ToString)
                CboTBdose3.Text = Trim(Rdr.GetValue(1).ToString)
                txtTBQuan3.Text = Trim(Rdr.GetValue(2).ToString)
                CboTBFreq3.Text = Trim(Rdr.GetValue(3).ToString)
                CboTBForm3.Text = Trim(Rdr.GetValue(4).ToString)
                RdTBdrugStatus3.SelectedIndex = Rdr.GetValue(5).ToString
                'DaTB3.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaTB3.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaTB3.Text = CDate(DaVisit.Text).Date
                End If
                CboTBReason3.Text = Trim(Rdr.GetValue(7).ToString)
                CboTBRemark3.Text = Trim(Rdr.GetValue(8).ToString)
            End If
        End While
        Rdr.Close()
        Dim CmdHy As New MySqlCommand("Select * from tblavhydrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
        Rdr = CmdHy.ExecuteReader
        i = 0
        While Rdr.Read
            i = i + 1
            If i = 1 Then
                cboHydrug1.Text = Trim(Rdr.GetValue(0).ToString)
                CboHydose1.Text = Trim(Rdr.GetValue(1).ToString)
                txtHyQuan1.Text = Trim(Rdr.GetValue(2).ToString)
                CboHyFreq1.Text = Trim(Rdr.GetValue(3).ToString)
                CboHyForm1.Text = Trim(Rdr.GetValue(4).ToString)
                RdHydrugStatus1.SelectedIndex = Rdr.GetValue(5).ToString
                'DaHy1.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaHy1.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaHy1.Text = CDate(DaVisit.Text).Date
                End If
                CboHyReason1.Text = Trim(Rdr.GetValue(7).ToString)
                CboHyRemark1.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 2 Then
                cboHydrug2.Text = Trim(Rdr.GetValue(0).ToString)
                CboHydose2.Text = Trim(Rdr.GetValue(1).ToString)
                txtHyQuan2.Text = Trim(Rdr.GetValue(2).ToString)
                CboHyFreq2.Text = Trim(Rdr.GetValue(3).ToString)
                CboHyForm2.Text = Trim(Rdr.GetValue(4).ToString)
                RdHydrugStatus2.SelectedIndex = Rdr.GetValue(5).ToString
                'DaHy2.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaHy2.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaHy2.Text = CDate(DaVisit.Text).Date
                End If
                CboHyReason2.Text = Trim(Rdr.GetValue(7).ToString)
                CboHyRemark2.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 3 Then
                cboHydrug3.Text = Trim(Rdr.GetValue(0).ToString)
                CboHydose3.Text = Trim(Rdr.GetValue(1).ToString)
                txtHyQuan3.Text = Trim(Rdr.GetValue(2).ToString)
                CboHyFreq3.Text = Trim(Rdr.GetValue(3).ToString)
                CboHyForm3.Text = Trim(Rdr.GetValue(4).ToString)
                RdHydrugStatus3.SelectedIndex = Rdr.GetValue(5).ToString
                'DaHy3.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaHy3.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaHy3.Text = CDate(DaVisit.Text).Date
                End If
                CboHyReason3.Text = Trim(Rdr.GetValue(7).ToString)
                CboHyRemark3.Text = Trim(Rdr.GetValue(8).ToString)
            End If
        End While
        Rdr.Close()
        Dim CmdPtp As New MySqlCommand("Select * from tblavtptdrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
        Rdr = CmdPtp.ExecuteReader
        i = 0
        While Rdr.Read
            i = i + 1
            If i = 1 Then
                CboTPTdrug1.Text = Trim(Rdr.GetValue(0).ToString)
                CboTPTdose1.Text = Trim(Rdr.GetValue(1).ToString)
                txtTPTQuan1.Text = Trim(Rdr.GetValue(2).ToString)
                CboTPTFreq1.Text = Trim(Rdr.GetValue(3).ToString)
                CboTPTForm1.Text = Trim(Rdr.GetValue(4).ToString)
                RdTPTdrugStatus1.SelectedIndex = Rdr.GetValue(5).ToString
                'DaTPT1.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaTPT1.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaTPT1.Text = CDate(DaVisit.Text).Date
                End If
                CboTPTReason1.Text = Trim(Rdr.GetValue(7).ToString)
                CboTPTRemark1.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 2 Then
                CboTPTdrug2.Text = Trim(Rdr.GetValue(0).ToString)
                CboTPTdose2.Text = Trim(Rdr.GetValue(1).ToString)
                txtTPTQuan2.Text = Trim(Rdr.GetValue(2).ToString)
                CboTPTFreq2.Text = Trim(Rdr.GetValue(3).ToString)
                CboTPTForm2.Text = Trim(Rdr.GetValue(4).ToString)
                RdTPTdrugStatus2.SelectedIndex = Rdr.GetValue(5).ToString
                'DaTPT2.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaTPT2.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaTPT2.Text = CDate(DaVisit.Text).Date
                End If
                CboTPTReason2.Text = Trim(Rdr.GetValue(7).ToString)
                CboTPTRemark2.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 3 Then
                CboTPTdrug3.Text = Trim(Rdr.GetValue(0).ToString)
                CboTPTdose3.Text = Trim(Rdr.GetValue(1).ToString)
                txtTPTQuan3.Text = Trim(Rdr.GetValue(2).ToString)
                CboTPTFreq3.Text = Trim(Rdr.GetValue(3).ToString)
                CboTPTForm3.Text = Trim(Rdr.GetValue(4).ToString)
                RdTPTdrugStatus3.SelectedIndex = Rdr.GetValue(5).ToString
                'DaTPT3.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaTPT3.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaTPT3.Text = CDate(DaVisit.Text).Date
                End If
                CboTPTReason3.Text = Trim(Rdr.GetValue(7).ToString)
                CboTPTRemark3.Text = Trim(Rdr.GetValue(8).ToString)
            End If
            If i = 4 Then
                CboTPTdrug4.Text = Trim(Rdr.GetValue(0).ToString)
                CboTPTdose4.Text = Trim(Rdr.GetValue(1).ToString)
                txtTPTQuan4.Text = Trim(Rdr.GetValue(2).ToString)
                CboTPTFreq4.Text = Trim(Rdr.GetValue(3).ToString)
                CboTPTForm4.Text = Trim(Rdr.GetValue(4).ToString)
                RdTPTdrugStatus4.SelectedIndex = Rdr.GetValue(5).ToString
                'DaTPT4.Text = CDate(DaVisit.Text).Date 'B Phana
                If tsbDelete.Enabled = True Then
                    DaTPT4.Text = CDate(Rdr.GetValue(6).ToString).Date
                Else
                    DaTPT4.Text = CDate(DaVisit.Text).Date
                End If
                CboTPTReason4.Text = Trim(Rdr.GetValue(7).ToString)
                CboTPTRemark4.Text = Trim(Rdr.GetValue(8).ToString)
            End If
        End While
        Rdr.Close()

    End Sub

    Private Sub CheckTest()
        Tid = ""
        Dim CmdTest As New MySqlCommand("SELECT  CD4, TestID, Dat, HIVLoad  FROM   tblPatientTest WHERE ClinicID = '" & Val(txtClinicID.Text) & "' AND Dat <= '" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "' AND (CD4 <> '" & "" & "') or ClinicID = '" & Val(txtClinicID.Text) & "' AND Dat <= '" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "' AND ( HIVLoad  <> '" & "" & "') ORDER BY Dat DESC limit 1", ConnectionDB.Cnndb)
        Rdr = CmdTest.ExecuteReader
        While Rdr.Read
            txtCD4.Text = Trim(Rdr.GetValue(0).ToString)
            Tid = Trim(Rdr.GetValue(1).ToString)
            DaCD4.Text = CDate(Rdr.GetValue(2).ToString)
            DaViralload.Text = CDate(Rdr.GetValue(2).ToString)
            txtViralload.Text = Rdr.GetValue(3).ToString.Trim
        End While
        Rdr.Close()
    End Sub
    Private Sub Del()
        If vbYes = MessageBox.Show("តើលោកអ្នកពិតជាចង់លប់ទិន្នន័យនេះមែនទេ ?", "Delete..", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
            Dim CmdHy As New MySqlCommand("Delete from tblavhydrug where vid='" & Vid & "'", Cnndb)
            CmdHy.ExecuteNonQuery()
            Dim CmdDels As New MySqlCommand("Delete from tblavpatientstatus where vid ='" & Vid & "'", Cnndb)
            CmdDels.ExecuteNonQuery()
            Dim CmdDelARV As New MySqlCommand("Delete from tblavarvdrug where Vid='" & Vid & "'", Cnndb)
            CmdDelARV.ExecuteNonQuery()
            Dim CmdOI As New MySqlCommand("Delete from tblavoidrug where vid ='" & Vid & "'", Cnndb)
            CmdOI.ExecuteNonQuery()
            Dim CmdTB As New MySqlCommand("Delete from tblavtbdrug where vid='" & Vid & "'", Cnndb)
            CmdTB.ExecuteNonQuery()
            Dim CmdTP As New MySqlCommand("Delete from tblavtptdrug where vid='" & Vid & "'", Cnndb)
            CmdTP.ExecuteNonQuery()
            Dim CmdApp As New MySqlCommand("Delete from tblAppointment where Vid='" & Vid & "'", Cnndb)
            CmdApp.ExecuteNonQuery()
            Dim CmdMain As New MySqlCommand("Delete from  tblavmain where Vid='" & Vid & "'", Cnndb)
            CmdMain.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAVmain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("ទិន្នន័យអ្នកជំងឺមកពិនិត្យថ្ងៃខែឆ្នាំ " & DaVisit.Text & " ត្រូវបានលប់ហើយ...", "Delete....", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub
#End Region
    Private Sub CboARVdrug1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug1.SelectedIndexChanged
        Drug(CboARVdrug1, CboARVdrug2, CboARVDose1, txtARVquan1, CboARVRFreq1, CboARVform1, RdARVdrugStatus1, DaARV1, CboARVReason1, CboARVRemark1)
        RdARVline.Enabled = False
        RdARVline.SelectedIndex = -1
        If CboARVdrug1.SelectedIndex > 0 Then
            RdARVline.Enabled = True
            RdARVline.SelectedIndex = re
        End If
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
        Drug(CboARVdrug6, CboARVdrug7, CboARVDose6, txtARVquan6, CboARVRFreq6, CboARVform6, RdARVdrugStatus6, DaARV6, CboARVReason6, CboARVRemark6)
    End Sub
    Private Sub CboARVdrug7_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug7.SelectedIndexChanged
        Drug(CboARVdrug7, CboARVdrug8, CboARVDose7, txtARVquan7, CboARVRFreq7, CboARVform7, RdARVdrugStatus7, DaARV7, CboARVReason7, CboARVRemark7)
    End Sub

    Private Sub CboARVdrug8_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboARVdrug8.SelectedIndexChanged
        Drug(CboARVdrug8, CboARVdrug8, CboARVDose8, txtARVquan8, CboARVRFreq8, CboARVform8, RdARVdrugStatus8, DaARV8, CboARVReason8, CboARVRemark8)
    End Sub
    Private Sub CboOIdrug1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboOIdrug1.SelectedIndexChanged
        Drug(CboOIdrug1, CboOIdrug2, CboOIdose1, txtOIQuan1, CboOIFreq1, CboOIForm1, RdOIdrugStatus1, DaOI1, CboOIReason1, CboOIRemark1)
    End Sub

    Private Sub CboOIdrug2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboOIdrug2.SelectedIndexChanged
        Drug(CboOIdrug2, CboOIdrug3, CboOIdose2, txtOIQuan2, CboOIFreq2, CboOIForm2, RdOIdrugStatus2, DaOI2, CboOIReason2, CboOIRemark2)
    End Sub

    Private Sub CboOIdrug3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboOIdrug3.SelectedIndexChanged
        Drug(CboOIdrug3, CboOIdrug4, CboOIdose3, txtOIQuan3, CboOIFreq3, CboOIForm3, RdOIdrugStatus3, DaOI3, CboOIReason3, CboOIRemark3)
    End Sub

    Private Sub CboOIdrug4_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboOIdrug4.SelectedIndexChanged
        Drug(CboOIdrug4, CboOIdrug5, CboOIdose4, txtOIQuan4, CboOIFreq4, CboOIForm4, RdOIdrugStatus4, DaOI4, CboOIReason4, CboOIRemark4)
    End Sub

    Private Sub CboOIdrug5_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboOIdrug5.SelectedIndexChanged
        Drug(CboOIdrug5, CboOIdrug5, CboOIdose5, txtOIQuan5, CboOIFreq5, CboOIForm5, RdOIdrugStatus5, DaOI5, CboOIReason5, CboOIRemark5)
    End Sub

    Private Sub cboTBdrug1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboTBdrug1.SelectedIndexChanged
        Drug(cboTBdrug1, cboTBdrug2, CboTBdose1, txtTBQuan1, CboTBFreq1, CboTBForm1, RdTBdrugStatus1, DaTB1, CboTBReason1, CboTBRemark1)
    End Sub

    Private Sub cboTBdrug2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboTBdrug2.SelectedIndexChanged
        Drug(cboTBdrug2, cboTBdrug3, CboTBdose2, txtTBQuan2, CboTBFreq2, CboTBForm2, RdTBdrugStatus2, DaTB2, CboTBReason2, CboTBRemark2)
    End Sub

    Private Sub cboTBdrug3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboTBdrug3.SelectedIndexChanged
        Drug(cboTBdrug3, cboTBdrug3, CboTBdose3, txtTBQuan3, CboTBFreq3, CboTBForm3, RdTBdrugStatus3, DaTB3, CboTBReason3, CboTBRemark3)
    End Sub


    Private Sub RdTypeClient_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTypeClient.SelectedIndexChanged

        If RdTypeClient.SelectedIndex >= 0 Then
            DaUse.Enabled = True
            RdUse.Enabled = True
            ChkMcondom.Enabled = True
        Else
            DaUse.Enabled = False
            DaUse.Text = "01/01/1900"
            RdUse.SelectedIndex = -1
            RdUse.Enabled = False
            ChkMcondom.Enabled = False
            ChkMcondom.Checked = False
        End If
    End Sub


    Private Sub RdWHO_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdWHO.SelectedIndexChanged
        If Stage >= CDec(RdWHO.SelectedIndex) Then
            RdWHO.SelectedIndex = Stage
        End If
        If RdEligible.SelectedIndex = 0 And txtART.Text.Trim <> "" Then Exit Sub
        If RdWHO.SelectedIndex > 1 Then
            RdEligible.SelectedIndex = 0
        ElseIf RdWHO.SelectedIndex <= 1 And txtART.Text.Trim = "" Then
            RdEligible.SelectedIndex = 1
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

    Private Sub tsbSave1_Click(sender As Object, e As EventArgs) Handles tsbSave1.Click
        Save()
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub

    Private Sub cboHydrug1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboHydrug1.SelectedIndexChanged
        Drug(cboHydrug1, cboHydrug2, CboHydose1, txtHyQuan1, CboHyFreq1, CboHyForm1, RdHydrugStatus1, DaHy1, CboHyReason1, CboHyRemark1)
    End Sub

    Private Sub cboHydrug2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboHydrug2.SelectedIndexChanged
        Drug(cboHydrug2, cboHydrug3, CboHydose2, txtHyQuan2, CboHyFreq2, CboHyForm2, RdHydrugStatus2, DaHy2, CboHyReason2, CboHyRemark2)
    End Sub

    Private Sub cboHydrug3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboHydrug3.SelectedIndexChanged
        Drug(cboHydrug3, cboHydrug3, CboHydose3, txtHyQuan3, CboHyFreq3, CboHyForm3, RdHydrugStatus3, DaHy3, CboHyReason3, CboHyRemark3)
    End Sub

    Private Sub DaAppoint_EditValueChanged(sender As Object, e As EventArgs) Handles DaAppoint.EditValueChanged

    End Sub


    Private hitInfo As GridHitInfo = Nothing

    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        tsbDelete.Enabled = True
        tsbDelete1.Enabled = True
        ToolStripButton3.Enabled = True

        txtClinicID.EditValue = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        If txtClinicID.Text = "" Then Exit Sub
        TabControl1.SelectedIndex = 1
        DaVisit.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date Visit")
        txtAge.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Age")
        If GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex") = "Female" Then
            RdSex.SelectedIndex = 0
        Else
            RdSex.SelectedIndex = 1
        End If
        txtART.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ART Number")
        txtART.Enabled = False
        DaAppoint.Text = CDate(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Appointment-Date")).Date
        Vid = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Vid")
        If CDate(DaAppoint.Text) > CDate("01/01/2000") Then
            CboDoctore.Enabled = True
            CboMeetTime.Enabled = True
        End If
        txtClinicID.Enabled = False
        Search()
    End Sub

    Private Sub RdResultHIV_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdResultHIV.SelectedIndexChanged
        'If RdResultHIV.SelectedIndex = 0 Then
        '    RdEligible.SelectedIndex = 0
        'Else
        '    RdEligible.SelectedIndex = 1
        'End If
    End Sub

    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub txtWeight_KeyDown(sender As Object, e As KeyEventArgs) Handles txtWeight.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtBlood1_EditValueChanged_1(sender As Object, e As EventArgs) Handles txtBlood1.EditValueChanged

    End Sub

    Private Sub txtHeight_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHeight.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub


    Private Sub txtTemp_KeyDown(sender As Object, e As KeyEventArgs) Handles txtTemp.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            ' SendKeys.Send("{ENTER}")
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


    Private Sub txtBlood1_KeyDown(sender As Object, e As KeyEventArgs) Handles txtBlood1.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtBlood2_KeyDown(sender As Object, e As KeyEventArgs) Handles txtBlood2.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub


    Private Sub DaVisit_KeyDown(sender As Object, e As KeyEventArgs) Handles DaVisit.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaVisit_Leave(sender As Object, e As EventArgs) Handles DaVisit.Leave
        If tsbDelete.Enabled = False Then CheckPs()
    End Sub

    Private Sub DaVisit_EditValueChanged(sender As Object, e As EventArgs) Handles DaVisit.EditValueChanged

    End Sub

    Private Sub RdPregnantStatus_SelectedIndexChanged_1(sender As Object, e As EventArgs) Handles RdPregnantStatus.SelectedIndexChanged
        If RdPregnantStatus.SelectedIndex = 1 Then
            RdTypePregnant.Enabled = True
            DaPregnant.Enabled = True
            RdANC.Enabled = True
        Else
            RdTypePregnant.Enabled = False
            RdTypePregnant.SelectedIndex = -1
            DaPregnant.Enabled = False
            DaPregnant.Text = "01/01/1900"
            RdANC.Enabled = False
            RdANC.SelectedIndex = -1
        End If
    End Sub

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub

    Private Sub txtClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtClinicID.EditValueChanged

    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Del()
    End Sub

    Private Sub tsbDelete1_Click(sender As Object, e As EventArgs) Handles tsbDelete1.Click
        Del()
    End Sub



    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        If tsbDelete.Enabled = False Then
            If Len(txtClinicID.Text) <= 6 And Val(txtClinicID.Text) <> 0 Then
                txtClinicID.Text = Format(Val(txtClinicID.Text), "000000")
                txtART.Text = ""
                txtAge.Text = ""
                DaVisit.Text = "01/01/1900"
                RdSex.SelectedIndex = -1
                RdVisitStatus.SelectedIndex = -1
                RdPregnantStatus.SelectedIndex = -1
                RdTypePregnant.SelectedIndex = -1
                DaPregnant.Text = "01/01/1900"
                txtWeight.Text = ""
                txtHeight.Text = ""
                txtTemp.Text = ""
                txtPulse.Text = ""
                txtResp.Text = ""
                txtBlood1.Text = ""
                txtBlood2.Text = ""
                chkPrevention.Checked = False
                chkAdherence.Checked = False
                chkspacing.Checked = False
                chkTBinfect.Checked = False
                chkpartner.Checked = False
                chkcondom.Checked = False
                RdTypeClient.SelectedIndex = -1
                DaUse.Text = "01/01/1900"
                RdUse.SelectedIndex = -1
                RdPOC.SelectedIndex = -1
                chkPlaceService.Checked = False
                RdUsing.SelectedIndex = -1
                RdPOCu.SelectedIndex = -1
                RdCough.SelectedIndex = -1
                RdFever.SelectedIndex = -1
                RdLostWeight.SelectedIndex = -1
                Rdsweet.SelectedIndex = -1
                RdUrine.SelectedIndex = -1
                RdGenital.SelectedIndex = -1
                RdChemnah.SelectedIndex = -1
                RdHospital.SelectedIndex = -1
                RdMissARV.SelectedIndex = -1
                RdWHO.SelectedIndex = -1
                RdEligible.SelectedIndex = -1
                txtCD4.Text = ""
                DaCD4.Text = "01/01/1900"
                txtViralload.Text = ""
                DaViralload.Text = "01/01/1900"
                RdFunction.SelectedIndex = -1
                RdTB.SelectedIndex = -1
                ChkGrAG.Checked = False
                ChkTestHIV.Checked = False
                RdTBresult.SelectedIndex = -1
                RdTBtreat.SelectedIndex = -1
                DaTB.Text = "01/01/1900"
                RdResultHIV.SelectedIndex = -1
                RdCD4.SelectedIndex = -1
                RdHivViral.SelectedIndex = -1
                RdHCVviral.SelectedIndex = -1
                RdResultCrAG.SelectedIndex = -1
                RdViralDetech.SelectedIndex = -1
                RdRefer.SelectedIndex = -1
                ChkModerate.Checked = False
                chkPeripheral.Checked = False
                chkABC.Checked = False
                chkTDF.Checked = False
                chkAZT.Checked = False
                chkATV.Checked = False
                chkRash.Checked = False
                chkLPV.Checked = False
                chkLactic.Checked = False
                chkMediOther.Checked = False
                chkHepatitis.Checked = False
                CboARVdrug1.SelectedIndex = -1
                CboARVdrug2.SelectedIndex = -1
                CboARVdrug3.SelectedIndex = -1
                CboARVdrug4.SelectedIndex = -1
                CboARVdrug5.SelectedIndex = -1
                CboARVdrug6.SelectedIndex = -1
                CboARVdrug7.SelectedIndex = -1
                CboARVdrug8.SelectedIndex = -1
                CboOIdrug1.SelectedIndex = -1
                CboOIdrug2.SelectedIndex = -1
                CboOIdrug3.SelectedIndex = -1
                CboOIdrug4.SelectedIndex = -1
                CboOIdrug5.SelectedIndex = -1
                cboTBdrug1.SelectedIndex = -1
                cboTBdrug2.SelectedIndex = -1
                cboTBdrug3.SelectedIndex = -1
                cboHydrug1.SelectedIndex = -1
                cboHydrug2.SelectedIndex = -1
                cboHydrug3.SelectedIndex = -1
                RdPatientStatus.SelectedIndex = -1
                RdPlaceDead.SelectedIndex = -1
                CboTransferOut.SelectedIndex = -1
                DaAppoint.Text = "01/01/1900"
                RdARVdrugStatus1.SelectedIndex = -1
                RdARVdrugStatus2.SelectedIndex = -1
                RdARVdrugStatus3.SelectedIndex = -1
                RdARVdrugStatus4.SelectedIndex = -1
                RdARVdrugStatus5.SelectedIndex = -1
                RdARVdrugStatus6.SelectedIndex = -1
                RdARVdrugStatus7.SelectedIndex = -1
                RdARVdrugStatus8.SelectedIndex = -1
                RdOIdrugStatus1.SelectedIndex = -1
                RdOIdrugStatus2.SelectedIndex = -1
                RdOIdrugStatus3.SelectedIndex = -1
                RdOIdrugStatus4.SelectedIndex = -1
                RdOIdrugStatus5.SelectedIndex = -1
                RdTBdrugStatus1.SelectedIndex = -1
                RdTBdrugStatus2.SelectedIndex = -1
                RdTBdrugStatus3.SelectedIndex = -1
                RdPregnantStatus.Enabled = True
                txtART.Enabled = True
                txtClinicID.Enabled = True
                txtART.Enabled = True
                RdHydrugStatus1.SelectedIndex = -1
                RdHydrugStatus2.SelectedIndex = -1
                RdHydrugStatus3.SelectedIndex = -1
                RdResultHype.SelectedIndex = -1
                CboDoctore.Enabled = False
                CboMeetTime.Enabled = False
                CboMeetTime.SelectedIndex = -1
                CboDoctore.SelectedIndex = -1
                tsbDelete.Enabled = False
                tsbDelete1.Enabled = False
                ToolStripButton3.Enabled = False
                Vid = 0
                ApID = 0
                id = 0
                RdPregnantStatus.Enabled = False
                RdARVline.SelectedIndex = -1
                RdTPT.SelectedIndex = -1
                RdTBout.SelectedIndex = -1
                RdTPTdrugStatus1.SelectedIndex = -1
                RdTPTdrugStatus2.SelectedIndex = -1
                RdTPTdrugStatus3.SelectedIndex = -1
                RdTPTdrugStatus4.SelectedIndex = -1
                CboTPTdrug1.SelectedIndex = -1
                CboTPTdrug2.SelectedIndex = -1
                CboTPTdrug3.SelectedIndex = -1
                CboTPTdrug4.SelectedIndex = -1

                CheckPat()
            End If
        End If
    End Sub

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

    End Sub

    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            '    CheckPat()
        End If
    End Sub

    Private Sub tscView_Click(sender As Object, e As EventArgs) Handles tscView.Click

    End Sub

    Private Sub tspART_Click(sender As Object, e As EventArgs) Handles tspART.Click

    End Sub

    Private Sub txtART_Leave(sender As Object, e As EventArgs) Handles txtART.Leave
        If Len(txtART.Text.Trim) < 6 And IsNumeric(txtART.Text) And Val(txtART.Text) <> 0 Then
            txtART.Text = frmMain.Art & Format(Val(txtART.Text), "00000")
            RdEligible.Enabled = 0
        End If
    End Sub

    Private Sub txtART_KeyDown(sender As Object, e As KeyEventArgs) Handles txtART.KeyDown
        If e.KeyCode = Keys.Enter Then
            If Len(txtART.Text.Trim) < 6 And IsNumeric(txtART.Text) And Len(txtART.Text) <> 0 Then
                txtART.Text = frmMain.Art & Format(Val(txtART.Text), "00000")
                RdEligible.Enabled = 0
            End If
            SendKeys.Send(Chr(9))
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

    Private Sub TabPage2_Click(sender As Object, e As EventArgs) Handles TabPage2.Click

    End Sub

    Private Sub ToolStripButton1_Click(sender As Object, e As EventArgs) Handles ToolStripButton1.Click
        Save()
    End Sub

    Private Sub ToolStripButton2_Click(sender As Object, e As EventArgs) Handles ToolStripButton2.Click
        Clear()
    End Sub

    Private Sub ToolStripButton3_Click(sender As Object, e As EventArgs) Handles ToolStripButton3.Click
        Del()
    End Sub

    Private Sub RdSex_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdSex.SelectedIndexChanged
        RdPregnantStatus.Enabled = False
        If RdSex.SelectedIndex = 0 Then
            RdPregnantStatus.Enabled = True
        End If

    End Sub

    Private Sub ChkMcondom_CheckedChanged(sender As Object, e As EventArgs) Handles ChkMcondom.CheckedChanged
        txtCondom.Enabled = False
        txtCondom.Text = ""
        If ChkMcondom.Checked Then
            txtCondom.Enabled = True
        End If
    End Sub

    Private Sub chkUmCondom_CheckedChanged(sender As Object, e As EventArgs) Handles chkUmCondom.CheckedChanged
        txtCondomU.Enabled = False
        txtCondomU.Text = ""
        If chkUmCondom.Checked Then
            txtCondomU.Enabled = True
        End If
    End Sub

    Private Sub chkUother_CheckedChanged(sender As Object, e As EventArgs) Handles chkUother.CheckedChanged
        txtOtherU.Enabled = False
        txtOtherU.Text = ""
        If chkUother.Checked Then
            txtOtherU.Enabled = True
        End If
    End Sub

    Private Sub CboTPTdrug1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboTPTdrug1.SelectedIndexChanged
        Drug(CboTPTdrug1, CboTPTdrug2, CboTPTdose1, txtTPTQuan1, CboTPTFreq1, CboTPTForm1, RdTPTdrugStatus1, DaTPT1, CboTPTReason1, CboTPTRemark1)
    End Sub

    Private Sub CboTPTdrug2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboTPTdrug2.SelectedIndexChanged
        Drug(CboTPTdrug2, CboTPTdrug3, CboTPTdose2, txtTPTQuan2, CboTPTFreq2, CboTPTForm2, RdTPTdrugStatus2, DaTPT2, CboTPTReason2, CboTPTRemark2)
    End Sub

    Private Sub CboTPTdrug3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboTPTdrug3.SelectedIndexChanged
        Drug(CboTPTdrug3, CboTPTdrug4, CboTPTdose3, txtTPTQuan3, CboTPTFreq3, CboTPTForm3, RdTPTdrugStatus3, DaTPT3, CboTPTReason3, CboTPTRemark3)
    End Sub

    Private Sub CboTPTdrug4_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboTPTdrug4.SelectedIndexChanged
        Drug(CboTPTdrug4, CboTPTdrug4, CboTPTdose4, txtTPTQuan4, CboTPTFreq4, CboTPTForm4, RdTPTdrugStatus4, DaTPT4, CboTPTReason4, CboTPTRemark4)
    End Sub

    Private Sub txtART_EditValueChanged(sender As Object, e As EventArgs) Handles txtART.EditValueChanged

    End Sub

    Private Sub RdARVline_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdARVline.SelectedIndexChanged

    End Sub

    Private Sub SimpleButton1_Click(sender As Object, e As EventArgs) Handles SimpleButton1.Click
        RdPatientStatus.SelectedIndex = -1
    End Sub

    Private Sub RdResultHype_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdResultHype.SelectedIndexChanged

    End Sub

    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Double
            Dim CmdSearch As New MySqlCommand("SELECT     preart.tblaimain.ClinicID, preart.tblaimain.Dabirth, preart.tblaimain.Sex, preart.tblavmain.DatVisit, preart.tblavmain.TypeVisit, preart.tblavmain.WHO, preart.tblavmain.ARTnum, preart.tblavpatientstatus.Status, preart.tblavmain.DaApp ,preart.tblavmain.vid FROM         preart.tblavpatientstatus RIGHT OUTER JOIN preart.tblavmain ON preart.tblavpatientstatus.Vid = preart.tblavmain.Vid LEFT OUTER JOIN preart.tblaimain ON preart.tblavmain.ClinicID = preart.tblaimain.ClinicID where tblaimain.ClinicID='" & tspClinicID.Text & "' ORDER BY preart.tblaimain.ClinicID,tblavmain.DatVisit", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                dr(2) = Format(CDate(Rdr.GetValue(3).ToString), "dd/MM/yyyy")
                dr(4) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString))
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
                '  dr(6) = Rdr.GetValue(5).ToString.Trim
                dr(7) = Rdr.GetValue(6).ToString.Trim
                Select Case CDec(Rdr.GetValue(5).ToString)
                    Case 0
                        dr(6) = 1
                    Case 1
                        dr(6) = 2
                    Case 2
                        dr(6) = 3
                    Case 3
                        dr(6) = 4
                End Select
                If Rdr.GetValue(7).ToString.Trim <> "" Then
                    Select Case CDec(Rdr.GetValue(7).ToString)
                        Case 0
                            dr(8) = "Lost"
                        Case 1
                            dr(8) = "Death"
                        Case 2
                            dr(8) = "HIV Negative"
                        Case 3
                            dr(8) = "Transfer Out"
                    End Select
                End If
                dr(9) = Rdr.GetValue(8).ToString
                dr(10) = Rdr.GetValue(9).ToString
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub LabelControl21_Click(sender As Object, e As EventArgs) Handles LabelControl21.Click

    End Sub

    Private Sub LabelControl149_Click(sender As Object, e As EventArgs) Handles LabelControl149.Click

    End Sub

    Private Sub tspART_KeyDown(sender As Object, e As KeyEventArgs) Handles tspART.KeyDown
        If e.KeyCode = Keys.Enter And tspART.Text.Trim <> "" Then
            dt.Clear()
            Dim i As Double
            Dim CmdSearch As New MySqlCommand("SELECT     preart.tblaimain.ClinicID, preart.tblaimain.Dabirth, preart.tblaimain.Sex, preart.tblavmain.DatVisit, preart.tblavmain.TypeVisit, preart.tblavmain.WHO, preart.tblavmain.ARTnum, preart.tblavpatientstatus.Status, preart.tblavmain.DaApp ,preart.tblavmain.vid FROM         preart.tblavpatientstatus RIGHT OUTER JOIN preart.tblavmain ON preart.tblavpatientstatus.Vid = preart.tblavmain.Vid LEFT OUTER JOIN preart.tblaimain ON preart.tblavmain.ClinicID = preart.tblaimain.ClinicID where tblavmain.ARTnum='" & tspART.Text & "' ORDER BY preart.tblaimain.ClinicID,tblavmain.DatVisit", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                dr(2) = Format(CDate(Rdr.GetValue(3).ToString), "dd/MM/yyyy")
                dr(4) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString))
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
                '  dr(6) = Rdr.GetValue(5).ToString.Trim
                dr(7) = Rdr.GetValue(6).ToString.Trim
                Select Case CDec(Rdr.GetValue(5).ToString)
                    Case 0
                        dr(6) = 1
                    Case 1
                        dr(6) = 2
                    Case 2
                        dr(6) = 3
                    Case 3
                        dr(6) = 4
                End Select
                If Rdr.GetValue(7).ToString.Trim <> "" Then
                    Select Case CDec(Rdr.GetValue(7).ToString)
                        Case 0
                            dr(8) = "Lost"
                        Case 1
                            dr(8) = "Death"
                        Case 2
                            dr(8) = "HIV Negative"
                        Case 3
                            dr(8) = "Transfer Out"
                    End Select
                End If
                dr(9) = Rdr.GetValue(8).ToString
                dr(10) = Rdr.GetValue(9).ToString
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub LabelControl57_Click(sender As Object, e As EventArgs) Handles LabelControl57.Click
        RdTBout.SelectedIndex = -1
    End Sub

    Private Sub DaAppoint_Leave(sender As Object, e As EventArgs) Handles DaAppoint.Leave
        Try
            If CDate(DaAppoint.Text) <= CDate(DaVisit.Text) Then
                MessageBox.Show("Invalid, Appointment date (less then or equal visit)", "Appoinment .... ", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
                DaAppoint.Text = "01/01/1900"
                Exit Sub
            End If
            If Format(CDate(DaAppoint.Text), "dddd") = "Saturday" Then
                If vbNo = MessageBox.Show("Are you Sure !" & Chr(13) & "The appoinment date is on Saturday", "Appoinment .... ", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation) Then
                    DaAppoint.Text = "01/01/1900"
                    Exit Sub
                End If
            End If
            If Format(CDate(DaAppoint.Text), "dddd") = "Sunday" Then
                If vbNo = MessageBox.Show("Are you Sure !" & Chr(13) & "The appoinment date is on Sunday", "Appoinment......", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation) Then
                    DaAppoint.Text = "01/01/1900"
                    Exit Sub
                End If
            End If
            If CDate(DaAppoint.Text) > CDate("01/01/2000") Then
                CboDoctore.Enabled = True
                CboMeetTime.Enabled = True
            End If
        Catch ex As Exception
        End Try
    End Sub

    Private Sub DaAppoint_KeyDown(sender As Object, e As KeyEventArgs) Handles DaAppoint.KeyDown
        If e.KeyCode = Keys.Enter Then
            DaAppoint_Leave(DaAppoint, New EventArgs)
            CboDoctore.Focus()
        End If
        'CboDoctore.Focus()
    End Sub

    Private Sub RdFoWorker_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdFoWorker.SelectedIndexChanged

        If RdFoWorker.SelectedIndex = 0 Then
            LueCountries.Enabled = True
            btnAllCountries.Enabled = True
            If tsbDelete.Enabled = False Then
                dtCountries.Clear()
                dtCountries = New DataTable
                dtCountries.Columns.Add("ID", GetType(String))
                dtCountries.Columns.Add("Country", GetType(String))
                dtCountries.Rows.Add("114", "Lao")
                dtCountries.Rows.Add("203", "Thai")
                dtCountries.Rows.Add("219", "Vietnamese")

                LueCountries.Properties.DropDownRows = 3
                LueCountries.Properties.DataSource = dtCountries
                LueCountries.Properties.DisplayMember = "Country"
                LueCountries.Properties.ValueMember = "ID"
            End If
        Else
            LueCountries.Enabled = False
            LueCountries.EditValue = Nothing
            btnAllCountries.Enabled = False

        End If

    End Sub


    Private Sub LabelControl21_DoubleClick(sender As Object, e As EventArgs) Handles LabelControl21.DoubleClick
        RdTPT.SelectedIndex = -1
    End Sub

    Private Sub LabelControl16_DoubleClick(sender As Object, e As EventArgs) Handles LabelControl16.DoubleClick
        RdResultHype.SelectedIndex = -1
    End Sub

    Private Sub LabelControl149_DoubleClick(sender As Object, e As EventArgs) Handles LabelControl149.DoubleClick
        RdARVline.SelectedIndex = -1
    End Sub

    Private Sub CboDoctore_KeyDown(sender As Object, e As KeyEventArgs) Handles CboDoctore.KeyDown
        If e.KeyCode = Keys.Enter Then
            If CboDoctore.Text = "" Then
                MessageBox.Show("Select Doctor Name.")
                CboDoctore.Focus()
            Else
                CboMeetTime.Focus()
            End If
        End If

    End Sub
    'Sithorn.................
    Private Sub RdCauseDeath_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdCauseDeath.SelectedIndexChanged
        If RdCauseDeath.SelectedIndex <> -1 Then
            'txtOutDeath.Enabled = True
            LueCauseDeath.Enabled = True
            dtCause = New DataTable
            dtCause.Columns.Add("ID", GetType(String))
            dtCause.Columns.Add("Cause", GetType(String))
            dtCause.Clear()
            Dim CmdSearch As New MySqlCommand("SELECT * FROM preart.tblcausedeath where (Ctype=" & RdCauseDeath.SelectedIndex & " or Ctype=99 ) and Status=1  order by Ctype, Cause;", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                dtCause.Rows.Add(Rdr.GetValue(0).ToString.Trim, Rdr.GetValue(2).ToString.Trim)
            End While
            Rdr.Close()
            Dim n As Integer = dtCause.Rows.Count()
            If n < 7 Then
                LueCauseDeath.Properties.DropDownRows = n
            Else
                LueCauseDeath.Properties.DropDownRows = 7
            End If
            LueCauseDeath.Properties.DataSource = dtCause
            LueCauseDeath.Properties.DisplayMember = "Cause"
            LueCauseDeath.Properties.ValueMember = "ID"

            'LueCauseDeath.Properties.PopulateColumns()
            'LueCauseDeath.Properties.ShowHeader = False
            'LueCauseDeath.Properties.Columns("ID").Visible = False
            'LueCauseDeath.EditValue = 0

        End If
    End Sub

    Private Sub LueCauseDeath_EditValueChanged(sender As Object, e As EventArgs) Handles LueCauseDeath.EditValueChanged
        'Dim editor As DevExpress.XtraEditors.LookUpEdit = TryCast(sender, DevExpress.XtraEditors.LookUpEdit)
        'Dim value As Object = editor.GetColumnValue("ID")
        'LueCauseDeath.EditValue = value
        'MessageBox.Show("Hi, Lookupeditvaluechanged: " & CStr(LueCauseDeath.EditValue))
        If CInt(LueCauseDeath.EditValue) = 99 Then
            txtOutDeath.Enabled = True

        Else
            txtOutDeath.Enabled = False
            txtOutDeath.Text = ""
        End If
    End Sub

    Private Sub btnAllCountries_Click(sender As Object, e As EventArgs) Handles btnAllCountries.Click
        dtCountries.Clear()
        dtCountries = New DataTable
        dtCountries.Columns.Add("ID", GetType(String))
        dtCountries.Columns.Add("Country", GetType(String))
        Dim CmdCountries As New MySqlCommand("SELECT * FROM preart.tblnationality order by Nid, Nationality;", Cnndb)
        Rdr = CmdCountries.ExecuteReader
        While Rdr.Read
            dtCountries.Rows.Add(Rdr.GetValue(0).ToString.Trim, Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()

        LueCountries.Properties.DropDownRows = 7
        LueCountries.Properties.DataSource = dtCountries
        LueCountries.Properties.DisplayMember = "Country"
        LueCountries.Properties.ValueMember = "ID"
    End Sub

    'Private Sub DaOutcome_Leave(sender As Object, e As EventArgs) Handles DaOutcome.Leave
    '    If RdPatientStatus.SelectedIndex = 0 Then
    '        If DateDiff(DateInterval.Day, CDate(DaAppoint.Text), CDate(DaOutcome.Text)) <= frmMain.aa Then
    '            MessageBox.Show("Lost Date is not correct! <" & frmMain.aa)
    '        End If
    '    End If
    'End Sub

    '.............................
End Class