import React from 'react';

const ReportHeader = ({ selectedSite, selectedYear, selectedQuarter }) => {
  // Helper function to get province name from site code
  const getProvinceName = (siteCode) => {
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

  // Helper function to get operational district from site
  const getOperationalDistrict = (site) => {
    if (!site || !site.code) return 'Unknown';
    
    const districtCode = site.code.substring(0, 4);
    const siteName = site.name || '';
    
    // Extract district name from site name (usually the second part after province)
    const nameParts = siteName.split(' ');
    const districtName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : siteName;
    
    return `OD ${districtCode}. ${districtName}`;
  };

  return (
    <div className="bg-card shadow-sm p-6 mb-6">
      {/* Main Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          របាយការណ៍ស្តីពីការព្យាបាលអ្នកជំងឺអេដស៍ Quarterly Report on ART
        </h1>
      </div>

      {/* Report Parameters Table */}
      <div className="border border-border overflow-hidden">
        <table className="w-full">
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border w-1/4">
                ឈ្មោះមន្ទីរពេទ្យបង្អែក (Facility):
              </td>
              <td className="px-4 py-3 text-foreground border-r border-border w-1/4">
                {selectedSite ? selectedSite.name : 'All Facilities'}
              </td>
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border w-1/4">
                ឈ្មោះឯកសារ (File Name):
              </td>
              <td className="px-4 py-3 text-foreground w-1/4">
                {selectedSite ? (selectedSite.fileName || selectedSite.file_name || selectedSite.code) : 'All Facilities'}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                ឈ្មោះស្រុកប្រតិបត្តិ (Operational District):
              </td>
              <td className="px-4 py-3 text-foreground border-r border-border">
                {selectedSite ? getOperationalDistrict(selectedSite) : 'All Operational Districts'}
              </td>
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                ខេត្ត-ក្រុង (Province):
              </td>
              <td className="px-4 py-3 text-foreground">
                {selectedSite ? getProvinceName(selectedSite.code) : 'All Provinces'}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                ឆ្នាំ (Year):
              </td>
              <td className="px-4 py-3 text-foreground border-r border-border">
                {selectedYear}
              </td>
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                ត្រីមាសទី (Quarter):
              </td>
              <td className="px-4 py-3 text-foreground">
                Quarter {selectedQuarter}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportHeader;
