Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Public Class frmInfantTest
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim Eid As String
    'Dim chdna As String
    Dim Dab As Date

    Private Sub frmInfantTest_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Clear()
        loaddata()
    End Sub
#Region "Function"
    Private Sub Clear()
        txtClinicID.Text = ""
        txtClinicID.Enabled = True
        txtClinicID.Focus()
        DaBirth.EditValue = "01/01/1900"
        RdSex.SelectedIndex = -1
        txtMclinicID.Text = ""
        txtMart.Text = ""
        ChkPCR1.Checked = False
        ChkCPCR1.Checked = False
        ChkOI.Enabled = False
        ChkOI.Checked = False
        ChkTestConfirm.Checked = False
        DaArrival.Text = "01/01/1900"
        DaBlood.Text = "01/01/1900"
        txtLabCode.Text = ""
        DaGblood.Text = "01/01/1900"
        DaAblood.Text = "01/01/1900"
        RdResult.SelectedIndex = -1
        DaReresult.Text = "01/01/1900"
        ChkDBS.Checked = False
        ChkLab.Checked = False
        ChkNotDefine.Checked = False
        txtOther.Text = ""
        RdResult.Enabled = False
        Eid = ""
        tsbDelete.Enabled = False
        RdDNA.SelectedIndex = -1
        RdDNA.Properties.Items(0).Enabled = True
        'RdDNA.Properties.Items(1).Enabled = True
        RdDNA.Properties.Items(2).Enabled = True
        RdDNA.Properties.Items(3).Enabled = True
        RdDNA.Properties.Items(4).Enabled = True
        RdDNA.Properties.Items(5).Enabled = True
        'chdna = ""
    End Sub
    'Private Sub loaddata()
    '    dt = New DataTable
    '    dt.Columns.Add("No", GetType(Int16))
    '    dt.Columns.Add("ClinicID", GetType(String))
    '    dt.Columns.Add("Type of Test", GetType(String))
    '    dt.Columns.Add("Date​​ Blood", GetType(Date))
    '    dt.Columns.Add("LabID", GetType(String))
    '    dt.Columns.Add("Result", GetType(String))
    '    dt.Columns.Add("Date Result", GetType(Date))
    '    dt.Columns.Add("Tid", GetType(String))
    '    GridControl1.DataSource = dt
    '    GridView1.Columns("Tid").Visible = False
    'End Sub
    'Sithorn..........................
    Private Sub loaddata()
        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Age(M)", GetType(String))
        dt.Columns.Add("DNA PCR Test", GetType(String))

        dt.Columns.Add("Date​​ Blood", GetType(Date))
        dt.Columns.Add("LabID", GetType(String))
        dt.Columns.Add("Result", GetType(String))
        dt.Columns.Add("Date Result", GetType(Date))
        dt.Columns.Add("Date​​ Arrival", GetType(Date))
        dt.Columns.Add("Tid", GetType(String))
        GridControl1.DataSource = dt
        GridView1.Columns("Tid").Visible = False
    End Sub
    '.................................
    'Private Sub Save()
    '    If tsbDelete.Enabled = False Then
    '        If MessageBox.Show("Are you sure do you want to save !", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Information) = DialogResult.Yes Then
    '            If txtLabCode.EditValue = "" Then
    '                Eid = txtClinicID.Text & Format(CDate(DaBlood.Text), "ddMMyy")
    '            Else
    '                Eid = txtClinicID.Text & Format(CDate(DaReresult.Text), "ddMMyy")
    '            End If
    '            Dim Dbo, DgB, DaB, Dr As Date
    '            If CDate(DaBlood.Text) = CDate("01/01/1900") Then
    '                Dbo = "01/01/1900"
    '            Else
    '                Dbo = DaBlood.EditValue
    '            End If
    '            If CDate(DaGblood.EditValue) = CDate("01/01/1900") Then
    '                DgB = "01/01/1900"
    '            Else
    '                DgB = DaGblood.EditValue
    '            End If
    '            If CDate(DaAblood.EditValue) = CDate("01/01/1900") Then
    '                DaB = "01/01/1900"
    '            Else
    '                DaB = DaAblood.EditValue
    '            End If
    '            If CDate(DaReresult.EditValue) = CDate("01/01/1900") Then
    '                Dr = "01/01/1900"
    '            Else
    '                Dr = DaReresult.EditValue
    '            End If
    '            Dim P1, P2, O1, C1 As String
    '            If ChkPCR1.Checked Then
    '                P1 = "True"
    '            Else
    '                P1 = "False"
    '            End If
    '            If ChkCPCR1.Checked Then
    '                P2 = "True"
    '            Else
    '                P2 = "False"
    '            End If
    '            If ChkOI.Checked Then
    '                O1 = "True"
    '            Else
    '                O1 = "False"
    '            End If
    '            If ChkTestConfirm.Checked Then
    '                C1 = "True "
    '            Else
    '                C1 = "False"
    '            End If
    '            '  Try
    '            Dim Cmdsave As New MySqlCommand("insert into tbletest values('" & txtClinicID.Text & "','" & P1 & "','" & P2 & "','" & O1 & "','" & C1 & "','" & Format(Dbo, "yyyy-MM-dd") & "','" & txtLabCode.Text & "'," &
    '                                            "'" & Format(DgB, "yyyy-MM-dd") & "','" & Format(DaB, "yyyy-MM-dd") & "','" & RdResult.SelectedIndex & "','" & Format(Dr, "yyyy-MM-dd") & "','" & ChkDBS.Checked & "','" & ChkLab.Checked & "','" & ChkNotDefine.Checked & "','" & txtOther.Text.Trim & "','" & Eid & "')", Cnndb)
    '            Cmdsave.ExecuteNonQuery()
    '            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tbletest','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
    '            Cmdlog.ExecuteNonQuery()
    '            MessageBox.Show("Saving is completed...", "Save....", MessageBoxButtons.OK, MessageBoxIcon.Information)
    '            Clear()
    '            'Catch ex As Exception
    '            '    MessageBox.Show("The data have already exit!", "Check Data again", MessageBoxButtons.OK, MessageBoxIcon.Error)
    '            'End Try

    '        End If
    '    Else
    '        If MessageBox.Show("Are you sure do you want to Edit !", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Information) = DialogResult.Yes Then
    '            Dim CmdEdit As New MySqlCommand("Update tbletest set PCR='" & ChkPCR1.Checked & "',ConfirmPCR='" & ChkCPCR1.Checked & "',OI='" & ChkOI.Checked & "',TestConfirm='" & ChkTestConfirm.Checked & "',DaBlood='" & Format(CDate(DaBlood.EditValue), "yyyy-MM-dd") & "',LabID='" & txtLabCode.Text & "'," &
    '                                        "DaReceive='" & Format(CDate(DaGblood.EditValue), "yyyy-MM-dd") & "',DaAnalys='" & Format(CDate(DaAblood.EditValue), "yyyy-MM-dd") & "',Result='" & RdResult.SelectedIndex & "',DaRresult='" & Format(CDate(DaReresult.EditValue), "yyyy-MM-dd") & "',DBS='" & ChkDBS.Checked & "',Technic='" & ChkLab.Checked & "',ResultIn='" & ChkNotDefine.Checked & "',Other='" & txtOther.Text.Trim & "' where TID='" & Eid & "'", Cnndb)
    '            CmdEdit.ExecuteNonQuery()
    '            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tbletest','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
    '            Cmdlog.ExecuteNonQuery()
    '            MessageBox.Show("Edit is completed...", "Edit....", MessageBoxButtons.OK, MessageBoxIcon.Information)
    '            Clear()
    '        End If
    '    End If
    'End Sub
    'Sithorn...........................
    Private Sub Save()
        If txtClinicID.Text.Trim = "" Then MessageBox.Show("Please input ClinicID") : Exit Sub 'sithorn
        If RdDNA.EditValue Is Nothing Then MessageBox.Show("Please select PCR DNA test") : Exit Sub 'sithorn
        'If CStr(RdDNA.EditValue) <> chdna Then MessageBox.Show("DNA PCR in Visit Form on date: '" & Format(CDate(DaBlood.Text), "dd/MM/yyyy") & "' is not selected or not the same as infant test.") : Exit Sub 'sithorn
        If DaBlood.Text = "" Or DaBlood.Text = "01/01/1900" Then
            MessageBox.Show("Please input Date of Bloody")
            DaBlood.Focus()
            Exit Sub 'sithorn
        End If

        If DaArrival.Text = "" Or DaArrival.Text = "01/01/1900" Then
            MessageBox.Show("Please input Date of Blood Arrival")
            DaArrival.Focus()
            Exit Sub 'sithorn
        End If

        If CDate(DaArrival.Text) < CDate(DaReresult.Text) Then
            MessageBox.Show("Please input Date of Blood Arrival")
            DaArrival.Focus()
            Exit Sub 'sithorn
        End If

        'If CDate(DaBlood.Text) < Dar Or CDate(DaBlood.Text) < Dab Then
        If CDate(DaBlood.Text) < Dab Then
            MessageBox.Show("Date of Bloody can not less than Date of Birth.")
            DaBlood.Text = "01/01/1900"
            DaBlood.Focus()
            Exit Sub 'sithorn
        End If
        If RdResult.SelectedIndex = -1 Then MessageBox.Show("Please select PCR DNA Result") : Exit Sub 'sithorn
        If DaReresult.Text = "" Or DaReresult.Text = "01/01/1900" Then
            MessageBox.Show("Please input Date of PCR DNA Result")
            DaReresult.Focus()
            Exit Sub 'sithorn
        End If
        If CDate(DaReresult.Text) < CDate(DaBlood.Text) Or CDate(DaReresult.Text) < CDate(DaGblood.Text) Or CDate(DaReresult.Text) < CDate(DaAblood.Text) Then
            MessageBox.Show("Invalid Date of PCR DNA Result")
            DaReresult.Focus()
            Exit Sub 'sithorn
        End If
        If tsbDelete.Enabled = False Then
            If MessageBox.Show("Are you sure do you want to save !", "Save....", MessageBoxButtons.YesNo, MessageBoxIcon.Information) = DialogResult.Yes Then
                If txtLabCode.EditValue Is Nothing Then
                    Eid = txtClinicID.Text & Format(CDate(DaBlood.Text), "ddMMyy") '& If(RdDNA.EditValue Is Nothing, "", CStr(RdDNA.EditValue))
                Else
                    Eid = txtClinicID.Text & Format(CDate(DaReresult.Text), "ddMMyy") '& If(RdDNA.EditValue Is Nothing, "", CStr(RdDNA.EditValue))
                End If
                Dim O1 As String
                If ChkOI.Checked Then
                    O1 = "True"
                Else
                    O1 = "False"
                End If
                Try
                    Dim Cmdsave As New MySqlCommand("insert into tbletest values('" & txtClinicID.Text & "','" & If(RdDNA.EditValue Is Nothing, -1, CInt(RdDNA.EditValue)) & "','" & Format(CDate(DaArrival.EditValue), "yyyy-MM-dd") & "','" & O1 & "','" & Format(CDate(DaBlood.EditValue), "yyyy-MM-dd") & "','" & txtLabCode.Text & "'," &
                                                "'" & Format(CDate(DaGblood.EditValue), "yyyy-MM-dd") & "','" & Format(CDate(DaAblood.EditValue), "yyyy-MM-dd") & "','" & RdResult.SelectedIndex & "','" & Format(CDate(DaReresult.EditValue), "yyyy-MM-dd") & "','" & ChkDBS.Checked & "','" & ChkLab.Checked & "','" & ChkNotDefine.Checked & "','" & txtOther.Text.Trim & "','" & Eid & "')", Cnndb)
                    Cmdsave.ExecuteNonQuery()
                    Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tbletest','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    Cmdlog.ExecuteNonQuery()
                    MessageBox.Show("Saving is completed...", "Save....", MessageBoxButtons.OK, MessageBoxIcon.Information)
                    Clear()
                Catch ex As Exception
                    'MessageBox.Show("The data have already exit!", "Check Data again", MessageBoxButtons.OK, MessageBoxIcon.Error)
                    MessageBox.Show(ex.Message)
                End Try

            End If
        Else
            If MessageBox.Show("Are you sure do you want to Edit !", "Edit....", MessageBoxButtons.YesNo, MessageBoxIcon.Information) = DialogResult.Yes Then
                Dim CmdEdit As New MySqlCommand("Update tbletest set DNAPcr='" & If(RdDNA.EditValue Is Nothing, -1, CInt(RdDNA.EditValue)) & "',DaPcrArr='" & Format(CDate(DaArrival.EditValue), "yyyy-MM-dd") & "',OI='" & ChkOI.Checked & "',DaBlood='" & Format(CDate(DaBlood.EditValue), "yyyy-MM-dd") & "',LabID='" & txtLabCode.Text & "'," &
                                            "DaReceive='" & Format(CDate(DaGblood.EditValue), "yyyy-MM-dd") & "',DaAnalys='" & Format(CDate(DaAblood.EditValue), "yyyy-MM-dd") & "',Result='" & RdResult.SelectedIndex & "',DaRresult='" & Format(CDate(DaReresult.EditValue), "yyyy-MM-dd") & "',DBS='" & ChkDBS.Checked & "',Technic='" & ChkLab.Checked & "',ResultIn='" & ChkNotDefine.Checked & "',Other='" & txtOther.Text.Trim & "' where TID='" & Eid & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tbletest','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MessageBox.Show("Edit is completed...", "Edit....", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Clear()
            End If
        End If
    End Sub
    '..................................
    Private Sub Search()
        'Dim CmdSearch As New MySqlCommand("Select * from tbleimain where clinicid='" & txtClinicID.Text & "'", Cnndb)
        'Rdr = CmdSearch.ExecuteReader
        'While Rdr.Read
        '    DaBirth.Text = CDate(Rdr.GetValue(2).ToString).Date
        '    RdSex.SelectedIndex = Rdr.GetValue(3).ToString
        '    txtMclinicID.Text = Rdr.GetValue(19).ToString
        '    txtMart.Text = Rdr.GetValue(20).ToString
        '    txtClinicID.Enabled = False
        '    '  tsbDelete.Enabled = True
        'End While
        'Rdr.Close()
        'Sithorn..................
        Dim CmdSearch As New MySqlCommand("Select * from tbleimain where clinicid='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        If Rdr.HasRows Then
            While Rdr.Read
                Dab = CDate(Rdr.GetValue(2).ToString).Date
                DaBirth.Text = Dab
                RdSex.SelectedIndex = Rdr.GetValue(3).ToString
                txtMclinicID.Text = Rdr.GetValue(19).ToString
                txtMart.Text = Rdr.GetValue(20).ToString
                txtClinicID.Enabled = False
                '  tsbDelete.Enabled = True
            End While
            Rdr.Close()
        Else
            Rdr.Close()
            MessageBox.Show("This ClinicID is not registered")
            txtClinicID.Text = ""
            txtClinicID.Focus()
            Exit Sub
        End If


        'Search DNA
        'Dim CmdSearchdna As New MySqlCommand("select ClinicID,DatVisit,DNA,OtherDNA,DaApp,Vid from tblevmain where ClinicID='" & txtClinicID.Text & "' order by ClinicID,DatVisit desc limit 1;", Cnndb)
        'Rdr = CmdSearchdna.ExecuteReader
        'While Rdr.Read
        '    chdna = Rdr.GetValue(2).ToString
        'End While
        'Rdr.Close()
        '.......................
    End Sub
    'Private Sub ViewData()
    '    Dim i As Int32
    '    Dim Ts As String
    '    Dim CmdSearch As New MySqlCommand("SELECT tbleimain.ClinicID, tbletest.PCR, tbletest.ConfirmPCR, tbletest.OI, tbletest.TestConfirm, tbletest.DaBlood, tbletest.LabID, tbletest.Result, tbletest.DaRresult, tbletest.TID FROM         tbleimain LEFT OUTER JOIN       tbletest ON tbleimain.ClinicID = tbletest.ClinicID where tid is not null ORDER BY tbleimain.ClinicID, tbletest.DaBlood", Cnndb)
    '    Rdr = CmdSearch.ExecuteReader
    '    While Rdr.Read
    '        i = i + 1
    '        Dim dr As DataRow = dt.NewRow()
    '        dr(0) = i
    '        dr(1) = Rdr.GetValue(0).ToString
    '        If Rdr.GetValue(1).ToString = True Then
    '            dr(2) = "DNA PCR"
    '        End If
    '        If Rdr.GetValue(2).ToString = True Then
    '            dr(2) = "Confirm DNA PCR"
    '        End If
    '        If Rdr.GetValue(3).ToString = True Then
    '            dr(2) = "OI"
    '        End If
    '        If Rdr.GetValue(4).ToString = True Then
    '            dr(2) = "Confirm OI"
    '        End If
    '        dr(3) = CDate(Rdr.GetValue(5).ToString)
    '        dr(4) = Rdr.GetValue(6).ToString
    '        Select Case Val(Rdr.GetValue(7).ToString)
    '            Case 0
    '                dr(5) = "Negative"
    '            Case 1
    '                dr(5) = "Positive"
    '            Case 2
    '                dr(5) = "Unknown"
    '        End Select
    '        dr(6) = Rdr.GetValue(8).ToString
    '        dr(7) = Rdr.GetValue(9).ToString
    '        dt.Rows.Add(dr)
    '    End While
    '    Rdr.Close()
    '    GridControl1.DataSource = dt
    'End Sub

    'Sithorn.............................
    Private Sub ViewData()
        Dim i As Int32
        Dim Ts As String
        'Dim CmdSearch As New MySqlCommand("SELECT ei.ClinicID,if(ei.Sex=0,'Female','Male') Sex,timestampdiff(month, ei.DaBirth,et.DaBlood) Age,if(et.DNAPcr=0 or et.DNAPcr=1 or et.DNAPcr=2 or et.DNAPcr=5,'DNA PCR',if(et.DNAPcr=3 and et.OI='True','OI',if(et.DNAPcr=4 and et.OI='True','Confirm OI',if(et.DNAPcr=4,'Confirm DNA PCR','')))) TestType,et.OI,et.DaPcrArr,et.DaBlood,et.LabID,if(et.Result=0,'Negative',if(et.Result=1,'Positive',if(et.Result=2,'Unknown',''))) Result,et.DaRresult,et.TID FROM tbleimain ei LEFT OUTER JOIN tbletest et ON ei.ClinicID = et.ClinicID where et.tid is not null ORDER BY ei.ClinicID, et.DaBlood,et.DaRresult", Cnndb)
        'Rdr = CmdSearch.ExecuteReader
        Dim CmdSearch As New MySqlCommand("SELECT ei.ClinicID,if(ei.Sex=0,'Female','Male') Sex,if(timestampdiff(month, ei.DaBirth,et.DaBlood)>=0,timestampdiff(month, ei.DaBirth,et.DaBlood),'') Age,if(et.DNAPcr=0,'នៅពេលកើត',if(et.DNAPcr=1,'ចន្លោះពី ៤​ ទៅ ៦ សប្តាហ៍',if(et.DNAPcr=2,'៦សប្តាហ៍ ក្រោយពេលផ្តាច់ដោះ',if(et.DNAPcr=5,'នៅអាយុ ៩ខែ',if(et.DNAPcr=3 and et.OI='True','OI',if(et.DNAPcr=4 and et.OI='True','តេស្តបញ្ជាក់ OI',if(et.DNAPcr=4,'តេស្តបញ្ជាក់',''))))))) DNAPCR,et.OI,et.DaPcrArr,et.DaBlood,et.LabID,if(et.Result=0,'Negative',if(et.Result=1,'Positive',if(et.Result=2,'Unknown',''))) Result,et.DaRresult,et.TID FROM tbleimain ei LEFT OUTER JOIN tbletest et ON ei.ClinicID = et.ClinicID where et.tid is not null ORDER BY ei.ClinicID,et.DaRresult;", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            dr(1) = Rdr.GetValue(0).ToString
            dr(2) = Rdr.GetValue(1).ToString
            dr(3) = Rdr.GetValue(2).ToString
            dr(4) = Rdr.GetValue(3).ToString
            dr(5) = Rdr.GetValue(6).ToString
            dr(6) = Rdr.GetValue(7).ToString
            dr(7) = Rdr.GetValue(8).ToString
            dr(8) = Rdr.GetValue(9).ToString
            dr(9) = Rdr.GetValue(5).ToString
            dr(10) = Rdr.GetValue(10).ToString

            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub
    'Sithorn.............................
    'Private Sub Searchmain()
    '    Dim CmdSearch As New MySqlCommand("select * from tbletest where tid='" & Eid & "'", Cnndb)
    '    Rdr = CmdSearch.ExecuteReader
    '    While Rdr.Read
    '        ChkPCR1.Checked = Rdr.GetValue(1).ToString
    '        ChkCPCR1.Checked = Rdr.GetValue(2).ToString
    '        ChkOI.Checked = Rdr.GetValue(3).ToString
    '        ChkTestConfirm.Checked = Rdr.GetValue(4).ToString
    '        DaBlood.Text = Format(CDate(Rdr.GetValue(5).ToString), "dd/MM/yyyy")
    '        txtLabCode.Text = Rdr.GetValue(6).ToString
    '        DaGblood.Text = Format(CDate(Rdr.GetValue(7).ToString), "dd/MM/yyyy")
    '        DaAblood.Text = Format(CDate(Rdr.GetValue(8).ToString), "dd/MM/yyyy")
    '        RdResult.SelectedIndex = Rdr.GetValue(9).ToString
    '        DaReresult.Text = Format(CDate(Rdr.GetValue(10).ToString), "dd/MM/yyyy")
    '        ChkDBS.Checked = Rdr.GetValue(11).ToString
    '        ChkLab.Checked = Rdr.GetValue(12).ToString
    '        ChkNotDefine.Checked = Rdr.GetValue(13).ToString
    '        txtOther.Text = Rdr.GetValue(14).ToString
    '    End While
    '    Rdr.Close()
    'End Sub
    'Sithorn.......................
    Private Sub Searchmain()
        Dim CmdSearch As New MySqlCommand("select * from tbletest where tid='" & Eid & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            'chdna = Rdr.GetValue(1).ToString
            RdDNA.EditValue = Rdr.GetValue(1).ToString
            DaArrival.EditValue = DateTime.Parse(Rdr.GetValue(2).ToString) 'Format(CDate(Rdr.GetValue(2).ToString), "dd/MM/yyyy")
            ChkOI.Checked = Rdr.GetValue(3).ToString
            DaBlood.EditValue = DateTime.Parse(Rdr.GetValue(4).ToString) 'Format(CDate(Rdr.GetValue(4).ToString), "dd/MM/yyyy")
            txtLabCode.Text = Rdr.GetValue(5).ToString
            DaGblood.EditValue = DateTime.Parse(Rdr.GetValue(6).ToString) 'Format(CDate(Rdr.GetValue(6).ToString), "dd/MM/yyyy")
            DaAblood.EditValue = DateTime.Parse(Rdr.GetValue(7).ToString) 'Format(CDate(Rdr.GetValue(7).ToString), "dd/MM/yyyy")
            RdResult.SelectedIndex = Rdr.GetValue(8).ToString
            DaReresult.EditValue = DateTime.Parse(Rdr.GetValue(9).ToString) 'Format(CDate(Rdr.GetValue(9).ToString), "dd/MM/yyyy")
            ChkDBS.Checked = Rdr.GetValue(10).ToString
            ChkLab.Checked = Rdr.GetValue(11).ToString
            ChkNotDefine.Checked = Rdr.GetValue(12).ToString
            txtOther.Text = Rdr.GetValue(13).ToString
        End While
        Rdr.Close()
    End Sub
    '..............................
#End Region
    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
    End Sub
    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Clear()
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        If MessageBox.Show("Are you sure do you want to Delete?", "Delete...", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = DialogResult.Yes Then
            Dim Cmddel As New MySqlCommand("Delete from tbletest where Tid ='" & Eid & "'", Cnndb)
            Cmddel.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtClinicID.Text & "','tbletest','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("The Data have been Deleted", "Delete...", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
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
            CheckStatus()
            'CheckTest()
        End If
    End Sub
    'Sithorn.................
    Private Sub CheckTest()
        Dim optTest, resPcr As Int32
        Dim CmdChtest As New MySqlCommand(" Select * From tbletest Where ClinicID ='" & txtClinicID.Text & "'" & " order by DaBlood;", Cnndb)
        Rdr = CmdChtest.ExecuteReader
        While Rdr.Read
            resPcr = CInt(Rdr.GetValue(8).ToString)
            optTest = CInt(Rdr.GetValue(1).ToString)
            Select Case optTest
                Case 0 'at birth
                    optTest = 0
                Case 1 '4 to 6 weeks
                    optTest = 2
                Case 2 '3m after breastfeeding
                    optTest = 1
                Case 3 'other
                    optTest = 3
                Case 4 'confirm
                    optTest = 5
                Case 5 '9m
                    optTest = 4
            End Select
            If optTest <> -1 Then
                If optTest = 0 Then
                    RdDNA.Properties.Items(0).Enabled = False
                ElseIf optTest = 1 Then
                    RdDNA.Properties.Items(1).Enabled = False
                ElseIf optTest = 2 Then
                    RdDNA.Properties.Items(2).Enabled = False
                ElseIf optTest = 3 Then
                    RdDNA.Properties.Items(3).Enabled = False
                ElseIf optTest = 4 Then
                    RdDNA.Properties.Items(4).Enabled = False
                End If
                If resPcr = 1 Then
                    RdDNA.Properties.Items(5).Enabled = True
                Else
                    RdDNA.Properties.Items(5).Enabled = False
                End If
            End If
        End While
        Rdr.Close()
    End Sub

    Private Sub CheckStatus()
        Dim st As String = ""
        Dim dat As String = ""
        Dim CmdSearch As New MySqlCommand("select ClinicID,if(Status=0,'PCR+',if(Status=1,'HIV+',if(Status=2,'HIV-',if(Status=3,'Death',if(Status=4,'Lost',''))))) Status,DaStatus,Vid from tblevpatientstatus where ClinicID='" & txtClinicID.Text & "'", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        If Rdr.HasRows Then
            While Rdr.Read
                st = Rdr.GetValue(1).ToString
                dat = Format(CDate(Rdr.GetValue(2).ToString).Date, "dd/MM/yyyy")
            End While
            Rdr.Close()
            MessageBox.Show("This ClinicID is " & st & " date: " & dat)
            Clear()
            txtClinicID.Focus()
            Exit Sub
        Else
            Rdr.Close()
        End If
    End Sub
    '...........................
    Private Sub txtClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    'Private Sub ChkPCR1_CheckedChanged(sender As Object, e As EventArgs) Handles ChkPCR1.CheckedChanged
    '    DaBlood.Enabled = False
    '    If ChkPCR1.Checked = True Then
    '        DaBlood.Enabled = True
    '    End If
    'End Sub

    'Private Sub ChkCPCR1_CheckedChanged(sender As Object, e As EventArgs) Handles ChkCPCR1.CheckedChanged
    '    DaBlood.Enabled = False
    '    If ChkCPCR1.Checked = True Then
    '        DaBlood.Enabled = True
    '    End If
    'End Sub

    'Private Sub ChkOI_CheckedChanged(sender As Object, e As EventArgs) Handles ChkOI.CheckedChanged
    '    DaBlood.Enabled = False
    '    If ChkOI.Checked = True Then
    '        DaBlood.Enabled = True
    '    End If
    'End Sub

    'Private Sub ChkTestConfirm_CheckedChanged(sender As Object, e As EventArgs) Handles ChkTestConfirm.CheckedChanged
    '    DaBlood.Enabled = False
    '    If ChkTestConfirm.Checked = True Then
    '        DaBlood.Enabled = True
    '    End If
    'End Sub

    Private Sub txtLabCode_EditValueChanged(sender As Object, e As EventArgs) Handles txtLabCode.EditValueChanged
        If txtLabCode.Text.Trim <> "" Then
            ' DaGblood.Enabled = True
            DaAblood.Enabled = True
            RdResult.Enabled = True
            DaReresult.Enabled = True
            ChkDBS.Enabled = True
            ChkLab.Enabled = True
            ChkNotDefine.Enabled = True
            txtOther.Enabled = True
            DaArrival.Enabled = True
        Else
            'DaGblood.Enabled = False
            DaAblood.Enabled = False
            RdResult.Enabled = False
            DaReresult.Enabled = False
            ChkDBS.Enabled = False
            ChkLab.Enabled = False
            ChkNotDefine.Enabled = False
            txtOther.Enabled = False
            DaArrival.Enabled = False
        End If
    End Sub

    Private Sub txtLabCode_Leave(sender As Object, e As EventArgs) Handles txtLabCode.Leave

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



    Private Sub tspClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Int32
            If IsNumeric(tspClinicID.Text) Then
                tspClinicID.Text = "E" & frmMain.Art & Format(Val(tspClinicID.Text), "0000")
                If tspClinicID.Text = "E00000000" Then
                    MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                    tspClinicID.Text = ""
                    Exit Sub
                End If
            End If

            Dim CmdSearch As New MySqlCommand("SELECT ei.ClinicID,if(ei.Sex=0,'Female','Male') Sex,if(timestampdiff(month, ei.DaBirth,et.DaBlood)>=0,timestampdiff(month, ei.DaBirth,et.DaBlood),'') Age,if(et.DNAPcr=0,'នៅពេលកើត',if(et.DNAPcr=1,'ចន្លោះពី ៤​ ទៅ ៦ សប្តាហ៍',if(et.DNAPcr=2,'៦សប្តាហ៍ ក្រោយពេលផ្តាច់ដោះ',if(et.DNAPcr=5,'នៅអាយុ ៩ខែ',if(et.DNAPcr=3 and et.OI='True','OI',if(et.DNAPcr=4 and et.OI='True','តេស្តបញ្ជាក់ OI',if(et.DNAPcr=4,'តេស្តបញ្ជាក់',''))))))) DNAPCR,et.OI,et.DaPcrArr,et.DaBlood,et.LabID,if(et.Result=0,'Negative',if(et.Result=1,'Positive',if(et.Result=2,'Unknown',''))) Result,et.DaRresult,et.TID FROM tbleimain ei LEFT OUTER JOIN tbletest et ON ei.ClinicID = et.ClinicID where ei.ClinicID='" & tspClinicID.Text & "' ORDER BY ei.ClinicID,et.DaRresult", Cnndb)
            Rdr = CmdSearch.ExecuteReader
            While Rdr.Read
                Try
                    i = i + 1
                    Dim dr As DataRow = dt.NewRow()
                    dr(0) = i
                    dr(1) = Rdr.GetValue(0).ToString
                    dr(2) = Rdr.GetValue(1).ToString
                    dr(3) = Rdr.GetValue(2).ToString
                    dr(4) = Rdr.GetValue(3).ToString
                    dr(5) = Rdr.GetValue(6).ToString
                    dr(6) = Rdr.GetValue(7).ToString
                    dr(7) = Rdr.GetValue(8).ToString
                    dr(8) = Rdr.GetValue(9).ToString
                    dr(9) = Rdr.GetValue(5).ToString
                    dr(10) = Rdr.GetValue(10).ToString
                    dt.Rows.Add(dr)


                Catch ex As Exception
                    MsgBox(ex.Message)
                End Try
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
            tspClinicID.Select(tspClinicID.Text.Length, 0)
        End If
    End Sub

    Private Sub GridControl1_Click(sender As Object, e As EventArgs) Handles GridControl1.Click

    End Sub
    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Eid = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Tid")
        txtClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        XtraTabControl1.SelectedTabPageIndex = 1
        tsbDelete.Enabled = True
        Search()
        Searchmain()
    End Sub
    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub RdDNA_SelectedIndexChanged(sender As Object, e As EventArgs) Handles RdDNA.SelectedIndexChanged
        If RdDNA.SelectedIndex = 3 Or RdDNA.SelectedIndex = 5 Then
            ChkOI.Enabled = True
            DaArrival.Enabled = True
            DaBlood.Enabled = True
        ElseIf RdDNA.SelectedIndex = -1 Then
            ChkOI.Enabled = False
            ChkOI.Checked = False
            DaArrival.Enabled = False
            DaBlood.Enabled = False
        Else
            ChkOI.Enabled = False
            ChkOI.Checked = False
            DaArrival.Enabled = True
            DaBlood.Enabled = True
        End If
    End Sub

    Private Sub DaArrival_KeyDown(sender As Object, e As KeyEventArgs) Handles DaArrival.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaBlood_KeyDown(sender As Object, e As KeyEventArgs) Handles DaBlood.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtLabCode_KeyDown(sender As Object, e As KeyEventArgs) Handles txtLabCode.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaGblood_KeyDown(sender As Object, e As KeyEventArgs) Handles DaGblood.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaAblood_KeyDown(sender As Object, e As KeyEventArgs) Handles DaAblood.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub DaReresult_KeyDown(sender As Object, e As KeyEventArgs) Handles DaReresult.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tspClinicID_KeyPress(sender As Object, e As KeyPressEventArgs) Handles tspClinicID.KeyPress
        If Not Char.IsDigit(e.KeyChar) AndAlso Not Char.IsControl(e.KeyChar) Then
            e.Handled = True
        End If
    End Sub

    Private Sub Panel1_Paint(sender As Object, e As PaintEventArgs) Handles Panel1.Paint

    End Sub

    Private Sub ToolStrip2_ItemClicked(sender As Object, e As ToolStripItemClickedEventArgs) Handles ToolStrip2.ItemClicked

    End Sub

    'Private Sub DaBlood_Leave(sender As Object, e As EventArgs) Handles DaBlood.Leave
    '    CheckDNAPcr()
    'End Sub

    'Private Sub RdDNA_Leave(sender As Object, e As EventArgs) Handles RdDNA.Leave
    '    If tsbDelete.Enabled = True Then
    '        CheckDNAPcr()
    '    End If
    'End Sub
    'Private Sub CheckDNAPcr()
    '    'Search DNA
    '    'MessageBox.Show("show chdna:  " & chdna)
    '    If DaBlood.Text = "" Then DaBlood.Text = "01/01/1900"
    '    Dim CmdSearchdna As New MySqlCommand("select ClinicID,DatVisit,DNA,OtherDNA,DaApp,Vid from tblevmain where ClinicID='" & txtClinicID.Text & "' and DatVisit='" & Format(CDate(DaBlood.Text), "yyyy-MM-dd") & "';", Cnndb)
    '    Rdr = CmdSearchdna.ExecuteReader
    '    While Rdr.Read
    '        chdna = Rdr.GetValue(2).ToString
    '    End While
    '    Rdr.Close()
    'End Sub
End Class