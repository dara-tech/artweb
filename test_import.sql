-- Test SQL file for import functionality
-- This file will create a simple test table

CREATE TABLE IF NOT EXISTS test_patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinic_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT,
    sex ENUM('M', 'F') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some test data
INSERT INTO test_patients (clinic_id, name, age, sex) VALUES
('TEST001', 'John Doe', 35, 'M'),
('TEST002', 'Jane Smith', 28, 'F'),
('TEST003', 'Bob Johnson', 42, 'M');

-- Create an index
CREATE INDEX idx_clinic_id ON test_patients(clinic_id);

-- Create a view
CREATE VIEW v_active_patients AS
SELECT clinic_id, name, age, sex, created_at
FROM test_patients
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR);
