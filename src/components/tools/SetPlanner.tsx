'use client';

import React, { useState, useCallback } from 'react';

interface Track {
  id: string;
  name: string;
  bpm: number;
  key: string;
  genre: string;
  energy: number;
}

interface TransitionAnalysis {
  bpmDiff: number;
  bpmSuggestion: string;
  keyCompatibility: 'perfect' | 'compatible' | 'energy_change' | 'clash';
  keyLabel: string;
  energyFlow: string;
  transitionType: string;
}

const CAMELOT_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);
const CAMELOT_TYPES = ['A', 'B'] as const;
const GENRES = ['טראנס', 'טק הוס', 'אלקטרו הוס', 'פרוגרסיבי', 'דראם וביס', 'אחר'];

const TRANSITION_TYPES = ['מיקס', 'חיתוך', 'echo out', 'loop', 'filter', 'spinback'];

const generateId = () => Math.random().toString(36).substr(2, 9);

const getKeyCompatibility = (key1: string, key2: string) => {
  if (key1 === key2) return 'perfect';

  const num1 = parseInt(key1.slice(0, -1));
  const num2 = parseInt(key2.slice(0, -1));
  const type1 = key1.slice(-1);
  const type2 = key2.slice(-1);

  if (num1 === num2 && type1 !== type2) return 'energy_change';

  const diff = Math.abs(num1 - num2);
  if ((diff === 1 || diff === 11) && type1 === type2) return 'compatible';

  return 'clash';
};

const analyzeFransition = (track1: Track, track2: Track): TransitionAnalysis => {
  const bpmDiff = Math.abs(track2.bpm - track1.bpm);
  const bpmPercent = ((bpmDiff / track1.bpm) * 100).toFixed(1);

  let bpmSuggestion = '';
  if (bpmDiff === 0) {
    bpmSuggestion = 'לא צריך שינוי';
  } else if (track2.bpm > track1.bpm) {
    bpmSuggestion = `הוסף ${bpmPercent}%`;
  } else {
    bpmSuggestion = `הפחת ${bpmPercent}%`;
  }

  const keyCompatibility = getKeyCompatibility(track1.key, track2.key);
  const keyLabels = {
    perfect: 'תאימות מושלמת',
    compatible: 'תואם',
    energy_change: 'שינוי אנרגיה',
    clash: 'התנגשות',
  };

  const energyDiff = track2.energy - track1.energy;
  const energyFlow =
    energyDiff > 1 ? '↑' : energyDiff === 1 ? '↗' : energyDiff === 0 ? '→' : energyDiff === -1 ? '↘' : '↓';

  const transitionType = keyCompatibility === 'perfect' ? 'מיקס חלק' : 'חיתוך ישיר';

  return {
    bpmDiff,
    bpmSuggestion,
    keyCompatibility,
    keyLabel: keyLabels[keyCompatibility],
    energyFlow,
    transitionType,
  };
};

