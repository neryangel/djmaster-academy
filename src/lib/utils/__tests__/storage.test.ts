import { describe, it, expect, beforeEach } from 'vitest';
import {
  getItem,
  setItem,
  removeItem,
  clearAll,
  markLessonComplete,
  isLessonComplete,
  getCourseProgress,
  saveQuizResult,
  getQuizResults,
  getBestQuizScore,
} from '../storage';

describe('Storage Utilities', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};

    // Mock localStorage
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index: number) => Object.keys(store)[index] || null,
      length: Object.keys(store).length,
    } as Storage;
  });

  describe('getItem/setItem', () => {
    it('should store and retrieve items with prefix', () => {
      setItem('test-key', { value: 42 });

      const result = getItem('test-key', null);
      expect(result).toEqual({ value: 42 });
    });

    it('should return default value if item not found', () => {
      const result = getItem('nonexistent', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should handle different data types', () => {
      setItem('string', 'hello');
      setItem('number', 123);
      setItem('boolean', true);
      setItem('array', [1, 2, 3]);
      setItem('object', { key: 'value' });

      expect(getItem('string', '')).toBe('hello');
      expect(getItem('number', 0)).toBe(123);
      expect(getItem('boolean', false)).toBe(true);
      expect(getItem('array', [])).toEqual([1, 2, 3]);
      expect(getItem('object', {})).toEqual({ key: 'value' });
    });

    it('should use djmaster prefix in localStorage', () => {
      setItem('test-key', { data: 'value' });

      expect(store['djmaster:test-key']).toBeDefined();
      expect(Object.keys(store)).toContain('djmaster:test-key');
    });

    it('should handle null values', () => {
      setItem('null-key', null);
      const result = getItem('null-key', 'default');
      expect(result).toEqual(null);
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        user: {
          id: '123',
          name: 'Test User',
          scores: [85, 90, 92],
        },
        metadata: {
          created: '2024-01-01',
          tags: ['important', 'urgent'],
        },
      };

      setItem('complex', complexData);
      const result = getItem('complex', {});

      expect(result).toEqual(complexData);
      expect((result as any).user.name).toBe('Test User');
      expect((result as any).metadata.tags).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('should remove items from storage', () => {
      setItem('key-to-remove', 'value');
      expect(getItem('key-to-remove', null)).toBe('value');

      removeItem('key-to-remove');
      expect(getItem('key-to-remove', null)).toBeNull();
    });

    it('should handle removing nonexistent items', () => {
      expect(() => {
        removeItem('nonexistent');
      }).not.toThrow();
    });
  });

  describe('clearAll', () => {
    it('should remove all djmaster items', () => {
      setItem('item1', 'value1');
      setItem('item2', 'value2');
      setItem('item3', 'value3');

      expect(Object.keys(store).length).toBeGreaterThan(0);

      clearAll();

      expect(getItem('item1', null)).toBeNull();
      expect(getItem('item2', null)).toBeNull();
      expect(getItem('item3', null)).toBeNull();
    });

    it('should not affect non-djmaster items', () => {
      store['other:key'] = JSON.stringify('external-value');
      setItem('djmaster-key', 'value');

      clearAll();

      expect(store['other:key']).toBe(JSON.stringify('external-value'));
    });
  });

  describe('markLessonComplete/isLessonComplete', () => {
    it('should mark lessons as complete', () => {
      markLessonComplete('course-01', 'lesson-01');

      expect(isLessonComplete('course-01', 'lesson-01')).toBe(true);
    });

    it('should handle multiple lessons in same course', () => {
      markLessonComplete('course-01', 'lesson-01');
      markLessonComplete('course-01', 'lesson-02');
      markLessonComplete('course-01', 'lesson-03');

      expect(isLessonComplete('course-01', 'lesson-01')).toBe(true);
      expect(isLessonComplete('course-01', 'lesson-02')).toBe(true);
      expect(isLessonComplete('course-01', 'lesson-03')).toBe(true);
      expect(isLessonComplete('course-01', 'lesson-04')).toBe(false);
    });

    it('should not mark same lesson twice', () => {
      markLessonComplete('course-01', 'lesson-01');
      markLessonComplete('course-01', 'lesson-01');

      const completed = getItem('completed:course-01', []);
      expect(completed).toHaveLength(1);
    });

    it('should handle different courses independently', () => {
      markLessonComplete('course-01', 'lesson-01');
      markLessonComplete('course-02', 'lesson-01');

      expect(isLessonComplete('course-01', 'lesson-01')).toBe(true);
      expect(isLessonComplete('course-02', 'lesson-01')).toBe(true);
      expect(isLessonComplete('course-01', 'lesson-02')).toBe(false);
      expect(isLessonComplete('course-02', 'lesson-02')).toBe(false);
    });

    it('should return false for incomplete lessons', () => {
      expect(isLessonComplete('course-01', 'lesson-01')).toBe(false);
    });
  });

  describe('getCourseProgress', () => {
    it('should calculate progress percentage', () => {
      markLessonComplete('course-01', 'lesson-01');
      markLessonComplete('course-01', 'lesson-02');

      const progress = getCourseProgress('course-01', 4);
      expect(progress).toBe(50); // 2 out of 4 = 50%
    });

    it('should return 0 for no completed lessons', () => {
      const progress = getCourseProgress('course-01', 5);
      expect(progress).toBe(0);
    });

    it('should return 100 for all completed lessons', () => {
      for (let i = 1; i <= 5; i++) {
        markLessonComplete('course-01', `lesson-${i}`);
      }

      const progress = getCourseProgress('course-01', 5);
      expect(progress).toBe(100);
    });

    it('should round to nearest whole number', () => {
      markLessonComplete('course-01', 'lesson-01');

      const progress = getCourseProgress('course-01', 3); // 1/3 = 33.33%
      expect(progress).toBe(33);
    });

    it('should handle 0 total lessons', () => {
      const progress = getCourseProgress('course-01', 0);
      expect(progress).toBe(0);
    });

    it('should handle more completed lessons than total', () => {
      for (let i = 1; i <= 5; i++) {
        markLessonComplete('course-01', `lesson-${i}`);
      }

      const progress = getCourseProgress('course-01', 3);
      expect(progress).toBe(100); // At least 100% when all are done
    });
  });

  describe('saveQuizResult/getQuizResults', () => {
    it('should save quiz results', () => {
      const result = {
        quizId: 'quiz-01',
        score: 85,
        passed: true,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      };

      saveQuizResult(result);

      const results = getQuizResults('quiz-01');
      expect(results).toHaveLength(1);
      expect(results[0]!.score).toBe(85);
      expect(results[0]!.passed).toBe(true);
    });

    it('should save multiple quiz results for same quiz', () => {
      const result1 = {
        quizId: 'quiz-01',
        score: 70,
        passed: false,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      };

      const result2 = {
        quizId: 'quiz-01',
        score: 90,
        passed: true,
        attemptNumber: 2,
        completedAt: new Date().toISOString(),
      };

      saveQuizResult(result1);
      saveQuizResult(result2);

      const results = getQuizResults('quiz-01');
      expect(results).toHaveLength(2);
      expect(results[0]!.score).toBe(70);
      expect(results[1]!.score).toBe(90);
    });

    it('should return empty array for nonexistent quiz', () => {
      const results = getQuizResults('nonexistent-quiz');
      expect(results).toEqual([]);
    });

    it('should keep results separate by quiz ID', () => {
      const result1 = {
        quizId: 'quiz-01',
        score: 80,
        passed: true,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      };

      const result2 = {
        quizId: 'quiz-02',
        score: 75,
        passed: true,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      };

      saveQuizResult(result1);
      saveQuizResult(result2);

      expect(getQuizResults('quiz-01')).toHaveLength(1);
      expect(getQuizResults('quiz-02')).toHaveLength(1);
      expect(getQuizResults('quiz-01')[0]!.quizId).toBe('quiz-01');
      expect(getQuizResults('quiz-02')[0]!.quizId).toBe('quiz-02');
    });
  });

  describe('getBestQuizScore', () => {
    it('should return highest score', () => {
      saveQuizResult({
        quizId: 'quiz-01',
        score: 70,
        passed: false,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      });

      saveQuizResult({
        quizId: 'quiz-01',
        score: 95,
        passed: true,
        attemptNumber: 2,
        completedAt: new Date().toISOString(),
      });

      saveQuizResult({
        quizId: 'quiz-01',
        score: 85,
        passed: true,
        attemptNumber: 3,
        completedAt: new Date().toISOString(),
      });

      const best = getBestQuizScore('quiz-01');
      expect(best).toBe(95);
    });

    it('should return 0 for nonexistent quiz', () => {
      const best = getBestQuizScore('nonexistent-quiz');
      expect(best).toBe(0);
    });

    it('should return single score if only one attempt', () => {
      saveQuizResult({
        quizId: 'quiz-02',
        score: 88,
        passed: true,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      });

      const best = getBestQuizScore('quiz-02');
      expect(best).toBe(88);
    });

    it('should handle perfect scores', () => {
      saveQuizResult({
        quizId: 'quiz-03',
        score: 100,
        passed: true,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      });

      const best = getBestQuizScore('quiz-03');
      expect(best).toBe(100);
    });
  });

  describe('Integration scenarios', () => {
    it('should track course progress with completed lessons', () => {
      const totalLessons = 5;

      markLessonComplete('course-01', 'lesson-01');
      expect(getCourseProgress('course-01', totalLessons)).toBe(20);

      markLessonComplete('course-01', 'lesson-02');
      expect(getCourseProgress('course-01', totalLessons)).toBe(40);

      markLessonComplete('course-01', 'lesson-03');
      expect(getCourseProgress('course-01', totalLessons)).toBe(60);

      for (let i = 4; i <= 5; i++) {
        markLessonComplete('course-01', `lesson-${i}`);
      }
      expect(getCourseProgress('course-01', totalLessons)).toBe(100);
    });

    it('should maintain separate data for different courses', () => {
      markLessonComplete('course-01', 'lesson-01');
      markLessonComplete('course-02', 'lesson-01');
      markLessonComplete('course-02', 'lesson-02');

      expect(getCourseProgress('course-01', 2)).toBe(50);
      expect(getCourseProgress('course-02', 3)).toBe(67); // 2/3 = 66.67%
    });

    it('should track quiz results and course progress together', () => {
      // Complete lessons
      markLessonComplete('course-01', 'lesson-01');
      markLessonComplete('course-01', 'lesson-02');

      // Save quiz results
      saveQuizResult({
        quizId: 'quiz-01',
        score: 85,
        passed: true,
        attemptNumber: 1,
        completedAt: new Date().toISOString(),
      });

      // Verify both are stored correctly
      expect(getCourseProgress('course-01', 4)).toBe(50);
      expect(getBestQuizScore('quiz-01')).toBe(85);
      expect(getQuizResults('quiz-01')).toHaveLength(1);
    });
  });
});
