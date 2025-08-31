Imports System.ComponentModel
Imports MySql.Data.MySqlClient

Public Class frmlogin
    Dim Rdr As MySqlDataReader
    Dim k As Integer
    Private Sub btnLogIn_Click(sender As Object, e As EventArgs) Handles btnLogIn.Click
        login()
    End Sub

    Private Sub frmlogin_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        txtUserName.Focus()
    End Sub

    Private Sub btnCancel_Click(sender As Object, e As EventArgs) Handles btnCancel.Click
        If MessageBox.Show("Are you sure do you want to exit!", "Login", MessageBoxButtons.YesNo, MessageBoxIcon.Question) = MsgBoxResult.Yes Then
            Application.Exit()
        End If
    End Sub

    Private Sub frmlogin_Closing(sender As Object, e As CancelEventArgs) Handles Me.Closing
        If k = 0 Then
            e.Cancel = True
        End If
    End Sub
    Private Sub login()

        Dim modSec As New modEncrypt
        k = 0
        If txtUserName.Text.Trim = "" And Trim(txtPassword.Text) = "" Then MsgBox("Please input Username and Password!", MsgBoxStyle.Exclamation, "Log in") : Exit Sub
        If txtUserName.Text.Trim = "" Then MsgBox("Please input Username!", MsgBoxStyle.Exclamation, "Log in") : Exit Sub
        If txtPassword.Text.Trim = "" Then MsgBox("Please input Password!", MsgBoxStyle.Exclamation, "Log in") : Exit Sub
        Dim Cmd As MySqlCommand = New MySqlCommand("SELECT * from tbluser", Cnndb)
        Rdr = Cmd.ExecuteReader
        While Rdr.Read
            If txtUserName.Text = Trim(Rdr.GetValue(1).ToString) And Rdr.GetValue(2).ToString = modSec.EncryptText(txtPassword.Text) Then
                If Val(Rdr.GetValue(4).ToString) = 1 Then
                    MessageBox.Show("The user and password is disable..", "Login failse", MessageBoxButtons.OK, MessageBoxIcon.Error)
                    Rdr.Close()
                    End
                End If
                k = 1
                frmMain.ui = Rdr.GetValue(0).ToString
                frmMain.tsbUserName.Text = "User Name :" & Rdr.GetValue(3).ToString
            End If
        End While
        Rdr.Close()
        If k <> 1 Then
            MessageBox.Show("Invalid Username or Password!", "Open Database failse", MessageBoxButtons.OK, MessageBoxIcon.Stop)
        Else
            txtUserName.Text = ""
            txtPassword.Text = ""
            txtUserName.Focus()
            Dim CmdAcc As New MySqlCommand("insert into tblaccess values('" & frmMain.ui & "','1','" & Format(Now, "yyyy/MM/dd HH:mm:ss") & "')", Cnndb)
            CmdAcc.ExecuteNonQuery()
            Me.Close()
            Try
                Dim CmdTable As MySqlCommand = Cnndb.CreateCommand
                CmdTable.CommandText = "DROP VIEW if exists `preart`.`childpatientactive`;"
                CmdTable.ExecuteNonQuery()
                CmdTable.CommandText = "CREATE  VIEW `childpatientactive` AS SELECT CONCAT(tblcvmain.ClinicID, CONVERT(DATE_FORMAT(MAX(tblcvmain.DatVisit), '%d%m%y') USING LATIN1)) AS Vid,MAX(tblcvmain.DatVisit) AS DatVisit,  tblcvmain.ClinicID AS ClinicID,  tblcvpatientstatus.Status AS Status,tblcvmain.Weight AS Weight,tblcimain.DaFirstVisit AS DaFirstVisit,tblcart.ART,tblcimain.Sex AS Sex FROM tblcimain LEFT OUTER JOIN tblcvmain ON tblcvmain.ClinicID = tblcimain.ClinicID LEFT OUTER JOIN tblcvpatientstatus ON tblcvmain.ClinicID = tblcvpatientstatus.ClinicID LEFT OUTER JOIN tblcart ON tblcvmain.ClinicID = tblcart.ClinicID WHERE ISNULL(tblcvpatientstatus.Status) GROUP BY tblcvmain.ClinicID, tblcart.ART ORDER BY tblcvmain.DatVisit DESC;"
                CmdTable.ExecuteNonQuery()
            Catch ex As Exception
            End Try

            'Try
            '    Dim CmdTable As MySqlCommand = Cnndb.CreateCommand
            '    CmdTable.CommandText = "CREATE TABLE `preart`.`tbltempoi`(`ClinicID` CHAR(7) NOT NULL,`Sex` INT(1) NULL,PRIMARY KEY (`ClinicID`));"
            '    CmdTable.ExecuteNonQuery()
            'Catch ex As Exception
            'End Try

            Try
                Dim CmdTable1 As MySqlCommand = Cnndb.CreateCommand
                'Try
                CmdTable1.CommandText = "DROP VIEW if exists `preart`.`patientactive`;"
                CmdTable1.ExecuteNonQuery()
                CmdTable1.CommandText = "CREATE  VIEW `patientactive` AS   Select CONCAT(tblavmain.ClinicID, DATE_FORMAT(MAX(tblavmain.DatVisit), '%d%m%y')) AS Vid,MAX(tblavmain.DatVisit) As DatVisit,tblavmain.ClinicID AS ClinicID, tblavpatientstatus.Status As Status,tblaart.ART,tblaimain.DafirstVisit As DafirstVisit, tblaimain.Sex AS Sex From tblaimain Left OUTER JOIN tblavmain On tblavmain.ClinicID = tblaimain.ClinicID Left OUTER JOIN tblavpatientstatus On tblavmain.ClinicID = tblavpatientstatus.ClinicID Left OUTER JOIN tblaart On tblaart.ClinicID = tblavmain.ClinicID WHERE ISNULL(tblavpatientstatus.Status) GROUP BY tblavmain.ClinicID,tblaart.ART ORDER BY tblavmain.DatVisit DESC;"
                CmdTable1.ExecuteNonQuery()
                'Catch ex As Exception
                'End Try

            Catch ex As Exception
            End Try
            'Try
            '    Dim CmdTable As MySqlCommand = Cnndb.CreateCommand
            '    CmdTable.CommandText = "CREATE TABLE `tbltempdrug` (`Vid` double NOT NULL,`ClinicID` int(6) NOT NULL, PRIMARY KEY (`ClinicID`))"
            '    CmdTable.ExecuteNonQuery()
            'Catch ex As Exception
            'End Try
        End If
        'Try
        '    Dim CmdTable As MySqlCommand = Cnndb.CreateCommand
        '    CmdTable.CommandText = "CREATE TABLE `preart`.`tblVersion`(`Version` char(15) ,PRIMARY KEY (`Version`));"
        '    CmdTable.ExecuteNonQuery()
        '    Dim CmdIn As New MySqlCommand("insert into tblversion values('14.0')", Cnndb)
        '    CmdIn.ExecuteNonQuery()
        'Catch ex As Exception
        '    Dim CmdIn As New MySqlCommand("Update tblversion set version='A16.3.5'", Cnndb)
        '    CmdIn.ExecuteNonQuery()
        'End Try

        '        'Sithorn add one AsID column to tblapnttchild A16.3 beta
        'Try
        '    Dim CmdAlterTable As MySqlCommand = Cnndb.CreateCommand
        '    CmdAlterTable.CommandText = "ALTER TABLE `preart`.`tblapnttchild` 
        'ADD COLUMN `AsID` DOUBLE NOT NULL AFTER `CAPID`;"
        '    CmdAlterTable.ExecuteNonQuery()
        '    Dim CmdIn As New MySqlCommand("update preart.tblapnttchild as c 
        'set AsID=(select AsID from preart.tblapntt where tblapntt.Agree=0 and substring(c.CAPID,1,length(tblapntt.AsID))=tblapntt.AsID);", Cnndb)
        '    CmdIn.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
        ''..............xxxx....................
        ''Sithorn add A16.3
        'Try

        '    Dim CmdAltertblevmain As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblevmain.CommandText = "alter table preart.tblevmain add column Antibody int(1) not null after DaApp, add column DaAntibody date not null after Antibody;"
        '    CmdAltertblevmain.ExecuteNonQuery()
        '    Dim CmdAlterUpAlltblevmain As New MySqlCommand("update preart.tblevmain set Antibody=-1, DaAntibody='1900-01-01';", Cnndb)
        '    CmdAlterUpAlltblevmain.ExecuteNonQuery()
        '    'Dim CmdAlterUp1tblevmain As New MySqlCommand("update preart.tblevmain ev left join(select * from tblevpatientstatus where status=1) ep on ev.Vid=ep.Vid " &
        '    '                                       "set ev.Antibody=nullif(0, ep.Status), ev.DaAntibody= ep.DaStatus where ev.Vid=ep.Vid and ep.vid is not null;", Cnndb)
        '    'CmdAlterUp1tblevmain.ExecuteNonQuery()
        '    'Dim CmdAlterUp2tblevmain As New MySqlCommand("update preart.tblevmain ev left join(select * from tblevpatientstatus where status=2) ep on ev.Vid=ep.Vid " &
        '    '                                        "set ev.Antibody=nullif(1, ep.Status), ev.DaAntibody= ep.DaStatus where ev.Vid=ep.Vid and ep.vid is not null;", Cnndb)
        '    'CmdAlterUp2tblevmain.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
        'Try
        '    Dim CmdAltertblalink As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblalink.CommandText = "alter table tblalink add DaExpiry date not null after Typecode,add Dacreate datetime not null;"
        '    CmdAltertblalink.ExecuteNonQuery()
        '    Dim CmdAlterUptblalink As New MySqlCommand("update tblalink set DaExpiry='1900-01-01',Dacreate='1900-01-01';", Cnndb)
        '    CmdAlterUptblalink.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try
        'Try
        '    Dim CmdAltertblclink As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblclink.CommandText = "alter table tblclink add DaExpiry date not null after Typecode,add Dacreate datetime not null;"
        '    CmdAltertblclink.ExecuteNonQuery()
        '    Dim CmdAlterUptblclink As New MySqlCommand("update tblclink set DaExpiry='1900-01-01',Dacreate='1900-01-01';", Cnndb)
        '    CmdAlterUptblclink.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try
        'Try
        '    Dim CmdAltertblelink As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblelink.CommandText = "alter table tblelink add DaExpiry date not null after Typecode,add Dacreate datetime not null;"
        '    CmdAltertblelink.ExecuteNonQuery()
        '    Dim CmdAlterUptblelink As New MySqlCommand("update tblelink set DaExpiry='1900-01-01',Dacreate='1900-01-01';", Cnndb)
        '    CmdAlterUptblelink.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try
        ''...............xxxx.........................
        ''Sithorn add to A16.3.2
        ''Alter tblalink add ARTIss field
        'Try
        '    Dim CmdAltertblalink As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblalink.CommandText = "alter table preart.tblalink add ARTIss int(1) not null after Typecode;"
        '    CmdAltertblalink.ExecuteNonQuery()
        '    Dim CmdAlterUptblalink As New MySqlCommand("update preart.tblalink set ARTIss=-1;", Cnndb)
        '    CmdAlterUptblalink.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try
        ''Alter tblclink add ARTIss field
        'Try
        '    Dim CmdAltertblalink As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblalink.CommandText = "alter table preart.tblclink add ARTIss int(1) not null after Typecode;"
        '    CmdAltertblalink.ExecuteNonQuery()
        '    Dim CmdAlterUptblalink As New MySqlCommand("update preart.tblclink set ARTIss=-1;", Cnndb)
        '    CmdAlterUptblalink.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try
        ''Alter tblelink add ARTIss field
        'Try
        '    Dim CmdAltertblalink As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblalink.CommandText = "alter table preart.tblelink add ARTIss int(1) not null after Typecode;"
        '    CmdAltertblalink.ExecuteNonQuery()
        '    Dim CmdAlterUptblalink As New MySqlCommand("update preart.tblelink set ARTIss=-1;", Cnndb)
        '    CmdAlterUptblalink.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try
        ''Create tblmargin
        'Try
        '    Dim CmdTable As MySqlCommand = Cnndb.CreateCommand
        '    CmdTable.CommandText = "CREATE TABLE `preart`.`tblmargins`(`mleft` float NOT NULL,`mright` float NOT NULL,`mtop` float NOT NULL,`mbottom` float NOT NULL);"
        '    CmdTable.ExecuteNonQuery()
        '    Dim CmdIn As New MySqlCommand("insert into preart.tblmargins values(0.85,0.55,0.09,0.06);", Cnndb)
        '    CmdIn.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
        ''Create tbltargroup
        'Try
        '    Dim CmdTar As MySqlCommand = Cnndb.CreateCommand
        '    CmdTar.CommandText = "create table preart.tbltargroup(Tid int(2) not null,Targroup char(10) not null,Targroupkh char(50) not null,Status int(1) not null,primary key(Tid));"
        '    CmdTar.ExecuteNonQuery()
        '    Dim CmdInTar As New MySqlCommand("insert into preart.tbltargroup values(1,'FEW','ស្រីបម្រើសេវាកម្សាន្ត',1),(2,'MSM','បុរសស្រឡាញ់បុរស',1),(3,'TG','ក្រុមបំប្លែងភេទ',1),(4,'PWUD','អ្នកប្រើប្រាស់គ្រឿងញៀន',1),(5,'PWID','អ្នកចាក់ថ្នាំញៀន',1),(6,'GP','ប្រជាជនទូទៅ',1),(7,'MEW','បុរស់បម្រើសេវាកម្សាន្ត',1),(8,'PPW','ស្ត្រីផ្ទៃពោះ និងស្ត្រីក្រោយសម្រាល',1);", Cnndb)
        '    CmdInTar.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
        ''Alter tblaimain
        'Try
        '    Dim CmdAltertblaimain As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblaimain.CommandText = "alter table preart.tblaimain add column Targroup int(1) default null after Nationality;"
        '    CmdAltertblaimain.ExecuteNonQuery()
        '    Dim CmdUptblaimain As New MySqlCommand("update preart.tblaimain set Targroup=0;", Cnndb)
        '    CmdUptblaimain.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try

        'Add to A16.3.3 and A16.3.4
        'Create tblcausedeath
        'Try
        '    Dim CmdCau As MySqlCommand = Cnndb.CreateCommand
        '    CmdCau.CommandText = "CREATE TABLE preart.tblcausedeath (ID int(1) not null,Ctype int(1) not null,Cause varchar(65) not null,Status int(1) not null,primary key(ID)) ENGINE=InnoDB DEFAULT CHARSET=utf8;"
        '    CmdCau.ExecuteNonQuery()
        '    Dim CmdInTar As New MySqlCommand("insert into preart.tblcausedeath values(1,0,'Tuberculosis include TB pneumonia and TB pleurisies',1), " &
        '                                        "(2,0,'Non-TB Pneumonia',1),(3,0,'Chronic diarrhea',1), " &
        '                                        "(4,0,'Meningitis',1),(5,0,'Cryptococcus meningitis',1), " &
        '                                        "(6,0,'Acute diarrhea','1'), " &
        '                                        "(7,0,'Pneumocystis pneumonia',1), " &
        '                                        "(8,0,'Candidiasis',1), " &
        '                                        "(9,0,'Septicemia',1), " &
        '                                        "(10,0,'Acidosis',1), " &
        '                                        "(11,0,'Hepatis B',1), " &
        '                                        "(12,0,'Abscess of lung',1), " &
        '                                        "(13,0,'Hepatis A',1), " &
        '                                        "(14,0,'Non-TB Pleurisies',1), " &
        '                                        "(15,0,'Toxoplasmosis cerebral',1), " &
        '                                        "(16,1,'Wasting syndrome',1), " &
        '                                        "(17,1,'Cervical cancer',1), " &
        '                                        "(18,1,'Lung cancer',1), " &
        '                                        "(19,1,'Mental health disorder',1), " &
        '                                        "(20,1,'Anemia',1), " &
        '                                        "(21,1,'Digestive tract infection',1), " &
        '                                        "(22,1,'Malaria',1), " &
        '                                        "(23,1,'Peritonitis',1), " &
        '                                        "(24,1,'Urinary tract infection',1), " &
        '                                        "(25,1,'Hearth disease',1), " &
        '                                        "(26,1,'Cancer',1), " &
        '                                        "(27,1,'Cirrhosis',1), " &
        '                                        "(28,1,'Hypertention',1), " &
        '                                        "(29,1,'Hemorrhage',1), " &
        '                                        "(30,1,'Renal failure',1), " &
        '                                        "(31,1,'Diabetes',1), " &
        '                                        "(32,2,'Road traffic accident',1), " &
        '                                        "(33,2,'Suicide',1), " &
        '                                        "(34,2,'Drowning',1), " &
        '                                        "(35,2,'Electric shock',1), " &
        '                                        "(36,2,'Food poisoning',1), " &
        '                                        "(99,99,'Other',1) ;", Cnndb)
        '    CmdInTar.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
        ''Alter tblavmain add FoWorker and Country column
        'Try
        '    Dim CmdAltertblavmain As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblavmain.CommandText = "alter table preart.tblavmain add Foworker int(1) not null after Vid, add Country int(2) not null;"
        '    CmdAltertblavmain.ExecuteNonQuery()
        '    Dim CmdUptblavmain As New MySqlCommand("update preart.tblavmain set Foworker=-1;", Cnndb)
        '    CmdUptblavmain.ExecuteNonQuery()

        '    'Alter tblartsite add primary key and insert sites agian
        '    Dim CmdDeltblartsite As New MySqlCommand("delete from tblartsite;", Cnndb)
        '    CmdDeltblartsite.ExecuteNonQuery()
        '    Dim CmdInstblartsite As New MySqlCommand("INSERT INTO `tblartsite` VALUES " &
        '                                            "('0101','Serey Sophon RH',1), " &
        '                                            "('0102','CJF Mongkul Borey PH',1), " &
        '                                            "('0103','Poi Pet RH',1), " &
        '                                            "('0104','Thmor Puok RH',1), " &
        '                                            "('0105','Preah Net Preah RH',1), " &
        '                                            "('0201','Maung Russey RH',1), " &
        '                                            "('0202','Battambang PH',1), " &
        '                                            "('0203','Sampov Loun RH',1), " &
        '                                            "('0204','Thmor Kol RH',1), " &
        '                                            "('0205','R5 Military Hospital',1), " &
        '                                            "('0206','Roka RH',1), " &
        '                                            "('0301','Kampong Cham PH',1), " &
        '                                            "('0302','Memut RH',1), " &
        '                                            "('0303','PNS Tbong Khmum RH',1), " &
        '                                            "('0304','Choeung Prey RH',1), " &
        '                                            "('0305','Srey Santhor RH',1), " &
        '                                            "('0306','Chamkar Leu RH',1), " &
        '                                            "('0307','Batheay RH',1), " &
        '                                            "('0401','Kampong Chhnang PH',1), " &
        '                                            "('0402','Kampong Tralach RH',1), " &
        '                                            "('0501','Kampong Speu PH',1), " &
        '                                            "('0502','Oudong RH',1), " &
        '                                            "('0503','Kong Pisey RH',1), " &
        '                                            "('0601','Kampong Thom PH',1), " &
        '                                            "('0602','Baray Santuk RH',1), " &
        '                                            "('0603','Stong RH',1), " &
        '                                            "('0701','Kampot PH',1), " &
        '                                            "('0703','Kampong Trach RH',1), " &
        '                                            "('0801','Chey Chumneas PH',1), " &
        '                                            "('0802','Koh Thom RH',1), " &
        '                                            "('0803','Kien Svay RH',1), " &
        '                                            "('0901','Koh Kong PH',1), " &
        '                                            "('0902','Sre Ambil RH',1), " &
        '                                            "('1001','Kratie PH',1), " &
        '                                            "('1101','Mondulkiri PH',1), " &
        '                                            "('1201','NCADS Clinic 1',1), " &
        '                                            "('1202','Calmette Hospital',1), " &
        '                                            "('1203','NCADS-AHF Clinic 3',1), " &
        '                                            "('1204','National Pediatric Hospital',1), " &
        '                                            "('1205','Hope Center',1), " &
        '                                            "('1207','Preah Ketomealea Hospital',1), " &
        '                                            "('1208','NCADS Clinic 2',1), " &
        '                                            "('1209','Chhouk Sar Clinic',1), " &
        '                                            "('1210','Chhouk Sar2 Clinic',1), " &
        '                                            "('1211','Chbar Ampov RH',1), " &
        '                                            "('1212','Samdach Ov RH',1), " &
        '                                            "('1213','Dang Kor RH',1), " &
        '                                            "('1214','Pochintong RH',1), " &
        '                                            "('1215','Chaktomuk RH',1), " &
        '                                            "('1301','PVH 16 Makara PH',1), " &
        '                                            "('1401','Neak Loeung RH',1), " &
        '                                            "('1402','Prey Veng PH',1), " &
        '                                            "('1403','Pearaing RH',1), " &
        '                                            "('1501','Pursat PH',1), " &
        '                                            "('1502','Phnom Kravanh RH',1), " &
        '                                            "('1503','Bakan RH',1), " &
        '                                            "('1601','Ratanakiri PH',1), " &
        '                                            "('1701','Siem Reap Hospital',1), " &
        '                                            "('1702','Siem Reap PH',1), " &
        '                                            "('1703','Komar Angkor Hospital',1), " &
        '                                            "('1704','Sotr Nikum RH',1), " &
        '                                            "('1705','Kralanh RH',1), " &
        '                                            "('1801','Preah Sihanouk PH',1), " &
        '                                            "('1901','Stung Treng PH',1), " &
        '                                            "('2001','Svay Rieng PH',1), " &
        '                                            "('2002','Romeas Hek RH',1), " &
        '                                            "('2101','Takeo PH',1), " &
        '                                            "('2102','Kirivong RH',1), " &
        '                                            "('2103','Ang Roka RH',1), " &
        '                                            "('2104','Prey Kabas RH',1), " &
        '                                            "('2201','Oddor Meanchey PH',1)," &
        '                                            "('2202','Anlong Veng RH',1), " &
        '                                            "('2301','Kep PH',1), " &
        '                                            "('2401','Pailin PH',1), " &
        '                                            "('2501','CCF Tbong Khmum PH',1);", Cnndb)
        '    CmdInstblartsite.ExecuteNonQuery()
        '    Dim CmdAltertblartsite As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblartsite.CommandText = "alter table tblartsite add primary key(Sid);"
        '    CmdAltertblartsite.ExecuteNonQuery()

        '    'Alter tblvcctsite add primary key and insert sites agian
        '    Dim CmdDeltblvcctsite As New MySqlCommand("delete from tblvcctsite;", Cnndb)
        '    CmdDeltblvcctsite.ExecuteNonQuery()
        '    Dim CmdInstblvcctsite As New MySqlCommand("INSERT INTO `tblvcctsite` VALUES " &
        '                                            "('V01-01','RH Serey Sophon','Mongkul Borey',1), " &
        '                                            "('V01-02','RH Mongkul Borey','Mongkul Borey',1), " &
        '                                            "('V01-03','RH Poi Pet','Poi Pet',1), " &
        '                                            "('V01-04','RH Thmor Pouk','Thmor Pouk',1), " &
        '                                            "('V01-05','RH Preah Netr Preah','Preah Netr Preah',1), " &
        '                                            "('V02-01','RH Moung Russey','Moung Russey',1), " &
        '                                            "('V02-03','RH Sampov Luon','Sampov Luon',1), " &
        '                                            "('V02-04','RH Battambang','Battambang',1), " &
        '                                            "('V02-05','R5 Military Hospital','Battambang',1), " &
        '                                            "('V02-06','RH Thmor Kol','Thmor Kol',1), " &
        '                                            "('V03-02','RH Memut','Memut',1), " &
        '                                            "('V03-03','RH Kampong Cham','Kampong Cham',1), " &
        '                                            "('V03-04','RH Choeung Prey','Choeung Prey',1), " &
        '                                            "('V03-05','RH Chamkar Leu','Chamkar Leu',1), " &
        '                                            "('V03-07','PNS Tbong Khmum','Tbong Khmum',1), " &
        '                                            "('V03-08','RH Srey Santhor','Srey Santhor',1), " &
        '                                            "('V03-30','RH Batheay','Batheay',1), " &
        '                                            "('V04-01','RH Kampong Chhnang','Kampong Chhnang',1), " &
        '                                            "('V04-02','RH Kampong Tralach','Kampong Tralach',1), " &
        '                                            "('V05-01','RH Kampong Speu','Kampong Speu',1), " &
        '                                            "('V05-02','RH Oudong','Oudong',1), " &
        '                                            "('V05-04','RH Kong Pisey','Kong Pisey',1), " &
        '                                            "('V06-01','RH Kampong Thom','Kampong Thom',1), " &
        '                                            "('V06-02','RH Stoung','Stoung',1), " &
        '                                            "('V06-03','RH Baray','Baray-Santuk',1), " &
        '                                            "('V07-01','RH Kampot','Kampot',1), " &
        '                                            "('V07-02','RH Kampong Trach','Kampong Trach',1), " &
        '                                            "('V08-01','RH Takhmao','Takhmao',1), " &
        '                                            "('V08-02','RH Koh Thom','Koh Thom',1), " &
        '                                            "('V08-03','RH Kien Svay','Kien Svay',1), " &
        '                                            "('V09-01','RH Koh Kong','Smach Meanchey',1), " &
        '                                            "('V09-04','RH Sre Ambil','Sre Ambil',1), " &
        '                                            "('V10-01','RH Kratie','Kratie',1), " &
        '                                            "('V11-01','RH Senmonorom','Senmonorom',1), " &
        '                                            "('V12-01','NCADS Clinic 1','Mekong',1), " &
        '                                            "('V12-02','Calmatte Hospital','National Hopital',1), " &
        '                                            "('V12-03','National Pediatric Hospital','Chaktomok',1), " &
        '                                            "('V12-04','Center of Hope','Chaktomok',1), " &
        '                                            "('V12-06','NIPH','Chaktomok',1), " &
        '                                            "('V12-07','Institut Pateur Cambodia','Chaktomok',1), " &
        '                                            "('V12-09','RH Chbar Ampov','Bassac',1), " &
        '                                            "('V12-18','RH Samdach Ov','Mekong',1), " &
        '                                            "('V12-21','Preah Ketomealea Hospital','National Hopital',1), " &
        '                                            "('V12-22','Preah Kossamak Hospital','National Hopital',1), " &
        '                                            "('V12-26','RH Pochentong','Posenchey',1), " &
        '                                            "('V12-28','NCADS Clinic 2','Chaktomok',1), " &
        '                                            "('V12-29','RH Dang Kor','Dangkor',1), " &
        '                                            "('V12-32','Chhouk Sar Clinic','Mekong',1), " &
        '                                            "('V12-33','Chhouk Sar Clinic 2','Chaktomuk',1), " &
        '                                            "('V12-34','RH Chaktomuk','Chaktomuk',1), " &
        '                                            "('V12-35','NCADS-AHF 3','Chaktomuk',1), " &
        '                                            "('V13-01','RH 16 Makara','Tbeng Meanchey',1), " &
        '                                            "('V14-01','RH Nak Loeung','Neak Loeung',1), " &
        '                                            "('V14-02','RH Prey Veng ','Prey Veng',1), " &
        '                                            "('V14-03','RH Pear Raing','Pear Raing',1), " &
        '                                            "('V15-01','RH Pursat','Sampov Meas',1), " &
        '                                            "('V15-02','RH Phnum Kravanh','Phnum Kravanh',1), " &
        '                                            "('V15-03','RH Bakan','Bakan',1), " &
        '                                            "('V16-01','RH Ratanakiri','Ban Lung',1), " &
        '                                            "('V17-02','RH Soth Nikum','Soth Nikum',1), " &
        '                                            "('V17-03','Komar Angkor Hospital','Siem Reap',1), " &
        '                                            "('V17-04','RH Kralanh','Kralanh',1), " &
        '                                            "('V17-07','RH Siem Reap','Siem Reap',1), " &
        '                                            "('V18-01','RH Preah Sihanouk','Preah Sihanouk',1), " &
        '                                            "('V19-01','RH Stung Treng','Stung Treng',1), " &
        '                                            "('V20-01','RH Svay Rieng','Svay Rieng',1), " &
        '                                            "('V20-02','RH Romeas Hek','Romeas Hek',1), " &
        '                                            "('V21-02','RH Takeo','Daun Keo',1), " &
        '                                            "('V21-03','RH Kirivong','Kirivong',1), " &
        '                                            "('V21-04','RH Ang Roka','Ang Roka',1), " &
        '                                            "('V21-06','RH Prey Kabas','Prey Kabas',1), " &
        '                                            "('V22-01','RH Oddor Meanchey','Samrong',1), " &
        '                                            "('V22-02','RH Anlong Veng','Anlong Veng',1), " &
        '                                            "('V23-01','RH Kep','Kep',1), " &
        '                                            "('V24-01','RH Pailin','Pailin',1), " &
        '                                            "('V25-01','PH CCF Tbong Khmum','Tbong Khmum',1);", Cnndb)
        '    CmdInstblvcctsite.ExecuteNonQuery()
        '    Dim CmdAltertblvcctsite As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblvcctsite.CommandText = "alter table tblvcctsite add primary key(Vid);"
        '    CmdAltertblvcctsite.ExecuteNonQuery()

        'Catch ex As Exception

        'End Try
        ''Alter tblaimain add TPTdrug
        'Try

        '    Dim CmdAltertblaimain As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblaimain.CommandText = "alter table preart.tblaimain add column TPTdrug int(1) not null after TPT;"
        '    CmdAltertblaimain.ExecuteNonQuery()
        '    Dim CmdUptblaimainfield As New MySqlCommand("update preart.tblaimain set TPTdrug=-1;", Cnndb)
        '    CmdUptblaimainfield.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
        ''Create tblcvtptdrug
        'Try
        '    Dim CmdCtptdrug As MySqlCommand = Cnndb.CreateCommand
        '    CmdCtptdrug.CommandText = "CREATE TABLE `tblcvtptdrug` (`DrugName` char(10) NOT NULL,`Dose` char(10) NOT NULL,`Quantity` int(3) NOT NULL,`Freq` char(5) NOT NULL,`Form` char(15) NOT NULL,`Status` int(1) NOT NULL,`Da` date NOT NULL,`Reason` char(40) NOT NULL,`Remark` char(6) NOT NULL,`Vid` char(15) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
        '    CmdCtptdrug.ExecuteNonQuery()
        'Catch ex As Exception

        'End Try
        ''Alter tblcvmain add TPTout
        'Try

        '    Dim CmdAltertblcvmain As MySqlCommand = Cnndb.CreateCommand
        '    CmdAltertblcvmain.CommandText = "ALTER TABLE `preart`.`tblcvmain` ADD COLUMN `TPTout` INT(1) NULL DEFAULT NULL AFTER `Vid`;"
        '    CmdAltertblcvmain.ExecuteNonQuery()
        '    Dim CmdUptblaimainfield As New MySqlCommand("update preart.tblcvmain set TPTout=-1;", Cnndb)
        '    CmdUptblaimainfield.ExecuteNonQuery()
        'Catch ex As Exception
        'End Try
    End Sub

    Private Sub txtPassword_KeyDown(sender As Object, e As KeyEventArgs) Handles txtPassword.KeyDown
        If e.KeyCode = Keys.Enter Then
            login()
        End If
    End Sub

    Private Sub txtUserName_EditValueChanged(sender As Object, e As EventArgs) Handles txtUserName.EditValueChanged

    End Sub

    Private Sub txtUserName_KeyDown(sender As Object, e As KeyEventArgs) Handles txtUserName.KeyDown
        If e.KeyCode = Keys.Enter Then
            SendKeys.Send(Chr(9))
        End If
    End Sub

    Private Sub txtPassword_EditValueChanged(sender As Object, e As EventArgs) Handles txtPassword.EditValueChanged

    End Sub
End Class