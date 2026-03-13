// === MIDI Note/CC Mappings for DDJ-FLX4 ===

export interface MidiMapping {
  channel: number;
  note?: number;
  cc?: number;
  name: string;
  type: 'button' | 'fader' | 'knob' | 'jog' | 'pad';
  deck?: 'A' | 'B';
}

// DDJ-FLX4 specific control mappings
export const DDJ_FLX4_MAPPING = {
  // Transport Controls - Deck A
  PLAY_A: {
    channel: 0,
    note: 0x0b,
    name: 'Play/Pause A',
    type: 'button',
    deck: 'A',
  },
  CUE_A: {
    channel: 0,
    note: 0x0c,
    name: 'Cue A',
    type: 'button',
    deck: 'A',
  },
  SYNC_A: {
    channel: 0,
    note: 0x58,
    name: 'Sync A',
    type: 'button',
    deck: 'A',
  },

  // Transport Controls - Deck B
  PLAY_B: {
    channel: 1,
    note: 0x0b,
    name: 'Play/Pause B',
    type: 'button',
    deck: 'B',
  },
  CUE_B: {
    channel: 1,
    note: 0x0c,
    name: 'Cue B',
    type: 'button',
    deck: 'B',
  },
  SYNC_B: {
    channel: 1,
    note: 0x58,
    name: 'Sync B',
    type: 'button',
    deck: 'B',
  },

  // Mixer
  CROSSFADER: {
    channel: 0,
    cc: 0x1f,
    name: 'Crossfader',
    type: 'fader',
  },
  VOLUME_A: {
    channel: 0,
    cc: 0x13,
    name: 'Volume A',
    type: 'fader',
    deck: 'A',
  },
  VOLUME_B: {
    channel: 1,
    cc: 0x13,
    name: 'Volume B',
    type: 'fader',
    deck: 'B',
  },

  // EQ - Deck A
  EQ_HI_A: {
    channel: 0,
    cc: 0x07,
    name: 'EQ Hi A',
    type: 'knob',
    deck: 'A',
  },
  EQ_MID_A: {
    channel: 0,
    cc: 0x0b,
    name: 'EQ Mid A',
    type: 'knob',
    deck: 'A',
  },
  EQ_LO_A: {
    channel: 0,
    cc: 0x0f,
    name: 'EQ Lo A',
    type: 'knob',
    deck: 'A',
  },

  // EQ - Deck B
  EQ_HI_B: {
    channel: 1,
    cc: 0x07,
    name: 'EQ Hi B',
    type: 'knob',
    deck: 'B',
  },
  EQ_MID_B: {
    channel: 1,
    cc: 0x0b,
    name: 'EQ Mid B',
    type: 'knob',
    deck: 'B',
  },
  EQ_LO_B: {
    channel: 1,
    cc: 0x0f,
    name: 'EQ Lo B',
    type: 'knob',
    deck: 'B',
  },

  // Tempo
  TEMPO_A: {
    channel: 0,
    cc: 0x00,
    name: 'Tempo A',
    type: 'fader',
    deck: 'A',
  },
  TEMPO_B: {
    channel: 1,
    cc: 0x00,
    name: 'Tempo B',
    type: 'fader',
    deck: 'B',
  },

  // Jog Wheels
  JOG_A: {
    channel: 0,
    cc: 0x21,
    name: 'Jog Wheel A',
    type: 'jog',
    deck: 'A',
  },
  JOG_B: {
    channel: 1,
    cc: 0x21,
    name: 'Jog Wheel B',
    type: 'jog',
    deck: 'B',
  },

  // Performance Pads (Hot Cues) - Deck A
  PAD_1_A: {
    channel: 0,
    note: 0x00,
    name: 'Pad 1 A',
    type: 'pad',
    deck: 'A',
  },
  PAD_2_A: {
    channel: 0,
    note: 0x01,
    name: 'Pad 2 A',
    type: 'pad',
    deck: 'A',
  },
  PAD_3_A: {
    channel: 0,
    note: 0x02,
    name: 'Pad 3 A',
    type: 'pad',
    deck: 'A',
  },
  PAD_4_A: {
    channel: 0,
    note: 0x03,
    name: 'Pad 4 A',
    type: 'pad',
    deck: 'A',
  },

  // Performance Pads (Hot Cues) - Deck B
  PAD_1_B: {
    channel: 1,
    note: 0x00,
    name: 'Pad 1 B',
    type: 'pad',
    deck: 'B',
  },
  PAD_2_B: {
    channel: 1,
    note: 0x01,
    name: 'Pad 2 B',
    type: 'pad',
    deck: 'B',
  },
  PAD_3_B: {
    channel: 1,
    note: 0x02,
    name: 'Pad 3 B',
    type: 'pad',
    deck: 'B',
  },
  PAD_4_B: {
    channel: 1,
    note: 0x03,
    name: 'Pad 4 B',
    type: 'pad',
    deck: 'B',
  },

  // FX
  FILTER_A: {
    channel: 0,
    cc: 0x17,
    name: 'Filter A',
    type: 'knob',
    deck: 'A',
  },
  FILTER_B: {
    channel: 1,
    cc: 0x17,
    name: 'Filter B',
    type: 'knob',
    deck: 'B',
  },
  BEAT_FX: {
    channel: 0,
    note: 0x47,
    name: 'Beat FX',
    type: 'button',
  },
} as const satisfies Record<string, MidiMapping>;

export type DDJ_FLX4_Control = keyof typeof DDJ_FLX4_MAPPING;

// === MIDI Events ===
export interface MidiEvent {
  type: 'noteon' | 'noteoff' | 'cc';
  channel: number;
  note?: number;
  cc?: number;
  value: number;
  timestamp: number;
}

// === MIDI Connection State ===
export interface MidiConnectionState {
  isSupported: boolean;
  isConnected: boolean;
  deviceName: string | null;
  deviceId: string | null;
  error: string | null;
}
