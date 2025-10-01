import { Card, CardContent, CardHeader, CardTitle, Input, Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import React from 'react';
import { User, Calendar, Heart, CheckCircle, XCircle } from "lucide-react";

function Demographics({ formData, handleInputChange }) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-muted to-muted border border-border rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              ព័ត៌មានបុគ្គល (Demographics)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              ព័ត៌មានផ្ទាល់ខ្លួន និងស្ថានភាពមានផ្ទៃពោះ
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Demographics */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              ព័ត៌មានមូលដ្ឋាន (Basic Information)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  ឈ្មោះ Name
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter patient name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="age" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  អាយុ Age
                </Label>
                <Input
                  id="age"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter age"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  ភេទ Sex
                </Label>
                <RadioGroup
                  value={formData.gender?.toString() || ''}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-3 p-3 border-2 border-pink-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                    <RadioGroupItem value="0" id="female" className="text-pink-600" />
                    <Label htmlFor="female" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-600" />
                      ស្រី Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border-2 border-blue-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                    <RadioGroupItem value="1" id="male" className="text-blue-600" />
                    <Label htmlFor="male" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      ប្រុស Male
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pregnancy Status */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              ស្ថានភាពមានផ្ទៃពោះ (Pregnancy Status)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <RadioGroup
              value={formData.pregnantStatus || ''}
              onValueChange={(value) => handleInputChange('pregnantStatus', value)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { value: "0", label: "មិនមានផ្ទៃពោះ (Not Pregnant)", color: "gray", icon: XCircle },
                { value: "1", label: "មានផ្ទៃពោះ (Pregnant)", color: "pink", icon: Heart },
                { value: "2", label: "រំលូត (Abortion)", color: "red", icon: XCircle }
              ].map((status) => (
                <div key={status.value} className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                  formData.pregnantStatus === status.value 
                    ? `border-${status.color}-300 bg-${status.color}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <RadioGroupItem value={status.value} id={`pregnant-${status.value}`} className={`text-${status.color}-600`} />
                  <Label htmlFor={`pregnant-${status.value}`} className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2 flex-1">
                    <status.icon className={`w-4 h-4 text-${status.color}-600`} />
                    {status.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Pregnancy Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <Label htmlFor="expectedDeliveryDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-600" />
                  មានផ្ទៃពោះគិតថ្ងៃដែលត្រូវសម្រាលកូន (Expected Delivery Date)
                </Label>
                <Input
                  id="expectedDeliveryDate"
                  type="date"
                  value={formData.pregnantDate && formData.pregnantDate !== '1900-01-01' ? formData.pregnantDate : ''}
                  onChange={(e) => handleInputChange('pregnantDate', e.target.value)}
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  បានពិនិត្យផ្ទៃពោះនៅសេវា ANC (ANC Service)
                </Label>
                <RadioGroup
                  value={formData.ancStatus || ''}
                  onValueChange={(value) => handleInputChange('ancStatus', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-3 p-3 border-2 border-green-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                    <RadioGroupItem value="1" id="anc-yes" className="text-green-600" />
                    <Label htmlFor="anc-yes" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      បាន (Yes)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border-2 border-red-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                    <RadioGroupItem value="0" id="anc-no" className="text-red-600" />
                    <Label htmlFor="anc-no" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      មិនបាន (No)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Demographics;

