import { z } from 'zod';

// === XP Event ===
export const XPEventTypeSchema = z.enum([
  'lesson_complete',
  'quiz_pass',
  'quiz_perfect',
  'exercise_complete',
  'tool_first_use',
  'daily_streak',
  'weekly_streak',
  'course_complete',
  'mix_submit',
  'mix_reviewed',
  'community_help',
  'first_midi_connect',
]);
export type XPEventType = z.infer<typeof XPEventTypeSchema>;

export const XP_VALUES: Record<XPEventType, number> = {
  lesson_complete: 50,
  quiz_pass: 100,
  quiz_perfect: 200,
  exercise_complete: 75,
  tool_first_use: 30,
  daily_streak: 25,
  weekly_streak: 150,
  course_complete: 500,
  mix_submit: 200,
  mix_reviewed: 100,
  community_help: 50,
  first_midi_connect: 100,
};

// === Level System ===
export interface Level {
  number: number;
  name: string;
  nameHe: string;
  minXP: number;
  icon: string;
}

export const LEVELS: Level[] = [
  {
    number: 1,
    name: 'Listener',
    nameHe: 'מאזין',
    minXP: 0,
    icon: '🎧',
  },
  {
    number: 2,
    name: 'Rookie DJ',
    nameHe: "די-ג'יי מתחיל",
    minXP: 500,
    icon: '🎵',
  },
  {
    number: 3,
    name: 'Beat Finder',
    nameHe: 'מוצא הביט',
    minXP: 1500,
    icon: '🥁',
  },
  {
    number: 4,
    name: 'Mix Maker',
    nameHe: 'יוצר מיקסים',
    minXP: 3500,
    icon: '🎛️',
  },
  {
    number: 5,
    name: 'Groove Master',
    nameHe: 'אמן הגרוב',
    minXP: 7000,
    icon: '🎶',
  },
  {
    number: 6,
    name: 'Floor Filler',
    nameHe: 'ממלא רחבות',
    minXP: 12000,
    icon: '🔥',
  },
  {
    number: 7,
    name: 'Club DJ',
    nameHe: "די-ג'יי מועדונים",
    minXP: 20000,
    icon: '🏟️',
  },
  {
    number: 8,
    name: 'Sound Architect',
    nameHe: 'אדריכל הצליל',
    minXP: 35000,
    icon: '🏗️',
  },
  {
    number: 9,
    name: 'Festival Ready',
    nameHe: 'מוכן לפסטיבל',
    minXP: 55000,
    icon: '⭐',
  },
  {
    number: 10,
    name: 'DJMaster',
    nameHe: "די-ג'יי מאסטר",
    minXP: 80000,
    icon: '👑',
  },
];

// === Badge/Achievement ===
export const BadgeCategorySchema = z.enum([
  'course',
  'tool',
  'community',
  'streak',
  'special',
  'midi',
]);
export type BadgeCategory = z.infer<typeof BadgeCategorySchema>;

export interface Badge {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  category: BadgeCategory;
  requirement: string;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const BADGES: Badge[] = [
  {
    id: 'first-lesson',
    name: 'First Step',
    nameHe: 'צעד ראשון',
    description: 'Complete your first lesson',
    descriptionHe: 'השלם את השיעור הראשון',
    icon: '👣',
    category: 'course',
    requirement: 'Complete 1 lesson',
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'beat-detective',
    name: 'Beat Detective',
    nameHe: 'בלש הביט',
    description: 'Correctly identify BPM within ±1 accuracy 10 times',
    descriptionHe: 'זהה BPM בדיוק של ±1 עשר פעמים',
    icon: '🔍',
    category: 'tool',
    requirement: 'BPM accuracy ±1 x10',
    xpReward: 200,
    rarity: 'uncommon',
  },
  {
    id: 'harmonic-guru',
    name: 'Harmonic Guru',
    nameHe: 'גורו ההרמוניה',
    description: 'Plan a 10-track set with perfect harmonic transitions',
    descriptionHe: 'תכנן סט של 10 שירים עם מעברים הרמוניים מושלמים',
    icon: '🎵',
    category: 'tool',
    requirement: '10 perfect harmonic transitions',
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'midi-wizard',
    name: 'MIDI Wizard',
    nameHe: 'קוסם ה-MIDI',
    description: 'Connect your DDJ-FLX4 and use all controls',
    descriptionHe: 'חבר את ה-DDJ-FLX4 שלך והשתמש בכל הבקרים',
    icon: '🎛️',
    category: 'midi',
    requirement: 'Use all DDJ-FLX4 controls',
    xpReward: 500,
    rarity: 'epic',
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    nameHe: 'לוחם השבוע',
    description: 'Practice every day for 7 consecutive days',
    descriptionHe: 'תרגל כל יום במשך 7 ימים רצופים',
    icon: '🗓️',
    category: 'streak',
    requirement: '7-day streak',
    xpReward: 150,
    rarity: 'uncommon',
  },
  {
    id: 'course-master',
    name: 'Course Master',
    nameHe: 'מאסטר הקורס',
    description: 'Complete all courses with 90%+ quiz scores',
    descriptionHe: 'השלם את כל הקורסים עם ציון מעל 90% בכל הבחנים',
    icon: '🏆',
    category: 'course',
    requirement: 'All courses 90%+',
    xpReward: 2000,
    rarity: 'legendary',
  },
];

// === User Progress ===
export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  badges: string[]; // badge IDs
  completedLessons: string[];
  completedCourses: string[];
  quizResults: Record<string, { score: number; attempts: number }>;
  streak: {
    current: number;
    longest: number;
    lastActivity: string; // ISO date
  };
  toolUsage: Record<string, { firstUsed: string; uses: number }>;
  joinedAt: string; // ISO date
}
