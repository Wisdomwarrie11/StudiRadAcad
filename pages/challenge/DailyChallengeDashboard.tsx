
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Play, Trophy, Star, Loader2, AlertCircle, Coins, Plus, Unlock, CalendarClock, ChevronDown, ChevronUp } from 'lucide-react';
import { UserChallengeProfile, ChallengeTopic, ChallengeLevel } from '../../types';
import { getLeaderboard, canPlayDay, getUserProfile, unlockDay, switchLevel } from '../../services/challengeService';
import CoinPurchaseModal from './coinPurchaseModal';

const DailyChallengeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserChallengeProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<UserChallengeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unlocking, setUnlocking] = useState<number | null>(null);
  const [switchingLevel, setSwitchingLevel] = useState<ChallengeLevel | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const fetchProfileData = async () => {
    try {
      const email = sessionStorage.getItem('studiRad_challenge_email');
      if (!email) {
        navigate('/challenge');
        return;
      }
      const [userProfile, leaderboardData] = await Promise.all([
        getUserProfile(email),
        getLeaderboard()
      ]);

      if (!userProfile) {
        setError("User profile not found. Please register again.");
        navigate('/challenge');
        return;
      }

      setProfile(userProfile);
      setLeaderboard(leaderboardData);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
      setError("Failed to load data. Please check connection.");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfileData().finally(() => setLoading(false));
  }, [navigate]);

  const handlePurchaseSuccess = async () => {
    await fetchProfileData();
    alert("Coins added successfully!");
  };

  const handleUnlockDay = async (dayNum: number) => {
    if (!profile) return;
    if (profile.coins < 2) {
      if(window.confirm("Insufficient Grey Coins. You need 2 Coins (₦200) to unlock early. Buy coins now?")) {
        setShowBuyModal(true);
      }
      return;
    }
    
    if (window.confirm(`Unlock Day ${dayNum} early for 2 Grey Coins?`)) {
      setUnlocking(dayNum);
      try {
        const success = await unlockDay(profile.email, dayNum);
        if (success) {
          await fetchProfileData();
        } else {
          alert("Could not unlock.");
        }
      } catch (e) {
        console.error(e);
        alert("Error unlocking day.");
      } finally {
        setUnlocking(null);
      }
    }
  };

  const handleLevelSwitch = async (targetLevel: ChallengeLevel) => {
    if (!profile) return;
    if (profile.level === targetLevel) return;

    const isCompleted = profile.completedLevels?.includes(profile.level);
    const targetIsCompleted = profile.completedLevels?.includes(targetLevel);
    
    if (isCompleted || targetIsCompleted) {
        setSwitchingLevel(targetLevel);
        await switchLevel(profile.email, targetLevel);
        await fetchProfileData();
        setSwitchingLevel(null);
        return;
    }

    if (profile.coins < 1) {
        if(window.confirm("You need 1 Grey Coin to switch levels before completing your current one. Buy coins now?")) {
            setShowBuyModal(true);
        }
        return;
    }

    if (window.confirm(`Switch to ${targetLevel}? \n\nSince you haven't completed your current level, this will cost 1 Grey Coin.`)) {
        setSwitchingLevel(targetLevel);
        try {
            const success = await switchLevel(profile.email, targetLevel);
            if (success) {
                await fetchProfileData();
            } else {
                alert("Insufficient coins.");
            }
        } catch (e) {
            alert("Failed to switch level.");
        } finally {
            setSwitchingLevel(null);
        }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your challenge profile...</p>
      </div>
    );
  }

  if (error || !profile) {
     return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <p className="text-lg text-slate-800 mb-4">{error || "Something went wrong."}</p>
           <button onClick={() => navigate('/challenge')} className="text-amber-600 font-bold hover:underline">Return to Start</button>
         </div>
       </div>
     )
  }

  const days = [
    { num: 1, topic: ChallengeTopic.TECHNIQUE },
    { num: 2, topic: ChallengeTopic.PHYSICS },
    { num: 3, topic: ChallengeTopic.MRI },
    { num: 4, topic: ChallengeTopic.CT },
    { num: 5, topic: ChallengeTopic.USS },
    { num: 6, topic: ChallengeTopic.SAFETY },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Challenge Path */}
          <div className="flex-grow">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, {profile.displayName}</h1>
                  <p className="text-slate-500 mt-2">Goal: <span className="font-semibold text-slate-700">{profile.purpose}</span></p>
                </div>
                
                {/* Wallet UI */}
                <div className="flex items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                  <div className="mr-4">
                    <p className="text-xs text-slate-500 font-bold uppercase">Coins</p>
                    <div className="flex items-center text-slate-900 font-black text-xl">
                      <Coins className="w-5 h-5 text-amber-500 mr-2" />
                      {profile.coins || 0}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBuyModal(true)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Buy Coins
                  </button>
                </div>
              </div>

              {/* Level Switcher */}
              <div className="bg-slate-50 p-2 rounded-xl flex flex-wrap gap-2 mb-6">
                {[ChallengeLevel.BASIC, ChallengeLevel.ADVANCED, ChallengeLevel.MASTER].map((lvl) => {
                    const isActive = profile.level === lvl;
                    const isCompleted = profile.completedLevels?.includes(profile.level); 
                    const thisLevelCompleted = profile.completedLevels?.includes(lvl);
                    const isLocked = !isActive && !isCompleted && !thisLevelCompleted;

                    return (
                        <button
                            key={lvl}
                            onClick={() => handleLevelSwitch(lvl)}
                            disabled={switchingLevel === lvl || isActive}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all
                                ${isActive ? 'bg-white shadow-md text-slate-900 ring-2 ring-slate-100' : 'text-slate-500 hover:bg-slate-100'}
                                ${isLocked ? 'opacity-70' : ''}
                            `}
                        >
                            {switchingLevel === lvl ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    {lvl}
                                    {isLocked && <Lock className="w-3 h-3 ml-2 text-slate-400" />}
                                    {!isLocked && !isActive && <Unlock className="w-3 h-3 ml-2 text-emerald-500" />}
                                </>
                            )}
                        </button>
                    )
                })}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-grow mr-4">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${((profile.currentDay - 1) / 6) * 100}%` }}
                    />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{profile.totalScore} Pts</span>
                </div>
                {/* Mobile/Tablet Leaderboard Toggle */}
                <button 
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 lg:hidden"
                >
                    {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
                    {showLeaderboard ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {days.map((day) => {
                const status = canPlayDay(day.num, profile);
                const score = profile.scores[`day${day.num}`];
                const isPlayed = score !== undefined;
                const isLocked = !status.allowed;

                return (
                  <div 
                    key={day.num}
                    className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300 group flex flex-col justify-between min-h-[220px]
                      ${isPlayed ? 'bg-emerald-50 border-emerald-200' : ''}
                      ${!isPlayed && !isLocked ? 'bg-white border-amber-400 shadow-lg scale-[1.02]' : ''}
                      ${isLocked ? 'bg-slate-100 border-slate-200 opacity-90' : ''}
                    `}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                          ${isPlayed ? 'bg-emerald-200 text-emerald-800' : ''}
                          ${!isPlayed && !isLocked ? 'bg-amber-100 text-amber-800' : ''}
                          ${isLocked ? 'bg-slate-200 text-slate-500' : ''}
                        `}>
                          Day {day.num}
                        </span>
                        {isPlayed && (
                          <div className="flex items-center text-emerald-600 font-bold">
                            <Star className="w-4 h-4 mr-1 fill-emerald-600" /> {score}/30
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2">{day.topic}</h3>
                      <p className="text-sm text-slate-500 mb-6">
                        30 Questions • {profile.level === ChallengeLevel.BASIC ? '30s' : '40s'} per question
                      </p>
                    </div>

                    {isLocked ? (
                      <div>
                        {status.reason && <p className="text-xs text-center text-slate-500 mb-3 font-medium flex items-center justify-center"><CalendarClock className="w-3 h-3 mr-1"/> {status.reason}</p>}
                        
                        {status.canPayToUnlock ? (
                            <button 
                                onClick={() => handleUnlockDay(day.num)}
                                disabled={unlocking === day.num}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center transition-colors"
                            >
                                {unlocking === day.num ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                <>
                                    <Unlock className="w-4 h-4 mr-2" /> Unlock Now (2 Coins)
                                </>
                                )}
                            </button>
                        ) : (
                            <button disabled className="w-full py-3 bg-slate-200 text-slate-400 font-bold rounded-xl flex items-center justify-center cursor-not-allowed">
                                <Lock className="w-5 h-5 mr-2" /> Locked
                            </button>
                        )}
                      </div>
                    ) : isPlayed ? (
                      <button disabled className="w-full py-3 bg-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center justify-center cursor-default">
                        <CheckCircle className="w-5 h-5 mr-2" /> Completed
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/challenge/quiz/${day.num}`)}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center shadow-md transition-colors"
                      >
                        <Play className="w-5 h-5 mr-2" /> Start Challenge
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Sidebar - Toggled on mobile */}
          <div className={`lg:w-80 lg:block ${showLeaderboard ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Trophy className="text-amber-500 w-6 h-6 mr-3" />
                    <h2 className="text-xl font-bold text-slate-900">Leaderboard</h2>
                </div>
                <button onClick={() => setShowLeaderboard(false)} className="lg:hidden text-slate-400">
                    <ChevronUp className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Be the first to join!</p>
                ) : (
                  leaderboard.slice(0, 10).map((user, idx) => (
                    <div key={idx} className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-3 
                        ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                        ${idx === 1 ? 'bg-slate-300 text-slate-800' : ''}
                        ${idx === 2 ? 'bg-amber-700 text-amber-100' : ''}
                        ${idx > 2 ? 'bg-white text-slate-500 border border-slate-200' : ''}
                      `}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user.email === profile.email ? `${user.displayName} (You)` : user.displayName}
                        </p>
                        <p className="text-xs text-slate-500">{user.level ? user.level.split(' ')[0] : 'User'}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-bold text-amber-600">{user.totalScore || 0}</span>
                        <span className="text-[10px] text-slate-400">pts</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {showBuyModal && profile && (
        <CoinPurchaseModal 
            userEmail={profile.email}
            onClose={() => setShowBuyModal(false)}
            onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default DailyChallengeDashboard;
