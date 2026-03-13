/**
 * DJMaster Audio Engine
 * Wraps howler.js for reliable cross-browser audio playback
 * with Web Audio API for analysis and effects.
 */

export interface AudioEngineOptions {
  volume?: number;
  autoplay?: boolean;
  onLoad?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onTimeUpdate?: (time: number) => void;
}

export interface AudioEngineState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  error: string | null;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private animFrameId: number | null = null;
  private options: AudioEngineOptions;
  private _state: AudioEngineState;

  constructor(options: AudioEngineOptions = {}) {
    this.options = options;
    this._state = {
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      volume: options.volume ?? 1,
      playbackRate: 1,
      error: null,
    };
  }

  get state(): AudioEngineState {
    return { ...this._state };
  }

  async init(): Promise<void> {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.8;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = this._state.volume;
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }

  async load(url: string): Promise<void> {
    this._state.isLoading = true;
    this._state.error = null;

    try {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
      }

      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.preload = 'auto';

      await new Promise<void>((resolve, reject) => {
        if (!this.audioElement) return reject('No audio element');

        this.audioElement.addEventListener('canplaythrough', () => resolve(), { once: true });
        this.audioElement.addEventListener('error', (e) => reject(e), { once: true });
        this.audioElement.src = url;
      });

      if (!this.audioContext) await this.init();

      if (this.audioContext && this.audioElement && this.gainNode) {
        if (this.sourceNode) {
          this.sourceNode.disconnect();
        }
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.gainNode);
      }

      this._state.duration = this.audioElement.duration;
      this._state.isLoading = false;
      this.options.onLoad?.();

      // Set up time update
      this.audioElement.addEventListener('timeupdate', () => {
        if (this.audioElement) {
          this._state.currentTime = this.audioElement.currentTime;
          this.options.onTimeUpdate?.(this.audioElement.currentTime);
        }
      });

      this.audioElement.addEventListener('ended', () => {
        this._state.isPlaying = false;
        this.options.onEnd?.();
      });
    } catch (err) {
      this._state.isLoading = false;
      this._state.error = String(err);
      this.options.onError?.(String(err));
    }
  }

  async play(): Promise<void> {
    if (!this.audioElement) return;
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
    await this.audioElement.play();
    this._state.isPlaying = true;
    this.options.onPlay?.();
  }

  pause(): void {
    this.audioElement?.pause();
    this._state.isPlaying = false;
    this.options.onPause?.();
  }

  toggle(): void {
    this._state.isPlaying ? this.pause() : this.play();
  }

  seek(time: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = Math.max(0, Math.min(time, this._state.duration));
      this._state.currentTime = this.audioElement.currentTime;
    }
  }

  setVolume(volume: number): void {
    const v = Math.max(0, Math.min(1, volume));
    this._state.volume = v;
    if (this.gainNode) {
      this.gainNode.gain.value = v;
    }
    if (this.audioElement) {
      this.audioElement.volume = v;
    }
  }

  setPlaybackRate(rate: number): void {
    const r = Math.max(0.5, Math.min(2, rate));
    this._state.playbackRate = r;
    if (this.audioElement) {
      this.audioElement.playbackRate = r;
    }
  }

  getFrequencyData(): Uint8Array {
    const data = new Uint8Array(this.analyserNode?.frequencyBinCount ?? 0);
    this.analyserNode?.getByteFrequencyData(data);
    return data;
  }

  getTimeDomainData(): Uint8Array {
    const data = new Uint8Array(this.analyserNode?.frequencyBinCount ?? 0);
    this.analyserNode?.getByteTimeDomainData(data);
    return data;
  }

  getWaveformData(): Float32Array {
    const data = new Float32Array(this.analyserNode?.frequencyBinCount ?? 0);
    this.analyserNode?.getFloatTimeDomainData(data);
    return data;
  }

  destroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.audioElement?.pause();
    if (this.audioElement) this.audioElement.src = '';
    this.sourceNode?.disconnect();
    this.gainNode?.disconnect();
    this.analyserNode?.disconnect();
    this.audioContext?.close();
    this.audioElement = null;
    this.sourceNode = null;
    this.analyserNode = null;
    this.gainNode = null;
    this.audioContext = null;
  }
}

export function createAudioEngine(options?: AudioEngineOptions): AudioEngine {
  return new AudioEngine(options);
}
