/**
 * Harmonic Mixing — Camelot Wheel Implementation
 * Used for suggesting compatible key transitions
 */

export interface CamelotEntry {
  number: number;
  letter: 'A' | 'B';
  key: string;
  scale: 'minor' | 'major';
  color: string;
}

// Full Camelot Wheel mapping
export const CAMELOT_WHEEL: CamelotEntry[] = [
  { number: 1, letter: 'A', key: 'Ab minor', scale: 'minor', color: '#FF6B6B' },
  { number: 1, letter: 'B', key: 'B major', scale: 'major', color: '#FF6B6B' },
  { number: 2, letter: 'A', key: 'Eb minor', scale: 'minor', color: '#FF9F43' },
  { number: 2, letter: 'B', key: 'Gb major', scale: 'major', color: '#FF9F43' },
  { number: 3, letter: 'A', key: 'Bb minor', scale: 'minor', color: '#FECA57' },
  { number: 3, letter: 'B', key: 'Db major', scale: 'major', color: '#FECA57' },
  { number: 4, letter: 'A', key: 'F minor', scale: 'minor', color: '#48DBFB' },
  { number: 4, letter: 'B', key: 'Ab major', scale: 'major', color: '#48DBFB' },
  { number: 5, letter: 'A', key: 'C minor', scale: 'minor', color: '#0ABDE3' },
  { number: 5, letter: 'B', key: 'Eb major', scale: 'major', color: '#0ABDE3' },
  { number: 6, letter: 'A', key: 'G minor', scale: 'minor', color: '#6C63FF' },
  { number: 6, letter: 'B', key: 'Bb major', scale: 'major', color: '#6C63FF' },
  { number: 7, letter: 'A', key: 'D minor', scale: 'minor', color: '#A855F7' },
  { number: 7, letter: 'B', key: 'F major', scale: 'major', color: '#A855F7' },
  { number: 8, letter: 'A', key: 'A minor', scale: 'minor', color: '#FF6584' },
  { number: 8, letter: 'B', key: 'C major', scale: 'major', color: '#FF6584' },
  { number: 9, letter: 'A', key: 'E minor', scale: 'minor', color: '#EE5A24' },
  { number: 9, letter: 'B', key: 'G major', scale: 'major', color: '#EE5A24' },
  { number: 10, letter: 'A', key: 'B minor', scale: 'minor', color: '#F9CA24' },
  { number: 10, letter: 'B', key: 'D major', scale: 'major', color: '#F9CA24' },
  { number: 11, letter: 'A', key: 'F# minor', scale: 'minor', color: '#00FF88' },
  { number: 11, letter: 'B', key: 'A major', scale: 'major', color: '#00FF88' },
  { number: 12, letter: 'A', key: 'Db minor', scale: 'minor', color: '#00D2D3' },
  { number: 12, letter: 'B', key: 'E major', scale: 'major', color: '#00D2D3' },
];

export type CompatibilityLevel = 'perfect' | 'compatible' | 'energy_boost' | 'energy_drop' | 'clash';

export interface CompatibleKey {
  entry: CamelotEntry;
  camelot: string;
  compatibility: CompatibilityLevel;
  description: string;
  descriptionHe: string;
}

/**
 * Get Camelot notation string (e.g., "8A", "11B")
 */
export function toCamelotString(entry: CamelotEntry): string {
  return `${entry.number}${entry.letter}`;
}

/**
 * Parse a Camelot string to number and letter
 */
export function parseCamelot(camelot: string): { number: number; letter: 'A' | 'B' } | null {
  const match = camelot.match(/^(\d{1,2})([AB])$/i);
  if (!match) return null;
  const matchStr = match[1];
  const letterStr = match[2];
  if (!matchStr || !letterStr) return null;
  const num = parseInt(matchStr);
  if (num < 1 || num > 12) return null;
  return { number: num, letter: letterStr.toUpperCase() as 'A' | 'B' };
}

/**
 * Find entry by Camelot notation
 */
export function findByCamelot(camelot: string): CamelotEntry | undefined {
  const parsed = parseCamelot(camelot);
  if (!parsed) return undefined;
  return CAMELOT_WHEEL.find(e => e.number === parsed.number && e.letter === parsed.letter);
}

/**
 * Find entry by musical key name
 */
export function findByKey(key: string): CamelotEntry | undefined {
  return CAMELOT_WHEEL.find(e => e.key.toLowerCase() === key.toLowerCase());
}

/**
 * Get all harmonically compatible keys for a given Camelot position
 */
export function getCompatibleKeys(camelot: string): CompatibleKey[] {
  const parsed = parseCamelot(camelot);
  if (!parsed) return [];

  const { number, letter } = parsed;
  const results: CompatibleKey[] = [];

  // Same key — perfect match
  const same = CAMELOT_WHEEL.find(e => e.number === number && e.letter === letter);
  if (same) {
    results.push({
      entry: same,
      camelot: toCamelotString(same),
      compatibility: 'perfect',
      description: 'Same key — perfect match',
      descriptionHe: 'אותו מפתח — התאמה מושלמת',
    });
  }

  // Adjacent numbers (same letter) — compatible
  const prev = ((number - 2 + 12) % 12) + 1;
  const next = (number % 12) + 1;

  for (const num of [prev, next]) {
    const entry = CAMELOT_WHEEL.find(e => e.number === num && e.letter === letter);
    if (entry) {
      results.push({
        entry,
        camelot: toCamelotString(entry),
        compatibility: 'compatible',
        description: `Adjacent key (${num > number ? '+1' : '-1'}) — smooth transition`,
        descriptionHe: `מפתח סמוך (${num > number ? '+1' : '-1'}) — מעבר חלק`,
      });
    }
  }

  // Same number, different letter — relative major/minor
  const otherLetter: 'A' | 'B' = letter === 'A' ? 'B' : 'A';
  const relative = CAMELOT_WHEEL.find(e => e.number === number && e.letter === otherLetter);
  if (relative) {
    results.push({
      entry: relative,
      camelot: toCamelotString(relative),
      compatibility: 'compatible',
      description: 'Relative major/minor — mood change',
      descriptionHe: 'מז\'ור/מינור יחסי — שינוי מצב רוח',
    });
  }

  // +7 semitones (energy boost)
  const boostNum = ((number - 1 + 7) % 12) + 1;
  const boost = CAMELOT_WHEEL.find(e => e.number === boostNum && e.letter === letter);
  if (boost) {
    results.push({
      entry: boost,
      camelot: toCamelotString(boost),
      compatibility: 'energy_boost',
      description: 'Energy boost (+7) — dramatic lift',
      descriptionHe: 'העלאת אנרגיה (+7) — עלייה דרמטית',
    });
  }

  return results;
}

/**
 * Calculate compatibility between two Camelot positions
 */
export function getCompatibility(from: string, to: string): CompatibilityLevel {
  const compatible = getCompatibleKeys(from);
  const match = compatible.find(c => c.camelot === to);
  return match?.compatibility ?? 'clash';
}
