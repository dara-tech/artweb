Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class VCCT
    Dim Rdr As MySqlDataReader
    Dim Sdate, Edate As Date
    Dim Vsite As String = ""
    'Dim dbtem As MySqlConnection
    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        Dim CmdHead As New MySqlCommand("SELECT * FROM preart.tblcenter;", Cnndb)
        Rdr = CmdHead.ExecuteReader
        While Rdr.Read
            Vsite = Rdr.GetValue(3).ToString
            Code.Text = Vsite
            Province.Text = Rdr.GetValue(0).ToString
            xtcFacility.Text = Rdr.GetValue(4).ToString
            xtcDisct.Text = Rdr.GetValue(2).ToString
            With frmNationalRoption
                If .TabControl1.SelectedIndex = 0 Then
                    xtcyear.Text = .cboYear.Text
                    xtcQuarter.Text = .cboQuarter.Text
                    Select Case Val(.cboQuarter.Text)
                        Case 1
                            Sdate = DateSerial(CInt(.cboYear.Text), 1, 1)
                            Edate = DateSerial(CInt(.cboYear.Text), 3, 31)
                        Case 2
                            Sdate = DateSerial(CInt(.cboYear.Text), 4, 1)
                            Edate = DateSerial(CInt(.cboYear.Text), 6, 30)
                        Case 3
                            Sdate = DateSerial(CInt(.cboYear.Text), 7, 1)
                            Edate = DateSerial(CInt(.cboYear.Text), 9, 30)
                        Case 4
                            Sdate = DateSerial(CInt(.cboYear.Text), 10, 1)
                            Edate = DateSerial(CInt(.cboYear.Text), 12, 31)
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

        Dim CmdView1 As MySqlCommand = Cnndb.CreateCommand
        Try
            CmdView1.CommandText = "DROP VIEW `preart`.`vcctview`;"
            CmdView1.ExecuteNonQuery()
        Catch ex As Exception
        End Try
        CmdView1.CommandText = "CREATE  VIEW `vcctview` AS  SELECT Vcctid,DaReg,Sex,DaDob,TPatient,HTestResult,HIVResult,RTRIResult,VLResult,RITAResult,Counselor,TransferTo FROM preart.tblvcct where DaReg BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'"
        CmdView1.ExecuteNonQuery()

        'PreTest age:0-14
        Dim CmdPre1 As New MySqlCommand("SELECT sum(case when Sex=0 and TPatient=1 then 1 else 0 end) as Famale0,
                                                sum(case when Sex=0 and TPatient=2 then 1 else 0 end) as Famale1,
                                                sum(case when Sex=0 and TPatient=3 then 1 else 0 end) as Famale2,
                                                sum(case when Sex=0 and TPatient=4 then 1 else 0 end) as Famale3,
                                                sum(case when Sex=0 and TPatient=5 then 1 else 0 end) as Famale4,
                                                sum(case when Sex=0 and TPatient=6 then 1 else 0 end) as Famale5,
                                                sum(case when Sex=0 and TPatient=7 then 1 else 0 end) as Famale6,
                                                sum(case when Sex=0 and TPatient=8 then 1 else 0 end) as Famale7,
                                                sum(case when Sex=1 and TPatient=1 then 1 else 0 end) as Male8,
                                                sum(case when Sex=1 and TPatient=2 then 1 else 0 end) as Male9,
                                                sum(case when Sex=1 and TPatient=3 then 1 else 0 end) as Male10,
                                                sum(case when Sex=1 and TPatient=4 then 1 else 0 end) as Male11,
                                                sum(case when Sex=1 and TPatient=5 then 1 else 0 end) as Male12,
                                                sum(case when Sex=1 and TPatient=6 then 1 else 0 end) as Male13,
                                                sum(case when Sex=1 and TPatient=7 then 1 else 0 end) as Male14,
                                                sum(case when Sex=1 and TPatient=8 then 1 else 0 end) as Male15,
                                                sum(case when Sex=0 and HTestResult=1 then 1 else 0 end) as ReactiveFemale16,
                                                sum(case when Sex=1 and HTestResult=1 then 1 else 0 end) as ReactiveMale17
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPre1.ExecuteReader
        While Rdr.Read
            C1F1.Text = Rdr.GetValue(0).ToString
            C2M1.Text = Rdr.GetValue(9).ToString
            C3M1.Text = Rdr.GetValue(10).ToString
            C3F1.Text = Rdr.GetValue(2).ToString
            C4M1.Text = Rdr.GetValue(14).ToString
            C5M1.Text = Rdr.GetValue(11).ToString
            C5F1.Text = Rdr.GetValue(3).ToString
            C6M1.Text = Rdr.GetValue(12).ToString
            C6F1.Text = Rdr.GetValue(4).ToString
            C7M1.Text = Rdr.GetValue(13).ToString
            C7F1.Text = Rdr.GetValue(5).ToString
            C9M1.Text = Rdr.GetValue(17).ToString
            C9F1.Text = Rdr.GetValue(16).ToString
        End While
        Rdr.Close()
        'PreTest age:15-49
        Dim CmdPre2 As New MySqlCommand("SELECT sum(case when Sex=0 and TPatient=1 then 1 else 0 end) as Famale0,
                                                sum(case when Sex=0 and TPatient=2 then 1 else 0 end) as Famale1,
                                                sum(case when Sex=0 and TPatient=3 then 1 else 0 end) as Famale2,
                                                sum(case when Sex=0 and TPatient=4 then 1 else 0 end) as Famale3,
                                                sum(case when Sex=0 and TPatient=5 then 1 else 0 end) as Famale4,
                                                sum(case when Sex=0 and TPatient=6 then 1 else 0 end) as Famale5,
                                                sum(case when Sex=0 and TPatient=7 then 1 else 0 end) as Famale6,
                                                sum(case when Sex=0 and TPatient=8 then 1 else 0 end) as Famale7,
                                                sum(case when Sex=1 and TPatient=1 then 1 else 0 end) as Male8,
                                                sum(case when Sex=1 and TPatient=2 then 1 else 0 end) as Male9,
                                                sum(case when Sex=1 and TPatient=3 then 1 else 0 end) as Male10,
                                                sum(case when Sex=1 and TPatient=4 then 1 else 0 end) as Male11,
                                                sum(case when Sex=1 and TPatient=5 then 1 else 0 end) as Male12,
                                                sum(case when Sex=1 and TPatient=6 then 1 else 0 end) as Male13,
                                                sum(case when Sex=1 and TPatient=7 then 1 else 0 end) as Male14,
                                                sum(case when Sex=1 and TPatient=8 then 1 else 0 end) as Male15,
                                                sum(case when Sex=0 and HTestResult=1 then 1 else 0 end) as ReactiveFemale16,
                                                sum(case when Sex=1 and HTestResult=1 then 1 else 0 end) as ReactiveMale17
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPre2.ExecuteReader
        While Rdr.Read
            C1F2.Text = Rdr.GetValue(0).ToString
            C2M2.Text = Rdr.GetValue(9).ToString
            C3M2.Text = Rdr.GetValue(10).ToString
            C3F2.Text = Rdr.GetValue(2).ToString
            C4M2.Text = Rdr.GetValue(14).ToString
            C5M2.Text = Rdr.GetValue(11).ToString
            C5F2.Text = Rdr.GetValue(3).ToString
            C6M2.Text = Rdr.GetValue(12).ToString
            C6F2.Text = Rdr.GetValue(4).ToString
            C7M2.Text = Rdr.GetValue(13).ToString
            C7F2.Text = Rdr.GetValue(5).ToString
            C8M2.Text = Rdr.GetValue(15).ToString
            C8F2.Text = Rdr.GetValue(7).ToString
            C9M2.Text = Rdr.GetValue(17).ToString
            C9F2.Text = Rdr.GetValue(16).ToString
        End While
        Rdr.Close()
        'PreTest age:>=50
        Dim CmdPre3 As New MySqlCommand("SELECT sum(case when Sex=0 and TPatient=1 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) As Famale0,
                                                sum(case when Sex=0 and TPatient=2 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Famale1,
                                                sum(case when Sex=0 and TPatient=3 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Famale2,
                                                sum(case when Sex=0 and TPatient=4 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Famale3,
                                                sum(case when Sex=0 and TPatient=5 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Famale4,
                                                sum(case when Sex=0 and TPatient=6 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Famale5,
                                                sum(case when Sex=0 and TPatient=7 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Famale6,
                                                sum(case when Sex=0 and TPatient=8 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Famale7,
                                                sum(case when Sex=1 and TPatient=1 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male8,
                                                sum(case when Sex=1 and TPatient=2 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male9,
                                                sum(case when Sex=1 and TPatient=3 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male10,
                                                sum(case when Sex=1 and TPatient=4 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male11,
                                                sum(case when Sex=1 and TPatient=5 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male12,
                                                sum(case when Sex=1 and TPatient=6 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male13,
                                                sum(case when Sex=1 and TPatient=7 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male14,
                                                sum(case when Sex=1 and TPatient=8 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as Male15,
                                                sum(case when Sex=0 and HTestResult=1 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as ReactiveFemale16,
                                                sum(case when Sex=1 and HTestResult=1 and (timestampdiff(year, DaDob, DaReg)>=50) then 1 else 0 end) as ReactiveMale17
                                          FROM vcctview" & ";", Cnndb)
        ' " WHERE (timestampdiff(year, DaDob, DaReg)>=50) And tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPre3.ExecuteReader
        While Rdr.Read
            C1F3.Text = Rdr.GetValue(0).ToString
            C2M3.Text = Rdr.GetValue(9).ToString
            C3M3.Text = Rdr.GetValue(10).ToString
            C3F3.Text = Rdr.GetValue(2).ToString
            C4M3.Text = Rdr.GetValue(14).ToString
            C5M3.Text = Rdr.GetValue(11).ToString
            C5F3.Text = Rdr.GetValue(3).ToString
            C6M3.Text = Rdr.GetValue(12).ToString
            C6F3.Text = Rdr.GetValue(4).ToString
            C7M3.Text = Rdr.GetValue(13).ToString
            C7F3.Text = Rdr.GetValue(5).ToString
            C8M3.Text = Rdr.GetValue(15).ToString
            C8F3.Text = Rdr.GetValue(7).ToString
            C9M3.Text = Rdr.GetValue(17).ToString
            C9F3.Text = Rdr.GetValue(16).ToString
        End While
        Rdr.Close()

        'PositiveTest age:0-14
        Dim CmdPosTes1 As New MySqlCommand("SELECT sum(case when Sex=0 and TPatient=1 and HIVResult=2 then 1 else 0 end) as Famale0,
                                                sum(case when Sex=0 and TPatient=2 and HIVResult=2 then 1 else 0 end) as Famale1,
                                                sum(case when Sex=0 and TPatient=3 and HIVResult=2 then 1 else 0 end) as Famale2,
                                                sum(case when Sex=0 and TPatient=4 and HIVResult=2 then 1 else 0 end) as Famale3,
                                                sum(case when Sex=0 and TPatient=5 and HIVResult=2 then 1 else 0 end) as Famale4,
                                                sum(case when Sex=0 and TPatient=6 and HIVResult=2 then 1 else 0 end) as Famale5,
                                                sum(case when Sex=0 and TPatient=7 and HIVResult=2 then 1 else 0 end) as Famale6,
                                                sum(case when Sex=0 and TPatient=8 and HIVResult=2 then 1 else 0 end) as Famale7,
                                                sum(case when Sex=1 and TPatient=1 and HIVResult=2 then 1 else 0 end) as Male8,
                                                sum(case when Sex=1 and TPatient=2 and HIVResult=2 then 1 else 0 end) as Male9,
                                                sum(case when Sex=1 and TPatient=3 and HIVResult=2 then 1 else 0 end) as Male10,
                                                sum(case when Sex=1 and TPatient=4 and HIVResult=2 then 1 else 0 end) as Male11,
                                                sum(case when Sex=1 and TPatient=5 and HIVResult=2 then 1 else 0 end) as Male12,
                                                sum(case when Sex=1 and TPatient=6 and HIVResult=2 then 1 else 0 end) as Male13,
                                                sum(case when Sex=1 and TPatient=7 and HIVResult=2 then 1 else 0 end) as Male14,
                                                sum(case when Sex=1 and TPatient=8 and HIVResult=2 then 1 else 0 end) as Male15,
                                                sum(case when Sex=0 and HTestResult=1 and HIVResult=2 then 1 else 0 end) as ReactiveFemale16,
                                                sum(case when Sex=1 and HTestResult=1 and HIVResult=2 then 1 else 0 end) as ReactiveMale17
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPosTes1.ExecuteReader
        While Rdr.Read
            C10F1.Text = Rdr.GetValue(0).ToString
            C11M1.Text = Rdr.GetValue(9).ToString
            C12M1.Text = Rdr.GetValue(10).ToString
            C12F1.Text = Rdr.GetValue(2).ToString
            C13M1.Text = Rdr.GetValue(14).ToString
            C14M1.Text = Rdr.GetValue(11).ToString
            C14F1.Text = Rdr.GetValue(3).ToString
            C15M1.Text = Rdr.GetValue(12).ToString
            C15F1.Text = Rdr.GetValue(4).ToString
            C16M1.Text = Rdr.GetValue(13).ToString
            C16F1.Text = Rdr.GetValue(5).ToString
            C18M1.Text = Rdr.GetValue(17).ToString
            C18F1.Text = Rdr.GetValue(16).ToString
        End While
        Rdr.Close()
        'PositiveTest age:15-49
        Dim CmdPosTes2 As New MySqlCommand("SELECT sum(case when Sex=0 and TPatient=1 and HIVResult=2 then 1 else 0 end) as Famale0,
                                                sum(case when Sex=0 and TPatient=2 and HIVResult=2 then 1 else 0 end) as Famale1,
                                                sum(case when Sex=0 and TPatient=3 and HIVResult=2 then 1 else 0 end) as Famale2,
                                                sum(case when Sex=0 and TPatient=4 and HIVResult=2 then 1 else 0 end) as Famale3,
                                                sum(case when Sex=0 and TPatient=5 and HIVResult=2 then 1 else 0 end) as Famale4,
                                                sum(case when Sex=0 and TPatient=6 and HIVResult=2 then 1 else 0 end) as Famale5,
                                                sum(case when Sex=0 and TPatient=7 and HIVResult=2 then 1 else 0 end) as Famale6,
                                                sum(case when Sex=0 and TPatient=8 and HIVResult=2 then 1 else 0 end) as Famale7,
                                                sum(case when Sex=1 and TPatient=1 and HIVResult=2 then 1 else 0 end) as Male8,
                                                sum(case when Sex=1 and TPatient=2 and HIVResult=2 then 1 else 0 end) as Male9,
                                                sum(case when Sex=1 and TPatient=3 and HIVResult=2 then 1 else 0 end) as Male10,
                                                sum(case when Sex=1 and TPatient=4 and HIVResult=2 then 1 else 0 end) as Male11,
                                                sum(case when Sex=1 and TPatient=5 and HIVResult=2 then 1 else 0 end) as Male12,
                                                sum(case when Sex=1 and TPatient=6 and HIVResult=2 then 1 else 0 end) as Male13,
                                                sum(case when Sex=1 and TPatient=7 and HIVResult=2 then 1 else 0 end) as Male14,
                                                sum(case when Sex=1 and TPatient=8 and HIVResult=2 then 1 else 0 end) as Male15,
                                                sum(case when Sex=0 and HTestResult=1 and HIVResult=2 then 1 else 0 end) as ReactiveFemale16,
                                                sum(case when Sex=1 and HTestResult=1 and HIVResult=2 then 1 else 0 end) as ReactiveMale17
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPosTes2.ExecuteReader
        While Rdr.Read
            C10F2.Text = Rdr.GetValue(0).ToString
            C11M2.Text = Rdr.GetValue(9).ToString
            C12M2.Text = Rdr.GetValue(10).ToString
            C12F2.Text = Rdr.GetValue(2).ToString
            C13M2.Text = Rdr.GetValue(14).ToString
            C14M2.Text = Rdr.GetValue(11).ToString
            C14F2.Text = Rdr.GetValue(3).ToString
            C15M2.Text = Rdr.GetValue(12).ToString
            C15F2.Text = Rdr.GetValue(4).ToString
            C16M2.Text = Rdr.GetValue(13).ToString
            C16F2.Text = Rdr.GetValue(5).ToString
            C17M2.Text = Rdr.GetValue(15).ToString
            C17F2.Text = Rdr.GetValue(7).ToString
            C18M2.Text = Rdr.GetValue(17).ToString
            C18F2.Text = Rdr.GetValue(16).ToString
        End While
        Rdr.Close()
        'PositiveTest age:>=50
        Dim CmdPosTes3 As New MySqlCommand("SELECT sum(case when Sex=0 and TPatient=1 and HIVResult=2 then 1 else 0 end) as Famale0,
                                                sum(case when Sex=0 and TPatient=2 and HIVResult=2 then 1 else 0 end) as Famale1,
                                                sum(case when Sex=0 and TPatient=3 and HIVResult=2 then 1 else 0 end) as Famale2,
                                                sum(case when Sex=0 and TPatient=4 and HIVResult=2 then 1 else 0 end) as Famale3,
                                                sum(case when Sex=0 and TPatient=5 and HIVResult=2 then 1 else 0 end) as Famale4,
                                                sum(case when Sex=0 and TPatient=6 and HIVResult=2 then 1 else 0 end) as Famale5,
                                                sum(case when Sex=0 and TPatient=7 and HIVResult=2 then 1 else 0 end) as Famale6,
                                                sum(case when Sex=0 and TPatient=8 and HIVResult=2 then 1 else 0 end) as Famale7,
                                                sum(case when Sex=1 and TPatient=1 and HIVResult=2 then 1 else 0 end) as Male8,
                                                sum(case when Sex=1 and TPatient=2 and HIVResult=2 then 1 else 0 end) as Male9,
                                                sum(case when Sex=1 and TPatient=3 and HIVResult=2 then 1 else 0 end) as Male10,
                                                sum(case when Sex=1 and TPatient=4 and HIVResult=2 then 1 else 0 end) as Male11,
                                                sum(case when Sex=1 and TPatient=5 and HIVResult=2 then 1 else 0 end) as Male12,
                                                sum(case when Sex=1 and TPatient=6 and HIVResult=2 then 1 else 0 end) as Male13,
                                                sum(case when Sex=1 and TPatient=7 and HIVResult=2 then 1 else 0 end) as Male14,
                                                sum(case when Sex=1 and TPatient=8 and HIVResult=2 then 1 else 0 end) as Male15,
                                                sum(case when Sex=0 and HTestResult=1 and HIVResult=2 then 1 else 0 end) as ReactiveFemale16,
                                                sum(case when Sex=1 and HTestResult=1 and HIVResult=2 then 1 else 0 end) as ReactiveMale17
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=50) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPosTes3.ExecuteReader
        While Rdr.Read
            C10F3.Text = Rdr.GetValue(0).ToString
            C11M3.Text = Rdr.GetValue(9).ToString
            C12M3.Text = Rdr.GetValue(10).ToString
            C12F3.Text = Rdr.GetValue(2).ToString
            C13M3.Text = Rdr.GetValue(14).ToString
            C14M3.Text = Rdr.GetValue(11).ToString
            C14F3.Text = Rdr.GetValue(3).ToString
            C15M3.Text = Rdr.GetValue(12).ToString
            C15F3.Text = Rdr.GetValue(4).ToString
            C16M3.Text = Rdr.GetValue(13).ToString
            C16F3.Text = Rdr.GetValue(5).ToString
            C17M3.Text = Rdr.GetValue(15).ToString
            C17F3.Text = Rdr.GetValue(7).ToString
            C18M3.Text = Rdr.GetValue(17).ToString
            C18F3.Text = Rdr.GetValue(16).ToString
        End While
        Rdr.Close()
        'NegativeTest age:0-14
        Dim CmdNegTes1 As New MySqlCommand("SELECT sum(case when Sex=0 and HIVResult=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and HIVResult=1 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdNegTes1.ExecuteReader
        While Rdr.Read
            C19F1.Text = Rdr.GetValue(0).ToString
            C19M1.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'NegativeTest age:15-49
        Dim CmdNegTes2 As New MySqlCommand("SELECT sum(case when Sex=0 and HIVResult=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and HIVResult=1 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdNegTes2.ExecuteReader
        While Rdr.Read
            C19F2.Text = Rdr.GetValue(0).ToString
            C19M2.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'NegativeTest age:>=50
        Dim CmdNegTes3 As New MySqlCommand("SELECT sum(case when Sex=0 and HIVResult=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and HIVResult=1 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=50) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdNegTes3.ExecuteReader
        While Rdr.Read
            C19F3.Text = Rdr.GetValue(0).ToString
            C19M3.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'UnknownTest age:0-14
        Dim CmdUnkTes1 As New MySqlCommand("SELECT sum(case when Sex=0 and HIVResult=3 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and HIVResult=3 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdUnkTes1.ExecuteReader
        While Rdr.Read
            C20F1.Text = Rdr.GetValue(0).ToString
            C20M1.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'UnknownTest age:15-49
        Dim CmdUnkTes2 As New MySqlCommand("SELECT sum(case when Sex=0 and HIVResult=3 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and HIVResult=3 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdUnkTes2.ExecuteReader
        While Rdr.Read
            C20F2.Text = Rdr.GetValue(0).ToString
            C20M2.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'NegativeTest age:>=50
        Dim CmdUnkTes3 As New MySqlCommand("SELECT sum(case when Sex=0 and HIVResult=3 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and HIVResult=3 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=50) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdUnkTes3.ExecuteReader
        While Rdr.Read
            C20F3.Text = Rdr.GetValue(0).ToString
            C20M3.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'RecencyTest age:0-14
        Dim CmdRecTes1 As New MySqlCommand("SELECT sum(case when Sex=0 and RTRIResult=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=0 and RTRIResult=2 then 1 else 0 end) as Famale1,
                                                   sum(case when Sex=0 and RTRIResult=3 then 1 else 0 end) as Famale2,
                                                   sum(case when Sex=0 and (VLResult=1 or VLResult=2) then 1 else 0 end) as Famale3,
                                                   sum(case when Sex=0 and RITAResult=1 then 1 else 0 end) as Famale4,
                                                   sum(case when Sex=0 and RITAResult=2 then 1 else 0 end) as Famale5,

                                                   sum(case when Sex=1 and RTRIResult=1 then 1 else 0 end) as Male6,
                                                   sum(case when Sex=1 and RTRIResult=2 then 1 else 0 end) as Male7,
                                                   sum(case when Sex=1 and RTRIResult=3 then 1 else 0 end) as Male8,
                                                   sum(case when Sex=1 and (VLResult=1 or VLResult=2) then 1 else 0 end) as Male9,
                                                   sum(case when Sex=1 and RITAResult=1 then 1 else 0 end) as Male10,
                                                   sum(case when Sex=1 and RITAResult=2 then 1 else 0 end) as Male11
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdRecTes1.ExecuteReader
        While Rdr.Read
            C21F1.Text = Rdr.GetValue(0).ToString
            C21M1.Text = Rdr.GetValue(6).ToString
            C22F1.Text = Rdr.GetValue(1).ToString
            C22M1.Text = Rdr.GetValue(7).ToString
            C23F1.Text = Rdr.GetValue(2).ToString
            C23M1.Text = Rdr.GetValue(8).ToString

            C24F1.Text = Rdr.GetValue(3).ToString
            C24M1.Text = Rdr.GetValue(9).ToString
            C25F1.Text = Rdr.GetValue(4).ToString
            C25M1.Text = Rdr.GetValue(10).ToString
            C26F1.Text = Rdr.GetValue(5).ToString
            C26M1.Text = Rdr.GetValue(11).ToString
        End While
        Rdr.Close()
        'RecencyTest age:15-49
        Dim CmdRecTes2 As New MySqlCommand("SELECT sum(case when Sex=0 and RTRIResult=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=0 and RTRIResult=2 then 1 else 0 end) as Famale1,
                                                   sum(case when Sex=0 and RTRIResult=3 then 1 else 0 end) as Famale2,
                                                   sum(case when Sex=0 and (VLResult=1 or VLResult=2) then 1 else 0 end) as Famale3,
                                                   sum(case when Sex=0 and RITAResult=1 then 1 else 0 end) as Famale4,
                                                   sum(case when Sex=0 and RITAResult=2 then 1 else 0 end) as Famale5,

                                                   sum(case when Sex=1 and RTRIResult=1 then 1 else 0 end) as Male6,
                                                   sum(case when Sex=1 and RTRIResult=2 then 1 else 0 end) as Male7,
                                                   sum(case when Sex=1 and RTRIResult=3 then 1 else 0 end) as Male8,
                                                   sum(case when Sex=1 and (VLResult=1 or VLResult=2) then 1 else 0 end) as Male9,
                                                   sum(case when Sex=1 and RITAResult=1 then 1 else 0 end) as Male10,
                                                   sum(case when Sex=1 and RITAResult=2 then 1 else 0 end) as Male11
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdRecTes2.ExecuteReader
        While Rdr.Read
            C21F2.Text = Rdr.GetValue(0).ToString
            C21M2.Text = Rdr.GetValue(6).ToString
            C22F2.Text = Rdr.GetValue(1).ToString
            C22M2.Text = Rdr.GetValue(7).ToString
            C23F2.Text = Rdr.GetValue(2).ToString
            C23M2.Text = Rdr.GetValue(8).ToString

            C24F2.Text = Rdr.GetValue(3).ToString
            C24M2.Text = Rdr.GetValue(9).ToString
            C25F2.Text = Rdr.GetValue(4).ToString
            C25M2.Text = Rdr.GetValue(10).ToString
            C26F2.Text = Rdr.GetValue(5).ToString
            C26M2.Text = Rdr.GetValue(11).ToString
        End While
        Rdr.Close()
        'RecencyTest age:>=50
        Dim CmdRecTes3 As New MySqlCommand("SELECT sum(case when Sex=0 and RTRIResult=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=0 and RTRIResult=2 then 1 else 0 end) as Famale1,
                                                   sum(case when Sex=0 and RTRIResult=3 then 1 else 0 end) as Famale2,
                                                   sum(case when Sex=0 and (VLResult=1 or VLResult=2) then 1 else 0 end) as Famale3,
                                                   sum(case when Sex=0 and RITAResult=1 then 1 else 0 end) as Famale4,
                                                   sum(case when Sex=0 and RITAResult=2 then 1 else 0 end) as Famale5,

                                                   sum(case when Sex=1 and RTRIResult=1 then 1 else 0 end) as Male6,
                                                   sum(case when Sex=1 and RTRIResult=2 then 1 else 0 end) as Male7,
                                                   sum(case when Sex=1 and RTRIResult=3 then 1 else 0 end) as Male8,
                                                   sum(case when Sex=1 and (VLResult=1 or VLResult=2) then 1 else 0 end) as Male9,
                                                   sum(case when Sex=1 and RITAResult=1 then 1 else 0 end) as Male10,
                                                   sum(case when Sex=1 and RITAResult=2 then 1 else 0 end) as Male11
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=50) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdRecTes3.ExecuteReader
        While Rdr.Read
            C21F3.Text = Rdr.GetValue(0).ToString
            C21M3.Text = Rdr.GetValue(6).ToString
            C22F3.Text = Rdr.GetValue(1).ToString
            C22M3.Text = Rdr.GetValue(7).ToString
            C23F3.Text = Rdr.GetValue(2).ToString
            C23M3.Text = Rdr.GetValue(8).ToString

            C24F3.Text = Rdr.GetValue(3).ToString
            C24M3.Text = Rdr.GetValue(9).ToString
            C25F3.Text = Rdr.GetValue(4).ToString
            C25M3.Text = Rdr.GetValue(10).ToString
            C26F3.Text = Rdr.GetValue(5).ToString
            C26M3.Text = Rdr.GetValue(11).ToString
        End While
        Rdr.Close()
        'PostTest age:0-14
        Dim CmdPostTes1 As New MySqlCommand("SELECT sum(case when Sex=0 and Counselor=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and Counselor=1 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPostTes1.ExecuteReader
        While Rdr.Read
            C27F1.Text = Rdr.GetValue(0).ToString
            C27M1.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'PostTest age:15-49
        Dim CmdPostTes2 As New MySqlCommand("SELECT sum(case when Sex=0 and Counselor=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and Counselor=1 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPostTes2.ExecuteReader
        While Rdr.Read
            C27F2.Text = Rdr.GetValue(0).ToString
            C27M2.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'PostTest age:>=50
        Dim CmdPostTes3 As New MySqlCommand("SELECT sum(case when Sex=0 and Counselor=1 then 1 else 0 end) as Famale0,
                                                   sum(case when Sex=1 and Counselor=1 then 1 else 0 end) as Male1
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=50) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdPostTes3.ExecuteReader
        While Rdr.Read
            C27F3.Text = Rdr.GetValue(0).ToString
            C27M3.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        'Transfer age:0-14
        Dim CmdTran1 As New MySqlCommand("SELECT sum(case when Sex=0 and TransferTo=1 then 1 else 0 end) as Famale0,
                                                 sum(case when Sex=0 and TransferTo<>1 then 1 else 0 end) as Famale1,
                                                 sum(case when Sex=1 and TransferTo=1 then 1 else 0 end) as Male2,
                                                 sum(case when Sex=1 and TransferTo<>1 then 1 else 0 end) as Male3
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdTran1.ExecuteReader
        While Rdr.Read
            C28F1.Text = Rdr.GetValue(0).ToString
            C28M1.Text = Rdr.GetValue(2).ToString
            C29F1.Text = Rdr.GetValue(1).ToString
            C29M1.Text = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()
        'Transfer age:15-49
        Dim CmdTran2 As New MySqlCommand("SELECT sum(case when Sex=0 and TransferTo=1 then 1 else 0 end) as Famale0,
                                                 sum(case when Sex=0 and TransferTo<>1 then 1 else 0 end) as Famale1,
                                                 sum(case when Sex=1 and TransferTo=1 then 1 else 0 end) as Male2,
                                                 sum(case when Sex=1 and TransferTo<>1 then 1 else 0 end) as Male3
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdTran2.ExecuteReader
        While Rdr.Read
            C28F2.Text = Rdr.GetValue(0).ToString
            C28M2.Text = Rdr.GetValue(2).ToString
            C29F2.Text = Rdr.GetValue(1).ToString
            C29M2.Text = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()
        'Transfer age:>=50
        Dim CmdTran3 As New MySqlCommand("SELECT sum(case when Sex=0 and TransferTo=1 then 1 else 0 end) as Famale0,
                                                 sum(case when Sex=0 and TransferTo<>1 then 1 else 0 end) as Famale1,
                                                 sum(case when Sex=1 and TransferTo=1 then 1 else 0 end) as Male2,
                                                 sum(case when Sex=1 and TransferTo<>1 then 1 else 0 end) as Male3
                                          FROM tblvcct " &
                                        " WHERE (timestampdiff(year, DaDob, DaReg)>=50) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdTran3.ExecuteReader
        While Rdr.Read
            C28F3.Text = Rdr.GetValue(0).ToString
            C28M3.Text = Rdr.GetValue(2).ToString
            C29F3.Text = Rdr.GetValue(1).ToString
            C29M3.Text = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()
        'Retest age:0-14
        Dim CmdRetest1 As New MySqlCommand("SELECT sum(case when tblvcct.Sex=0 and tblretest.Result=2 then 1 else 0 end) as Famale0,
                                                sum(case when tblvcct.Sex=0 and tblretest.Result=1 then 1 else 0 end) as Famale1,
                                                sum(case when tblvcct.Sex=1 and tblretest.Result=2 then 1 else 0 end) as Male2,
                                                sum(case when tblvcct.Sex=1 and tblretest.Result=1 then 1 else 0 end) as Male3
                                          FROM tblvcct " &
                                        " Left Join tblretest on tblvcct.Vcctid=tblretest.Vcctid and tblretest.VCCTCode= '" & Vsite & "' WHERE (timestampdiff(year, DaDob, DaReg)>=0 and timestampdiff(year, DaDob, DaReg)<=14) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdRetest1.ExecuteReader
        While Rdr.Read
            C30F1.Text = Rdr.GetValue(0).ToString
            C30M1.Text = Rdr.GetValue(2).ToString
            C31F1.Text = Rdr.GetValue(1).ToString
            C31M1.Text = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()
        'Retest age:15-49
        Dim CmdRetest2 As New MySqlCommand("SELECT sum(case when tblvcct.Sex=0 and tblretest.Result=2 then 1 else 0 end) as Famale0,
                                                sum(case when tblvcct.Sex=0 and tblretest.Result=1 then 1 else 0 end) as Famale1,
                                                sum(case when tblvcct.Sex=1 and tblretest.Result=2 then 1 else 0 end) as Male2,
                                                sum(case when tblvcct.Sex=1 and tblretest.Result=1 then 1 else 0 end) as Male3
                                          FROM tblvcct " &
                                        "Left Join tblretest on tblvcct.Vcctid=tblretest.Vcctid and tblretest.VCCTCode= '" & Vsite & "' WHERE (timestampdiff(year, DaDob, DaReg)>=15 and timestampdiff(year, DaDob, DaReg)<=49) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdRetest2.ExecuteReader
        While Rdr.Read
            C30F2.Text = Rdr.GetValue(0).ToString
            C30M2.Text = Rdr.GetValue(2).ToString
            C31F2.Text = Rdr.GetValue(1).ToString
            C31M2.Text = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()
        'Retest age:>=50
        Dim CmdRetest3 As New MySqlCommand("SELECT sum(case when tblvcct.Sex=0 and tblretest.Result=2 then 1 else 0 end) as Famale0,
                                                sum(case when tblvcct.Sex=0 and tblretest.Result=1 then 1 else 0 end) as Famale1,
                                                sum(case when tblvcct.Sex=1 and tblretest.Result=2 then 1 else 0 end) as Male2,
                                                sum(case when tblvcct.Sex=1 and tblretest.Result=1 then 1 else 0 end) as Male3
                                          FROM tblvcct " &
                                        "Left Join tblretest on tblvcct.Vcctid=tblretest.Vcctid and tblretest.VCCTCode= '" & Vsite & "' WHERE (timestampdiff(year, DaDob, DaReg)>=50) and tblvcct.DaReg  BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "'", Cnndb)
        Rdr = CmdRetest3.ExecuteReader
        While Rdr.Read
            C30F3.Text = Rdr.GetValue(0).ToString
            C30M3.Text = Rdr.GetValue(2).ToString
            C31F3.Text = Rdr.GetValue(1).ToString
            C31M3.Text = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()

        Try
            CmdView1.CommandText = "DROP VIEW `preart`.`vcctview`;"
            CmdView1.ExecuteNonQuery()
        Catch ex As Exception
        End Try
    End Sub
End Class