export default function SetPlanner() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    bpm: 120,
    key: '8A',
    genre: 'טראנס',
    energy: 3,
  });

  const addTrack = useCallback(() => {
    if (!formData.name.trim()) return;

    const newTrack: Track = {
      id: generateId(),
      ...formData,
    };

    setTracks([...tracks, newTrack]);
    setFormData({ name: '', bpm: 120, key: '8A', genre: 'טראנס', energy: 3 });
  }, [formData, tracks]);

  const removeTrack = useCallback((id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
  }, [tracks]);

  const moveTrack = useCallback((id: string, direction: 'up' | 'down') => {
    const index = tracks.findIndex(t => t.id === id);
    if (direction === 'up' && index > 0) {
      const newTracks = [...tracks];
      [newTracks[index], newTracks[index - 1]] = [newTracks[index - 1], newTracks[index]];
      setTracks(newTracks);
    } else if (direction === 'down' && index < tracks.length - 1) {
      const newTracks = [...tracks];
      [newTracks[index], newTracks[index + 1]] = [newTracks[index + 1], newTracks[index]];
      setTracks(newTracks);
    }
  }, [tracks]);

  const calculateSetStats = () => {
    if (tracks.length === 0) {
      return {
        avgBpm: 0,
        minBpm: 0,
        maxBpm: 0,
        compatibleTransitions: 0,
        totalTransitions: 0,
        quality: 0,
        duration: 0,
      };
    }

    const bpms = tracks.map(t => t.bpm);
    const avgBpm = Math.round(bpms.reduce((a, b) => a + b) / bpms.length);
    const minBpm = Math.min(...bpms);
    const maxBpm = Math.max(...bpms);

    let compatibleTransitions = 0;
    let totalTransitions = 0;

    for (let i = 0; i < tracks.length - 1; i++) {
      const compatibility = getKeyCompatibility(tracks[i].key, tracks[i + 1].key);
      if (compatibility !== 'clash') {
        compatibleTransitions++;
      }
      totalTransitions++;
    }

    const quality = totalTransitions > 0 ? Math.round((compatibleTransitions / totalTransitions) * 100) : 0;
    const duration = Math.round((tracks.length * 8) / avgBpm * 60); // Approximate

    return {
      avgBpm,
      minBpm,
      maxBpm,
      compatibleTransitions,
      totalTransitions,
      quality,
      duration,
    };
  };

  const exportSet = () => {
    const stats = calculateSetStats();
    let exportText = 'סט DJ\n';
    exportText += `${new Date().toLocaleDateString('he-IL')}\n`;
    exportText += '─'.repeat(50) + '\n\n';

    tracks.forEach((track, i) => {
      exportText += `${i + 1}. ${track.name}\n`;
      exportText += `   BPM: ${track.bpm} | מפתח: ${track.key} | ז׳אנר: ${track.genre} | אנרגיה: ${track.energy}/5\n`;

      if (i < tracks.length - 1) {
        const transition = analyzeFransition(tracks[i], tracks[i + 1]);
        exportText += `   ↓ ${transition.transitionType} (${transition.keyLabel})\n`;
      }
      exportText += '\n';
    });

    exportText += '─'.repeat(50) + '\n';
    exportText += `סה״כ שירים: ${tracks.length}\n`;
    exportText += `ממוצע BPM: ${stats.avgBpm}\n`;
    exportText += `טווח BPM: ${stats.minBpm} - ${stats.maxBpm}\n`;
    exportText += `איכות זרימה: ${stats.quality}%\n`;
    exportText += `משך משוער: ${stats.duration} דקות\n`;

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `set-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = calculateSetStats();

  return (
    <div className="w-full min-h-screen p-6 bg-[#0A0A0F] text-white" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-[#00d4ff]">מתכננת סט DJ</h1>
        <p className="text-gray-400 mb-8">בנה סט מושלם עם ניתוח מעברים בזמן אמת</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Add Track Form */}
          <div className="lg:col-span-1 bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30 space-y-4">
            <h2 className="text-lg font-bold text-[#00d4ff]">הוסף שיר</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">שם השיר</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="שם השיר"
                className="w-full px-3 py-2 bg-[#0A0A0F] border border-[#7b2fff]/50 rounded text-white placeholder-gray-600 focus:outline-none focus:border-[#00d4ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">BPM</label>
              <input
                type="number"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: parseInt(e.target.value) || 120 })}
                min="80"
                max="180"
                className="w-full px-3 py-2 bg-[#0A0A0F] border border-[#7b2fff]/50 rounded text-white focus:outline-none focus:border-[#00d4ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">מפתח קמלוט</label>
              <select
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A0A0F] border border-[#7b2fff]/50 rounded text-white focus:outline-none focus:border-[#00d4ff]"
              >
                {CAMELOT_NUMBERS.map((num) =>
                  CAMELOT_TYPES.map((type) => (
                    <option key={`${num}${type}`} value={`${num}${type}`}>
                      {num}{type}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">ז׳אנר</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3 py-2 bg-[#0A0A0F] border border-[#7b2fff]/50 rounded text-white focus:outline-none focus:border-[#00d4ff]"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                אנרגיה: {formData.energy}/5
              </label>
              <input
                type="range"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                min="1"
                max="5"
                className="w-full"
              />
            </div>

            <button
              onClick={addTrack}
              className="w-full py-2 bg-[#7b2fff] hover:bg-[#7b2fff]/80 text-white font-semibold rounded transition"
            >
              הוסף שיר
            </button>
          </div>

          {/* Set Stats */}
          <div className="lg:col-span-3 bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30">
            <h2 className="text-lg font-bold text-[#00d4ff] mb-4">ניתוח הסט</h2>

            {tracks.length === 0 ? (
              <p className="text-gray-400">הוסף שירים כדי לראות ניתוח</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-[#0A0A0F] rounded p-3">
                  <p className="text-gray-400 text-sm">מספר שירים</p>
                  <p className="text-2xl font-bold text-[#00d4ff]">{tracks.length}</p>
                </div>

                <div className="bg-[#0A0A0F] rounded p-3">
                  <p className="text-gray-400 text-sm">ממוצע BPM</p>
                  <p className="text-2xl font-bold text-[#00d4ff]">{stats.avgBpm}</p>
                </div>

                <div className="bg-[#0A0A0F] rounded p-3">
                  <p className="text-gray-400 text-sm">טווח BPM</p>
                  <p className="text-xl font-bold text-[#00d4ff]">
                    {stats.minBpm}-{stats.maxBpm}
                  </p>
                </div>

                <div className="bg-[#0A0A0F] rounded p-3">
                  <p className="text-gray-400 text-sm">איכות זרימה</p>
                  <p className="text-2xl font-bold text-[#00d4ff]">{stats.quality}%</p>
                </div>

                <div className="bg-[#0A0A0F] rounded p-3">
                  <p className="text-gray-400 text-sm">משך משוער</p>
                  <p className="text-2xl font-bold text-[#00d4ff]">{stats.duration} דק׳</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Energy Curve */}
        {tracks.length > 0 && (
          <div className="mb-8 bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30">
            <h2 className="text-lg font-bold text-[#00d4ff] mb-4">עקומת האנרגיה</h2>
            <div className="flex items-end justify-start gap-2 h-32">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex-1 bg-[#7b2fff]/30 hover:bg-[#00d4ff]/40 rounded-t transition"
                  style={{ height: `${(track.energy / 5) * 100}%` }}
                  title={`${track.name}: ${track.energy}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Track List */}
        <div className="bg-[#1a1a1f] rounded-lg p-6 border border-[#7b2fff]/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#00d4ff]">רשימת השירים</h2>
            {tracks.length > 0 && (
              <button
                onClick={exportSet}
                className="px-4 py-2 bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30 border border-[#00d4ff] text-[#00d4ff] rounded transition text-sm font-semibold"
              >
                ייצוא סט
              </button>
            )}
          </div>

          {tracks.length === 0 ? (
            <p className="text-gray-400">אין עדיין שירים בסט</p>
          ) : (
            <div className="space-y-3">
              {tracks.map((track, index) => {
                const transition = index < tracks.length - 1 ? analyzeFransition(track, tracks[index + 1]) : null;

                return (
                  <div key={track.id}>
                    <div className="bg-[#0A0A0F] rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[#00d4ff] font-bold text-lg">{index + 1}.</span>
                          <div>
                            <p className="font-semibold">{track.name}</p>
                            <p className="text-sm text-gray-400">
                              {track.bpm} BPM • {track.key} • {track.genre} • אנרגיה: {track.energy}/5
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => moveTrack(track.id, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1 bg-[#7b2fff]/30 hover:bg-[#7b2fff]/50 disabled:opacity-30 text-white rounded text-sm transition"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveTrack(track.id, 'down')}
                          disabled={index === tracks.length - 1}
                          className="px-2 py-1 bg-[#7b2fff]/30 hover:bg-[#7b2fff]/50 disabled:opacity-30 text-white rounded text-sm transition"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeTrack(track.id)}
                          className="px-2 py-1 bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded text-sm transition"
                        >
                          הסר
                        </button>
                      </div>
                    </div>

                    {transition && index < tracks.length - 1 && (
                      <div
                        className={`mx-4 px-3 py-2 text-sm rounded-b-lg border-l-4 ${
                          transition.keyCompatibility === 'perfect'
                            ? 'bg-[#00d4ff]/10 border-[#00d4ff] text-[#00d4ff]'
                            : transition.keyCompatibility === 'compatible'
                              ? 'bg-yellow-500/10 border-yellow-500 text-yellow-300'
                              : transition.keyCompatibility === 'energy_change'
                                ? 'bg-blue-500/10 border-blue-500 text-blue-300'
                                : 'bg-red-500/10 border-red-500 text-red-300'
                        }`}
                      >
                        <p className="font-semibold mb-1">
                          {transition.energyFlow} {transition.transitionType}
                        </p>
                        <p className="text-xs">
                          BPM: {transition.bpmSuggestion} | מפתח: {transition.keyLabel}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
