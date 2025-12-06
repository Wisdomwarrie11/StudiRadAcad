import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, ArrowRight, Check, X, ExternalLink, Loader2, LogOut, ChevronLeft } from 'lucide-react';
import { getQuestionsForDay, updateUserProgress, getUserProfile } from '../../services/challengeService';
import { ChallengeLevel, ChallengeQuestion, UserChallengeProfile } from '../../types';
import CustomAlert, { AlertConfig } from '../../components/ui/CustomAlert';

const DailyChallengeQuiz: React.FC = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<ChallengeLevel>(ChallengeLevel.BASIC);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    singleButton: true
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load Data
  useEffect(() => {
    const init = async () => {
      try {
        const email = sessionStorage.getItem('studiRad_challenge_email');
        if (!email || !dayId) {
          navigate('/challenge');
          return;
        }

        const profile = await getUserProfile(email);
        if (!profile) {
          navigate('/challenge');
          return;
        }
        
        setLevel(profile.level);
        
        // Timer Logic: Basic = 30s, Advanced/Master = 40s
        const tSeconds = profile.level === ChallengeLevel.BASIC ? 30 : 40;
        setTimerSeconds(tSeconds);
        setTimeLeft(tSeconds);

        const dayNum = parseInt(dayId, 10);
        if (isNaN(dayNum)) {
          navigate('/challenge/dashboard');
          return;
        }

        const { topic: loadedTopic, questions: loadedQuestions } = getQuestionsForDay(dayNum, profile.level);
        setTopic(loadedTopic);
        setQuestions(loadedQuestions);
      } catch (e) {
        console.error(e);
        navigate('/challenge');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [dayId, navigate]);

  // Timer Logic
  useEffect(() => {
    if (quizFinished || isAnswered || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQIndex, isAnswered, quizFinished, questions.length]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // -1 indicates timeout
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(index);
    if (index === questions[currentQIndex].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTimeLeft(timerSeconds);
    } else {
      finishQuiz(true); // Normal finish
    }
  };

  const handleQuit = () => {
    setAlertConfig({
        isOpen: true,
        title: 'End Session?',
        message: `Are you sure you want to quit? You have ${score} points so far. These points will be counted, but the day won't be marked as 'Complete' unless you finish all questions.`,
        type: 'warning',
        singleButton: false,
        confirmText: 'End Session',
        cancelText: 'Continue Quiz',
        onConfirm: () => finishQuiz(false), // Early Quit
        onCancel: () => setAlertConfig(prev => ({...prev, isOpen: false}))
    });
  };

  const finishQuiz = async (completed: boolean) => {
    setQuizFinished(true);
    setIsSaving(true);
    
    const email = sessionStorage.getItem('studiRad_challenge_email');
    if (email && dayId) {
      try {
        const dayNum = parseInt(dayId, 10);
        
        // Fetch current profile to check if we should advance day
        const profile = await getUserProfile(email);
        if (profile) {
          // Only advance if it was a sequential play AND user finished all questions
          const shouldAdvance = completed && (profile.currentDay === dayNum);
          await updateUserProgress(email, dayNum, score, shouldAdvance);
        }
      } catch (e) {
        console.error("Error saving progress", e);
      } finally {
        setIsSaving(false);
        if (!completed) {
            navigate('/challenge/dashboard');
        }
      }
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      <span className="ml-2 font-medium text-slate-600">Preparing Challenge...</span>
    </div>
  );

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-lg w-full text-center fade-in">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flag className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Day {dayId} Complete!</h2>
          <p className="text-slate-500 mb-8">You have completed the challenge for {topic}.</p>
          
          <div className="text-6xl font-black text-slate-900 mb-2">{score} <span className="text-2xl text-slate-400 font-medium">/ 30</span></div>
          <p className="text-emerald-600 font-bold mb-8">
            {score > 25 ? 'Outstanding Performance!' : score > 15 ? 'Good Job!' : 'Keep Practicing!'}
          </p>

          <button 
            disabled={isSaving}
            onClick={() => navigate('/challenge/dashboard')}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex justify-center items-center"
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CustomAlert config={alertConfig} onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))} />
      
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={handleQuit} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
             <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-bold text-slate-800 flex items-center">
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded mr-2 uppercase">{level}</span>
                Day {dayId}: {topic}
            </h2>
            <div className="text-xs text-slate-500 mt-1">Question {currentQIndex + 1} of {questions.length}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`flex items-center space-x-2 font-mono font-bold text-xl mr-6 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
            <Clock className="w-5 h-5" />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
          <button 
            onClick={handleQuit}
            className="text-red-500 hover:text-red-700 flex items-center text-sm font-bold transition-colors border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" /> End Session
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 w-full">
        <div 
          className="h-full bg-amber-500 transition-all duration-300" 
          style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          
          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6">
            <div className="p-8">
              <p className="text-xl font-medium text-slate-900 leading-relaxed">
                {currentQ.text}
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 space-y-3">
              {currentQ.options.map((option, idx) => {
                let btnClass = "bg-white border-slate-200 hover:border-slate-400 text-slate-700";
                
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnClass = "bg-emerald-100 border-emerald-500 text-emerald-800"; // Correct
                  } else if (selectedOption === idx) {
                    btnClass = "bg-red-100 border-red-500 text-red-800"; // Wrong selected
                  } else {
                    btnClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-60"; // Others
                  }
                } else if (selectedOption === idx) {
                  btnClass = "bg-slate-800 text-white";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-200 flex justify-between items-center ${btnClass}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === currentQ.correctIndex && <Check className="w-5 h-5 text-emerald-600" />}
                    {isAnswered && selectedOption === idx && idx !== currentQ.correctIndex && <X className="w-5 h-5 text-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation / Footer */}
          {isAnswered && (
            <div className="bg-white rounded-2xl shadow-lg border-l-4 border-blue-500 p-6 fade-in mb-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900">Explanation</h3>
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
              
              <button 
                onClick={handleNext}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition-colors"
              >
                {currentQIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'} <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DailyChallengeQuiz;