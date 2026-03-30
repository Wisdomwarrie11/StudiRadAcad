import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { applyActionCode, checkActionCode, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import SEO from '../../components/SEO';
import { getFriendlyErrorMessage } from '../../src/lib/errorUtils';

const EmployerVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'login'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const oobCode = searchParams.get('oobCode');
      const mode = searchParams.get('mode');

      if (!oobCode || mode !== 'verifyEmail') {
        setStatus('error');
        setMessage('Invalid or missing verification link.');
        return;
      }

      try {
        // Get the email associated with this code
        const info = await checkActionCode(auth, oobCode);
        setEmail(info.data.email || '');

        // Apply the verification code
        await applyActionCode(auth, oobCode);

        setStatus('login');
        setMessage('Email verified! Please enter your password to complete login.');

      } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/expired-action-code') {
          setStatus('error');
          setMessage('Verification link expired. Request a new email.');
        } else if (err.code === 'auth/invalid-action-code') {
          setStatus('success');
          setMessage('Your email is already verified. You can log in.');
          setTimeout(() => navigate('/employer/login'), 1500);
        } else {
          setStatus('error');
          setMessage(getFriendlyErrorMessage(err) || 'Unexpected error occurred.');
        }
      }
    };

    verify();
  }, [searchParams, navigate]);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoginLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Update Firestore verified field
      await updateDoc(doc(db, 'employer_profiles', userCredential.user.uid), { verified: true });
      setStatus('success');
      setMessage('Logged in successfully! Redirecting...');
      setTimeout(() => navigate('/employer/dashboard'), 1500);
    } catch (err: any) {
      console.error(err);
      setMessage(getFriendlyErrorMessage(err) || 'Failed to log in.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
      <SEO title="Verify Email" description="Verify your employer account email address." />
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-white relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 flex items-center justify-center">
          {status === 'success' && (
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
              <CheckCircle size={48} />
            </div>
          )}
          {status === 'loading' && (
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          )}
          {status === 'error' && (
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
              <XCircle size={48} />
            </div>
          )}
          {status === 'login' && (
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
              <ShieldCheck size={48} />
            </div>
          )}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {status === 'login' ? 'Email Verified!' : status === 'success' ? 'Success' : status === 'error' ? 'Failed' : 'Verifying Email'}
          </h2>
          <p className="text-slate-500 font-medium mb-6">{message}</p>

          {status === 'login' && (
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-brand-primary font-bold text-sm"
              />
              <button
                onClick={handleLogin}
                disabled={loginLoading || !password}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
              >
                {loginLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
              </button>
            </div>
          )}

          {status === 'error' && (
            <Link
              to="/employer/login"
              className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-dark/10"
            >
              Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerVerify;