Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class Transferout
    Dim Rdr As MySqlDataReader
    Private Sub Transferout_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        If frmTransferOutReport.Id = "" Then Exit Sub
        Dim Vid As Double
        lblClinicID.Text = Format(Val(frmTransferOutReport.Id), "000000")
        Dim CmdART As New MySqlCommand("select * from tblavmain left join tblaart on tblavmain.ClinicID=tblaart.ClinicID left outer join tblavpatientstatus on tblavmain.Vid=tblavpatientstatus.Vid where tblavmain.clinicid='" & Val(frmTransferOutReport.Id) & "'  order by tblavmain.DatVisit", Cnndb)
        Rdr = CmdART.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(3).ToString) = 0 Then
                lblFW.Text = Rdr.GetValue(8).ToString.Trim
            End If
            If Rdr.GetValue(1).ToString.Trim <> "" And lblART.Text = "" Then
                lblWA.Text = Rdr.GetValue(8).ToString.Trim
                lblART.Text = Rdr.GetValue(1).ToString.Trim
                lblStartART.Text = "Yes"
                lblDaStart.Text = Format(CDate(Rdr.GetValue(83).ToString), "dd-MM-yyyy") '81
            End If
            lblWL.Text = Rdr.GetValue(8).ToString.Trim
            lblDV.Text = Format(CDate(Rdr.GetValue(2).ToString), "dd-MM-yyyy")
            Vid = Rdr.GetValue(78).ToString
            lblSiteName.Text = Rdr.GetValue(86).ToString.Trim
            lblarvline.Text = ""
            Select Case CDec(Rdr.GetValue(73).ToString)
                Case 0
                    lblarvline.Text = "1st Line regimen"
                Case 1
                    lblarvline.Text = "2nd Line regimen"
                Case 2
                    lblarvline.Text = "3rd Line regimen"
            End Select


        End While
        Rdr.Close()
        'If lblSiteName.Text.Trim = "" Then
        '    MessageBox.Show("អ្នកជំងឺនេះមិនទាន់ដាក់បញ្ចូលនៅក្នុងបញ្ចួនចេញទេ សូមដាក់អ្នកជំងឺបញ្ជួនចេញនៅFormខសិន", "Transfer out", MessageBoxButtons.OK, MessageBoxIcon.Exclamation)
        '    Exit Sub
        'End If

        Dim CmdSia As New MySqlCommand("SELECT * from tblaimain where ClinicID='" & Val(frmTransferOutReport.Id) & "'", Cnndb)
        Rdr = CmdSia.ExecuteReader
        While Rdr.Read
            lblDob.Text = Format(CDate(Rdr.GetValue(5).ToString), "dd-MM-yyyy")
            lblage.Text = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(5).ToString), CDate(Now.Date))
            Select Case Val(Rdr.GetValue(6).ToString)
                Case 0
                    lblSex.Text = "Female"
                Case 1
                    lblSex.Text = "Male"
            End Select
            lblDateTest.Text = Format(CDate(Rdr.GetValue(12).ToString), "dd-MM-yyyy")
            lblVCCTcode.Text = Rdr.GetValue(13).ToString.Trim
            lblVCCTclient.Text = Rdr.GetValue(14).ToString.Trim
            lblDatFirst.Text = Format(CDate(Rdr.GetValue(1).ToString), "dd-MM-yyyy")
        End While
        Rdr.Close()
        Dim CmdUp As New MySqlCommand("Select * from tblaumain where clinicid ='" & Val(frmTransferOutReport.Id) & "' order by Daupdate desc limit 1", Cnndb)
        Rdr = CmdUp.ExecuteReader
        While Rdr.Read
            lblgroup.Text = Rdr.GetValue(8).ToString.Trim
            lblstreet.Text = Rdr.GetValue(9).ToString.Trim
            lblHouse.Text = Rdr.GetValue(10).ToString.Trim
            lblVillage.Text = Rdr.GetValue(11).ToString.Trim
            lblCommune.Text = Rdr.GetValue(12).ToString.Trim
            lblDistrict.Text = Rdr.GetValue(13).ToString.Trim
            lblProvince.Text = Rdr.GetValue(14).ToString.Trim
            lblPhone.Text = Rdr.GetValue(15).ToString.Trim
            lblHBC.Text = Rdr.GetValue(21).ToString.Trim
        End While
        Rdr.Close()
        'Search TB
        Dim CmdTB As New MySqlCommand("Select TB,TypeTB,TBtreat,DaTBtreat from tblavmain where clinicid='" & Val(frmTransferOutReport.Id) & "' and TB in('0','1') order by DatVisit limit 1", Cnndb)
        Rdr = CmdTB.ExecuteReader
        While Rdr.Read
            Select Case CDbl(Rdr.GetValue(0).ToString)
                Case 0
                    lblTB.Text = "PTB"
                Case 1
                    lblTB.Text = "EPTB"
            End Select
            Select Case CDbl(Rdr.GetValue(1).ToString)
                Case 0
                    lblTypeTB.Text = "BK+"
                Case 1
                    lblTypeTB.Text = "BK-"
            End Select
            lblDatTB.Text = Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy")
        End While
        Rdr.Close()


        Dim i As Integer
        Dim CmdARV As New MySqlCommand("Select * from tblavarvdrug where Vid='" & Vid & "'", Cnndb)
        Rdr = CmdARV.ExecuteReader
        While Rdr.Read
            i = i + 1
            XrTableCell18.Text = Format(CDate(Rdr.GetValue(6).ToString), "dd-MM-yyyy")
            Select Case i
                Case 1
                    XrTableCell1.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell2.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell13.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell202.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell14.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell15.Text = ""
                        Case 1
                            XrTableCell16.Text = ""
                        Case 2
                            XrTableCell17.Text = ""
                    End Select
                    XrTableCell19.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell20.Text = Rdr.GetValue(8).ToString.Trim
                Case 2
                    XrTableCell21.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell22.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell23.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell203.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell24.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell25.Text = ""
                        Case 1
                            XrTableCell26.Text = ""
                        Case 2
                            XrTableCell27.Text = ""
                    End Select
                    XrTableCell29.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell30.Text = Rdr.GetValue(8).ToString.Trim
                Case 3
                    XrTableCell31.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell32.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell33.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell204.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell34.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell35.Text = ""
                        Case 1
                            XrTableCell36.Text = ""
                        Case 2
                            XrTableCell37.Text = ""
                    End Select
                    XrTableCell39.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell40.Text = Rdr.GetValue(8).ToString.Trim
                Case 4
                    XrTableCell41.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell42.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell43.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell205.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell44.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell45.Text = ""
                        Case 1
                            XrTableCell46.Text = ""
                        Case 2
                            XrTableCell47.Text = ""
                    End Select
                    XrTableCell49.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell50.Text = Rdr.GetValue(8).ToString.Trim
                Case 5
                    XrTableCell51.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell52.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell53.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell206.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell54.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell55.Text = ""
                        Case 1
                            XrTableCell56.Text = ""
                        Case 2
                            XrTableCell57.Text = ""
                    End Select
                    XrTableCell59.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell60.Text = Rdr.GetValue(8).ToString.Trim
                Case 6
                    XrTableCell61.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell62.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell63.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell207.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell64.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell65.Text = ""
                        Case 1
                            XrTableCell66.Text = ""
                        Case 2
                            XrTableCell67.Text = ""
                    End Select
                    XrTableCell69.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell70.Text = Rdr.GetValue(8).ToString.Trim
            End Select
        End While
        Rdr.Close()
        i = 0
        Dim CmdOi As New MySqlCommand("Select * from tblavoidrug where Vid='" & Vid & "'", Cnndb)
        Rdr = CmdOi.ExecuteReader
        While Rdr.Read
            i = i + 1
            XrTableCell78.Text = Format(CDate(Rdr.GetValue(6).ToString), "dd-MM-yyyy")
            Select Case i
                Case 1
                    XrTableCell71.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell72.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell73.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell208.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell74.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell75.Text = ""
                        Case 1
                            XrTableCell76.Text = ""
                        Case 2
                            XrTableCell77.Text = ""
                    End Select
                    XrTableCell79.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell80.Text = Rdr.GetValue(8).ToString.Trim
                Case 2
                    XrTableCell81.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell82.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell83.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell209.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell84.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell85.Text = ""
                        Case 1
                            XrTableCell86.Text = ""
                        Case 2
                            XrTableCell87.Text = ""
                    End Select
                    XrTableCell89.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell90.Text = Rdr.GetValue(8).ToString.Trim
                Case 3
                    XrTableCell91.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell92.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell93.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell210.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell94.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell95.Text = ""
                        Case 1
                            XrTableCell96.Text = ""
                        Case 2
                            XrTableCell97.Text = ""
                    End Select
                    XrTableCell99.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell100.Text = Rdr.GetValue(8).ToString.Trim
                Case 4
                    XrTableCell101.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell102.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell103.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell211.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell104.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell105.Text = ""
                        Case 1
                            XrTableCell106.Text = ""
                        Case 2
                            XrTableCell107.Text = ""
                    End Select
                    XrTableCell109.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell110.Text = Rdr.GetValue(8).ToString.Trim
            End Select
        End While
        Rdr.Close()
        i = 0
        Dim CmdTBd As New MySqlCommand("Select * from tblavtbdrug where Vid='" & Vid & "'", Cnndb)
        Rdr = CmdTBd.ExecuteReader
        While Rdr.Read
            i = i + 1
            XrTableCell118.Text = Format(CDate(Rdr.GetValue(6).ToString), "dd-MM-yyyy")
            Select Case i
                Case 1
                    XrTableCell111.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell112.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell113.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell212.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell114.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell115.Text = ""
                        Case 1
                            XrTableCell116.Text = ""
                        Case 2
                            XrTableCell117.Text = ""
                    End Select
                    XrTableCell119.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell120.Text = Rdr.GetValue(8).ToString.Trim
                Case 2
                    XrTableCell121.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell122.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell123.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell213.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell124.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell125.Text = ""
                        Case 1
                            XrTableCell126.Text = ""
                        Case 2
                            XrTableCell127.Text = ""
                    End Select
                    XrTableCell129.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell130.Text = Rdr.GetValue(8).ToString.Trim
                Case 3
                    XrTableCell131.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell132.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell133.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell214.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell134.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell135.Text = ""
                        Case 1
                            XrTableCell136.Text = ""
                        Case 2
                            XrTableCell137.Text = ""
                    End Select
                    XrTableCell139.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell140.Text = Rdr.GetValue(8).ToString.Trim
                Case 4
                    XrTableCell141.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell142.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell143.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell215.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell144.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell145.Text = ""
                        Case 1
                            XrTableCell146.Text = ""
                        Case 2
                            XrTableCell147.Text = ""
                    End Select
                    XrTableCell149.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell150.Text = Rdr.GetValue(8).ToString.Trim
                Case 5
                    XrTableCell151.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell152.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell153.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell216.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell154.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell155.Text = ""
                        Case 1
                            XrTableCell156.Text = ""
                        Case 2
                            XrTableCell157.Text = ""
                    End Select
                    XrTableCell159.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell160.Text = Rdr.GetValue(8).ToString.Trim
            End Select
        End While
        Rdr.Close()
        i = 0
        Dim CmdHCV As New MySqlCommand("Select * from tblavhydrug where Vid='" & Vid & "'", Cnndb)
        Rdr = CmdHCV.ExecuteReader
        While Rdr.Read
            i = i + 1
            XrTableCell168.Text = Format(CDate(Rdr.GetValue(6).ToString), "dd-MM-yyyy")
            Select Case i
                Case 1
                    XrTableCell161.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell162.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell163.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell217.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell164.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell165.Text = ""
                        Case 1
                            XrTableCell166.Text = ""
                        Case 2
                            XrTableCell167.Text = ""
                    End Select
                    XrTableCell169.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell170.Text = Rdr.GetValue(8).ToString.Trim
                Case 2
                    XrTableCell171.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell172.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell173.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell218.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell174.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell175.Text = ""
                        Case 1
                            XrTableCell176.Text = ""
                        Case 2
                            XrTableCell177.Text = ""
                    End Select
                    XrTableCell179.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell180.Text = Rdr.GetValue(8).ToString.Trim
                Case 3
                    XrTableCell181.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell182.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell183.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell219.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell184.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell185.Text = ""
                        Case 1
                            XrTableCell186.Text = ""
                        Case 2
                            XrTableCell187.Text = ""
                    End Select
                    XrTableCell189.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell190.Text = Rdr.GetValue(8).ToString.Trim
                Case 4
                    XrTableCell191.Text = Rdr.GetValue(0).ToString.Trim
                    XrTableCell192.Text = Rdr.GetValue(1).ToString.Trim
                    XrTableCell193.Text = Rdr.GetValue(2).ToString.Trim
                    XrTableCell220.Text = Rdr.GetValue(3).ToString.Trim
                    XrTableCell194.Text = Rdr.GetValue(4).ToString.Trim
                    Select Case CDbl(Rdr.GetValue(5).ToString)
                        Case 0
                            XrTableCell195.Text = ""
                        Case 1
                            XrTableCell196.Text = ""
                        Case 2
                            XrTableCell197.Text = ""
                    End Select
                    XrTableCell199.Text = Rdr.GetValue(7).ToString.Trim
                    XrTableCell200.Text = Rdr.GetValue(8).ToString.Trim
            End Select
        End While
        Rdr.Close()
        Dim CmdSp As New MySqlCommand("Select * from tblavpatientstatus where clinicid='" & Val(frmTransferOutReport.Id) & "'", Cnndb)
        Rdr = CmdSp.ExecuteReader
        While Rdr.Read
            lblSiteName.Text = Rdr.GetValue(5).ToString.Trim
        End While
        Rdr.Close()
        'Sithorn.............
        Dim CmdHTpS As New MySqlCommand("select av.ClinicID,av.DatVisit,sp.DrugName,sp.Da,ai.TPT,ai.DaStartTPT,ai.DaEndTPT,if(ai.TPTdrug=0,'3HP',if(ai.TPTdrug=1,'6H',if(ai.TPTdrug=2,'3RH',if(ai.TPTdrug=3,'INH','')))) as TPTdrug from tblavmain av " &
                                        "inner join tblaimain ai on ai.ClinicID=av.ClinicID " &
                                        "left join(select av.ClinicID,oi.DrugName, oi.Da,oi.Status,av.Vid from tblavmain av " &
                                        "left join tblavoidrug oi on av.Vid=oi.Vid where oi.DrugName='Isoniazid' and oi.Status=0 union " &
                                        "select av.ClinicID,tpt.DrugName, tpt.Da,tpt.Status,av.Vid from tblavmain av " &
                                        "left join tblavtptdrug tpt on av.Vid=tpt.Vid " &
                                        "where ((tpt.DrugName='3HP' or tpt.DrugName='6H' or tpt.DrugName='3RH') and tpt.Status=0)) sp on av.Vid=sp.vid " &
                                        "where av.ClinicID=" & Val(frmTransferOutReport.Id) & " order by sp.Da desc limit 1;", Cnndb)
        Rdr = CmdHTpS.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(4).ToString) = 2 And CDate(Rdr.GetValue(5).ToString).Date > CDate("1900-01-01").Date Then
                XrLabel41.Text = Format(CDate(Rdr.GetValue(5).ToString), "dd-MM-yyyy")
            ElseIf CDate(Rdr.GetValue(5).ToString).Date > CDate("1900-01-01").Date And CDate(Rdr.GetValue(6).ToString).Date > CDate("1900-01-01").Date Then
                XrLabel41.Text = Format(CDate(Rdr.GetValue(5).ToString), "dd-MM-yyyy")
            ElseIf Rdr.GetValue(3).ToString <> "" Then
                XrLabel41.Text = Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy")
            Else
                XrLabel41.Text = ""
            End If
            If Rdr.GetValue(2).ToString() = "" Then
                XrLabel45.Text = Rdr.GetValue(7).ToString()
            Else
                XrLabel45.Text = Rdr.GetValue(2).ToString()
            End If

        End While
        Rdr.Close()
        Dim CmdHTpP As New MySqlCommand("select av.ClinicID,av.DatVisit,sp.DrugName,sp.Da,ai.TPT,ai.DaStartTPT,ai.DaEndTPT,if(ai.TPTdrug=0,'3HP',if(ai.TPTdrug=1,'6H',if(ai.TPTdrug=2,'3RH',if(ai.TPTdrug=3,'INH','')))) as TPTdrug from tblavmain av " &
                                        "inner join tblaimain ai on ai.ClinicID=av.ClinicID " &
                                        "left join(select av.ClinicID,oi.DrugName, oi.Da,oi.Status,av.Vid from tblavmain av " &
                                        "left join tblavoidrug oi on av.Vid=oi.Vid where oi.DrugName='Isoniazid' and oi.Status=1 union " &
                                        "select av.ClinicID,tpt.DrugName, tpt.Da,tpt.Status,av.Vid from tblavmain av " &
                                        "left join tblavtptdrug tpt on av.Vid=tpt.Vid " &
                                        "where ((tpt.DrugName='3HP' or tpt.DrugName='6H' or tpt.DrugName='3RH') and tpt.Status=1)) sp on av.Vid=sp.vid " &
                                        "where av.ClinicID=" & Val(frmTransferOutReport.Id) & " order by sp.Da desc limit 1;", Cnndb)
        Rdr = CmdHTpP.ExecuteReader
        While Rdr.Read
            If CDate(Rdr.GetValue(5).ToString).Date > CDate("1900-01-01").Date And CDate(Rdr.GetValue(6).ToString).Date > CDate("1900-01-01").Date Then
                XrLabel43.Text = Format(CDate(Rdr.GetValue(6).ToString), "dd-MM-yyyy")
            ElseIf Rdr.GetValue(3).ToString <> "" Then
                XrLabel43.Text = Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy")
            Else
                XrLabel43.Text = ""
            End If
        End While
        Rdr.Close()

        '....................
        Dim CmdSite As New MySqlCommand("Select * from tblsitename", Cnndb)
        Rdr = CmdSite.ExecuteReader
        While Rdr.Read
            XrTableCell223.Text = Rdr.GetValue(2).ToString.Trim & " - " & Rdr.GetValue(0).ToString
        End While
        Rdr.Close()
    End Sub
End Class