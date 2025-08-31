Imports MySql.Data.MySqlClient
Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Public Class frmChildVisit
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim Tid, id As String
    Dim Dob, Vdate, DateApp, fvdate, daart As Date
    Dim Vid, ApID As String
    Dim Stage As Integer
    Dim dtCause As DataTable
    Dim causedeath() As String = {}


    Private Sub frmChildVisit_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Clear()
        loadData()
        XtraTabControl1.SelectedTabPage = XtraTabPage1
    End Sub
    Private Sub XtraTabControl1_Click(sender As Object, e As EventArgs) Handles XtraTabControl1.Click
        If XtraTabControl1.SelectedTabPageIndex = 1 Then
            txtClinicID.Focus()
        End If
    End Sub
#Region "Function"
    Private Sub Clear()
        Stage = -1
        txtClinicID.Text = ""
        txtClinicID.Enabled = True
        XtraTabControl1.SelectedTabPage = XtraTabPage2
        txtClinicID.Focus()
        txtART.Text = ""
        txtART.Enabled = True
        DaVisit.Text = "01/01/1900"
        RdSchedule.SelectedIndex = -1
        txtAge.Text = ""
        RdSex.SelectedIndex = -1
        txtTemp.Text = ""
        txtPulse.Text = ""
        txtResp.Text = ""
        txtBlood1.Text = ""
        txtBlood2.Text = ""
        txtWeight.Text = ""
        txtHeight.Text = ""
        txtBSA.Text = ""
        RdMalnutrition.SelectedIndex = -1
        RdWH.SelectedIndex = -1
        RdPTB.SelectedIndex = -1
        RdWlost.SelectedIndex = -1
        RdCough.SelectedIndex = -1
        RdFever.SelectedIndex = -1
        RdEnlarg.SelectedIndex = -1
        RdHospital.SelectedIndex = -1
        RdMissed.SelectedIndex = -1
        ' txtMday.Text = ""
        RdM3.SelectedIndex = -1
        txtM3.Text = ""
        RdFunction.SelectedIndex = -1
        RdWHO.SelectedIndex = -1
        RdEligible.SelectedIndex = -1
        RdTreatfail.SelectedIndex = -1
        RdTypeFail.SelectedIndex = -1
        RdTB.SelectedIndex = -1
        RdResultTB.SelectedIndex = -1
        RdTBtreat.SelectedIndex = -1
        DaTBtreat.Text = "01/01/1900"
        txtCD4.Text = ""
        DaTest.Text = "01/01/1900"
        ChkTestARV.Checked = False
        RdResultTest.SelectedIndex = -1
        RdCD4.SelectedIndex = -1
        RdHivViral.SelectedIndex = -1
        ChkGrAG.Checked = False
        RdResultCrAG.SelectedIndex = -1
        RdViralDetech.SelectedIndex = -1
        RdRefer.SelectedIndex = -1
        CboARVdrug1.SelectedIndex = -1
        RdARVdrugStatus1.SelectedIndex = -1
        RdARVdrugStatus2.SelectedIndex = -1
        RdARVdrugStatus3.SelectedIndex = -1
        RdARVdrugStatus4.SelectedIndex = -1
        RdARVdrugStatus5.SelectedIndex = -1
        RdARVdrugStatus6.SelectedIndex = -1

        CboOIdrug1.SelectedIndex = -1
        CboOIdrug2.SelectedIndex = -1
        CboOIdrug3.SelectedIndex = -1
        CboOIdrug4.SelectedIndex = -1
        CboOIdrug5.SelectedIndex = -1
        'sithor.......
        CboTPTdrug1.SelectedIndex = -1
        CboTPTdrug2.SelectedIndex = -1
        CboTPTdrug3.SelectedIndex = -1
        CboTPTdrug4.SelectedIndex = -1
        RdTPTdrugStatus1.SelectedIndex = -1
        RdTPTdrugStatus2.SelectedIndex = -1
        RdTPTdrugStatus3.SelectedIndex = -1
        RdTPTdrugStatus4.SelectedIndex = -1
        RdTPT.SelectedIndex = -1
        '.............
        RdOIdrugStatus1.SelectedIndex = -1
        RdOIdrugStatus2.SelectedIndex = -1
        RdOIdrugStatus3.SelectedIndex = -1
        RdOIdrugStatus4.SelectedIndex = -1
        RdOIdrugStatus5.SelectedIndex = -1
        RdTBdrugStatus1.SelectedIndex = -1
        RdTBdrugStatus2.SelectedIndex = -1
        RdTBdrugStatus3.SelectedIndex = -1
        '    CboOIdrug1.SelectedIndex = -1
        RdPlaceDead.SelectedIndex = -1
        RdPatientStatus.SelectedIndex = -1
        RdCauseDeath.SelectedIndex = -1 'add by sithorn
        tsbDelete.Enabled = False
        tsbDelete1.Enabled = False
        Tid = ""
        txtClinicID.Enabled = True
        cboTBdrug1.SelectedIndex = -1
        '  RdStage.SelectedIndex = -1
        Vid = ""
        ApID = ""
        id = ""
        DaAppoint.Text = "01/01/1900"
        CboDoctore.Enabled = False
        CboMeetTime.Enabled = False
        CboMeetTime.SelectedIndex = -1
        CboDoctore.SelectedIndex = -1
    End Sub
    Private Sub BSA()
        txtBSA.Text = FormatNumber(Math.Sqrt(Val(txtWeight.Text) * Val(txtHeight.Text) / 3600), 2)
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
    Private Sub loadData()
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
        dt.Columns.Add("Vid", GetType(String))
        GridControl1.DataSource = dt
        GridView1.Columns("Vid").Visible = False

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
            ElseIf CDec(Rdr.GetValue(2).ToString) = 1 Then
                CboOIdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboOIdrug5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            ElseIf CDec(Rdr.GetValue(2).ToString) = 2 Then
                cboTBdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            ElseIf CDec(Rdr.GetValue(2).ToString) = 4 Then 'Sithorn
                CboTPTdrug1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboTPTdrug2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboTPTdrug3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboTPTdrug4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            End If
        End While
        Rdr.Close()

        Dim CmdART As New MySqlCommand("Select * from tblartsite where status ='1' order by SiteName", Cnndb)
        Rdr = CmdART.ExecuteReader
        While Rdr.Read
            CboTransferOut.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        CboTransferOut.Properties.Items.Add("Move to other site")
        CboTransferOut.Properties.Items.Add("Move to other country")
        Dim CmdDoct As New MySqlCommand("Select * from tbldoctor where Status='1' ", Cnndb)
        Rdr = CmdDoct.ExecuteReader
        While Rdr.Read
            CboDoctore.Properties.Items.Add(Rdr.GetValue(0).ToString & "/ " & Rdr.GetValue(1).ToString.Trim)
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
        'LueCauseDeath.Properties.ShowHeader = False
    End Sub
    Private Sub CheckPat()
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
                Clear()
                Exit Sub
            End While
            Rdr.Close()
        End If
        If txtART.Enabled = True Then
            Rdr = New MySqlCommand("Select * from tblcart where ClinicID='" & txtClinicID.Text & "'", Cnndb).ExecuteReader
            While Rdr.Read
                txtART.Text = Rdr.GetValue(1).ToString.Trim
                txtART.Enabled = False
                '  rdat = CDate(Rdr.GetValue(2).ToString)
                RdEligible.SelectedIndex = 0
            End While
            Rdr.Close()
        End If
        checkSeche() 'sithorn
        Dim CmdSearchAI As New MySqlCommand("Select * from tblcimain where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        While Rdr.Read
            txtAge.Text = CType(DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(1).ToString)), String)
            RdSex.SelectedIndex = Rdr.GetValue(4).ToString
            txtClinicID.Enabled = False
            If Rdr.GetValue(15).ToString.Trim <> "" Then
                txtART.Text = Rdr.GetValue(15).ToString
                txtART.Enabled = False
                RdEligible.SelectedIndex = 0
            End If
            id = Rdr.GetValue(2).ToString
            Dob = CDate(Rdr.GetValue(3).ToString)
            fvdate = CDate(Rdr.GetValue(1).ToString)
            If CDate(DaVisit.Text) <= CDate("01/01/1990") Then
                DaVisit.EditValue = CDate(Rdr.GetValue(1).ToString)
                RdSchedule.SelectedIndex = 0
            End If
        End While
        Rdr.Close()
        If id <> "" Then
            Rdr = New MySqlCommand("Select * from tblcart where ClinicID='" & id & "'", Cnndb).ExecuteReader
            While Rdr.Read
                txtART.Text = Rdr.GetValue(1).ToString.Trim
                daart = Rdr.GetValue(2).ToString
                Rdr.Close()
                '  txtART.Enabled = False
                '  rdat = CDate(Rdr.GetValue(2).ToString)

                RdEligible.SelectedIndex = 0
                Exit While
            End While
            Rdr.Close()
        End If






        'checkSeche() 'B Phana

        '   DaVisit.Focus()
        If txtClinicID.Enabled = True And txtClinicID.Text <> "" Then
            MessageBox.Show("No Patient is found with this Clinic ID. (Maybe no initial visit)", "Check In Child initial visit", MessageBoxButtons.OK, MessageBoxIcon.Error)
            txtClinicID.Text = ""
            txtClinicID.Focus()
            Clear()
        End If
    End Sub
    Private Sub CheckTest()
        Dim Cmd As New MySqlCommand("SELECT cd, TestID, Dat,CD4 FROM tblPatientTest WHERE ClinicID = '" & txtClinicID.Text & "' AND Dat <= '" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "' AND (CD4 <> '" & "" & "')  or (CD <> '" & "" & "' and ClinicID = '" & txtClinicID.Text & "' AND Dat <= '" & Format(CDate(DaVisit.EditValue), "yyyy/MM/dd") & "') ORDER BY Dat DESC limit 1", ConnectionDB.Cnndb)
        Rdr = Cmd.ExecuteReader
        While Rdr.Read
            txtCD.Text = Trim(Rdr.GetValue(0).ToString)
            txtCD4.Text = Rdr.GetValue(3).ToString.Trim
            Tid = Trim(Rdr.GetValue(1).ToString)
            DaTest.Text = CDate(Rdr.GetValue(2).ToString).Date
        End While
        Rdr.Close()
    End Sub
    Private Sub checkSeche()
        Dim CmdSearch As MySqlCommand = New MySqlCommand("Select * from tblcVmain where clinicID='" & txtClinicID.Text & "' ORDER BY DatVisit  DESC Limit 1", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Vdate = Rdr.GetValue(2).ToString
            DaVisit.EditValue = Vdate 'change from Text to EditValue
            txtWeight.Text = Trim(Rdr.GetValue(8).ToString)
            txtHeight.Text = Trim(Rdr.GetValue(9).ToString)
            txtPulse.Text = Trim(Rdr.GetValue(5).ToString)
            txtResp.Text = Trim(Rdr.GetValue(6).ToString)
            Dim blood() As String = Split(Rdr.GetValue(7).ToString, "/")
            Try
                txtBlood1.Text = Trim(blood(0))
                txtBlood2.Text = Trim(blood(1))
            Catch ex As Exception
            End Try
            txtTemp.Text = Trim(Rdr.GetValue(4).ToString)
            DateApp = Rdr.GetValue(43).ToString
            '    a = Trim(Rdr.GetValue(43).ToString)
            If Val(Rdr.GetValue(26).ToString) = 0 Then
                RdEligible.SelectedIndex = 0
            End If
            RdWHO.SelectedIndex = Rdr.GetValue(25).ToString
            Stage = Rdr.GetValue(25).ToString
            If Rdr.GetValue(34).ToString.Trim = "True" And CDec(Rdr.GetValue(35).ToString) = -1 Then
                ChkTestARV.Checked = True
            End If
            If Val(Rdr.GetValue(40).ToString) <> 2 Then
                RdViralDetech.SelectedIndex = Rdr.GetValue(40).ToString
            End If
            Vid = Trim(Rdr.GetValue(44).ToString)
            ApID = Vid

        End While
        Rdr.Close()


    End Sub
    Private Sub CheckPs()
        If CDate(DaVisit.EditValue).Date = CDate("1/1/1900") Then Exit Sub

        If CDate(DaVisit.EditValue).Date > Date.Now.Date Then
            MessageBox.Show("Invalid Visit Date greater then Current Date " & Chr(13) & "Please try again!", "Check date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaVisit.Focus()
            DaVisit.EditValue = Now.Date
            Exit Sub
        End If
        If CDate(DaVisit.EditValue).Date < fvdate.Date Then
            MessageBox.Show("Invalid Date Child initial Visit greater then Date Child Visit", "Check date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaVisit.Focus()
            DaVisit.EditValue = Now.Date
            Exit Sub
        End If
        txtAge.Text = DateDiff(DateInterval.Year, CDate(Dob), CDate(DaVisit.EditValue))
        If Vdate.Date <= CDate(DaVisit.EditValue).Date Then

            If DateApp.Date <> #12:00:00 AM# Then
                If DateApp = CDate(DaVisit.EditValue).Date Then
                    RdSchedule.SelectedIndex = 2
                ElseIf DateApp < CDate(DaVisit.EditValue).Date Then
                    RdSchedule.SelectedIndex = 3
                ElseIf DateApp > CDate(DaVisit.EditValue).Date Then
                    RdSchedule.SelectedIndex = 1
                End If
            End If
            If b <> True Then
                CheckTest()
            End If
            SearchDrug()
        Else
                MessageBox.Show("Invalid Last Date Greater then Date First Visit " & Chr(13) & "Please try again!", "Check date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            txtClinicID.Focus()
            '  Clear()
        End If
    End Sub
    Private Sub Save()
        If Trim(txtClinicID.Text) = "" Then Exit Sub
        If CDate(DaVisit.Text) >= CDate(DaAppoint.Text) And RdPatientStatus.SelectedIndex = -1 Then
            MsgBox("Next Appointment Date must be greater than Visit Date", MsgBoxStyle.Critical, "Check Appointment")
            Exit Sub
        End If
        If RdPatientStatus.SelectedIndex = 0 And DateDiff(DateInterval.Day, CDate(DaVisit.Text), CDate(DaOutcome.Text)) < frmMain.ca And txtART.Text.Trim <> "" Or RdPatientStatus.SelectedIndex = 0 And DateDiff(DateInterval.Day, CDate(DaVisit.Text), CDate(DaOutcome.Text)) < frmMain.co And txtART.Text.Trim = "" Or CDate(DaOutcome.Text).Date > Now.Date Then
            MessageBox.Show("Invalid date of patient lost!", "Lost Date", MessageBoxButtons.OK, MessageBoxIcon.Error)
            DaOutcome.Text = "01/01/1900"
            Exit Sub
        End If
        If txtART.Text.Trim = "" And RdPatientStatus.SelectedIndex = 3 Then MessageBox.Show("Patient PreART can not select transfer out.", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        'add form cause of death by sithorn......
        'If RdPatientStatus.SelectedIndex = 1 And DaOutcome.EditValue Is "01/01/1900" Then MessageBox.Show("Please Input the date of death", "Save Visit", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If CDate(DaVisit.EditValue) >= CDate("09/05/2023") Then
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
            If MessageBox.Show("Do you want to Save.....", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Vid = txtClinicID.Text & Format(CDate(DaVisit.Text), "ddMMyy")
                Dim k1 As String = txtBlood1.Text & "/" & txtBlood2.Text
                Dim CmdMain As New MySqlCommand("Insert into tblcvmain values('" & txtClinicID.Text & "','" & txtART.Text.Trim & "','" & Format(CDate(DaVisit.EditValue), "yyyy-MM-dd") & "','" & RdSchedule.SelectedIndex & "','" & Val(txtTemp.Text) & "','" & Val(txtPulse.Text) & "','" & Val(txtResp.Text) & "','" & k1 & "','" & Val(txtWeight.Text) & "','" & Val(txtHeight.Text) & "'," &
                                        "'" & RdMalnutrition.SelectedIndex & "','" & RdWH.SelectedIndex & "','" & RdPTB.SelectedIndex & "','" & RdWlost.SelectedIndex & "','" & RdCough.SelectedIndex & "','" & RdFever.SelectedIndex & "','" & RdEnlarg.SelectedIndex & "','" & RdHospital.SelectedIndex & "','" & Val(txtHday.Text) & "','" & txtHcause.Text & "','" & RdMissed.SelectedIndex & "','" & Val(txtMday.Text) & "','" & RdM3.SelectedIndex & "','" & Val(txtM3.Text) & "','" & RdFunction.SelectedIndex & "','" & RdWHO.SelectedIndex & "'," &
                                        "'" & RdEligible.SelectedIndex & "','" & RdTreatfail.SelectedIndex & "','" & RdTypeFail.SelectedIndex & "','" & RdTB.SelectedIndex & "','" & RdResultTB.SelectedIndex & "','" & RdTBtreat.SelectedIndex & "','" & Format(CDate(DaTBtreat.EditValue), "yyyy-MM-dd") & "','" & Tid & "','" & ChkTestARV.Checked & "','" & RdResultTest.SelectedIndex & "','" & RdCD4.SelectedIndex & "','" & RdHivViral.SelectedIndex & "','" & ChkGrAG.Checked & "','" & RdResultCrAG.SelectedIndex & "'," &
                                        "'" & RdViralDetech.SelectedIndex & "','" & RdRefer.SelectedIndex & "','" & txtReferOther.Text.Trim & "','" & Format(CDate(DaAppoint.EditValue), "yyyy-MM-dd") & "','" & Vid & "','" & RdTPT.SelectedIndex & "')", Cnndb)
                CmdMain.ExecuteNonQuery()
                Select Case RdPatientStatus.SelectedIndex
            'lost
                    Case 0
                        'death
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                    Case 1
                        'neg
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()

                    Case 2
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                'transfer
                    Case 3
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaVisit.EditValue), "yyyy-MM-dd") & "','" & CboTransferOut.Text & "','" & Vid & "')", Cnndb)
                        CmdStatus.ExecuteNonQuery()
                End Select

                If Trim(CboARVdrug1.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug1.Text & "','" & CboARVDose1.Text & "','" & txtARVquan1.Text & "','" & CboARVRFreq1.Text & "','" & CboARVform1.Text & "','" & RdARVdrugStatus1.SelectedIndex & "','" & Format(CDate(DaARV1.EditValue), "yyyy/MM/dd") & "','" & CboARVReason1.Text & "','" & CboARVRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug2.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug2.Text & "','" & CboARVDose2.Text & "','" & txtARVquan2.Text & "','" & CboARVRFreq2.Text & "','" & CboARVform2.Text & "','" & RdARVdrugStatus2.SelectedIndex & "','" & Format(CDate(DaARV2.EditValue), "yyyy/MM/dd") & "','" & CboARVReason2.Text & "','" & CboARVRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug3.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug3.Text & "','" & CboARVDose3.Text & "','" & txtARVquan3.Text & "','" & CboARVRFreq3.Text & "','" & CboARVform3.Text & "','" & RdARVdrugStatus3.SelectedIndex & "','" & Format(CDate(DaARV3.EditValue), "yyyy/MM/dd") & "','" & CboARVReason3.Text & "','" & CboARVRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug4.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug4.Text & "','" & CboARVDose4.Text & "','" & txtARVquan4.Text & "','" & CboARVRFreq4.Text & "','" & CboARVform4.Text & "','" & RdARVdrugStatus4.SelectedIndex & "','" & Format(CDate(DaARV4.EditValue), "yyyy/MM/dd") & "','" & CboARVReason4.Text & "','" & CboARVRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug5.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug5.Text & "','" & CboARVDose5.Text & "','" & txtARVquan5.Text & "','" & CboARVRFreq5.Text & "','" & CboARVform5.Text & "','" & RdARVdrugStatus5.SelectedIndex & "','" & Format(CDate(DaARV5.EditValue), "yyyy/MM/dd") & "','" & CboARVReason5.Text & "','" & CboARVRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug6.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug6.Text & "','" & CboARVDose6.Text & "','" & txtARVquan6.Text & "','" & CboARVRFreq6.Text & "','" & CboARVform6.Text & "','" & RdARVdrugStatus6.SelectedIndex & "','" & Format(CDate(DaARV6.EditValue), "yyyy/MM/dd") & "','" & CboARVReason6.Text & "','" & CboARVRemark6.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug1.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug1.Text & "','" & CboOIdose1.Text & "','" & txtOIQuan1.Text & "','" & CboOIFreq1.Text & "','" & CboOIForm1.Text & "','" & RdOIdrugStatus1.SelectedIndex & "','" & Format(CDate(DaOI1.EditValue), "yyyy/MM/dd") & "','" & CboOIReason1.Text & "','" & CboOIRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug2.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug2.Text & "','" & CboOIdose2.Text & "','" & txtOIQuan2.Text & "','" & CboOIFreq2.Text & "','" & CboOIForm2.Text & "','" & RdOIdrugStatus2.SelectedIndex & "','" & Format(CDate(DaOI2.EditValue), "yyyy/MM/dd") & "','" & CboOIReason2.Text & "','" & CboOIRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug3.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug3.Text & "','" & CboOIdose3.Text & "','" & txtOIQuan3.Text & "','" & CboOIFreq3.Text & "','" & CboOIForm3.Text & "','" & RdOIdrugStatus3.SelectedIndex & "','" & Format(CDate(DaOI3.EditValue), "yyyy/MM/dd") & "','" & CboOIReason3.Text & "','" & CboOIRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug4.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug4.Text & "','" & CboOIdose4.Text & "','" & txtOIQuan4.Text & "','" & CboOIFreq4.Text & "','" & CboOIForm4.Text & "','" & RdOIdrugStatus4.SelectedIndex & "','" & Format(CDate(DaOI4.EditValue), "yyyy/MM/dd") & "','" & CboOIReason4.Text & "','" & CboOIRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug5.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug5.Text & "','" & CboOIdose5.Text & "','" & txtOIQuan5.Text & "','" & CboOIFreq5.Text & "','" & CboOIForm5.Text & "','" & RdOIdrugStatus5.SelectedIndex & "','" & Format(CDate(DaOI5.EditValue), "yyyy/MM/dd") & "','" & CboOIReason5.Text & "','" & CboOIRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                'sithorn.....
                If CboTPTdrug1.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug1.Text & "','" & CboTPTdose1.Text & "','" & Val(txtTPTQuan1.Text) & "','" & CboTPTFreq1.Text & "','" & CboTPTForm1.Text & "','" & RdTPTdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTPT1.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason1.Text & "','" & CboTPTRemark1.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug2.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug2.Text & "','" & CboTPTdose2.Text & "','" & Val(txtTPTQuan2.Text) & "','" & CboTPTFreq2.Text & "','" & CboTPTForm2.Text & "','" & RdTPTdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTPT2.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason2.Text & "','" & CboTPTRemark2.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug3.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug3.Text & "','" & CboTPTdose3.Text & "','" & Val(txtTPTQuan3.Text) & "','" & CboTPTFreq3.Text & "','" & CboTPTForm3.Text & "','" & RdTPTdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTPT3.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason3.Text & "','" & CboTPTRemark3.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug4.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug4.Text & "','" & CboTPTdose4.Text & "','" & Val(txtTPTQuan4.Text) & "','" & CboTPTFreq4.Text & "','" & CboTPTForm4.Text & "','" & RdTPTdrugStatus4.SelectedIndex & "','" & Format(CDate(DaTPT4.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason4.Text & "','" & CboTPTRemark4.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                '............
                If Trim(cboTBdrug1.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblcvtbdrug values('" & cboTBdrug1.Text & "','" & CboTBdose1.Text & "','" & txtTBQuan1.Text & "','" & CboTBFreq1.Text & "','" & CboTBForm1.Text & "','" & RdTBdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTB1.EditValue), "yyyy/MM/dd") & "','" & CboTBReason1.Text & "','" & CboTBRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug2.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblcvtbdrug values('" & cboTBdrug2.Text & "','" & CboTBdose2.Text & "','" & txtTBQuan2.Text & "','" & CboTBFreq2.Text & "','" & CboTBForm2.Text & "','" & RdTBdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTB2.EditValue), "yyyy/MM/dd") & "','" & CboTBReason2.Text & "','" & CboTBRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug3.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblcvtbdrug values('" & cboTBdrug3.Text & "','" & CboTBdose3.Text & "','" & txtTBQuan3.Text & "','" & CboTBFreq3.Text & "','" & CboTBForm3.Text & "','" & RdTBdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTB3.EditValue), "yyyy/MM/dd") & "','" & CboTBReason3.Text & "','" & CboTBRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                Try
                    If txtART.Enabled = True And txtART.Text.Trim <> "" Then
                        If id = "" Then
                            daart = CDate(DaVisit.EditValue)
                        End If
                        Dim CmdSaveArt As New MySqlCommand("insert into tblcart values('" & txtClinicID.Text & "','" & txtART.Text & "','" & Format(daart, "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                        CmdSaveArt.ExecuteNonQuery()
                    End If
                Catch ex As Exception
                End Try
                'Sithorn140824...................
                Select Case RdSchedule.SelectedIndex
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
                '   Dim x1 As String = CboDoctore.Text.Substring(0, CboDoctore.Text.IndexOf("/"))
                Try
                    Dim CmdApp As New MySqlCommand("Insert into tblAppointment values('" & Vid & "','" & CboDoctore.Text.Substring(0, CboDoctore.Text.IndexOf("/")) & "','" & CboMeetTime.SelectedIndex & "','0')", Cnndb)
                    CmdApp.ExecuteNonQuery()
                Catch ex1 As Exception
                End Try
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblcvmain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MessageBox.Show("Saving is completed...", "Save....", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Clear()
            End If

        Else
            If MessageBox.Show("Are you sure do you want to Edit ?", "Edit.....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim k1 As String = txtBlood1.Text & "/" & txtBlood2.Text
                Dim CmdMain As New MySqlCommand("Update tblcvmain set DatVisit='" & Format(CDate(DaVisit.EditValue), "yyyy-MM-dd") & "',TypeVisit='" & RdSchedule.SelectedIndex & "',Temp='" & Val(txtTemp.Text) & "',Pulse='" & Val(txtPulse.Text) & "',Resp='" & Val(txtResp.Text) & "',Blood='" & k1 & "',Weight='" & Val(txtWeight.Text) & "',Height='" & Val(txtHeight.Text) & "'," &
                                        "Malnutrition='" & RdMalnutrition.SelectedIndex & "',WH='" & RdWH.SelectedIndex & "',PTB='" & RdPTB.SelectedIndex & "',Wlost='" & RdWlost.SelectedIndex & "',Cough='" & RdCough.SelectedIndex & "',Fever='" & RdFever.SelectedIndex & "',Enlarg='" & RdEnlarg.SelectedIndex & "',Hospital='" & RdHospital.SelectedIndex & "',NumDay='" & Val(txtHday.Text) & "',CauseHospital='" & txtHcause.Text & "',Miss1='" & RdMissed.SelectedIndex & "',Miss1Time='" & Val(txtMday.Text) & "',Miss3='" & RdM3.SelectedIndex & "',Miss3Time='" & Val(txtM3.Text) & "',`Function`='" & RdFunction.SelectedIndex & "',WHO='" & RdWHO.SelectedIndex & "'," &
                                        "Eligible='" & RdEligible.SelectedIndex & "',Treatfail='" & RdTreatfail.SelectedIndex & "',TypeFail='" & RdTypeFail.SelectedIndex & "',TB='" & RdTB.SelectedIndex & "',TypeTB='" & RdResultTB.SelectedIndex & "',TBtreat='" & RdTBtreat.SelectedIndex & "',DaTBtreat='" & Format(CDate(DaTBtreat.EditValue), "yyyy-MM-dd") & "',TestHIV='" & ChkTestARV.Checked & "',ResultHIV='" & RdResultTest.SelectedIndex & "',ReCD4='" & RdCD4.SelectedIndex & "',ReVL='" & RdHivViral.SelectedIndex & "',CrAG='" & ChkGrAG.Checked & "',CrAGResult='" & RdResultCrAG.SelectedIndex & "'," &
                                        "VLDetectable='" & RdViralDetech.SelectedIndex & "',Referred='" & RdRefer.SelectedIndex & "',OReferred='" & txtReferOther.Text.Trim & "',DaApp='" & Format(CDate(DaAppoint.EditValue), "yyyy-MM-dd") & "',TPTout='" & RdTPT.SelectedIndex & "' where Vid='" & Vid & "'", Cnndb)
                CmdMain.ExecuteNonQuery()

                Dim CmdApp As New MySqlCommand("Update tblAppointment set Doctore='" & CboDoctore.Text.Substring(0, CboDoctore.Text.IndexOf("/")) & "',Time='" & CboMeetTime.SelectedIndex & "' where Vid='" & Vid & "' ", Cnndb)
                CmdApp.ExecuteNonQuery()

                Dim CmdDel As New MySqlCommand("Delete from tblcvpatientstatus  where Vid='" & Vid & "'", Cnndb)
                CmdDel.ExecuteNonQuery()
                Select Case RdPatientStatus.SelectedIndex
            'lost
                    Case 0
                        'death
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                    Case 1
                        'neg
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()

                    Case 2
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaOutcome.EditValue), "yyyy-MM-dd") & "','" & strCause & "','" & Vid & "')", Cnndb) 'txtOutDeath.Text
                        CmdStatus.ExecuteNonQuery()
                'transfer
                    Case 3
                        Dim CmdStatus As New MySqlCommand("Insert into tblcvpatientstatus values('" & txtClinicID.Text & "','" & RdPatientStatus.SelectedIndex & "','" & RdPlaceDead.SelectedIndex & "','" & txtOtherDead.Text & "','" & Format(CDate(DaVisit.EditValue), "yyyy-MM-dd") & "','" & CboTransferOut.Text & "','" & Vid & "')", Cnndb)
                        CmdStatus.ExecuteNonQuery()
                End Select
                Dim CmdDelARV As New MySqlCommand("Delete from tblcvarvdrug  where Vid='" & Vid & "'", Cnndb)
                CmdDelARV.ExecuteNonQuery()
                If Trim(CboARVdrug1.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug1.Text & "','" & CboARVDose1.Text & "','" & txtARVquan1.Text & "','" & CboARVRFreq1.Text & "','" & CboARVform1.Text & "','" & RdARVdrugStatus1.SelectedIndex & "','" & Format(CDate(DaARV1.EditValue), "yyyy/MM/dd") & "','" & CboARVReason1.Text & "','" & CboARVRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug2.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug2.Text & "','" & CboARVDose2.Text & "','" & txtARVquan2.Text & "','" & CboARVRFreq2.Text & "','" & CboARVform2.Text & "','" & RdARVdrugStatus2.SelectedIndex & "','" & Format(CDate(DaARV2.EditValue), "yyyy/MM/dd") & "','" & CboARVReason2.Text & "','" & CboARVRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug3.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug3.Text & "','" & CboARVDose3.Text & "','" & txtARVquan3.Text & "','" & CboARVRFreq3.Text & "','" & CboARVform3.Text & "','" & RdARVdrugStatus3.SelectedIndex & "','" & Format(CDate(DaARV3.EditValue), "yyyy/MM/dd") & "','" & CboARVReason3.Text & "','" & CboARVRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug4.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug4.Text & "','" & CboARVDose4.Text & "','" & txtARVquan4.Text & "','" & CboARVRFreq4.Text & "','" & CboARVform4.Text & "','" & RdARVdrugStatus4.SelectedIndex & "','" & Format(CDate(DaARV4.EditValue), "yyyy/MM/dd") & "','" & CboARVReason4.Text & "','" & CboARVRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug5.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug5.Text & "','" & CboARVDose5.Text & "','" & txtARVquan5.Text & "','" & CboARVRFreq5.Text & "','" & CboARVform5.Text & "','" & RdARVdrugStatus5.SelectedIndex & "','" & Format(CDate(DaARV5.EditValue), "yyyy/MM/dd") & "','" & CboARVReason5.Text & "','" & CboARVRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                If Trim(CboARVdrug6.Text) <> "" Then
                    Dim CmdInsertARV As MySqlCommand = New MySqlCommand("insert into tblcvarvdrug values('" & CboARVdrug6.Text & "','" & CboARVDose6.Text & "','" & txtARVquan6.Text & "','" & CboARVRFreq6.Text & "','" & CboARVform6.Text & "','" & RdARVdrugStatus6.SelectedIndex & "','" & Format(CDate(DaARV6.EditValue), "yyyy/MM/dd") & "','" & CboARVReason6.Text & "','" & CboARVRemark6.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertARV.ExecuteNonQuery()
                End If
                Dim CmdDeloi As New MySqlCommand("Delete from tblcvoidrug  where Vid='" & Vid & "'", Cnndb)
                CmdDeloi.ExecuteNonQuery()
                If Trim(CboOIdrug1.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug1.Text & "','" & CboOIdose1.Text & "','" & txtOIQuan1.Text & "','" & CboOIFreq1.Text & "','" & CboOIForm1.Text & "','" & RdOIdrugStatus1.SelectedIndex & "','" & Format(CDate(DaOI1.EditValue), "yyyy/MM/dd") & "','" & CboOIReason1.Text & "','" & CboOIRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug2.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug2.Text & "','" & CboOIdose2.Text & "','" & txtOIQuan2.Text & "','" & CboOIFreq2.Text & "','" & CboOIForm2.Text & "','" & RdOIdrugStatus2.SelectedIndex & "','" & Format(CDate(DaOI2.EditValue), "yyyy/MM/dd") & "','" & CboOIReason2.Text & "','" & CboOIRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug3.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug3.Text & "','" & CboOIdose3.Text & "','" & txtOIQuan3.Text & "','" & CboOIFreq3.Text & "','" & CboOIForm3.Text & "','" & RdOIdrugStatus3.SelectedIndex & "','" & Format(CDate(DaOI3.EditValue), "yyyy/MM/dd") & "','" & CboOIReason3.Text & "','" & CboOIRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug4.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug4.Text & "','" & CboOIdose4.Text & "','" & txtOIQuan4.Text & "','" & CboOIFreq4.Text & "','" & CboOIForm4.Text & "','" & RdOIdrugStatus4.SelectedIndex & "','" & Format(CDate(DaOI4.EditValue), "yyyy/MM/dd") & "','" & CboOIReason4.Text & "','" & CboOIRemark4.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                If Trim(CboOIdrug5.Text) <> "" Then
                    Dim CmdInserOI As MySqlCommand = New MySqlCommand("insert into tblcvoidrug values('" & CboOIdrug5.Text & "','" & CboOIdose5.Text & "','" & txtOIQuan5.Text & "','" & CboOIFreq5.Text & "','" & CboOIForm5.Text & "','" & RdOIdrugStatus5.SelectedIndex & "','" & Format(CDate(DaOI5.EditValue), "yyyy/MM/dd") & "','" & CboOIReason5.Text & "','" & CboOIRemark5.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInserOI.ExecuteNonQuery()
                End If
                Dim CmdDeltb As New MySqlCommand("Delete from tblcvtbdrug  where Vid='" & Vid & "'", Cnndb)
                CmdDeltb.ExecuteNonQuery()
                If Trim(cboTBdrug1.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblcvtbdrug values('" & cboTBdrug1.Text & "','" & CboTBdose1.Text & "','" & txtTBQuan1.Text & "','" & CboTBFreq1.Text & "','" & CboTBForm1.Text & "','" & RdTBdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTB1.EditValue), "yyyy/MM/dd") & "','" & CboTBReason1.Text & "','" & CboTBRemark1.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug2.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblcvtbdrug values('" & cboTBdrug2.Text & "','" & CboTBdose2.Text & "','" & txtTBQuan2.Text & "','" & CboTBFreq2.Text & "','" & CboTBForm2.Text & "','" & RdTBdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTB2.EditValue), "yyyy/MM/dd") & "','" & CboTBReason2.Text & "','" & CboTBRemark2.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                If Trim(cboTBdrug3.Text) <> "" Then
                    Dim CmdInsertTB As MySqlCommand = New MySqlCommand("insert into tblcvtbdrug values('" & cboTBdrug3.Text & "','" & CboTBdose3.Text & "','" & txtTBQuan3.Text & "','" & CboTBFreq3.Text & "','" & CboTBForm3.Text & "','" & RdTBdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTB3.EditValue), "yyyy/MM/dd") & "','" & CboTBReason3.Text & "','" & CboTBRemark3.Text & "','" & Vid & "')", ConnectionDB.Cnndb)
                    CmdInsertTB.ExecuteNonQuery()
                End If
                'sithorn....
                Dim CmdTP As New MySqlCommand("Delete from tblcvtptdrug where Vid='" & Vid & "'", Cnndb)
                CmdTP.ExecuteNonQuery()
                If CboTPTdrug1.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug1.Text & "','" & CboTPTdose1.Text & "','" & Val(txtTPTQuan1.Text) & "','" & CboTPTFreq1.Text & "','" & CboTPTForm1.Text & "','" & RdTPTdrugStatus1.SelectedIndex & "','" & Format(CDate(DaTPT1.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason1.Text & "','" & CboTPTRemark1.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug2.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug2.Text & "','" & CboTPTdose2.Text & "','" & Val(txtTPTQuan2.Text) & "','" & CboTPTFreq2.Text & "','" & CboTPTForm2.Text & "','" & RdTPTdrugStatus2.SelectedIndex & "','" & Format(CDate(DaTPT2.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason2.Text & "','" & CboTPTRemark2.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug3.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug3.Text & "','" & CboTPTdose3.Text & "','" & Val(txtTPTQuan3.Text) & "','" & CboTPTFreq3.Text & "','" & CboTPTForm3.Text & "','" & RdTPTdrugStatus3.SelectedIndex & "','" & Format(CDate(DaTPT3.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason3.Text & "','" & CboTPTRemark3.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                If CboTPTdrug4.Text.Trim <> "" Then
                    Dim CmdInsertTPT As MySqlCommand = New MySqlCommand("insert into tblcvtptdrug values('" & CboTPTdrug4.Text & "','" & CboTPTdose4.Text & "','" & Val(txtTPTQuan4.Text) & "','" & CboTPTFreq4.Text & "','" & CboTPTForm4.Text & "','" & RdTPTdrugStatus4.SelectedIndex & "','" & Format(CDate(DaTPT4.EditValue), "yyyy/MM/dd") & "','" & CboTPTReason4.Text & "','" & CboTPTRemark4.Text & "','" & Vid & "')", Cnndb)
                    CmdInsertTPT.ExecuteNonQuery()
                End If
                '...........
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblcvmain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MessageBox.Show("Edit is completed...", "Edit....", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Clear()
            End If
        End If

        'Dim cmdControl As New SqlCommand("Insert into tblControl values('" & txtPatNumber.Text & "','" & "AV" & "','Save','" & Format(Now, "MM/dd/yyyy HH:mm:ss") & "')", ConnectionDB.Cnndb)
        'cmdControl.ExecuteNonQuery()

    End Sub
    Private Sub ViewData()
        Dim i As Double
        Dim CmdSearch As New MySqlCommand("SELECT     tblcimain.ClinicID, tblcimain.Dabirth, tblcimain.Sex, tblcvmain.DatVisit, tblcvmain.TypeVisit, tblcvmain.WHO, tblcvmain.ARTnum, tblcvpatientstatus.Status, tblcvmain.DaApp, tblcvmain.Vid FROM         tblcvpatientstatus RIGHT OUTER JOIN tblcvmain ON tblcvpatientstatus.Vid = tblcvmain.Vid LEFT OUTER JOIN tblcimain ON tblcvmain.ClinicID = tblcimain.ClinicID ORDER BY tblcimain.ClinicID,tblcvmain.DatVisit", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Rdr.GetValue(0).ToString
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
            Select Case Rdr.GetValue(7).ToString.Trim
                Case 0
                    dr(8) = "Lost"
                Case 1
                    dr(8) = "Death"
                Case 2
                    dr(8) = "HIV Negative"
                Case 3
                    dr(8) = "Transfer Out"
            End Select
            dr(9) = Rdr.GetValue(8).ToString
            dr(10) = Rdr.GetValue(9).ToString
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub
    Private Sub Search()
        Dim CmdSearch As New MySqlCommand("Select * from tblcvmain where vid='" & Vid & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            txtWeight.Focus()
            RdSchedule.SelectedIndex = Rdr.GetValue(3).ToString
            txtTemp.Text = Rdr.GetValue(4).ToString
            txtPulse.Text = Rdr.GetValue(5).ToString
            txtResp.Text = Rdr.GetValue(6).ToString
            Try
                Dim blood() As String = Split(Rdr.GetValue(7).ToString, "/")
                txtBlood1.Text = Trim(blood(0))
                txtBlood2.Text = Trim(blood(1))
            Catch ex As Exception
            End Try
            txtWeight.Text = Rdr.GetValue(8).ToString
            txtHeight.Text = Rdr.GetValue(9).ToString
            RdMalnutrition.SelectedIndex = Rdr.GetValue(10).ToString
            RdWH.SelectedIndex = Rdr.GetValue(11).ToString
            RdPTB.SelectedIndex = Rdr.GetValue(12).ToString
            RdWlost.SelectedIndex = Rdr.GetValue(13).ToString
            RdCough.SelectedIndex = Rdr.GetValue(14).ToString
            RdFever.SelectedIndex = Rdr.GetValue(15).ToString
            RdEnlarg.SelectedIndex = Rdr.GetValue(16).ToString
            RdHospital.SelectedIndex = Rdr.GetValue(17).ToString
            txtHday.Text = Rdr.GetValue(18).ToString
            txtHcause.Text = Rdr.GetValue(19).ToString
            RdMissed.SelectedIndex = Rdr.GetValue(20).ToString
            txtMday.Text = Rdr.GetValue(21).ToString
            RdM3.SelectedIndex = Rdr.GetValue(22).ToString
            txtM3.Text = Rdr.GetValue(23).ToString
            RdFunction.SelectedIndex = Rdr.GetValue(24).ToString
            RdWHO.SelectedIndex = Rdr.GetValue(25).ToString
            RdEligible.SelectedIndex = Rdr.GetValue(26).ToString
            RdTreatfail.SelectedIndex = Rdr.GetValue(27).ToString
            RdTypeFail.SelectedIndex = Rdr.GetValue(28).ToString
            RdTB.SelectedIndex = Rdr.GetValue(29).ToString
            RdResultTB.SelectedIndex = Rdr.GetValue(30).ToString
            RdTBtreat.SelectedIndex = Rdr.GetValue(31).ToString
            DaTBtreat.Text = CDate(Rdr.GetValue(32).ToString).Date
            Tid = Rdr.GetValue(33).ToString
            Try
                ChkTestARV.Checked = Rdr.GetValue(34).ToString
            Catch ex As Exception
            End Try
            RdResultTest.SelectedIndex = Rdr.GetValue(35).ToString
            RdCD4.SelectedIndex = Rdr.GetValue(36).ToString
            RdHivViral.SelectedIndex = Rdr.GetValue(37).ToString
            ChkGrAG.Checked = Rdr.GetValue(38).ToString
            RdResultCrAG.SelectedIndex = Rdr.GetValue(39).ToString
            RdViralDetech.SelectedIndex = Rdr.GetValue(40).ToString
            RdRefer.SelectedIndex = Rdr.GetValue(41).ToString
            txtReferOther.Text = Rdr.GetValue(42).ToString
            RdTPT.SelectedIndex = Rdr.GetValue(45).ToString 'sithorn
        End While
        Rdr.Close()
        Dim CmdTest As New MySqlCommand("Select * from tblpatienttest where testid='" & Tid & "'", Cnndb)
        Rdr = CmdTest.ExecuteReader
        While Rdr.Read
            txtCD.Text = Rdr.GetValue(4).ToString
            txtCD4.Text = Rdr.GetValue(3).ToString
            DaTest.Text = CDate(Rdr.GetValue(2).ToString).Date
        End While
        Rdr.Close()
        Dim CmdStatus As New MySqlCommand("Select * from tblcvpatientstatus where vid='" & Vid & "'", Cnndb)
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
                'txtOutDeath.Text = Rdr.GetValue(5).ToString
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

        Dim CmdARV As New MySqlCommand("Select * from tblcvarvdrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
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

        Dim CmdOI As New MySqlCommand("Select * from tblcvoidrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
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
                DaOI1.Text = CDate(DaVisit.EditValue).Date
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
                DaOI2.Text = CDate(DaVisit.EditValue).Date
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
                DaOI3.Text = CDate(DaVisit.EditValue).Date
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
                DaOI4.Text = CDate(DaVisit.EditValue).Date
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
                DaOI5.Text = CDate(DaVisit.EditValue).Date
                CboOIReason5.Text = Trim(Rdr.GetValue(7).ToString)
                CboOIRemark5.Text = Trim(Rdr.GetValue(8).ToString)
            End If
        End While
        Rdr.Close()
        'sihtorn.......
        Dim CmdPtp As New MySqlCommand("Select * from tblcvtptdrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
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
        '...............
        Dim CmdTB As New MySqlCommand("Select * from tblcvtbdrug where vid='" & Vid & "' and Status IN ('" & ia(0) & "','" & ia(1) & "','" & ia(2) & "')", Cnndb)
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
                DaTB1.Text = CDate(DaVisit.EditValue).Date
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
                DaTB2.Text = CDate(DaVisit.EditValue).Date
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
                DaTB3.Text = CDate(DaVisit.EditValue).Date
                CboTBReason3.Text = Trim(Rdr.GetValue(7).ToString)
                CboTBRemark3.Text = Trim(Rdr.GetValue(8).ToString)
            End If
        End While
        Rdr.Close()
    End Sub
    Private Sub Del()
        If MessageBox.Show("Are you sure do you want to delete", "Delete...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = vbYes Then
            Dim CmdDeltb As New MySqlCommand("Delete from tblcvtbdrug  where Vid='" & Vid & "'", Cnndb)
            CmdDeltb.ExecuteNonQuery()
            Dim CmdDel As New MySqlCommand("Delete from tblcvpatientstatus  where Vid='" & Vid & "'", Cnndb)
            CmdDel.ExecuteNonQuery()
            Dim CmdDelARV As New MySqlCommand("Delete from tblcvarvdrug  where Vid='" & Vid & "'", Cnndb)
            CmdDelARV.ExecuteNonQuery()
            Dim CmdDeloi As New MySqlCommand("Delete from tblcvoidrug  where Vid='" & Vid & "'", Cnndb)
            CmdDeloi.ExecuteNonQuery()
            'sithorn....
            Dim CmdDeltpt As New MySqlCommand("Delete from tblcvtptdrug  where Vid='" & Vid & "'", Cnndb)
            CmdDeltpt.ExecuteNonQuery()
            '...........
            Dim CmdApp As New MySqlCommand("Delete from tblAppointment where Vid='" & Vid & "'", Cnndb)
            CmdApp.ExecuteNonQuery()
            Dim CmdMain As New MySqlCommand("delete from tblcvmain  where Vid='" & Vid & "'", Cnndb)
            CmdMain.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblcvmain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Deleted...", "Delete....", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub
#End Region

    Private Sub txtWeight_EditValueChanged(sender As Object, e As EventArgs) Handles txtWeight.EditValueChanged
        BSA()
    End Sub

    Private Sub txtHeiht_EditValueChanged(sender As Object, e As EventArgs) Handles txtHeight.EditValueChanged
        BSA()
    End Sub
    Private Sub RdRefer_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdRefer.SelectedIndexChanged
        txtReferOther.Enabled = False
        txtReferOther.Text = ""
        If RdRefer.SelectedIndex = 3 Then
            txtReferOther.Enabled = True
        End If
    End Sub

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

    Private Sub tsbNew1_Click(sender As Object, e As EventArgs) Handles tsbNew1.Click
        Clear()
    End Sub

    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
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

    Private Sub RdPlaceDead_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdPlaceDead.SelectedIndexChanged
        txtOtherDead.Enabled = False
        txtOtherDead.Text = ""
        If RdPlaceDead.SelectedIndex = 2 Then
            txtOtherDead.Enabled = True
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
    Private Sub txtART_Leave(sender As Object, e As EventArgs) Handles txtART.Leave
        If Len(txtART.Text.Trim) < 6 And IsNumeric(txtART.Text) And Val(txtART.Text) <> 0 Then
            txtART.Text = "P" & frmMain.Art & Format(Val(txtART.Text), "00000")
        End If
    End Sub

    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        tsbDelete.Enabled = True
        tsbDelete1.Enabled = True
        txtClinicID.Enabled = False
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        If txtClinicID.Text = "" Then Exit Sub
        XtraTabControl1.SelectedTabPageIndex = 1
        DaVisit.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Date Visit")
        txtAge.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Age")
        If GridView1.GetRowCellValue(hitInfo.RowHandle(), "Sex") = "Female" Then
            RdSex.SelectedIndex = 0
        Else
            RdSex.SelectedIndex = 1
        End If
        txtART.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ART Number")
        DaAppoint.Text = CDate(GridView1.GetRowCellValue(hitInfo.RowHandle(), "Appointment-Date")).Date
        If CDate(DaAppoint.Text) > CDate("01/01/2000") Then
            CboDoctore.Enabled = True
            CboMeetTime.Enabled = True
        End If
        Vid = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Vid")

        Search()
    End Sub

    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub
    Private Sub RdTB_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTB.SelectedIndexChanged
        RdResultTB.Enabled = False
        RdResultTB.SelectedIndex = -1
        RdTBtreat.Enabled = False
        RdTBtreat.SelectedIndex = -1
        DaTBtreat.Enabled = False
        DaTBtreat.Text = "01/01/1900"
        If RdTB.SelectedIndex <> -1 Then
            RdResultTB.Enabled = True
            RdTBtreat.Enabled = True
            DaTBtreat.Enabled = True
        End If
    End Sub

    Private Sub DaVisit_EditValueChanged(sender As Object, e As EventArgs) Handles DaVisit.EditValueChanged

    End Sub

    Private Sub txtART_KeyDown(sender As Object, e As KeyEventArgs) Handles txtART.KeyDown
        If e.KeyCode = Keys.Enter Then
            If Len(txtART.Text.Trim) < 6 And IsNumeric(txtART.Text) And Len(txtART.Text) <> 0 Then
                txtART.Text = "P" & frmMain.Art & Format(Val(txtART.Text), "00000")
            End If
            SendKeys.Send(Chr(9))
        End If
    End Sub
    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            '  CheckPat()
        End If
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub

    Private Sub tsbSave1_Click(sender As Object, e As EventArgs) Handles tsbSave1.Click
        Save()
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

    Private Sub ChkTestARV_CheckedChanged(sender As Object, e As EventArgs) Handles ChkTestARV.CheckedChanged
        If ChkTestARV.Checked Then
            RdResultTest.Enabled = True
        Else
            RdResultTest.SelectedIndex = -1
            RdResultTest.Enabled = False
            '    RdEligible.SelectedIndex = 1
        End If
    End Sub

    Private Sub RdWHO_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdWHO.SelectedIndexChanged
        If Stage >= Val(RdWHO.SelectedIndex) Then
            RdWHO.SelectedIndex = Stage
        End If
    End Sub

    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        If tsbDelete.Enabled = False Then
            If Len(txtClinicID.Text) <= 7 And Val(txtClinicID.Text) <> 0 Then
                txtClinicID.Text = "P" & Format(Val(txtClinicID.Text), "000000")
                CheckPat()
            End If
        End If
    End Sub

    Private Sub DaARV1_EditValueChanged(sender As Object, e As EventArgs) Handles DaARV1.EditValueChanged

    End Sub

    Private Sub tscView_Click(sender As Object, e As EventArgs) Handles tscView.Click

    End Sub

    Private Sub DaAppoint_EditValueChanged(sender As Object, e As EventArgs) Handles DaAppoint.EditValueChanged

    End Sub

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub

    Private Sub txtClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtClinicID.EditValueChanged

    End Sub

    Private Sub RdHospital_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdHospital.SelectedIndexChanged
        txtHday.Text = ""
        txtHcause.Text = ""
        If RdHospital.SelectedIndex = 1 Then
            txtHday.Enabled = True
            txtHcause.Enabled = True
        Else
            txtHday.Enabled = False
            txtHcause.Enabled = False
        End If
    End Sub

    Private Sub RdMissed_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdMissed.SelectedIndexChanged

        If RdMissed.SelectedIndex = 1 Then
            txtMday.Enabled = True
        Else
            txtMday.Enabled = False
            txtMday.Text = ""
        End If
    End Sub

    Private Sub RdResultTest_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdResultTest.SelectedIndexChanged
        If RdResultTest.SelectedIndex = 0 Then
            RdEligible.SelectedIndex = 0
        Else
            RdEligible.SelectedIndex = 1
        End If
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Del()
    End Sub

    Private Sub tsbDelete1_Click(sender As Object, e As EventArgs) Handles tsbDelete1.Click
        Del()
    End Sub

    Private Sub ToolStrip2_ItemClicked(sender As Object, e As ToolStripItemClickedEventArgs) Handles ToolStrip2.ItemClicked

    End Sub

    Private Sub RdM3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdM3.SelectedIndexChanged

        If RdM3.SelectedIndex = 1 Then
            txtM3.Enabled = True
        Else
            txtM3.Enabled = False
            txtM3.Text = ""
        End If
    End Sub

    Private Sub DaVisit_KeyDown(sender As Object, e As KeyEventArgs) Handles DaVisit.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaVisit_Leave(sender As Object, e As EventArgs) Handles DaVisit.Leave
        CheckPs()
    End Sub

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

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

    Private Sub tspART_Click(sender As Object, e As EventArgs) Handles tspART.Click

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

    Private Sub SimpleButton1_Click(sender As Object, e As EventArgs) Handles SimpleButton1.Click
        RdPatientStatus.SelectedIndex = -1
    End Sub

    Private Sub DaAppoint_Leave(sender As Object, e As EventArgs) Handles DaAppoint.Leave
        If CDate(DaAppoint.Text) <= CDate(DaVisit.Text) Then
            MessageBox.Show("Invalid, Appointment date (less then or equal visit)", "Appoinment .... ", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            DaAppoint.Text = "01/01/1900"
            Exit Sub
        End If
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
        'Dim CmdHo As New SqlCommand("Select * from tblholiday where Hdate ='" & Format(daNextAppointDate.Value, "MM/dd/yyyy") & "'", ConnectionDB.Cnndb)
        'Rdr = CmdHo.ExecuteReader
        'While Rdr.Read
        '    If vbNo = MessageBox.Show("Are you Sure !" & Chr(13) & "The appoinment date is " & Rdr.GetValue(1).ToString, "Appoinment......", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation) Then
        '        daNextAppointDate.Value = "1/1/1900"
        '        Rdr.Close()
        '        Exit Sub
        '    End If
        'End While
        'Rdr.Close()
        'If txtART.Text.Trim = "" Then
        '    If CDate(DaAppoint.Text) >= DateAdd(DateInterval.Month, frmMain.co, CDate(DaVisit.Text)) Then
        '        MessageBox.Show("Invalid Date Appointment", "Check Date Appointment", MessageBoxButtons.OK, MessageBoxIcon.Error)
        '        DaAppoint.Text = CDate("01/01/1900")
        '    End If
        'Else
        '    If CDate(DaAppoint.Text) >= DateAdd(DateInterval.Month, frmMain.ca, CDate(DaVisit.Text)) Then
        '        MessageBox.Show("Invalid Date Appointment", "Check Date Appointment", MessageBoxButtons.OK, MessageBoxIcon.Error)
        '        DaAppoint.Text = CDate("01/01/1900")
        '    End If
        'End If
        If CDate(DaAppoint.Text) > CDate("01/01/2000") Then
            CboDoctore.Enabled = True
            CboMeetTime.Enabled = True
        End If

    End Sub

    Private Sub DaAppoint_KeyDown(sender As Object, e As KeyEventArgs) Handles DaAppoint.KeyDown
        If e.KeyCode = Keys.Enter Then
            DaAppoint_Leave(DaAppoint, New EventArgs)
        End If
    End Sub

    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Double
            If IsNumeric(tspClinicID.Text) Then
                tspClinicID.Text = "P" & Format(Val(tspClinicID.Text), "000000")
                If tspClinicID.Text = "P000000" Then
                    MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                    tspClinicID.Text = ""
                    Exit Sub
                End If
            End If
            Dim CmdSearch As New MySqlCommand("SELECT     tblcimain.ClinicID, tblcimain.Dabirth, tblcimain.Sex, tblcvmain.DatVisit, tblcvmain.TypeVisit, tblcvmain.WHO, tblcvmain.ARTnum, tblcvpatientstatus.Status, tblcvmain.DaApp, tblcvmain.Vid FROM         tblcvpatientstatus RIGHT OUTER JOIN tblcvmain ON tblcvpatientstatus.Vid = tblcvmain.Vid LEFT OUTER JOIN tblcimain ON tblcvmain.ClinicID = tblcimain.ClinicID where tblcimain.ClinicID='" & tspClinicID.Text & "' ORDER BY tblcimain.ClinicID,tblcvmain.DatVisit", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Rdr.GetValue(0).ToString
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
                Select Case Rdr.GetValue(7).ToString.Trim
                    Case 0
                        dr(8) = "Lost"
                    Case 1
                        dr(8) = "Death"
                    Case 2
                        dr(8) = "HIV Negative"
                    Case 3
                        dr(8) = "Transfer Out"
                End Select
                dr(9) = Rdr.GetValue(8).ToString
                dr(10) = Rdr.GetValue(9).ToString
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub tspART_KeyDown(sender As Object, e As KeyEventArgs) Handles tspART.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Double
            If IsNumeric(tspART.Text) Then
                tspART.Text = "P" & tspART.Text.Trim
            End If
            Dim CmdSearch As New MySqlCommand("SELECT     tblcimain.ClinicID, tblcimain.Dabirth, tblcimain.Sex, tblcvmain.DatVisit, tblcvmain.TypeVisit, tblcvmain.WHO, tblcvmain.ARTnum, tblcvpatientstatus.Status, tblcvmain.DaApp, tblcvmain.Vid FROM         tblcvpatientstatus RIGHT OUTER JOIN tblcvmain ON tblcvpatientstatus.Vid = tblcvmain.Vid LEFT OUTER JOIN tblcimain ON tblcvmain.ClinicID = tblcimain.ClinicID where tblcvmain.ARTnum='" & tspART.Text & "' ORDER BY tblcimain.ClinicID,tblcvmain.DatVisit", Cnndb)
            Rdr = CmdSearch.ExecuteReader
                While Rdr.Read
                    i = i + 1
                    Dim dr As DataRow = dt.NewRow()
                    dr(0) = i
                    dr(1) = Rdr.GetValue(0).ToString
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
                Select Case Rdr.GetValue(7).ToString.Trim
                        Case 0
                            dr(8) = "Lost"
                        Case 1
                            dr(8) = "Death"
                        Case 2
                            dr(8) = "HIV Negative"
                        Case 3
                            dr(8) = "Transfer Out"
                    End Select
                    dr(9) = Rdr.GetValue(8).ToString
                    dr(10) = Rdr.GetValue(9).ToString
                    dt.Rows.Add(dr)
                End While
                Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    'Sithorn.............................
    Private Sub RdCauseDeath_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdCauseDeath.SelectedIndexChanged
        If RdCauseDeath.SelectedIndex <> -1 Then
            LueCauseDeath.Enabled = True
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
            'LueCauseDeath.Properties.DataSource = dtCause
            'LueCauseDeath.Properties.DisplayMember = "Cause"
            'LueCauseDeath.Properties.ValueMember = "ID"

            'LueCauseDeath.Properties.ShowHeader = False
        End If
    End Sub

    Private Sub LueCauseDeath_EditValueChanged(sender As Object, e As EventArgs) Handles LueCauseDeath.EditValueChanged
        If CInt(LueCauseDeath.EditValue) = 99 Then
            txtOutDeath.Enabled = True

        Else
            txtOutDeath.Enabled = False
            txtOutDeath.Text = ""
        End If
    End Sub

    Private Sub CboTPTdrug1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboTPTdrug1.SelectedIndexChanged
        Drug(CboTPTdrug1, CboTPTdrug2, CboTPTdose1, txtTPTQuan1, CboTPTFreq1, CboTPTForm1, RdTPTdrugStatus1, DaTPT1, CboTPTReason1, CboTPTRemark1)
    End Sub

    Private Sub CboTPTdrug2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboTPTdrug2.SelectedIndexChanged
        Drug(CboTPTdrug2, CboTPTdrug3, CboTPTdose2, txtTPTQuan2, CboTPTFreq2, CboTPTForm2, RdTPTdrugStatus2, DaTPT2, CboTPTReason2, CboTPTRemark2)
    End Sub

    Private Sub CboTPTdrug3_SelectedValueChanged(sender As Object, e As EventArgs) Handles CboTPTdrug3.SelectedValueChanged
        Drug(CboTPTdrug3, CboTPTdrug4, CboTPTdose3, txtTPTQuan3, CboTPTFreq3, CboTPTForm3, RdTPTdrugStatus3, DaTPT3, CboTPTReason3, CboTPTRemark3)
    End Sub

    Private Sub CboTPTdrug4_SelectedValueChanged(sender As Object, e As EventArgs) Handles CboTPTdrug4.SelectedValueChanged
        Drug(CboTPTdrug4, CboTPTdrug4, CboTPTdose4, txtTPTQuan4, CboTPTFreq4, CboTPTForm4, RdTPTdrugStatus4, DaTPT4, CboTPTReason4, CboTPTRemark4)
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
    '.............................
End Class