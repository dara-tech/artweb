import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, RefreshCw, Eye, Printer, Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
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
  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState(false);
  const [showYearGrid, setShowYearGrid] = useState(false);
  const [currentDecade, setCurrentDecade] = useState(Math.floor(parseInt(selectedYear) / 10) * 10);
  const pickerRef = useRef(null);

  // Generate years for current decade
  const generateDecadeYears = (decade) => {
    const years = [];
    for (let year = decade - 1; year <= decade + 10; year++) {
      years.push(year);
    }
    return years;
  };

  const decadeYears = generateDecadeYears(currentDecade);
  const isYearAvailable = (year) => availableYears.includes(year);
  const isYearInCurrentDecade = (year) => year >= currentDecade && year <= currentDecade + 9;

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPeriodPickerOpen(false);
        setShowYearGrid(false);
      }
    };

    if (isPeriodPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPeriodPickerOpen]);

  return (

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 lg:gap-3">
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
              <div className="relative">
                {/* Combined Year-Quarter Display */}
                <div className="relative">
                  <input
                    type="text"
                    value={`${selectedYear}-Q${selectedQuarter}`}
                    readOnly
                    className="w-full h-10 sm:h-11 px-3 pr-10 text-sm border border-gray-300 rounded-lg  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer transition-colors"
                    onClick={() => setIsPeriodPickerOpen(!isPeriodPickerOpen)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                </div>

                {/* Custom Period Picker Panel */}
                {isPeriodPickerOpen && (
                  <div ref={pickerRef} className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border border-border rounded-xl shadow-xl p-6 min-w-[320px]">
                    {/* Year Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <Button
                        type="button"
                        onClick={() => setCurrentDecade(currentDecade - 10)}
                        variant="ghost"
                        size="sm"
                        className="p-2 rounded-lg hover:bg-primary transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-primary" />
                      </Button>
                      
                      <Button
                        type="button"
                        onClick={() => setShowYearGrid(!showYearGrid)}
                        variant="ghost"
                        className="px-4 py-2 text-base font-semibold hover:text-blue-500 rounded-lg transition-colors cursor-pointer"
                      >
                        {selectedYear}
                      </Button>
                      
                      <Button
                        type="button"
                        onClick={() => setCurrentDecade(currentDecade + 10)}
                        variant="ghost"
                        size="sm"
                        className="p-2 rounded-lg hover:bg-primary transition-colors text-primary"
                      >
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </Button>
                    </div>

                    {/* Year Grid - Conditionally Visible */}
                    {showYearGrid && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {decadeYears.map((year) => {
                          const isSelected = year === parseInt(selectedYear);
                          const isAvailable = isYearAvailable(year);
                          const isCurrentYear = year === new Date().getFullYear();
                          const isInCurrentDecade = isYearInCurrentDecade(year);
                          
                          return (
                            <Button
                              key={year}
                              type="button"
                              onClick={() => {
                                if (isAvailable) {
                                  onYearChange(year.toString());
                                  setShowYearGrid(false);
                                }
                              }}
                              disabled={!isAvailable}
                              variant={isSelected ? "default" : "ghost"}
                              size="sm"
                              className={`
                                px-3 py-2 text-sm rounded-md transition-all duration-200 relative
                                ${isSelected
                                  ? 'bg-blue-500 text-white shadow-md'
                                  : isCurrentYear && isAvailable && isInCurrentDecade
                                  ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                  : isAvailable && isInCurrentDecade
                                  ? 'text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                                  : isAvailable && !isInCurrentDecade
                                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                  : 'text-gray-300 cursor-not-allowed'
                                }
                              `}
                            >
                              {year}
                              {isCurrentYear && isAvailable && !isSelected && isInCurrentDecade && (
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    {/* Quarter Selection */}
                    <div className="grid grid-cols-4 gap-2">
                      {availableQuarters.map(quarter => (
                        <Button
                          key={quarter.value}
                          type="button"
                          onClick={() => {
                            onQuarterChange(quarter.value.toString());
                            setIsPeriodPickerOpen(false);
                            setShowYearGrid(false);
                          }}
                          disabled={quarter.disabled}
                          variant={selectedQuarter === quarter.value ? "default" : "outline"}
                          size="sm"
                          className={`
                            px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
                            ${selectedQuarter === quarter.value
                              ? 'bg-blue-500 text-white shadow-md'
                              : quarter.disabled
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          Q{quarter.value}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
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
              className="h-10 sm:h-11 w-10 sm:w-11 p-0 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group rounded-full"
              title={loading ? 'Refreshing...' : 'Refresh'}
            >
              <RefreshCw className={`h-4 w-4 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </Button>
          
            <Button 
              onClick={onExport} 
              variant="outline" 
              size="sm" 
              className="h-10 sm:h-11 w-10 sm:w-11 p-0 border-red-300 text-red-700 hover:border-red-500 hover:bg-red-50 transition-all duration-200 group rounded-full"
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
                  className="h-10 sm:h-11 w-10 sm:w-11 p-0 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group rounded-full"
                  disabled={loading}
                  title="Preview"
                >
                  <Eye className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                </Button>
                {/* <Button 
                  onClick={onPrint} 
                  size="sm" 
                  className="h-10 sm:h-11 w-10 sm:w-11 p-0 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 group rounded-full"
                  disabled={loading}
                  title="Print"
                >
                  <Printer className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                </Button> */}
              </>
            )}
          </div>
        </div>
  
  );
};

export default ReportConfiguration;