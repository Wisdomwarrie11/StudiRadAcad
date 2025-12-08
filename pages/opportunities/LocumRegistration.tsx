import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle, AlertTriangle, Activity, Loader2 } from 'lucide-react';
import { NIGERIA_STATES_LGAS } from '../../data/nigerianData';
import { LocumLocation, LocumProfile } from '../../types';
import { registerLocum } from '../../services/locumService';

const LocumRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Disclaimer Modal State
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    gender: 'Male' as 'Male' | 'Female',
    minCharge: '' as any,
    minHours: '' as any,
  });

  const availableSpecialties = [
      "X-ray",
      "Ultrasound",
      "Echocardiography",
      "MRI",
      "CT"
  ];

  const [locations, setLocations] = useState<LocumLocation[]>([]);
  // Temp state for adding a location
  const [tempState, setTempState] = useState('');
  const [tempLgas, setTempLgas] = useState<string[]>([]);

  // Helpers
  const states = Object.keys(NIGERIA_STATES_LGAS).sort();
  const availableLgas = tempState ? NIGERIA_STATES_LGAS[tempState] : [];

  const toggleSpecialty = (spec: string) => {
    setPersonalInfo(prev => {
        const exists = prev.specialties.includes(spec);
        if (exists) {
            return { ...prev, specialties: prev.specialties.filter(s => s !== spec) };
        } else {
            return { ...prev, specialties: [...prev.specialties, spec] };
        }
    });
  };

  const addLocation = () => {
    if (!tempState || tempLgas.length === 0) return;
    setLocations([...locations, { state: tempState, lgas: tempLgas }]);
    setTempState('');
    setTempLgas([]);
  };

  const removeLocation = (index: number) => {
    const newLocs = [...locations];
    newLocs.splice(index, 1);
    setLocations(newLocs);
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 100); // Lifetime

        const profileData: Partial<LocumProfile> = {
            ...personalInfo,
            minCharge: Number(personalInfo.minCharge),
            maxHours: Number(personalInfo.maxHours),
            locations,
            isAvailable: true,
            subscription: {
                plan: 'Free',
                amountPaid: 0,
                startDate: now.toISOString(),
                expiryDate: futureDate.toISOString(),
                isActive: true
            }
        };

        const success = await registerLocum(profileData);
        if (success) {
            // Save simple auth to local storage for the dashboard
            localStorage.setItem('studiRad_locum_email', personalInfo.email);
            navigate('/locum/dashboard');
        } else {
            alert("Registration failed. Please contact support.");
        }
    } catch (error) {
        console.error(error);
        alert("An unexpected error occurred.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Disclaimer Modal
  if (showDisclaimer) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                    <h2 className="text-xl font-bold text-red-900">Disclaimer & Safety Notice</h2>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
                    <p className="font-bold">Please read carefully before registering:</p>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2">1. No Job Guarantees</h4>
                        <p>StudiRad is a connecting platform only. We do not promise, guarantee, or provide jobs directly. Registration increases your visibility to potential employers but does not ensure employment.</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2">2. Security & Personal Safety</h4>
                        <p>You are responsible for vetting any facility or individual that contacts you. StudiRad does not physically verify every employer.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Do not share</strong> sensitive financial details (OTP, PINs) with anyone.</li>
                            <li><strong>Be cautious</strong> when meeting for interviews or locum shifts in person. Always verify the location is a legitimate medical facility.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2">3. Limitation of Liability</h4>
                        <p>StudiRad will not be held responsible for any disputes, unpaid wages, safety incidents, or unprofessional conduct arising from connections made through this platform.</p>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <label className="flex items-start cursor-pointer mb-6">
                        <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 accent-slate-900"
                            checked={hasAcceptedTerms}
                            onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                        />
                        <span className="ml-3 text-slate-600 text-sm">
                            I have read, understood, and agree to the <strong>Terms and Conditions</strong> above. I understand that I am using this platform at my own risk.
                        </span>
                    </label>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate('/locum')}
                            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100"
                        >
                            Decline & Exit
                        </button>
                        <button 
                            onClick={() => setShowDisclaimer(false)}
                            disabled={!hasAcceptedTerms}
                            className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Progress Bar */}
        <div className="bg-slate-100 h-2 w-full">
            <div 
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${(step / 2) * 100}%` }}
            />
        </div>

        <div className="p-8 md:p-12">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                    {step === 1 && "Personal Details"}
                    {step === 2 && "Work Locations"}
                </h2>
                <span className="text-sm font-bold text-slate-400">Step {step} of 2</span>
            </div>

            {/* Step 1: Personal Info */}
            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                            value={personalInfo.fullName}
                            onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                            <input 
                                type="tel" 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                                value={personalInfo.phone}
                                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    {/* Specialties Section */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                            <Activity className="w-4 h-4 mr-1 text-amber-500" />
                            Specialties (Select all that apply)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableSpecialties.map(spec => {
                                const isSelected = personalInfo.specialties.includes(spec);
                                return (
                                    <button
                                        key={spec}
                                        onClick={() => toggleSpecialty(spec)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                            isSelected 
                                            ? 'bg-amber-100 border-amber-400 text-amber-900' 
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                        }`}
                                    >
                                        {spec}
                                    </button>
                                );
                            })}
                        </div>
                        {personalInfo.specialties.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1 font-medium">Please select at least one specialty.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
                        <select 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                            value={personalInfo.gender}
                            onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value as any})}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Min Charge (₦)</label>
                            <input 
                                type="number" 
                                placeholder="e.g 5000"
                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-amber-500 outline-none"
                                value={personalInfo.minCharge}
                                onChange={(e) => setPersonalInfo({...personalInfo, minCharge: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Max Hours</label>
                            <input 
                                type="number"
                                placeholder="e.g 8" 
                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-amber-500 outline-none"
                                value={personalInfo.minHours}
                                onChange={(e) => setPersonalInfo({...personalInfo, maxHours: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            disabled={!personalInfo.fullName || !personalInfo.email || !personalInfo.phone || !personalInfo.minCharge || personalInfo.specialties.length === 0}
                            onClick={() => setStep(2)}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-slate-800 disabled:opacity-50"
                        >
                            Next <Activity className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Locations */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200">
                        <h3 className="font-bold text-sm text-slate-700">Add New Location</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <select 
                                value={tempState}
                                onChange={(e) => { setTempState(e.target.value); setTempLgas([]); }}
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none"
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            
                            <select 
                                value={""}
                                onChange={(e) => {
                                    if(e.target.value && !tempLgas.includes(e.target.value)) {
                                        setTempLgas([...tempLgas, e.target.value]);
                                    }
                                }}
                                disabled={!tempState}
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none"
                            >
                                <option value="">Select LGAs</option>
                                {availableLgas.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        {/* Selected LGAs chips */}
                        {tempLgas.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tempLgas.map(lga => (
                                    <span key={lga} className="bg-white border border-slate-300 text-slate-700 text-xs px-2 py-1 rounded-md flex items-center">
                                        {lga} <button onClick={() => setTempLgas(tempLgas.filter(l => l !== lga))} className="ml-1 text-red-500 font-bold">×</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <button 
                            onClick={addLocation}
                            disabled={!tempState || tempLgas.length === 0}
                            className="w-full bg-white border-2 border-slate-800 text-slate-800 font-bold py-2 rounded-xl hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-800"
                        >
                            <Plus className="inline w-4 h-4 mr-1" /> Add Area
                        </button>
                    </div>

                    {/* Locations List */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-900">Your Coverage Areas:</h3>
                        {locations.length === 0 ? (
                            <p className="text-slate-400 italic text-sm">No locations added yet.</p>
                        ) : (
                            locations.map((loc, idx) => (
                                <div key={idx} className="flex justify-between items-start bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                                    <div>
                                        <p className="font-bold text-slate-800">{loc.state}</p>
                                        <p className="text-xs text-slate-500 mt-1">{loc.lgas.join(', ')}</p>
                                    </div>
                                    <button onClick={() => removeLocation(idx)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button onClick={() => setStep(1)} className="text-slate-500 font-bold px-4 hover:text-slate-800">Back</button>
                        <button 
                            disabled={locations.length === 0 || isSubmitting}
                            onClick={handleRegister}
                            className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-amber-600 disabled:opacity-50 shadow-lg shadow-amber-500/20"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                            Complete Registration
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default LocumRegistration;