const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const { siteDatabaseManager, testConnections } = require('./config/siteDatabase');
const authRoutes = require('./routes/auth');
const adultPatientRoutes = require('./routes/adultPatients');
const childPatientRoutes = require('./routes/childPatients');
const infantPatientRoutes = require('./routes/infantPatients');
const adultVisitRoutes = require('./routes/adultVisits');
const adultArvDrugRoutes = require('./routes/adultArvDrugs');
const childVisitRoutes = require('./routes/childVisits');
const infantVisitRoutes = require('./routes/infantVisits');
const lookupRoutes = require('./routes/lookups');
const backupRoutes = require('./routes/backup');
const sitesRoutes = require('./routes/sites');
const siteManagementRoutes = require('./routes/site-management');
const siteOperationsRoutes = require('./routes/site-operations');
const siteIndicatorsRoutes = require('./routes/site-indicators');
const performanceRoutes = require('./routes/performance');
const reportingIndicatorsRoutes = require('./routes/reporting-indicators');
const dataImportExportRoutes = require('./routes/data-import-export');
const cleanupRoutes = require('./routes/cleanup');
const simpleCleanupRoutes = require('./routes/simple-cleanup');
const fullCleanupRoutes = require('./routes/full-cleanup');
const completeCleanupRoutes = require('./routes/complete-cleanup');
const updateSitesRoutes = require('./routes/update-sites');
const userManagementRoutes = require('./routes/user-management');
const indicatorsRoutes = require('./routes/indicators');
const optimizedIndicatorsRoutes = require('./routes/optimized-indicators');
const enhancedIndicatorsRoutes = require('./routes/enhanced-indicators');
const enhancedConflictResolutionRoutes = require('./routes/enhanced-conflict-resolution');
const auditRoutes = require('./routes/audit');
const backupScheduler = require('./services/backupScheduler');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'

    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const PORT = process.env.PORT || 3001;

// CORS configuration - MUST be before other middleware
// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',  // Current local port
    'http://192.168.1.249:5174',  // Current network IP and port
    'http://192.168.1.249:5173',  // Current network IP with default port
    'http://192.168.10.205:5173',
    'http://192.168.0.146:5173',  // Fixed port
    'http://192.168.0.146:5174',
    'http://192.168.0.63:5173',  // Current server IP
    'http://192.168.0.63:3000', 
    'http://172.20.10.5:5173', // Alternative port
    /^http:\/\/192\.168\.\d+\.\d+:5173$/,  // Allow any device on 192.168.x.x network
    /^http:\/\/192\.168\.\d+\.\d+:5174$/,  // Allow any device on 192.168.x.x network with port 5174
    /^http:\/\/192\.168\.\d+\.\d+:3000$/,   // Allow any device on 192.168.x.x network
    /^http:\/\/192\.168\.\d+\.\d+:3001$/   // Allow backend port on 192.168.x.x network
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma', 'Expires'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Security middleware - after CORS
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Disable to allow CORS
  contentSecurityPolicy: false // Disable CSP for development
}));
app.use(compression());

// Rate limiting - temporarily disabled for testing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients/adult', adultPatientRoutes);
app.use('/api/patients/child', childPatientRoutes);
app.use('/api/patients/infant', infantPatientRoutes);
app.use('/api/visits/adult', adultVisitRoutes);
app.use('/api', adultArvDrugRoutes);
app.use('/api/visits/child', childVisitRoutes);
app.use('/api/visits/infant', infantVisitRoutes);
app.use('/api/lookups', lookupRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/site-management', siteManagementRoutes);
app.use('/api/site-operations', siteOperationsRoutes);
app.use('/api/site-indicators', siteIndicatorsRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/indicators-optimized', optimizedIndicatorsRoutes);
app.use('/api/data', dataImportExportRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/cleanup', cleanupRoutes);
app.use('/api/simple-cleanup', simpleCleanupRoutes);
app.use('/api/full-cleanup', fullCleanupRoutes);
app.use('/api/complete-cleanup', completeCleanupRoutes);
app.use('/api/update-sites', updateSitesRoutes);
app.use('/api/user-management', userManagementRoutes);
app.use('/api/indicators', indicatorsRoutes);
app.use('/api/indicators-enhanced', enhancedIndicatorsRoutes);
app.use('/api/conflict-resolution', enhancedConflictResolutionRoutes);
app.use('/api/audit', auditRoutes);

// Make io available to routes
app.set('io', io);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
  
  // Join aggregation room for real-time updates
  socket.on('join-aggregation', (data) => {
    socket.join('aggregation');
    console.log(`📊 Client ${socket.id} joined aggregation room`);
  });
  
  socket.on('leave-aggregation', () => {
    socket.leave('aggregation');
    console.log(`📊 Client ${socket.id} left aggregation room`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
const startServer = async () => {
  try {
    // Test both old and new database connections
    await testConnection();
    await testConnections();
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      
      // Start backup scheduler
      backupScheduler.start();
      console.log('📅 Backup scheduler started');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
