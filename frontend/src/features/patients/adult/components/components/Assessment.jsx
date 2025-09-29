import { Card, CardContent, CardHeader, CardTitle, Input, Label, RadioGroup, RadioGroupItem, Checkbox } from "@/components/ui";
import React from 'react';
import { Activity, Stethoscope, Shield, Heart, TestTube, AlertTriangle, Calendar, CheckCircle, XCircle } from "lucide-react";

function Assessment({ formData, handleInputChange }) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ការវាយតម្លៃគ្លីនិក (Clinical Assessment)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ការចំណាត់ថ្នាក់ WHO, រោគសញ្ញា, និងការរកឃើញគ្លីនិក
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* WHO Staging */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  ចំណាត់ថ្នាក់ជំងឺតាម WHO ថ្មី? (WHO Staging?)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup
                  value={formData.whoStage || ''}
                  onValueChange={(value) => handleInputChange('whoStage', value)}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: "1", label: "Stage 1", color: "green" },
                    { value: "2", label: "Stage 2", color: "yellow" },
                    { value: "3", label: "Stage 3", color: "orange" },
                    { value: "4", label: "Stage 4", color: "red" }
                  ].map((stage) => (
                    <div key={stage.value} className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                      formData.whoStage === stage.value 
                        ? `border-${stage.color}-300 bg-${stage.color}-50` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <RadioGroupItem value={stage.value} id={`who-${stage.value}`} className="text-gray-600" />
                      <Label htmlFor={`who-${stage.value}`} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                        {stage.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* ART Eligibility */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  ករណីសមស្របប្រើ ART (Eligible for ART)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup
                  value={formData.eligible || ''}
                  onValueChange={(value) => handleInputChange('eligible', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer border-green-200 hover:border-green-300">
                    <RadioGroupItem value="1" id="eligible-yes" className="text-green-600" />
                    <Label htmlFor="eligible-yes" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      បាទ (Yes)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer border-red-200 hover:border-red-300">
                    <RadioGroupItem value="0" id="eligible-no" className="text-red-600" />
                    <Label htmlFor="eligible-no" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      ទេ (No)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Lab Results */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TestTube className="w-4 h-4 text-blue-600" />
                  </div>
                  លទ្ធផលពិនិត្យមន្ទីរពិសោធន៍ (Lab Results)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* CD4 Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="cd4" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <TestTube className="w-4 h-4 text-blue-600" />
                      លទ្ធផលពិនិត្យ CD4ពេលថ្មីៗនេះ (CD4 Results)
                    </Label>
                    <Input
                      id="cd4"
                      value={formData.cd4 && formData.cd4 !== '-1' && formData.cd4 !== -1 ? formData.cd4 : ''}
                      onChange={(e) => handleInputChange('cd4', e.target.value)}
                      placeholder="CD4 count"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="cd4-date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      CD4 Date
                    </Label>
                    <Input
                      id="cd4-date"
                      type="date"
                      value={formData.cd4Date && formData.cd4Date !== '1900-01-01' ? formData.cd4Date : ''}
                      onChange={(e) => handleInputChange('cd4Date', e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Viral Load Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="viral-load" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <TestTube className="w-4 h-4 text-purple-600" />
                      លទ្ធផលពិនិត្យ Viralloadពេលថ្មីៗនេះ (Viral Load Results)
                    </Label>
                    <Input
                      id="viral-load"
                      value={formData.hivViral && formData.hivViral !== '-1' && formData.hivViral !== -1 ? formData.hivViral : ''}
                      onChange={(e) => handleInputChange('hivViral', e.target.value)}
                      placeholder="Viral load"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="viral-load-date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Viral Load Date
                    </Label>
                    <Input
                      id="viral-load-date"
                      type="date"
                      value={formData.viralLoadDate && formData.viralLoadDate !== '1900-01-01' ? formData.viralLoadDate : ''}
                      onChange={(e) => handleInputChange('viralLoadDate', e.target.value)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Function */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-indigo-600" />
                  </div>
                  ស្ថានភាពអ្នកជំងឺ Function (Patient Function)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup
                  value={formData.function || ''}
                  onValueChange={(value) => handleInputChange('function', value)}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { value: "0", label: "Work", color: "green" },
                    { value: "1", label: "Ambulatory", color: "yellow" },
                    { value: "2", label: "Bed bound", color: "red" }
                  ].map((func) => (
                    <div key={func.value} className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                      formData.function === func.value 
                        ? `border-${func.color}-300 bg-${func.color}-50` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <RadioGroupItem value={func.value} id={`function-${func.value}`} className="text-gray-600" />
                      <Label htmlFor={`function-${func.value}`} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                        {func.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* TB Assessment */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  ការវាយតម្លៃជំងឺរបេង (TB Assessment)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* TB Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">ប្រសិនបើកើតរបេង (if TB)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <RadioGroup
                      value={formData.tb || ''}
                      onValueChange={(value) => handleInputChange('tb', value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="0" id="tb-ptb" className="text-orange-600" />
                        <Label htmlFor="tb-ptb" className="text-sm font-medium text-gray-700 cursor-pointer">PTB</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="1" id="tb-eptb" className="text-orange-600" />
                        <Label htmlFor="tb-eptb" className="text-sm font-medium text-gray-700 cursor-pointer">EPTB</Label>
                      </div>
                    </RadioGroup>
                    <RadioGroup
                      value={formData.tbResult || ''}
                      onValueChange={(value) => handleInputChange('tbResult', value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="0" id="tb-bk-plus" className="text-red-600" />
                        <Label htmlFor="tb-bk-plus" className="text-sm font-medium text-gray-700 cursor-pointer">BK+</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="1" id="tb-bk-minus" className="text-red-600" />
                        <Label htmlFor="tb-bk-minus" className="text-sm font-medium text-gray-700 cursor-pointer">BK-</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* TB Treatment */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">ការព្យាបាលជំងឺរបេង TB Treatment</Label>
                  <RadioGroup
                    value={formData.tbTreat || ''}
                    onValueChange={(value) => handleInputChange('tbTreat', value)}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { value: "0", label: "Started", color: "green" },
                      { value: "1", label: "Discontinued", color: "red" },
                      { value: "2", label: "Continued", color: "blue" }
                    ].map((treatment) => (
                      <div key={treatment.value} className={`flex items-center space-x-3 p-3 border-2 rounded-lg hover:shadow-sm transition-all cursor-pointer ${
                        formData.tbTreat === treatment.value 
                          ? `border-${treatment.color}-300 bg-${treatment.color}-50` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value={treatment.value} id={`tb-${treatment.value}`} className="text-gray-600" />
                        <Label htmlFor={`tb-${treatment.value}`} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                          {treatment.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* TB Date */}
                <div className="space-y-3">
                  <Label htmlFor="tb-date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Date
                  </Label>
                  <Input
                    id="tb-date"
                    type="date"
                    value={formData.tbDate && formData.tbDate !== '1900-01-01' ? formData.tbDate : ''}
                    onChange={(e) => handleInputChange('tbDate', e.target.value)}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* HIV Testing */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <TestTube className="w-4 h-4 text-red-600" />
                  </div>
                  ធ្វើតេស្តបញ្ជាក់រកមេរោគអេដស៍ (HIV Testing)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <Checkbox
                    id="test-hiv"
                    checked={formData.testHIV === '1' || formData.testHIV === 1}
                    onCheckedChange={(checked) => handleInputChange('testHIV', checked ? '1' : '0')}
                    className="text-red-600"
                  />
                  <Label htmlFor="test-hiv" className="text-sm font-medium text-gray-700 cursor-pointer">
                    ធ្វើតេស្តបញ្ជាក់រកមេរោគអេដស៍ មុនពេលចាប់ផ្តើមប្រើថ្នាំ ARV
                  </Label>
                </div>
                
                {formData.testHIV === '1' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">លទ្ធផលតេស្តបញ្ជាក់ (Result)</Label>
                    <RadioGroup
                      value={formData.resultHIV || ''}
                      onValueChange={(value) => handleInputChange('resultHIV', value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-3 p-3 border-2 border-red-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                        <RadioGroupItem value="0" id="hiv-positive" className="text-red-600" />
                        <Label htmlFor="hiv-positive" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Positive
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border-2 border-green-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                        <RadioGroupItem value="1" id="hiv-negative" className="text-green-600" />
                        <Label htmlFor="hiv-negative" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Negative
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lab Test Prescription */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TestTube className="w-4 h-4 text-purple-600" />
                  </div>
                  វេជ្ជបញ្ជាធ្វើតេស្តមន្ទីរពិសោធន៍ (Lab Test Prescription)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'cd4Test', label: 'CD4', color: 'blue' },
                    { key: 'hivViralTest', label: 'HIV Viral Load', color: 'purple' },
                    { key: 'hcvViralTest', label: 'HCV Viral Load', color: 'green' }
                  ].map((test) => (
                    <div key={test.key} className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">{test.label}</Label>
                      <RadioGroup
                        value={formData[test.key] || ''}
                        onValueChange={(value) => handleInputChange(test.key, value)}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="1" id={`${test.key}-yes`} className={`text-${test.color}-600`} />
                          <Label htmlFor={`${test.key}-yes`} className="text-sm font-medium text-gray-700 cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="0" id={`${test.key}-no`} className={`text-${test.color}-600`} />
                          <Label htmlFor={`${test.key}-no`} className="text-sm font-medium text-gray-700 cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CrAG Screening */}
            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-yellow-600" />
                  </div>
                  Screening for Cryptococcal Antigen (CrAG)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <Checkbox
                    id="crag-screening"
                    checked={formData.grAG === '1' || formData.grAG === 1}
                    onCheckedChange={(checked) => handleInputChange('grAG', checked ? '1' : '0')}
                    className="text-yellow-600"
                  />
                  <Label htmlFor="crag-screening" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Screening for Cryptococcol Antigen (CrAG)
                  </Label>
                </div>
                
                {formData.grAG === '1' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Result</Label>
                    <RadioGroup
                      value={formData.resultCrAG || ''}
                      onValueChange={(value) => handleInputChange('resultCrAG', value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-3 p-3 border-2 border-red-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                        <RadioGroupItem value="0" id="crag-positive" className="text-red-600" />
                        <Label htmlFor="crag-positive" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Positive
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border-2 border-green-200 rounded-lg hover:shadow-sm transition-all cursor-pointer">
                        <RadioGroupItem value="1" id="crag-negative" className="text-green-600" />
                        <Label htmlFor="crag-negative" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Negative
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assessment;

