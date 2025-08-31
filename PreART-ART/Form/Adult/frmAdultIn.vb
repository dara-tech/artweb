Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
'Imports System.Windows.Forms
Imports System
Imports System.Windows.Forms

Public Class frmAdultIn
    Inherits DevExpress.XtraEditors.XtraForm
    Dim Rdr As MySqlDataReader
    Private dt As DataTable
    Dim tin As Integer
    Dim ag As Boolean
    Dim Rs As Boolean = False
    Public Sub New()
        InitializeComponent()
    End Sub
    Private Sub frmAdultIn_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Clear()
        loadData()
        XtraTabControl1.SelectedTabPage = XtraTabPage1
        '  AddHandler Me.KeyDown, AddressOf frmAdultIn_KeyDown
    End Sub
    Private Sub ChkLostReturn_CheckedChanged(sender As Object, e As EventArgs) Handles ChkLostReturn.CheckedChanged
        OptReturn.Enabled = False
        OptReturn.SelectedIndex = -1
        '  txtRclinicID.Text = "" 'B Phana

        If ChkLostReturn.Checked Then
            OptReturn.Enabled = True 'B Phana
            'OptReturn.Properties.Items(1).Enabled = False 'sithorn
        End If
    End Sub

    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Clear()
    End Sub

    Private Sub RdRefer_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdRefer.SelectedIndexChanged
        txtReferOther.Text = ""
        txtReferOther.Enabled = False
        If RdRefer.SelectedIndex = 6 Then
            txtReferOther.Enabled = True
        End If
    End Sub

    Private Sub DaTestHIV_EditValueChanged(sender As Object, e As EventArgs) Handles DaTestHIV.EditValueChanged
        If CDate(DaTestHIV.Text) > Now.Date Then
            MessageBox.Show("Invalid Date of positive confirmatory HIV test", "Check Date Test HIV", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaTestHIV.Text = "01/01/1900"
        End If
        If CDate(DaTestHIV.Text) >= CDate("01/01/1990") Then
            TxtVcctID.Enabled = True
            CboVcctname.Enabled = True
        Else
            CboVcctname.SelectedIndex = -1
            TxtVcctID.Text = ""
            TxtVcctID.Enabled = False
            CboVcctname.Enabled = False
        End If
    End Sub

    Private Sub RdTransferIn_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTransferIn.SelectedIndexChanged
        If RdTransferIn.SelectedIndex = 1 Then
            CboTransferName.Enabled = True
            DaStartART.Enabled = True
            txtARTnum.Enabled = True
        Else
            CboTransferName.Enabled = False
            CboTransferName.SelectedIndex = -1
            DaStartART.Enabled = False
            DaStartART.Text = "01/01/1900"
            txtARTnum.Enabled = False
            txtARTnum.Text = ""
        End If

    End Sub

    Private Sub RdTypeTB_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTypeTB.SelectedIndexChanged
        If RdTypeTB.SelectedIndex <> -1 Then
            RdTresultTB.Enabled = True
        Else
            RdTresultTB.Enabled = False
            RdTresultTB.SelectedIndex = -1
        End If
    End Sub

    Private Sub RdResultTB_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdResultTB.SelectedIndexChanged
        If RdResultTB.SelectedIndex <> -1 Then
            DaTBtreat.Enabled = True
        Else
            DaTBtreat.Enabled = False
            DaTBtreat.Text = "01/01/1900"
        End If
    End Sub

    Private Sub RdTBhistory_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTBhistory.SelectedIndexChanged
        If RdTBhistory.SelectedIndex = 0 Then
            RdTypeTB.Enabled = True
            DaSickness.Enabled = True
            DaTreatment.Enabled = True
            RdTBcat.Enabled = True
            RdResultTB.Enabled = True
        Else
            RdTypeTB.Enabled = False
            RdTypeTB.SelectedIndex = -1
            DaSickness.Enabled = False
            DaSickness.Text = "01/01/1900"
            DaTreatment.Enabled = False
            DaTreatment.Text = "01/01/1900"
            RdTBcat.Enabled = False
            RdTBcat.SelectedIndex = -1
            RdResultTB.Enabled = False
            RdResultTB.SelectedIndex = -1
        End If
    End Sub

    Private Sub RdARVhistory_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdARVhistory.SelectedIndexChanged
        If RdARVhistory.SelectedIndex = 0 Then
            CboDrugARV1.Enabled = True
        Else
            CboDrugARV1.Enabled = False
            CboDrugARV1.SelectedIndex = -1
        End If
    End Sub

    Private Sub chkDiabetes_CheckedChanged(sender As Object, e As EventArgs) Handles chkDiabetes.CheckedChanged
        If chkDiabetes.Checked Then
            CboDrugDiabet.Enabled = True
        Else
            CboDrugDiabet.SelectedIndex = -1
            CboDrugDiabet.Enabled = False
        End If
    End Sub

    Private Sub ChkHyper_CheckedChanged(sender As Object, e As EventArgs) Handles ChkHyper.CheckedChanged
        If ChkHyper.Checked Then
            CboDrugHyper.Enabled = True
        Else
            CboDrugHyper.Enabled = False
            CboDrugHyper.SelectedIndex = -1
        End If
    End Sub

    Private Sub ChkAbnormal_CheckedChanged(sender As Object, e As EventArgs) Handles ChkAbnormal.CheckedChanged
        If ChkAbnormal.Checked Then
            CboDrugAbnor.Enabled = True
        Else
            CboDrugAbnor.Enabled = False
            CboDrugAbnor.SelectedIndex = -1
        End If
    End Sub

    Private Sub ChkRenal_CheckedChanged(sender As Object, e As EventArgs) Handles ChkRenal.CheckedChanged
        If ChkRenal.Checked Then
            CboDrugRenal.Enabled = True
        Else
            CboDrugRenal.SelectedIndex = -1
            CboDrugRenal.Enabled = False
        End If
    End Sub

    Private Sub ChkAnemia_CheckedChanged(sender As Object, e As EventArgs) Handles ChkAnemia.CheckedChanged
        If ChkAnemia.Checked Then
            CboDrugAnemia.Enabled = True
        Else
            CboDrugAnemia.Enabled = False
            CboDrugAnemia.SelectedIndex = -1
        End If
    End Sub

    Private Sub Chklive_CheckedChanged(sender As Object, e As EventArgs) Handles Chklive.CheckedChanged
        If Chklive.Checked Then
            CboDrugLiver.Enabled = True
        Else
            CboDrugLiver.Enabled = False
            CboDrugLiver.SelectedIndex = -1
        End If
    End Sub

    Private Sub ChkHepB_CheckedChanged(sender As Object, e As EventArgs) Handles ChkHepB.CheckedChanged
        If ChkHepB.Checked Then
            CboDrugHepB.Enabled = True
        Else
            CboDrugHepB.Enabled = False
            CboDrugHepB.SelectedIndex = -1
        End If
    End Sub

    Private Sub ChkOther_CheckedChanged(sender As Object, e As EventArgs) Handles ChkOther.CheckedChanged
        If ChkOther.Checked Then
            CboDrugOther.Enabled = True
        Else
            CboDrugOther.Enabled = False
            CboDrugOther.SelectedIndex = -1
        End If
    End Sub

    Private Sub RdAllergy_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdAllergy.SelectedIndexChanged
        If RdAllergy.SelectedIndex = 0 Then
            CboDrugAllergy1.Enabled = True
        Else
            CboDrugAllergy1.Enabled = False
            CboDrugAllergy1.SelectedIndex = -1
        End If
    End Sub

    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
    End Sub

    Private Sub DaDob_EditValueChanged(sender As Object, e As EventArgs) Handles DaDob.EditValueChanged
        If CDate(DaDob.EditValue) <= CDate("01/01/1930") Then Exit Sub
        If CDate(DaDob.EditValue) > Now.Date Then DaDob.EditValue = "01/01/1900"
        txtAge.Text = DateDiff(DateInterval.Year, CDate(DaDob.EditValue), CDate(DafirstVisit.EditValue))
        If Val(txtAge.EditValue) < 15 Or Val(txtAge.EditValue) > 100 Then
            MessageBox.Show("Invalid Date of Birth", "Check Date of Birth", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DaDob.Text = "01/01/1900"
            Exit Sub
        End If

    End Sub

    Private Sub DafirstVisit_EditValueChanged(sender As Object, e As EventArgs) Handles DafirstVisit.EditValueChanged

        If CDate(DaDob.Text) <= CDate("01/01/1900") Then Exit Sub
        If CDate(DafirstVisit.EditValue) > Now.Date Then DafirstVisit.EditValue = "01/01/1900"
        If CDate(DafirstVisit.EditValue) <= CDate("01/01/1900") Then Exit Sub

        txtAge.Text = DateDiff(DateInterval.Year, CDate(DaDob.EditValue), CDate(DafirstVisit.EditValue))
        If Val(txtAge.Text) < 15 Or Val(txtAge.EditValue) > 100 Then
            MessageBox.Show("Invalid date first Visit !", "Check Date first", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DafirstVisit.Text = "01/01/1900"
            Exit Sub
        End If

    End Sub

    Private Sub DaStartART_EditValueChanged(sender As Object, e As EventArgs) Handles DaStartART.EditValueChanged
        '  If CDate(DaStartART.Text) = CDate("01/01/1900") Then Exit Sub
        If DaStartART.Enabled = True Then
            If CDate(DaStartART.EditValue) > Now.Date Then
                MessageBox.Show("Invalid Date started ART in National Program ", "Check Date Start ART", MessageBoxButtons.OK, MessageBoxIcon.Error)
                DaStartART.Text = "01/01/1900"
            End If
        End If
    End Sub

    Private Sub DaSickness_EditValueChanged(sender As Object, e As EventArgs) Handles DaSickness.EditValueChanged
        If DaSickness.Enabled = True Then
            If CDate(DaSickness.EditValue) > Now.Date Then
                MessageBox.Show("Invalid Date onset of sickness", "Check Date onset", MessageBoxButtons.OK, MessageBoxIcon.Error)
                DaSickness.Text = "01/01/1900"
            End If
        End If
    End Sub

    Private Sub DaTreatment_EditValueChanged(sender As Object, e As EventArgs) Handles DaTreatment.EditValueChanged
        If DaTreatment.Enabled = True Then
            If CDate(DaTreatment.EditValue) > Now.Date Then
                MessageBox.Show("Invalid Date of treatment", "Check Date of treatment", MessageBoxButtons.OK, MessageBoxIcon.Error)
                DaTreatment.Text = "01/01/1900"
            End If
        End If
    End Sub

    Private Sub DaTBtreat_EditValueChanged(sender As Object, e As EventArgs) Handles DaTBtreat.EditValueChanged
        If DaTBtreat.Enabled = True Then
            If CDate(DaTBtreat.EditValue) > Now.Date Then
                MessageBox.Show("Invalid Date of complete treatment", "Check Date of complete treatment", MessageBoxButtons.OK, MessageBoxIcon.Error)
                DaTBtreat.Text = "01/01/1900"
            End If
        End If
    End Sub

    Private Sub RdEducation_DoubleClick(sender As Object, e As EventArgs) Handles RdEducation.DoubleClick
        RdEducation.SelectedIndex = -1
    End Sub


    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub

    Private Sub txtAge_Leave(sender As Object, e As EventArgs) Handles txtAge.Leave
        If txtAge.EditValue <> "" Then
            ' dastarmanage.Text = Now.Date
            If CDate(DafirstVisit.Text) < CDate("01/01/1960") Then
                DafirstVisit.Text = Now.Date
            End If
            '  DaDob.Text = CDate(DateAdd(DateInterval.Year, -Val(txtAge.EditValue), CDate(DaFirstVisit.Text)))
            If CDate(DaDob.EditValue) <= CDate("01/01/1940") Or ag = True Then
                DaDob.EditValue = DateAdd(DateInterval.Year, -Val(txtAge.EditValue), CDate(DafirstVisit.EditValue))
            End If
            ag = False
            If Val(txtAge.EditValue) < 15 Or Val(txtAge.EditValue) > 100 Then
                MessageBox.Show("Invalid Age of Adult Patient", "Check Age", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
                DaDob.Text = "01/01/1900"
                DafirstVisit.EditValue = "01/01/1900"
                txtAge.Text = ""
            End If
        End If
    End Sub
#Region "Function"
    Private Sub Clear()
        txtClinicID.Text = ""
        XtraTabControl1.SelectedTabPage = XtraTabPage2
        OptReturn.SelectedIndex = -1
        txtClinicID.Focus()
        DafirstVisit.Text = "01/01/1900"
        ChkLostReturn.Checked = False
        DaDob.Text = "01/01/1900"
        txtAge.Text = ""
        RdSex.SelectedIndex = -1
        RdEducation.SelectedIndex = -1
        RdRead.SelectedIndex = -1
        RdWrite.SelectedIndex = -1
        RdRefer.SelectedIndex = -1
        DaTestHIV.Text = "01/01/1900"
        CboVcctname.SelectedIndex = -1
        TxtVcctID.Text = ""
        RdTransferIn.SelectedIndex = -1
        txtPclinicID.Text = ""
        RdTBhistory.SelectedIndex = -1
        RdTPT.SelectedIndex = -1
        RdTPTdrug.SelectedIndex = -1
        DaTreatment.Text = "01/01/1900"
        RdTresultTB.SelectedIndex = -1
        RdTypeTB.SelectedIndex = -1
        DaSickness.Text = "01/01/1900"
        RdTBcat.SelectedIndex = -1
        RdResultTB.SelectedIndex = -1
        RdARVhistory.SelectedIndex = -1
        chkDiabetes.Checked = False
        ChkHyper.Checked = False
        ChkAbnormal.Checked = False
        ChkRenal.Checked = False
        ChkAnemia.Checked = False
        Chklive.Checked = False
        ChkHepB.Checked = False
        ChkOther.Checked = False
        RdAllergy.SelectedIndex = -1
        tin = 0
        tsbDelete.Enabled = False
        tsbDelete1.Enabled = False
        CboDrugARV1.Enabled = False
        CboDrugAllergy1.Enabled = False

        CboSiteOld.SelectedIndex = -1
        CboNationality.SelectedIndex = -1
        CboTarGroup.SelectedIndex = -1
        rdrrefuges.SelectedIndex = -1
        txtrefugart.Text = ""
        txtrefugart.Enabled = False
        cborefugsite.Text = ""
        cborefugsite.Enabled = False

    End Sub
    Private Sub loadData()
        CboTransferName.Properties.Items.Add("")
        CboSiteOld.Properties.Items.Add("")
        cborefugsite.Properties.Items.Add("")

        Dim CmdART As New MySqlCommand("Select * from tblartsite where status ='1' order by sid", Cnndb)
        Rdr = CmdART.ExecuteReader
        While Rdr.Read
            CboTransferName.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
            CboSiteOld.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
            cborefugsite.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        CboVcctname.Properties.Items.Add("")
        Dim CmdVcct As New MySqlCommand("Select * from tblvcctsite where status ='1' order by vid", Cnndb)
        Rdr = CmdVcct.ExecuteReader
        While Rdr.Read
            CboVcctname.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()

        dt = New DataTable
        dt.Columns.Add("No", GetType(Double))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Date-First", GetType(Date))
        dt.Columns.Add("Age", GetType(Int32))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Referred", GetType(String))
        dt.Columns.Add("Transfer-In", GetType(Boolean))
        dt.Columns.Add("Site Code", GetType(String))
        dt.Columns.Add("ART Number", GetType(String))
        dt.Columns.Add("Lost-Return", GetType(String))
        dt.Columns.Add("VCCTCode", GetType(String))
        dt.Columns.Add("TargetGroup", GetType(String))
        dt.Columns.Add("Nationality", GetType(String))
        GridControl1.DataSource = dt

        CboDrugARV1.Properties.Items.Add("")
        CboDrugARV2.Properties.Items.Add("")
        CboDrugARV3.Properties.Items.Add("")
        CboDrugARV4.Properties.Items.Add("")
        CboDrugARV5.Properties.Items.Add("")
        CboDrugARV6.Properties.Items.Add("")
        Dim cmdDrug As New MySqlCommand("Select * from tbldrug  order by drugname", Cnndb)
        Rdr = cmdDrug.ExecuteReader
        While Rdr.Read
            If CDec(Rdr.GetValue(2).ToString) = 0 Then
                CboDrugARV1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            End If
        End While
        Rdr.Close()
        CboClinicARV1.Properties.Items.Add("")
        CboClinicARV2.Properties.Items.Add("")
        CboClinicARV3.Properties.Items.Add("")
        CboClinicARV4.Properties.Items.Add("")
        CboClinicARV5.Properties.Items.Add("")
        CboClinicARV6.Properties.Items.Add("")
        CboClinicDiabet.Properties.Items.Add("")
        CboClinicHyper.Properties.Items.Add("")
        CboClinicRenal.Properties.Items.Add("")
        CboClinicAnemia.Properties.Items.Add("")
        CboClinicLiver.Properties.Items.Add("")
        CboClinicHepBC.Properties.Items.Add("")
        CboClinicOther.Properties.Items.Add("")
        CboClinicAbnor.Properties.Items.Add("")
        Dim CmdClinic As New MySqlCommand("Select * from tblclinic ", Cnndb)
        Rdr = CmdClinic.ExecuteReader
        While Rdr.Read
            CboClinicARV1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicDiabet.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicHyper.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicRenal.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicAnemia.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicLiver.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicHepBC.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicOther.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicAbnor.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        CboNoteARV1.Items.Add("")
        CboNoteARV2.Items.Add("")
        CboNoteARV3.Items.Add("")
        CboNoteARV4.Items.Add("")
        CboNoteARV5.Items.Add("")
        CboNoteARV6.Items.Add("")
        CboNoteDiabet.Items.Add("")
        CboNoteHyper.Items.Add("")
        CboNoteAbnor.Items.Add("")
        CboNoteRenal.Items.Add("")
        CboNoteAnemia.Items.Add("")
        CboNoteLiver.Items.Add("")
        CboNoteHepBC.Items.Add("")
        CboNoteOther.Items.Add("")
        Dim CmdReason As New MySqlCommand("Select * from tblreason", Cnndb)
        Rdr = CmdReason.ExecuteReader
        While Rdr.Read
            CboNoteARV1.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV2.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV3.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV4.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV5.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV6.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteDiabet.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteHyper.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteAbnor.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteRenal.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteAnemia.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteLiver.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteHepBC.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteOther.Items.Add(Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        CboDrugDiabet.Properties.Items.Add("")
        CboDrugHyper.Properties.Items.Add("")
        CboDrugAbnor.Properties.Items.Add("")
        CboDrugRenal.Properties.Items.Add("")
        CboDrugAnemia.Properties.Items.Add("")
        CboDrugLiver.Properties.Items.Add("")
        CboDrugHepB.Properties.Items.Add("")
        CboDrugOther.Properties.Items.Add("")
        Dim CmddrugTran As New MySqlCommand("Select * from tbldrugtreat", Cnndb)
        Rdr = CmddrugTran.ExecuteReader
        While Rdr.Read
            CboDrugDiabet.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboDrugHyper.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboDrugAbnor.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboDrugRenal.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboDrugAnemia.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboDrugLiver.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboDrugHepB.Properties.Items.Add(Rdr.GetValue(1).ToString)
            CboDrugOther.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        Dim CmdAllergy As New MySqlCommand("Select * from tblallergy order by AllergyStatus", Cnndb)
        Rdr = CmdAllergy.ExecuteReader
        While Rdr.Read
            Select Case CDec(Rdr.GetValue(2).ToString)
                Case 0
                    CboDrugAllergy1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboDrugAllergy2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboDrugAllergy3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboDrugAllergy4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboDrugAllergy5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboDrugAllergy6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                Case 1
                    CboAllergy1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboAllergy2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboAllergy3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboAllergy4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboAllergy5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                    CboAllergy6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            End Select
        End While
        Rdr.Close()
        CboNationality.Properties.Items.Add("")
        Dim cmdNational As New MySqlCommand("Select * from tblNationality order by nationality asc", Cnndb)
        Rdr = cmdNational.ExecuteReader
        While Rdr.Read
            CboNationality.Properties.Items.Add(Rdr.GetValue(0).ToString & "--" & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        CboTarGroup.Properties.Items.Add("")
        Dim CmdTarGroup As New MySqlCommand("Select * from tbltargroup where status ='1' order by Tid", Cnndb)
        Rdr = CmdTarGroup.ExecuteReader
        While Rdr.Read
            CboTarGroup.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & "--" & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub ARVTreat1()
        ARVTreat2()
        If CboDrugARV1.SelectedIndex >= 0 Then

            CboDrugARV2.Enabled = True
            CboClinicARV1.Enabled = True
            DaStartARV1.Enabled = True
            DaStopARV1.Enabled = True
            CboNoteARV1.Enabled = True
            CheckStartDate(DaStartARV1, DaStopARV1, CboNoteARV1)
        Else
            CboClinicARV1.Enabled = False
            DaStartARV1.Enabled = False
            DaStopARV1.Enabled = False
            CboNoteARV1.Enabled = False
            CboClinicARV1.SelectedIndex = -1
            DaStartARV1.Text = "01/01/1900"
            DaStopARV1.Text = "01/01/1900"
            CboNoteARV1.SelectedIndex = -1
            CboDrugARV2.SelectedIndex = -1
            CboDrugARV2.Enabled = False
        End If
    End Sub
    Private Sub ARVTreat2()
        ARVTreat3()
        If CboDrugARV2.SelectedIndex >= 0 Then
            CboDrugARV3.Enabled = True
            CboClinicARV2.Enabled = True
            DaStartARV2.Enabled = True
            DaStopARV2.Enabled = True
            CboNoteARV2.Enabled = True
            CheckStartDate(DaStartARV2, DaStopARV2, CboNoteARV2)
        Else
            CboClinicARV2.Enabled = False
            DaStartARV2.Enabled = False
            DaStopARV2.Enabled = False
            CboNoteARV2.Enabled = False
            CboClinicARV2.SelectedIndex = -1
            DaStartARV2.Text = "01/01/1900"
            DaStopARV2.Text = "01/01/1900"
            CboNoteARV2.SelectedIndex = -1
            CboDrugARV3.Enabled = False
            CboDrugARV3.SelectedIndex = -1
        End If
    End Sub
    Private Sub ARVTreat3()
        ARVTreat4()
        If CboDrugARV3.SelectedIndex >= 0 Then

            CboDrugARV4.Enabled = True
            CboClinicARV3.Enabled = True
            DaStartARV3.Enabled = True
            DaStopARV3.Enabled = True
            CboNoteARV3.Enabled = True
            CheckStartDate(DaStartARV3, DaStopARV3, CboNoteARV3)
        Else
            CboClinicARV3.Enabled = False
            DaStartARV3.Enabled = False
            DaStopARV3.Enabled = False
            CboNoteARV3.Enabled = False
            CboClinicARV3.SelectedIndex = -1
            DaStartARV3.Text = "01/01/1900"
            DaStopARV3.Text = "01/01/1900"
            CboNoteARV3.SelectedIndex = -1
            CboDrugARV4.Enabled = False
            CboDrugARV4.SelectedIndex = -1
        End If
    End Sub
    Private Sub ARVTreat4()
        ARVTreat5()
        If CboDrugARV4.SelectedIndex >= 0 Then

            CboDrugARV5.Enabled = True
            CboClinicARV4.Enabled = True
            DaStartARV4.Enabled = True
            DaStopARV4.Enabled = True
            CboNoteARV4.Enabled = True
            CheckStartDate(DaStartARV4, DaStopARV4, CboNoteARV4)
        Else
            CboClinicARV4.Enabled = False
            DaStartARV4.Enabled = False
            DaStopARV4.Enabled = False
            CboNoteARV4.Enabled = False
            CboClinicARV4.SelectedIndex = -1
            DaStartARV4.Text = "01/01/1900"
            DaStopARV4.Text = "01/01/1900"
            CboNoteARV4.SelectedIndex = -1
            CboDrugARV5.Enabled = False
            CboDrugARV5.SelectedIndex = -1
        End If
    End Sub
    Private Sub ARVTreat5()
        ARVTreat6()
        If CboDrugARV5.SelectedIndex >= 0 Then

            CboDrugARV6.Enabled = True
            CboClinicARV5.Enabled = True
            DaStartARV5.Enabled = True
            DaStopARV5.Enabled = True
            CboNoteARV5.Enabled = True
            CheckStartDate(DaStartARV5, DaStopARV5, CboNoteARV5)
        Else
            CboClinicARV5.Enabled = False
            DaStartARV5.Enabled = False
            DaStopARV5.Enabled = False
            CboNoteARV5.Enabled = False
            CboClinicARV5.SelectedIndex = -1
            DaStartARV5.Text = "01/01/1900"
            DaStopARV5.Text = "01/01/1900"
            CboNoteARV5.SelectedIndex = -1
            CboDrugARV6.Enabled = False
            CboDrugARV6.SelectedIndex = -1
        End If
    End Sub
    Private Sub ARVTreat6()
        If CboDrugARV6.SelectedIndex >= 0 Then
            CboClinicARV6.Enabled = True
            DaStartARV6.Enabled = True
            DaStopARV6.Enabled = True
            CboNoteARV6.Enabled = True
            CheckStartDate(DaStartARV6, DaStopARV6, CboNoteARV6)
        Else
            CboClinicARV6.Enabled = False
            DaStartARV6.Enabled = False
            DaStopARV6.Enabled = False
            CboNoteARV6.Enabled = False
            CboClinicARV6.SelectedIndex = -1
            DaStartARV6.Text = "01/01/1900"
            DaStopARV6.Text = "01/01/1900"
            CboNoteARV6.SelectedIndex = -1
            CboDrugARV6.SelectedIndex = -1
        End If
    End Sub
    Private Sub OtherMedical1()
        If CboDrugDiabet.SelectedIndex >= 0 Then
            CboClinicDiabet.Enabled = True
            DaStartDiabet.Enabled = True

            CheckStartDate(DaStartDiabet, DaStoptDiabet, CboNoteDiabet)
        Else
            CboClinicDiabet.Enabled = False
            DaStartDiabet.Enabled = False
            DaStartDiabet.Text = "01/01/1900"
            DaStoptDiabet.Text = "01/01/1900"
            CboClinicDiabet.SelectedIndex = -1
            CboNoteDiabet.SelectedIndex = -1
        End If
    End Sub
    Private Sub OtherMedicalHyper()
        If CboDrugHyper.SelectedIndex >= 0 Then
            CboClinicHyper.Enabled = True
            DaStartHyper.Enabled = True

            CheckStartDate(DaStartHyper, DaStoptHyper, CboNoteHyper)
        Else
            CboClinicHyper.Enabled = False
            DaStartHyper.Enabled = False
            DaStartHyper.Text = "01/01/1900"
            DaStoptHyper.Text = "01/01/1900"
            CboClinicHyper.SelectedIndex = -1
            CboNoteHyper.SelectedIndex = -1
        End If
    End Sub
    Private Sub CheckStartDate(ByVal StartDate As DateTimePicker, ByVal StopDate As DateTimePicker, ByVal CboNote As ComboBox)
        If DateDiff(DateInterval.Day, StartDate.Value.Date, CDate("01/01/1900")) = 0 Then
            StopDate.Enabled = False
            CboNote.Enabled = False
        Else
            StopDate.Enabled = True
            CboNote.Enabled = True
        End If
    End Sub
    Private Sub CheckStopDate(ByVal StopDate As DateTimePicker, ByVal CboNote As ComboBox)
        If DateDiff(DateInterval.Day, StopDate.Value.Date, CDate("01/01/1900")) = 0 Then
            CboNote.Enabled = False
            CboNote.SelectedIndex = -1
        Else
            CboNote.Enabled = True
        End If
    End Sub
    Private Sub Allergy(ByVal Drug As DevExpress.XtraEditors.ComboBoxEdit, ByVal Allergy As DevExpress.XtraEditors.ComboBoxEdit, ByVal Drug1 As DevExpress.XtraEditors.ComboBoxEdit, ByVal Dat As DevExpress.XtraEditors.DateEdit)
        If Drug.SelectedIndex > 0 Then
            Allergy.Enabled = True
            Drug1.Enabled = True
            Dat.Enabled = True
        Else
            Allergy.Enabled = False
            Allergy.SelectedIndex = -1
            Dat.Enabled = False
            Dat.Text = "01/01/1900"
            Drug1.Enabled = False
            Drug1.SelectedIndex = -1
            Drug.SelectedIndex = -1
            Drug.Enabled = False

        End If

    End Sub
    Private Sub ViewData(sqlstring As String)
        Dim i As Int64
        dt.Clear()
        Dim CmdSearch As New MySqlCommand(sqlstring, Cnndb)
        Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
                dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(5).ToString), CDate(Rdr.GetValue(1).ToString))
                Select Case Val(Rdr.GetValue(6).ToString)
                    Case 0
                        dr(4) = "Female"
                    Case 1
                        dr(4) = "Male"
                End Select
                Select Case Val(Rdr.GetValue(10).ToString)
                    Case 0
                        dr(5) = "មកដោយខ្លូនឯង"
                    Case 1
                        dr(5) = "ការថែទាំតាមផ្ទះ និងសហគមន៍"
                    Case 2
                        dr(5) = "VCCT"
                    Case 3
                        dr(5) = "PMTCT"
                    Case 4
                        dr(5) = "TB Program"
                    Case 5
                        dr(5) = "មផ្ឈមណ្ឌលផ្តល់ឈាម"
                    Case 6
                        dr(5) = "Other"
                End Select
                Select Case Val(Rdr.GetValue(16).ToString)
                    Case 0
                        dr(6) = False
                    Case 1
                        dr(6) = True
                End Select
                dr(7) = Rdr.GetValue(17).ToString.Trim
                dr(8) = Rdr.GetValue(19).ToString.Trim

                Select Case CDec(Rdr.GetValue(2).ToString)
                    Case 0
                        dr(9) = "In"
                    Case 1
                        dr(9) = "Out"
                End Select
                dr(10) = Rdr.GetValue(14).ToString.Trim

                dr(11) = Rdr.GetValue(50).ToString.Trim

                dr(12) = Rdr.GetValue(48).ToString.Trim

                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
    End Sub
    Private Sub Search(ByVal id As DevExpress.XtraEditors.TextEdit)

        Dim CmdSarch As New MySqlCommand("Select * from tblaimain where clinicid='" & Val(id.Text) & "'", Cnndb)
        Rdr = CmdSarch.ExecuteReader
        While Rdr.Read
            If Rs = False Then
                DafirstVisit.Text = CDate(Rdr.GetValue(1).ToString).Date
                If Val(Rdr.GetValue(2).ToString) <> -1 Then
                    ChkLostReturn.Checked = True
                    OptReturn.SelectedIndex = Rdr.GetValue(2).ToString
                    txtRclinicID.Text = Rdr.GetValue(3).ToString
                    For i As Int16 = 0 To CboSiteOld.Properties.Items.Count - 1
                        If Rdr.GetValue(4).ToString.Trim = Mid(CboSiteOld.Properties.Items(i).ToString, 1, 4) Then
                            CboSiteOld.SelectedIndex = i
                            Exit For
                        End If
                    Next
                End If
                tsbDelete.Enabled = True
                tsbDelete1.Enabled = True
            End If
            DaDob.Text = CDate(Rdr.GetValue(5).ToString).Date
            RdSex.SelectedIndex = Rdr.GetValue(6).ToString
            RdEducation.SelectedIndex = Rdr.GetValue(7).ToString
            RdRead.SelectedIndex = Rdr.GetValue(8).ToString
            RdWrite.SelectedIndex = Rdr.GetValue(9).ToString
            RdRefer.SelectedIndex = Rdr.GetValue(10).ToString
            txtReferOther.Text = Rdr.GetValue(11).ToString
            DaTestHIV.Text = CDate(Rdr.GetValue(12).ToString).Date
            For i As Int16 = 0 To CboVcctname.Properties.Items.Count - 1
                If Rdr.GetValue(13).ToString.Trim = Mid(CboVcctname.Properties.Items(i).ToString, 1, 6) Then
                    CboVcctname.SelectedIndex = i
                    Exit For
                End If
            Next
            TxtVcctID.Text = Rdr.GetValue(14).ToString
            txtPclinicID.Text = Rdr.GetValue(15).ToString
            RdTransferIn.SelectedIndex = Rdr.GetValue(16).ToString
            tin = Rdr.GetValue(16).ToString
            For i As Int16 = 0 To CboTransferName.Properties.Items.Count - 1
                If Rdr.GetValue(17).ToString.Trim = Mid(CboTransferName.Properties.Items(i).ToString, 1, 4) Then
                    CboTransferName.SelectedIndex = i
                    Exit For
                End If
            Next
            DaStartART.Text = CDate(Rdr.GetValue(18).ToString).Date
            txtARTnum.Text = Rdr.GetValue(19).ToString
            RdTBhistory.SelectedIndex = Rdr.GetValue(20).ToString
            RdTPT.SelectedIndex = Rdr.GetValue(21).ToString
            RdTPTdrug.SelectedIndex = Rdr.GetValue(22).ToString
            DaStartTPT.Text = CDate(Rdr.GetValue(23).ToString).Date
            DaEndTPT.Text = CDate(Rdr.GetValue(24).ToString).Date


            RdTypeTB.SelectedIndex = Rdr.GetValue(25).ToString
            RdTresultTB.SelectedIndex = Rdr.GetValue(26).ToString
            DaSickness.Text = CDate(Rdr.GetValue(27).ToString).Date
            RdTBcat.SelectedIndex = Rdr.GetValue(28).ToString
            DaTreatment.Text = CDate(Rdr.GetValue(29).ToString).Date
            RdResultTB.SelectedIndex = Rdr.GetValue(30).ToString
            DaTBtreat.Text = CDate(Rdr.GetValue(31).ToString).Date
            RdARVhistory.SelectedIndex = Rdr.GetValue(32).ToString
            Try
                chkDiabetes.Checked = Rdr.GetValue(33).ToString
                ChkHyper.Checked = Rdr.GetValue(34).ToString
                ChkAbnormal.Checked = Rdr.GetValue(35).ToString
                ChkRenal.Checked = Rdr.GetValue(36).ToString
                ChkAnemia.Checked = Rdr.GetValue(37).ToString
                Chklive.Checked = Rdr.GetValue(38).ToString
                ChkHepB.Checked = Rdr.GetValue(39).ToString
                ChkOther.Checked = Rdr.GetValue(40).ToString
            Catch ex As Exception
            End Try
            RdAllergy.SelectedIndex = Rdr.GetValue(41).ToString
            For i As Int32 = 0 To CboNationality.Properties.Items.Count - 1
                Dim n() As String = Split(CboNationality.Properties.Items(i).ToString, "--")
                If Rdr.GetValue(42).ToString.Trim = n(0) Then
                    CboNationality.SelectedIndex = i
                    Exit For
                End If
            Next
            For i As Int32 = 0 To CboTarGroup.Properties.Items.Count - 1
                Dim t() As String = Split(CboTarGroup.Properties.Items(i).ToString, "--")
                If Rdr.GetValue(43).ToString.Trim = t(0) Then
                    CboTarGroup.SelectedIndex = i
                    Exit For
                End If
            Next
            rdrrefuges.SelectedIndex = If(String.IsNullOrEmpty(Rdr.GetValue(44).ToString), -1, CInt(Rdr.GetValue(44).ToString))
            txtrefugart.Text = Rdr.GetValue(45).ToString.Trim
            For i As Int16 = 0 To CboTransferName.Properties.Items.Count - 1
                If Rdr.GetValue(46).ToString.Trim = Mid(CboTransferName.Properties.Items(i).ToString, 1, 4) Then
                    cborefugsite.SelectedIndex = i
                    Exit For
                End If
            Next

        End While
        Rdr.Close()
        Dim CmdHis As New MySqlCommand("Select * from tblaiarvtreathis where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdHis.ExecuteReader
        Dim i1 As Integer
        While Rdr.Read
            i1 = i1 + 1
            Select Case i1
                Case 1
                    CboDrugARV1.Enabled = True
                    CboDrugARV1.Text = Rdr.GetValue(1).ToString
                    CboClinicARV1.Text = Rdr.GetValue(2).ToString
                    DaStartARV1.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV1.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV1.Text = Rdr.GetValue(5).ToString
                Case 2
                    CboDrugARV2.Enabled = True
                    CboDrugARV2.Text = Rdr.GetValue(1).ToString
                    CboClinicARV2.Text = Rdr.GetValue(2).ToString
                    DaStartARV2.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV2.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV2.Text = Rdr.GetValue(5).ToString
                Case 3
                    CboDrugARV3.Enabled = True
                    CboDrugARV3.Text = Rdr.GetValue(1).ToString
                    CboClinicARV3.Text = Rdr.GetValue(2).ToString
                    DaStartARV3.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV3.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV3.Text = Rdr.GetValue(5).ToString
                Case 4
                    CboDrugARV4.Enabled = True
                    CboDrugARV4.Text = Rdr.GetValue(1).ToString
                    CboClinicARV4.Text = Rdr.GetValue(2).ToString
                    DaStartARV4.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV4.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV4.Text = Rdr.GetValue(5).ToString
                Case 5
                    CboDrugARV5.Enabled = True
                    CboDrugARV5.Text = Rdr.GetValue(1).ToString
                    CboClinicARV5.Text = Rdr.GetValue(2).ToString
                    DaStartARV5.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV5.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV5.Text = Rdr.GetValue(5).ToString
                Case 6
                    CboDrugARV6.Enabled = True
                    CboDrugARV6.Text = Rdr.GetValue(1).ToString
                    CboClinicARV6.Text = Rdr.GetValue(2).ToString
                    DaStartARV6.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV6.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV6.Text = Rdr.GetValue(5).ToString
            End Select
        End While
        Rdr.Close()
        Dim CmdAller As New MySqlCommand("Select * from tblaiallergy where clinicID ='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdAller.ExecuteReader
        i1 = 0
        While Rdr.Read
            i1 = i1 + 1
            Select Case i1
                Case 1
                    CboDrugAllergy1.Enabled = True
                    '  CboDrugAllergy1.SelectedIndex = 1
                    CboDrugAllergy1.Text = Rdr.GetValue(1).ToString
                    CboAllergy1.Text = Rdr.GetValue(2).ToString
                    DaAllergy1.Text = CDate(Rdr.GetValue(3).ToString).Date
                Case 2
                    CboDrugAllergy2.Enabled = True
                    CboDrugAllergy2.Text = Rdr.GetValue(1).ToString
                    CboAllergy2.Text = Rdr.GetValue(2).ToString
                    DaAllergy2.Text = CDate(Rdr.GetValue(3).ToString).Date
                Case 3
                    CboDrugAllergy3.Enabled = True
                    CboDrugAllergy3.Text = Rdr.GetValue(1).ToString
                    CboAllergy3.Text = Rdr.GetValue(2).ToString
                    DaAllergy3.Text = CDate(Rdr.GetValue(3).ToString).Date
                Case 4
                    CboDrugAllergy4.Enabled = True
                    CboDrugAllergy4.Text = Rdr.GetValue(1).ToString
                    CboAllergy4.Text = Rdr.GetValue(2).ToString
                    DaAllergy4.Text = CDate(Rdr.GetValue(3).ToString).Date
                Case 5
                    CboDrugAllergy5.Enabled = True
                    CboDrugAllergy5.Text = Rdr.GetValue(1).ToString
                    CboAllergy5.Text = Rdr.GetValue(2).ToString
                    DaAllergy5.Text = CDate(Rdr.GetValue(3).ToString).Date
                Case 6
                    CboDrugAllergy6.Enabled = True
                    CboDrugAllergy6.Text = Rdr.GetValue(1).ToString
                    CboAllergy6.Text = Rdr.GetValue(2).ToString
                    DaAllergy6.Text = CDate(Rdr.GetValue(3).ToString).Date
            End Select
        End While
        Rdr.Close()
        Dim CmdAb As New MySqlCommand("Select * from tblaiothmedabnormal where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdAb.ExecuteReader
        While Rdr.Read
            CboDrugAbnor.Enabled = True
            CboDrugAbnor.Text = Rdr.GetValue(1).ToString
            CboClinicAbnor.Text = Rdr.GetValue(2).ToString
            DaStartAbnor.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptAbnor.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteAbnor.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()
        Dim Cmdmenia As New MySqlCommand("Select * from tblaiothmedanemia where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = Cmdmenia.ExecuteReader
        While Rdr.Read
            CboDrugAnemia.Enabled = True
            CboDrugAnemia.Text = Rdr.GetValue(1).ToString
            CboClinicAnemia.Text = Rdr.GetValue(2).ToString
            DaStartAnemia.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptAnemia.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteAnemia.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()
        Dim CmdBet As New MySqlCommand("Select * from tblaiothmeddiabete where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdBet.ExecuteReader
        While Rdr.Read
            CboDrugDiabet.Enabled = True
            CboDrugDiabet.Text = Rdr.GetValue(1).ToString
            CboClinicDiabet.Text = Rdr.GetValue(2).ToString
            DaStartDiabet.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptDiabet.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteDiabet.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()
        Dim CmdHeb As New MySqlCommand("Select * from tblaiothmedhepbc where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdHeb.ExecuteReader
        While Rdr.Read
            CboDrugHepB.Enabled = True
            CboDrugHepB.Text = Rdr.GetValue(1).ToString
            CboClinicHepBC.Text = Rdr.GetValue(2).ToString
            DaStartHepBC.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptHepBC.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteHepBC.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()
        Dim CmdHyp As New MySqlCommand("Select * from tblaiothmedhyper where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdHyp.ExecuteReader
        While Rdr.Read
            CboDrugHyper.Text = Rdr.GetValue(1).ToString
            CboClinicHyper.Text = Rdr.GetValue(2).ToString
            DaStartHyper.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptHyper.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteHyper.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()
        Dim CmdLiv As New MySqlCommand("Select * from tblaiothmedliver where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdLiv.ExecuteReader
        While Rdr.Read
            CboDrugLiver.Enabled = True
            CboDrugLiver.Text = Rdr.GetValue(1).ToString
            CboClinicLiver.Text = Rdr.GetValue(2).ToString
            DaStartLiver.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptLiver.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteLiver.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()
        Dim cmdot As New MySqlCommand("Select * from tblaiothmedliver where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = cmdot.ExecuteReader
        While Rdr.Read
            CboDrugOther.Enabled = True
            CboDrugOther.Text = Rdr.GetValue(1).ToString
            CboClinicOther.Text = Rdr.GetValue(2).ToString
            DaStartOther.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptOther.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteOther.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()
        Dim CmdRe As New MySqlCommand("Select * from tblaiothmedrenal where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
        Rdr = CmdRe.ExecuteReader
        While Rdr.Read
            CboDrugRenal.Enabled = True
            CboDrugRenal.Text = Rdr.GetValue(1).ToString
            CboClinicRenal.Text = Rdr.GetValue(2).ToString
            DaStartRenal.Text = CDate(Rdr.GetValue(3).ToString).Date
            DaStoptRenal.Text = CDate(Rdr.GetValue(4).ToString).Date
            CboNoteRenal.Text = Rdr.GetValue(5).ToString
        End While
        Rdr.Close()

    End Sub
    Private Sub Save()
        If txtClinicID.Text.Trim = "" Then MessageBox.Show("Please input ClinicID", "Required.....", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If CDate(DafirstVisit.Text) < CDate("01/01/2000") Then MessageBox.Show("Please input Date First Visit", "Required.......", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If Val(txtAge.Text) < 14 Then MessageBox.Show("Invalid Patient Age!!", "Check Age", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If RdSex.SelectedIndex = -1 Then MessageBox.Show("Please select Patient Sex !", "Save Adult Initial Visit", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If CDate(DaTestHIV.Text) < CDate("01/01/1990") And rdrrefuges.SelectedIndex < 0 And OptReturn.SelectedIndex <> 1 Then
            MessageBox.Show("Please input VCCT Test Date", "VCCT Test Date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            Exit Sub
        End If
        If CDate(DafirstVisit.Text) >= CDate("18/09/2023") And OptReturn.SelectedIndex = -1 And RdTransferIn.SelectedIndex <> 1 And (CboVcctname.SelectedIndex = -1 Or CboVcctname.Text = "") And rdrrefuges.SelectedIndex < 0 And OptReturn.SelectedIndex <> 1 Then MessageBox.Show("Please select VCCT site name!", "VCCT Name", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub 'add by sithorn
        If CDate(DafirstVisit.Text) >= CDate("18/09/2023") And OptReturn.SelectedIndex = -1 And RdTransferIn.SelectedIndex <> 1 And (TxtVcctID.Text = "" Or TxtVcctID.Text = "0") And rdrrefuges.SelectedIndex < 0 And OptReturn.SelectedIndex <> 1 Then MessageBox.Show("Please input VCCT client code", "VCCT ID", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub 'add by sithorn
        If RdTransferIn.SelectedIndex = 1 And txtARTnum.Text.Trim = "" Then MessageBox.Show("Please input ART Number !", "ART Number ", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        Dim N() As String = Split(CboNationality.Text, "--")
        Dim T() As String = Split(CboTarGroup.Text, "--")
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Are you sure do you want to save !", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Information) = DialogResult.Yes Then
                Dim CmdAimain As New MySqlCommand("Insert into tblaimain values('" & txtClinicID.Text & "','" & Format(CDate(DafirstVisit.EditValue), "yyyy-MM-dd") & "','" & OptReturn.SelectedIndex & "','" & txtRclinicID.Text.Trim & "','" & Mid(CboSiteOld.Text, 1, 4) & "','" & Format(CDate(DaDob.EditValue), "yyyy-MM-dd") & "','" & RdSex.SelectedIndex & "','" & RdEducation.SelectedIndex & "'," &
                                              "'" & RdRead.SelectedIndex & "','" & RdWrite.SelectedIndex & "','" & RdRefer.SelectedIndex & "','" & txtReferOther.Text.Trim & "','" & Format(CDate(DaTestHIV.EditValue), "yyyy-MM-dd") & "','" & Mid(CboVcctname.Text, 1, 6) & "','" & TxtVcctID.Text.Trim & "','" & txtPclinicID.Text.Trim & "'," &
                                              "'" & RdTransferIn.SelectedIndex & "','" & Mid(CboTransferName.Text, 1, 4) & "','" & Format(CDate(DaStartART.EditValue), "yyyy-MM-dd") & "','" & txtARTnum.Text.Trim & "','" & RdTBhistory.SelectedIndex & "','" & RdTPT.SelectedIndex & "','" & RdTPTdrug.SelectedIndex & "','" & Format(CDate(DaStartTPT.EditValue), "yyyy-MM-dd") & "','" & Format(CDate(DaEndTPT.EditValue), "yyyy-MM-dd") & "','" & RdTypeTB.SelectedIndex & "','" & RdTresultTB.SelectedIndex & "'," &
                                              "'" & Format(CDate(DaSickness.EditValue), "yyyy-MM-dd") & "','" & RdTBcat.SelectedIndex & "','" & Format(CDate(DaTreatment.EditValue), "yyyy-MM-dd") & "','" & RdResultTB.SelectedIndex & "','" & Format(CDate(DaTBtreat.EditValue), "yyyy-MM-dd") & "','" & RdARVhistory.SelectedIndex & "','" & chkDiabetes.Checked & "'," &
                                              "'" & ChkHyper.Checked & "','" & ChkAbnormal.Checked & "','" & ChkRenal.Checked & "','" & ChkAnemia.Checked & "','" & Chklive.Checked & "','" & ChkHepB.Checked & "','" & ChkOther.Checked & "','" & RdAllergy.SelectedIndex & "' ,'" & Val(N(0)) & "' ,'" & Val(T(0)) & "','" & rdrrefuges.SelectedIndex & "','" & txtrefugart.Text & "','" & Mid(cborefugsite.Text, 1, 4) & "')", Cnndb)
                CmdAimain.ExecuteNonQuery()
                If CboDrugARV1.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV1.Text & "','" & CboClinicARV1.Text & "','" & Format(CDate(DaStartARV1.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV1.Text), "yyyy/MM/dd") & "','" & CboNoteARV1.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV2.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV2.Text & "','" & CboClinicARV2.Text & "','" & Format(CDate(DaStartARV2.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV2.Text), "yyyy/MM/dd") & "','" & CboNoteARV2.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV3.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV3.Text & "','" & CboClinicARV3.Text & "','" & Format(CDate(DaStartARV3.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV3.Text), "yyyy/MM/dd") & "','" & CboNoteARV3.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV4.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV4.Text & "','" & CboClinicARV4.Text & "','" & Format(CDate(DaStartARV4.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV4.Text), "yyyy/MM/dd") & "','" & CboNoteARV4.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV5.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV5.Text & "','" & CboClinicARV5.Text & "','" & Format(CDate(DaStartARV5.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV5.Text), "yyyy/MM/dd") & "','" & CboNoteARV5.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV6.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV6.Text & "','" & CboClinicARV6.Text & "','" & Format(CDate(DaStartARV6.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV6.Text), "yyyy/MM/dd") & "','" & CboNoteARV6.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If chkDiabetes.Checked Then
                    Dim CmdDia As New MySqlCommand("insert into tblaiothmeddiabete values('" & txtClinicID.Text & "','" & CboDrugDiabet.Text & "','" & CboClinicDiabet.Text & "','" & Format(CDate(DaStartDiabet.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptDiabet.Text), "yyyy/MM/dd") & "','" & CboNoteDiabet.Text & "')", Cnndb)
                    CmdDia.ExecuteNonQuery()
                End If
                If ChkHyper.Checked Then
                    Dim CmdHyp As New MySqlCommand("insert into tblaiothmedhyper values('" & txtClinicID.Text & "','" & CboDrugHyper.Text & "','" & CboClinicHyper.Text & "','" & Format(CDate(DaStartHyper.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptHyper.Text), "yyyy/MM/dd") & "','" & CboNoteHyper.Text & "')", Cnndb)
                    CmdHyp.ExecuteNonQuery()
                End If
                If ChkAbnormal.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedabnormal values('" & txtClinicID.Text & "','" & CboDrugAbnor.Text & "','" & CboClinicAbnor.Text & "','" & Format(CDate(DaStartAbnor.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptAbnor.Text), "yyyy/MM/dd") & "','" & CboNoteAbnor.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                If ChkRenal.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedrenal values('" & txtClinicID.Text & "','" & CboDrugRenal.Text & "','" & CboClinicRenal.Text & "','" & Format(CDate(DaStartRenal.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptRenal.Text), "yyyy/MM/dd") & "','" & CboNoteRenal.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                If ChkAnemia.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedanemia values('" & txtClinicID.Text & "','" & CboDrugAnemia.Text & "','" & CboClinicAnemia.Text & "','" & Format(CDate(DaStartAnemia.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptAnemia.Text), "yyyy/MM/dd") & "','" & CboNoteAnemia.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                If Chklive.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedliver values('" & txtClinicID.Text & "','" & CboDrugLiver.Text & "','" & CboClinicLiver.Text & "','" & Format(CDate(DaStartLiver.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptLiver.Text), "yyyy/MM/dd") & "','" & CboNoteLiver.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                If ChkHepB.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedhepbc values('" & txtClinicID.Text & "','" & CboDrugHepB.Text & "','" & CboClinicHepBC.Text & "','" & Format(CDate(DaStartHepBC.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptHepBC.Text), "yyyy/MM/dd") & "','" & CboNoteHepBC.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                If ChkOther.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedother values('" & txtClinicID.Text & "','" & CboDrugOther.Text & "','" & CboClinicOther.Text & "','" & Format(CDate(DaStartOther.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptOther.Text), "yyyy/MM/dd") & "','" & CboNoteOther.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If

                If Trim(CboDrugAllergy1.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy1.Text & "','" & CboAllergy1.Text & "','" & Format(CDate(DaAllergy1.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy2.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy2.Text & "','" & CboAllergy2.Text & "','" & Format(CDate(DaAllergy2.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy3.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy3.Text & "','" & CboAllergy3.Text & "','" & Format(CDate(DaAllergy3.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy4.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy4.Text & "','" & CboAllergy4.Text & "','" & Format(CDate(DaAllergy4.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy5.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy5.Text & "','" & CboAllergy5.Text & "','" & Format(CDate(DaAllergy5.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy6.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy6.Text & "','" & CboAllergy6.Text & "','" & Format(CDate(DaAllergy6.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If txtrefugart.Text.Length >= 9 And txtrefugart.Text.Length <= 10 Then
                    Dim CmdSaverefug As New MySqlCommand("insert into tblaart values('" & txtClinicID.Text & "','" & txtrefugart.Text & "','" & Format(CDate(DafirstVisit.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdSaverefug.ExecuteNonQuery()
                End If
                If txtRclinicID.Text.Length >= 9 And txtRclinicID.Text.Length <= 10 Then
                    Dim CmdSavelr As New MySqlCommand("insert into tblaart values('" & txtClinicID.Text & "','" & txtRclinicID.Text & "','" & Format(CDate(DafirstVisit.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdSavelr.ExecuteNonQuery()
                End If
                Try
                    If RdTransferIn.SelectedIndex = 1 Then
                        Dim CmdSaveArt As New MySqlCommand("insert into tblaart values('" & txtClinicID.Text & "','" & txtARTnum.Text & "','" & Format(CDate(DaStartART.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                        CmdSaveArt.ExecuteNonQuery()
                    End If
                Catch ex As Exception
                End Try
                Try

                Catch ex As Exception

                End Try
                MessageBox.Show("រក្សាទុកបានសម្រេច..", "Save...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAImain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
            End If
        Else
            If MessageBox.Show("Are you sure do you want to Edit ?", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim CmdAimain As New MySqlCommand("Update tblaimain set DafirstVisit='" & Format(CDate(DafirstVisit.EditValue), "yyyy-MM-dd") & "',TypeofReturn='" & OptReturn.SelectedIndex & "',LClinicID='" & txtRclinicID.Text.Trim & "',DaBirth='" & Format(CDate(DaDob.EditValue), "yyyy-MM-dd") & "',Sex='" & RdSex.SelectedIndex & "',Education='" & RdEducation.SelectedIndex & "'," &
                                           "Rea='" & RdRead.SelectedIndex & "',`Write`='" & RdWrite.SelectedIndex & "',Referred='" & RdRefer.SelectedIndex & "',Orefferred='" & txtReferOther.Text.Trim & "',DaHIV='" & Format(CDate(DaTestHIV.EditValue), "yyyy-MM-dd") & "',Vcctcode='" & Mid(CboVcctname.Text, 1, 6) & "',VcctID='" & TxtVcctID.Text.Trim & "',PclinicID='" & txtPclinicID.Text.Trim & "'," &
                                           "OffIn='" & RdTransferIn.SelectedIndex & "',SiteName='" & Mid(CboTransferName.Text, 1, 4) & "',DaART='" & Format(CDate(DaStartART.EditValue), "yyyy-MM-dd") & "',Artnum='" & txtARTnum.Text.Trim & "',TbPast='" & RdTBhistory.SelectedIndex & "',TPT='" & RdTPT.SelectedIndex & "',TPTdrug='" & RdTPTdrug.SelectedIndex & "',DaStartTPT='" & Format(CDate(DaStartTPT.EditValue), "yyyy-MM-dd") & "',DaEndTPT='" & Format(CDate(DaEndTPT.EditValue), "yyyy-MM-dd") & "',TypeTB='" & RdTypeTB.SelectedIndex & "',ResultTB='" & RdTresultTB.SelectedIndex & "'," &
                                           "Daonset='" & Format(CDate(DaSickness.EditValue), "yyyy-MM-dd") & "',Tbtreat='" & RdTBcat.SelectedIndex & "',Datreat='" & Format(CDate(DaTreatment.EditValue), "yyyy-MM-dd") & "',ResultTreat='" & RdResultTB.SelectedIndex & "',DaResultTreat='" & Format(CDate(DaTBtreat.EditValue), "yyyy-MM-dd") & "',ARVTreatHis='" & RdARVhistory.SelectedIndex & "',Diabete='" & chkDiabetes.Checked & "'," &
                                           "Hyper='" & ChkHyper.Checked & "',Abnormal='" & ChkAbnormal.Checked & "',Renal='" & ChkRenal.Checked & "',Anemia='" & ChkAnemia.Checked & "',Liver='" & Chklive.Checked & "',HepBC='" & ChkHepB.Checked & "',MedOther='" & ChkOther.Checked & "',Allergy='" & RdAllergy.SelectedIndex & "' , SiteNameold='" & Mid(CboSiteOld.Text, 1, 4) & "' , Nationality='" & Val(N(0)) & "' ," &
                                           "Targroup='" & Val(T(0)) & "',Refugstatus='" & rdrrefuges.SelectedIndex & "',RefugART='" & txtrefugart.Text & "',Refugsite='" & Mid(cborefugsite.Text, 1, 4) & "' where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdAimain.ExecuteNonQuery()

                If tin = 1 And RdTransferIn.SelectedIndex = 0 Then
                    Dim CmdDelArt As New MySqlCommand("Delete from tblaart where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
                    CmdDelArt.ExecuteNonQuery()
                    Dim CmdUpcv As New MySqlCommand("Update tblavmain set ARTnum='' where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
                    CmdUpcv.ExecuteNonQuery()
                ElseIf tin = 0 And RdTransferIn.SelectedIndex = 1 Then
                    Try
                        Dim CmdSaveArt As New MySqlCommand("insert into tblaart values('" & txtClinicID.Text & "','" & txtARTnum.Text & "','" & Format(CDate(DaStartART.EditValue), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                        CmdSaveArt.ExecuteNonQuery()
                    Catch ex As Exception
                    End Try
                    Dim CmdUpcv As New MySqlCommand("Update tblavmain set ARTnum='" & DaStartART.Text & "' where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
                    CmdUpcv.ExecuteNonQuery()
                End If
                Dim CmdDelTh As New MySqlCommand("Delete from tblaiarvtreathis where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelTh.ExecuteNonQuery()
                If CboDrugARV1.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV1.Text & "','" & CboClinicARV1.Text & "','" & Format(CDate(DaStartARV1.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV1.Text), "yyyy/MM/dd") & "','" & CboNoteARV1.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV2.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV2.Text & "','" & CboClinicARV2.Text & "','" & Format(CDate(DaStartARV2.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV2.Text), "yyyy/MM/dd") & "','" & CboNoteARV2.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV3.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV3.Text & "','" & CboClinicARV3.Text & "','" & Format(CDate(DaStartARV3.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV3.Text), "yyyy/MM/dd") & "','" & CboNoteARV3.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV4.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV4.Text & "','" & CboClinicARV4.Text & "','" & Format(CDate(DaStartARV4.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV4.Text), "yyyy/MM/dd") & "','" & CboNoteARV4.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV5.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV5.Text & "','" & CboClinicARV5.Text & "','" & Format(CDate(DaStartARV5.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV5.Text), "yyyy/MM/dd") & "','" & CboNoteARV5.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                If CboDrugARV6.SelectedIndex <> -1 Then
                    Dim CmdTh As New MySqlCommand("Insert into tblaiarvtreathis values('" & txtClinicID.Text & "','" & CboDrugARV6.Text & "','" & CboClinicARV6.Text & "','" & Format(CDate(DaStartARV6.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV6.Text), "yyyy/MM/dd") & "','" & CboNoteARV6.Text & "')", Cnndb)
                    CmdTh.ExecuteNonQuery()
                End If
                Dim CmdDelDia As New MySqlCommand("Delete from tblaiothmeddiabete where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelDia.ExecuteNonQuery()
                If chkDiabetes.Checked Then
                    Dim CmdDia As New MySqlCommand("insert into tblaiothmeddiabete values('" & txtClinicID.Text & "','" & CboDrugDiabet.Text & "','" & CboClinicDiabet.Text & "','" & Format(CDate(DaStartDiabet.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptDiabet.Text), "yyyy/MM/dd") & "','" & CboNoteDiabet.Text & "')", Cnndb)
                    CmdDia.ExecuteNonQuery()
                End If
                Dim CmdDelDia5 As New MySqlCommand("Delete from tblaiothmedhyper where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelDia5.ExecuteNonQuery()
                If ChkHyper.Checked Then
                    Dim CmdHyp As New MySqlCommand("insert into tblaiothmedhyper values('" & txtClinicID.Text & "','" & CboDrugHyper.Text & "','" & CboClinicHyper.Text & "','" & Format(CDate(DaStartHyper.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptHyper.Text), "yyyy/MM/dd") & "','" & CboNoteHyper.Text & "')", Cnndb)
                    CmdHyp.ExecuteNonQuery()
                End If
                Dim CmdDelDia4 As New MySqlCommand("Delete from tblaiothmedabnormal where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelDia4.ExecuteNonQuery()

                If ChkAbnormal.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedabnormal values('" & txtClinicID.Text & "','" & CboDrugAbnor.Text & "','" & CboClinicAbnor.Text & "','" & Format(CDate(DaStartAbnor.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptAbnor.Text), "yyyy/MM/dd") & "','" & CboNoteAbnor.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                Dim CmdDelDia3 As New MySqlCommand("Delete from tblaiothmedrenal where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelDia3.ExecuteNonQuery()

                If ChkRenal.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedrenal values('" & txtClinicID.Text & "','" & CboDrugRenal.Text & "','" & CboClinicRenal.Text & "','" & Format(CDate(DaStartRenal.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptRenal.Text), "yyyy/MM/dd") & "','" & CboNoteRenal.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                Dim CmdDelDia2 As New MySqlCommand("Delete from tblaiothmedanemia where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelDia2.ExecuteNonQuery()

                If ChkAnemia.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedanemia values('" & txtClinicID.Text & "','" & CboDrugAnemia.Text & "','" & CboClinicAnemia.Text & "','" & Format(CDate(DaStartAnemia.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptAnemia.Text), "yyyy/MM/dd") & "','" & CboNoteAnemia.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                Dim CmdDelDia1 As New MySqlCommand("Delete from tblaiothmedliver where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelDia1.ExecuteNonQuery()

                If Chklive.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedliver values('" & txtClinicID.Text & "','" & CboDrugLiver.Text & "','" & CboClinicLiver.Text & "','" & Format(CDate(DaStartLiver.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptLiver.Text), "yyyy/MM/dd") & "','" & CboNoteLiver.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If
                Dim CmdDelHepB As New MySqlCommand("Delete from tblaiothmedhepbc where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelHepB.ExecuteNonQuery()

                If ChkHepB.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedhepbc values('" & txtClinicID.Text & "','" & CboDrugHepB.Text & "','" & CboClinicHepBC.Text & "','" & Format(CDate(DaStartHepBC.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptHepBC.Text), "yyyy/MM/dd") & "','" & CboNoteHepBC.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If

                Dim CmdDelOth As New MySqlCommand("Delete from tblaiothmedother where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelOth.ExecuteNonQuery()
                If ChkOther.Checked Then
                    Dim CmdAb As New MySqlCommand("Insert into tblaiothmedother values('" & txtClinicID.Text & "','" & CboDrugOther.Text & "','" & CboClinicOther.Text & "','" & Format(CDate(DaStartOther.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaStoptOther.Text), "yyyy/MM/dd") & "','" & CboNoteOther.Text & "')", Cnndb)
                    CmdAb.ExecuteNonQuery()
                End If

                Dim CmdDelAller As New MySqlCommand("Delete from tblaiallergy where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
                CmdDelAller.ExecuteNonQuery()

                If Trim(CboDrugAllergy1.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy1.Text & "','" & CboAllergy1.Text & "','" & Format(CDate(DaAllergy1.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy2.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy2.Text & "','" & CboAllergy2.Text & "','" & Format(CDate(DaAllergy2.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy3.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy3.Text & "','" & CboAllergy3.Text & "','" & Format(CDate(DaAllergy3.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy4.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy4.Text & "','" & CboAllergy4.Text & "','" & Format(CDate(DaAllergy4.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy5.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy5.Text & "','" & CboAllergy5.Text & "','" & Format(CDate(DaAllergy5.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If Trim(CboDrugAllergy6.Text) <> "" Then
                    Dim CmdInsert As MySqlCommand = New MySqlCommand("insert into tblaiallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy6.Text & "','" & CboAllergy6.Text & "','" & Format(CDate(DaAllergy6.Text), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                MessageBox.Show("កែប្រែរបស់លោកអ្នកបានសម្រេច...", "Edit...", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAImain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                Clear()
            End If
        End If
        End Sub

    Private Sub Delete()
        If MessageBox.Show("Are you sure do you want to Delete?", "Delete....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
            Dim CmdDelAller As New MySqlCommand("Delete from tblaiallergy where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelAller.ExecuteNonQuery()
            Dim CmdDelOth As New MySqlCommand("Delete from tblaiothmedother where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelOth.ExecuteNonQuery()
            Dim CmdDelHepB As New MySqlCommand("Delete from tblaiothmedhepbc where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelHepB.ExecuteNonQuery()
            Dim CmdDelDia1 As New MySqlCommand("Delete from tblaiothmedliver where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelDia1.ExecuteNonQuery()
            Dim CmdDelDia2 As New MySqlCommand("Delete from tblaiothmedanemia where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelDia2.ExecuteNonQuery()
            Dim CmdDelDia3 As New MySqlCommand("Delete from tblaiothmedrenal where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelDia3.ExecuteNonQuery()
            Dim CmdDelDia4 As New MySqlCommand("Delete from tblaiothmedabnormal where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelDia4.ExecuteNonQuery()
            Dim CmdDelDia5 As New MySqlCommand("Delete from tblaiothmedhyper where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelDia5.ExecuteNonQuery()
            Dim CmdDelDia As New MySqlCommand("Delete from tblaiothmeddiabete where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelDia.ExecuteNonQuery()
            Dim CmdDelTh As New MySqlCommand("Delete from tblaiarvtreathis where ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelTh.ExecuteNonQuery()
            Dim cmddelv As New MySqlCommand("delete from tblavmain where  ClinicID='" & Val(txtClinicID.Text) & "'", Cnndb)
            cmddelv.ExecuteNonQuery()
            Dim CmdDelArt As New MySqlCommand("Delete from tblaart where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDelArt.ExecuteNonQuery()
            Dim CmdDel As New MySqlCommand("Delete from tblaimain where clinicid='" & Val(txtClinicID.Text) & "'", Cnndb)
            CmdDel.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtClinicID.Text) & "','tblAImain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            Clear()
            MessageBox.Show("Delete is successful", "Delete....", MessageBoxButtons.OK, MessageBoxIcon.Information)
        End If
    End Sub
#End Region

    Private Sub CboDrugARV1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugARV1.SelectedIndexChanged
        ARVTreat1()
    End Sub

    Private Sub CboDrugARV2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugARV2.SelectedIndexChanged
        ARVTreat2()
    End Sub

    Private Sub CboDrugARV3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugARV3.SelectedIndexChanged
        ARVTreat3()
    End Sub

    Private Sub CboDrugARV5_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugARV5.SelectedIndexChanged
        ARVTreat5()
    End Sub

    Private Sub CboDrugARV4_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugARV4.SelectedIndexChanged
        ARVTreat4()
    End Sub

    Private Sub CboDrugARV6_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugARV6.SelectedIndexChanged
        ARVTreat6()
    End Sub

    Private Sub DaStartARV1_ValueChanged(sender As Object, e As EventArgs) Handles DaStartARV1.ValueChanged
        CheckStartDate(DaStartARV1, DaStopARV1, CboNoteARV1)
    End Sub

    Private Sub DaStartARV2_ValueChanged(sender As Object, e As EventArgs) Handles DaStartARV2.ValueChanged
        CheckStartDate(DaStartARV2, DaStopARV2, CboNoteARV2)
    End Sub

    Private Sub DaStartARV3_ValueChanged(sender As Object, e As EventArgs) Handles DaStartARV3.ValueChanged
        CheckStartDate(DaStartARV3, DaStopARV3, CboNoteARV3)
    End Sub

    Private Sub DaStartARV4_ValueChanged(sender As Object, e As EventArgs) Handles DaStartARV4.ValueChanged
        CheckStartDate(DaStartARV4, DaStopARV4, CboNoteARV4)
    End Sub

    Private Sub DaStartARV5_ValueChanged(sender As Object, e As EventArgs) Handles DaStartARV5.ValueChanged
        CheckStartDate(DaStartARV5, DaStopARV5, CboNoteARV5)
    End Sub

    Private Sub DaStartARV6_ValueChanged(sender As Object, e As EventArgs) Handles DaStartARV6.ValueChanged
        CheckStartDate(DaStartARV6, DaStopARV6, CboNoteARV6)
    End Sub

    Private Sub CboDrugDiabet_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugDiabet.SelectedIndexChanged
        OtherMedical1()
    End Sub

    Private Sub DaStartDiabet_ValueChanged(sender As Object, e As EventArgs) Handles DaStartDiabet.ValueChanged
        CheckStartDate(DaStartDiabet, DaStoptDiabet, CboNoteDiabet)
    End Sub

    Private Sub CboDrugHyper_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugHyper.SelectedIndexChanged
        OtherMedicalHyper()
    End Sub

    Private Sub DaStartHyper_ValueChanged(sender As Object, e As EventArgs) Handles DaStartHyper.ValueChanged
        CheckStartDate(DaStartHyper, DaStoptHyper, CboNoteHyper)
    End Sub

    Private Sub CboDrugAllergy1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy1.SelectedIndexChanged
        Allergy(CboDrugAllergy1, CboAllergy1, CboDrugAllergy2, DaAllergy1)
    End Sub

    Private Sub CboDrugAllergy2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy2.SelectedIndexChanged
        Allergy(CboDrugAllergy2, CboAllergy2, CboDrugAllergy3, DaAllergy2)
    End Sub

    Private Sub CboDrugAllergy3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy3.SelectedIndexChanged
        Allergy(CboDrugAllergy3, CboAllergy3, CboDrugAllergy4, DaAllergy3)
    End Sub

    Private Sub CboDrugAllergy4_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy4.SelectedIndexChanged
        Allergy(CboDrugAllergy4, CboAllergy4, CboDrugAllergy5, DaAllergy4)
    End Sub

    Private Sub CboDrugAllergy5_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy5.SelectedIndexChanged
        Allergy(CboDrugAllergy5, CboAllergy5, CboDrugAllergy6, DaAllergy5)
    End Sub

    Private Sub CboDrugAllergy6_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy6.SelectedIndexChanged
        Allergy(CboDrugAllergy6, CboAllergy6, CboDrugAllergy6, DaAllergy6)
    End Sub

    Private Sub CboDrugAbnor_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAbnor.SelectedIndexChanged
        If CboDrugAbnor.SelectedIndex >= 0 Then
            CboClinicAbnor.Enabled = True
            DaStartAbnor.Enabled = True

            CheckStartDate(DaStartAbnor, DaStoptAbnor, CboNoteAbnor)
        Else
            CboClinicAbnor.Enabled = False
            DaStartAbnor.Enabled = False
            DaStartAbnor.Text = "01/01/1900"
            DaStoptAbnor.Text = "01/01/1900"
            CboClinicAbnor.SelectedIndex = -1
            CboNoteAbnor.SelectedIndex = -1
        End If
    End Sub

    Private Sub DaStartAbnor_ValueChanged(sender As Object, e As EventArgs) Handles DaStartAbnor.ValueChanged
        CheckStartDate(DaStartAbnor, DaStoptAbnor, CboNoteAbnor)
    End Sub

    Private Sub CboDrugRenal_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugRenal.SelectedIndexChanged
        If CboDrugRenal.SelectedIndex >= 0 Then
            CboClinicRenal.Enabled = True
            DaStartRenal.Enabled = True

            CheckStartDate(DaStartRenal, DaStoptRenal, CboNoteRenal)
        Else
            CboClinicRenal.Enabled = False
            CboClinicRenal.SelectedIndex = -1
            DaStartRenal.Enabled = False
            DaStartRenal.Text = "01/01/1900"
            DaStoptRenal.Text = "01/01/1900"
            CboNoteRenal.SelectedIndex = -1
        End If
    End Sub

    Private Sub DaStartRenal_ValueChanged(sender As Object, e As EventArgs) Handles DaStartRenal.ValueChanged
        CheckStartDate(DaStartRenal, DaStoptRenal, CboNoteRenal)
    End Sub

    Private Sub CboDrugAnemia_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAnemia.SelectedIndexChanged
        If CboDrugAnemia.SelectedIndex >= 0 Then
            CboClinicAnemia.Enabled = True
            DaStartRenal.Enabled = True

            CheckStartDate(DaStartAnemia, DaStoptAnemia, CboNoteAnemia)
        Else
            CboClinicAnemia.Enabled = False
            CboClinicAnemia.SelectedIndex = -1
            DaStartAnemia.Enabled = False
            DaStartAnemia.Text = "01/01/1900"
            DaStoptAnemia.Text = "01/01/1900"
            CboNoteAnemia.SelectedIndex = -1
        End If
    End Sub

    Private Sub CboDrugLiver_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugLiver.SelectedIndexChanged
        If CboDrugAnemia.SelectedIndex >= 0 Then
            CboClinicLiver.Enabled = True
            DaStartLiver.Enabled = True

            CheckStartDate(DaStartLiver, DaStoptLiver, CboNoteLiver)
        Else
            CboClinicLiver.Enabled = False
            CboClinicLiver.SelectedIndex = -1
            DaStartLiver.Enabled = False
            DaStartLiver.Text = "01/01/1900"
            DaStoptLiver.Text = "01/01/1900"
            CboNoteLiver.SelectedIndex = -1
        End If
    End Sub

    Private Sub DaStartLiver_ValueChanged(sender As Object, e As EventArgs) Handles DaStartLiver.ValueChanged
        CheckStartDate(DaStartLiver, DaStoptLiver, CboNoteLiver)
    End Sub

    Private Sub DaStartAnemia_ValueChanged(sender As Object, e As EventArgs) Handles DaStartAnemia.ValueChanged
        CheckStartDate(DaStartAnemia, DaStoptAnemia, CboNoteAnemia)
    End Sub

    Private Sub tscView_SelectedIndexChanged(sender As Object, e As EventArgs) Handles tscView.SelectedIndexChanged
        If tscView.SelectedIndex = 1 Then
            dt.Clear()
            Dim Sql As String = "SELECT * FROM preart.tblaimain left join tblnationality on tblaimain.Nationality=tblnationality.Nid left join tbltargroup on tblaimain.Targroup=tbltargroup.Tid order by tblaimain.clinicid"
            ViewData(Sql)
        Else
            GridControl1.DataSource = ""
            dt.Clear()
        End If
    End Sub
    Private Sub txtPclinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPclinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            If Val(txtPclinicID.Text) <> 0 Or IsNumeric(txtPclinicID.Text) Then
                txtPclinicID.Text = "P" & Format(Val(txtPclinicID.Text), "000000")
            End If
            SendKeys.Send(Chr(9))
        End If
    End Sub
    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        If txtClinicID.Text = "" Then Exit Sub
        XtraTabControl1.SelectedTabPageIndex = 1
        Search(txtClinicID)
    End Sub
    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub


    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave

        If Len(txtClinicID.Text) <= 6 And Val(txtClinicID.Text) <> 0 Then
            txtClinicID.Text = Format(Val(txtClinicID.Text), "000000")
            Search(txtClinicID)
        End If
    End Sub
    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tsbSave1_Click(sender As Object, e As EventArgs) Handles tsbSave1.Click
        Save()
    End Sub

    Private Sub tsbDelete1_Click(sender As Object, e As EventArgs) Handles tsbDelete1.Click
        Delete()
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Delete()
    End Sub

    Private Sub txtAge_KeyDown(sender As Object, e As KeyEventArgs) Handles txtAge.KeyDown
        ag = True
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DafirstVisit_KeyDown(sender As Object, e As KeyEventArgs) Handles DafirstVisit.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtRclinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtRclinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaDob_KeyDown(sender As Object, e As KeyEventArgs) Handles DaDob.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtReferOther_KeyDown(sender As Object, e As KeyEventArgs) Handles txtReferOther.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaTestHIV_KeyDown(sender As Object, e As KeyEventArgs) Handles DaTestHIV.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub CboVcctname_KeyDown(sender As Object, e As KeyEventArgs) Handles CboVcctname.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub TxtVcctID_KeyDown(sender As Object, e As KeyEventArgs) Handles TxtVcctID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub CboTransferName_KeyDown(sender As Object, e As KeyEventArgs) Handles CboTransferName.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaStartART_KeyDown(sender As Object, e As KeyEventArgs) Handles DaStartART.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtARTnum_KeyDown(sender As Object, e As KeyEventArgs) Handles txtARTnum.KeyDown
        If e.KeyCode = Keys.Enter Then
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
                Delete()
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function


    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            Dim sql As String = "SELECT * FROM preart.tblaimain left join tblnationality on tblaimain.Nationality=tblnationality.Nid left join tbltargroup on tblaimain.Targroup=tbltargroup.Tid where tblaimain.clinicid='" & tspClinicID.Text & "' order by tblaimain.clinicid "
            ViewData(sql)
        End If
    End Sub

    Private Sub txtRclinicID_Leave(sender As Object, e As EventArgs) Handles txtRclinicID.Leave
        If OptReturn.SelectedIndex = 0 Then
            Rs = True
            If Val(txtRclinicID.Text) <= 0 Then Exit Sub
            txtRclinicID.Text = Format(Val(txtRclinicID.Text), "000000")
            Search(txtRclinicID)
            Rs = False
        End If
    End Sub

    Private Sub OptReturn_SelectedIndexChanged(sender As Object, e As EventArgs) Handles OptReturn.SelectedIndexChanged
        CboSiteOld.Enabled = False
        txtRclinicID.Enabled = False
        txtRclinicID.Text = ""
        CboSiteOld.SelectedIndex = -1
        If OptReturn.SelectedIndex <> -1 Then txtRclinicID.Enabled = True
        If OptReturn.SelectedIndex = 1 Then
            CboSiteOld.Enabled = True
        End If
    End Sub

    Private Sub RdINH_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTPT.SelectedIndexChanged
        DaStartTPT.Enabled = False
        DaStartTPT.Text = "01/01/1900"
        DaEndTPT.Enabled = False
        DaEndTPT.Text = "01/01/1900"
        RdTPTdrug.Enabled = False
        RdTPTdrug.SelectedIndex = -1
        If RdTPT.SelectedIndex = 1 Then
            DaStartTPT.Enabled = True
            DaEndTPT.Enabled = True
            RdTPTdrug.Enabled = True
        ElseIf RdTPT.SelectedIndex = 2 Then
            DaStartTPT.Enabled = True
            'DaEndTPT.Enabled = True
            RdTPTdrug.Enabled = True
        End If
    End Sub

    Private Sub RdSex_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdSex.SelectedIndexChanged
        If CboTarGroup.Text <> "" Then
            Dim targroup() As String = Split(CboTarGroup.Text, "--")
            If RdSex.SelectedIndex = 0 And (targroup(1) = "MSM" Or targroup(1) = "TG" Or targroup(1) = "MEW") Then
                MessageBox.Show("Female can not be  MSM or TG or MEW")
                CboTarGroup.Text = ""
                CboTarGroup.Focus()
            ElseIf RdSex.SelectedIndex = 1 And (targroup(1) = "FEW" Or targroup(1) = "PPW") Then
                MessageBox.Show("Male can not be  FEW or PPW")
                CboTarGroup.Text = ""
                CboTarGroup.Focus()
            End If
        End If
        'If RdSex.SelectedIndex = 0 And (CboTarGroup.SelectedIndex = 2 Or CboTarGroup.SelectedIndex = 3 Or CboTarGroup.SelectedIndex = 7) Then
        '    MessageBox.Show("Female can not be  MSM or TG or MEW")
        '    CboTarGroup.Text = ""
        'ElseIf RdSex.SelectedIndex = 1 And (CboTarGroup.SelectedIndex = 1 Or CboTarGroup.SelectedIndex = 8) Then
        '    MessageBox.Show("Male can not be  FEW or PPW")
        '    CboTarGroup.Text = ""
        'End If
    End Sub

    Private Sub CboTarGroup_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboTarGroup.SelectedIndexChanged
        RdSex_SelectedIndexChanged(CboTarGroup, New EventArgs)
    End Sub

    Private Sub rdrrefuges_SelectedIndexChanged(sender As Object, e As EventArgs) Handles rdrrefuges.SelectedIndexChanged
        If rdrrefuges.SelectedIndex = 0 Then
            txtrefugart.Enabled = True
            cborefugsite.Enabled = True
        Else
            txtrefugart.Enabled = False
            cborefugsite.Enabled = False
            txtrefugart.Text = ""
            cborefugsite.Text = ""
        End If
    End Sub

    Private Sub LabelControl41_DoubleClick(sender As Object, e As EventArgs) Handles LabelControl41.DoubleClick
        rdrrefuges.SelectedIndex = -1
        txtrefugart.Text = ""
        cborefugsite.Text = ""
    End Sub


End Class