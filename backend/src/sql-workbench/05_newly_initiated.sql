-- =====================================================
-- 05 NEWLY INITIATED
-- Generated: 2025-10-08T09:39:33.695Z
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
-- Indicator 5: Newly Initiated
WITH tblnewlyinitiated AS (
    -- Adults: Must have ART start date in quarter, NOT be a transfer-in, AND NOT be a lost-return patient
    SELECT 
        'Adult' as type, 
        IF(p.Sex=0, "Female", "Male") as Sex,
        p.ClinicID,
        art.DaArt
    FROM tblaimain p 
    JOIN tblaart art ON p.ClinicID = art.ClinicID
    JOIN tblavmain v ON p.ClinicID = v.ClinicID AND v.DatVisit = art.DaArt 
    WHERE 
        art.DaArt BETWEEN @StartDate AND @EndDate 
        AND (p.OffIn IS NULL OR p.OffIn <> @transfer_in_code)
        AND (p.TypeofReturn IS NULL OR p.TypeofReturn = -1)
    
    UNION ALL
    
    -- Children: Must have ART start date in quarter AND NOT be a transfer-in
    SELECT 
        'Child' as type, 
        IF(p.Sex=0, "Female", "Male") as Sex,
        p.ClinicID,
        art.DaArt
    FROM tblcimain p 
    JOIN tblcart art ON p.ClinicID = art.ClinicID
    JOIN tblcvmain v ON p.ClinicID = v.ClinicID AND v.DatVisit = art.DaArt
    WHERE 
        art.DaArt BETWEEN @StartDate AND @EndDate 
        AND (p.OffIn IS NULL OR p.OffIn <> @transfer_in_code)
)

SELECT
    '5. Newly Initiated' AS Indicator,
    IFNULL(COUNT(*), 0) AS TOTAL,
    IFNULL(SUM(CASE WHEN type = 'Child' AND Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_0_14,
    IFNULL(SUM(CASE WHEN type = 'Child' AND Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_0_14,
    IFNULL(SUM(CASE WHEN type = 'Adult' AND Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_over_14,
    IFNULL(SUM(CASE WHEN type = 'Adult' AND Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_over_14
FROM tblnewlyinitiated;

