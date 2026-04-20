import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Power, MapPin, Calendar, User, LogOut, CheckCircle2, Edit } from 'lucide-react';
import { getLocumProfile, toggleLocumAvailability } from '../../services/locumService';
import { LocumProfile } from '../../types';

const LocumDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LocumProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('studiRad_locum_email');
    if (!email) {
        navigate('/locum');
        return;
    }

    const fetchProfile = async () => {
        const data = await getLocumProfile(email);
        if (data) {
            setProfile(data);
        } else {
            navigate('/locum/register'); // Profile not found
        }
        setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleToggle = async () => {
    if (!profile) return;
    setToggling(true);
    const newState = !profile.isAvailable;
    
    const success = await toggleLocumAvailability(profile.email, newState);
    if (success) {
        setProfile({ ...profile, isAvailable: newState });
    }
    setToggling(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('studiRad_locum_email');
    navigate('/locum');
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
            <div className="flex gap-2">
                 <button 
                    onClick={() => navigate('/locum/edit')} 
                    className="flex items-center text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </button>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-200 rounded-lg">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mb-6 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${profile.isAvailable ? 'bg-green-100 text-green-600 shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>
                <Power className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2">
                {profile.isAvailable ? 'You are Available' : 'You are Offline'}
            </h2>
            <p className="text-slate-500 mb-8">
                {profile.isAvailable 
                    ? 'Facilities can currently find you in search results.' 
                    : 'Turn on availability to get hired.'}
            </p>

            <button 
                onClick={handleToggle}
                disabled={toggling}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                    profile.isAvailable 
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200' 
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
                }`}
            >
                {toggling ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    profile.isAvailable ? 'Go Offline' : 'Go Online'
                )}
            </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center text-slate-400 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold uppercase">Profile</span>
                </div>
                <p className="font-bold text-slate-900 truncate">{profile.fullName}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {profile.specialties && profile.specialties.slice(0, 2).map(s => (
                        <span key={s} className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md font-medium">{s}</span>
                    ))}
                    {profile.specialties && profile.specialties.length > 2 && (
                        <span className="text-xs text-slate-400">+{profile.specialties.length - 2}</span>
                    )}
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center text-slate-400 mb-2">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold uppercase">Account Status</span>
                </div>
                <p className="font-bold text-green-600">Active</p>
                <p className="text-xs text-slate-400">Standard Locum Account</p>
            </div>
        </div>

        {/* Locations List */}
        <div className="mt-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Coverage Areas
                </h3>
                <div className="space-y-3">
                    {profile.locations.map((loc, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="block font-bold text-slate-800 text-sm">{loc.state}</span>
                            <span className="block text-xs text-slate-500 mt-1">{loc.lgas.join(', ')}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Available Days
                </h3>
                <div className="flex flex-wrap gap-2">
                    {profile.availability && profile.availability.length > 0 ? (
                        profile.availability.map(day => (
                            <span key={day} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold border border-blue-100">
                                {day}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-slate-500 italic">No specific days selected</span>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LocumDashboard;