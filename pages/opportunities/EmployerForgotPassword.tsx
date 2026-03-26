
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { forgotPassword } from '../../services/employerService';
import SEO from '../../components/SEO';

const EmployerForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Failed to send reset email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 flex items-center justify-center">
      <SEO 
        title="Forgot Password"
        description="Reset your employer account password."
      />
      
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-white">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Reset Password</h2>
          <p className="text-slate-500 font-medium">Enter your email to receive a reset link.</p>
        </div>

        {success ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Email Sent!</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              We've sent password reset instructions to <span className="text-slate-900 font-bold">{email}</span>.
            </p>
            <div className="pt-8">
              <Link 
                to="/employer/login" 
                className="inline-flex items-center gap-2 text-brand-primary font-black hover:underline"
              >
                <ArrowLeft size={18} /> Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                 <AlertCircle size={20} /> {error}
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

              <button 
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-dark disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/10"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-slate-50">
              <Link to="/employer/login" className="text-sm text-slate-500 font-medium hover:text-brand-primary flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerForgotPassword;
