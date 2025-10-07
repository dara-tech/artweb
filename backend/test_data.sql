-- Test data script to create sample tables and data for testing datevisit field
-- This will create a test site with sample patient data

-- Create test database
CREATE DATABASE IF NOT EXISTS `test_site_001`;
USE `test_site_001`;

-- Create tblaimain (Adult patient main data)
CREATE TABLE IF NOT EXISTS `tblaimain` (
  `ClinicID` varchar(50) NOT NULL,
  `DafirstVisit` date NOT NULL,
  `TypeofReturn` varchar(50) DEFAULT '',
  `LClinicID` varchar(50) DEFAULT '',
  `SiteNameold` varchar(100) DEFAULT '',
  `DaBirth` date NOT NULL,
  `Sex` tinyint(1) NOT NULL,
  `DaHIV` date NOT NULL,
  `OffIn` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ClinicID`)
);

-- Create tblcimain (Child patient main data)
CREATE TABLE IF NOT EXISTS `tblcimain` (
  `ClinicID` varchar(50) NOT NULL,
  `DafirstVisit` date NOT NULL,
  `TypeofReturn` varchar(50) DEFAULT '',
  `LClinicID` varchar(50) DEFAULT '',
  `SiteNameold` varchar(100) DEFAULT '',
  `DaBirth` date NOT NULL,
  `Sex` tinyint(1) NOT NULL,
  `DaTest` date NOT NULL,
  `OffIn` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ClinicID`)
);

-- Create tblaart (Adult ART data)
CREATE TABLE IF NOT EXISTS `tblaart` (
  `ClinicID` varchar(50) NOT NULL,
  `ART` varchar(50) NOT NULL,
  `DaArt` date NOT NULL,
  PRIMARY KEY (`ClinicID`)
);

-- Create tblcart (Child ART data)
CREATE TABLE IF NOT EXISTS `tblcart` (
  `ClinicID` varchar(50) NOT NULL,
  `ART` varchar(50) NOT NULL,
  `DaArt` date NOT NULL,
  PRIMARY KEY (`ClinicID`)
);

-- Create tblavmain (Adult visit data)
CREATE TABLE IF NOT EXISTS `tblavmain` (
  `clinicid` varchar(50) NOT NULL,
  `DatVisit` date NOT NULL,
  `ARTnum` varchar(50) DEFAULT '',
  `DaApp` date NOT NULL,
  `vid` varchar(50) NOT NULL,
  PRIMARY KEY (`vid`)
);

-- Create tblcvmain (Child visit data)
CREATE TABLE IF NOT EXISTS `tblcvmain` (
  `clinicid` varchar(50) NOT NULL,
  `DatVisit` date NOT NULL,
  `ARTnum` varchar(50) DEFAULT '',
  `DaApp` date NOT NULL,
  `vid` varchar(50) NOT NULL,
  PRIMARY KEY (`vid`)
);

-- Create tblavarvdrug (Adult ARV drug data)
CREATE TABLE IF NOT EXISTS `tblavarvdrug` (
  `vid` varchar(50) NOT NULL,
  `DrugName` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT 0
);

-- Create tblcvarvdrug (Child ARV drug data)
CREATE TABLE IF NOT EXISTS `tblcvarvdrug` (
  `vid` varchar(50) NOT NULL,
  `DrugName` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT 0
);

-- Create tblavpatientstatus (Adult patient status)
CREATE TABLE IF NOT EXISTS `tblavpatientstatus` (
  `clinicid` varchar(50) NOT NULL,
  `da` date NOT NULL,
  `status` tinyint(1) DEFAULT NULL
);

-- Create tblcvpatientstatus (Child patient status)
CREATE TABLE IF NOT EXISTS `tblcvpatientstatus` (
  `clinicid` varchar(50) NOT NULL,
  `da` date NOT NULL,
  `status` tinyint(1) DEFAULT NULL
);

-- Create tblpatienttest (Patient test data)
CREATE TABLE IF NOT EXISTS `tblpatienttest` (
  `ClinicID` varchar(50) NOT NULL,
  `DaArrival` date NOT NULL,
  `Dat` date NOT NULL,
  `HIVLoad` decimal(10,2) DEFAULT NULL
);

