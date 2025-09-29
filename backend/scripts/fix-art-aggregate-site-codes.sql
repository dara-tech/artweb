-- Fix site codes in art_aggregate database
-- This script fixes 3-digit site codes by adding leading zeros
-- Expected site codes: 0201, 0202, 0301, 0306, 1209, 1801

-- ===================================================================
-- SITE CODE FIXES
-- ===================================================================

-- Fix 3-digit codes by adding leading zero
-- 201 -> 0201
UPDATE tblaimain SET site_code = '0201' WHERE site_code = '201';
UPDATE tblcimain SET site_code = '0201' WHERE site_code = '201';
UPDATE tbleimain SET site_code = '0201' WHERE site_code = '201';
UPDATE tblavmain SET site_code = '0201' WHERE site_code = '201';
UPDATE tblcvmain SET site_code = '0201' WHERE site_code = '201';
UPDATE tblevmain SET site_code = '0201' WHERE site_code = '201';
UPDATE tblaart SET site_code = '0201' WHERE site_code = '201';
UPDATE tblcart SET site_code = '0201' WHERE site_code = '201';
UPDATE tbleart SET site_code = '0201' WHERE site_code = '201';
UPDATE tblavpatientstatus SET site_code = '0201' WHERE site_code = '201';
UPDATE tblcvpatientstatus SET site_code = '0201' WHERE site_code = '201';
UPDATE tblevpatientstatus SET site_code = '0201' WHERE site_code = '201';
UPDATE tblpatienttest SET site_code = '0201' WHERE site_code = '201';

-- 202 -> 0202
UPDATE tblaimain SET site_code = '0202' WHERE site_code = '202';
UPDATE tblcimain SET site_code = '0202' WHERE site_code = '202';
UPDATE tbleimain SET site_code = '0202' WHERE site_code = '202';
UPDATE tblavmain SET site_code = '0202' WHERE site_code = '202';
UPDATE tblcvmain SET site_code = '0202' WHERE site_code = '202';
UPDATE tblevmain SET site_code = '0202' WHERE site_code = '202';
UPDATE tblaart SET site_code = '0202' WHERE site_code = '202';
UPDATE tblcart SET site_code = '0202' WHERE site_code = '202';
UPDATE tbleart SET site_code = '0202' WHERE site_code = '202';
UPDATE tblavpatientstatus SET site_code = '0202' WHERE site_code = '202';
UPDATE tblcvpatientstatus SET site_code = '0202' WHERE site_code = '202';
UPDATE tblevpatientstatus SET site_code = '0202' WHERE site_code = '202';
UPDATE tblpatienttest SET site_code = '0202' WHERE site_code = '202';

-- 301 -> 0301
UPDATE tblaimain SET site_code = '0301' WHERE site_code = '301';
UPDATE tblcimain SET site_code = '0301' WHERE site_code = '301';
UPDATE tbleimain SET site_code = '0301' WHERE site_code = '301';
UPDATE tblavmain SET site_code = '0301' WHERE site_code = '301';
UPDATE tblcvmain SET site_code = '0301' WHERE site_code = '301';
UPDATE tblevmain SET site_code = '0301' WHERE site_code = '301';
UPDATE tblaart SET site_code = '0301' WHERE site_code = '301';
UPDATE tblcart SET site_code = '0301' WHERE site_code = '301';
UPDATE tbleart SET site_code = '0301' WHERE site_code = '301';
UPDATE tblavpatientstatus SET site_code = '0301' WHERE site_code = '301';
UPDATE tblcvpatientstatus SET site_code = '0301' WHERE site_code = '301';
UPDATE tblevpatientstatus SET site_code = '0301' WHERE site_code = '301';
UPDATE tblpatienttest SET site_code = '0301' WHERE site_code = '301';

-- 306 -> 0306
UPDATE tblaimain SET site_code = '0306' WHERE site_code = '306';
UPDATE tblcimain SET site_code = '0306' WHERE site_code = '306';
UPDATE tbleimain SET site_code = '0306' WHERE site_code = '306';
UPDATE tblavmain SET site_code = '0306' WHERE site_code = '306';
UPDATE tblcvmain SET site_code = '0306' WHERE site_code = '306';
UPDATE tblevmain SET site_code = '0306' WHERE site_code = '306';
UPDATE tblaart SET site_code = '0306' WHERE site_code = '306';
UPDATE tblcart SET site_code = '0306' WHERE site_code = '306';
UPDATE tbleart SET site_code = '0306' WHERE site_code = '306';
UPDATE tblavpatientstatus SET site_code = '0306' WHERE site_code = '306';
UPDATE tblcvpatientstatus SET site_code = '0306' WHERE site_code = '306';
UPDATE tblevpatientstatus SET site_code = '0306' WHERE site_code = '306';
UPDATE tblpatienttest SET site_code = '0306' WHERE site_code = '306';

