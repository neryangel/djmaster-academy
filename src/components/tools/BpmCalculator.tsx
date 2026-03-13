import React, { useState, useCallback, useRef, useEffect } from 'react';

interface TapState {
  bpm: number;
  taps: number;
  isStable: boolean;
}

const GENRE_BPM: Record<string, [number, number]> = {
  'Hip-Hop': [85, 115],
  'House': [120, 130],
  'Tech House': [124, 128],
  'Techno': [128, 140],
  'Trance': [130, 145],
  'Drum & Bass': [160, 180],
  'Dubstep': [138, 142],
  'Pop': [100, 130],
  'Psytrance': [140, 150],
};

export default function BpmCalculator() {
  const [tapState, setTapState] = useState<TapState>({ bpm: 0, taps: 0, isStable: false });
  const [manualBpm, setManualBpm] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const tapsRef = useRef<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback(() => {
    const now = performance.now();

    // Reset if gap > 3 seconds
    if (tapsRef.current.length > 0 && now - tapsRef.current[tapsRef.current.length - 1] > 3000) {
      tapsRef.current = [];
    }

    tapsRef.current.push(now);
    if (tapsRef.current.length > 16) tapsRef.current.shift();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);

    if (tapsRef.current.length < 2) {
      setTapState({ bpm: 0, taps: 1, isStable: false });
      return;
    }

    const intervals: number[] = [];
    for (let i = 1; i < tapsRef.current.length; i++) {
      intervals.push(tapsRef.current[i] - tapsRef.current[i - 1]);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.round(60000 / avg * 10) / 10;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avg, 2), 0) / intervals.length;
    const isStable = Math.sqrt(variance) < avg * 0.1;

    setTapState({
      bpm: Math.max(20, Math.min(300, bpm)),
      taps: tapsRef.current.length,
      isStable,
    });
  }, []);

  const handleReset = () => {
    tapsRef.current = [];
    setTapState({ bpm: 0, taps: 0, isStable: false });
    setManualBpm('');
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleTap();
      }
      if (e.code === 'Escape') handleReset();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleTap]);

  const displayBpm = manualBpm ? parseFloat(manualBpm) || 0 : tapState.bpm;

  const getGenre = (bpm: number): string => {
    for (const [genre, [min, max]] of Object.entries(GENRE_BPM)) {
      if (bpm >= min && bpm <= max) return genre;
    }
    return '';
  };

  const genre = displayBpm > 0 ? getGenre(displayBpm) : '';

  return (
    <div className="flex flex-col items-center gap-6 p-6 font-hebrew" dir="rtl">
      <h2 className="text-2xl font-bold text-dj-cyan font-mono">מחשבון BPM</h2>
      <p className="text-dj-text-secondary text-sm">הקש על העיגול או לחץ רווח לזיהוי טמפו</p>

      {/* Tap Zone */}
      <button
        onClick={handleTap}
        className={`
          w-56 h-56 rounded-full border-3 border-dj-cyan
          bg-gradient-to-br from-dj-card to-dj-dark
          flex flex-col items-center justify-center
          cursor-pointer select-none
          shadow-[0_0_30px_rgba(0,212,255,0.2)]
          hover:shadow-[0_0_50px_rgba(0,212,255,0.4)]
          transition-all duration-100
          ${isAnimating ? 'scale-95 shadow-[0_0_60px_rgba(0,212,255,0.6)]' : ''}
        `}
      >
        <span className="text-5xl font-mono font-bold text-dj-cyan">
          {displayBpm > 0 ? displayBpm.toFixed(1) : '—'}
        </span>
        <span className="text-sm text-gray-400 mt-1">BPM</span>
        {genre && (
          <span className="text-xs text-dj-purple mt-2 bg-dj-purple/10 px-3 py-1 rounded-full">
            {genre}
          </span>
        )}
      </button>

      {/* Tap count + stability */}
      <div className="flex gap-4 text-sm">
        <span className="text-gray-400">
          הקשות: <span className="text-white font-mono">{tapState.taps}</span>
        </span>
        {tapState.taps >= 4 && (
          <span className={tapState.isStable ? 'text-dj-green' : 'text-dj-orange'}>
            {tapState.isStable ? '✓ יציב' : '⟳ ממשיך למדוד...'}
          </span>
        )}
      </div>

      {/* Manual BPM input */}
      <div className="flex gap-3 items-center">
        <label className="text-sm text-gray-400">או הזן ידנית:</label>
        <input
          type="number"
          min="20"
          max="300"
          step="0.1"
          value={manualBpm}
          onChange={(e) => setManualBpm(e.target.value)}
          placeholder="120.0"
          className="w-24 px-3 py-2 bg-dj-card border border-dj-border rounded-lg
                     text-center font-mono text-white text-lg
                     focus:border-dj-cyan focus:outline-none"
        />
      </div>

      {/* Genre BPM Reference */}
      <div className="w-full max-w-md mt-4">
        <h3 className="text-sm text-gray-400 mb-3 text-center">טווחי BPM לפי ז'אנר</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(GENRE_BPM).map(([name, [min, max]]) => (
            <div
              key={name}
              className={`
                flex justify-between items-center px-3 py-2 rounded-lg text-sm
                ${displayBpm >= min && displayBpm <= max
                  ? 'bg-dj-primary/20 border border-dj-primary/40 text-white'
                  : 'bg-dj-card/50 text-gray-400'
                }
              `}
            >
              <span>{name}</span>
              <span className="font-mono text-xs">{min}–{max}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="px-6 py-2 bg-dj-card border border-dj-border rounded-full
                   text-gray-400 text-sm hover:text-white hover:border-dj-accent
                   transition-all"
      >
        אפס (Esc)
      </button>

      <p className="text-xs text-gray-500 mt-2">
        💡 טיפ: לתוצאה מדויקת, הקש לפחות 8 פעמים בקצב המוזיקה
      </p>
    </div>
  );
}
