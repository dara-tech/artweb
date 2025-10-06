const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

// Error severity levels
const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error categories
const ERROR_CATEGORIES = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATABASE: 'database',
  NETWORK: 'network',
  BUSINESS_LOGIC: 'business_logic',
  SYSTEM: 'system',
  EXTERNAL_SERVICE: 'external_service'
};

class ErrorLogger {
  constructor() {
    this.errorCounts = new Map();
    this.errorHistory = [];
    this.maxHistorySize = 1000;
  }

  async logError(error, context) {
    const timestamp = new Date().toISOString();
    const errorKey = `${error.name}:${error.message}`;
    
    // Track error frequency
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);
    
    // Create error log entry
    const logEntry = {
      timestamp,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode
      },
      context: {
        method: context.method,
        url: context.url,
        userAgent: context.userAgent,
        ip: context.ip,
        userId: context.userId,
        sessionId: context.sessionId,
        requestId: context.requestId
      },
      severity: this.determineSeverity(error),
      category: this.categorizeError(error),
      frequency: this.errorCounts.get(errorKey),
      environment: process.env.NODE_ENV
    };

    // Add to history
    this.errorHistory.unshift(logEntry);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.pop();
    }

    // Log to console with enhanced formatting
    this.logToConsole(logEntry);

    // Log to file in production
    if (process.env.NODE_ENV === 'production') {
      await this.logToFile(logEntry);
    }

    // Send alerts for critical errors
    if (logEntry.severity === ERROR_SEVERITY.CRITICAL) {
      await this.sendAlert(logEntry);
    }

    return logEntry;
  }

  determineSeverity(error) {
    if (error.statusCode >= 500) return ERROR_SEVERITY.CRITICAL;
    if (error.statusCode >= 400) return ERROR_SEVERITY.MEDIUM;
    if (error.name === 'ValidationError') return ERROR_SEVERITY.LOW;
    if (error.name === 'TokenExpiredError') return ERROR_SEVERITY.LOW;
    return ERROR_SEVERITY.MEDIUM;
  }

  categorizeError(error) {
    if (error.name?.includes('Sequelize')) return ERROR_CATEGORIES.DATABASE;
    if (error.name?.includes('JWT') || error.name?.includes('Token')) return ERROR_CATEGORIES.AUTHENTICATION;
    if (error.name === 'ValidationError') return ERROR_CATEGORIES.VALIDATION;
    if (error.statusCode === 403) return ERROR_CATEGORIES.AUTHORIZATION;
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') return ERROR_CATEGORIES.NETWORK;
    return ERROR_CATEGORIES.SYSTEM;
  }

  logToConsole(logEntry) {
    const severityEmojis = {
      [ERROR_SEVERITY.LOW]: '⚠️',
      [ERROR_SEVERITY.MEDIUM]: '🚨',
      [ERROR_SEVERITY.HIGH]: '🔥',
      [ERROR_SEVERITY.CRITICAL]: '💥'
    };

    console.error(`\n${severityEmojis[logEntry.severity]} ERROR [${logEntry.severity.toUpperCase()}] - ${logEntry.category.toUpperCase()}`);
    console.error(`📅 Time: ${logEntry.timestamp}`);
    console.error(`🌐 Request: ${logEntry.context.method} ${logEntry.context.url}`);
    console.error(`🔢 Status: ${logEntry.error.statusCode || 'Unknown'}`);
    console.error(`📝 Message: ${logEntry.error.message}`);
    console.error(`🔄 Frequency: ${logEntry.frequency} occurrence(s)`);
    
    if (logEntry.context.userId) {
      console.error(`👤 User ID: ${logEntry.context.userId}`);
    }
    
    if (process.env.NODE_ENV === 'development' && logEntry.error.stack) {
      console.error(`📚 Stack Trace:\n${logEntry.error.stack}`);
    }
    console.error('─'.repeat(80));
  }

  async logToFile(logEntry) {
    try {
      const logDir = path.join(process.cwd(), 'logs');
      const logFile = path.join(logDir, `error-${new Date().toISOString().split('T')[0]}.log`);
      
      // Ensure log directory exists
      await fs.mkdir(logDir, { recursive: true });
      
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logFile, logLine);
    } catch (fileError) {
      console.error('Failed to write error log to file:', fileError);
    }
  }

  async sendAlert(logEntry) {
    // Placeholder for alert system (email, Slack, etc.)
    console.error('🚨 CRITICAL ERROR ALERT - Immediate attention required!');
    console.error(`Error: ${logEntry.error.message}`);
    console.error(`URL: ${logEntry.context.url}`);
    console.error(`Frequency: ${logEntry.frequency}`);
  }

  getErrorStats() {
    return {
      totalErrors: this.errorHistory.length,
      errorsByCategory: this.groupBy(this.errorHistory, 'category'),
      errorsBySeverity: this.groupBy(this.errorHistory, 'severity'),
      topErrors: Array.from(this.errorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([error, count]) => ({ error, count }))
    };
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }
}

