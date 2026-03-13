import React from 'react';

interface Level {
  number: number;
  nameHe: string;
  minXP: number;
  icon: string;
}

const LEVELS: Level[] = [
  { number: 1, nameHe: 'מאזין', minXP: 0, icon: '🎧' },
  { number: 2, nameHe: 'די-ג\'יי מתחיל', minXP: 500, icon: '🎵' },
  { number: 3, nameHe: 'מוצא הביט', minXP: 1500, icon: '🥁' },
  { number: 4, nameHe: 'יוצר מיקסים', minXP: 3500, icon: '🎛️' },
  { number: 5, nameHe: 'אמן הגרוב', minXP: 7000, icon: '🎶' },
  { number: 6, nameHe: 'ממלא רחבות', minXP: 12000, icon: '🔥' },
  { number: 7, nameHe: 'די-ג\'יי מועדונים', minXP: 20000, icon: '🏟️' },
  { number: 8, nameHe: 'אדריכל הצליל', minXP: 35000, icon: '🏗️' },
  { number: 9, nameHe: 'מוכן לפסטיבל', minXP: 55000, icon: '⭐' },
  { number: 10, nameHe: 'די-ג\'יי מאסטר', minXP: 80000, icon: '👑' },
];

interface ProgressTrackerProps {
  xp: number;
  badges: string[];
  completedLessons: number;
  totalLessons: number;
  streak: number;
}

export default function ProgressTracker({
  xp,
  badges,
  completedLessons,
  totalLessons,
  streak,
}: ProgressTrackerProps) {
  const currentLevel = LEVELS.reduce((level, l) => (xp >= l.minXP ? l : level), LEVELS[0]);
  const nextLevel = LEVELS.find(l => l.minXP > xp) ?? LEVELS[LEVELS.length - 1];
  const progressToNext = nextLevel.minXP > currentLevel.minXP
    ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;
  const courseProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="space-y-4 font-hebrew" dir="rtl">
      {/* Level & XP card */}
      <div className="bg-dj-card border border-dj-border rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentLevel.icon}</div>
          <div>
            <div className="text-xs text-gray-400">רמה {currentLevel.number}</div>
            <div className="text-lg font-bold text-white">{currentLevel.nameHe}</div>
          </div>
          <div className="mr-auto text-left">
            <div className="text-2xl font-mono font-bold text-dj-cyan">{xp.toLocaleString()}</div>
            <div className="text-xs text-gray-400">XP</div>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{currentLevel.nameHe}</span>
            <span>{nextLevel.nameHe} {nextLevel.icon}</span>
          </div>
          <div className="h-3 bg-dj-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-dj-cyan to-dj-primary rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-left font-mono">
            {(nextLevel.minXP - xp).toLocaleString()} XP לרמה הבאה
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-dj-card border border-dj-border rounded-xl p-4 text-center">
          <div className="text-2xl font-mono font-bold text-dj-green">{completedLessons}</div>
          <div className="text-xs text-gray-400 mt-1">שיעורים</div>
        </div>
        <div className="bg-dj-card border border-dj-border rounded-xl p-4 text-center">
          <div className="text-2xl font-mono font-bold text-dj-orange">{streak}</div>
          <div className="text-xs text-gray-400 mt-1">ימים רצופים</div>
        </div>
        <div className="bg-dj-card border border-dj-border rounded-xl p-4 text-center">
          <div className="text-2xl font-mono font-bold text-dj-purple">{badges.length}</div>
          <div className="text-xs text-gray-400 mt-1">תגים</div>
        </div>
      </div>

      {/* Course progress */}
      <div className="bg-dj-card border border-dj-border rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">התקדמות כללית</span>
          <span className="text-sm font-mono text-white">{Math.round(courseProgress)}%</span>
        </div>
        <div className="h-2 bg-dj-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-dj-green to-dj-cyan rounded-full transition-all duration-500"
            style={{ width: `${courseProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
