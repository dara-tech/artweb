import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Separator } from "@/components/ui";
import React from 'react';
import { X, Users, User, Baby, Database, Activity, Calendar, MapPin } from 'lucide-react';

const SitePreviewModal = ({ 
  showPreview, 
  setShowPreview, 
  sitePreview 
}) => {
  if (!showPreview || !sitePreview) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPatientTypeIcon = (type) => {
    switch (type) {
      case 'adult':
        return <User className="h-5 w-5 text-blue-600" />;
      case 'child':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'infant':
        return <Baby className="h-5 w-5 text-purple-600" />;
      default:
        return <Users className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPatientTypeColor = (type) => {
    switch (type) {
      case 'adult':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'child':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'infant':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Site Data Preview</DialogTitle>
              <DialogDescription>
                Overview of data available for {sitePreview.site?.SiteName || 'Selected Site'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Site Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Site Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">
                    {sitePreview.site?.SiteName || 'Unknown Site'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Site Code: {sitePreview.site?.Sid || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last Updated: {sitePreview.site?.lastUpdated ? formatDate(sitePreview.site.lastUpdated) : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Data Summary</span>
              </CardTitle>
              <CardDescription>
                Overview of patient data available in this site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Adult Patients</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {sitePreview.dataSummary?.adultPatients || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Child Patients</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {sitePreview.dataSummary?.childPatients || 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Baby className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Infant Patients</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {sitePreview.dataSummary?.infantPatients || 0}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Total Records</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {sitePreview.dataSummary?.totalRecords || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Type Breakdown</CardTitle>
              <CardDescription>Detailed breakdown by patient categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'adult', label: 'Adult Patients', count: sitePreview.dataSummary?.adultPatients || 0 },
                  { type: 'child', label: 'Child Patients', count: sitePreview.dataSummary?.childPatients || 0 },
                  { type: 'infant', label: 'Infant Patients', count: sitePreview.dataSummary?.infantPatients || 0 }
                ].map((patientType) => (
                  <div key={patientType.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getPatientTypeIcon(patientType.type)}
                      <span className="font-medium">{patientType.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold">{patientType.count}</span>
                      <Badge variant="outline" className={getPatientTypeColor(patientType.type)}>
                        {patientType.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {sitePreview.additionalInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(sitePreview.additionalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement export functionality
                console.log('Export site data:', sitePreview.site?.Sid);
                setShowPreview(false);
              }}
            >
              Export This Site
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SitePreviewModal;