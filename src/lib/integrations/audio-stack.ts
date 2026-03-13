import * as Tone from 'tone';
import { Howl } from 'howler';
import WaveSurfer from 'wavesurfer.js';
import * as Tonal from '@tonaljs/tonal';
import Meyda from 'meyda';

type MeydaAnalyzer = ReturnType<typeof Meyda.createMeydaAnalyzer>;

/**
 * ממשק AudioStack משלב ערימת אודיו מלאה לניתוח וניהול רצועות סאונד
 * Audio stack integration combining multiple audio processing libraries
 */
export interface AudioFeatures {
  rms: number;
  spectralCentroid: number;
  chroma: number[];
  zcr?: number;
  spectralFlatness?: number;
}

export interface CompatibleKey {
  key: string;
  distance: number;
  energy: 'same' | 'up' | 'down';
}

/**
 * AudioStack class - לטעינה עצלה של כל מקורות האודיו
 * Lazy-loads audio processing libraries and manages audio playback/analysis
 */
export class AudioStack {
  private howl: Howl | null = null;
  private wavesurfer: WaveSurfer | null = null;
  private analyser: MeydaAnalyzer | null = null;
  private audioContext: AudioContext | null = null;
  private toneReady = false;
  private currentKey: string | null = null;
  private currentBPM = 120;

  /**
   * אתחול ערימת האודיו ו-Tone.js
   * Initialize audio stack and ensure Tone.js is ready
   */
  async initialize(): Promise<void> {
    if (this.toneReady) return;

    await Tone.start();
    this.audioContext = Tone.getContext().rawContext as unknown as AudioContext;
    this.toneReady = true;
  }

  /**
   * טעינת רצועה חדשה עם Howler וניצול WaveSurfer לויזואליזציה
   * Load a track and create both Howler and WaveSurfer instances
   */
  async loadTrack(url: string): Promise<void> {
    await this.initialize();

    // ניקוי משאבים קודמים
    this.destroy();

    // יצירת Howler instance
    this.howl = new Howl({
      src: [url],
      autoplay: false,
      preload: 'metadata',
      onload: () => {
        // Track loaded
      },
      onloaderror: (_id: number, error: unknown) => {
        throw new Error(`Audio load failed: ${String(error)}`);
      },
    });

    // יצירת WaveSurfer instance
    const container = document.getElementById('waveform-container');
    if (container) {
      this.wavesurfer = WaveSurfer.create({
        container,
        waveColor: '#6C63FF',
        progressColor: '#9F7AEA',
        height: 60,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
      });

      await this.wavesurfer.load(url);
    }
  }

  /**
   * ניתוח תכונות אודיו בזמן אמת באמצעות Meyda
   * Real-time audio feature analysis using Meyda
   */
  analyze(): AudioFeatures {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    if (!this.analyser) {
      const analyserNode = this.audioContext.createAnalyser();
      analyserNode.fftSize = 2048;

      // חיבור Howler output ל-analyser
      const sourceNode = this.audioContext.createMediaElementSource(
        new Audio()
      );
      sourceNode.connect(analyserNode);
      analyserNode.connect(this.audioContext.destination);

      this.analyser = Meyda.createMeydaAnalyzer({
        audioContext: this.audioContext,
        source: analyserNode,
        bufferSize: 2048,
        featureExtractors: [
          'rms',
          'spectralCentroid',
          'chroma',
          'zcr',
          'spectralFlatness',
        ],
      });
    }

    const features = this.analyser.get([
      'rms',
      'spectralCentroid',
      'chroma',
      'zcr',
      'spectralFlatness',
    ]) as Record<string, any>;

    return {
      rms: features.rms || 0,
      spectralCentroid: features.spectralCentroid || 0,
      chroma: features.chroma || Array.from({ length: 12 }, () => 0),
      zcr: features.zcr,
      spectralFlatness: features.spectralFlatness,
    };
  }

