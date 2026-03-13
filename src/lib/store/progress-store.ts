/**
 * Global state management using nanostores
 * Persists to localStorage and syncs across components
 */
import { atom, computed, map } from 'nanostores';
import type { UserProgress } from '../../types/gamification';
import { calculateLevel, getXPToNextLevel } from '../gamification/xp-engine';

// Storage key
const STORAGE_KEY = 'djmaster-progress';

// Load from localStorage
function loadProgress(): UserProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Save to localStorage
function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable
  }
}

// Core atoms
export const $userProgress = atom<UserProgress | null>(null);
export const $isLoggedIn = atom(false);
export const $currentCourseId = atom<string | null>(null);
export const $currentLessonId = atom<string | null>(null);

// Computed values
export const $currentLevel = computed($userProgress, (progress) => {
  if (!progress) return null;
  return calculateLevel(progress.xp);
});

export const $xpProgress = computed($userProgress, (progress) => {
  if (!progress) return { current: 0, needed: 100, progress: 0 };
  return getXPToNextLevel(progress.xp);
});

export const $badgeCount = computed($userProgress, (progress) => {
  return progress?.badges.length ?? 0;
});

// Theme preference
export const $theme = atom<'dark' | 'light'>('dark');

// Audio settings
export const $audioSettings = map({
  masterVolume: 0.8,
  metronomeVolume: 0.5,
  effectsEnabled: true,
});

// Actions
export function initializeProgress(): void {
  const stored = loadProgress();
  if (stored) {
    $userProgress.set(stored);
    $isLoggedIn.set(true);
  }
}

export function updateProgress(updater: (prev: UserProgress) => UserProgress): void {
  const current = $userProgress.get();
  if (!current) return;
  const updated = updater(current);
  $userProgress.set(updated);
  saveProgress(updated);
}

export function resetProgress(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  $userProgress.set(null);
  $isLoggedIn.set(false);
}
