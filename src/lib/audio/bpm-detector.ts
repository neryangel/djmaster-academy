/**
 * BPM Detection Utilities
 * Uses Web Audio API onset detection + autocorrelation
 */

export interface BPMResult {
  bpm: number;
  confidence: number;
  tempo: string; // e.g. "House", "Drum & Bass"
}

export interface TapTempoBPM {
  bpm: number;
  taps: number;
  intervals: number[];
  isStable: boolean;
}

// Genre BPM ranges for context
export const GENRE_BPM_RANGES: Record<string, [number, number]> = {
  'Hip-Hop': [85, 115],
  'House': [120, 130],
  'Tech House': [124, 128],
  'Techno': [128, 140],
  'Trance': [130, 145],
  'Drum & Bass': [160, 180],
  'Dubstep': [138, 142],
  'Disco': [110, 130],
  'Pop': [100, 130],
  'R&B': [60, 100],
  'Reggaeton': [88, 100],
  'Psytrance': [140, 150],
};

export function getGenreForBPM(bpm: number): string {
  for (const [genre, [min, max]] of Object.entries(GENRE_BPM_RANGES)) {
    if (bpm >= min && bpm <= max) return genre;
  }
  return 'Unknown';
}

/**
 * Tap Tempo calculator
 * Maintains a rolling window of tap intervals
 */
export class TapTempoCalculator {
  private taps: number[] = [];
  private maxTaps = 16;
  private maxInterval = 3000; // ms — reset if gap > 3s

  tap(): TapTempoBPM {
    const now = performance.now();

    // Reset if gap too large
    if (this.taps.length > 0 && now - this.taps[this.taps.length - 1]! > this.maxInterval) {
      this.taps = [];
    }

    this.taps.push(now);
    if (this.taps.length > this.maxTaps) {
      this.taps.shift();
    }

    if (this.taps.length < 2) {
      return { bpm: 0, taps: 1, intervals: [], isStable: false };
    }

    const intervals: number[] = [];
    for (let i = 1; i < this.taps.length; i++) {
      intervals.push(this.taps[i]! - this.taps[i - 1]!);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.round(60000 / avgInterval * 10) / 10;

    // Check stability (standard deviation)
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const isStable = stdDev < avgInterval * 0.1; // <10% variation

    return {
      bpm: Math.max(20, Math.min(300, bpm)),
      taps: this.taps.length,
      intervals,
      isStable,
    };
  }

  reset(): void {
    this.taps = [];
  }
}

/**
 * Detect BPM from an AudioBuffer using autocorrelation
 */
export async function detectBPMFromBuffer(
  audioBuffer: AudioBuffer,
  minBPM = 60,
  maxBPM = 200
): Promise<BPMResult> {
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;

  // Energy-based onset detection
  const windowSize = Math.floor(sampleRate * 0.01); // 10ms windows
  const energies: number[] = [];

  for (let i = 0; i < channelData.length - windowSize; i += windowSize) {
    let energy = 0;
    for (let j = 0; j < windowSize; j++) {
      energy += (channelData[i + j] ?? 0) * (channelData[i + j] ?? 0);
    }
    energies.push(energy / windowSize);
  }

  // Spectral flux / onset detection
  const onsets: number[] = [];
  for (let i = 1; i < energies.length; i++) {
    const diff = (energies[i] ?? 0) - (energies[i - 1] ?? 0);
    if (diff > 0) onsets.push(diff);
    else onsets.push(0);
  }

  // Autocorrelation on onset signal
  const minLag = Math.floor(60 / maxBPM * (sampleRate / windowSize));
  const maxLag = Math.floor(60 / minBPM * (sampleRate / windowSize));
  const correlations: number[] = [];

  for (let lag = minLag; lag <= maxLag; lag++) {
    let correlation = 0;
    let count = 0;
    for (let i = 0; i < onsets.length - lag; i++) {
      correlation += (onsets[i] ?? 0) * (onsets[i + lag] ?? 0);
      count++;
    }
    correlations.push(count > 0 ? correlation / count : 0);
  }

  // Find peak correlation
  let maxCorr = 0;
  let bestLag = minLag;
  for (let i = 0; i < correlations.length; i++) {
    if ((correlations[i] ?? 0) > maxCorr) {
      maxCorr = correlations[i]!;
      bestLag = minLag + i;
    }
  }

  const bpm = Math.round(60 / (bestLag * windowSize / sampleRate) * 10) / 10;
  const maxPossibleCorr = Math.max(...correlations);
  const confidence = maxPossibleCorr > 0 ? maxCorr / maxPossibleCorr : 0;

  return {
    bpm: Math.max(minBPM, Math.min(maxBPM, bpm)),
    confidence,
    tempo: getGenreForBPM(bpm),
  };
}
