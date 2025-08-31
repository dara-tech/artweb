Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Public Class frmExInitial
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim ag As Boolean
    Private Sub frmExInitial_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Clear()
        LoadData()
    End Sub
#Region "Function"
    Private Sub Clear()
        txtClinicID.Text = ""
        txtClinicID.Enabled = True
        txtClinicID.Focus()
        DaFirstVisit.Text = "01/01/1900"
        DaBirth.Text = "01/01/1900"
        txtAge.Text = ""
        RdSex.SelectedIndex = -1
        RdAddGuardian.SelectedIndex = -1
        txtGroup.Text = ""
        txtHouse.Text = ""
        txtStreet.Text = ""
        cbovillage.SelectedIndex = -1
        CboCommune.SelectedIndex = -1
        CboDistrict.SelectedIndex = -1
        CboProvince.SelectedIndex = -1
        txtNameContact.Text = ""
        txtAddress.Text = ""
        txtPhone.Text = ""
        txtFange.Text = ""
        txtMage.Text = ""
        CboFHIVstatus.SelectedIndex = -1
        cboFstatus.SelectedIndex = -1
        cboFstatus.Text = ""
        txtMclinicID.Text = ""
        txtMart.Text = ""
        CboMHIVstatus.SelectedIndex = -1
        CboNameHospital.Text = ""
        CboMstatus.SelectedIndex = -1
        txtPlacedelivery.Text = ""
        CboPlacedelivery.Text = ""
        txtPMTCT.Text = ""
        DaDelivery.Text = "01/01/1900"
        RdDeliveryStatus.SelectedIndex = -1
        txtLbaby.Text = ""
        txtWbaby.Text = ""
        RdKnowHIV.SelectedIndex = -1
        RdReceivedDrug.SelectedIndex = -1
        RdSyrup.SelectedIndex = -1
        RdCotrim.SelectedIndex = -1
        RdOffin.SelectedIndex = -1
        CboSiteName.SelectedIndex = -1
        RdBayTest.SelectedIndex = -1
        tsbDelete.Enabled = False
        txtMLastvl.Text = ""
        DaMLastvl.Text = "01/01/1900"
    End Sub
    Private Sub LoadData()
        Dim Cmdadd As New MySqlCommand("select * from tblProvince ORDER BY Pid", Cnndb)
        Rdr = Cmdadd.ExecuteReader
        While Rdr.Read
            CboProvince.Properties.Items.Add(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'sithorn...............
        CboSiteName.Properties.Items.Add("")
        CboNameHospital.Properties.Items.Add("")
        Dim CmdART As New MySqlCommand("Select * from tblartsite where status ='1' order by sid", Cnndb)
        Rdr = CmdART.ExecuteReader
        While Rdr.Read
            CboSiteName.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
            CboNameHospital.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        '.....................
        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Date First", GetType(Date))
        dt.Columns.Add("Age(M)", GetType(Int32))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Delivery Status", GetType(String))
        dt.Columns.Add("Syrup", GetType(String))
        dt.Columns.Add("Transfer-In", GetType(Boolean))
        GridControl1.DataSource = dt
    End Sub
    Private Sub Save()
        If Trim(txtClinicID.Text) = "" Then MessageBox.Show("Please input Clinc ID !", "Save.....", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If CDate(DaFirstVisit.Text) < CDate("01/01/2000") Then MessageBox.Show("Please input Date First Visit", "Required.......", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        If RdSex.SelectedIndex = -1 Then MessageBox.Show("Please Select Patient Sex !", "Save Exposed infant Initial Visit", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If txtAge.Text.Trim = "" Then MessageBox.Show("Please Input Exposed Infant Age !", "Age...", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        'Sithorn........................
        If CDate(DaFirstVisit.Text) < CDate(DaBirth.Text) Then MessageBox.Show("Invalid Register Date", "Alert.......", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        'If txtFange.Text.Trim = "" Then MessageBox.Show("Please Input Father Age !", "Age...", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If txtMage.Text.Trim = "" Then MessageBox.Show("Please Input Mother Age !", "Age...", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If CboMHIVstatus.SelectedIndex = 0 Then
            If txtMclinicID.Text.Trim = "" Then MessageBox.Show("Please Input Mother ClinicID !", "ClinicID", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
            If txtMart.Text.Trim = "" Then MessageBox.Show("Please Input Mother ART Number !", "ART Number", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        End If
        If txtLbaby.Text.Trim = "" Then MessageBox.Show("Please Input Length of baby !", "Baby...", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If txtWbaby.Text.Trim = "" Then MessageBox.Show("Please Input Weight of baby !", "Baby...", MessageBoxButtons.OK, MessageBoxIcon.Error) : Exit Sub
        If CDate(DaBirth.Text) <> CDate(DaDelivery.Text) Then MessageBox.Show("Date of Birth should be equal to Date of Delivery", "Alert.......", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        Dim offin As Int32
        If RdOffin.EditValue Is Nothing Then
            offin = -1
        Else
            offin = CInt(RdOffin.EditValue)
        End If
        'MessageBox.Show("Test Age: " & Val(txtFange.Text))
        '................................
        'Try
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Do you want to Save ?", "Save Exposed Infant", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim CmdSave As New MySqlCommand("Insert into tbleimain values('" & txtClinicID.Text & "','" & Format(CDate(DaFirstVisit.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaBirth.EditValue), "yyyy/MM/dd") & "','" & RdSex.SelectedIndex & "'," &
                                            "'" & RdAddGuardian.SelectedIndex & "','" & txtGroup.Text.Trim & "','" & txtHouse.Text.Trim & "','" & txtStreet.Text.Trim & "','" & cbovillage.Text.Replace("'", "''") & "','" & CboCommune.Text.Replace("'", "''") & "','" & CboDistrict.Text.Replace("'", "''") & "'," &
                                            "'" & CboProvince.Text & "','" & txtNameContact.Text & "','" & txtAddress.Text.Trim & "','" & txtPhone.Text.Trim & "','" & Val(txtFange.Text.Trim) & "','" & CboFHIVstatus.SelectedIndex & "','" & cboFstatus.SelectedIndex & "'," &
                                            "'" & txtMage.Text & "','" & txtMclinicID.Text & "','" & txtMart.Text & "','" & Mid(CboNameHospital.Text, 1, 4) & "','" & CboMstatus.SelectedIndex & "','" & CboPlacedelivery.Text & "','" & txtPlacedelivery.Text.Trim & "','" & txtPMTCT.Text.Trim & "','" & Format(CDate(DaDelivery.EditValue), "yyyy/MM/dd") & "'," &
                                            "'" & RdDeliveryStatus.SelectedIndex & "','" & txtLbaby.Text & "','" & txtWbaby.Text & "','" & RdKnowHIV.SelectedIndex & "','" & RdReceivedDrug.SelectedIndex & "','" & RdSyrup.SelectedIndex & "','" & RdCotrim.SelectedIndex & "'," &
                                            "'" & offin & "','" & Mid(CboSiteName.Text, 1, 4) & "','" & RdBayTest.SelectedIndex & "','" & CboMHIVstatus.SelectedIndex & "','" & txtMLastvl.Text & "','" & Format(CDate(DaMLastvl.EditValue), "yyyy/MM/dd") & "','" & txtEOClinicID.Text & "')", Cnndb)
                CmdSave.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tbleimain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MsgBox("The Database is now Saving completely", vbInformation, "Saving")
                Clear()
            End If
        Else
            If MessageBox.Show("Are you sure do you want to Edit....", "Edit ...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then

                Dim CmdEdit As New MySqlCommand("Update tbleimain set DaBirth='" & Format(CDate(DaBirth.EditValue), "yyyy/MM/dd") & "',Sex='" & RdSex.SelectedIndex & "'," &
                                            "AddGuardian='" & RdAddGuardian.SelectedIndex & "',Grou='" & txtGroup.Text.Trim & "',House='" & txtHouse.Text.Trim & "',Street='" & txtStreet.Text.Trim & "',Village='" & cbovillage.Text.Replace("'", "''") & "',Commune='" & CboCommune.Text.Replace("'", "''") & "',District='" & CboDistrict.Text.Replace("'", "''") & "'," &
                                            "Province='" & CboProvince.Text & "',NameContact='" & txtNameContact.Text & "',AddContact='" & txtAddress.Text.Trim & "',Phone='" & txtPhone.Text.Trim & "',Fage='" & Val(txtFange.Text.Trim) & "',FHIV='" & CboFHIVstatus.SelectedIndex & "',Fstatus='" & cboFstatus.SelectedIndex & "'," &
                                            "Mage='" & txtMage.Text & "',MClinicID='" & txtMclinicID.Text & "',MArt='" & txtMart.Text & "',HospitalName='" & If(CboNameHospital.Text.Trim.IndexOf("--") = 5, Mid(CboNameHospital.Text, 1, 4), CboNameHospital.Text) & "',Mstatus='" & CboMstatus.SelectedIndex & "',CatPlaceDelivery='" & CboPlacedelivery.Text & "',PlaceDelivery='" & txtPlacedelivery.Text.Trim & "',PMTCT='" & txtPMTCT.Text.Trim & "',DaDelivery='" & Format(CDate(DaDelivery.EditValue), "yyyy/MM/dd") & "'," &
                                            "DeliveryStatus='" & RdDeliveryStatus.SelectedIndex & "',LenBaby='" & txtLbaby.Text & "',WBaby='" & txtWbaby.Text & "',KnownHIV='" & RdKnowHIV.SelectedIndex & "',Received='" & RdReceivedDrug.SelectedIndex & "',Syrup='" & RdSyrup.SelectedIndex & "',Cotrim='" & RdCotrim.SelectedIndex & "'," &
                                            "Offin='" & offin & "',SiteName='" & If(CboSiteName.Text.Trim.IndexOf("--") = 5, Mid(CboSiteName.Text, 1, 4), CboSiteName.Text) & "',HIVtest='" & RdBayTest.SelectedIndex & "',MHIV='" & CboMHIVstatus.SelectedIndex & "',MLastvl='" & txtMLastvl.Text.Trim & "',DaMLastvl='" & Format(CDate(DaMLastvl.EditValue), "yyyy/MM/dd") & "',EOClinicID='" & txtEOClinicID.Text & "' where clinicid='" & txtClinicID.Text & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text.Trim & "','tbleimain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MsgBox("Edit is Successful", MsgBoxStyle.Information, "Edit Record")
                Clear()
            End If
        End If
        'Catch ex As Exception
        '    MessageBox.Show(ex.Message)
        'End Try
    End Sub
    Private Sub ViewData()
        Dim i As Int32
        Dim CmdSearch As New MySqlCommand("Select * from tbleimain order by clinicid", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Rdr.GetValue(0).ToString
            dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
            'dr(3) = DateDiff(DateInterval.Month, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString))
            dr(3) = Math.Round(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString)) / 30) 'sithorn
            Select Case CDec(Rdr.GetValue(3).ToString)
                Case 0
                    dr(4) = "Female"
                Case 1
                    dr(4) = "Male"
            End Select
            Select Case CDec(Rdr.GetValue(27).ToString)
                Case 0
                    dr(5) = "កើតធម្មតា"
                Case 1
                    dr(5) = "ដោយវះកាត់"
                Case 2
                    dr(5) = "ប្រើឧបករណ៍ជំនួយ"

            End Select
            Select Case CDec(Rdr.GetValue(32).ToString)
                Case 0
                    dr(6) = "6 weeks" 'False
                Case 1
                    dr(6) = "12 weeks" 'True
                Case 2 'add new
                    dr(6) = "Unknown"
            End Select
            Select Case CDec(Rdr.GetValue(34).ToString)
                Case 1
                    dr(7) = True
                Case Else
                    dr(7) = False
            End Select

            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub

    Private Sub Search()
        Dim p, d, c, v As String
        Dim CmdSearch As New MySqlCommand("Select * from tbleimain where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        If Rdr.HasRows Then
            While Rdr.Read
                'DaFirstVisit.Text = CDate(Rdr.GetValue(1).ToString).Date 'B Phana
                DaFirstVisit.EditValue = DateTime.Parse(Rdr.GetValue(1).ToString) 'sithorn
                DaBirth.Text = CDate(Rdr.GetValue(2).ToString).Date
                RdSex.SelectedIndex = Rdr.GetValue(3).ToString
                RdAddGuardian.SelectedIndex = Rdr.GetValue(4).ToString
                txtGroup.Text = Rdr.GetValue(5).ToString
                txtHouse.Text = Rdr.GetValue(6).ToString
                txtStreet.Text = Rdr.GetValue(7).ToString
                v = Rdr.GetValue(8).ToString
                c = Rdr.GetValue(9).ToString
                d = Rdr.GetValue(10).ToString
                p = Rdr.GetValue(11).ToString
                txtNameContact.Text = Rdr.GetValue(12).ToString
                txtAddress.Text = Rdr.GetValue(13).ToString
                txtPhone.Text = Rdr.GetValue(14).ToString
                txtFange.Text = Rdr.GetValue(15).ToString
                CboFHIVstatus.SelectedIndex = Rdr.GetValue(16).ToString
                cboFstatus.SelectedIndex = Rdr.GetValue(17).ToString
                txtMage.Text = Rdr.GetValue(18).ToString
                txtMclinicID.Text = Rdr.GetValue(19).ToString
                txtMart.Text = Rdr.GetValue(20).ToString
                If IsNumeric(Rdr.GetValue(21).ToString.Trim) Then
                    For i As Integer = 0 To CboNameHospital.Properties.Items.Count - 1
                        If Rdr.GetValue(21).ToString.Trim = Mid(CboNameHospital.Properties.Items(i).ToString, 1, 4) Then
                            CboNameHospital.SelectedIndex = i
                            Exit For
                        End If
                    Next
                Else
                    CboNameHospital.Text = Rdr.GetValue(21).ToString
                End If
                CboMstatus.SelectedIndex = Rdr.GetValue(22).ToString
                CboPlacedelivery.Text = Rdr.GetValue(23).ToString
                txtPlacedelivery.Text = Rdr.GetValue(24).ToString
                txtPMTCT.Text = Rdr.GetValue(25).ToString
                DaDelivery.Text = CDate(Rdr.GetValue(26).ToString).Date
                RdDeliveryStatus.SelectedIndex = Rdr.GetValue(27).ToString
                txtLbaby.Text = Rdr.GetValue(28).ToString
                txtWbaby.Text = Rdr.GetValue(29).ToString
                RdKnowHIV.SelectedIndex = Rdr.GetValue(30).ToString
                RdReceivedDrug.SelectedIndex = Rdr.GetValue(31).ToString
                RdSyrup.SelectedIndex = Rdr.GetValue(32).ToString
                RdCotrim.SelectedIndex = Rdr.GetValue(33).ToString
                RdOffin.EditValue = Rdr.GetValue(34).ToString 'sithorn  change from selectedIndex to EditValue......
                If IsNumeric(Rdr.GetValue(35).ToString.Trim) Then
                    For i As Int16 = 0 To CboSiteName.Properties.Items.Count - 1
                        If Rdr.GetValue(35).ToString.Trim = Mid(CboSiteName.Properties.Items(i).ToString, 1, 4) Then
                            CboSiteName.SelectedIndex = i
                            Exit For
                        End If
                    Next
                Else
                    CboSiteName.Text = Rdr.GetValue(35).ToString.Trim
                End If
                RdBayTest.SelectedIndex = Rdr.GetValue(36).ToString
                CboMHIVstatus.SelectedIndex = Rdr.GetValue(37).ToString 'sithorn
                txtMLastvl.Text = Rdr.GetValue(38).ToString
                DaMLastvl.Text = CDate(Rdr.GetValue(39).ToString).Date
                txtEOClinicID.Text = Rdr.GetValue(40).ToString 'sithorn Add txtEOClinicID......
                txtClinicID.Enabled = False
                tsbDelete.Enabled = True
            End While
            Rdr.Close()
            CboProvince.Text = p
            CboDistrict.Text = d
            CboCommune.Text = c
            cbovillage.Text = v
        Else
            Rdr.Close()
            txtClinicID.Enabled = False
        End If
    End Sub
    Protected Overrides Function ProcessCmdKey(ByRef msg As Message, keyData As Keys) As Boolean
        Select Case keyData
            Case Keys.F1
                Save()
            Case Keys.F2
                Clear()
            Case Keys.F3
                tsbDelete_Click(tsbDelete, New EventArgs())
        End Select
        Return MyBase.ProcessCmdKey(msg, keyData)
    End Function
#End Region
    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
    End Sub

    'Private Sub RdOffin_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdOffin.SelectedIndexChanged
    '    If RdOffin.SelectedIndex = 1 Then
    '        CboSiteName.Enabled = True
    '    Else
    '        CboSiteName.Enabled = False
    '        CboSiteName.SelectedIndex = -1
    '    End If
    'End Sub


    Private Sub cboProvince_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboProvince.SelectedIndexChanged
        CboDistrict.Properties.Items.Clear()
        CboDistrict.SelectedIndex = -1
        CboCommune.SelectedIndex = -1
        cbovillage.SelectedIndex = -1
        txtStreet.Text = ""
        txtHouse.Text = ""
        Dim CmdSearch As New MySqlCommand("Select      tblDistrict.DistrictENg FROM    tblProvince INNER JOIN    tblDistrict On  tblProvince.pid =  tblDistrict.pid WHERE     ( tblProvince.ProvinceENg = '" & CboProvince.Text & "') ORDER BY  tblDistrict.did", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            CboDistrict.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub
    Private Sub cboCommune_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboCommune.SelectedIndexChanged
        cbovillage.Properties.Items.Clear()
        cbovillage.SelectedIndex = -1
        Dim Cmdsearch As New MySqlCommand("SELECT    tblVillage.VillageEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did INNER JOIN    tblVillage ON  tblCommune.cid =  tblVillage.cid WHERE     ( tblProvince.ProvinceENg = '" & CboProvince.Text & "') AND ( tblDistrict.DistrictENg = '" & CboDistrict.Text.Replace("'", "''") & "') AND ( tblCommune.CommuneEN = '" & CboCommune.Text.Replace("'", "''") & "') ORDER BY  tblVillage.vid", Cnndb)
        Rdr = Cmdsearch.ExecuteReader
        While Rdr.Read
            cbovillage.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub

    Private Sub cbodistrict_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDistrict.SelectedIndexChanged
        CboCommune.Properties.Items.Clear()
        CboCommune.SelectedIndex = -1
        Dim CmdSearch As New MySqlCommand("SELECT   tblCommune.CommuneEN FROM    tblProvince INNER JOIN   tblDistrict ON  tblProvince.pid =  tblDistrict.pid INNER JOIN   tblCommune ON  tblDistrict.did =  tblCommune.did WHERE     ( tblProvince.ProvinceENg = '" & CboProvince.Text & "') AND ( tblDistrict.DistrictENg = '" & CboDistrict.Text.Replace("'", "''") & "') ORDER BY  tblCommune.cid", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            CboCommune.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim)
        End While
        Rdr.Close()
    End Sub

    Private Sub DaFirstVisit_EditValueChanged(sender As Object, e As EventArgs) Handles DaFirstVisit.EditValueChanged
        If CDate(DaBirth.Text) <= CDate("01/01/1900") Then Exit Sub

        If CDate(DaFirstVisit.Text) > Now.Date Then DaFirstVisit.Text = "01/01/1900"
        If CDate(DaFirstVisit.Text) <= CDate("01/01/1900") Then Exit Sub
        'txtAge.Text = Math.Round((DateDiff(DateInterval.Month, CDate(DaBirth.Text), CDate(DaFirstVisit.Text)) / 12), 1)
        txtAge.Text = CStr(Math.Round(DateDiff(DateInterval.Day, CDate(DaBirth.Text), CDate(DaFirstVisit.Text)) / 30)) 'sithorn
        If CDec(txtAge.Text) < 0 Or CDec(txtAge.Text) > 24 Then
            MessageBox.Show("Invalid date first Visit !", "Check Date first", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DaFirstVisit.Text = "01/01/1900"
            Exit Sub
        End If
    End Sub

    Private Sub DaBirth_EditValueChanged(sender As Object, e As EventArgs) Handles DaBirth.EditValueChanged
        If DaBirth.Text.Trim = "" Or DaFirstVisit.Text.Trim = "" Then Exit Sub
        If CDate(DaBirth.Text) > Now.Date Then DaBirth.Text = "01/01/1900"
        If CDate(DaBirth.Text) <= CDate("01/01/2010") Then Exit Sub
        'txtAge.Text = DateDiff(DateInterval.Month, CDate(DaBirth.Text), CDate(DaFirstVisit.Text))
        txtAge.Text = CStr(Math.Round(DateDiff(DateInterval.Day, CDate(DaBirth.Text), CDate(DaFirstVisit.Text)) / 30)) 'sithorn
        If CDec(txtAge.Text) < 0 Or CDec(txtAge.Text) > 24 Then
            MessageBox.Show("Invalid Date of Birth", "Check Date of Birth", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DaBirth.Text = "01/01/1900"
            Exit Sub
        End If
    End Sub

    Private Sub txtAge_EditValueChanged(sender As Object, e As EventArgs) Handles txtAge.EditValueChanged
        'If txtAge.Text <> "" Then
        '    ' dastarmanage.Text = Now.Date
        '    If CDate(DaFirstVisit.Text) < CDate("01/01/1990") Then
        '        DaFirstVisit.Text = Now.Date
        '    End If
        '    If CDate(DaBirth.Text) <= CDate("01/01/2010") Or ag = True Then
        '        DaBirth.Text = DateAdd(DateInterval.Month, -Val(txtAge.EditValue), CDate(DaFirstVisit.Text))
        '    End If
        '    ag = False
        'End If
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub

    Private Sub txtClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtClinicID.EditValueChanged

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
            Search()
        End If
    End Sub

    Private Sub tscView_Click(sender As Object, e As EventArgs) Handles tscView.Click

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

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub
    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        If txtClinicID.Text = "" Then Exit Sub
        XtraTabControl1.SelectedTabPageIndex = 1
        Search()
    End Sub

    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        If MessageBox.Show("Are you sure do you want to Delete ?", "Delete..", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
            Dim Cmddel As New MySqlCommand("Delete from tbleimain where clinicid ='" & txtClinicID.Text & "'", Cnndb)
            Cmddel.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tbleimain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Deleted..", "Delete...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub

    Private Sub txtAge_KeyDown(sender As Object, e As KeyEventArgs) Handles txtAge.KeyDown
        ag = True
    End Sub

    Private Sub txtAge_Leave(sender As Object, e As EventArgs) Handles txtAge.Leave
        If txtAge.Text <> "" Then
            ' dastarmanage.Text = Now.Date
            If CDate(DaFirstVisit.Text) < CDate("01/01/1990") Then
                DaFirstVisit.Text = Now.Date
            End If
            If CDate(DaBirth.Text) <= CDate("01/01/2010") Or ag = True Then
                DaBirth.Text = DateAdd(DateInterval.Month, -Val(txtAge.EditValue), CDate(DaFirstVisit.Text))
            End If
            ag = False
        End If
    End Sub

    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
            '    CheckPat()
        End If
    End Sub

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

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
            Dim CmdSearch As New MySqlCommand("Select * from tbleimain where clinicid='" & tspClinicID.Text & "' order by clinicid", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Rdr.GetValue(0).ToString
                dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
                'dr(3) = DateDiff(DateInterval.Month, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString))
                dr(3) = Math.Round(DateDiff(DateInterval.Day, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(1).ToString)) / 30) 'sithorn
                Select Case CDec(Rdr.GetValue(3).ToString)
                    Case 0
                        dr(4) = "Female"
                    Case 1
                        dr(4) = "Male"
                End Select
                Select Case CDec(Rdr.GetValue(27).ToString)
                    Case 0
                        dr(5) = "កើតធម្មតា"
                    Case 1
                        dr(5) = "ដោយវះកាត់"
                    Case 2
                        dr(5) = "ប្រើ"

                End Select
                Select Case CDec(Rdr.GetValue(32).ToString)
                    Case 0
                        dr(6) = "6 weeks" 'False
                    Case 1
                        dr(6) = "12 weeks" 'True
                    Case 2 'add new
                        dr(6) = "Unknown"
                End Select
                Select Case CDec(Rdr.GetValue(34).ToString)
                    Case 0
                        dr(7) = False
                    Case 1
                        dr(7) = True
                End Select

                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
            tspClinicID.Select(tspClinicID.Text.Length, 0)
        End If
    End Sub

    Private Sub RdOffin_EditValueChanged(sender As Object, e As EventArgs) Handles RdOffin.EditValueChanged
        If CInt(RdOffin.EditValue) = 1 Then
            CboSiteName.Enabled = True
            txtEOClinicID.Enabled = True
            txtEOClinicID.Properties.NullValuePrompt = "Ex: E" & frmMain.Art & "0001"
        Else
            CboSiteName.Enabled = False
            CboSiteName.SelectedIndex = -1
            txtEOClinicID.Enabled = False
            txtEOClinicID.Text = ""
        End If
    End Sub

    Private Sub CboMHIVstatus_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboMHIVstatus.SelectedIndexChanged
        If CboMHIVstatus.SelectedIndex = 0 Then
            txtMclinicID.Enabled = True
            txtMart.Enabled = True
            txtMart.Properties.NullValuePrompt = "Ex: " & frmMain.Art & "00001"
            txtMLastvl.Enabled = True
            DaMLastvl.Enabled = True
        Else
            txtMclinicID.Enabled = False
            txtMart.Enabled = False
            txtMLastvl.Enabled = False
            DaMLastvl.Enabled = False
            txtMclinicID.Text = ""
            txtMart.Text = ""
            txtMLastvl.Text = ""
            DaMLastvl.Text = "01/01/1900"
        End If
    End Sub

    Private Sub txtMLastvl_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtMLastvl.KeyPress
        If Not Char.IsDigit(e.KeyChar) And Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtFange_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtFange.KeyPress
        If Not Char.IsDigit(e.KeyChar) And Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtMage_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtMage.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtLbaby_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtLbaby.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtLbaby.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtWbaby_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtWbaby.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtWbaby.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub txtAge_KeyPress(sender As Object, e As KeyPressEventArgs) Handles txtAge.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso e.KeyChar <> "." AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
        If e.KeyChar = "." AndAlso txtAge.Text.Contains(".") Then
            e.Handled = True
        End If
    End Sub

    Private Sub DaFirstVisit_KeyDown(sender As Object, e As KeyEventArgs) Handles DaFirstVisit.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaBirth_KeyDown(sender As Object, e As KeyEventArgs) Handles DaBirth.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub CboSiteName_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboSiteName.SelectedIndexChanged
        Dim sitecode As String
        If CboSiteName.Text = "" Then
            txtEOClinicID.Properties.NullValuePrompt = "Ex: E" & frmMain.Art & "0001"
        Else
            sitecode = CboSiteName.Text.Substring(0, 4)
            txtEOClinicID.Properties.NullValuePrompt = "Ex: E" & sitecode & "0001"
        End If
    End Sub

    Private Sub txtGroup_KeyDown(sender As Object, e As KeyEventArgs) Handles txtGroup.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtHouse_KeyDown(sender As Object, e As KeyEventArgs) Handles txtHouse.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtNameContact_KeyDown(sender As Object, e As KeyEventArgs) Handles txtNameContact.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtAddress_KeyDown(sender As Object, e As KeyEventArgs) Handles txtAddress.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtMclinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtMclinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtMart_KeyDown(sender As Object, e As KeyEventArgs) Handles txtMart.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtMLastvl_KeyDown(sender As Object, e As KeyEventArgs) Handles txtMLastvl.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtPlacedelivery_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPlacedelivery.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtPMTCT_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPMTCT.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtLbaby_KeyDown(sender As Object, e As KeyEventArgs) Handles txtLbaby.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub CboPlacedelivery_SelectedValueChanged(sender As Object, e As EventArgs) Handles CboPlacedelivery.SelectedValueChanged
        If CboPlacedelivery.Text = "Other" Then
            txtPlacedelivery.Enabled = True
        Else
            txtPlacedelivery.Enabled = False
            txtPlacedelivery.Text = ""
        End If
    End Sub

    Private Sub txtPhone_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPhone.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tspClinicID_KeyPress(sender As Object, e As KeyPressEventArgs) Handles tspClinicID.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub
End Class


