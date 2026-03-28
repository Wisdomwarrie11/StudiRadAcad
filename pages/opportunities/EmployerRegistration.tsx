

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, Phone, Globe, ShieldCheck, Loader2, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, MapPin } from 'lucide-react';
import { registerEmployer } from '../../services/employerService';
import SEO from '../../components/SEO';
import { getFriendlyErrorMessage } from '../../src/lib/errorUtils';

const EmployerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ sent: boolean; error: string | null }>({ sent: true, error: null });

  const [formData, setFormData] = useState({
    fullName: '',
    roleInOrg: '',
    organizationName: '',
    address: '',
    email: '',
    password: '',
    phoneNumber: '',
    website: ''
  });

  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the terms and privacy policy.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { email, password, ...profileData } = formData;
      const result = await registerEmployer(email, password, { ...profileData, email });

      if (result.success) {
        setEmailStatus({ sent: result.emailSent || false, error: getFriendlyErrorMessage(result.emailError) });
        setSuccess(true);
      } else {
        setError(getFriendlyErrorMessage(result.error));
      }
    } catch (err: any) {
      console.error("Registration submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 flex items-center justify-center">
      <SEO 
        title="Hire with StudiRad"
        description="Register your hospital or medical imaging facility to post job openings and internship opportunities."
      />

      {/* Verification Modal */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 text-center space-y-6 animate-in zoom-in-95 duration-300 border border-white">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">
              {emailStatus.sent ? "Verify Your Email" : "Registration Pending"}
            </h2>
            <div className="text-slate-500 font-medium leading-relaxed">
              {emailStatus.sent ? (
                <>
                  Registration pending! We've sent a verification link to <br/>
                  <span className="text-slate-900 font-bold">{formData.email}</span>. 
                </>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl text-sm font-bold">
                  <AlertCircle size={20} className="mx-auto mb-2" />
                  We couldn't send the verification email: <br/>
                  <span className="text-red-600">{emailStatus.error}</span>
                </div>
              )}
              <br/><br/>
              Please verify your email to complete your registration and access the dashboard.
            </div>
            <div className="pt-8 space-y-4">
              <Link 
                to="/employer/login" 
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
              >
                Go to Login <ArrowRight size={18} />
              </Link>
              <button 
                onClick={() => setSuccess(false)}
                className="text-xs text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Brand & Social Proof */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-black uppercase tracking-widest">
                <ShieldCheck size={16} /> Verified Employer Portal
             </div>
             <h1 className="text-5xl font-black text-slate-900 leading-tight">
                Connect with the Next Generation of <span className="text-brand-primary">Radiography Talent.</span>
             </h1>
             <p className="text-xl text-slate-500 font-light leading-relaxed">
                StudiRad is the hub for Nigeria's best radiography students and professionals. Post your openings directly where the talent lives.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-3xl font-black text-brand-primary mb-1">500+</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Radiographers</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-3xl font-black text-brand-primary mb-1">100+</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Internship Seekers</p>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-white">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Create Organization Account</h2>
            <p className="text-slate-500 font-medium">Join our network of elite hiring facilities.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
               <AlertCircle size={20} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
                
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personal Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            type="text" required
                            placeholder="e.g. Dr. Ada Obi"
                            value={formData.fullName}
                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Role</label>
                        <input 
                          type="text" required
                          placeholder="e.g. HR Manager"
                          value={formData.roleInOrg}
                          onChange={e => setFormData({...formData, roleInOrg: e.target.value})}
                          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hospital / Organization Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="text" required
                          placeholder="e.g. Grace Medical Center"
                          value={formData.organizationName}
                          onChange={e => setFormData({...formData, organizationName: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address / Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="text" required
                          placeholder="e.g. 123 Medical Way, Lagos"
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.fullName || !formData.organizationName}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10"
                    >
                      Next Step <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="email" required
                          placeholder="hr@hospital.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            type={showPassword ? "text" : "password"} required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            type="tel" required
                            placeholder="08012345678"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Website (Optional)</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="url"
                          placeholder="https://www.hospital.com"
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                       <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                            className="mt-1 w-5 h-5 accent-brand-primary rounded-lg"
                          />
                          <span className="text-xs text-slate-500 leading-relaxed font-medium">
                            I confirm that I am authorized to post on behalf of <strong>{formData.organizationName || 'this organization'}</strong>. I agree to the <Link to="/terms" className="text-brand-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-primary hover:underline">Privacy Policy</Link>.
                          </span>
                       </label>
                    </div>

                    <div className="flex gap-4">
                       <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors"
                       >
                         Back
                       </button>
                       <button 
                        type="submit"
                        disabled={loading || !formData.email || !formData.password || !agreed}
                        className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-dark disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/10"
                       >
                         {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
                         Register & Log In
                       </button>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-8 text-center pt-8 border-t border-slate-50">
                <p className="text-sm text-slate-500 font-medium">
                  Already have an account? <Link to="/employer/login" className="text-brand-primary font-black hover:underline">Sign In</Link>
                </p>
              </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegistration;
