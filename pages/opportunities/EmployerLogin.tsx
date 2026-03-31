
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { loginEmployer, resendVerificationEmail } from '../../services/employerService';
import SEO from '../../components/SEO';
import { getFriendlyErrorMessage } from '../../src/lib/errorUtils';

const EmployerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  
  const location = React.useMemo(() => window.location, []);
  const [successMessage, setSuccessMessage] = useState(() => {
    // We can't use useLocation easily if we want to avoid re-renders or if we're not using HashRouter correctly
    // But we can check history state if available
    if (window.history.state?.usr?.verified) {
      return "Email verified successfully! You can now sign in.";
    }
    if (window.history.state?.usr?.registered) {
      return "Registration successful! Please check your email (and spam folder) to verify your account before signing in.";
    }
    if (window.history.state?.usr?.info) {
      return window.history.state.usr.info;
    }
    return "";
  });

  const [infoMessage, setInfoMessage] = useState(() => {
    if (window.history.state?.usr?.info) {
      return window.history.state.usr.info;
    }
    return "";
  });

  const handleResend = async () => {
    setResending(true);
    setResendStatus('');
    const result = await resendVerificationEmail();
    if (result.success) {
      setResendStatus('Verification email sent! Please check your inbox and spam folder.');
    } else {
      setResendStatus(getFriendlyErrorMessage(result.error));
    }
    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowResend(false);
    setResendStatus('');

    const result = await loginEmployer(email, password);

    if (result.success) {
      const res = result as any;
      const profile = res.profile;
      if (res.emailVerified || profile.isPreExisting) {
        navigate('/employer/dashboard');
      } else {
        setError("Please verify your email address before logging in. Check your inbox and spam folder for the verification link.");
        setShowResend(true);
        setLoading(false);
      }
    } else {
      setError(getFriendlyErrorMessage(result.error));
      setLoading(false);
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

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
               <CheckCircle size={20} /> {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex flex-col gap-3 text-sm font-bold">
               <div className="flex items-center gap-3">
                 <AlertCircle size={20} /> {error}
               </div>
               {showResend && (
                 <button 
                  onClick={handleResend}
                  disabled={resending}
                  className="text-xs text-brand-primary hover:underline uppercase tracking-widest text-left mt-1 disabled:opacity-50"
                 >
                   {resending ? 'Sending...' : 'Resend Verification Link'}
                 </button>
               )}
               {resendStatus && (
                 <p className="text-[10px] text-green-600 uppercase tracking-widest mt-1">{resendStatus}</p>
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
                {/* Fixed: Removed invalid 'size' prop from Link component */}
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
