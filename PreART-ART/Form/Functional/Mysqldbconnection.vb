Imports MySql.Data.MySqlClient
Public Class Mysqldbconnection
    ' Database Connection Class
    Private ConnectionString As String
    Private Connection As MySqlConnection
    Private _status As String '0=failed, 1=success
    Private _message As String

    Public Function GetStatus() As String
        Return _status ' Return the value of the private field
    End Function
    Public Function GetMessage() As String
        Return _message ' Return the value of the private field
    End Function

    ' Constructor to Initialize the Connection String
    Public Sub New(server As String, database As String, username As String, password As String)
        ConnectionString = $"Server={server};Database={database};Port='3306';Uid={username};Pwd={password};Character Set=utf8;default command timeout=6200 ;pooling = false; convert zero datetime=True"
        Connection = New MySqlConnection(ConnectionString)
    End Sub
    ' Open the Connection
    Public Sub OpenConnection()
        Try
            If Connection.State = ConnectionState.Closed Then
                Connection.Open()
                _status = "1"
                _message = "Connection opened successfully."
            End If
        Catch ex As Exception
            _status = "0"
            _message = $"Error: {ex.Message}"
        End Try
    End Sub

    ' Close the Connection
    Public Sub CloseConnection()
        Try
            If Connection.State = ConnectionState.Open Then
                Connection.Close()
                _status = "1"
                _message = "Connection closed successfully."
            End If
        Catch ex As Exception
            _status = "0"
            _message = $"Error: {ex.Message}"
        End Try
    End Sub

    ' Execute a Non-Query Command (INSERT, UPDATE, DELETE)
    Public Sub ExecuteNonQuery(query As String)
        Try
            Using cmd As New MySqlCommand(query, Connection)
                cmd.ExecuteNonQuery()
                _status = "1"
                _message = "Query executed successfully."
            End Using
        Catch ex As Exception
            _status = "0"
            _message = $"Error: {ex.Message}"
        End Try
    End Sub
    ' Execute a Query and Print Results
    Public Function ExecuteQuery(query As String) As MySqlDataReader
        Try
            Dim cmd As New MySqlCommand(query, Connection)
            _status = "1"
            _message = "Get data Successfully."
            Return cmd.ExecuteReader()
        Catch ex As Exception
            _status = "0"
            _message = $"Error: {ex.Message}"
        End Try
    End Function

End Class
