// Utility functions for indicators

// Generate available years (current year and previous years)
export const generateAvailableYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 10; year--) {
    years.push(year);
  }
  return years;
};

// Generate available quarters based on selected year
export const generateAvailableQuarters = (selectedYear) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentQuarter = Math.floor(currentMonth / 3) + 1;
  
  const quarters = [
    { value: 1, label: 'Q1 (Jan-Mar)', disabled: false },
    { value: 2, label: 'Q2 (Apr-Jun)', disabled: false },
    { value: 3, label: 'Q3 (Jul-Sep)', disabled: false },
    { value: 4, label: 'Q4 (Oct-Dec)', disabled: false }
  ];

  // Disable future quarters
  if (selectedYear === currentYear) {
    quarters.forEach(quarter => {
      if (quarter.value > currentQuarter) {
        quarter.disabled = true;
      }
    });
  }

  return quarters;
};

// Get date range for selected year and quarter
export const getDateRangeForYearQuarter = (year, quarter) => {
  // Define quarter boundaries with explicit dates
  const quarterDates = {
    1: { start: `${year}-01-01`, end: `${year}-03-31` }, // Jan-Mar
    2: { start: `${year}-04-01`, end: `${year}-06-30` }, // Apr-Jun
    3: { start: `${year}-07-01`, end: `${year}-09-30` }, // Jul-Sep
    4: { start: `${year}-10-01`, end: `${year}-12-31` }  // Oct-Dec
  };
  
  const q = quarterDates[quarter];
  
  // Previous quarter end date - fix year calculation
  let prevYear = year;
  let prevQuarter = quarter - 1;
  
  if (quarter === 1) {
    // Q1 -> previous is Q4 of previous year
    prevYear = year - 1;
    prevQuarter = 4;
  }
  
  const prevQ = {
    1: { start: `${prevYear}-01-01`, end: `${prevYear}-03-31` },
    2: { start: `${prevYear}-04-01`, end: `${prevYear}-06-30` },
    3: { start: `${prevYear}-07-01`, end: `${prevYear}-09-30` },
    4: { start: `${prevYear}-10-01`, end: `${prevYear}-12-31` }
  }[prevQuarter];
  
  return {
    startDate: q.start,
    endDate: q.end,
    previousEndDate: prevQ.end
  };
};

// Calculate summary statistics
export const calculateSummaryStats = (indicatorsData) => {
  // Helper function to find indicators with flexible matching
  const findIndicator = (patterns) => {
    for (const pattern of patterns) {
      const found = indicatorsData.find(ind => 
        ind.Indicator && ind.Indicator.toLowerCase().includes(pattern.toLowerCase())
      );
      if (found) {
        return found.TOTAL || 0;
      }
    }
    return 0;
  };
  
  // Find specific indicators with multiple possible patterns
  const activePatients = findIndicator([
    '10. active art patients in this quarter',
    '10. active art patients',
    'active art patients in this quarter',
    'active art patients'
  ]);
  
  const newEnrolled = findIndicator([
    '3. newly enrolled',
    'newly enrolled'
  ]);
  
  const viralSuppressed = findIndicator([
    '10.8. vl suppression',
    'vl suppression',
    'viral suppression'
  ]);
  
  const tptCompleted = findIndicator([
    '10.5. tpt complete',
    'tpt complete'
  ]);

  return {
    activePatients,
    newEnrolled,
    viralSuppressed,
    tptCompleted
  };
};

