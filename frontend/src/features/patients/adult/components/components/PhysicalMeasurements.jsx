import { Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import React from 'react';
import { Activity, Weight, Thermometer, Heart, Droplets, Activity as ActivityIcon } from "lucide-react";

function PhysicalMeasurements({ formData, handleInputChange }) {
  console.log('PhysicalMeasurements formData:', formData);
  console.log('Physical measurements values:', {
    weight: formData.weight,
    height: formData.height,
    temperature: formData.temperature,
    pulse: formData.pulse,
    respiration: formData.respiration,
    bloodPressure: formData.bloodPressure
  });
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ការវាស់វែងរាងកាយ (Physical Measurements)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              សញ្ញាជីវិត និងការវាស់វែងរាងកាយ
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Measurements */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Weight className="w-4 h-4 text-blue-600" />
              </div>
              ការវាស់វែងមូលដ្ឋាន (Basic Measurements)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="weight" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-blue-600" />
                  ទម្ងន់ (Kg)
                </Label>
                <Input
                  id="weight"
                  value={formData.weight && formData.weight !== -1 && formData.weight !== '-1' ? formData.weight : ''}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Enter weight"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="height" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-green-600" />
                  កម្ពស់ (cm)
                </Label>
                <Input
                  id="height"
                  value={formData.height && formData.height !== -1 && formData.height !== '-1' ? formData.height : ''}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="Enter height"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="temperature" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-600" />
                  កម្តៅ (°C)
                </Label>
                <Input
                  id="temperature"
                  value={formData.temperature && formData.temperature !== -1 && formData.temperature !== '-1' ? formData.temperature : ''}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  placeholder="Enter temperature"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-purple-600" />
              </div>
              សញ្ញាជីវិត (Vital Signs)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="pulse" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  ជីបចរ Pulse
                </Label>
                <Input
                  id="pulse"
                  value={formData.pulse && formData.pulse !== -1 && formData.pulse !== '-1' ? formData.pulse : ''}
                  onChange={(e) => handleInputChange('pulse', e.target.value)}
                  placeholder="Enter pulse"
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="respiration" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  ចង្វាក់ដង្ហើម Resp rate
                </Label>
                <Input
                  id="respiration"
                  value={formData.respiration && formData.respiration !== -1 && formData.respiration !== '-1' ? formData.respiration : ''}
                  onChange={(e) => handleInputChange('respiration', e.target.value)}
                  placeholder="Enter respiratory rate"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  សម្ពាធឈាម Blood pressure
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={formData.bloodPressure && formData.bloodPressure !== '0/0' && formData.bloodPressure !== '-1/-1' ? (formData.bloodPressure?.split('/')[0] || '') : ''}
                      onChange={(e) => handleInputChange('bloodPressure', `${e.target.value}/${formData.bloodPressure?.split('/')[1] || ''}`)}
                      placeholder="Systolic"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <span className="text-gray-500 font-medium">/</span>
                  <div className="flex-1">
                    <Input
                      value={formData.bloodPressure && formData.bloodPressure !== '0/0' && formData.bloodPressure !== '-1/-1' ? (formData.bloodPressure?.split('/')[1] || '') : ''}
                      onChange={(e) => handleInputChange('bloodPressure', `${formData.bloodPressure?.split('/')[0] || ''}/${e.target.value}`)}
                      placeholder="Diastolic"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PhysicalMeasurements;

