-- =====================================================
-- 05.1.3 ART OVER 7 DAYS
-- Generated: 2025-10-08T09:39:33.693Z
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
-- Indicator 5.1.3: New ART started: >7 days
SELECT
    '5.1.3. New ART started: >7 days' AS Indicator,
    IFNULL(COUNT(*), 0) AS TOTAL,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Child' AND PatientList.Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_0_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Child' AND PatientList.Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_0_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Adult' AND PatientList.Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_over_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Adult' AND PatientList.Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_over_14
FROM (
    -- Adults: Must not be a lost-return patient
    SELECT 'Adult' as type, IF(p.Sex=0, "Female", "Male") as Sex FROM tblaimain p JOIN tblaart art ON p.ClinicID = art.ClinicID WHERE art.DaArt BETWEEN @StartDate AND @EndDate AND DATEDIFF(art.DaArt, p.DafirstVisit) > 7 AND (p.OffIn IS NULL OR p.OffIn <> @transfer_in_code) AND (p.TypeofReturn IS NULL OR p.TypeofReturn = -1)
    UNION ALL
    -- Children
    SELECT 'Child' as type, IF(p.Sex=0, "Female", "Male") as Sex FROM tblcimain p JOIN tblcart art ON p.ClinicID = art.ClinicID WHERE art.DaArt BETWEEN @StartDate AND @EndDate AND DATEDIFF(art.DaArt, p.DafirstVisit) > 7
) as PatientList;