// Validate data consistency between summary stats and detailed indicators
export const validateDataConsistency = (summaryStats, indicatorsData) => {
  const mismatches = [];
  
  // Helper function to find indicators with flexible matching
  const findIndicator = (patterns) => {
    for (const pattern of patterns) {
      const found = indicatorsData.find(ind => 
        ind.Indicator && ind.Indicator.toLowerCase().includes(pattern.toLowerCase())
      );
      if (found) return found;
    }
    return null;
  };
  
  // Check Active ART patients
  const activePatientsIndicator = findIndicator([
    '10. active art patients in this quarter',
    '10. active art patients',
    'active art patients in this quarter',
    'active art patients'
  ]);
  if (activePatientsIndicator && activePatientsIndicator.TOTAL !== summaryStats.activePatients) {
    mismatches.push({
      type: 'Active ART Patients',
      summaryValue: summaryStats.activePatients,
      indicatorValue: activePatientsIndicator.TOTAL,
      indicatorName: activePatientsIndicator.Indicator
    });
  }
  
  // Check Newly Enrolled
  const newEnrolledIndicator = findIndicator([
    '3. newly enrolled',
    'newly enrolled'
  ]);
  if (newEnrolledIndicator && newEnrolledIndicator.TOTAL !== summaryStats.newEnrolled) {
    mismatches.push({
      type: 'Newly Enrolled',
      summaryValue: summaryStats.newEnrolled,
      indicatorValue: newEnrolledIndicator.TOTAL,
      indicatorName: newEnrolledIndicator.Indicator
    });
  }
  
  // Check Viral Suppressed
  const viralSuppressedIndicator = findIndicator([
    '10.8. vl suppression',
    'vl suppression',
    'viral suppression'
  ]);
  if (viralSuppressedIndicator && viralSuppressedIndicator.TOTAL !== summaryStats.viralSuppressed) {
    mismatches.push({
      type: 'Viral Suppressed',
      summaryValue: summaryStats.viralSuppressed,
      indicatorValue: viralSuppressedIndicator.TOTAL,
      indicatorName: viralSuppressedIndicator.Indicator
    });
  }
  
  // Check TPT Completed
  const tptCompletedIndicator = findIndicator([
    '10.5. tpt complete',
    'tpt complete'
  ]);
  if (tptCompletedIndicator && tptCompletedIndicator.TOTAL !== summaryStats.tptCompleted) {
    mismatches.push({
      type: 'TPT Completed',
      summaryValue: summaryStats.tptCompleted,
      indicatorValue: tptCompletedIndicator.TOTAL,
      indicatorName: tptCompletedIndicator.Indicator
    });
  }
  
  return {
    hasMismatches: mismatches.length > 0,
    mismatches
  };
};

// Get province name from site code
export const getProvinceName = (siteCode) => {
  if (!siteCode) return 'Unknown';
  
  const provinceCode = siteCode.substring(0, 2);
  const provinceMap = {
    '02': 'Battambang',
    '03': 'Kampong Cham', 
    '12': 'Kampong Thom',
    '18': 'Preah Sihanouk',
    '01': 'Phnom Penh',
    '04': 'Kampong Chhnang',
    '05': 'Kampong Speu',
    '06': 'Kampong Thom',
    '07': 'Kampot',
    '08': 'Kandal',
    '09': 'Koh Kong',
    '10': 'Kratie',
    '11': 'Mondulkiri',
    '13': 'Preah Vihear',
    '14': 'Pursat',
    '15': 'Ratanakiri',
    '16': 'Siem Reap',
    '17': 'Stung Treng',
    '19': 'Svay Rieng',
    '20': 'Takeo',
    '21': 'Oddar Meanchey',
    '22': 'Kep',
    '23': 'Pailin',
    '24': 'Tbong Khmum'
  };
  
  return `${provinceCode}. ${provinceMap[provinceCode] || 'Unknown Province'}`;
};

// Get operational district from site
export const getOperationalDistrict = (site) => {
  if (!site || !site.code) return 'Unknown';
  
  const districtCode = site.code.substring(0, 4);
  const siteName = site.name || '';
  
  // Extract district name from site name (usually the second part after province)
  const nameParts = siteName.split(' ');
  const districtName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : siteName;
  
  return `OD ${districtCode}. ${districtName}`;
};

