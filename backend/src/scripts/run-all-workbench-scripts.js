const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Database connection configuration
const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'art_0201' // Using site 0201 as example
};

async function runScript(filePath) {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    console.log(`\n🔍 Running: ${path.basename(filePath)}`);
    console.log('=' .repeat(60));
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split the content into individual statements
    const statements = content
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let results = [];
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const [rows] = await connection.execute(statement);
          if (Array.isArray(rows) && rows.length > 0) {
            results.push(rows);
          }
        } catch (error) {
          console.log(`⚠️  Statement error: ${error.message}`);
        }
      }
    }
    
    // Display results
    if (results.length > 0) {
      const finalResult = results[results.length - 1]; // Get the last result (main query)
      if (finalResult && finalResult.length > 0) {
        const result = finalResult[0];
        console.log('📊 Results:');
        console.log(`   Indicator: ${result.Indicator || 'N/A'}`);
        console.log(`   Total: ${result.TOTAL || 0}`);
        console.log(`   Male 0-14: ${result.Male_0_14 || 0}`);
        console.log(`   Female 0-14: ${result.Female_0_14 || 0}`);
        console.log(`   Male 15+: ${result.Male_over_14 || 0}`);
        console.log(`   Female 15+: ${result.Female_over_14 || 0}`);
      } else {
        console.log('📊 No data returned');
      }
    } else {
      console.log('📊 No results');
    }
    
    await connection.end();
    return { success: true, results };
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllScripts() {
  console.log('🚀 Running All SQL Workbench Scripts');
  console.log('=' .repeat(80));
  
  const workbenchDir = path.join(__dirname, '..', 'sql-workbench');
  const files = fs.readdirSync(workbenchDir)
    .filter(file => file.endsWith('.sql') && file !== 'variables.sql' && !file.includes('details'))
    .sort();
  
  console.log(`📁 Found ${files.length} aggregate scripts to run\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(workbenchDir, file);
    const result = await runScript(filePath);
    
    if (result.success) {
      successCount++;
      results.push({
        file: path.basename(file),
        status: 'success',
        data: result.results
      });
    } else {
      failCount++;
      results.push({
        file: path.basename(file),
        status: 'failed',
        error: result.error
      });
    }
    
    // Small delay between scripts
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n' + '=' .repeat(80));
  console.log('📊 SUMMARY REPORT');
  console.log('=' .repeat(80));
  console.log(`✅ Successfully executed: ${successCount} scripts`);
  console.log(`❌ Failed: ${failCount} scripts`);
  console.log(`📁 Total processed: ${files.length} scripts`);
  
  console.log('\n📋 DETAILED RESULTS:');
  console.log('-' .repeat(80));
  
  results.forEach((result, index) => {
    const status = result.status === 'success' ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.file}`);
    if (result.status === 'failed') {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log('\n🎉 All scripts execution completed!');
}

if (require.main === module) {
  runAllScripts().catch(console.error);
}

module.exports = { runAllScripts, runScript };
