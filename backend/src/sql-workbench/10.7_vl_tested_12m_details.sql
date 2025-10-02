-- =====================================================
-- 10.7 VL TESTED 12M DETAILS
-- Generated: 2025-10-02T12:01:55.097Z
-- =====================================================

-- =====================================================
-- =====================================================
-- PARAMETER SETUP
-- Set these parameters before running this query

-- Date parameters (Quarterly period)
SET @EndDate = '2025-06-30';               -- End date (YYYY-MM-DD) - Q2 2025

-- MAIN QUERY
-- =====================================================
-- 10.7 VL Tested 12M - Detailed Records (matching corrected aggregate logic)
WITH tblactive AS (
    WITH tblvisit AS (
        SELECT 
            clinicid,
            DatVisit,
            ARTnum,
            DaApp,
            vid,
            ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DatVisit DESC) AS id 
        FROM tblavmain 
        WHERE DatVisit <= @EndDate
        
        UNION ALL 
        
        SELECT 
            clinicid,
            DatVisit,
            ARTnum,
            DaApp,
            vid,
            ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DatVisit DESC) AS id 
        FROM tblcvmain 
        WHERE DatVisit <= @EndDate
    ),
    
    tblimain AS (
        SELECT 
            ClinicID,
            DafirstVisit,
            "15+" AS typepatients,
            TypeofReturn,
            LClinicID,
            SiteNameold,
            DaBirth,
            TIMESTAMPDIFF(YEAR, DaBirth, @EndDate) AS age,
            Sex,
            DaHIV,
            OffIn 
        FROM tblaimain 
        WHERE DafirstVisit <= @EndDate
        
        UNION ALL 
        
        SELECT 
            ClinicID,
            DafirstVisit,
            "≤14" AS typepatients,
            '' AS TypeofReturn,
            LClinicID,
            SiteNameold,
            DaBirth,
            TIMESTAMPDIFF(YEAR, DaBirth, @EndDate) AS age,
            Sex,
            DaTest AS DaHIV,
            OffIn 
        FROM tblcimain 
        WHERE DafirstVisit <= @EndDate
    ),
    
    tblart AS (
        SELECT *,
               TIMESTAMPDIFF(MONTH, DaArt, @EndDate) AS nmonthART 
        FROM tblaart 
        WHERE DaArt <= @EndDate
        
        UNION ALL 
        
        SELECT *,
               TIMESTAMPDIFF(MONTH, DaArt, @EndDate) AS nmonthART 
        FROM tblcart 
        WHERE DaArt <= @EndDate
    ),
    
    tblexit AS (
        SELECT * 
        FROM tblavpatientstatus 
        WHERE da <= @EndDate
        
        UNION ALL 
        
        SELECT * 
        FROM tblcvpatientstatus  
        WHERE da <= @EndDate
    ),
    
    tblarvdrug AS (
        WITH tbldrug AS (
            SELECT 
                vid,
                GROUP_CONCAT(DISTINCT DrugName ORDER BY DrugName ASC SEPARATOR '+') AS drugname 
            FROM tblavarvdrug 
            WHERE status <> 1
            GROUP BY vid 
            
            UNION ALL 
            
            SELECT 
                vid,
                GROUP_CONCAT(DISTINCT DrugName ORDER BY DrugName ASC SEPARATOR '+') AS drugname 
            FROM tblcvarvdrug 
            WHERE status <> 1
            GROUP BY vid
        )
        SELECT 
            vid,
            drugname,
            IF(LOCATE('3TC+DTG+TDF', drugname) > 0, "TLD", "Not-TLD") AS TLDStatus 
        FROM tbldrug
    ),
    
    tblvltested AS (
        WITH tblvltest AS (
            SELECT 
                ClinicID,
                IF(DaArrival < Dat, Dat, DaArrival) AS DateResult,
                HIVLoad 
            FROM tblpatienttest 
            WHERE HIVLoad != ''
            HAVING DateResult <= @EndDate
        )
        SELECT DISTINCT 
            ClinicID,
            DateResult,
            HIVLoad,
            IF(DateResult > datelast, "Do_VL_in_12M", "Do_VL_greatn_12M") AS VLdostatus,
            IF(HIVLoad < 1000, "VL-Suppression", "Not-Suppression") AS vlresultstatus  
        FROM (
            SELECT 
                ClinicID,
                DateResult,
                HIVLoad,
                DATE_SUB(@EndDate, INTERVAL 1 YEAR) AS datelast,
                ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DateResult DESC) AS id 
            FROM tblvltest 
        ) pt 
        WHERE pt.id = 1
    ),
    
    tbltptdrug AS (
        WITH tbltptdrugs AS (
            SELECT 
                DrugName,
                Status,
                Da,
                Vid 
            FROM tblavtptdrug 
            WHERE DrugName != "B6"
            
            UNION ALL 
            
            SELECT 
                DrugName,
                Status,
                Da,
                Vid 
            FROM tblcvtptdrug 
            WHERE DrugName != "B6"
        ),
        
        tblvisit AS (
            SELECT clinicid, DatVisit, vid 
            FROM tblavmain 
            
            UNION ALL 
            
            SELECT clinicid, DatVisit, vid 
            FROM tblcvmain 
        ),
        
        tbltptall AS (
            SELECT 
                clinicid,
                DatVisit,
                DrugName,
                Status,
                Da 
            FROM tbltptdrugs tp 
            LEFT JOIN tblvisit v ON tp.vid = v.vid
        ),
        
        tbltptstart AS (
            SELECT * 
            FROM (
                SELECT *,
                       ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DatVisit ASC) AS id 
                FROM tbltptall 
                WHERE status = 0 AND DatVisit <= @EndDate
            ) s 
            WHERE id = 1
        ),
        
        tbltptstope AS (
            SELECT * 
            FROM (
                SELECT *,
                       ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY Da DESC) AS id 
                FROM tbltptall 
                WHERE status = 1 AND Da <= @EndDate
            ) s 
            WHERE id = 1
        )
        
        SELECT 
            s.clinicid,
            s.DatVisit AS dateStart,
            s.DrugName AS Tptdrugname,
            st.da AS Datestop,
            DATEDIFF(st.da, s.DatVisit) / 30 AS duration  
        FROM tbltptstart s
        LEFT JOIN tbltptstope st ON s.clinicid = st.clinicid
    )

    SELECT 
        i.clinicid,
        i.DafirstVisit,
        i.typepatients,
        i.TypeofReturn,
        i.LClinicID,
        i.SiteNameold,
        i.DaBirth,
        i.age,
        i.Sex,
        i.DaHIV,
        i.OffIn,
        a.ART,
        a.DaArt,
        v.DatVisit,
        v.ARTnum,
        v.DaApp,
        a.nmonthART,
        IF(a.nmonthART >= 6, ">6M", "<6M") AS Startartstatus,
        DATEDIFF(v.DaApp, v.DatVisit) AS ndays,
        IF(DATEDIFF(v.DaApp, v.DatVisit) > 80, "MMD", "Not-MMD") AS MMDStatus,
        rd.drugname,
        IF(LEFT(i.clinicid, 1) = "P" AND rd.TLDStatus != "TLD" AND LOCATE('DTG', drugname) > 0, "TLD", rd.TLDStatus) AS TLDStatus,
        vl.DateResult,
        vl.HIVLoad,
        vl.VLdostatus,
        vl.vlresultstatus,
        tp.Tptdrugname,
        tp.dateStart,
        tp.Datestop,
        tp.duration,
        IF(LEFT(tp.Tptdrugname, 1) = 3 AND tp.duration >= 2.50, "TPT Complete",
           IF(LEFT(tp.Tptdrugname, 1) = 6 AND tp.duration >= 5.50, "TPT Complete",
              IF(tp.Tptdrugname IS NULL, "Not Start", "Not complete"))) AS tptstatus 
    FROM tblvisit v
    LEFT JOIN tblimain i ON i.clinicid = v.clinicid
    LEFT JOIN tblart a ON a.clinicid = v.clinicid
    LEFT JOIN tblexit e ON v.clinicid = e.clinicid
    LEFT JOIN tblarvdrug rd ON rd.vid = v.vid
    LEFT JOIN tblvltested vl ON vl.clinicid = v.clinicid
    LEFT JOIN tbltptdrug tp ON tp.clinicid = v.clinicid
    WHERE id = 1 AND e.status IS NULL
)

