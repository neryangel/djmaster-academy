import { describe, it, expect } from 'vitest';
import {
  CAMELOT_WHEEL,
  getCompatibleKeys,
  parseCamelot,
  findByCamelot,
  toCamelotString,
  getCompatibility
} from '../harmonic-mixing';

describe('CAMELOT_WHEEL', () => {
  it('should contain 24 keys (12 minor + 12 major)', () => {
    expect(CAMELOT_WHEEL).toHaveLength(24);
  });

  it('should have both A (minor) and B (major) for each number', () => {
    for (let n = 1; n <= 12; n++) {
      const minor = CAMELOT_WHEEL.find(k => k.number === n && k.letter === 'A');
      const major = CAMELOT_WHEEL.find(k => k.number === n && k.letter === 'B');
      expect(minor).toBeDefined();
      expect(major).toBeDefined();
    }
  });

  it('should have unique musical keys', () => {
    const keys = CAMELOT_WHEEL.map(k => k.key);
    const unique = new Set(keys);
    expect(unique.size).toBe(24);
  });
});

describe('parseCamelot', () => {
  it('should parse "8A" correctly', () => {
    const result = parseCamelot('8A');
    expect(result).toEqual({ number: 8, letter: 'A' });
  });

  it('should parse "12B" correctly', () => {
    const result = parseCamelot('12B');
    expect(result).toEqual({ number: 12, letter: 'B' });
  });

  it('should return null for invalid input', () => {
    expect(parseCamelot('invalid')).toBeNull();
    expect(parseCamelot('13A')).toBeNull();
    expect(parseCamelot('0B')).toBeNull();
  });
});

describe('toCamelotString', () => {
  it('should format CamelotEntry to string', () => {
    const entry8A = CAMELOT_WHEEL.find(e => e.number === 8 && e.letter === 'A')!;
    const entry12B = CAMELOT_WHEEL.find(e => e.number === 12 && e.letter === 'B')!;
    expect(toCamelotString(entry8A)).toBe('8A');
    expect(toCamelotString(entry12B)).toBe('12B');
  });
});

describe('findByCamelot', () => {
  it('should find A minor at 8A', () => {
    const key = findByCamelot('8A');
    expect(key).toBeDefined();
    expect(key?.key).toBe('A minor');
  });

  it('should find C major at 8B', () => {
    const key = findByCamelot('8B');
    expect(key).toBeDefined();
    expect(key?.key).toBe('C major');
  });
});

describe('getCompatibleKeys', () => {
  it('should return compatible keys for 8A (Am)', () => {
    const compatible = getCompatibleKeys('8A');
    expect(compatible.length).toBeGreaterThan(0);

    // Should include perfect match (same key)
    const perfect = compatible.find(c => c.compatibility === 'perfect');
    expect(perfect).toBeDefined();

    // Should include adjacent keys (7A, 9A)
    const adjacents = compatible.filter(c => c.compatibility === 'compatible');
    expect(adjacents.length).toBeGreaterThanOrEqual(2);
  });

  it('should include energy boost/drop for inner/outer switch', () => {
    const compatible = getCompatibleKeys('8A');
    const energyChanges = compatible.filter(
      c => c.compatibility === 'energy_boost' || c.compatibility === 'energy_drop'
    );
    expect(energyChanges.length).toBeGreaterThan(0);
  });

  it('should return empty array for invalid key', () => {
    const compatible = getCompatibleKeys('invalid');
    expect(compatible).toEqual([]);
  });
});

describe('getCompatibility', () => {
  it('should return perfect for same key', () => {
    expect(getCompatibility('8A', '8A')).toBe('perfect');
  });

  it('should return compatible for adjacent keys', () => {
    expect(getCompatibility('8A', '7A')).toBe('compatible');
    expect(getCompatibility('8A', '9A')).toBe('compatible');
  });

  it('should return energy change for inner/outer switch', () => {
    const result = getCompatibility('8A', '8B');
    expect(['energy_boost', 'energy_drop']).toContain(result);
  });

  it('should return clash for distant keys', () => {
    expect(getCompatibility('8A', '3B')).toBe('clash');
  });
});
