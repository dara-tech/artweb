import { Card, CardContent, CardHeader, CardTitle, Label, Input, RadioGroup, RadioGroupItem } from "@/components/ui";
import React from 'react';
import { Building2, Calendar, FileText } from "lucide-react";

function Hospitalization({ formData, handleInputChange }) {
  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ការសម្រាកពេទ្យ (Hospitalization)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ព័ត៌មានអំពីការសម្រាកពេទ្យ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-gray-600" />
            </div>
            <span>
              សម្រាកពេទ្យបន្ទាប់ពីពេលពិនិត្យចុងក្រោយ (Hospitalized since last visit)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <RadioGroup
            value={formData.hospital?.toString() || '0'}
            onValueChange={(value) => handleInputChange('hospital', value)}
            className="flex gap-8"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="0" 
                id="hospital-no" 
                className="border-gray-300 text-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Label 
                htmlFor="hospital-no" 
                className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                ទេ (No)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="1" 
                id="hospital-yes" 
                className="border-gray-300 text-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <Label 
                htmlFor="hospital-yes" 
                className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                បាទ (Yes)
              </Label>
            </div>
          </RadioGroup>

          {/* Hospital Details - Show when hospitalized */}
          {formData.hospital === '1' && (
            <div className="mt-6 space-y-6">
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  ព័ត៌មានលម្អិត (Hospital Details)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <Label htmlFor="numHospital" className="text-sm font-medium text-gray-700">
                          ប៉ុន្មានថ្ងៃ (Number of days)
                        </Label>
                      </div>
                      <Input
                        id="numHospital"
                        value={formData.numHospital && formData.numHospital !== '0' && formData.numHospital !== 0 ? formData.numHospital : ''}
                        onChange={(e) => handleInputChange('numHospital', e.target.value)}
                        placeholder="Enter number of days"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        type="number"
                        min="0"
                      />
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <Label htmlFor="reasonHospital" className="text-sm font-medium text-gray-700">
                          មូលហេតុនៃការចូលសម្រាកពេទ្យ (Causes of hospitalization)
                        </Label>
                      </div>
                      <Input
                        id="reasonHospital"
                        value={formData.reasonHospital || ''}
                        onChange={(e) => handleInputChange('reasonHospital', e.target.value)}
                        placeholder="Enter reason for hospitalization"
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Hospitalization;
