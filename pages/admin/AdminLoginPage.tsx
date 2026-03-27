import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Loader2, Mail } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { adminAuth } from '../../firebase';
import SEO from '../../components/SEO';
import { getFriendlyErrorMessage } from '../../src/lib/errorUtils';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(adminAuth, email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(getFriendlyErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <SEO title="Admin Login" description="Restricted access for platform administrators." />
      
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-brand-primary/20 text-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-primary/30">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Admin Access</h2>
            <p className="text-slate-400 font-medium">Please enter your secure credentials.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email"
                  required
                  placeholder="admin@studirad.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-brand-primary text-white font-bold transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-brand-primary text-white font-bold transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !password || !email}
              className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-dark disabled:opacity-50 transition-all shadow-xl shadow-brand-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><ArrowRight size={18} /> Enter Dashboard</>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">StudiRad Security Protocol v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
