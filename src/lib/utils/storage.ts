/**
 * Type-safe localStorage wrapper with JSON serialization
 */

export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(`djmaster:${key}`);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`djmaster:${key}`, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`djmaster:${key}`);
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('djmaster:')) {
      keys.push(key);
    }
  }
  keys.forEach(key => localStorage.removeItem(key));
}

/**
 * Course completion tracking
 */
export function markLessonComplete(courseId: string, lessonId: string): void {
  const completedKey = `completed:${courseId}`;
  const completed = getItem<string[]>(completedKey, []);
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    setItem(completedKey, completed);
  }
}

export function isLessonComplete(courseId: string, lessonId: string): boolean {
  const completed = getItem<string[]>(`completed:${courseId}`, []);
  return completed.includes(lessonId);
}

export function getCourseProgress(courseId: string, totalLessons: number): number {
  const completed = getItem<string[]>(`completed:${courseId}`, []);
  return totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 0;
}

/**
 * Quiz results storage
 */
interface QuizResult {
  quizId: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  completedAt: string;
}

export function saveQuizResult(result: QuizResult): void {
  const results = getItem<QuizResult[]>(`quiz-results:${result.quizId}`, []);
  results.push(result);
  setItem(`quiz-results:${result.quizId}`, results);
}

export function getQuizResults(quizId: string): QuizResult[] {
  return getItem<QuizResult[]>(`quiz-results:${quizId}`, []);
}

export function getBestQuizScore(quizId: string): number {
  const results = getQuizResults(quizId);
  return results.length > 0 ? Math.max(...results.map(r => r.score)) : 0;
}
