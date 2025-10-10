const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnalyticsIndicator = sequelize.define('AnalyticsIndicator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  indicator_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Indicator identifier (e.g., "1", "10.6", "10.8")'
  },
  indicator_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Full indicator name'
  },
  site_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Site code (e.g., "2101", "2102")'
  },
  site_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Site name'
  },
  period_type: {
    type: DataTypes.ENUM('quarterly', 'monthly', 'yearly'),
    allowNull: false,
    defaultValue: 'quarterly',
    comment: 'Period type for the calculation'
  },
  period_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Year of the period'
  },
  period_quarter: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Quarter (1-4) for quarterly periods'
  },
  period_month: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Month (1-12) for monthly periods'
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Start date of the period'
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'End date of the period'
  },
  previous_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Previous period end date for comparison'
  },
  // Aggregated values
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total count/value for the indicator'
  },
  male_0_14: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Male patients aged 0-14'
  },
  female_0_14: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Female patients aged 0-14'
  },
  male_over_14: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Male patients aged 15+'
  },
  female_over_14: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Female patients aged 15+'
  },
  // Metadata
  calculation_status: {
    type: DataTypes.ENUM('pending', 'calculating', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
    comment: 'Status of the calculation'
  },
  calculation_started_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When calculation started'
  },
  calculation_completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When calculation completed'
  },
  calculation_duration_ms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Calculation duration in milliseconds'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Error message if calculation failed'
  },
  // Data freshness
  data_version: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Version of the data source'
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Last time this record was updated'
  }
}, {
  tableName: 'analytics_indicators',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  // Map camelCase to snake_case for database columns
  fieldMapping: {
    indicatorId: 'indicator_id',
    indicatorName: 'indicator_name',
    siteCode: 'site_code',
    siteName: 'site_name',
    periodType: 'period_type',
    periodYear: 'period_year',
    periodQuarter: 'period_quarter',
    periodMonth: 'period_month',
    startDate: 'start_date',
    endDate: 'end_date',
    previousEndDate: 'previous_end_date',
    calculationStatus: 'calculation_status',
    calculationStartedAt: 'calculation_started_at',
    calculationCompletedAt: 'calculation_completed_at',
    calculationDurationMs: 'calculation_duration_ms',
    errorMessage: 'error_message',
    dataVersion: 'data_version',
    lastUpdated: 'last_updated'
  },
  indexes: [
    {
      name: 'idx_analytics_indicator_lookup',
      fields: ['indicator_id', 'site_code', 'period_year', 'period_quarter', 'period_month']
    },
    {
      name: 'idx_analytics_period',
      fields: ['period_type', 'period_year', 'period_quarter', 'period_month']
    },
    {
      name: 'idx_analytics_site',
      fields: ['site_code', 'indicator_id']
    },
    {
      name: 'idx_analytics_status',
      fields: ['calculation_status', 'last_updated']
    },
    {
      name: 'idx_analytics_dates',
      fields: ['start_date', 'end_date']
    }
  ],
  comment: 'Pre-calculated indicator values for fast reporting'
});

module.exports = AnalyticsIndicator;
