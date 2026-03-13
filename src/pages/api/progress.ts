import type { APIRoute } from 'astro';
import { z } from 'zod';
import type { UserProgress } from '../../types/gamification';

// Schema for progress validation
const ProgressSchema = z.object({
  userId: z.string().min(1),
  xp: z.number().int().min(0),
  level: z.number().int().min(1).max(10),
  badges: z.array(z.string()),
  completedLessons: z.array(z.string()),
  completedCourses: z.array(z.string()),
  quizResults: z.record(
    z.object({
      score: z.number().int().min(0).max(100),
      attempts: z.number().int().min(1),
    })
  ),
  streak: z.object({
    current: z.number().int().min(0),
    longest: z.number().int().min(0),
    lastActivity: z.string(),
  }),
  toolUsage: z.record(
    z.object({
      firstUsed: z.string(),
      uses: z.number().int().min(0),
    })
  ),
  joinedAt: z.string(),
});

type ProgressInput = z.infer<typeof ProgressSchema>;

// GET: Retrieve user progress
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Missing userId parameter',
          code: 'MISSING_USER_ID',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // In a real app, fetch from database
    // For now, return mock data
    const mockProgress: UserProgress = {
      userId,
      xp: 2500,
      level: 3,
      badges: ['first-lesson', 'beat-detective'],
      completedLessons: ['01-world-of-dj', '02-history-equipment'],
      completedCourses: [],
      quizResults: {
        'quiz-01': { score: 85, attempts: 2 },
        'quiz-02': { score: 92, attempts: 1 },
      },
      streak: {
        current: 5,
        longest: 12,
        lastActivity: new Date().toISOString(),
      },
      toolUsage: {
        'bpm-calculator': {
          firstUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          uses: 23,
        },
      },
      joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return new Response(JSON.stringify(mockProgress), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/progress error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// POST: Save/update user progress
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate against schema
    const validated = ProgressSchema.parse(body);

    // In a real app, save to database
    // For now, just validate and return success
    console.log('Saving progress for user:', validated.userId, {
      level: validated.level,
      xp: validated.xp,
      badges: validated.badges.length,
    });

    return new Response(
      JSON.stringify({
        success: true,
        userId: validated.userId,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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

    console.error('POST /api/progress error:', error);
    return new Response(
      JSON.stringify({
        error: 'Invalid request body',
        code: 'INVALID_BODY',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
