Partial Public Class frmMain
    Inherits DevExpress.XtraBars.Ribbon.RibbonForm

    ''' <summary>
    ''' Required designer variable.
    ''' </summary>
    Private components As System.ComponentModel.IContainer = Nothing

    ''' <summary>
    ''' Clean up any resources being used.
    ''' </summary>
    ''' <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        If disposing AndAlso (components IsNot Nothing) Then
            components.Dispose()
        End If
        MyBase.Dispose(disposing)
    End Sub

#Region "Windows Form Designer generated code"

    ''' <summary>
    ''' Required method for Designer support - do not modify
    ''' the contents of this method with the code editor.
    ''' </summary>
    Private Sub InitializeComponent()
        Me.components = New System.ComponentModel.Container()
        Dim resources As System.ComponentModel.ComponentResourceManager = New System.ComponentModel.ComponentResourceManager(GetType(frmMain))
        Me.ribbonControl1 = New DevExpress.XtraBars.Ribbon.RibbonControl()
        Me.btniinitial = New DevExpress.XtraBars.BarButtonItem()
        Me.btnAdultInA = New DevExpress.XtraBars.BarButtonItem()
        Me.btnAdultInB = New DevExpress.XtraBars.BarButtonItem()
        Me.btnAdultVisit = New DevExpress.XtraBars.BarButtonItem()
        Me.btnBackup = New DevExpress.XtraBars.BarButtonItem()
        Me.btnUser = New DevExpress.XtraBars.BarButtonItem()
        Me.btnSite = New DevExpress.XtraBars.BarButtonItem()
        Me.BarSubItem1 = New DevExpress.XtraBars.BarSubItem()
        Me.btnAdultIn = New DevExpress.XtraBars.BarButtonItem()
        Me.btnAdultInA1 = New DevExpress.XtraBars.BarButtonItem()
        Me.btnAdultInA2 = New DevExpress.XtraBars.BarButtonItem()
        Me.btnPNTT = New DevExpress.XtraBars.BarButtonItem()
        Me.BarSubItem2 = New DevExpress.XtraBars.BarSubItem()
        Me.btnChildIn = New DevExpress.XtraBars.BarButtonItem()
        Me.btnChildInA1 = New DevExpress.XtraBars.BarButtonItem()
        Me.btnChildVisit = New DevExpress.XtraBars.BarButtonItem()
        Me.btnExvisit = New DevExpress.XtraBars.BarButtonItem()
        Me.btnSetLost = New DevExpress.XtraBars.BarButtonItem()
        Me.btnPatientTest = New DevExpress.XtraBars.BarButtonItem()
        Me.btnInfantTest = New DevExpress.XtraBars.BarButtonItem()
        Me.btnAppoint = New DevExpress.XtraBars.BarButtonItem()
        Me.btnLost = New DevExpress.XtraBars.BarButtonItem()
        Me.BarButtonItem6 = New DevExpress.XtraBars.BarButtonItem()
        Me.btnQRcode = New DevExpress.XtraBars.BarButtonItem()
        Me.btnFingerPrint = New DevExpress.XtraBars.BarButtonItem()
        Me.BtnReport = New DevExpress.XtraBars.BarButtonItem()
        Me.btnReportTransferOut = New DevExpress.XtraBars.BarButtonItem()
        Me.btnDaily = New DevExpress.XtraBars.BarButtonItem()
        Me.btnDoct = New DevExpress.XtraBars.BarButtonItem()
        Me.BtnCheckTest = New DevExpress.XtraBars.BarButtonItem()
        Me.BarButtonItem17 = New DevExpress.XtraBars.BarButtonItem()
        Me.PopupMenu3 = New DevExpress.XtraBars.PopupMenu(Me.components)
        Me.BtnLostRemider = New DevExpress.XtraBars.BarButtonItem()
        Me.PopupMenu2 = New DevExpress.XtraBars.PopupMenu(Me.components)
        Me.btnTempFinger = New DevExpress.XtraBars.BarButtonItem()
        Me.BtnCheckPatient = New DevExpress.XtraBars.BarButtonItem()
        Me.BarButtonItem8 = New DevExpress.XtraBars.BarButtonItem()
        Me.btnCode = New DevExpress.XtraBars.BarButtonItem()
        Me.BarButtonItem1 = New DevExpress.XtraBars.BarButtonItem()
        Me.btnRestore = New DevExpress.XtraBars.BarButtonItem()
        Me.BarButtonItem2 = New DevExpress.XtraBars.BarButtonItem()
        Me.PopupMenu1 = New DevExpress.XtraBars.PopupMenu(Me.components)
        Me.BarSubItem3 = New DevExpress.XtraBars.BarSubItem()
        Me.btnAdultDrug = New DevExpress.XtraBars.BarButtonItem()
        Me.BtnChildDrug = New DevExpress.XtraBars.BarButtonItem()
        Me.BarSubItem4 = New DevExpress.XtraBars.BarSubItem()
        Me.BtnRemidAdult = New DevExpress.XtraBars.BarButtonItem()
        Me.ChildLostRemider = New DevExpress.XtraBars.BarButtonItem()
        Me.BarSubItem5 = New DevExpress.XtraBars.BarSubItem()
        Me.BarSubItem6 = New DevExpress.XtraBars.BarSubItem()
        Me.btnAdultSummary = New DevExpress.XtraBars.BarButtonItem()
        Me.btnChildSammary = New DevExpress.XtraBars.BarButtonItem()
        Me.Infants = New DevExpress.XtraBars.BarButtonItem()
        Me.btnRPNTT = New DevExpress.XtraBars.BarButtonItem()
        Me.btnVCCT = New DevExpress.XtraBars.BarButtonItem()
        Me.btnCounsellor = New DevExpress.XtraBars.BarButtonItem()
        Me.btnRVCCT = New DevExpress.XtraBars.BarButtonItem()
        Me.btnReTest = New DevExpress.XtraBars.BarButtonItem()
        Me.btnQRcodeMargins = New DevExpress.XtraBars.BarButtonItem()
        Me.btnUpdate = New DevExpress.XtraBars.BarButtonItem()
        Me.btnopenrunscript = New DevExpress.XtraBars.BarButtonItem()
        Me.btnopenupdateart = New DevExpress.XtraBars.BarButtonItem()
        Me.tbnshowrefuges = New DevExpress.XtraBars.BarButtonItem()
        Me.RibbonPage5 = New DevExpress.XtraBars.Ribbon.RibbonPage()
        Me.RibbonPageGroup8 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.ribbonPage1 = New DevExpress.XtraBars.Ribbon.RibbonPage()
        Me.ribbonPageGroup1 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.RibbonPageGroup3 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.RibbonPageGroup4 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.RibbonPage4 = New DevExpress.XtraBars.Ribbon.RibbonPage()
        Me.RibbonPageGroup5 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.RibbonPageGroup7 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.RibbonPage2 = New DevExpress.XtraBars.Ribbon.RibbonPage()
        Me.RibbonPageGroup2 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.RibbonPage3 = New DevExpress.XtraBars.Ribbon.RibbonPage()
        Me.RibbonPageGroup6 = New DevExpress.XtraBars.Ribbon.RibbonPageGroup()
        Me.DefaultLookAndFeel1 = New DevExpress.LookAndFeel.DefaultLookAndFeel(Me.components)
        Me.XtraTabbedMdiManager1 = New DevExpress.XtraTabbedMdi.XtraTabbedMdiManager(Me.components)
        Me.StatusStrip1 = New System.Windows.Forms.StatusStrip()
        Me.ToolStripStatusLabel1 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel2 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel3 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel4 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel5 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel6 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel7 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.tsbUserName = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel8 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.ToolStripStatusLabel9 = New System.Windows.Forms.ToolStripStatusLabel()
        Me.OpenFileDialog1 = New System.Windows.Forms.OpenFileDialog()
        CType(Me.ribbonControl1, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.PopupMenu3, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.PopupMenu2, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.PopupMenu1, System.ComponentModel.ISupportInitialize).BeginInit()
        CType(Me.XtraTabbedMdiManager1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.StatusStrip1.SuspendLayout()
        Me.SuspendLayout()
        '
        'ribbonControl1
        '
        Me.ribbonControl1.EmptyAreaImageOptions.ImagePadding = New System.Windows.Forms.Padding(24)
        Me.ribbonControl1.ExpandCollapseItem.Id = 0
        Me.ribbonControl1.Items.AddRange(New DevExpress.XtraBars.BarItem() {Me.ribbonControl1.ExpandCollapseItem, Me.ribbonControl1.SearchEditItem, Me.btniinitial, Me.btnAdultInA, Me.btnAdultInB, Me.btnAdultVisit, Me.btnBackup, Me.btnUser, Me.btnSite, Me.BarSubItem1, Me.btnAdultIn, Me.btnAdultInA1, Me.btnAdultInA2, Me.BarSubItem2, Me.btnChildIn, Me.btnChildInA1, Me.btnChildVisit, Me.btnExvisit, Me.btnSetLost, Me.btnPatientTest, Me.btnInfantTest, Me.btnAppoint, Me.btnLost, Me.BarButtonItem6, Me.btnQRcode, Me.btnFingerPrint, Me.BtnReport, Me.btnReportTransferOut, Me.btnDaily, Me.btnDoct, Me.BtnCheckTest, Me.BarButtonItem17, Me.BtnLostRemider, Me.btnTempFinger, Me.BtnCheckPatient, Me.BarButtonItem8, Me.btnCode, Me.btnPNTT, Me.BarButtonItem1, Me.btnRestore, Me.BarButtonItem2, Me.BarSubItem3, Me.btnAdultDrug, Me.BtnChildDrug, Me.BarSubItem4, Me.BtnRemidAdult, Me.ChildLostRemider, Me.BarSubItem5, Me.BarSubItem6, Me.btnAdultSummary, Me.btnChildSammary, Me.Infants, Me.btnRPNTT, Me.btnVCCT, Me.btnCounsellor, Me.btnRVCCT, Me.btnReTest, Me.btnQRcodeMargins, Me.btnUpdate, Me.btnopenrunscript, Me.btnopenupdateart, Me.tbnshowrefuges})
        Me.ribbonControl1.Location = New System.Drawing.Point(0, 0)
        Me.ribbonControl1.Margin = New System.Windows.Forms.Padding(2, 3, 2, 3)
        Me.ribbonControl1.MaxItemId = 73
        Me.ribbonControl1.Name = "ribbonControl1"
        Me.ribbonControl1.OptionsMenuMinWidth = 385
        Me.ribbonControl1.Pages.AddRange(New DevExpress.XtraBars.Ribbon.RibbonPage() {Me.RibbonPage5, Me.ribbonPage1, Me.RibbonPage4, Me.RibbonPage2, Me.RibbonPage3})
        Me.ribbonControl1.RibbonStyle = DevExpress.XtraBars.Ribbon.RibbonControlStyle.Office2010
        Me.ribbonControl1.Size = New System.Drawing.Size(1224, 193)
        '
        'btniinitial
        '
        Me.btniinitial.Caption = "Initial "
        Me.btniinitial.Hint = "Infant initial visit"
        Me.btniinitial.Id = 1
        Me.btniinitial.ImageOptions.Image = Global.ART.My.Resources.Resources.baby_drinking_icon
        Me.btniinitial.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.baby_drinking_icon
        Me.btniinitial.Name = "btniinitial"
        '
        'btnAdultInA
        '
        Me.btnAdultInA.ActAsDropDown = True
        Me.btnAdultInA.ButtonStyle = DevExpress.XtraBars.BarButtonStyle.DropDown
        Me.btnAdultInA.Caption = "Initial-A"
        Me.btnAdultInA.Hint = "Adult Initial Visit (form A)"
        Me.btnAdultInA.Id = 5
        Me.btnAdultInA.ImageOptions.Image = Global.ART.My.Resources.Resources.newemployee_16x16
        Me.btnAdultInA.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.newemployee_32x32
        Me.btnAdultInA.Name = "btnAdultInA"
        '
        'btnAdultInB
        '
        Me.btnAdultInB.Caption = "Initial-B"
        Me.btnAdultInB.Hint = "Adult Initial Visit (form B)"
        Me.btnAdultInB.Id = 6
        Me.btnAdultInB.ImageOptions.Image = Global.ART.My.Resources.Resources.newgroup_16x16
        Me.btnAdultInB.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.newgroup_32x32
        Me.btnAdultInB.Name = "btnAdultInB"
        '
        'btnAdultVisit
        '
        Me.btnAdultVisit.Caption = "Visit"
        Me.btnAdultVisit.Hint = "Adult Visits"
        Me.btnAdultVisit.Id = 7
        Me.btnAdultVisit.ImageOptions.Image = Global.ART.My.Resources.Resources.employees_16x16
        Me.btnAdultVisit.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.employees_32x32
        Me.btnAdultVisit.Name = "btnAdultVisit"
        '
        'btnBackup
        '
        Me.btnBackup.Caption = "BackUp"
        Me.btnBackup.Hint = "រក្សាទុកdatabase"
        Me.btnBackup.Id = 13
        Me.btnBackup.ImageOptions.Image = CType(resources.GetObject("btnBackup.ImageOptions.Image"), System.Drawing.Image)
        Me.btnBackup.ImageOptions.LargeImage = CType(resources.GetObject("btnBackup.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnBackup.Name = "btnBackup"
        '
        'btnUser
        '
        Me.btnUser.Caption = "User"
        Me.btnUser.Hint = "បង្កើតអ្នកប្រើប្រាស់កម្មវិធីនិងដូរលេខសំងាត់"
        Me.btnUser.Id = 14
        Me.btnUser.ImageOptions.Image = CType(resources.GetObject("btnUser.ImageOptions.Image"), System.Drawing.Image)
        Me.btnUser.ImageOptions.LargeImage = CType(resources.GetObject("btnUser.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnUser.Name = "btnUser"
        '
        'btnSite
        '
        Me.btnSite.Caption = "Site"
        Me.btnSite.Hint = "ដាក់ឈ្មោះទីកន្លែងសេវា"
        Me.btnSite.Id = 15
        Me.btnSite.ImageOptions.Image = CType(resources.GetObject("btnSite.ImageOptions.Image"), System.Drawing.Image)
        Me.btnSite.ImageOptions.LargeImage = CType(resources.GetObject("btnSite.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnSite.Name = "btnSite"
        '
        'BarSubItem1
        '
        Me.BarSubItem1.Caption = "Initial "
        Me.BarSubItem1.Id = 17
        Me.BarSubItem1.ImageOptions.Image = CType(resources.GetObject("BarSubItem1.ImageOptions.Image"), System.Drawing.Image)
        Me.BarSubItem1.ImageOptions.LargeImage = CType(resources.GetObject("BarSubItem1.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.BarSubItem1.LinksPersistInfo.AddRange(New DevExpress.XtraBars.LinkPersistInfo() {New DevExpress.XtraBars.LinkPersistInfo(DevExpress.XtraBars.BarLinkUserDefines.PaintStyle, Me.btnAdultIn, DevExpress.XtraBars.BarItemPaintStyle.CaptionGlyph), New DevExpress.XtraBars.LinkPersistInfo(Me.btnAdultInA1), New DevExpress.XtraBars.LinkPersistInfo(Me.btnAdultInA2), New DevExpress.XtraBars.LinkPersistInfo(Me.btnPNTT)})
        Me.BarSubItem1.Name = "BarSubItem1"
        '
        'btnAdultIn
        '
        Me.btnAdultIn.Caption = "Initial Form"
        Me.btnAdultIn.Id = 18
        Me.btnAdultIn.ImageOptions.Image = Global.ART.My.Resources.Resources.newgroup_16x16
        Me.btnAdultIn.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.newgroup_16x16
        Me.btnAdultIn.Name = "btnAdultIn"
        '
        'btnAdultInA1
        '
        Me.btnAdultInA1.Caption = "Form A1"
        Me.btnAdultInA1.Id = 19
        Me.btnAdultInA1.ImageOptions.Image = Global.ART.My.Resources.Resources.newemployee_16x16
        Me.btnAdultInA1.Name = "btnAdultInA1"
        '
        'btnAdultInA2
        '
        Me.btnAdultInA2.Caption = "Form A2"
        Me.btnAdultInA2.Id = 20
        Me.btnAdultInA2.ImageOptions.Image = CType(resources.GetObject("btnAdultInA2.ImageOptions.Image"), System.Drawing.Image)
        Me.btnAdultInA2.ImageOptions.LargeImage = CType(resources.GetObject("btnAdultInA2.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnAdultInA2.Name = "btnAdultInA2"
        Me.btnAdultInA2.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'btnPNTT
        '
        Me.btnPNTT.Caption = "PNTT"
        Me.btnPNTT.Id = 47
        Me.btnPNTT.ImageOptions.Image = CType(resources.GetObject("btnPNTT.ImageOptions.Image"), System.Drawing.Image)
        Me.btnPNTT.ImageOptions.LargeImage = CType(resources.GetObject("btnPNTT.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnPNTT.Name = "btnPNTT"
        '
        'BarSubItem2
        '
        Me.BarSubItem2.Caption = "Initial "
        Me.BarSubItem2.Id = 23
        Me.BarSubItem2.ImageOptions.Image = Global.ART.My.Resources.Resources.Boo_icon
        Me.BarSubItem2.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.Boo_icon
        Me.BarSubItem2.LinksPersistInfo.AddRange(New DevExpress.XtraBars.LinkPersistInfo() {New DevExpress.XtraBars.LinkPersistInfo(DevExpress.XtraBars.BarLinkUserDefines.PaintStyle, Me.btnChildIn, DevExpress.XtraBars.BarItemPaintStyle.CaptionGlyph), New DevExpress.XtraBars.LinkPersistInfo(Me.btnChildInA1)})
        Me.BarSubItem2.Name = "BarSubItem2"
        '
        'btnChildIn
        '
        Me.btnChildIn.Caption = "Initial Form"
        Me.btnChildIn.Id = 24
        Me.btnChildIn.ImageOptions.Image = Global.ART.My.Resources.Resources.childIn
        Me.btnChildIn.Name = "btnChildIn"
        '
        'btnChildInA1
        '
        Me.btnChildInA1.Caption = "Form A1"
        Me.btnChildInA1.Id = 25
        Me.btnChildInA1.ImageOptions.Image = Global.ART.My.Resources.Resources.childInA
        Me.btnChildInA1.Name = "btnChildInA1"
        '
        'btnChildVisit
        '
        Me.btnChildVisit.Caption = "Visit"
        Me.btnChildVisit.Id = 26
        Me.btnChildVisit.ImageOptions.Image = Global.ART.My.Resources.Resources.childvisit
        Me.btnChildVisit.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.childvisit
        Me.btnChildVisit.Name = "btnChildVisit"
        '
        'btnExvisit
        '
        Me.btnExvisit.Caption = "Visit"
        Me.btnExvisit.Id = 27
        Me.btnExvisit.ImageOptions.Image = Global.ART.My.Resources.Resources.baby_laughing_icon
        Me.btnExvisit.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.baby_laughing_icon
        Me.btnExvisit.Name = "btnExvisit"
        '
        'btnSetLost
        '
        Me.btnSetLost.Caption = "Set Lost"
        Me.btnSetLost.Hint = "កំណត់រយៈពេលបោះបង់របស់អ្នកជំងឺ"
        Me.btnSetLost.Id = 28
        Me.btnSetLost.ImageOptions.Image = CType(resources.GetObject("btnSetLost.ImageOptions.Image"), System.Drawing.Image)
        Me.btnSetLost.ImageOptions.LargeImage = CType(resources.GetObject("btnSetLost.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnSetLost.Name = "btnSetLost"
        '
        'btnPatientTest
        '
        Me.btnPatientTest.Caption = "Patients-Test"
        Me.btnPatientTest.Hint = "បញ្ចូលលទ្ធផលតេស្តរបស់អ្នកជំងឺ(កូនក្មេង និង មនុស្សធំ)"
        Me.btnPatientTest.Id = 29
        Me.btnPatientTest.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.Patient
        Me.btnPatientTest.Name = "btnPatientTest"
        '
        'btnInfantTest
        '
        Me.btnInfantTest.Caption = "Infant-Test"
        Me.btnInfantTest.Hint = "បញ្ចូលពត៌មានលទ្ធផលតេស្តកូនង៉ែត"
        Me.btnInfantTest.Id = 30
        Me.btnInfantTest.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.infanttest
        Me.btnInfantTest.Name = "btnInfantTest"
        '
        'btnAppoint
        '
        Me.btnAppoint.Caption = "Appointments"
        Me.btnAppoint.Hint = "កំណត់ថ្ងៃណាត់ជួបរវាងអ្នកជំងឺនិងគ្រូពេទ្យ"
        Me.btnAppoint.Id = 31
        Me.btnAppoint.ImageOptions.Image = CType(resources.GetObject("btnAppoint.ImageOptions.Image"), System.Drawing.Image)
        Me.btnAppoint.ImageOptions.LargeImage = CType(resources.GetObject("btnAppoint.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnAppoint.Name = "btnAppoint"
        Me.btnAppoint.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'btnLost
        '
        Me.btnLost.Caption = "Find Lost"
        Me.btnLost.Hint = "ស្វែងរកការបោះបង់អ្នកជំងឺ"
        Me.btnLost.Id = 32
        Me.btnLost.ImageOptions.Image = CType(resources.GetObject("btnLost.ImageOptions.Image"), System.Drawing.Image)
        Me.btnLost.ImageOptions.LargeImage = CType(resources.GetObject("btnLost.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnLost.Name = "btnLost"
        '
        'BarButtonItem6
        '
        Me.BarButtonItem6.Caption = "Died"
        Me.BarButtonItem6.Hint = "បញ្ចូលពត៌មានអ្នកជំងឺស្លាប់"
        Me.BarButtonItem6.Id = 33
        Me.BarButtonItem6.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.patientdied
        Me.BarButtonItem6.Name = "BarButtonItem6"
        Me.BarButtonItem6.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'btnQRcode
        '
        Me.btnQRcode.Caption = "QRcode"
        Me.btnQRcode.Hint = "Barcode បិតលើទីបឈាម"
        Me.btnQRcode.Id = 34
        Me.btnQRcode.ImageOptions.Image = Global.ART.My.Resources.Resources.images
        Me.btnQRcode.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.images
        Me.btnQRcode.Name = "btnQRcode"
        '
        'btnFingerPrint
        '
        Me.btnFingerPrint.Caption = "FingerPrint"
        Me.btnFingerPrint.Hint = "បង្កើតស្នាមម្រាមដៃនិងស្វែងរក"
        Me.btnFingerPrint.Id = 35
        Me.btnFingerPrint.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.fingerPrint
        Me.btnFingerPrint.Name = "btnFingerPrint"
        Me.btnFingerPrint.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'BtnReport
        '
        Me.BtnReport.Caption = "National"
        Me.BtnReport.Hint = "ធ្វើរបាយការណ៍សម្រាប់ថ្នាក់ជាតិ(កូនក្មេង,មនុស្សធំ និង ទារក)"
        Me.BtnReport.Id = 36
        Me.BtnReport.ImageOptions.Image = CType(resources.GetObject("BtnReport.ImageOptions.Image"), System.Drawing.Image)
        Me.BtnReport.ImageOptions.LargeImage = CType(resources.GetObject("BtnReport.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.BtnReport.Name = "BtnReport"
        '
        'btnReportTransferOut
        '
        Me.btnReportTransferOut.Caption = "Transfer-Out"
        Me.btnReportTransferOut.Hint = "លិខិតបញ្ចូនចេញ"
        Me.btnReportTransferOut.Id = 37
        Me.btnReportTransferOut.ImageOptions.Image = CType(resources.GetObject("btnReportTransferOut.ImageOptions.Image"), System.Drawing.Image)
        Me.btnReportTransferOut.ImageOptions.LargeImage = CType(resources.GetObject("btnReportTransferOut.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnReportTransferOut.Name = "btnReportTransferOut"
        '
        'btnDaily
        '
        Me.btnDaily.Caption = "Daily"
        Me.btnDaily.Hint = "របាយការណ៍ណាត់ជូបអ្នកជំងឺនិងគ្រូពេទ្យប្រចាំថ្ងៃ"
        Me.btnDaily.Id = 38
        Me.btnDaily.ImageOptions.Image = CType(resources.GetObject("btnDaily.ImageOptions.Image"), System.Drawing.Image)
        Me.btnDaily.ImageOptions.LargeImage = CType(resources.GetObject("btnDaily.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnDaily.Name = "btnDaily"
        '
        'btnDoct
        '
        Me.btnDoct.Caption = "Doctor"
        Me.btnDoct.Hint = "បញ្ចូលឈ្មោះគ្រូពេទ្យ"
        Me.btnDoct.Id = 39
        Me.btnDoct.ImageOptions.Image = CType(resources.GetObject("btnDoct.ImageOptions.Image"), System.Drawing.Image)
        Me.btnDoct.ImageOptions.LargeImage = CType(resources.GetObject("btnDoct.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnDoct.Name = "btnDoct"
        '
        'BtnCheckTest
        '
        Me.BtnCheckTest.Caption = "Check-Test"
        Me.BtnCheckTest.Hint = "ស្វែងរកអ្នកជំងឺត្រូវធ្ថើតេស្ត "
        Me.BtnCheckTest.Id = 40
        Me.BtnCheckTest.ImageOptions.Image = CType(resources.GetObject("BtnCheckTest.ImageOptions.Image"), System.Drawing.Image)
        Me.BtnCheckTest.ImageOptions.LargeImage = CType(resources.GetObject("BtnCheckTest.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.BtnCheckTest.Name = "BtnCheckTest"
        Me.BtnCheckTest.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'BarButtonItem17
        '
        Me.BarButtonItem17.ActAsDropDown = True
        Me.BarButtonItem17.ButtonStyle = DevExpress.XtraBars.BarButtonStyle.CheckDropDown
        Me.BarButtonItem17.Caption = "Summary"
        Me.BarButtonItem17.DropDownControl = Me.PopupMenu3
        Me.BarButtonItem17.Hint = "ប្រវត្តរបស់អ្នកជំងឺ"
        Me.BarButtonItem17.Id = 41
        Me.BarButtonItem17.ImageOptions.Image = CType(resources.GetObject("BarButtonItem17.ImageOptions.Image"), System.Drawing.Image)
        Me.BarButtonItem17.ImageOptions.LargeImage = CType(resources.GetObject("BarButtonItem17.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.BarButtonItem17.Name = "BarButtonItem17"
        '
        'PopupMenu3
        '
        Me.PopupMenu3.Name = "PopupMenu3"
        Me.PopupMenu3.Ribbon = Me.ribbonControl1
        '
        'BtnLostRemider
        '
        Me.BtnLostRemider.ActAsDropDown = True
        Me.BtnLostRemider.ButtonStyle = DevExpress.XtraBars.BarButtonStyle.DropDown
        Me.BtnLostRemider.Caption = "Lost Remider"
        Me.BtnLostRemider.DropDownControl = Me.PopupMenu2
        Me.BtnLostRemider.Hint = "ស្វែងរកអ្នកជំងឺរៀបនឹងបោះបង់ "
        Me.BtnLostRemider.Id = 42
        Me.BtnLostRemider.ImageOptions.Image = CType(resources.GetObject("BtnLostRemider.ImageOptions.Image"), System.Drawing.Image)
        Me.BtnLostRemider.ImageOptions.LargeImage = CType(resources.GetObject("BtnLostRemider.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.BtnLostRemider.Name = "BtnLostRemider"
        '
        'PopupMenu2
        '
        Me.PopupMenu2.Name = "PopupMenu2"
        Me.PopupMenu2.Ribbon = Me.ribbonControl1
        '
        'btnTempFinger
        '
        Me.btnTempFinger.Caption = "Temp FingerPrint"
        Me.btnTempFinger.Hint = "ស្វែងរកស្នាមម្រាមដៃមិនទានបញ្ចូល"
        Me.btnTempFinger.Id = 43
        Me.btnTempFinger.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.tempfinger
        Me.btnTempFinger.Name = "btnTempFinger"
        Me.btnTempFinger.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'BtnCheckPatient
        '
        Me.BtnCheckPatient.Caption = "View Lost"
        Me.BtnCheckPatient.Id = 44
        Me.BtnCheckPatient.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.PatientSearch
        Me.BtnCheckPatient.Name = "BtnCheckPatient"
        '
        'BarButtonItem8
        '
        Me.BarButtonItem8.Caption = "Viral-load-Alert"
        Me.BarButtonItem8.Id = 45
        Me.BarButtonItem8.ImageOptions.Image = CType(resources.GetObject("BarButtonItem8.ImageOptions.Image"), System.Drawing.Image)
        Me.BarButtonItem8.ImageOptions.LargeImage = CType(resources.GetObject("BarButtonItem8.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.BarButtonItem8.Name = "BarButtonItem8"
        Me.BarButtonItem8.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'btnCode
        '
        Me.btnCode.Caption = "Code"
        Me.btnCode.Id = 46
        Me.btnCode.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.banary
        Me.btnCode.Name = "btnCode"
        '
        'BarButtonItem1
        '
        Me.BarButtonItem1.Caption = "BarButtonItem1"
        Me.BarButtonItem1.Id = 48
        Me.BarButtonItem1.ImageOptions.Image = Global.ART.My.Resources.Resources.refresh2_32x32
        Me.BarButtonItem1.Name = "BarButtonItem1"
        '
        'btnRestore
        '
        Me.btnRestore.Caption = "Restore"
        Me.btnRestore.Hint = "Restore Data"
        Me.btnRestore.Id = 49
        Me.btnRestore.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.data_cd
        Me.btnRestore.Name = "btnRestore"
        '
        'BarButtonItem2
        '
        Me.BarButtonItem2.ActAsDropDown = True
        Me.BarButtonItem2.ButtonStyle = DevExpress.XtraBars.BarButtonStyle.DropDown
        Me.BarButtonItem2.Caption = "BarButtonItem2"
        Me.BarButtonItem2.DropDownControl = Me.PopupMenu1
        Me.BarButtonItem2.Id = 50
        Me.BarButtonItem2.Name = "BarButtonItem2"
        '
        'PopupMenu1
        '
        Me.PopupMenu1.Name = "PopupMenu1"
        Me.PopupMenu1.Ribbon = Me.ribbonControl1
        '
        'BarSubItem3
        '
        Me.BarSubItem3.Caption = "Drug Regimen"
        Me.BarSubItem3.Id = 51
        Me.BarSubItem3.ImageOptions.Image = Global.ART.My.Resources.Resources.Medical_Drug_basket
        Me.BarSubItem3.LinksPersistInfo.AddRange(New DevExpress.XtraBars.LinkPersistInfo() {New DevExpress.XtraBars.LinkPersistInfo(CType((DevExpress.XtraBars.BarLinkUserDefines.Caption Or DevExpress.XtraBars.BarLinkUserDefines.PaintStyle), DevExpress.XtraBars.BarLinkUserDefines), Me.btnAdultDrug, "Adult", False, True, True, 0, Nothing, DevExpress.XtraBars.BarItemPaintStyle.CaptionGlyph), New DevExpress.XtraBars.LinkPersistInfo(Me.BtnChildDrug)})
        Me.BarSubItem3.Name = "BarSubItem3"
        Me.BarSubItem3.RibbonStyle = DevExpress.XtraBars.Ribbon.RibbonItemStyles.Large
        '
        'btnAdultDrug
        '
        Me.btnAdultDrug.Caption = "Adult"
        Me.btnAdultDrug.Id = 52
        Me.btnAdultDrug.ImageOptions.Image = Global.ART.My.Resources.Resources.pill_icon1
        Me.btnAdultDrug.Name = "btnAdultDrug"
        '
        'BtnChildDrug
        '
        Me.BtnChildDrug.Caption = "Child"
        Me.BtnChildDrug.Id = 53
        Me.BtnChildDrug.ImageOptions.Image = Global.ART.My.Resources.Resources.asperin
        Me.BtnChildDrug.Name = "BtnChildDrug"
        '
        'BarSubItem4
        '
        Me.BarSubItem4.Caption = "Lost Remider"
        Me.BarSubItem4.Id = 55
        Me.BarSubItem4.ImageOptions.SvgImage = CType(resources.GetObject("BarSubItem4.ImageOptions.SvgImage"), DevExpress.Utils.Svg.SvgImage)
        Me.BarSubItem4.LinksPersistInfo.AddRange(New DevExpress.XtraBars.LinkPersistInfo() {New DevExpress.XtraBars.LinkPersistInfo(DevExpress.XtraBars.BarLinkUserDefines.PaintStyle, Me.BtnRemidAdult, DevExpress.XtraBars.BarItemPaintStyle.CaptionGlyph), New DevExpress.XtraBars.LinkPersistInfo(DevExpress.XtraBars.BarLinkUserDefines.PaintStyle, Me.ChildLostRemider, DevExpress.XtraBars.BarItemPaintStyle.CaptionGlyph)})
        Me.BarSubItem4.Name = "BarSubItem4"
        '
        'BtnRemidAdult
        '
        Me.BtnRemidAdult.Caption = "Adult"
        Me.BtnRemidAdult.Id = 56
        Me.BtnRemidAdult.ImageOptions.Image = CType(resources.GetObject("BtnRemidAdult.ImageOptions.Image"), System.Drawing.Image)
        Me.BtnRemidAdult.ImageOptions.LargeImage = CType(resources.GetObject("BtnRemidAdult.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.BtnRemidAdult.Name = "BtnRemidAdult"
        '
        'ChildLostRemider
        '
        Me.ChildLostRemider.Caption = "Child"
        Me.ChildLostRemider.Id = 57
        Me.ChildLostRemider.ImageOptions.Image = CType(resources.GetObject("ChildLostRemider.ImageOptions.Image"), System.Drawing.Image)
        Me.ChildLostRemider.Name = "ChildLostRemider"
        '
        'BarSubItem5
        '
        Me.BarSubItem5.Caption = "BarSubItem5"
        Me.BarSubItem5.Id = 58
        Me.BarSubItem5.Name = "BarSubItem5"
        '
        'BarSubItem6
        '
        Me.BarSubItem6.Caption = "Summary"
        Me.BarSubItem6.Hint = "ប្រវត្តរបស់អ្នកជំងឺ"
        Me.BarSubItem6.Id = 59
        Me.BarSubItem6.ImageOptions.SvgImage = CType(resources.GetObject("BarSubItem6.ImageOptions.SvgImage"), DevExpress.Utils.Svg.SvgImage)
        Me.BarSubItem6.LinksPersistInfo.AddRange(New DevExpress.XtraBars.LinkPersistInfo() {New DevExpress.XtraBars.LinkPersistInfo(Me.btnAdultSummary), New DevExpress.XtraBars.LinkPersistInfo(Me.btnChildSammary)})
        Me.BarSubItem6.Name = "BarSubItem6"
        '
        'btnAdultSummary
        '
        Me.btnAdultSummary.Caption = "Adult"
        Me.btnAdultSummary.Id = 60
        Me.btnAdultSummary.ImageOptions.SvgImage = CType(resources.GetObject("btnAdultSummary.ImageOptions.SvgImage"), DevExpress.Utils.Svg.SvgImage)
        Me.btnAdultSummary.Name = "btnAdultSummary"
        '
        'btnChildSammary
        '
        Me.btnChildSammary.Caption = "Child"
        Me.btnChildSammary.Id = 61
        Me.btnChildSammary.ImageOptions.SvgImage = CType(resources.GetObject("btnChildSammary.ImageOptions.SvgImage"), DevExpress.Utils.Svg.SvgImage)
        Me.btnChildSammary.Name = "btnChildSammary"
        '
        'Infants
        '
        Me.Infants.ActAsDropDown = True
        Me.Infants.ButtonStyle = DevExpress.XtraBars.BarButtonStyle.DropDown
        Me.Infants.Caption = "Infants"
        Me.Infants.Id = 62
        Me.Infants.ImageOptions.LargeImage = Global.ART.My.Resources.Resources.hiclipart
        Me.Infants.Name = "Infants"
        Me.Infants.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'btnRPNTT
        '
        Me.btnRPNTT.Caption = "PNTT"
        Me.btnRPNTT.Id = 63
        Me.btnRPNTT.ImageOptions.Image = CType(resources.GetObject("btnRPNTT.ImageOptions.Image"), System.Drawing.Image)
        Me.btnRPNTT.ImageOptions.LargeImage = CType(resources.GetObject("btnRPNTT.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnRPNTT.Name = "btnRPNTT"
        '
        'btnVCCT
        '
        Me.btnVCCT.Caption = "VCCT"
        Me.btnVCCT.Id = 64
        Me.btnVCCT.ImageOptions.Image = Global.ART.My.Resources.Resources.vcct
        Me.btnVCCT.Name = "btnVCCT"
        Me.btnVCCT.RibbonStyle = CType(((DevExpress.XtraBars.Ribbon.RibbonItemStyles.Large Or DevExpress.XtraBars.Ribbon.RibbonItemStyles.SmallWithText) _
            Or DevExpress.XtraBars.Ribbon.RibbonItemStyles.SmallWithoutText), DevExpress.XtraBars.Ribbon.RibbonItemStyles)
        '
        'btnCounsellor
        '
        Me.btnCounsellor.Caption = "Counselor"
        Me.btnCounsellor.Hint = "បញ្ចូលឈ្មោះអ្នកផ្តល់ប្រឹក្សា"
        Me.btnCounsellor.Id = 65
        Me.btnCounsellor.ImageOptions.SvgImage = CType(resources.GetObject("btnCounsellor.ImageOptions.SvgImage"), DevExpress.Utils.Svg.SvgImage)
        Me.btnCounsellor.Name = "btnCounsellor"
        Me.btnCounsellor.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'btnRVCCT
        '
        Me.btnRVCCT.Caption = "VCCT"
        Me.btnRVCCT.CloseSubMenuOnClickMode = DevExpress.Utils.DefaultBoolean.[True]
        Me.btnRVCCT.Hint = "របាយការណ៍ VCCT"
        Me.btnRVCCT.Id = 66
        Me.btnRVCCT.ImageOptions.SvgImage = CType(resources.GetObject("btnRVCCT.ImageOptions.SvgImage"), DevExpress.Utils.Svg.SvgImage)
        Me.btnRVCCT.Name = "btnRVCCT"
        Me.btnRVCCT.RibbonStyle = DevExpress.XtraBars.Ribbon.RibbonItemStyles.Large
        Me.btnRVCCT.Visibility = DevExpress.XtraBars.BarItemVisibility.Never
        '
        'btnReTest
        '
        Me.btnReTest.Caption = "ReTest"
        Me.btnReTest.Id = 67
        Me.btnReTest.ImageOptions.SvgImage = CType(resources.GetObject("btnReTest.ImageOptions.SvgImage"), DevExpress.Utils.Svg.SvgImage)
        Me.btnReTest.Name = "btnReTest"
        '
        'btnQRcodeMargins
        '
        Me.btnQRcodeMargins.Caption = "QRcodeMargins"
        Me.btnQRcodeMargins.Id = 68
        Me.btnQRcodeMargins.ImageOptions.Image = CType(resources.GetObject("btnQRcodeMargins.ImageOptions.Image"), System.Drawing.Image)
        Me.btnQRcodeMargins.ImageOptions.LargeImage = CType(resources.GetObject("btnQRcodeMargins.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnQRcodeMargins.Name = "btnQRcodeMargins"
        '
        'btnUpdate
        '
        Me.btnUpdate.Caption = "Update"
        Me.btnUpdate.Id = 69
        Me.btnUpdate.ImageOptions.Image = CType(resources.GetObject("btnUpdate.ImageOptions.Image"), System.Drawing.Image)
        Me.btnUpdate.ImageOptions.LargeImage = CType(resources.GetObject("btnUpdate.ImageOptions.LargeImage"), System.Drawing.Image)
        Me.btnUpdate.Name = "btnUpdate"
        '
        'btnopenrunscript
        '
        Me.btnopenrunscript.Caption = "Open Run Script"
        Me.btnopenrunscript.Id = 70
        Me.btnopenrunscript.ImageOptions.Image = Global.ART.My.Resources.Resources.browser
        Me.btnopenrunscript.Name = "btnopenrunscript"
        Me.btnopenrunscript.RibbonStyle = DevExpress.XtraBars.Ribbon.RibbonItemStyles.Large
        '
        'btnopenupdateart
        '
        Me.btnopenupdateart.Caption = "Open ART Update"
        Me.btnopenupdateart.Id = 71
        Me.btnopenupdateart.ImageOptions.Image = Global.ART.My.Resources.Resources.update
        Me.btnopenupdateart.Name = "btnopenupdateart"
        Me.btnopenupdateart.RibbonStyle = DevExpress.XtraBars.Ribbon.RibbonItemStyles.Large
        '
        'tbnshowrefuges
        '
        Me.tbnshowrefuges.Caption = "Refuge"
        Me.tbnshowrefuges.Id = 72
        Me.tbnshowrefuges.ImageOptions.Image = Global.ART.My.Resources.Resources.asylum
        Me.tbnshowrefuges.Name = "tbnshowrefuges"
        Me.tbnshowrefuges.RibbonStyle = DevExpress.XtraBars.Ribbon.RibbonItemStyles.Large
        '
        'RibbonPage5
        '
        Me.RibbonPage5.Groups.AddRange(New DevExpress.XtraBars.Ribbon.RibbonPageGroup() {Me.RibbonPageGroup8})
        Me.RibbonPage5.Name = "RibbonPage5"
        Me.RibbonPage5.Text = "VCCT"
        Me.RibbonPage5.Visible = False
        '
        'RibbonPageGroup8
        '
        Me.RibbonPageGroup8.ItemLinks.Add(Me.btnVCCT)
        Me.RibbonPageGroup8.ItemLinks.Add(Me.btnReTest)
        Me.RibbonPageGroup8.Name = "RibbonPageGroup8"
        '
        'ribbonPage1
        '
        Me.ribbonPage1.Groups.AddRange(New DevExpress.XtraBars.Ribbon.RibbonPageGroup() {Me.ribbonPageGroup1, Me.RibbonPageGroup3, Me.RibbonPageGroup4})
        Me.ribbonPage1.Name = "ribbonPage1"
        Me.ribbonPage1.Text = "Type of Patients"
        '
        'ribbonPageGroup1
        '
        Me.ribbonPageGroup1.ItemLinks.Add(Me.btniinitial)
        Me.ribbonPageGroup1.ItemLinks.Add(Me.btnExvisit)
        Me.ribbonPageGroup1.Name = "ribbonPageGroup1"
        Me.ribbonPageGroup1.Text = "Infants"
        '
        'RibbonPageGroup3
        '
        Me.RibbonPageGroup3.ItemLinks.Add(Me.BarSubItem2)
        Me.RibbonPageGroup3.ItemLinks.Add(Me.btnChildVisit)
        Me.RibbonPageGroup3.Name = "RibbonPageGroup3"
        Me.RibbonPageGroup3.Text = "Children"
        '
        'RibbonPageGroup4
        '
        Me.RibbonPageGroup4.ItemLinks.Add(Me.BarSubItem1)
        Me.RibbonPageGroup4.ItemLinks.Add(Me.btnAdultVisit)
        Me.RibbonPageGroup4.Name = "RibbonPageGroup4"
        Me.RibbonPageGroup4.Text = "Adult"
        '
        'RibbonPage4
        '
        Me.RibbonPage4.Groups.AddRange(New DevExpress.XtraBars.Ribbon.RibbonPageGroup() {Me.RibbonPageGroup5, Me.RibbonPageGroup7})
        Me.RibbonPage4.Name = "RibbonPage4"
        Me.RibbonPage4.Text = "Patients Status"
        '
        'RibbonPageGroup5
        '
        Me.RibbonPageGroup5.ItemLinks.Add(Me.btnSetLost)
        Me.RibbonPageGroup5.ItemLinks.Add(Me.btnLost)
        Me.RibbonPageGroup5.ItemLinks.Add(Me.BarButtonItem6)
        Me.RibbonPageGroup5.Name = "RibbonPageGroup5"
        Me.RibbonPageGroup5.Text = "Lost and Dead"
        '
        'RibbonPageGroup7
        '
        Me.RibbonPageGroup7.ItemLinks.Add(Me.btnPatientTest)
        Me.RibbonPageGroup7.ItemLinks.Add(Me.btnInfantTest)
        Me.RibbonPageGroup7.ItemLinks.Add(Me.btnFingerPrint)
        Me.RibbonPageGroup7.ItemLinks.Add(Me.btnCode)
        Me.RibbonPageGroup7.Name = "RibbonPageGroup7"
        Me.RibbonPageGroup7.Text = "Patients"
        '
        'RibbonPage2
        '
        Me.RibbonPage2.Groups.AddRange(New DevExpress.XtraBars.Ribbon.RibbonPageGroup() {Me.RibbonPageGroup2})
        Me.RibbonPage2.Name = "RibbonPage2"
        Me.RibbonPage2.Text = "Report"
        '
        'RibbonPageGroup2
        '
        Me.RibbonPageGroup2.ItemLinks.Add(Me.btnRVCCT)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.BtnReport)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.btnRPNTT)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.BarSubItem3)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.btnReportTransferOut)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.btnDaily)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.btnQRcode)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.btnQRcodeMargins)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.BtnCheckTest)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.BarSubItem6)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.btnTempFinger)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.BarSubItem4)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.BtnCheckPatient)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.BarButtonItem8)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.Infants)
        Me.RibbonPageGroup2.ItemLinks.Add(Me.tbnshowrefuges)
        Me.RibbonPageGroup2.Name = "RibbonPageGroup2"
        Me.RibbonPageGroup2.Text = "Reports"
        '
        'RibbonPage3
        '
        Me.RibbonPage3.Groups.AddRange(New DevExpress.XtraBars.Ribbon.RibbonPageGroup() {Me.RibbonPageGroup6})
        Me.RibbonPage3.Name = "RibbonPage3"
        Me.RibbonPage3.Text = "Admin"
        '
        'RibbonPageGroup6
        '
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnBackup)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnRestore)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnUser)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnSite)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnDoct)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnCounsellor)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnUpdate)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnopenrunscript)
        Me.RibbonPageGroup6.ItemLinks.Add(Me.btnopenupdateart)
        Me.RibbonPageGroup6.Name = "RibbonPageGroup6"
        Me.RibbonPageGroup6.Text = "System"
        '
        'XtraTabbedMdiManager1
        '
        Me.XtraTabbedMdiManager1.MdiParent = Me
        '
        'StatusStrip1
        '
        Me.StatusStrip1.ImageScalingSize = New System.Drawing.Size(24, 24)
        Me.StatusStrip1.Items.AddRange(New System.Windows.Forms.ToolStripItem() {Me.ToolStripStatusLabel1, Me.ToolStripStatusLabel2, Me.ToolStripStatusLabel3, Me.ToolStripStatusLabel4, Me.ToolStripStatusLabel5, Me.ToolStripStatusLabel6, Me.ToolStripStatusLabel7, Me.tsbUserName, Me.ToolStripStatusLabel8, Me.ToolStripStatusLabel9})
        Me.StatusStrip1.Location = New System.Drawing.Point(0, 548)
        Me.StatusStrip1.Name = "StatusStrip1"
        Me.StatusStrip1.Padding = New System.Windows.Forms.Padding(1, 0, 15, 0)
        Me.StatusStrip1.Size = New System.Drawing.Size(1224, 30)
        Me.StatusStrip1.TabIndex = 4
        Me.StatusStrip1.Text = "StatusStrip1"
        '
        'ToolStripStatusLabel1
        '
        Me.ToolStripStatusLabel1.Name = "ToolStripStatusLabel1"
        Me.ToolStripStatusLabel1.Size = New System.Drawing.Size(135, 24)
        Me.ToolStripStatusLabel1.Text = "Create: 01/01/2017"
        '
        'ToolStripStatusLabel2
        '
        Me.ToolStripStatusLabel2.Name = "ToolStripStatusLabel2"
        Me.ToolStripStatusLabel2.Size = New System.Drawing.Size(13, 24)
        Me.ToolStripStatusLabel2.Text = "|"
        '
        'ToolStripStatusLabel3
        '
        Me.ToolStripStatusLabel3.Name = "ToolStripStatusLabel3"
        Me.ToolStripStatusLabel3.Size = New System.Drawing.Size(145, 24)
        Me.ToolStripStatusLabel3.Text = "Update : 03/01/2025"
        '
        'ToolStripStatusLabel4
        '
        Me.ToolStripStatusLabel4.Name = "ToolStripStatusLabel4"
        Me.ToolStripStatusLabel4.Size = New System.Drawing.Size(13, 24)
        Me.ToolStripStatusLabel4.Text = "|"
        '
        'ToolStripStatusLabel5
        '
        Me.ToolStripStatusLabel5.Name = "ToolStripStatusLabel5"
        Me.ToolStripStatusLabel5.Size = New System.Drawing.Size(97, 24)
        Me.ToolStripStatusLabel5.Text = "Server Name:"
        '
        'ToolStripStatusLabel6
        '
        Me.ToolStripStatusLabel6.Name = "ToolStripStatusLabel6"
        Me.ToolStripStatusLabel6.Size = New System.Drawing.Size(69, 24)
        Me.ToolStripStatusLabel6.Text = "localhost"
        '
        'ToolStripStatusLabel7
        '
        Me.ToolStripStatusLabel7.Name = "ToolStripStatusLabel7"
        Me.ToolStripStatusLabel7.Size = New System.Drawing.Size(13, 24)
        Me.ToolStripStatusLabel7.Text = "|"
        '
        'tsbUserName
        '
        Me.tsbUserName.Name = "tsbUserName"
        Me.tsbUserName.Size = New System.Drawing.Size(85, 24)
        Me.tsbUserName.Text = "UserName: "
        '
        'ToolStripStatusLabel8
        '
        Me.ToolStripStatusLabel8.Name = "ToolStripStatusLabel8"
        Me.ToolStripStatusLabel8.Size = New System.Drawing.Size(499, 24)
        Me.ToolStripStatusLabel8.Spring = True
        '
        'ToolStripStatusLabel9
        '
        Me.ToolStripStatusLabel9.BorderSides = System.Windows.Forms.ToolStripStatusLabelBorderSides.Left
        Me.ToolStripStatusLabel9.BorderStyle = System.Windows.Forms.Border3DStyle.Etched
        Me.ToolStripStatusLabel9.ForeColor = System.Drawing.Color.Red
        Me.ToolStripStatusLabel9.ImageAlign = System.Drawing.ContentAlignment.MiddleRight
        Me.ToolStripStatusLabel9.Name = "ToolStripStatusLabel9"
        Me.ToolStripStatusLabel9.Size = New System.Drawing.Size(139, 24)
        Me.ToolStripStatusLabel9.Text = "Version : A16.3.12.2"
        '
        'OpenFileDialog1
        '
        Me.OpenFileDialog1.FileName = "OpenFileDialog1"
        '
        'frmMain
        '
        Me.AllowFormGlass = DevExpress.Utils.DefaultBoolean.[False]
        Me.AutoScaleDimensions = New System.Drawing.SizeF(7.0!, 16.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.AutoSize = True
        Me.ClientSize = New System.Drawing.Size(1224, 578)
        Me.Controls.Add(Me.StatusStrip1)
        Me.Controls.Add(Me.ribbonControl1)
        Me.IconOptions.Icon = CType(resources.GetObject("frmMain.IconOptions.Icon"), System.Drawing.Icon)
        Me.IsMdiContainer = True
        Me.Margin = New System.Windows.Forms.Padding(2, 3, 2, 3)
        Me.Name = "frmMain"
        Me.Ribbon = Me.ribbonControl1
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.WindowState = System.Windows.Forms.FormWindowState.Maximized
        CType(Me.ribbonControl1, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.PopupMenu3, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.PopupMenu2, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.PopupMenu1, System.ComponentModel.ISupportInitialize).EndInit()
        CType(Me.XtraTabbedMdiManager1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.StatusStrip1.ResumeLayout(False)
        Me.StatusStrip1.PerformLayout()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

#End Region

    Private WithEvents ribbonControl1 As DevExpress.XtraBars.Ribbon.RibbonControl
    Private ribbonPage1 As DevExpress.XtraBars.Ribbon.RibbonPage
    Private ribbonPageGroup1 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents btniinitial As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnAdultInA As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnAdultInB As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnAdultVisit As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents RibbonPageGroup3 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents RibbonPageGroup4 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents RibbonPage4 As DevExpress.XtraBars.Ribbon.RibbonPage
    Friend WithEvents RibbonPageGroup5 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents RibbonPage2 As DevExpress.XtraBars.Ribbon.RibbonPage
    Friend WithEvents RibbonPageGroup2 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents RibbonPage3 As DevExpress.XtraBars.Ribbon.RibbonPage
    Friend WithEvents DefaultLookAndFeel1 As DevExpress.LookAndFeel.DefaultLookAndFeel
    Friend WithEvents RibbonPageGroup6 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents XtraTabbedMdiManager1 As DevExpress.XtraTabbedMdi.XtraTabbedMdiManager
    Friend WithEvents btnBackup As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnUser As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnSite As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents RibbonPageGroup7 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents BarSubItem1 As DevExpress.XtraBars.BarSubItem
    Friend WithEvents btnAdultIn As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnAdultInA1 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnAdultInA2 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BarSubItem2 As DevExpress.XtraBars.BarSubItem
    Friend WithEvents btnChildIn As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnChildInA1 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnChildVisit As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnExvisit As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnSetLost As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnPatientTest As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnInfantTest As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnAppoint As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnLost As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BarButtonItem6 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnQRcode As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnFingerPrint As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BtnReport As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnReportTransferOut As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnDaily As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnDoct As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BtnCheckTest As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BarButtonItem17 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BtnLostRemider As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnTempFinger As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents StatusStrip1 As StatusStrip
    Friend WithEvents ToolStripStatusLabel1 As ToolStripStatusLabel
    Friend WithEvents ToolStripStatusLabel2 As ToolStripStatusLabel
    Friend WithEvents ToolStripStatusLabel3 As ToolStripStatusLabel
    Friend WithEvents ToolStripStatusLabel4 As ToolStripStatusLabel
    Friend WithEvents ToolStripStatusLabel5 As ToolStripStatusLabel
    Friend WithEvents ToolStripStatusLabel6 As ToolStripStatusLabel
    Friend WithEvents ToolStripStatusLabel7 As ToolStripStatusLabel
    Friend WithEvents tsbUserName As ToolStripStatusLabel
    Friend WithEvents ToolStripStatusLabel9 As ToolStripStatusLabel
    Friend WithEvents BarButtonItem8 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnCode As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnPNTT As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BarButtonItem1 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents OpenFileDialog1 As OpenFileDialog
    Friend WithEvents btnRestore As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BarButtonItem2 As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents PopupMenu1 As DevExpress.XtraBars.PopupMenu
    Friend WithEvents BarSubItem3 As DevExpress.XtraBars.BarSubItem
    Friend WithEvents btnAdultDrug As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BtnChildDrug As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents BtnCheckPatient As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents PopupMenu2 As DevExpress.XtraBars.PopupMenu
    Friend WithEvents BarSubItem4 As DevExpress.XtraBars.BarSubItem
    Friend WithEvents BtnRemidAdult As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents ChildLostRemider As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents PopupMenu3 As DevExpress.XtraBars.PopupMenu
    Friend WithEvents BarSubItem5 As DevExpress.XtraBars.BarSubItem
    Friend WithEvents BarSubItem6 As DevExpress.XtraBars.BarSubItem
    Friend WithEvents btnAdultSummary As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnChildSammary As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents Infants As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnRPNTT As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnVCCT As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents RibbonPage5 As DevExpress.XtraBars.Ribbon.RibbonPage
    Friend WithEvents RibbonPageGroup8 As DevExpress.XtraBars.Ribbon.RibbonPageGroup
    Friend WithEvents btnCounsellor As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnRVCCT As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnReTest As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnQRcodeMargins As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnUpdate As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnopenrunscript As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents btnopenupdateart As DevExpress.XtraBars.BarButtonItem
    Friend WithEvents ToolStripStatusLabel8 As ToolStripStatusLabel
    Friend WithEvents tbnshowrefuges As DevExpress.XtraBars.BarButtonItem
End Class
