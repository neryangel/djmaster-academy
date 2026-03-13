import { useState, useRef, useCallback, useEffect } from 'react';

interface EQBand {
  name: string;
  nameHe: string;
  frequency: number;
  range: string;
  description: string;
}

const EQ_BANDS: EQBand[] = [
  { name: 'Sub Bass', nameHe: 'סאב באס', frequency: 60, range: '20–60 Hz', description: 'תדרים שמרגישים יותר מאשר שומעים' },
  { name: 'Bass', nameHe: 'באס', frequency: 150, range: '60–250 Hz', description: 'באס, קיק דראם, ביס' },
  { name: 'Low Mids', nameHe: 'אמצעים נמוכים', frequency: 500, range: '250–800 Hz', description: 'חום וגוף של הצליל' },
  { name: 'Mids', nameHe: 'אמצעים', frequency: 2000, range: '800–3000 Hz', description: 'ווקאלים, מלודיות' },
  { name: 'High Mids', nameHe: 'אמצעים גבוהים', frequency: 5000, range: '3–6 kHz', description: 'נוכחות, בהירות' },
  { name: 'Highs', nameHe: 'גבוהים', frequency: 10000, range: '6–16 kHz', description: 'היי-האטים, אוויריות, ברק' },
];

type GameState = 'idle' | 'playing' | 'guessing' | 'result';

