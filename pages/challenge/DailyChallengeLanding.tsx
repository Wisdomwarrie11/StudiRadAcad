import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ClipboardCheck, Activity, BookOpen, Loader2, Info, X } from 'lucide-react';
import { ChallengeLevel, ChallengePurpose } from '../../types';
import { registerUserForChallenge, checkUserExists } from '../../services/challengeService';

const DailyChallengeLanding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    level: ChallengeLevel | null;
    purpose: ChallengePurpose | null;
    referralCode: string;
  }>({
    name: '',
    email: '',
    level: null,
    purpose: null,
    referralCode: ''
  });

  // NEW: Check login on mount
  useEffect(() => {
    const user = sessionStorage.getItem("studiRad_challenge_email") || localStorage.getItem("studiRad_challenge_email");
    if (user) {
      navigate('/challenge/dashboard');
    }
  }, [navigate]);

  const handleNextStep1 = async () => {
    if (!formData.name || !formData.email) return;
    setLoading(true);
    setError('');

    try {
      const exists = await checkUserExists(formData.email);
      if (exists) {
        // User exists, log them in directly
        sessionStorage.setItem('studiRad_challenge_email', formData.email);
        localStorage.setItem('studiRad_challenge_email', formData.email);
        // Ensure flag is set for existing users too
        localStorage.setItem('studiRad_has_registered', 'true');
        navigate('/challenge/dashboard');
      } else {
        // New user, proceed to level selection
        setStep(2);
      }
    } catch (e) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!formData.name || !formData.email || !formData.level || !formData.purpose) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError('');

    // Check if this browser has already created an account to prevent referral abuse
    const deviceHasRegistered = localStorage.getItem('studiRad_has_registered');
    
    // Only pass referral code if device hasn't registered before (or if it's the first time on this browser)
    // Note: If users clear cache, they can bypass this, but it adds a layer of friction.
    const referralCodeToUse = deviceHasRegistered ? undefined : formData.referralCode;

    if (deviceHasRegistered && formData.referralCode) {
        console.warn("Referral code ignored: Device already registered an account.");
    }

    try {
      console.log("Attempting to register user:", formData.email);
      await registerUserForChallenge(
        formData.email,
        formData.name,
        formData.level,
        formData.purpose,
        referralCodeToUse
      );
      
      // Store email in session storage and local storage to maintain "login" state
      sessionStorage.setItem('studiRad_challenge_email', formData.email);
      localStorage.setItem('studiRad_challenge_email', formData.email);
      
      // Mark device as having registered an account
      localStorage.setItem('studiRad_has_registered', 'true');
      
      navigate('/challenge/dashboard');
    } catch (err: any) {
      console.error("Registration Error:", err);
      let msg = "Failed to register.";
      if (err?.code === 'permission-denied') {
        msg = "Access denied. Please check your Firestore Database Rules in Firebase Console.";
      } else if (err?.message) {
        msg = `Error: ${err.message}`;
      } else {
         msg = "Failed to connect to database. Check internet connection.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const LevelCard = ({ level, desc, selected }: { level: ChallengeLevel; desc: string; selected: boolean }) => (
    <div 
      onClick={() => setFormData({ ...formData, level })}
      className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between h-full ${selected ? 'border-amber-500 bg-amber-50 shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-amber-300 bg-white hover:shadow-md'}`}
    >
      <div>
        <h3 className={`font-bold text-lg mb-2 ${selected ? 'text-amber-900' : 'text-slate-800'}`}>{level}</h3>
        <p className={`text-sm ${selected ? 'text-amber-800' : 'text-slate-500'}`}>{desc}</p>
      </div>
      {selected && (
        <div className="mt-4 flex justify-end">
          <div className="w-4 h-4 bg-amber-500 rounded-full" />
        </div>
      )}
    </div>
  );

  const PurposeCard = ({ purpose, icon: Icon, selected }: { purpose: ChallengePurpose; icon: any; selected: boolean }) => (
    <div 
      onClick={() => setFormData({ ...formData, purpose })}
      className={`cursor-pointer p-6 rounded-xl border-2 flex flex-col items-center text-center transition-all duration-300 ${selected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
    >
      <Icon className={`w-8 h-8 mb-3 ${selected ? 'text-blue-600' : 'text-slate-400'}`} />
      <h3 className="font-bold text-slate-800">{purpose}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Daily Radiography Challenge</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-6">
            6 Days. 6 Topics. One Goal. Master your craft with our intensive, level-based daily quizzes.
          </p>
          <button 
            onClick={() => setShowRules(true)}
            className="inline-flex items-center text-slate-500 hover:text-amber-600 font-semibold transition-colors"
          >
            <Info className="w-4 h-4 mr-2" /> Rules & Disclaimer
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-4">
            <div className="flex justify-center items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-amber-400' : 'bg-slate-700'}`} />
              <div className={`w-16 h-1 bg-slate-700 ${step >= 2 ? 'bg-amber-400' : ''}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-amber-400' : 'bg-slate-700'}`} />
              <div className={`w-16 h-1 bg-slate-700 ${step >= 3 ? 'bg-amber-400' : ''}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-amber-400' : 'bg-slate-700'}`} />
            </div>
          </div>

          <div className="p-8 md:p-12 min-h-[400px]">
            {step === 1 && (
              <div className="space-y-6 fade-in">
                <h2 className="text-2xl font-bold text-slate-800 text-center">Let's get you registered</h2>
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. RadTech Sarah"
                      className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-lg"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-lg"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 mt-2">Used to track your progress and leaderboard status. Returning users will be logged in automatically.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Referral Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter code (if you have one)"
                      className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-lg uppercase"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-slate-500 mt-2">If a friend referred you, enter their code here.</p>
                  </div>
                  
                  {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}

                  <button 
                    disabled={!formData.name || !formData.email || loading}
                    onClick={handleNextStep1}
                    className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-slate-800 transition-colors flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Next Step"}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 fade-in">
                <h2 className="text-2xl font-bold text-slate-800 text-center">Select your experience level</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <LevelCard 
                    level={ChallengeLevel.BASIC} 
                    desc="For students just starting their journey."
                    selected={formData.level === ChallengeLevel.BASIC}
                  />
                  <LevelCard 
                    level={ChallengeLevel.ADVANCED} 
                    desc="For interns, residents, and practicing radiographers."
                    selected={formData.level === ChallengeLevel.ADVANCED}
                  />
                  <LevelCard 
                    level={ChallengeLevel.MASTER} 
                    desc="For specialists looking for deep technical questions."
                    selected={formData.level === ChallengeLevel.MASTER}
                  />
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(1)} className="text-slate-500 font-semibold px-4">Back</button>
                  <button 
                    disabled={!formData.level}
                    onClick={() => setStep(3)}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 fade-in">
                <h2 className="text-2xl font-bold text-slate-800 text-center">What is your primary goal?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <PurposeCard 
                    purpose={ChallengePurpose.READING} 
                    icon={BookOpen}
                    selected={formData.purpose === ChallengePurpose.READING}
                  />
                  <PurposeCard 
                    purpose={ChallengePurpose.EXAMS} 
                    icon={ClipboardCheck}
                    selected={formData.purpose === ChallengePurpose.EXAMS}
                  />
                  <PurposeCard 
                    purpose={ChallengePurpose.FUN} 
                    icon={Activity}
                    selected={formData.purpose === ChallengePurpose.FUN}
                  />
                  <PurposeCard 
                    purpose={ChallengePurpose.GROWTH} 
                    icon={GraduationCap}
                    selected={formData.purpose === ChallengePurpose.GROWTH}
                  />
                </div>
                
                {error && <div className="p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-center font-bold mt-4 animate-pulse">{error}</div>}

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(2)} className="text-slate-500 font-semibold px-4">Back</button>
                  <button 
                    disabled={!formData.purpose || loading}
                    onClick={handleStart}
                    className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-amber-600 transition-colors flex items-center justify-center min-w-[180px]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Challenge'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">Rules & Disclaimer</h3>
              <button onClick={() => setShowRules(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 mb-2">How it Works</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The challenge consists of 6 Days, each covering a different topic.</li>
                  <li>Questions are timed (30s for Basic, 40s for Advanced/Master).</li>
                  <li>You must complete the current day to unlock the next one naturally (tomorrow).</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Coins & Economy</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Wait for Tomorrow:</strong> The next day unlocks for free at midnight.</li>
                  <li><strong>Unlock Early:</strong> Pay 2 Coins (₦200) to unlock the next day immediately.</li>
                  <li><strong>Switch Level:</strong> Pay 1 Coin (₦100) to switch difficulty levels before completing your current one.</li>
                  <li><strong>Purchase Coins:</strong> 1 Coin = ₦100.</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm">
                <h4 className="font-bold text-amber-800 mb-1">Disclaimer</h4>
                <p>
                  This platform is for educational and study purposes only. Content is not intended as medical advice or definitive clinical guidance. While we strive for accuracy, users should verify information with standard medical texts and institutional protocols.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={() => setShowRules(false)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyChallengeLanding;