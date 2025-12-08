import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Activity, Loader2, ArrowLeft } from 'lucide-react';
import { NIGERIA_STATES_LGAS } from '../../data/nigerianData';
import { LocumLocation, LocumProfile } from '../../types';
import { getLocumProfile, updateLocum } from '../../services/locumService';

const LocumEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    gender: 'Male' as 'Male' | 'Female',
    minCharge: '' as any,
    maxHours: '' as any,
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

  useEffect(() => {
      const fetchProfile = async () => {
          const email = localStorage.getItem('studiRad_locum_email');
          if (!email) {
              navigate('/locum');
              return;
          }
          const profile = await getLocumProfile(email);
          if (profile) {
              setPersonalInfo({
                  fullName: profile.fullName,
                  email: profile.email,
                  phone: profile.phone,
                  specialties: profile.specialties || [],
                  gender: profile.gender,
                  minCharge: profile.minCharge,
                  maxHours: profile.maxHours
              });
              setLocations(profile.locations || []);
          }
          setLoading(false);
      };
      fetchProfile();
  }, [navigate]);

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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
        const profileData: Partial<LocumProfile> = {
            ...personalInfo,
            minCharge: Number(personalInfo.minCharge),
            maxHours: Number(personalInfo.maxHours),
            locations,
        };

        const success = await updateLocum(profileData);
        if (success) {
            navigate('/locum/dashboard');
        } else {
            alert("Update failed. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("An unexpected error occurred.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center">
                <button onClick={() => navigate('/locum/dashboard')} className="mr-4 text-slate-400 hover:text-slate-800">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
             </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
            {/* Personal Info */}
            <section className="space-y-4">
                <h3 className="font-bold text-amber-600 uppercase text-xs tracking-wider border-b border-slate-100 pb-2 mb-4">Personal Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                            value={personalInfo.fullName}
                            onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
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
                
                <div>
                     {/* Email read-only */}
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email <span className="text-xs font-normal text-slate-400">(Cannot be changed)</span></label>
                    <input 
                        type="email" 
                        disabled
                        className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
                        value={personalInfo.email}
                    />
                </div>
            </section>

             {/* Professional Info */}
            <section className="space-y-4">
                 <h3 className="font-bold text-amber-600 uppercase text-xs tracking-wider border-b border-slate-100 pb-2 mb-4">Professional Details</h3>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                        <Activity className="w-4 h-4 mr-1 text-amber-500" />
                        Specialties
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
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Min Charge (₦)</label>
                        <input 
                            type="number" 
                            className="w-full p-3 rounded-lg border border-slate-200 focus:border-amber-500 outline-none"
                            value={personalInfo.minCharge}
                            onChange={(e) => setPersonalInfo({...personalInfo, minCharge: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Max Hours</label>
                        <input 
                            type="number"
                            className="w-full p-3 rounded-lg border border-slate-200 focus:border-amber-500 outline-none"
                            value={personalInfo.maxHours}
                            onChange={(e) => setPersonalInfo({...personalInfo, maxHours: e.target.value})}
                        />
                    </div>
                </div>
            </section>

             {/* Locations */}
            <section className="space-y-4">
                <h3 className="font-bold text-amber-600 uppercase text-xs tracking-wider border-b border-slate-100 pb-2 mb-4">Work Locations</h3>
                
                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-200">
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
                            className="w-full bg-white border-2 border-slate-800 text-slate-800 font-bold py-2 rounded-xl hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <Plus className="inline w-4 h-4 mr-1" /> Add Area
                        </button>
                    </div>

                    <div className="space-y-3">
                        {locations.length === 0 ? (
                            <p className="text-slate-400 italic text-sm">No locations added.</p>
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
            </section>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                    disabled={isSubmitting}
                    onClick={handleSave}
                    className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-amber-600 disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Save Changes
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LocumEditProfile;