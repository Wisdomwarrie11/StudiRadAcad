import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, UserPlus, Stethoscope, Briefcase, Filter, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { NIGERIA_STATES_LGAS } from '../../data/nigerianData';
import { searchLocums } from '../../services/locumService';
import { LocumProfile } from '../../types';

const LocumPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'find' | 'join'>('find');
  const [searchState, setSearchState] = useState('');
  const [searchLga, setSearchLga] = useState('');
  const [results, setResults] = useState<LocumProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // State for storing the criteria used for the currently displayed results
  // This prevents the UI from updating the "Available in:" text as the user changes inputs
  const [executedSearchState, setExecutedSearchState] = useState('');
  const [executedSearchLga, setExecutedSearchLga] = useState('');

  // States list
  const states = Object.keys(NIGERIA_STATES_LGAS).sort();
  // LGAs based on selected state
  const lgas = searchState ? NIGERIA_STATES_LGAS[searchState] : [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchState) return;

    setLoading(true);
    setResults([]);
    
    // Snapshot the search terms
    setExecutedSearchState(searchState);
    setExecutedSearchLga(searchLga);

    try {
        const data = await searchLocums(searchState, searchLga);
        setResults(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
        setHasSearched(true);
    }
  };

  const handleLoginNav = () => {
      const savedEmail = localStorage.getItem('studiRad_locum_email');
      if (savedEmail) {
          navigate('/locum/dashboard');
      } else {
          navigate('/locum/login');
      }
  };

  const formatAvailability = (days?: string[]) => {
      if (!days || days.length === 0) return 'Contact for schedule';
      if (days.length === 7) return 'Everyday';
      if (days.length === 5 && days.includes('Monday') && days.includes('Friday')) return 'Weekdays';
      if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) return 'Weekends';
      return days.map(d => d.slice(0, 3)).join(', ');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Locum Finder</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Connect with qualified Locum Radiographers near you or register to offer your services.
            </p>
        </div>

        {/* Toggle Switches */}
        <div className="flex justify-center mb-10">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
                <button 
                    onClick={() => setActiveTab('find')}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center transition-all ${activeTab === 'find' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Search className="w-4 h-4 mr-2" /> Find a Locum
                </button>
                <button 
                    onClick={() => setActiveTab('join')}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center transition-all ${activeTab === 'join' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <UserPlus className="w-4 h-4 mr-2" /> Register as a Locum
                </button>
            </div>
        </div>

        {activeTab === 'find' ? (
            <div className="max-w-4xl mx-auto">
                {/* Search Box */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-8">
                    <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                            <select 
                                value={searchState}
                                onChange={(e) => { setSearchState(e.target.value); setSearchLga(''); }}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                                required
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">L.G.A (Optional)</label>
                            <select 
                                value={searchLga}
                                onChange={(e) => setSearchLga(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                                disabled={!searchState}
                            >
                                <option value="">All LGAs</option>
                                {lgas.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex justify-center items-center h-[50px]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search Locums'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500">Searching specifically for available radiographers...</p>
                    </div>
                ) : hasSearched && results.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No Locums Found</h3>
                        <p className="text-slate-500">No active locum radiographers found in this location right now.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {results.map((locum) => (
                            <div key={locum.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-300 transition-all flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xl mr-4 uppercase">
                                            {locum.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{locum.fullName}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {locum.specialties && locum.specialties.map(s => (
                                                    <span key={s} className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-md font-bold">{s}</span>
                                                ))}
                                                {(!locum.specialties || locum.specialties.length === 0) && (
                                                    <span className="text-xs text-slate-400">Radiographer</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> Available
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-6 flex-grow">
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                        <span>Available in: <strong>{executedSearchState}</strong> ({executedSearchLga || 'Various Areas'})</span>
                                    </div>
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                        <span>Min Charge: <strong>₦{locum.minCharge.toLocaleString()}</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                                        <span>Max Hours: <strong>{locum.maxHours} hrs</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-600 text-sm">
                                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                        <span>Days: <strong>{formatAvailability(locum.availability)}</strong></span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                                    <a href={`tel:${locum.phone}`} className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg text-center text-sm font-bold transition-colors">
                                        Call
                                    </a>
                                    <a href={`mailto:${locum.email}`} className="bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-center text-sm font-bold transition-colors">
                                        Email
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ) : (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                    <div className="bg-slate-900 p-8 text-white text-center">
                        <Stethoscope className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                        <h2 className="text-3xl font-bold mb-2">Join as a Locum Radiographer</h2>
                        <p className="text-slate-300">Boost your income and flexibility. Register to get hired by facilities near you.</p>
                    </div>
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <UserPlus />
                                </div>
                                <h3 className="font-bold text-slate-900">1. Register Free</h3>
                                <p className="text-sm text-slate-500">Create your professional profile and set your rates.</p>
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <MapPin />
                                </div>
                                <h3 className="font-bold text-slate-900">2. Set Locations</h3>
                                <p className="text-sm text-slate-500">Select states and LGAs where you are available to work.</p>
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Briefcase />
                                </div>
                                <h3 className="font-bold text-slate-900">3. Get Hired</h3>
                                <p className="text-sm text-slate-500">Toggle availability ON and get calls from facilities.</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                            <h3 className="font-bold text-green-800 mb-2">100% Free for Radiographers</h3>
                            <p className="text-green-700 text-sm">
                                Registration is completely free. We do not charge commissions on your earnings.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => navigate('/locum/register')}
                                className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
                            >
                                Register Now (Free)
                            </button>
                            <button 
                                onClick={handleLoginNav}
                                className="w-full bg-white text-slate-600 border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                            >
                                Already registered? Login to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LocumPage;