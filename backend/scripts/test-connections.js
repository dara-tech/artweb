
      const { siteDatabaseManager } = require('../src/config/siteDatabase');
      
      async function testConnections() {
        try {
          await siteDatabaseManager.testAllConnections();
          console.log('✅ All database connections are working correctly!');
          process.exit(0);
        } catch (error) {
          console.error('❌ Database connection test failed:', error);
          process.exit(1);
        }
      }
      
      testConnections();
    