// Function to get bilingual indicator names (Khmer/English)
export const getDisplayIndicatorName = (backendName) => {
  const nameMap = {
    '1. Active ART patients in previous quarter': '1. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសមុន (Number of active ART patients in previous quarter)',
    '2. Active Pre-ART patients in previous quarter': '2. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសមុន (Number of active Pre-ART patients in previous quarter)',
    '3. Newly Enrolled': '3. ចំនួនអ្នកជំងឺចុះឈ្មោះថ្មី (Number of newly enrolled patients)',
    '4. Re-tested positive': '4. ចំនួនអ្នកជំងឺដែលវិជ្ជមានពីតេស្តបញ្ជាក់ (Number of patient re-tested positive)',
    '5. Newly Initiated': '5. ចំនួនអ្នកជំងឺចាប់ផ្តើមព្យាបាលដោយ ARV ថ្មី (Number of newly initiated ART)',
    '5.1.1. New ART started: Same day': '5.1.1. ក្នុងថ្ងៃតែមួយ (Same day – 0 day)',
    '5.1.2. New ART started: 1-7 days': '5.1.2. ពី ១ ទៅ ៧ ថ្ងៃ (1–7 days)',
    '5.1.3. New ART started: >7 days': '5.1.3. ច្រើនជាង ៧ ថ្ងៃ (>7 days)',
    '5.2. New ART started with TLD': '5.2. ចំនួនអ្នកជំងឹចាប់ផ្តើមព្យាបាលថ្មីដោយ TDF+3TC+DTG (Number of new ART started with TLD)',
    '6. Transfer-in patients': '6. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចូល (Number of transfer-in patients)',
    '7. Lost and Return': '7. ចំនួនអ្នកជំងឺដែលបានបោះបង់ហើយត្រឡប់មកវិញ (Number of Lost-Return patients)',
    '7.1. In the same ART site': '7.1. នៅក្នុងសេវា ART តែមួយ (In the same ART site)',
    '7.2. From other ART site': '7.2. មកពីសេវា ART ផ្សេង (From other ART site)',
    '8.1. Dead': '8.1. ចំនួនអ្នកជំងឺដែលបានស្លាប់ (Dead)',
    '8.2. Lost to follow up (LTFU)': '8.2. ចំនួនអ្នកជំងឺដែលបានបោះបង់ (Lost to follow up – LTFU)',
    '8.3. Transfer-out': '8.3. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចេញ (Transfer-out)',
    '9. Active Pre-ART': '9. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active Pre-ART patients in this quarter)',
    '10. Active ART patients in this quarter': '10. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active ART patients in this quarter)',
    '10.1. Eligible MMD': '10.1. ចំនួនអ្នកជំងឺដែលសមស្របសំរាប់ការផ្តល់ថ្នាំរយៈពេលវែង (Eligible for Multi Month Dispensing – MMD)',
    '10.2. MMD': '10.2. ចំនួនអ្នកជំងឺកំពុងទទួលថ្នាំរយៈពេលវែង (Number of patients received MMD)',
    '10.3. TLD': '10.3. ចំនួនអ្នកជំងឺកំពុងទទួលការព្យាបាលដោយ TLD (Number of patients received TLD)',
    '10.4. TPT Start': '10.4. ចំនួនអ្នកជំងឺដែលបានចាប់ផ្តើមការបង្ការជំងឺរបេង (Number of patients started TPT)',
    '10.5. TPT Complete': '10.5. ចំនួនអ្នកជំងឺដែលបានបញ្ចប់ការបង្ការជំងឺរបេង (Number of patients completed TPT)',
    '10.6. Eligible for VL test': '10.6. ចំនួនអ្នកជំងឺដែលសមស្របធ្វើតេស្ត Viral Load (Eligible for Viral Load test)',
    '10.7. VL tested in 12M': '10.7. ចំនួនអ្នកជំងឺធ្វើតេស្ត Viral Load ក្នុងរយៈពេល ១២ ខែចុងក្រោយ (Receive VL test in last 12 months)',
    '10.8. VL suppression': '10.8. ចំនួនអ្នកជំងឺដែលមានលទ្ធផល VL ចុងក្រោយតិចជាង 1000 copies (Last VL is suppressed)'
  };
  return nameMap[backendName] || backendName;
};

