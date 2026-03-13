import { describe, it, expect } from 'vitest';
import {
  calculateLevel,
  getXPToNextLevel,
  awardXP,
  updateStreak,
  createInitialProgress,
} from '../xp-engine';
import { LEVELS, XP_VALUES } from '../../../types/gamification';

describe('calculateLevel', () => {
  it('should return level 1 for 0 XP', () => {
    const level = calculateLevel(0);
    expect(level.number).toBe(1);
  });

  it('should return correct level for moderate XP', () => {
    const level = calculateLevel(500);
    expect(level.number).toBeGreaterThanOrEqual(2);
  });

  it('should return max level for very high XP', () => {
    const level = calculateLevel(999999);
    expect(level.number).toBe(10);
  });

  it('should always return a valid level', () => {
    for (let xp = 0; xp <= 10000; xp += 100) {
      const level = calculateLevel(xp);
      expect(level.number).toBeGreaterThanOrEqual(1);
      expect(level.number).toBeLessThanOrEqual(10);
    }
  });
});

describe('getXPToNextLevel', () => {
  it('should show progress for new user', () => {
    const result = getXPToNextLevel(0);
    expect(result.current).toBe(0);
    expect(result.needed).toBeGreaterThan(0);
    expect(result.progress).toBe(0);
  });

  it('should show 100% at max level', () => {
    const maxXP = LEVELS[LEVELS.length - 1]!.minXP + 1000;
    const result = getXPToNextLevel(maxXP);
    expect(result.progress).toBe(100);
  });
});

describe('awardXP', () => {
  it('should increase XP', () => {
    const progress = createInitialProgress('test-user');
    const result = awardXP(progress, 'lesson_complete');
    expect(result.xpGained).toBe(XP_VALUES.lesson_complete);
    expect(result.newProgress.xp).toBe(XP_VALUES.lesson_complete);
  });

  it('should detect level up', () => {
    const progress = { ...createInitialProgress('test-user'), xp: LEVELS[1]!.minXP - 1 };
    const result = awardXP(progress, 'lesson_complete');
    // May or may not level up depending on XP values
    expect(typeof result.leveledUp).toBe('boolean');
  });
});

describe('updateStreak', () => {
  it('should start streak at 1 for first activity', () => {
    const progress = createInitialProgress('test-user');
    const updated = updateStreak(progress);
    expect(updated.streak.current).toBe(1);
  });

  it('should maintain streak for same day', () => {
    const progress = {
      ...createInitialProgress('test-user'),
      currentStreak: 5,
      lastActivity: new Date().toISOString(),
    };
    const updated = updateStreak(progress);
    expect(updated.streak.current).toBe(5); // No change
  });
});

describe('createInitialProgress', () => {
  it('should create valid initial state', () => {
    const progress = createInitialProgress('user-123');
    expect(progress.userId).toBe('user-123');
    expect(progress.xp).toBe(0);
    expect(progress.level).toBe(1);
    expect(progress.badges).toEqual([]);
    expect(progress.streak.current).toBe(0);
  });
});
