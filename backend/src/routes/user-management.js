const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', [authenticateToken], async (req, res) => {
  try {
    const [users] = await sequelize.query(`
      SELECT Uid as id, User as username, Fullname as fullName, Status as status
      FROM tbluser 
      ORDER BY Uid
    `);

    res.json({
      success: true,
      users: users
    });

  } catch (error) {
    console.error('❌ Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
      message: error.message
    });
  }
});

// Update user username and status
router.post('/update-user', [authenticateToken], async (req, res) => {
  try {
    const { userId, username, fullName, status } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    console.log(`📝 Updating user ${userId}...`);

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (username !== undefined) {
      updates.push('User = ?');
      values.push(username);
    }

    if (fullName !== undefined) {
      updates.push('Fullname = ?');
      values.push(fullName);
    }

    if (status !== undefined) {
      updates.push('Status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(userId);

    const query = `UPDATE tbluser SET ${updates.join(', ')} WHERE Uid = ?`;
    
    await sequelize.query(query, {
      replacements: values,
      type: sequelize.QueryTypes.UPDATE
    });

    console.log(`   - User ${userId} updated successfully`);

    // Get updated user
    const [updatedUser] = await sequelize.query(`
      SELECT Uid as id, User as username, Fullname as fullName, Status as status
      FROM tbluser 
      WHERE Uid = ?
    `, {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      message: 'User updated successfully!',
      user: updatedUser[0]
    });

  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// Create new user
router.post('/create-user', [authenticateToken], async (req, res) => {
  try {
    const { username, fullName, password, status = 1 } = req.body;
    
    if (!username || !fullName || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, full name, and password are required'
      });
    }

    console.log(`📝 Creating new user: ${username}...`);

    // Hash password (you might want to use bcrypt in production)
    const hashedPassword = password; // For now, store as plain text

    await sequelize.query(
      'INSERT INTO tbluser (User, Fullname, Password, Status) VALUES (?, ?, ?, ?)',
      {
        replacements: [username, fullName, hashedPassword, status],
        type: sequelize.QueryTypes.INSERT
      }
    );

    console.log(`   - User ${username} created successfully`);

    // Get created user
    const [createdUser] = await sequelize.query(`
      SELECT Uid as id, User as username, Fullname as fullName, Status as status
      FROM tbluser 
      WHERE User = ?
    `, {
      replacements: [username],
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      message: 'User created successfully!',
      user: createdUser[0]
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// Delete user
router.delete('/delete-user/:userId', [authenticateToken], async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    console.log(`🗑️ Deleting user ${userId}...`);

    await sequelize.query('DELETE FROM tbluser WHERE Uid = ?', {
      replacements: [userId],
      type: sequelize.QueryTypes.DELETE
    });

    console.log(`   - User ${userId} deleted successfully`);

    res.json({
      success: true,
      message: 'User deleted successfully!'
    });

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

module.exports = router;
