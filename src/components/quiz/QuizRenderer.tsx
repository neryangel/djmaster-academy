import { useState, useMemo } from 'react';

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'matching' | 'fill_blank' | 'ordering';
  text: string;
  points: number;
  options?: string[];
  correct?: number | boolean | string | (number | string)[];
  pairs?: { left: string; right: string }[];
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface QuizData {
  module: string;
  version: string;
  settings: {
    shuffle_questions: boolean;
    shuffle_options: boolean;
    show_correct_answer: boolean;
    show_explanation: boolean;
    max_attempts: number;
    passing_score: number;
    time_limit_minutes: number | null;
  };
  questions: QuizQuestion[];
}

interface QuizRendererProps {
  quiz: QuizData;
  onComplete?: (score: number, total: number, passed: boolean) => void;
}

export default function QuizRenderer({ quiz, onComplete }: QuizRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = useMemo(() => {
    const q = [...quiz.questions];
    if (quiz.settings.shuffle_questions) {
      for (let i = q.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [q[i]!, q[j]!] = [q[j]!, q[i]!];
      }
    }
    return q;
  }, [quiz]);

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return <div>אין שאלות</div>;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAnswer = (answer: unknown) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const isCorrect = (question: QuizQuestion, answer: unknown): boolean => {
    if (question.type === 'true_false') return answer === question.correct;
    if (question.type === 'multiple_choice') return answer === question.correct;
    if (question.type === 'fill_blank') {
      return String(answer).toLowerCase().trim() === String(question.correct).toLowerCase().trim();
    }
    return false;
  };

  const calculateScore = (): { score: number; total: number; passed: boolean } => {
    let score = 0;
    for (const q of questions) {
      if (answers[q.id] !== undefined && isCorrect(q, answers[q.id])) {
        score += q.points;
      }
    }
    const percentage = Math.round((score / totalPoints) * 100);
    return { score, total: totalPoints, passed: percentage >= quiz.settings.passing_score };
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const result = calculateScore();
      setShowResults(true);
      onComplete?.(result.score, result.total, result.passed);
    }
  };

  const handlePrevious = () => {
    setShowExplanation(false);
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (showResults) {
    const { score, total, passed } = calculateScore();
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="max-w-lg mx-auto p-6 text-center font-hebrew" dir="rtl">
        <div className="text-6xl mb-4">{passed ? '🏆' : '💪'}</div>
        <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-dj-green' : 'text-dj-orange'}`}>
          {passed ? 'עברת בהצלחה!' : 'כמעט שם!'}
        </h2>
        <div className="text-4xl font-mono font-bold text-white my-4">{percentage}%</div>
        <p className="text-gray-400 mb-2">
          {score} מתוך {total} נקודות
        </p>
        <p className="text-sm text-gray-500 mb-6">
          ציון עובר: {quiz.settings.passing_score}%
        </p>

        {/* Per-question breakdown */}
        <div className="space-y-2 mt-6 text-right">
          {questions.map((q, i) => {
            const correct = answers[q.id] !== undefined && isCorrect(q, answers[q.id]);
            return (
              <div key={q.id} className="flex items-center gap-3 p-3 bg-dj-card rounded-lg">
                <span className={correct ? 'text-dj-green' : 'text-dj-accent'}>
                  {correct ? '✓' : '✗'}
                </span>
                <span className="text-sm text-gray-300 flex-1 truncate">{q.text}</span>
                <span className="text-xs font-mono text-gray-500">
                  {correct ? q.points : 0}/{q.points}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-lg mx-auto p-6 font-hebrew" dir="rtl">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>שאלה {currentIndex + 1} מתוך {questions.length}</span>
          <span className="font-mono">{currentQuestion.points} נק'</span>
        </div>
        <div className="h-2 bg-dj-card rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-dj-primary to-dj-cyan rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Difficulty badge */}
      {currentQuestion.difficulty && (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
          currentQuestion.difficulty === 'easy' ? 'bg-dj-green/10 text-dj-green' :
          currentQuestion.difficulty === 'medium' ? 'bg-dj-orange/10 text-dj-orange' :
          'bg-dj-accent/10 text-dj-accent'
        }`}>
          {{ easy: 'קל', medium: 'בינוני', hard: 'קשה' }[currentQuestion.difficulty]}
        </span>
      )}

      {/* Question text */}
      <h3 className="text-lg font-bold text-white mb-6">{currentQuestion.text}</h3>

      {/* Answer area */}
      {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
        <div className="space-y-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full p-4 text-right rounded-xl border transition-all
                ${currentAnswer === i
                  ? 'border-dj-primary bg-dj-primary/15 text-white'
                  : 'border-dj-border bg-dj-card text-gray-300 hover:border-dj-primary/50'
                }`}
            >
              <span className="font-mono text-dj-primary/60 ml-3">{String.fromCharCode(1488 + i)}.</span>
              {option}
            </button>
          ))}
        </div>
      )}

      {currentQuestion.type === 'true_false' && (
        <div className="flex gap-4">
          {[{ value: true, label: 'נכון ✓' }, { value: false, label: 'לא נכון ✗' }].map(({ value, label }) => (
            <button
              key={String(value)}
              onClick={() => handleAnswer(value)}
              className={`flex-1 p-4 rounded-xl border text-center font-bold transition-all
                ${currentAnswer === value
                  ? 'border-dj-primary bg-dj-primary/15 text-white'
                  : 'border-dj-border bg-dj-card text-gray-300 hover:border-dj-primary/50'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {currentQuestion.type === 'fill_blank' && (
        <input
          type="text"
          value={String(currentAnswer ?? '')}
          onChange={(e) => handleAnswer(e.target.value)}
          placeholder="הקלד תשובה..."
          className="w-full p-4 bg-dj-card border border-dj-border rounded-xl
                     text-white placeholder-gray-500 focus:border-dj-cyan focus:outline-none"
          dir="rtl"
        />
      )}

      {/* Explanation toggle */}
      {quiz.settings.show_explanation && currentQuestion.explanation && showExplanation && (
        <div className="mt-4 p-4 bg-dj-panel/50 border border-dj-cyan/20 rounded-xl">
          <p className="text-sm text-dj-cyan">💡 הסבר:</p>
          <p className="text-sm text-gray-300 mt-1">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-5 py-2 bg-dj-card border border-dj-border rounded-full
                     text-gray-400 hover:text-white disabled:opacity-30
                     disabled:cursor-not-allowed transition-all"
        >
          → הקודם
        </button>
        <button
          onClick={handleNext}
          disabled={currentAnswer === undefined}
          className="px-5 py-2 bg-gradient-to-r from-dj-primary to-dj-purple
                     text-white rounded-full font-bold
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:shadow-[0_0_20px_rgba(108,99,255,0.3)]
                     transition-all"
        >
          {currentIndex === questions.length - 1 ? 'סיים בחינה ✓' : 'הבא ←'}
        </button>
      </div>
    </div>
  );
}
