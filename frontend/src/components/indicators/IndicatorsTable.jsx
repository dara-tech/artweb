import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, AlertTriangle } from 'lucide-react';

// Function to get bilingual indicator names (Khmer/English)
const getDisplayIndicatorName = (backendName) => {
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

const IndicatorsTable = ({ indicators, loading, onIndicatorClick, selectedSite, selectedYear, selectedQuarter, isViewer }) => {
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Report Header Skeleton - Bilingual Format */}
      

        {/* Indicators Table Skeleton */}
        <div className="bg-card border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header Skeleton */}
              <thead className="bg-muted border-b-2 border-border">
                <tr>
                  <th className="px-4 py-4 text-right text-sm font-bold text-foreground border-r border-border">
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                    <div className="h-4 bg-muted rounded w-12 mx-auto"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24 border-r border-border">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </th>
                </tr>
              </thead>

              {/* Table Body Skeleton */}
              <tbody className="bg-card divide-y divide-border">
                {[...Array(5)].map((_, i) => (
                  <React.Fragment key={i}>
                    {/* Indicator Header Row Skeleton */}
                    <tr className="border-b border-border">
                      <td className="px-3 py-4 text-right text-sm font-medium text-muted-foreground border-r border-border" rowSpan="3">
                        <div className="h-4 bg-muted rounded w-4 mx-auto"></div>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground align-middle text-left border-r border-border" rowSpan="3">
                        <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border">
                        <div className="h-4 bg-muted rounded w-8 mx-auto"></div>
                      </td>
                      <td className="px-3 py-4 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-12 ml-auto"></div>
                      </td>
                      <td className="px-3 py-4 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-12 ml-auto"></div>
                      </td>
                      <td className="px-3 py-4 text-right">
                        <div className="h-6 bg-muted rounded w-12 ml-auto"></div>
                      </td>
                    </tr>

                    {/* 15+ Age Group Row Skeleton */}
                    <tr className="bg-muted border-b border-border">
                      <td className="px-3 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border">
                        <div className="h-4 bg-muted rounded w-8 mx-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                    </tr>

                    {/* Sub-Total Row Skeleton */}
                    <tr className="bg-muted border-b-2 border-border font-bold">
                      <td className="px-3 py-3 text-center text-sm font-bold text-muted-foreground bg-muted/50 border-r border-border">
                        <div className="h-4 bg-muted rounded w-12 mx-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="h-7 bg-muted rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Footer Skeleton */}
        <div className="bg-muted border border-border p-4 sm:p-6 mt-6 sm:mt-8">
          <div className="animate-pulse">
            <div className="text-right text-muted-foreground">
              <div className="h-4 bg-muted rounded w-3/4 ml-auto"></div>
              <div className="h-3 bg-muted rounded w-1/2 ml-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (indicators.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border">
        <CardContent className="p-8 sm:p-12 text-right">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 sm:p-4 bg-muted rounded-full">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No Data Available</h3>
              <p className="text-sm sm:text-base text-muted-foreground">No indicators found for the selected period and filters.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default Table View - Matching the image format exactly
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Indicators Table - Matching the image layout */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-muted border-b-2 border-border">
              <tr>
                <th className="px-4 py-4 text-right text-sm font-bold text-foreground border-r border-border">
                  សុចនាករ Indicator
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                  អាយុ Age
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24 border-r border-border">
                  ប្រុស Male
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                  ស្រី Female
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24">
                  សរុប Total
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-card divide-y divide-border">
              {indicators.map((indicator, index) => (
                <React.Fragment key={index}>
                  {/* Indicator Header Row with Name */}
                  <tr 
                    className="border-b border-border"
                  >
                    {/* Indicator Name - spans 3 rows */}
                    <td className="px-4 py-4 text-sm text-foreground align-middle text-left border-r border-border" rowSpan="3">
                      <div 
                        className="font-medium leading-tight text-left cursor-pointer hover:text-primary hover:underline transition-colors"
                        onClick={() => onIndicatorClick && onIndicatorClick(indicator)}
                        title="Click to view all patients for this indicator"
                      >
                        {getDisplayIndicatorName(indicator.Indicator)}
                      </div>
                      {indicator.error && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Error: {indicator.error}
                        </Badge>
                      )}
                    </td>

                    {/* Age 0-14 */}
                    <td className="px-3 py-4 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border hover:bg-muted/70 hover:font-bold transition-all duration-200">
                      0-14
                    </td>

                    {/* Male 0-14 */}
                    <td className="px-3 py-4 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-blue-600 cursor-pointer underline hover:text-blue-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'male', ageGroup: '0-14' });
                        }}
                        title="Click to view detailed list of male patients aged 0-14"
                      >
                        {(indicator.Male_0_14 || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Female 0-14 */}
                    <td className="px-3 py-4 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-pink-600 cursor-pointer underline hover:text-pink-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'female', ageGroup: '0-14' });
                        }}
                        title="Click to view detailed list of female patients aged 0-14"
                      >
                        {(indicator.Female_0_14 || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Total 0-14 */}
                    <td className="px-3 py-4 text-right">
                      <div className="text-lg text-foreground">
                        {(Number(indicator.Male_0_14 || 0) + Number(indicator.Female_0_14 || 0)).toLocaleString()}
                      </div>
                    </td>

                  </tr>

                  {/* 15+ Age Group Row */}
                  <tr className="bg-muted border-b border-border">
                    <td className="px-3 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border hover:bg-muted/70 hover:font-bold transition-all duration-200">
                      {'>'}14
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-blue-600 cursor-pointer underline hover:text-blue-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'male', ageGroup: '>14' });
                        }}
                        title="Click to view detailed list of male patients aged 15+"
                      >
                        {(indicator.Male_over_14 || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-pink-600 cursor-pointer underline hover:text-pink-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'female', ageGroup: '>14' });
                        }}
                        title="Click to view detailed list of female patients aged 15+"
                      >
                        {(indicator.Female_over_14 || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-lg text-foreground">
                        {(Number(indicator.Male_over_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                  </tr>

                  {/* Sub-Total Row for this indicator */}
                  <tr className="bg-muted border-b-2 border-border font-bold">
                    <td className="px-3 py-3 text-center text-sm font-bold text-muted-foreground bg-muted/50 border-r border-border hover:bg-muted/70 hover:font-bold transition-all duration-200">
                      សរុប
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div className="text-lg font-bold text-blue-700">
                        {(Number(indicator.Male_0_14 || 0) + Number(indicator.Male_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div className="text-lg font-bold text-pink-700">
                        {(Number(indicator.Female_0_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-xl font-bold text-foreground">
                        {(indicator.TOTAL || 0).toLocaleString()}
                      </div>
                    </td>
                  </tr>

                </React.Fragment>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* Report Footer */}
      <div className="bg-muted border border-border rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
        <div className="text-right text-muted-foreground">
          <p className="text-xs sm:text-sm">
            This report contains {indicators.length} indicator{indicators.length !== 1 ? 's' : ''} 
            {' '}with a total of {indicators.reduce((sum, ind) => sum + (ind.TOTAL || 0), 0).toLocaleString()} patient records.
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            Data accuracy and completeness may vary by indicator. Please verify critical decisions with source data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsTable;
