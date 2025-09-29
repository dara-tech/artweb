-- Indicator 6: Number of transfer-in patients
SELECT
    '6. Transfer-in patients' AS Indicator,
    IFNULL(COUNT(*), 0) AS TOTAL,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Child' AND PatientList.Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_0_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Child' AND PatientList.Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_0_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Adult' AND PatientList.Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_over_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Adult' AND PatientList.Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_over_14
FROM (
    SELECT 'Adult' as type, IF(p.Sex=0, 'Female', 'Male') as Sex 
    FROM tblaimain p 
    JOIN tblaart art ON p.ClinicID = art.ClinicID
    WHERE p.DafirstVisit BETWEEN :StartDate AND :EndDate AND p.OffIn = :transfer_in_code
    UNION ALL
    SELECT 'Child' as type, IF(p.Sex=0, 'Female', 'Male') as Sex 
    FROM tblcimain p 
    JOIN tblcart art ON p.ClinicID = art.ClinicID
    WHERE p.DafirstVisit BETWEEN :StartDate AND :EndDate AND p.OffIn = :transfer_in_code
) as PatientList;
