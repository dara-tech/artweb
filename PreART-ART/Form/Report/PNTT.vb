Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class PNTT
    Dim Rdr, Rdr1 As MySqlDataReader
    Dim Sdate, Edate As Date
    Dim dbtem As MySqlConnection

    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()
        ' Add any initialization after the InitializeComponent() call.
        Dim CmdHead As New MySqlCommand("select * from tblsitename", Cnndb)
        Rdr = CmdHead.ExecuteReader
        While Rdr.Read
            Code.Text = Rdr.GetValue(2).ToString
            Province.Text = Rdr.GetValue(3).ToString
            xtcFacility.Text = Rdr.GetValue(0).ToString
            xtcDisct.Text = Rdr.GetValue(4).ToString
            With frmNationalRoption
                If .TabControl1.SelectedIndex = 0 Then
                    xtcyear.Text = .cboYear.Text
                    xtcQuarter.Text = .cboQuarter.Text
                    Select Case Val(.cboQuarter.Text)
                        Case 1
                            Sdate = DateSerial(.cboYear.Text, 1, 1)
                            Edate = DateSerial(.cboYear.Text, 3, 31)
                        Case 2
                            Sdate = DateSerial(.cboYear.Text, 4, 1)
                            Edate = DateSerial(.cboYear.Text, 6, 30)
                        Case 3
                            Sdate = DateSerial(.cboYear.Text, 7, 1)
                            Edate = DateSerial(.cboYear.Text, 9, 30)
                        Case 4
                            Sdate = DateSerial(.cboYear.Text, 10, 1)
                            Edate = DateSerial(.cboYear.Text, 12, 31)
                    End Select
                Else
                    xtcyear.Text = .daStart.Text & " To  " & .daEnd.Text
                    'XrTableCell488.Text = .daStart.Text & " To  " & .daEnd.Text
                    Sdate = CDate(.daStart.Text)
                    Edate = CDate(.daEnd.Text)
                End If
            End With
        End While
        Rdr.Close()
        Dim CmdTable1 As MySqlCommand = Cnndb.CreateCommand
        Try
            CmdTable1.CommandText = "DROP VIEW `preart`.`Adultactive`;"
            CmdTable1.ExecuteNonQuery()
        Catch ex As Exception
        End Try
        CmdTable1.CommandText = "CREATE  VIEW `Adultactive` AS  SELECT tblaimain.ClinicID,tblaimain.Sex,tblaimain.TypeofReturn,tblaimain.OffIn FROM tblaimain WHERE tblaimain.DafirstVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'"
        CmdTable1.ExecuteNonQuery()



        'Number of Patient register PNTT on this quarter (New Patient)
        Dim cmdNP As New MySqlCommand("SELECT count(adultactive.sex) as Tsex, sum(adultactive.sex='0') as Female,sum(adultactive.sex='1') as Male FROM adultactive where adultactive.typeofReturn=-1 and adultactive.offIn<>1", Cnndb)
        Rdr = cmdNP.ExecuteReader
        While Rdr.Read
            ' XrTableCell717.Text = Rdr.GetValue(0).ToString
            XrTableCell715.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell716.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        ' Partner notification service
        'Dim CmdNew As New MySqlCommand("SELECT count(adultactive.sex) as Tsex, sum(case when adultactive.sex='0' then 1 else 0 end) as Female,sum(case when adultactive.sex='1' then 1 else 0 end) as Male FROM adultactive " &
        '                                " LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID WHERE (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdNew.ExecuteReader

        Dim CmdNew As New MySqlCommand("SELECT count(i.sex) as Tsex, sum(case when i.sex='0' then 1 else 0 end) as Female,sum(case when i.sex='1' then 1 else 0 end) as Male FROM(select adultactive.ClinicID,adultactive.Sex from adultactive" &
                                        " LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID WHERE (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' group by adultactive.ClinicID) i", Cnndb)
        Rdr = CmdNew.ExecuteReader
        While Rdr.Read
            ' XrTableCell724.Text = Rdr.GetValue(0).ToString
            XrTableCell722.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell723.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'New Patient aggree provide partner
        'Dim CmdNPart As New MySqlCommand("SELECT count(adultactive.sex) as Tsex, sum(case when adultactive.sex='0' then 1 else 0 end) as Female,sum(case when adultactive.sex='1' then 1 else 0 end) as Male FROM adultactive " &
        '                               " LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID WHERE (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree = 0 AND tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdNPart.ExecuteReader

        Dim CmdNPart As New MySqlCommand("SELECT count(i.sex) as Tsex, sum(case when i.sex='0' then 1 else 0 end) as Female,sum(case when i.sex='1' then 1 else 0 end) as Male FROM(select adultactive.ClinicID,adultactive.Sex from adultactive " &
                                       " LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID WHERE (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree = 0 AND tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' group by adultactive.ClinicID) i", Cnndb)
        Rdr = CmdNPart.ExecuteReader
        While Rdr.Read
            ' XrTableCell731.Text = Rdr.GetValue(0).ToString
            XrTableCell729.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell730.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        ' PNTT Risk new register
        Dim CmdNrisk As New MySqlCommand("SELECT  sum(tblapntt.SexHIV='0'  ) as R,sum(tblapntt.SexHIV='1') as R1,sum(tblapntt.SexHIV='2' ) as R2,sum(tblapntt.Wsex='0' ) as 1R,sum(tblapntt.Wsex='1' ) as 1R1,sum(tblapntt.Wsex='2' ) as 1R2," &
                                          "sum(tblapntt.SexM='0' ) as 2R,sum(tblapntt.SexM='1' ) as 2R1,sum(tblapntt.SexM='2' ) as 2R2,sum(tblapntt.SexTran='0' ) as 3R,sum(tblapntt.SexTran='1' ) as 3R1,sum(tblapntt.SexTran='2' ) as 3R2," &
                                            "sum(tblapntt.Sex4='0' ) as 4R,sum(tblapntt.Sex4='1' ) as 4R1,sum(tblapntt.Sex4='2' ) as 4R2,sum(tblapntt.Drug='0' ) as 5R,sum(tblapntt.Drug='1' ) as 5R1,sum(tblapntt.Drug='2' ) as 5R2," &
                                            "sum(tblapntt.Pill='0' ) as 6R,sum(tblapntt.Pill='1' ) as 6R1,sum(tblapntt.Pill='2' ) as 6R2,sum(tblapntt.SexMoney='0' ) as 7R,sum(tblapntt.SexMoney='1' ) as 7R1,sum(tblapntt.SexMoney='2' ) as 7R2," &
                                            "sum(tblapntt.SexProvice ='0' ) as 8R,sum(tblapntt.SexProvice='1' ) as 8R1,sum(tblapntt.SexProvice='2' ) as 8R2,sum(tblapntt.WOut='0' ) as 9R,sum(tblapntt.WOut='1' ) as 9R1,sum(tblapntt.WOut='2' ) as 9R2 " &
                                            "From adultactive LEFT OUTER Join (select p.ClinicID, p.DaVisit, SexHIV, Wsex, SexM, SexTran, Sex4, Drug, Pill, SexMoney, SexProvice, WOut, Agree, AsID from tblapntt p inner join " &
                                            "(select ClinicID, max(DaVisit) as DaVisit from tblapntt " &
                                            "where DaVisit  and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' group by ClinicID ) mp on mp.ClinicID=p.ClinicID and p.DaVisit=mp.DaVisit) tblapntt On adultactive.ClinicID = tblapntt.ClinicID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) ", Cnndb)
        Rdr = CmdNrisk.ExecuteReader
        While Rdr.Read
            XrTableCell742.Text = Val(Rdr.GetValue(0).ToString)
            XrTableCell743.Text = Val(Rdr.GetValue(1).ToString)
            XrTableCell744.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell749.Text = Val(Rdr.GetValue(3).ToString)
            XrTableCell750.Text = Val(Rdr.GetValue(4).ToString)
            XrTableCell751.Text = Val(Rdr.GetValue(5).ToString)
            XrTableCell756.Text = Val(Rdr.GetValue(6).ToString)
            XrTableCell757.Text = Val(Rdr.GetValue(7).ToString)
            XrTableCell758.Text = Val(Rdr.GetValue(8).ToString)
            XrTableCell763.Text = Val(Rdr.GetValue(9).ToString)
            XrTableCell764.Text = Val(Rdr.GetValue(10).ToString)
            XrTableCell765.Text = Val(Rdr.GetValue(11).ToString)
            XrTableCell770.Text = Val(Rdr.GetValue(12).ToString)
            XrTableCell771.Text = Val(Rdr.GetValue(13).ToString)
            XrTableCell772.Text = Val(Rdr.GetValue(14).ToString)
            XrTableCell777.Text = Val(Rdr.GetValue(15).ToString)
            XrTableCell778.Text = Val(Rdr.GetValue(16).ToString)
            XrTableCell779.Text = Val(Rdr.GetValue(17).ToString)
            XrTableCell784.Text = Val(Rdr.GetValue(18).ToString)
            XrTableCell785.Text = Val(Rdr.GetValue(19).ToString)
            XrTableCell786.Text = Val(Rdr.GetValue(20).ToString)
            XrTableCell791.Text = Val(Rdr.GetValue(21).ToString)
            XrTableCell792.Text = Val(Rdr.GetValue(22).ToString)
            XrTableCell793.Text = Val(Rdr.GetValue(23).ToString)
            XrTableCell798.Text = Val(Rdr.GetValue(24).ToString)
            XrTableCell799.Text = Val(Rdr.GetValue(25).ToString)
            XrTableCell800.Text = Val(Rdr.GetValue(26).ToString)
            XrTableCell805.Text = Val(Rdr.GetValue(27).ToString)
            XrTableCell806.Text = Val(Rdr.GetValue(28).ToString)
            XrTableCell807.Text = Val(Rdr.GetValue(29).ToString)
        End While
        Rdr.Close()

        'Number of Partner Register 
        Dim CmdNPatreg As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPatreg.ExecuteReader
        While Rdr.Read
            ' XrTableCell824.Text = Rdr.GetValue(0).ToString
            XrTableCell822.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell823.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Partner Referal + Test HIV + Positive
        Dim CmdNPre As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 1 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPre.ExecuteReader
        While Rdr.Read
            XrTableCell829.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell830.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Partner who were tested for HIV by HTS(Sithorn)
        Dim CmdNPreT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPreT.ExecuteReader
        While Rdr.Read
            XrTableCell864.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell865.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Partner who were tested HIV positive by HTS(Sithorn)
        Dim CmdNPreTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=0 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPreTP.ExecuteReader
        While Rdr.Read
            XrTableCell905.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell906.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Partner Provider + Test HIV + Positive
        Dim CmdNPP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 2 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPP.ExecuteReader
        While Rdr.Read
            XrTableCell836.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell837.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Partner who were tested for HIV by HIVST(Sithorn)
        Dim CmdNPPT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=1  and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPPT.ExecuteReader
        While Rdr.Read
            XrTableCell871.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell872.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Partner who were tested HIV positive by HIVST(Sithorn)
        Dim CmdNPPTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=1 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPPTP.ExecuteReader
        While Rdr.Read
            XrTableCell912.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell913.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Partner Contact + Test HIV + Positive
        Dim CmdNPC As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 3 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPC.ExecuteReader
        While Rdr.Read
            XrTableCell843.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell844.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdNPcT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 3 AND tblapnttpart.StatusHIV = 2 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        'Rdr = CmdNPcT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell878.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell879.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdNPcTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 3 AND tblapnttpart.StatusHIV = 2 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        'Rdr = CmdNPcTP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell919.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell920.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()


        'Partner Dual + Test HIV + Positive
        Dim CmdNPD As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 4 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPD.ExecuteReader
        While Rdr.Read
            XrTableCell850.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell851.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdNPDT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 4 AND tblapnttpart.StatusHIV = 2 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        'Rdr = CmdNPDT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell885.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell886.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdNPdTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 4 AND tblapnttpart.StatusHIV = 2 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        'Rdr = CmdNPdTP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell926.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell927.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Number of partner Positive and register
        Dim CmdNPreg As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where (adultactive.TypeofReturn=-1 and adultactive.offin<>1) and tblapntt.Agree=0  AND tblapnttpart.StatusHIV = 2 AND tblapnttpart.Result = 0 AND tblapnttpart.RegTreat = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)

        Rdr = CmdNPreg.ExecuteReader
        While Rdr.Read
            XrTableCell942.Text = Val(Rdr.GetValue(0).ToString)
            XrTableCell940.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell941.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Number of children Register(Edited by sithorn)
        Dim CmdCr As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID  LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCr.ExecuteReader
        While Rdr.Read
            XrTableCell967.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell968.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Number of Child Ref +Test + Pos(Edited by sithorn)
        Dim CmdCrR As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0  and tblapnttchild.PlanChild=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCrR.ExecuteReader
        While Rdr.Read
            XrTableCell975.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell976.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Child who was tested for HIV (Sithorn)
        Dim CmdCrRT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCrRT.ExecuteReader
        While Rdr.Read
            XrTableCell1015.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1016.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Child who was tested HIV positive (Sithorn)
        Dim CmdCrRTP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCrRTP.ExecuteReader
        While Rdr.Read
            XrTableCell1055.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1056.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Number of Child Provider +Test + Pos(Edited by sithorn)
        Dim CmdCrP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0  and tblapnttchild.PlanChild=1 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCrP.ExecuteReader
        While Rdr.Read
            XrTableCell983.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell984.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdCrPT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=1 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdCrPT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1023.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1024.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Dim CmdCrPTP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=1 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdCrPTP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1063.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1064.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Number of Child contract +Test + Pos(Edited by sithorn)
        Dim CmdCrc As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0 and tblapnttchild.PlanChild=2 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCrc.ExecuteReader
        While Rdr.Read
            XrTableCell991.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell992.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdCrcT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=2 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdCrcT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1031.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1032.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdCrPcP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=2 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdCrPcP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1071.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1072.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Number of Child Dual +Test + Pos(Edited by sithorn)
        Dim CmdCrd As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0  and tblapnttchild.PlanChild=3 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCrd.ExecuteReader
        While Rdr.Read
            XrTableCell999.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1000.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdCrdT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=3 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdCrdT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1039.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1040.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdCrdP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=3 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        'Rdr = CmdCrdP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1079.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1080.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Child Pos and Reg(Edited by sithorn)
        Dim CmdCpr As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive LEFT OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where (adultactive.typeofReturn=-1 and adultactive.offIn<>1) and tblapntt.Agree=0  and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and tblapnttchild.RegTreat=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdCpr.ExecuteReader
        While Rdr.Read
            XrTableCell1097.Text = Val(Rdr.GetValue(0).ToString)
            XrTableCell1095.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1096.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Old Patient  and register PNTT

        ' Partner notification service
        '        Dim CmdOn As New MySqlCommand("SELECT count(tblaimain.Sex) as Tsex,sum(tblaimain.Sex=0) as Female,sum(tblaimain.Sex=1) as Male FROM adultactive RIGHT OUTER JOIN tblapntt " &
        '                                        "ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblaimain ON tblaimain.ClinicID = tblapntt.ClinicID WHERE tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
        'or adultactive.TypeofReturn<>-1)", Cnndb)
        '        Rdr = CmdOn.ExecuteReader

        Dim CmdOn As New MySqlCommand("SELECT count(i.Sex) as Tsex,sum(i.Sex=0) as Female,sum(i.Sex=1) as Male FROM(select tblapntt.ClinicID, tblaimain.Sex from adultactive RIGHT OUTER JOIN tblapntt " &
                                                "ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblaimain ON tblaimain.ClinicID = tblapntt.ClinicID WHERE tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
        or adultactive.TypeofReturn<>-1) group by tblapntt.ClinicID) i", Cnndb)
        Rdr = CmdOn.ExecuteReader
        While Rdr.Read
            XrTableCell725.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell726.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        ' Patient aggree provide partner 
        '        Dim CmdOPart As New MySqlCommand("SELECT count(tblaimain.Sex) as Tsex,sum(tblaimain.Sex=0) as Female,sum(tblaimain.Sex=1) as Male FROM adultactive RIGHT OUTER JOIN tblapntt " &
        '                                        "ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblaimain ON tblaimain.ClinicID = tblapntt.ClinicID WHERE tblapntt.Agree = 0 AND tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
        'or adultactive.TypeofReturn<>-1)", Cnndb)
        '        Rdr = CmdOPart.ExecuteReader

        Dim CmdOPart As New MySqlCommand("SELECT count(i.Sex) as Tsex,sum(i.Sex=0) as Female,sum(i.Sex=1) as Male FROM(select tblapntt.ClinicID, tblaimain.Sex from adultactive RIGHT OUTER JOIN tblapntt " &
                                        "ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblaimain ON tblaimain.ClinicID = tblapntt.ClinicID WHERE tblapntt.Agree = 0 AND tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1) group by tblapntt.ClinicID) i", Cnndb)
        Rdr = CmdOPart.ExecuteReader
        While Rdr.Read
            XrTableCell732.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell733.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        ' PNTT Risk new register
        Dim CmdOrisk As New MySqlCommand("SELECT  sum(tblapntt.SexHIV='0'  ) as R,sum(tblapntt.SexHIV='1') as R1,sum(tblapntt.SexHIV='2' ) as R2,sum(tblapntt.Wsex='0' ) as 1R,sum(tblapntt.Wsex='1' ) as 1R1,sum(tblapntt.Wsex='2' ) as 1R2," &
                                          "sum(tblapntt.SexM='0' ) as 2R,sum(tblapntt.SexM='1' ) as 2R1,sum(tblapntt.SexM='2' ) as 2R2,sum(tblapntt.SexTran='0' ) as 3R,sum(tblapntt.SexTran='1' ) as 3R1,sum(tblapntt.SexTran='2' ) as 3R2," &
                                            "sum(tblapntt.Sex4='0' ) as 4R,sum(tblapntt.Sex4='1' ) as 4R1,sum(tblapntt.Sex4='2' ) as 4R2,sum(tblapntt.Drug='0' ) as 5R,sum(tblapntt.Drug='1' ) as 5R1,sum(tblapntt.Drug='2' ) as 5R2," &
                                            "sum(tblapntt.Pill='0' ) as 6R,sum(tblapntt.Pill='1' ) as 6R1,sum(tblapntt.Pill='2' ) as 6R2,sum(tblapntt.SexMoney='0' ) as 7R,sum(tblapntt.SexMoney='1' ) as 7R1,sum(tblapntt.SexMoney='2' ) as 7R2," &
                                            "sum(tblapntt.SexProvice ='0' ) as 8R,sum(tblapntt.SexProvice='1' ) as 8R1,sum(tblapntt.SexProvice='2' ) as 8R2,sum(tblapntt.WOut='0' ) as 9R,sum(tblapntt.WOut='1' ) as 9R1,sum(tblapntt.WOut='2' ) as 9R2 " &
                                            "From adultactive  RIGHT OUTER Join tblapntt On adultactive.ClinicID = tblapntt.ClinicID Where tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)
        Rdr = CmdOrisk.ExecuteReader
        While Rdr.Read
            XrTableCell745.Text = Val(Rdr.GetValue(0).ToString)
            XrTableCell746.Text = Val(Rdr.GetValue(1).ToString)
            XrTableCell747.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell752.Text = Val(Rdr.GetValue(3).ToString)
            XrTableCell753.Text = Val(Rdr.GetValue(4).ToString)
            XrTableCell754.Text = Val(Rdr.GetValue(5).ToString)
            XrTableCell759.Text = Val(Rdr.GetValue(6).ToString)
            XrTableCell760.Text = Val(Rdr.GetValue(7).ToString)
            XrTableCell761.Text = Val(Rdr.GetValue(8).ToString)
            XrTableCell766.Text = Val(Rdr.GetValue(9).ToString)
            XrTableCell767.Text = Val(Rdr.GetValue(10).ToString)
            XrTableCell768.Text = Val(Rdr.GetValue(11).ToString)
            XrTableCell773.Text = Val(Rdr.GetValue(12).ToString)
            XrTableCell774.Text = Val(Rdr.GetValue(13).ToString)
            XrTableCell775.Text = Val(Rdr.GetValue(14).ToString)
            XrTableCell780.Text = Val(Rdr.GetValue(15).ToString)
            XrTableCell781.Text = Val(Rdr.GetValue(16).ToString)
            XrTableCell782.Text = Val(Rdr.GetValue(17).ToString)
            XrTableCell787.Text = Val(Rdr.GetValue(18).ToString)
            XrTableCell788.Text = Val(Rdr.GetValue(19).ToString)
            XrTableCell789.Text = Val(Rdr.GetValue(20).ToString)
            XrTableCell794.Text = Val(Rdr.GetValue(21).ToString)
            XrTableCell795.Text = Val(Rdr.GetValue(22).ToString)
            XrTableCell796.Text = Val(Rdr.GetValue(23).ToString)
            XrTableCell801.Text = Val(Rdr.GetValue(24).ToString)
            XrTableCell802.Text = Val(Rdr.GetValue(25).ToString)
            XrTableCell803.Text = Val(Rdr.GetValue(26).ToString)
            XrTableCell808.Text = Val(Rdr.GetValue(27).ToString)
            XrTableCell809.Text = Val(Rdr.GetValue(28).ToString)
            XrTableCell810.Text = Val(Rdr.GetValue(29).ToString)
        End While
        Rdr.Close()

        'Old of Partner Register 
        Dim CmdOPatreg As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "Right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdOPatreg.ExecuteReader
        While Rdr.Read
            XrTableCell825.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell826.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Partner Referal + Test HIV + Positive
        Dim CmdoPre As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 1 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdoPre.ExecuteReader
        While Rdr.Read
            XrTableCell832.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell833.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'For old. Partners who were tested for HIV by HTS(Sithorn)
        Dim CmdoPreT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdoPreT.ExecuteReader
        While Rdr.Read
            XrTableCell867.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell868.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'For old. Partners who were tested HIV positive by HTS(Sithorn)
        Dim CmdoPreTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=0 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdoPreTP.ExecuteReader
        While Rdr.Read
            XrTableCell908.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell909.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Partner Provider + Test HIV + Positive
        Dim CmdOPP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 2 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdOPP.ExecuteReader
        While Rdr.Read
            XrTableCell839.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell840.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'For old. Partners who were tested for HIV by HIVST(Sithorn)
        Dim CmdOPPT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=1 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdOPPT.ExecuteReader
        While Rdr.Read
            XrTableCell874.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell875.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'For old. Partners who were tested HIV positive by HIVST(Sithorn)
        Dim CmdOPPTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.StatusHIV = 2 and tblapnttpart.HTS=1 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdOPPTP.ExecuteReader
        While Rdr.Read
            XrTableCell915.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell916.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Partner Contact + Test HIV + Positive
        Dim CmdOPC As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 3 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdOPC.ExecuteReader
        While Rdr.Read
            XrTableCell846.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell847.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdOPcT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 3 AND tblapnttpart.StatusHIV = 2 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)

        'Rdr = CmdOPcT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell881.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell882.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdOPcTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 3 AND tblapnttpart.StatusHIV = 2 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)

        'Rdr = CmdOPcTP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell922.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell923.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()


        'Partner Dual + Test HIV + Positive
        Dim CmdOPD As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                           "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 4 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdOPD.ExecuteReader
        While Rdr.Read
            XrTableCell853.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell854.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdOPDT As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 4 AND tblapnttpart.StatusHIV = 2 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)

        'Rdr = CmdOPDT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell888.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell889.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdOPdTP As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
        '                                 "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0 and tblapnttpart.NotificationIPV = 4 AND tblapnttpart.StatusHIV = 2 AND tblapnttpart.Result = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)

        'Rdr = CmdOPdTP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell929.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell930.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Number of partner Positive and register
        Dim CmdOPreg As New MySqlCommand("SELECT count(tblapnttpart.Sex) as Tsex, sum(tblapnttpart.Sex=0) as Female,sum(tblapnttpart.Sex=1) as Male FROM adultactive " &
                                         "right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID Where tblapntt.Agree=0  AND tblapnttpart.StatusHIV = 2 AND tblapnttpart.Result = 0 AND tblapnttpart.RegTreat = 0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1
or adultactive.TypeofReturn<>-1)", Cnndb)

        Rdr = CmdOPreg.ExecuteReader
        While Rdr.Read
            XrTableCell945.Text = Val(Rdr.GetValue(0).ToString)
            XrTableCell943.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell944.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Number of old children Register(Edited by Sithorn)
        Dim CmdOCr As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0 and tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCr.ExecuteReader
        While Rdr.Read
            XrTableCell970.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell971.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Number of Child Ref +Test + Pos(Edited by Sithorn)
        Dim CmdOCrR As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCrR.ExecuteReader
        While Rdr.Read
            XrTableCell978.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell979.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'For old. Children who were tested for HIV(Sithorn)
        Dim CmdOCrRT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCrRT.ExecuteReader
        While Rdr.Read
            XrTableCell1018.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1019.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'For old. Children who were tested HIV positive(Sithorn)
        Dim CmdOCrRTP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCrRTP.ExecuteReader
        While Rdr.Read
            XrTableCell1058.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1059.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        'Number of Child Provider +Test + Pos(Edited by Sithorn)
        Dim CmdOCrP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=1 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCrP.ExecuteReader
        While Rdr.Read
            XrTableCell986.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell987.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdOCrPT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=1 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)
        'Rdr = CmdOCrPT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1026.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1027.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdOCrPTP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=1 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)
        'Rdr = CmdOCrPTP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1066.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1067.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Number of Child contract +Test + Pos(Edited by Sithorn)
        Dim CmdOCrc As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0 and tblapnttchild.PlanChild=2 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCrc.ExecuteReader
        While Rdr.Read
            XrTableCell994.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell995.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdOCrcT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=2 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)
        'Rdr = CmdOCrcT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1034.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1035.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdOCrPcP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=2 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)
        'Rdr = CmdOCrPcP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1074.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1075.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Number of Child Dual +Test + Pos(Edited by Sithorn)
        Dim CmdOCrd As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=3 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCrd.ExecuteReader
        While Rdr.Read
            XrTableCell1002.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1003.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()
        'Dim CmdOCrdT As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=3 and tblapnttchild.StatusHIV=2 and   tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)
        'Rdr = CmdOCrdT.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1042.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1043.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()
        'Dim CmdOCrdP As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttpart ON tblapntt.AsID = tblapnttpart.AsID LEFT OUTER JOIN tblapnttchild ON tblapnttpart.APID = tblapnttchild.APID Where tblapntt.Agree=0  and tblapnttchild.PlanChild=3 and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and adultactive.ClinicID is null", Cnndb)
        'Rdr = CmdOCrdP.ExecuteReader
        'While Rdr.Read
        '    XrTableCell1082.Text = Val(Rdr.GetValue(1).ToString)
        '    XrTableCell1083.Text = Val(Rdr.GetValue(2).ToString)
        'End While
        'Rdr.Close()

        'Child Pos and Reg(Edited by Sithorn)
        Dim CmdOCpr As New MySqlCommand("SELECT count(tblapnttchild.Sex) as Tsex , sum(tblapnttchild.Sex=0) as Female,sum(tblapnttchild.Sex) as Male FROM adultactive right OUTER JOIN tblapntt ON adultactive.ClinicID = tblapntt.ClinicID LEFT OUTER JOIN tblapnttchild ON tblapntt.AsID = tblapnttchild.AsID Where tblapntt.Agree=0  and tblapnttchild.StatusHIV=2 and tblapnttchild.Result=0 and tblapnttchild.RegTreat=0 and  tblapntt.DaVisit  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "' and (adultactive.ClinicID is null or adultactive.OffIn=1 or adultactive.TypeofReturn<>-1)
and tblapnttchild.CAPID is not null", Cnndb)
        Rdr = CmdOCpr.ExecuteReader
        While Rdr.Read
            XrTableCell1100.Text = Val(Rdr.GetValue(0).ToString)
            XrTableCell1098.Text = Val(Rdr.GetValue(2).ToString)
            XrTableCell1099.Text = Val(Rdr.GetValue(1).ToString)
        End While
        Rdr.Close()

        Try
            CmdTable1.CommandText = "DROP VIEW `preart`.`Adultactive`;"
            CmdTable1.ExecuteNonQuery()
        Catch ex As Exception
        End Try
    End Sub

End Class