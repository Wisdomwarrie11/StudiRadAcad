import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { getLocumProfile } from '../../services/locumService';

const LocumLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already logged in, redirect to dashboard immediately
    const savedEmail = localStorage.getItem('studiRad_locum_email');
    if (savedEmail) {
        navigate('/locum/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');

    try {
        const formattedEmail = email.toLowerCase().trim();
        const profile = await getLocumProfile(formattedEmail);
        
        if (profile) {
            localStorage.setItem('studiRad_locum_email', profile.email);
            navigate('/locum/dashboard');
        } else {
            setError("Account not found. Please check your email or register.");
        }
    } catch (err) {
        console.error(err);
        setError("An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-8 text-white text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold">Locum Login</h2>
            <p className="text-slate-400 mt-2">Access your dashboard to manage your availability and profile.</p>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        required
                        className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 outline-none transition-colors text-lg"
                        placeholder="e.g. yourname@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Login to Dashboard'}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <button 
                    onClick={() => navigate('/locum')}
                    className="text-slate-500 font-bold hover:text-slate-800 flex items-center justify-center mx-auto transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Locum Home
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LocumLogin;