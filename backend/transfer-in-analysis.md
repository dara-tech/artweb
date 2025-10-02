# Transfer-In Section Analysis - Old System Report

## Overview
The transfer-in section in the old system report tracks patients who were transferred into the facility during the reporting quarter. This analysis covers the complete flow and logic.

## Report Structure

### Cell Mapping
The transfer-in section uses the following cells in the report:

**Child Patients (0-14 years):**
- `XrTableCell111`: Male children transferred in
- `XrTableCell112`: Female children transferred in
- `XrTableCell113`: Total children transferred in (calculated: 111 + 112)

**Adult Patients (15+ years):**
- `XrTableCell116`: Male adults transferred in
- `XrTableCell117`: Female adults transferred in
- `XrTableCell118`: Total adults transferred in (calculated: 116 + 117)

### Report Label
- `XrTableCell109`: "ចំនួនអ្នកជំងឺដែលបានបញ្ចួនចូល នៅក្នុងត្រីមាសនេះ (Number of Patients transferred in this quarter)"

## Data Processing Flow

### 1. Initialization
```vb
' Clear temporary tables at start of report
Dim Cmdto As New MySqlCommand("Delete from tbltempoi", Cnndb)
Cmdto.ExecuteNonQuery()
Dim Cmdta As New MySqlCommand("Delete from tbltempart", Cnndb)
Cmdta.ExecuteNonQuery()
```

### 2. Adult Transfer-In Processing (Lines 300-317)

**Query:**
```sql
SELECT tblaimain.Sex, tblaart.ART, tblaimain.ClinicID, tblavpatientstatus.Status, tblavpatientstatus.Da 
FROM tblaimain 
LEFT OUTER JOIN tblaart ON tblaimain.ClinicID = tblaart.ClinicID 
LEFT OUTER JOIN tblavpatientstatus ON tblaimain.ClinicID = tblavpatientstatus.ClinicID 
WHERE (tblaimain.OffIn = 1) AND (tblaimain.DafirstVisit BETWEEN 'StartDate' AND 'EndDate')
```

**Key Points:**
- Uses `LEFT OUTER JOIN` with `tblaart` (no ART requirement for adults)
- Uses `LEFT OUTER JOIN` with `tblavpatientstatus` (for data integrity)
- Filters by `OffIn = 1` (transfer-in flag)
- Filters by `DafirstVisit` within date range

**Processing Logic:**
```vb
While Rdr.Read
    Try
        ' Insert into temporary ART table
        Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
        CmdTart.ExecuteNonQuery()
        
        ' Count by sex
        Select Case Val(Rdr.GetValue(0).ToString)
            Case 1  ' Male
                XrTableCell116.Text = Val(XrTableCell116.Text) + 1
            Case Else  ' Female
                XrTableCell117.Text = Val(XrTableCell117.Text) + 1
        End Select
    Catch ex As Exception
        ' Skip record if error (e.g., duplicate key)
    End Try
End While
```

### 3. Child Transfer-In Processing (Lines 1191-1208)

**Query:**
```sql
SELECT tblcimain.Sex, tblcart.ART, tblcimain.ClinicID, tblcvpatientstatus.Status, tblcvpatientstatus.Da 
FROM tblcimain 
LEFT OUTER JOIN tblcart ON tblcimain.ClinicID = tblcart.ClinicID 
LEFT OUTER JOIN tblcvpatientstatus ON tblcimain.ClinicID = tblcvpatientstatus.ClinicID 
WHERE (tblcart.ClinicID IS NOT NULL) AND (tblcimain.OffIn = 1) AND (tblcimain.DafirstVisit BETWEEN 'StartDate' AND 'EndDate')
```

**Key Points:**
- Uses `LEFT OUTER JOIN` with `tblcart` but requires `tblcart.ClinicID IS NOT NULL` (ART requirement for children)
- Uses `LEFT OUTER JOIN` with `tblcvpatientstatus` (for data integrity)
- Filters by `OffIn = 1` (transfer-in flag)
- Filters by `DafirstVisit` within date range

**Processing Logic:**
```vb
While Rdr.Read
    Try
        ' Insert into temporary ART table
        Dim CmdTart As New MySqlCommand("insert into tbltempart values('" & Rdr.GetValue(2).ToString & "','" & Rdr.GetValue(0).ToString & "')", dbtem)
        CmdTart.ExecuteNonQuery()
        
        ' Count by sex
        Select Case Val(Rdr.GetValue(0).ToString)
            Case 1  ' Male
                XrTableCell111.Text = Val(XrTableCell111.Text) + 1
            Case Else  ' Female
                XrTableCell112.Text = Val(XrTableCell112.Text) + 1
        End Select
    Catch ex As Exception
        ' Skip record if error (e.g., duplicate key)
    End Try
End While
```

## Key Differences Between Adult and Child Logic

### Adult Transfer-In
- **No ART Requirement**: Uses `LEFT JOIN` with `tblaart` (no condition)
- **Any Patient**: Includes all patients with `OffIn = 1` in date range
- **Counts**: Increments `XrTableCell116` (Male) and `XrTableCell117` (Female)

### Child Transfer-In
- **ART Requirement**: Uses `LEFT JOIN` with `tblcart` but requires `tblcart.ClinicID IS NOT NULL`
- **ART Patients Only**: Only includes children with ART records
- **Counts**: Increments `XrTableCell111` (Male) and `XrTableCell112` (Female)

## Error Handling

Both queries use `Try-Catch` blocks around the processing logic:
- If there's an error (e.g., duplicate key in temp table), the record is skipped
- Processing continues with the next record
- This ensures the report doesn't crash on data issues

## Temporary Table Usage

Transfer-in patients are added to `tbltempart` (temporary ART table):
- Used for tracking ART patients throughout the report
- Referenced in subsequent calculations
- Contains `ClinicID` and `Sex` for each patient

## Report Calculation

The report automatically calculates totals:
- `XrTableCell113` = `XrTableCell111` + `XrTableCell112` (Total Children)
- `XrTableCell118` = `XrTableCell116` + `XrTableCell117` (Total Adults)

## Summary

The transfer-in section uses two separate queries with different logic:
1. **Adult**: No ART requirement, counts all transfer-in patients
2. **Child**: Requires ART record, counts only ART patients

Both queries use error handling and populate temporary tables for use in other report sections.
