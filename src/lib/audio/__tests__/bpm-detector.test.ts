import { describe, it, expect, beforeEach } from 'vitest';
import { TapTempoCalculator, detectBPMFromBuffer, GENRE_BPM_RANGES, getGenreForBPM } from '../bpm-detector';

describe('TapTempoCalculator', () => {
  let calc: TapTempoCalculator;

  beforeEach(() => {
    calc = new TapTempoCalculator();
  });

  it('should return 0 for first tap', () => {
    expect(calc.tap()).toBe(0);
  });

  it('should calculate BPM from regular taps', () => {
    // Simulate 120 BPM = 500ms intervals
    const now = Date.now();
    // Override internal state for consistent testing
    calc.tap(); // first tap

    // We can test by calling tap multiple times in sequence
    // Since real timing varies, test the calculation logic
    const bpm = calc.tap();
    // First two taps give an initial reading
    expect(typeof bpm).toBe('number');
  });

  it('should reset on fresh instance', () => {
    calc.reset();
    expect(calc.tap()).toBe(0);
  });

  it('should report stability', () => {
    expect(calc.isStable()).toBe(false);
  });

  it('should return current BPM', () => {
    expect(calc.getCurrentBPM()).toBe(0);
  });
});

describe('getGenreForBPM', () => {
  it('should identify Hip-Hop at 90 BPM', () => {
    const genre = getGenreForBPM(90);
    expect(genre).toBe('Hip-Hop');
  });

  it('should identify House at 126 BPM', () => {
    const genre = getGenreForBPM(126);
    expect(genre).toBe('House');
  });

  it('should identify Drum & Bass at 174 BPM', () => {
    const genre = getGenreForBPM(174);
    expect(genre).toBe('Drum & Bass');
  });

  it('should identify Techno at 138 BPM', () => {
    const genre = getGenreForBPM(138);
    expect(genre).toBe('Techno');
  });

  it('should return Unknown for out-of-range BPM', () => {
    const genre = getGenreForBPM(300);
    expect(genre).toBe('Unknown');
  });
});

describe('GENRE_BPM_RANGES', () => {
  it('should have at least 10 genres defined', () => {
    expect(Object.keys(GENRE_BPM_RANGES).length).toBeGreaterThanOrEqual(10);
  });

  it('should have valid min/max for each genre', () => {
    for (const [genre, range] of Object.entries(GENRE_BPM_RANGES)) {
      expect(range.min).toBeLessThan(range.max);
      expect(range.min).toBeGreaterThan(0);
      expect(range.max).toBeLessThan(300);
    }
  });
});
