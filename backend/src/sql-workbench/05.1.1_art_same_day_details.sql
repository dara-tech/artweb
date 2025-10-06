-- =====================================================
-- 05.1.1 ART SAME DAY DETAILS
-- Generated: 2025-10-06T07:09:48.470Z
-- =====================================================

-- =====================================================
-- =====================================================
-- PARAMETER SETUP
-- Set these parameters before running this query

-- Date parameters (Quarterly period)
SET @StartDate = '2025-04-01';             -- Start date (YYYY-MM-DD)
SET @EndDate = '2025-06-30';               -- End date (YYYY-MM-DD) - Q2 2025

-- Status codes
SET @transfer_in_code = 1;                 -- Transfer in status code

-- MAIN QUERY
-- =====================================================
-- Indicator 5.1.1: New ART started: Same day - Detailed Records
SELECT
    '05.1.1' as step,
    p.ClinicID as clinicid,
    p.Sex as sex,
    CASE 
        WHEN p.Sex = 0 THEN 'Female'
        WHEN p.Sex = 1 THEN 'Male'
        ELSE 'Unknown'
    END as sex_display,
    '15+' as typepatients,
    p.DaBirth as DaBirth,
    p.DafirstVisit as DafirstVisit,
    art.DaArt as DaArt,
    art.DaArt as DatVisit,
    p.OffIn as OffIn,
    'Adult' as patient_type,
    TIMESTAMPDIFF(YEAR, p.DaBirth, @EndDate) as age,
    CASE 
        WHEN p.OffIn = 0 THEN 'Not Transferred'
        WHEN p.OffIn = 2 THEN 'Transferred In'
        WHEN p.OffIn = 3 THEN 'Transferred Out'
        ELSE CONCAT('Status: ', p.OffIn)
    END as transfer_status
FROM tblaimain p 
JOIN tblaart art ON p.ClinicID = art.ClinicID
WHERE 
    art.DaArt BETWEEN @StartDate AND @EndDate
    AND DATEDIFF(art.DaArt, p.DafirstVisit) = 0
    AND (p.OffIn IS NULL OR p.OffIn <> @transfer_in_code)
    AND (p.TypeofReturn IS NULL OR p.TypeofReturn = -1)

UNION ALL

SELECT
    '05.1.1' as step,
    p.ClinicID as clinicid,
    p.Sex as sex,
    CASE 
        WHEN p.Sex = 0 THEN 'Female'
        WHEN p.Sex = 1 THEN 'Male'
        ELSE 'Unknown'
    END as sex_display,
    'Child' as typepatients,
    p.DaBirth as DaBirth,
    p.DafirstVisit as DafirstVisit,
    art.DaArt as DaArt,
    art.DaArt as DatVisit,
    p.OffIn as OffIn,
    'Child' as patient_type,
    TIMESTAMPDIFF(YEAR, p.DaBirth, @EndDate) as age,
    CASE 
        WHEN p.OffIn = 0 THEN 'Not Transferred'
        WHEN p.OffIn = 2 THEN 'Transferred In'
        WHEN p.OffIn = 3 THEN 'Transferred Out'
        ELSE CONCAT('Status: ', p.OffIn)
    END as transfer_status
FROM tblcimain p 
JOIN tblcart art ON p.ClinicID = art.ClinicID
WHERE 
    art.DaArt BETWEEN @StartDate AND @EndDate
    AND DATEDIFF(art.DaArt, p.DafirstVisit) = 0
ORDER BY DaArt DESC, ClinicID;

