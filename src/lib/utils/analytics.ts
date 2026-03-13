/**
 * Analytics wrapper — abstracted for future integration
 * Currently logs to console in dev, can be swapped for any analytics provider
 */

type EventName =
  | 'page_view'
  | 'course_start'
  | 'course_complete'
  | 'lesson_start'
  | 'lesson_complete'
  | 'quiz_start'
  | 'quiz_complete'
  | 'quiz_pass'
  | 'quiz_fail'
  | 'tool_open'
  | 'tool_use'
  | 'badge_earned'
  | 'level_up'
  | 'xp_earned'
  | 'audio_play'
  | 'midi_connect';

interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
}

const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
const eventQueue: AnalyticsEvent[] = [];

export function trackEvent(name: EventName, properties?: Record<string, string | number | boolean>): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  eventQueue.push(event);

  if (isDev) {
    console.log(`[Analytics] ${name}`, properties ?? '');
  }

  // Future: send to analytics provider
  // sendToProvider(event);
}

export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', { path, title: title ?? '' });
}

export function trackToolUsage(toolName: string, action: string): void {
  trackEvent('tool_use', { tool: toolName, action });
}

export function trackCourseProgress(courseId: string, action: 'start' | 'complete'): void {
  trackEvent(action === 'start' ? 'course_start' : 'course_complete', { courseId });
}

export function getEventQueue(): readonly AnalyticsEvent[] {
  return eventQueue;
}

export function clearEventQueue(): void {
  eventQueue.length = 0;
}
