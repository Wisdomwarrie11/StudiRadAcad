import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Play, Trophy, Star, Loader2, AlertCircle, Coins, Plus, Unlock, CalendarClock, ChevronDown, ChevronUp, X, Clock, Share2 } from 'lucide-react';
import { UserChallengeProfile, ChallengeTopic, ChallengeLevel, AlertConfig } from '../../types';
import { getLeaderboard, canPlayDay, getUserProfile, unlockDay, switchLevel, rewardShare } from '../../services/challengeService';
import CoinPurchaseModal from './CoinPurchaseModal';
import CustomAlert from '../../components/ui/CustomAlert';

const safeParseDate = (dateInput: any): Date | null => {
  if (!dateInput) return null;
  if (typeof dateInput.toDate === 'function') {
    return dateInput.toDate();
  }
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? null : d;
};

const UnlockTimer = ({ targetDate, onComplete }: { targetDate: Date, onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<string>("Loading...");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        onComplete();
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            calculateTime();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [targetDate, onComplete]);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-center animate-pulse">
      <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">Next Challenge Unlocks In</p>
      <div className="text-xl font-mono font-black text-amber-600 flex justify-center items-center">
        <Clock className="w-5 h-5 mr-2" />
        {timeLeft}
      </div>
    </div>
  );
};

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

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    singleButton: true
  });

  const showAlert = (config: Partial<AlertConfig>) => {
    setAlertConfig({
        isOpen: true,
        title: config.title || 'Notification',
        message: config.message || '',
        type: config.type || 'info',
        singleButton: config.singleButton ?? true,
        confirmText: config.confirmText || 'OK',
        cancelText: config.cancelText || 'Cancel',
        onConfirm: config.onConfirm,
        onCancel: config.onCancel
    });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const fetchProfileData = async () => {
    try {
      let email = sessionStorage.getItem('studiRad_challenge_email') || localStorage.getItem('studiRad_challenge_email');
      
      if (!email) {
        navigate('/challenge');
        return;
      }
      
      const userProfile = await getUserProfile(email);
      if (!userProfile) {
        setError("User profile not found. Please register again.");
        navigate('/challenge');
        return;
      }

      setProfile(userProfile);

      // Fetch leaderboard filtered by user level
      const leaderboardData = await getLeaderboard(userProfile.level);
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
    showAlert({
      title: 'Coins Added',
      message: 'Your Grey Coins have been added to your wallet successfully.',
      type: 'success'
    });
  };

  const processShareReward = async () => {
    if (!profile) return;
    try {
        const result = await rewardShare(profile.email);
        if (result.success) {
            await fetchProfileData();
            showAlert({ 
                title: 'Reward Earned!', 
                message: result.message, 
                type: 'success' 
            });
        }
        // Silent else: user already rewarded today
    } catch (e) {
        console.error("Error rewarding share:", e);
    }
  };

  const handleShare = async () => {
    if (!profile) return;

    // Construct a direct link to the challenge
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/#/challenge`;
    
    // Updated share message with "Nice!"
    const shareMessage = `StudiRad is Nice! 🚀\n\nI'm playing the Daily Radiography Challenge. Test your knowledge in Physics, MRI, CT, and more.\n\nUse my code *${profile.referralCode || 'RAD'}* to join!`;
    const fullShareText = `${shareMessage}\n${shareUrl}`;

    const shareData = {
      title: 'StudiRad Daily Challenge',
      text: shareMessage,
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        // Reward user after successful share interaction
        await processShareReward();
      } catch (err) {
        console.debug('Share cancelled or failed', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(fullShareText);
        const result = await rewardShare(profile.email);
        
        if (result.success) {
             await fetchProfileData();
             showAlert({
                title: 'Link Copied & Rewarded!',
                message: 'Share link copied to clipboard. ' + result.message,
                type: 'success',
                singleButton: true
            });
        } else {
             showAlert({
                title: 'Link Copied!',
                message: 'Share link copied to clipboard. Share it with friends to earn referral bonuses later!',
                type: 'success',
                singleButton: true
            });
        }
      } catch (e) {
        showAlert({ title: 'Error', message: 'Could not copy link automatically.', type: 'error' });
      }
    }
  };

  const handleUnlockDay = async (dayNum: number) => {
    if (!profile) return;
    
    const performUnlock = async () => {
        setUnlocking(dayNum);
        try {
            const success = await unlockDay(profile.email, dayNum);
            if (success) {
                await fetchProfileData();
            } else {
                showAlert({ title: "Unlock Failed", message: "Could not unlock day. Please try again.", type: 'error' });
            }
        } catch (e) {
            console.error(e);
            showAlert({ title: "Error", message: "An error occurred while unlocking.", type: 'error' });
        } finally {
            setUnlocking(null);
        }
    };

    if (profile.coins < 2) {
      showAlert({
        title: 'Insufficient Coins',
        message: 'You need 2 Coins (₦200) to unlock this day early.',
        type: 'warning',
        confirmText: 'Buy Coins',
        cancelText: 'Cancel',
        singleButton: false,
        onConfirm: () => setShowBuyModal(true)
      });
      return;
    }
    
    showAlert({
        title: 'Unlock Day?',
        message: `Unlock Day ${dayNum} early for 2 Grey Coins?`,
        type: 'info',
        confirmText: 'Yes, Unlock',
        cancelText: 'No, Wait',
        singleButton: false,
        onConfirm: performUnlock
    });
  };

  const handleLevelSwitch = async (targetLevel: ChallengeLevel) => {
    if (!profile) return;
    if (profile.level === targetLevel) return;

    const isCompleted = profile.completedLevels?.includes(profile.level);
    const targetIsCompleted = profile.completedLevels?.includes(targetLevel);
    
    const performSwitch = async () => {
        setSwitchingLevel(targetLevel);
        try {
            const success = await switchLevel(profile.email, targetLevel);
            if (success) {
                await fetchProfileData();
            } else {
                showAlert({ title: "Error", message: "Insufficient coins or connection error.", type: 'error' });
            }
        } catch (e) {
            showAlert({ title: "Error", message: "Failed to switch level.", type: 'error' });
        } finally {
            setSwitchingLevel(null);
        }
    };

    if (isCompleted || targetIsCompleted) {
        setSwitchingLevel(targetLevel);
        await switchLevel(profile.email, targetLevel);
        await fetchProfileData();
        setSwitchingLevel(null);
        return;
    }

    if (profile.coins < 3) {
        showAlert({
            title: 'Insufficient Coins',
            message: 'You need 3 Grey Coins to switch levels before completing your current one.',
            type: 'warning',
            confirmText: 'Buy Coins',
            singleButton: false,
            onConfirm: () => setShowBuyModal(true)
        });
        return;
    }

    showAlert({
        title: `Switch to ${targetLevel}?`,
        message: `Since you haven't completed your current level, this will cost 3 Grey Coins (₦300).`,
        type: 'warning',
        confirmText: 'Pay & Switch',
        singleButton: false,
        onConfirm: performSwitch
    });
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
    { num: 2, topic: ChallengeTopic.SPECIAL_PROCEDURES },
    { num: 3, topic: ChallengeTopic.MRI },
    { num: 4, topic: ChallengeTopic.CT },
    { num: 5, topic: ChallengeTopic.USS },
    { num: 6, topic: ChallengeTopic.SAFETY },
  ];

  const currentDayStatus = canPlayDay(profile.currentDay, profile);
  const isCurrentDayLocked = !currentDayStatus.allowed && currentDayStatus.requiresUnlock;

  // Format coins to handle floats gracefully
  const displayCoins = Number.isInteger(profile.coins) ? profile.coins : profile.coins.toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <CustomAlert config={alertConfig} onClose={closeAlert} />
      
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
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shadow-inner">
                    <div className="mr-4">
                      <p className="text-xs text-slate-500 font-bold uppercase">Coins</p>
                      <div className="flex items-center text-slate-900 font-black text-xl">
                        <Coins className="w-5 h-5 text-amber-500 mr-2" />
                        {displayCoins}
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowBuyModal(true)}
                      className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Buy
                    </button>
                  </div>

                  <button 
                    onClick={handleShare}
                    className="flex-1 md:flex-none bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-sm active:scale-95"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    <div>
                        <span className="block text-xs uppercase opacity-75 leading-none mb-1">Share & Earn</span>
                        <span className="block leading-none">+0.5 Coin</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Level Switcher */}
              <div className="bg-slate-100/50 p-2 rounded-xl flex flex-wrap gap-2 mb-6">
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
                                ${isActive ? 'bg-white shadow-md text-slate-900 ring-2 ring-slate-200' : 'text-slate-500 hover:bg-slate-100'}
                                ${isLocked ? 'opacity-70 grayscale' : ''}
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
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${((profile.currentDay - 1) / 6) * 100}%` }}
                    />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{profile.totalScore} Pts</span>
                </div>
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
                
                // Check if this day is locked because user hasn't waited 24h since completing previous
                // This typically applies to the CURRENT day if they just finished the previous one.
                const isTimeLocked = day.num === profile.currentDay && !status.allowed && status.requiresUnlock;
                
                // Check if this is the NEXT day, and the user has already started the CURRENT day.
                // We only show this if the current day is NOT locked. If current day is locked, 
                // any start time stored is likely stale or invalid for this purpose.
                const isNextDayTimer = !isCurrentDayLocked && day.num === profile.currentDay + 1 && profile.lastChallengeStartedAt;

                let targetUnlockDate = new Date();
                
                if (isTimeLocked && profile.lastPlayedDate) {
                  // Standard wait time (24h after finishing previous day)
                  const lastPlayed = safeParseDate(profile.lastPlayedDate);
                  if (lastPlayed) {
                     targetUnlockDate = new Date(lastPlayed.getTime() + 24 * 60 * 60 * 1000);
                  }
                } else if (isNextDayTimer && profile.lastChallengeStartedAt) {
                  // Pre-emptive timer: 24h after starting current day
                  const lastStarted = safeParseDate(profile.lastChallengeStartedAt);
                  if (lastStarted) {
                     targetUnlockDate = new Date(lastStarted.getTime() + 24 * 60 * 60 * 1000);
                  }
                }

                // Determine if we should show the timer component
                const showTimer = isTimeLocked || (isNextDayTimer && targetUnlockDate.getTime() > new Date().getTime());

                return (
                  <div 
                    key={day.num}
                    className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300 group flex flex-col justify-between min-h-[240px]
                      ${isPlayed ? 'bg-emerald-50/50 border-emerald-200' : ''}
                      ${!isPlayed && !isLocked ? 'bg-white border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02] ring-4 ring-amber-100' : ''}
                      ${isLocked ? 'bg-slate-50 border-slate-200 opacity-90' : ''}
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
                          <div className="flex items-center text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded-lg">
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
                        {showTimer ? (
                          <UnlockTimer 
                            targetDate={targetUnlockDate}
                            onComplete={fetchProfileData}
                          />
                        ) : (
                           status.reason && <p className="text-xs text-center text-slate-500 mb-3 font-medium flex items-center justify-center bg-slate-100 py-2 rounded-lg"><CalendarClock className="w-3 h-3 mr-1"/> {status.reason}</p>
                        )}
                        
                        {status.canPayToUnlock ? (
                            <button 
                                onClick={() => handleUnlockDay(day.num)}
                                disabled={unlocking === day.num}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center transition-colors shadow-lg"
                            >
                                {unlocking === day.num ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                <>
                                    <Unlock className="w-4 h-4 mr-2" /> Unlock Early (2 Coins)
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
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl flex items-center justify-center shadow-lg transition-all transform active:scale-95"
                      >
                        <Play className="w-5 h-5 mr-2" /> Start Challenge
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className={`
            lg:block lg:w-80 lg:relative
            ${showLeaderboard 
              ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm' 
              : 'hidden'}
          `}>
            <div className={`
                bg-white rounded-2xl border border-slate-100 p-6 
                w-full max-w-md lg:max-w-none lg:w-full lg:sticky lg:top-8
                shadow-2xl lg:shadow-sm
                max-h-[85vh] lg:max-h-[80vh] overflow-y-auto custom-scrollbar
            `}>
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100 lg:border-none lg:pb-0 lg:static">
                <div className="flex items-center">
                    <Trophy className="text-amber-500 w-6 h-6 mr-3" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Leaderboard</h2>
                        {profile && <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{profile.level} Division</span>}
                    </div>
                </div>
                <button 
                    onClick={() => setShowLeaderboard(false)} 
                    className="lg:hidden p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Be the first to join!</p>
                ) : (
                  leaderboard.map((user, idx) => (
                    <div key={idx} className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-3 
                        ${idx === 0 ? 'bg-yellow-400 text-yellow-900 shadow-md shadow-yellow-200' : ''}
                        ${idx === 1 ? 'bg-slate-300 text-slate-800' : ''}
                        ${idx === 2 ? 'bg-amber-700 text-amber-100' : ''}
                        ${idx > 2 ? 'bg-white text-slate-500 border border-slate-200' : ''}
                      `}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user.email === profile?.email ? `${user.displayName} (You)` : user.displayName}
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