// Generate report HTML for printing
export const generateReportHTML = (indicators, selectedSite, selectedYear, selectedQuarter) => {
  // Get the current date and time
  const now = new Date();
  const timestamp = now.toLocaleString();
  const dateRange = `${selectedYear} Q${selectedQuarter}`;
  
  // Get site information
  const siteName = selectedSite?.name || 'All Sites';
  const siteCode = selectedSite?.code || 'N/A';
  
  // Create HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ART Indicators Report - ${siteName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          padding: 14px;
          color: #333;
          line-height: 1.4;
          font-size: 14px;
        }
        .report-header {
          background: #ffffff;
          margin-bottom: 24px;
        }
        .main-title {
          text-align: center;
          margin-bottom: 24px;
        }
        .main-title h1 {
          color: #1f2937;
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          line-height: 1.2;
        }
        .report-parameters {
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        .report-parameters table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .report-parameters tr {
          border-bottom: 1px solid #e5e7eb;
        }
        .report-parameters tr:last-child {
          border-bottom: none;
        }
        .report-parameters .label {
          padding: 12px 16px;
          font-weight: 600;
          color: #1f2937;
          border-right: 1px solid #e5e7eb;
          width: 25%;
          background: #f9fafb;
        }
        .report-parameters .value {
          padding: 12px 16px;
          color: #1f2937;
          border-right: 1px solid #e5e7eb;
          width: 25%;
        }
        .report-parameters .value:last-child {
          border-right: none;
        }
        .indicators-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 12px;
        }
        .indicators-table th {
          background: #2563eb;
          color: white;
          padding: 10px 8px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #1d4ed8;
          font-size: 12px;
        }
        .indicators-table td {
          padding: 8px 6px;
          border: 1px solid #e2e8f0;
          text-align: center;
          font-size: 11px;
        }
        .indicators-table tr:nth-child(even) {
          background: #f8fafc;
        }
        .indicators-table td:first-child {
          font-weight: bold;
          text-align: left;
          padding-left: 8px;
        }
        .indicators-table td:nth-child(2) {
          text-align: left;
          padding-left: 8px;
          font-weight: bold;
        }
        .footer {
          margin-top: 25px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
        }
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body { 
            margin: 0; 
            font-size: 12px;
            line-height: 1.4;
            background: white !important;
          }
          
          .report-header { 
            page-break-after: avoid; 
            margin-bottom: 20px;
            break-inside: avoid;
          }
          
          .main-title h1 {
            font-size: 18px;
            margin: 10px 0;
            line-height: 1.3;
          }
          
          .report-parameters {
            page-break-inside: avoid;
            margin-bottom: 15px;
          }
          
          .report-parameters table {
            width: 100%;
          }
          
          .report-parameters .label,
          .report-parameters .value {
            font-size: 11px;
            padding: 8px 12px;
          }
          
          .indicators-table { 
            page-break-inside: auto;
            font-size: 10px;
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          
          .indicators-table thead {
            display: table-header-group;
          }
          
          .indicators-table tbody {
            display: table-row-group;
          }
          
          .indicators-table th {
            background: #2563eb !important;
            color: white !important;
            padding: 8px 6px;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #1d4ed8 !important;
            page-break-inside: avoid;
          }
          
          .indicators-table thead tr:first-child th:first-child {
            padding-top: 15px;
          }
          
          .indicators-table td {
            padding: 6px 4px;
            font-size: 10px;
            border: 1px solid #e2e8f0 !important;
            page-break-inside: avoid;
          }
          
          .indicators-table tr {
            page-break-inside: avoid;
            break-inside: avoid;
            orphans: 3;
            widows: 3;
          }
          
          .indicators-table tr:nth-child(even) {
            background: #f8fafc !important;
          }
          
          .indicators-table td:first-child,
          .indicators-table td:nth-child(2) {
            font-weight: bold;
            text-align: left;
            padding-left: 6px;
          }
          
          .footer {
            page-break-inside: avoid;
            margin-top: 20px;
            font-size: 10px;
          }
          
          /* Prevent orphaned rows */
          .indicators-table tbody tr {
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
          }
          
          /* Keep indicator groups together when possible */
          .indicator-group {
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
          }
          
          /* Add space when table breaks to new page */
          .indicators-table {
            page-break-before: auto;
          }
          
          .indicators-table thead {
            page-break-after: avoid;
          }
          
          /* Ensure space at top of new page for table */
          @page :first {
            margin-top: 0.7in;
          }
          
          @page :left, :right {
            margin-top: 0.7in;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div class="main-title">
          <h1>របាយការណ៍ស្តីពីការព្យាបាលអ្នកជំងឺអេដស៍ Quarterly Report on ART</h1>
        </div>

        <div class="report-parameters">
          <table>
            <tbody>
              <tr>
                <td class="label">ឈ្មោះមន្ទីរពេទ្យបង្អែក (Facility):</td>
                <td class="value">${siteName}</td>
                <td class="label">ឈ្មោះឯកសារ (File Name):</td>
                <td class="value">${selectedSite?.fileName || selectedSite?.file_name || siteCode}</td>
              </tr>
              <tr>
                <td class="label">ឈ្មោះស្រុកប្រតិបត្តិ (Operational District):</td>
                <td class="value">${selectedSite ? getOperationalDistrict(selectedSite) : 'All Operational Districts'}</td>
                <td class="label">ខេត្ត-ក្រុង (Province):</td>
                <td class="value">${selectedSite ? getProvinceName(selectedSite.code) : 'All Provinces'}</td>
              </tr>
              <tr>
                <td class="label">ឆ្នាំ (Year):</td>
                <td class="value">${selectedYear}</td>
                <td class="label">ត្រីមាសទី (Quarter):</td>
                <td class="value">Quarter ${selectedQuarter}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      
      <table class="indicators-table">
        <thead>
          <tr>
            <th>#</th>
            <th>សុចនាករ Indicator</th>
            <th>អាយុ Age</th>
            <th>ប្រុស Male</th>
            <th>ស្រី Female</th>
            <th>សរុប Total</th>
          </tr>
        </thead>
        <tbody>
          ${indicators.map((indicator, index) => `
            <!-- Indicator Header Row -->
            <tr>
              <td rowspan="3">${index + 1}</td>
              <td rowspan="3" style="text-align: left; font-weight: bold;">${getDisplayIndicatorName(indicator.Indicator)}</td>
              <td style="text-align: center; background: #f8fafc;">0-14</td>
              <td style="text-align: right;">${(indicator.Male_0_14 || 0).toLocaleString()}</td>
              <td style="text-align: right;">${(indicator.Female_0_14 || 0).toLocaleString()}</td>
              <td style="text-align: right;">${(Number(indicator.Male_0_14 || 0) + Number(indicator.Female_0_14 || 0)).toLocaleString()}</td>
            </tr>
            
            <!-- 15+ Age Group Row -->
            <tr style="background: #f8fafc;">
              <td style="text-align: center; background: #f8fafc;">>14</td>
              <td style="text-align: right;">${(indicator.Male_over_14 || 0).toLocaleString()}</td>
              <td style="text-align: right;">${(indicator.Female_over_14 || 0).toLocaleString()}</td>
              <td style="text-align: right;">${(Number(indicator.Male_over_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}</td>
            </tr>
            
            <!-- Total Row -->
            <tr>
              <td style="text-align: center; background: #e2e8f0; font-weight: bold;">សរុប Total</td>
              <td style="text-align: right; font-weight: bold;">${(Number(indicator.Male_0_14 || 0) + Number(indicator.Male_over_14 || 0)).toLocaleString()}</td>
              <td style="text-align: right; font-weight: bold;">${(Number(indicator.Female_0_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}</td>
              <td style="text-align: right; font-weight: bold;">${(Number(indicator.Male_0_14 || 0) + Number(indicator.Female_0_14 || 0) + Number(indicator.Male_over_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        
      </div>
    </body>
    </html>
   `;
   
   return htmlContent;
};
