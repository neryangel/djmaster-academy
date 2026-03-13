/**
 * XP Engine — Manages experience points, leveling, and rewards
 */

import { XP_VALUES, LEVELS, BADGES, type UserProgress } from '../../types/gamification';

export function calculateLevel(xp: number): (typeof LEVELS)[number] {
  let currentLevel = LEVELS[0]!;
  for (const level of LEVELS) {
    if (xp >= level.minXP) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getXPToNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const currentLevel = calculateLevel(xp);
  const currentIndex = LEVELS.indexOf(currentLevel);

  if (currentIndex >= LEVELS.length - 1) {
    return { current: xp, needed: 0, progress: 100 };
  }

  const nextLevel = LEVELS[currentIndex + 1]!;
  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpNeededForNext = nextLevel.minXP - currentLevel.minXP;
  const progress = Math.round((xpInCurrentLevel / xpNeededForNext) * 100);

  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNext,
    progress: Math.min(progress, 100),
  };
}

export function awardXP(
  progress: UserProgress,
  eventType: keyof typeof XP_VALUES
): { newProgress: UserProgress; xpGained: number; leveledUp: boolean; newBadges: string[] } {
  const xpGained = XP_VALUES[eventType] ?? 0;
  const oldLevel = calculateLevel(progress.xp);
  const newXP = progress.xp + xpGained;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel.number > oldLevel.number;

  // Check for new badges
  const newBadges: string[] = [];
  for (const badge of BADGES) {
    if (!progress.badges.includes(badge.id)) {
      const earned = checkBadgeCondition(badge.id, { ...progress, xp: newXP });
      if (earned) {
        newBadges.push(badge.id);
      }
    }
  }

  const newProgress: UserProgress = {
    ...progress,
    xp: newXP,
    level: newLevel.number,
    badges: [...progress.badges, ...newBadges],
    streak: {
      ...progress.streak,
      lastActivity: new Date().toISOString(),
    },
  };

  return { newProgress, xpGained, leveledUp, newBadges };
}

function checkBadgeCondition(badgeId: string, progress: UserProgress): boolean {
  switch (badgeId) {
    case 'first-lesson':
      return progress.completedLessons.length >= 1;
    case 'quiz-ace':
      return Object.values(progress.quizResults).some(r => r.score >= 70);
    case 'tool-explorer':
      return Object.keys(progress.toolUsage).length >= 3;
    case 'streak-7':
      return progress.streak.current >= 7;
    case 'course-complete':
      return progress.completedCourses.length >= 1;
    case 'dj-master':
      return progress.level >= 10;
    default:
      return false;
  }
}

export function updateStreak(progress: UserProgress): UserProgress {
  const now = new Date();
  const lastActivity = progress.streak.lastActivity ? new Date(progress.streak.lastActivity) : null;

  if (!lastActivity) {
    return {
      ...progress,
      streak: { current: 1, longest: 1, lastActivity: now.toISOString() },
    };
  }

  const daysSinceLastActivity = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastActivity === 0) {
    // Same day, no change
    return progress;
  } else if (daysSinceLastActivity === 1) {
    // Consecutive day
    const newStreak = progress.streak.current + 1;
    return {
      ...progress,
      streak: {
        current: newStreak,
        longest: Math.max(newStreak, progress.streak.longest),
        lastActivity: now.toISOString(),
      },
    };
  } else {
    // Streak broken
    return {
      ...progress,
      streak: { ...progress.streak, current: 1, lastActivity: now.toISOString() },
    };
  }
}

export function createInitialProgress(userId: string): UserProgress {
  return {
    userId,
    xp: 0,
    level: 1,
    badges: [],
    completedLessons: [],
    completedCourses: [],
    quizResults: {},
    streak: {
      current: 0,
      longest: 0,
      lastActivity: '',
    },
    toolUsage: {},
    joinedAt: new Date().toISOString(),
  };
}
