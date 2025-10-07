const { sequelize } = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function createTestData() {
  try {
    console.log('🔄 Creating test data...');
    
    // Read the test data SQL file
    const sqlFile = path.join(__dirname, 'test_data.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sequelize.query(statement, { type: sequelize.QueryTypes.RAW });
          console.log('✅ Executed statement successfully');
        } catch (error) {
          console.log('⚠️  Statement failed (might already exist):', error.message);
        }
      }
    }
    
    console.log('✅ Test data creation completed!');
    
    // Test the data by querying the site
    const testQuery = `
      SELECT 
        '10.1' as step,
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
        DatVisit AS datevisit,
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
        tptstatus
      FROM (
        WITH tblactive AS (
          WITH tblvisit AS (
            SELECT clinicid, DatVisit, ARTnum, DaApp, vid, 
                   ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DatVisit DESC) AS id 
            FROM test_site_001.tblavmain 
            WHERE DatVisit <= '2024-12-31'
            UNION ALL 
            SELECT clinicid, DatVisit, ARTnum, DaApp, vid, 
                   ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DatVisit DESC) AS id 
            FROM test_site_001.tblcvmain 
            WHERE DatVisit <= '2024-12-31'
          ),
          
          tblimain AS (
            SELECT ClinicID, DafirstVisit, "15+" AS typepatients, TypeofReturn, LClinicID, 
                   SiteNameold, DaBirth, TIMESTAMPDIFF(YEAR, DaBirth, '2024-12-31') AS age, 
                   Sex, DaHIV, OffIn
            FROM test_site_001.tblaimain 
            WHERE DafirstVisit <= '2024-12-31'
            UNION ALL 
            SELECT ClinicID, DafirstVisit, "≤14" AS typepatients, '' AS TypeofReturn, 
                   LClinicID, SiteNameold, DaBirth, TIMESTAMPDIFF(YEAR, DaBirth, '2024-12-31') AS age, 
                   Sex, DaTest AS DaHIV, OffIn
            FROM test_site_001.tblcimain 
            WHERE DafirstVisit <= '2024-12-31'
          ),
          
          tblart AS (
            SELECT *, TIMESTAMPDIFF(MONTH, DaArt, '2024-12-31') AS nmonthART 
            FROM test_site_001.tblaart 
            WHERE DaArt <= '2024-12-31' 
            UNION ALL 
            SELECT *, TIMESTAMPDIFF(MONTH, DaArt, '2024-12-31') AS nmonthART 
            FROM test_site_001.tblcart 
            WHERE DaArt <= '2024-12-31'
          ),
          
          tblexit AS (
            SELECT * 
            FROM test_site_001.tblavpatientstatus 
            WHERE da <= '2024-12-31'  
            UNION ALL 
            SELECT * 
            FROM test_site_001.tblcvpatientstatus  
            WHERE da <= '2024-12-31'
          ),
          
          tblarvdrug AS (
            WITH tbldrug AS (
              SELECT vid, GROUP_CONCAT(DISTINCT DrugName ORDER BY DrugName ASC SEPARATOR '+') AS drugname 
              FROM test_site_001.tblavarvdrug 
              WHERE status <> 1 
              GROUP BY vid 
              UNION ALL 
              SELECT vid, GROUP_CONCAT(DISTINCT DrugName ORDER BY DrugName ASC SEPARATOR '+') AS drugname 
              FROM test_site_001.tblcvarvdrug 
              WHERE status <> 1 
              GROUP BY vid
            )
            SELECT vid, drugname, 
                   IF(LOCATE('3TC+DTG+TDF', drugname) > 0, "TLD", "Not-TLD") AS TLDStatus 
            FROM tbldrug
          )
          
          SELECT i.clinicid, i.DafirstVisit, i.typepatients, i.TypeofReturn, i.LClinicID, 
                 i.SiteNameold, i.DaBirth, i.age, i.Sex, i.DaHIV, i.OffIn,
                 a.ART, a.DaArt, v.DatVisit, v.ARTnum, v.DaApp, a.nmonthART,
                 IF(a.nmonthART >= 6, ">6M", "<6M") AS Startartstatus,
                 DATEDIFF(v.DaApp, v.DatVisit) AS ndays,
                 IF(DATEDIFF(v.DaApp, v.DatVisit) > 80, "MMD", "Not-MMD") AS MMDStatus,
                 rd.drugname,
                 IF(LEFT(i.clinicid, 1) = "P" AND rd.TLDStatus != "TLD" AND LOCATE('DTG', drugname) > 0, 
                    "TLD", rd.TLDStatus) AS TLDStatus
          FROM tblvisit v
          LEFT JOIN tblimain i ON i.clinicid = v.clinicid
          LEFT JOIN tblart a ON a.clinicid = v.clinicid
          LEFT JOIN tblexit e ON v.clinicid = e.clinicid
          LEFT JOIN tblarvdrug rd ON rd.vid = v.vid
          WHERE id = 1 AND e.status IS NULL AND a.ART IS NOT NULL 
        )
        
        SELECT * FROM tblactive
        WHERE ART IS NOT NULL AND Startartstatus = '>6M'
      ) AS test_data
      LIMIT 5;
    `;
    
    const result = await sequelize.query(testQuery, { type: sequelize.QueryTypes.SELECT });
    console.log('📊 Test query result:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    await sequelize.close();
  }
}

createTestData();


