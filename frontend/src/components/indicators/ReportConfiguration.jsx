import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, Download, RefreshCw, Users, Eye, Printer
} from 'lucide-react';
import SiteFilter from '../common/SiteFilter';

const ReportConfiguration = ({
  sites,
  selectedSite,
  onSiteChange,
  sitesLoading,
  selectedYear,
  selectedQuarter,
  onYearChange,
  onQuarterChange,
  availableYears,
  availableQuarters,
  onRefresh,
  onExport,
  onPreview,
  onPrint,
  loading,
  isSuperAdmin,
  isViewer
}) => {
  return (

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 lg:gap-6">
          {/* Health Facility Selection */}
          <div className="flex-1 min-w-0">
            <div className="space-y-1 sm:space-y-2">
              <SiteFilter
                sites={sites}
                selectedSite={selectedSite}
                onSiteChange={onSiteChange}
                disabled={sitesLoading}
                showAllOption={!isViewer}
                variant="minimal"
                className="w-full h-10 sm:h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Time Period */}
          <div className="flex-1 min-w-0">
            <div className="space-y-1 sm:space-y-2">
              <div className="flex gap-1 sm:gap-2">
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={onYearChange}
                >
                  <SelectTrigger className="h-10 sm:h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={selectedQuarter.toString()} 
                  onValueChange={onQuarterChange}
                >
                  <SelectTrigger className="h-10 sm:h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableQuarters.map(quarter => (
                      <SelectItem 
                        key={quarter.value} 
                        value={quarter.value.toString()}
                        disabled={quarter.disabled}
                      >
                        Q{quarter.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 self-stretch sm:self-end">
            <Button 
              onClick={onRefresh} 
              disabled={loading} 
              variant="outline" 
              size="sm" 
              className="h-10 sm:h-11 w-10 sm:w-11 p-0 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              title={loading ? 'Refreshing...' : 'Refresh'}
            >
              <RefreshCw className={`h-4 w-4 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </Button>
            <Button 
              onClick={onExport} 
              variant="outline" 
              size="sm" 
              className="h-10 sm:h-11 w-10 sm:w-11 p-0 border-red-300 text-red-700 hover:border-red-500 hover:bg-red-50 transition-all duration-200 group"
              disabled={loading}
              title="Download"
            >
              <Download className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
            </Button>
            {isSuperAdmin && (
              <>
                <Button 
                  onClick={onPreview} 
                  variant="outline" 
                  size="sm" 
                  className="h-10 sm:h-11 w-10 sm:w-11 p-0 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
                  disabled={loading}
                  title="Preview"
                >
                  <Eye className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                </Button>
                <Button 
                  onClick={onPrint} 
                  size="sm" 
                  className="h-10 sm:h-11 w-10 sm:w-11 p-0 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 group"
                  disabled={loading}
                  title="Print"
                >
                  <Printer className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                </Button>
              </>
            )}
          </div>
        </div>
  
  );
};

export default ReportConfiguration;