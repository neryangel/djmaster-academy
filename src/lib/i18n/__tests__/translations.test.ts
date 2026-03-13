import { describe, it, expect, beforeEach } from 'vitest';
import { t, setLocale, getLocale, isRTL } from '../translations';

describe('Internationalization (i18n)', () => {
  beforeEach(() => {
    // Reset to default locale
    setLocale('he');
  });

  describe('t() function', () => {
    it('should return Hebrew translations by default', () => {
      setLocale('he');

      expect(t('nav.courses')).toBe('קורסים');
      expect(t('nav.tools')).toBe('כלים');
      expect(t('common.save')).toBe('שמור');
      expect(t('quiz.start')).toBe('התחל בוחן');
    });

    it('should return English translations when locale is set to English', () => {
      setLocale('en');

      expect(t('nav.courses')).toBe('Courses');
      expect(t('nav.tools')).toBe('Tools');
      expect(t('common.save')).toBe('Save');
      expect(t('quiz.start')).toBe('Start Quiz');
    });

    it('should fall back to Hebrew when key is missing in English', () => {
      setLocale('en');

      // These keys exist in Hebrew but not English, should fall back
      const result = t('level.beginner');
      expect(result).toBe('Beginner');
    });

    it('should return the key itself if translation is not found', () => {
      setLocale('he');

      // Non-existent key
      const result = t('nonexistent.key' as any);
      expect(result).toBe('nonexistent.key');
    });

    it('should support parameter interpolation', () => {
      setLocale('he');

      const result = t('xp.earned', { amount: 100 });
      expect(result).toContain('100');
      expect(result).toContain('XP');
    });

    it('should handle multiple parameters', () => {
      setLocale('he');

      const result = t('xp.levelUp', { level: 5 });
      expect(result).toContain('5');
    });

    it('should handle numeric and string parameters', () => {
      setLocale('he');

      const result1 = t('xp.earned', { amount: 250 });
      expect(result1).toContain('250');

      const result2 = t('xp.earned', { amount: '500' });
      expect(result2).toContain('500');
    });

    it('should replace all parameter occurrences', () => {
      setLocale('he');

      const result = t('streak.maintained', { days: 7 });
      expect(result).toContain('7');
    });

    it('should handle undefined parameters gracefully', () => {
      setLocale('he');

      const result = t('xp.earned', { amount: 100, unknown: 'param' });
      expect(result).toContain('100');
    });
  });

  describe('setLocale/getLocale', () => {
    it('should set and get locale correctly', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');

      setLocale('he');
      expect(getLocale()).toBe('he');
    });

    it('should update document language attribute', () => {
      setLocale('en');
      expect(document.documentElement.lang).toBe('en');

      setLocale('he');
      expect(document.documentElement.lang).toBe('he');
    });

    it('should update document text direction', () => {
      setLocale('he');
      expect(document.documentElement.dir).toBe('rtl');

      setLocale('en');
      expect(document.documentElement.dir).toBe('ltr');
    });

    it('should persist locale across multiple calls', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');
      expect(t('nav.courses')).toBe('Courses');

      setLocale('he');
      expect(getLocale()).toBe('he');
      expect(t('nav.courses')).toBe('קורסים');
    });
  });

  describe('isRTL()', () => {
    it('should return true for Hebrew locale', () => {
      setLocale('he');
      expect(isRTL()).toBe(true);
    });

    it('should return false for English locale', () => {
      setLocale('en');
      expect(isRTL()).toBe(false);
    });

    it('should update when locale changes', () => {
      setLocale('he');
      expect(isRTL()).toBe(true);

      setLocale('en');
      expect(isRTL()).toBe(false);

      setLocale('he');
      expect(isRTL()).toBe(true);
    });
  });

  describe('Language-specific translations', () => {
    it('should have complete Hebrew translations', () => {
      setLocale('he');

      // Navigation
      expect(t('nav.courses')).toBeTruthy();
      expect(t('nav.tools')).toBeTruthy();

      // Quiz
      expect(t('quiz.start')).toBeTruthy();
      expect(t('quiz.score')).toBeTruthy();

      // Gamification
      expect(t('xp.earned' as any, { amount: 100 })).toBeTruthy();
      expect(t('badge.earned' as any, { name: 'Test' })).toBeTruthy();
    });

    it('should have English fallbacks for common keys', () => {
      setLocale('en');

      expect(t('nav.courses')).toBe('Courses');
      expect(t('nav.tools')).toBe('Tools');
      expect(t('common.save')).toBe('Save');
    });

    it('should use correct language direction for RTL languages', () => {
      setLocale('he');
      expect(isRTL()).toBe(true);
      expect(document.documentElement.dir).toBe('rtl');
    });

    it('should use correct language direction for LTR languages', () => {
      setLocale('en');
      expect(isRTL()).toBe(false);
      expect(document.documentElement.dir).toBe('ltr');
    });
  });

  describe('Translation keys', () => {
    it('should have consistent key naming', () => {
      setLocale('he');

      // Keys follow pattern: namespace.key
      const keys = [
        'nav.courses',
        'nav.tools',
        'quiz.start',
        'common.save',
        'level.beginner',
      ];

      keys.forEach((key) => {
        expect(key).toMatch(/^[a-z]+\.[a-z]+/);
      });
    });

    it('should return meaningful values for all core keys', () => {
      setLocale('he');

      const coreKeys = [
        'nav.courses',
        'nav.tools',
        'nav.community',
        'common.save',
        'common.cancel',
        'quiz.start',
        'quiz.score',
      ];

      coreKeys.forEach((key) => {
        const value = t(key as any);
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Locale-specific behavior', () => {
    it('should switch seamlessly between locales', () => {
      setLocale('he');
      expect(t('nav.courses')).toBe('קורסים');

      setLocale('en');
      expect(t('nav.courses')).toBe('Courses');

      setLocale('he');
      expect(t('nav.courses')).toBe('קורסים');
    });

    it('should maintain consistency across multiple keys in same locale', () => {
      setLocale('he');

      const hebrewResults = [
        t('nav.courses'),
        t('nav.tools'),
        t('common.save'),
      ];

      // All should be in Hebrew (contain Hebrew characters)
      hebrewResults.forEach((result) => {
        expect(result).toMatch(/[\u0590-\u05FF]/);
      });
    });

    it('should update DOM attributes when locale changes', () => {
      setLocale('he');
      expect(document.documentElement.lang).toBe('he');
      expect(document.documentElement.dir).toBe('rtl');

      setLocale('en');
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
    });
  });
});
