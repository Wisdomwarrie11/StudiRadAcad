
import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Clock, AlertTriangle } from "lucide-react";
import { Question } from "../../data/quizQuestions";

interface SingleQuestionQuizProps {
  question: Question;
  onNext: () => void;
  onAnswerCorrect: (isCorrect: boolean) => void;
  isLast: boolean;
  questionIndex: number;
  totalQuestions: number;
  timeLimit: number; // Time in seconds
}

const SingleQuestionQuiz: React.FC<SingleQuestionQuizProps> = ({ 
  question, 
  onNext, 
  onAnswerCorrect,
  isLast,
  questionIndex,
  totalQuestions,
  timeLimit
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error' | 'timeout', message: string} | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    setLocked(false);
    setTimeLeft(timeLimit);
  }, [question, timeLimit]);

  // Timer Logic
  useEffect(() => {
    if (locked || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, locked]);

  // Handle Timeout
  useEffect(() => {
    if (timeLeft === 0 && !locked) {
      handleTimeout();
    }
  }, [timeLeft, locked]);

  const handleTimeout = () => {
    setLocked(true);
    setFeedback({ type: 'timeout', message: "Time's Up!" });
    onAnswerCorrect(false);
  };

  const handleAnswer = (option: string) => {
    if (locked) return;

    setSelectedOption(option);
    setLocked(true);
    
    const isCorrect = option === question.answer;

    if (isCorrect) {
      setFeedback({ type: 'success', message: "Correct Answer!" });
      onAnswerCorrect(true);
    } else {
      setFeedback({ type: 'error', message: "Incorrect Answer" });
      onAnswerCorrect(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Basic': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-amber-100 text-amber-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Timer Color Logic
  const getTimerColor = () => {
    const percentage = (timeLeft / timeLimit) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-amber-500';
    return 'bg-red-500 animate-pulse';
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full relative">
      
      {/* Timer Bar (Top) */}
      <div className="w-full bg-slate-100 h-1.5 absolute top-0 left-0 z-10">
        <div 
          className={`h-full transition-all duration-1000 linear ${getTimerColor()}`} 
          style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
        ></div>
      </div>

      <div className="p-6 md:p-8 flex-grow flex flex-col mt-2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-bold ${timeLeft < 10 ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-100'}`}>
                <Clock className="w-4 h-4" /> {timeLeft}s
             </div>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
             </span>
          </div>
        </div>

        <div className="mb-2">
           <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
             {question.category}
           </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
          {question.question}
        </h3>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium flex justify-between items-center ";
            
            // Logic for styling buttons after answer
            if (locked) {
              if (option === question.answer) {
                 buttonClass += "bg-green-50 border-green-500 text-green-700"; // Always highlight correct answer
              } else if (selectedOption === option && option !== question.answer) {
                 buttonClass += "bg-red-50 border-red-500 text-red-700"; // Highlight wrong selection
              } else {
                 buttonClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-60"; // Dim others
              }
            } else {
              // Hover state only when not locked
              buttonClass += "bg-white border-slate-200 text-slate-600 hover:border-brand-accent hover:bg-slate-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={locked}
                className={buttonClass}
              >
                <span>{option}</span>
                {locked && option === question.answer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {locked && selectedOption === option && option !== question.answer && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Section - Shows after locking */}
        {locked && (
          <div className="mt-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Timeout Badge */}
             {feedback?.type === 'timeout' && (
                <div className="flex items-center gap-2 text-red-600 font-bold mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertTriangle className="w-5 h-5" /> Time is up!
                </div>
             )}

             <div className="bg-slate-50 border-l-4 border-brand-accent p-4 rounded-r-lg mb-6">
               <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                 <HelpCircle className="w-4 h-4 text-brand-accent" /> Explanation:
               </h4>
               <p className="text-slate-600 text-sm leading-relaxed">
                 {question.explanation}
               </p>
             </div>
             
             <button
                onClick={onNext}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-brand-dark hover:bg-brand-primary shadow-lg transition-all transform hover:-translate-y-1"
              >
                {isLast ? "Complete Level" : "Next Question"} <ArrowRight className="w-5 h-5" />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleQuestionQuiz;
