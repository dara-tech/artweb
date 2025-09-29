import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label } from "@/components/ui";
import React from 'react';
import { MessageCircle, Shield, Pill, Heart, AlertTriangle, User, CheckCircle } from "lucide-react";

function Counselling({ formData, handleInputChange }) {
  console.log('Counselling formData:', {
    prevention: formData.prevention,
    adherence: formData.adherence,
    spacing: formData.spacing,
    tbInfect: formData.tbInfect,
    partner: formData.partner,
    condom: formData.condom
  });
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ការប្រឹក្សាអប់រំ (Counselling)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ការប្រឹក្សាអប់រំអ្នកជំងឺ
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-teal-600" />
              </div>
              ការប្រឹក្សាអប់រំអ្នកជំងឺ (Patient Counselling & Education)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  key: 'prevention', 
                  label: 'ការបង្ការជំងឺកាមរោគ (STI Prevention)', 
                  color: 'red', 
                  icon: Shield 
                },
                { 
                  key: 'adherence', 
                  label: 'ការលេបថ្នាំអោយត្រឹមត្រូវ (ART Adherence)', 
                  color: 'green', 
                  icon: Pill 
                },
                { 
                  key: 'spacing', 
                  label: 'ការប្រើប្រាស់មធ្យោបាយពន្យារកំណើត (Birth spacing)', 
                  color: 'pink', 
                  icon: Heart 
                },
                { 
                  key: 'tbInfect', 
                  label: 'ការពិនិត្យសុខភាពរករោគសញ្ញាជំងឺរបេង (TB infection Control)', 
                  color: 'orange', 
                  icon: AlertTriangle 
                },
                { 
                  key: 'partner', 
                  label: 'ស្ថានភាពដៃគូ (Partner status)', 
                  color: 'blue', 
                  icon: User 
                },
                { 
                  key: 'condom', 
                  label: 'ការប្រើប្រាស់កុងដូម (Condoms use)', 
                  color: 'purple', 
                  icon: CheckCircle 
                }
              ].map((item) => (
                <div key={item.key} className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                  formData[item.key] === '1' 
                    ? `border-${item.color}-300 bg-${item.color}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <Checkbox
                    id={item.key}
                    checked={formData[item.key] === '1'}
                    onCheckedChange={(checked) => handleInputChange(item.key, checked ? '1' : '0')}
                    className={`text-${item.color}-600`}
                  />
                  <Label htmlFor={item.key} className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2 flex-1">
                    <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Counselling;

