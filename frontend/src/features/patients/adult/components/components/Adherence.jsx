import { Card, CardContent, CardHeader, CardTitle, Label, Input, RadioGroup, RadioGroupItem } from "@/components/ui";
import React from 'react';
import { Pill, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

function Adherence({ formData, handleInputChange }) {
  const adherenceStatus = formData.missARV === '1' ? 'poor' : 'good';
  
  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Pill className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ការវាយតម្លៃលើការលេបថ្នាំ (Adherence Assessment)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ការពិនិត្យការលេបថ្នាំអោយត្រឹមត្រូវ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
              <Pill className="w-4 h-4 text-gray-600" />
            </div>
            <span>
              ភ្លេចលេបថ្នាំ ARV ពេលមកពិនិត្យចុងក្រោយ (Missed ARV doses since last visit)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <RadioGroup
            value={formData.missARV?.toString() || '0'}
            onValueChange={(value) => handleInputChange('missARV', value)}
            className="flex gap-8"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="0" 
                id="miss-no" 
                className="border-gray-300 text-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Label 
                htmlFor="miss-no" 
                className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                ទេ (No)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="1" 
                id="miss-yes" 
                className="border-gray-300 text-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <Label 
                htmlFor="miss-yes" 
                className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 text-red-500" />
                បាទ (Yes)
              </Label>
            </div>
          </RadioGroup>

          {/* Missed Times - Show when missed doses */}
          {formData.missARV === '1' && (
            <div className="mt-6 space-y-6">
              <div className="border-t border-gray-200 pt-6">
                <Card className={`border-l-4 ${adherenceStatus === 'poor' ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${adherenceStatus === 'poor' ? 'text-red-600' : 'text-green-600'}`} />
                      ព័ត៌មានលម្អិត (Adherence Details)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Pill className="w-4 h-4 text-orange-600" />
                        </div>
                        <Label htmlFor="missTime" className="text-sm font-medium text-gray-700">
                          ប៉ុន្មានដង (How many times)
                        </Label>
                      </div>
                      <Input
                        id="missTime"
                        value={formData.missTime && formData.missTime !== '0' && formData.missTime !== 0 ? formData.missTime : ''}
                        onChange={(e) => handleInputChange('missTime', e.target.value)}
                        placeholder="Enter number of missed doses"
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                        type="number"
                        min="0"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Adherence Summary */}
          <div className="mt-6">
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Pill className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      សរុបការលេបថ្នាំ (Adherence Summary)
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.missARV === '1' 
                        ? `បានភ្លេចលេបថ្នាំ ${formData.missTime || '0'} ដង` 
                        : 'លេបថ្នាំត្រឹមត្រូវ'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Adherence;
