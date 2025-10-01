import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SiteFilter = ({ 
  sites = [], 
  selectedSite, 
  onSiteChange, 
  disabled = false,
  showAllOption = true,
  className = "",
  variant = "default" // "default", "compact", "card", "minimal"
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.code.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getSiteType = (site) => {
    if (site.name?.toLowerCase().includes('ph')) return 'Provincial Hospital';
    if (site.name?.toLowerCase().includes('rh')) return 'Referral Hospital';
    if (site.name?.toLowerCase().includes('clinic')) return 'Clinic';
    return 'Health Facility';
  };

  if (variant === "minimal") {
    return (
      <Select 
        value={selectedSite?.code || ''} 
        onValueChange={(value) => {
          if (value === 'all') {
            onSiteChange(null);
          } else {
            const site = sites.find(s => s.code === value);
            onSiteChange(site);
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 text-sm border-gray-200 focus:border-slate-400 focus:ring-slate-400">
          <SelectValue placeholder="Select site" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">
              All Sites
            </SelectItem>
          )}
          {filteredSites.map((site) => (
            <SelectItem key={site.code} value={site.code}>
              {site.name} ({site.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 ${className}`}>
        <Label className="text-sm font-medium text-gray-700">
          <span className="hidden sm:inline">Site:</span>
          <span className="sm:hidden">Select Site</span>
        </Label>
        <Select 
          value={selectedSite?.code || 'all'} 
          onValueChange={(value) => {
            console.log('SiteFilter value changed:', value);
            if (value === 'all') {
              console.log('Setting site to null (All Sites)');
              onSiteChange(null);
            } else {
              const site = sites.find(s => s.code === value);
              console.log('Setting site to:', site);
              onSiteChange(site);
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger className="w-full sm:w-56 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Select site" />
          </SelectTrigger>
          <SelectContent className="max-h-80 w-full">
            {showAllOption && (
              <SelectItem value="all" className="py-2 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">All Sites</span>
                    <span className="text-xs text-gray-500 hidden sm:block">All sites combined</span>
                  </div>
                </div>
              </SelectItem>
            )}
            {filteredSites.slice(0, 6).map((site) => (
              <SelectItem key={site.code} value={site.code} className="py-2 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{site.name}</span>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {site.code}
                      </Badge>
                      <span className="text-xs text-gray-500 hidden sm:inline">{getSiteType(site)}</span>
                    </div>
                  </div>
                  {site.patientCount && (
                    <Badge variant="outline" className="text-xs hidden sm:flex">
                      {site.patientCount.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
            {filteredSites.length > 6 && (
              <div className="px-3 py-2 text-xs text-gray-500 text-center border-t">
                Showing 6 of {filteredSites.length} sites
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Site Filter</h3>
              <p className="text-xs text-gray-500 hidden sm:block">Select a specific site or view all</p>
            </div>
          </div>
          {selectedSite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSiteChange(null)}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              ×
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 sm:h-9 text-sm"
            />
          </div>

          <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-1">
            {showAllOption && (
              <div
                onClick={() => onSiteChange(null)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50",
                  !selectedSite ? "bg-blue-50 border border-blue-200" : "border border-transparent"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">All Sites</div>
                  <div className="text-xs text-gray-500 hidden sm:block">All sites combined</div>
                </div>
                {!selectedSite && <span className="text-blue-600 flex-shrink-0">✓</span>}
              </div>
            )}

            {filteredSites.slice(0, 6).map((site) => (
              <div
                key={site.code}
                onClick={() => onSiteChange(site)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50",
                  selectedSite?.code === site.code ? "bg-green-50 border border-green-200" : "border border-transparent"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{site.name}</div>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5">
                      {site.code}
                    </Badge>
                    <span className="text-xs text-gray-500 hidden sm:inline">{getSiteType(site)}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {site.patientCount && (
                    <div className="text-xs text-gray-500 hidden sm:block">
                      {site.patientCount.toLocaleString()} records
                    </div>
                  )}
                  {selectedSite?.code === site.code && <span className="text-green-600 mt-1">✓</span>}
                </div>
              </div>
            ))}

            {filteredSites.length > 6 && (
              <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t bg-muted rounded-b-lg">
                Showing 6 of {filteredSites.length} sites
                {searchTerm && (
                  <div className="mt-1">
                    Use search to find more sites
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 ${className}`}>
      <Label className="text-sm font-semibold text-gray-700">
        <span className="hidden sm:inline">Site Filter:</span>
        <span className="sm:hidden">Select Site</span>
      </Label>
      <Select 
        value={selectedSite?.code || 'all'} 
        onValueChange={(value) => {
          if (value === 'all') {
            onSiteChange(null);
          } else {
            const site = sites.find(s => s.code === value);
            onSiteChange(site);
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full sm:w-64 h-9 sm:h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm">
          <SelectValue placeholder="Select site" />
        </SelectTrigger>
        <SelectContent className="max-h-80 w-full">
          {showAllOption && (
            <SelectItem value="all" className="py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">All Sites</span>
                  <span className="text-xs text-gray-500 hidden sm:block">All sites combined</span>
                </div>
              </div>
            </SelectItem>
          )}
          {filteredSites.slice(0, 6).map((site) => (
            <SelectItem key={site.code} value={site.code} className="py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">{site.name}</span>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5">
                      {site.code}
                    </Badge>
                    <span className="text-xs text-gray-500 hidden sm:inline">{getSiteType(site)}</span>
                  </div>
                </div>
                {site.patientCount && (
                  <Badge variant="outline" className="text-xs hidden sm:flex">
                    {site.patientCount.toLocaleString()}
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
          {filteredSites.length > 6 && (
            <div className="px-3 py-2 text-xs text-gray-500 text-center border-t">
              Showing 6 of {filteredSites.length} sites
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SiteFilter;
