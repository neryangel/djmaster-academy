import '@testing-library/jest-dom';

// Mock Web Audio API
class MockAudioContext {
  state = 'running';
  sampleRate = 44100;
  currentTime = 0;

  createGain() {
    return {
      gain: { value: 1, setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {},
      disconnect: () => {},
    };
  }

  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteFrequencyData: (arr: Uint8Array) => arr.fill(128),
      getByteTimeDomainData: (arr: Uint8Array) => arr.fill(128),
      getFloatTimeDomainData: (arr: Float32Array) => arr.fill(0),
      connect: () => {},
      disconnect: () => {},
    };
  }

  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440, setValueAtTime: () => {} },
      connect: () => {},
      disconnect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 1000, setValueAtTime: () => {} },
      Q: { value: 1 },
      gain: { value: 0 },
      connect: () => {},
      disconnect: () => {},
    };
  }

  createMediaElementSource() {
    return { connect: () => {}, disconnect: () => {} };
  }

  createBuffer(channels: number, length: number, sampleRate: number) {
    return {
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length),
      duration: length / sampleRate,
    };
  }

  decodeAudioData() {
    return Promise.resolve(this.createBuffer(2, 44100, 44100));
  }

  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
}

// @ts-expect-error - mock
globalThis.AudioContext = MockAudioContext;
// @ts-expect-error - mock
globalThis.webkitAudioContext = MockAudioContext;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;
