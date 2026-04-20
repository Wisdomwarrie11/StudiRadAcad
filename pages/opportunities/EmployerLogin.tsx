
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { loginEmployer, resendVerificationEmail } from '../../services/employerService';
import SEO from '../../components/SEO';
import { getFriendlyErrorMessage } from '../../src/lib/errorUtils';

const EmployerLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [justVerified, setJustVerified] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setJustVerified(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResendStatus('');

    const result = await loginEmployer(email, password);

    if (result.success) {
      if (!result.emailVerified) {
        setError("Your email is not verified. Please check your inbox for the verification link.");
        setLoading(false);
        return;
      }
      navigate('/employer/dashboard');
    } else {
      setError(getFriendlyErrorMessage(result.error));
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    setResending(true);
    setResendStatus('');
    try {
      const result = await resendVerificationEmail();
      if (result.success) {
        setResendStatus("A fresh verification link has been sent to your email.");
      } else {
        setError(result.error || "Failed to send link.");
      }
    } catch (err) {
      setError("Failed to resend link.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 flex items-center justify-center">
      <SEO title="Employer Login" description="Sign in to your organization account to manage your job postings." />
      
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-white">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Employer Sign In</h2>
                <p className="text-slate-500 font-medium">Manage your facility's opportunities.</p>
              </div>

              {justVerified && !resendStatus && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                   <div className="p-1 bg-emerald-100 rounded-lg"><CheckCircle size={14} /></div>
                   Email verified successfully! You can now sign in.
                </div>
              )}

              {resendStatus && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                   <div className="p-1 bg-emerald-100 rounded-lg"><CheckCircle size={14} /></div>
                   {resendStatus}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex flex-col gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-center gap-3">
                     <AlertCircle size={20} /> {error}
                   </div>
                   {error.includes("not verified") && (
                     <button 
                       type="button"
                       onClick={handleResendLink}
                       disabled={resending}
                       className="self-start text-[10px] uppercase tracking-widest text-brand-primary hover:underline underline-offset-4 disabled:opacity-50"
                     >
                       {resending ? "Sending..." : "Resend Verification Link"}
                     </button>
                   )}
                </div>
              )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email" required
                        placeholder="hr@hospital.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                      <Link to="/employer/forgot-password" className="text-[10px] font-black text-brand-primary hover:underline uppercase tracking-widest">Forgot?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="password" required
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-dark disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/10"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><ArrowRight size={18} /> Sign In</>}
                  </button>
                </form>

              <div className="mt-8 text-center pt-8 border-t border-slate-50">
                <p className="text-sm text-slate-500 font-medium">
                  Don't have an account? <Link to="/employer/register" className="text-brand-primary font-black hover:underline">Register Hospital</Link>
                </p>
              </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
