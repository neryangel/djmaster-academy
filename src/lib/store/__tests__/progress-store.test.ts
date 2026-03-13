import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  $userProgress,
  $isLoggedIn,
  initializeProgress,
  updateProgress,
  resetProgress,
} from '../progress-store';
import type { UserProgress } from '../../../types/gamification';

describe('Progress Store', () => {
  // Mock localStorage
  let store: Record<string, string> = {};

  beforeEach(() => {
    // Clear store before each test
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

    // Reset atoms
    $userProgress.set(null);
    $isLoggedIn.set(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initializeProgress', () => {
    it('should initialize progress from localStorage', () => {
      const mockProgress: UserProgress = {
        userId: 'user-123',
        xp: 1000,
        level: 2,
        badges: ['first-lesson'],
        completedLessons: ['lesson-1'],
        completedCourses: [],
        quizResults: {},
        streak: {
          current: 5,
          longest: 10,
          lastActivity: new Date().toISOString(),
        },
        toolUsage: {},
        joinedAt: new Date().toISOString(),
      };

      // Store progress in localStorage
      store['djmaster-progress'] = JSON.stringify(mockProgress);

      // Initialize
      initializeProgress();

      // Check that progress was loaded
      expect($userProgress.get()).toEqual(mockProgress);
      expect($isLoggedIn.get()).toBe(true);
    });

    it('should handle missing localStorage gracefully', () => {
      initializeProgress();

      expect($userProgress.get()).toBeNull();
      expect($isLoggedIn.get()).toBe(false);
    });

    it('should handle corrupted localStorage data', () => {
      store['djmaster-progress'] = 'invalid json {';

      initializeProgress();

      expect($userProgress.get()).toBeNull();
      expect($isLoggedIn.get()).toBe(false);
    });
  });

  describe('updateProgress', () => {
    it('should update progress correctly', () => {
      const initialProgress: UserProgress = {
        userId: 'user-123',
        xp: 1000,
        level: 2,
        badges: ['first-lesson'],
        completedLessons: ['lesson-1'],
        completedCourses: [],
        quizResults: {},
        streak: {
          current: 5,
          longest: 10,
          lastActivity: new Date().toISOString(),
        },
        toolUsage: {},
        joinedAt: new Date().toISOString(),
      };

      $userProgress.set(initialProgress);

      // Update progress
      updateProgress((prev) => ({
        ...prev,
        xp: 2000,
        level: 3,
      }));

      const updated = $userProgress.get();
      expect(updated).not.toBeNull();
      expect(updated!.xp).toBe(2000);
      expect(updated!.level).toBe(3);
      expect(updated!.userId).toBe('user-123');
    });

    it('should save updated progress to localStorage', () => {
      const initialProgress: UserProgress = {
        userId: 'user-123',
        xp: 1000,
        level: 2,
        badges: [],
        completedLessons: [],
        completedCourses: [],
        quizResults: {},
        streak: {
          current: 0,
          longest: 0,
          lastActivity: new Date().toISOString(),
        },
        toolUsage: {},
        joinedAt: new Date().toISOString(),
      };

      $userProgress.set(initialProgress);

      updateProgress((prev) => ({
        ...prev,
        xp: 1500,
        badges: ['new-badge'],
      }));

      const stored = JSON.parse(store['djmaster-progress'] || '{}');
      expect(stored.xp).toBe(1500);
      expect(stored.badges).toContain('new-badge');
    });

    it('should handle null progress gracefully', () => {
      $userProgress.set(null);

      // Should not throw error
      updateProgress((prev) => ({
        ...prev,
        xp: 2000,
      }));

      expect($userProgress.get()).toBeNull();
    });

    it('should allow complex updates', () => {
      const progress: UserProgress = {
        userId: 'user-123',
        xp: 1000,
        level: 2,
        badges: ['badge-1'],
        completedLessons: ['lesson-1'],
        completedCourses: [],
        quizResults: {
          'quiz-1': { score: 85, attempts: 2 },
        },
        streak: {
          current: 5,
          longest: 10,
          lastActivity: new Date().toISOString(),
        },
        toolUsage: {},
        joinedAt: new Date().toISOString(),
      };

      $userProgress.set(progress);

      updateProgress((prev) => ({
        ...prev,
        xp: prev.xp + 100,
        badges: [...prev.badges, 'badge-2'],
        completedLessons: [...prev.completedLessons, 'lesson-2'],
        quizResults: {
          ...prev.quizResults,
          'quiz-2': { score: 92, attempts: 1 },
        },
      }));

      const updated = $userProgress.get();
      expect(updated!.xp).toBe(1100);
      expect(updated!.badges).toHaveLength(2);
      expect(updated!.completedLessons).toHaveLength(2);
      expect(Object.keys(updated!.quizResults)).toHaveLength(2);
    });
  });

  describe('resetProgress', () => {
    it('should reset progress to initial state', () => {
      const progress: UserProgress = {
        userId: 'user-123',
        xp: 5000,
        level: 5,
        badges: ['badge-1', 'badge-2'],
        completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
        completedCourses: ['course-1'],
        quizResults: {},
        streak: {
          current: 10,
          longest: 20,
          lastActivity: new Date().toISOString(),
        },
        toolUsage: {},
        joinedAt: new Date().toISOString(),
      };

      $userProgress.set(progress);
      $isLoggedIn.set(true);

      // Reset
      resetProgress();

      expect($userProgress.get()).toBeNull();
      expect($isLoggedIn.get()).toBe(false);
    });

    it('should remove progress from localStorage', () => {
      const progress: UserProgress = {
        userId: 'user-123',
        xp: 1000,
        level: 2,
        badges: [],
        completedLessons: [],
        completedCourses: [],
        quizResults: {},
        streak: {
          current: 0,
          longest: 0,
          lastActivity: new Date().toISOString(),
        },
        toolUsage: {},
        joinedAt: new Date().toISOString(),
      };

      $userProgress.set(progress);
      store['djmaster-progress'] = JSON.stringify(progress);

      resetProgress();

      expect(store['djmaster-progress']).toBeUndefined();
    });

    it('should work even if no progress is set', () => {
      // Should not throw error
      expect(() => {
        resetProgress();
      }).not.toThrow();

      expect($userProgress.get()).toBeNull();
      expect($isLoggedIn.get()).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist progress across initializations', () => {
      const progress: UserProgress = {
        userId: 'user-123',
        xp: 2500,
        level: 3,
        badges: ['badge-1'],
        completedLessons: ['lesson-1', 'lesson-2'],
        completedCourses: [],
        quizResults: {
          'quiz-1': { score: 90, attempts: 1 },
        },
        streak: {
          current: 7,
          longest: 15,
          lastActivity: new Date().toISOString(),
        },
        toolUsage: {
          'bpm-calc': { firstUsed: new Date().toISOString(), uses: 5 },
        },
        joinedAt: new Date().toISOString(),
      };

      // First initialization
      $userProgress.set(progress);
      updateProgress((prev) => ({ ...prev, xp: 3000 }));

      const stored = store['djmaster-progress'];
      expect(stored).toBeDefined();

      // Reset atoms
      $userProgress.set(null);
      $isLoggedIn.set(false);

      // Second initialization
      initializeProgress();

      const reloaded = $userProgress.get();
      expect(reloaded).not.toBeNull();
      expect(reloaded!.xp).toBe(3000);
      expect(reloaded!.userId).toBe('user-123');
    });
  });
});
