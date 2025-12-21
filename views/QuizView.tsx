import React, { useState } from 'react';
import { BrainCircuit, Check, X, RefreshCw, ChevronRight } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { QuizState } from '../types';

interface QuizViewProps {
  onOpenApiKeyModal: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ onOpenApiKeyModal }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    isActive: false,
    isFinished: false,
    selectedAnswer: null
  });

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await generateQuiz(topic);
      if (data && data.questions && data.questions.length > 0) {
        setQuizState({
          questions: data.questions,
          currentQuestionIndex: 0,
          score: 0,
          isActive: true,
          isFinished: false,
          selectedAnswer: null
        });
      }
    } catch (e: any) {
      if (e.message === 'API_KEY_MISSING' || e.message?.includes('429')) {
         onOpenApiKeyModal();
         alert("API Key missing or quota exceeded. Please configure your key in the popup.");
      } else {
         alert(`Failed to generate quiz: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (quizState.selectedAnswer !== null) return; // Prevent multi-click

    const currentQ = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = index === currentQ.correctAnswer;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: index,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const nextQuestion = () => {
    const isLast = quizState.currentQuestionIndex === quizState.questions.length - 1;
    if (isLast) {
      setQuizState(prev => ({ ...prev, isFinished: true, isActive: false }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedAnswer: null
      }));
    }
  };

  const reset = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      isActive: false,
      isFinished: false,
      selectedAnswer: null
    });
    setTopic('');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      {/* Setup Phase */}
      {!quizState.isActive && !quizState.isFinished && (
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full text-center">
          <div className="w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
            <BrainCircuit className="text-indigo-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Training Simulation</h2>
          <p className="text-slate-400 mb-8">Test your knowledge. Enter a domain (e.g., "SQL Injection", "Network Forensics", "Active Directory").</p>
          
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic..."
            className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center"
          />
          
          <button
            onClick={startQuiz}
            disabled={loading || !topic}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              loading || !topic 
                ? 'bg-slate-800 text-slate-600' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {loading ? 'Generating Scenario...' : 'Initialize Simulation'}
          </button>
        </div>
      )}

      {/* Quiz Phase */}
      {quizState.isActive && (
        <div className="w-full">
          <div className="mb-4 flex justify-between text-xs font-mono text-slate-400 uppercase tracking-widest">
            <span>Question {quizState.currentQuestionIndex + 1}/{quizState.questions.length}</span>
            <span>Score: {quizState.score}</span>
          </div>
          
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full">
            <h3 className="text-xl font-semibold text-slate-100 mb-6 leading-relaxed">
              {quizState.questions[quizState.currentQuestionIndex].question}
            </h3>

            <div className="space-y-3">
              {quizState.questions[quizState.currentQuestionIndex].options.map((opt, idx) => {
                const isSelected = quizState.selectedAnswer === idx;
                const isCorrect = quizState.questions[quizState.currentQuestionIndex].correctAnswer === idx;
                const reveal = quizState.selectedAnswer !== null;

                let btnClass = "bg-slate-800 border-slate-700 hover:bg-slate-750";
                if (reveal) {
                   if (isCorrect) btnClass = "bg-emerald-900/50 border-emerald-500 text-emerald-200";
                   else if (isSelected) btnClass = "bg-red-900/50 border-red-500 text-red-200";
                   else btnClass = "bg-slate-800 border-slate-700 opacity-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={reveal}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {reveal && isCorrect && <Check size={18} className="text-emerald-400" />}
                    {reveal && isSelected && !isCorrect && <X size={18} className="text-red-400" />}
                  </button>
                );
              })}
            </div>

            {quizState.selectedAnswer !== null && (
              <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-sm text-slate-400 mb-4">
                  <strong className="text-indigo-400">Analysis: </strong> 
                  {quizState.questions[quizState.currentQuestionIndex].explanation}
                </p>
                <button
                  onClick={nextQuestion}
                  className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-lg hover:bg-white flex items-center justify-center gap-2"
                >
                   Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Phase */}
      {quizState.isFinished && (
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Simulation Complete</h2>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 my-6">
            {Math.round((quizState.score / quizState.questions.length) * 100)}%
          </div>
          <p className="text-slate-400 mb-8">
            You answered {quizState.score} out of {quizState.questions.length} correctly.
          </p>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600 transition-all"
          >
            <RefreshCw size={18} /> Restart Simulation
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;