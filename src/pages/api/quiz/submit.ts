import type { APIRoute } from 'astro';
import { z } from 'zod';
import type { Question, QuestionType } from '../../../types/quiz';

// Schema for quiz submission validation
const QuizSubmissionSchema = z.object({
  quizId: z.string().min(1),
  userId: z.string().min(1),
  answers: z.record(z.unknown()), // answers keyed by questionId
  timeSpentSeconds: z.number().int().min(0).optional(),
});

type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;

interface QuizSubmissionResponse {
  success: boolean;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  details: Array<{
    questionId: string;
    correct: boolean;
    points: number;
  }>;
}

// Mock quiz questions database
const mockQuizzes: Record<string, Question[]> = {
  'quiz-01': [
    {
      id: 'q1',
      type: 'multiple_choice' as QuestionType,
      difficulty: 'easy',
      points: 10,
      text: 'What does BPM stand for?',
      options: ['Beats Per Minute', 'Bytes Per Megabyte', 'Basic Pulse Monitor', 'Band Performance Meter'],
      correct: 0,
    },
    {
      id: 'q2',
      type: 'true_false' as QuestionType,
      difficulty: 'medium',
      points: 10,
      text: 'Harmonic mixing is about mixing songs in the same key.',
      correct: true,
    },
  ],
};

function calculateScore(
  submission: QuizSubmission,
  questions: Question[]
): Omit<QuizSubmissionResponse, 'xpEarned'> {
  const results = [];
  let correctCount = 0;
  let totalScore = 0;
  let totalPoints = 0;

  for (const question of questions) {
    totalPoints += question.points;
    const userAnswer = submission.answers[question.id];
    const isCorrect = checkAnswer(question, userAnswer);

    if (isCorrect) {
      correctCount += 1;
      totalScore += question.points;
    }

    results.push({
      questionId: question.id,
      correct: isCorrect,
      points: isCorrect ? question.points : 0,
    });
  }

  const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;
  const passed = percentage >= 70; // 70% passing score

  return {
    success: true,
    score: totalScore,
    totalPoints,
    percentage,
    passed,
    correctAnswers: correctCount,
    totalQuestions: questions.length,
    details: results,
  };
}

function checkAnswer(question: Question, userAnswer: unknown): boolean {
  if (question.type === 'multiple_choice') {
    return userAnswer === question.correct;
  }

  if (question.type === 'true_false') {
    return userAnswer === question.correct;
  }

  if (question.type === 'fill_blank') {
    // String comparison (case-insensitive)
    const correct = String(question.correct).toLowerCase().trim();
    const user = String(userAnswer || '').toLowerCase().trim();
    return user === correct;
  }

  if (question.type === 'matching') {
    // Check if all pairs match
    if (!Array.isArray(userAnswer) || !Array.isArray(question.correct)) {
      return false;
    }
    return JSON.stringify(userAnswer.sort()) === JSON.stringify((question.correct as number[]).sort());
  }

  if (question.type === 'ordering') {
    // Check if order is correct
    return JSON.stringify(userAnswer) === JSON.stringify(question.correct);
  }

  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate submission
    const submission = QuizSubmissionSchema.parse(body);

    // Get quiz questions (mock for now)
    const questions = mockQuizzes[submission.quizId];

    if (!questions) {
      return new Response(
        JSON.stringify({
          error: 'Quiz not found',
          code: 'QUIZ_NOT_FOUND',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate score
    const scoreResult = calculateScore(submission, questions);

    // Calculate XP earned
    const baseXP = scoreResult.passed ? 100 : 0;
    const performanceBonus = Math.floor((scoreResult.percentage / 100) * 50);
    const xpEarned = baseXP + performanceBonus;

    const response: QuizSubmissionResponse = {
      ...scoreResult,
      xpEarned,
    };

    // Log submission (in real app, save to database)
    console.log('Quiz submitted:', {
      quizId: submission.quizId,
      userId: submission.userId,
      percentage: scoreResult.percentage,
      passed: scoreResult.passed,
      xpEarned,
      timeSpent: submission.timeSpentSeconds,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.error('POST /api/quiz/submit error:', error);
    return new Response(
      JSON.stringify({
        error: 'Invalid request',
        code: 'INVALID_REQUEST',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
