
Imports System.Drawing.Printing

Public Class AdultDrug
    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

    End Sub

    Protected Overrides Sub Finalize()
        MyBase.Finalize()
    End Sub

    Private Sub AdultDrug_AfterPrint(sender As Object, e As EventArgs) Handles Me.AfterPrint


    End Sub

    Private Sub AdultDrug_BeforePrint(sender As Object, e As PrintEventArgs) Handles Me.BeforePrint

    End Sub
End Class