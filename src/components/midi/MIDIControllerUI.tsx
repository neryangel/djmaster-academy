import React, { useState } from 'react';
import type { MidiConnectionState, MidiEvent } from '../../types/midi';

interface MIDIControllerUIProps {
  connectionState: MidiConnectionState;
  onMidiEvent?: (event: MidiEvent) => void;
  decksState?: {
    playing: { A: boolean; B: boolean };
    cued: { A: boolean; B: boolean };
    synced: { A: boolean; B: boolean };
    volume: { A: number; B: number };
    tempo: { A: number; B: number };
  };
  activePads?: { A: number[]; B: number[] };
  crossfaderPosition?: number;
}

interface RotaryKnobProps {
  value: number;
  label: string;
  labelHe: string;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
}

interface JogWheelProps {
  deck: 'A' | 'B';
  isPlaying: boolean;
  rotation?: number;
  onChange?: (rotation: number) => void;
}

function RotaryKnob({ value, label, labelHe, onChange, min = 0, max = 127 }: RotaryKnobProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(parseFloat(e.target.value));
  };

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        {/* Knob background */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Base circle */}
          <circle cx="50" cy="50" r="48" fill="#1A1A2E" stroke="#2A2A3E" strokeWidth="2" />

          {/* Gradient */}
          <defs>
            <radialGradient id={`knob-${labelHe}`} cx="40%" cy="40%">
              <stop offset="0%" stopColor="#333" />
              <stop offset="100%" stopColor="#0A0A0F" />
            </radialGradient>
            <linearGradient id={`knob-shine-${labelHe}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#knob-${labelHe})`} />
          <circle cx="50" cy="50" r="46" fill={`url(#knob-shine-${labelHe})`} opacity="0.3" />

          {/* Center button */}
          <circle cx="50" cy="50" r="12" fill="#00D4FF" opacity="0.8" />
          <circle cx="50" cy="50" r="10" fill="#00D4FF" opacity="0.6" />

          {/* Indicator line */}
          <g transform={`rotate(${rotation} 50 50)`}>
            <line x1="50" y1="8" x2="50" y2="20" stroke="#FF6584" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Tick marks */}
          {[0, 90, 180, 270].map((angle, i) => (
            <line
              key={`tick-${i}`}
              x1="50"
              y1="8"
              x2="50"
              y2="15"
              stroke="#444"
              strokeWidth="2"
              transform={`rotate(${angle - 135} 50 50)`}
            />
          ))}
        </svg>

        {/* Hidden input for state management */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="text-center text-xs">
        <div className="text-dj-cyan font-mono">{label}</div>
        <div className="text-gray-400 font-hebrew text-xs">{labelHe}</div>
      </div>
    </div>
  );
}

function JogWheel({ deck, isPlaying, rotation = 0 }: JogWheelProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer ring */}
          <circle cx="50" cy="50" r="48" fill="#0A0A0F" stroke="#2A2A3E" strokeWidth="2" />

          {/* Gradient background */}
          <defs>
            <radialGradient id={`jog-${deck}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1A1A2E" />
              <stop offset="100%" stopColor="#0A0A0F" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#jog-${deck})`} />

          {/* Spinner pattern */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={`seg-${i}`}
              x1="50"
              y1="10"
              x2="50"
              y2="25"
              stroke="#00D4FF"
              strokeWidth="2"
              opacity={0.3 + (i % 2) * 0.4}
              transform={`rotate(${angle + rotation} 50 50)`}
            />
          ))}

          {/* Center button */}
          <circle cx="50" cy="50" r="14" fill="#FF6584" opacity="0.8" />
          <circle cx="50" cy="50" r="12" fill="#FF6584" opacity="0.6" />

          {/* Playing indicator */}
          {isPlaying && (
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="4 4"
            />
          )}
        </svg>
      </div>

      <div className="text-center">
        <div className="text-dj-cyan font-mono text-sm font-bold">甲板 {deck}</div>
        <div className="text-xs text-gray-400">
          {isPlaying ? '▶ चल रहा है' : '⏸ रुका हुआ'}
        </div>
      </div>
    </div>
  );
}

function Pad({ index, isActive = false, onClick }: { index: number; isActive?: boolean; onClick?: () => void }) {
  const colors = ['#FF6584', '#00D4FF', '#00FF88', '#7B2FFF', '#FF8C00', '#FF1493', '#00CED1', '#FFD700'];
  const padColor = colors[index % colors.length];

  return (
    <button
      onClick={onClick}
      className={`
        w-12 h-12 rounded transition-all duration-200
        ${isActive
          ? 'shadow-lg scale-95'
          : 'hover:scale-105'
        }
      `}
      style={{
        backgroundColor: isActive ? padColor : 'rgba(0,0,0,0.3)',
        border: `2px solid ${padColor}`,
        boxShadow: isActive ? `0 0 20px ${padColor}` : 'none',
      }}
    />
  );
}

