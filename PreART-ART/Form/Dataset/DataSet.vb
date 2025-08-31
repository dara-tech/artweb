Partial Class DataSet
    Partial Public Class tblPoiDataTable
        Private Sub tblPoiDataTable_ColumnChanging(sender As Object, e As DataColumnChangeEventArgs) Handles Me.ColumnChanging
            If (e.Column.ColumnName = Me.ClinicIdColumn.ColumnName) Then
                'Add user code here
            End If

        End Sub

    End Class

    Partial Public Class testDataTable
        Private Sub testDataTable_ColumnChanging(sender As Object, e As DataColumnChangeEventArgs) Handles Me.ColumnChanging
            If (e.Column.ColumnName = Me.DatCollectColumn.ColumnName) Then
                'Add user code here
            End If

        End Sub

    End Class
End Class
