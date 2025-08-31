Imports MySql.Data.MySqlClient

Public Class Patientrefuges
    Dim rdr As MySqlDataReader
    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        Dim cmdsite As New MySqlCommand("select NameEn,Province from tblsitename", Cnndb)
        rdr = cmdsite.ExecuteReader
        While rdr.Read
            lbhospital.Text = rdr.GetValue(0).ToString
            lbprovince.Text = rdr.GetValue(1).ToString
        End While
        rdr.Close()


    End Sub

End Class