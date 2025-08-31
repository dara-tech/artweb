Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Public Class frmChildIn
    Dim Rdr As MySqlDataReader
    Dim dt, dt1 As DataTable
    Dim tin As Integer
    Dim ag, Rs As Boolean

    Private Sub frmChildIn_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        loadData()
        Clear()
        XtraTabControl1.SelectedTabPage = XtraTabPage1
    End Sub

    Private Sub Clear()
        txtClinicID.Text = ""
        txtClinicID.Enabled = True
        XtraTabControl1.SelectedTabPage = XtraTabPage2
        txtClinicID.Focus()
        DaFirstVisit.Text = "01/01/1900"
        ChkReLost.Checked = False
        DaDob.Text = "01/01/1900"
        txtAge.Text = ""
        RdSex.SelectedIndex = -1
        RdReferred.SelectedIndex = -1
        RdEID.SelectedIndex = -1
        DaTest.Text = "01/01/1900"
        RdTest.SelectedIndex = -1
        CboTransferName.SelectedIndex = -1
        CboVcctname.SelectedIndex = -1
        txtVcctID.Text = ""
        DaART.Text = "01/01/1900"
        txtART.Text = ""
        RdTransferIN.SelectedIndex = -1
        RdFeeding.SelectedIndex = -1
        CboFamily.SelectedIndex = -1
        txtFange.Text = ""
        CboFStatusHIV.SelectedIndex = -1
        CboFstatus.SelectedIndex = -1
        RdFart.SelectedIndex = -1
        RdPregnant.SelectedIndex = -1
        CboFnameART.SelectedIndex = -1
        CboFhTB.SelectedIndex = -1
        RdPastMedical.SelectedIndex = -1
        RdTB.SelectedIndex = -1
        RdResultTB.SelectedIndex = -1
        DaOnset.Text = "01/01/1900"
        DaTBtreat.Text = "01/01/1900"
        RdTBtreat.SelectedIndex = -1
        RdTBoutcome.SelectedIndex = -1
        DaTBout.Text = "01/01/1900"
        Rdinh.SelectedIndex = -1
        RdTPTdrug.SelectedIndex = -1
        RdPastARV.SelectedIndex = -1
        CboDrugARV1.SelectedIndex = -1
        RdContri.SelectedIndex = -1
        RdFluco.SelectedIndex = -1
        RdAllergy.SelectedIndex = -1
        tsbDelete.Enabled = False
        tsbDelete1.Enabled = False
        '   dt.Clear()
        dt1.Clear()
        tin = 0
        txtOldClinicID.Text = ""
        CboSiteOld.SelectedIndex = -1
        CboNationality.SelectedIndex = -1
    End Sub
    Private Sub loadData()
        Dim CmdART As New MySqlCommand("Select * from tblartsite where status ='1' order by sid", Cnndb)
        Rdr = CmdART.ExecuteReader
        While Rdr.Read
            CboTransferName.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
            CboFnameART.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
            CboSiteOld.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        Dim CmdVcct As New MySqlCommand("Select * from tblvcctsite where status ='1' order by vid", Cnndb)
        Rdr = CmdVcct.ExecuteReader
        While Rdr.Read
            CboVcctname.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim & " -- " & Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()

        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Date-First", GetType(Date))
        dt.Columns.Add("Age", GetType(Int32))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Referred", GetType(String))
        dt.Columns.Add("Transfer-In", GetType(Boolean))
        dt.Columns.Add("Site Code", GetType(String))
        dt.Columns.Add("ART Number", GetType(String))
        dt.Columns.Add("Lost-Return", GetType(Boolean))
        dt.Columns.Add("Nationality", GetType(String))
        GridControl1.DataSource = dt

        dt1 = New DataTable
        dt1.Columns.Add("Family", GetType(String))
        dt1.Columns.Add("Age", GetType(Integer))
        dt1.Columns.Add("HIV Status", GetType(String))
        dt1.Columns.Add("Family Status", GetType(String))
        dt1.Columns.Add("Starting ARV", GetType(String))
        dt1.Columns.Add("Pregnant Status", GetType(String))
        dt1.Columns.Add("Site Name (PreART/ART)/PMTCT", GetType(String))
        dt1.Columns.Add("History of TB", GetType(String))
        ' dt1.Columns.Add("Place-Of-Test1")
        GridControl2.DataSource = dt1


        Dim cmdDrug As New MySqlCommand("Select * from tbldrug  order by drugname", Cnndb)
        Rdr = cmdDrug.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(2).ToString) = 0 Then
                CboDrugARV1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                CboDrugARV5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
                '  CboDrugARV6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            End If
        End While
        Rdr.Close()
        Dim CmdClinic As New MySqlCommand("Select * from tblclinic ", Cnndb)
        Rdr = CmdClinic.ExecuteReader
        While Rdr.Read
            CboClinicARV1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboClinicARV7.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()
        Dim CmdReason As New MySqlCommand("Select * from tblreason", Cnndb)
        Rdr = CmdReason.ExecuteReader
        While Rdr.Read
            CboNoteARV1.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV2.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV3.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV4.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV5.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV6.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
            CboNoteARV7.Properties.Items.Add(Rdr.GetValue(1).ToString.Trim)
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
    End Sub
    Private Sub ARVTreat1()
        If CboDrugARV1.SelectedIndex >= 0 Then
            ARVTreat2()
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
        If CboDrugARV2.SelectedIndex >= 0 Then
            ARVTreat3()
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
        If CboDrugARV3.SelectedIndex >= 0 Then
            ARVTreat4()
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
        If CboDrugARV4.SelectedIndex >= 0 Then
            ARVTreat5()
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
        If CboDrugARV5.SelectedIndex >= 0 Then
            ' ARVTreat6()
            '  CboDrugARV6.Enabled = True
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
            '  CboDrugARV6.Enabled = False
            '  CboDrugARV6.SelectedIndex = -1
        End If
    End Sub
    Private Sub CheckStartDate(ByVal StartDate As DevExpress.XtraEditors.DateEdit, ByVal StopDate As DevExpress.XtraEditors.DateEdit, ByVal CboNote As DevExpress.XtraEditors.ComboBoxEdit)
        If DateDiff(DateInterval.Day, CDate(StartDate.Text), CDate("01/01/1900")) = 0 Then
            StopDate.Enabled = False
            CboNote.Enabled = False
        Else
            StopDate.Enabled = True
            CboNote.Enabled = True
        End If
    End Sub
    Private Sub Allergy(ByVal Drug As DevExpress.XtraEditors.ComboBoxEdit, ByVal Allergy As DevExpress.XtraEditors.ComboBoxEdit, ByVal Drug1 As DevExpress.XtraEditors.ComboBoxEdit)
        If Drug.SelectedIndex > 0 Then
            Allergy.Enabled = True
            Drug1.Enabled = True
        Else
            Allergy.Enabled = False
            Allergy.SelectedIndex = -1
            Drug1.Enabled = False
            Drug1.SelectedIndex = -1
            Drug.SelectedIndex = -1
            Drug.Enabled = False
        End If
    End Sub
    Private Sub Save()
        If txtClinicID.Text.Trim = "" Then MsgBox("Please input Clinc ID !", MsgBoxStyle.Critical, "Required....") : Exit Sub
        If RdTransferIN.SelectedIndex = 1 And txtART.Text.Trim = "" Then MessageBox.Show("Please input ART Number !", "ART Number ", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        Dim N() As String = Split(CboNationality.Text, "--")
        If RdSex.SelectedIndex = -1 Then MessageBox.Show("សូមជ្រើសរើសភេទអ្នកជំងឺ?", "Sex..", MessageBoxButtons.OK, MessageBoxIcon.Warning) : Exit Sub
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Do you want to save ?", "Save data", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
                Dim CmdSave As New MySqlCommand("insert into tblcimain values('" & txtClinicID.Text.Trim & "','" & Format(CDate(DaFirstVisit.EditValue), "yyyy/MM/dd") & "','" & txtLClinicID.Text & "','" & Format(CDate(DaDob.EditValue), "yyyy/MM/dd") & "','" & RdSex.SelectedIndex & "','" & RdReferred.SelectedIndex & "'," &
                                        "'" & txtReferOther.Text & "','" & txtEClinicID.Text & "','" & Format(CDate(DaTest.EditValue), "yyyy/MM/dd") & "','" & RdTest.SelectedIndex & "','" & Mid(CboVcctname.Text, 1, 6) & "','" & txtVcctID.Text.Trim & "','" & RdTransferIN.SelectedIndex & "','" & Mid(CboTransferName.Text, 1, 4) & "','" & Format(CDate(DaART.EditValue), "yyyy-MM-dd") & "','" & txtART.Text.Trim & "'," &
                                        "'" & RdFeeding.SelectedIndex & "','" & RdPastMedical.SelectedIndex & "','" & RdTB.SelectedIndex & "','" & RdResultTB.SelectedIndex & "','" & Format(CDate(DaOnset.EditValue), "yyyy/MM/dd") & "','" & RdTBtreat.SelectedIndex & "','" & Format(CDate(DaTBtreat.EditValue), "yyyy/MM/dd") & "','" & RdTBoutcome.SelectedIndex & "','" & Format(CDate(DaTBout.EditValue), "yyyy/MM/dd") & "'," &
                                        "'" & Rdinh.SelectedIndex & "','" & RdTPTdrug.SelectedIndex & "','" & Format(CDate(DaStartTPT.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaEndTPT.EditValue), "yyyy/MM/dd") & "','" & RdPastARV.SelectedIndex & "','" & RdContri.SelectedIndex & "','" & RdFluco.SelectedIndex & "','" & RdAllergy.SelectedIndex & "','" & txtOldClinicID.Text.Trim & "','" & Mid(CboSiteOld.Text, 1, 4) & "','" & Val(N(0)) & "')", Cnndb)

                CmdSave.ExecuteNonQuery()
                Try
                    If RdTransferIN.SelectedIndex = 1 Then
                        Dim CmdSaveArt As New MySqlCommand("insert into tblcart values('" & txtClinicID.Text & "','" & txtART.Text & "','" & Format(CDate(DaART.EditValue), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                        CmdSaveArt.ExecuteNonQuery()
                    End If
                Catch ex As Exception
                End Try
                For i As Integer = 0 To GridView2.RowCount - 1
                    With GridView2
                        Dim f, h, s, a, p, tb As Integer
                        If .GetRowCellValue(i, "Family") Is "Mother" Then
                            f = 0
                        ElseIf .GetRowCellValue(i, "Family") Is "Father" Then
                            f = 1
                        Else
                            f = -1
                        End If
                        If .GetRowCellValue(i, "HIV Status") Is "Postive" Then
                            h = 1
                        ElseIf .GetRowCellValue(i, "HIV Status") Is "Negative" Then
                            h = 0
                        ElseIf .GetRowCellValue(i, "HIV Status") Is "Unknown" Then
                            h = 2
                        Else
                            h = -1
                        End If
                        If .GetRowCellValue(i, "Family Status") Is "Dead" Then
                            s = 0
                        ElseIf .GetRowCellValue(i, "Family Status") Is "Alive" Then
                            s = 1
                        ElseIf .GetRowCellValue(i, "Family Status") Is "Unknown" Then
                            s = 2
                        Else
                            s = -1
                        End If
                        If .GetRowCellValue(i, "Starting ARV") Is "Yes" Then
                            a = 0
                        ElseIf .GetRowCellValue(i, "Starting ARV") Is "No" Then
                            a = 1
                        ElseIf .GetRowCellValue(i, "Starting ARV") Is "Unknown" Then
                            a = 2
                        Else
                            a = -1
                        End If

                        If .GetRowCellValue(i, "Pregnant Status") Is "During pregnancy" Then
                            p = 0
                        ElseIf .GetRowCellValue(i, "Pregnant Status") Is "During delivery" Then
                            p = 1
                        ElseIf .GetRowCellValue(i, "Pregnant Status") Is "After delivery" Then
                            p = 2
                        Else
                            p = -1
                        End If
                        If .GetRowCellValue(i, "History of TB") Is "Yes" Then
                            tb = 0
                        ElseIf .GetRowCellValue(i, "History of TB") Is "No" Then
                            tb = 1
                        ElseIf .GetRowCellValue(i, "History of TB") Is "Unknown" Then
                            tb = 2
                        Else
                            tb = -1
                        End If
                        Dim Cmdfamily As New MySqlCommand("insert into tblcifamily values('" & txtClinicID.Text & "' ,'" & f & "','" & .GetRowCellValue(i, "Age") & "','" & h & "','" & s & "','" & a & "','" & p & "','" & Mid(.GetRowCellValue(i, "Site Name (PreART/ART)/PMTCT"), 1, 4) & "','" & tb & "')", Cnndb)
                        Cmdfamily.ExecuteNonQuery()
                    End With
                Next i

                If CboDrugARV1.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV1.Text & "','" & CboClinicARV1.Text & "','" & Format(CDate(DaStartARV1.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV1.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV1.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV2.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV2.Text & "','" & CboClinicARV2.Text & "','" & Format(CDate(DaStartARV2.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV2.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV2.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV3.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV3.Text & "','" & CboClinicARV3.Text & "','" & Format(CDate(DaStartARV3.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV3.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV3.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV4.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV4.Text & "','" & CboClinicARV4.Text & "','" & Format(CDate(DaStartARV4.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV4.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV4.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV5.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV5.Text & "','" & CboClinicARV5.Text & "','" & Format(CDate(DaStartARV5.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV5.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV5.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If RdContri.SelectedIndex = 0 Then
                    Dim CmdInsert As New MySqlCommand("insert into tblCICotrim values('" & txtClinicID.Text & "','" & CboClinicARV6.Text & "','" & Format(CDate(DaStartARV6.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV6.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV6.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If RdFluco.SelectedIndex = 0 Then
                    Dim CmdInsert As New MySqlCommand("insert into tblCIFluconazole values('" & txtClinicID.Text & "','" & CboClinicARV7.Text & "','" & Format(CDate(DaStartARV7.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV7.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV7.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If

                If CboDrugAllergy1.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy1.Text & "','" & CboAllergy1.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy2.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy2.Text & "','" & CboAllergy2.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy3.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy3.Text & "','" & CboAllergy3.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy4.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy4.Text & "','" & CboAllergy4.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy5.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy5.Text & "','" & CboAllergy5.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy6.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy6.Text & "','" & CboAllergy6.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblCImain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MsgBox("The Database is now Saving completely", vbInformation, "Saving")
                Clear()
            End If
        Else
            If MessageBox.Show("Are you sure do you want to Edit ?", "Edit Data", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then

                Dim CmdEdit As New MySqlCommand("Update tblcimain set DaFirstVisit='" & Format(CDate(DaFirstVisit.EditValue), "yyyy/MM/dd") & "',LClinicID='" & txtLClinicID.Text & "',DaBirth='" & Format(CDate(DaDob.EditValue), "yyyy/MM/dd") & "',Sex='" & RdSex.SelectedIndex & "',Referred='" & RdReferred.SelectedIndex & "'," &
                                        "Oreferred='" & txtReferOther.Text & "',EClinicID='" & txtEClinicID.Text & "',DaTest='" & Format(CDate(DaTest.EditValue), "yyyy/MM/dd") & "',TypeTest='" & RdTest.SelectedIndex & "',Vcctcode='" & Mid(CboVcctname.Text, 1, 6) & "',VcctID='" & txtVcctID.Text.Trim & "',OffIn='" & RdTransferIN.SelectedIndex & "',SiteName='" & Mid(CboTransferName.Text, 1, 4) & "',DaART='" & Format(CDate(DaART.EditValue), "yyyy-MM-dd") & "',Artnum='" & txtART.Text.Trim & "'," &
                                        "Feeding='" & RdFeeding.SelectedIndex & "',TbPast='" & RdPastMedical.SelectedIndex & "',TypeTB='" & RdTB.SelectedIndex & "',ResultTB='" & RdResultTB.SelectedIndex & "',Daonset='" & Format(CDate(DaOnset.EditValue), "yyyy/MM/dd") & "',Tbtreat='" & RdTBtreat.SelectedIndex & "',Datreat='" & Format(CDate(DaTBtreat.EditValue), "yyyy/MM/dd") & "',ResultTreat='" & RdTBoutcome.SelectedIndex & "',DaResultTreat='" & Format(CDate(DaTBout.EditValue), "yyyy/MM/dd") & "'," &
                                        "Inh='" & Rdinh.SelectedIndex & "',OtherPast='" & RdPastARV.SelectedIndex & "',Cotrim='" & RdContri.SelectedIndex & "',Fluco='" & RdFluco.SelectedIndex & "',Allergy='" & RdAllergy.SelectedIndex & "' ,ClinicIDold='" & txtOldClinicID.Text & "' ,SiteNameold='" & Mid(CboSiteOld.Text, 1, 4) & "' ,Nationality='" & If(CboNationality.Text IsNot "", Val(N(0)), 0) & "',TPTdrug='" & RdTPTdrug.SelectedIndex & "',DaStartTPT='" & Format(CDate(DaStartTPT.EditValue), "yyyy/MM/dd") & "',DaEndTPT='" & Format(CDate(DaEndTPT.EditValue), "yyyy/MM/dd") & "' where ClinicID='" & txtClinicID.Text & "'", Cnndb)

                CmdEdit.ExecuteNonQuery()
                If tin = 1 And RdTransferIN.SelectedIndex = 0 Then
                    Dim CmdDelArt As New MySqlCommand("Delete from tblcart where clinicid='" & txtClinicID.Text & "'", Cnndb)
                    CmdDelArt.ExecuteNonQuery()
                    Dim CmdUpcv As New MySqlCommand("Update tblcvmain set ARTnum='' where clinicid='" & txtClinicID.Text & "'", Cnndb)
                    CmdUpcv.ExecuteNonQuery()
                ElseIf tin = 0 And RdTransferIN.SelectedIndex = 1 Then
                    Try
                        Dim CmdSaveArt As New MySqlCommand("insert into tblcart values('" & txtClinicID.Text & "','" & txtART.Text & "','" & Format(CDate(DaART.EditValue), "yyyy/MM/dd") & "')", ConnectionDB.Cnndb)
                        CmdSaveArt.ExecuteNonQuery()
                    Catch ex As Exception
                    End Try
                    Dim CmdUpcv As New MySqlCommand("Update tblcvmain set ARTnum='" & txtART.Text & "' where clinicid='" & txtClinicID.Text & "'", Cnndb)
                    CmdUpcv.ExecuteNonQuery()
                End If
                Dim Cmddel As New MySqlCommand("Delete from tblcifamily where clinicid='" & txtClinicID.Text & "'", Cnndb)
                Cmddel.ExecuteNonQuery()
                For i As Integer = 0 To GridView2.RowCount - 1
                    With GridView2
                        Dim f, h, s, a, p, tb As Integer
                        If .GetRowCellValue(i, "Family") Is "Mother" Then
                            f = 0
                        ElseIf .GetRowCellValue(i, "Family") Is "Father" Then
                            f = 1
                        Else
                            f = -1
                        End If
                        If .GetRowCellValue(i, "HIV Status") Is "Postive" Then
                            h = 1
                        ElseIf .GetRowCellValue(i, "HIV Status") Is "Negative" Then
                            h = 0
                        ElseIf .GetRowCellValue(i, "HIV Status") Is "Unknown" Then
                            h = 2
                        Else
                            h = -1
                        End If
                        If .GetRowCellValue(i, "Family Status") Is "Dead" Then
                            s = 0
                        ElseIf .GetRowCellValue(i, "Family Status") Is "Alive" Then
                            s = 1
                        ElseIf .GetRowCellValue(i, "Family Status") Is "Unknown" Then
                            s = 2
                        Else
                            s = -1
                        End If
                        If .GetRowCellValue(i, "Starting ARV") Is "Yes" Then
                            a = 0
                        ElseIf .GetRowCellValue(i, "Starting ARV") Is "No" Then
                            a = 1
                        ElseIf .GetRowCellValue(i, "Starting ARV") Is "Unknown" Then
                            a = 2
                        Else
                            a = -1
                        End If

                        If .GetRowCellValue(i, "Pregnant Status") Is "During pregnancy" Then
                            p = 0
                        ElseIf .GetRowCellValue(i, "Pregnant Status") Is "During delivery" Then
                            p = 1
                        ElseIf .GetRowCellValue(i, "Pregnant Status") Is "After delivery" Then
                            p = 2
                        Else
                            p = -1
                        End If
                        If .GetRowCellValue(i, "History of TB") Is "Yes" Then
                            tb = 0
                        ElseIf .GetRowCellValue(i, "History of TB") Is "No" Then
                            tb = 1
                        ElseIf .GetRowCellValue(i, "History of TB") Is "Unknown" Then
                            tb = 2
                        Else
                            tb = -1
                        End If
                        Dim si As String = ""
                        Try
                            si = Mid(.GetRowCellValue(i, "Site Name (PreART/ART)/PMTCT"), 1, 4)
                        Catch ex As Exception
                        End Try

                        Dim Cmdfamily As New MySqlCommand("insert into tblcifamily values('" & txtClinicID.Text & "' ,'" & f & "','" & .GetRowCellValue(i, "Age") & "','" & h & "','" & s & "','" & a & "','" & p & "','" & si & "','" & tb & "')", Cnndb)
                        Cmdfamily.ExecuteNonQuery()
                    End With
                Next i
                Dim CmdDelPast As New MySqlCommand("Delete from tblciothpast  where clinicid='" & txtClinicID.Text & "'", Cnndb)
                CmdDelPast.ExecuteNonQuery()
                If CboDrugARV1.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV1.Text & "','" & CboClinicARV1.Text & "','" & Format(CDate(DaStartARV1.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV1.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV1.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV2.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV2.Text & "','" & CboClinicARV2.Text & "','" & Format(CDate(DaStartARV2.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV2.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV2.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV3.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV3.Text & "','" & CboClinicARV3.Text & "','" & Format(CDate(DaStartARV3.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV3.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV3.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV4.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV4.Text & "','" & CboClinicARV4.Text & "','" & Format(CDate(DaStartARV4.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV4.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV4.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugARV5.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciothpast values('" & txtClinicID.Text & "','" & CboDrugARV5.Text & "','" & CboClinicARV5.Text & "','" & Format(CDate(DaStartARV5.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV5.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV5.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                Dim Cmddelcon As New MySqlCommand("delete from tblcicotrim where clinicid='" & txtClinicID.Text & "'", Cnndb)
                Cmddelcon.ExecuteNonQuery()
                If RdContri.SelectedIndex = 0 Then
                    Dim CmdInsert As New MySqlCommand("insert into tblCICotrim values('" & txtClinicID.Text & "','" & CboClinicARV6.Text & "','" & Format(CDate(DaStartARV6.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV6.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV6.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                Dim Cmddelflu As New MySqlCommand("delete from tblCIFluconazole where clinicid='" & txtClinicID.Text & "'", Cnndb)
                Cmddelflu.ExecuteNonQuery()
                If RdFluco.SelectedIndex = 0 Then
                    Dim CmdInsert As New MySqlCommand("insert into tblCIFluconazole values('" & txtClinicID.Text & "','" & CboClinicARV7.Text & "','" & Format(CDate(DaStartARV7.EditValue), "yyyy/MM/dd") & "','" & Format(CDate(DaStopARV7.EditValue), "yyyy/MM/dd") & "','" & CboNoteARV7.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                Dim Cmddelall As New MySqlCommand("delete from tblciallergy where clinicid='" & txtClinicID.Text & "'", Cnndb)
                Cmddelall.ExecuteNonQuery()
                If CboDrugAllergy1.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy1.Text & "','" & CboAllergy1.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy2.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy2.Text & "','" & CboAllergy2.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy3.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy3.Text & "','" & CboAllergy3.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy4.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy4.Text & "','" & CboAllergy4.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy5.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy5.Text & "','" & CboAllergy5.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                If CboDrugAllergy6.Text.Trim <> "" Then
                    Dim CmdInsert As New MySqlCommand("insert into tblciallergy values('" & txtClinicID.Text & "','" & CboDrugAllergy6.Text & "','" & CboAllergy6.Text & "')", Cnndb)
                    CmdInsert.ExecuteNonQuery()
                End If
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblCImain','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MsgBox("Edit is Successfully", MsgBoxStyle.Information, "Edit Record")

                Clear()
            End If
        End If


    End Sub
    Private Sub ViewData()
        Dim i As Int64
        Dim CmdSearch As New MySqlCommand("SELECT * FROM preart.tblcimain left join tblnationality on tblcimain.Nationality=tblnationality.Nid order by tblcimain.ClinicID", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Rdr.GetValue(0).ToString
            dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
            dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(1).ToString))
            Select Case CDec(Rdr.GetValue(4).ToString)
                Case 0
                    dr(4) = "Female"
                Case 1
                    dr(4) = "Male"
            End Select
            Select Case CDec(Rdr.GetValue(5).ToString)
                Case 0
                    dr(5) = "Self Referral"
                Case 1
                    dr(5) = "CA/NGO"
                Case 2
                    dr(5) = "VCCT"
                Case 3
                    dr(5) = "Other"
            End Select
            Select Case CDec(Rdr.GetValue(12).ToString)
                Case 0
                    dr(6) = False
                Case 1
                    dr(6) = True
            End Select
            dr(7) = Rdr.GetValue(13).ToString.Trim
            dr(8) = Rdr.GetValue(15).ToString.Trim
            If Rdr.GetValue(2).ToString.Trim = "" Then
                dr(9) = False
            Else
                dr(9) = True
            End If
            dr(10) = Rdr.GetValue(37).ToString.Trim
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub
    Private Sub Search(ByVal id As DevExpress.XtraEditors.TextEdit)
        Dim CmdSarch As New MySqlCommand("Select * from tblcimain where clinicid='" & id.Text & "'", Cnndb)
        Rdr = CmdSarch.ExecuteReader
        While Rdr.Read
            If Rs = False Then
                DaFirstVisit.Text = CDate(Rdr.GetValue(1).ToString).Date
                If Rdr.GetValue(2).ToString.Trim <> "" Then
                    ChkReLost.Checked = True
                    txtLClinicID.Text = Rdr.GetValue(2).ToString
                End If
                tsbDelete.Enabled = True
                tsbDelete1.Enabled = True
            End If
            DaDob.Text = CDate(Rdr.GetValue(3).ToString).Date
            RdSex.SelectedIndex = Rdr.GetValue(4).ToString
            RdReferred.SelectedIndex = Rdr.GetValue(5).ToString
            txtReferOther.Text = Rdr.GetValue(6).ToString
            txtEClinicID.Text = Rdr.GetValue(7).ToString
            DaTest.Text = CDate(Rdr.GetValue(8).ToString).Date
            RdTest.SelectedIndex = Rdr.GetValue(9).ToString
            For i As Int16 = 0 To CboVcctname.Properties.Items.Count - 1
                If Rdr.GetValue(10).ToString.Trim = Mid(CboVcctname.Properties.Items(i).ToString, 1, 6) Then
                    CboVcctname.SelectedIndex = i
                    Exit For
                End If
            Next
            txtVcctID.Text = Rdr.GetValue(11).ToString
            RdTransferIN.SelectedIndex = Rdr.GetValue(12).ToString
            tin = Rdr.GetValue(12).ToString
            For i As Int16 = 0 To CboTransferName.Properties.Items.Count - 1
                If Rdr.GetValue(13).ToString.Trim = Mid(CboTransferName.Properties.Items(i).ToString, 1, 4) Then
                    CboTransferName.SelectedIndex = i
                    Exit For
                End If
            Next
            DaART.Text = CDate(Rdr.GetValue(14).ToString).Date
            txtART.Text = Rdr.GetValue(15).ToString
            RdFeeding.SelectedIndex = Rdr.GetValue(16).ToString
            RdPastMedical.SelectedIndex = Rdr.GetValue(17).ToString
            RdTB.SelectedIndex = Rdr.GetValue(18).ToString
            RdResultTB.SelectedIndex = Rdr.GetValue(19).ToString
            DaOnset.Text = CDate(Rdr.GetValue(20).ToString).Date
            RdTBtreat.SelectedIndex = Rdr.GetValue(21).ToString
            DaTBtreat.Text = CDate(Rdr.GetValue(22).ToString).Date
            RdTBoutcome.SelectedIndex = Rdr.GetValue(23).ToString
            DaTBout.Text = CDate(Rdr.GetValue(24).ToString).Date
            Rdinh.SelectedIndex = Rdr.GetValue(25).ToString
            RdTPTdrug.SelectedIndex = Rdr.GetValue(26).ToString
            DaStartTPT.Text = CDate(Rdr.GetValue(27).ToString).Date
            DaEndTPT.Text = CDate(Rdr.GetValue(28).ToString).Date
            RdPastARV.SelectedIndex = Rdr.GetValue(29).ToString
            RdContri.SelectedIndex = Rdr.GetValue(30).ToString
            RdFluco.SelectedIndex = Rdr.GetValue(31).ToString
            RdAllergy.SelectedIndex = Rdr.GetValue(32).ToString
            For i As Int16 = 0 To CboSiteOld.Properties.Items.Count - 1
                If Rdr.GetValue(34).ToString.Trim = Mid(CboSiteOld.Properties.Items(i).ToString, 1, 4) Then
                    CboSiteOld.SelectedIndex = i
                    Exit For
                End If
            Next
            txtOldClinicID.Text = Rdr.GetValue(33).ToString
            For ii As Int16 = 0 To CboNationality.Properties.Items.Count - 1
                    Dim n() As String = Split(CboNationality.Properties.Items(ii).ToString, "--")
                Try
                    If Rdr.GetValue(35).ToString.Trim = n(0) Then
                        CboNationality.Text = n(1)
                        Exit For
                    End If
                Catch ex As Exception
                End Try
            Next

        End While
        Rdr.Close()
        Dim CmdFamily As New MySqlCommand("Select * from tblcifamily where clinicid ='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdFamily.ExecuteReader
        While Rdr.Read
            Dim dr As DataRow = dt1.NewRow()
            Select Case CDec(Rdr.GetValue(1).ToString)
                Case 0
                    dr(0) = "Mother"
                Case 1
                    dr(0) = "Father"
                Case Else
                    dr(0) = ""
            End Select
            dr(1) = Rdr.GetValue(2).ToString.Trim
            Select Case CDec(Rdr.GetValue(3).ToString)
                Case 1
                    dr(2) = "Postive"
                Case 0
                    dr(2) = "Negative"
                Case 2
                    dr(2) = "Unknown"
                Case Else
                    dr(2) = ""
            End Select
            Select Case CDec(Rdr.GetValue(4).ToString)
                Case 0
                    dr(3) = "Dead"
                Case 1
                    dr(3) = "Alive"
                Case 2
                    dr(3) = "Unknown"
                Case Else
                    dr(3) = ""
            End Select
            Select Case CDec(Rdr.GetValue(5).ToString)
                Case 0
                    dr(4) = "Yes"
                Case 1
                    dr(4) = "No"
                Case 2
                    dr(4) = "Unknown"
                Case Else
                    dr(4) = ""
            End Select
            Select Case CDec(Rdr.GetValue(6).ToString)
                Case 0
                    dr(5) = "During pregnancy"
                Case 1
                    dr(5) = "During delivery"
                Case 2
                    dr(5) = "After delivery"
                Case Else
                    dr(5) = ""
            End Select
            For i As Int16 = 0 To CboTransferName.Properties.Items.Count - 1
                If Rdr.GetValue(7).ToString.Trim = Mid(CboTransferName.Properties.Items(i).ToString, 1, 4) Then
                    dr(6) = CboTransferName.Properties.Items(i).ToString
                    Exit For
                End If
            Next
            Select Case CDec(Rdr.GetValue(8).ToString)
                Case 0
                    dr(7) = "Yes"
                Case 1
                    dr(7) = "No"
                Case 2
                    dr(7) = "Unknown"
                Case Else
                    dr(7) = ""
            End Select
            dt1.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl2.DataSource = dt1
        Dim CmdPast As New MySqlCommand("Select * from tblciothpast where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdPast.ExecuteReader
        Dim x As Integer
        While Rdr.Read
            x = x + 1
            Select Case x
                Case 1
                    CboDrugARV1.Text = Rdr.GetValue(1).ToString
                    CboClinicARV1.Text = Rdr.GetValue(2).ToString
                    DaStartARV1.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV1.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV1.Text = Rdr.GetValue(5).ToString
                Case 2
                    CboDrugARV2.Text = Rdr.GetValue(1).ToString
                    CboClinicARV2.Text = Rdr.GetValue(2).ToString
                    DaStartARV2.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV2.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV2.Text = Rdr.GetValue(5).ToString
                Case 3
                    CboDrugARV3.Text = Rdr.GetValue(1).ToString
                    CboClinicARV3.Text = Rdr.GetValue(2).ToString
                    DaStartARV3.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV3.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV3.Text = Rdr.GetValue(5).ToString
                Case 4
                    CboDrugARV4.Text = Rdr.GetValue(1).ToString
                    CboClinicARV4.Text = Rdr.GetValue(2).ToString
                    DaStartARV4.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV4.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV4.Text = Rdr.GetValue(5).ToString
                Case 5
                    CboDrugARV5.Text = Rdr.GetValue(1).ToString
                    CboClinicARV5.Text = Rdr.GetValue(2).ToString
                    DaStartARV5.Text = CDate(Rdr.GetValue(3).ToString).Date
                    DaStopARV5.Text = CDate(Rdr.GetValue(4).ToString).Date
                    CboNoteARV5.Text = Rdr.GetValue(5).ToString
            End Select
        End While
        Rdr.Close()
        Dim CmdFlu As New MySqlCommand("Select * from tblcifluconazole where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdFlu.ExecuteReader
        While Rdr.Read
            CboClinicARV7.Text = Rdr.GetValue(1).ToString
            DaStartARV7.Text = CDate(Rdr.GetValue(2).ToString).Date
            DaStopARV7.Text = CDate(Rdr.GetValue(3).ToString).Date
            CboNoteARV7.Text = Rdr.GetValue(4).ToString
        End While
        Rdr.Close()
        Dim CmdCotr As New MySqlCommand("Select * from tblcicotrim where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdCotr.ExecuteReader
        While Rdr.Read
            CboClinicARV6.Text = Rdr.GetValue(1).ToString
            DaStartARV6.Text = CDate(Rdr.GetValue(2).ToString).Date
            DaStopARV6.Text = CDate(Rdr.GetValue(3).ToString).Date
            CboNoteARV6.Text = Rdr.GetValue(4).ToString
        End While
        Rdr.Close()

        Dim Cmdall As New MySqlCommand("SELECT  DrugName, Allergy FROM  tblciallergy Where ClinicID='" & txtClinicID.Text & "'", Cnndb)
        Rdr = Cmdall.ExecuteReader
        Dim i1 As Integer
        While Rdr.Read
            i1 = i1 + 1
            If i1 = 1 Then
                CboDrugAllergy1.Enabled = True
                CboAllergy1.Enabled = True
                CboDrugAllergy1.Text = Trim(Rdr.GetValue(0).ToString)
                CboAllergy1.Text = Trim(Rdr.GetValue(1).ToString)
            End If
            If i1 = 2 Then
                CboDrugAllergy2.Enabled = True
                CboAllergy2.Enabled = True
                CboDrugAllergy2.Text = Trim(Rdr.GetValue(0).ToString)
                CboAllergy2.Text = Trim(Rdr.GetValue(1).ToString)
            End If
            If i1 = 3 Then
                CboDrugAllergy3.Enabled = True
                CboAllergy3.Enabled = True
                CboDrugAllergy3.Text = Trim(Rdr.GetValue(0).ToString)
                CboAllergy3.Text = Trim(Rdr.GetValue(1).ToString)
            End If
            If i1 = 4 Then
                CboDrugAllergy4.Enabled = True
                CboAllergy4.Enabled = True
                CboDrugAllergy4.Text = Trim(Rdr.GetValue(0).ToString)
                CboAllergy4.Text = Trim(Rdr.GetValue(1).ToString)
            End If
            If i1 = 5 Then
                CboDrugAllergy5.Enabled = True
                CboAllergy5.Enabled = True
                CboDrugAllergy5.Text = Trim(Rdr.GetValue(0).ToString)
                CboAllergy5.Text = Trim(Rdr.GetValue(1).ToString)
            End If
            If i1 = 6 Then
                CboDrugAllergy6.Enabled = True
                CboAllergy6.Enabled = True
                CboDrugAllergy6.Text = Trim(Rdr.GetValue(0).ToString)
                CboAllergy6.Text = Trim(Rdr.GetValue(1).ToString)
            End If
        End While
        Rdr.Close()

    End Sub
    Private Sub Del()
        If MessageBox.Show("Are you sure do you want to delete ?", "Delete....", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
            Dim Cmddelcu As New MySqlCommand("Delete from tblcumain where clinicid='" & txtClinicID.Text & "'", Cnndb)
            Cmddelcu.ExecuteNonQuery()
            Dim CmdDela As New MySqlCommand("delete from tblcart where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela.ExecuteNonQuery()
            Dim CmdDela1 As New MySqlCommand("delete from tblciallergy where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela1.ExecuteNonQuery()
            Dim CmdDela2 As New MySqlCommand("delete from tblcicotrim where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela2.ExecuteNonQuery()
            Dim CmdDela3 As New MySqlCommand("delete from tblcifamily where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela3.ExecuteNonQuery()
            Dim CmdDela4 As New MySqlCommand("delete from tblcifluconazole where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela4.ExecuteNonQuery()
            Dim CmdDela5 As New MySqlCommand("delete from tblciothpast where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela5.ExecuteNonQuery()
            Dim CmdDela6 As New MySqlCommand("delete from tblcimain where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela6.ExecuteNonQuery()
            Dim CmdDela7 As New MySqlCommand("delete from tblcvmain where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela7.ExecuteNonQuery()
            Dim CmdDela8 As New MySqlCommand("delete from tblcvpatientstatus where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela8.ExecuteNonQuery()
            Dim CmdDela9 As New MySqlCommand("delete from tblpatienttest where clinicid='" & txtClinicID.Text & "'", Cnndb)
            CmdDela9.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tblCImain','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Data is Deleted..", "Delete..", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub

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


    Private Sub ChkReLost_CheckedChanged(sender As Object, e As EventArgs) Handles ChkReLost.CheckedChanged
        If ChkReLost.Checked Then
            txtLClinicID.Enabled = True
        Else
            txtLClinicID.Enabled = False
            txtLClinicID.Text = ""
        End If
    End Sub

    Private Sub RdReferred_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdReferred.SelectedIndexChanged
        If RdReferred.SelectedIndex = 3 Then
            txtReferOther.Enabled = True
        Else
            txtReferOther.Enabled = False
            txtReferOther.Text = ""
        End If
    End Sub

    Private Sub RdEID_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdEID.SelectedIndexChanged
        If RdEID.SelectedIndex = -1 Then
            txtEClinicID.Enabled = False
            txtEClinicID.Text = ""
        Else
            txtEClinicID.Enabled = True
        End If
    End Sub

    Private Sub DaTest_EditValueChanged(sender As Object, e As EventArgs) Handles DaTest.EditValueChanged
        If DateDiff(DateInterval.Day, CDate(DaTest.Text).Date, CDate("01/01/1900")) = 0 Then
            RdTest.Enabled = False
            RdTest.SelectedIndex = -1
        Else
            RdTest.Enabled = True
        End If
    End Sub

    Private Sub RdTransferIN_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTransferIN.SelectedIndexChanged
        If RdTransferIN.SelectedIndex = 1 Then
            CboTransferName.Enabled = True
            DaART.Enabled = True
            txtART.Enabled = True
        Else
            CboTransferName.Enabled = False
            CboTransferName.SelectedIndex = -1
            DaART.Enabled = False
            DaART.Text = "01/01/1900"
            txtART.Enabled = False
            txtART.Text = ""
        End If
    End Sub

    Private Sub RdPastMedical_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdPastMedical.SelectedIndexChanged
        If RdPastMedical.SelectedIndex > -1 And RdPastMedical.SelectedIndex >= 1 Or RdPastMedical.SelectedIndex = -1 Then
            RdTB.SelectedIndex = -1
            RdResultTB.SelectedIndex = -1
            DaOnset.Text = "01/01/1900"
            DaTBtreat.Text = "01/01/1900"
            RdTBtreat.SelectedIndex = -1
            RdTB.Enabled = False
            RdResultTB.Enabled = False
            DaOnset.Enabled = False
            DaTBtreat.Enabled = False
            RdTBtreat.Enabled = False
            RdTBoutcome.Enabled = False
            RdTBoutcome.SelectedIndex = -1
        Else
            RdTB.Enabled = True
            RdResultTB.Enabled = True
            DaOnset.Enabled = True
            DaTBtreat.Enabled = True
            RdTBtreat.Enabled = True
            RdTBoutcome.Enabled = True
        End If
    End Sub

    Private Sub tsbNew_Click(sender As Object, e As EventArgs) Handles tsbNew.Click
        Clear()
    End Sub

    Private Sub RdTBoutcome_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdTBoutcome.SelectedIndexChanged
        If RdTBoutcome.SelectedIndex <> -1 Then
            DaTBout.Enabled = True
        Else
            DaTBout.Enabled = False
            DaTBout.Text = "01/01/1900"
        End If
    End Sub

    Private Sub RdPastARV_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdPastARV.SelectedIndexChanged
        If RdPastARV.SelectedIndex > 0 Then
            CboDrugARV1.Enabled = True
        Else
            CboDrugARV1.Enabled = False
            CboDrugARV1.SelectedIndex = -1
        End If

    End Sub

    Private Sub RdAllergy_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdAllergy.SelectedIndexChanged
        If RdAllergy.SelectedIndex = 0 Then
            CboDrugAllergy1.Enabled = True
        Else
            CboDrugAllergy1.Enabled = False
            CboDrugAllergy2.Enabled = False
            CboDrugAllergy3.Enabled = False
            CboDrugAllergy4.Enabled = False
            CboDrugAllergy5.Enabled = False
            CboDrugAllergy6.Enabled = False
            CboDrugAllergy1.SelectedIndex = -1
            CboDrugAllergy2.SelectedIndex = -1
            CboDrugAllergy3.SelectedIndex = -1
            CboDrugAllergy4.SelectedIndex = -1
            CboDrugAllergy5.SelectedIndex = -1
            CboDrugAllergy6.SelectedIndex = -1
            CboAllergy1.Enabled = False
            CboAllergy2.Enabled = False
            CboAllergy3.Enabled = False
            CboAllergy4.Enabled = False
            CboAllergy5.Enabled = False
            CboAllergy6.Enabled = False
            CboAllergy1.SelectedIndex = -1
            CboAllergy2.SelectedIndex = -1
            CboAllergy3.SelectedIndex = -1
            CboAllergy4.SelectedIndex = -1
            CboAllergy5.SelectedIndex = -1
            CboAllergy6.SelectedIndex = -1
        End If
    End Sub

    Private Sub DaStartARV1_EditValueChanged(sender As Object, e As EventArgs) Handles DaStartARV1.EditValueChanged
        CheckStartDate(DaStartARV1, DaStopARV1, CboNoteARV1)
    End Sub

    Private Sub DaStartARV2_EditValueChanged(sender As Object, e As EventArgs) Handles DaStartARV2.EditValueChanged
        CheckStartDate(DaStartARV2, DaStopARV2, CboNoteARV2)
    End Sub

    Private Sub DaStartARV3_EditValueChanged(sender As Object, e As EventArgs) Handles DaStartARV3.EditValueChanged
        CheckStartDate(DaStartARV3, DaStopARV3, CboNoteARV3)
    End Sub

    Private Sub DaStartARV4_EditValueChanged(sender As Object, e As EventArgs) Handles DaStartARV4.EditValueChanged
        CheckStartDate(DaStartARV4, DaStopARV4, CboNoteARV4)
    End Sub

    Private Sub DaStartARV5_EditValueChanged(sender As Object, e As EventArgs) Handles DaStartARV5.EditValueChanged
        CheckStartDate(DaStartARV5, DaStopARV5, CboNoteARV5)
    End Sub



    Private Sub DaFirstVisit_EditValueChanged(sender As Object, e As EventArgs) Handles DaFirstVisit.EditValueChanged
        If CDate(DaDob.EditValue) <= CDate("01/01/1900") Then Exit Sub

        If CDate(DaFirstVisit.EditValue) > Now.Date Then DaFirstVisit.EditValue = "01/01/1900"
        If CDate(DaFirstVisit.EditValue) <= CDate("01/01/1900") Then Exit Sub

        txtAge.Text = DateDiff(DateInterval.Year, CDate(DaDob.EditValue), CDate(DaFirstVisit.EditValue))
        If CDec(txtAge.Text) < 0 Then
            MessageBox.Show("Invalid date first Visit !", "Check Date first", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DaFirstVisit.Text = "01/01/1900"
            Exit Sub
        End If
    End Sub

    Private Sub btnAdd_Click(sender As Object, e As EventArgs) Handles btnAdd.Click
        'GridControl2.MainView.
        If CboFamily.SelectedIndex = -1 Then MessageBox.Show("Please Select Group of Family", "Required...", MessageBoxButtons.OK, MessageBoxIcon.Exclamation) : Exit Sub
        For i As Integer = 0 To GridView2.RowCount - 1
            With GridView2
                If .GetRowCellValue(i, "Family") = CboFamily.Text.Trim And .GetRowCellValue(i, "Age") = txtFange.Text.Trim And .GetRowCellValue(i, "HIV Status") = CboFStatusHIV.Text And .GetRowCellValue(i, "Family Status") = CboFstatus.Text Then
                    Exit Sub
                End If
            End With
        Next i
        Dim dr As DataRow = dt1.NewRow()
        dr(0) = CboFamily.Text
        dr(1) = txtFange.Text
        dr(2) = CboFStatusHIV.Text
        dr(3) = CboFstatus.Text
        Select Case RdFart.SelectedIndex
            Case 0
                dr(4) = "Yes"
            Case 1
                dr(4) = "No"
            Case 2
                dr(4) = "Unknown"
        End Select
        Select Case RdPregnant.SelectedIndex
            Case 0
                dr(5) = "During pregnancy"
            Case 1
                dr(5) = "During delivery"
            Case 2
                dr(5) = "After delivery"
        End Select

        dr(6) = CboFnameART.Text

        dr(7) = CboFhTB.Text

        dt1.Rows.Add(dr)
        GridView2.BestFitColumns(True)
        GridControl2.DataSource = dt1

    End Sub

    Private Sub CboFamily_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboFamily.SelectedIndexChanged
        If CboFamily.SelectedIndex = 0 Then
            RdPregnant.Enabled = True
        Else
            RdPregnant.Enabled = False
            RdPregnant.SelectedIndex = -1
        End If
    End Sub

    Private Sub DaDob_EditValueChanged(sender As Object, e As EventArgs) Handles DaDob.EditValueChanged
        If CDate(DaDob.EditValue) > Now.Date Then DaDob.EditValue = "01/01/1900"
        If CDate(DaDob.EditValue) <= CDate("01/01/1900") Then Exit Sub
        txtAge.Text = DateDiff(DateInterval.Year, CDate(DaDob.EditValue), CDate(DaFirstVisit.EditValue))
        If CDec(txtAge.Text) < 0 Then
            MessageBox.Show("Invalid Date of Birth", "Check Date of Birth", MessageBoxButtons.OK, MessageBoxIcon.Information)
            txtAge.Text = ""
            DaDob.Text = "01/01/1900"
            Exit Sub
        End If
    End Sub
    Private Sub CboDrugAllergy1_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy1.SelectedIndexChanged
        Allergy(CboDrugAllergy1, CboAllergy1, CboDrugAllergy2)
    End Sub

    Private Sub CboDrugAllergy2_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy2.SelectedIndexChanged
        Allergy(CboDrugAllergy2, CboAllergy2, CboDrugAllergy3)
    End Sub

    Private Sub CboDrugAllergy3_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy3.SelectedIndexChanged
        Allergy(CboDrugAllergy3, CboAllergy3, CboDrugAllergy4)
    End Sub

    Private Sub CboDrugAllergy4_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy4.SelectedIndexChanged
        Allergy(CboDrugAllergy4, CboAllergy4, CboDrugAllergy5)
    End Sub

    Private Sub CboDrugAllergy5_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy5.SelectedIndexChanged
        Allergy(CboDrugAllergy5, CboAllergy5, CboDrugAllergy6)
    End Sub


    Private Sub tsbSave1_Click(sender As Object, e As EventArgs) Handles tsbSave1.Click
        Save()
    End Sub

    Private Sub tsbNew1_Click(sender As Object, e As EventArgs) Handles tsbNew1.Click
        Clear()
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub


    Private Sub CboDrugAllergy6_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboDrugAllergy6.SelectedIndexChanged
        Allergy(CboDrugAllergy6, CboAllergy6, CboDrugAllergy6)
    End Sub


    Private Sub txtClinicID_Leave(sender As Object, e As EventArgs) Handles txtClinicID.Leave
        If IsNumeric(txtClinicID.Text) Then
            txtClinicID.Text = "P" & Format(Val(txtClinicID.Text), "000000")
            If txtClinicID.Text = "P000000" Then
                MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                txtClinicID.Text = ""
                Exit Sub
            End If
            Search(txtClinicID)
        End If
    End Sub


    Private Sub txtLClinicID_Leave(sender As Object, e As EventArgs) Handles txtLClinicID.Leave
        If IsNumeric(txtLClinicID.Text) Then
            txtLClinicID.Text = "P" & Format(Val(txtLClinicID.Text), "000000")
            If txtLClinicID.Text = "P000000" Then
                MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                txtLClinicID.Text = ""
                Exit Sub
            End If
            Rs = True
            Search(txtLClinicID)
            Rs = False
        End If
    End Sub

    Private Sub XtraTabControl1_Click(sender As Object, e As EventArgs) Handles XtraTabControl1.Click
        If XtraTabControl1.SelectedTabPageIndex = 1 Then
            txtClinicID.Focus()
        End If
    End Sub
    Private Sub txtART_Leave(sender As Object, e As EventArgs) Handles txtART.Leave
        If Len(Trim(txtART.Text.Trim)) < 9 Then MsgBox("Invalid ART number ", MsgBoxStyle.Critical, "ART Number") : txtART.Text = "" : Exit Sub
        If IsNumeric(txtART.Text) Then
            txtART.Text = "P" & Format(Val(txtART.Text.Trim), "000000000")
        End If
    End Sub
    Private Sub CboFStatusHIV_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboFStatusHIV.SelectedIndexChanged
        If CboFStatusHIV.SelectedIndex = 0 Then
            RdFart.Enabled = False
            RdFart.SelectedIndex = -1
            CboFnameART.Enabled = False
            CboFnameART.SelectedIndex = -1

        Else
            RdFart.Enabled = True
            CboFnameART.Enabled = True
        End If
    End Sub

    Private Sub btnDelete_Click(sender As Object, e As EventArgs) Handles btnDelete.Click
        If GridView2 Is Nothing Or GridView2.SelectedRowsCount = 0 Then
            Return
        End If
        Dim row As DataRow() = New DataRow(GridView2.SelectedRowsCount - 1) {}
        For i As Int16 = 0 To GridView2.SelectedRowsCount - 1
            row(i) = GridView2.GetDataRow(GridView2.GetSelectedRows(i))
        Next
        GridView2.BeginSort()
        Try
            For Each rows As DataRow In row
                rows.Delete()
            Next
        Finally
            GridView2.EndSort()
        End Try
    End Sub

    Private Sub RdContri_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdContri.SelectedIndexChanged
        If RdContri.SelectedIndex = 0 Then
            CboClinicARV6.Enabled = True
            DaStartARV6.Enabled = True
            DaStopARV6.Enabled = True
            CboNoteARV6.Enabled = True
        Else
            CboClinicARV6.SelectedIndex = -1
            CboClinicARV6.Enabled = False
            DaStartARV6.Enabled = False
            DaStartARV6.Text = "01/01/1900"
            DaStopARV6.Enabled = False
            DaStopARV6.Text = "01/01/1900"
            CboNoteARV6.Enabled = False
            CboNoteARV6.SelectedIndex = -1
        End If
    End Sub

    Private Sub RdFluco_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdFluco.SelectedIndexChanged
        If RdFluco.SelectedIndex = 0 Then
            CboClinicARV7.Enabled = True
            DaStartARV7.Enabled = True
            DaStopARV7.Enabled = True
            CboNoteARV7.Enabled = True
        Else
            CboClinicARV7.Enabled = False
            CboClinicARV7.SelectedIndex = -1
            DaStartARV7.Enabled = False
            DaStartARV7.Text = "01/01/1900"
            DaStopARV7.Enabled = False
            DaStopARV7.Text = "01/01/1900"
            CboNoteARV7.SelectedIndex = -1
            CboNoteARV7.Enabled = False
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
    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        If txtClinicID.Text = "" Then Exit Sub
        XtraTabControl1.SelectedTabPageIndex = 1
        tsbDelete.Enabled = True
        Search(txtClinicID)
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Del()
    End Sub

    Private Sub tsbDelete1_Click(sender As Object, e As EventArgs) Handles tsbDelete1.Click
        Del()
    End Sub

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub

    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub txtAge_KeyDown(sender As Object, e As KeyEventArgs) Handles txtAge.KeyDown
        ag = True
    End Sub

    Private Sub txtAge_Leave(sender As Object, e As EventArgs) Handles txtAge.Leave
        If txtAge.EditValue <> "" Then
            ' dastarmanage.Text = Now.Date
            If CDate(DaFirstVisit.Text) < CDate("01/01/1960") Then

                DaFirstVisit.Text = Now.Date

                DaFirstVisit.Text = Now().Date

            End If
            '  DaDob.Text = CDate(DateAdd(DateInterval.Year, -Val(txtAge.EditValue), CDate(DaFirstVisit.Text)))
            If CDate(DaDob.EditValue) <= CDate("01/01/2010") Or ag = True Then
                DaDob.EditValue = DateAdd(DateInterval.Year, -Val(txtAge.EditValue), CDate(DaFirstVisit.Text))
            End If
            ag = False
        End If

        If CInt(Val(txtAge.EditValue)) > 14 Then

        End If
        If CInt(If(txtAge.EditValue IsNot "", txtAge.EditValue, 0)) > 14 Then

            MessageBox.Show("Invalid Age of child Patient", "Check Age", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
            DaDob.Text = "01/01/1900"
            DaFirstVisit.EditValue = "01/01/1900"
            txtAge.Text = ""
        End If
    End Sub

    Private Sub tspClinicID_Click(sender As Object, e As EventArgs) Handles tspClinicID.Click

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

    Private Sub txtClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtClinicID.EditValueChanged

    End Sub

    Private Sub txtLClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtLClinicID.EditValueChanged

    End Sub

    Private Sub tscView_Click(sender As Object, e As EventArgs) Handles tscView.Click

    End Sub

    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            Dim i As Int64
            dt.Clear()
            If IsNumeric(tspClinicID.Text) Then
                tspClinicID.Text = "P" & Format(Val(tspClinicID.Text), "000000")
                If tspClinicID.Text = "P000000" Then
                    MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                    tspClinicID.Text = ""
                    Exit Sub
                End If
            End If
            Dim CmdSearch As New MySqlCommand("SELECT * FROM preart.tblcimain left join tblnationality on tblcimain.Nationality=tblnationality.Nid  where tblcimain.clinicid='" & tspClinicID.Text & "' order by tblcimain.ClinicID", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                dr(1) = Rdr.GetValue(0).ToString
                dr(2) = Format(CDate(Rdr.GetValue(1).ToString), "dd/MM/yyyy")
                dr(3) = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Rdr.GetValue(1).ToString))
                Select Case CDec(Rdr.GetValue(4).ToString)
                    Case 0
                        dr(4) = "Female"
                    Case 1
                        dr(4) = "Male"
                End Select
                Select Case CDec(Rdr.GetValue(5).ToString)
                    Case 0
                        dr(5) = "Self Referral"
                    Case 1
                        dr(5) = "CA/NGO"
                    Case 2
                        dr(5) = "VCCT"
                    Case 3
                        dr(5) = "Other"
                End Select
                Select Case CDec(Rdr.GetValue(12).ToString)
                    Case 0
                        dr(6) = False
                    Case 1
                        dr(6) = True
                End Select
                dr(7) = Rdr.GetValue(13).ToString.Trim
                dr(8) = Rdr.GetValue(15).ToString.Trim
                If Rdr.GetValue(2).ToString.Trim = "" Then
                    dr(9) = False
                Else
                    dr(9) = True
                End If
                dr(10) = Rdr.GetValue(37).ToString.Trim
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub Rdinh_SelectedIndexChanged(sender As Object, e As EventArgs) Handles Rdinh.SelectedIndexChanged
        DaStartTPT.Enabled = False
        DaStartTPT.Text = "01/01/1900"
        DaEndTPT.Enabled = False
        DaEndTPT.Text = "01/01/1900"
        RdTPTdrug.Enabled = False
        RdTPTdrug.SelectedIndex = -1
        If Rdinh.SelectedIndex = 0 Then
            DaStartTPT.Enabled = True
            DaEndTPT.Enabled = True
            RdTPTdrug.Enabled = True
        ElseIf Rdinh.SelectedIndex = 3 Then
            DaStartTPT.Enabled = True
            RdTPTdrug.Enabled = True
        End If
    End Sub
End Class