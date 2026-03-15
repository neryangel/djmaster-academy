import { useState, useRef, useCallback } from 'react';

interface AudioContextsRef {
  audioContext: AudioContext | null;
  oscillatorA: OscillatorNode | null;
  oscillatorB: OscillatorNode | null;
  noiseA: AudioBufferSourceNode | null;
  noiseB: AudioBufferSourceNode | null;
  gainA: GainNode | null;
  gainB: GainNode | null;
}

interface DeckState {
  isPlaying: boolean;
  bpm: number;
  tempo: number; // Percentage: 100 = normal, 80 = -20%, 120 = +20%
  phase: number; // Offset in milliseconds
  beat: number; // Current beat (0-3)
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_LABELS = {
  easy: 'קל',
  medium: 'בינוני',
  hard: 'קשה',
};

const initializeAudioContext = (): AudioContextsRef => ({
  audioContext: null,
  oscillatorA: null,
  oscillatorB: null,
  noiseA: null,
  noiseB: null,
  gainA: null,
  gainB: null,
});

const createNoiseBuffer = (audioContext: AudioContext, duration: number): AudioBuffer => {
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

export default function BeatmatchTrainer() {
  const audioContextRef = useRef<AudioContextsRef>(initializeAudioContext());
  const [deckA, setDeckA] = useState<DeckState>({
    isPlaying: false,
    bpm: 125,
    tempo: 100,
    phase: 0,
    beat: 0,
  });

  const [deckB, setDeckB] = useState<DeckState>({
    isPlaying: false,
    bpm: 122,
    tempo: 100,
    phase: 0,
    beat: 0,
  });

  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ attempts: 0, correct: 0 });

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<{ [key: string]: number }>({});
  const beatCounterRef = useRef<{ [key: string]: number }>({});

  const initAudio = useCallback(() => {
    if (audioContextRef.current.audioContext) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current.audioContext = audioContext;

    // Create gain nodes
    const gainA = audioContext.createGain();
    const gainB = audioContext.createGain();
    gainA.gain.value = 0.3;
    gainB.gain.value = 0.3;
    gainA.connect(audioContext.destination);
    gainB.connect(audioContext.destination);

    audioContextRef.current.gainA = gainA;
    audioContextRef.current.gainB = gainB;
  }, []);

  const playDeck = useCallback(
    (deck: 'A' | 'B') => {
      initAudio();
      const ctx = audioContextRef.current;
      const deckState = deck === 'A' ? deckA : deckB;
      const setDeckState = deck === 'A' ? setDeckA : setDeckB;
      const gain = deck === 'A' ? ctx.gainA : ctx.gainB;

      if (!ctx.audioContext || !gain) return;

      const actualBpm = (deckState.bpm * deckState.tempo) / 100;
      const beatDuration = (60 / actualBpm) * 1000; // milliseconds

      startTimeRef.current[deck] = Date.now();
      beatCounterRef.current[deck] = 0;

      setDeckState({ ...deckState, isPlaying: true });

      const playBeats = () => {
        const elapsed = Date.now() - (startTimeRef.current[deck] ?? Date.now());
        const beatIndex = Math.floor(elapsed / beatDuration) % 4;

        if (beatCounterRef.current[deck] !== beatIndex) {
          beatCounterRef.current[deck] = beatIndex;
          setDeckState((prev) => ({ ...prev, beat: beatIndex }));

          // Play click sound
          playClickSound(ctx, beatIndex === 0, gain);
        }

        animationFrameRef.current = requestAnimationFrame(playBeats);
      };

      playBeats();
    },
    [deckA, deckB, initAudio]
  );