export default function EqTrainer() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [targetBand, setTargetBand] = useState<number>(0);
  const [boostAmount, setBoostAmount] = useState<number>(6); // dB
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [lastGuess, setLastGuess] = useState<{ correct: boolean; band: number } | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const eqRef = useRef<BiquadFilterNode | null>(null);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);

  const difficultySettings = {
    easy: { boost: 12, bands: 3 },
    medium: { boost: 6, bands: 4 },
    hard: { boost: 3, bands: 6 },
  };

  const createPinkNoise = useCallback((ctx: AudioContext): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }
    return buffer;
  }, []);

  const startRound = useCallback(() => {
    const settings = difficultySettings[difficulty];
    const availableBands = EQ_BANDS.slice(0, settings.bands);
    const randomBand = Math.floor(Math.random() * availableBands.length);

    setTargetBand(randomBand);
    setBoostAmount(settings.boost);
    setGameState('guessing');
    setLastGuess(null);

    // Create audio
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Stop previous
    stopAudio();

    // Pink noise source
    const noise = ctx.createBufferSource();
    noise.buffer = createPinkNoise(ctx);
    noise.loop = true;

    // EQ filter
    const eq = ctx.createBiquadFilter();
    eq.type = 'peaking';
    const targetBand = availableBands[randomBand];
    if (!targetBand) return;
    eq.frequency.value = targetBand.frequency;
    eq.Q.value = 2;
    eq.gain.value = settings.boost;

    // Gain
    const gain = ctx.createGain();
    gain.gain.value = 0.3;

    noise.connect(eq);
    eq.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    noiseRef.current = noise;
    eqRef.current = eq;
    gainRef.current = gain;
    setIsPlaying(true);
  }, [difficulty, createPinkNoise]);

  const stopAudio = () => {
    try {
      noiseRef.current?.stop();
      noiseRef.current?.disconnect();
    } catch {}
    noiseRef.current = null;
    eqRef.current = null;
    gainRef.current = null;
    setIsPlaying(false);
  };

  const handleGuess = (bandIndex: number) => {
    const correct = bandIndex === targetBand;
    setLastGuess({ correct, band: targetBand });
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    setGameState('result');
    stopAudio();
  };

  const toggleEQ = () => {
    if (eqRef.current) {
      eqRef.current.gain.value = eqRef.current.gain.value > 0 ? 0 : boostAmount;
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const settings = difficultySettings[difficulty];
  const availableBands = EQ_BANDS.slice(0, settings.bands);
  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6 p-6 font-hebrew max-w-2xl mx-auto" dir="rtl">
      <h2 className="text-2xl font-bold text-dj-purple font-mono">אימון אוזן — EQ</h2>
      <p className="text-dj-text-secondary text-sm text-center">
        זהה איזה תדר הוגבר ברעש. שפר את האוזן שלך לאיקוואלייזר
      </p>

      {/* Score */}
      <div className="flex gap-6 text-sm">
        <span className="text-gray-400">
          ניקוד: <span className="text-white font-mono">{score.correct}/{score.total}</span>
        </span>
        <span className={`${accuracy >= 70 ? 'text-dj-green' : accuracy >= 40 ? 'text-dj-orange' : 'text-dj-accent'}`}>
          דיוק: {accuracy}%
        </span>
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2">
        {(['easy', 'medium', 'hard'] as const).map((d) => (
          <button
            key={d}
            onClick={() => { setDifficulty(d); setGameState('idle'); stopAudio(); }}
            className={`px-4 py-2 rounded-full text-sm transition-all
              ${difficulty === d
                ? 'bg-dj-primary text-white'
                : 'bg-dj-card border border-dj-border text-gray-400 hover:text-white'
              }`}
          >
            {{ easy: 'קל', medium: 'בינוני', hard: 'קשה' }[d]}
            <span className="text-xs mr-1 opacity-60">
              ({difficultySettings[d].boost}dB, {difficultySettings[d].bands} תדרים)
            </span>
          </button>
        ))}
      </div>

      {/* Game area */}
      {gameState === 'idle' && (
        <button
          onClick={startRound}
          className="px-8 py-4 bg-gradient-to-r from-dj-primary to-dj-purple
                     text-white rounded-full text-lg font-bold
                     hover:shadow-[0_0_30px_rgba(108,99,255,0.4)]
                     transition-all"
        >
          🎧 התחל סיבוב
        </button>
      )}

      {gameState === 'guessing' && (
        <div className="w-full space-y-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleEQ}
              className="px-4 py-2 bg-dj-card border border-dj-cyan rounded-lg
                         text-dj-cyan text-sm hover:bg-dj-cyan/10 transition-all"
            >
              🔊 החלף EQ On/Off
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm">באיזה תחום תדרים יש הגברה?</p>

          <div className="grid grid-cols-2 gap-3">
            {availableBands.map((band, i) => (
              <button
                key={band.name}
                onClick={() => handleGuess(i)}
                className="p-4 bg-dj-card border border-dj-border rounded-xl
                           hover:border-dj-primary hover:bg-dj-primary/10
                           transition-all text-right"
              >
                <div className="font-bold text-white">{band.nameHe}</div>
                <div className="text-xs text-gray-400 font-mono">{band.range}</div>
                <div className="text-xs text-gray-500 mt-1">{band.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'result' && lastGuess && (
        <div className="w-full space-y-4 text-center">
          <div className={`text-4xl ${lastGuess.correct ? '' : ''}`}>
            {lastGuess.correct ? '🎯' : '❌'}
          </div>
          <p className={`text-xl font-bold ${lastGuess.correct ? 'text-dj-green' : 'text-dj-accent'}`}>
            {lastGuess.correct ? 'מדויק!' : 'לא מדויק'}
          </p>
          {!lastGuess.correct && (
            <p className="text-gray-400">
              התשובה הנכונה: <span className="text-white">{availableBands[lastGuess.band]?.nameHe}</span>
              <span className="text-xs text-gray-500 mr-2 font-mono">
                ({availableBands[lastGuess.band]?.range})
              </span>
            </p>
          )}
          <button
            onClick={startRound}
            className="px-6 py-3 bg-gradient-to-r from-dj-primary to-dj-purple
                       text-white rounded-full font-bold
                       hover:shadow-[0_0_20px_rgba(108,99,255,0.4)]
                       transition-all"
          >
            סיבוב הבא ←
          </button>
        </div>
      )}
    </div>
  );
}
