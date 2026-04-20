
import React, { useState } from 'react';
// Fix: Use type-safe module import workaround for missing useNavigate export
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
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
      const nav = navigate;
      if (savedEmail) {
          nav('/locum/dashboard');
      } else {
          nav('/locum/login');
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
    <div className="min-h-screen bg-slate-200 text-slate-900 pt-24 pb-12 px-4 font-sans relative overflow-hidden">
      {/* Decorative Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        <div className="text-center mb-16">
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 block mb-2">System.Service: Locum_Network</span>
            <h1 className="text-4xl md:text-5xl font-serif italic font-light text-slate-900 tracking-tight leading-none mb-4">
              Locum <span className="font-sans font-black uppercase tracking-tighter text-brand-primary">Finder</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 max-w-2xl mx-auto uppercase tracking-widest">
                Connect with qualified Locum Radiographers near you or register to offer your services.
            </p>
        </div>

        {/* Toggle Switches */}
        <div className="flex justify-center mb-12">
            <div className="bg-slate-50/80 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-slate-300 inline-flex">
                <button 
                    onClick={() => setActiveTab('find')}
                    className={`px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center transition-all ${activeTab === 'find' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
                >
                    <Search className="w-3.5 h-3.5 mr-2" /> Find a Locum
                </button>
                <button 
                    onClick={() => setActiveTab('join')}
                    className={`px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center transition-all ${activeTab === 'join' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
                >
                    <UserPlus className="w-3.5 h-3.5 mr-2" /> Register as a Locum
                </button>
            </div>
        </div>

        {activeTab === 'find' ? (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                {/* Search Box */}
                <div className="bg-slate-50/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-slate-300 mb-10">
                    <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">State_Selection</label>
                            <select 
                                value={searchState}
                                onChange={(e) => { setSearchState(e.target.value); setSearchLga(''); }}
                                className="w-full p-3.5 rounded-lg border border-slate-300 bg-white font-bold text-xs text-slate-700 focus:border-brand-primary focus:outline-none appearance-none cursor-pointer transition-all"
                                required
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">L.G.A_Scope (Optional)</label>
                            <select 
                                value={searchLga}
                                onChange={(e) => setSearchLga(e.target.value)}
                                className="w-full p-3.5 rounded-lg border border-slate-300 bg-white font-bold text-xs text-slate-700 focus:border-brand-primary focus:outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
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
                                className="w-full bg-slate-900 text-white p-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-primary transition-all flex justify-center items-center h-[50px] shadow-xl shadow-slate-900/10 active:scale-95"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Search'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-24">
                        <Loader2 className="w-10 h-10 text-brand-primary animate-spin mx-auto mb-6" />
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em]">Querying_Database...</p>
                    </div>
                ) : hasSearched && results.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-300 shadow-sm">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
                            <AlertCircle className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">No Records Found</h3>
                        <p className="text-slate-500 mt-2 text-sm font-medium">No active locum radiographers found in this location right now.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {results.map((locum) => (
                            <div key={locum.id} className="bg-slate-50/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-300 hover:border-slate-400 transition-all flex flex-col group relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-xl mr-4 uppercase border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                                            {locum.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{locum.fullName}</h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {locum.specialties && locum.specialties.map(s => (
                                                    <span key={s} className="bg-slate-900 text-white text-[8px] px-2 py-0.5 rounded font-mono uppercase tracking-widest">{s}</span>
                                                ))}
                                                {(!locum.specialties || locum.specialties.length === 0) && (
                                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Radiographer</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-emerald-600 text-[9px] font-mono font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div> Available
                                    </span>
                                </div>
                                
                                <div className="space-y-3 mb-8 flex-grow">
                                    <div className="flex items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                                        <MapPin className="w-3.5 h-3.5 mr-3 text-slate-400" />
                                        <span>Loc: <strong className="text-slate-700">{executedSearchState}</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                                        <Filter className="w-3.5 h-3.5 mr-3 text-slate-400" />
                                        <span>Rate: <strong className="text-slate-700">₦{locum.minCharge.toLocaleString()}</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                                        <Briefcase className="w-3.5 h-3.5 mr-3 text-slate-400" />
                                        <span>Min: <strong className="text-slate-700">{locum.maxHours} hrs</strong></span>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                                        <Calendar className="w-3.5 h-3.5 mr-3 text-slate-400" />
                                        <span>Days: <strong className="text-slate-700">{formatAvailability(locum.availability)}</strong></span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
                                    <a href={`tel:${locum.phone}`} className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 py-3 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm">
                                        Call
                                    </a>
                                    <a href={`mailto:${locum.email}`} className="bg-slate-900 hover:bg-brand-primary text-white py-3 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10">
                                        Email
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ) : (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-50/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-slate-300">
                    <div className="bg-slate-900 p-12 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Stethoscope size={120} /></div>
                        <Stethoscope className="w-16 h-16 mx-auto mb-6 text-brand-primary relative z-10" />
                        <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tight relative z-10">Join the Network</h2>
                        <p className="text-slate-400 font-medium uppercase tracking-widest text-xs max-w-md mx-auto relative z-10">Boost your income and flexibility. Register to get hired by facilities near you.</p>
                    </div>
                    <div className="p-10 md:p-16 space-y-12">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="group">
                                <div className="w-14 h-14 bg-white border border-slate-200 text-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <UserPlus size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">1. Register</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed">Create your professional profile and set your rates.</p>
                            </div>
                            <div className="group">
                                <div className="w-14 h-14 bg-white border border-slate-200 text-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">2. Set Scope</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed">Select states and LGAs where you are available to work.</p>
                            </div>
                            <div className="group">
                                <div className="w-14 h-14 bg-white border border-slate-200 text-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <Briefcase size={24} />
                                </div>
                                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">3. Get Hired</h3>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-relaxed">Toggle availability ON and get calls from facilities.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] mb-3">100% Free for Radiographers</h3>
                            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest leading-relaxed">
                                Registration is completely free. We do not charge commissions on your earnings.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => navigate('/locum/register')}
                                className="w-full bg-slate-900 text-white py-5 rounded-lg font-bold text-xs uppercase tracking-[0.3em] hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                            >
                                Register Now (Free)
                            </button>
                            <button 
                                onClick={handleLoginNav}
                                className="w-full bg-white text-slate-500 border border-slate-300 py-4 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
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
