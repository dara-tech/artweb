Imports DevExpress.XtraGrid.Views.Grid.ViewInfo
Imports MySql.Data.MySqlClient
Imports DevExpress.XtraEditors
Imports DevExpress.XtraGrid
Public Class frmReTest
    Dim Rdr As MySqlDataReader
    Dim dt As DataTable
    Dim id As Integer
    Dim vSite As String = ""
    Dim vCode As String = ""
    Private Sub frmReTest_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        loadData()
        Clear()
    End Sub
    Private Sub loadData()

        Dim CmdVsite As New MySqlCommand("SELECT * FROM tblcenter", Cnndb)
        Rdr = CmdVsite.ExecuteReader
        While Rdr.Read
            vSite = Rdr.GetValue(3).ToString.Trim
        End While
        Rdr.Close()
        MessageBox.Show("VCCT Site: " & vSite)
        Dim CmdVcode As New MySqlCommand("SELECT * FROM tblvcctsite order by Vid", Cnndb)
        Rdr = CmdVcode.ExecuteReader
        While Rdr.Read
            cboVCCTCode.Properties.Items.Add(Rdr.GetValue(0).ToString.Trim + " -- " + Rdr.GetValue(1).ToString.Trim)
        End While
        Rdr.Close()

        dt = New DataTable
        dt.Columns.Add("No", GetType(Double))
        dt.Columns.Add("VCCT-ID", GetType(String))
        dt.Columns.Add("Site-Name", GetType(String))
        dt.Columns.Add("Sex", GetType(String))
        dt.Columns.Add("Age", GetType(Int32))
        dt.Columns.Add("Result-ReTest", GetType(String))
        dt.Columns.Add("Date-Test", GetType(Date))
        dt.Columns.Add("Status", GetType(Boolean))
        dt.Columns.Add("ID", GetType(Double))
        GridControl1.DataSource = dt
        GridView1.Columns("ID").Visible = False

        Dim gridFormatRule As New GridFormatRule()
        Dim formatConditionRuleExpression As New FormatConditionRuleExpression()
        gridFormatRule.Column = GridView1.Columns(5)
        gridFormatRule.ApplyToRow = True
        formatConditionRuleExpression.PredefinedName = "Red Text"
        formatConditionRuleExpression.Expression = "[Result-ReTest] == 'Positive'"
        gridFormatRule.Rule = formatConditionRuleExpression
        GridView1.FormatRules.Add(gridFormatRule)
    End Sub
    Private Sub Clear()
        txtVcctID.Enabled = True
        rdSex.Enabled = True
        cboVCCTCode.Enabled = True
        txtAge.Enabled = True
        chkStatus.Checked = False
        txtVcctID.Text = ""
        cboVCCTCode.SelectedIndex = -1
        rdSex.SelectedIndex = -1
        txtAge.Text = ""
        rdResultHIV.SelectedIndex = -1
        DaTest.EditValue = Now.Date
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        Save()
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

    Private Sub Save()
        If tsbDelete.Enabled = False Then
            If txtVcctID.Text = "" Then MessageBox.Show("Please input VCCT-ID") : Exit Sub
            If cboVCCTCode.SelectedIndex = -1 Then MessageBox.Show("Please select VCCT-Code") : Exit Sub
            If rdSex.SelectedIndex = -1 Then MessageBox.Show("Please select Sex") : Exit Sub
            If txtAge.Text = "" Then MessageBox.Show("Please input Age") : Exit Sub
            If rdResultHIV.SelectedIndex = -1 Then MessageBox.Show("Please select HIV Result") : Exit Sub
            If chkStatus.Checked And vSite = vCode Then
                MessageBox.Show("អ្នកេជំងឺមិនមែនមកពី Site ផ្សេងទេ")
                Clear()
                Exit Sub
            End If
            Dim cmdReTest As New MySqlCommand("Insert into tblretest(Vcctid, VCCTCode, sex, Age, Result, DateTest, status) values('" & CInt(txtVcctID.Text.Trim) & "','" &
                                              cboVCCTCode.Text.Substring(0, 6) & "','" &
                                              rdSex.EditValue.ToString & "','" &
                                              txtAge.EditValue.ToString & "','" &
                                              rdResultHIV.EditValue.ToString & "','" &
                                              Format(CDate(DaTest.EditValue), "yyyy-MM-dd") & "','" &
                                              If(chkStatus.Checked, 1, 0) & "')", Cnndb)
            cmdReTest.ExecuteNonQuery()
            MessageBox.Show("Data were saved successfully!")
            Clear()
        Else
            If txtVcctID.Text = "" Then MessageBox.Show("Please input VCCT-ID") : Exit Sub
            If cboVCCTCode.SelectedIndex = -1 Then MessageBox.Show("Please select VCCT-Code") : Exit Sub
            If rdSex.SelectedIndex = -1 Then MessageBox.Show("Please select Sex") : Exit Sub
            If txtAge.Text = "" Then MessageBox.Show("Please input Age") : Exit Sub
            If rdResultHIV.SelectedIndex = -1 Then MessageBox.Show("Please select HIV Result") : Exit Sub
            If chkStatus.Checked And vSite = vCode Then
                MessageBox.Show("អ្នកេជំងឺមិនមែនមកពី Site ផ្សេងទេ")
                Clear()
                Exit Sub
            End If
            Dim cmdReTest As New MySqlCommand("Update tblretest Set Vcctid='" & CInt(txtVcctID.Text.Trim) &
                                                             "',VCCTCode='" & cboVCCTCode.Text.Substring(0, 6) &
                                                             "',sex='" & rdSex.EditValue.ToString &
                                                             "',Age='" & txtAge.EditValue.ToString &
                                                             "',Result='" & rdResultHIV.EditValue.ToString &
                                                             "',DateTest='" & Format(CDate(DaTest.EditValue), "yyyy-MM-dd") &
                                                             "',status='" & If(chkStatus.Checked, 1, 0) & "' where id='" & id & "'", Cnndb)
            cmdReTest.ExecuteNonQuery()
            MessageBox.Show("Data were updated successfully!")
            Clear()
        End If

    End Sub

    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Clear()
    End Sub

    Private hitInfo As GridHitInfo = Nothing
    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub

    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        Clear()
        tsbDelete.Enabled = True
        id = CInt(GridView1.GetRowCellValue(hitInfo.RowHandle(), "ID"))
        TabControl1.SelectedIndex = 1
        Search()
    End Sub

    Private Sub Search()
        Dim vCod As String = ""
        Dim VCCTStringCode As String = ""
        Dim CmdVcct As New MySqlCommand("Select * from tblretest where id='" & id & "'", Cnndb)
        Rdr = CmdVcct.ExecuteReader
        While Rdr.Read
            txtVcctID.Text = Rdr.GetValue(1).ToString
            vCod = Rdr.GetValue(2).ToString
            rdSex.EditValue = Rdr.GetValue(3).ToString
            txtAge.Text = Rdr.GetValue(4).ToString
            rdResultHIV.EditValue = Rdr.GetValue(5).ToString
            DaTest.EditValue = Format(CDate(Rdr.GetValue(6).ToString), "dd/MM/yyyy")
            Select Case Val(Rdr.GetValue(7).ToString)
                Case 0
                    chkStatus.Checked = False
                Case 1
                    chkStatus.Checked = True
            End Select
        End While
        Rdr.Close()

        Dim CmdVcode As New MySqlCommand("SELECT * FROM tblvcctsite where Vid='" & vCod & "';", Cnndb)
        Rdr = CmdVcode.ExecuteReader
        While Rdr.Read
            VCCTStringCode = Rdr.GetValue(0).ToString.Trim + " -- " + Rdr.GetValue(1).ToString.Trim
        End While
        Rdr.Close()
        cboVCCTCode.Text = VCCTStringCode
    End Sub

    Private Sub ViewData()
        Dim i As Int64
        Dim CmdSearch As New MySqlCommand("select Vcctid,VCCTCode,sex,Age,Result,DateTest,status,id from tblretest;", Cnndb)
        Rdr = CmdSearch.ExecuteReader

        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dt.NewRow()
            dr(0) = i
            'MessageBox.Show(Rdr.GetValue(0).ToString)
            dr(1) = Rdr.GetValue(0).ToString
            dr(2) = Rdr.GetValue(1).ToString
            Select Case Val(Rdr.GetValue(2).ToString)
                Case 0
                    dr(3) = "Female"
                Case 1
                    dr(3) = "Male"
            End Select
            dr(4) = Val(Rdr.GetValue(3).ToString)
            Select Case Val(Rdr.GetValue(4).ToString)
                Case 1
                    dr(5) = "Negative"
                Case 2
                    dr(5) = "Positive"
                Case 3
                    dr(5) = "Unknown"
            End Select
            dr(6) = Format(CDate(Rdr.GetValue(5).ToString), "dd/MM/yyyy")
            Select Case Val(Rdr.GetValue(6).ToString)
                Case 0
                    dr(7) = False
                Case 1
                    dr(7) = True
            End Select
            dr(8) = Val(Rdr.GetValue(7).ToString)
            dt.Rows.Add(dr)
        End While
        Rdr.Close()
        GridControl1.DataSource = dt
    End Sub

    Private Sub tspVCCTID_KeyDown(sender As Object, e As KeyEventArgs) Handles tspVCCTID.KeyDown
        If e.KeyCode = Keys.Enter Then
            dt.Clear()
            Dim i As Int64
            Dim CmdSearch As New MySqlCommand("select Vcctid,VCCTCode,sex,Age,Result,DateTest,status,id from tblretest where Vcctid='" & tspVCCTID.Text & "'order by Vcctid;", Cnndb)
            Rdr = CmdSearch.ExecuteReader

            While Rdr.Read
                i = i + 1
                Dim dr As DataRow = dt.NewRow()
                dr(0) = i
                'MessageBox.Show(Rdr.GetValue(0).ToString)
                dr(1) = Rdr.GetValue(0).ToString
                dr(2) = Rdr.GetValue(1).ToString
                Select Case Val(Rdr.GetValue(2).ToString)
                    Case 0
                        dr(3) = "Female"
                    Case 1
                        dr(3) = "Male"
                End Select
                dr(4) = Val(Rdr.GetValue(3).ToString)
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 1
                        dr(5) = "Negative"
                    Case 2
                        dr(5) = "Positive"
                    Case 3
                        dr(5) = "Unknown"
                End Select
                dr(6) = Format(CDate(Rdr.GetValue(5).ToString), "dd/MM/yyyy")
                Select Case Val(Rdr.GetValue(6).ToString)
                    Case 0
                        dr(7) = False
                    Case 1
                        dr(7) = True
                End Select
                dr(8) = Val(Rdr.GetValue(7).ToString)
                dt.Rows.Add(dr)
            End While
            Rdr.Close()
            GridControl1.DataSource = dt
        End If
    End Sub

    Private Sub txtVcctID_Leave(sender As Object, e As EventArgs) Handles txtVcctID.Leave

        Dim VCCTStringCode As String = ""
        If chkStatus.Checked = False Then
            Dim CmdSearch As New MySqlCommand("select Vcctid,Sex,DaDob,DaReg from tblvcct where Vcctid='" & CInt(txtVcctID.Text.Trim) & "';", Cnndb)
            Rdr = CmdSearch.ExecuteReader

            If Rdr.HasRows Then
                While Rdr.Read
                    txtVcctID.Text = Rdr.GetValue(0).ToString
                    rdSex.EditValue = Rdr.GetValue(1).ToString
                    txtAge.EditValue = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(2).ToString), CDate(Rdr.GetValue(3).ToString))

                End While
                Rdr.Close()

                Dim CmdVcode As New MySqlCommand("SELECT * FROM tblvcctsite where Vid='" & vSite & "';", Cnndb)
                Rdr = CmdVcode.ExecuteReader
                While Rdr.Read
                    VCCTStringCode = Rdr.GetValue(0).ToString.Trim + " -- " + Rdr.GetValue(1).ToString.Trim
                End While
                Rdr.Close()
                txtVcctID.Enabled = False
                rdSex.Enabled = False
                cboVCCTCode.Text = VCCTStringCode
                cboVCCTCode.Enabled = False
                txtAge.Enabled = False
            Else
                MessageBox.Show("លេខកូដអតិថិជននេះមិនមានក្នុង Site ទេ!")
                Rdr.Close()
                Exit Sub
            End If

        End If
    End Sub

    Private Sub txtVcctID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtVcctID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub cboVCCTCode_SelectedIndexChanged(sender As Object, e As EventArgs) Handles cboVCCTCode.SelectedIndexChanged
        vCode = If(cboVCCTCode.SelectedIndex = -1, "", cboVCCTCode.Text.Substring(0, 6))
        'Dim vSite As String = "V12-09"
        'Dim vCode As String = "V12-09"
        'Dim comp As Boolean
        'MessageBox.Show("SiteLen: " & vSite.Length)
        'MessageBox.Show("VcodeLen: " & vCode.Length)
        'MessageBox.Show(vCode)
        'comp = vSite = vCode
        'MessageBox.Show("Compare: '" & comp & "'")
        If chkStatus.Checked And vSite = vCode Then
            MessageBox.Show("អ្នកេជំងឺមិនមែនមកពី Site ផ្សេងទេ")
            cboVCCTCode.SelectedIndex = -1
            Exit Sub
        End If
    End Sub

    Private Sub tsbDelete_Click(sender As Object, e As EventArgs) Handles tsbDelete.Click
        Delete()
    End Sub

    Private Sub Delete()
        If vbYes = MessageBox.Show("តើលោកអ្នកពិតជាចង់លប់ទិន្នន័យនេះមែនទេ ?", "Delete..", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then

            Dim CmdDels As New MySqlCommand("Delete from tblretest where id='" & id & "'", Cnndb)
            CmdDels.ExecuteNonQuery()

            'Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & Val(txtVcctID.Text) & "','tblvcct','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            'Cmdlog.ExecuteNonQuery()
            'MessageBox.Show("លេខកូដអតិថិជន  " & Vcctid & "  និងលេខកូដសេវា  " & VCCTcode & " នេះត្រូវបានលប់ហើយ...", "Delete....", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Clear()
        End If
    End Sub
End Class