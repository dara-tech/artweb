import { Card, CardContent, CardHeader, CardTitle, Input, Label, RadioGroup, RadioGroupItem, Checkbox, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import React from 'react';
import { FileText, Pill, Stethoscope, AlertTriangle, CheckCircle, XCircle, Calendar, User, Heart, Shield, Activity, Building2, Clock } from "lucide-react";
import ArvDrugsSection from './ArvDrugsSection';

function AssessmentPlan({ formData, handleInputChange, visitId }) {
  console.log('AssessmentPlan formData:', formData);
  console.log('AssessmentPlan visitId:', visitId);
  console.log('ARV regimen data in AssessmentPlan:', {
    arvRegimen: formData.arvRegimen
  });
  
  // Drug table component for reusability
  const DrugTable = ({ drugType, drugCount, title, formData, handleInputChange }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-blue-700">{title}</Label>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Clear all drugs of this type
              for (let i = 0; i < drugCount; i++) {
                handleInputChange(`${drugType}Drug${i + 1}`, '');
                handleInputChange(`${drugType}Dose${i + 1}`, '');
                handleInputChange(`${drugType}Quantity${i + 1}`, '');
                handleInputChange(`${drugType}Frequency${i + 1}`, '');
                handleInputChange(`${drugType}Form${i + 1}`, '');
                handleInputChange(`${drugType}Start${i + 1}`, '');
                handleInputChange(`${drugType}Stop${i + 1}`, '');
                handleInputChange(`${drugType}Continue${i + 1}`, '');
                handleInputChange(`${drugType}Date${i + 1}`, '1900-01-01');
                handleInputChange(`${drugType}Reason${i + 1}`, '');
                handleInputChange(`${drugType}Remarks${i + 1}`, '');
              }
            }}
          >
            Clear All
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 p-2 text-left w-32">ឱសថ (Medication)</th>
                <th className="border border-gray-300 p-2 text-left w-20">កម្រិត (Dose)</th>
                <th className="border border-gray-300 p-2 text-left w-20">បរិមាណ (Quantity)</th>
                <th className="border border-gray-300 p-2 text-left w-20">ពេលវេលា (Freq)</th>
                <th className="border border-gray-300 p-2 text-left w-20">ទម្រង់ (Form)</th>
                <th className="border border-gray-300 p-2 text-center w-16">ចាប់ផ្តើម (Start)</th>
                <th className="border border-gray-300 p-2 text-center w-16">ឈប់ (Stop)</th>
                <th className="border border-gray-300 p-2 text-center w-16">បន្ត (Continue)</th>
                <th className="border border-gray-300 p-2 text-left w-24">ថ្ងៃខែឆ្នាំ (Date)</th>
                <th className="border border-gray-300 p-2 text-left w-24">មូលហេតុ (Reason)</th>
                <th className="border border-gray-300 p-2 text-left w-24">កំណត់ចំណាំ (Remarks)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: drugCount }, (_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-1">
                    <Select
                      value={formData[`${drugType}Drug${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Drug${index + 1}`, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {drugType === 'arv' && (
                          <>
                            <SelectItem value="AZT">AZT</SelectItem>
                            <SelectItem value="3TC">3TC</SelectItem>
                            <SelectItem value="TDF">TDF</SelectItem>
                            <SelectItem value="EFV">EFV</SelectItem>
                            <SelectItem value="NVP">NVP</SelectItem>
                            <SelectItem value="LPV/r">LPV/r</SelectItem>
                            <SelectItem value="ATV/r">ATV/r</SelectItem>
                            <SelectItem value="ABC">ABC</SelectItem>
                            <SelectItem value="ddI">ddI</SelectItem>
                            <SelectItem value="d4T">d4T</SelectItem>
                          </>
                        )}
                        {drugType === 'oi' && (
                          <>
                            <SelectItem value="Cotrimoxazole">Cotrimoxazole</SelectItem>
                            <SelectItem value="Fluconazole">Fluconazole</SelectItem>
                            <SelectItem value="Acyclovir">Acyclovir</SelectItem>
                            <SelectItem value="Dapsone">Dapsone</SelectItem>
                            <SelectItem value="Isoniazid">Isoniazid</SelectItem>
                          </>
                        )}
                        {drugType === 'tb' && (
                          <>
                            <SelectItem value="Rifampicin">Rifampicin</SelectItem>
                            <SelectItem value="Isoniazid">Isoniazid</SelectItem>
                            <SelectItem value="Ethambutol">Ethambutol</SelectItem>
                            <SelectItem value="Pyrazinamide">Pyrazinamide</SelectItem>
                          </>
                        )}
                        {drugType === 'hcv' && (
                          <>
                            <SelectItem value="Sofosbuvir">Sofosbuvir</SelectItem>
                            <SelectItem value="Daclatasvir">Daclatasvir</SelectItem>
                            <SelectItem value="Ribavirin">Ribavirin</SelectItem>
                          </>
                        )}
                        {drugType === 'tpt' && (
                          <>
                            <SelectItem value="Isoniazid">Isoniazid</SelectItem>
                            <SelectItem value="Rifapentine">Rifapentine</SelectItem>
                            <SelectItem value="Rifampicin">Rifampicin</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Input
                      className="h-8 text-xs"
                      value={formData[`${drugType}Dose${index + 1}`] || ''}
                      onChange={(e) => handleInputChange(`${drugType}Dose${index + 1}`, e.target.value)}
                      placeholder="Dose"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Input
                      className="h-8 text-xs"
                      value={formData[`${drugType}Quantity${index + 1}`] || ''}
                      onChange={(e) => handleInputChange(`${drugType}Quantity${index + 1}`, e.target.value)}
                      placeholder="Qty"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Select
                      value={formData[`${drugType}Frequency${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Frequency${index + 1}`, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Freq" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OD">OD</SelectItem>
                        <SelectItem value="BD">BD</SelectItem>
                        <SelectItem value="TDS">TDS</SelectItem>
                        <SelectItem value="QID">QID</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Select
                      value={formData[`${drugType}Form${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Form${index + 1}`, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Form" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tablet">Tablet</SelectItem>
                        <SelectItem value="Syrup">Syrup</SelectItem>
                        <SelectItem value="Capsule">Capsule</SelectItem>
                        <SelectItem value="Injection">Injection</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    <RadioGroup
                      value={formData[`${drugType}Start${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Start${index + 1}`, value)}
                    >
                      <RadioGroupItem value="1" id={`${drugType}Start${index + 1}`} />
                    </RadioGroup>
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    <RadioGroup
                      value={formData[`${drugType}Stop${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Stop${index + 1}`, value)}
                    >
                      <RadioGroupItem value="1" id={`${drugType}Stop${index + 1}`} />
                    </RadioGroup>
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    <RadioGroup
                      value={formData[`${drugType}Continue${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Continue${index + 1}`, value)}
                    >
                      <RadioGroupItem value="1" id={`${drugType}Continue${index + 1}`} />
                    </RadioGroup>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Input
                      type="date"
                      className="h-8 text-xs"
                      value={formData[`${drugType}Date${index + 1}`] || '1900-01-01'}
                      onChange={(e) => handleInputChange(`${drugType}Date${index + 1}`, e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Select
                      value={formData[`${drugType}Reason${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Reason${index + 1}`, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Toxicity</SelectItem>
                        <SelectItem value="2">Treatment failure</SelectItem>
                        <SelectItem value="3">Drug interaction</SelectItem>
                        <SelectItem value="4">Patient request</SelectItem>
                        <SelectItem value="5">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Select
                      value={formData[`${drugType}Remarks${index + 1}`] || ''}
                      onValueChange={(value) => handleInputChange(`${drugType}Remarks${index + 1}`, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Remarks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Good adherence</SelectItem>
                        <SelectItem value="2">Poor adherence</SelectItem>
                        <SelectItem value="3">Side effects</SelectItem>
                        <SelectItem value="4">No side effects</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ការវាយតម្លៃ និង ផែនការ (Assessment & Plan)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ផែនការព្យាបាល និង ការណែនាំសម្រាប់ការតាមដាន
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
          {/* Refer to Section */}
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <CardTitle className="text-lg font-semibold text-purple-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <span>
                  បញ្ជូនទៅ : (Refer to:)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.referTo || ''}
                onValueChange={(value) => handleInputChange('referTo', value)}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PMTCT" id="refer-pmtct" className="border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
                  <Label htmlFor="refer-pmtct" className="font-medium text-gray-700 cursor-pointer">PMTCT</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TB" id="refer-tb" className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                  <Label htmlFor="refer-tb" className="font-medium text-gray-700 cursor-pointer">TB</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inpatient" id="refer-inpatient" className="border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                  <Label htmlFor="refer-inpatient" className="font-medium text-gray-700 cursor-pointer">Inpatient</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="refer-other" className="border-gray-300 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500" />
                  <Label htmlFor="refer-other" className="font-medium text-gray-700 cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
              {formData.referTo === 'Other' && (
                <div className="mt-4">
                  <Input
                    className="w-full max-w-md"
                    placeholder="Specify other referral"
                    value={formData.referOther || ''}
                    onChange={(e) => handleInputChange('referOther', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medication Toxicities */}
          <Card className="overflow-hidden border-0 shadow-sm border-l-4 border-red-400">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
              <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <span>
                  ផលរំខានពីថ្នាំ (Medication Toxicities)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="anemia"
                    checked={formData.toxicityAnemia === '1' || formData.toxicityAnemia === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityAnemia', checked ? '1' : '0')}
                    className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                  />
                  <Label htmlFor="anemia" className="text-sm text-gray-700 cursor-pointer">Moderate/severe anemia (AZT, CTX)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="renal"
                    checked={formData.toxicityRenal === '1' || formData.toxicityRenal === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityRenal', checked ? '1' : '0')}
                    className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <Label htmlFor="renal" className="text-sm text-gray-700 cursor-pointer">Renal toxicity (TDF)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="rash"
                    checked={formData.toxicityRash === '1' || formData.toxicityRash === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityRash', checked ? '1' : '0')}
                    className="border-yellow-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <Label htmlFor="rash" className="text-sm text-gray-700 cursor-pointer">Rash (NVP, EFV, CTX, ABC)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="hepatitis"
                    checked={formData.toxicityHepatitis === '1' || formData.toxicityHepatitis === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityHepatitis', checked ? '1' : '0')}
                    className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <Label htmlFor="hepatitis" className="text-sm text-gray-700 cursor-pointer">Hepatitis (NVP, INH)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="neuropathy"
                    checked={formData.toxicityNeuropathy === '1' || formData.toxicityNeuropathy === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityNeuropathy', checked ? '1' : '0')}
                    className="border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor="neuropathy" className="text-sm text-gray-700 cursor-pointer">Peripheral neuropathy (d4T, NVP, ddI, INH)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="neutropenia"
                    checked={formData.toxicityNeutropenia === '1' || formData.toxicityNeutropenia === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityNeutropenia', checked ? '1' : '0')}
                    className="border-indigo-300 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  />
                  <Label htmlFor="neutropenia" className="text-sm text-gray-700 cursor-pointer">Neutropenia (AZT)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="hyperlipidemia"
                    checked={formData.toxicityHyperlipidemia === '1' || formData.toxicityHyperlipidemia === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityHyperlipidemia', checked ? '1' : '0')}
                    className="border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <Label htmlFor="hyperlipidemia" className="text-sm text-gray-700 cursor-pointer">Hyperlipidemia (LPV/r)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="lactic"
                    checked={formData.toxicityLactic === '1' || formData.toxicityLactic === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityLactic', checked ? '1' : '0')}
                    className="border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                  />
                  <Label htmlFor="lactic" className="text-sm text-gray-700 cursor-pointer">Lactic acidosis (d4T, AZT, ddI)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="hypersensitivity"
                    checked={formData.toxicityHypersensitivity === '1' || formData.toxicityHypersensitivity === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityHypersensitivity', checked ? '1' : '0')}
                    className="border-teal-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                  />
                  <Label htmlFor="hypersensitivity" className="text-sm text-gray-700 cursor-pointer">Hypersensitivity (ABC)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="jaundice"
                    checked={formData.toxicityJaundice === '1' || formData.toxicityJaundice === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityJaundice', checked ? '1' : '0')}
                    className="border-amber-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <Label htmlFor="jaundice" className="text-sm text-gray-700 cursor-pointer">Jaundice/Hyperbilirubinemia (NVP, INH, ATV/r)</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id="toxicity-other"
                    checked={formData.toxicityOther === '1' || formData.toxicityOther === true}
                    onCheckedChange={(checked) => handleInputChange('toxicityOther', checked ? '1' : '0')}
                    className="border-gray-300 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500"
                  />
                  <Label htmlFor="toxicity-other" className="text-sm text-gray-700 cursor-pointer">Other</Label>
                </div>
              </div>
              {formData.toxicityOther === '1' || formData.toxicityOther === true ? (
                <div className="mt-4">
                  <Input
                    className="w-full max-w-md"
                    placeholder="Specify other toxicity"
                    value={formData.toxicityOtherText || ''}
                    onChange={(e) => handleInputChange('toxicityOtherText', e.target.value)}
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="border-t border-gray-300 my-6"></div>

          {/* Current Medication Section */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-sm border-l-4 border-green-400">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-green-600" />
                  </div>
                  <span>
                    ឱសថកំពុងព្យាបាល (Current medication)
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>

                {/* ARV Drugs */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>
                      ថ្នាំ ARV (ARV Drugs)
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <RadioGroup
                      value={formData.arvRegimen || ''}
                      onValueChange={(value) => handleInputChange('arvRegimen', value)}
                      className="flex gap-4"
                    >
                      {[
                        { value: "1st", label: "1st Line", color: "green", icon: CheckCircle },
                        { value: "2nd", label: "2nd Line", color: "yellow", icon: AlertTriangle },
                        { value: "3rd", label: "3rd Line", color: "red", icon: XCircle }
                      ].map((regimen) => (
                        <div key={regimen.value} className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all cursor-pointer ${
                          formData.arvRegimen === regimen.value 
                            ? `border-${regimen.color}-300 bg-${regimen.color}-50` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <RadioGroupItem value={regimen.value} id={`arv-${regimen.value}`} className={`text-${regimen.color}-600`} />
                          <Label htmlFor={`arv-${regimen.value}`} className="font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                            <regimen.icon className={`w-4 h-4 text-${regimen.color}-600`} />
                            {regimen.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ArvDrugsSection visitId={visitId} />
              </CardContent>
            </Card>

            {/* OI Drugs */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
                <CardTitle className="text-lg font-semibold text-purple-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>
                    ថ្នាំ OI (OI Drugs - Opportunistic Infections)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <DrugTable 
                  drugType="oi" 
                  drugCount={5} 
                  title="OI Drugs (Opportunistic Infections)" 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              </CardContent>
            </Card>

            {/* HCV Drugs */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <CardTitle className="text-lg font-semibold text-orange-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>
                    ថ្នាំ HCV (HCV Drugs)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <DrugTable 
                  drugType="hcv" 
                  drugCount={3} 
                  title="HCV Drugs" 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
                
                {/* HCV Treatment Outcome */}
                <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                  <Label className="font-semibold text-orange-800 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    លទ្ធផលនៃការព្យាបាល HCV (HCV treatment outcome)
                  </Label>
                  <RadioGroup
                    value={formData.hcvOutcome || ''}
                    onValueChange={(value) => handleInputChange('hcvOutcome', value)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cured" id="hcv-cured" className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                      <Label htmlFor="hcv-cured" className="text-sm font-medium text-gray-700 cursor-pointer">ជាសះស្បើយ (Cured)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="failed" id="hcv-failed" className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                      <Label htmlFor="hcv-failed" className="text-sm font-medium text-gray-700 cursor-pointer">បរាជ័យ (Failed)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="abandoned" id="hcv-abandoned" className="border-yellow-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                      <Label htmlFor="hcv-abandoned" className="text-sm font-medium text-gray-700 cursor-pointer">លះបង់ការព្យាបាល (Treatment abandoned)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* TPT Drugs */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100">
                <CardTitle className="text-lg font-semibold text-yellow-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span>
                    ថ្នាំ TPT (TPT Drugs - TB Preventive Therapy)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <DrugTable 
                  drugType="tpt" 
                  drugCount={4} 
                  title="TPT Drugs (TB Preventive Therapy)" 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
                
                {/* TPT Outcome */}
                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
                  <Label className="font-semibold text-yellow-800 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    លទ្ធផល TPT (TPT outcome)
                  </Label>
                  <RadioGroup
                    value={formData.tptOutcome || ''}
                    onValueChange={(value) => handleInputChange('tptOutcome', value)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="completed" id="tpt-completed" className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                      <Label htmlFor="tpt-completed" className="text-sm font-medium text-gray-700 cursor-pointer">បញ្ចប់ការព្យាបាល (Treatment completed)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="abandoned" id="tpt-abandoned" className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                      <Label htmlFor="tpt-abandoned" className="text-sm font-medium text-gray-700 cursor-pointer">បោះបង់ការព្យាបាលបង្ការTPT របេង (Abandoned TPT for TB prevention)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="stopped" id="tpt-stopped" className="border-yellow-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                      <Label htmlFor="tpt-stopped" className="text-sm font-medium text-gray-700 cursor-pointer">បញ្ឈប់ការព្យាបាលដោយមានផលរំខាន (Treatment stopped due to side effects)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* TB Drugs */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
                <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-red-600" />
                  </div>
                  <span>
                    ថ្នាំរបេង (TB Drugs)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <DrugTable 
                  drugType="tb" 
                  drugCount={3} 
                  title="TB Drugs" 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
                
                {/* TB Treatment Outcome */}
                <div className="mt-6 bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg border border-red-200">
                  <Label className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    លទ្ធផលនៃការព្យាបាលរបេង (TB treatment outcome)
                  </Label>
                  <RadioGroup
                    value={formData.tbOutcome || ''}
                    onValueChange={(value) => handleInputChange('tbOutcome', value)}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cured" id="tb-cured" className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                      <Label htmlFor="tb-cured" className="text-sm font-medium text-gray-700 cursor-pointer">ជាសះស្បើយ (Cured)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="failed" id="tb-failed" className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                      <Label htmlFor="tb-failed" className="text-sm font-medium text-gray-700 cursor-pointer">បរាជ័យ (Failed)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="stopped" id="tb-stopped" className="border-yellow-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                      <Label htmlFor="tb-stopped" className="text-sm font-medium text-gray-700 cursor-pointer">បញ្ឈប់ការព្យាបាល (Treatment stopped)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-evaluated" id="tb-not-evaluated" className="border-gray-300 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500" />
                      <Label htmlFor="tb-not-evaluated" className="text-sm font-medium text-gray-700 cursor-pointer">មិនវាយតម្លៃ (Not evaluated)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-gray-300 my-6"></div>

          {/* Clear Patient Status Button */}
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-start">
                <Button 
                  variant="outline" 
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 flex items-center gap-2"
                  onClick={() => {
                    // Clear all patient status fields
                    handleInputChange('patientStatus', '');
                    handleInputChange('outcomeDate', '1900-01-01');
                    handleInputChange('placeOfDeath', '');
                    handleInputChange('causeOfDeath', '');
                    handleInputChange('causeOfDeathOther', '');
                    handleInputChange('transferOutSite', '');
                    handleInputChange('nextAppointment', '1900-01-01');
                    handleInputChange('doctorName', '');
                    handleInputChange('appointmentTime', '');
                  }}
                >
                  <XCircle className="w-4 h-4" />
                  <span>
                    លុបស្ថានភាពអ្នកជំងឺ (Clear Patient Status)
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outcome/Actions Section */}
          <Card className="overflow-hidden border-0 shadow-sm border-l-4 border-gray-400">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <span>
                  លទ្ធផល/វិធានការ (Outcome/Actions)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
            
              <div className="space-y-6">
                {/* Patient Status */}
                <div>
                  <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-600" />
                    ស្ថានភាពអ្នកជំងឺ (Patient Status)
                  </Label>
                  <RadioGroup
                    value={formData.patientStatus || ''}
                    onValueChange={(value) => handleInputChange('patientStatus', value)}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lost" id="status-lost" className="border-yellow-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                      <Label htmlFor="status-lost" className="text-sm font-medium text-gray-700 cursor-pointer">Lost</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="death" id="status-death" className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                      <Label htmlFor="status-death" className="text-sm font-medium text-gray-700 cursor-pointer">Death</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hiv-negative" id="status-hiv-negative" className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                      <Label htmlFor="status-hiv-negative" className="text-sm font-medium text-gray-700 cursor-pointer">HIV Test Negative</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer-out" id="status-transfer-out" className="border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                      <Label htmlFor="status-transfer-out" className="text-sm font-medium text-gray-700 cursor-pointer">Transfer Out</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Death Details */}
                {formData.patientStatus === 'death' && (
                  <Card className="border-l-4 border-red-400 bg-red-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        ព័ត៌មានលម្អិតអំពីការស្លាប់ (Death Details)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                            <Building2 className="w-4 h-4 text-gray-600" />
                            ទីកន្លែង : (Place)
                          </Label>
                          <RadioGroup
                            value={formData.placeOfDeath || ''}
                            onValueChange={(value) => handleInputChange('placeOfDeath', value)}
                            className="grid grid-cols-1 gap-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="home" id="place-home" className="border-gray-300 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500" />
                              <Label htmlFor="place-home" className="text-sm font-medium text-gray-700 cursor-pointer">Home</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hospital" id="place-hospital" className="border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                              <Label htmlFor="place-hospital" className="text-sm font-medium text-gray-700 cursor-pointer">Hospital</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="place-other" className="border-gray-300 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500" />
                              <Label htmlFor="place-other" className="text-sm font-medium text-gray-700 cursor-pointer">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-gray-600" />
                            មូលហេតុស្លាប់ (Cause of death)
                          </Label>
                          <RadioGroup
                            value={formData.causeOfDeath || ''}
                            onValueChange={(value) => handleInputChange('causeOfDeath', value)}
                            className="grid grid-cols-1 gap-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="aids-related" id="cause-aids" className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                              <Label htmlFor="cause-aids" className="text-sm font-medium text-gray-700 cursor-pointer">AIDs-Related</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="non-aids" id="cause-non-aids" className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                              <Label htmlFor="cause-non-aids" className="text-sm font-medium text-gray-700 cursor-pointer">Non AIDs-Related</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="accidents" id="cause-accidents" className="border-yellow-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                              <Label htmlFor="cause-accidents" className="text-sm font-medium text-gray-700 cursor-pointer">Accidents</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cause-other" className="text-sm font-medium text-gray-700">Other</Label>
                          <Input
                            id="cause-other"
                            value={formData.causeOfDeathOther || ''}
                            onChange={(e) => handleInputChange('causeOfDeathOther', e.target.value)}
                            placeholder="Specify other cause"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="outcome-date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            Date
                          </Label>
                          <Input
                            id="outcome-date"
                            type="date"
                            value={formData.outcomeDate && formData.outcomeDate !== '1900-01-01' ? formData.outcomeDate : ''}
                            onChange={(e) => handleInputChange('outcomeDate', e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Transfer Out Details */}
                {formData.patientStatus === 'transfer-out' && (
                  <Card className="border-l-4 border-blue-400 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        ព័ត៌មានផ្ទេរទៅកន្លែងផ្សេង (Transfer Out Details)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="transfer-site" className="text-sm font-medium text-gray-700">
                            ផ្ទេរទៅកន្លែង ART ផ្សេង (Transfer out to another ART site)
                          </Label>
                          <Input
                            id="transfer-site"
                            className="mt-2"
                            value={formData.transferOutSite || ''}
                            onChange={(e) => handleInputChange('transferOutSite', e.target.value)}
                            placeholder="Enter ART site name"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Next Appointment */}
                <Card className="border-l-4 border-green-400 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      ថ្ងៃណាត់ជួបលើកក្រោយ (Next appointment)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="next-appointment" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          Date
                        </Label>
                        <Input
                          id="next-appointment"
                          type="date"
                          value={formData.nextAppointment && formData.nextAppointment !== '1900-01-01' ? formData.nextAppointment : ''}
                          onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="doctor-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          Doctor Name
                        </Label>
                        <Input
                          id="doctor-name"
                          value={formData.doctorName || ''}
                          onChange={(e) => handleInputChange('doctorName', e.target.value)}
                          placeholder="Enter doctor name"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="appointment-time" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          ពេលណាត់ជួប (Appointment time)
                        </Label>
                        <Input
                          id="appointment-time"
                          value={formData.appointmentTime || ''}
                          onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                          placeholder="Enter time"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

export default AssessmentPlan;