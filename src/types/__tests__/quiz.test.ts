import { describe, it, expect } from 'vitest';
import { QuizSchema, QuestionSchema } from '../quiz';

describe('QuestionSchema', () => {
  it('should validate a multiple choice question', () => {
    const question = {
      id: 'q1',
      type: 'multiple_choice',
      difficulty: 'beginner',
      points: 10,
      text: 'מה תפקיד ה-Crossfader?',
      options: ['שליטה על ווליום', 'מעבר בין דקים', 'שינוי BPM', 'הוספת אפקטים'],
      correct: 'מעבר בין דקים',
      explanation: 'ה-Crossfader מאפשר מעבר חלק בין שני ערוצי שמע',
      tags: ['equipment', 'mixer'],
    };

    const result = QuestionSchema.safeParse(question);
    expect(result.success).toBe(true);
  });

  it('should validate a true/false question', () => {
    const question = {
      id: 'q2',
      type: 'true_false',
      difficulty: 'beginner',
      points: 5,
      text: 'DJ חייב לדעת לנגן על כלי נגינה',
      correct: false,
      tags: ['basics'],
    };

    const result = QuestionSchema.safeParse(question);
    expect(result.success).toBe(true);
  });

  it('should reject invalid difficulty', () => {
    const question = {
      id: 'q3',
      type: 'multiple_choice',
      difficulty: 'expert', // invalid
      points: 10,
      text: 'Test',
      tags: [],
    };

    const result = QuestionSchema.safeParse(question);
    expect(result.success).toBe(false);
  });

  it('should reject negative points', () => {
    const question = {
      id: 'q4',
      type: 'true_false',
      difficulty: 'beginner',
      points: -5, // invalid
      text: 'Test',
      tags: [],
    };

    const result = QuestionSchema.safeParse(question);
    expect(result.success).toBe(false);
  });
});

describe('QuizSchema', () => {
  it('should validate a complete quiz', () => {
    const quiz = {
      quiz_id: 'quiz-01-01',
      title: 'בוחן: מהו DJ?',
      description: 'בוחן על השיעור הראשון',
      course_id: '01-world-of-dj',
      module_id: '01-what-is-dj',
      settings: {
        shuffle_questions: true,
        shuffle_options: true,
        max_attempts: 3,
        passing_score: 70,
      },
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice' as const,
          difficulty: 'beginner' as const,
          points: 10,
          text: 'מה המשמעות של DJ?',
          options: ['Disc Jockey', 'Digital Jockey', 'Dance Jockey', 'Drive Jockey'],
          correct: 'Disc Jockey',
          tags: ['basics'],
        },
      ],
    };

    const result = QuizSchema.safeParse(quiz);
    expect(result.success).toBe(true);
  });

  it('should require at least quiz_id and title', () => {
    const result = QuizSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
