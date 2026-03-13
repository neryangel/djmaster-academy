import { defineCollection, z } from 'astro:content';

// Course collection - reads from 01-courses/*/course.yaml
const courses = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    version: z.string(),
    description: z.object({
      short: z.string(),
      full: z.string(),
    }),
    metadata: z.object({
      level: z.enum(['beginner', 'intermediate', 'advanced']),
      duration_minutes: z.number(),
      lesson_count: z.number(),
      module_count: z.number(),
      language: z.string().default('he'),
      direction: z.string().default('rtl'),
    }),
    prerequisites: z.array(z.string()).default([]),
    equipment: z.object({
      required: z.array(z.string()),
      recommended: z.array(z.string()).default([]),
    }),
    learning_objectives: z.array(z.string()),
    completion: z.object({
      quizzes_required: z.boolean().default(true),
      min_quiz_score: z.number().default(70),
      exercises_min: z.number().default(3),
      certificate: z.boolean().default(true),
    }),
    tags: z.array(z.string()).default([]),
    modules: z.array(z.string()),
    pricing_tier: z.enum(['free', 'pro', 'mentorship', 'lifetime']).default('free'),
  }),
});

// Lessons collection - reads markdown files
const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lesson_number: z.number(),
    module_id: z.string(),
    course_id: z.string(),
    duration_minutes: z.number().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    audio_examples: z.array(z.object({
      title: z.string(),
      url: z.string(),
      description: z.string().optional(),
    })).optional(),
    key_terms: z.array(z.object({
      term: z.string(),
      definition: z.string(),
    })).optional(),
    learning_objectives: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

// Quizzes collection
const quizzes = defineCollection({
  type: 'data',
  schema: z.object({
    quiz_id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    course_id: z.string(),
    module_id: z.string(),
    settings: z.object({
      shuffle_questions: z.boolean().default(true),
      shuffle_options: z.boolean().default(true),
      max_attempts: z.number().default(3),
      passing_score: z.number().default(70),
      time_limit_minutes: z.number().nullable().optional(),
    }).optional(),
    questions: z.array(z.object({
      id: z.string(),
      type: z.enum(['multiple_choice', 'true_false', 'matching', 'fill_blank', 'ordering']),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      points: z.number().default(10),
      text: z.string(),
      options: z.array(z.string()).optional(),
      correct: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
      pairs: z.array(z.object({ left: z.string(), right: z.string() })).optional(),
      explanation: z.string().optional(),
      tags: z.array(z.string()).default([]),
    })),
  }),
});

export const collections = { courses, lessons, quizzes };
