
import React, { useState } from 'react';
import { X, User, GraduationCap, Info, MessageCircle, CheckCircle, Loader2, ShieldAlert, ChevronDown } from 'lucide-react';
import { registerForOrientation } from '../../services/orientationService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/HF91dAcaHRO3EZu43xJyCR"; // Replace with your actual link

const OrientationRegistrationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'Undergraduate',
    heardFrom: '',
    isUnder18: false,
    hasParentalPermission: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heardFrom) {
      alert("Please select where you heard about us.");
      return;
    }
    setLoading(true);
    
    const success = await registerForOrientation({
      ...formData,
      timestamp: new Date().toISOString()
    });

    if (success) {
      setStep('success');
    } else {
      alert("Registration failed. Please check your connection.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md">
      {/* Backdrop click-to-close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header - Fixed at Top */}
        <div className="bg-brand-dark p-8 md:p-10 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all z-20 group"
            title="Close"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-brand-dark">
                <GraduationCap size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">2026 Orientation</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight">Welcome to Radiography</h2>
          <p className="text-blue-200 text-sm mt-1 font-medium">Join our community for new students.</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-grow">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-brand-primary outline-none font-bold text-slate-700 transition-all bg-slate-50/50"
                      placeholder="e.g. Ebuka Okafor"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Current Status</label>
                <div className="relative">
                    <select 
                      required
                      className="w-full p-4 pr-10 rounded-2xl border-2 border-slate-100 focus:border-brand-primary outline-none font-bold text-slate-700 bg-white transition-all appearance-none cursor-pointer"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Secondary school student">Secondary school student</option>
                      <option value="After-school student">After-school student (Pre-degree)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                    </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Where did you hear about this?</label>
                <div className="relative">
                    <select 
                      required
                      className="w-full p-4 pr-10 rounded-2xl border-2 border-slate-100 focus:border-brand-primary outline-none font-bold text-slate-700 bg-white transition-all appearance-none cursor-pointer"
                      value={formData.heardFrom}
                      onChange={e => setFormData({...formData, heardFrom: e.target.value})}
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="WhatsApp Group">WhatsApp Group</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Friend/Colleague">Friend/Colleague</option>
                      <option value="School Bulletin">School Bulletin</option>
                      <option value="StudiRad Website">StudiRad Website</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                    </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-brand-primary rounded-lg cursor-pointer"
                        checked={formData.isUnder18}
                        onChange={e => setFormData({...formData, isUnder18: e.target.checked})}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">I am below 18 years old</span>
                </label>

                {formData.isUnder18 && (
                   <label className="flex items-start gap-3 cursor-pointer group animate-in slide-in-from-top-2 select-none">
                    <input 
                        type="checkbox" required
                        className="mt-1 w-5 h-5 accent-emerald-500 rounded-lg cursor-pointer"
                        checked={formData.hasParentalPermission}
                        onChange={e => setFormData({...formData, hasParentalPermission: e.target.checked})}
                    />
                    <div className="text-xs font-medium text-slate-500 leading-relaxed">
                        <div className="flex items-center gap-1 text-emerald-600 font-black uppercase tracking-widest text-[9px] mb-1">
                            <ShieldAlert size={12} /> Mandatory Consent
                        </div>
                        I confirm that I have <strong>parental permission</strong> to attend this online virtual orientation event.
                    </div>
                  </label>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading || (formData.isUnder18 && !formData.hasParentalPermission)}
                className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-dark disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/20 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle size={48} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">Registration Success!</h3>
                <p className="text-slate-500 font-medium mt-3 px-4 leading-relaxed">
                    Great! You're now on our list. Please join the orientation group below to receive the meeting link.
                </p>
              </div>

              <div className="space-y-4">
                <a 
                    href={WHATSAPP_GROUP_LINK}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                    <MessageCircle size={24} /> Join Orientation Group
                </a>

                <button 
                    onClick={onClose}
                    className="text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-600 transition-colors py-2"
                >
                    Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrientationRegistrationModal;
