import { z } from 'zod';

// === Course Level ===
export const CourseLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);
export type CourseLevel = z.infer<typeof CourseLevelSchema>;

// === Pricing Tier ===
export const PricingTierSchema = z.enum([
  'free',
  'pro',
  'mentorship',
  'lifetime',
]);
export type PricingTier = z.infer<typeof PricingTierSchema>;

// === Course Metadata ===
export const CourseMetadataSchema = z.object({
  level: CourseLevelSchema,
  duration_minutes: z.number().int().min(1),
  lesson_count: z.number().int().min(1),
  module_count: z.number().int().min(1),
  language: z.enum(['he', 'en']).default('he'),
  direction: z.enum(['rtl', 'ltr']).default('rtl'),
});
export type CourseMetadata = z.infer<typeof CourseMetadataSchema>;

// === Equipment ===
export const EquipmentSchema = z.object({
  required: z.array(z.string()),
  recommended: z.array(z.string()).optional(),
});
export type Equipment = z.infer<typeof EquipmentSchema>;

// === Completion Requirements ===
export const CompletionSchema = z.object({
  quizzes_required: z.boolean(),
  min_quiz_score: z.number().int().min(0).max(100),
  exercises_min: z.number().int().min(0),
  certificate: z.boolean(),
});
export type Completion = z.infer<typeof CompletionSchema>;

// === Course Description ===
export const CourseDescriptionSchema = z.object({
  short: z.string().min(10),
  full: z.string().min(20),
});
export type CourseDescription = z.infer<typeof CourseDescriptionSchema>;

// === Full Course ===
export const CourseSchema = z.object({
  id: z.string().regex(/^[0-9]{2}-[a-z-]+$/),
  title: z.string().min(2),
  slug: z.string().regex(/^[a-z][a-z0-9-]*$/),
  version: z.string().regex(/^[0-9]+\.[0-9]+\.[0-9]+$/),
  description: CourseDescriptionSchema,
  metadata: CourseMetadataSchema,
  prerequisites: z.array(z.string()),
  equipment: EquipmentSchema,
  learning_objectives: z.array(z.string()).min(1),
  completion: CompletionSchema,
  tags: z.array(z.string()),
  modules: z.array(z.string()),
  pricing_tier: PricingTierSchema,
});
export type Course = z.infer<typeof CourseSchema>;

// === Lesson Frontmatter ===
export const LessonFrontmatterSchema = z.object({
  title: z.string().min(2),
  slug: z.string(),
  order: z.number().int().min(1),
  duration_minutes: z.number().int().min(1),
  difficulty: CourseLevelSchema.optional(),
  prerequisites: z.array(z.string()).optional(),
  learning_objectives: z.array(z.string()).optional(),
  key_terms: z
    .array(
      z.object({
        term: z.string(),
        definition: z.string(),
      })
    )
    .optional(),
  audio_examples: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
      })
    )
    .optional(),
});
export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;

// === Module ===
export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number().int(),
  lessons: z.array(z.string()),
  quiz: z.string().optional(),
});
export type Module = z.infer<typeof ModuleSchema>;
