const fs = require('fs');
const path = require('path');

const workbenchDir = path.join(__dirname, '../sql-workbench');

// Function to extract parameters actually used in a SQL file
function extractUsedParameters(sqlContent) {
    const usedParams = new Set();
    
    // Find all @parameter references in the SQL content (excluding the SET statements)
    const lines = sqlContent.split('\n');
    let inMainQuery = false;
    
    for (const line of lines) {
        // Skip the parameter setup section
        if (line.includes('-- MAIN QUERY')) {
            inMainQuery = true;
            continue;
        }
        
        if (inMainQuery) {
            // Find @parameter references
            const matches = line.match(/@[A-Za-z_]+/g);
            if (matches) {
                matches.forEach(match => usedParams.add(match));
            }
        }
    }
    
    return Array.from(usedParams);
}

// Function to generate clean parameter setup
function generateCleanParameterSetup(usedParams) {
    let setup = `-- =====================================================
-- PARAMETER SETUP
-- Set these parameters before running this query

`;
    
    // Add only the parameters that are actually used
    if (usedParams.includes('@StartDate')) {
        setup += `-- Date parameters (Quarterly period)
SET @StartDate = '2025-04-01';             -- Start date (YYYY-MM-DD)
`;
    }
    
    if (usedParams.includes('@EndDate')) {
        if (!setup.includes('-- Date parameters')) {
            setup += `-- Date parameters (Quarterly period)
`;
        }
        setup += `SET @EndDate = '2025-06-30';               -- End date (YYYY-MM-DD) - Q2 2025
`;
    }
    
    if (usedParams.includes('@PreviousEndDate')) {
        if (!setup.includes('-- Date parameters')) {
            setup += `-- Date parameters (Quarterly period)
`;
        }
        setup += `SET @PreviousEndDate = '2025-03-31';       -- Previous period end date
`;
    }
    
    if (usedParams.includes('@lost_code')) {
        setup += `
-- Status codes
SET @lost_code = 0;                        -- Lost to follow-up status code
`;
    }
    
    if (usedParams.includes('@dead_code')) {
        if (!setup.includes('-- Status codes')) {
            setup += `
-- Status codes
`;
        }
        setup += `SET @dead_code = 1;                        -- Dead status code
`;
    }
    
    if (usedParams.includes('@transfer_out_code')) {
        if (!setup.includes('-- Status codes')) {
            setup += `
-- Status codes
`;
        }
        setup += `SET @transfer_out_code = 3;                -- Transfer out status code
`;
    }
    
    if (usedParams.includes('@transfer_in_code')) {
        if (!setup.includes('-- Status codes')) {
            setup += `
-- Status codes
`;
        }
        setup += `SET @transfer_in_code = 1;                 -- Transfer in status code
`;
    }
    
    if (usedParams.includes('@mmd_eligible_code')) {
        if (!setup.includes('-- Status codes')) {
            setup += `
-- Status codes
`;
        }
        setup += `SET @mmd_eligible_code = 0;                -- MMD eligible status code
`;
    }
    
    if (usedParams.includes('@mmd_drug_quantity')) {
        setup += `
-- Clinical parameters
SET @mmd_drug_quantity = 60;               -- MMD drug quantity threshold
`;
    }
    
    if (usedParams.includes('@vl_suppression_threshold')) {
        if (!setup.includes('-- Clinical parameters')) {
            setup += `
-- Clinical parameters
`;
        }
        setup += `SET @vl_suppression_threshold = 1000;      -- Viral load suppression threshold
`;
    }
    
    if (usedParams.includes('@tld_regimen_formula')) {
        if (!setup.includes('-- Clinical parameters')) {
            setup += `
-- Clinical parameters
`;
        }
        setup += `SET @tld_regimen_formula = '3TC + DTG + TDF'; -- TLD regimen formula
`;
    }
    
    if (usedParams.includes('@tpt_drug_list')) {
        if (!setup.includes('-- Clinical parameters')) {
            setup += `
-- Clinical parameters
`;
        }
        setup += `SET @tpt_drug_list = "'Isoniazid','3HP','6H'"; -- TPT drug list
`;
    }
    
    return setup;
}

// Function to clean up a single SQL file
function cleanupSqlFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract used parameters
        const usedParams = extractUsedParameters(content);
        console.log(`📊 ${path.basename(filePath)} uses: ${usedParams.join(', ')}`);
        
        // Generate clean parameter setup
        const cleanSetup = generateCleanParameterSetup(usedParams);
        
        // Replace the parameter setup section
        const lines = content.split('\n');
        let newContent = '';
        let skipUntilMainQuery = false;
        let foundMainQuery = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('-- PARAMETER SETUP')) {
                skipUntilMainQuery = true;
                newContent += cleanSetup;
                continue;
            }
            
            if (skipUntilMainQuery && line.includes('-- MAIN QUERY')) {
                skipUntilMainQuery = false;
                foundMainQuery = true;
                newContent += '\n' + line + '\n';
                continue;
            }
            
            if (!skipUntilMainQuery) {
                newContent += line + '\n';
            }
        }
        
        // Write the cleaned content back
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ Cleaned: ${path.basename(filePath)}`);
        
    } catch (error) {
        console.error(`❌ Error cleaning ${filePath}:`, error.message);
    }
}

// Main execution
console.log('🧹 Starting workbench parameter cleanup...\n');

// Get all SQL files in the workbench directory
const files = fs.readdirSync(workbenchDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

console.log(`📁 Found ${files.length} SQL files to clean up\n`);

// Clean up each file
files.forEach(file => {
    const filePath = path.join(workbenchDir, file);
    cleanupSqlFile(filePath);
});

console.log('\n🎉 Workbench parameter cleanup completed!');