-- 801 -> 1801 (assuming 801 should be 1801)
UPDATE tblaimain SET site_code = '1801' WHERE site_code = '801';
UPDATE tblcimain SET site_code = '1801' WHERE site_code = '801';
UPDATE tbleimain SET site_code = '1801' WHERE site_code = '801';
UPDATE tblavmain SET site_code = '1801' WHERE site_code = '801';
UPDATE tblcvmain SET site_code = '1801' WHERE site_code = '801';
UPDATE tblevmain SET site_code = '1801' WHERE site_code = '801';
UPDATE tblaart SET site_code = '1801' WHERE site_code = '801';
UPDATE tblcart SET site_code = '1801' WHERE site_code = '801';
UPDATE tbleart SET site_code = '1801' WHERE site_code = '801';
UPDATE tblavpatientstatus SET site_code = '1801' WHERE site_code = '801';
UPDATE tblcvpatientstatus SET site_code = '1801' WHERE site_code = '801';
UPDATE tblevpatientstatus SET site_code = '1801' WHERE site_code = '801';
UPDATE tblpatienttest SET site_code = '1801' WHERE site_code = '801';

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Check current site codes in all tables
SELECT 'tblaimain' as table_name, site_code, COUNT(*) as count 
FROM tblaimain WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblcimain' as table_name, site_code, COUNT(*) as count 
FROM tblcimain WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tbleimain' as table_name, site_code, COUNT(*) as count 
FROM tbleimain WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblavmain' as table_name, site_code, COUNT(*) as count 
FROM tblavmain WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblcvmain' as table_name, site_code, COUNT(*) as count 
FROM tblcvmain WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblevmain' as table_name, site_code, COUNT(*) as count 
FROM tblevmain WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblaart' as table_name, site_code, COUNT(*) as count 
FROM tblaart WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblcart' as table_name, site_code, COUNT(*) as count 
FROM tblcart WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tbleart' as table_name, site_code, COUNT(*) as count 
FROM tbleart WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblavpatientstatus' as table_name, site_code, COUNT(*) as count 
FROM tblavpatientstatus WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblcvpatientstatus' as table_name, site_code, COUNT(*) as count 
FROM tblcvpatientstatus WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblevpatientstatus' as table_name, site_code, COUNT(*) as count 
FROM tblevpatientstatus WHERE site_code IS NOT NULL GROUP BY site_code
UNION ALL
SELECT 'tblpatienttest' as table_name, site_code, COUNT(*) as count 
FROM tblpatienttest WHERE site_code IS NOT NULL GROUP BY site_code
ORDER BY table_name, site_code;

-- Check for any remaining malformed site codes (not 4 digits)
SELECT 'MALFORMED SITE CODES' as status, table_name, site_code, COUNT(*) as count
FROM (
  SELECT 'tblaimain' as table_name, site_code FROM tblaimain WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblcimain' as table_name, site_code FROM tblcimain WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tbleimain' as table_name, site_code FROM tbleimain WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblavmain' as table_name, site_code FROM tblavmain WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblcvmain' as table_name, site_code FROM tblcvmain WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblevmain' as table_name, site_code FROM tblevmain WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblaart' as table_name, site_code FROM tblaart WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblcart' as table_name, site_code FROM tblcart WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tbleart' as table_name, site_code FROM tbleart WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblavpatientstatus' as table_name, site_code FROM tblavpatientstatus WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblcvpatientstatus' as table_name, site_code FROM tblcvpatientstatus WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblevpatientstatus' as table_name, site_code FROM tblevpatientstatus WHERE site_code NOT REGEXP '^[0-9]{4}$'
  UNION ALL
  SELECT 'tblpatienttest' as table_name, site_code FROM tblpatienttest WHERE site_code NOT REGEXP '^[0-9]{4}$'
) malformed
GROUP BY table_name, site_code
ORDER BY table_name, site_code;
