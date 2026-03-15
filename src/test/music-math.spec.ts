import { describe, it, expect } from 'vitest';
import { getKeyCompatibility, analyzeTransition, type Track } from '../lib/music-math';

describe('music-math: Harmonic AI Logic', () => {
  
  describe('getKeyCompatibility (Camelot Wheel Rules)', () => {
    it('returns perfect for exact same keys (Rule 1)', () => {
      expect(getKeyCompatibility('8A', '8A')).toBe('perfect');
      expect(getKeyCompatibility('12B', '12B')).toBe('perfect');
    });

    it('returns compatible for adjacent numbered keys (Rule 2)', () => {
      expect(getKeyCompatibility('8A', '9A')).toBe('compatible');
      expect(getKeyCompatibility('8A', '7A')).toBe('compatible');
      // Wrap-around case
      expect(getKeyCompatibility('12A', '1A')).toBe('compatible');
      expect(getKeyCompatibility('1A', '12A')).toBe('compatible');
    });

    it('returns energy_change for Major to Minor shifts on same root (Rule 3)', () => {
      expect(getKeyCompatibility('8A', '8B')).toBe('energy_change');
      expect(getKeyCompatibility('5B', '5A')).toBe('energy_change');
    });

    it('returns clash for musically disjointed keys', () => {
      expect(getKeyCompatibility('8A', '2A')).toBe('clash');
      expect(getKeyCompatibility('8B', '3A')).toBe('clash');
      expect(getKeyCompatibility('1A', '7A')).toBe('clash'); // Across the wheel
    });
  });

  describe('analyzeTransition (BPM & Energy Grading)', () => {
    const defaultTrack: Track = { id: '1', name: 'A', genre: 'House', bpm: 124, key: '8A', energy: 3 };

    it('calculates 0% difference for identical BPMs', () => {
      const t1 = { ...defaultTrack };
      const t2 = { ...defaultTrack };
      const result = analyzeTransition(t1, t2);
      expect(result.bpmDiff).toBe(0);
      expect(result.bpmSuggestion).toContain('מיקס מקורי (0%)');
    });

    it('suggests acceleration when going up in BPM', () => {
      const t1 = { ...defaultTrack, bpm: 120 };
      const t2 = { ...defaultTrack, bpm: 126 };
      const result = analyzeTransition(t1, t2);
      expect(result.bpmDiff).toBe(6);
      expect(result.bpmSuggestion).toContain('האצה 5.0%');
    });

    it('detects a dramatic energy drop', () => {
      const t1 = { ...defaultTrack, energy: 5 };
      const t2 = { ...defaultTrack, energy: 2 };
      const result = analyzeTransition(t1, t2);
      expect(result.energyFlow).toBe('צניחת אנרגיה דרסטית');
    });

    it('detects a smooth energy climb', () => {
      const t1 = { ...defaultTrack, energy: 3 };
      const t2 = { ...defaultTrack, energy: 4 };
      const result = analyzeTransition(t1, t2);
      expect(result.energyFlow).toBe('עלייה הדרגתית');
    });

    it('recommends EQ Drop transition for harmonic clashes', () => {
      const t1 = { ...defaultTrack, key: '8A' };
      const t2 = { ...defaultTrack, key: '2A' }; // Clash
      const result = analyzeTransition(t1, t2);
      expect(result.transitionType).toBe('חיתוך תדרים (EQ Drop)');
      expect(result.keyCompatibility).toBe('clash');
    });

    it('recommends Blend transition for compatible keys', () => {
      const t1 = { ...defaultTrack, key: '8A' };
      const t2 = { ...defaultTrack, key: '9A' }; // Compatible
      const result = analyzeTransition(t1, t2);
      expect(result.transitionType).toContain('מיקס לחן ארוך (Blend)');
      expect(result.keyCompatibility).toBe('compatible');
    });
  });
});
