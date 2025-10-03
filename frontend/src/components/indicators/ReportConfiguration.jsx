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
  isSuperAdmin
}) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Health Facility Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <Label className="text-sm font-semibold text-foreground">Health Facility</Label>
            </div>
            <div className="space-y-3">
              <SiteFilter
                sites={sites}
                selectedSite={selectedSite}
                onSiteChange={onSiteChange}
                disabled={sitesLoading}
                showAllOption={false}
                variant="minimal"
                className="w-full h-11 text-sm"
              />
            </div>
          </div>

          {/* Time Period Configuration */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <Label className="text-sm font-semibold text-foreground">Reporting Period</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={onRefresh} 
                  disabled={loading} 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button 
                  onClick={onExport} 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  disabled={!selectedSite || loading}
                >
                  <Download className="h-3 w-3 mr-2 transition-transform duration-200 group-hover:translate-y-0.5" />
                  Export
                </Button>
                {isSuperAdmin && (
                  <>
                    <Button 
                      onClick={onPreview} 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                      disabled={!selectedSite || loading}
                    >
                      <Eye className="h-3 w-3 mr-2 transition-transform duration-200 group-hover:scale-105" />
                      Preview
                    </Button>
                    <Button 
                      onClick={onPrint} 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                      disabled={!selectedSite || loading}
                    >
                      <Printer className="h-3 w-3 mr-2 transition-transform duration-200 group-hover:scale-105" />
                      Print PDF
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Year</Label>
                  <Select 
                    value={selectedYear.toString()} 
                    onValueChange={onYearChange}
                  >
                    <SelectTrigger className="h-11 text-sm border-border/60 hover:border-border focus:border-primary">
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
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quarter</Label>
                  <Select 
                    value={selectedQuarter.toString()} 
                    onValueChange={onQuarterChange}
                  >
                    <SelectTrigger className="h-11 text-sm border-border/60 hover:border-border focus:border-primary">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportConfiguration;