-- Create tblavtptdrug (Adult TPT drug data)
CREATE TABLE IF NOT EXISTS `tblavtptdrug` (
  `DrugName` varchar(100) NOT NULL,
  `Status` tinyint(1) DEFAULT 0,
  `Da` date NOT NULL,
  `Vid` varchar(50) NOT NULL
);

-- Create tblcvtptdrug (Child TPT drug data)
CREATE TABLE IF NOT EXISTS `tblcvtptdrug` (
  `DrugName` varchar(100) NOT NULL,
  `Status` tinyint(1) DEFAULT 0,
  `Da` date NOT NULL,
  `Vid` varchar(50) NOT NULL
);

-- Insert sample adult patient data
INSERT INTO `tblaimain` VALUES 
('P001', '2023-01-15', '', 'L001', 'Test Site 1', '1985-03-20', 1, '2023-01-10', 0),
('P002', '2023-02-20', '', 'L002', 'Test Site 1', '1990-07-15', 0, '2023-02-15', 0),
('P003', '2023-03-10', '', 'L003', 'Test Site 1', '1988-11-30', 1, '2023-03-05', 0);

-- Insert sample child patient data
INSERT INTO `tblcimain` VALUES 
('C001', '2023-01-20', '', 'L004', 'Test Site 1', '2015-05-10', 0, '2023-01-18', 0),
('C002', '2023-02-25', '', 'L005', 'Test Site 1', '2018-09-22', 1, '2023-02-20', 0);

-- Insert sample ART data for adults
INSERT INTO `tblaart` VALUES 
('P001', 'ART001', '2023-01-20'),
('P002', 'ART002', '2023-02-25'),
('P003', 'ART003', '2023-03-15');

-- Insert sample ART data for children
INSERT INTO `tblcart` VALUES 
('C001', 'ART004', '2023-01-25'),
('C002', 'ART005', '2023-03-01');

-- Insert sample visit data for adults (with different visit dates for MMD testing)
INSERT INTO `tblavmain` VALUES 
('P001', '2024-01-15', 'ART001', '2024-04-15', 'V001'),  -- 90 days = MMD eligible
('P001', '2024-04-15', 'ART001', '2024-07-15', 'V002'),  -- 90 days = MMD eligible
('P002', '2024-02-20', 'ART002', '2024-05-20', 'V003'),  -- 90 days = MMD eligible
('P002', '2024-05-20', 'ART002', '2024-08-20', 'V004'),  -- 90 days = MMD eligible
('P003', '2024-03-10', 'ART003', '2024-06-10', 'V005');  -- 90 days = MMD eligible

-- Insert sample visit data for children
INSERT INTO `tblcvmain` VALUES 
('C001', '2024-01-20', 'ART004', '2024-04-20', 'V006'),  -- 90 days = MMD eligible
('C002', '2024-02-25', 'ART005', '2024-05-25', 'V007');  -- 90 days = MMD eligible

-- Insert sample ARV drug data (TLD regimen)
INSERT INTO `tblavarvdrug` VALUES 
('V001', '3TC+DTG+TDF', 0),
('V002', '3TC+DTG+TDF', 0),
('V003', '3TC+DTG+TDF', 0),
('V004', '3TC+DTG+TDF', 0),
('V005', '3TC+DTG+TDF', 0);

INSERT INTO `tblcvarvdrug` VALUES 
('V006', '3TC+DTG+TDF', 0),
('V007', '3TC+DTG+TDF', 0);

-- Insert sample viral load test data
INSERT INTO `tblpatienttest` VALUES 
('P001', '2024-01-15', '2024-01-20', 500.00),
('P002', '2024-02-20', '2024-02-25', 800.00),
('P003', '2024-03-10', '2024-03-15', 1200.00),
('C001', '2024-01-20', '2024-01-25', 300.00),
('C002', '2024-02-25', '2024-03-01', 600.00);

-- Insert sample TPT drug data
INSERT INTO `tblavtptdrug` VALUES 
('Isoniazid', 0, '2024-01-20', 'V001'),
('Isoniazid', 1, '2024-04-20', 'V001'),
('Isoniazid', 0, '2024-02-25', 'V003'),
('Isoniazid', 1, '2024-05-25', 'V003');

INSERT INTO `tblcvtptdrug` VALUES 
('Isoniazid', 0, '2024-01-25', 'V006'),
('Isoniazid', 1, '2024-04-25', 'V006');

-- Note: No patient status data (tblavpatientstatus, tblcvpatientstatus) means patients are active