export default function MIDIControllerUI({
  connectionState,
  onMidiEvent: _onMidiEvent,
  decksState = {
    playing: { A: false, B: false },
    cued: { A: false, B: false },
    synced: { A: false, B: false },
    volume: { A: 100, B: 100 },
    tempo: { A: 0, B: 0 },
  },
  activePads = { A: [], B: [] },
  crossfaderPosition = 64,
}: MIDIControllerUIProps) {
  const [localCrossfader, setLocalCrossfader] = useState(crossfaderPosition);
  const [knobValues, setKnobValues] = useState({
    eqHiA: 64,
    eqMidA: 64,
    eqLoA: 64,
    eqHiB: 64,
    eqMidB: 64,
    eqLoB: 64,
  });

  const handleKnobChange = (key: keyof typeof knobValues, value: number) => {
    setKnobValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full bg-dj-dark rounded-lg border border-dj-border p-6 font-hebrew" dir="rtl">
      {/* Header with connection status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dj-cyan">DDJ-FLX4 בקר</h2>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: connectionState.isConnected ? '#00FF88' : '#FF6584',
            }}
          />
          <span className="text-xs text-gray-400">
            {connectionState.isConnected ? 'מחובר' : 'מנותק'}
          </span>
          {connectionState.deviceName && (
            <span className="text-xs text-gray-500 mr-2">• {connectionState.deviceName}</span>
          )}
        </div>
      </div>

      {/* Main Controller Layout */}
      <div className="space-y-8">
        {/* Decks and EQ */}
        <div className="grid grid-cols-3 gap-8">
          {/* Deck A */}
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="font-bold text-dj-cyan text-lg">甲板 A</h3>
            </div>

            {/* Jog Wheel A */}
            <div className="flex justify-center">
              <JogWheel deck="A" isPlaying={decksState.playing.A} />
            </div>

            {/* Transport buttons A */}
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`px-3 py-2 rounded text-xs font-bold transition-all ${
                  decksState.playing.A
                    ? 'bg-dj-green text-dj-dark shadow-lg shadow-dj-green/50'
                    : 'bg-dj-card border border-dj-border text-gray-400 hover:border-dj-green'
                }`}
              >
                ▶ הפעל
              </button>
              <button
                className={`px-3 py-2 rounded text-xs font-bold transition-all ${
                  decksState.cued.A
                    ? 'bg-dj-cyan text-dj-dark shadow-lg shadow-dj-cyan/50'
                    : 'bg-dj-card border border-dj-border text-gray-400 hover:border-dj-cyan'
                }`}
              >
                🎯 Cue
              </button>
              <button
                className={`px-3 py-2 rounded text-xs font-bold transition-all ${
                  decksState.synced.A
                    ? 'bg-dj-purple text-white shadow-lg shadow-dj-purple/50'
                    : 'bg-dj-card border border-dj-border text-gray-400 hover:border-dj-purple'
                }`}
              >
                🔗 Sync
              </button>
            </div>

            {/* EQ Knobs A */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <RotaryKnob
                value={knobValues.eqHiA}
                label="HI"
                labelHe="גבוה"
                onChange={(v) => handleKnobChange('eqHiA', v)}
              />
              <RotaryKnob
                value={knobValues.eqMidA}
                label="MID"
                labelHe="אמצע"
                onChange={(v) => handleKnobChange('eqMidA', v)}
              />
              <RotaryKnob
                value={knobValues.eqLoA}
                label="LO"
                labelHe="נמוך"
                onChange={(v) => handleKnobChange('eqLoA', v)}
              />
            </div>

            {/* Volume Fader A */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <input
                type="range"
                min="0"
                max="127"
                value={decksState.volume.A}
                className="w-10 h-32 vertical-slider accent-dj-cyan"
                style={{
                  writingMode: 'vertical-lr' as React.CSSProperties['writingMode'],
                  appearance: 'none' as React.CSSProperties['appearance'],
                  WebkitAppearance: 'slider-vertical' as React.CSSProperties['WebkitAppearance'],
                }}
              />
              <div className="text-xs text-gray-400 font-mono">
                {Math.round((decksState.volume.A / 127) * 100)}%
              </div>
            </div>
          </div>

          {/* Crossfader and Mixer Center */}
          <div className="flex flex-col justify-center items-center gap-6">
            {/* Crossfader */}
            <div className="space-y-2 w-full">
              <div className="text-center text-sm font-bold text-dj-pink">מעבר צולב</div>
              <div className="flex items-center gap-2 bg-dj-card p-3 rounded border border-dj-border">
                <span className="text-xs text-gray-400">A</span>
                <input
                  type="range"
                  min="0"
                  max="127"
                  value={localCrossfader}
                  onChange={(e) => setLocalCrossfader(parseFloat(e.target.value))}
                  className="flex-1 accent-dj-pink"
                />
                <span className="text-xs text-gray-400">B</span>
              </div>
            </div>

            {/* VU Meters placeholder */}
            <div className="space-y-2 w-full">
              <div className="text-center text-xs font-bold text-dj-orange">עוצמה</div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-center text-gray-400 font-mono">A</div>
                  <div className="h-6 bg-dj-dark rounded border border-dj-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-dj-green to-dj-orange transition-all"
                      style={{ width: `${(decksState.volume.A / 127) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-center text-gray-400 font-mono">B</div>
                  <div className="h-6 bg-dj-dark rounded border border-dj-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-dj-orange to-dj-green transition-all"
                      style={{ width: `${(decksState.volume.B / 127) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deck B */}
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="font-bold text-dj-cyan text-lg">甲板 B</h3>
            </div>

            {/* Jog Wheel B */}
            <div className="flex justify-center">
              <JogWheel deck="B" isPlaying={decksState.playing.B} />
            </div>

            {/* Transport buttons B */}
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`px-3 py-2 rounded text-xs font-bold transition-all ${
                  decksState.playing.B
                    ? 'bg-dj-green text-dj-dark shadow-lg shadow-dj-green/50'
                    : 'bg-dj-card border border-dj-border text-gray-400 hover:border-dj-green'
                }`}
              >
                ▶ הפעל
              </button>
              <button
                className={`px-3 py-2 rounded text-xs font-bold transition-all ${
                  decksState.cued.B
                    ? 'bg-dj-cyan text-dj-dark shadow-lg shadow-dj-cyan/50'
                    : 'bg-dj-card border border-dj-border text-gray-400 hover:border-dj-cyan'
                }`}
              >
                🎯 Cue
              </button>
              <button
                className={`px-3 py-2 rounded text-xs font-bold transition-all ${
                  decksState.synced.B
                    ? 'bg-dj-purple text-white shadow-lg shadow-dj-purple/50'
                    : 'bg-dj-card border border-dj-border text-gray-400 hover:border-dj-purple'
                }`}
              >
                🔗 Sync
              </button>
            </div>

            {/* EQ Knobs B */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <RotaryKnob
                value={knobValues.eqHiB}
                label="HI"
                labelHe="גבוה"
                onChange={(v) => handleKnobChange('eqHiB', v)}
              />
              <RotaryKnob
                value={knobValues.eqMidB}
                label="MID"
                labelHe="אמצע"
                onChange={(v) => handleKnobChange('eqMidB', v)}
              />
              <RotaryKnob
                value={knobValues.eqLoB}
                label="LO"
                labelHe="נמוך"
                onChange={(v) => handleKnobChange('eqLoB', v)}
              />
            </div>

            {/* Volume Fader B */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <input
                type="range"
                min="0"
                max="127"
                value={decksState.volume.B}
                className="w-10 h-32 vertical-slider accent-dj-cyan"
                style={{
                  writingMode: 'vertical-lr' as React.CSSProperties['writingMode'],
                  appearance: 'none' as React.CSSProperties['appearance'],
                  WebkitAppearance: 'slider-vertical' as React.CSSProperties['WebkitAppearance'],
                }}
              />
              <div className="text-xs text-gray-400 font-mono">
                {Math.round((decksState.volume.B / 127) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Performance Pads */}
        <div className="grid grid-cols-2 gap-8">
          {/* Pads A */}
          <div className="space-y-3">
            <h4 className="font-bold text-dj-cyan text-sm text-center">משטחי ביצוע A</h4>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Pad key={`pad-a-${i}`} index={i} isActive={activePads.A.includes(i)} />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[4, 5, 6, 7].map((i) => (
                <Pad key={`pad-a-${i}`} index={i} isActive={activePads.A.includes(i)} />
              ))}
            </div>
          </div>

          {/* Pads B */}
          <div className="space-y-3">
            <h4 className="font-bold text-dj-cyan text-sm text-center">משטחי ביצוע B</h4>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Pad key={`pad-b-${i}`} index={i} isActive={activePads.B.includes(i)} />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[4, 5, 6, 7].map((i) => (
                <Pad key={`pad-b-${i}`} index={i} isActive={activePads.B.includes(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-dj-border text-xs text-gray-500 text-center">
        {connectionState.error ? (
          <span className="text-dj-accent">{connectionState.error}</span>
        ) : connectionState.isConnected ? (
          <span className="text-dj-green">DDJ-FLX4 מחובר • כל הבקרים זמינים</span>
        ) : (
          <span>חבר את הבקר שלך כדי להתחיל</span>
        )}
      </div>
    </div>
  );
}
