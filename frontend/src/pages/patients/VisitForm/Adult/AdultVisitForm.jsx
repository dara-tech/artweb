import { Button, Card, CardContent, CardHeader, CardTitle, Separator, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, Stethoscope, Loader2 } from "lucide-react";
import api from "../../../../services/api";

// Import form components
import PatientInformation from '../../../../features/patients/adult/components/components/PatientInformation';
import Demographics from '../../../../features/patients/adult/components/components/Demographics';
import PhysicalMeasurements from '../../../../features/patients/adult/components/components/PhysicalMeasurements';
import Assessment from '../../../../features/patients/adult/components/components/Assessment';
import AssessmentPlan from '../../../../features/patients/adult/components/components/AssessmentPlan';
import Counselling from '../../../../features/patients/adult/components/components/Counselling';
import Symptoms from '../../../../features/patients/adult/components/components/Symptoms';
import Hospitalization from '../../../../features/patients/adult/components/components/Hospitalization';
import Adherence from '../../../../features/patients/adult/components/components/Adherence';

function AdultVisitForm() {
  const { clinicId, visitId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // Initialize drug fields
  const initializeDrugFields = () => {
    const drugFields = {};
    
      // ARV drugs - Note: These fields don't exist in the database yet
      // for (let i = 1; i <= 8; i++) {
      //   drugFields[`arvDrug${i}`] = '';
      //   drugFields[`arvDose${i}`] = '';
      //   drugFields[`arvQuantity${i}`] = '';
      //   drugFields[`arvFrequency${i}`] = '';
      //   drugFields[`arvForm${i}`] = '';
      //   drugFields[`arvStatus${i}`] = '0';
      //   drugFields[`arvDate${i}`] = '1900-01-01';
      //   drugFields[`arvReason${i}`] = '';
      //   drugFields[`arvRemarks${i}`] = '';
      // }
    
    // OI drugs
    for (let i = 1; i <= 5; i++) {
      drugFields[`oiDrug${i}`] = '';
      drugFields[`oiDose${i}`] = '';
      drugFields[`oiQuantity${i}`] = '';
      drugFields[`oiFrequency${i}`] = '';
      drugFields[`oiForm${i}`] = '';
      drugFields[`oiStart${i}`] = '';
      drugFields[`oiStop${i}`] = '';
      drugFields[`oiContinue${i}`] = '';
      drugFields[`oiDate${i}`] = '1900-01-01';
      drugFields[`oiReason${i}`] = '';
      drugFields[`oiRemarks${i}`] = '';
    }
    
    // HCV drugs
    for (let i = 1; i <= 3; i++) {
      drugFields[`hcvDrug${i}`] = '';
      drugFields[`hcvDose${i}`] = '';
      drugFields[`hcvQuantity${i}`] = '';
      drugFields[`hcvFrequency${i}`] = '';
      drugFields[`hcvForm${i}`] = '';
      drugFields[`hcvStart${i}`] = '';
      drugFields[`hcvStop${i}`] = '';
      drugFields[`hcvContinue${i}`] = '';
      drugFields[`hcvDate${i}`] = '1900-01-01';
      drugFields[`hcvReason${i}`] = '';
      drugFields[`hcvRemarks${i}`] = '';
    }
    
    // TPT drugs
    for (let i = 1; i <= 4; i++) {
      drugFields[`tptDrug${i}`] = '';
      drugFields[`tptDose${i}`] = '';
      drugFields[`tptQuantity${i}`] = '';
      drugFields[`tptFrequency${i}`] = '';
      drugFields[`tptForm${i}`] = '';
      drugFields[`tptStart${i}`] = '';
      drugFields[`tptStop${i}`] = '';
      drugFields[`tptContinue${i}`] = '';
      drugFields[`tptDate${i}`] = '1900-01-01';
      drugFields[`tptReason${i}`] = '';
      drugFields[`tptRemarks${i}`] = '';
    }
    
    // TB drugs
    for (let i = 1; i <= 3; i++) {
      drugFields[`tbDrug${i}`] = '';
      drugFields[`tbDose${i}`] = '';
      drugFields[`tbQuantity${i}`] = '';
      drugFields[`tbFrequency${i}`] = '';
      drugFields[`tbForm${i}`] = '';
      drugFields[`tbStart${i}`] = '';
      drugFields[`tbStop${i}`] = '';
      drugFields[`tbContinue${i}`] = '';
      drugFields[`tbDate${i}`] = '1900-01-01';
      drugFields[`tbReason${i}`] = '';
      drugFields[`tbRemarks${i}`] = '';
    }
    
    return drugFields;
  };

  const [formData, setFormData] = useState({
    // Patient Information
    clinicId: clinicId || '',
    artNumber: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitStatus: '0', // Default to first visit
    visitId: '',
    
    // Demographics
    name: '',
    age: '',
    gender: '',
    pregnantStatus: '0',
    typePregnant: '0',
    pregnantDate: '1900-01-01',
    ancStatus: '0',
    
    // Physical Measurements
    weight: '0',
    height: '0',
    temperature: '0',
    pulse: '0',
    respiration: '0',
    bloodPressure: '0/0',
    
    // Counselling
    prevention: '0',
    adherence: '0',
    spacing: '0',
    tbInfect: '0',
    partner: '0',
    condom: '0',
    
    // Contraceptive Methods
    typeClient: '0',
    useDate: '1900-01-01',
    condomCount: '0',
    cocCount: '0',
    pocCount: '0',
    drugCount: '0',
    placeService: '0',
    condomUsed: '0',
    cocUsed: '0',
    pocUsed: '0',
    drugUsed: '0',
    otherUsed: '0',
    
    // Symptoms (Last 4 weeks)
    cough: '0',
    fever: '0',
    lostWeight: '0',
    sweet: '0',
    urine: '0',
    genital: '0',
    chemnah: '0',
    
    // Hospitalization
    hospital: '0',
    numHospital: '0',
    reasonHospital: '',
    
    // Adherence
    missARV: '0',
    missTime: '0',
    
    // Assessment
    whoStage: '0',
    eligible: '0',
    targetGroup: '',
    function: '0',
    tb: '0',
    tbResult: '0',
    tbTreat: '0',
    tbDate: '1900-01-01',
    cd4Date: '1900-01-01',
    
    // Include drug fields in initial state
    ...initializeDrugFields(),
    viralLoadDate: '1900-01-01',
    cd4Test: '0',
    hivViralTest: '0',
    hcvViralTest: '0',
    
    // HIV Testing
    testHIV: '0',
    resultHIV: '0',
    cd4: '0',
    hivViral: '0',
    hcvViral: '0',
    grAG: '0',
    resultCrAG: '0',
    viralDetect: '0',
    
    // Referral
    refer: '0',
    referOther: '',
    
    // Side Effects
    moderate: '0',
    tdf: '0',
    rash: '0',
    hepatitis: '0',
    peripheral: '0',
    azt: '0',
    lpv: '0',
    lactic: '0',
    abc: '0',
    atv: '0',
    mediOther: '',
    
    // Treatment
    arvLine: '0',
    resultHype: '0',
    tpt: '0',
    tbOut: '0',
    
    // Follow-up
    appointmentDate: '1900-01-01',
    foWorker: '0',
    countryId: '0'
  });

  // Load visit data if editing
  useEffect(() => {
    const loadVisitData = async () => {
      if (visitId) {
        setLoading(true);
        try {
          // Load visit data
          const visitResponse = await api.get(`/visits/adult/${clinicId}/${visitId}`);
          if (visitResponse.data && visitResponse.data.visit) {
            console.log('Visit data loaded:', visitResponse.data.visit);
            console.log('Visit status from API:', visitResponse.data.visit.visitStatus, 'type:', typeof visitResponse.data.visit.visitStatus);
            console.log('Counselling data from API:', {
              prevention: visitResponse.data.visit.prevention,
              adherence: visitResponse.data.visit.adherence,
              spacing: visitResponse.data.visit.spacing,
              tbInfect: visitResponse.data.visit.tbInfect,
              partner: visitResponse.data.visit.partner,
              condom: visitResponse.data.visit.condom
            });
            console.log('Symptoms data from API:', {
              cough: visitResponse.data.visit.cough,
              fever: visitResponse.data.visit.fever,
              lostWeight: visitResponse.data.visit.lostWeight,
              sweet: visitResponse.data.visit.sweet,
              urine: visitResponse.data.visit.urine,
              genital: visitResponse.data.visit.genital,
              chemnah: visitResponse.data.visit.chemnah
            });
            
            // Log ARV regimen data from API
            console.log('ARV regimen data from API:', {
              arvRegimen: visitResponse.data.visit.arvRegimen
            });
            
            setFormData(prev => ({ ...prev, ...visitResponse.data.visit }));
          }
          
          // Load patient data to get age, gender, etc.
          if (clinicId) {
            try {
              const patientResponse = await api.get(`/api/patients/adult/${clinicId}`);
              if (patientResponse.data) {
                console.log('Patient data loaded:', patientResponse.data);
                setFormData(prev => ({
                  ...prev,
                  age: patientResponse.data.age || '',
                  gender: patientResponse.data.sex?.toString() || '',
                  name: patientResponse.data.patientName || ''
                }));
              }
            } catch (patientError) {
              console.error('Error loading patient data:', patientError);
            }
          }
        } catch (error) {
          console.error('Error loading visit data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadVisitData();
  }, [visitId, clinicId]);

  // Monitor form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);


  const handleInputChange = (field, value) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New form data:', newData);
      return newData;
    });
  };

  const handleSave = async (isDraft = false) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        isDraft,
        lastUpdated: new Date().toISOString()
      };

      if (visitId) {
        // Update existing visit
        await api.put(`/api/visits/adult/${visitId}`, payload);
      } else {
        // Create new visit
        await api.post('/api/visits/adult', payload);
      }
      
      alert(isDraft ? 'Visit saved as draft!' : 'Visit saved successfully!');
    } catch (error) {
      console.error('Error saving visit:', error);
      alert('Error saving visit. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  const handleBack = () => {
    navigate('/visits/adult');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">កំពុងផ្ទុកទិន្នន័យមកពិនិត្យ... (Loading visit data...)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="mb-2">
        <div className="max-w-7xl mx-auto ">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ទម្រង់ព័ត៌មាននៃអ្នកជំងឺពេលមកពិនិត្យជំងឺ (Adult Patient Visit Form)</h1>
                <p className="text-sm text-gray-500">
                  {visitId ? `លេខកូដមកពិនិត្យ: ${visitId}` : 'មកពិនិត្យថ្មី (New Visit)'}
                  {clinicId && ` • លេខកូដអ្នកជំងឺ: ${clinicId}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Draft
              </Button>
              <Button 
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Tabs defaultValue="patient-info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50 border-b border-gray-200 rounded-none">
              <TabsTrigger 
                value="patient-info" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  ព័ត៌មានអ្នកជំងឺ និង ការវាយតម្លៃ (Patient & Clinical Info)
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="medical-assessment"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  ការព្យាបាល និង ផែនការ (Treatment & Plan)
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="p-8">
              <TabsContent value="patient-info" className="mt-0 space-y-8">
                <div className="space-y-8">
                  <PatientInformation formData={formData} handleInputChange={handleInputChange} />
                  <Demographics formData={formData} handleInputChange={handleInputChange} />
                  <PhysicalMeasurements formData={formData} handleInputChange={handleInputChange} />
                  <Counselling formData={formData} handleInputChange={handleInputChange} />
                  <Symptoms formData={formData} handleInputChange={handleInputChange} />
                  <Hospitalization formData={formData} handleInputChange={handleInputChange} />
                  <Adherence formData={formData} handleInputChange={handleInputChange} />
                  <Assessment formData={formData} handleInputChange={handleInputChange} />
                </div>
              </TabsContent>

              <TabsContent value="medical-assessment" className="mt-0 space-y-8">
                <div className="space-y-8">
                  <AssessmentPlan formData={formData} handleInputChange={handleInputChange} visitId={visitId} />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                បោះបង់ (Cancel)
              </Button>
              <Button 
                onClick={() => handleSave(false)}
                disabled={saving}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                រក្សាទុក និង បញ្ចប់ (Save & Complete)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdultVisitForm;
