Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Public Class TransferoutChild
    Dim Rdr As MySqlDataReader
    Private Sub TransferoutChild_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint
        If frmTransferOutReport.Id = "" Then Exit Sub
        Dim Vid As String
        lblClinicID.Text = frmTransferOutReport.Id
        Dim CmdSia As New MySqlCommand("Select * from tblcimain where clinicid='" & frmTransferOutReport.Id & "'", Cnndb)
        Rdr = CmdSia.ExecuteReader
        While Rdr.Read
            lblDob.Text = Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy")
            lblage.Text = DateDiff(DateInterval.Year, CDate(Rdr.GetValue(3).ToString), CDate(Now.Date))
            Select Case Val(Rdr.GetValue(4).ToString)
                Case 0
                    lblSex.Text = "Female"
                Case 1
                    lblSex.Text = "Male"
            End Select
            lblDateTest.Text = Format(CDate(Rdr.GetValue(8).ToString), "dd-MM-yyyy")
            lblVCCTcode.Text = Rdr.GetValue(10).ToString.Trim
            lblVCCTclient.Text = Rdr.GetValue(11).ToString.Trim
            lblDatFirst.Text = Format(CDate(Rdr.GetValue(1).ToString), "dd-MM-yyyy")
        End While
        Rdr.Close()
        Dim CmdUp As New MySqlCommand("SELECT     preart.tblcumain.ClinicID, preart.tblcumain.Daupdate, preart.tblcumain.AddGuardian, preart.tblcumain.Grou, preart.tblcumain.House, preart.tblcumain.Street, preart.tblcumain.Village, preart.tblcumain.Commune, preart.tblcumain.District, preart.tblcumain.Province, preart.tblcumain.AddContact, preart.tblcumain.Phone, preart.tblcumain.ChildStatus, preart.tbloccupation.Name,  tbloccupation_1.Name AS Expr1, preart.tblcumain.Education, preart.tblcumain.ChildSupport, preart.tblcumain.Vaccine FROM   preart.tblcumain LEFT OUTER JOIN  preart.tbloccupation AS tbloccupation_1 ON preart.tblcumain.Foccupation = tbloccupation_1.OcID LEFT OUTER JOIN  preart.tbloccupation ON preart.tblcumain.Moccupation = preart.tbloccupation.OcID where tblcumain.clinicid ='" & frmTransferOutReport.Id & "' order by tblcumain.Daupdate desc limit 1", Cnndb)
        Rdr = CmdUp.ExecuteReader
        While Rdr.Read
            ' lblgroup.Text = Rdr.GetValue(3).ToString.Trim
            lblstreet.Text = Rdr.GetValue(5).ToString.Trim
            lblHouse.Text = Rdr.GetValue(4).ToString.Trim
            lblVillage.Text = Rdr.GetValue(6).ToString.Trim
            lblCommune.Text = Rdr.GetValue(7).ToString.Trim
            lblDistrict.Text = Rdr.GetValue(8).ToString.Trim
            lblProvince.Text = Rdr.GetValue(9).ToString.Trim
            lblPhone.Text = Rdr.GetValue(11).ToString.Trim
            lblHBC.Text = Rdr.GetValue(16).ToString.Trim
            Select Case CDbl(Rdr.GetValue(12).ToString)
                Case 0
                    XrLabel38.Text = "Both Parents alive"
                Case 1
                    XrLabel38.Text = "Mother deceased"
                Case 2
                    XrLabel38.Text = "Father deceased"
                Case 3
                    XrLabel38.Text = "Both parents deceased"
            End Select

            Select Case CDbl(Rdr.GetValue(2).ToString)
                Case 1
                    lblgroup.Text = "Monther"
                Case 2
                    lblgroup.Text = "Father"
                Case 3
                    lblgroup.Text = "Grand Monther"
                Case 4
                    lblgroup.Text = "Grand Father"
                Case 5
                    lblgroup.Text = "Relative"
            End Select
            lblFocc.Text = Rdr.GetValue(13).ToString.Trim
            lblMocc.Text = Rdr.GetValue(14).ToString.Trim
            Select Case CDbl(Rdr.GetValue(17).ToString)
                Case 1
                    lblVacin.Text = "Routine vaccinations"
                Case 2
                    lblVacin.Text = "Vaccination on going"
                Case 3
                    lblVacin.Text = "Missing"
                Case 4
                    lblVacin.Text = "None"
                Case 5
                    lblVacin.Text = "Unknown"
            End Select
        End While
        Rdr.Close()
        'Search TB
        Dim CmdTB As New MySqlCommand("Select TB,TypeTB,TBtreat,DaTBtreat from tblcvmain where clinicid='" & frmTransferOutReport.Id & "' and TB in('0','1') order by DatVisit limit 1", Cnndb)
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

        Dim CmdART As New MySqlCommand("select * from tblcvmain left join tblcart on tblcvmain.ClinicID=tblcart.ClinicID where tblcvmain.clinicid='" & frmTransferOutReport.Id & "'  order by tblcvmain.DatVisit", Cnndb)
        Rdr = CmdART.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(3).ToString) = 0 Then
                lblFW.Text = Rdr.GetValue(8).ToString.Trim
            End If
            If Rdr.GetValue(1).ToString.Trim <> "" And lblART.Text = "" Then
                lblWA.Text = Rdr.GetValue(8).ToString.Trim
                lblART.Text = Rdr.GetValue(1).ToString.Trim
                lblStartART.Text = "Yes"
                lblDaStart.Text = Format(CDate(Rdr.GetValue(48).ToString), "dd-MM-yyyy") ' sithorn changed 47 to 48
            End If
            lblWL.Text = Rdr.GetValue(8).ToString.Trim
            lblDV.Text = Format(CDate(Rdr.GetValue(2).ToString), "dd-MM-yyyy")
            Vid = Rdr.GetValue(44).ToString
        End While
        Rdr.Close()
        Dim i As Integer
        Dim CmdARV As New MySqlCommand("Select * from tblcvarvdrug where Vid='" & Vid & "'", Cnndb)
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
        Dim CmdOi As New MySqlCommand("Select * from tblcvoidrug where Vid='" & Vid & "'", Cnndb)
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
        Dim CmdTBd As New MySqlCommand("Select * from tblcvtbdrug where Vid='" & Vid & "'", Cnndb)
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
            End Select
        End While
        Rdr.Close()
        Dim CmdSp As New MySqlCommand("Select * from tblcvpatientstatus where clinicid='" & frmTransferOutReport.Id & "'", Cnndb)
        Rdr = CmdSp.ExecuteReader
        While Rdr.Read
            XrLabel43.Text = Rdr.GetValue(5).ToString.Trim
        End While
        Rdr.Close()

        'Sithorn.............
        Dim CmdHTpS As New MySqlCommand("select cv.ClinicID,cv.DatVisit,sp.DrugName,sp.Da,ci.Inh,ci.DaStartTPT,ci.DaEndTPT,if(ci.TPTdrug=0,'3HP',if(ci.TPTdrug=1,'6H',if(ci.TPTdrug=2,'3RH',''))) as TPTdrug from tblcvmain cv " &
                                        "inner join tblcimain ci on ci.ClinicID=cv.ClinicID " &
                                        "left join(select cv.ClinicID,oi.DrugName, oi.Da,oi.Status,cv.Vid from tblcvmain cv " &
                                        "left join tblcvoidrug oi on cv.Vid=oi.Vid where oi.DrugName='Isoniazid' and oi.Status=0 union " &
                                        "select cv.ClinicID,tpt.DrugName, tpt.Da,tpt.Status,cv.Vid from tblcvmain cv " &
                                        "left join tblcvtptdrug tpt on cv.Vid=tpt.Vid " &
                                        "where ((tpt.DrugName='3HP' or tpt.DrugName='6H' or tpt.DrugName='3RH') and tpt.Status=0)) sp on cv.Vid=sp.vid " &
                                        "where cv.ClinicID='" & frmTransferOutReport.Id & "' order by sp.Da desc limit 1;", Cnndb)
        Rdr = CmdHTpS.ExecuteReader
        While Rdr.Read
            If Val(Rdr.GetValue(4).ToString) = 2 And CDate(Rdr.GetValue(5).ToString).Date > CDate("1900-01-01").Date Then
                XrLabel50.Text = Format(CDate(Rdr.GetValue(5).ToString), "dd-MM-yyyy")
            ElseIf CDate(Rdr.GetValue(5).ToString).Date > CDate("1900-01-01").Date And CDate(Rdr.GetValue(6).ToString).Date > CDate("1900-01-01").Date Then
                XrLabel50.Text = Format(CDate(Rdr.GetValue(5).ToString), "dd-MM-yyyy")
            ElseIf Rdr.GetValue(3).ToString <> "" Then
                XrLabel50.Text = Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy")
            Else
                XrLabel50.Text = ""
            End If
            If Rdr.GetValue(2).ToString() = "" Then
                XrLabel45.Text = Rdr.GetValue(7).ToString()
            Else
                XrLabel45.Text = Rdr.GetValue(2).ToString()
            End If

        End While
        Rdr.Close()
        Dim CmdHTpP As New MySqlCommand("select cv.ClinicID,cv.DatVisit,sp.DrugName,sp.Da,ci.Inh,ci.DaStartTPT,ci.DaEndTPT,if(ci.TPTdrug=0,'3HP',if(ci.TPTdrug=1,'6H',if(ci.TPTdrug=2,'3RH',''))) as TPTdrug from tblcvmain cv " &
                                        "inner join tblcimain ci on ci.ClinicID=cv.ClinicID " &
                                        "left join(select cv.ClinicID,oi.DrugName, oi.Da,oi.Status,cv.Vid from tblcvmain cv " &
                                        "left join tblcvoidrug oi on cv.Vid=oi.Vid where oi.DrugName='Isoniazid' and oi.Status=1 union " &
                                        "select cv.ClinicID,tpt.DrugName, tpt.Da,tpt.Status,cv.Vid from tblcvmain cv " &
                                        "left join tblcvtptdrug tpt on cv.Vid=tpt.Vid " &
                                        "where ((tpt.DrugName='3HP' or tpt.DrugName='6H' or tpt.DrugName='3RH') and tpt.Status=1)) sp on cv.Vid=sp.vid " &
                                        "where cv.ClinicID='" & frmTransferOutReport.Id & "' order by sp.Da desc limit 1;", Cnndb)
        Rdr = CmdHTpP.ExecuteReader
        While Rdr.Read
            If CDate(Rdr.GetValue(5).ToString).Date > CDate("1900-01-01").Date And CDate(Rdr.GetValue(6).ToString).Date > CDate("1900-01-01").Date Then
                XrLabel53.Text = Format(CDate(Rdr.GetValue(6).ToString), "dd-MM-yyyy")
            ElseIf Rdr.GetValue(3).ToString <> "" Then
                XrLabel53.Text = Format(CDate(Rdr.GetValue(3).ToString), "dd-MM-yyyy")
            Else
                XrLabel53.Text = ""
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