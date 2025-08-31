Imports System.Drawing.Printing

Imports MySql.Data.MySqlClient
Public Class RTNational
    Dim Rdr, Rdr1 As MySqlDataReader
    Dim Sdate, Edate As Date
    Dim dbtem As MySqlConnection
    Private Sub RTNational_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        '    If frmNationalRoption.cboYear.Text = "" Then Exit Sub

        Dim CmdHead As New MySqlCommand("select * from tblsitename", Cnndb)
        Rdr = CmdHead.ExecuteReader
        While Rdr.Read
            xtcCode.Text = Rdr.GetValue(2).ToString
            XrTableCell481.Text = Rdr.GetValue(2).ToString
            xtcProvince.Text = Rdr.GetValue(3).ToString
            XrTableCell486.Text = Rdr.GetValue(3).ToString
            xtcFacility.Text = Rdr.GetValue(0).ToString
            XrTableCell479.Text = Rdr.GetValue(0).ToString
            xtcDisct.Text = Rdr.GetValue(4).ToString
            XrTableCell484.Text = Rdr.GetValue(4).ToString
            With frmNationalRoption
                If .TabControl1.SelectedIndex = 0 Then
                    xtcyear.Text = .cboYear.Text
                    XrTableCell488.Text = .cboYear.Text
                    xtcQuarter.Text = .cboQuarter.Text
                    XrTableCell490.Text = .cboQuarter.Text
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
                    XrTableCell488.Text = .daStart.Text & " To  " & .daEnd.Text
                    Sdate = CDate(.daStart.Text)
                    Edate = CDate(.daEnd.Text)
                End If
            End With
        End While
        Rdr.Close()
        Dim Cmdto As New MySqlCommand("Delete from tbltempoi", Cnndb)
        Cmdto.ExecuteNonQuery()
        Dim Cmdta As New MySqlCommand("Delete from tbltempart", Cnndb)
        Cmdta.ExecuteNonQuery()
        dbtem = New MySqlConnection(connString)
        dbtem.Open()


        'Dim CmdSearch1 As New MySqlCommand("SELECT     tbltempdrug.Vid, tblavarvdrug.DrugName, tblavarvdrug.Status FROM  tblavarvdrug RIGHT OUTER JOIN tbltempdrug ON tblavarvdrug.Vid = tbltempdrug.Vid having    (tblavarvdrug.Status IN (0, 2)) ORDER BY  tbltempdrug.Vid, tblavarvdrug.DrugName asc", Cnndb)
        'Rdr = CmdSearch1.ExecuteReader
        'Dim q1 As String
        'While Rdr.Read
        '    Try


        '        Dim Cmdinsert As New MySqlCommand("insert into tbltemp values('" & Rdr.GetValue(0).ToString.Trim & "','" & Rdr.GetValue(1).ToString.Trim & "','','','','1900/01/01','1900/01/01')", dbtem)
        '        Cmdinsert.ExecuteNonQuery()
        '        q1 = ""
        '        q1 = Rdr.GetValue(1).ToString.Trim
        '    Catch ex As Exception
        '        q1 = q1 & "+" & Rdr.GetValue(1).ToString.Trim
        '        Dim Cmdupdate As New MySqlCommand("update tbltemp set f1='" & q1 & "' where f='" & Rdr.GetValue(0).ToString.Trim & "'", dbtem)
        '        Cmdupdate.ExecuteNonQuery()
        '    End Try
        'End While
        'Rdr.Close()


        Adult()
        Cmdto.ExecuteNonQuery()
        Cmdta.ExecuteNonQuery()
        Child()

        Cmdto.ExecuteNonQuery()
        Cmdta.ExecuteNonQuery()
        Exposed()
        dbtem.Close()
    End Sub
    Private Sub Adult()

        ' New OI This Quarter
        Dim CmdNePre As New MySqlCommand("SELECT  tblaimain.ClinicID,  tblaimain.Sex FROM      tblaart RIGHT OUTER JOIN    tblaimain ON  tblaart.ClinicID =  tblaimain.ClinicID LEFT OUTER JOIN  tblavpatientstatus ON  tblaimain.ClinicID =  tblavpatientstatus.ClinicID WHERE ( tblaimain.OffIn <> 1) AND (tblaimain.TypeofReturn=-1) AND ( tblaimain.DafirstVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') GROUP BY  tblaimain.ClinicID,  tblaimain.Sex", Cnndb)
        Rdr = CmdNePre.ExecuteReader
        While Rdr.Read
            Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(0).ToString & "','" & Rdr.GetValue(1).ToString & "')", dbtem)
            CmdToi.ExecuteNonQuery()
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 1
                    XrTableCell52.Text = Val(XrTableCell52.Text) + 1
                Case Else
                    XrTableCell53.Text = Val(XrTableCell53.Text) + 1
            End Select
        End While
        Rdr.Close()

        'Previous Pre-ART
        Dim dt As DataTable
        Dim CmdAPre As New MySqlCommand("SELECT     tblaimain.Sex, tblaimain.ClinicID, tblavpatientstatus.Da, tblaart.DaArt, tblaimain.OffIn, tblaimain.DafirstVisit FROM   tblaimain LEFT OUTER JOIN   tblavpatientstatus ON tblaimain.ClinicID = tblavpatientstatus.ClinicID LEFT OUTER JOIN     tblaart ON tblaimain.ClinicID = tblaart.ClinicID WHERE (tblaimain.OffIn <> 1) and tblaimain.DafirstVisit < '" & Format(Sdate, "yyyy-MM-dd") & "' GROUP BY tblaimain.Sex, tblaimain.ClinicID, tblavpatientstatus.Da, tblaart.DaArt, tblaimain.OffIn, tblaimain.DafirstVisit", Cnndb)
        Rdr = CmdAPre.ExecuteReader
        While Rdr.Read
            Try
                If Rdr.GetValue(3).ToString.Trim = "" Or CDate(Rdr.GetValue(3).ToString).Date >= Sdate Then
                    If CDate(Rdr.GetValue(2).ToString) >= Sdate Then
                        Try
                            Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(1).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                            CmdToi.ExecuteNonQuery()

                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell22.Text = Val(XrTableCell22.Text) + 1
                                Case Else
                                    XrTableCell23.Text = Val(XrTableCell23.Text) + 1
                            End Select
                        Catch ex As Exception
                        End Try

                    End If
                End If
            Catch ex1 As Exception
                Try
                    If CDate(Rdr.GetValue(2).ToString).Date >= Sdate Then
                        Try
                            Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(1).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                            CmdToi.ExecuteNonQuery()
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell22.Text = Val(XrTableCell22.Text) + 1
                                Case Else
                                    XrTableCell23.Text = Val(XrTableCell23.Text) + 1
                            End Select
                        Catch ex As Exception
                        End Try
                    End If
                Catch ex2 As Exception

                    Try
                        Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(1).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                        CmdToi.ExecuteNonQuery()
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                XrTableCell22.Text = Val(XrTableCell22.Text) + 1
                            Case Else
                                XrTableCell23.Text = Val(XrTableCell23.Text) + 1
                        End Select
                    Catch ex As Exception
                    End Try
                End Try

            End Try

        End While
        Rdr.Close()

        ' New Lost & Return
        Dim CmdNPre As New MySqlCommand("SELECT  tblaimain.Sex ,  tblaart.ART,tblaimain.ClinicID,tblaart.DaArt FROM   tblaimain LEFT OUTER JOIN   tblaart ON  tblaimain.ClinicID =  tblaart.ClinicID WHERE (tblaimain.TypeofReturn <>-1) AND (tblaimain.DafirstVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') GROUP BY tblaimain.Sex, tblaart.ART,tblaimain.ClinicID", Cnndb)
        Rdr = CmdNPre.ExecuteReader
        While Rdr.Read

            If Rdr.GetValue(1).ToString.Trim = "" Then GoTo k
            If Rdr.GetValue(1).ToString.Trim <> "" And Rdr.GetValue(1).ToString.Trim = "" Then '(by B Phana)
k:
                Try
                    Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                    CmdToi.ExecuteNonQuery()
                    Select Case Val(Rdr.GetValue(0).ToString)
                        Case 1
                            XrTableCell79.Text = Val(XrTableCell79.Text) + 1
                        Case Else
                            XrTableCell80.Text = Val(XrTableCell80.Text) + 1
                    End Select
                Catch ex As Exception
                End Try
            Else
                Try
                    Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                    CmdTart.ExecuteNonQuery()

                    Select Case Val(Rdr.GetValue(0).ToString)
                        Case 1
                            XrTableCell91.Text = Val(XrTableCell91.Text) + 1
                        Case Else
                            XrTableCell92.Text = Val(XrTableCell92.Text) + 1
                    End Select
                Catch ex As Exception
                End Try
            End If

        End While
        Rdr.Close()

        'Previous Patient ART
        Dim CmdPreA As New MySqlCommand("SELECT  tblaimain.Sex,  tblaart.ART,  tblaimain.ClinicID,  tblavpatientstatus.Da,  tblaimain.OffIn,  tblaimain.DafirstVisit FROM   tblaimain LEFT OUTER JOIN   tblavpatientstatus ON  tblaimain.ClinicID =  tblavpatientstatus.ClinicID LEFT OUTER JOIN   tblaart ON  tblaimain.ClinicID =  tblaart.ClinicID WHERE ( tblaart.DaArt <'" & Format(Sdate, "yyyy-MM-dd") & "') ", Cnndb)
        Rdr = CmdPreA.ExecuteReader
        While Rdr.Read

            If CDbl(Rdr.GetValue(4).ToString) <> 1 Or CDate(Rdr.GetValue(5).ToString).Date < Sdate.Date Then
                Try
                    'If CDate(Rdr.GetValue(3).ToString).Date >= Sdate Then 'B Phana
                    If CDate(Rdr.GetValue(3).ToString).Date >= Sdate And CDate(Rdr.GetValue(5).ToString).Date < Sdate Then 'Add by Sithorn
                        Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                        CmdTart.ExecuteNonQuery()
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                XrTableCell34.Text = Val(XrTableCell34.Text) + 1
                            Case Else
                                XrTableCell35.Text = Val(XrTableCell35.Text) + 1
                        End Select
                    End If
                Catch ex As Exception
                    Try
                        'If CDate(Rdr.GetValue(3).ToString).Date >= Sdate.Date Then 'B Phana
                        If CDate(Rdr.GetValue(3).ToString).Date >= Sdate.Date And CDate(Rdr.GetValue(5).ToString).Date < Sdate.Date Then 'Add by Sithorn
                            Try
                                Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                                CmdTart.ExecuteNonQuery()
                                Select Case Val(Rdr.GetValue(0).ToString)
                                    Case 1
                                        XrTableCell34.Text = Val(XrTableCell34.Text) + 1
                                    Case Else
                                        XrTableCell35.Text = Val(XrTableCell35.Text) + 1
                                End Select
                            Catch ex1 As Exception
                            End Try
                        End If
                    Catch ex2 As Exception
                        Try
                            If CDate(Rdr.GetValue(5).ToString).Date > Sdate.Date Then GoTo ll
                            Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                            CmdTart.ExecuteNonQuery()
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell34.Text = Val(XrTableCell34.Text) + 1
                                Case Else
                                    XrTableCell35.Text = Val(XrTableCell35.Text) + 1
                            End Select
                        Catch ex1 As Exception
                        End Try
                    End Try