  /**
   * גילוי המפתח המוזיקלי מנתוני ה-chroma
   * Detect musical key using Tonal library and chroma data
   */
  getKey(): string {
    const features = this.analyze();

    // המרת chroma ל-note weights
    const notes = [
      'C', 'C#', 'D', 'D#', 'E', 'F',
      'F#', 'G', 'G#', 'A', 'A#', 'B'
    ];

    let maxChroma = -Infinity;
    let detectedNote = 'C';

    features.chroma.forEach((value, index) => {
      if (value > maxChroma) {
        maxChroma = value;
        detectedNote = notes[index] || 'C';
      }
    });

    // שימוש ב-Tonal לקביעת מפתח מלא
    const key = Tonal.Key.majorKey(detectedNote);
    this.currentKey = key.tonic;

    return this.currentKey ?? detectedNote;
  }

  /**
   * קבלת BPM באמצעות Tone.js Transport
   * Get current BPM from Tone.js Transport
   */
  getBPM(): number {
    return Tone.Transport.bpm.value;
  }

  /**
   * עדכון ה-BPM
   * Set BPM value
   */
  setBPM(bpm: number): void {
    Tone.Transport.bpm.value = bpm;
    this.currentBPM = bpm;
  }

  /**
   * קבלת מפתחות תואמים לערבוב הרמוני (Camelot style)
   * Get compatible keys for harmonic mixing using Tonal
   */
  getCompatibleKeys(key: string): CompatibleKey[] {
    const compatible: CompatibleKey[] = [];

    // אותו מפתח
    compatible.push({ key, distance: 0, energy: 'same' });

    // מפתחות קרובים (+1/-1 בטבעת Camelot)
    const relativeKeys = Tonal.Key.relative(key);
    if (relativeKeys) {
      compatible.push({
        key: relativeKeys,
        distance: 1,
        energy: 'up',
      });
    }

    // מפתחות אחרים תואמים
    const fifth = Tonal.Interval.transpose(key, '5P');
    if (fifth) {
      compatible.push({
        key: fifth,
        distance: 2,
        energy: 'up',
      });
    }

    return compatible.sort((a, b) => a.distance - b.distance);
  }

  /**
   * השמעת ההקלטה
   * Play the loaded track
   */
  play(): void {
    this.howl?.play();
    this.wavesurfer?.play();
  }

  /**
   * השהיית ההקלטה
   * Pause the loaded track
   */
  pause(): void {
    this.howl?.pause();
    this.wavesurfer?.pause();
  }

  /**
   * עצירת ההקלטה
   * Stop the loaded track
   */
  stop(): void {
    this.howl?.stop();
    this.wavesurfer?.stop();
  }

  /**
   * קביעת עמדת ההשמעה
   * Seek to a specific time
   */
  seek(time: number): void {
    if (this.howl) {
      this.howl.seek(time);
    }
    if (this.wavesurfer) {
      this.wavesurfer.seekTo(time / this.getDuration());
    }
  }

  /**
   * קבלת משך ההקלטה בשניות
   * Get track duration in seconds
   */
  getDuration(): number {
    return this.howl?.duration() || 0;
  }

  /**
   * קבלת עמדה נוכחית בשניות
   * Get current playback position
   */
  getCurrentTime(): number {
    return this.howl?.seek() || 0;
  }

  /**
   * הגדרת עוצמת הצליל
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.howl?.volume(Math.max(0, Math.min(1, volume)));
  }

  /**
   * ניקוי כל המשאבים והחיבורים
   * Cleanup all resources and connections
   */
  destroy(): void {
    if (this.howl) {
      this.howl.unload();
      this.howl = null;
    }

    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
    }

    if (this.analyser) {
      this.analyser.stop();
      this.analyser = null;
    }

    this.currentKey = null;
  }

  /**
   * בדיקה אם יש רצועה טעונה
   * Check if a track is currently loaded
   */
  isLoaded(): boolean {
    return this.howl !== null;
  }

  /**
   * בדיקה אם כרגע בהשמעה
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.howl?.playing() || this.wavesurfer?.isPlaying() || false;
  }
}

/**
 * סינגלטון AudioStack לשימוש בכל האפליקציה
 * Singleton instance for use throughout the application
 */
let audioStackInstance: AudioStack | null = null;

/**
 * קבלת instance של AudioStack או יצירת חדש
 * Get or create AudioStack singleton instance
 */
export function getAudioStack(): AudioStack {
  if (!audioStackInstance) {
    audioStackInstance = new AudioStack();
  }
  return audioStackInstance;
}

export default AudioStack;
