-- Database Performance Optimization Script
-- Run this script to add indexes and optimize database performance

-- ===================================================================
-- INDEXES FOR FREQUENTLY QUERIED COLUMNS
-- ===================================================================

-- Adult Visits (tblavmain)
CREATE INDEX idx_avmain_clinicid ON tblavmain(ClinicID);
CREATE INDEX idx_avmain_datvisit ON tblavmain(DatVisit);
CREATE INDEX idx_avmain_typevisit ON tblavmain(TypeVisit);
CREATE INDEX idx_avmain_site_code ON tblavmain(site_code);

-- Child Visits (tblcvmain)
CREATE INDEX idx_cvmain_clinicid ON tblcvmain(ClinicID);
CREATE INDEX idx_cvmain_datvisit ON tblcvmain(DatVisit);
CREATE INDEX idx_cvmain_typevisit ON tblcvmain(TypeVisit);
CREATE INDEX idx_cvmain_site_code ON tblcvmain(site_code);

-- Infant Visits (tblevmain)
CREATE INDEX idx_evmain_clinicid ON tblevmain(ClinicID);
CREATE INDEX idx_evmain_datvisit ON tblevmain(DatVisit);
CREATE INDEX idx_evmain_typevisit ON tblevmain(TypeVisit);
CREATE INDEX idx_evmain_site_code ON tblevmain(site_code);

-- Adult Patients (tblaimain)
CREATE INDEX idx_aimain_clinicid ON tblaimain(ClinicID);
CREATE INDEX idx_aimain_dabirth ON tblaimain(DaBirth);
CREATE INDEX idx_aimain_sex ON tblaimain(Sex);
CREATE INDEX idx_aimain_site_code ON tblaimain(site_code);

-- Child Patients (tblcimain)
CREATE INDEX idx_cimain_clinicid ON tblcimain(ClinicID);
CREATE INDEX idx_cimain_dabirth ON tblcimain(DaBirth);
CREATE INDEX idx_cimain_sex ON tblcimain(Sex);
CREATE INDEX idx_cimain_site_code ON tblcimain(site_code);

-- Infant Patients (tbleimain)
CREATE INDEX idx_eimain_clinicid ON tbleimain(ClinicID);
CREATE INDEX idx_eimain_dabirth ON tbleimain(DaBirth);
CREATE INDEX idx_eimain_sex ON tbleimain(Sex);
CREATE INDEX idx_eimain_site_code ON tbleimain(site_code);

-- Patient Tests (tblpatienttest)
CREATE INDEX idx_patienttest_clinicid ON tblpatienttest(ClinicID);
CREATE INDEX idx_patienttest_dat ON tblpatienttest(Dat);
CREATE INDEX idx_patienttest_hivload ON tblpatienttest(HIVLoad);
CREATE INDEX idx_patienttest_site_code ON tblpatienttest(site_code);

-- Patient Status Tables
CREATE INDEX idx_avpatientstatus_clinicid ON tblavpatientstatus(ClinicID);
CREATE INDEX idx_avpatientstatus_da ON tblavpatientstatus(Da);
CREATE INDEX idx_avpatientstatus_status ON tblavpatientstatus(Status);

CREATE INDEX idx_cvpatientstatus_clinicid ON tblcvpatientstatus(ClinicID);
CREATE INDEX idx_cvpatientstatus_da ON tblcvpatientstatus(Da);
CREATE INDEX idx_cvpatientstatus_status ON tblcvpatientstatus(Status);

CREATE INDEX idx_evpatientstatus_clinicid ON tblevpatientstatus(ClinicID);
CREATE INDEX idx_evpatientstatus_dastatus ON tblevpatientstatus(DaStatus);
CREATE INDEX idx_evpatientstatus_status ON tblevpatientstatus(Status);

-- ===================================================================
-- COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- ===================================================================

-- For visit queries with site filtering and date ranges
CREATE INDEX idx_avmain_site_date ON tblavmain(site_code, DatVisit);
CREATE INDEX idx_cvmain_site_date ON tblcvmain(site_code, DatVisit);
CREATE INDEX idx_evmain_site_date ON tblevmain(site_code, DatVisit);

-- For patient status queries
CREATE INDEX idx_avpatientstatus_clinicid_da ON tblavpatientstatus(ClinicID, Da);
CREATE INDEX idx_cvpatientstatus_clinicid_da ON tblcvpatientstatus(ClinicID, Da);
CREATE INDEX idx_evpatientstatus_clinicid_da ON tblevpatientstatus(ClinicID, DaStatus);

-- For viral load queries
CREATE INDEX idx_patienttest_clinicid_dat ON tblpatienttest(ClinicID, Dat);
CREATE INDEX idx_patienttest_hivload_dat ON tblpatienttest(HIVLoad, Dat);

-- ===================================================================
-- QUERY OPTIMIZATION SETTINGS
-- ===================================================================

-- Increase MySQL buffer sizes for better performance
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
SET GLOBAL innodb_log_buffer_size = 16777216; -- 16MB
SET GLOBAL max_connections = 200;

-- Optimize for bulk operations
SET GLOBAL innodb_flush_log_at_trx_commit = 2;
SET GLOBAL sync_binlog = 0;

-- ===================================================================
-- TABLE OPTIMIZATION
-- ===================================================================

-- Analyze tables to update statistics
ANALYZE TABLE tblavmain;
ANALYZE TABLE tblcvmain;
ANALYZE TABLE tblevmain;
ANALYZE TABLE tblaimain;
ANALYZE TABLE tblcimain;
ANALYZE TABLE tbleimain;
ANALYZE TABLE tblpatienttest;
ANALYZE TABLE tblavpatientstatus;
ANALYZE TABLE tblcvpatientstatus;
ANALYZE TABLE tblevpatientstatus;

-- Optimize tables to reclaim space and improve performance
OPTIMIZE TABLE tblavmain;
OPTIMIZE TABLE tblcvmain;
OPTIMIZE TABLE tblevmain;
OPTIMIZE TABLE tblaimain;
OPTIMIZE TABLE tblcimain;
OPTIMIZE TABLE tbleimain;
OPTIMIZE TABLE tblpatienttest;
OPTIMIZE TABLE tblavpatientstatus;
OPTIMIZE TABLE tblcvpatientstatus;
OPTIMIZE TABLE tblevpatientstatus;
