import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Question } from "../../data/quizQuestions";

interface SingleQuestionQuizProps {
  question: Question;
  onNext: () => void;
  onBack: () => void;
  onAnswerCorrect: (isCorrect: boolean) => void;
  isFirst: boolean;
  isLast: boolean;
  questionIndex: number;
  totalQuestions: number;
}

const SingleQuestionQuiz: React.FC<SingleQuestionQuizProps> = ({ 
  question, 
  onNext, 
  onBack, 
  onAnswerCorrect,
  isFirst,
  isLast,
  questionIndex,
  totalQuestions
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);
  const [locked, setLocked] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setAttempts(0);
    setFeedback(null);
    setLocked(false);
  }, [question]);

  const handleAnswer = (option: string) => {
    if (locked) return;

    setSelectedOption(option);
    const isCorrect = option === question.answer;

    if (isCorrect) {
      setFeedback({ type: 'success', message: "✅ Wow! That's correct!" });
      setLocked(true);
      onAnswerCorrect(true);
    } else {
      if (attempts === 0) {
        setFeedback({ type: 'warning', message: "❌ Not quite. Try one more time!" });
        setAttempts(1);
      } else {
        setFeedback({ type: 'error', message: `🚨 Incorrect. The answer is: ${question.answer}` });
        setLocked(true);
        onAnswerCorrect(false);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2">
        <div 
          className="bg-brand-dark h-2 transition-all duration-300" 
          style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
            Radiography
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
          {question.question}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium flex justify-between items-center ";
            
            if (selectedOption === option) {
              if (feedback?.type === 'success') {
                buttonClass += "bg-green-50 border-green-500 text-green-700";
              } else if (feedback?.type === 'error' || feedback?.type === 'warning') {
                buttonClass += "bg-red-50 border-red-500 text-red-700";
              } else {
                buttonClass += "bg-brand-accent/20 border-brand-accent text-brand-dark";
              }
            } else if (locked && option === question.answer && feedback?.type === 'error') {
               // Show correct answer if user failed
               buttonClass += "bg-green-50 border-green-500 text-green-700";
            } else {
              buttonClass += "bg-white border-slate-200 text-slate-600 hover:border-brand-accent hover:bg-slate-50";
            }

            if (locked && selectedOption !== option) buttonClass += " opacity-60";

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={locked}
                className={buttonClass}
              >
                <span>{option}</span>
                {selectedOption === option && feedback?.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {selectedOption === option && (feedback?.type === 'error' || feedback?.type === 'warning') && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2
            ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 
              feedback.type === 'warning' ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'}`}>
            <span className="font-semibold">{feedback.message}</span>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
          <button
            onClick={onBack}
            disabled={isFirst}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors
              ${isFirst 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={onNext}
            disabled={!locked}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold shadow-lg transition-all transform
              ${!locked
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-brand-dark text-white hover:bg-brand-primary hover:-translate-y-0.5'}`}
          >
            {isLast ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleQuestionQuiz;