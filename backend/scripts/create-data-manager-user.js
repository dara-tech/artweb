const { User } = require('../src/models');
const bcrypt = require('bcryptjs');

async function createDataManagerUser() {
  try {
    console.log('🚀 Creating Data Manager user...');
    
    // Check if data manager user already exists
    const existingUser = await User.findOne({
      where: { username: 'data_manager' }
    });
    
    if (existingUser) {
      console.log('✅ Data Manager user already exists');
      return;
    }
    
    // Create new data manager user
    const dataManager = await User.create({
      username: 'data_manager',
      password: 'DataManager2025!', // Change this password
      fullName: 'Data Manager',
      role: 'data_manager',
      status: 1,
      assignedSites: null // Can access all sites
    });
    
    console.log('✅ Data Manager user created successfully');
    console.log('📋 User Details:');
    console.log(`   Username: ${dataManager.username}`);
    console.log(`   Full Name: ${dataManager.fullName}`);
    console.log(`   Role: ${dataManager.role}`);
    console.log(`   Status: ${dataManager.status ? 'Active' : 'Inactive'}`);
    console.log('⚠️  Please change the default password after first login');
    
  } catch (error) {
    console.error('❌ Error creating Data Manager user:', error);
    throw error;
  }
}

async function updateExistingUserToDataManager() {
  try {
    console.log('🔄 Updating existing users to data_manager role...');
    
    // Find users with admin or super_admin role
    const adminUsers = await User.findAll({
      where: {
        role: ['admin', 'super_admin']
      }
    });
    
    if (adminUsers.length === 0) {
      console.log('ℹ️  No admin users found to update');
      return;
    }
    
    console.log(`📋 Found ${adminUsers.length} admin users:`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.fullName}) - ${user.role}`);
    });
    
    // Ask for confirmation (in a real script, you'd use readline)
    console.log('⚠️  This will update admin users to data_manager role');
    console.log('⚠️  Only proceed if you want to change their permissions');
    
    // For now, just show what would be updated
    console.log('ℹ️  To update users, uncomment the code below and run again');
    
    /*
    for (const user of adminUsers) {
      await user.update({ role: 'data_manager' });
      console.log(`✅ Updated ${user.username} to data_manager role`);
    }
    */
    
  } catch (error) {
    console.error('❌ Error updating users:', error);
    throw error;
  }
}

async function listAllUsers() {
  try {
    console.log('📋 All users in the system:');
    
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullName', 'role', 'status', 'assignedSites']
    });
    
    if (users.length === 0) {
      console.log('ℹ️  No users found');
      return;
    }
    
    users.forEach(user => {
      const statusText = user.status ? 'Active' : 'Inactive';
      const sitesText = user.assignedSites ? JSON.stringify(user.assignedSites) : 'All sites';
      console.log(`   ${user.id}. ${user.username} (${user.fullName}) - ${user.role} - ${statusText} - Sites: ${sitesText}`);
    });
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🔧 Data Manager User Management Script');
    console.log('=====================================');
    
    // List all users first
    await listAllUsers();
    console.log('');
    
    // Create data manager user
    await createDataManagerUser();
    console.log('');
    
    // Show option to update existing users
    await updateExistingUserToDataManager();
    
    console.log('');
    console.log('✅ Script completed successfully');
    console.log('');
    console.log('📋 Data Manager Role Permissions:');
    console.log('   - data_import: Import SQL files and data');
    console.log('   - data_export: Export data from databases');
    console.log('   - database_management: Create, delete, manage databases');
    console.log('   - reports: Access to all reports');
    console.log('   - indicator_reports: Access to indicator reports');
    console.log('   - view_data: View all data');
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createDataManagerUser,
  updateExistingUserToDataManager,
  listAllUsers
};