ll:
                End Try
            End If
        End While
        Rdr.Close()
        ' Patient Start ART

        'Dim CmdARTa As New MySqlCommand("SELECT   tblaimain.Sex,  tblaart.ART,  tblaimain.ClinicID,  tblavpatientstatus.Status,  tblavpatientstatus.Da FROM    tblaimain LEFT OUTER JOIN   tblaart ON  tblaimain.ClinicID =  tblaart.ClinicID LEFT OUTER JOIN   tblavpatientstatus ON  tblaimain.ClinicID =  tblavpatientstatus.ClinicID WHERE  ( tblaart.ClinicID IS NOT NULL) AND ( tblaimain.OffIn <> 1) AND ( tblaart.DaArt BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')", Cnndb)
        'Rdr = CmdARTa.ExecuteReader
        Dim CmdARTa As New MySqlCommand("SELECT   tblaimain.Sex,  tblaart.ART,  tblaimain.ClinicID,  tblavpatientstatus.Status,  tblavpatientstatus.Da FROM    tblaimain LEFT OUTER JOIN   tblaart ON  tblaimain.ClinicID =  tblaart.ClinicID LEFT OUTER JOIN   tblavpatientstatus ON  tblaimain.ClinicID =  tblavpatientstatus.ClinicID WHERE  ( tblaart.ClinicID IS NOT NULL) AND ( tblaimain.OffIn <> 1) AND tblaimain.DafirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "' AND ( tblaart.DaArt BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')", Cnndb)
        Rdr = CmdARTa.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                CmdTart.ExecuteNonQuery()

                Dim CmdToi As New MySqlCommand("Delete from tbltempoi where ClinicID='" + Rdr.GetValue(2).ToString + "'", dbtem)
                CmdToi.ExecuteNonQuery()

                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell106.Text = Val(XrTableCell106.Text) + 1
                    Case Else
                        XrTableCell107.Text = Val(XrTableCell107.Text) + 1
                End Select
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()

        'Sithorn..Pre-ART Count Re-Test before ARV.....

        Dim CmdRetest As New MySqlCommand("select count(if(re.sex=1,1,null)) as Male, count(if(re.sex=0,1,null)) as Female from (" &
        "select ai.ClinicID,ai.sex, ai.DafirstVisit, lt.DatVisit, lt.TestHIV, lt.ResultHIV from" &
        "(select v.ClinicID, v.ARTnum, v.DatVisit, v.TestHIV, v.ResultHIV, v.DaApp, v.Vid from " &
        "(select ClinicID, ARTnum, DatVisit, TestHIV, ResultHIV, DaApp, Vid from tblavmain " &
        "where DatVisit between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "') v inner join " &
        "(select vv.ClinicID, Max(vv.DatVisit) as DatVisit, vv.TestHIV, vv.ResultHIV from " &
        "(select ClinicID, ARTnum, DatVisit, TestHIV, ResultHIV, DaApp, Vid from tblavmain " &
        "where (DatVisit between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "' and TestHIV='True')) vv " &
        "group by vv.ClinicID) mv on mv.ClinicID=v.ClinicID and mv.DatVisit=v.DatVisit) lt " &
        "left join tblaimain ai on ai.ClinicID=lt.clinicid " &
        "where ai.OffIn <> 1 and ai.TypeofReturn=-1 and (ai.DafirstVisit between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "')) re;", Cnndb)
        Rdr = CmdRetest.ExecuteReader
        While Rdr.Read
            XrTableCell67.Text = Rdr.GetValue(0).ToString
            XrTableCell68.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        '..........................................

        'Patient transferin

        Dim CmdIna As New MySqlCommand("SELECT   tblaimain.Sex,  tblaart.ART,  tblaimain.ClinicID,  tblavpatientstatus.Status,  tblavpatientstatus.Da FROM    tblaimain LEFT OUTER JOIN   tblaart ON  tblaimain.ClinicID =  tblaart.ClinicID LEFT OUTER JOIN   tblavpatientstatus ON  tblaimain.ClinicID =  tblavpatientstatus.ClinicID WHERE  ( tblaimain.OffIn = 1) AND ( tblaimain.DafirstVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')", Cnndb)
        Rdr = CmdIna.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                CmdTart.ExecuteNonQuery()
                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell116.Text = Val(XrTableCell116.Text) + 1
                    Case Else
                        XrTableCell117.Text = Val(XrTableCell117.Text) + 1
                End Select
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()

        'Patient Status 

        Dim tttt As String = ""
        Dim CmdALost As New MySqlCommand("SELECT tblaimain.Sex,  tblavpatientstatus.Status,  tblavmain.ARTnum,  tblaimain.ClinicID,  tblaimain.DafirstVisit,  tblavpatientstatus.Da FROM          tblavpatientstatus RIGHT OUTER JOIN   tblavmain ON  tblavpatientstatus.Vid =  tblavmain.Vid RIGHT OUTER JOIN   tblaimain ON  tblavmain.ClinicID =  tblaimain.ClinicID WHERE ( tblavpatientstatus.Status IS NOT NULL) AND ( tblavpatientstatus.Da BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') order by tblavpatientstatus.Status,tblavmain.ARTnum ;", ConnectionDB.Cnndb)
        Rdr = CmdALost.ExecuteReader
        While Rdr.Read
            If tttt.Trim <> Rdr.GetValue(3).ToString.Trim Then
                Select Case CDbl(Rdr.GetValue(1).ToString)
                    'Lost
                    Case 0
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell154.Text = Val(XrTableCell154.Text) + 1
                                Else
                                    XrTableCell168.Text = Val(XrTableCell168.Text) + 1
                                End If
                            Case Else

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell155.Text = Val(XrTableCell155.Text) + 1
                                Else
                                    XrTableCell169.Text = Val(XrTableCell169.Text) + 1
                                End If
                        End Select
                         'Death
                    Case 1
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell182.Text = Val(XrTableCell182.Text) + 1
                                Else
                                    XrTableCell196.Text = Val(XrTableCell196.Text) + 1
                                End If
                            Case Else

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell183.Text = Val(XrTableCell183.Text) + 1
                                Else
                                    XrTableCell197.Text = Val(XrTableCell197.Text) + 1
                                End If
                        End Select
                        'Test Negative
                    Case 2
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell128.Text = Val(XrTableCell128.Text) + 1
                                Else
                                    XrTableCell128.Text = Val(XrTableCell128.Text) + 1
                                End If
                            Case Else

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell129.Text = Val(XrTableCell129.Text) + 1
                                Else
                                    XrTableCell129.Text = Val(XrTableCell129.Text) + 1
                                End If
                        End Select
                       '  transter out
                    Case 3
                        If Rdr.GetValue(2).ToString.Trim <> "" Then
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell140.Text = Val(XrTableCell140.Text) + 1
                                Case Else
                                    XrTableCell141.Text = Val(XrTableCell141.Text) + 1
                            End Select
                        Else
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1

                                    If Rdr.GetValue(2).ToString.Trim = "" Then
                                        XrTableCell154.Text = Val(XrTableCell154.Text) + 1
                                    Else
                                        XrTableCell168.Text = Val(XrTableCell168.Text) + 1
                                    End If
                                Case Else

                                    If Rdr.GetValue(2).ToString.Trim = "" Then
                                        XrTableCell155.Text = Val(XrTableCell155.Text) + 1
                                    Else
                                        XrTableCell169.Text = Val(XrTableCell169.Text) + 1
                                    End If
                            End Select
                        End If
                End Select
            End If
            tttt = Rdr.GetValue(3).ToString
            Dim CmdTart As New MySqlCommand("Delete from tbltempart where ClinicID='" + Rdr.GetValue(3).ToString + "'", dbtem)
            CmdTart.ExecuteNonQuery()
            Dim CmdToi As New MySqlCommand("Delete from tbltempoi where ClinicID='" + Rdr.GetValue(3).ToString + "'", dbtem)
            CmdToi.ExecuteNonQuery()
        End While
        Rdr.Close()


        ''New Patient Screen TB
        ''--------------------------------------------
        ''Adult OI
        ''-------------------------------------------

        'Screen TB

        Dim CmdAsTB As New MySqlCommand("SELECT   tblavmain.Cough, tblavmain.Fever, tblavmain.Wlost, tblavmain.Drenching, tbltempoi.Sex FROM  tblavmain RIGHT OUTER JOIN tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID WHERE (tblavmain.Cough in (0,1) or tblavmain.Fever in (0,1) or tblavmain.Wlost in (0,1) or  tblavmain.Drenching in (0,1))  and (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') group by tbltempoi.ClinicID order by tbltempoi.ClinicID", Cnndb)
        Rdr = CmdAsTB.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(0).ToString) = 0 And Val(Rdr.GetValue(1).ToString) = 0 And Val(Rdr.GetValue(2).ToString) = 0 And Val(Rdr.GetValue(3).ToString) = 0 Then
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 1
                        XrTableCell258.Text = Val(XrTableCell258.Text) + 1
                    Case Else
                        XrTableCell259.Text = Val(XrTableCell259.Text) + 1
                End Select
            Else
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 1
                        XrTableCell264.Text = Val(XrTableCell264.Text) + 1
                    Case Else
                        XrTableCell265.Text = Val(XrTableCell265.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()

        ''Positive Prevent

        Dim CmdPo As New MySqlCommand("SELECT    tblavmain.STIPreven, tblavmain.ARTAdher, tblavmain.Birthspac, tblavmain.TBinfect, tblavmain.Partner, tblavmain.Condoms, tbltempoi.Sex FROM  tblavmain RIGHT OUTER JOIN  tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID WHERE (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') group by tbltempoi.ClinicID", Cnndb)
        Rdr = CmdPo.ExecuteReader
        While Rdr.Read
            Dim s, ar, bi, t, pa, ad, t1 As Integer
            If Val(Rdr.GetValue(0).ToString) = 0 Then
                s = 1
            End If
            If Val(Rdr.GetValue(1).ToString) = 0 Then
                ar = 1
            End If
            If Val(Rdr.GetValue(2).ToString) = 0 Then
                bi = 1
            End If
            If Val(Rdr.GetValue(3).ToString) = 0 Then
                t = 1
            End If
            If Val(Rdr.GetValue(4).ToString) = 0 Then
                pa = 1
            End If
            If Val(Rdr.GetValue(5).ToString) = 0 Then
                ad = 1
            End If
            t1 = s + ar + bi + t + pa + ad
            If t1 >= 3 Then
                Select Case Val(Rdr.GetValue(6).ToString)
                    Case 1
                        XrTableCell240.Text = Val(XrTableCell240.Text) + 1
                    Case Else
                        XrTableCell241.Text = Val(XrTableCell241.Text) + 1
                End Select
            End If

        End While
        Rdr.Close()

        'diagnos TB and treat
        Dim CmdTB As New MySqlCommand("SELECT      tblavmain.ClinicID, tblavmain.TBtreat, tbltempoi.Sex FROM     tblavmain RIGHT OUTER JOIN    tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND  (tblavmain.TB <> - 1) ORDER BY tblavmain.DatVisit ", Cnndb)
        Rdr = CmdTB.ExecuteReader

        While Rdr.Read
            If Val(Rdr.GetValue(1).ToString) = 0 Then 'add a condition by sithorn
                Select Case Val(Rdr.GetValue(2).ToString)
                    Case 1
                        XrTableCell289.Text = Val(XrTableCell289.Text) + 1
                    Case Else
                        XrTableCell290.Text = Val(XrTableCell290.Text) + 1
                End Select
            End If
            If Val(Rdr.GetValue(1).ToString) = 0 Then

                Select Case Val(Rdr.GetValue(2).ToString)
                    Case 1
                        XrTableCell299.Text = Val(XrTableCell299.Text) + 1

                    Case Else
                        XrTableCell300.Text = Val(XrTableCell300.Text) + 1

                End Select
            End If
        End While
        Rdr.Close()
        'By B Phana..................................
        'INH
        'Dim CmdIh As New MySqlCommand("SELECT  count(tblavoidrug.DrugName) as drug, tbltempoi.Sex FROM   tblavmain RIGHT OUTER JOIN  tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID LEFT OUTER JOIN   tblavoidrug ON tblavmain.Vid = tblavoidrug.Vid WHERE  (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND   (tblavoidrug.DrugName = 'Isoniazid') AND (tblavoidrug.Status = 0) group by tbltempoi.Sex", Cnndb)
        'Rdr = CmdIh.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 1
        '            XrTableCell279.Text = Rdr.GetValue(0).ToString
        '        Case Else
        '            XrTableCell280.Text = Rdr.GetValue(0).ToString
        '    End Select
        'End While
        'Rdr.Close()
        '.............................................
        'Cotrim
        Dim Cmdco As New MySqlCommand("SELECT  count(tblavoidrug.DrugName) as drug, tbltempoi.Sex FROM   tblavmain RIGHT OUTER JOIN  tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID LEFT OUTER JOIN   tblavoidrug ON tblavmain.Vid = tblavoidrug.Vid WHERE     (tblavoidrug.DrugName = 'Cotrimoxazole') AND (tblavoidrug.Status = 0) and (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  group by tbltempoi.Sex", Cnndb)
        Rdr = Cmdco.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 1
                    XrTableCell309.Text = Rdr.GetValue(0).ToString
                Case Else
                    XrTableCell310.Text = Rdr.GetValue(0).ToString
            End Select

        End While
        Rdr.Close()
        Dim Cmdco1 As New MySqlCommand("SELECT  count(tblavoidrug.DrugName) as drug, tbltempart.Sex FROM   tblavmain RIGHT OUTER JOIN  tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID LEFT OUTER JOIN   tblavoidrug ON tblavmain.Vid = tblavoidrug.Vid WHERE     (tblavoidrug.DrugName = 'Cotrimoxazole') AND (tblavoidrug.Status = 0) and (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  group by tbltempart.Sex", Cnndb)
        Rdr = Cmdco1.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 1
                    XrTableCell309.Text = Rdr.GetValue(0).ToString
                Case Else
                    XrTableCell310.Text = Rdr.GetValue(0).ToString
            End Select

        End While
        Rdr.Close()


        'Pregnant
        'Dim CmdPreg As New MySqlCommand("SELECT  tblavmain.TypeVisit, tblavmain.Womenstatus, tblavmain.PregStatus,tblavmain.ClinicID FROM         tblavmain RIGHT OUTER JOIN  patientactive ON tblavmain.ClinicID = patientactive.ClinicID WHERE  (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND   (tblavmain.Womenstatus = 1) group by tblavmain.ClinicID ORDER BY tblavmain.DatVisit", Cnndb)
        'Rdr = CmdPreg.ExecuteReader
        Dim CmdPreg As New MySqlCommand("SELECT tblavmain.TypeVisit,tblavmain.Womenstatus,tblavmain.PregStatus,tblavmain.ClinicID FROM tblavmain " &
        "RIGHT OUTER JOIN(select ai.ClinicID from tblaimain ai left join(select * from tblavpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') ap on ai.ClinicID=ap.ClinicID " &
        "where ap.Status is null) pa ON tblavmain.ClinicID = pa.ClinicID WHERE(tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND " &
        "(tblavmain.Womenstatus = 1) group by tblavmain.ClinicID ORDER BY tblavmain.DatVisit;", Cnndb)
        Rdr = CmdPreg.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(0).ToString) = 0 Then
                XrTableCell315.Text = Val(XrTableCell315.Text) + 1
            Else
                XrTableCell320.Text = Val(XrTableCell320.Text) + 1
            End If
            Select Case Val(Rdr.GetValue(2).ToString)
                Case 0
                    XrTableCell325.Text = Val(XrTableCell325.Text) + 1
                Case 1
                    XrTableCell330.Text = Val(XrTableCell330.Text) + 1
            End Select
        End While
        Rdr.Close()
        'TestAntiHCV
        'Dim CmdAhcv As New MySqlCommand("SELECT   tblavmain.ClinicID, tblavmain.CrAGResult, tbltempoi.Sex FROM  tblavmain RIGHT OUTER JOIN  tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND  (tblavmain.CrAGResult IN (0, 1)) ORDER BY tblavmain.DatVisit", Cnndb)
        'Rdr = CmdAhcv.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell337.Text = Val(XrTableCell337.Text) + 1
        '                Case Else
        '                    XrTableCell338.Text = Val(XrTableCell338.Text) + 1
        '            End Select
        '        Case 1
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell349.Text = Val(XrTableCell349.Text) + 1
        '                Case Else
        '                    XrTableCell350.Text = Val(XrTableCell350.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()
        'Viral load HCV
        'Dim CmdHCV As New MySqlCommand("SELECT   tblavmain.ClinicID, tblpatienttest.HCV, tbltempoi.Sex FROM   tblavmain RIGHT OUTER JOIN  tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID LEFT OUTER JOIN  tblpatienttest ON tblavmain.TestID = tblpatienttest.TestID WHERE (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND  (tblpatienttest.HCV <> '') ORDER BY tblavmain.DatVisit", Cnndb)
        'Rdr = CmdHCV.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell366.Text = Val(XrTableCell366.Text) + 1
        '                Case Else
        '                    XrTableCell367.Text = Val(XrTableCell367.Text) + 1
        '            End Select
        '        Case >= 39
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell378.Text = Val(XrTableCell378.Text) + 1
        '                Case Else
        '                    XrTableCell379.Text = Val(XrTableCell379.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()
        ''Start HCV
        'Dim Cmddh As New MySqlCommand("SELECT     tblavmain.ClinicID, tblavmain.ResultHC, tbltempoi.Sex FROM   tblavmain RIGHT OUTER JOIN   tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID LEFT OUTER JOIN  tblavhydrug ON tblavmain.Vid = tblavhydrug.Vid WHERE  (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND  (tblavhydrug.Status = 0) ORDER BY tblavmain.DatVisit ", Cnndb)
        'Rdr = Cmddh.ExecuteReader
        'While Rdr.Read
        '    If Val(Rdr.GetValue(1).ToString) = 1 Then
        '        Select Case Val(Rdr.GetValue(2).ToString)
        '            Case 1
        '                XrTableCell414.Text = Val(XrTableCell414.Text) + 1
        '            Case Else
        '                XrTableCell415.Text = Val(XrTableCell415.Text) + 1
        '        End Select
        '    End If
        '    Select Case Val(Rdr.GetValue(2).ToString)
        '        Case 1
        '            XrTableCell402.Text = Val(XrTableCell402.Text) + 1
        '        Case Else
        '            XrTableCell403.Text = Val(XrTableCell403.Text) + 1
        '    End Select
        'End While
        'Rdr.Close()
        ''Treatment HCV completed
        'Dim CmdHCVC As New MySqlCommand("SELECT  count(tblavmain.ResultHC) as Num, tbltempoi.Sex FROM tblavmain RIGHT OUTER JOIN  tbltempoi ON tblavmain.ClinicID = tbltempoi.ClinicID WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND (tblavmain.ResultHC = 0) group by tbltempoi.Sex ", Cnndb)
        'Rdr = CmdHCVC.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 1
        '            XrTableCell424.Text = Rdr.GetValue(0).ToString
        '        Case Else
        '            XrTableCell425.Text = Rdr.GetValue(0).ToString
        '    End Select
        'End While
        'Rdr.Close()

        ''===================
        ''ART Prenvent
        ''====================

        'screen tb
        Dim CmdAvTB As New MySqlCommand("SELECT     tblavmain.Cough, tblavmain.Fever, tblavmain.Wlost, tblavmain.Drenching, tbltempart.Sex FROM   tblavmain RIGHT OUTER JOIN  tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID WHERE (tblavmain.Cough in (0,1) or tblavmain.Fever in (0,1) or tblavmain.Wlost in (0,1) or  tblavmain.Drenching in (0,1)) and (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  group by tbltempart.ClinicID order by tbltempart.ClinicID", Cnndb)
        Rdr = CmdAvTB.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(0).ToString) = 0 And Val(Rdr.GetValue(1).ToString) = 0 And Val(Rdr.GetValue(2).ToString) = 0 And Val(Rdr.GetValue(3).ToString) = 0 Then
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 1
                        XrTableCell258.Text = Val(XrTableCell258.Text) + 1
                    Case Else
                        XrTableCell259.Text = Val(XrTableCell259.Text) + 1
                End Select
            Else
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 1
                        XrTableCell264.Text = Val(XrTableCell264.Text) + 1
                    Case Else
                        XrTableCell265.Text = Val(XrTableCell265.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()

        'Positive Prevent

        Dim CmdaPo As New MySqlCommand("SELECT tblavmain.STIPreven, tblavmain.ARTAdher, tblavmain.Birthspac, tblavmain.TBinfect, tblavmain.Partner, tblavmain.Condoms,  tbltempart.Sex FROM  tblavmain RIGHT OUTER JOIN  tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  group by tbltempart.ClinicID", Cnndb)
        Rdr = CmdaPo.ExecuteReader
        While Rdr.Read
            Dim s, ar, bi, t, pa, ad, t1 As Integer
            If Val(Rdr.GetValue(0).ToString) = 0 Then
                s = 1
            End If
            If Val(Rdr.GetValue(1).ToString) = 0 Then
                ar = 1
            End If
            If Val(Rdr.GetValue(2).ToString) = 0 Then
                bi = 1
            End If
            If Val(Rdr.GetValue(3).ToString) = 0 Then
                t = 1
            End If
            If Val(Rdr.GetValue(4).ToString) = 0 Then
                pa = 1
            End If
            If Val(Rdr.GetValue(5).ToString) = 0 Then
                ad = 1
            End If
            t1 = s + ar + bi + t + pa + ad
            If t1 >= 3 Then
                Select Case Val(Rdr.GetValue(6).ToString)
                    Case 1
                        XrTableCell240.Text = Val(XrTableCell240.Text) + 1
                    Case Else
                        XrTableCell241.Text = Val(XrTableCell241.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()

        'diagnos TB and treat
        Dim CmdaTB As New MySqlCommand("SELECT    tblavmain.ClinicID, tblavmain.TBtreat, tbltempart.Sex FROM  tblavmain RIGHT OUTER JOIN   tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND (tblavmain.TB <> - 1) ORDER BY tblavmain.DatVisit ", Cnndb)
        Rdr = CmdaTB.ExecuteReader
        While Rdr.Read
            If CDbl(Rdr.GetValue(1).ToString) = 0 Then 'add a condition by sithorn
                Select Case Val(Rdr.GetValue(2).ToString)
                    Case 1
                        XrTableCell289.Text = Val(XrTableCell289.Text) + 1
                    Case Else
                        XrTableCell290.Text = Val(XrTableCell290.Text) + 1
                End Select
            End If
            If CDbl(Rdr.GetValue(1).ToString) = 0 Then
                Select Case Val(Rdr.GetValue(2).ToString)
                    Case 1
                        XrTableCell299.Text = Val(XrTableCell299.Text) + 1
                    Case Else
                        XrTableCell300.Text = Val(XrTableCell300.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()
        'By B Phana.....................................
        'INH
        'Dim CmdaIh As New MySqlCommand("SELECT count(tblavoidrug.DrugName) as num, tbltempart.Sex FROM  tblavmain RIGHT OUTER JOIN  tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID LEFT OUTER JOIN  tblavoidrug ON tblavmain.Vid = tblavoidrug.Vid WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND  (tblavoidrug.DrugName = 'Isoniazid') AND (tblavoidrug.Status = 0) group by tbltempart.Sex", Cnndb)
        'Rdr = CmdaIh.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 1
        '            XrTableCell279.Text = Rdr.GetValue(0).ToString
        '        Case Else
        '            XrTableCell280.Text = Rdr.GetValue(0).ToString
        '    End Select
        'End While
        'Rdr.Close()
        '..............................................
        'By Sithorn Count INH and TPT..................
        Dim sql_str As String = "SELECT COUNT(if(dr.sex=1,1,null)) as Male, count(if(dr.sex=0,1,null)) as Female from("
        sql_str &= "SELECT ai.ClinicID,ai.Sex,oi.DrugName as INH, tp.DrugName as TPT from(select ClinicID,DafirstVisit,Sex from tblaimain where DafirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "') ai "
        sql_str &= "Left join (select distinct av.ClinicID, oi.DrugName,oi.Status,oi.Da from tblavmain av "
        sql_str &= "Left join tblavoidrug oi on av.Vid=oi.Vid "
        sql_str &= "where DrugName='Isoniazid' and Status = 0 and (Da BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')) oi on ai.ClinicID=oi.clinicid "
        sql_str &= "Left join (select distinct av.ClinicID,tp.DrugName,tp.Status,tp.Da from tblavmain av "
        sql_str &= "left join tblavtptdrug tp on av.Vid=tp.Vid "
        sql_str &= "where (DrugName ='3HP' or DrugName='6H' or DrugName='3RH') and Status=0 and (Da BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND'" & Format(Edate, "yyyy-MM-dd") & "')) tp on ai.ClinicID=tp.clinicid "
        sql_str &= "Left join (select * from tblavpatientstatus where Da<= '" & Format(Edate, "yyyy-MM-dd") & "') ap on ai.ClinicID=ap.ClinicID "
        sql_str &= "where (oi.DrugName Is Not null Or tp.DrugName Is Not null)) dr" 'ap.Status Is null And 

        Dim CmdaTPT As New MySqlCommand(sql_str, Cnndb)
        Rdr = CmdaTPT.ExecuteReader
        While Rdr.Read
            XrTableCell279.Text = Rdr.GetValue(0).ToString
            XrTableCell280.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        '..............................................
        'Cotrim 
        Dim Cmdaco As New MySqlCommand("SELECT count(tblavoidrug.DrugName) as num, tbltempart.Sex FROM  tblavmain RIGHT OUTER JOIN  tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID LEFT OUTER JOIN  tblavoidrug ON tblavmain.Vid = tblavoidrug.Vid WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND  (tblavoidrug.DrugName = 'Cotrimoxazole') AND (tblavoidrug.Status = 0) group by tbltempart.Sex", Cnndb)
        Rdr = Cmdaco.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 1
                    XrTableCell309.Text = Val(XrTableCell309.Text) + 1
                Case Else
                    XrTableCell310.Text = Val(XrTableCell310.Text) + 1
            End Select
        End While
        Rdr.Close()
        'TestAntiHCV
        'B phana.................................
        'Dim CmdArhcv As New MySqlCommand("SELECT    tblavmain.ClinicID, tblavmain.CrAGResult, tbltempart.Sex FROM   tblavmain RIGHT OUTER JOIN   tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND  (tblavmain.CrAGResult IN (0, 1)) ORDER BY tblavmain.DatVisit", Cnndb)
        'Rdr = CmdArhcv.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell337.Text = Val(XrTableCell337.Text) + 1
        '                Case Else
        '                    XrTableCell338.Text = Val(XrTableCell338.Text) + 1
        '            End Select
        '        Case 1
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell349.Text = Val(XrTableCell349.Text) + 1
        '                Case Else
        '                    XrTableCell350.Text = Val(XrTableCell350.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()
        'Viral load HCV
        'Dim CmdHCV1 As New MySqlCommand("SELECT   tblavmain.ClinicID, tblpatienttest.HCV, tbltempart.Sex FROM   tbltempart LEFT OUTER JOIN  tblavmain ON tbltempart.ClinicID = tblavmain.ClinicID LEFT OUTER JOIN     tblpatienttest ON tblavmain.TestID = tblpatienttest.TestID WHERE     (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  AND   (tblpatienttest.HCV <> '') ORDER BY tblavmain.DatVisit", Cnndb)
        'Rdr = CmdHCV1.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell366.Text = Val(XrTableCell366.Text) + 1
        '                Case Else
        '                    XrTableCell367.Text = Val(XrTableCell367.Text) + 1
        '            End Select
        '        Case >= 39
        '            Select Case Val(Rdr.GetValue(2).ToString)
        '                Case 1
        '                    XrTableCell378.Text = Val(XrTableCell378.Text) + 1
        '                Case Else
        '                    XrTableCell379.Text = Val(XrTableCell379.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()
        '.....................................................
        'Sithorn..............................................
        'TestAntiHCV
        Dim CmdArhcv As New MySqlCommand("select ai.ClinicID,t.HCVAb, ai.Sex from(select ClinicID,Sex,DafirstVisit from tblaimain where DafirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "') ai " &
        "left join(select * from tblavpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') s on ai.ClinicID=s.ClinicID " &
        "left join(select distinct t.ClinicID, t.Dat, t.HCVAb, t.HCV from tblpatienttest t inner join" &
        "(select ClinicID,max(Dat) as Dat, HCVAb,HCV from preart.tblpatienttest where ClinicID not like 'P%' and HCVAb in (0,1) and (Dat between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "') group by ClinicID) " &
        "mt on t.ClinicID=mt.clinicid and mt.Dat=t.Dat) t on ai.ClinicID=t.ClinicID " &
        "where (s.Status is null or (s.Da between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "')) and t.HCVAb in (0,1);", Cnndb)
        Rdr = CmdArhcv.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 0
                    Select Case Val(Rdr.GetValue(2).ToString)
                        Case 1
                            XrTableCell337.Text = Val(XrTableCell337.Text) + 1
                        Case Else
                            XrTableCell338.Text = Val(XrTableCell338.Text) + 1
                    End Select
                Case 1
                    Select Case Val(Rdr.GetValue(2).ToString)
                        Case 1
                            XrTableCell349.Text = Val(XrTableCell349.Text) + 1
                        Case Else
                            XrTableCell350.Text = Val(XrTableCell350.Text) + 1
                    End Select
            End Select
        End While
        Rdr.Close()

        'Viral load HCV
        Dim CmdHCV1 As New MySqlCommand("select ai.ClinicID,coalesce(hcv.HCV,-1) as HCV,ai.Sex,hct.HCVAb from(select ClinicID,Sex,DafirstVisit from tblaimain where DafirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "') ai " &
        "left join(select * from tblavpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') s on ai.ClinicID=s.ClinicID " &
        "left join(select distinct ta.ClinicID, ta.Dat, ta.HCVAb, ta.HCV from tblpatienttest ta inner join(" &
        "select ClinicID,max(Dat) as Dat, HCVAb,HCV from preart.tblpatienttest where ClinicID not like 'P%' and HCVAb=0 and (Dat between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "') group by ClinicID) " &
        "mt on ta.ClinicID=mt.clinicid and mt.Dat=ta.Dat) hct on ai.ClinicID=hct.ClinicID " &
        "left join(select distinct t.ClinicID, t.Dat, t.HCVAb, t.HCV from tblpatienttest t inner join(" &
        "Select ClinicID, min(Dat) As Dat, HCVAb, HCV from preart.tblpatienttest where ClinicID not like 'P%' and HCV<>'' and (Dat between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "') group by ClinicID) " &
        "mt on t.ClinicID=mt.clinicid and mt.Dat=t.Dat) hcv on ai.ClinicID=hcv.ClinicID " &
        "where s.Status is null and (hct.HCVAb=0 or hcv.HCV<>'')", Cnndb)
        Rdr = CmdHCV1.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 0
                    Select Case Val(Rdr.GetValue(2).ToString)
                        Case 1
                            XrTableCell366.Text = Val(XrTableCell366.Text) + 1
                        Case Else
                            XrTableCell367.Text = Val(XrTableCell367.Text) + 1
                    End Select
                Case >= 39
                    Select Case Val(Rdr.GetValue(2).ToString)
                        Case 1
                            XrTableCell378.Text = Val(XrTableCell378.Text) + 1
                        Case Else
                            XrTableCell379.Text = Val(XrTableCell379.Text) + 1
                    End Select
                Case -1
                    If Val(Rdr.GetValue(3).ToString) = 0 Then
                        Select Case Val(Rdr.GetValue(2).ToString)
                            Case 1
                                XrTableCell392.Text = Val(XrTableCell392.Text) + 1
                            Case Else
                                XrTableCell393.Text = Val(XrTableCell393.Text) + 1
                        End Select
                    End If
            End Select
        End While
        Rdr.Close()
        '.....................................................
        'Start HCV
        'Dim Cmdadh As New MySqlCommand("SELECT  tblavmain.ResultHC,patientactive.Sex,patientactive.clinicid ,tblavhydrug.Status FROM  tblavmain RIGHT OUTER JOIN  patientactive ON tblavmain.ClinicID = patientactive.ClinicID LEFT OUTER JOIN  tblavhydrug ON tblavmain.Vid = tblavhydrug.Vid WHERE  (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblavhydrug.Status in(0,2)) group by patientactive.ClinicID ", Cnndb)
        'Rdr = Cmdadh.ExecuteReader
        Dim Cmdadh As New MySqlCommand("SELECT tblavmain.ResultHC,pa.Sex,pa.clinicid ,tblavhydrug.Status FROM tblavmain " &
            "RIGHT OUTER JOIN(select ai.ClinicID,ai.Sex from tblaimain ai left join(select * from tblavpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') ap on ai.ClinicID=ap.ClinicID " &
            "where ap.Status is null)  pa ON tblavmain.ClinicID = pa.ClinicID LEFT OUTER JOIN  tblavhydrug ON tblavmain.Vid = tblavhydrug.Vid " &
            "WHERE  (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblavhydrug.Status in(0,2)) group by pa.ClinicID;", Cnndb)
        Rdr = Cmdadh.ExecuteReader
        While Rdr.Read
            If CDec(Rdr.GetValue(0).ToString) = 1 Then
                Select Case CDbl(Rdr.GetValue(1).ToString)
                    Case 1
                        XrTableCell414.Text = Val(XrTableCell414.Text) + 1
                    Case Else
                        XrTableCell415.Text = Val(XrTableCell415.Text) + 1
                End Select
            End If
            If CDec(Rdr.GetValue(3).ToString) = 0 Then

                Select Case Val(Rdr.GetValue(1).ToString)
                    Case 1
                        XrTableCell402.Text = Val(XrTableCell402.Text) + 1
                    Case Else
                        XrTableCell403.Text = Val(XrTableCell403.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()
        'Treatment HCV completed
        Dim CmdaHCVC As New MySqlCommand("SELECT  count(tblavmain.ResultHC) as num, tbltempart.Sex FROM   tblavmain RIGHT OUTER JOIN  tbltempart ON tblavmain.ClinicID = tbltempart.ClinicID WHERE  (tblavmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblavmain.ResultHC = 0)  group by tbltempart.Sex", Cnndb)
        Rdr = CmdaHCVC.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 1
                    XrTableCell424.Text = Rdr.GetValue(0).ToString
                Case Else
                    XrTableCell425.Text = Rdr.GetValue(0).ToString
            End Select
        End While
        Rdr.Close()

        'Sithorn HCV Viral load after 12 weeks of completed treatment...........
        Dim CmdaHCV12 As New MySqlCommand("select ai.ClinicID,coalesce(lt.HCV,-1) as HCV,ai.Sex,lv.ResultHC from" &
        "(select ClinicID,Sex,DafirstVisit from tblaimain where DafirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "') ai " &
        "left join(select * from tblavpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') ap on ai.ClinicID=ap.ClinicID " &
        "left join(select distinct av.ClinicID, av.DatVisit, av.ResultHC, date_add(av.DatVisit,interval 12 week) as DatHCV_After12w from" &
        "(select ClinicID,DatVisit,ResultHC from tblavmain) av inner join" &
        "(select ClinicID,max(DatVisit) as DatVisit,ResultHC from tblavmain where ResultHC=0 and DatVisit<='" & Format(Edate, "yyyy-MM-dd") & "' " &
        "group by ClinicID) mv on av.ClinicID=mv.ClinicID and av.DatVisit=mv.DatVisit " &
        "where date_add(av.DatVisit,interval 12 week) between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "') lv on ai.ClinicID=lv.ClinicID " &
        "left join(select distinct t.ClinicID,t.Dat,t.HCV from" &
        "(select ClinicID,Dat,HCV from tblpatienttest) t inner join" &
        "(select ClinicID,max(Dat) as Dat,HCV from tblpatienttest where ClinicID not like 'P%' and HCV<>'' and Dat<='" & Format(Edate, "yyyy-MM-dd") & "' " &
        "group by ClinicID) tt on t.ClinicID=tt.ClinicID and t.Dat=tt.Dat) lt on lv.clinicid=lt.clinicid " &
        "where ap.Status is null and lv.ResultHC is not null;", Cnndb)
        Rdr = CmdaHCV12.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(1).ToString)
                Case 0
                    Select Case Val(Rdr.GetValue(2).ToString)
                        Case 1
                            XrTableCell436.Text = Val(XrTableCell436.Text) + 1
                        Case Else
                            XrTableCell442.Text = Val(XrTableCell442.Text) + 1
                    End Select
                Case >= 39
                    Select Case Val(Rdr.GetValue(2).ToString)
                        Case 1
                            XrTableCell453.Text = Val(XrTableCell453.Text) + 1
                        Case Else
                            XrTableCell454.Text = Val(XrTableCell454.Text) + 1
                    End Select
                Case -1
                    Select Case Val(Rdr.GetValue(2).ToString)
                        Case 1
                            XrTableCell465.Text = Val(XrTableCell465.Text) + 1
                        Case Else
                            XrTableCell466.Text = Val(XrTableCell466.Text) + 1
                    End Select
            End Select
        End While
        Rdr.Close()
        '.................................................................
        ''K1:
        'Dim CmdVid As New MySqlCommand("SELECT tblavmain.Vid, tblavmain.DatVisit,tblavmain.clinicid,tbltempart.Sex FROM tbltempart LEFT OUTER JOIN tblavmain ON tblavmain.ClinicID = tbltempart.ClinicID ORDER BY tblavmain.DatVisit DESC", Cnndb)
        'Rdr = CmdVid.ExecuteReader
        'While Rdr.Read
        '    Try
        '        Dim CmdIvid As New MySqlCommand("Insert into tbltempdrug values('" & Rdr.GetValue(0).ToString.Trim & "','" & Rdr.GetValue(2).ToString.Trim & "')", dbtem)
        '        CmdIvid.ExecuteNonQuery()
        '        'Dim cmddel As New MySqlCommand("delete from tbltempart where clinicid='" & Rdr.GetValue(2).ToString & "'", dbtem)
        '        'cmddel.ExecuteNonQuery()
        '        'Rdr.Close()
        '        'GoTo k1

        '    Catch ex As Exception
        '        'Rdr.Close()
        '        'GoTo K1
        '    End Try
        'End While
        'Rdr.Close()

    End Sub

    Private Sub XrTableCell721_BeforePrint(sender As Object, e As PrintEventArgs)

    End Sub

    Private Sub Child()
        Dim Appdata As New DataSet()

        'Lost and Return
        'Child
        Dim CmdNCPre As New MySqlCommand("SELECT  tblcimain.Sex ,  tblcart.ART,tblcimain.ClinicID,tblcart.DaArt FROM   tblcimain LEFT OUTER JOIN   tblcart ON  tblcimain.ClinicID =  tblcart.ClinicID WHERE ( tblcimain.LClinicID <> '') AND (tblcimain.DafirstVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') GROUP BY tblcimain.Sex, tblcart.ART", Cnndb)
        Rdr = CmdNCPre.ExecuteReader
        While Rdr.Read
            Try
                If Rdr.GetValue(1).ToString.Trim = "" Then GoTo K
                If Rdr.GetValue(1).ToString.Trim <> "" And CDate(Rdr.GetValue(3).ToString) >= CDate(Sdate) Or Rdr.GetValue(1).ToString.Trim = "" Then
K:
                    Try
                        Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                        CmdToi.ExecuteNonQuery()
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                XrTableCell73.Text = Val(XrTableCell73.Text) + 1
                            Case Else
                                XrTableCell74.Text = Val(XrTableCell74.Text) + 1
                        End Select
                    Catch ex As Exception
                    End Try
                Else
                    Try
                        Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                        CmdTart.ExecuteNonQuery()
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                XrTableCell85.Text = Val(XrTableCell85.Text) + 1
                            Case Else
                                XrTableCell86.Text = Val(XrTableCell86.Text) + 1
                        End Select
                    Catch ex As Exception
                    End Try
                End If
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()


        ' New OI
        'Child
        Dim CmdCNePre As New MySqlCommand("SELECT   tblcimain.ClinicID,  tblcimain.Sex FROM    tblcimain LEFT OUTER JOIN    tblcart ON  tblcimain.ClinicID =  tblcart.ClinicID LEFT OUTER JOIN    tblcvpatientstatus ON  tblcimain.ClinicID =  tblcvpatientstatus.ClinicID WHERE   ( tblcimain.OffIn <> 1) AND  ( tblcimain.LClinicID = '') AND   ( tblcimain.DaFirstVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') GROUP BY  tblcimain.ClinicID,  tblcimain.Sex", Cnndb)
        Rdr = CmdCNePre.ExecuteReader
        While Rdr.Read
            Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(0).ToString & "','" & Rdr.GetValue(1).ToString & "')", dbtem)
            CmdToi.ExecuteNonQuery()

            Select Case Val(Rdr.GetValue(1).ToString)

                Case 1
                    XrTableCell45.Text = Val(XrTableCell45.Text) + 1
                Case Else
                    XrTableCell47.Text = Val(XrTableCell47.Text) + 1
            End Select
        End While
        Rdr.Close()

        'Previous Pre-ART
        'Child
        Dim CmdCPr As New MySqlCommand("SELECT  tblcimain.Sex,  tblcimain.ClinicID,  tblcvpatientstatus.Da,  tblcart.DaArt,  tblcimain.OffIn,  tblcimain.DaFirstVisit FROM   tblcimain LEFT OUTER JOIN   tblcart ON  tblcimain.ClinicID =  tblcart.ClinicID LEFT OUTER JOIN   tblcvpatientstatus ON  tblcimain.ClinicID =  tblcvpatientstatus.ClinicID WHERE ( tblcimain.OffIn <> 1) AND ( tblcimain.DaFirstVisit < '" & Format(Sdate, "yyyy-MM-dd") & "') GROUP BY  tblcimain.Sex,  tblcimain.ClinicID,  tblcvpatientstatus.Da,  tblcart.DaArt,  tblcimain.OffIn,  tblcimain.DaFirstVisit", Cnndb)
        Rdr = CmdCPr.ExecuteReader
        While Rdr.Read
            Try
                If Rdr.GetValue(3).ToString.Trim = "" Or CDate(Rdr.GetValue(3).ToString) >= Sdate Then
                    If CDate(Rdr.GetValue(2).ToString) >= Sdate Then
                        Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(1).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                        CmdToi.ExecuteNonQuery()
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                XrTableCell9.Text = Val(XrTableCell9.Text) + 1
                            Case Else
                                XrTableCell16.Text = Val(XrTableCell16.Text) + 1
                        End Select
                    End If
                End If
            Catch ex As Exception
                Try
                    If CDate(Rdr.GetValue(2).ToString) >= Sdate Then

                        Try
                            Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(1).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                            CmdToi.ExecuteNonQuery()
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell9.Text = Val(XrTableCell9.Text) + 1
                                Case Else
                                    XrTableCell16.Text = Val(XrTableCell16.Text) + 1
                            End Select
                        Catch ex1 As Exception
                        End Try
                    End If
                Catch ex2 As Exception
                    Try
                        Dim CmdToi As New MySqlCommand("insert into tbltempoi values('" & Rdr.GetValue(1).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                        CmdToi.ExecuteNonQuery()
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                XrTableCell9.Text = Val(XrTableCell9.Text) + 1
                            Case Else
                                XrTableCell16.Text = Val(XrTableCell16.Text) + 1
                        End Select
                    Catch ex1 As Exception
                    End Try
                End Try
            End Try
        End While
        Rdr.Close()
        DataSource = Appdata.tblCoi

        'Previouse ARV
        ' Child
        Dim CmdCPreA As New MySqlCommand("SELECT    tblcimain.Sex,  tblcart.ART,  tblcimain.ClinicID,  tblcvpatientstatus.Da,  tblcimain.OffIn,  tblcimain.DaFirstVisit " &
                                           "FROM   tblcimain LEFT OUTER JOIN  tblcvpatientstatus ON  tblcimain.ClinicID =  tblcvpatientstatus.ClinicID LEFT OUTER JOIN " &
                                            "  tblcart ON  tblcimain.ClinicID =  tblcart.ClinicID WHERE ( tblcart.DaArt < '" & Format(Sdate, "yyyy-MM-dd") & "')", Cnndb)
        Rdr = CmdCPreA.ExecuteReader
        While Rdr.Read

            If CDbl(Rdr.GetValue(4).ToString) <> 1 Or CDate(Rdr.GetValue(5).ToString) <= Sdate Then
                Try
                    'If CDate(Rdr.GetValue(3).ToString) >= Sdate Then 'B Phana
                    If CDate(Rdr.GetValue(3).ToString) >= Sdate And CDate(Rdr.GetValue(5).ToString) < Sdate Then 'Add by Sithorn
                        Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                        CmdTart.ExecuteNonQuery()
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                XrTableCell28.Text = Val(XrTableCell28.Text) + 1
                            Case Else
                                XrTableCell29.Text = Val(XrTableCell29.Text) + 1
                        End Select

                    End If
                Catch ex As Exception
                    Try
                        'If CDate(Rdr.GetValue(3).ToString) >= Sdate Then 'B Phana
                        If CDate(Rdr.GetValue(3).ToString) >= Sdate And CDate(Rdr.GetValue(5).ToString) < Sdate Then 'Add by Sithorn
                            Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                            CmdTart.ExecuteNonQuery()
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell28.Text = Val(XrTableCell28.Text) + 1
                                Case Else
                                    XrTableCell29.Text = Val(XrTableCell29.Text) + 1
                            End Select

                        End If
                    Catch ex1 As Exception
                        Try
                            If CDate(Rdr.GetValue(5).ToString).Date > Sdate.Date Then GoTo ll 'Add by Sithorn
                            Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                            CmdTart.ExecuteNonQuery()
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell28.Text = Val(XrTableCell28.Text) + 1
                                Case Else
                                    XrTableCell29.Text = Val(XrTableCell29.Text) + 1
                            End Select
                        Catch ex2 As Exception
                        End Try
                    End Try
ll:
                End Try
            End If
        End While
        Rdr.Close()

        'New Patient Start ART
        ' Child
        Dim CmdARTc As New MySqlCommand("SELECT   tblcimain.Sex,  tblcart.ART,  tblcimain.ClinicID,  tblcvpatientstatus.Status,  tblcvpatientstatus.Da FROM    tblcimain LEFT OUTER JOIN   tblcart ON  tblcimain.ClinicID =  tblcart.ClinicID LEFT OUTER JOIN   tblcvpatientstatus ON  tblcimain.ClinicID =  tblcvpatientstatus.ClinicID WHERE  ( tblcart.ClinicID IS NOT NULL) AND ( tblcimain.OffIn <> 1) AND tblcimain.DafirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "' AND ( tblcart.DaArt BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')", Cnndb)
        Rdr = CmdARTc.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                CmdTart.ExecuteNonQuery()
                Dim CmdDel As New MySqlCommand("Delete from tbltempoi where clinicid='" & Rdr.GetValue(2).ToString & "'", dbtem)
                CmdDel.ExecuteNonQuery()
                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell101.Text = Val(XrTableCell101.Text) + 1
                    Case Else
                        XrTableCell102.Text = Val(XrTableCell102.Text) + 1
                End Select
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()

        ' TransferIn
        ' Child
        Dim CmdInc As New MySqlCommand("SELECT   tblcimain.Sex,  tblcart.ART,  tblcimain.ClinicID,  tblcvpatientstatus.Status,  tblcvpatientstatus.Da FROM    tblcimain LEFT OUTER JOIN   tblcart ON  tblcimain.ClinicID =  tblcart.ClinicID LEFT OUTER JOIN   tblcvpatientstatus ON  tblcimain.ClinicID =  tblcvpatientstatus.ClinicID WHERE ( tblcart.ClinicID IS NOT NULL) AND  ( tblcimain.OffIn = 1) AND ( tblcimain.DafirstVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')", Cnndb)
        Rdr = CmdInc.ExecuteReader
        While Rdr.Read
            Try
                Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
                CmdTart.ExecuteNonQuery()
                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell111.Text = Val(XrTableCell111.Text) + 1
                    Case Else
                        XrTableCell112.Text = Val(XrTableCell112.Text) + 1
                End Select
            Catch ex As Exception
            End Try
        End While
        Rdr.Close()

        'Sithorn..Pre-ART Re-Test before ARV.....
        'Child

        Dim CmdRetest As New MySqlCommand("select count(if(re.sex=1,1,null)) as Male, count(if(re.sex=0,1,null)) as Female from(" &
        "select ci.ClinicID,ci.sex, ci.DafirstVisit, lt.DatVisit, lt.TestHIV, lt.ResultHIV from " &
        "(select c.ClinicID, c.ARTnum, c.DatVisit, c.TestHIV, c.ResultHIV, c.DaApp, c.Vid from " &
        "(select ClinicID, ARTnum, DatVisit, TestHIV, ResultHIV, DaApp, Vid from tblcvmain " &
        "where DatVisit between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "') c inner join " &
        "(select cc.ClinicID, Max(cc.DatVisit) as DatVisit, cc.TestHIV, cc.ResultHIV from " &
        "(select ClinicID, ARTnum, DatVisit, TestHIV, ResultHIV, DaApp, Vid from tblcvmain " &
        "where (DatVisit between '" & Format(Sdate, "yyyy-MM-dd") & "' and '" & Format(Edate, "yyyy-MM-dd") & "' and TestHIV='True')) cc " &
        "group by cc.ClinicID) mcv on mcv.ClinicID=c.ClinicID and mcv.DatVisit=c.DatVisit) lt " &
        "left join tblcimain ci on ci.ClinicID=lt.clinicid " &
        "where ci.OffIn <> 1 and ci.LClinicID='') re;", Cnndb)
        Rdr = CmdRetest.ExecuteReader
        While Rdr.Read
            XrTableCell62.Text = Rdr.GetValue(0).ToString
            XrTableCell63.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        '.....................................
        'Patient Status
        'Child
        Dim tttt As String = ""
        Dim CmdClost As New MySqlCommand("SELECT tblcimain.Sex,  tblcvpatientstatus.Status,  tblcvmain.ARTnum,  tblcimain.ClinicID,  tblcimain.DafirstVisit,  tblcvpatientstatus.Da FROM          tblcvpatientstatus RIGHT OUTER JOIN   tblcvmain ON  tblcvpatientstatus.Vid =  tblcvmain.Vid RIGHT OUTER JOIN   tblcimain ON  tblcvmain.ClinicID =  tblcimain.ClinicID WHERE ( tblcvpatientstatus.Status IS NOT NULL) AND ( tblcvpatientstatus.Da BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')", Cnndb)
        Rdr = CmdClost.ExecuteReader
        While Rdr.Read
            If tttt.Trim <> Rdr.GetValue(3).ToString.Trim Then
                Dim CmdTart As New MySqlCommand("Delete from tbltempart where ClinicID='" + Rdr.GetValue(3).ToString + "'", dbtem)
                CmdTart.ExecuteNonQuery()
                Dim CmdDel As New MySqlCommand("Delete from tbltempoi where clinicid='" & Rdr.GetValue(3).ToString & "'", dbtem)
                CmdDel.ExecuteNonQuery()

                Select Case CDbl(Rdr.GetValue(1).ToString)
                    'Lost
                    Case 0
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell145.Text = Val(XrTableCell145.Text) + 1
                                Else
                                    XrTableCell161.Text = Val(XrTableCell161.Text) + 1
                                End If
                            Case Else

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell146.Text = Val(XrTableCell146.Text) + 1
                                Else
                                    XrTableCell162.Text = Val(XrTableCell162.Text) + 1
                                End If
                        End Select
                         'Death
                    Case 1
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell175.Text = Val(XrTableCell175.Text) + 1
                                Else
                                    XrTableCell189.Text = Val(XrTableCell189.Text) + 1
                                End If
                            Case Else

                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell176.Text = Val(XrTableCell176.Text) + 1
                                Else
                                    XrTableCell190.Text = Val(XrTableCell190.Text) + 1
                                End If
                        End Select
                        'Test Negative
                    Case 2
                        Select Case Val(Rdr.GetValue(0).ToString)
                            Case 1
                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell122.Text = Val(XrTableCell122.Text) + 1
                                Else
                                    XrTableCell122.Text = Val(XrTableCell122.Text) + 1
                                End If
                            Case Else
                                If Rdr.GetValue(2).ToString.Trim = "" Then
                                    XrTableCell123.Text = Val(XrTableCell123.Text) + 1
                                Else
                                    XrTableCell123.Text = Val(XrTableCell123.Text) + 1
                                End If
                        End Select
                       '  transter out
                    Case 3
                        If Rdr.GetValue(2).ToString.Trim <> "" Then
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1
                                    XrTableCell134.Text = Val(XrTableCell134.Text) + 1
                                Case Else
                                    XrTableCell135.Text = Val(XrTableCell135.Text) + 1
                            End Select
                        Else
                            Select Case Val(Rdr.GetValue(0).ToString)
                                Case 1

                                    If Rdr.GetValue(2).ToString.Trim = "" Then
                                        XrTableCell145.Text = Val(XrTableCell145.Text) + 1
                                    Else
                                        XrTableCell161.Text = Val(XrTableCell161.Text) + 1
                                    End If
                                Case Else

                                    If Rdr.GetValue(2).ToString.Trim = "" Then
                                        XrTableCell146.Text = Val(XrTableCell146.Text) + 1
                                    Else
                                        XrTableCell162.Text = Val(XrTableCell162.Text) + 1
                                    End If
                            End Select
                        End If
                End Select
            End If
            tttt = Rdr.GetValue(3).ToString
        End While
        Rdr.Close()

        'Search 

        '******************************
        ' Child OI
        '******************************

        'Dim Rdr1 As MySqlDataReader
        'Dim CmdsToi As New MySqlCommand("Select * from tbltempoi", dbtem)
        'Rdr1 = CmdsToi.ExecuteReader
        'While Rdr1.Read
        '    Dim ID As String = Rdr1.GetValue(0).ToString
        '    Dim Sex As Int32 = Rdr.GetValue(1).ToString
        'Screen TB
        Dim CmdAsTB As New MySqlCommand("SELECT tblcvmain.Enlarg,tblcvmain.PTB,tblcvmain.Cough, tblcvmain.Fever, tblcvmain.Wlost, tbltempoi.Sex FROM   tblcvmain RIGHT OUTER JOIN   tbltempoi ON tblcvmain.ClinicID = tbltempoi.ClinicID WHERE   (tblcvmain.Cough in (0,1) or tblcvmain.Fever in (0,1) or tblcvmain.Wlost in (0,1) or tblcvmain.Enlarg in (0,1) or tblcvmain.PTB in (0,1)) and  (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')  group by tbltempoi.ClinicID order by tbltempoi.ClinicID", Cnndb)
        Rdr = CmdAsTB.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(0).ToString) = 0 And Val(Rdr.GetValue(1).ToString) = 0 And Val(Rdr.GetValue(2).ToString) = 0 And Val(Rdr.GetValue(3).ToString) = 0 And Val(Rdr.GetValue(4).ToString) = 0 Then
                Select Case Val(Rdr.GetValue(5).ToString)
                    Case 1
                        XrTableCell246.Text = Val(XrTableCell246.Text) + 1
                    Case Else
                        XrTableCell247.Text = Val(XrTableCell247.Text) + 1
                End Select
            Else
                Select Case Val(Rdr.GetValue(5).ToString)
                    Case 1
                        XrTableCell252.Text = Val(XrTableCell252.Text) + 1
                    Case Else
                        XrTableCell253.Text = Val(XrTableCell253.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()

        Dim cmdchildactive As New MySqlCommand("select IOstatus,ifnull(min(case when sex=1 then num end),0) as Male,ifnull( min(case when sex=0 then num end),0) as Female from
                                                (select dd.sex,dd.IOstatus, count(clinicid) num from
                                                (select i.clinicid,i.sex,art,if(art is null,1,2) as IOstatus  from tblcimain i
                                                left join (select distinct * from tblcart where DaArt<='" & Format(Edate, "yyyy-MM-dd") & "' ) a on a.clinicid=i.clinicid
                                                left join (select distinct * from tblcvpatientstatus where Da<='" & Format(Edate, "yyyy-MM-dd") & "') st on st.clinicid=i.clinicid
                                                where st.status is null and i.DaFirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "') dd
                                                group by dd.sex,dd.IOstatus) d
                                                group by d.IOstatus", Cnndb)
        Rdr = cmdchildactive.ExecuteReader
        While Rdr.Read
            If CDbl(Rdr.GetValue(0).ToString) = 1 Then
                XrTableCell207.Text = Rdr.GetValue(1).ToString
                XrTableCell208.Text = Rdr.GetValue(2).ToString
            End If
            If CDbl(Rdr.GetValue(0).ToString) = 2 Then
                XrTableCell219.Text = Rdr.GetValue(1).ToString
                XrTableCell220.Text = Rdr.GetValue(2).ToString
            End If

        End While
        Rdr.Close()

        'diagnos TB and treat
        Dim CmdTB As New MySqlCommand("SELECT    tbltempoi.Sex, tblcvmain.TBtreat FROM   tblcvmain RIGHT OUTER JOIN   tbltempoi ON tblcvmain.ClinicID = tbltempoi.ClinicID WHERE     (tblcvmain.TB <> - 1) AND (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') ORDER BY tblcvmain.DatVisit ", Cnndb)
        Rdr = CmdTB.ExecuteReader
        While Rdr.Read
            If CDbl(Rdr.GetValue(1).ToString) = 0 Then 'add a condition by sithorn
                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell284.Text = Val(XrTableCell284.Text) + 1
                    Case Else
                        XrTableCell285.Text = Val(XrTableCell285.Text) + 1
                End Select
            End If
            If CDbl(Rdr.GetValue(1).ToString) = 0 Then
                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell294.Text = Val(XrTableCell294.Text) + 1
                    Case Else
                        XrTableCell295.Text = Val(XrTableCell295.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()
        ''INH
        'Dim CmdIh As New MySqlCommand("SELECT   tbltempoi.Sex, count( tblcvoidrug.DrugName) as Num  FROM         tblcvmain RIGHT OUTER JOIN  tbltempoi ON tblcvmain.ClinicID = tbltempoi.ClinicID LEFT OUTER JOIN   tblcvoidrug ON tblcvmain.Vid = tblcvoidrug.Vid WHERE     (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblcvoidrug.DrugName = 'Isoniazid') AND   (tblcvoidrug.Status = 0) group by  tbltempoi.Sex", Cnndb)
        'Rdr = CmdIh.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(0).ToString)
        '        Case 1
        '            XrTableCell274.Text = Val(XrTableCell274.Text) + 1
        '        Case Else
        '            XrTableCell275.Text = Val(XrTableCell275.Text) + 1
        '    End Select
        'End While
        'Rdr.Close()
        'sithorn count INH and TPT......
        Dim CmdIh As New MySqlCommand("SELECT COUNT(if(dr.sex=1,1,null)) as Male, count(if(dr.sex=0,1,null)) as Female from( " &
           "SELECT ai.ClinicID, ai.Sex, oi.DrugName As INH, tp.DrugName As TPT from(Select ClinicID, DafirstVisit, Sex from tblcimain where DafirstVisit<='" & Format(Edate, "yyyy-MM-dd") & "') ai " &
           "Left Join(select distinct av.ClinicID, oi.DrugName, oi.Status, oi.Da from tblcvmain av " &
           "Left join tblcvoidrug oi on av.Vid=oi.Vid " &
           "where DrugName ='Isoniazid' and Status = 0 and (Da BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "')) oi on ai.ClinicID=oi.clinicid " &
           "Left join (Select distinct av.ClinicID, tp.DrugName, tp.Status, tp.Da from tblcvmain av " &
           "left join tblcvtptdrug tp on av.Vid=tp.Vid " &
           "where(DrugName ='3HP' or DrugName='6H' or DrugName='3RH') and Status=0 and (Da BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND'" & Format(Edate, "yyyy-MM-dd") & "')) tp on ai.ClinicID=tp.clinicid " &
           "Left join (select * from tblcvpatientstatus where Da<= '" & Format(Edate, "yyyy-MM-dd") & "') ap on ai.ClinicID=ap.ClinicID " &
           "where (oi.DrugName Is Not null Or tp.DrugName Is Not null)) dr", Cnndb) 'ap.Status Is null And
        Rdr = CmdIh.ExecuteReader
        While Rdr.Read
            XrTableCell274.Text = Rdr.GetValue(0).ToString
            XrTableCell275.Text = Rdr.GetValue(1).ToString
        End While
        Rdr.Close()
        '.....................
        'Cotrim
        Dim Cmdco As New MySqlCommand("SELECT  tbltempoi.Sex, count(tblcvoidrug.DrugName) as Num FROM    tblcvmain RIGHT OUTER JOIN  tbltempoi ON tblcvmain.ClinicID = tbltempoi.ClinicID LEFT OUTER JOIN   tblcvoidrug ON tblcvmain.Vid = tblcvoidrug.Vid WHERE     (tblcvoidrug.DrugName = 'Cotrimoxazole') AND (tblcvoidrug.Status = 0) group by tbltempoi.Sex", Cnndb)
        Rdr = Cmdco.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(0).ToString)
                Case 1
                    XrTableCell304.Text = Rdr.GetValue(1).ToString
                Case Else
                    XrTableCell305.Text = Rdr.GetValue(1).ToString
            End Select
        End While
        Rdr.Close()

        ''TestAntiHCV
        'Dim CmdAhcv As New MySqlCommand("SELECT     ClinicID, CrAGResult FROM    tblcvmain WHERE     (DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (ClinicID = '" & ID & "') AND (CrAGResult IN (0, 1)) ORDER BY DatVisit", Cnndb)
        'Rdr = CmdAhcv.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell329.Text = Val(XrTableCell329.Text) + 1
        '                Case Else
        '                    XrTableCell332.Text = Val(XrTableCell332.Text) + 1
        '            End Select
        '        Case 1
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell343.Text = Val(XrTableCell343.Text) + 1
        '                Case Else
        '                    XrTableCell344.Text = Val(XrTableCell344.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()
        ''Viral load HCV
        'Dim CmdHCV As New MySqlCommand("SELECT tblcvmain.ClinicID, tblpatienttest.HCV FROM         tblcvmain LEFT OUTER JOIN     tblpatienttest ON tblcvmain.TestID = tblpatienttest.TestID WHERE   (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblcvmain.ClinicID = '" & ID & "') AND   (tblpatienttest.HCV <>'') ORDER BY tblcvmain.DatVisit", Cnndb)
        'Rdr = CmdHCV.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell360.Text = Val(XrTableCell360.Text) + 1
        '                Case Else
        '                    XrTableCell361.Text = Val(XrTableCell361.Text) + 1
        '            End Select
        '        Case >= 39
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell372.Text = Val(XrTableCell372.Text) + 1
        '                Case Else
        '                    XrTableCell373.Text = Val(XrTableCell373.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()

        '******************************
        ' Child ARV
        '******************************
        'Screen TB
        Dim CmdAsTB1 As New MySqlCommand("SELECT     tblcvmain.Cough, tblcvmain.Fever, tblcvmain.Wlost, tblcvmain.Enlarg, tblcvmain.PTB, tbltempart.Sex FROM tblcvmain RIGHT OUTER JOIN  tbltempart ON tblcvmain.ClinicID = tbltempart.ClinicID WHERE  ( tblcvmain.Cough in (0,1) or tblcvmain.Fever in (0,1) or tblcvmain.Wlost in (0,1) or tblcvmain.Enlarg in (0,1) or tblcvmain.PTB in (0,1)) and  (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') group by tbltempart.ClinicID order by tbltempart.ClinicID", Cnndb)
        Rdr = CmdAsTB1.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(0).ToString) = 0 And Val(Rdr.GetValue(1).ToString) = 0 And Val(Rdr.GetValue(2).ToString) = 0 And Val(Rdr.GetValue(3).ToString) = 0 And Val(Rdr.GetValue(4).ToString) = 0 Then
                Select Case Val(Rdr.GetValue(5).ToString)
                    Case 1
                        XrTableCell246.Text = Val(XrTableCell246.Text) + 1
                    Case Else
                        XrTableCell247.Text = Val(XrTableCell247.Text) + 1
                End Select
            Else
                Select Case Val(Rdr.GetValue(5).ToString)
                    Case 1
                        XrTableCell252.Text = Val(XrTableCell252.Text) + 1
                    Case Else
                        XrTableCell253.Text = Val(XrTableCell253.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()

        'diagnos TB and treat
        Dim CmdTB1 As New MySqlCommand("SELECT tbltempart.Sex, tblcvmain.TBtreat FROM   tblcvmain RIGHT OUTER JOIN  tbltempart ON tblcvmain.ClinicID = tbltempart.ClinicID WHERE     (tblcvmain.TB <> - 1) AND (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') ORDER BY tblcvmain.DatVisit", Cnndb)
        Rdr = CmdTB1.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(1).ToString) = 0 Then 'add a condition by sithorn
                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell284.Text = Val(XrTableCell284.Text) + 1
                    Case Else
                        XrTableCell285.Text = Val(XrTableCell285.Text) + 1
                End Select
            End If
            If Val(Rdr.GetValue(1).ToString) = 0 Then
                Select Case Val(Rdr.GetValue(0).ToString)
                    Case 1
                        XrTableCell294.Text = Val(XrTableCell294.Text) + 1
                    Case Else
                        XrTableCell295.Text = Val(XrTableCell295.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()
        'INH
        'Dim CmdIh1 As New MySqlCommand("SELECT   tbltempart.Sex, count(tblcvoidrug.DrugName) as Num FROM  tblcvmain RIGHT OUTER JOIN  tbltempart ON tblcvmain.ClinicID = tbltempart.ClinicID LEFT OUTER JOIN   tblcvoidrug ON tblcvmain.Vid = tblcvoidrug.Vid WHERE     (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblcvoidrug.DrugName = 'Isoniazid') AND   (tblcvoidrug.Status = 0) group by  tbltempart.Sex", Cnndb)
        'Rdr = CmdIh1.ExecuteReader
        'While Rdr.Read
        'Select Case Val(Rdr.GetValue(0).ToString)
        'Case 1
        'XrTableCell274.Text = Val(XrTableCell274.Text) + 1
        'Case Else
        'XrTableCell275.Text = Val(XrTableCell275.Text) + 1
        'End Select
        'End While
        'Rdr.Close()

        'Cotrim 
        Dim Cmdco1 As New MySqlCommand("SELECT   tbltempart.Sex, count(tblcvoidrug.DrugName) as Num FROM  tblcvmain RIGHT OUTER JOIN  tbltempart ON tblcvmain.ClinicID = tbltempart.ClinicID LEFT OUTER JOIN   tblcvoidrug ON tblcvmain.Vid = tblcvoidrug.Vid WHERE     (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblcvoidrug.DrugName = 'Cotrimoxazole') AND   (tblcvoidrug.Status = 0) group by  tbltempart.Sex", Cnndb)
        Rdr = Cmdco1.ExecuteReader
        While Rdr.Read
            Select Case Val(Rdr.GetValue(0).ToString)
                Case 1
                    XrTableCell304.Text = Val(XrTableCell304.Text) + 1
                Case Else
                    XrTableCell305.Text = Val(XrTableCell305.Text) + 1
            End Select
        End While
        Rdr.Close()
        ''TestAntiHCV
        'Dim CmdAhcv As New MySqlCommand("SELECT     ClinicID, CrAGResult FROM    tblcvmain WHERE     (DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (ClinicID = '" & ID & "') AND (CrAGResult IN (0, 1)) ORDER BY DatVisit", Cnndb)
        'Rdr = CmdAhcv.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell329.Text = Val(XrTableCell329.Text) + 1
        '                Case Else
        '                    XrTableCell332.Text = Val(XrTableCell332.Text) + 1
        '            End Select
        '        Case 1
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell343.Text = Val(XrTableCell343.Text) + 1
        '                Case Else
        '                    XrTableCell344.Text = Val(XrTableCell344.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()
        ''Viral load HCV
        'Dim CmdHCV As New MySqlCommand("SELECT tblcvmain.ClinicID, tblpatienttest.HCV FROM         tblcvmain LEFT OUTER JOIN     tblpatienttest ON tblcvmain.TestID = tblpatienttest.TestID WHERE   (tblcvmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy-MM-dd") & "' AND '" & Format(Edate, "yyyy-MM-dd") & "') AND (tblcvmain.ClinicID = '" & ID & "') AND   (tblpatienttest.HCV <>'') ORDER BY tblcvmain.DatVisit", Cnndb)
        'Rdr = CmdHCV.ExecuteReader
        'While Rdr.Read
        '    Select Case Val(Rdr.GetValue(1).ToString)
        '        Case 0
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell360.Text = Val(XrTableCell360.Text) + 1
        '                Case Else
        '                    XrTableCell361.Text = Val(XrTableCell361.Text) + 1
        '            End Select
        '        Case >= 39
        '            Select Case Val(Sex)
        '                Case 1
        '                    XrTableCell372.Text = Val(XrTableCell372.Text) + 1
        '                Case Else
        '                    XrTableCell373.Text = Val(XrTableCell373.Text) + 1
        '            End Select
        '    End Select
        'End While
        'Rdr.Close()
    End Sub
    Private Sub Exposed()
        'Previous
        Dim CmdP As New MySqlCommand("SELECT      tblEImain.ClinicID,  tblEImain.Sex,  tblevpatientstatus.DaStatus,  tblEImain.DafirstVisit FROM    tblevpatientstatus RIGHT OUTER JOIN   tblEImain ON  tblevpatientstatus.ClinicID =  tblEImain.ClinicID WHERE tblEImain.DafirstVisit<'" & Format(Sdate, "yyyy/MM/dd") & "' GROUP BY  tblEImain.ClinicID,  tblEImain.Sex,  tblevpatientstatus.DaStatus,  tblEImain.DafirstVisit", Cnndb)
        Rdr = CmdP.ExecuteReader
        While Rdr.Read
            If Trim(Rdr.GetValue(2).ToString) = "" And CDate(Rdr.GetValue(3).ToString) < Sdate Then GoTo K1
            If Rdr.GetValue(2).ToString.Trim = "" Then GoTo k2
            If CDate(Rdr.GetValue(2).ToString) >= Sdate Then
K1:
                Xptotal.Text = Val(Xptotal.Text) + 1
                If CDec(Rdr.GetValue(1).ToString) = 1 Then
                    xMP.Text = Val(xMP.Text) + 1
                End If
            End If
k2:
        End While
        Rdr.Close()
        ' New Case
        'Dim CmdNew As New MySqlCommand("SELECT ClinicID, DafirstVisit, DaBirth, Sex FROM  tblEImain WHERE (DafirstVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY Sex", Cnndb)
        'Rdr = CmdNew.ExecuteReader
        'While Rdr.Read
        '    If DateDiff(DateInterval.Month, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(2).ToString)) <= 2 Then
        '        If CDec(Rdr.GetValue(3).ToString) = 1 Then
        '            XrTableCell542.Text = Val(XrTableCell542.Text) + 1
        '        Else
        '            XrTableCell543.Text = Val(XrTableCell543.Text) + 1
        '        End If
        '    ElseIf DateDiff(DateInterval.Month, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(2).ToString)) > 2 Then
        '        If CDec(Rdr.GetValue(3).ToString) = 1 Then
        '            XrTableCell547.Text = Val(XrTableCell547.Text) + 1
        '        Else
        '            XrTableCell548.Text = Val(XrTableCell548.Text) + 1
        '        End If
        '    End If
        'End While
        'Rdr.Close()

        Dim CmdNew As New MySqlCommand("select " &
        "count(If(c.Sex = 1 And timestampdiff(Month, DaBirth, DafirstVisit) <= 2, 1, null)) M_less2, " &
        "count(If(c.Sex = 0 And timestampdiff(Month, DaBirth, DafirstVisit) <= 2, 1, null)) F_less2, " &
        "count(If(c.Sex = 1 And timestampdiff(Month, DaBirth, DafirstVisit) > 2, 1, null)) M_great2, " &
        "count(If(c.Sex = 0 And timestampdiff(Month, DaBirth, DafirstVisit) > 2, 1, null)) F_great2 " &
        "from(select ClinicID, Sex, DafirstVisit, DaBirth from tbleimain " &
        "where(DafirstVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) c;", Cnndb)
        Rdr = CmdNew.ExecuteReader
        While Rdr.Read
            XrTableCell542.Text = Rdr.GetValue(0).ToString 'M_less2
            XrTableCell543.Text = Rdr.GetValue(1).ToString 'F_less2
            XrTableCell547.Text = Rdr.GetValue(2).ToString 'M_great2
            XrTableCell548.Text = Rdr.GetValue(3).ToString 'F_great2
        End While
        Rdr.Close()

        ' DNA PCR and result

        Dim CmdPCR1 As New MySqlCommand("select " &
        "count(If(c.Sex = 1 And timestampdiff(Day, c.DaBirth, c.DaBlood) <= 76, 1, null)) m_less2m, " &
        "count(If(c.Sex = 0 And timestampdiff(Day, c.DaBirth, c.DaBlood) <= 76, 1, null)) f_less2m, " &
        "count(If(c.Sex = 1 And timestampdiff(Day, c.DaBirth, c.DaBlood) > 76, 1, null)) m_great2m, " &
        "count(If(c.Sex = 0 And timestampdiff(Day, c.DaBirth, c.DaBlood) > 76, 1, null)) m_great2m " &
        "from(select et.ClinicID, ei.Sex, ei.DafirstVisit, ei.DaBirth, et.DNAPcr, et.DaBlood, et.Result from tbletest et " &
        "inner Join(select distinct ClinicID, max(DaBlood) DaBlood from tbletest " &
        "where(DaBlood between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') group by ClinicID) t " &
        "On et.ClinicID=t.ClinicID And et.DaBlood=t.DaBlood " &
        "Left Join tbleimain ei on et.ClinicID=ei.ClinicID) c;", Cnndb)
        Rdr = CmdPCR1.ExecuteReader
        While Rdr.Read
            XrTableCell715.Text = Rdr.GetValue(0).ToString 'm_Less2m
            XrTableCell716.Text = Rdr.GetValue(1).ToString 'f_Less2m
            XrTableCell770.Text = Rdr.GetValue(2).ToString 'm_great2m
            XrTableCell771.Text = Rdr.GetValue(3).ToString 'f_great2m
        End While
        Rdr.Close()
        'Dim id As String
        'Dim i As Integer
        'Dim CmdPCR1 As New MySqlCommand("SELECT tblEImain.ClinicID,  tblEImain.DaBirth,  tblEImain.Sex,  tblEVmain.DatVisit,  tblETest.PCR, tblETest.Result,  tblEVmain.VID FROM    tblEVmain INNER JOIN  tblEImain ON  tblEVmain.ClinicID =  tblEImain.ClinicID INNER JOIN tblETest ON  tblEImain.ClinicID =  tblETest.ClinicID AND  tblEVmain.TestID =  tblETest.TID WHERE     ( tblETest.PCR = 'True') AND (tblETest.DaBlood BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY tblEImain.ClinicID, tblEVmain.DatVisit ", Cnndb)
        'Rdr = CmdPCR1.ExecuteReader
        'While Rdr.Read
        '    i = i + 1
        '    If id <> Rdr.GetValue(0).ToString.Trim Then
        '        id = Rdr.GetValue(0).ToString
        '        i = 1
        '        If DateDiff(DateInterval.Month, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString)) <= 2 Then
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell715.Text = Val(XrTableCell715.Text) + 1
        '            Else
        '                XrTableCell716.Text = Val(XrTableCell716.Text) + 1
        '            End If
        '        Else
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell770.Text = Val(XrTableCell770.Text) + 1
        '            Else
        '                XrTableCell771.Text = Val(XrTableCell771.Text) + 1
        '            End If
        '        End If
        '    End If
        'End While
        'Rdr.Close()

        'Start Cotrim
        'Dim CmdCo As New MySqlCommand("SELECT   tblEImain.ClinicID,  tblEImain.DaBirth,  tblEImain.Sex,  tblEVmain.DatVisit,  tblevarvdrug.Status FROM  tblEVmain INNER JOIN   tblEImain ON  tblEVmain.ClinicID =  tblEImain.ClinicID RIGHT OUTER JOIN  tblevarvdrug ON  tblEVmain.Vid =  tblevarvdrug.Vid WHERE  ( tblevarvdrug.Status = N'0') AND ( tblEVmain.DatVisit  BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')  group by tbleimain.clinicid  ORDER BY  tblEVmain.DatVisit,  tblEImain.Sex", Cnndb)
        'Rdr = CmdCo.ExecuteReader
        Dim CmdCo As New MySqlCommand("SELECT tblEImain.ClinicID,tblEImain.DaBirth,tblEImain.Sex,tblEVmain.DatVisit,tblevarvdrug.Status,tblevarvdrug.Da,tblEImain.DafirstVisit FROM tblEVmain INNER JOIN tblEImain ON tblEVmain.ClinicID =  tblEImain.ClinicID RIGHT OUTER JOIN tblevarvdrug ON tblEVmain.Vid = tblevarvdrug.Vid WHERE  (tblevarvdrug.Status = 0 and tblevarvdrug.DrugName='Cotrimoxazole') and (tblevarvdrug.Da BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') group by tbleimain.clinicid  ORDER BY tblevarvdrug.Da, tblEImain.Sex;", Cnndb)
        Rdr = CmdCo.ExecuteReader
        While Rdr.Read
            'If DateDiff(DateInterval.Month, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString)) <= 2 Then
            If CDec(Rdr.GetValue(2).ToString) = 1 Then
                xLmc2.Text = Val(xLmc2.Text) + 1
            Else
                xLfc2.Text = Val(xLfc2.Text) + 1
            End If
            'Else
            'If CDec(Rdr.GetValue(2).ToString) = 1 Then
            'xGmc2.Text = Val(xGmc2.Text) + 1
            'Else
            'xGfc2.Text = Val(xGfc2.Text) + 1
            'End If
            'End If
        End While
        Rdr.Close()

        'All DNA PCR Test 'Sithorn
        'Dim CmdAllpcrtest As New MySqlCommand("SELECT tblEImain.ClinicID,tblEImain.DaBirth,tblEImain.Sex,tblEVmain.DatVisit,tblEVmain.DNA FROM tblEVmain INNER JOIN tblEImain ON tblEVmain.ClinicID = tblEImain.ClinicID  WHERE tblEVmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "' ORDER BY tblEImain.ClinicID, tblEVmain.DatVisit;", Cnndb)
        'Rdr = CmdAllpcrtest.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(4).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                xLPm2.Text = Val(xLPm2.Text) + 1
        '            Else
        '                xLPf2.Text = Val(xLPf2.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell518.Text = Val(XrTableCell518.Text) + 1
        '            Else
        '                XrTableCell521.Text = Val(XrTableCell521.Text) + 1
        '            End If
        '        Case 3
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell512.Text = Val(XrTableCell512.Text) + 1
        '            Else
        '                XrTableCell513.Text = Val(XrTableCell513.Text) + 1
        '            End If
        '        Case 5
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell506.Text = Val(XrTableCell506.Text) + 1
        '            Else
        '                XrTableCell507.Text = Val(XrTableCell507.Text) + 1
        '            End If
        '    End Select

        'End While
        'Rdr.Close()

        'All DNA PCR Test 'Sithorn
        'Dim CmdAllpcr As New MySqlCommand("select " &
        '" count(IF(s.Sex = 1 and s.DNAPcr=0, 1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=4 and (s.C_DNAPcr = 0 or s.C_DNAPcrSameDay = 0),1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=-1 and s.DNA=0, 1, null)) as M_Birth, " &
        '" count(IF(s.Sex = 0 and s.DNAPcr=0, 1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=4 and (s.C_DNAPcr = 0 or s.C_DNAPcrSameDay = 0),1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=-1 and s.DNA=0, 1, null)) as F_Birth, " &
        '" count(IF(s.Sex = 1 and s.DNAPcr=1, 1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=4 and (s.C_DNAPcr = 1 or s.C_DNAPcrSameDay = 1),1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=-1 and s.DNA=1, 1, null)) as M_46, " &
        '" count(IF(s.Sex = 0 and s.DNAPcr=1, 1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=4 and (s.C_DNAPcr = 1 or s.C_DNAPcrSameDay = 1),1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=-1 and s.DNA=1, 1, null)) as F_46, " &
        '" count(IF(s.Sex = 1 and s.DNAPcr=5, 1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=4 and (s.C_DNAPcr = 5 or s.C_DNAPcrSameDay = 5),1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=-1 and s.DNA=5, 1, null)) as M_9, " &
        '" count(IF(s.Sex = 0 and s.DNAPcr=5, 1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=4 and (s.C_DNAPcr = 5 or s.C_DNAPcrSameDay = 5),1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=-1 and s.DNA=5, 1, null)) as F_9, " &
        '" count(IF(s.Sex = 1 and s.DNAPcr=3 and s.OI='True', 1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=4 and s.OI='True' and (s.C_DNAPcr = 3 or s.C_DNAPcrSameDay = 3),1, null)) + count(IF(s.Sex = 1 and s.DNAPcr=-1 and s.DNA=3 and s.Req_OI='True', 1, null)) as M_OI, " &
        '" count(If(s.Sex = 0 And s.DNAPcr = 3 And s.OI ='True', 1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=4 and s.OI='True' and (s.C_DNAPcr = 3 or s.C_DNAPcrSameDay = 3),1, null)) + count(IF(s.Sex = 0 and s.DNAPcr=-1 and s.DNA=3 and s.Req_OI='True', 1, null)) as F_OI " &
        '" from(select ei.ClinicID, ei.Sex, ev.DatVisit, ev.DNA, If(ev.OtherDNA ='OI','True','False') Req_OI,coalesce(et.DNAPcr,-1) DNAPcr,et.DaBlood, et.OI, et.Result, " &
        '" coalesce((select DNAPcr from tbletest etc where etc.ClinicID=et.ClinicID and et.result=1 and (etc.DaBlood between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') " &
        '" And et.DaBlood<etc.DaBlood order by etc.DaBlood limit 1),-1) C_DNAPcr, " &
        '" coalesce((select DNAPcr from tbletest etc where etc.ClinicID=et.ClinicID and et.result=1 and (etc.DaBlood between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') " &
        '" and et.DaBlood=etc.DaBlood and etc.DNAPcr<>4 order by etc.DaBlood limit 1),-1) C_DNAPcrSameDay  " &
        '" from tblevmain ev inner join tbleimain ei ON ev.ClinicID = ei.ClinicID " &
        '" left join (select ClinicID,DNAPcr,OI,DaPcrArr,DaBlood,if(DaPcrArr='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '" from tbletest order by ClinicID,DaBlood) et on ev.ClinicID=et.ClinicID and ev.DatVisit=et.DaBlood " &
        '" where (ev.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') order by ev.ClinicID , ev.DatVisit,et.DaBlood) s;", Cnndb)
        Dim CmdAllpcr As New MySqlCommand("select " &
        " COUNT(If(c.Sex = 1 And c.DNA = 0, 1, null)) As m_Birth, " &
        " COUNT(If(c.Sex = 0 And c.DNA = 0, 1, null)) As f_Birth, " &
        " COUNT(If(c.Sex = 1 And c.DNA = 1, 1, null)) As m_46, " &
        " COUNT(If(c.Sex = 0 And c.DNA = 1, 1, null)) As f_46, " &
        " COUNT(If(c.Sex = 1 And c.DNA = 5, 1, null)) As m_9, " &
        " COUNT(If(c.Sex = 0 And c.DNA = 5, 1, null)) As f_9, " &
        " COUNT(If(c.Sex = 1 And c.DNA = 3 And c.OtherDNA ='OI', 1, null)) as m_OI, " &
        " COUNT(If(c.Sex = 0 And c.DNA = 3 And c.OtherDNA ='OI', 1, null)) as f_OI, " &
        " COUNT(If(c.Sex = 1 And c.DNA = 4, 1, null)) As m_Con, " &
        " COUNT(If(c.Sex = 0 And c.DNA = 4, 1, null)) As f_Con " &
        " from(select v.ClinicID, ei.Sex, v.DatVisit, v.DNA, v.OtherDNA from  tblevmain v " &
        " inner Join tbleimain ei ON v.ClinicID = ei.ClinicID where v.DNA<>-1 And v.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') c;", Cnndb)
        Rdr = CmdAllpcr.ExecuteReader
        While Rdr.Read
            'All DNA PCR at birth
            xLPm2.Text = Rdr.GetValue(0).ToString
            xLPf2.Text = Rdr.GetValue(1).ToString
            'All DNA PCR at 4-6 weeks
            XrTableCell518.Text = Rdr.GetValue(2).ToString
            XrTableCell521.Text = Rdr.GetValue(3).ToString
            'All DNA PCR at 9 months
            XrTableCell506.Text = Rdr.GetValue(4).ToString
            XrTableCell507.Text = Rdr.GetValue(5).ToString
            'All DNA PCR at OI
            XrTableCell512.Text = Rdr.GetValue(6).ToString
            XrTableCell513.Text = Rdr.GetValue(7).ToString
            'All DNA PCR Confirm
            XrTableCell505.Text = Rdr.GetValue(8).ToString
            XrTableCell520.Text = Rdr.GetValue(9).ToString
        End While
        Rdr.Close()


        'DNA PCR at birth 'Sithorn
        'Dim CmdPCRbirth As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=0 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID WHERE ev.DNA=0 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = Cmdpcrbirth.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(7).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell556.Text = Val(XrTableCell556.Text) + 1
        '            Else
        '                XrTableCell557.Text = Val(XrTableCell557.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell551.Text = Val(XrTableCell551.Text) + 1
        '            Else
        '                XrTableCell552.Text = Val(XrTableCell552.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell566.Text = Val(XrTableCell566.Text) + 1
        '            Else
        '                XrTableCell567.Text = Val(XrTableCell567.Text) + 1
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'DNA PCR Confirn at birth 'Sithorn
        'Dim CmdPCRConbirth As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result,etCon.DaPcrArr,etCon.DNAPcr,coalesce(etCon.Result,-1) as ConfResult,coalesce(evc.DNA,-1) as ConfDNA FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=0 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID LEFT JOIN (select ClinicID,DatVisit,DNA from tblevmain where DNA=4 and (DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) evc on ev.ClinicID=evc.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=4 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) etCon on ev.ClinicID=etCon.ClinicID WHERE ev.DNA=0 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.Result=1 ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdPCRConbirth.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(10).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell576.Text = Val(XrTableCell576.Text) + 1
        '            Else
        '                XrTableCell577.Text = Val(XrTableCell577.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell571.Text = Val(XrTableCell571.Text) + 1
        '            Else
        '                XrTableCell572.Text = Val(XrTableCell572.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(11).ToString) = 4 Then
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell581.Text = Val(XrTableCell581.Text) + 1
        '                Else
        '                    XrTableCell582.Text = Val(XrTableCell582.Text) + 1
        '                End If
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'Get DNA all at birth, 4_6 weeks, 9m, OI.
        Dim CmdPCRAllStage As New MySqlCommand("select " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 0 and c.Result = 1, 1, null)) as m_po_B, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 0 and c.Result = 1, 1, null)) as f_po_B, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 0 and c.Result = 0, 1, null)) as m_ne_B, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 0 and c.Result = 0, 1, null)) as f_ne_B, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 0 and c.Result is null, 1, null)) as m_w_B, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 0 and c.Result is null, 1, null)) as f_w_B, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 1, 1, null)) as m_po_cB, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 1, 1, null)) as f_po_cB, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 0, 1, null)) as m_ne_cB, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 0, 1, null)) as f_ne_cB, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=0 and c.Result is null, 1, null)) as m_w_cB, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=0 and c.Result is null, 1, null)) as f_w_cB, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 1 and c.Result = 1, 1, null)) as m_po_46, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 1 and c.Result = 1, 1, null)) as f_po_46, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 1 and c.Result = 0, 1, null)) as m_ne_46, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 1 and c.Result = 0, 1, null)) as f_ne_46, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 1 and c.Result is null, 1, null)) as m_w_46, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 1 and c.Result is null, 1, null)) as f_w_46, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=1 and c.Result = 1, 1, null)) as m_po_c46, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=1 and c.Result = 1, 1, null)) as f_po_c46, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=1 and c.Result = 0, 1, null)) as m_ne_c46, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=1 and c.Result = 0, 1, null)) as f_ne_c46, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=1 and c.Result is null, 1, null)) as m_w_c46, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=1 and c.Result is null, 1, null)) as f_w_c46, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 5 and c.Result = 1, 1, null)) as m_po_9, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 5 and c.Result = 1, 1, null)) as f_po_9, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 5 and c.Result = 0, 1, null)) as m_ne_9, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 5 and c.Result = 0, 1, null)) as f_ne_9, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 5 and c.Result is null, 1, null)) as m_w_9, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 5 and c.Result is null, 1, null)) as f_w_9, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=5 and c.Result = 1, 1, null)) as m_po_c9, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=5 and c.Result = 1, 1, null)) as f_po_c9, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=5 and c.Result = 0, 1, null)) as m_ne_c9, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=5 and c.Result = 0, 1, null)) as f_ne_c9, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=5 and c.Result is null, 1, null)) as m_w_c9, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=5 and c.Result is null, 1, null)) as f_w_c9, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 3 and c.OI='True' and c.Result = 1, 1, null)) as m_po_oi, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 3 and c.OI='True' and c.Result = 1, 1, null)) as f_po_oi, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 3 and c.OI='True' and c.Result = 0, 1, null)) as m_ne_oi, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 3 and c.OI='True' and c.Result = 0, 1, null)) as f_ne_oi, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 3 and c.OI='True' and c.Result is null, 1, null)) as m_w_oi, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 3 and c.OI='True' and c.Result is null, 1, null)) as f_w_oi, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=3 and c.Con_OI='True' and c.Result = 1, 1, null)) as m_po_coi, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=3 and c.Con_OI='True' and c.Result = 1, 1, null)) as f_po_coi, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=3 and c.Con_OI='True' and c.Result = 0, 1, null)) as m_ne_coi, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=3 and c.Con_OI='True' and c.Result = 0, 1, null)) as f_ne_coi, " &
        " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=3 and c.Con_OI='True' and c.Result is null, 1, null)) as m_w_coi, " &
        " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=3 and c.Con_OI='True' and c.Result is null, 1, null)) as f_w_coi " &
        " from(select re.ClinicID, re.Sex, re.DNAPcr, re.OI, re.Result, re.DaRresult, re.DatTestArr, re.DaBlood, re.Con_At, re.Con_OI from( " &
        " Select n.ClinicID,ei.Sex,n.DNAPcr,n.OI,n.Result,n.DaRresult,n.DatTestArr,n.DaBlood,If(n.Rn=r.Rn + 1 And n.DNAPcr=4, r.DNAPcr, null) As Con_At, " &
        " If(n.Rn = r.Rn + 1 And n.DNAPcr = 4 And n.OI ='True', r.OI, null) as Con_OI " &
        " from(select distinct et.ClinicID, et.DNAPcr, et.OI, et.Result, et.DaRresult, et.DatTestArr, et.DaBlood, " &
        " (select count(*) + 1 from tbletest e where e.ClinicID=et.ClinicID And et.DaBlood>e.DaBlood order by e.ClinicID,e.DaBlood) as Rn " &
        " from(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        " From tbletest Order By ClinicID, DaBlood) et order by et.ClinicID, et.DaBlood) n " &
        " Left Join(select distinct et.ClinicID, et.DNAPcr, et.OI, et.Result, et.DaRresult, et.DatTestArr, et.DaBlood, " &
        " (select count(*) + 1 from tbletest e where e.ClinicID=et.ClinicID And et.DaBlood>e.DaBlood order by e.ClinicID, e.DaBlood) as Rn " &
        " from(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        " From tbletest Order By ClinicID, DaBlood) et order by et.ClinicID, et.DaBlood) r On n.ClinicID= r.ClinicID And n.Rn = r.Rn + 1 " &
        " inner Join tbleimain ei on n.ClinicID=ei.ClinicID where n.DatTestArr between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') re union " &
        " (select req.ClinicID, ei.Sex, req.DNA, req.OI, et.Result, et.DaRresult, et.DatTestArr, et.DaBlood,if(req.Rn=st.Rn+1 And req.DNA=4, st.DNA,null) Con_At, " &
        " If (req.Rn = st.Rn + 1 And req.DNA = 4 And req.OI ='True', st.OI,null) Con_OI " &
        " from(select ev.ClinicID, ev.DatVisit, ev.DNA, If(ev.OtherDNA ='OI','True','False') OI, " &
        " (select count(*) + 1 from tblevmain es where (es.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and es.DNA<>-1 and es.ClinicID=ev.ClinicID and es.DatVisit<ev.DatVisit order by es.ClinicID,es.DatVisit) as Rn " &
        " From tblevmain ev Where ev.DNA <> -1 And (ev.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') order by ev.ClinicID,ev.DatVisit) req " &
        " Left Join(select t.*, (select count(*) + 1 from tbletest es where (if(es.DaPcrArr='1900-01-01',es.DaRresult,es.DaPcrArr) between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and es.ClinicID=t.ClinicID and es.DaBlood<t.DaBlood order by es.ClinicID,es.DaBlood) as Rn " &
        " from(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        " From tbletest Order By ClinicID, DaBlood) t where (t.DatTestArr between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on req.ClinicID=et.ClinicID and req.DNA=et.DNAPcr and req.Rn=et.Rn " &
        " Left Join(select ev.ClinicID, ev.DatVisit, ev.DNA, If(ev.OtherDNA ='OI','True','False') OI, " &
        " (select count(*) + 1 from tblevmain es where (es.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and es.DNA<>-1 and es.ClinicID=ev.ClinicID and es.DatVisit<ev.DatVisit order by es.ClinicID,es.DatVisit) as Rn " &
        " From tblevmain ev Where ev.DNA <> -1 And (ev.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') order by ev.ClinicID,ev.DatVisit) st " &
        " On req.ClinicID=st.ClinicID And req.Rn=st.Rn+1 inner join tbleimain ei on req.ClinicID=ei.ClinicID where et.Result Is null order by req.ClinicID,req.DatVisit)) c;", Cnndb)
        Rdr = CmdPCRAllStage.ExecuteReader
        While Rdr.Read
            'DNA PCR Birth
            XrTableCell551.Text = Rdr.GetValue(0).ToString 'M+
            XrTableCell552.Text = Rdr.GetValue(1).ToString 'F+
            XrTableCell556.Text = Rdr.GetValue(2).ToString 'M-
            XrTableCell557.Text = Rdr.GetValue(3).ToString 'F-
            XrTableCell566.Text = Rdr.GetValue(4).ToString 'MW
            XrTableCell567.Text = Rdr.GetValue(5).ToString 'FW
            'Confirn DNA PCR Birth
            XrTableCell571.Text = Rdr.GetValue(6).ToString 'C_M+
            XrTableCell572.Text = Rdr.GetValue(7).ToString 'C_F+
            XrTableCell576.Text = Rdr.GetValue(8).ToString 'C_M-
            XrTableCell577.Text = Rdr.GetValue(9).ToString 'C_F-
            XrTableCell581.Text = Rdr.GetValue(10).ToString 'C_MW
            XrTableCell582.Text = Rdr.GetValue(11).ToString 'C_FW
            'DNA PCR at 4-6 Weeks
            XrTableCell591.Text = Rdr.GetValue(12).ToString 'M+
            XrTableCell592.Text = Rdr.GetValue(13).ToString 'F+
            XrTableCell596.Text = Rdr.GetValue(14).ToString 'M-
            XrTableCell597.Text = Rdr.GetValue(15).ToString 'F-
            XrTableCell601.Text = Rdr.GetValue(16).ToString 'MW
            XrTableCell602.Text = Rdr.GetValue(17).ToString 'FW
            'Confirn DNA PCR at 4-6 Weeks
            XrTableCell611.Text = Rdr.GetValue(18).ToString 'C_M+
            XrTableCell612.Text = Rdr.GetValue(19).ToString 'C_F+
            XrTableCell616.Text = Rdr.GetValue(20).ToString 'C_M-
            XrTableCell617.Text = Rdr.GetValue(21).ToString 'C_F-
            XrTableCell621.Text = Rdr.GetValue(22).ToString 'C_MW
            XrTableCell622.Text = Rdr.GetValue(23).ToString 'C_FW
            'DNA PCR at 9 months
            XrTableCell722.Text = Rdr.GetValue(24).ToString 'M+
            XrTableCell723.Text = Rdr.GetValue(25).ToString 'F+
            XrTableCell727.Text = Rdr.GetValue(26).ToString 'M-
            XrTableCell728.Text = Rdr.GetValue(27).ToString 'F-
            XrTableCell732.Text = Rdr.GetValue(28).ToString 'MW
            XrTableCell733.Text = Rdr.GetValue(29).ToString 'FW
            'Confirn DNA PCR at 9 months
            XrTableCell742.Text = Rdr.GetValue(30).ToString 'C_M+
            XrTableCell743.Text = Rdr.GetValue(31).ToString 'C_F+
            XrTableCell747.Text = Rdr.GetValue(32).ToString 'C_M-
            XrTableCell748.Text = Rdr.GetValue(33).ToString 'C_F-
            XrTableCell752.Text = Rdr.GetValue(34).ToString 'C_MW
            XrTableCell753.Text = Rdr.GetValue(35).ToString 'C_FW
            'DNA PCR at OI
            XrTableCell631.Text = Rdr.GetValue(36).ToString 'M+
            XrTableCell632.Text = Rdr.GetValue(37).ToString 'F+
            XrTableCell636.Text = Rdr.GetValue(38).ToString 'M-
            XrTableCell637.Text = Rdr.GetValue(39).ToString 'F-
            XrTableCell641.Text = Rdr.GetValue(40).ToString 'MW
            XrTableCell642.Text = Rdr.GetValue(41).ToString 'FW
            'Confirn DNA PCR at OI
            XrTableCell651.Text = Rdr.GetValue(42).ToString 'C_M+
            XrTableCell652.Text = Rdr.GetValue(43).ToString 'C_F+
            XrTableCell656.Text = Rdr.GetValue(44).ToString 'C_M-
            XrTableCell657.Text = Rdr.GetValue(45).ToString 'C_F-
            XrTableCell661.Text = Rdr.GetValue(46).ToString 'C_MW
            XrTableCell662.Text = Rdr.GetValue(47).ToString 'C_FW
        End While
        Rdr.Close()

        'DNA PCR and Confirm DNA PCR at birth 'Sithorn
        'Dim CmdPCRbirth As New MySqlCommand("select " &
        '   " COUNT(IF(c.Sex = 1 and c.DNAPcr = 0 and c.Result = 1, 1, null)) as m_pos, " &
        '   " COUNT(IF(c.Sex = 0 and c.DNAPcr = 0 and c.Result = 1, 1, null)) as f_pos, " &
        '   " COUNT(IF(c.Sex = 1 and c.DNAPcr = 0 and c.Result = 0, 1, null)) as m_neg, " &
        '   " COUNT(IF(c.Sex = 0 and c.DNAPcr = 0 and c.Result = 0, 1, null)) as f_neg, " &
        '   " COUNT(IF(c.Sex = 1 and c.DNAPcr = 0 and c.Result is null, 1, null)) as m_wait, " &
        '   " COUNT(IF(c.Sex = 0 and c.DNAPcr = 0 and c.Result is null, 1, null)) as f_wait, " &
        '   " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 1, 1, null)) as m_pos_c, " &
        '   " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 1, 1, null)) as f_pos_c, " &
        '   " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 0, 1, null)) as m_neg_c, " &
        '   " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=0 and c.Result = 0, 1, null)) as f_neg__c, " &
        '   " COUNT(IF(c.Sex = 1 and c.DNAPcr = 4 and c.Con_At=0 and c.Result is null, 1, null)) as m_wait_c, " &
        '   " COUNT(IF(c.Sex = 0 and c.DNAPcr = 4 and c.Con_At=0 and c.Result is null, 1, null)) as f_wait_c " &
        '   " from(select re.ClinicID,re.Sex,re.DNAPcr,re.OI,re.Result,re.DaRresult,re.DatTestArr,re.DaBlood,re.Con_At from( " &
        '   " select n.ClinicID,ei.Sex,n.DNAPcr,n.OI,n.Result,n.DaRresult,n.DatTestArr,n.DaBlood,if(n.Rn=r.Rn + 1 and n.DNAPcr=4, r.DNAPcr, null) as Con_At from( " &
        '   " select distinct et.ClinicID,et.DNAPcr,et.OI,et.Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '   " (select count(*) + 1 from tbletest e where e.ClinicID=et.ClinicID and et.DaBlood>e.DaBlood order by e.ClinicID,e.DaBlood) as Rn " &
        '   " from(select ClinicID,DNAPcr,OI,DaPcrArr,DaBlood,if(DaPcrArr='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '   " from tbletest order by ClinicID,DaBlood) et order by et.ClinicID,et.DaBlood) n " &
        '   " left join (select distinct et.ClinicID,et.DNAPcr,et.OI,et.Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '   " (select count(*) + 1 from tbletest e where e.ClinicID=et.ClinicID and et.DaBlood>e.DaBlood order by e.ClinicID,e.DaBlood) as Rn " &
        '   " from(select ClinicID,DNAPcr,OI,DaPcrArr,DaBlood,if(DaPcrArr='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '   " from tbletest order by ClinicID,DaBlood) et order by et.ClinicID,et.DaBlood) r on n.ClinicID=r.ClinicID and n.Rn=r.Rn+1 " &
        '   " inner join tbleimain ei on n.ClinicID=ei.ClinicID where n.DatTestArr between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') re union " &
        '   " (select req.ClinicID, ei.Sex, req.DNA, req.OI, et.Result, et.DaRresult, et.DatTestArr, et.DaBlood,if(req.Rn=st.Rn+1 and req.DNA=4, st.DNA,null) Con_At " &
        '   " from(select ev.ClinicID,ev.DatVisit,ev.DNA,if(ev.OtherDNA='OI','True','False') OI, " &
        '   " (select count(*) + 1 from tblevmain es where es.DNA<>-1 and es.ClinicID=ev.ClinicID and es.DatVisit<ev.DatVisit order by es.ClinicID,es.DatVisit) as Rn " &
        '   " from tblevmain ev where ev.DNA<>-1 and (DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') order by ev.ClinicID,ev.DatVisit) req " &
        '   " left join(select t.*, (select count(*) + 1 from tbletest es where es.ClinicID=t.ClinicID and es.DaBlood<t.DaBlood order by es.ClinicID,es.DaBlood) as Rn " &
        '   " from(select ClinicID,DNAPcr,OI,DaPcrArr,DaBlood,if(DaPcrArr='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '   " from tbletest order by ClinicID,DaBlood) t where (t.DatTestArr between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on req.ClinicID=et.ClinicID and req.DNA=et.DNAPcr and req.Rn=et.Rn " &
        '   " left join(select ev.ClinicID,ev.DatVisit,ev.DNA,if(ev.OtherDNA='OI','True','False') OI, " &
        '   " (select count(*) + 1 from tblevmain es where es.DNA<>-1 and es.ClinicID=ev.ClinicID and es.DatVisit<ev.DatVisit order by es.ClinicID,es.DatVisit) as Rn " &
        '   " from tblevmain ev where ev.DNA<>-1 and (DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') order by ev.ClinicID,ev.DatVisit) st " &
        '   " on req.ClinicID=st.ClinicID and req.Rn=st.Rn+1 inner join tbleimain ei on req.ClinicID=ei.ClinicID where et.Result is null order by req.ClinicID,req.DatVisit)) c;", Cnndb)
        'Rdr = CmdPCRbirth.ExecuteReader
        'While Rdr.Read
        '    'DNA PCR
        '    XrTableCell556.Text = Rdr.GetValue(2).ToString 'M-
        '    XrTableCell557.Text = Rdr.GetValue(3).ToString 'F-
        '    XrTableCell551.Text = Rdr.GetValue(0).ToString 'M+
        '    XrTableCell552.Text = Rdr.GetValue(1).ToString 'F+
        '    XrTableCell566.Text = Rdr.GetValue(4).ToString 'MW
        '    XrTableCell567.Text = Rdr.GetValue(5).ToString 'FW
        '    'Confirn DNA PCR
        '    XrTableCell576.Text = Rdr.GetValue(8).ToString 'C_M-
        '    XrTableCell577.Text = Rdr.GetValue(9).ToString 'C_F-
        '    XrTableCell571.Text = Rdr.GetValue(6).ToString 'C_M+
        '    XrTableCell572.Text = Rdr.GetValue(7).ToString 'C_F+
        '    XrTableCell581.Text = Rdr.GetValue(10).ToString 'C_MW
        '    XrTableCell582.Text = Rdr.GetValue(11).ToString 'C_FW
        'End While
        'Rdr.Close()

        'DNA PCR betwween 4 to 6 week 'Sithorn
        'Dim CmdPCR46 As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=1 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID WHERE ev.DNA=1 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdPCR46.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(7).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell596.Text = Val(XrTableCell596.Text) + 1
        '            Else
        '                XrTableCell597.Text = Val(XrTableCell597.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell591.Text = Val(XrTableCell591.Text) + 1
        '            Else
        '                XrTableCell592.Text = Val(XrTableCell592.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell601.Text = Val(XrTableCell601.Text) + 1
        '            Else
        '                XrTableCell602.Text = Val(XrTableCell602.Text) + 1
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        ''DNA PCR Confirn between 4 to 6 'Sithorn
        'Dim CmdPCRCon46 As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result,etCon.DaPcrArr,etCon.DNAPcr,coalesce(etCon.Result,-1) as ConfResult,coalesce(evc.DNA,-1) as ConfDNA FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=1 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID LEFT JOIN (select ClinicID,DatVisit,DNA from tblevmain where DNA=4 and (DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) evc on ev.ClinicID=evc.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=4 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) etCon on ev.ClinicID=etCon.ClinicID WHERE ev.DNA=1 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.Result=1 ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdPCRCon46.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(10).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell616.Text = Val(XrTableCell616.Text) + 1
        '            Else
        '                XrTableCell617.Text = Val(XrTableCell617.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell611.Text = Val(XrTableCell611.Text) + 1
        '            Else
        '                XrTableCell612.Text = Val(XrTableCell612.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(11).ToString) = 4 Then
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell621.Text = Val(XrTableCell621.Text) + 1
        '                Else
        '                    XrTableCell622.Text = Val(XrTableCell622.Text) + 1
        '                End If
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'DNA PCR and Confirm DNA PCR at 4-6 Weeks 'Sithorn
        'Dim CmdPCR46w As New MySqlCommand("select " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 1 And c.Result = 1, 1, null)) As m_pos, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 1 And c.Result = 1, 1, null)) As f_pos, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 1 And c.Result = 0, 1, null)) As m_neg, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 1 And c.Result = 0, 1, null)) As f_neg, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 1 And c.Result = -1, 1, null)) As m_wait, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 1 And c.Result = -1, 1, null)) As f_wait, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = 1 And (c.DNAPositive = 1 Or c.DNAConSameDay = 1), 1, null)) As m_pos_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = 1 And (c.DNAPositive = 1 Or c.DNAConSameDay = 1), 1, null)) As f_pos_c, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = 0 And (c.DNAPositive = 1 Or c.DNAConSameDay = 1), 1, null)) As m_neg_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = 0 And (c.DNAPositive = 1 Or c.DNAConSameDay = 1), 1, null)) As f_neg_c, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = -1 And (c.DNAPositive = 1 Or c.DNAConSameDay = 1), 1, null)) As m_wait_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = -1 And (c.DNAPositive = 1 Or c.DNAConSameDay = 1), 1, null)) As f_wait_c  " &
        '" from(select res.ClinicID, Res.Sex, Res.DNAPcr, Res.OI, coalesce(Res.Result, -1) Result, Res.DaRresult, Res.DatTestArr, Res.DaBlood, Res.DNAPositive, Res.OIPositive, Res.DaPositive, Res.DNAConSameDay from " &
        '" (select et.ClinicID,ei.Sex,et.DNAPcr,et.OI,coalesce(et.Result,-1) Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '" coalesce(case when et.DNAPcr=4 then (select t.DNAPcr from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) Else null End,-1) DNAPositive, " &
        '" Case when et.DNAPcr=4 then (select t.OI from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) else null end OIPositive, " &
        '" Case when et.DNAPcr=4 then (select t.DaBlood from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) else null end DaPositive, " &
        '" coalesce(case when et.DNAPcr=4 then (select t.DNAPcr from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) Else null End,-1) DNAConSameDay " &
        '" from(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '" From tbletest Order By ClinicID, DaBlood) et inner join tbleimain ei On et.ClinicID=ei.ClinicID " &
        '" where(et.DatTestArr between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') " &
        '" order by et.ClinicID, et.DaRresult) res union (Select ev.ClinicID,ei.Sex,ev.DNA,If(ev.OtherDNA='OI','True','False') OI,coalesce(et.Result,-1) Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '" coalesce(case when ev.DNA=4 then (select t.DNAPcr from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) Else null End,-1) DNAPositive, " &
        '" Case when ev.DNA=4 then (select t.OI from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) else null end OIPositive, " &
        '" Case when ev.DNA=4 then (select t.DaBlood from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) else null end DaPositive, " &
        '" coalesce(case when ev.DNA=4 then (select t.DNAPcr from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) Else null End,-1) DNAConSameDay " &
        '" From tblevmain ev inner Join tbleimain ei on ev.ClinicID=ei.ClinicID " &
        '" Left Join(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '" From tbletest Order By ClinicID, DaBlood) et on ev.ClinicID=et.ClinicID And ev.DatVisit=et.DaBlood And ev.DNA=et.DNAPcr " &
        '" where(ev.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.DNAPcr is null " &
        '" order by ev.ClinicID, ev.DatVisit) order by clinicid,DatTestArr) c;", Cnndb)
        'Rdr = CmdPCR46w.ExecuteReader
        'While Rdr.Read
        '    'DNA PCR at 4-6 Weeks
        '    XrTableCell596.Text = Rdr.GetValue(2).ToString 'M-
        '    XrTableCell597.Text = Rdr.GetValue(3).ToString 'F-
        '    XrTableCell591.Text = Rdr.GetValue(0).ToString 'M+
        '    XrTableCell592.Text = Rdr.GetValue(1).ToString 'F+
        '    XrTableCell601.Text = Rdr.GetValue(4).ToString 'MW
        '    XrTableCell602.Text = Rdr.GetValue(5).ToString 'FW
        '    'Confirn DNA PCR at 4-6 Weeks
        '    XrTableCell616.Text = Rdr.GetValue(8).ToString 'C_M-
        '    XrTableCell617.Text = Rdr.GetValue(9).ToString 'C_F-
        '    XrTableCell611.Text = Rdr.GetValue(6).ToString 'C_M+
        '    XrTableCell612.Text = Rdr.GetValue(7).ToString 'C_F+
        '    XrTableCell621.Text = Rdr.GetValue(10).ToString 'C_MW
        '    XrTableCell622.Text = Rdr.GetValue(11).ToString 'C_FW
        'End While
        'Rdr.Close()

        'DNA PCR 3 months after stopping breathfeeding 'Sithorn
        'Dim CmdPCR3m As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=2 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID WHERE ev.DNA=2 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdPCR3m.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(7).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell707.Text = Val(XrTableCell707.Text) + 1
        '            Else
        '                XrTableCell708.Text = Val(XrTableCell708.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell681.Text = Val(XrTableCell681.Text) + 1
        '            Else
        '                XrTableCell691.Text = Val(XrTableCell691.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell712.Text = Val(XrTableCell712.Text) + 1
        '            Else
        '                XrTableCell713.Text = Val(XrTableCell713.Text) + 1
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'DNA PCR Confirn 3 months after stopping breathfeeding 'Sithorn
        'Dim CmdPCRCon3m As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result,etCon.DaPcrArr,etCon.DNAPcr,coalesce(etCon.Result,-1) as ConfResult,coalesce(evc.DNA,-1) as ConfDNA FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=2 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID LEFT JOIN (select ClinicID,DatVisit,DNA from tblevmain where DNA=4 and (DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) evc on ev.ClinicID=evc.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=4 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) etCon on ev.ClinicID=etCon.ClinicID WHERE ev.DNA=2 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.Result=1 ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdPCRCon3m.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(10).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell532.Text = Val(XrTableCell532.Text) + 1
        '            Else
        '                XrTableCell533.Text = Val(XrTableCell533.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell505.Text = Val(XrTableCell505.Text) + 1
        '            Else
        '                XrTableCell520.Text = Val(XrTableCell520.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(11).ToString) = 4 Then
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell539.Text = Val(XrTableCell539.Text) + 1
        '                Else
        '                    XrTableCell540.Text = Val(XrTableCell540.Text) + 1
        '                End If
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'DNA PCR 9 months 'Sithorn
        'Dim CmdPCR9m As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=5 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID WHERE ev.DNA=5 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdPCR9m.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(7).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell727.Text = Val(XrTableCell727.Text) + 1
        '            Else
        '                XrTableCell728.Text = Val(XrTableCell728.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell722.Text = Val(XrTableCell722.Text) + 1
        '            Else
        '                XrTableCell723.Text = Val(XrTableCell723.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell732.Text = Val(XrTableCell732.Text) + 1
        '            Else
        '                XrTableCell733.Text = Val(XrTableCell733.Text) + 1
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        ''DNA PCR Confirn 9 months 'Sithorn
        'Dim CmdPCRCon9m As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result,etCon.DaPcrArr,etCon.DNAPcr,coalesce(etCon.Result,-1) as ConfResult,coalesce(evc.DNA,-1) as ConfDNA FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=5 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID LEFT JOIN (select ClinicID,DatVisit,DNA from tblevmain where DNA=4 and (DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) evc on ev.ClinicID=evc.ClinicID LEFT JOIN(select * from tbletest where DNAPcr=4 and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) etCon on ev.ClinicID=etCon.ClinicID WHERE ev.DNA=5 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.Result=1 ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdPCRCon9m.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(10).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell747.Text = Val(XrTableCell747.Text) + 1
        '            Else
        '                XrTableCell748.Text = Val(XrTableCell748.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell742.Text = Val(XrTableCell742.Text) + 1
        '            Else
        '                XrTableCell743.Text = Val(XrTableCell743.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(11).ToString) = 4 Then
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell752.Text = Val(XrTableCell752.Text) + 1
        '                Else
        '                    XrTableCell753.Text = Val(XrTableCell753.Text) + 1
        '                End If
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'DNA PCR and Confirm DNA PCR at 9 months 'Sithorn
        'Dim CmdPCR9m As New MySqlCommand("select " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 5 And c.Result = 1, 1, null)) As m_pos, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 5 And c.Result = 1, 1, null)) As f_pos, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 5 And c.Result = 0, 1, null)) As m_neg, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 5 And c.Result = 0, 1, null)) As f_neg, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 5 And c.Result = -1, 1, null)) As m_wait, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 5 And c.Result = -1, 1, null)) As f_wait, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = 1 And (c.DNAPositive = 5 Or c.DNAConSameDay = 5), 1, null)) As m_pos_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = 1 And (c.DNAPositive = 5 Or c.DNAConSameDay = 5), 1, null)) As f_pos_c, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = 0 And (c.DNAPositive = 5 Or c.DNAConSameDay = 5), 1, null)) As m_neg_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = 0 And (c.DNAPositive = 5 Or c.DNAConSameDay = 5), 1, null)) As f_neg_c, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = -1 And (c.DNAPositive = 5 Or c.DNAConSameDay = 5), 1, null)) As m_wait_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = -1 And (c.DNAPositive = 5 Or c.DNAConSameDay = 5), 1, null)) As f_wait_c  " &
        '" from(select res.ClinicID, Res.Sex, Res.DNAPcr, Res.OI, coalesce(Res.Result, -1) Result, Res.DaRresult, Res.DatTestArr, Res.DaBlood, Res.DNAPositive, Res.OIPositive, Res.DaPositive, Res.DNAConSameDay from " &
        '" (select et.ClinicID,ei.Sex,et.DNAPcr,et.OI,coalesce(et.Result,-1) Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '" coalesce(case when et.DNAPcr=4 then (select t.DNAPcr from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) Else null End,-1) DNAPositive, " &
        '" Case when et.DNAPcr=4 then (select t.OI from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) else null end OIPositive, " &
        '" Case when et.DNAPcr=4 then (select t.DaBlood from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) else null end DaPositive, " &
        '" coalesce(case when et.DNAPcr=4 then (select t.DNAPcr from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) Else null End,-1) DNAConSameDay " &
        '" from(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '" From tbletest Order By ClinicID, DaBlood) et inner join tbleimain ei On et.ClinicID=ei.ClinicID " &
        '" where(et.DatTestArr between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') " &
        '" order by et.ClinicID, et.DaRresult) res union (Select ev.ClinicID,ei.Sex,ev.DNA,If(ev.OtherDNA='OI','True','False') OI,coalesce(et.Result,-1) Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '" coalesce(case when ev.DNA=4 then (select t.DNAPcr from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) Else null End,-1) DNAPositive, " &
        '" Case when ev.DNA=4 then (select t.OI from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) else null end OIPositive, " &
        '" Case when ev.DNA=4 then (select t.DaBlood from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) else null end DaPositive, " &
        '" coalesce(case when ev.DNA=4 then (select t.DNAPcr from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) Else null End,-1) DNAConSameDay " &
        '" From tblevmain ev inner Join tbleimain ei on ev.ClinicID=ei.ClinicID " &
        '" Left Join(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '" From tbletest Order By ClinicID, DaBlood) et on ev.ClinicID=et.ClinicID And ev.DatVisit=et.DaBlood And ev.DNA=et.DNAPcr " &
        '" where(ev.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.DNAPcr is null " &
        '" order by ev.ClinicID, ev.DatVisit) order by clinicid,DatTestArr) c;", Cnndb)
        'Rdr = CmdPCR9m.ExecuteReader
        'While Rdr.Read
        '    'DNA PCR at 9 months
        '    XrTableCell727.Text = Rdr.GetValue(2).ToString 'M-
        '    XrTableCell728.Text = Rdr.GetValue(3).ToString 'F-
        '    XrTableCell722.Text = Rdr.GetValue(0).ToString 'M+
        '    XrTableCell723.Text = Rdr.GetValue(1).ToString 'F+
        '    XrTableCell732.Text = Rdr.GetValue(4).ToString 'MW
        '    XrTableCell733.Text = Rdr.GetValue(5).ToString 'FW
        '    'Confirn DNA PCR at 9 months
        '    XrTableCell747.Text = Rdr.GetValue(8).ToString 'C_M-
        '    XrTableCell748.Text = Rdr.GetValue(9).ToString 'C_F-
        '    XrTableCell742.Text = Rdr.GetValue(6).ToString 'C_M+
        '    XrTableCell743.Text = Rdr.GetValue(7).ToString 'C_F+
        '    XrTableCell752.Text = Rdr.GetValue(10).ToString 'C_MW
        '    XrTableCell753.Text = Rdr.GetValue(11).ToString 'C_FW
        'End While
        'Rdr.Close()

        'b Phanna.........................................................
        ' DNA PCR and result 
        'Dim id As String
        'Dim i As Integer
        'Dim CmdPCR1 As New MySqlCommand("SELECT tblEImain.ClinicID,  tblEImain.DaBirth,  tblEImain.Sex,  tblEVmain.DatVisit,  tblETest.PCR, tblETest.Result,  tblEVmain.VID FROM    tblEVmain INNER JOIN  tblEImain ON  tblEVmain.ClinicID =  tblEImain.ClinicID INNER JOIN tblETest ON  tblEImain.ClinicID =  tblETest.ClinicID AND  tblEVmain.TestID =  tblETest.TID WHERE     ( tblETest.PCR = 'True') AND (tblETest.DaBlood BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY tblEImain.ClinicID, tblEVmain.DatVisit ", Cnndb)
        'Rdr = CmdPCR1.ExecuteReader
        'While Rdr.Read
        '    i = i + 1
        '    If id <> Rdr.GetValue(0).ToString.Trim Then
        '        id = Rdr.GetValue(0).ToString
        '        i = 1
        '        If DateDiff(DateInterval.Month, CDate(Rdr.GetValue(1).ToString), CDate(Rdr.GetValue(3).ToString)) <= 2 Then
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                xLPm2.Text = Val(xLPm2.Text) + 1
        '            Else
        '                xLPf2.Text = Val(xLPf2.Text) + 1
        '            End If
        '        Else
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                'xGPm2.Text = Val(xGPm2.Text) + 1
        '            Else
        '                'xGPf2.Text = Val(xGPf2.Text) + 1
        '            End If
        '        End If
        '        Select Case CDec(Rdr.GetValue(5).ToString)
        '            Case 0
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell556.Text = Val(XrTableCell556.Text) + 1
        '                Else
        '                    XrTableCell557.Text = Val(XrTableCell557.Text) + 1
        '                End If
        '            Case 1
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell551.Text = Val(XrTableCell551.Text) + 1
        '                Else
        '                    XrTableCell552.Text = Val(XrTableCell552.Text) + 1
        '                End If
        '                Dim CmdConf As New MySqlCommand("SELECT tblEImain.ClinicID,  tblEImain.DaBirth,  tblEImain.Sex,  tblEVmain.DatVisit,  tblETest.ConfirmPCR, tblETest.Result,  tblEVmain.VID FROM    tblEVmain INNER JOIN  tblEImain ON  tblEVmain.ClinicID =  tblEImain.ClinicID INNER JOIN tblETest ON  tblEImain.ClinicID =  tblETest.ClinicID AND  tblEVmain.TestID =  tblETest.TID WHERE  tblEImain.ClinicID='" & Rdr.GetValue(0).ToString & "' and   ( tblETest.ConfirmPCR = 'True') AND (tblETest.DaBlood BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY tblEImain.ClinicID, tblEVmain.DatVisit", dbtem)
        '                Rdr1 = CmdConf.ExecuteReader
        '                While Rdr1.Read
        '                    Select Case CDec(Rdr1.GetValue(5).ToString)
        '                        Case 0
        '                            If CDec(Rdr1.GetValue(2).ToString) = 1 Then
        '                                XrTableCell576.Text = Val(XrTableCell576.Text) + 1
        '                            Else
        '                                XrTableCell577.Text = Val(XrTableCell577.Text) + 1
        '                            End If
        '                        Case 1
        '                            If CDec(Rdr1.GetValue(2).ToString) = 1 Then
        '                                XrTableCell571.Text = Val(XrTableCell571.Text) + 1
        '                            Else
        '                                XrTableCell572.Text = Val(XrTableCell572.Text) + 1
        '                            End If
        '                        Case -1
        '                            If CDec(Rdr1.GetValue(2).ToString) = 1 Then
        '                                XrTableCell581.Text = Val(XrTableCell581.Text) + 1
        '                            Else
        '                                XrTableCell582.Text = Val(XrTableCell582.Text) + 1
        '                            End If
        '                    End Select
        '                End While
        '                Rdr1.Close()
        '            Case -1
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell566.Text = Val(XrTableCell566.Text) + 1
        '                Else
        '                    XrTableCell567.Text = Val(XrTableCell567.Text) + 1
        '                End If
        '        End Select
        '    ElseIf id = Rdr.GetValue(0).ToString.Trim And i >= 2 Then
        '        Select Case CDec(Rdr.GetValue(5).ToString)
        '            Case 0
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell596.Text = Val(XrTableCell596.Text) + 1
        '                Else
        '                    XrTableCell597.Text = Val(XrTableCell597.Text) + 1
        '                End If
        '            Case 1
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell591.Text = Val(XrTableCell591.Text) + 1
        '                Else
        '                    XrTableCell592.Text = Val(XrTableCell592.Text) + 1
        '                End If
        '                Dim CmdConf As New MySqlCommand("SELECT tblEImain.ClinicID,  tblEImain.DaBirth,  tblEImain.Sex,  tblEVmain.DatVisit,  tblETest.ConfirmPCR, tblETest.Result,  tblEVmain.VID FROM    tblEVmain INNER JOIN  tblEImain ON  tblEVmain.ClinicID =  tblEImain.ClinicID INNER JOIN tblETest ON  tblEImain.ClinicID =  tblETest.ClinicID AND  tblEVmain.TestID =  tblETest.TID WHERE  tblEImain.ClinicID='" & Rdr.GetValue(0).ToString & "' and   ( tblETest.ConfirmPCR = 'True') AND (tblETest.DaBlood BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY  tblEVmain.DatVisit Desc", dbtem)
        '                Rdr1 = CmdConf.ExecuteReader
        '                While Rdr1.Read
        '                    Select Case CDec(Rdr1.GetValue(5).ToString)
        '                        Case 0
        '                            If CDec(Rdr1.GetValue(2).ToString) = 1 Then
        '                                XrTableCell616.Text = Val(XrTableCell616.Text) + 1
        '                            Else
        '                                XrTableCell617.Text = Val(XrTableCell617.Text) + 1
        '                            End If
        '                        Case 1
        '                            If CDec(Rdr1.GetValue(2).ToString) = 1 Then
        '                                XrTableCell611.Text = Val(XrTableCell611.Text) + 1
        '                            Else
        '                                XrTableCell612.Text = Val(XrTableCell612.Text) + 1
        '                            End If
        '                        Case -1
        '                            If CDec(Rdr1.GetValue(2).ToString) = 1 Then
        '                                XrTableCell621.Text = Val(XrTableCell621.Text) + 1
        '                            Else
        '                                XrTableCell622.Text = Val(XrTableCell622.Text) + 1
        '                            End If
        '                    End Select
        '                End While
        '                Rdr1.Close()
        '            Case -1
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell601.Text = Val(XrTableCell601.Text) + 1
        '                Else
        '                    XrTableCell602.Text = Val(XrTableCell602.Text) + 1
        '                End If
        '        End Select
        '    End If
        'End While
        'Rdr.Close()
        '............................................................

        ' OI Test
        'Dim CmdOI As New MySqlCommand("SELECT tblEImain.ClinicID,  tblEImain.DaBirth,  tblEImain.Sex,  tblEVmain.DatVisit,  tblETest.OI, tblETest.Result,  tblEVmain.VID FROM    tblEVmain INNER JOIN  tblEImain ON  tblEVmain.ClinicID =  tblEImain.ClinicID INNER JOIN tblETest ON  tblEImain.ClinicID =  tblETest.ClinicID AND  tblEVmain.TestID =  tblETest.TID WHERE     ( tblETest.OI = 'True') AND (tblETest.DaBlood BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY tblEImain.ClinicID, tblEVmain.DatVisit ", Cnndb)
        'Rdr = CmdOI.ExecuteReader 'B Phana
        'Dim CmdOI As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,et.OI,coalesce(et.Result,-1) as Result FROM tblEVmain ev INNER JOIN tblEImain ei ON  ev.ClinicID =  ei.ClinicID LEFT JOIN(select * from tblETest where (DNAPcr=3 and OI = 'True') AND (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et ON  ev.ClinicID =  et.ClinicID WHERE ev.DNA=3 and (ev.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdOI.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(8).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell636.Text = Val(XrTableCell636.Text) + 1
        '            Else
        '                XrTableCell637.Text = Val(XrTableCell637.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell631.Text = Val(XrTableCell631.Text) + 1
        '            Else
        '                XrTableCell632.Text = Val(XrTableCell632.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell641.Text = Val(XrTableCell641.Text) + 1
        '            Else
        '                XrTableCell642.Text = Val(XrTableCell642.Text) + 1
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'OI Confirm
        'Dim CmdOC As New MySqlCommand("SELECT tblEImain.ClinicID,  tblEImain.DaBirth,  tblEImain.Sex,  tblEVmain.DatVisit,  tblETest.TestConfirm, tblETest.Result,  tblEVmain.VID FROM    tblEVmain INNER JOIN  tblEImain ON  tblEVmain.ClinicID =  tblEImain.ClinicID INNER JOIN tblETest ON  tblEImain.ClinicID =  tblETest.ClinicID AND  tblEVmain.TestID =  tblETest.TID WHERE     ( tblETest.TestConfirm = 'True') AND (tblETest.DaBlood BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') ORDER BY tblEImain.ClinicID, tblEVmain.DatVisit ", Cnndb)
        'Rdr = CmdOC.ExecuteReader 'B Phanan
        'Dim CmdOC As New MySqlCommand("SELECT ei.ClinicID,ei.DaBirth,ei.Sex,ev.DatVisit,ev.DNA,et.DaPcrArr,et.DNAPcr,coalesce(et.Result,-1) as Result,etCon.DaPcrArr,etCon.DNAPcr,coalesce(etCon.Result,-1) as ConfResult,coalesce(evc.DNA,-1) as ConfDNA FROM tblEVmain ev INNER JOIN tblEImain ei ON ev.ClinicID = ei.ClinicID LEFT JOIN(select * from tbletest where (DNAPcr=3 and OI = 'True') AND (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) et on ev.ClinicID=et.ClinicID LEFT JOIN (select ClinicID,DatVisit,DNA from tblevmain where DNA=4 and (DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) evc on ev.ClinicID=evc.ClinicID LEFT JOIN(select * from tbletest where (DNAPcr=4 and OI = 'True') and (DaPcrArr BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "')) etCon on ev.ClinicID=etCon.ClinicID WHERE ev.DNA=4 and (ev.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.Result=1 ORDER BY ei.ClinicID, ev.DatVisit;", Cnndb)
        'Rdr = CmdOC.ExecuteReader
        'While Rdr.Read
        '    Select Case CDec(Rdr.GetValue(10).ToString)
        '        Case 0
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell656.Text = Val(XrTableCell656.Text) + 1
        '            Else
        '                XrTableCell657.Text = Val(XrTableCell657.Text) + 1
        '            End If
        '        Case 1
        '            If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                XrTableCell651.Text = Val(XrTableCell651.Text) + 1
        '            Else
        '                XrTableCell652.Text = Val(XrTableCell652.Text) + 1
        '            End If
        '        Case -1
        '            If CDec(Rdr.GetValue(11).ToString) = 4 Then
        '                If CDec(Rdr.GetValue(2).ToString) = 1 Then
        '                    XrTableCell661.Text = Val(XrTableCell661.Text) + 1
        '                Else
        '                    XrTableCell662.Text = Val(XrTableCell662.Text) + 1
        '                End If
        '            End If
        '    End Select
        'End While
        'Rdr.Close()

        'DNA PCR and Confirm DNA PCR at OI 'Sithorn
        'Dim CmdPCROI As New MySqlCommand("select " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 3 And c.OI ='True' and c.Result = 1, 1, null)) as m_pos, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 3 And c.OI ='True' and c.Result = 1, 1, null)) as f_pos, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 3 And c.OI ='True' and c.Result = 0, 1, null)) as m_neg, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 3 And c.OI ='True' and c.Result = 0, 1, null)) as f_neg, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 3 And c.OI ='True' and c.Result = -1, 1, null)) as m_wait, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 3 And c.OI ='True' and c.Result = -1, 1, null)) as f_wait, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = 1 And ((c.DNAPositive = 3 And c.OIPositive ='True') or (c.DNAConSameDay=3 and c.OIConSameDay='True')), 1, null)) as m_pos_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = 1 And ((c.DNAPositive = 3 And c.OIPositive ='True') or (c.DNAConSameDay=3 and c.OIConSameDay='True')), 1, null)) as f_pos_c, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = 0 And ((c.DNAPositive = 3 And c.OIPositive ='True') or (c.DNAConSameDay=3 and c.OIConSameDay='True')), 1, null)) as m_neg_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = 0 And ((c.DNAPositive = 3 And c.OIPositive ='True') or (c.DNAConSameDay=3 and c.OIConSameDay='True')), 1, null)) as f_neg__c, " &
        '" COUNT(If(c.Sex = 1 And c.DNAPcr = 4 And c.Result = -1 And ((c.DNAPositive = 3 And c.OIPositive ='True') or (c.DNAConSameDay=3 and c.OIConSameDay='True')), 1, null)) as m_wait_c, " &
        '" COUNT(If(c.Sex = 0 And c.DNAPcr = 4 And c.Result = -1 And ((c.DNAPositive = 3 And c.OIPositive ='True') or (c.DNAConSameDay=3 and c.OIConSameDay='True')), 1, null)) as f_wait_c  " &
        '" from(select res.ClinicID, Res.Sex, Res.DNAPcr, Res.OI, coalesce(Res.Result, -1) Result, Res.DaRresult, Res.DatTestArr, Res.DaBlood, Res.DNAPositive, Res.OIPositive, Res.DaPositive, Res.DNAConSameDay, Res.OIConSameDay from " &
        '" (select et.ClinicID,ei.Sex,et.DNAPcr,et.OI,coalesce(et.Result,-1) Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '" coalesce(case when et.DNAPcr=4 then (select t.DNAPcr from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) Else null End,-1) DNAPositive, " &
        '" Case when et.DNAPcr=4 then (select t.OI from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) else null end OIPositive, " &
        '" Case when et.DNAPcr=4 then (select t.DaBlood from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood<et.DaBlood limit 1) else null end DaPositive, " &
        '" coalesce(case when et.DNAPcr=4 then (select t.DNAPcr from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) Else null End,-1) DNAConSameDay, " &
        '" Case when et.DNAPcr=4 then (select t.OI from tbletest t where t.Result=1 And et.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) else null end OIConSameDay " &
        '" from(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '" From tbletest Order By ClinicID, DaBlood) et inner join tbleimain ei On et.ClinicID= ei.ClinicID " &
        '" where(et.DatTestArr between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') " &
        '" order by et.ClinicID, et.DaRresult) res union (select ev.ClinicID,ei.Sex,ev.DNA,if(ev.OtherDNA='OI','True','False') OI,coalesce(et.Result,-1) Result,et.DaRresult,et.DatTestArr,et.DaBlood, " &
        '" coalesce(case when ev.DNA=4 then (select t.DNAPcr from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) Else null End,-1) DNAPositive, " &
        '" Case when ev.DNA=4 then (select t.OI from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) else null end OIPositive, " &
        '" Case when ev.DNA=4 then (select t.DaBlood from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood<ev.DatVisit limit 1) else null end DaPositive, " &
        '" coalesce(case when ev.DNA=4 then (select t.DNAPcr from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) Else null End,-1) DNAConSameDay, " &
        '" Case when ev.DNA=4 then (select t.OI from tbletest t where t.Result=1 And ev.ClinicID=t.ClinicID And t.DaBlood=et.DaBlood And t.DNAPcr<>4 limit 1) else null end OIConSameDay " &
        '" From tblevmain ev inner Join tbleimain ei on ev.ClinicID=ei.ClinicID " &
        '" Left Join(select ClinicID, DNAPcr, OI, DaPcrArr, DaBlood, If(DaPcrArr ='1900-01-01',DaRresult,DaPcrArr) as DatTestArr,Result,DaRresult " &
        '" From tbletest Order By ClinicID, DaBlood) et On ev.ClinicID=et.ClinicID And ev.DatVisit=et.DaBlood And ev.DNA=et.DNAPcr " &
        '" where(ev.DatVisit between '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "') and et.DNAPcr is null " &
        '" order by ev.ClinicID, ev.DatVisit) order by clinicid,DatTestArr) c;", Cnndb)
        'Rdr = CmdPCROI.ExecuteReader
        'While Rdr.Read
        '    'DNA PCR at OI
        '    XrTableCell636.Text = Rdr.GetValue(2).ToString 'M-
        '    XrTableCell637.Text = Rdr.GetValue(3).ToString 'F-
        '    XrTableCell631.Text = Rdr.GetValue(0).ToString 'M+
        '    XrTableCell632.Text = Rdr.GetValue(1).ToString 'F+
        '    XrTableCell641.Text = Rdr.GetValue(4).ToString 'MW
        '    XrTableCell642.Text = Rdr.GetValue(5).ToString 'FW
        '    'Confirn DNA PCR at OI
        '    XrTableCell656.Text = Rdr.GetValue(8).ToString 'C_M-
        '    XrTableCell657.Text = Rdr.GetValue(9).ToString 'C_F-
        '    XrTableCell651.Text = Rdr.GetValue(6).ToString 'C_M+
        '    XrTableCell652.Text = Rdr.GetValue(7).ToString 'C_F+
        '    XrTableCell661.Text = Rdr.GetValue(10).ToString 'C_MW
        '    XrTableCell662.Text = Rdr.GetValue(11).ToString 'C_FW
        'End While
        'Rdr.Close()

        'Antibody Test sithorn
        Dim CmdAntibodytest As New MySqlCommand("SELECT tblEImain.ClinicID,tblEImain.DaBirth,tblEImain.Sex,tblEVmain.DatVisit,tblEVmain.Antibody,tblEVmain.DaAntibody FROM tblEVmain INNER JOIN tblEImain ON tblEVmain.ClinicID = tblEImain.ClinicID  WHERE tblEVmain.DatVisit BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "' ORDER BY tblEImain.ClinicID, tblEVmain.DatVisit;", Cnndb)
        Rdr = CmdAntibodytest.ExecuteReader
        While Rdr.Read
            Select Case CDec(Rdr.GetValue(4).ToString)
                Case 0
                    If CDec(Rdr.GetValue(2).ToString) = 1 Then
                        XrTableCell762.Text = Val(XrTableCell762.Text) + 1
                    Else
                        XrTableCell763.Text = Val(XrTableCell763.Text) + 1
                    End If
                Case 1
                    If CDec(Rdr.GetValue(2).ToString) = 1 Then
                        XrTableCell767.Text = Val(XrTableCell767.Text) + 1
                    Else
                        XrTableCell768.Text = Val(XrTableCell768.Text) + 1
                    End If
            End Select
        End While
        Rdr.Close()
        ' outcome ex
        Dim Cmdout As New MySqlCommand("SELECT     tblEImain.ClinicID, tblEImain.Sex, tblevpatientstatus.Status, tblevpatientstatus.DaStatus FROM         tblEImain INNER JOIN tblevpatientstatus ON tblEImain.ClinicID = tblevpatientstatus.ClinicID WHERE     tblevpatientstatus.DaStatus BETWEEN '" & Format(Sdate, "yyyy/MM/dd") & "' AND '" & Format(Edate, "yyyy/MM/dd") & "'", Cnndb)
        Rdr = Cmdout.ExecuteReader
        While Rdr.Read
            If CDec(Rdr.GetValue(1).ToString) = 0 Then
                Select Case CDec(Rdr.GetValue(2).ToString)
                    Case 0, 1
                        xPF.Text = Val(xPF.Text) + 1
                    Case 2
                        XrTableCell682.Text = Val(XrTableCell682.Text) + 1
                    Case 3
                        XrTableCell672.Text = Val(XrTableCell672.Text) + 1
                    Case 4
                        XrTableCell677.Text = Val(XrTableCell677.Text) + 1
                End Select
            Else
                Select Case CDec(Rdr.GetValue(2).ToString)
                    Case 0, 1
                        xPm.Text = Val(xPm.Text) + 1
                    Case 2
                        xNm.Text = Val(xNm.Text) + 1
                    Case 3
                        XrTableCell671.Text = Val(XrTableCell671.Text) + 1
                    Case 4
                        XrTableCell676.Text = Val(XrTableCell676.Text) + 1
                End Select
            End If
        End While
        Rdr.Close()
    End Sub

    Private Sub XrSubreport1_BeforePrint(sender As Object, e As PrintEventArgs) Handles XrSubreport1.BeforePrint

    End Sub
End Class