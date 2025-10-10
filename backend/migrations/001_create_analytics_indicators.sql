-- Migration: Create analytics_indicators table
-- Description: Pre-calculated indicator values for fast reporting
-- Created: 2025-01-09

CREATE TABLE IF NOT EXISTS analytics_indicators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  indicator_id VARCHAR(50) NOT NULL COMMENT 'Indicator identifier (e.g., "1", "10.6", "10.8")',
  indicator_name VARCHAR(255) NOT NULL COMMENT 'Full indicator name',
  site_code VARCHAR(20) NOT NULL COMMENT 'Site code (e.g., "2101", "2102")',
  site_name VARCHAR(255) NOT NULL COMMENT 'Site name',
  period_type ENUM('quarterly', 'monthly', 'yearly') NOT NULL DEFAULT 'quarterly' COMMENT 'Period type for the calculation',
  period_year INT NOT NULL COMMENT 'Year of the period',
  period_quarter INT NULL COMMENT 'Quarter (1-4) for quarterly periods',
  period_month INT NULL COMMENT 'Month (1-12) for monthly periods',
  start_date DATE NOT NULL COMMENT 'Start date of the period',
  end_date DATE NOT NULL COMMENT 'End date of the period',
  previous_end_date DATE NULL COMMENT 'Previous period end date for comparison',
  
  -- Aggregated values
  total INT NOT NULL DEFAULT 0 COMMENT 'Total count/value for the indicator',
  male_0_14 INT NOT NULL DEFAULT 0 COMMENT 'Male patients aged 0-14',
  female_0_14 INT NOT NULL DEFAULT 0 COMMENT 'Female patients aged 0-14',
  male_over_14 INT NOT NULL DEFAULT 0 COMMENT 'Male patients aged 15+',
  female_over_14 INT NOT NULL DEFAULT 0 COMMENT 'Female patients aged 15+',
  
  -- Metadata
  calculation_status ENUM('pending', 'calculating', 'completed', 'failed') NOT NULL DEFAULT 'pending' COMMENT 'Status of the calculation',
  calculation_started_at DATETIME NULL COMMENT 'When calculation started',
  calculation_completed_at DATETIME NULL COMMENT 'When calculation completed',
  calculation_duration_ms INT NULL COMMENT 'Calculation duration in milliseconds',
  error_message TEXT NULL COMMENT 'Error message if calculation failed',
  
  -- Data freshness
  data_version VARCHAR(50) NULL COMMENT 'Version of the data source',
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Last time this record was updated',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for fast lookups
  INDEX idx_analytics_indicator_lookup (indicator_id, site_code, period_year, period_quarter, period_month),
  INDEX idx_analytics_period (period_type, period_year, period_quarter, period_month),
  INDEX idx_analytics_site (site_code, indicator_id),
  INDEX idx_analytics_status (calculation_status, last_updated),
  INDEX idx_analytics_dates (start_date, end_date),
  
  -- Unique constraint to prevent duplicates
  UNIQUE KEY uk_analytics_unique (indicator_id, site_code, period_type, period_year, period_quarter, period_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pre-calculated indicator values for fast reporting';

-- Insert sample data for testing
INSERT INTO analytics_indicators (
  indicator_id, indicator_name, site_code, site_name, period_type, period_year, period_quarter,
  start_date, end_date, previous_end_date, total, male_0_14, female_0_14, male_over_14, female_over_14,
  calculation_status, calculation_completed_at, last_updated
) VALUES 
(
  '1', 'Active ART patients in previous quarter', '2101', 'Takeo PH', 'quarterly', 2025, 2,
  '2025-04-01', '2025-06-30', '2025-03-31', 1500, 200, 300, 500, 500,
  'completed', NOW(), NOW()
),
(
  '10.6', 'Eligible for VL test', '2101', 'Takeo PH', 'quarterly', 2025, 2,
  '2025-04-01', '2025-06-30', '2025-03-31', 1200, 150, 250, 400, 400,
  'completed', NOW(), NOW()
),
(
  '1', 'Active ART patients in previous quarter', '2102', 'Kirivong', 'quarterly', 2025, 2,
  '2025-04-01', '2025-06-30', '2025-03-31', 800, 100, 150, 250, 300,
  'completed', NOW(), NOW()
);
