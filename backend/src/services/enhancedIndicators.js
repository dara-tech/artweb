const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');

class EnhancedIndicatorsService {
  constructor() {
    this.queries = new Map();
    this.loadAllQueries();
  }

  loadAllQueries() {
    const queriesDir = path.join(__dirname, '../queries/indicators');
    
    try {
      const files = fs.readdirSync(queriesDir);
      
      files.forEach(file => {
        if (file.endsWith('.sql') && file !== 'variables.sql') {
          const indicatorId = file.replace('.sql', '');
          const query = fs.readFileSync(path.join(queriesDir, file), 'utf8');
          this.queries.set(indicatorId, query);
        }
      });
    } catch (error) {
      console.error('Error loading queries:', error);
    }
  }

  async executeWithProgress(indicatorId, params, res) {
    try {
      if (indicatorId === 'all') {
        return await this.executeAllIndicators(params, res);
      }
      
      const query = this.queries.get(indicatorId);
      if (!query) {
        throw new Error(`Indicator ${indicatorId} not found`);
      }

      const processedQuery = this.processQuery(query, params);
      const result = await sequelize.query(processedQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: params
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async executeAllIndicators(params, res) {
    const results = [];
    const errors = [];
    let successCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    // Get all available indicators
    const indicatorIds = Array.from(this.queries.keys()).filter(id => !id.includes('_details'));

    for (const indicatorId of indicatorIds) {
      try {
        const query = this.queries.get(indicatorId);
        if (!query) continue;

        const processedQuery = this.processQuery(query, params);
        const result = await sequelize.query(processedQuery, {
          type: sequelize.QueryTypes.SELECT,
          replacements: params
        });

        if (result && result.length > 0) {
          results.push(...result);
          successCount++;
        }
      } catch (error) {
        errors.push({
          indicator: indicatorId,
          error: error.message
        });
        errorCount++;
      }
    }

    const executionTime = Date.now() - startTime;

    return results;
  }

  processQuery(query, params) {
    // Replace parameter placeholders with actual values
    let processedQuery = query;
    
    // Replace :parameterName with actual values
    Object.keys(params).forEach(key => {
      const placeholder = `:${key}`;
      const value = params[key];
      
      if (value !== null && value !== undefined) {
        // Escape special regex characters in the placeholder
        const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (typeof value === 'string') {
          processedQuery = processedQuery.replace(new RegExp(escapedPlaceholder, 'g'), `'${value}'`);
        } else {
          processedQuery = processedQuery.replace(new RegExp(escapedPlaceholder, 'g'), value);
        }
      }
    });

    return processedQuery;
  }

  getAvailableIndicators() {
    return Array.from(this.queries.keys());
  }
}

module.exports = new EnhancedIndicatorsService();