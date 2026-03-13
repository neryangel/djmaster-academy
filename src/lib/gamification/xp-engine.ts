/**
 * XP Engine — Manages experience points, leveling, and rewards
 */

import { XP_VALUES, LEVELS, BADGES, type UserProgress } from '../../types/gamification';

export function calculateLevel(totalXP: number): typeof LEVELS[number] {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.minXP) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getXPToNextLevel(totalXP: number): { current: number; needed: number; progress: number } {
  const currentLevel = calculateLevel(totalXP);
  const currentIndex = LEVELS.indexOf(currentLevel);

  if (currentIndex >= LEVELS.length - 1) {
    return { current: totalXP, needed: 0, progress: 100 };
  }

  const nextLevel = LEVELS[currentIndex + 1];
  const xpInCurrentLevel = totalXP - currentLevel.minXP;
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
  const xpGained = XP_VALUES[eventType];
  const oldLevel = calculateLevel(progress.totalXP);
  const newTotalXP = progress.totalXP + xpGained;
  const newLevel = calculateLevel(newTotalXP);
  const leveledUp = newLevel.level > oldLevel.level;

  // Check for new badges
  const newBadges: string[] = [];
  for (const badge of BADGES) {
    if (!progress.badges.includes(badge.id)) {
      const earned = checkBadgeCondition(badge.id, { ...progress, totalXP: newTotalXP });
      if (earned) {
        newBadges.push(badge.id);
      }
    }
  }

  const newProgress: UserProgress = {
    ...progress,
    totalXP: newTotalXP,
    level: newLevel.level,
    badges: [...progress.badges, ...newBadges],
    lastActivity: new Date().toISOString(),
  };

  return { newProgress, xpGained, leveledUp, newBadges };
}

function checkBadgeCondition(badgeId: string, progress: UserProgress): boolean {
  switch (badgeId) {
    case 'first-lesson':
      return progress.lessonsCompleted >= 1;
    case 'quiz-ace':
      return progress.quizzesPassed >= 1;
    case 'tool-explorer':
      return progress.toolsUsed >= 3;
    case 'streak-7':
      return progress.currentStreak >= 7;
    case 'course-complete':
      return progress.coursesCompleted >= 1;
    case 'dj-master':
      return progress.level >= 10;
    default:
      return false;
  }
}

export function updateStreak(progress: UserProgress): UserProgress {
  const now = new Date();
  const lastActivity = progress.lastActivity ? new Date(progress.lastActivity) : null;

  if (!lastActivity) {
    return { ...progress, currentStreak: 1, longestStreak: 1, lastActivity: now.toISOString() };
  }

  const daysSinceLastActivity = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastActivity === 0) {
    // Same day, no change
    return progress;
  } else if (daysSinceLastActivity === 1) {
    // Consecutive day
    const newStreak = progress.currentStreak + 1;
    return {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      lastActivity: now.toISOString(),
    };
  } else {
    // Streak broken
    return { ...progress, currentStreak: 1, lastActivity: now.toISOString() };
  }
}

export function createInitialProgress(userId: string): UserProgress {
  return {
    userId,
    totalXP: 0,
    level: 1,
    badges: [],
    lessonsCompleted: 0,
    quizzesPassed: 0,
    toolsUsed: 0,
    coursesCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivity: null,
  };
}
