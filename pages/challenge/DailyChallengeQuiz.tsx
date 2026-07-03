
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flag, ArrowRight, Check, X, ExternalLink, Loader2, LogOut, ChevronLeft } from 'lucide-react';
import { getQuestionsForDay, updateUserProgress, getUserProfile, startChallengeDay } from '../../services/challengeService';
import { ChallengeLevel, ChallengeQuestion, AlertConfig } from '../../types';
import CustomAlert from '../../components/ui/CustomAlert';

const DailyChallengeQuiz: React.FC = () => {
  const { dayId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<ChallengeLevel>(ChallengeLevel.BASIC);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    singleButton: true
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const email = sessionStorage.getItem('studiRad_challenge_email') || localStorage.getItem('studiRad_challenge_email');
        const nav = navigate;
        if (!email || !dayId) {
          nav('/challenge');
          return;
        }

        const profile = await getUserProfile(email);
        if (!profile) {
          nav('/challenge');
          return;
        }
        
        setLevel(profile.level);
        
        const tSeconds = profile.level === ChallengeLevel.BASIC ? 30 : 40;
        setTimerSeconds(tSeconds);
        setTimeLeft(tSeconds);

        const dayNum = parseInt(dayId, 10);
        if (isNaN(dayNum)) {
          nav('/challenge/dashboard');
          return;
        }

        // Start the day timer if this is the user's current progression day
        if (profile.currentDay === dayNum) {
            startChallengeDay(email, dayNum);
        }

        const { topic: loadedTopic, questions: loadedQuestions } = getQuestionsForDay(dayNum, profile.level);
        setTopic(loadedTopic);
        setQuestions(loadedQuestions);
        setAnswers(new Array(loadedQuestions.length).fill(null));
      } catch (e) {
        console.error(e);
        navigate('/challenge');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [dayId, navigate]);

  const isCurrentAnswered = answers[currentQIndex] !== null;

  // Note: Wall-clock based timer has been removed per user request for an untimed, self-paced quiz.

  const handleOptionClick = (index: number) => {
    if (answers[currentQIndex] !== null) return;
    
    const updated = [...answers];
    updated[currentQIndex] = index;
    setAnswers(updated);
    
    if (index === questions[currentQIndex].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(timerSeconds);
    } else {
      finishQuiz(true); 
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
      setTimeLeft(timerSeconds);
    }
  };

  const handleQuit = () => {
    const currentScore = answers.reduce((sum, ans, idx) => {
      return ans === questions[idx].correctIndex ? sum + 1 : sum;
    }, 0);

    setAlertConfig({
        isOpen: true,
        title: 'End Session?',
        message: `Are you sure you want to quit? You have ${currentScore} points so far. These points will be counted, but the day won't be marked as 'Complete' unless you finish all questions.`,
        type: 'warning',
        singleButton: false,
        confirmText: 'End Session',
        cancelText: 'Continue Quiz',
        onConfirm: () => finishQuiz(false),
        onCancel: () => setAlertConfig(prev => ({...prev, isOpen: false}))
    });
  };

  const finishQuiz = async (completed: boolean) => {
    const nav = navigate;
    setQuizFinished(true);
    setIsSaving(true);
    
    // Fallback to local storage if session storage is missing
    const email = sessionStorage.getItem('studiRad_challenge_email') || localStorage.getItem('studiRad_challenge_email');
    
    if (!email || !dayId) {
      setIsSaving(false);
      nav('/challenge');
      return;
    }

    try {
      const dayNum = parseInt(dayId, 10);
      const currentScore = answers.reduce((sum, ans, idx) => {
        return ans === questions[idx].correctIndex ? sum + 1 : sum;
      }, 0);
      
      const profile = await getUserProfile(email);
      if (profile) {
        // Advance the day if it was the current progression day, regardless of whether 
        // the user finished all questions ('completed' param). 
        // An attempt counts as playing the day, starting the timer for the next day.
        const shouldAdvance = (profile.currentDay === dayNum);
        await updateUserProgress(email, dayNum, currentScore, shouldAdvance);
      }
    } catch (e) {
      console.error("Error saving progress", e);
    } finally {
      setIsSaving(false);
      if (!completed) {
          nav('/challenge/dashboard');
      }
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      <span className="ml-2 font-medium text-slate-600">Preparing Challenge...</span>
    </div>
  );

  const calculatedScore = answers.reduce((sum, ans, idx) => {
    return ans === questions[idx].correctIndex ? sum + 1 : sum;
  }, 0);

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-lg w-full text-center fade-in shadow-2xl">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flag className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Day {dayId} Complete!</h2>
          <p className="text-slate-500 mb-8">You have completed the challenge for {topic}.</p>
          
          <div className="text-6xl font-black text-slate-900 mb-2">{calculatedScore} <span className="text-2xl text-slate-400 font-medium">/ {questions.length}</span></div>
          <p className="text-emerald-600 font-bold mb-8">
            {calculatedScore > (questions.length * 0.8) ? 'Outstanding Performance!' : calculatedScore > (questions.length * 0.5) ? 'Good Job!' : 'Keep Practicing!'}
          </p>

          <button 
            disabled={isSaving}
            onClick={() => navigate('/challenge/dashboard')}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex justify-center items-center shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving Score...
              </>
            ) : "Return to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  // Dynamic calculations for question navigation
  const firstUnanswered = answers.findIndex(a => a === null);
  const highestUnlocked = firstUnanswered === -1 ? questions.length - 1 : firstUnanswered;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <CustomAlert config={alertConfig} onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))} />
      
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={handleQuit} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
             <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-bold text-slate-800 flex items-center text-sm md:text-base">
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded mr-2 uppercase tracking-wide font-bold border border-slate-200">{level}</span>
                Day {dayId}
            </h2>
            <div className="text-xs text-slate-500 mt-1">Question {currentQIndex + 1} of {questions.length}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={handleQuit}
            className="text-red-500 hover:text-red-700 flex items-center text-sm font-bold transition-colors border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" /> <span className="hidden md:inline">End Session</span>
          </button>
        </div>
      </div>

      {/* Question Navigation Dots Map */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap gap-2 justify-center items-center shadow-inner">
        {questions.map((_, idx) => {
          const isCurrent = idx === currentQIndex;
          const isAnswered = answers[idx] !== null;
          const isUnlocked = idx <= highestUnlocked;

          let bubbleClass = "border-slate-200 text-slate-400";
          if (isCurrent) {
            bubbleClass = "bg-amber-500 border-amber-500 text-white shadow-md font-bold scale-110";
          } else if (isAnswered) {
            if (answers[idx] === -1) {
              bubbleClass = "bg-slate-200 border-slate-300 text-slate-500 font-medium";
            } else {
              const isCorrect = answers[idx] === questions[idx].correctIndex;
              bubbleClass = isCorrect 
                ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold" 
                : "bg-red-100 border-red-300 text-red-800 font-semibold";
            }
          } else if (isUnlocked) {
            bubbleClass = "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 cursor-pointer font-semibold";
          } else {
            bubbleClass = "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-50";
          }

          return (
            <button
              key={idx}
              disabled={!isUnlocked}
              onClick={() => {
                setCurrentQIndex(idx);
                setTimeLeft(timerSeconds);
              }}
              className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-all ${bubbleClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 w-full">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300" 
          style={{ width: `${((currentQIndex + (isCurrentAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          
          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-6">
            <div className="p-8 border-b border-slate-50">
              <p className="text-xl font-medium text-slate-900 leading-relaxed">
                {currentQ.text}
              </p>
            </div>
            
            <div className="bg-slate-50/50 p-6 space-y-3">
              {currentQ.options.map((option, idx) => {
                let btnClass = "bg-white border-slate-200 hover:border-slate-400 text-slate-700 hover:shadow-md";
                const selectedOptionForQ = answers[currentQIndex];
                
                if (isCurrentAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnClass = "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-none"; // Correct option
                  } else if (selectedOptionForQ === idx) {
                    btnClass = "bg-red-100 border-red-500 text-red-800 shadow-none"; // Selected wrong option
                  } else {
                    btnClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-60 shadow-none"; // Others
                  }
                } else if (selectedOptionForQ === idx) {
                  btnClass = "bg-slate-800 text-white shadow-lg scale-[1.01] border-slate-800";
                }

                return (
                  <button
                    key={idx}
                    disabled={isCurrentAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full text-left p-5 rounded-xl border-2 font-medium transition-all duration-200 flex justify-between items-center ${btnClass}`}
                  >
                    <span>{option}</span>
                    {isCurrentAnswered && idx === currentQ.correctIndex && <Check className="w-6 h-6 text-emerald-600" />}
                    {isCurrentAnswered && selectedOptionForQ === idx && idx !== currentQ.correctIndex && <X className="w-6 h-6 text-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation / Footer */}
          {isCurrentAnswered && (
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-blue-500 p-6 fade-in mb-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div> Explanation</h3>
                <div className="flex space-x-3">
                  <button className="text-xs text-slate-400 hover:text-red-500 flex items-center transition-colors">
                    <Flag className="w-3 h-3 mr-1" /> Report
                  </button>
                </div>
              </div>
              <p className="text-slate-600 mb-4">{currentQ.explanation}</p>
              {currentQ.referenceLink && (
                 <a href={currentQ.referenceLink} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-bold flex items-center hover:underline mb-6">
                    Confirm Answer <ExternalLink className="ml-1 w-3 h-3" />
                  </a>
              )}
              
              <div className="flex gap-4">
                <button
                  disabled={currentQIndex === 0}
                  onClick={handlePrev}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="mr-2 w-5 h-5" /> Previous Question
                </button>
                
                <button 
                  onClick={handleNext}
                  className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg"
                >
                  {currentQIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'} <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DailyChallengeQuiz;
