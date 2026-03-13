/**
 * MIDI Controller — DDJ-FLX4 Integration
 * Uses Web MIDI API for direct hardware connection
 */

export interface MidiControllerOptions {
  onConnect?: (deviceName: string) => void;
  onDisconnect?: () => void;
  onNoteOn?: (channel: number, note: number, velocity: number) => void;
  onNoteOff?: (channel: number, note: number) => void;
  onCC?: (channel: number, cc: number, value: number) => void;
  onError?: (error: string) => void;
}

export interface MidiControllerState {
  isSupported: boolean;
  isConnected: boolean;
  deviceName: string | null;
  lastEvent: string | null;
}

export class MidiController {
  private midiAccess: MIDIAccess | null = null;
  private activeInput: MIDIInput | null = null;
  private activeOutput: MIDIOutput | null = null;
  private options: MidiControllerOptions;
  private _state: MidiControllerState;
  private listeners: Map<string, Set<Function>> = new Map();

  constructor(options: MidiControllerOptions = {}) {
    this.options = options;
    this._state = {
      isSupported: typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator,
      isConnected: false,
      deviceName: null,
      lastEvent: null,
    };
  }

  get state(): MidiControllerState {
    return { ...this._state };
  }

  async connect(): Promise<boolean> {
    if (!this._state.isSupported) {
      this.options.onError?.('Web MIDI API is not supported in this browser');
      return false;
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });

      // Find DDJ-FLX4 or any DJ controller
      for (const [, input] of this.midiAccess.inputs) {
        if (this.isDJController(input.name ?? '')) {
          this.activeInput = input;
          break;
        }
      }

      for (const [, output] of this.midiAccess.outputs) {
        if (this.isDJController(output.name ?? '')) {
          this.activeOutput = output;
          break;
        }
      }

      // Fallback: use first available input/output
      if (!this.activeInput && this.midiAccess.inputs.size > 0) {
        this.activeInput = this.midiAccess.inputs.values().next().value ?? null;
      }
      if (!this.activeOutput && this.midiAccess.outputs.size > 0) {
        this.activeOutput = this.midiAccess.outputs.values().next().value ?? null;
      }

      if (this.activeInput) {
        this.activeInput.onmidimessage = this.handleMidiMessage.bind(this);
        this._state.isConnected = true;
        this._state.deviceName = this.activeInput.name ?? 'Unknown MIDI Device';
        this.options.onConnect?.(this._state.deviceName);
      }

      // Listen for connection changes
      this.midiAccess.onstatechange = this.handleStateChange.bind(this);

      return this._state.isConnected;
    } catch (err) {
      this.options.onError?.(`MIDI access denied: ${err}`);
      return false;
    }
  }

  private isDJController(name: string): boolean {
    const djKeywords = ['DDJ', 'FLX4', 'Pioneer', 'Traktor', 'DJ', 'Numark', 'Denon'];
    return djKeywords.some(kw => name.toLowerCase().includes(kw.toLowerCase()));
  }

  private handleMidiMessage(event: MIDIMessageEvent): void {
    const data = event.data;
    if (!data || data.length < 2) return;

    const status = data[0]!;
    const channel = status & 0x0F;
    const messageType = status & 0xF0;
    const byte1 = data[1]!;
    const byte2 = data.length > 2 ? data[2]! : 0;

    switch (messageType) {
      case 0x90: // Note On
        if (byte2 > 0) {
          this._state.lastEvent = `NoteOn ch${channel} note${byte1} vel${byte2}`;
          this.options.onNoteOn?.(channel, byte1, byte2);
          this.emit('noteon', { channel, note: byte1, velocity: byte2 });
        } else {
          // Note On with velocity 0 = Note Off
          this._state.lastEvent = `NoteOff ch${channel} note${byte1}`;
          this.options.onNoteOff?.(channel, byte1);
          this.emit('noteoff', { channel, note: byte1 });
        }
        break;

      case 0x80: // Note Off
        this._state.lastEvent = `NoteOff ch${channel} note${byte1}`;
        this.options.onNoteOff?.(channel, byte1);
        this.emit('noteoff', { channel, note: byte1 });
        break;

      case 0xB0: // Control Change
        this._state.lastEvent = `CC ch${channel} cc${byte1} val${byte2}`;
        this.options.onCC?.(channel, byte1, byte2);
        this.emit('cc', { channel, cc: byte1, value: byte2 });
        break;
    }
  }

  private handleStateChange(event: MIDIConnectionEvent): void {
    const port = event.port;
    if (port?.type === 'input') {
      if (port.state === 'disconnected') {
        this._state.isConnected = false;
        this._state.deviceName = null;
        this.options.onDisconnect?.();
      }
    }
  }

  /**
   * Send MIDI message to the controller (e.g., for LED feedback)
   */
  sendNoteOn(channel: number, note: number, velocity: number): void {
    if (this.activeOutput) {
      this.activeOutput.send([0x90 | channel, note, velocity]);
    }
  }

  sendNoteOff(channel: number, note: number): void {
    if (this.activeOutput) {
      this.activeOutput.send([0x80 | channel, note, 0]);
    }
  }

  sendCC(channel: number, cc: number, value: number): void {
    if (this.activeOutput) {
      this.activeOutput.send([0xB0 | channel, cc, value]);
    }
  }

  /**
   * Set pad LED color (DDJ-FLX4 specific)
   */
  setPadColor(deck: 'A' | 'B', pad: number, r: number, g: number, b: number): void {
    // DDJ-FLX4 uses SysEx for RGB pad colors
    // Simplified: use note velocity for brightness
    const channel = deck === 'A' ? 0 : 1;
    const note = pad - 1; // pads are 0-indexed in MIDI
    const brightness = Math.round((r + g + b) / 3 / 255 * 127);
    this.sendNoteOn(channel, note, brightness);
  }

  // Simple event emitter
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }

  disconnect(): void {
    if (this.activeInput) {
      this.activeInput.onmidimessage = null;
    }
    this.activeInput = null;
    this.activeOutput = null;
    this._state.isConnected = false;
    this._state.deviceName = null;
  }

  /**
   * List all available MIDI devices
   */
  async listDevices(): Promise<{ inputs: string[]; outputs: string[] }> {
    if (!this.midiAccess) {
      try {
        this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      } catch {
        return { inputs: [], outputs: [] };
      }
    }

    const inputs: string[] = [];
    const outputs: string[] = [];

    for (const [, input] of this.midiAccess.inputs) {
      inputs.push(input.name ?? 'Unknown');
    }
    for (const [, output] of this.midiAccess.outputs) {
      outputs.push(output.name ?? 'Unknown');
    }

    return { inputs, outputs };
  }
}

export function createMidiController(options?: MidiControllerOptions): MidiController {
  return new MidiController(options);
}
