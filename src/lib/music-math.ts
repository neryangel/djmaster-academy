export interface Track {
  id: string;
  name: string;
  bpm: number;
  key: string;
  genre: string;
  energy: number;
}

export interface TransitionAnalysis {
  bpmDiff: number;
  bpmSuggestion: string;
  keyCompatibility: 'perfect' | 'compatible' | 'energy_change' | 'clash';
  keyLabel: string;
  energyFlow: string;
  transitionType: string;
}

export const CAMELOT_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);
export const CAMELOT_TYPES = ['A', 'B'] as const;
export const GENRES = ['האוס', 'טקנו', 'טראנס', 'טק הוס', 'אלקטרו', 'פרוגרסיב', 'דראם וביס', 'אחר'];

export const getKeyCompatibility = (key1: string, key2: string): TransitionAnalysis['keyCompatibility'] => {
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

export const getCamelotColor = (key: string): string => {
  const num = parseInt(key.slice(0, -1));
  const colors: Record<number, string> = {
    1: '#00D6BA', // 1A/B - Turquoise
    2: '#80E53B', // 2A/B - Light Green
    3: '#ADF035', // 3A/B - Lime
    4: '#E6F333', // 4A/B - Yellow
    5: '#FFD32F', // 5A/B - Gold
    6: '#FF9732', // 6A/B - Orange
    7: '#FF593B', // 7A/B - Red
    8: '#FF4189', // 8A/B - Pink
    9: '#FF4DAF', // 9A/B - Magenta
    10: '#9B5BFF', // 10A/B - Purple
    11: '#4F70FF', // 11A/B - Blue
    12: '#1CA8FF', // 12A/B - Light Blue
  };
  return colors[num] || '#FFFFFF';
};

export const analyzeTransition = (track1: Track, track2: Track): TransitionAnalysis => {
  const bpmDiff = Math.abs(track2.bpm - track1.bpm);
  const bpmPercent = ((bpmDiff / track1.bpm) * 100).toFixed(1);

  let bpmSuggestion = '';
  if (bpmDiff === 0) {
    bpmSuggestion = 'מיקס מקורי (0%)';
  } else if (track2.bpm > track1.bpm) {
    bpmSuggestion = `האצה ${bpmPercent}%`;
  } else {
    bpmSuggestion = `האטה ${bpmPercent}%`;
  }

  const keyCompatibility = getKeyCompatibility(track1.key, track2.key);
  const keyLabels = {
    perfect: 'מיקס הרמוני מושלם',
    compatible: 'תואם (קרוב)',
    energy_change: 'החלפת אנרגיה (מינור/מז׳ור)',
    clash: 'התנגשות הרמונית',
  };

  const energyDiff = track2.energy - track1.energy;
  let energyFlow = '';
  if (energyDiff > 1) energyFlow = 'שבירת אנרגיה דרסטית';
  else if (energyDiff === 1) energyFlow = 'עלייה הדרגתית';
  else if (energyDiff === 0) energyFlow = 'שמירה על אנרגיה';
  else if (energyDiff === -1) energyFlow = 'ירידה מתונה';
  else energyFlow = 'צניחת אנרגיה דרסטית';

  const transitionType = keyCompatibility === 'perfect' || keyCompatibility === 'compatible' 
    ? 'מיקס לחן ארוך (Blend)' 
    : 'חיתוך תדרים (EQ Drop)';

  return {
    bpmDiff,
    bpmSuggestion,
    keyCompatibility,
    keyLabel: keyLabels[keyCompatibility],
    energyFlow,
    transitionType,
  };
};
