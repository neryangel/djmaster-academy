import { z } from 'zod';

// === Musical Key (Camelot Wheel) ===
export const CamelotKeySchema = z.object({
  number: z.number().int().min(1).max(12),
  letter: z.enum(['A', 'B']),
  musicalKey: z.string(),
  color: z.string(),
});
export type CamelotKey = z.infer<typeof CamelotKeySchema>;

// === BPM Range ===
export const BpmRangeSchema = z.object({
  min: z.number().min(20).max(300),
  max: z.number().min(20).max(300),
});
export type BpmRange = z.infer<typeof BpmRangeSchema>;

// === Track Analysis ===
export interface TrackAnalysis {
  bpm: number;
  key: CamelotKey;
  energy: number; // 0-1
  danceability: number; // 0-1
  duration: number; // seconds
  waveformData: Float32Array;
  beatPositions: number[]; // timestamps in seconds
  segments: TrackSegment[];
}

// === Track Segment ===
export interface TrackSegment {
  type: 'intro' | 'buildup' | 'drop' | 'breakdown' | 'outro';
  startTime: number;
  endTime: number;
  energy: number;
}

// === Cue Point ===
export const CuePointSchema = z.object({
  id: z.string(),
  name: z.string(),
  time: z.number().min(0),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  type: z.enum(['hot_cue', 'loop_in', 'loop_out', 'memory']),
});
export type CuePoint = z.infer<typeof CuePointSchema>;

// === DJ Set Track ===
export const SetTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  bpm: z.number().min(20).max(300),
  key: z.string(),
  camelotKey: z.string().optional(),
  energy: z.number().min(0).max(10),
  genre: z.string().optional(),
  duration: z.number().min(0).optional(),
  notes: z.string().optional(),
  transitionType: z
    .enum([
      'beatmatch',
      'cut',
      'fade',
      'echo_out',
      'filter',
      'backspin',
      'loop_roll',
      'slam',
    ])
    .optional(),
});
export type SetTrack = z.infer<typeof SetTrackSchema>;

// === EQ Band ===
export interface EQBand {
  name: 'low' | 'mid' | 'high';
  frequency: number;
  gain: number; // -24 to +6 dB
  q: number;
}

// === Audio Player State ===
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
  error: string | null;
}
