import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Download, Eye, BarChart3 } from 'lucide-react';

const AuditReportCard = ({ 
  report, 
  onView, 
  onDownload, 
  isLoading = false 
}) => {
  const getReportIcon = (reportId) => {
    if (reportId.includes('active_art')) return <BarChart3 className="h-5 w-5" />;
    if (reportId.includes('mmd')) return <BarChart3 className="h-5 w-5" />;
    if (reportId.includes('tld')) return <BarChart3 className="h-5 w-5" />;
    if (reportId.includes('tpt')) return <BarChart3 className="h-5 w-5" />;
    if (reportId.includes('vl')) return <BarChart3 className="h-5 w-5" />;
    return <BarChart3 className="h-5 w-5" />;
  };

  const getReportCategory = (reportId) => {
    if (reportId.includes('active_art') || reportId.includes('active_pre_art')) {
      return 'Patient Status';
    }
    if (reportId.includes('mmd') || reportId.includes('tld')) {
      return 'Treatment';
    }
    if (reportId.includes('tpt')) {
      return 'Prevention';
    }
    if (reportId.includes('vl')) {
      return 'Monitoring';
    }
    return 'General';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getReportIcon(report.id)}
            <CardTitle className="text-lg font-semibold">
              {report.name}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {getReportCategory(report.id)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Report ID:</span> {report.id}
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => onView(report)}
              disabled={isLoading}
              className="flex-1"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Report
            </Button>
            
            <Button
              onClick={() => onDownload(report)}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditReportCard;
