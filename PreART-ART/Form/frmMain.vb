Imports MySql.Data.MySqlClient
Imports System.Collections.Generic
Imports System.Linq
Imports System.Windows.Forms
Imports DevExpress.UserSkins
Imports DevExpress.Skins
Imports DevExpress.LookAndFeel
Imports DevExpress.XtraEditors
Imports DevExpress.XtraBars

Partial Public Class frmMain
    Dim Rdr As MySqlDataReader
    Public Art As String = ""
    Public ca, co, aa, ao, ex As Integer
    Public cod, ui As String
    Shared Sub New()
        DevExpress.UserSkins.BonusSkins.Register()
        DevExpress.Skins.SkinManager.EnableFormSkins()

    End Sub
    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub btniinitial_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btniinitial.ItemClick
        frmExInitial.MdiParent = Me
        frmExInitial.WindowState = FormWindowState.Maximized
        frmExInitial.Show()
    End Sub
    Private Sub btnAdultInA1_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnAdultInA1.ItemClick
        frmAdultInA1.MdiParent = Me
        frmAdultInA1.WindowState = FormWindowState.Maximized
        frmAdultInA1.Show()
    End Sub

    Private Sub btnAdultInA2_ItemClick_1(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnAdultInA2.ItemClick
        'frmAdultInA2.MdiParent = Me
        'frmAdultInA2.WindowState = FormWindowState.Maximized
        'frmAdultInA2.Show()
    End Sub

    Private Sub frmMain_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Check_Connection_Database()
        Dim frmlog = New frmlogin()
        frmlog.ShowDialog()
        Dim CmdCode As New MySqlCommand("Select * from tblsitename ", Cnndb)
        Rdr = CmdCode.ExecuteReader
        While Rdr.Read
            Art = Rdr.GetValue(2).ToString
        End While
        If Not Rdr.HasRows Then
            Rdr.Close()
            frmSite.ShowDialog()
        End If
        Rdr.Close()
        Dim CmdSearch As New MySqlCommand("Select * from tblsetlost", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(5).ToString) = 0 Then
                ex = Rdr.GetValue(0).ToString
            Else
                ex = Rdr.GetValue(0).ToString * 30
            End If
            If Val(Rdr.GetValue(6).ToString) = 0 Then
                co = Rdr.GetValue(1).ToString
                ca = Rdr.GetValue(2).ToString
            Else
                co = Rdr.GetValue(1).ToString * 30
                ca = Rdr.GetValue(2).ToString * 30
            End If
            If Val(Rdr.GetValue(7).ToString) = 0 Then
                ao = Rdr.GetValue(3).ToString
                aa = Rdr.GetValue(4).ToString
            Else
                ao = Rdr.GetValue(3).ToString * 30
                aa = Rdr.GetValue(4).ToString * 30
            End If
        End While
        Rdr.Close()
    End Sub

    Private Sub btnAdultIn_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnAdultIn.ItemClick
        frmAdultIn.MdiParent = Me
        frmAdultIn.WindowState = FormWindowState.Maximized
        frmAdultIn.Show()
    End Sub

    Private Sub btnAdultVisit_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnAdultVisit.ItemClick
        frmAdultVisits.MdiParent = Me
        frmAdultVisits.WindowState = FormWindowState.Maximized
        frmAdultVisits.Show()
    End Sub

    Private Sub btnChildIn_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnChildIn.ItemClick
        frmChildIn.MdiParent = Me
        frmChildIn.WindowState = FormWindowState.Maximized
        frmChildIn.Show()
    End Sub

    Private Sub btnChildInA1_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnChildInA1.ItemClick
        frmChildInA1.MdiParent = Me
        frmChildInA1.WindowState = FormWindowState.Maximized
        frmChildInA1.Show()
    End Sub

    Private Sub btnChildVisit_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnChildVisit.ItemClick
        frmChildVisit.MdiParent = Me
        frmChildVisit.WindowState = FormWindowState.Maximized
        frmChildVisit.Show()
    End Sub

    Private Sub btnExvisit_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnExvisit.ItemClick
        frmExVisit.MdiParent = Me
        frmExVisit.WindowState = FormWindowState.Maximized
        frmExVisit.Show()
    End Sub

    Private Sub btnUser_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnUser.ItemClick
        frmUser.MdiParent = Me
        frmUser.WindowState = FormWindowState.Maximized
        frmUser.Show()
    End Sub

    Private Sub btnFingerPrint_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnFingerPrint.ItemClick
        frmFingerPrint.MdiParent = Me
        frmFingerPrint.WindowState = FormWindowState.Maximized
        frmFingerPrint.Show()
    End Sub

    Private Sub btnSetLost_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnSetLost.ItemClick
        frmSetLost.MdiParent = Me
        frmSetLost.WindowState = FormWindowState.Maximized
        frmSetLost.Show()
    End Sub

    Private Sub btnCode_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnCode.ItemClick
        frmCode.MdiParent = Me
        frmCode.WindowState = FormWindowState.Maximized
        frmCode.Show()
    End Sub

    Private Sub btnSite_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnSite.ItemClick
        frmSite.ShowDialog()
    End Sub

    Private Sub btnAppoint_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnAppoint.ItemClick
        'frmAppoint.MdiParent = Me
        'frmAppoint.WindowState = FormWindowState.Maximized
        'frmAppoint.Show()
    End Sub

    Private Sub btnInfantTest_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnInfantTest.ItemClick
        frmInfantTest.MdiParent = Me
        frmInfantTest.WindowState = FormWindowState.Maximized
        frmInfantTest.Show()
    End Sub
    Private Sub btnBackup_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnBackup.ItemClick

        Dim nn As String = ""
        Dim CmdSearch As New MySqlCommand("Select * from tblsitename", Cnndb)
        Rdr = CmdSearch.ExecuteReader
        While Rdr.Read
            nn = nn & Rdr.GetValue(2).ToString.Trim
        End While
        Rdr.Close()
        Dim file As String = "D:\" & nn & "_" & Format(Now, "dd_MM_yyyy_hh_mm_ss") & ".h149"
        Using cmd As New MySqlCommand()
            Using mb As New MySqlBackup(cmd)
                cmd.Connection = Cnndb
                mb.ExportInfo.EnableEncryption = True
                mb.ExportInfo.EncryptionPassword = "090666847"
                mb.ExportInfo.MaxSqlLength = Val("3145728")
                mb.ExportToFile(file)
            End Using
        End Using
        MessageBox.Show("Backup successfully" & Chr(13) & "Path : " & file, "Bacup file", MessageBoxButtons.OK, MessageBoxIcon.Information)
    End Sub

    Private Sub btnRestore_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnRestore.ItemClick
        Try
            With OpenFileDialog1
                .FileName = ""
                .Filter = "Database Backup files (*.h149)|*.h149"
                If .ShowDialog() = DialogResult.OK Then
                    Dim cmddel As New MySqlCommand("DROP DATABASE preart", Cnndb)
                    cmddel.ExecuteNonQuery()
                    Dim cmdcreate = New MySqlCommand("CREATE DATABASE preart DEFAULT CHARACTER SET utf8 ;", Cnndb)
                    cmdcreate.ExecuteNonQuery()
                    Check_Connection_Database()
                    Dim cmd As New MySqlCommand()
                    Using mb As New MySqlBackup(cmd)
                        cmd.Connection = Cnndb
                        mb.ImportInfo.EnableEncryption = True
                        mb.ImportInfo.EncryptionPassword = "090666847"
                        ' Dim file As String =re .FileName
                        System.IO.File.Copy(.FileName, "D:\h149.h149", True)
                        mb.ImportFromFile("D:\h149.h149")
                        System.IO.File.Delete("D:\h149.h149")
                    End Using
                    MessageBox.Show("Restore Completed Successfully ", "Restore file", MessageBoxButtons.OK, MessageBoxIcon.Information)
                End If
            End With
        Catch ex As Exception
            MessageBox.Show(ex.Message, ex.Source, MessageBoxButtons.OK)
        End Try
    End Sub

    Private Sub btnPNTT_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnPNTT.ItemClick
        frmPNTT.MdiParent = Me
        frmPNTT.WindowState = FormWindowState.Maximized
        frmPNTT.Show()
    End Sub

    Private Sub BtnReport_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles BtnReport.ItemClick
        frmNationalReport.MdiParent = Me
        frmNationalReport.WindowState = FormWindowState.Maximized
        frmNationalReport.Show()

    End Sub

    Private Sub btnReportTransferOut_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnReportTransferOut.ItemClick
        frmTransferOutReport.MdiParent = Me
        frmTransferOutReport.WindowState = FormWindowState.Maximized
        frmTransferOutReport.Show()
    End Sub

    Private Sub btnDaily_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnDaily.ItemClick
        frmAppOption.ShowDialog()
    End Sub

    Private Sub BtnCheckPatient_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles BtnCheckPatient.ItemClick
        frmPatientStatus.MdiParent = Me
        frmPatientStatus.WindowState = FormWindowState.Maximized
        frmPatientStatus.Show()
    End Sub

    Private Sub BtnCheckTest_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles BtnCheckTest.ItemClick
        frmCheckTest.MdiParent = Me
        frmCheckTest.WindowState = FormWindowState.Maximized
        frmCheckTest.Show()
    End Sub

    Private Sub btnAdultDrug_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnAdultDrug.ItemClick
        frmDrugRegimen.MdiParent = Me
        frmDrugRegimen.WindowState = FormWindowState.Maximized
        frmDrugRegimen.Show()
        Dim report As New AdultDrug
        report.CreateDocument()
        frmDrugRegimen.DocumentViewer1.DocumentSource = report
    End Sub

    Private Sub BtnChildDrug_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles BtnChildDrug.ItemClick
        frmDrugRegimenChild.MdiParent = Me
        frmDrugRegimenChild.WindowState = FormWindowState.Maximized
        frmDrugRegimenChild.Show()
        Dim report As New ChildDrug
        report.CreateDocument()
        frmDrugRegimenChild.DocumentViewer1.DocumentSource = report
    End Sub

    Private Sub BtnRemidAdult_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles BtnRemidAdult.ItemClick
        frmLostRemider.MdiParent = Me
        frmLostRemider.WindowState = FormWindowState.Maximized
        frmLostRemider.Show()
    End Sub

    Private Sub ChildLostRemider_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles ChildLostRemider.ItemClick
        frmLostRemiderChild.MdiParent = Me
        frmLostRemiderChild.WindowState = FormWindowState.Maximized
        frmLostRemiderChild.Show()
    End Sub

    Private Sub btnChildSammary_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnChildSammary.ItemClick
        frmSummaryChild.MdiParent = Me
        frmSummaryChild.WindowState = FormWindowState.Maximized
        frmSummaryChild.Show()
    End Sub

    Private Sub btnAdultSummary_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnAdultSummary.ItemClick
        frmSummaryAdult.MdiParent = Me
        frmSummaryAdult.WindowState = FormWindowState.Maximized
        frmSummaryAdult.Show()
    End Sub

    Private Sub btnRPNTT_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnRPNTT.ItemClick
        frmRPNTT.MdiParent = Me
        frmRPNTT.WindowState = FormWindowState.Maximized
        frmRPNTT.Show()
    End Sub

    Private Sub btnCounsellor_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnCounsellor.ItemClick
        frmCounsellor.MdiParent = Me
        frmCounsellor.WindowState = FormWindowState.Maximized
        frmCounsellor.Show()
    End Sub

    Private Sub btnReTest_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnReTest.ItemClick
        frmReTest.MdiParent = Me
        frmReTest.WindowState = FormWindowState.Maximized
        frmReTest.Show()
    End Sub

    Private Sub BtnVCCT_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnVCCT.ItemClick
        frmVCCT.MdiParent = Me
        frmVCCT.WindowState = FormWindowState.Maximized
        frmVCCT.Show()
    End Sub

    Private Sub btnRVCCT_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnRVCCT.ItemClick
        frmRVCCT.MdiParent = Me
        frmRVCCT.WindowState = FormWindowState.Maximized
        frmRVCCT.Show()
    End Sub

    Private Sub btnDoct_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnDoct.ItemClick
        frmDoctor.MdiParent = Me
        frmDoctor.WindowState = FormWindowState.Maximized
        frmDoctor.Show()
    End Sub

    Private Sub btnUpdate_ItemClick(sender As Object, e As ItemClickEventArgs) Handles btnUpdate.ItemClick
        artUpdate()
    End Sub

    Private Sub btnLost_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnLost.ItemClick
        frmFindLost.ShowDialog()
    End Sub

    Private Sub btntest_ItemClick(sender As Object, e As ItemClickEventArgs) Handles btnopenrunscript.ItemClick
        Process.Start("AppRunMysql.exe")
    End Sub

    Private Sub btnopenupdateart_ItemClick(sender As Object, e As ItemClickEventArgs) Handles btnopenupdateart.ItemClick
        Process.Start("UpdateARTnumber.exe")
    End Sub

    Private Sub tbnshowrefuges_ItemClick(sender As Object, e As ItemClickEventArgs) Handles tbnshowrefuges.ItemClick
        frmRefusing.MdiParent = Me
        frmRefusing.WindowState = FormWindowState.Maximized
        frmRefusing.Show()
    End Sub

    Private Sub btnQRcode_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnQRcode.ItemClick
        frmQRcode.MdiParent = Me
        frmQRcode.WindowState = FormWindowState.Maximized
        frmQRcode.Show()
    End Sub

    Private Sub btnPatientTest_ItemClick(sender As Object, e As DevExpress.XtraBars.ItemClickEventArgs) Handles btnPatientTest.ItemClick
        frmPatientTest.MdiParent = Me
        frmPatientTest.WindowState = FormWindowState.Maximized
        frmPatientTest.Show()
    End Sub

    Private Sub frmMain_Closed(sender As Object, e As EventArgs) Handles Me.Closed
        Dim CmdAcc As New MySqlCommand("insert into tblaccess values('" & ui & "','0','" & Format(Now, "yyyy/MM/dd HH:mm:ss") & "')", Cnndb)
        CmdAcc.ExecuteNonQuery()

    End Sub

    Private Sub btnQRcodeMargins_ItemClick(sender As Object, e As ItemClickEventArgs) Handles btnQRcodeMargins.ItemClick
        frmQRcodeMargins.ShowDialog()
    End Sub
    Private Sub artUpdate()
        'Modify Codes colunm to utf8_general_ci
        Try
            Dim CmdAltertblalink As MySqlCommand = Cnndb.CreateCommand
            CmdAltertblalink.CommandText = "alter table preart.tblalink modify Codes char(15) CHARACTER SET utf8 COLLATE utf8_general_ci;"
            CmdAltertblalink.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        Try
            Dim CmdAltertblalink As MySqlCommand = Cnndb.CreateCommand
            CmdAltertblalink.CommandText = "alter table preart.tblclink modify Codes char(15) CHARACTER SET utf8 COLLATE utf8_general_ci;"
            CmdAltertblalink.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        Try
            Dim CmdAltertblalink As MySqlCommand = Cnndb.CreateCommand
            CmdAltertblalink.CommandText = "alter table preart.tblelink modify Codes char(15) CHARACTER SET utf8 COLLATE utf8_general_ci;"
            CmdAltertblalink.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        'Add EOClinicID to tbleimain
        Try
            Dim CmdAltertbleimain As MySqlCommand = Cnndb.CreateCommand
            CmdAltertbleimain.CommandText = "ALTER TABLE `preart`.`tbleimain` ADD COLUMN `MHIV` INT(1) NOT NULL AFTER `HIVtest`,ADD COLUMN `MLastvl` CHAR(10) NOT NULL AFTER `MHIV`,ADD COLUMN `DaMLastvl` DATE NOT NULL AFTER `MLastvl`,ADD COLUMN `EOClinicID` CHAR(10) NOT NULL AFTER `DaMLastvl`;"
            CmdAltertbleimain.ExecuteNonQuery()
            Dim CmdAlterUptbleimain As New MySqlCommand("UPDATE preart.tbleimain SET MHIV=-1, DaMLastvl='1900-01-01', EOClinicID='';", Cnndb)
            CmdAlterUptbleimain.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        'Add DNAOther to tblevmain
        Try
            Dim CmdAltertblevmain As MySqlCommand = Cnndb.CreateCommand
            CmdAltertblevmain.CommandText = " ALTER TABLE `preart`.`tblevmain` ADD COLUMN `OtherDNA` CHAR(30) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL AFTER `DaAntibody`;"
            CmdAltertblevmain.ExecuteNonQuery()
            Dim CmdAlterUptblevmain As New MySqlCommand("UPDATE preart.tblevmain SET `OtherDNA`='';", Cnndb)
            CmdAlterUptblevmain.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        'Add Change some fields to tbletest
        Try
            Dim CmdAltertbletest As MySqlCommand = Cnndb.CreateCommand
            CmdAltertbletest.CommandText = " create table if not exists tblbackupetest as select * from  preart.tbletest; ALTER TABLE `preart`.`tbletest` ADD COLUMN `DNAPcr` INT(1) NOT NULL AFTER `ConfirmPCR`, ADD COLUMN `DaPcrArr` DATE NOT NULL AFTER `DNAPcr`; insert into tbllog values('E00000000','tbleimain','1','" & Format(Now, "yyyy-MM-dd HH:mm:ss") & "');"
            CmdAltertbletest.ExecuteNonQuery()
            Dim CmdAlterUptbletest As New MySqlCommand("UPDATE `preart`.`tbletest` SET `DNAPcr`=-1,`DaPcrArr`='1900-01-01'; update tbletest set OI='True' where TestConfirm='True' and OI='False';", Cnndb)
            CmdAlterUptbletest.ExecuteNonQuery()
            Dim CmdAlterUpStrucEtest As New MySqlCommand("update tbletest et
                    inner join(select 
	                    bt.ClinicID,
	                    ei.Sex,
	                    ei.DafirstVisit,
	                    ei.DaBirth,
	                    bt.PCR,
	                    bt.ConfirmPCR,
	                    bt.OI,
	                    bt.TestConfirm,
	                    bt.DaBlood,
	                    bt.Result,
	                    timestampdiff(day,DaBirth,bt.DaBlood) as DayTest,
	                    if(bt.PCR='True' and timestampdiff(day,DaBirth,bt.DaBlood)<28,0,
	                    if(bt.PCR='True' and timestampdiff(day,DaBirth,bt.DaBlood)>=28 and timestampdiff(day,DaBirth,bt.DaBlood)<62,1,
                        if(ei.DafirstVisit>='2022-11-01' and bt.PCR='True' and timestampdiff(day,DaBirth,bt.DaBlood)>=62 and timestampdiff(day,DaBirth,bt.DaBlood)<=300,5,
	                    if(bt.ConfirmPCR='True',4,
                        if(bt.OI='True'and bt.TestConfirm='False',3,
                        if(bt.TestConfirm='True',4,
                        2)))))) as Conv_DNAPcr,
	                    bt.DNAPcr,
	                    bt.DaPcrArr
                    from tbletest bt
                    left join tbleimain ei on ei.ClinicID=bt.ClinicID 
                    order by bt.ClinicID,bt.DaBlood) pcr
                    on et.ClinicID=pcr.ClinicID and et.DaBlood=pcr.DaBlood
                    set et.DNAPcr=pcr.Conv_DNAPcr;", Cnndb)
            CmdAlterUpStrucEtest.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        Try
            Dim CmdAltertbletestdrop As MySqlCommand = Cnndb.CreateCommand
            CmdAltertbletestdrop.CommandText = "alter table tbletest drop column PCR, drop column ConfirmPCR, drop column TestConfirm;"
            CmdAltertbletestdrop.ExecuteNonQuery()
        Catch ex As Exception

        End Try

        Try
            Dim CmdInstblartsite As New MySqlCommand("INSERT INTO `tblartsite` VALUES('1216','CCF Sen Sok RH',1);", Cnndb)
            CmdInstblartsite.ExecuteNonQuery()
            Dim CmdInstblvcctsite As New MySqlCommand("INSERT INTO `tblvcctsite` VALUES('V12-36','RH CCF Sen Sok','Sen Sok',1);", Cnndb)
            CmdInstblvcctsite.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        'Add field Antibody after 3 months stopping feeding
        Try
            Dim CmdAlteraddfield As MySqlCommand = Cnndb.CreateCommand
            CmdAlteraddfield.CommandText = "ALTER TABLE `preart`.`tblevmain` ADD COLUMN `Antiaffeeding` INT(1) NOT NULL AFTER `DaAntibody`;"
            CmdAlteraddfield.ExecuteNonQuery()
            Dim CmdAlterUptbletest As New MySqlCommand("UPDATE `preart`.`tblevmain` SET `Antiaffeeding`=-1;", Cnndb)
            CmdAlterUptbletest.ExecuteNonQuery()
        Catch ex As Exception

        End Try

        'Add CatPlaceDelivery to tbleimain
        Try
            Dim CmdAddCatPlacetbleimain As MySqlCommand = Cnndb.CreateCommand
            CmdAddCatPlacetbleimain.CommandText = "ALTER TABLE `preart`.`tbleimain` ADD COLUMN `CatPlaceDelivery` CHAR(25) CHARACTER SET 'utf8' COLLATE 'utf8_general_ci' NOT NULL AFTER `Mstatus`;"
            CmdAddCatPlacetbleimain.ExecuteNonQuery()
            Dim CmdUpCatPlacetbleimain As New MySqlCommand("UPDATE `preart`.`tbleimain` SET `CatPlaceDelivery`='';", Cnndb)
            CmdUpCatPlacetbleimain.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        'A16.3.6........
        ''Alter tblcimain add TPTdrug, DaStartTPT, DaEndTPT
        Try

            Dim CmdAltertblcimain As MySqlCommand = Cnndb.CreateCommand
            CmdAltertblcimain.CommandText = "alter table preart.tblcimain add column TPTdrug int(1) not null after Inh,add column DaStartTPT date DEFAULT NULL after TPTdrug,add column DaEndTPT date DEFAULT NULL after DaStartTPT;"
            CmdAltertblcimain.ExecuteNonQuery()
            Dim CmdUptblcimainfield As New MySqlCommand("update preart.tblcimain set TPTdrug=-1,DaStartTPT='1900-01-01',DaEndTPT='1900-01-01';", Cnndb)
            CmdUptblcimainfield.ExecuteNonQuery()
        Catch ex As Exception

        End Try
        'Alter tblpatienttest add CD4Rapid
        Try

            Dim CmdAltertblpatienttest As MySqlCommand = Cnndb.CreateCommand
            CmdAltertblpatienttest.CommandText = "ALTER TABLE `preart`.`tblpatienttest` ADD COLUMN `CD4Rapid` INT(1) NOT NULL AFTER `DaCollect`;"
            CmdAltertblpatienttest.ExecuteNonQuery()
            Dim CmdUptblpatienttest As New MySqlCommand("update `preart`.`tblpatienttest` set `CD4Rapid`=0;", Cnndb)
            CmdUptblpatienttest.ExecuteNonQuery()
        Catch ex As Exception

        End Try

        Try
            Dim CmdTable As MySqlCommand = Cnndb.CreateCommand
            CmdTable.CommandText = "CREATE TABLE `preart`.`tblVersion`(`Version` char(15) ,PRIMARY KEY (`Version`));"
            CmdTable.ExecuteNonQuery()
            Dim CmdIn As New MySqlCommand("insert into tblversion values('14.0')", Cnndb)
            CmdIn.ExecuteNonQuery()
        Catch ex As Exception
            Dim CmdIn As New MySqlCommand("Update tblversion set version='A16.3.6'", Cnndb)
            CmdIn.ExecuteNonQuery()
        End Try

        Try
            Dim cmdaddcolum As MySqlCommand = Cnndb.CreateCommand
            cmdaddcolum.CommandText = "ALTER TABLE `preart`.`tblevmain` ADD COLUMN `DNAPre` INT(1) NULL AFTER `Vid`;"
            cmdaddcolum.ExecuteNonQuery()

        Catch ex As Exception

        End Try
        Try
            Dim cmdaddcolum As MySqlCommand = Cnndb.CreateCommand
            cmdaddcolum.CommandText = "delete from tbletest where LabID='' and Result=-1; delete a from tbletest a  
                                        inner join (select t.tid from tbletest t
                                        left join tbleimain i on i.clinicid=t.clinicid
                                        where i.clinicid is null
                                        order by t.clinicid) aa on a.tid=aa.tid;
                                        delete v from tblevmain v 
                                        inner join 
                                        (select v.vid from tblevmain v
                                        left join tbleimain i on i.clinicid=v.clinicid
                                        where i .clinicid is null) vv on v.vid=vv.vid;"
            cmdaddcolum.ExecuteNonQuery()

        Catch ex As Exception
            MessageBox.Show(ex.Message)
        End Try


        Try
            Dim cmmdchec As MySqlCommand = Cnndb.CreateCommand
            cmmdchec.CommandText = "select po.num as negative ,ne.num as positive  from
                                    (select t.Result,count(t.Result) as num from tbletest t
                                    left join tblevpatientstatus p on p.clinicid= t.clinicid
                                    left join tbleimain i on i.clinicid=t.clinicid
                                    where DaRresult<='2018-12-31'  and i.DafirstVisit<='2018-12-31'
                                    group by t.Result
                                    having t.Result=0) po, (select t.Result,count(t.Result) as num from tbletest t
                                    left join tblevpatientstatus p on p.clinicid= t.clinicid
                                    left join tbleimain i on i.clinicid=t.clinicid
                                    where DaRresult<='2018-12-31'  and i.DafirstVisit<='2018-12-31'
                                    group by t.Result
                                    having t.Result=1) ne "
            'Dim rde As MySqlDataReader = cmmdchec.ExecuteReader()
            Rdr = cmmdchec.ExecuteReader()
            Rdr.Read()
            If (CInt(Rdr.GetValue(0).ToString) < CInt(Rdr.GetValue(1).ToString)) Then
                Rdr.Close()
                Cnndb.Close()
                Cnndb.Open()
                Try
                    Dim cmdaddcolum As MySqlCommand = Cnndb.CreateCommand
                    cmdaddcolum.CommandText = "update tbletest et
                                                inner join
                                                (select t.ClinicID,if(t.Result=0,1,if(t.Result=1,0,t.Result)) as Result,t.TID from tbletest t
                                                left join tblevpatientstatus p on p.clinicid= t.clinicid
                                                left join tbleimain i on i.clinicid=t.clinicid
                                                where DaRresult<='2018-12-31'  and i.DafirstVisit<='2018-12-31'
                                                order by t.clinicid,DaRresult) tt on tt.tid=et.tid
                                                set et.Result=tt.Result;"
                    cmdaddcolum.ExecuteNonQuery()

                Catch ex As Exception

                End Try

            End If

        Catch ex As Exception

        End Try


        'Try
        'Dim cmdaddcolum As MySqlCommand = Cnndb.CreateCommand
        '    cmdaddcolum.CommandText = "update tblevmain v inner join
        '                                (select vid,DNAPcr,ifnull(TID,'') as TID from tblevmain ev
        '                                left  join (
        '                                select clinicid, DNAPcr,DaRresult,TID,(select min(DaRresult) as DaRresult from tbletest st where st.clinicid=et.clinicid and st.DaRresult>et.DaRresult  ) as DaRresultnext from tbletest et
        '                                order by et.clinicid, et.DaRresult
        '                                ) et on et.clinicid=ev.clinicid and ev.DatVisit>=et.DaRresult and (ev.DatVisit<et.DaRresultnext or  et.DaRresultnext is null)
        '                                order by ev.clinicid,datvisit ) ld on ld.vid=v.vid set v.TestID=ld.tid;"
        '    cmdaddcolum.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try


        'Try
        '    Dim cmdaddcolum As MySqlCommand = Cnndb.CreateCommand
        '    cmdaddcolum.CommandText = "update tblevmain v inner join
        '                                (select vid,DNAPcr,ifnull(TID,'') as TID,et.result from tblevmain ev
        '                                left  join (
        '                                select clinicid, DNAPcr,result,DaRresult,TID,(select max(DaRresult) as DaRresult from tbletest st where st.clinicid=et.clinicid and et.DaRresult<st.DaBlood  ) as DaRresultnext from tbletest et
        '                                order by et.clinicid, et.DaRresult
        '                                ) et 
        '                                on et.clinicid=ev.clinicid and ev.DatVisit>et.DaRresult and (ev.DatVisit<et.DaRresultnext or  et.DaRresultnext is null)
        '                                where et.result =1
        '                                order by ev.clinicid,datvisit
        '                                ) ld on ld.vid=v.vid
        '                                set v.DNAPre=DNAPcr ;"
        '    cmdaddcolum.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try

        MessageBox.Show("Done!", "ART Update")
        ' Cnndb.Close()
    End Sub
End Class
