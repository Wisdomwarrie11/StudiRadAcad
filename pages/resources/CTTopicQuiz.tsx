
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Info, 
  RotateCcw, 
  Home,
  Trophy,
  Target,
  AlertTriangle,
  Lightbulb,
  Award
} from 'lucide-react';
import { CT_TOPICS, CTQuestion } from '../../data/ctQuestions';

const CTTopicQuiz: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const topic = useMemo(() => CT_TOPICS.find(t => t.id === topicId), [topicId]);
  
  const [shuffleKey, setShuffleKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const questions = useMemo(() => {
    if (!topic) return [];
    return [...topic.questions].sort(() => Math.random() - 0.5);
  }, [topic, shuffleKey]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<CTQuestion[]>([]);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">Topic not found</h2>
        <button 
          onClick={() => navigate('/resources/ct-bank')}
          className="px-6 py-2 bg-brand-primary text-white rounded-lg"
        >
          Back to Question Bank
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    // Check answer
    // For MCQ, option is A, B, C, D. For TF, it's True or False.
    // The data stores correctAnswer as "A", "B", "C", "D" or "True", "False".
    // We need to map the index to A, B, C, D if it's MCQ.
    
    let isCorrect = false;
    if (currentQuestion.type === 'MCQ') {
      const optionLetter = String.fromCharCode(65 + currentQuestion.options.indexOf(option));
      isCorrect = optionLetter === currentQuestion.correctAnswer;
    } else {
      isCorrect = option === currentQuestion.correctAnswer;
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongQuestions(prev => [...prev, currentQuestion]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setShuffleKey(prev => prev + 1);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setWrongQuestions([]);
  };

  const getFeedback = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return {
      title: "Excellent Mastery!",
      message: "You have a superb understanding of this topic. You're ready for advanced modules.",
      strengths: "Deep conceptual clarity and attention to detail.",
      focus: "Keep reviewing to maintain this high level of proficiency."
    };
    if (percentage >= 70) return {
      title: "Great Job!",
      message: "You have a solid foundation. A few areas need a bit more review.",
      strengths: "Strong grasp of core concepts.",
      focus: "Review the specific questions you missed to achieve full mastery."
    };
    if (percentage >= 50) return {
      title: "Good Effort",
      message: "You're on the right track, but some key concepts need more study.",
      strengths: "Basic understanding of the subject matter.",
      focus: "Go back to the study materials for the areas where you missed questions."
    };
    return {
      title: "Keep Learning",
      message: "This topic seems challenging. Don't give up! Review the fundamentals and try again.",
      strengths: "Willingness to practice and improve.",
      focus: "Focus on the basic definitions and core principles before retrying."
    };
  };

  if (isFinished) {
    const feedback = getFeedback();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-brand-light/30 py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="bg-brand-primary p-10 text-center text-white">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-brand-accent" />
            <h2 className="text-3xl font-bold mb-2">Topic Completed!</h2>
            <p className="opacity-90">{topic.title}</p>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-brand-light/50 p-6 rounded-2xl text-center">
                <p className="text-brand-muted text-sm font-medium mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-brand-dark">{questions.length}</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl text-center">
                <p className="text-emerald-600 text-sm font-medium mb-1">Correct Answers</p>
                <p className="text-3xl font-bold text-emerald-700">{score}</p>
              </div>
              <div className="bg-brand-primary/10 p-6 rounded-2xl text-center">
                <p className="text-brand-primary text-sm font-medium mb-1">Score Percentage</p>
                <p className="text-3xl font-bold text-brand-primary">{percentage}%</p>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-brand-primary" />
                  Performance Feedback
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <p className="font-bold text-brand-primary mb-2">{feedback.title}</p>
                  <p className="text-brand-muted leading-relaxed">{feedback.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-brand-dark mb-3 flex items-center text-sm uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                    Strength Areas
                  </h4>
                  <p className="text-sm text-brand-muted">{feedback.strengths}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-3 flex items-center text-sm uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 mr-2 text-brand-accent" />
                    Focus Areas
                  </h4>
                  <p className="text-sm text-brand-muted">{feedback.focus}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetQuiz}
                className="flex-1 py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Quiz
              </button>
              <button
                onClick={() => navigate('/resources/ct-bank')}
                className="flex-1 py-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-bold hover:bg-brand-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Bank
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light/30 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/ctbank')}
            className="flex items-center text-brand-primary font-semibold hover:text-brand-dark transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Exit Practice
          </button>
          <div className="text-right">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Current Topic</p>
            <p className="text-sm font-bold text-brand-dark truncate max-w-[200px] md:max-w-md">{topic.title}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-brand-muted">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-xs font-bold text-brand-primary">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-brand-primary"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-lg border border-brand-primary/5 overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-8 leading-tight">
                {currentQuestion.text}
              </h3>

              <div className="space-y-4 mb-10">
                {currentQuestion.options.map((option, idx) => {
                  const optionLetter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === option;
                  const isCorrect = currentQuestion.type === 'MCQ' 
                    ? optionLetter === currentQuestion.correctAnswer
                    : option === currentQuestion.correctAnswer;
                  
                  let buttonClass = "w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4 ";
                  
                  if (!isAnswered) {
                    buttonClass += "border-gray-100 hover:border-brand-primary hover:bg-brand-primary/5 bg-gray-50/50";
                  } else {
                    if (isCorrect) {
                      buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
                    } else if (isSelected) {
                      buttonClass += "border-rose-500 bg-rose-50 text-rose-900";
                    } else {
                      buttonClass += "border-gray-100 bg-gray-50 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(option)}
                      className={buttonClass}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 transition-colors ${
                        !isAnswered 
                          ? "bg-white text-brand-muted border border-gray-200" 
                          : isCorrect 
                            ? "bg-emerald-500 text-white" 
                            : isSelected 
                              ? "bg-rose-500 text-white" 
                              : "bg-gray-200 text-gray-400"
                      }`}>
                        {currentQuestion.type === 'MCQ' ? optionLetter : (idx === 0 ? 'T' : 'F')}
                      </div>
                      <span className="font-medium text-lg">{option}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 ml-auto text-emerald-500" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 ml-auto text-rose-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Explanation */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-gray-100 pt-8"
                  >
                    <div className={`mb-6 flex items-center gap-3 font-bold text-lg ${
                      (currentQuestion.type === 'MCQ' 
                        ? String.fromCharCode(65 + currentQuestion.options.indexOf(selectedOption!)) === currentQuestion.correctAnswer
                        : selectedOption === currentQuestion.correctAnswer)
                        ? "text-emerald-600" 
                        : "text-rose-600"
                    }`}>
                      {(currentQuestion.type === 'MCQ' 
                        ? String.fromCharCode(65 + currentQuestion.options.indexOf(selectedOption!)) === currentQuestion.correctAnswer
                        : selectedOption === currentQuestion.correctAnswer)
                        ? <CheckCircle2 className="w-6 h-6" /> 
                        : <XCircle className="w-6 h-6" />
                      }
                      {(currentQuestion.type === 'MCQ' 
                        ? String.fromCharCode(65 + currentQuestion.options.indexOf(selectedOption!)) === currentQuestion.correctAnswer
                        : selectedOption === currentQuestion.correctAnswer)
                        ? "Correct Answer!" 
                        : "Incorrect Answer"}
                    </div>

                    <div className="bg-brand-light/40 rounded-2xl p-6 mb-8">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-brand-dark mb-2">Detailed Explanation</p>
                          <p className="text-brand-muted leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
                    >
                      {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <p className="font-bold text-brand-dark text-sm mb-1">Study Tip</p>
              <p className="text-xs text-brand-muted">Read the explanation carefully even if you got the answer right to reinforce your learning.</p>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-brand-dark text-sm mb-1">Mastery Goal</p>
              <p className="text-xs text-brand-muted">Aim for a score of 90% or higher to demonstrate professional proficiency in this module.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTTopicQuiz;
