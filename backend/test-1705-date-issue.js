const { siteDatabaseManager } = require('./src/config/siteDatabase');

async function checkDateIssue() {
  try {
    const siteCode = '1705';
    const connection = await siteDatabaseManager.getSiteConnection(siteCode);
    
    // The dates being used in the frontend (from logs)
    const startDate = '2025-07-01';
    const endDate = '2025-09-30';
    
    console.log('='.repeat(70));
    console.log('Checking Site 1705 for Date Range:', startDate, 'to', endDate);
    console.log('='.repeat(70));
    console.log('');
    
    // Test AGGREGATE query
    const aggQuery = `
SELECT
    '5.1.1. New ART started: Same day' AS Indicator,
    IFNULL(COUNT(*), 0) AS TOTAL,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Child' AND PatientList.Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_0_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Child' AND PatientList.Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_0_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Adult' AND PatientList.Sex = 'Male' THEN 1 ELSE 0 END), 0) AS Male_over_14,
    IFNULL(SUM(CASE WHEN PatientList.type = 'Adult' AND PatientList.Sex = 'Female' THEN 1 ELSE 0 END), 0) AS Female_over_14
FROM (
    SELECT 'Adult' as type, IF(p.Sex=0, "Female", "Male") as Sex 
    FROM tblaimain p 
    JOIN tblaart art ON p.ClinicID = art.ClinicID 
    WHERE art.DaArt BETWEEN '${startDate}' AND '${endDate}' 
    AND DATEDIFF(art.DaArt, p.DafirstVisit) = 0 
    AND (p.TypeofReturn IS NULL OR p.TypeofReturn = -1)
    UNION ALL
    SELECT 'Child' as type, IF(p.Sex=0, "Female", "Male") as Sex 
    FROM tblcimain p 
    JOIN tblcart art ON p.ClinicID = art.ClinicID 
    WHERE art.DaArt BETWEEN '${startDate}' AND '${endDate}' 
    AND DATEDIFF(art.DaArt, p.DafirstVisit) = 0
) as PatientList;
    `;
    
    const [aggResults] = await connection.query(aggQuery);
    console.log('📊 AGGREGATE Query Result:');
    console.log(JSON.stringify(aggResults[0], null, 2));
    console.log('');
    
    // Test DETAIL query
    const detailQuery = `
SELECT
    '05.1.1' as step,
    p.ClinicID as clinicid,
    art.ART as art_number,
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
    TIMESTAMPDIFF(YEAR, p.DaBirth, '${endDate}') as age,
    CASE 
        WHEN p.OffIn = 0 THEN 'Not Transferred'
        WHEN p.OffIn = 2 THEN 'Transferred In'
        WHEN p.OffIn = 3 THEN 'Transferred Out'
        ELSE CONCAT('Status: ', p.OffIn)
    END as transfer_status,
    p.TypeofReturn
FROM tblaimain p 
JOIN tblaart art ON p.ClinicID = art.ClinicID
WHERE 
    art.DaArt BETWEEN '${startDate}' AND '${endDate}'
    AND DATEDIFF(art.DaArt, p.DafirstVisit) = 0
    AND (p.OffIn IS NULL OR p.OffIn <> 2)
    AND (p.TypeofReturn IS NULL OR p.TypeofReturn = -1)

UNION ALL

SELECT
    '05.1.1' as step,
    p.ClinicID as clinicid,
    art.ART as art_number,
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
    TIMESTAMPDIFF(YEAR, p.DaBirth, '${endDate}') as age,
    CASE 
        WHEN p.OffIn = 0 THEN 'Not Transferred'
        WHEN p.OffIn = 2 THEN 'Transferred In'
        WHEN p.OffIn = 3 THEN 'Transferred Out'
        ELSE CONCAT('Status: ', p.OffIn)
    END as transfer_status,
    NULL as TypeofReturn
FROM tblcimain p 
JOIN tblcart art ON p.ClinicID = art.ClinicID
WHERE 
    art.DaArt BETWEEN '${startDate}' AND '${endDate}'
    AND DATEDIFF(art.DaArt, p.DafirstVisit) = 0
ORDER BY DaArt DESC, clinicid;
    `;
    
    const [detailResults] = await connection.query(detailQuery);
    console.log('📋 DETAIL Query Result:');
    console.log('Total records:', detailResults.length);
    console.log('');
    
    if (detailResults.length > 0) {
      console.log('Detail Records:');
      detailResults.forEach((r, i) => {
        console.log(`${i+1}. ClinicID: ${r.clinicid}, Sex: ${r.sex_display}, Type: ${r.patient_type}, FirstVisit: ${r.DafirstVisit}, ART: ${r.DaArt}, OffIn: ${r.OffIn}, TypeofReturn: ${r.TypeofReturn}`);
      });
    } else {
      console.log('❌ NO DETAIL RECORDS FOUND');
    }
    
    console.log('');
    console.log('='.repeat(70));
    console.log('COMPARISON:');
    console.log('='.repeat(70));
    console.log('Aggregate TOTAL:', aggResults[0].TOTAL);
    console.log('Detail COUNT:', detailResults.length);
    
    if (aggResults[0].TOTAL != detailResults.length) {
      console.log('');
      console.log('❌ MISMATCH DETECTED!');
      console.log('');
      
      // Check what's being filtered out
      const [withoutFilter] = await connection.query(`
        SELECT 
          p.ClinicID,
          p.Sex,
          p.DafirstVisit,
          art.DaArt,
          p.OffIn,
          p.TypeofReturn,
          CASE WHEN p.OffIn = 2 THEN 'FILTERED (Transfer In)' ELSE 'OK' END as filter_reason
        FROM tblaimain p 
        JOIN tblaart art ON p.ClinicID = art.ClinicID 
        WHERE art.DaArt BETWEEN '${startDate}' AND '${endDate}' 
        AND DATEDIFF(art.DaArt, p.DafirstVisit) = 0
      `);
      
      console.log('All Adult Records (before filters):');
      withoutFilter.forEach((r, i) => {
        console.log(`${i+1}. ClinicID: ${r.ClinicID}, Sex: ${r.Sex}, FirstVisit: ${r.DafirstVisit}, ART: ${r.DaArt}, OffIn: ${r.OffIn}, TypeofReturn: ${r.TypeofReturn}, Status: ${r.filter_reason}`);
      });
      
      console.log('');
      console.log('Filtered out by OffIn=2 (Transfer In):', withoutFilter.filter(r => r.OffIn === 2).length);
      console.log('Filtered out by TypeofReturn:', withoutFilter.filter(r => r.TypeofReturn !== null && r.TypeofReturn !== -1).length);
    } else {
      console.log('✅ MATCH! Queries are consistent.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

checkDateIssue();

