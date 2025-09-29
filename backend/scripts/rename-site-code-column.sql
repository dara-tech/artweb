-- Migration script to rename _site_code column to site_code
-- This script will rename the column in all relevant tables

-- ===================================================================
-- RENAME COLUMNS IN ALL PATIENT TABLES
-- ===================================================================

-- Adult patients
ALTER TABLE tblaimain CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Child patients  
ALTER TABLE tblcimain CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Infant patients
ALTER TABLE tbleimain CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- ===================================================================
-- RENAME COLUMNS IN ALL VISIT TABLES
-- ===================================================================

-- Adult visits
ALTER TABLE tblavmain CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Child visits
ALTER TABLE tblcvmain CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Infant visits
ALTER TABLE tblevmain CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- ===================================================================
-- RENAME COLUMNS IN ART TREATMENT TABLES
-- ===================================================================

-- Adult ART
ALTER TABLE tblaart CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Child ART
ALTER TABLE tblcart CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Infant ART
ALTER TABLE tbleart CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- ===================================================================
-- RENAME COLUMNS IN PATIENT STATUS TABLES
-- ===================================================================

-- Adult patient status
ALTER TABLE tblavpatientstatus CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Child patient status
ALTER TABLE tblcvpatientstatus CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- Infant patient status
ALTER TABLE tblevpatientstatus CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- ===================================================================
-- RENAME COLUMNS IN OTHER TABLES
-- ===================================================================

-- Patient tests
ALTER TABLE tblpatienttest CHANGE COLUMN _site_code site_code VARCHAR(10) DEFAULT NULL;

-- ===================================================================
-- UPDATE INDEXES
-- ===================================================================

-- Drop old indexes
DROP INDEX IF EXISTS idx_avmain_site_code ON tblavmain;
DROP INDEX IF EXISTS idx_cvmain_site_code ON tblcvmain;
DROP INDEX IF EXISTS idx_evmain_site_code ON tblevmain;
DROP INDEX IF EXISTS idx_aimain_site_code ON tblaimain;
DROP INDEX IF EXISTS idx_cimain_site_code ON tblcimain;
DROP INDEX IF EXISTS idx_eimain_site_code ON tbleimain;
DROP INDEX IF EXISTS idx_patienttest_site_code ON tblpatienttest;

-- Create new indexes with site_code
CREATE INDEX idx_avmain_site_code ON tblavmain(site_code);
CREATE INDEX idx_cvmain_site_code ON tblcvmain(site_code);
CREATE INDEX idx_evmain_site_code ON tblevmain(site_code);
CREATE INDEX idx_aimain_site_code ON tblaimain(site_code);
CREATE INDEX idx_cimain_site_code ON tblcimain(site_code);
CREATE INDEX idx_eimain_site_code ON tbleimain(site_code);
CREATE INDEX idx_patienttest_site_code ON tblpatienttest(site_code);

-- Update composite indexes
DROP INDEX IF EXISTS idx_avmain_site_date ON tblavmain;
DROP INDEX IF EXISTS idx_cvmain_site_date ON tblcvmain;
DROP INDEX IF EXISTS idx_evmain_site_date ON tblevmain;

CREATE INDEX idx_avmain_site_date ON tblavmain(site_code, DatVisit);
CREATE INDEX idx_cvmain_site_date ON tblcvmain(site_code, DatVisit);
CREATE INDEX idx_evmain_site_date ON tblevmain(site_code, DatVisit);

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Verify the changes
SELECT 'tblaimain' as table_name, COUNT(*) as records_with_site_code 
FROM tblaimain WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblcimain' as table_name, COUNT(*) as records_with_site_code 
FROM tblcimain WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tbleimain' as table_name, COUNT(*) as records_with_site_code 
FROM tbleimain WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblavmain' as table_name, COUNT(*) as records_with_site_code 
FROM tblavmain WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblcvmain' as table_name, COUNT(*) as records_with_site_code 
FROM tblcvmain WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblevmain' as table_name, COUNT(*) as records_with_site_code 
FROM tblevmain WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblaart' as table_name, COUNT(*) as records_with_site_code 
FROM tblaart WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblcart' as table_name, COUNT(*) as records_with_site_code 
FROM tblcart WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tbleart' as table_name, COUNT(*) as records_with_site_code 
FROM tbleart WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblavpatientstatus' as table_name, COUNT(*) as records_with_site_code 
FROM tblavpatientstatus WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblcvpatientstatus' as table_name, COUNT(*) as records_with_site_code 
FROM tblcvpatientstatus WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblevpatientstatus' as table_name, COUNT(*) as records_with_site_code 
FROM tblevpatientstatus WHERE site_code IS NOT NULL
UNION ALL
SELECT 'tblpatienttest' as table_name, COUNT(*) as records_with_site_code 
FROM tblpatienttest WHERE site_code IS NOT NULL;

-- Show unique site codes
SELECT DISTINCT site_code, COUNT(*) as count 
FROM (
  SELECT site_code FROM tblaimain WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblcimain WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tbleimain WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblavmain WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblcvmain WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblevmain WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblaart WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblcart WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tbleart WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblavpatientstatus WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblcvpatientstatus WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblevpatientstatus WHERE site_code IS NOT NULL
  UNION ALL
  SELECT site_code FROM tblpatienttest WHERE site_code IS NOT NULL
) all_sites
GROUP BY site_code
ORDER BY site_code;
