Imports System.Drawing.Printing
Imports MySql.Data.MySqlClient
Imports DevExpress.XtraReports.UI

Public Class Appointment
    Dim Rdr As MySqlDataReader
    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

    End Sub

    Protected Overrides Sub Finalize()
        MyBase.Finalize()
    End Sub

    Private Sub Appointment_AfterPrint(sender As Object, e As EventArgs) Handles Me.AfterPrint

    End Sub

    Private Sub Appointment_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint

        Dim da As String = Format(CDate(frmAppOption.daStartDate.Text), "yyyy-MM-dd")

        Dim Appdata As New DataSet()
        Dim dt As New DataTable("tblexpost")
        'Exposed
        'Dim CmdEx As New MySqlCommand("SELECT tblevmain.ClinicID, tbleimain.Sex, tbldoctor.Name, tblappointment.Time, tblappointment.Att, tblevmain.DaApp " &
        '                                "FROM tblappointment LEFT OUTER JOIN tbldoctor ON tblappointment.Doctore = tbldoctor.Did RIGHT OUTER JOIN " &
        '                                "tblevmain ON tblappointment.Vid = tblevmain.Vid RIGHT OUTER JOIN  tbleimain ON tblevmain.ClinicID = tbleimain.ClinicID where tblevmain.DaApp ='" & da & "' order by tblevmain.ClinicID asc ", Cnndb)
        'Rdr = CmdEx.ExecuteReader

        'Sithorn..................
        Dim CmdEx As New MySqlCommand("SELECT ev.ClinicID, if(ei.Sex=1,'Male','Female') Sex, doc.Name, if(app.Time=1,'PM','AM') Tim, " &
        "If(app.Att = 1,'មកមុនណាត់',if(app.Att=2,'មកតាមណាត់',if(app.Att=3,'មកយឺត','--'))) Att, ev.DaApp FROM tblappointment app " &
        "Left OUTER JOIN tbldoctor doc On app.Doctore = doc.Did " &
        "RIGHT OUTER JOIN tblevmain ev ON app.Vid = ev.Vid " &
        "Left Join tblevpatientstatus ep On ev.Vid=ep.Vid " &
        "RIGHT OUTER JOIN  tbleimain ei ON ev.ClinicID = ei.ClinicID " &
        "where ev.DaApp ='" & da & "' and ep.Status is null order by ev.ClinicID asc;", Cnndb)
        Rdr = CmdEx.ExecuteReader
        '.........................
        While Rdr.Read
            '  appdata.tblapp.addtblapprow(rdr.getvalue(0).tostring, "", replace(replace(rdr.getvalue(1).tostring, "1", "male"), "0", "female"), rdr.getvalue(2).tostring, replace(replace(rdr.getvalue(3).tostring, "1", "pm"), "0", "am"), replace(replace(rdr.getvalue(4).tostring, "1", "មករួចហើយ"), "0", "--"), "", "", "", "")
            Appdata.tblapp.AddtblappRow(Rdr.GetValue(0).ToString, "", Rdr.GetValue(1).ToString, Rdr.GetValue(2).ToString, Rdr.GetValue(3).ToString, Rdr.GetValue(4).ToString, "", "", "", "", "")
            lblEx.Text = Val(lblEx.Text) + 1
            Select Case Val(Rdr.GetValue(3).ToString)
                Case 0
                    lblAm.Text = Val(lblAm.Text) + 1
                Case Else
                    lblPM.Text = Val(lblPM.Text) + 1
            End Select
            'lblnum.text = val(lblnum.text) + 1
        End While
        '     Dim datasource As DataSet.tblappDataTable
        'dt.Load(Rdr)
        'Appdata.Tables("tblapp").Merge(dt)


        DataSource = Appdata.tblapp
        Rdr.Close()
        lblClinicID.DataBindings.Add("Text", DataSource, "ClinicID")
        lblArt.DataBindings.Add("Text", DataSource, "Artnumber")
        lblSex.DataBindings.Add("Text", DataSource, "Sex")
        lbldoct.DataBindings.Add("Text", DataSource, "DocName")
        lbltime.DataBindings.Add("Text", DataSource, "Tim")
        lblStatus.DataBindings.Add("Text", DataSource, "Come")
        'Child
        'Dim CmdCh As New MySqlCommand("SELECT tblcimain.ClinicID, tblcimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblcvmain.DaApp, tblcvmain.ARTnum, tblpatienttest.Dat, tblpatienttest.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog " &
        '                               "FROM  tblcvmain LEFT OUTER JOIN  tblpatienttest ON tblcvmain.TestID = tblpatienttest.TestID LEFT OUTER JOIN  tblappointment ON tblcvmain.Vid = tblappointment.Vid RIGHT OUTER JOIN  tblcimain ON tblcvmain.ClinicID = tblcimain.ClinicID LEFT OUTER JOIN  tbldoctor ON tblappointment.Doctore = tbldoctor.Did where tblcvmain.DaApp ='" & da & "' order by tblcimain.ClinicID asc ", Cnndb)
        'Rdr = CmdCh.ExecuteReader
        'Sithorn..................
        'Dim CmdCh As New MySqlCommand("SELECT tblcimain.ClinicID, tblcimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblcvmain.DaApp, tblcvmain.ARTnum, tblpatienttest.Dat, tblpatienttest.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog " &
        '                               "FROM  tblcvmain left join tblcvpatientstatus cp on tblcvmain.Vid=cp.Vid LEFT OUTER JOIN  tblpatienttest ON tblcvmain.TestID = tblpatienttest.TestID LEFT OUTER JOIN  tblappointment ON tblcvmain.Vid = tblappointment.Vid RIGHT OUTER JOIN  tblcimain ON tblcvmain.ClinicID = tblcimain.ClinicID LEFT OUTER JOIN  tbldoctor ON tblappointment.Doctore = tbldoctor.Did where tblcvmain.DaApp ='" & da & "' and cp.Status is null order by tblcimain.ClinicID asc ", Cnndb)
        'Rdr = CmdCh.ExecuteReader

        'Dim CmdCh As New MySqlCommand("SELECT tblcimain.ClinicID,tblcimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblcvmain.DaApp, tblcvmain.ARTnum, if(tblpatienttest.Dat <>'',tblpatienttest.Dat,tblpatienttest1.Dat) as Dat, tblpatienttest1.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog FROM " &
        '        " (select t1.ClinicID, t1.Dat, t1.HIVLoad, t1.HIVLog, t1.TestID from tblpatienttest t1 " &
        '        " inner join(select ClinicID, max(Dat) as Dat from tblpatienttest where HIVLoad<>'' and Dat<='" & da & "' group by ClinicID) t2 on t1.ClinicID=t2.ClinicID and t1.Dat=t2.Dat) tblpatienttest " &
        '        " Left Join(select t1.ClinicID, t1.Dat, t1.CD4, t1.TestID from tblpatienttest t1 " &
        '        " inner join(select ClinicID, max(Dat) as Dat from tblpatienttest where CD4<>'' and Dat<='" & da & "' group by ClinicID) t2 on t1.ClinicID=t2.ClinicID and t1.Dat=t2.Dat " &
        '        " ) tblpatienttest1 On tblpatienttest.ClinicID=tblpatienttest1.ClinicID " &
        '        " RIGHT OUTER JOIN tblcvmain ON tblpatienttest.ClinicID = tblcvmain.ClinicID " &
        '        " Right OUTER JOIN tblcimain On tblcvmain.ClinicID = tblcimain.ClinicID " &
        '        " left join tblcvpatientstatus ap on tblcvmain.Vid=ap.vid " &
        '        " Left OUTER JOIN  tblappointment On tblcvmain.Vid = tblappointment.Vid " &
        '        " LEFT OUTER JOIN  tbldoctor ON tblappointment.Doctore = tbldoctor.Did " &
        '        " where tblcvmain.DaApp ='" & da & "' And ap.Status Is null " &
        '        " order by tblcimain.ClinicID asc", Cnndb)
        'Rdr = CmdCh.ExecuteReader

        'Dim CmdCh As New MySqlCommand("SELECT tblcimain.ClinicID,tblcimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblcvmain.DaApp, tblcvmain.ARTnum, if(tblpatienttest.Dat <>'',tblpatienttest.Dat,tblpatienttest1.Dat) as Dat, tblpatienttest1.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog FROM  tblcvmain " &
        '   " Left join tblcimain On tblcvmain.ClinicID = tblcimain.ClinicID " &
        '   " left join tblcvpatientstatus ap on tblcvmain.Vid=ap.vid " &
        '   " Left Join  tblappointment On tblcvmain.Vid = tblappointment.Vid " &
        '   " left join  tbldoctor ON tblappointment.Doctore = tbldoctor.Did " &
        '   " left join(select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.HIVLoad, t1.HIVLog, t1.TestID from tblpatienttest t1 " &
        '   " inner join(Select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where HIVLoad<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat) tblpatienttest " &
        '   " ON tblpatienttest.convertedID = tblcvmain.ClinicID " &
        '   " Left Join(Select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.CD4, t1.TestID from tblpatienttest t1 " &
        '   " inner join(select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where CD4<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat " &
        '   " ) tblpatienttest1 On tblcvmain.ClinicID=tblpatienttest1.convertedID " &
        '   " where tblcvmain.DaApp ='" & da & "' And ap.Status Is null " &
        '   " order by tblcimain.ClinicID asc;", Cnndb)
        'Rdr = CmdCh.ExecuteReader

        Dim CmdCh As New MySqlCommand("SELECT ci.ClinicID,if(ci.Sex=1,'Male','Female') Sex, if(app.Att=1,'មកមុនណាត់',if(app.Att=2,'មកតាមណាត់',if(app.Att=3,'មកយឺត','--'))) Att, doc.Name, if(app.Time=1,'PM','AM') Tim, cv.DaApp, cv.ARTnum, if(t.Dat is not null,t.Dat,t1.Dat) as Dat, t1.CD4, t.HIVLoad, t.HIVLog, dr.Regimen, cv.DatVisit FROM  tblcvmain cv " &
        "inner join(Select distinct clinicid,max(DatVisit) as datvisit from tblcvmain " &
        "where DaApp='" & da & "' group by clinicid) mv on mv.clinicid=cv.clinicid and mv.datvisit=cv.DatVisit " &
        "left outer join (SELECT distinct vid,group_concat(concat(DrugName,'(',replace(Dose,'mg',''),')') order by DrugName separator ' + ') as Regimen FROM preart.tblcvarvdrug " &
        "where Status<>1 group by vid) dr on dr.vid=cv.vid " &
        "Left join tblcimain ci On cv.ClinicID = ci.ClinicID " &
        "left join tblcvpatientstatus ap on cv.Vid=ap.vid " &
        "Left Join  tblappointment app On cv.Vid = app.Vid " &
        "left join  tbldoctor doc ON app.Doctore = doc.Did " &
        "left join(select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.HIVLoad, t1.HIVLog, t1.TestID from tblpatienttest t1 " &
        "inner join(Select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where HIVLoad<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat) t " &
        "ON t.convertedID = cv.ClinicID " &
        "Left Join(Select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.CD4, t1.TestID from tblpatienttest t1 " &
        "inner join(select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where CD4<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat " &
        ") t1 On cv.ClinicID=t1.convertedID " &
        "where cv.DaApp ='" & da & "' And ap.Status Is null " &
        "order by ci.ClinicID asc;", Cnndb)
        Rdr = CmdCh.ExecuteReader
        '.........................
        While Rdr.Read
            Try
                Dim dte As String = ""
                If Rdr.GetValue(7).ToString.Trim <> "" Then
                    dte = Format(CDate(Rdr.GetValue(7).ToString), "dd-MM-yyyy")
                End If
                'Appdata.tblapp.AddtblappRow(Rdr.GetValue(0).ToString, Rdr.GetValue(6).ToString, Replace(Replace(Rdr.GetValue(1).ToString, "1", "Male"), "0", "Female"), Rdr.GetValue(3).ToString, Replace(Replace(Rdr.GetValue(4).ToString, "1", "PM"), "0", "AM"), Replace(Replace(Rdr.GetValue(2).ToString, "1", "មករួចហើយ"), "0", "--"), dte, Rdr.GetValue(8).ToString, Rdr.GetValue(9).ToString, Rdr.GetValue(10).ToString)
                Appdata.tblapp.AddtblappRow(Rdr.GetValue(0).ToString, Rdr.GetValue(6).ToString, Rdr.GetValue(1).ToString, Rdr.GetValue(3).ToString, Rdr.GetValue(4).ToString, Rdr.GetValue(2).ToString, dte, Rdr.GetValue(8).ToString, Rdr.GetValue(9).ToString, Rdr.GetValue(10).ToString, Rdr.GetValue(11).ToString)
                lblchild.Text = Val(lblchild.Text) + 1
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 0
                        lblAm.Text = Val(lblAm.Text) + 1
                    Case Else
                        lblPM.Text = Val(lblPM.Text) + 1
                End Select
            Catch ex As Exception
            End Try
            ' lblNum.Text = Val(lblNum.Text) + 1
        End While
        DataSource = Appdata.tblapp
        Rdr.Close()
        lblClinicID.DataBindings.Add("Text", DataSource, "ClinicID")
        lblArt.DataBindings.Add("Text", DataSource, "Artnumber")
        lblSex.DataBindings.Add("Text", DataSource, "Sex")
        lbldoct.DataBindings.Add("Text", DataSource, "DocName")
        lbltime.DataBindings.Add("Text", DataSource, "Tim")
        lblStatus.DataBindings.Add("Text", DataSource, "Come")
        XrTableCell9.DataBindings.Add("Text", DataSource, "CD4")
        XrTableCell16.DataBindings.Add("Text", DataSource, "Dat")
        XrTableCell10.DataBindings.Add("Text", DataSource, "Lc")
        XrTableCell12.DataBindings.Add("Text", DataSource, "Lg")
        XrTableCell22.DataBindings.Add("Text", DataSource, "Regimen")
        'Adult
        'Dim Cmdad As New MySqlCommand("SELECT     tblaimain.ClinicID, tblaimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblavmain.DaApp, tblavmain.ARTnum, tblpatienttest.Dat, tblpatienttest.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog FROM    tblpatienttest RIGHT OUTER JOIN   tblavmain ON tblpatienttest.TestID = tblavmain.TestID RIGHT OUTER JOIN " &
        '             " tblaimain ON tblavmain.ClinicID = tblaimain.ClinicID LEFT OUTER JOIN  tblappointment ON tblavmain.Vid = tblappointment.Vid LEFT OUTER JOIN  tbldoctor ON tblappointment.Doctore = tbldoctor.Did  where tblavmain.DaApp='" & da & "' order by tblaimain.ClinicID asc ", Cnndb)
        'Rdr = Cmdad.ExecuteReader
        'Sithorn....................
        'Dim Cmdad As New MySqlCommand("SELECT     tblaimain.ClinicID, tblaimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblavmain.DaApp, tblavmain.ARTnum, tblpatienttest.Dat, tblpatienttest.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog FROM    tblpatienttest RIGHT OUTER JOIN   tblavmain ON tblpatienttest.TestID = tblavmain.TestID RIGHT OUTER JOIN " &
        '             " tblaimain ON tblavmain.ClinicID = tblaimain.ClinicID left join tblavpatientstatus ap on tblavmain.Vid=ap.vid LEFT OUTER JOIN  tblappointment ON tblavmain.Vid = tblappointment.Vid LEFT OUTER JOIN  tbldoctor ON tblappointment.Doctore = tbldoctor.Did  where tblavmain.DaApp='" & da & "' and ap.Status is null order by tblaimain.ClinicID asc ", Cnndb)
        'Rdr = Cmdad.ExecuteReader

        'Dim Cmdad As New MySqlCommand("SELECT tblaimain.ClinicID,tblaimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblavmain.DaApp, tblavmain.ARTnum, if(tblpatienttest.Dat <>'',tblpatienttest.Dat,tblpatienttest1.Dat) as Dat, tblpatienttest1.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog FROM" &
        '            " (select t1.ClinicID, t1.Dat, t1.HIVLoad, t1.HIVLog, t1.TestID from tblpatienttest t1" &
        '            " inner join(Select ClinicID, max(Dat) as Dat from tblpatienttest where HIVLoad<>'' and Dat<='" & da & "' group by if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned))) t2 on t1.ClinicID=t2.ClinicID and t1.Dat=t2.Dat) tblpatienttest " &
        '            " Left Join(Select t1.ClinicID, t1.Dat, t1.CD4, t1.TestID from tblpatienttest t1 " &
        '            " inner join(select ClinicID, max(Dat) as Dat from tblpatienttest where CD4<>'' and Dat<='" & da & "' group by if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned))) t2 on t1.ClinicID=t2.ClinicID and t1.Dat=t2.Dat " &
        '            " ) tblpatienttest1 On tblpatienttest.ClinicID=tblpatienttest1.ClinicID " &
        '            " RIGHT OUTER JOIN tblavmain ON tblpatienttest.ClinicID = tblavmain.ClinicID " &
        '            " Right OUTER JOIN tblaimain On tblavmain.ClinicID = tblaimain.ClinicID " &
        '            " left join tblavpatientstatus ap on tblavmain.Vid=ap.vid " &
        '            " Left OUTER JOIN  tblappointment On tblavmain.Vid = tblappointment.Vid " &
        '            " LEFT OUTER JOIN  tbldoctor ON tblappointment.Doctore = tbldoctor.Did " &
        '            " where tblavmain.DaApp ='" & da & "' And ap.Status Is null " &
        '            " order by tblaimain.ClinicID asc", Cnndb)
        'Rdr = Cmdad.ExecuteReader

        'Dim Cmdad As New MySqlCommand("SELECT tblaimain.ClinicID,tblaimain.Sex, tblappointment.Att, tbldoctor.Name, tblappointment.Time, tblavmain.DaApp, tblavmain.ARTnum, if(tblpatienttest.Dat <>'',tblpatienttest.Dat,tblpatienttest1.Dat) as Dat, tblpatienttest1.CD4, tblpatienttest.HIVLoad, tblpatienttest.HIVLog FROM  tblavmain " &
        '   " left join tblaimain On tblavmain.ClinicID = tblaimain.ClinicID " &
        '   " left join tblavpatientstatus ap on tblavmain.Vid=ap.vid " &
        '   " left join  tblappointment On tblavmain.Vid = tblappointment.Vid " &
        '   " left join  tbldoctor ON tblappointment.Doctore = tbldoctor.Did " &
        '   " left join(select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.HIVLoad, t1.HIVLog, t1.TestID from tblpatienttest t1 " &
        '   " inner join(Select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where HIVLoad<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat) tblpatienttest " &
        '   " ON tblpatienttest.convertedID = tblavmain.ClinicID " &
        '   " Left Join(Select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.CD4, t1.TestID from tblpatienttest t1 " &
        '   " inner join(select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where CD4<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat " &
        '   " ) tblpatienttest1 On tblavmain.ClinicID=tblpatienttest1.convertedID " &
        '   " where tblavmain.DaApp ='" & da & "' And ap.Status Is null " &
        '   " order by tblaimain.ClinicID asc;", Cnndb)
        'Rdr = Cmdad.ExecuteReader

        Dim Cmdad As New MySqlCommand("SELECT ai.ClinicID,if(ai.Sex=1,'Male','Female') Sex, if(app.Att=1,'មកមុនណាត់',if(app.Att=2,'មកតាមណាត់',if(app.Att=3,'មកយឺត','--'))) Att, doc.Name, if(app.Time=1,'PM','AM') Tim, av.DaApp, av.ARTnum, if(t.Dat is not null,t.Dat,t1.Dat) as Dat, t1.CD4, t.HIVLoad, t.HIVLog, dr.regimen,av.DatVisit FROM  tblavmain av " &
        "inner join(Select distinct clinicid,max(DatVisit) as datvisit from tblavmain " &
        "where DaApp ='" & da & "' group by clinicid) mv on mv.clinicid=av.clinicid and mv.datvisit=av.DatVisit " &
        "Left outer join (Select distinct vid, group_concat(concat(DrugName,'(',replace(Dose,'mg',''),')') order by DrugName separator ' + ') as regimen FROM preart.tblavarvdrug " &
        "where Status<>1 group by vid) dr On dr.vid=av.vid " &
        "left join tblaimain ai On av.ClinicID = ai.ClinicID " &
        "Left Join tblavpatientstatus ap On av.Vid=ap.vid " &
        "left join  tblappointment app On av.Vid = app.Vid " &
        "Left Join  tbldoctor doc On app.Doctore = doc.Did " &
        "left join(select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.HIVLoad, t1.HIVLog, t1.TestID from tblpatienttest t1 " &
        "inner join(Select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where HIVLoad<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat) t " &
        "ON t.convertedID = av.ClinicID " &
        "Left Join(Select distinct if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned)) as convertedID, t1.ClinicID, t1.Dat, t1.CD4, t1.TestID from tblpatienttest t1 " &
        "inner join(select if(left(ClinicID,1)='P',ClinicID,cast(ClinicID as unsigned)) as convertedID, ClinicID, max(Dat) as Dat from tblpatienttest where CD4<>'' and Dat<='" & da & "' group by convertedID) t2 on if(left(t1.ClinicID,1)='P',t1.ClinicID,cast(t1.ClinicID as unsigned))=t2.convertedID and t1.Dat=t2.Dat " &
        ") t1 On av.ClinicID=t1.convertedID " &
        "where av.DaApp ='" & da & "' And ap.Status Is null " &
        "order by ai.ClinicID asc;", Cnndb)
        Rdr = Cmdad.ExecuteReader

        '...........................
        While Rdr.Read
            ' Dim xx As String = Rdr.GetValue(0).ToString
            Dim dte As String = ""
            Try
                If Rdr.GetValue(7).ToString.Trim <> "" Then
                    dte = Format(CDate(Rdr.GetValue(7).ToString), "dd-MM-yyyy")
                End If
                'Appdata.tblapp.AddtblappRow(Format(Val(Rdr.GetValue(0).ToString), "000000"), Rdr.GetValue(6).ToString, Replace(Replace(Rdr.GetValue(1).ToString, "1", "Male"), "0", "Female"), Rdr.GetValue(3).ToString, Replace(Replace(Rdr.GetValue(4).ToString, "1", "PM"), "0", "AM"), Replace(Replace(Rdr.GetValue(2).ToString, "1", "មករួចហើយ"), "0", "--"), dte, Rdr.GetValue(8).ToString, Rdr.GetValue(9).ToString, Rdr.GetValue(10).ToString)
                Appdata.tblapp.AddtblappRow(Format(Val(Rdr.GetValue(0).ToString), "000000"), Rdr.GetValue(6).ToString, Rdr.GetValue(1).ToString, Rdr.GetValue(3).ToString, Rdr.GetValue(4).ToString, Rdr.GetValue(2).ToString, dte, Rdr.GetValue(8).ToString, Rdr.GetValue(9).ToString, Rdr.GetValue(10).ToString, Rdr.GetValue(11).ToString)
                lblAdult.Text = Val(lblAdult.Text) + 1
                Select Case Val(Rdr.GetValue(4).ToString)
                    Case 0
                        lblAm.Text = Val(lblAm.Text) + 1
                    Case Else
                        lblPM.Text = Val(lblPM.Text) + 1
                End Select
            Catch ex As Exception
                'MessageBox.Show("Show errors " & ex.Message)
            End Try
            '  lblNum.Text = Val(lblNum.Text) + 1
        End While
        datasource = Appdata.tblapp
        Rdr.Close()
        lblClinicID.DataBindings.Add("Text", datasource, "ClinicID")
        lblArt.DataBindings.Add("Text", datasource, "Artnumber")
        lblSex.DataBindings.Add("Text", datasource, "Sex")
        lbldoct.DataBindings.Add("Text", datasource, "DocName")
        lbltime.DataBindings.Add("Text", datasource, "Tim")
        lblStatus.DataBindings.Add("Text", DataSource, "Come")
        XrTableCell9.DataBindings.Add("Text", DataSource, "CD4")
        XrTableCell16.DataBindings.Add("Text", DataSource, "Dat")
        XrTableCell10.DataBindings.Add("Text", DataSource, "Lc")
        XrTableCell12.DataBindings.Add("Text", DataSource, "Lg")
        XrTableCell22.DataBindings.Add("Text", DataSource, "Regimen")
    End Sub
End Class