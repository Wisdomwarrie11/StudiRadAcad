import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleQuestionQuiz from '../../components/quiz/SingleQuiz';
import { quizQuestions } from '../../data/quizQuestions';
import { Trophy, RefreshCcw, Home, Frown } from 'lucide-react';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Track which questions were answered correctly to prevent double counting if they go back (optional advanced logic, simplified here)
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const handleAnswerCorrect = (isCorrect: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: isCorrect
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateFinalScore();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateFinalScore = () => {
    const finalScore = Object.values(answers).filter(val => val === true).length;
    setScore(finalScore);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setShowResults(false);
  };

  // --- Results View ---
  if (showResults) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let message = "";
    let colorClass = "";

    if (percentage >= 80) {
      message = "Outstanding! You're a Radiography Expert!";
      colorClass = "text-green-600";
    } else if (percentage >= 50) {
      message = "Good job! Keep studying to master the details.";
      colorClass = "text-amber-600";
    } else {
      message = "Keep practicing. Consistency is key.";
      colorClass = "text-red-600";
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {percentage >= 50 ? (
              <Trophy className={`w-12 h-12 ${percentage >= 80 ? 'text-amber-400' : 'text-slate-400'}`} />
            ) : (
              <Frown className="w-12 h-12 text-slate-400" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
          <p className={`font-medium text-lg mb-6 ${colorClass}`}>{message}</p>

          <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
            <span className="block text-slate-500 text-sm uppercase tracking-wide font-semibold mb-1">Your Score</span>
            <span className="block text-5xl font-extrabold text-slate-800">
              {score}<span className="text-2xl text-slate-400">/{quizQuestions.length}</span>
            </span>
            <span className="inline-block mt-2 px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-sm font-bold">
              {percentage}%
            </span>
          </div>

          <div className="space-y-3">
            <button 
              onClick={restartQuiz}
              className="w-full py-3 px-4 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-primary transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Retake Quiz
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Quiz View ---
  return (
    <div  style={{marginTop: "100px"}}  className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2">
          <Home className="w-4 h-4" /> Home
        </button>
        <h1 className="text-xl font-bold text-slate-800 hidden md:block">Weekly Assessment</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <SingleQuestionQuiz
        question={quizQuestions[currentQuestionIndex]}
        questionIndex={currentQuestionIndex}
        totalQuestions={quizQuestions.length}
        onNext={handleNext}
        onBack={handleBack}
        onAnswerCorrect={handleAnswerCorrect}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === quizQuestions.length - 1}
      />
    </div>
  );
};

export default QuizPage;