SELECT
    '10.7' as step,
    clinicid,
    Sex AS sex,
    CASE 
        WHEN Sex = 0 THEN 'Female'
        WHEN Sex = 1 THEN 'Male'
        ELSE 'Unknown'
    END AS sex_display,
    typepatients,
    age,
    CASE 
        WHEN typepatients = '15+' THEN 'Adult'
        WHEN typepatients = '≤14' THEN 'Child'
        ELSE 'Unknown'
    END AS patient_type,
    ART,
    DaArt,
    DafirstVisit,
    DaBirth,
    OffIn,
    CASE 
        WHEN OffIn = 0 THEN 'Not Transferred'
        WHEN OffIn = 2 THEN 'Transferred In'
        WHEN OffIn = 3 THEN 'Transferred Out'
        ELSE CONCAT('Status: ', OffIn)
    END AS transfer_status,
    Startartstatus,
    MMDStatus,
    TLDStatus,
    DateResult,
    HIVLoad,
    VLdostatus,
    vlresultstatus,
    tptstatus
FROM tblactive
WHERE ART IS NOT NULL
    AND Startartstatus = '>6M' 
    AND VLdostatus = 'Do_VL_in_12M'
    AND DateResult IS NOT NULL
ORDER BY DaArt DESC, clinicid;
