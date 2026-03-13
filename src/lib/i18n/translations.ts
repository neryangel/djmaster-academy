/**
 * Internationalization — Hebrew-first with English fallback
 */

export type Locale = 'he' | 'en';

const translations = {
  he: {
    // Navigation
    'nav.courses': 'קורסים',
    'nav.tools': 'כלים',
    'nav.community': 'קהילה',
    'nav.login': 'התחברות',
    'nav.profile': 'פרופיל',

    // Course levels
    'level.beginner': 'מתחיל',
    'level.intermediate': 'בינוני',
    'level.advanced': 'מתקדם',

    // Quiz
    'quiz.start': 'התחל בוחן',
    'quiz.next': 'שאלה הבאה',
    'quiz.previous': 'שאלה קודמת',
    'quiz.submit': 'הגש תשובות',
    'quiz.score': 'ציון',
    'quiz.passed': 'עברת! 🎉',
    'quiz.failed': 'לא עברת, נסה שוב',
    'quiz.question': 'שאלה',
    'quiz.of': 'מתוך',
    'quiz.correct': 'נכון!',
    'quiz.incorrect': 'לא נכון',
    'quiz.explanation': 'הסבר',
    'quiz.tryAgain': 'נסה שוב',
    'quiz.attempts': 'ניסיונות',

    // Progress
    'progress.level': 'רמה',
    'progress.xp': 'נקודות ניסיון',
    'progress.streak': 'רצף ימים',
    'progress.badges': 'תגים',
    'progress.lessons': 'שיעורים',
    'progress.completed': 'הושלם',

    // Tools
    'tool.bpm': 'מחשבון BPM',
    'tool.harmonic': 'גלגל הרמוני',
    'tool.eq': 'אימון EQ',
    'tool.beatmatch': 'אימון Beatmatch',
    'tool.setPlanner': 'מתכנן סטים',

    // Common
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.save': 'שמור',
    'common.cancel': 'ביטול',
    'common.close': 'סגור',
    'common.back': 'חזרה',
    'common.next': 'הבא',
    'common.reset': 'איפוס',
    'common.start': 'התחל',
    'common.stop': 'עצור',
    'common.play': 'נגן',
    'common.pause': 'השהה',

    // Gamification
    'xp.earned': 'קיבלת {amount} XP!',
    'xp.levelUp': 'עלית לרמה {level}! 🎉',
    'badge.earned': 'השגת תג חדש: {name}!',
    'streak.maintained': 'רצף של {days} ימים! 🔥',

    // Difficulty
    'difficulty.easy': 'קל',
    'difficulty.medium': 'בינוני',
    'difficulty.hard': 'קשה',

    // Audio
    'audio.tapHere': 'הקש כאן',
    'audio.bpm': 'פעימות לדקה',
    'audio.key': 'מפתח',
    'audio.genre': 'ז\'אנר',
    'audio.energy': 'אנרגיה',
    'audio.compatible': 'תואם',
    'audio.clash': 'התנגשות',
  },

  en: {
    'nav.courses': 'Courses',
    'nav.tools': 'Tools',
    'nav.community': 'Community',
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    'level.beginner': 'Beginner',
    'level.intermediate': 'Intermediate',
    'level.advanced': 'Advanced',
    'quiz.start': 'Start Quiz',
    'quiz.next': 'Next Question',
    'quiz.submit': 'Submit',
    'quiz.score': 'Score',
    'quiz.passed': 'Passed! 🎉',
    'quiz.failed': 'Not passed, try again',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.reset': 'Reset',
    'common.start': 'Start',
    'common.play': 'Play',
    'common.pause': 'Pause',
  },
} as const;

type TranslationKey = keyof typeof translations.he;

let currentLocale: Locale = 'he';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
  }
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const dict = translations[currentLocale] ?? translations.he;
  let text = (dict as Record<string, string>)[key] ?? (translations.he as Record<string, string>)[key] ?? key;

  if (params) {
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(`{${param}}`, String(value));
    }
  }

  return text;
}

export function isRTL(): boolean {
  return currentLocale === 'he';
}
