import { z } from 'zod';

// === Question Types ===
export const QuestionTypeSchema = z.enum([
  'multiple_choice',
  'true_false',
  'matching',
  'fill_blank',
  'ordering',
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);
export type Difficulty = z.infer<typeof DifficultySchema>;

// === Matching Pair ===
export const MatchingPairSchema = z.object({
  left: z.string(),
  right: z.string(),
});
export type MatchingPair = z.infer<typeof MatchingPairSchema>;

// === Question ===
export const QuestionSchema = z.object({
  id: z.string(),
  type: QuestionTypeSchema,
  difficulty: DifficultySchema.optional(),
  points: z.number().int().min(1),
  text: z.string().min(5),
  options: z.array(z.string()).optional(),
  correct: z
    .union([
      z.number().int(),
      z.boolean(),
      z.string(),
      z.array(z.union([z.number().int(), z.string()])),
    ])
    .optional(),
  pairs: z.array(MatchingPairSchema).optional(),
  explanation: z.string().optional(),
  related_lesson: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type Question = z.infer<typeof QuestionSchema>;

// === Quiz Settings ===
export const QuizSettingsSchema = z.object({
  shuffle_questions: z.boolean().default(false),
  shuffle_options: z.boolean().default(false),
  show_correct_answer: z.boolean().default(true),
  show_explanation: z.boolean().default(true),
  max_attempts: z.number().int().min(1).max(10),
  passing_score: z.number().int().min(0).max(100),
  time_limit_minutes: z
    .union([z.number().int().min(1), z.null()])
    .optional(),
});
export type QuizSettings = z.infer<typeof QuizSettingsSchema>;

// === Full Quiz ===
export const QuizSchema = z.object({
  module: z.string().regex(/^[0-9]{2}-[a-z-]+$/),
  course: z.string().regex(/^[0-9]{2}-[a-z-]+$/).optional(),
  type: z.enum(['module-quiz', 'final-quiz', 'practice']).optional(),
  version: z.string().regex(/^[0-9]+\.[0-9]+\.[0-9]+$/),
  settings: QuizSettingsSchema,
  questions: z.array(QuestionSchema).min(3),
});
export type Quiz = z.infer<typeof QuizSchema>;

// === Quiz Result (runtime state) ===
export interface QuizAttempt {
  quizId: string;
  userId: string;
  answers: Record<string, unknown>;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  completedAt: Date;
  timeSpentSeconds: number;
}