const errorLogger = new ErrorLogger();

const errorHandler = (err, req, res, next) => {
  const startTime = performance.now();
  
  // Generate unique request ID if not present
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Extract context information
  const context = {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id,
    sessionId: req.sessionID,
    requestId,
    timestamp: new Date().toISOString()
  };

  // Log the error asynchronously
  errorLogger.logError(err, context).catch(logError => {
    console.error('Failed to log error:', logError);
  });

  // Enhanced error response based on error type
  let statusCode = err.statusCode || 500;
  let errorResponse = {
    success: false,
    error: {
      type: err.name || 'UnknownError',
      message: 'An error occurred',
      code: err.code,
      requestId,
      timestamp: context.timestamp
    }
  };

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    const validationErrors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value,
      type: e.type
    }));
    
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'ValidationError',
        message: 'Request validation failed',
        details: validationErrors,
        count: validationErrors.length
      }
    };
  }

  // Sequelize unique constraint errors
  else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    const conflictFields = err.errors?.map(e => e.path) || [];
    
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'ConflictError',
        message: 'Resource already exists',
        details: {
          conflictingFields: conflictFields,
          suggestion: 'Please use different values for the conflicting fields'
        }
      }
    };
  }

  // Sequelize foreign key constraint errors
  else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'ReferenceError',
        message: 'Referenced resource does not exist',
        details: {
          table: err.table,
          constraint: err.constraint,
          suggestion: 'Please ensure all referenced resources exist'
        }
      }
    };
  }

  // Database connection errors
  else if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    statusCode = 503;
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'ServiceUnavailableError',
        message: 'Database service temporarily unavailable',
        retryAfter: 30
      }
    };
  }

  // JWT authentication errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'AuthenticationError',
        message: 'Invalid authentication token',
        details: {
          reason: 'Token is malformed or invalid',
          action: 'Please login again'
        }
      }
    };
  }

  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'AuthenticationError',
        message: 'Authentication token has expired',
        details: {
          expiredAt: err.expiredAt,
          action: 'Please login again'
        }
      }
    };
  }

  // Authorization errors
  else if (statusCode === 403) {
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'AuthorizationError',
        message: 'Insufficient permissions',
        details: {
          requiredPermission: err.requiredPermission,
          userPermissions: err.userPermissions
        }
      }
    };
  }

  // Rate limiting errors
  else if (err.name === 'TooManyRequestsError') {
    statusCode = 429;
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'RateLimitError',
        message: 'Too many requests',
        details: {
          limit: err.limit,
          remaining: 0,
          resetTime: err.resetTime
        }
      }
    };
  }

  // File upload errors
  else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'FileSizeError',
        message: 'File size exceeds limit',
        details: {
          maxSize: err.limit,
          receivedSize: err.received
        }
      }
    };
  }

  // Network/timeout errors
  else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    statusCode = 503;
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'NetworkError',
        message: 'External service unavailable',
        details: {
          service: err.address || 'Unknown',
          retryAfter: 60
        }
      }
    };
  }

  // Default server errors
  else {
    errorResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        type: 'ServerError',
        message: process.env.NODE_ENV === 'production' 
          ? 'An unexpected error occurred' 
          : err.message || 'Internal Server Error'
      }
    };
  }

  // Add development-only information
  if (process.env.NODE_ENV === 'development') {
    errorResponse.debug = {
      stack: err.stack,
      originalError: {
        name: err.name,
        message: err.message,
        code: err.code
      },
      processingTime: `${(performance.now() - startTime).toFixed(2)}ms`
    };
  }

  // Add error statistics for monitoring
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stats = errorLogger.getErrorStats();
  }

  // Set security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Export both the handler and logger for external use
module.exports = { 
  errorHandler, 
  errorLogger, 
  ERROR_SEVERITY, 
  ERROR_CATEGORIES 
};
