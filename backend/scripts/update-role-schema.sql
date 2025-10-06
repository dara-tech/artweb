-- Update Role enum to include data_manager
USE preart_sites_registry;

ALTER TABLE tbluser 
MODIFY COLUMN Role ENUM(
  'super_admin', 
  'admin', 
  'doctor', 
  'nurse', 
  'data_entry', 
  'viewer', 
  'site_manager', 
  'data_manager'
) NOT NULL DEFAULT 'viewer';

-- Verify the change
SHOW COLUMNS FROM tbluser LIKE 'Role';