  const stopDeck = useCallback((deck: 'A' | 'B') => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setDeckState((prev) => ({ ...prev, isPlaying: false, beat: 0 }));

    const ctx = audioContextRef.current;
    if (ctx.audioContext) {
      const oscillator = deck === 'A' ? ctx.oscillatorA : ctx.oscillatorB;
      if (oscillator) {
        oscillator.stop();
      }
    }
  }, []);

  const playClickSound = (
    ctx: AudioContextsRef,
    isKick: boolean,
    gain: GainNode
  ) => {
    if (!ctx.audioContext) return;

    const now = ctx.audioContext.currentTime;
    const duration = isKick ? 0.15 : 0.1;

    // Create oscillator for kick or noise for hi-hat
    if (isKick) {
      const osc = ctx.audioContext.createOscillator();
      const oscGain = ctx.audioContext.createGain();

      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + duration);

      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(oscGain);
      oscGain.connect(gain);

      osc.start(now);
      osc.stop(now + duration);
    } else {
      const noiseBuffer = createNoiseBuffer(ctx.audioContext, duration);
      const bufferSource = ctx.audioContext.createBufferSource();
      const noiseGain = ctx.audioContext.createGain();
      const filter = ctx.audioContext.createBiquadFilter();

      filter.type = 'highpass';
      filter.frequency.value = 8000;

      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      bufferSource.buffer = noiseBuffer;
      bufferSource.connect(noiseGain);
      noiseGain.connect(filter);
      filter.connect(gain);

      bufferSource.start(now);
      bufferSource.stop(now + duration);
    }
  };

  const changeTempo = useCallback((deck: 'A' | 'B', change: number) => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    setDeckState((prev) => ({
      ...prev,
      tempo: Math.max(80, Math.min(120, prev.tempo + change)),
    }));
  }, []);

  const nudgePhase = useCallback((deck: 'A' | 'B', direction: 'forward' | 'back') => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    const change = direction === 'forward' ? 50 : -50;
    setDeckState((prev) => ({
      ...prev,
      phase: prev.phase + change,
    }));
  }, []);

  const checkMatch = useCallback(() => {
    const bpmA = (deckA.bpm * deckA.tempo) / 100;
    const bpmB = (deckB.bpm * deckB.tempo) / 100;
    const bpmDiff = Math.abs(bpmA - bpmB);
    const bpmAccuracy = Math.max(0, 100 - bpmDiff * 5);

    // Simple beat alignment check (would need more sophisticated timing in production)
    const beatDiff = Math.abs(deckA.beat - deckB.beat);
    const beatAccuracy = beatDiff === 0 ? 100 : Math.max(0, 100 - beatDiff * 30);

    const combinedAccuracy = Math.round((bpmAccuracy + beatAccuracy) / 2);

    setAccuracy(combinedAccuracy);
    setStats((prev) => ({
      attempts: prev.attempts + 1,
      correct: prev.correct + (combinedAccuracy > 90 ? 1 : 0),
    }));

    if (combinedAccuracy > 90) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  }, [deckA, deckB]);

  const resetTrainer = useCallback(() => {
    stopDeck('A');
    stopDeck('B');
    setDeckA({
      isPlaying: false,
      bpm: Math.floor(Math.random() * 11) + 120, // 120-130
      tempo: 100,
      phase: 0,
      beat: 0,
    });
    setDeckB({
      isPlaying: false,
      bpm: Math.floor(Math.random() * 7) - 3 + Math.floor(Math.random() * 11) + 120, // ±3-5
      tempo: 100,
      phase: 0,
      beat: 0,
    });
    setAccuracy(null);
  }, [stopDeck]);

  const renderDeck = (deck: 'A' | 'B', state: DeckState, _setterFunc: (func: (prev: DeckState) => DeckState) => void) => {
    const showBpm = difficulty === 'easy' || (difficulty === 'medium' && deck === 'A');

    return (
      <div className="bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30">
        <h2 className="text-2xl font-bold text-[#00d4ff] mb-4">דק {deck}</h2>

        {/* Beat Indicator */}
        <div className="mb-6 flex gap-2 justify-center">
          {[0, 1, 2, 3].map((beat) => (
            <div
              key={beat}
              className={`w-8 h-8 rounded-full transition-all ${
                state.beat === beat && state.isPlaying
                  ? 'bg-[#00d4ff] scale-110 shadow-lg shadow-[#00d4ff]'
                  : 'bg-[#7b2fff]/30'
              }`}
            />
          ))}
        </div>

        {/* BPM Display */}
        <div className="mb-6 text-center">
          {showBpm ? (
            <div>
              <p className="text-gray-400 text-sm mb-1">BPM</p>
              <p className="text-4xl font-bold text-[#00d4ff]">
                {Math.round((state.bpm * state.tempo) / 100)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{state.bpm} בסיס</p>
            </div>
          ) : (
            <div>
              <p className="text-4xl font-bold text-gray-600">???</p>
              <p className="text-gray-400 text-sm mt-2">הוסתר</p>
            </div>
          )}
        </div>

        {/* Play/Pause Button */}
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => (state.isPlaying ? stopDeck(deck) : playDeck(deck))}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              state.isPlaying
                ? 'bg-red-500/30 hover:bg-red-500/50 text-red-300 border border-red-500'
                : 'bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30 text-[#00d4ff] border border-[#00d4ff]'
            }`}
          >
            {state.isPlaying ? 'הפסק' : 'הפעל'}
          </button>
        </div>

        {/* Tempo Fader */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-300">טמפו</p>
            <p className="text-[#00d4ff] text-sm font-bold">
              {state.tempo > 100 ? '+' : ''}
              {state.tempo - 100}%
            </p>
          </div>
          <input
            type="range"
            min="80"
            max="120"
            value={state.tempo}
            onChange={(e) => {
              const newTempo = parseInt(e.target.value);
              const setDeckState = deck === 'A' ? setDeckA : setDeckB;
              setDeckState((prev) => ({ ...prev, tempo: newTempo }));
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-20%</span>
            <span>0%</span>
            <span>+20%</span>
          </div>
        </div>

        {/* Nudge Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => nudgePhase(deck, 'back')}
            className="flex-1 py-2 bg-[#7b2fff]/30 hover:bg-[#7b2fff]/50 text-white rounded transition text-sm font-semibold"
          >
            ← דחיפה לאחור
          </button>
          <button
            onClick={() => nudgePhase(deck, 'forward')}
            className="flex-1 py-2 bg-[#7b2fff]/30 hover:bg-[#7b2fff]/50 text-white rounded transition text-sm font-semibold"
          >
            דחיפה קדימה →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full text-white" dir="rtl">
        <p className="text-gray-400 mb-6">אזן עצמך למציאת ה-BPM המושלם ויישור הביטים</p>

        {/* Controls and Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Difficulty */}
          <div className="bg-[#1a1a1f] rounded-lg p-4 border border-[#7b2fff]/30">
            <p className="text-sm font-semibold text-gray-300 mb-3">רמת קושי</p>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setDifficulty(level);
                    resetTrainer();
                  }}
                  className={`flex-1 py-2 rounded text-sm font-semibold transition ${
                    difficulty === level
                      ? 'bg-[#00d4ff] text-[#0A0A0F]'
                      : 'bg-[#7b2fff]/30 hover:bg-[#7b2fff]/50 text-white'
                  }`}
                >
                  {DIFFICULTY_LABELS[level]}
                </button>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="bg-[#1a1a1f] rounded-lg p-4 border border-[#7b2fff]/30">
            <p className="text-sm font-semibold text-gray-300 mb-1">ניקוד</p>
            <p className="text-3xl font-bold text-[#00d4ff]">{score}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.attempts === 0 ? '0' : Math.round((stats.correct / stats.attempts) * 100)}% הצליח
            </p>
          </div>

          {/* Streak */}
          <div className="bg-[#1a1a1f] rounded-lg p-4 border border-[#7b2fff]/30">
            <p className="text-sm font-semibold text-gray-300 mb-1">רצף התאמות</p>
            <p className="text-3xl font-bold text-[#7b2fff]">{streak}</p>
            <p className="text-xs text-gray-500 mt-2">התאמות מוצלחות ברצף</p>
          </div>
        </div>

        {/* Decks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {renderDeck('A', deckA, setDeckA)}
          {renderDeck('B', deckB, setDeckB)}
        </div>

        {/* Check Match and Reset */}
        <div className="bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={checkMatch}
              disabled={!deckA.isPlaying || !deckB.isPlaying}
              className="py-3 px-6 bg-[#00d4ff] hover:bg-[#00d4ff]/80 disabled:opacity-30 disabled:cursor-not-allowed text-[#0A0A0F] font-bold rounded-lg transition text-lg"
            >
              בדוק התאמה
            </button>
            <button
              onClick={resetTrainer}
              className="py-3 px-6 bg-[#7b2fff]/30 hover:bg-[#7b2fff]/50 text-white font-bold rounded-lg transition"
            >
              התחל מחדש
            </button>
          </div>
        </div>

        {/* Accuracy Result */}
        {accuracy !== null && (
          <div className="bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30">
            <h2 className="text-2xl font-bold text-[#00d4ff] mb-4">תוצאה</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">דיוק</p>
                <p className={`text-5xl font-bold ${accuracy > 90 ? 'text-[#00d4ff]' : accuracy > 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {accuracy}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {accuracy > 90
                    ? '✓ מושלם!'
                    : accuracy > 70
                      ? '~ טוב'
                      : '✗ נסה שוב'}
                </p>
              </div>

              <div className="bg-[#0A0A0F] rounded p-4">
                <p className="text-gray-400 text-sm mb-3">פרטים</p>
                <p className="text-sm text-gray-300 mb-2">
                  BPM דק A: {Math.round((deckA.bpm * deckA.tempo) / 100)}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  BPM דק B: {Math.round((deckB.bpm * deckB.tempo) / 100)}
                </p>
                <p className="text-sm text-gray-300">
                  הפרש: {Math.abs(Math.round((deckA.bpm * deckA.tempo) / 100) - Math.round((deckB.bpm * deckB.tempo) / 100))} BPM
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
