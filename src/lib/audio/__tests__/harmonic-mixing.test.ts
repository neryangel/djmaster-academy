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
  it('should format number and letter', () => {
    expect(toCamelotString(8, 'A')).toBe('8A');
    expect(toCamelotString(12, 'B')).toBe('12B');
  });
});

describe('findByCamelot', () => {
  it('should find Am at 8A', () => {
    const key = findByCamelot(8, 'A');
    expect(key).toBeDefined();
    expect(key?.key).toBe('Am');
  });

  it('should find C at 8B', () => {
    const key = findByCamelot(8, 'B');
    expect(key).toBeDefined();
    expect(key?.key).toBe('C');
  });
});

describe('getCompatibleKeys', () => {
  it('should return compatible keys for 8A (Am)', () => {
    const compatible = getCompatibleKeys('8A');
    expect(compatible.length).toBeGreaterThan(0);

    // Should include perfect match (same key)
    const perfect = compatible.find(c => c.type === 'perfect');
    expect(perfect).toBeDefined();

    // Should include adjacent keys (7A, 9A)
    const adjacents = compatible.filter(c => c.type === 'compatible');
    expect(adjacents.length).toBeGreaterThanOrEqual(2);
  });

  it('should include energy boost/drop for inner/outer switch', () => {
    const compatible = getCompatibleKeys('8A');
    const energyChanges = compatible.filter(
      c => c.type === 'energy_boost' || c.type === 'energy_drop'
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
