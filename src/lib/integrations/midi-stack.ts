/**
 * ממשק MidiStack לשליטה ב-DDJ-FLX4 וקונטרולרים MIDI אחרים
 * MIDI integration using WebMIDI API for DDJ-FLX4 and other controllers
 */

export interface MidiControlHandler {
  (value: number): void;
}

export interface MidiNoteHandler {
  (velocity: number): void;
}

export interface DDJFLXMapping {
  play: number;
  cue: number;
  sync: number;
  crossfader: number;
  volume: { left: number; right: number };
  eq: { low: number; mid: number; high: number };
  tempo: number;
  jog: number;
  pads: number[];
  filter: number;
  beat_fx: number;
}

/**
 * MidiStack class - ניהול ובקרה של התקני MIDI
 * MIDI stack for device connectivity and control
 */
export class MidiStack {
  private midiAccess: WebMidi.MIDIAccess | null = null;
  private controller: WebMidi.MIDIInput | null = null;
  private output: WebMidi.MIDIOutput | null = null;
  private controlHandlers = new Map<string, MidiControlHandler[]>();
  private noteHandlers = new Map<string, MidiNoteHandler[]>();
  private ddjFlx4Mapping: DDJFLXMapping | null = null;
  private isConnected = false;

  /**
   * אתחול WebMIDI והתחברות להתקן
   * Initialize WebMIDI and connect to device
   */
  async initialize(): Promise<boolean> {
    try {
      // בקשת גישה ל-MIDI
      const midi = await (navigator as any).requestMIDIAccess({
        sysex: false,
      });

      this.midiAccess = midi;

      // ההאזנה לשינויים בהתקנים
      midi.addEventListener('statechange', this.handleStateChange.bind(this));

      return true;
    } catch (error) {
      console.error('MIDI access denied:', error);
      return false;
    }
  }

  /**
   * חיבור ל-DDJ-FLX4 או התקן MIDI אחר
   * Connect to DDJ-FLX4 or specified MIDI device
   */
  async connect(deviceName: string = 'DDJ-FLX4'): Promise<boolean> {
    if (!this.midiAccess) {
      await this.initialize();
    }

    if (!this.midiAccess) {
      return false;
    }

    // חיפוש התקן ב-inputs
    for (const input of this.midiAccess.inputs.values()) {
      if (input.name && input.name.includes(deviceName)) {
        this.controller = input;
        this.setupMidiListeners();
        this.isConnected = true;
        console.log(`Connected to ${input.name}`);
        break;
      }
    }

    // חיפוש התקן ב-outputs
    for (const output of this.midiAccess.outputs.values()) {
      if (output.name && output.name.includes(deviceName)) {
        this.output = output;
        console.log(`MIDI output connected: ${output.name}`);
        break;
      }
    }

    if (!this.controller) {
      console.warn(`${deviceName} not found. Available devices:`,
        Array.from(this.midiAccess.inputs.values()).map(d => d.name));
      return false;
    }

    return this.isConnected;
  }

  /**
   * הגדרת listeners עבור הודעות MIDI
   * Setup MIDI event listeners
   */
  private setupMidiListeners(): void {
    if (!this.controller) return;

    this.controller.addEventListener('midimessage', (event: WebMidi.MIDIMessageEvent) => {
      const { data } = event;
      const status = data[0] & 0xf0;
      const channel = data[0] & 0x0f;
      const cc = data[1];
      const value = data[2];

      // Control Change (CC) - 0xB0
      if (status === 0xb0) {
        this.handleControlChange(channel, cc, value);
      }

      // Note On - 0x90
      if (status === 0x90) {
        this.handleNoteOn(channel, cc, value);
      }

      // Note Off - 0x80
      if (status === 0x80) {
        this.handleNoteOff(channel, cc, value);
      }
    });
  }

  /**
   * טיפול ב-Control Change events
   */
  private handleControlChange(channel: number, cc: number, value: number): void {
    const key = `cc_${channel}_${cc}`;
    const handlers = this.controlHandlers.get(key) || [];

    handlers.forEach(handler => {
      handler(value);
    });
  }

  /**
   * טיפול ב-Note On events
   */
  private handleNoteOn(channel: number, note: number, velocity: number): void {
    const key = `note_${channel}_${note}`;
    const handlers = this.noteHandlers.get(key) || [];

    handlers.forEach(handler => {
      handler(velocity);
    });
  }

