-- Create sites table for the registry
USE preart_sites_registry;

CREATE TABLE IF NOT EXISTS tblartsite (
    sid VARCHAR(10) PRIMARY KEY,
    siteName VARCHAR(100) NOT NULL,
    status INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some sample sites
INSERT INTO tblartsite (sid, siteName, status) VALUES
('0201', 'Sample Health Center 1', 1),
('0202', 'Sample Health Center 2', 1),
('0301', 'Sample Hospital 1', 1),
('0302', 'Sample Hospital 2', 1);
