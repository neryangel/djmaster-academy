import type { APIRoute } from 'astro';
import { z } from 'zod';

// Valid event types
const EventTypeSchema = z.enum([
  'page_view',
  'tool_use',
  'quiz_attempt',
  'lesson_start',
  'lesson_complete',
  'badge_earned',
  'level_up',
  'xp_earned',
  'course_start',
  'course_complete',
  'audio_played',
  'midi_connected',
  'settings_changed',
  'error',
]);

type EventType = z.infer<typeof EventTypeSchema>;

// Schema for analytics event
const AnalyticsEventSchema = z.object({
  eventName: EventTypeSchema,
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  properties: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime().optional(),
  userAgent: z.string().optional(),
  locale: z.string().optional(),
});

type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

interface AnalyticsResponse {
  success: boolean;
  eventId: string;
  received: string;
}

// Generate unique event ID
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Format log output for different environments
function logEvent(event: AnalyticsEvent): void {
  const logData = {
    eventId: generateEventId(),
    timestamp: event.timestamp || new Date().toISOString(),
    event: event.eventName,
    userId: event.userId || 'anonymous',
    properties: event.properties || {},
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[ANALYTICS]', JSON.stringify(logData, null, 2));
  } else {
    // In production, would send to analytics service
    console.log('[ANALYTICS]', JSON.stringify(logData));
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate event
    const event = AnalyticsEventSchema.parse(body);

    // Add current timestamp if not provided
    const eventWithTimestamp: AnalyticsEvent = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    };

    // Log event
    logEvent(eventWithTimestamp);

    // In production, would queue for batch processing
    // For now, just acknowledge receipt
    const eventId = generateEventId();

    const response: AnalyticsResponse = {
      success: true,
      eventId,
      received: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: 'Invalid event data',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.error('POST /api/analytics error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process event',
        code: 'PROCESSING_ERROR',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// GET: Health check for analytics endpoint
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'analytics',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
