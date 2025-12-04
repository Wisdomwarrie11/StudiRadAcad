
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleQuestionQuiz from '../../components/quiz/SingleQuiz';
import { quizQuestions, Question, Difficulty } from '../../data/quizQuestions';
import { Trophy, RefreshCcw, Home, Frown, Share2, Mail, Lock, Unlock, Star, AlertTriangle, Calendar, Clock } from 'lucide-react';

// --- Configuration ---
const MAX_DAILY_ATTEMPTS = 2;
const DAILY_QUESTION_COUNT = 30; // 10 + 10 + 10

// Distribution of questions for the daily set
const LEVEL_DISTRIBUTION = {
  Basic: 10,
  Intermediate: 10,
  Advanced: 10
};

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Game State
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'LEVEL_TRANSITION' | 'RESULTS'>('START');
  const [currentLevel, setCurrentLevel] = useState<Difficulty>('Basic');
  const [dailyQuestions, setDailyQuestions] = useState<{ [key in Difficulty]: Question[] }>({ Basic: [], Intermediate: [], Advanced: [] });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Scoring
  const [score, setScore] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  
  // Persisted Data
  const [dailyAttempts, setDailyAttempts] = useState(0);
  const [nextResetTime, setNextResetTime] = useState<string>('');

  // Get Today's Date ID (YYYY-MM-DD)
  const getTodayID = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getTodayID();
    const storageKey = `studiRad_quiz_attempts_${today}`;
    
    // Load attempts for TODAY
    const storedAttempts = localStorage.getItem(storageKey);
    if (storedAttempts) {
      setDailyAttempts(parseInt(storedAttempts, 10));
    } else {
      setDailyAttempts(0);
    }

    // Initialize Daily Questions
    generateDailyQuestions(today);

    // Calculate time until next reset
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setNextResetTime(tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  }, []);

  // Pseudo-Random Number Generator based on Seed (Date)
  const seededRandom = (seed: number) => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const generateDailyQuestions = (dateString: string) => {
    // Create a numeric seed from the date string
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
       seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
       seed |= 0;
    }

    const selectQuestions = (diff: Difficulty, count: number) => {
      const pool = quizQuestions.filter(q => q.difficulty === diff);
      const selected: Question[] = [];
      const usedIndices = new Set<number>();
      
      // Safety check if pool is smaller than requested count
      const safeCount = Math.min(count, pool.length);
      
      while (selected.length < safeCount) {
        const randIndex = Math.floor(seededRandom(seed++) * pool.length);
        if (!usedIndices.has(randIndex)) {
          selected.push(pool[randIndex]);
          usedIndices.add(randIndex);
        }
      }
      return selected;
    };

    setDailyQuestions({
      Basic: selectQuestions('Basic', LEVEL_DISTRIBUTION.Basic),
      Intermediate: selectQuestions('Intermediate', LEVEL_DISTRIBUTION.Intermediate),
      Advanced: selectQuestions('Advanced', LEVEL_DISTRIBUTION.Advanced),
    });
  };

  const startQuiz = () => {
    if (dailyAttempts >= MAX_DAILY_ATTEMPTS) return;
    
    // Increment attempts
    const newAttempts = dailyAttempts + 1;
    setDailyAttempts(newAttempts);
    localStorage.setItem(`studiRad_quiz_attempts_${getTodayID()}`, newAttempts.toString());

    // Initialize Game
    setScore(0);
    setTotalQuestionsAnswered(0);
    startLevel('Basic');
  };

  const startLevel = (level: Difficulty) => {
    setCurrentLevel(level);
    setCurrentQuestionIndex(0);
    setGameState('PLAYING');
  };

  const getCurrentLevelQuestions = () => {
    return dailyQuestions[currentLevel];
  };

  const handleAnswerCorrect = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    const questions = getCurrentLevelQuestions();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishLevel();
    }
  };

  const finishLevel = () => {
    const questions = getCurrentLevelQuestions();
    setTotalQuestionsAnswered(prev => prev + questions.length);
    
    if (currentLevel === 'Basic') {
      setGameState('LEVEL_TRANSITION');
    } else if (currentLevel === 'Intermediate') {
      setGameState('LEVEL_TRANSITION');
    } else {
      setGameState('RESULTS');
    }
  };

  const proceedToNextLevel = () => {
    if (currentLevel === 'Basic') startLevel('Intermediate');
    else if (currentLevel === 'Intermediate') startLevel('Advanced');
  };

  const quitToResults = () => {
    setGameState('RESULTS');
  };

  const handleShare = async () => {
    const text = `I scored ${score}/${totalQuestionsAnswered} points on today's StudiRad Daily Challenge! Beat my score at:`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StudiRad Daily Quiz Result',
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert("Sharing not supported on this browser. Copy link to share!");
    }
  };

  // Helper to determine time limit based on level
  const getTimeLimitForLevel = (level: Difficulty): number => {
    if (level === 'Advanced') return 40;
    return 30; // Basic and Intermediate
  };

  // --- VIEWS ---

  // 1. Start Screen
  if (gameState === 'START') {
    return (
      <div style={{marginTop: '70px'}} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-slate-100">
          
          <div className="flex justify-center mb-6">
             <div className="bg-brand-dark px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-lg">
               <Calendar className="w-4 h-4" /> Daily Challenge: {new Date().toLocaleDateString()}
             </div>
          </div>

          <div className="bg-brand-dark w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-dark/30">
            <Trophy className="text-amber-400 w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Today's Question Set</h1>
          <p className="text-slate-500 mb-8">30 questions. 3 Levels. Push your limits!</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <span className="block text-green-700 font-bold text-lg">Basic</span>
              <span className="text-xs text-green-600 font-semibold">10 Qs • 30s</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <span className="block text-amber-700 font-bold text-lg">Inter.</span>
              <span className="text-xs text-amber-600 font-semibold">10 Qs • 30s</span>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <span className="block text-red-700 font-bold text-lg">Master</span>
              <span className="text-xs text-red-600 font-semibold">10 Qs • 40s</span>
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg p-4 mb-8 flex items-center justify-between">
            <span className="text-slate-600 font-medium text-sm">Today's Attempts:</span>
            <div className="flex gap-1">
              {[1, 2].map(i => (
                 <div key={i} className={`w-3 h-3 rounded-full ${i <= dailyAttempts ? 'bg-red-500' : 'bg-slate-300'}`}></div>
              ))}
            </div>
          </div>

          {dailyAttempts >= MAX_DAILY_ATTEMPTS ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
              <div className="flex justify-center mb-4">
                 <Clock className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Daily Limit Reached</h3>
              <p className="text-sm text-slate-600 mb-4">
                You have used all attempts for today. The questions will shuffle in 24 hours.
              </p>
              <div className="inline-block px-4 py-2 bg-slate-200 rounded-lg text-slate-700 font-mono text-sm">
                Next Reset: {nextResetTime}
              </div>
              <button 
                onClick={() => navigate('/')}
                className="mt-6 w-full py-3 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-primary transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <button 
              onClick={startQuiz}
              className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold text-lg hover:bg-brand-primary transition-all shadow-xl hover:-translate-y-1"
            >
              Start Challenge ({MAX_DAILY_ATTEMPTS - dailyAttempts} left)
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Playing State
  if (gameState === 'PLAYING') {
    const questions = getCurrentLevelQuestions();
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center">
         <div className="w-full max-w-2xl flex justify-between items-center mb-6">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-700">
              <Home className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-200 rounded-full font-bold text-slate-700 text-sm">
               Score: {score}
            </div>
         </div>
         
         <SingleQuestionQuiz
            key={currentQuestionIndex} // Important: Forces re-mount to reset timer on new question
            question={questions[currentQuestionIndex]}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onNext={handleNextQuestion}
            onAnswerCorrect={handleAnswerCorrect}
            isLast={currentQuestionIndex === questions.length - 1}
            timeLimit={getTimeLimitForLevel(currentLevel)}
          />
      </div>
    );
  }

  // 3. Level Transition
  if (gameState === 'LEVEL_TRANSITION') {
    const nextLevelName = currentLevel === 'Basic' ? 'Intermediate' : 'Advanced';
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          
          <div className="mb-6 inline-block p-4 bg-green-100 rounded-full text-green-600">
            <Unlock className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentLevel} Set Complete!</h2>
          <p className="text-slate-500 mb-8">You are doing great. Ready for the next difficulty tier?</p>

          <div className="space-y-3">
            <button 
              onClick={proceedToNextLevel}
              className="w-full py-3.5 bg-brand-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary transition-colors"
            >
              Start {nextLevelName} <Star className="w-4 h-4 fill-current" />
            </button>
            <button 
              onClick={quitToResults}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Finish & See Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Results
  if (gameState === 'RESULTS') {
    // If user quit early, totalQuestionsAnswered is accurate. 
    // If they finished all, it should be 30.
    const percentage = totalQuestionsAnswered > 0 ? Math.round((score / totalQuestionsAnswered) * 100) : 0;

    let message = "Good Effort!";
    if (percentage >= 90) message = "Radiography Master!";
    else if (percentage >= 70) message = "Excellent Job!";
    else if (percentage >= 50) message = "Good Potential!";

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center animate-in slide-in-from-bottom-8 duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
            {percentage >= 50 ? (
              <Trophy className="w-10 h-10 text-amber-600" />
            ) : (
              <Frown className="w-10 h-10 text-amber-700" />
            )}
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{message}</h2>
          <p className="text-slate-500 mb-8">You reached the <span className="font-bold text-brand-dark">{currentLevel}</span> level.</p>

          <div className="flex justify-center gap-4 mb-8">
            <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
               <span className="block text-3xl font-bold text-slate-800">{score}</span>
               <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Score</span>
            </div>
            <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-100">
               <span className="block text-3xl font-bold text-slate-800">{percentage}%</span>
               <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Accuracy</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <a 
              href={`mailto:?subject=StudiRad Daily Challenge&body=I scored ${score} points on today's Radiography Challenge!`}
              className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors"
            >
              <Mail className="w-4 h-4" /> Invite
            </a>
          </div>

          <div className="border-t border-slate-100 pt-6">
             {dailyAttempts < MAX_DAILY_ATTEMPTS ? (
                <button 
                  onClick={() => {
                    setGameState('START');
                  }}
                  className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-primary flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" /> Try Again ({MAX_DAILY_ATTEMPTS - dailyAttempts} left)
                </button>
             ) : (
                <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Max attempts reached for today.
                </div>
             )}
             <button 
                onClick={() => navigate('/')}
                className="mt-3 w-full py-3 text-slate-400 hover:text-slate-600 font-medium text-sm"
             >
                Back to Dashboard
              </button>
            </div>
          </div>
      </div>
    );
  }

  return null;
};

export default QuizPage;
