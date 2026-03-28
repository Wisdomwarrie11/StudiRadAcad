
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { applyActionCode } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../../components/SEO';
import { getFriendlyErrorMessage } from '../../src/lib/errorUtils';

const EmployerVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  const verifiedRef = React.useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (verifiedRef.current) return;
      
      const oobCode = searchParams.get('oobCode');
      const mode = searchParams.get('mode');

      // If no mode/oobCode, we might be coming from a simple "Check Status" link
      if (!oobCode || mode !== 'verifyEmail') {
        // Check if user is already logged in and verified
        if (auth.currentUser) {
          if (auth.currentUser.emailVerified) {
            try {
              await updateDoc(doc(db, 'employer_profiles', auth.currentUser.uid), {
                verified: true
              });
              verifiedRef.current = true;
              navigate('/employer/login');
            } catch (e) {
              verifiedRef.current = true;
              navigate('/employer/login');
            }
          } else {
            setStatus('error');
            setMessage('Please click the link in your email to verify your account.');
          }
        } else {
          setStatus('error');
          setMessage('Invalid or missing verification code. Please use the link sent to your email.');
        }
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        verifiedRef.current = true;
        
        // If user is logged in, we can update their profile in Firestore too
        if (auth.currentUser) {
          await updateDoc(doc(db, 'employer_profiles', auth.currentUser.uid), {
            verified: true
          });
        }
        
        // Navigate immediately as requested by user
        navigate('/employer/login');
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus('error');
        if (error.code === 'auth/invalid-action-code') {
          // Check if user is already verified (maybe they clicked the link twice)
          if (auth.currentUser?.emailVerified) {
            navigate('/employer/login');
            return;
          }
          setMessage('The verification link is invalid or has already been used.');
        } else if (error.code === 'auth/expired-action-code') {
          setMessage('The verification link has expired. Please request a new one.');
        } else {
          setMessage(getFriendlyErrorMessage(error));
        }
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24">
      <SEO title="Verify Email" description="Verify your employer account email address." />
      
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-white">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={32} />
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Verifying Email</h2>
            <p className="text-slate-500 font-medium">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
              <XCircle size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Verification Failed</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">{message}</p>
            
            <div className="flex flex-col gap-4 w-full">
              <Link
                to="/employer/login"
                className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-brand-dark/10"
              >
                Back to Login
              </Link>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Need help? Contact support@studirad.com
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerVerify;