  /**
   * טיפול ב-Note Off events
   */
  private handleNoteOff(channel: number, note: number, velocity: number): void {
    const key = `note_off_${channel}_${note}`;
    const handlers = this.noteHandlers.get(key) || [];

    handlers.forEach(handler => {
      handler(velocity);
    });
  }

  /**
   * רישום handler ל-Control Change events
   * Register a handler for control change events
   */
  onControl(
    channel: number,
    cc: number,
    callback: MidiControlHandler
  ): () => void {
    const key = `cc_${channel}_${cc}`;
    const handlers = this.controlHandlers.get(key) || [];
    handlers.push(callback);
    this.controlHandlers.set(key, handlers);

    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * רישום handler ל-Note events
   * Register a handler for note events
   */
  onNote(
    channel: number,
    note: number,
    callback: MidiNoteHandler
  ): () => void {
    const key = `note_${channel}_${note}`;
    const handlers = this.noteHandlers.get(key) || [];
    handlers.push(callback);
    this.noteHandlers.set(key, handlers);

    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * מיפוי חודשי של DDJ-FLX4 עם CC numbers
   * Setup DDJ-FLX4 control mappings
   */
  mapDDJFLX4(): DDJFLXMapping {
    // DDJ-FLX4 default CC mappings
    this.ddjFlx4Mapping = {
      play: 0x00,
      cue: 0x01,
      sync: 0x02,
      crossfader: 0x0a,
      volume: {
        left: 0x14,
        right: 0x15,
      },
      eq: {
        low: 0x1a,
        mid: 0x1b,
        high: 0x1c,
      },
      tempo: 0x10,
      jog: 0x09,
      pads: [0x20, 0x21, 0x22, 0x23],
      filter: 0x1d,
      beat_fx: 0x1e,
    };

    // Auto-setup listeners for all controls
    if (this.ddjFlx4Mapping) {
      // Play buttons
      [0, 1].forEach(deck => {
        const playCC = this.ddjFlx4Mapping!.play + (deck * 0x30);
        this.onControl(0, playCC, (value) => {
          console.log(`Deck ${deck} play: ${value}`);
        });
      });
    }

    return this.ddjFlx4Mapping;
  }

  /**
   * שליחת MIDI message ל-LED pad
   * Send MIDI message to control pad LED colors
   */
  sendLED(note: number, color: number, channel: number = 0): void {
    if (!this.output) {
      console.warn('MIDI output not available');
      return;
    }

    // Send Note On with velocity as color value
    const noteOnStatus = 0x90 | channel;
    this.output.send([noteOnStatus, note, color]);
  }

  /**
   * בדיקת מצב החיבור
   * Check if currently connected
   */
  getConnectionStatus(): boolean {
    return this.isConnected && this.controller !== null;
  }

  /**
   * קבלת שם התקן המחובר
   * Get connected device name
   */
  getConnectedDevice(): string | null {
    return this.controller?.name || null;
  }

  /**
   * קבלת רשימת התקנים זמינים
   * Get list of available MIDI devices
   */
  getAvailableDevices(): string[] {
    if (!this.midiAccess) {
      return [];
    }

    const devices: string[] = [];
    this.midiAccess.inputs.forEach(input => {
      if (input.name) {
        devices.push(input.name);
      }
    });

    return devices;
  }

  /**
   * ניתוק מהתקן
   * Disconnect from MIDI device
   */
  disconnect(): void {
    if (this.controller) {
      // מחיקת כל ה-listeners
      this.controlHandlers.clear();
      this.noteHandlers.clear();

      this.controller = null;
      this.output = null;
      this.isConnected = false;

      console.log('MIDI device disconnected');
    }
  }

  /**
   * טיפול בשינויים במצב התקנים
   */
  private handleStateChange(event: WebMidi.MIDIConnectionEvent): void {
    console.log(`MIDI device ${event.port.name} is now ${event.port.state}`);

    if (event.port.state === 'disconnected' &&
        event.port === this.controller) {
      this.disconnect();
    }
  }
}

/**
 * סינגלטון MidiStack לשימוש בכל האפליקציה
 * Singleton instance for use throughout the application
 */
let midiStackInstance: MidiStack | null = null;

/**
 * קבלת instance של MidiStack או יצירת חדש
 * Get or create MidiStack singleton instance
 */
export function getMidiStack(): MidiStack {
  if (!midiStackInstance) {
    midiStackInstance = new MidiStack();
  }
  return midiStackInstance;
}

export default MidiStack;
