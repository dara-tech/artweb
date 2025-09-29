import { Card, CardContent, CardHeader, CardTitle, Input, Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import React from 'react';
import { User, Calendar, Hash, FileText, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

function PatientInformation({ formData, handleInputChange }) {
  console.log('PatientInformation - visitStatus value:', formData.visitStatus, 'type:', typeof formData.visitStatus);
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ព័ត៌មានអ្នកជំងឺ (Patient Information)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ព័ត៌មានមូលដ្ឋាន និងព័ត៌មានការពិនិត្យ
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Patient Name */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              ឈ្មោះអ្នកជំងឺ (Patient Name)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                ឈ្មោះអ្នកជំងឺ Patient Name
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter patient name"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              ព័ត៌មានមូលដ្ឋាន (Basic Information)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="clinicId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-green-600" />
                  លេខកូដអ្នកជំងឺ Clinic ID Number
                </Label>
                <Input
                  id="clinicId"
                  value={formData.clinicId}
                  onChange={(e) => handleInputChange('clinicId', e.target.value)}
                  placeholder="Enter Clinic ID"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="artNumber" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  លេខកូដ ART (ART Number)
                </Label>
                <Input
                  id="artNumber"
                  value={formData.artNumber}
                  onChange={(e) => handleInputChange('artNumber', e.target.value)}
                  placeholder="Enter ART Number"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="visitDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  ថ្ងៃខែឆ្នាំ មកពិនិត្យ Date of visit
                </Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => handleInputChange('visitDate', e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit Status */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              ប្រភេទមកពិនិត្យ (Visit Status)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <RadioGroup
              value={formData.visitStatus?.toString() || '0'}
              onValueChange={(value) => handleInputChange('visitStatus', value)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { value: "0", label: "មកពិនិត្យដំបូង (First Visit)", color: "blue", icon: CheckCircle },
                { value: "1", label: "មកមុនពេលកំណត់ (Early Visit)", color: "green", icon: Clock },
                { value: "2", label: "មកពិនិត្យតាមការកំណត់ (Scheduled Visit)", color: "purple", icon: CheckCircle },
                { value: "3", label: "មកពិនិត្យយឺត (Late Visit)", color: "red", icon: AlertTriangle }
              ].map((status) => (
                <div key={status.value} className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                  formData.visitStatus?.toString() === status.value 
                    ? `border-${status.color}-300 bg-${status.color}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <RadioGroupItem value={status.value} id={`visit-${status.value}`} className={`text-${status.color}-600`} />
                  <Label htmlFor={`visit-${status.value}`} className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2 flex-1">
                    <status.icon className={`w-4 h-4 text-${status.color}-600`} />
                    {status.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PatientInformation;

