const { sequelize } = require('./src/config/database');

async function createMainTables() {
  try {
    console.log('🔄 Creating main database tables...');
    
    // Create the main database tables in the preart_sites_registry database
    const createTablesQuery = `
      -- Create tblaimain (Adult patient main data)
      CREATE TABLE IF NOT EXISTS tblaimain (
        ClinicID varchar(50) NOT NULL,
        DafirstVisit date NOT NULL,
        TypeofReturn varchar(50) DEFAULT '',
        LClinicID varchar(50) DEFAULT '',
        SiteNameold varchar(100) DEFAULT '',
        DaBirth date NOT NULL,
        Sex tinyint(1) NOT NULL,
        DaHIV date NOT NULL,
        OffIn tinyint(1) DEFAULT 0,
        PRIMARY KEY (ClinicID)
      );

      -- Create tblcimain (Child patient main data)
      CREATE TABLE IF NOT EXISTS tblcimain (
        ClinicID varchar(50) NOT NULL,
        DafirstVisit date NOT NULL,
        TypeofReturn varchar(50) DEFAULT '',
        LClinicID varchar(50) DEFAULT '',
        SiteNameold varchar(100) DEFAULT '',
        DaBirth date NOT NULL,
        Sex tinyint(1) NOT NULL,
        DaTest date NOT NULL,
        OffIn tinyint(1) DEFAULT 0,
        PRIMARY KEY (ClinicID)
      );

      -- Create tblaart (Adult ART data)
      CREATE TABLE IF NOT EXISTS tblaart (
        ClinicID varchar(50) NOT NULL,
        ART varchar(50) NOT NULL,
        DaArt date NOT NULL,
        PRIMARY KEY (ClinicID)
      );

      -- Create tblcart (Child ART data)
      CREATE TABLE IF NOT EXISTS tblcart (
        ClinicID varchar(50) NOT NULL,
        ART varchar(50) NOT NULL,
        DaArt date NOT NULL,
        PRIMARY KEY (ClinicID)
      );

      -- Create tblavmain (Adult visit data)
      CREATE TABLE IF NOT EXISTS tblavmain (
        clinicid varchar(50) NOT NULL,
        DatVisit date NOT NULL,
        ARTnum varchar(50) DEFAULT '',
        DaApp date NOT NULL,
        vid varchar(50) NOT NULL,
        PRIMARY KEY (vid)
      );

      -- Create tblcvmain (Child visit data)
      CREATE TABLE IF NOT EXISTS tblcvmain (
        clinicid varchar(50) NOT NULL,
        DatVisit date NOT NULL,
        ARTnum varchar(50) DEFAULT '',
        DaApp date NOT NULL,
        vid varchar(50) NOT NULL,
        PRIMARY KEY (vid)
      );

      -- Create tblavarvdrug (Adult ARV drug data)
      CREATE TABLE IF NOT EXISTS tblavarvdrug (
        vid varchar(50) NOT NULL,
        DrugName varchar(100) NOT NULL,
        status tinyint(1) DEFAULT 0
      );

      -- Create tblcvarvdrug (Child ARV drug data)
      CREATE TABLE IF NOT EXISTS tblcvarvdrug (
        vid varchar(50) NOT NULL,
        DrugName varchar(100) NOT NULL,
        status tinyint(1) DEFAULT 0
      );

      -- Create tblavpatientstatus (Adult patient status)
      CREATE TABLE IF NOT EXISTS tblavpatientstatus (
        clinicid varchar(50) NOT NULL,
        da date NOT NULL,
        status tinyint(1) DEFAULT NULL
      );

      -- Create tblcvpatientstatus (Child patient status)
      CREATE TABLE IF NOT EXISTS tblcvpatientstatus (
        clinicid varchar(50) NOT NULL,
        da date NOT NULL,
        status tinyint(1) DEFAULT NULL
      );

      -- Create tblpatienttest (Patient test data)
      CREATE TABLE IF NOT EXISTS tblpatienttest (
        ClinicID varchar(50) NOT NULL,
        DaArrival date NOT NULL,
        Dat date NOT NULL,
        HIVLoad decimal(10,2) DEFAULT NULL
      );

      -- Create tblavtptdrug (Adult TPT drug data)
      CREATE TABLE IF NOT EXISTS tblavtptdrug (
        DrugName varchar(100) NOT NULL,
        Status tinyint(1) DEFAULT 0,
        Da date NOT NULL,
        Vid varchar(50) NOT NULL
      );

      -- Create tblcvtptdrug (Child TPT drug data)
      CREATE TABLE IF NOT EXISTS tblcvtptdrug (
        DrugName varchar(100) NOT NULL,
        Status tinyint(1) DEFAULT 0,
        Da date NOT NULL,
        Vid varchar(50) NOT NULL
      );
    `;
    
    // Split by semicolon and execute each statement
    const statements = createTablesQuery.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sequelize.query(statement, { type: sequelize.QueryTypes.RAW });
          console.log('✅ Table created successfully');
        } catch (error) {
          console.log('⚠️  Table creation failed (might already exist):', error.message);
        }
      }
    }
    
    // Insert sample data into main tables
    console.log('🔄 Inserting sample data into main tables...');
    
    const insertDataQuery = `
      -- Insert sample adult patient data
      INSERT IGNORE INTO tblaimain VALUES 
      ('P001', '2023-01-15', '', 'L001', 'Test Site 1', '1985-03-20', 1, '2023-01-10', 0),
      ('P002', '2023-02-20', '', 'L002', 'Test Site 1', '1990-07-15', 0, '2023-02-15', 0),
      ('P003', '2023-03-10', '', 'L003', 'Test Site 1', '1988-11-30', 1, '2023-03-05', 0);

      -- Insert sample child patient data
      INSERT IGNORE INTO tblcimain VALUES 
      ('C001', '2023-01-20', '', 'L004', 'Test Site 1', '2015-05-10', 0, '2023-01-18', 0),
      ('C002', '2023-02-25', '', 'L005', 'Test Site 1', '2018-09-22', 1, '2023-02-20', 0);

      -- Insert sample ART data for adults
      INSERT IGNORE INTO tblaart VALUES 
      ('P001', 'ART001', '2023-01-20'),
      ('P002', 'ART002', '2023-02-25'),
      ('P003', 'ART003', '2023-03-15');

      -- Insert sample ART data for children
      INSERT IGNORE INTO tblcart VALUES 
      ('C001', 'ART004', '2023-01-25'),
      ('C002', 'ART005', '2023-03-01');

      -- Insert sample visit data for adults (with different visit dates for MMD testing)
      INSERT IGNORE INTO tblavmain VALUES 
      ('P001', '2024-01-15', 'ART001', '2024-04-15', 'V001'),
      ('P001', '2024-04-15', 'ART001', '2024-07-15', 'V002'),
      ('P002', '2024-02-20', 'ART002', '2024-05-20', 'V003'),
      ('P002', '2024-05-20', 'ART002', '2024-08-20', 'V004'),
      ('P003', '2024-03-10', 'ART003', '2024-06-10', 'V005');

      -- Insert sample visit data for children
      INSERT IGNORE INTO tblcvmain VALUES 
      ('C001', '2024-01-20', 'ART004', '2024-04-20', 'V006'),
      ('C002', '2024-02-25', 'ART005', '2024-05-25', 'V007');

      -- Insert sample ARV drug data (TLD regimen)
      INSERT IGNORE INTO tblavarvdrug VALUES 
      ('V001', '3TC+DTG+TDF', 0),
      ('V002', '3TC+DTG+TDF', 0),
      ('V003', '3TC+DTG+TDF', 0),
      ('V004', '3TC+DTG+TDF', 0),
      ('V005', '3TC+DTG+TDF', 0);

      INSERT IGNORE INTO tblcvarvdrug VALUES 
      ('V006', '3TC+DTG+TDF', 0),
      ('V007', '3TC+DTG+TDF', 0);

      -- Insert sample viral load test data
      INSERT IGNORE INTO tblpatienttest VALUES 
      ('P001', '2024-01-15', '2024-01-20', 500.00),
      ('P002', '2024-02-20', '2024-02-25', 800.00),
      ('P003', '2024-03-10', '2024-03-15', 1200.00),
      ('C001', '2024-01-20', '2024-01-25', 300.00),
      ('C002', '2024-02-25', '2024-03-01', 600.00);

      -- Insert sample TPT drug data
      INSERT IGNORE INTO tblavtptdrug VALUES 
      ('Isoniazid', 0, '2024-01-20', 'V001'),
      ('Isoniazid', 1, '2024-04-20', 'V001'),
      ('Isoniazid', 0, '2024-02-25', 'V003'),
      ('Isoniazid', 1, '2024-05-25', 'V003');

      INSERT IGNORE INTO tblcvtptdrug VALUES 
      ('Isoniazid', 0, '2024-01-25', 'V006'),
      ('Isoniazid', 1, '2024-04-25', 'V006');
    `;
    
    // Split by semicolon and execute each statement
    const insertStatements = insertDataQuery.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of insertStatements) {
      if (statement.trim()) {
        try {
          await sequelize.query(statement, { type: sequelize.QueryTypes.RAW });
          console.log('✅ Data inserted successfully');
        } catch (error) {
          console.log('⚠️  Data insertion failed:', error.message);
        }
      }
    }
    
    console.log('✅ Main database tables created and populated!');
    
    // Test the API
    console.log('🧪 Testing API...');
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
        TLDStatus
      FROM (
        WITH tblactive AS (
          WITH tblvisit AS (
            SELECT clinicid, DatVisit, ARTnum, DaApp, vid, 
                   ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DatVisit DESC) AS id 
            FROM tblavmain 
            WHERE DatVisit <= '2024-12-31'
            UNION ALL 
            SELECT clinicid, DatVisit, ARTnum, DaApp, vid, 
                   ROW_NUMBER() OVER (PARTITION BY clinicid ORDER BY DatVisit DESC) AS id 
            FROM tblcvmain 
            WHERE DatVisit <= '2024-12-31'
          ),
          
          tblimain AS (
            SELECT ClinicID, DafirstVisit, "15+" AS typepatients, TypeofReturn, LClinicID, 
                   SiteNameold, DaBirth, TIMESTAMPDIFF(YEAR, DaBirth, '2024-12-31') AS age, 
                   Sex, DaHIV, OffIn
            FROM tblaimain 
            WHERE DafirstVisit <= '2024-12-31'
            UNION ALL 
            SELECT ClinicID, DafirstVisit, "≤14" AS typepatients, '' AS TypeofReturn, 
                   LClinicID, SiteNameold, DaBirth, TIMESTAMPDIFF(YEAR, DaBirth, '2024-12-31') AS age, 
                   Sex, DaTest AS DaHIV, OffIn
            FROM tblcimain 
            WHERE DafirstVisit <= '2024-12-31'
          ),
          
          tblart AS (
            SELECT *, TIMESTAMPDIFF(MONTH, DaArt, '2024-12-31') AS nmonthART 
            FROM tblaart 
            WHERE DaArt <= '2024-12-31' 
            UNION ALL 
            SELECT *, TIMESTAMPDIFF(MONTH, DaArt, '2024-12-31') AS nmonthART 
            FROM tblcart 
            WHERE DaArt <= '2024-12-31'
          ),
          
          tblexit AS (
            SELECT * 
            FROM tblavpatientstatus 
            WHERE da <= '2024-12-31'  
            UNION ALL 
            SELECT * 
            FROM tblcvpatientstatus  
            WHERE da <= '2024-12-31'
          ),
          
          tblarvdrug AS (
            WITH tbldrug AS (
              SELECT vid, GROUP_CONCAT(DISTINCT DrugName ORDER BY DrugName ASC SEPARATOR '+') AS drugname 
              FROM tblavarvdrug 
              WHERE status <> 1 
              GROUP BY vid 
              UNION ALL 
              SELECT vid, GROUP_CONCAT(DISTINCT DrugName ORDER BY DrugName ASC SEPARATOR '+') AS drugname 
              FROM tblcvarvdrug 
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
      LIMIT 3;
    `;
    
    const result = await sequelize.query(testQuery, { type: sequelize.QueryTypes.SELECT });
    console.log('📊 Test query result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('✅ Setup completed!');
    console.log('🎯 The datevisit field should now work in the frontend!');
    
  } catch (error) {
    console.error('❌ Error setting up main tables:', error);
  } finally {
    await sequelize.close();
  }
}

createMainTables();


