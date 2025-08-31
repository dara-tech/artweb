Imports MySql.Data.MySqlClient
Imports DevExpress.XtraGrid.Views.Grid.ViewInfo

Public Class frmCode
    Dim dt, dt1, dt2 As DataTable
    Dim Rdr As MySqlDataReader
    Private hitInfo As GridHitInfo = Nothing
    Dim ec, ac, cc As String

    Private Sub txtEClinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtEClinicID.EditValueChanged

    End Sub

    Private Sub frmCode_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Loaddata()
    End Sub

    Private Sub txtCclinicID_EditValueChanged(sender As Object, e As EventArgs) Handles txtCclinicID.EditValueChanged

    End Sub
#Region "Function"
    Private Sub Loaddata()
        dt = New DataTable
        dt.Columns.Add("No", GetType(Int16))
        dt.Columns.Add("ClinicID", GetType(String))
        dt.Columns.Add("Code", GetType(String))
        dt.Columns.Add("Type Code", GetType(String))
        dt.Columns.Add("From ART", GetType(Boolean))
        dt.Columns.Add("Expiry Date", GetType(String))
        GridControl1.DataSource = dt
        dt1 = New DataTable
        dt1.Columns.Add("No", GetType(Int16))
        dt1.Columns.Add("ClinicID", GetType(String))
        dt1.Columns.Add("Code", GetType(String))
        dt1.Columns.Add("Type Code", GetType(String))
        dt1.Columns.Add("From ART", GetType(Boolean))
        dt1.Columns.Add("Expiry Date", GetType(String))
        GridControl2.DataSource = dt1
        dt2 = New DataTable
        dt2.Columns.Add("No", GetType(Int16))
        dt2.Columns.Add("ClinicID", GetType(String))
        dt2.Columns.Add("Code", GetType(String))
        dt2.Columns.Add("Type Code", GetType(String))
        dt2.Columns.Add("From ART", GetType(Boolean))
        dt2.Columns.Add("Expiry Date", GetType(String))

        GridControl3.DataSource = dt2
    End Sub
    Private Sub Reloaddata(tbl As String, dx As DataTable, gc As DevExpress.XtraGrid.GridControl)
        Dim i As Int32
        Dim CmdSearch As New MySqlCommand(tbl, Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            i = i + 1
            Dim dr As DataRow = dx.NewRow()
            dr(0) = i
            If dx Is dt2 Then
                dr(1) = Format(Val(Rdr.GetValue(0).ToString), "000000")
            Else
                dr(1) = Rdr.GetValue(0).ToString
            End If
            dr(2) = Rdr.GetValue(1).ToString
            dr(3) = Rdr.GetValue(2).ToString
            Select Case Val(Rdr.GetValue(3).ToString) 'Sithorn add
                Case -1
                    dr(4) = False
                Case 1
                    dr(4) = True
            End Select
            If Format(CDate(Rdr.GetValue(4).ToString), "dd/MM/yyyy") = "01/01/1900" Then
                dr(5) = ""
            Else
                dr(5) = Format(CDate(Rdr.GetValue(4).ToString), "dd/MM/yyyy")
            End If 'Sithorn add
            dx.Rows.Add(dr)
        End While
        Rdr.Close()
        gc.DataSource = dx
    End Sub
    Private Sub Eclear()
        txtEClinicID.Text = ""
        txtEcode.Text = ""
        CboEType.SelectedIndex = -1
        txtEClinicID.Enabled = True
        ChkebyART.Enabled = False
        DaEexpiry.Text = "01/01/1900"
        tsbEdelete.Enabled = False
    End Sub
    Private Sub Cclear()
        txtCclinicID.Text = ""
        txtCcode.Text = ""
        CboCtype.SelectedIndex = -1
        txtCclinicID.Enabled = True
        ChkcbyART.Enabled = False
        DaCexpiry.Text = "01/01/1900"
        tsbCdelete.Enabled = False
    End Sub
    Private Sub Aclear()
        txtAClinicID.Text = ""
        txtAcode.Text = ""
        CboAtype.SelectedIndex = -1
        txtAClinicID.Enabled = True
        ChkabyART.Checked = False
        ChkabyART.Enabled = False
        DaAexpiry.Text = "01/01/1900"
        tsbAdelete.Enabled = False
    End Sub

    Private Sub CheckEPat()
        Dim CmdSearch As New MySqlCommand("Select * from tblevpatientstatus where ClinicID='" & txtEClinicID.Text & "'", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read

            Select Case Val(Rdr.GetValue(1).ToString)
                Case 0
                    MessageBox.Show("Sorry! DNA PCR Positive", " Patient Status", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Case 1
                    MessageBox.Show("Sorry! HIV Positive", "Patient Status", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Case 2
                    MessageBox.Show("Sorry! HIV Negative", "Patient Status", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Case 3
                    MessageBox.Show("Sorry! Death", "Patient Status", MessageBoxButtons.OK, MessageBoxIcon.Error)
                Case 4
                    MessageBox.Show("Sorry! Lost", "Patient Status", MessageBoxButtons.OK, MessageBoxIcon.Error)
            End Select
            Rdr.Close()
            txtEClinicID.Text = ""
            Exit Sub
        End While
        Rdr.Close()
        Dim CmdSearchAI As New MySqlCommand("Select * from tbleimain where clinicid='" & txtEClinicID.Text & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        If Not Rdr.HasRows Then
            MessageBox.Show("No Patient is found with this Clinic ID. (Maybe no initial visit)", "Check In Exposed infant initial visit", MessageBoxButtons.OK, MessageBoxIcon.Error)
            txtEClinicID.Text = ""
            txtEClinicID.Focus()
        End If
        Rdr.Close()

    End Sub
    Private Sub CheckCPat()
        Dim CmdSearch As New MySqlCommand("Select * from tblcvpatientstatus where ClinicID='" & txtCclinicID.Text & "'", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
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
            txtCclinicID.Text = ""
            Exit Sub
        End While
        Rdr.Close()
        Dim CmdSearchAI As New MySqlCommand("Select * from tblcimain where clinicid='" & txtCclinicID.Text & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        If Not Rdr.HasRows Then
            MessageBox.Show("No Patient is found with this Clinic ID. (Maybe no initial visit)", "Check In Child initial visit", MessageBoxButtons.OK, MessageBoxIcon.Error)
            txtCclinicID.Text = ""
            txtCclinicID.Focus()
        End If
        Rdr.Close()
    End Sub
    Private Sub CheckAPat()
        Dim CmdSearch As New MySqlCommand("Select * from tblavpatientstatus where ClinicID='" & Val(txtAClinicID.Text) & "'", ConnectionDB.Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
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
            txtAClinicID.Text = ""
            Exit Sub
        End While
        Rdr.Close()

        Dim CmdSearchAI As New MySqlCommand("Select * from tblaimain where clinicid='" & Val(txtAClinicID.Text) & "'", Cnndb)
        Rdr = CmdSearchAI.ExecuteReader
        If Not Rdr.HasRows Then
            MessageBox.Show("No Patient is found with this Clinic ID. (Maybe no initial visit)", "Check In Adult initial visit first", MessageBoxButtons.OK, MessageBoxIcon.Error)
            txtAClinicID.Text = ""
            txtAClinicID.Focus()
        End If
        Rdr.Close()
    End Sub
#End Region
    Private Sub txtEClinicID_Leave(sender As Object, e As EventArgs) Handles txtEClinicID.Leave
        If IsNumeric(txtEClinicID.Text) Then
            txtEClinicID.Text = "E" & frmMain.Art & Format(Val(txtEClinicID.Text), "0000")
            If txtEClinicID.Text = "E000000" Then
                MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                txtEClinicID.Text = ""
                txtEClinicID.Focus()
                Exit Sub
            End If
            CheckEPat()
        End If
    End Sub

    Private Sub txtCclinicID_Leave(sender As Object, e As EventArgs) Handles txtCclinicID.Leave
        If IsNumeric(txtCclinicID.Text) Then
            txtCclinicID.Text = "P" & Format(Val(txtCclinicID.Text), "000000")
            If txtCclinicID.Text = "P000000" Then
                MsgBox("Sorry, Clinic ID should be greater than 0.", MsgBoxStyle.Critical)
                txtCclinicID.Text = ""
                Exit Sub
            End If
            CheckCPat()
        End If
    End Sub

    Private Sub txtEcode_EditValueChanged(sender As Object, e As EventArgs) Handles txtEcode.EditValueChanged

    End Sub

    Private Sub txtAClinicID_Leave(sender As Object, e As EventArgs) Handles txtAClinicID.Leave
        If Len(txtAClinicID.Text) <= 6 And Val(txtAClinicID.Text) <> 0 Then
            txtAClinicID.Text = Format(Val(txtAClinicID.Text), "000000")
            CheckAPat()
        End If
    End Sub

    Private Sub txtEClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtEClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtCcode_EditValueChanged(sender As Object, e As EventArgs) Handles txtCcode.EditValueChanged

    End Sub

    Private Sub txtEcode_KeyDown(sender As Object, e As KeyEventArgs) Handles txtEcode.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtCclinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtCclinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtAcode_EditValueChanged(sender As Object, e As EventArgs) Handles txtAcode.EditValueChanged

    End Sub

    Private Sub txtCcode_KeyDown(sender As Object, e As KeyEventArgs) Handles txtCcode.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub tbsClear_Click(sender As Object, e As EventArgs) Handles tbsClear.Click
        Eclear()
    End Sub

    Private Sub tsbSave_Click(sender As Object, e As EventArgs) Handles tsbSave.Click
        If txtEClinicID.Text.Trim = "" Then MessageBox.Show("Please input ClinicID (Exposed Infant)", "Exposed Infant", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtEcode.Text.Trim = "" Then MessageBox.Show("Please input Code (Exposed Infant)", "Exposed Infant", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If CboEType.SelectedIndex = -1 Then MessageBox.Show("Please select type of code (Exposed Infant)", "Exposed Infant", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        Dim che As Int16
        If ChkebyART.Checked Then che = 1 Else che = -1
        If tsbEdelete.Enabled = False Then
            If vbYes = MessageBox.Show("Are you sure do you want to save!", "Exposed Infant", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
                Try
                    Dim CmdSave As New MySqlCommand("insert into tblelink values('" & txtEClinicID.Text & "','" & txtEcode.Text & "','" & CboEType.Text & "','" & che & "','" & Format(CDate(DaEexpiry.EditValue), "yyyy-MM-dd") & "','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    CmdSave.ExecuteNonQuery()
                    MessageBox.Show("Saving is completed", "Exposed Infant", MessageBoxButtons.OK, MessageBoxIcon.Information)
                    Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtEClinicID.Text & "','tblelink','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    Cmdlog.ExecuteNonQuery()
                    Eclear()
                Catch ex As Exception
                    MessageBox.Show("Have something wrong with database or Doublicate data", "Check Data", MessageBoxButtons.OK, MessageBoxIcon.Error)
                End Try
            End If
        Else
            If vbYes = MessageBox.Show("Are you sure do you want to Edit!", "Exposed Infant", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
                Dim CmdEdit As New MySqlCommand("Update tblelink set Codes='" & txtEcode.Text.Trim & "',Typecode='" & CboEType.Text & "',ARTIss='" & che & "',DaExpiry='" & Format(CDate(DaEexpiry.EditValue), "yyyy-MM-dd") & "'  where clinicid='" & txtEClinicID.Text & "' and Typecode='" & ec & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtAClinicID.Text & "','tblelink','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MessageBox.Show("Edit is completed", "Exposed Infant", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Eclear()
            End If
        End If
    End Sub

    Private Sub tsbReload_Click(sender As Object, e As EventArgs) Handles tsbReload.Click
        dt.Clear()
        Reloaddata("select * from tblelink order by clinicid", dt, GridControl1)
    End Sub

    Private Sub tsbCreload_Click(sender As Object, e As EventArgs) Handles tsbCreload.Click
        dt1.Clear()
        Reloaddata("select * from tblclink order by clinicid", dt1, GridControl2)
    End Sub

    Private Sub tsbAreload_Click(sender As Object, e As EventArgs) Handles tsbAreload.Click
        dt2.Clear()
        Reloaddata("select * from tblalink order by clinicid", dt2, GridControl3)
    End Sub

    Private Sub tsbCsave_Click(sender As Object, e As EventArgs) Handles tsbCsave.Click
        If txtCclinicID.Text.Trim = "" Then MessageBox.Show("Please input ClinicID (Children)", "Children", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtCcode.Text.Trim = "" Then MessageBox.Show("Please input Code (Children)", "Children", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If CboCtype.SelectedIndex = -1 Then MessageBox.Show("Please select type of code (Children)", "Children", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        Dim chc As Int16
        If ChkcbyART.Checked Then chc = 1 Else chc = -1
        If tsbCdelete.Enabled = False Then
            If vbYes = MessageBox.Show("Are you sure do you want to save!", "Children", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
                Try
                    Dim CmdSave As New MySqlCommand("insert into tblclink values('" & txtCclinicID.Text & "','" & txtCcode.Text & "','" & CboCtype.Text & "','" & chc & "','" & Format(CDate(DaCexpiry.EditValue), "yyyy-MM-dd") & "','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    CmdSave.ExecuteNonQuery()
                    Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtCclinicID.Text & "','tblclink','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    Cmdlog.ExecuteNonQuery()
                    MessageBox.Show("Saving is completed", "Children", MessageBoxButtons.OK, MessageBoxIcon.Information)
                    Cclear()
                Catch ex As Exception
                    MessageBox.Show("Have something wrong with database or Doublicate data", "Check Data", MessageBoxButtons.OK, MessageBoxIcon.Error)
                End Try
            End If
        Else
            If vbYes = MessageBox.Show("Are you sure do you want to Edit!", "Child", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
                Dim CmdEdit As New MySqlCommand("Update tblclink set Codes='" & txtCcode.Text.Trim & "',Typecode='" & CboCtype.Text & "',ARTIss='" & chc & "',DaExpiry='" & Format(CDate(DaCexpiry.EditValue), "yyyy-MM-dd") & "'  where clinicid='" & txtCclinicID.Text & "' and Typecode='" & cc & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtCclinicID.Text & "','tblclink','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MessageBox.Show("Edit is completed", "Child", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Cclear()
            End If
        End If
    End Sub

    Private Sub tsbCclear_Click(sender As Object, e As EventArgs) Handles tsbCclear.Click
        Cclear()
    End Sub

    Private Sub tsbAclear_Click(sender As Object, e As EventArgs) Handles tsbAclear.Click
        Aclear()
    End Sub

    Private Sub tsbAsave_Click(sender As Object, e As EventArgs) Handles tsbAsave.Click

        If txtAClinicID.Text.Trim = "" Then MessageBox.Show("Please input ClinicID (Adult)", "Adult", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If txtAcode.Text.Trim = "" Then MessageBox.Show("Please input Code (Adult)", "Adult", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        If CboAtype.SelectedIndex = -1 Then MessageBox.Show("Please select type of code (Adult)", "Adult", MessageBoxButtons.OK, MessageBoxIcon.Stop) : Exit Sub
        Dim cha As Int16
        If ChkabyART.Checked Then cha = 1 Else cha = -1
        If tsbAdelete.Enabled = False Then
            If vbYes = MessageBox.Show("Are you sure do you want to save!", "Adult", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
                Try
                    Dim CmdSave As New MySqlCommand("insert into tblalink values('" & txtAClinicID.Text & "','" & txtAcode.Text & "','" & CboAtype.Text & "','" & cha & "','" & Format(CDate(DaAexpiry.EditValue), "yyyy-MM-dd") & "','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    CmdSave.ExecuteNonQuery()
                    Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtAClinicID.Text & "','tblalink','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                    Cmdlog.ExecuteNonQuery()
                    MessageBox.Show("Saving is completed", "Adult", MessageBoxButtons.OK, MessageBoxIcon.Information)
                    Aclear()
                Catch ex As Exception
                    MessageBox.Show("Have something wrong with database or Doublicate data", "Check Data", MessageBoxButtons.OK, MessageBoxIcon.Error)
                End Try
            End If
        Else
            If vbYes = MessageBox.Show("Are you sure do you want to Edit!", "Adult", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
                Dim CmdEdit As New MySqlCommand("Update tblalink set Codes='" & txtAcode.Text.Trim & "',Typecode='" & CboAtype.Text & "',ARTIss='" & cha & "',DaExpiry='" & Format(CDate(DaAexpiry.EditValue), "yyyy-MM-dd") & "'  where clinicid='" & txtAClinicID.Text & "' and Typecode='" & ac & "'", Cnndb)
                CmdEdit.ExecuteNonQuery()
                Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtAClinicID.Text & "','tblalink','2','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
                Cmdlog.ExecuteNonQuery()
                MessageBox.Show("Edit is completed", "Adult", MessageBoxButtons.OK, MessageBoxIcon.Information)
                Aclear()
            End If
        End If

    End Sub



    Private Sub GridControl1_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl1.MouseDown
        hitInfo = GridView1.CalcHitInfo(New Point(e.X, e.Y))
    End Sub


    Private Sub txtAClinicID_KeyDown(sender As Object, e As KeyEventArgs) Handles txtAClinicID.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub GridControl3_Click(sender As Object, e As EventArgs) Handles GridControl3.Click

    End Sub

    Private Sub txtAcode_KeyDown(sender As Object, e As KeyEventArgs) Handles txtAcode.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub GridControl1_DoubleClick(sender As Object, e As EventArgs) Handles GridControl1.DoubleClick
        txtEClinicID.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        txtEClinicID.Enabled = False
        tsbEdelete.Enabled = True
        txtEcode.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Code")
        CboEType.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Type Code")
        ec = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Type Code")
        ChkebyART.Checked = GridView1.GetRowCellValue(hitInfo.RowHandle(), "From ART")
        If GridView1.GetRowCellValue(hitInfo.RowHandle(), "Expiry Date") = "" Then
            DaEexpiry.Text = "01/01/1900"
        Else
            DaEexpiry.Text = GridView1.GetRowCellValue(hitInfo.RowHandle(), "Expiry Date")
        End If
    End Sub
    Private Sub GridControl3_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl3.MouseDown
        hitInfo = GridView3.CalcHitInfo(New Point(e.X, e.Y))
    End Sub
    Private Sub GridControl3_DoubleClick(sender As Object, e As EventArgs) Handles GridControl3.DoubleClick
        txtAClinicID.Text = GridView3.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        txtAClinicID.Enabled = False
        tsbAdelete.Enabled = True
        txtAcode.Text = GridView3.GetRowCellValue(hitInfo.RowHandle(), "Code")
        CboAtype.Text = GridView3.GetRowCellValue(hitInfo.RowHandle(), "Type Code")
        ac = GridView3.GetRowCellValue(hitInfo.RowHandle(), "Type Code")
        ChkabyART.Checked = GridView3.GetRowCellValue(hitInfo.RowHandle(), "From ART")
        If GridView3.GetRowCellValue(hitInfo.RowHandle(), "Expiry Date") = "" Then
            DaAexpiry.Text = "01/01/1900"
        Else
            DaAexpiry.Text = GridView3.GetRowCellValue(hitInfo.RowHandle(), "Expiry Date")
        End If


    End Sub

    Private Sub tsbCdelete_Click(sender As Object, e As EventArgs) Handles tsbCdelete.Click
        If vbYes = MessageBox.Show("Are you sure, Do you want to Delete this Code!", "For Child", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
            'Dim cmdDelete As New MySqlCommand("Delete from tblclink where clinicid='" & txtCclinicID.Text & "'", Cnndb)
            'cmdDelete.ExecuteNonQuery()
            Dim cmdDelete As New MySqlCommand("Delete from tblclink where clinicid='" & txtCclinicID.Text & "' and Codes='" & txtCcode.Text & "' and Typecode='" & CboCtype.Text & "'", Cnndb)
            cmdDelete.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtCclinicID.Text & "','tblclink','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Completed....", "Child", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Cclear()
        End If
    End Sub

    Private Sub tsbEdelete_Click(sender As Object, e As EventArgs) Handles tsbEdelete.Click
        If vbYes = MessageBox.Show("Are you sure, Do you want to Delete this Code!", "Exposed Infant", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
            'Dim cmdDelete As New MySqlCommand("Delete from tblelink where clinicid='" & txtEClinicID.Text & "'", Cnndb)
            'cmdDelete.ExecuteNonQuery()
            Dim cmdDelete As New MySqlCommand("Delete from tblelink where clinicid='" & txtEClinicID.Text & "' and Codes='" & txtEcode.Text & "' and Typecode='" & CboEType.Text & "'", Cnndb)
            cmdDelete.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtEClinicID.Text & "','tblclink','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Completed....", "Exposed Infant", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Eclear()
        End If
    End Sub


    Private Sub tsbAdelete_Click(sender As Object, e As EventArgs) Handles tsbAdelete.Click
        If vbYes = MessageBox.Show("Are you sure, Do you want to Delete this Code!", "For Adult", MessageBoxButtons.YesNo, MessageBoxIcon.Question) Then
            'Dim cmdDelete As New MySqlCommand("Delete from tblalink where clinicid='" & txtAClinicID.Text & "'", Cnndb)
            'cmdDelete.ExecuteNonQuery()
            Dim cmdDelete As New MySqlCommand("Delete from tblalink where clinicid='" & txtAClinicID.Text & "' and Codes='" & txtAcode.Text & "' and Typecode='" & CboAtype.Text & "'", Cnndb)
            cmdDelete.ExecuteNonQuery()
            Dim Cmdlog As New MySqlCommand("insert into tbllog values('" & txtAClinicID.Text & "','tblalink','3','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "')", Cnndb)
            Cmdlog.ExecuteNonQuery()
            MessageBox.Show("Completed....", "Adult", MessageBoxButtons.OK, MessageBoxIcon.Information)
            Aclear()
        End If
    End Sub

    Private Sub GridControl2_MouseDown(sender As Object, e As MouseEventArgs) Handles GridControl2.MouseDown
        hitInfo = GridView2.CalcHitInfo(New Point(e.X, e.Y))
    End Sub
    Private Sub GridControl2_DoubleClick(sender As Object, e As EventArgs) Handles GridControl2.DoubleClick
        txtCclinicID.Text = GridView2.GetRowCellValue(hitInfo.RowHandle(), "ClinicID")
        txtCclinicID.Enabled = False
        tsbCdelete.Enabled = True
        txtCcode.Text = GridView2.GetRowCellValue(hitInfo.RowHandle(), "Code")
        CboCtype.Text = GridView2.GetRowCellValue(hitInfo.RowHandle(), "Type Code")
        cc = GridView2.GetRowCellValue(hitInfo.RowHandle(), "Type Code")
        ChkcbyART.Checked = GridView2.GetRowCellValue(hitInfo.RowHandle(), "From ART")
        If GridView2.GetRowCellValue(hitInfo.RowHandle(), "Expiry Date") = "" Then
            DaCexpiry.Text = "01/01/1900"
        Else
            DaCexpiry.Text = GridView2.GetRowCellValue(hitInfo.RowHandle(), "Expiry Date")
        End If
    End Sub

    Private Sub CboAtype_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboAtype.SelectedIndexChanged
        If CboAtype.SelectedIndex = 0 Then
            ChkabyART.Enabled = True
            DaAexpiry.Enabled = True
        Else
            ChkabyART.Enabled = False
            ChkabyART.Checked = False
            DaAexpiry.Enabled = False
        End If
    End Sub

    Private Sub CboCtype_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboCtype.SelectedIndexChanged
        If CboCtype.SelectedIndex = 0 Then
            ChkcbyART.Enabled = True
            DaCexpiry.Enabled = True
        Else
            ChkcbyART.Enabled = False
            ChkcbyART.Checked = False
            DaCexpiry.Enabled = False
        End If
    End Sub

    Private Sub CboEType_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CboEType.SelectedIndexChanged
        If CboEType.SelectedIndex = 0 Then
            ChkebyART.Enabled = True
            DaEexpiry.Enabled = True
        Else
            ChkebyART.Enabled = False
            ChkebyART.Checked = False
            DaEexpiry.Enabled = False
        End If
    End Sub
End Class