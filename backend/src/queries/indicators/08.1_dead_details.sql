-- Indicator 8.1: Dead - Detailed Records (matching aggregate logic exactly)
SELECT
    main.ClinicID as clinicid,
    main.Sex as sex,
    CASE 
        WHEN main.Sex = 0 THEN 'Female'
        WHEN main.Sex = 1 THEN 'Male'
        ELSE 'Unknown'
    END as sex_display,
    '15+' as typepatients,
    main.DaBirth as DaBirth,
    main.DafirstVisit as DafirstVisit,
    main.OffIn as OffIn,
    'Adult' as patient_type,
    TIMESTAMPDIFF(YEAR, main.DaBirth, :EndDate) as age,
    CASE 
        WHEN main.OffIn = 0 THEN 'Not Transferred'
        WHEN main.OffIn = 2 THEN 'Transferred In'
        WHEN main.OffIn = 3 THEN 'Transferred Out'
        ELSE CONCAT('Status: ', main.OffIn)
    END as transfer_status,
    s.Da as death_date,
    s.Status as death_status
FROM tblaimain main 
JOIN tblavpatientstatus s ON main.ClinicID = s.ClinicID
WHERE s.Da BETWEEN :StartDate AND :EndDate 
    AND s.Status = :dead_code

UNION ALL

SELECT
    main.ClinicID as clinicid,
    main.Sex as sex,
    CASE 
        WHEN main.Sex = 0 THEN 'Female'
        WHEN main.Sex = 1 THEN 'Male'
        ELSE 'Unknown'
    END as sex_display,
    '≤14' as typepatients,
    main.DaBirth as DaBirth,
    main.DafirstVisit as DafirstVisit,
    main.OffIn as OffIn,
    'Child' as patient_type,
    TIMESTAMPDIFF(YEAR, main.DaBirth, :EndDate) as age,
    CASE 
        WHEN main.OffIn = 0 THEN 'Not Transferred'
        WHEN main.OffIn = 2 THEN 'Transferred In'
        WHEN main.OffIn = 3 THEN 'Transferred Out'
        ELSE CONCAT('Status: ', main.OffIn)
    END as transfer_status,
    s.Da as death_date,
    s.Status as death_status
FROM tblcimain main 
JOIN tblcvpatientstatus s ON main.ClinicID = s.ClinicID
WHERE s.Da BETWEEN :StartDate AND :EndDate 
    AND s.Status = :dead_code
ORDER BY death_date DESC, clinicid;
