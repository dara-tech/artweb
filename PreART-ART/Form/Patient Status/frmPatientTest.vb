Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Public Class frmPatientTest
    Dim Idate As Date
    Dim ti As Integer
    Dim Tid As String = ""
    Dim X(4), M(4) As String
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Private Sub frmPatientTest_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        ClearAll()
        Loadhead()
        txtClinicID.Focus()
    End Sub

#Region "Function"
    Private Sub ClearAll()
        '  Cd4 = False
        daTestDate.Enabled = True
        txtClinicID.Enabled = True
        tsbDelete.Enabled = False
        txtClinicID.Text = ""
        txtARTnum.Text = ""
        txtClinicID.Focus()
        txtHCHc.Text = ""
        txtHCVlog.Text = ""
        Daarrival.Text = CDate("1/1/1900")
        daTestDate.Text = CDate("1/1/1900")
        DaCollection.Text = CDate("01/01/1900")
        txtAge.Text = ""
        optSex.SelectedIndex = -1
        txtCD4.Text = ""
        txtCD4Per.Text = ""
        txtCD8.Text = ""
        txtHIVViralLoad.Text = ""
        txtHIVViralLoadLog.Text = ""
        optHIVAb.SelectedIndex = -1
        optHBsAg.SelectedIndex = -1
        optHBeAg.SelectedIndex = -1
        optHBcAb.SelectedIndex = -1
        optHBeAb.SelectedIndex = -1
        optHCVAb.SelectedIndex = -1
        optHCVPR.SelectedIndex = -1
        optTPHA.SelectedIndex = -1
        optRPR.SelectedIndex = -1
        txtRPRTitre.Text = ""
        optHBsAb.SelectedIndex = -1
        txtWBC.Text = ""
        txtHaemoglobin.Text = ""
        txtHaematocrit.Text = ""
        txtMCV.Text = ""
        txtPlatelets.Text = ""
        txtProthrominTimeINR.Text = ""
        txtNeutrophils.Text = ""
        txtEosinophils.Text = ""
        txtLymphocytes.Text = ""
        txtMonocytes.Text = ""
        txtReticulocvte.Text = ""
        txtReticulocvtePer.Text = ""
        txtSodium.Text = ""
        txtPotassium.Text = ""
        txtChloride.Text = ""
        txtBicarbonate.Text = ""
        txtUrea.Text = ""
        txtCreatinine.Text = ""
        txtASATAST.Text = ""
        txtALATALT.Text = ""
        txtBilirubin.Text = ""
        txtPhosphate.Text = ""
        txtCHOL.Text = ""
        txtTG.Text = ""
        txtAmylase.Text = ""
        txtCK.Text = ""
        txtLactate.Text = ""
        txtMagnesium.Text = ""
        txtPhosphorus.Text = ""
        txtCalcium.Text = ""
        txtCHOLHDL.Text = ""
        txtGlucose.Text = ""
        optUrineBHCG.SelectedIndex = -1
        optSputumAFB.SelectedIndex = -1
        optAFBCulture.SelectedIndex = -1
        cboAFBCultureve.SelectedIndex = -1
        optUrine.SelectedIndex = -1
        txtUrineDetail.Text = ""
        txtCSFCellCount.Text = ""
        txtCSFGram.Text = ""
        txtCSFZiel.Text = ""
        optCSFIndian.SelectedIndex = -1
        txtCSFCC.Text = ""
        txtCSFProtein.Text = ""
        txtCSFGlucose.Text = ""
        optBloodCulture1.SelectedIndex = -1
        cboBloodCulture1ve.SelectedIndex = -1
        optBloodCulture2.SelectedIndex = -1
        cboBloodCulture2ve.SelectedIndex = -1
        optCTPCR.SelectedIndex = -1
        optGCPCR.SelectedIndex = -1
        optCXR.SelectedIndex = -1
        optAbdominal.SelectedIndex = -1

        cboCXRCode11.Enabled = False
        cboAbdCode11.Enabled = False

        cboCXRCode11.SelectedIndex = -1
        cboCXRCode12.SelectedIndex = -1
        cboCXRCode13.SelectedIndex = -1
        cboCXRCode14.SelectedIndex = -1
        cboCXRCode15.SelectedIndex = -1

        cboCXRCode21.SelectedIndex = -1
        cboCXRCode22.SelectedIndex = -1
        cboCXRCode23.SelectedIndex = -1
        cboCXRCode24.SelectedIndex = -1
        cboCXRCode25.SelectedIndex = -1

        txtCXRCode31.Text = ""
        txtCXRCode32.Text = ""
        txtCXRCode33.Text = ""
        txtCXRCode34.Text = ""
        txtCXRCode35.Text = ""

        cboAbdCode11.SelectedIndex = -1
        cboAbdCode12.SelectedIndex = -1
        cboAbdCode13.SelectedIndex = -1
        cboAbdCode14.SelectedIndex = -1
        cboAbdCode15.SelectedIndex = -1

        cboAbdCode21.SelectedIndex = -1
        cboAbdCode22.SelectedIndex = -1
        cboAbdCode23.SelectedIndex = -1
        cboAbdCode24.SelectedIndex = -1
        cboAbdCode25.SelectedIndex = -1

        txtAbdCode31.Text = ""
        txtAbdCode32.Text = ""
        txtAbdCode33.Text = ""
        txtAbdCode34.Text = ""
        txtAbdCode35.Text = ""
        ChkCd4Rapid.Checked = False
        Array.Clear(X, 0, 4)
        Array.Clear(M, 0, 4)
        optGCPCR.SelectedIndex = -1
        CXR1()
        Abd1()
    End Sub
    Private Sub CXR1()
        If cboCXRCode11.SelectedIndex >= 0 Then
            panCXR2.Enabled = True
            CXR2()
            Select Case cboCXRCode11.SelectedValue
                Case 1, 6, 7
                    txtCXRCode31.Enabled = True
                    cboCXRCode21.Enabled = False
                Case 4
                    txtCXRCode31.Enabled = False
                    cboCXRCode21.Enabled = False
                Case Else
                    'LoadCXRList2(cboCXRCode11.SelectedValue, cboCXRCode21)
                    cboCXRCode21.Enabled = True
                    txtCXRCode31.Enabled = False
            End Select
        Else
            panCXR2.Enabled = False
            panCXR3.Enabled = False
            panCXR4.Enabled = False
            panCXR5.Enabled = False

            cboCXRCode21.Enabled = False
            txtCXRCode31.Enabled = False
        End If
    End Sub

    Private Sub CXR2()
        If cboCXRCode12.SelectedIndex >= 0 Then
            panCXR3.Enabled = True
            CXR3()
            Select Case cboCXRCode12.SelectedValue
                Case 1, 6, 7
                    txtCXRCode32.Enabled = True
                    cboCXRCode22.Enabled = False
                Case 4
                    txtCXRCode32.Enabled = False
                    cboCXRCode22.Enabled = False
                Case Else
                    'LoadCXRList2(cboCXRCode12.SelectedValue, cboCXRCode22)
                    cboCXRCode22.Enabled = True
                    txtCXRCode32.Enabled = False
            End Select
        Else
            panCXR3.Enabled = False
            panCXR4.Enabled = False
            panCXR5.Enabled = False

            cboCXRCode22.Enabled = False
            txtCXRCode32.Enabled = False
        End If
    End Sub

    Private Sub CXR3()
        If cboCXRCode13.SelectedIndex >= 0 Then
            panCXR4.Enabled = True
            CXR4()
            Select Case cboCXRCode13.SelectedValue
                Case 1, 6, 7
                    txtCXRCode33.Enabled = True
                    cboCXRCode23.Enabled = False
                Case 4
                    txtCXRCode33.Enabled = False
                    cboCXRCode23.Enabled = False
                Case Else
                    'LoadCXRList2(cboCXRCode13.SelectedValue, cboCXRCode23)
                    cboCXRCode23.Enabled = True
                    txtCXRCode33.Enabled = False
            End Select
        Else
            panCXR4.Enabled = False
            panCXR5.Enabled = False

            cboCXRCode23.Enabled = False
            txtCXRCode33.Enabled = False
        End If
    End Sub

    Private Sub CXR4()
        If cboCXRCode14.SelectedIndex >= 0 Then
            panCXR5.Enabled = True
            CXR5()
            Select Case cboCXRCode14.SelectedValue
                Case 1, 6, 7
                    txtCXRCode34.Enabled = True
                    cboCXRCode24.Enabled = False
                Case 4
                    txtCXRCode34.Enabled = False
                    cboCXRCode24.Enabled = False
                Case Else
                    'LoadCXRList2(cboCXRCode14.SelectedValue, cboCXRCode24)
                    cboCXRCode24.Enabled = True
                    txtCXRCode34.Enabled = False
            End Select
        Else
            panCXR5.Enabled = False

            cboCXRCode24.Enabled = False
            txtCXRCode34.Enabled = False
        End If
    End Sub

    Private Sub CXR5()
        If cboCXRCode15.SelectedIndex >= 0 Then
            Select Case cboCXRCode15.SelectedValue
                Case 1, 6, 7
                    txtCXRCode35.Enabled = True
                    cboCXRCode25.Enabled = False
                Case 4
                    txtCXRCode35.Enabled = False
                    cboCXRCode25.Enabled = False
                Case Else
                    'LoadCXRList2(cboCXRCode15.SelectedValue, cboCXRCode25)
                    cboCXRCode25.Enabled = True
                    txtCXRCode35.Enabled = False
            End Select
        Else
            cboCXRCode25.Enabled = False
            txtCXRCode35.Enabled = False
        End If
    End Sub

    Private Sub Abd1()
        If cboAbdCode11.SelectedIndex >= 0 Then
            panAbd2.Enabled = True
            Abd2()
            Select Case cboAbdCode11.SelectedValue
                Case 5, 6, 7, 8
                    txtAbdCode31.Enabled = True
                    cboAbdCode21.Enabled = False
                Case 2, 3
                    LoadAbdList2(cboAbdCode11.SelectedValue, cboAbdCode21)
                    cboAbdCode21.Enabled = True
                    txtAbdCode31.Enabled = False
                Case 4
                    LoadAbdList2(cboAbdCode11.SelectedValue, cboAbdCode21)
                    cboAbdCode21.Enabled = True
                    txtAbdCode31.Enabled = True
                Case Else

            End Select
        Else
            panAbd2.Enabled = False
            panAbd3.Enabled = False
            panAbd4.Enabled = False
            panAbd5.Enabled = False

            cboAbdCode21.Enabled = False
            txtAbdCode31.Enabled = False
        End If
    End Sub

    Private Sub Abd2()
        If cboAbdCode12.SelectedIndex >= 0 Then
            panAbd3.Enabled = True
            Abd3()
            Select Case cboAbdCode12.SelectedValue
                Case 5, 6, 7, 8
                    txtAbdCode32.Enabled = True
                    cboAbdCode22.Enabled = False
                Case 2, 3
                    LoadAbdList2(cboAbdCode12.SelectedValue, cboAbdCode22)
                    cboAbdCode22.Enabled = True
                    txtAbdCode32.Enabled = False
                Case 4
                    LoadAbdList2(cboAbdCode12.SelectedValue, cboAbdCode22)
                    cboAbdCode22.Enabled = True
                    txtAbdCode32.Enabled = True
                Case Else

            End Select
        Else
            panAbd3.Enabled = False
            panAbd4.Enabled = False
            panAbd5.Enabled = False

            cboAbdCode22.Enabled = False
            txtAbdCode32.Enabled = False
        End If
    End Sub

    Private Sub Abd3()
        If cboAbdCode13.SelectedIndex >= 0 Then
            panAbd4.Enabled = True
            Abd4()
            Select Case cboAbdCode13.SelectedValue
                Case 5, 6, 7, 8
                    txtAbdCode33.Enabled = True
                    cboAbdCode23.Enabled = False
                Case 2, 3
                    LoadAbdList2(cboAbdCode13.SelectedValue, cboAbdCode23)
                    cboAbdCode23.Enabled = True
                    txtAbdCode33.Enabled = False
                Case 4
                    LoadAbdList2(cboAbdCode13.SelectedValue, cboAbdCode23)
                    cboAbdCode23.Enabled = True
                    txtAbdCode33.Enabled = True
                Case Else

            End Select
        Else
            panAbd4.Enabled = False
            panAbd5.Enabled = False

            cboAbdCode23.Enabled = False
            txtAbdCode33.Enabled = False
        End If
    End Sub

    Private Sub Abd4()
        If cboAbdCode14.SelectedIndex >= 0 Then
            panAbd5.Enabled = True
            Abd5()
            Select Case cboAbdCode14.SelectedValue
                Case 5, 6, 7, 8
                    txtAbdCode34.Enabled = True
                    cboAbdCode24.Enabled = False
                Case 2, 3
                    LoadAbdList2(cboAbdCode14.SelectedValue, cboAbdCode24)
                    cboAbdCode24.Enabled = True
                    txtAbdCode34.Enabled = False
                Case 4
                    LoadAbdList2(cboAbdCode14.SelectedValue, cboAbdCode24)
                    cboAbdCode24.Enabled = True
                    txtAbdCode34.Enabled = True
            End Select
        Else
            panAbd5.Enabled = False

            cboAbdCode24.Enabled = False
            txtAbdCode34.Enabled = False
        End If
    End Sub

    Private Sub Abd5()
        If cboAbdCode15.SelectedIndex >= 0 Then
            Select Case cboAbdCode15.SelectedValue
                Case 5, 6, 7, 8
                    txtAbdCode35.Enabled = True
                    cboAbdCode25.Enabled = False
                Case 2, 3
                    LoadAbdList2(cboAbdCode15.SelectedValue, cboAbdCode25)
                    cboAbdCode25.Enabled = True
                    txtAbdCode35.Enabled = False
                Case 4
                    LoadAbdList2(cboAbdCode15.SelectedValue, cboAbdCode25)
                    cboAbdCode25.Enabled = True
                    txtAbdCode35.Enabled = True
            End Select
        Else
            cboAbdCode25.Enabled = False
            txtAbdCode35.Enabled = False
        End If
    End Sub

    Private Sub optCXR_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optCXR.SelectedIndexChanged
        If optCXR.SelectedIndex = 1 Then
            cboCXRCode11.Enabled = True
        Else
            cboCXRCode11.SelectedValue = 0
            cboCXRCode11.Enabled = False
        End If
    End Sub

    Private Sub optAbdominal_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optAbdominal.SelectedIndexChanged
        If optAbdominal.SelectedIndex = 1 Then
            cboAbdCode11.Enabled = True
        Else
            cboAbdCode11.SelectedValue = 0
            cboAbdCode11.Enabled = False
        End If
    End Sub

    Private Sub cboCXRCode11_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboCXRCode11.SelectedIndexChanged
        CXR1()
    End Sub

    Private Sub cboCXRCode12_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboCXRCode12.SelectedIndexChanged
        CXR2()
    End Sub

    Private Sub cboCXRCode13_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboCXRCode13.SelectedIndexChanged
        CXR3()
    End Sub

    Private Sub cboCXRCode14_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboCXRCode14.SelectedIndexChanged
        CXR4()
    End Sub

    Private Sub cboCXRCode15_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboCXRCode15.SelectedIndexChanged
        CXR5()
    End Sub

    Private Sub cboAbdCode11_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboAbdCode11.SelectedIndexChanged
        Abd1()
    End Sub

    Private Sub cboAbdCode12_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboAbdCode12.SelectedIndexChanged
        Abd2()
    End Sub

    Private Sub cboAbdCode13_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboAbdCode13.SelectedIndexChanged
        Abd3()
    End Sub

    Private Sub cboAbdCode14_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboAbdCode14.SelectedIndexChanged
        Abd4()
    End Sub

    Private Sub cboAbdCode15_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboAbdCode15.SelectedIndexChanged
        Abd5()
    End Sub

    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        ClearAll()
    End Sub

    Private Sub Loadhead()
        dt = New DataTable
        dt.Columns.Add("Clinic ID", GetType(String))
        dt.Columns.Add("ART Num.", GetType(String))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Age", GetType(Integer))
        dt.Columns.Add("Date Re-Arrival", GetType(Date))
        dt.Columns.Add("Date R-Result", GetType(Date))
        dt.Columns.Add("Date C-Blood", GetType(Date))
        dt.Columns.Add("CD4 Rapid", GetType(Boolean))
        dt.Columns.Add("CD4", GetType(String))
        dt.Columns.Add("CD%", GetType(String))
        dt.Columns.Add("Viral load-copy", GetType(String))
        dt.Columns.Add("Viral load-Log", GetType(String))
        dt.Columns.Add("TestID", GetType(String))
        dt.Columns.Add("HCV-copy", GetType(String))
        dt.Columns.Add("HCV-Log", GetType(String))
        GridControl1.DataSource = dt
        GridView1.Columns("TestID").Visible = False
    End Sub
    Private Sub EditMain()
        Try
            If Idate.Date > CDate(daTestDate.Text) And ti <> 1 Then MsgBox("Date Patient Test Must be greater then Initial Visit", MsgBoxStyle.Critical, "Check date") : Exit Sub

            Dim CmdInsert As MySqlCommand = New MySqlCommand("Update tblPatientTest set DaArrival='" & Format(CDate(Daarrival.Text), "yyyy/MM/dd") & "', Dat='" & Format(CDate(daTestDate.Text), "yyyy/MM/dd") & "',DaCollect='" & Format(CDate(DaCollection.Text), "yyyy/MM/dd") & "',CD4Rapid='" & If(ChkCd4Rapid.Checked, 1, 0) & "',CD4='" & txtCD4.Text & "',CD='" & txtCD4Per.Text & "',CD8='" & txtCD8.Text & "',HIVLoad='" & txtHIVViralLoad.Text & "'," &
             "HIVLog='" & txtHIVViralLoadLog.Text & "',HCV='" & txtHCHc.Text & "',HCVlog='" & txtHCVlog.Text & "',HIVAb='" & optHIVAb.SelectedIndex & "',HBsAg='" & optHBsAg.SelectedIndex & "',HCVPCR='" & optHCVPR.SelectedIndex & "'," &
             "HBeAg='" & optHBeAg.SelectedIndex & "',TPHA='" & optTPHA.SelectedIndex & "',AntiHBcAb='" & optHBcAb.SelectedIndex & "',RPR='" & optRPR.SelectedIndex & "'," &
             "AntiHBeAb='" & optHBeAb.SelectedIndex & "',RPRab='" & txtRPRTitre.Text & "',HCVAb='" & optHCVAb.SelectedIndex & "',HBsAb='" & optHBsAb.SelectedIndex & "'," &
             "WBC='" & txtWBC.Text & "',Neutrophils='" & txtNeutrophils.Text & "',HGB='" & txtHaemoglobin.Text & "',Eosinophis='" & txtEosinophils.Text & "'," &
             "HCT='" & txtHaematocrit.Text & "',Lymphocyte='" & txtLymphocytes.Text & "',MCV='" & txtMCV.Text & "',Monocyte='" & txtMonocytes.Text & "'," &
             "PLT='" & txtPlatelets.Text & "',Reticulocte='" & txtReticulocvte.Text & "',Prothrombin='" & txtProthrominTimeINR.Text & "',ProReticulocyte='" & txtReticulocvtePer.Text & "'," &
             "Creatinine='" & txtCreatinine.Text & "',HDL='" & txtCHOLHDL.Text & "',Bilirubin='" & txtBilirubin.Text & "',Glucose='" & txtGlucose.Text & "',Sodium='" & txtSodium.Text & "'," &
             "AlPhosphate='" & txtPhosphate.Text & "',GotASAT='" & txtASATAST.Text & "',Potassium='" & txtPotassium.Text & "'," &
             "Amylase='" & txtAmylase.Text & "',GPTALAT='" & txtALATALT.Text & "',Chloride='" & txtChloride.Text & "',CK='" & txtCK.Text & "',CHOL='" & txtCHOL.Text & "'," &
             "Bicarbonate='" & txtBicarbonate.Text & "',Lactate='" & txtLactate.Text & "',Triglyceride='" & txtTG.Text & "',Urea='" & txtUrea.Text & "'," &
             "Magnesium='" & txtMagnesium.Text & "',Phosphorus='" & txtPhosphorus.Text & "',Calcium='" & txtCalcium.Text & "',BHCG='" & optUrineBHCG.SelectedIndex & "',SputumAFB='" & optSputumAFB.SelectedIndex & "'," &
             "AFBCulture='" & optAFBCulture.SelectedIndex & "',AFBCulture1='" & cboAFBCultureve.Text & "',UrineMicroscopy='" & optUrine.SelectedIndex & "',UrineComment='" & txtUrineDetail.Text & "'," &
             "CSFCell='" & txtCSFCellCount.Text & "',CSFGram='" & txtCSFGram.Text & "',CSFAFB='" & txtCSFZiel.Text & "',CSFIndian='" & optCSFIndian.SelectedIndex & "'," &
             "CSFCCag='" & txtCSFCC.Text & "',CSFProtein='" & txtCSFProtein.Text & "',CSFGlucose='" & txtCSFGlucose.Text & "',BloodCulture='" & optBloodCulture1.SelectedIndex & "'," &
             "BloodCulture0='" & cboBloodCulture1ve.Text & "',BloodCulture1='" & optBloodCulture2.SelectedIndex & "',BloodCulture10='" & cboBloodCulture2ve.Text & "',CTNA='" & optCTPCR.SelectedIndex & "',GCNA='" & optGCPCR.SelectedIndex & "',CXR='" & optCXR.SelectedIndex & "',Abdominal='" & optAbdominal.SelectedIndex & "' where TestID='" & Tid & "'", ConnectionDB.Cnndb)
            CmdInsert.ExecuteNonQuery()
            If cboCXRCode11.Enabled And X(0) <> "" Then
                Dim CmdCxr As New MySqlCommand("Update tblpatientTestCXR set CXR='" & cboCXRCode11.Text & "',CXR1='" & cboCXRCode21.Text & "',CXR2='" & txtCXRCode31.Text & "' Where TestID='" & Tid & "' and CXR='" & X(0) & "' ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            ElseIf cboCXRCode11.Enabled And X(0) = "" Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & Tid & "','" & cboCXRCode11.Text & "','" & cboCXRCode21.Text & "','" & txtCXRCode31.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode12.Enabled And X(1) <> "" Then
                Dim CmdCxr As New MySqlCommand("Update tblpatientTestCXR set CXR='" & cboCXRCode12.Text & "',CXR1='" & cboCXRCode22.Text & "',CXR2='" & txtCXRCode32.Text & "' Where TestID='" & Tid & "' and CXR='" & X(1) & "' ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            ElseIf cboCXRCode12.Enabled And X(1) = "" Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & Tid & "','" & cboCXRCode12.Text & "','" & cboCXRCode22.Text & "','" & txtCXRCode32.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode13.Enabled And X(2) <> "" Then
                Dim CmdCxr As New MySqlCommand("Update tblpatientTestCXR set CXR='" & cboCXRCode13.Text & "',CXR1='" & cboCXRCode23.Text & "',CXR2='" & txtCXRCode33.Text & "' Where TestID='" & Tid & "' and CXR='" & X(2) & "' ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            ElseIf cboCXRCode13.Enabled And X(2) = "" Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & Tid & "','" & cboCXRCode13.Text & "','" & cboCXRCode23.Text & "','" & txtCXRCode33.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode14.Enabled And X(3) <> "" Then
                Dim CmdCxr As New MySqlCommand("Update tblpatientTestCXR set CXR='" & cboCXRCode14.Text & "',CXR1='" & cboCXRCode24.Text & "',CXR2='" & txtCXRCode34.Text & "' Where TestID='" & Tid & "' and CXR='" & X(3) & "' ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            ElseIf cboCXRCode14.Enabled And X(3) = "" Then

                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & Tid & "','" & cboCXRCode14.Text & "','" & cboCXRCode24.Text & "','" & txtCXRCode34.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode15.Enabled And X(4) <> "" Then
                Dim CmdCxr As New MySqlCommand("Update tblpatientTestCXR set CXR='" & cboCXRCode15.Text & "',CXR1='" & cboCXRCode25.Text & "',CXR2='" & txtCXRCode35.Text & "' Where TestID='" & Tid & "' and CXR='" & X(4) & "' ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            ElseIf cboCXRCode15.Enabled And X(4) = "" Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & Tid & "','" & cboCXRCode15.Text & "','" & cboCXRCode25.Text & "','" & txtCXRCode35.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboAbdCode11.Enabled And M(0) <> "" Then
                Dim CmdAbd As New MySqlCommand("Update tblpatienttestAbdominal set Abdo='" & cboAbdCode11.Text & "',Abdo1='" & cboAbdCode21.Text & "',Abdo2='" & txtAbdCode31.Text & "' Where TestID='" & Tid & "' and Abdo='" & M(0) & "' ", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            ElseIf cboAbdCode11.Enabled And M(0) = "" Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & Tid & "','" & cboAbdCode11.Text & "','" & cboAbdCode21.Text & "','" & txtAbdCode31.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode12.Enabled And M(1) <> "" Then
                Dim CmdAbd As New MySqlCommand("Update tblpatienttestAbdominal set Abdo='" & cboAbdCode12.Text & "',Abdo1='" & cboAbdCode22.Text & "',Abdo2='" & txtAbdCode32.Text & "' Where TestID='" & Tid & "' and Abdo='" & M(1) & "' ", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            ElseIf cboAbdCode12.Enabled And M(1) = "" Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & Tid & "','" & cboAbdCode12.Text & "','" & cboAbdCode22.Text & "','" & txtAbdCode32.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode13.Enabled And M(2) <> "" Then
                Dim CmdAbd As New MySqlCommand("Update tblpatienttestAbdominal set Abdo='" & cboAbdCode13.Text & "',Abdo1='" & cboAbdCode23.Text & "',Abdo2='" & txtAbdCode33.Text & "' Where TestID='" & Tid & "' and Abdo='" & M(2) & "' ", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            ElseIf cboAbdCode13.Enabled And M(2) = "" Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & Tid & "','" & cboAbdCode13.Text & "','" & cboAbdCode23.Text & "','" & txtAbdCode33.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode14.Enabled And M(3) <> "" Then
                Dim CmdAbd As New MySqlCommand("Update tblpatienttestAbdominal set Abdo='" & cboAbdCode14.Text & "',Abdo1='" & cboAbdCode24.Text & "',Abdo2='" & txtAbdCode34.Text & "' Where TestID='" & Tid & "' and Abdo='" & M(3) & "' ", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            ElseIf cboAbdCode14.Enabled And M(3) = "" Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & Tid & "','" & cboAbdCode14.Text & "','" & cboAbdCode24.Text & "','" & txtAbdCode34.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode15.Enabled And M(4) <> "" Then
                Dim CmdAbd As New MySqlCommand("Update tblpatienttestAbdominal set Abdo='" & cboAbdCode15.Text & "',Abdo1='" & cboAbdCode25.Text & "',Abdo2='" & txtAbdCode35.Text & "' Where TestID='" & Tid & "' and Abdo='" & M(4) & "' ", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            ElseIf cboAbdCode15.Enabled And M(4) = "" Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & Tid & "','" & cboAbdCode15.Text & "','" & cboAbdCode25.Text & "','" & txtAbdCode35.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblPatientTest','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MsgBox("Now update successful", vbInformation, "Saving")
            ClearAll()

        Catch ex As Exception
            MsgBox(ex.Message, MsgBoxStyle.Critical, "Impossible Save")
            'MsgBox("Have something wrong in the database!", MsgBoxStyle.Critical, "Impossible Save")
        End Try
    End Sub
    Private Sub Insert()
        Dim t, id As String
        If IsNumeric(txtClinicID.Text) Then
            t = Val(txtClinicID.Text) & Format(CDate(daTestDate.Text).Date, "ddMMyyyy")
            id = Val(txtClinicID.Text)
        Else
            t = txtClinicID.Text.Trim & Format(CDate(daTestDate.Text).Date, "ddMMyyyy")
            id = txtClinicID.Text
        End If

        Try
            If Idate.Date > CDate(daTestDate.Text) And ti <> 1 Then MsgBox("Date Patient Test Must be greater then Initial Visit", MsgBoxStyle.Critical, "Check date") : Exit Sub
            Dim CmdInsert As New MySqlCommand("insert into tblPatientTest values('" & t & "','" & id & "','" & Format(CDate(Daarrival.Text), "yyyy/MM/dd") & "'," &
             "'" & Format(CDate(daTestDate.Text), "yyyy/MM/dd") & "','" & Format(CDate(DaCollection.Text), "yyyy/MM/dd") & "','" & If(ChkCd4Rapid.Checked, 1, 0) & "','" & txtCD4.Text & "','" & txtCD4Per.Text & "','" & txtCD8.Text & "','" & txtHIVViralLoad.Text & "'," &
             "'" & txtHIVViralLoadLog.Text & "','" & txtHCHc.Text.Trim & "','" & txtHCVlog.Text.Trim & "','" & optHIVAb.SelectedIndex & "','" & optHBsAg.SelectedIndex & "','" & optHCVPR.SelectedIndex & "'," &
             "'" & optHBeAg.SelectedIndex & "','" & optTPHA.SelectedIndex & "','" & optHBcAb.SelectedIndex & "','" & optRPR.SelectedIndex & "'," &
             "'" & optHBeAb.SelectedIndex & "','" & txtRPRTitre.Text & "','" & optHCVAb.SelectedIndex & "','" & optHBsAb.SelectedIndex & "'," &
             "'" & txtWBC.Text & "','" & txtNeutrophils.Text & "','" & txtHaemoglobin.Text & "','" & txtEosinophils.Text & "'," &
             "'" & txtHaematocrit.Text & "','" & txtLymphocytes.Text & "','" & txtMCV.Text & "','" & txtMonocytes.Text & "'," &
             "'" & txtPlatelets.Text & "','" & txtReticulocvte.Text & "','" & txtProthrominTimeINR.Text & "','" & txtReticulocvtePer.Text & "'," &
             "'" & txtCreatinine.Text & "','" & txtCHOLHDL.Text & "','" & txtBilirubin.Text & "','" & txtGlucose.Text & "','" & txtSodium.Text & "'," &
             "'" & txtPhosphate.Text & "','" & txtASATAST.Text & "','" & txtPotassium.Text & "'," &
             "'" & txtAmylase.Text & "','" & txtALATALT.Text & "','" & txtChloride.Text & "','" & txtCK.Text & "','" & txtCHOL.Text & "'," &
             "'" & txtBicarbonate.Text & "','" & txtLactate.Text & "','" & txtTG.Text & "','" & txtUrea.Text & "'," &
             "'" & txtMagnesium.Text & "','" & txtPhosphorus.Text & "','" & txtCalcium.Text & "','" & optUrineBHCG.SelectedIndex & "','" & optSputumAFB.SelectedIndex & "'," &
             "'" & optAFBCulture.SelectedIndex & "','" & cboAFBCultureve.Text & "','" & optUrine.SelectedIndex & "','" & txtUrineDetail.Text & "'," &
             "'" & txtCSFCellCount.Text & "','" & txtCSFGram.Text & "','" & txtCSFZiel.Text & "','" & optCSFIndian.SelectedIndex & "'," &
             "'" & txtCSFCC.Text & "','" & txtCSFProtein.Text & "','" & txtCSFGlucose.Text & "','" & optBloodCulture1.SelectedIndex & "'," &
             "'" & cboBloodCulture1ve.Text & "','" & optBloodCulture2.SelectedIndex & "','" & cboBloodCulture2ve.Text & "','" & optCTPCR.SelectedIndex & "','" & optGCPCR.SelectedIndex & "','" & optCXR.SelectedIndex & "','" & optAbdominal.SelectedIndex & "')", ConnectionDB.Cnndb)
            CmdInsert.ExecuteNonQuery()
            If cboCXRCode11.Enabled Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & t & "','" & cboCXRCode11.Text & "','" & cboCXRCode21.Text & "','" & txtCXRCode31.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode12.Enabled Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & t & "','" & cboCXRCode12.Text & "','" & cboCXRCode22.Text & "','" & txtCXRCode32.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode13.Enabled Then
                Dim CmdCxr As New MySqlCommand("insert into tblTestCXR values('" & t & "','" & cboCXRCode13.Text & "','" & cboCXRCode23.Text & "','" & txtCXRCode33.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode14.Enabled Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & t & "','" & cboCXRCode14.Text & "','" & cboCXRCode24.Text & "','" & txtCXRCode34.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboCXRCode15.Enabled Then
                Dim CmdCxr As New MySqlCommand("insert into tblpatientTestCXR values('" & t & "','" & cboCXRCode15.Text & "','" & cboCXRCode25.Text & "','" & txtCXRCode35.Text & "') ", ConnectionDB.Cnndb)
                CmdCxr.ExecuteNonQuery()
            End If
            If cboAbdCode11.Enabled Then
                Dim CmdAbd As New MySqlCommand("Insert into tbltestAbdominal values('" & t & "','" & cboAbdCode11.Text & "','" & cboAbdCode21.Text & "','" & txtAbdCode31.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode12.Enabled Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & t & "','" & cboAbdCode12.Text & "','" & cboAbdCode22.Text & "','" & txtAbdCode32.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode13.Enabled Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & t & "','" & cboAbdCode13.Text & "','" & cboAbdCode23.Text & "','" & txtAbdCode33.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode14.Enabled Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & t & "','" & cboAbdCode14.Text & "','" & cboAbdCode24.Text & "','" & txtAbdCode34.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            If cboAbdCode15.Enabled Then
                Dim CmdAbd As New MySqlCommand("Insert into tblpatienttestAbdominal values('" & t & "','" & cboAbdCode15.Text & "','" & cboAbdCode25.Text & "','" & txtAbdCode35.Text & "')", ConnectionDB.Cnndb)
                CmdAbd.ExecuteNonQuery()
            End If
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblPatientTest','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MsgBox("The Database is now Saving completely", vbInformation, "Saving")
            ClearAll()

        Catch ex As Exception
            MsgBox(ex.Message, MsgBoxStyle.Critical, "Impossible Save")
            'MsgBox("Already existed in the database!", MsgBoxStyle.Critical, "Impossible Save")
        End Try
    End Sub
    Private Sub Deleted()
        If MsgBox("Are you sure you want to delete this record?", MsgBoxStyle.YesNo + MsgBoxStyle.Question, "Delete Patient Test") = MsgBoxResult.Yes Then
            'Dim key As Microsoft.Win32.RegistryKey
            'Dim TempConn As SqlConnection
            'key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey("Software\Microsoft\Windows\CurrentVersion\Run", True)
            'Dim StSERVER = key.GetValue("K132")
            'Dim TempString As String = "server =" + StSERVER + ";integrated security = true;database = New_OI"
            'TempConn = New SqlConnection(TempString)
            'TempConn.Open()

            'Dim CmdSearch As New SqlCommand("Select TestID from tblPatientTest WHERE ClinicID = '" & txtPatNumber.Text & "' AND Dat = '" & Format(daTestDate.Value.Date, "MM/dd/yyyy") & "' ", ConnectionDB.Cnndb)
            'Rdr = CmdSearch.ExecuteReader
            'While Rdr.Read
            '    Dim DelCXR As New SqlCommand("DELETE FROM tblTestCXR WHERE TestID='" & Rdr.GetValue(0).ToString & "'", TempConn)
            '    DelCXR.ExecuteNonQuery()
            '    Dim DelAbdominal As New SqlCommand("DELETE FROM tbltestAbdominal WHERE TestID='" & Rdr.GetValue(0).ToString & "'", TempConn)
            '    DelAbdominal.ExecuteNonQuery()
            'End While
            'Rdr.Close()
            'TempConn.Close()
            'Dim CmdDelete As SqlCommand = New SqlCommand("DELETE FROM tblPatientTest WHERE ClinicID = '" & txtPatNumber.Text & "' AND Dat = '" & Format(daTestDate.Value.Date, "MM/dd/yyyy") & "'", ConnectionDB.Cnndb)
            'CmdDelete.ExecuteNonQuery()
            'MsgBox("Deleted Successful", MsgBoxStyle.Information, "Delete Patient Test")
            'tbr1Delete.Enabled = False
            '_bSave = False
            'NewPatientTest()
            '' GridView()
            'txtPatNumber.Focus()
        End If

    End Sub
    Private Sub CheckPat()
        If Trim(txtClinicID.Text) = "" Then Exit Sub
        If IsNumeric(txtClinicID.Text) Then
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
                    ClearAll()
                    Rdr.Close()
                    txtClinicID.Focus()
                    Exit Sub
                End While
                Rdr.Close()
            End If
            Dim CmdART As New MySqlCommand("Select * from tblaart where ClinicID='" & txtClinicID.Text & "'", Cnndb)
            Rdr = CmdART.ExecuteReader
            While Rdr.Read
                txtARTnum.Text = Rdr.GetValue(1).ToString
            End While
            Rdr.Close()
            Dim Cmdsave As New MySqlCommand("select * from tblAImain where ClinicID='" & txtClinicID.Text & "'", Cnndb)
            Rdr = Cmdsave.ExecuteReader
            While Rdr.Read
                If txtClinicID.Text = Trim(Rdr.GetValue(0).ToString) Then
                    txtClinicID.Text = Trim(Rdr.GetValue(0).ToString)
                    Idate = Trim(Rdr.GetValue(1).ToString)
                    txtAge.Text = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(5).ToString), CDate(Date.Now))
                    ti = Rdr.GetValue(16).ToString
                    optSex.SelectedIndex = Rdr.GetValue(6).ToString
                    Rdr.Close()
                    txtClinicID.Enabled = False
                    txtClinicID.Text = Format(Int(txtClinicID.Text), "000000")
                    Exit Sub
                End If
            End While
            Rdr.Close()
        Else
            If tsbDelete.Enabled = False Then
                Dim CmdSearch As New MySqlCommand("Select * from tblcvpatientstatus where ClinicID='" & txtClinicID.Text & "'", ConnectionDB.Cnndb)
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
                    '  txtClinicID.Enabled = True
                    ClearAll()
                    Rdr.Close()
                    txtClinicID.Focus()
                    Exit Sub
                End While
                Rdr.Close()
            End If
            Dim CmdART As New MySqlCommand("Select * from tblcart where ClinicID='" & txtClinicID.Text & "'", Cnndb)
            Rdr = CmdART.ExecuteReader
            While Rdr.Read
                txtARTnum.Text = Rdr.GetValue(1).ToString
            End While
            Rdr.Close()
            Dim cmdChild As New MySqlCommand("Select * from tblCImain where ClinicID='" & txtClinicID.Text & "'", Cnndb)
            Rdr = cmdChild.ExecuteReader
            While Rdr.Read
                txtClinicID.Text = Trim(Rdr.GetValue(0).ToString)
                txtAge.Text = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), Date.Now.Date)
                Idate = Trim(Rdr.GetValue(1).ToString)
                ti = Rdr.GetValue(12).ToString
                optSex.SelectedIndex = Rdr.GetValue(4).ToString
                Rdr.Close()
                txtClinicID.Enabled = False
                Exit Sub
            End While
            Rdr.Close()

        End If
        MsgBox("No Patient is found with this Clinic ID. (Maybe no initial visit)", MsgBoxStyle.Critical, "Patient Test")
        txtClinicID.Text = ""
        txtClinicID.Focus()
    End Sub
    Private Sub Searchmain()

        Dim cmdSearch As New MySqlCommand("select * from tblPatientTest WHERE TestID = '" & Tid & "'", Cnndb)
        Rdr = cmdSearch.ExecuteReader
        While Rdr.Read
            'txtCD8.Text = Trim(Rdr.GetValue(7).ToString)
            'txtHIVViralLoad.Text = Trim(Rdr.GetValue(8).ToString)
            'DaCollection.Text = Format(CDate(Rdr.GetValue(4).ToString), "dd/MM/yyyy")
            'Daarrival.Text = Format(CDate(Rdr.GetValue(2).ToString), "dd/MM/yyyy")
            'txtHIVViralLoadLog.Text = Trim(Rdr.GetValue(9).ToString)
            'txtHCHc.Text = Rdr.GetValue(10).ToString.Trim
            'txtHCVlog.Text = Rdr.GetValue(11).ToString.Trim
            'optHIVAb.SelectedIndex = Rdr.GetValue(12).ToString
            'optHBsAg.SelectedIndex = Rdr.GetValue(13).ToString
            'optHCVPR.SelectedIndex = Rdr.GetValue(14).ToString
            'optHBeAg.SelectedIndex = Rdr.GetValue(15).ToString
            'optTPHA.SelectedIndex = Rdr.GetValue(16).ToString
            'optHBcAb.SelectedIndex = Rdr.GetValue(17).ToString
            'optRPR.SelectedIndex = Rdr.GetValue(18).ToString
            'optHBeAb.SelectedIndex = Rdr.GetValue(19).ToString
            'txtRPRTitre.Text = Rdr.GetValue(20).ToString.Trim
            'optHCVAb.SelectedIndex = Rdr.GetValue(21).ToString
            'optHBsAb.SelectedIndex = Rdr.GetValue(22).ToString
            'txtWBC.Text = Trim(Rdr.GetValue(23).ToString)
            'txtNeutrophils.Text = Trim(Rdr.GetValue(24).ToString)
            'txtHaemoglobin.Text = Trim(Rdr.GetValue(25).ToString)
            'txtEosinophils.Text = Trim(Rdr.GetValue(26).ToString)
            'txtHaematocrit.Text = Trim(Rdr.GetValue(27).ToString)
            'txtLymphocytes.Text = Trim(Rdr.GetValue(28).ToString)
            'txtMCV.Text = Trim(Rdr.GetValue(29).ToString)
            'txtMonocytes.Text = Trim(Rdr.GetValue(30).ToString)
            'txtPlatelets.Text = Trim(Rdr.GetValue(31).ToString)
            'txtReticulocvte.Text = Trim(Rdr.GetValue(32).ToString)
            'txtProthrominTimeINR.Text = Trim(Rdr.GetValue(33).ToString)
            'txtReticulocvtePer.Text = Trim(Rdr.GetValue(34).ToString)
            'txtCreatinine.Text = Trim(Rdr.GetValue(35).ToString)
            'txtCHOLHDL.Text = Trim(Rdr.GetValue(36).ToString)
            'txtBilirubin.Text = Trim(Rdr.GetValue(37).ToString)
            'txtGlucose.Text = Trim(Rdr.GetValue(38).ToString)
            'txtSodium.Text = Trim(Rdr.GetValue(39).ToString)
            'txtPhosphate.Text = Trim(Rdr.GetValue(40).ToString)
            'txtASATAST.Text = Trim(Rdr.GetValue(41).ToString)
            'txtPotassium.Text = Trim(Rdr.GetValue(42).ToString)
            'txtAmylase.Text = Trim(Rdr.GetValue(43).ToString)
            'txtALATALT.Text = Trim(Rdr.GetValue(44).ToString)
            'txtChloride.Text = Trim(Rdr.GetValue(45).ToString)
            'txtCK.Text = Trim(Rdr.GetValue(46).ToString)
            'txtCHOL.Text = Trim(Rdr.GetValue(47).ToString)
            'txtBicarbonate.Text = Trim(Rdr.GetValue(48).ToString)
            'txtLactate.Text = Trim(Rdr.GetValue(49).ToString)
            'txtTG.Text = Trim(Rdr.GetValue(50).ToString)
            'txtUrea.Text = Trim(Rdr.GetValue(51).ToString)
            'txtMagnesium.Text = Trim(Rdr.GetValue(52).ToString)
            'txtPhosphorus.Text = Trim(Rdr.GetValue(53).ToString)
            'txtCalcium.Text = Trim(Rdr.GetValue(54).ToString)
            'optUrineBHCG.SelectedIndex = Rdr.GetValue(55).ToString
            'optSputumAFB.SelectedIndex = Rdr.GetValue(56).ToString
            'optAFBCulture.SelectedIndex = Rdr.GetValue(57).ToString
            'cboAFBCultureve.Text = Trim(Rdr.GetValue(58).ToString)
            'optUrine.SelectedIndex = Rdr.GetValue(59).ToString
            'txtUrineDetail.Text = Trim(Rdr.GetValue(60).ToString)
            'txtCSFCellCount.Text = Trim(Rdr.GetValue(61).ToString)
            'txtCSFGram.Text = Trim(Rdr.GetValue(62).ToString)
            'txtCSFZiel.Text = Trim(Rdr.GetValue(63).ToString)
            'optCSFIndian.SelectedIndex = Rdr.GetValue(64).ToString
            'txtCSFCC.Text = Trim(Rdr.GetValue(65).ToString)
            'txtCSFProtein.Text = Trim(Rdr.GetValue(66).ToString)
            'txtCSFGlucose.Text = Trim(Rdr.GetValue(67).ToString)
            'optBloodCulture1.SelectedIndex = Rdr.GetValue(68).ToString
            'cboBloodCulture1ve.Text = Trim(Rdr.GetValue(69).ToString)
            'optBloodCulture2.SelectedIndex = Rdr.GetValue(70).ToString
            'cboBloodCulture2ve.Text = Trim(Rdr.GetValue(71).ToString)
            'optCTPCR.SelectedIndex = Rdr.GetValue(72).ToString
            'optGCPCR.SelectedIndex = Rdr.GetValue(73).ToString
            'optCXR.SelectedIndex = Rdr.GetValue(74).ToString
            'optAbdominal.SelectedIndex = Rdr.GetValue(75).ToString

            txtCD8.Text = Trim(Rdr.GetValue(8).ToString)
            txtHIVViralLoad.Text = Trim(Rdr.GetValue(9).ToString)
            DaCollection.Text = Format(CDate(Rdr.GetValue(4).ToString), "dd/MM/yyyy")
            Daarrival.Text = Format(CDate(Rdr.GetValue(2).ToString), "dd/MM/yyyy")
            ChkCd4Rapid.Checked = If(Rdr.GetValue(5).ToString = "1", True, False)
            txtHIVViralLoadLog.Text = Trim(Rdr.GetValue(10).ToString)
            txtHCHc.Text = Rdr.GetValue(11).ToString.Trim
            txtHCVlog.Text = Rdr.GetValue(12).ToString.Trim
            optHIVAb.SelectedIndex = Rdr.GetValue(13).ToString
            optHBsAg.SelectedIndex = Rdr.GetValue(14).ToString
            optHCVPR.SelectedIndex = Rdr.GetValue(15).ToString
            optHBeAg.SelectedIndex = Rdr.GetValue(16).ToString
            optTPHA.SelectedIndex = Rdr.GetValue(17).ToString
            optHBcAb.SelectedIndex = Rdr.GetValue(18).ToString
            optRPR.SelectedIndex = Rdr.GetValue(19).ToString
            optHBeAb.SelectedIndex = Rdr.GetValue(20).ToString
            txtRPRTitre.Text = Rdr.GetValue(21).ToString.Trim
            optHCVAb.SelectedIndex = Rdr.GetValue(22).ToString
            optHBsAb.SelectedIndex = Rdr.GetValue(23).ToString
            txtWBC.Text = Trim(Rdr.GetValue(24).ToString)
            txtNeutrophils.Text = Trim(Rdr.GetValue(25).ToString)
            txtHaemoglobin.Text = Trim(Rdr.GetValue(26).ToString)
            txtEosinophils.Text = Trim(Rdr.GetValue(27).ToString)
            txtHaematocrit.Text = Trim(Rdr.GetValue(28).ToString)
            txtLymphocytes.Text = Trim(Rdr.GetValue(29).ToString)
            txtMCV.Text = Trim(Rdr.GetValue(30).ToString)
            txtMonocytes.Text = Trim(Rdr.GetValue(31).ToString)
            txtPlatelets.Text = Trim(Rdr.GetValue(32).ToString)
            txtReticulocvte.Text = Trim(Rdr.GetValue(33).ToString)
            txtProthrominTimeINR.Text = Trim(Rdr.GetValue(34).ToString)
            txtReticulocvtePer.Text = Trim(Rdr.GetValue(35).ToString)
            txtCreatinine.Text = Trim(Rdr.GetValue(36).ToString)
            txtCHOLHDL.Text = Trim(Rdr.GetValue(37).ToString)
            txtBilirubin.Text = Trim(Rdr.GetValue(38).ToString)
            txtGlucose.Text = Trim(Rdr.GetValue(39).ToString)
            txtSodium.Text = Trim(Rdr.GetValue(40).ToString)
            txtPhosphate.Text = Trim(Rdr.GetValue(41).ToString)
            txtASATAST.Text = Trim(Rdr.GetValue(42).ToString)
            txtPotassium.Text = Trim(Rdr.GetValue(43).ToString)
            txtAmylase.Text = Trim(Rdr.GetValue(44).ToString)
            txtALATALT.Text = Trim(Rdr.GetValue(45).ToString)
            txtChloride.Text = Trim(Rdr.GetValue(46).ToString)
            txtCK.Text = Trim(Rdr.GetValue(47).ToString)
            txtCHOL.Text = Trim(Rdr.GetValue(48).ToString)
            txtBicarbonate.Text = Trim(Rdr.GetValue(49).ToString)
            txtLactate.Text = Trim(Rdr.GetValue(50).ToString)
            txtTG.Text = Trim(Rdr.GetValue(51).ToString)
            txtUrea.Text = Trim(Rdr.GetValue(52).ToString)
            txtMagnesium.Text = Trim(Rdr.GetValue(53).ToString)
            txtPhosphorus.Text = Trim(Rdr.GetValue(54).ToString)
            txtCalcium.Text = Trim(Rdr.GetValue(55).ToString)
            optUrineBHCG.SelectedIndex = Rdr.GetValue(56).ToString
            optSputumAFB.SelectedIndex = Rdr.GetValue(57).ToString
            optAFBCulture.SelectedIndex = Rdr.GetValue(58).ToString
            cboAFBCultureve.Text = Trim(Rdr.GetValue(59).ToString)
            optUrine.SelectedIndex = Rdr.GetValue(60).ToString
            txtUrineDetail.Text = Trim(Rdr.GetValue(61).ToString)
            txtCSFCellCount.Text = Trim(Rdr.GetValue(62).ToString)
            txtCSFGram.Text = Trim(Rdr.GetValue(63).ToString)
            txtCSFZiel.Text = Trim(Rdr.GetValue(64).ToString)
            optCSFIndian.SelectedIndex = Rdr.GetValue(65).ToString
            txtCSFCC.Text = Trim(Rdr.GetValue(66).ToString)
            txtCSFProtein.Text = Trim(Rdr.GetValue(67).ToString)
            txtCSFGlucose.Text = Trim(Rdr.GetValue(68).ToString)
            optBloodCulture1.SelectedIndex = Rdr.GetValue(69).ToString
            cboBloodCulture1ve.Text = Trim(Rdr.GetValue(70).ToString)
            optBloodCulture2.SelectedIndex = Rdr.GetValue(71).ToString
            cboBloodCulture2ve.Text = Trim(Rdr.GetValue(72).ToString)
            optCTPCR.SelectedIndex = Rdr.GetValue(73).ToString
            optGCPCR.SelectedIndex = Rdr.GetValue(74).ToString
            optCXR.SelectedIndex = Rdr.GetValue(75).ToString
            optAbdominal.SelectedIndex = Rdr.GetValue(76).ToString
        End While
        Rdr.Close()
        Dim CmdCXR As MySqlCommand = New MySqlCommand("Select * from tblpatientTestCXR where TestID='" & Tid & "' ", ConnectionDB.Cnndb)
        Rdr = CmdCXR.ExecuteReader
        Dim k As Int16
        While Rdr.Read
            k = k + 1
            If k = 1 Then
                X(0) = Rdr.GetValue(1).ToString
                cboCXRCode11.Text = Trim(Rdr.GetValue(1).ToString)
                cboCXRCode21.Text = Trim(Rdr.GetValue(2).ToString)
                txtCXRCode31.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 2 Then
                X(1) = Rdr.GetValue(1).ToString
                cboCXRCode12.Text = Trim(Rdr.GetValue(1).ToString)
                cboCXRCode22.Text = Trim(Rdr.GetValue(2).ToString)
                txtCXRCode32.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 3 Then
                X(2) = Rdr.GetValue(1).ToString
                cboCXRCode13.Text = Trim(Rdr.GetValue(1).ToString)
                cboCXRCode23.Text = Trim(Rdr.GetValue(2).ToString)
                txtCXRCode33.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 4 Then
                X(3) = Rdr.GetValue(1).ToString
                cboCXRCode14.Text = Trim(Rdr.GetValue(1).ToString)
                cboCXRCode24.Text = Trim(Rdr.GetValue(2).ToString)
                txtCXRCode34.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 5 Then
                X(4) = Rdr.GetValue(1).ToString
                cboCXRCode15.Text = Trim(Rdr.GetValue(1).ToString)
                cboCXRCode25.Text = Trim(Rdr.GetValue(2).ToString)
                txtCXRCode35.Text = Trim(Rdr.GetValue(3).ToString)
            End If
        End While
        Rdr.Close()
        Dim CmdAdb As New MySqlCommand("Select * from tblpatienttestAbdominal where TestID='" & Tid & "' ", ConnectionDB.Cnndb)
        Rdr = CmdAdb.ExecuteReader
        k = 0
        While Rdr.Read
            k = k + 1
            If k = 1 Then
                M(0) = Rdr.GetValue(1).ToString
                cboAbdCode11.Text = Trim(Rdr.GetValue(1).ToString)
                cboAbdCode21.Text = Trim(Rdr.GetValue(2).ToString)
                txtAbdCode31.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 2 Then
                M(1) = Rdr.GetValue(1).ToString
                cboAbdCode12.Text = Trim(Rdr.GetValue(1).ToString)
                cboAbdCode22.Text = Trim(Rdr.GetValue(2).ToString)
                txtAbdCode32.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 3 Then
                M(2) = Rdr.GetValue(1).ToString
                cboAbdCode13.Text = Trim(Rdr.GetValue(1).ToString)
                cboAbdCode23.Text = Trim(Rdr.GetValue(2).ToString)
                txtAbdCode33.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 4 Then
                M(3) = Rdr.GetValue(1).ToString
                cboAbdCode14.Text = Trim(Rdr.GetValue(1).ToString)
                cboAbdCode24.Text = Trim(Rdr.GetValue(2).ToString)
                txtAbdCode34.Text = Trim(Rdr.GetValue(3).ToString)
            End If
            If k = 5 Then
                M(4) = Rdr.GetValue(1).ToString
                cboAbdCode15.Text = Trim(Rdr.GetValue(1).ToString)
                cboAbdCode25.Text = Trim(Rdr.GetValue(2).ToString)
                txtAbdCode35.Text = Trim(Rdr.GetValue(3).ToString)
            End If
        End While
        Rdr.Close()
    End Sub

    Private Sub Viewdata()
        Dim se As Integer
        Dim val1 As Double
        Dim CmdSearch As New MySqlCommand("SELECT tblpatienttest.ClinicID AS ClinicID, tblaimain.Sex AS Sex, tblcimain.Sex AS SexChild,tblcimain.DaBirth AS childbirth, tblaimain.DaBirth AS DaBirth, tblpatienttest.Dat AS Dat,tblpatienttest.CD4 AS CD4, tblpatienttest.CD AS CD,tblpatienttest.HIVLoad AS HIVLoad,tblpatienttest.HIVLog AS HIVLog,tblpatienttest.TestID AS TestID,tblpatienttest.DaCollect AS DaCollect,tblaart.art,tblcart.ART,tblpatienttest.HCV,tblpatienttest.HCVlog,tblpatienttest.Daarrival,if(tblpatienttest.CD4Rapid=1,'True','False') CD4Rapid FROM tblpatienttest LEFT OUTER JOIN tblcimain ON tblcimain.ClinicID = tblpatienttest.ClinicID   LEFT OUTER JOIN tblaimain ON tblpatienttest.ClinicID = tblaimain.ClinicID LEFT OUTER JOIN tblaart on tblpatienttest.ClinicID=tblaart.ClinicID LEFT OUTER JOIN tblcart on tblpatienttest.ClinicID=tblcart.ClinicID ORDER BY tblpatienttest.ClinicID, tblpatienttest.Dat", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            '  Try
            Dim dr As DataRow = dt.NewRow()
                ''  Dim xxx As String = Rdr.GetValue(0).ToString
                'If Rdr.GetValue(0).ToString.Trim = "1579" Then
                '    Dim xx As String = "xx"
                'End If

                If Double.TryParse(Rdr.GetValue(0).ToString, val1) Then
                    dr(0) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                    dr(1) = Rdr.GetValue(12).ToString.Trim
                    If Rdr.GetValue(1).ToString.Trim <> "" Then
                        se = Rdr.GetValue(1).ToString
                        dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(4).ToString), CDate(Rdr.GetValue(5).ToString))
                    Else
                        se = -1
                        dr(3) = 0
                    End If

                Else
                    dr(0) = Rdr.GetValue(0).ToString.Trim
                    dr(1) = Rdr.GetValue(13).ToString.Trim
                    se = Rdr.GetValue(2).ToString
                    dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(5).ToString))
                End If
                Select Case CDec(se)
                    Case 0
                        dr(2) = "Female"
                    Case 1
                        dr(2) = "Male"
                    Case Else
                        dr(2) = ""
                End Select
                dr(4) = Format(CDate(Rdr.GetValue(16).ToString), "dd/MM/yyyy")
                dr(5) = Format(CDate(Rdr.GetValue(5).ToString), "dd/MM/yyyy")
            dr(6) = Format(CDate(Rdr.GetValue(11).ToString), "dd/MM/yyyy")
            dr(7) = Rdr.GetValue(17).ToString
            dr(8) = Rdr.GetValue(6).ToString
            dr(9) = Rdr.GetValue(7).ToString
            dr(10) = Rdr.GetValue(8).ToString
            dr(11) = Rdr.GetValue(9).ToString
            dr(12) = Rdr.GetValue(10).ToString
            dr(13) = Rdr.GetValue(14).ToString
            dr(14) = Rdr.GetValue(15).ToString

            dt.Rows.Add(dr)
            'Catch ex As Exception
            'End Try

        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub
#End Region
    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        'Add by Sithorn.....
        If Trim(txtClinicID.Text) = "" Then
            MessageBox.Show("Please input ClinicID", "Patient Test", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            txtClinicID.Focus()
            Exit Sub
        End If
        'If CDate(daTestDate.Text) >= CDate("04/10/2020") Then
        '    If CDate(Daarrival.Text) <= CDate("01/01/1900") Then
        '        MessageBox.Show("Please input Arrival Date", "Patient Test", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        '        Daarrival.Focus()
        '        Exit Sub
        '    End If
        'End If
        If CDate(daTestDate.Text) <= CDate("01/01/1900") Then
            MessageBox.Show("Please input Result Date", "Patient Test", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            daTestDate.Focus()
            Exit Sub
        End If
        If CDate(daTestDate.Text) >= CDate("04/10/2020") Then
            If CDate(Daarrival.Text) <= CDate("01/01/1900") Then
                MessageBox.Show("Please input Arrival Date", "Patient Test", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
                Daarrival.Focus()
                Exit Sub
            End If
            If CDate(Daarrival.Text) < CDate(daTestDate.Text) Then
                MessageBox.Show("Arrival Date must be greater than or equal Result Date ", "Patient Test", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
                Daarrival.Focus()
                Exit Sub
            End If
            If CDate(daTestDate.Text) < CDate(DaCollection.Text) Then
                MessageBox.Show("Collection Date must be less than or equal Result Date ", "Patient Test", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
                DaCollection.Focus()
                Exit Sub
            End If
        End If

        '...................
        If tsbDelete.Enabled Then
            If vbYes = MessageBox.Show("Are you sure do you want to edit?", "Edit Patient Test", MessageBoxButtons.YesNo, MessageBoxIcon.Information) Then
                EditMain()
            End If
        Else
            If vbYes = MessageBox.Show("Are you sure do you want to save ?", "Save Patient Test", MessageBoxButtons.YesNo, MessageBoxIcon.Information) Then
                Insert()
            End If
        End If

    End Sub
    Private Sub LoadAbdList2(ByVal IDParent As Byte, ByVal cboAbdominalList As ComboBox)
        '' Dim dalVwAbdominalList As New DALOI.OILLBL.VwAbdominalList2
        Dim DV As New DataView
        Dim DT As New DataTable

        'Add blank column to show for the first time
        ' DT = dalVwAbdominalList.SelectAll
        DT.Rows(0)("AbdominalList2") = ""
        DV = DT.DefaultView
        Select Case IDParent
            Case 2
                DV.RowFilter = "IDAbdominalList2=0  Or (IDAbdominalList2>=2 And IDAbdominalList2<=7)"
            Case 3
                DV.RowFilter = "IDAbdominalList2=0  Or IDAbdominalList2=2 or IDAbdominalList2=3 or IDAbdominalList2=5 or IDAbdominalList2=8"
            Case 4
                DV.RowFilter = "IDAbdominalList2=0  Or IDAbdominalList2=9 or IDAbdominalList2=10 or IDAbdominalList2=1"
        End Select
        DV.Sort = "SortOrder"
        cboAbdominalList.DisplayMember = "AbdominalList2"
        cboAbdominalList.ValueMember = "IDAbdominalList2"
        cboAbdominalList.DataSource = DV
    End Sub
    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        CheckPat()
    End Sub
    Private Sub daTestDate_Leave(sender As Object, e As EventArgs) Handles daTestDate.Leave
        If CDate(daTestDate.Text).Date > Date.Now.Date Then
            MsgBox("Invalid Test Date greater then Current Date " & Chr(13) & "Please try again!", MsgBoxStyle.Critical, "Check date")
            daTestDate.Focus()
            daTestDate.Text = "1/1/1900"
            Exit Sub
        End If
    End Sub
    Private Sub tscView_SelectedIndexChanged(sender As Object, e As EventArgs) Handles tscView.SelectedIndexChanged
        If tscView.SelectedIndex = 1 Then
            dt.Clear()
            Viewdata()
        Else
            GridControl1.DataSource = ""
            dt.Clear()
        End If
    End Sub
    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Clinic ID")
        If txtClinicID.Text = "" Then Exit Sub
        daTestDate.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date R-Result")
        Daarrival.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date Re-Arrival")
        txtAge.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Age")
        txtARTnum.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ART Num.")
        Select Case GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex")
            Case "Female"
                optSex.SelectedIndex = 0
            Case Else
                optSex.SelectedIndex = 1
        End Select
        txtCD4.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "CD4")
        txtCD4Per.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "CD%")
        ' txtHIVViralLoad.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Viral load-copy")
        ' txtHIVViralLoadLog.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Viral load-Log")
        Tid = GridView1.GetRowCellValue(hitInfo.RowHandle(), "TestID")
        XtraTabControl1.SelectedTabPageIndex = 1
        tsbDelete.Enabled = True
        Searchmain()
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        If MsgBox("Are you sure you want to delete this record?", MsgBoxStyle.YesNo + MsgBoxStyle.Question, "Delete Patient Test") = MsgBoxResult.Yes Then
            Dim DelCXR As New MySqlCommand("DELETE FROM tblpatientTestCXR WHERE TestID='" & Tid & "'", Cnndb)
            DelCXR.ExecuteNonQuery()
            Dim DelAbdominal As New MySqlCommand("DELETE FROM tblpatienttestAbdominal WHERE TestID='" & Tid & "'", Cnndb)
            DelAbdominal.ExecuteNonQuery()
            Dim CmdDelete As New MySqlCommand("DELETE FROM tblPatientTest WHERE testid = '" & Tid & "' ", Cnndb)
            CmdDelete.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblPatientTest','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MsgBox("Deleted Successful", MsgBoxStyle.Information, "Delete Patient Test")
            ClearAll()
            txtClinicID.Focus()
        End If
    End Sub

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub

    Private Sub txtClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtClinicID.EditValueChanged

    End Sub

    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub txtClinicID_MouseEnter(sender As Object, e As EventArgs) Handles txtClinicID.MouseEnter

    End Sub

    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

    End Sub

    Protected Overrides Function ProcessCmdKey(ByRef msg As Message, keyData As Keys) As Boolean
        Select Case keyData
            Case Keys.F1
                tsbSave_Click(tsbSave, New EventArgs())
            Case Keys.F2
                ClearAll()
            Case Keys.F3
                tsbDelete_Click(tsbDelete, New EventArgs())
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function

    Private Sub daTestDate_EditValueChanged(sender As Object, e As EventArgs) Handles daTestDate.EditValueChanged

    End Sub

    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            Dim se As Integer
            dt.Clear()

            If IsNumeric(tspClinicID.Text) Then
                tspClinicID.Text = Format(Val(tspClinicID.Text), "000000")
                Dim CmdSearch As New MySqlCommand("SELECT tblpatienttest.ClinicID AS ClinicID, tblaimain.Sex AS Sex, tblcimain.Sex AS SexChild,tblcimain.DaBirth AS childbirth, tblaimain.DaBirth AS DaBirth, tblpatienttest.Dat AS Dat,tblpatienttest.CD4 AS CD4, tblpatienttest.CD AS CD,tblpatienttest.HIVLoad AS HIVLoad,tblpatienttest.HIVLog AS HIVLog,tblpatienttest.TestID AS TestID,tblpatienttest.DaCollect AS DaCollect,tblaart.art,tblcart.ART,tblpatienttest.HCV,tblpatienttest.HCVlog,tblpatienttest.Daarrival,if(tblpatienttest.CD4Rapid=1,'True','False') CD4Rapid FROM tblpatienttest LEFT OUTER JOIN tblcimain ON tblcimain.ClinicID = tblpatienttest.ClinicID   LEFT OUTER JOIN tblaimain ON tblpatienttest.ClinicID = tblaimain.ClinicID LEFT OUTER JOIN tblaart on tblpatienttest.ClinicID=tblaart.ClinicID LEFT OUTER JOIN tblcart on tblpatienttest.ClinicID=tblcart.ClinicID where CAST(tblPatientTest.ClinicID as signed)='" & tspClinicID.Text & "' ORDER BY tblPatientTest.Dat desc", Cnndb)
                Rdr = CmdSearch.ExecuteReader
                While Rdr.Read
                    Try
                        Dim dr As DataRow = dt.NewRow()
                        If IsNumeric(Rdr.GetValue(0).ToString) Then
                            dr(0) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                            dr(1) = Rdr.GetValue(12).ToString.Trim
                            If Rdr.GetValue(1).ToString.Trim <> "" Then
                                se = Rdr.GetValue(1).ToString
                                dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(4).ToString), CDate(Rdr.GetValue(5).ToString))
                            Else
                                se = -1
                                dr(3) = 0
                            End If

                        Else
                            dr(0) = Rdr.GetValue(0).ToString.Trim
                            dr(1) = Rdr.GetValue(13).ToString.Trim
                            se = Rdr.GetValue(2).ToString
                            dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(5).ToString))
                        End If
                        Select Case CDec(se)
                            Case 0
                                dr(2) = "Female"
                            Case 1
                                dr(2) = "Male"
                            Case Else
                                dr(2) = ""
                        End Select
                        dr(4) = Format(CDate(Rdr.GetValue(16).ToString), "dd/MM/yyyy")
                        dr(5) = Format(CDate(Rdr.GetValue(5).ToString), "dd/MM/yyyy")
                        dr(6) = Format(CDate(Rdr.GetValue(11).ToString), "dd/MM/yyyy")
                        dr(7) = Rdr.GetValue(17).ToString
                        dr(8) = Rdr.GetValue(6).ToString
                        dr(9) = Rdr.GetValue(7).ToString
                        dr(10) = Rdr.GetValue(8).ToString
                        dr(11) = Rdr.GetValue(9).ToString
                        dr(12) = Rdr.GetValue(10).ToString
                        dr(13) = Rdr.GetValue(14).ToString
                        dr(14) = Rdr.GetValue(15).ToString
                        dt.Rows.Add(dr)
                    Catch ex As Exception
                    End Try
                End While
                Rdr.Close()
            Else
                Dim CmdSearch As New MySqlCommand("SELECT tblpatienttest.ClinicID AS ClinicID, tblaimain.Sex AS Sex, tblcimain.Sex AS SexChild,tblcimain.DaBirth AS childbirth, tblaimain.DaBirth AS DaBirth, tblpatienttest.Dat AS Dat,tblpatienttest.CD4 AS CD4, tblpatienttest.CD AS CD,tblpatienttest.HIVLoad AS HIVLoad,tblpatienttest.HIVLog AS HIVLog,tblpatienttest.TestID AS TestID,tblpatienttest.DaCollect AS DaCollect,tblaart.art,tblcart.ART,tblpatienttest.HCV,tblpatienttest.HCVlog,tblpatienttest.Daarrival,if(tblpatienttest.CD4Rapid=1,'True','False') CD4Rapid FROM tblpatienttest LEFT OUTER JOIN tblcimain ON tblcimain.ClinicID = tblpatienttest.ClinicID   LEFT OUTER JOIN tblaimain ON tblpatienttest.ClinicID = tblaimain.ClinicID LEFT OUTER JOIN tblaart on tblpatienttest.ClinicID=tblaart.ClinicID LEFT OUTER JOIN tblcart on tblpatienttest.ClinicID=tblcart.ClinicID where tblPatientTest.ClinicID ='" & tspClinicID.Text & "' ORDER BY tblPatientTest.Dat desc", Cnndb)
                Rdr = CmdSearch.ExecuteReader
                While Rdr.Read
                    Try
                        Dim dr As DataRow = dt.NewRow()
                        If IsNumeric(Rdr.GetValue(0).ToString) Then
                            dr(0) = Format(Val(Rdr.GetValue(0).ToString), "000000")
                            dr(1) = Rdr.GetValue(12).ToString.Trim
                            If Rdr.GetValue(1).ToString.Trim <> "" Then
                                se = Rdr.GetValue(1).ToString
                                dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(4).ToString), CDate(Rdr.GetValue(5).ToString))
                            Else
                                se = -1
                                dr(3) = 0
                            End If

                        Else
                            dr(0) = Rdr.GetValue(0).ToString.Trim
                            dr(1) = Rdr.GetValue(13).ToString.Trim
                            se = Rdr.GetValue(2).ToString
                            dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(5).ToString))
                        End If
                        Select Case CDec(se)
                            Case 0
                                dr(2) = "Female"
                            Case 1
                                dr(2) = "Male"
                            Case Else
                                dr(2) = ""
                        End Select
                        dr(4) = Format(CDate(Rdr.GetValue(16).ToString), "dd/MM/yyyy")
                        dr(5) = Format(CDate(Rdr.GetValue(5).ToString), "dd/MM/yyyy")
                        dr(6) = Format(CDate(Rdr.GetValue(11).ToString), "dd/MM/yyyy")
                        dr(7) = Rdr.GetValue(17).ToString
                        dr(8) = Rdr.GetValue(6).ToString
                        dr(9) = Rdr.GetValue(7).ToString
                        dr(10) = Rdr.GetValue(8).ToString
                        dr(11) = Rdr.GetValue(9).ToString
                        dr(12) = Rdr.GetValue(10).ToString
                        dr(13) = Rdr.GetValue(14).ToString
                        dr(14) = Rdr.GetValue(15).ToString
                        dt.Rows.Add(dr)
                    Catch ex As Exception
                    End Try
                End While
                Rdr.Close()
            End If
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub DaCollection_EditValueChanged(sender As Object, e As EventArgs) Handles DaCollection.EditValueChanged

    End Sub

    Private Sub daTestDate_KeyDown(sender As Object, e As KeyEventArgs) Handles daTestDate.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtCD4_EditValueChanged(sender As Object, e As EventArgs) Handles txtCD4.EditValueChanged

    End Sub

    Private Sub DaCollection_KeyDown(sender As Object, e As KeyEventArgs) Handles DaCollection.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtCD4Per_EditValueChanged(sender As Object, e As EventArgs) Handles txtCD4Per.EditValueChanged

    End Sub

    Private Sub txtCD4_KeyDown(sender As Object, e As KeyEventArgs) Handles txtCD4.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
        'AllowNumber(sender, e)
    End Sub

    Private Sub txtCD8_EditValueChanged(sender As Object, e As EventArgs) Handles txtCD8.EditValueChanged

    End Sub

    Private Sub txtCD4Per_KeyDown(sender As Object, e As KeyEventArgs) Handles txtCD4Per.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
        'AllowNumberAndDot(sender, e)
    End Sub

    Private Sub txtHIVViralLoad_EditValueChanged(sender As Object, e As EventArgs) Handles txtHIVViralLoad.EditValueChanged

    End Sub
    'Dim nonNumberEnter As Boolean = False
    'Private Sub AllowNumber(sender As Object, e As KeyEventArgs)
    '    nonNumberEnter = False
    '    If e.KeyCode < Keys.D0 Or e.KeyCode > Keys.D9 Then
    '        If e.KeyCode < Keys.NumPad0 Or e.KeyCode > Keys.NumPad9 Then
    '            If e.KeyCode <> Keys.Back Then
    '                nonNumberEnter = True
    '            End If
    '        End If
    '    End If
    '    If Control.ModifierKeys = Keys.Shift Then
    '        nonNumberEnter = True
    '    End If
    'End Sub
    'Private Sub AllowNumberAndDot(sender As Object, e As KeyEventArgs)
    '    'MessageBox.Show("KeyCode: " & e.KeyCode)
    '    nonNumberEnter = False
    '    If e.KeyCode < Keys.D0 Or e.KeyCode > Keys.D9 Then
    '        If e.KeyCode < Keys.NumPad0 Or e.KeyCode > Keys.NumPad9 Then
    '            If e.KeyCode <> Keys.Back And e.KeyValue <> 190 And e.KeyValue <> 110 Then
    '                nonNumberEnter = True
    '            End If
    '        End If
    '    End If
    '    If Control.ModifierKeys = Keys.Shift Then
    '        nonNumberEnter = True
    '    End If
    'End Sub
    Private Sub txtCD8_KeyDown(sender As Object, e As KeyEventArgs) Handles txtCD8.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
        'AllowNumber(sender, e)
    End Sub

    Private Sub txtHCHc_EditValueChanged(sender As Object, e As EventArgs) Handles txtHCHc.EditValueChanged

    End Sub

    Private Sub txtHIVViralLoad_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHIVViralLoad.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
        'AllowNumber(sender, e)
    End Sub

    Private Sub txtHIVViralLoadLog_EditValueChanged(sender As Object, e As EventArgs) Handles txtHIVViralLoadLog.EditValueChanged

    End Sub

    Private Sub txtHCHc_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHCHc.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
        'AllowNumber(sender, e)
    End Sub

    Private Sub txtHCVlog_EditValueChanged(sender As Object, e As EventArgs) Handles txtHCVlog.EditValueChanged

    End Sub

    Private Sub txtHIVViralLoadLog_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHIVViralLoadLog.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
        'AllowNumberAndDot(sender, e)
    End Sub

    Private Sub optHIVAb_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optHIVAb.SelectedIndexChanged

    End Sub

    Private Sub txtHCVlog_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHCVlog.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
        'AllowNumberAndDot(sender, e)
    End Sub

    Private Sub optHBsAg_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optHBsAg.SelectedIndexChanged

    End Sub

    Private Sub optHIVAb_KeyDown(sender As Object, e As KeyEventArgs) Handles optHIVAb.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub optHBeAg_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optHBeAg.SelectedIndexChanged

    End Sub

    Private Sub optHBsAg_KeyDown(sender As Object, e As KeyEventArgs) Handles optHBsAg.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub optHBcAb_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optHBcAb.SelectedIndexChanged

    End Sub

    Private Sub optHBeAg_KeyDown(sender As Object, e As KeyEventArgs) Handles optHBeAg.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub optHCVAb_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optHCVAb.SelectedIndexChanged

    End Sub

    Private Sub optHBcAb_KeyDown(sender As Object, e As KeyEventArgs) Handles optHBcAb.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub optHCVPR_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optHCVPR.SelectedIndexChanged

    End Sub

    Private Sub optHCVAb_KeyDown(sender As Object, e As KeyEventArgs) Handles optHCVAb.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub optTPHA_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optTPHA.SelectedIndexChanged

    End Sub

    Private Sub optHCVPR_KeyDown(sender As Object, e As KeyEventArgs) Handles optHCVPR.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub optRPR_SelectedIndexChanged(sender As Object, e As EventArgs) Handles optRPR.SelectedIndexChanged

    End Sub

    Private Sub optTPHA_KeyDown(sender As Object, e As KeyEventArgs) Handles optTPHA.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtRPRTitre_EditValueChanged(sender As Object, e As EventArgs) Handles txtRPRTitre.EditValueChanged

    End Sub

    Private Sub optRPR_KeyDown(sender As Object, e As KeyEventArgs) Handles optRPR.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tscView_Click(sender As Object, e As EventArgs) Handles tscView.Click

    End Sub

    Private Sub Daarrival_EditValueChanged(sender As Object, e As EventArgs) Handles Daarrival.EditValueChanged

    End Sub

    Private Sub txtRPRTitre_KeyDown(sender As Object, e As KeyEventArgs) Handles txtRPRTitre.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub Daarrival_KeyDown(sender As Object, e As KeyEventArgs) Handles Daarrival.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtCD8_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtCD8.KeyPress
        'If nonNumberEnter = True Then
        '    e.Handled = True
        'End If
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtHCVlog_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtHCVlog.KeyPress
        'If nonNumberEnter = True Then
        '    e.Handled = True
        'End If
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtHCVlog.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtHCHc_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtHCHc.KeyPress
        'If nonNumberEnter = True Then
        '    e.Handled = True
        'End If
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtHIVViralLoadLog_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtHIVViralLoadLog.KeyPress
        'If nonNumberEnter = True Then
        '    e.Handled = True
        'End If
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtHIVViralLoadLog.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtHIVViralLoad_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtHIVViralLoad.KeyPress
        'If nonNumberEnter = True Then
        '    e.Handled = True
        'End If
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtCD4Per_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtCD4Per.KeyPress
        'If nonNumberEnter = True Then
        '    e.Handled = True
        'End If
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtCD4Per.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtCD4_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtCD4.KeyPress
        'If nonNumberEnter = True Then
        '    e.Handled = True
        'End If
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub
End Class