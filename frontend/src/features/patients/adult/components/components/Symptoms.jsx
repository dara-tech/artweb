import { Card, CardContent, CardHeader, CardTitle, Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import React from 'react';
import { Activity, Thermometer, Weight, Moon, Droplets, Shield, AlertTriangle } from "lucide-react";

function Symptoms({ formData, handleInputChange }) {
  console.log('Symptoms formData:', {
    cough: formData.cough,
    fever: formData.fever,
    lostWeight: formData.lostWeight,
    sweet: formData.sweet,
    urine: formData.urine,
    genital: formData.genital,
    chemnah: formData.chemnah
  });

  const symptoms = [
    {
      key: 'cough',
      icon: Activity,
      title: 'ធ្លាប់មានក្អក',
      subtitle: 'Cough',
      color: 'blue'
    },
    {
      key: 'fever',
      icon: Thermometer,
      title: 'ធ្លាប់មានក្តៅខ្លួន',
      subtitle: 'Fever',
      color: 'red'
    },
    {
      key: 'lostWeight',
      icon: Weight,
      title: 'ស្រកទម្ងន់',
      subtitle: 'Weight Loss',
      color: 'orange'
    },
    {
      key: 'sweet',
      icon: Moon,
      title: 'បែកញើសជោកខុសធម្មតានៅពេលយប់',
      subtitle: 'Night Sweats',
      color: 'purple'
    },
    {
      key: 'urine',
      icon: Droplets,
      title: 'ហូរខ្ទុះតាមប្រដាប់ភេទ ឫ បង្ហូរនោម',
      subtitle: 'Urine Problems',
      color: 'cyan'
    },
    {
      key: 'genital',
      icon: Shield,
      title: 'សិរមាន់ ឫ ដុំសាច់ដុះលើប្រដាប់ភេទ',
      subtitle: 'Genital Problems',
      color: 'pink'
    },
    {
      key: 'chemnah',
      icon: AlertTriangle,
      title: 'ដំបៅ ឫ រលាកប្រដាប់ភេទ',
      subtitle: 'Chemnah',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      red: 'from-red-50 to-red-100 border-red-200 text-red-800',
      orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-800',
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
      cyan: 'from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-800',
      pink: 'from-pink-50 to-pink-100 border-pink-200 text-pink-800',
      yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800'
    };
    return colorMap[color] || 'from-gray-50 to-gray-100 border-gray-200 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              រោគសញ្ញារយៈពេល៤សប្តាហ៍ចុងក្រោយ (Symptoms - Last 4 weeks)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ការពិនិត្យរោគសញ្ញារបស់អ្នកជំងឺ
            </p>
          </div>
        </div>
      </div>

      {/* Symptoms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {symptoms.map((symptom) => {
          const IconComponent = symptom.icon;
          const colorClasses = getColorClasses(symptom.color);
          
          return (
            <Card key={symptom.key} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
              <CardHeader className={`bg-gradient-to-r ${colorClasses} pb-3`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${symptom.color === 'yellow' ? 'text-yellow-600' : `text-${symptom.color}-600`}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold">
                      {symptom.title}
                    </CardTitle>
                    <p className="text-xs opacity-75 mt-1">{symptom.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <RadioGroup
                  value={formData[symptom.key]?.toString() || '0'}
                  onValueChange={(value) => handleInputChange(symptom.key, value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="0" 
                      id={`${symptom.key}-no`} 
                      className="border-gray-300 text-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <Label 
                      htmlFor={`${symptom.key}-no`} 
                      className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      ទេ (No)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="1" 
                      id={`${symptom.key}-yes`} 
                      className="border-gray-300 text-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />
                    <Label 
                      htmlFor={`${symptom.key}-yes`} 
                      className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      បាទ (Yes)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <h4 className="font-semibold text-gray-800">
              សរុបរោគសញ្ញា (Symptoms Summary)
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">ទេ (No): {symptoms.filter(s => formData[s.key] === '0' || formData[s.key] === 0).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">បាទ (Yes): {symptoms.filter(s => formData[s.key] === '1' || formData[s.key] === 1).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Symptoms;
