import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AudioPlayerState } from '../../types/audio';

interface WaveformVisualizerProps {
  audioUrl: string;
  playerState: AudioPlayerState;
  onSeek?: (time: number) => void;
  height?: number;
  showSpectrogram?: boolean;
  showTimeMarkers?: boolean;
}

interface Point {
  x: number;
  y: number;
}

export default function WaveformVisualizer({
  audioUrl,
  playerState,
  onSeek,
  height = 200,
  showSpectrogram = true,
  showTimeMarkers = true,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spectrogramCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const [waveformData, setWaveformData] = useState<Float32Array[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const animationFrameRef = useRef<number>();

  // Load and decode audio
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBufferRef.current = audioBuffer;

        // Extract waveform data
        const rawData = [];
        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
          rawData.push(audioBuffer.getChannelData(i));
        }
        setWaveformData(rawData);
      } catch (error) {
        console.error('Failed to load audio:', error);
      }
    };

    if (audioUrl) {
      loadAudio();
    }
  }, [audioUrl]);

  // Draw waveform
  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || waveformData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;
    const duration = playerState.duration || 1;
    const currentTime = playerState.currentTime || 0;

    // Clear canvas
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, width, canvasHeight);

    // Draw grid
    ctx.strokeStyle = '#2A2A3E';
    ctx.lineWidth = 1;
    const gridSpacing = width / 4;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSpacing, 0);
      ctx.lineTo(i * gridSpacing, canvasHeight);
      ctx.stroke();
    }

    // Draw center line
    ctx.strokeStyle = '#1A3A3A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(width, canvasHeight / 2);
    ctx.stroke();

    // Draw waveform
    const data = waveformData[0];
    const centerY = canvasHeight / 2;
    const scale = (canvasHeight / 4) * 0.8;

    // Draw top channel
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      const sampleIndex = Math.floor((i / width) * data.length);
      const sample = Math.abs(data[sampleIndex] || 0);
      const y = centerY - sample * scale;
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();

    // Draw bottom channel (mirror)
    ctx.beginPath();
    for (let i = 0; i < width; i++) {
      const sampleIndex = Math.floor((i / width) * data.length);
      const sample = Math.abs(data[sampleIndex] || 0);
      const y = centerY + sample * scale;
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();

    // Draw playhead
    const playheadX = (currentTime / duration) * width;
    ctx.strokeStyle = '#FF6584';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, canvasHeight);
    ctx.stroke();

    // Draw playhead circle
    ctx.fillStyle = '#FF6584';
    ctx.beginPath();
    ctx.arc(playheadX, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  }, [waveformData, playerState, zoom]);

  // Draw spectrogram
  const drawSpectrogram = useCallback(() => {
    if (!spectrogramCanvasRef.current || waveformData.length === 0) return;

    const canvas = spectrogramCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = waveformData[0];
    const duration = playerState.duration || 1;
    const fftSize = 2048;

    // Create simple frequency visualization
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, width, height);

    // Draw frequency bands
    for (let x = 0; x < width; x++) {
      const timePos = (x / width) * duration;
      const sampleIndex = Math.floor((timePos / duration) * data.length);
      const windowSize = Math.min(fftSize, data.length - sampleIndex);

      // Calculate RMS for frequency bands
      let bandEnergies = [0, 0, 0, 0, 0]; // 5 frequency bands
      for (let i = 0; i < windowSize; i++) {
        const sample = Math.abs(data[sampleIndex + i] || 0);
        const freq = (i / windowSize) * 5;
        const band = Math.floor(freq);
        if (band < bandEnergies.length) {
          bandEnergies[band] += sample * sample;
        }
      }

      // Normalize
      bandEnergies = bandEnergies.map(e => Math.sqrt(e / windowSize));

      // Draw bands
      const bandHeight = height / bandEnergies.length;
      for (let b = 0; b < bandEnergies.length; b++) {
        const energy = Math.min(1, bandEnergies[b] * 2);
        const hue = (b / bandEnergies.length) * 60;
        const brightness = Math.floor(energy * 255);
        ctx.fillStyle = `hsla(${hue}, 100%, ${brightness / 5}%, ${energy})`;
        ctx.fillRect(x, b * bandHeight, 1, bandHeight);
      }
    }
  }, [waveformData, playerState]);

  // Animation loop
  useEffect(() => {
    drawWaveform();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawWaveform]);

  useEffect(() => {
    if (showSpectrogram) {
      drawSpectrogram();
    }
  }, [drawSpectrogram, showSpectrogram]);

  // Handle canvas click for seeking
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * playerState.duration;

    onSeek(Math.max(0, Math.min(newTime, playerState.duration)));
  };

  // Handle playhead dragging
  const handlePlayheadMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !onSeek || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * playerState.duration;

      onSeek(Math.max(0, Math.min(newTime, playerState.duration)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, onSeek, playerState.duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-dj-card rounded-lg border border-dj-border font-hebrew" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-dj-cyan">גרף צליל</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
            className="px-3 py-1 bg-dj-dark text-dj-cyan rounded text-xs hover:bg-dj-border transition-colors"
          >
            − זום
          </button>
          <span className="text-xs text-gray-400 px-2 py-1 bg-dj-dark rounded">
            {zoom.toFixed(1)}x
          </span>
          <button
            onClick={() => setZoom(Math.min(4, zoom + 0.5))}
            className="px-3 py-1 bg-dj-dark text-dj-cyan rounded text-xs hover:bg-dj-border transition-colors"
          >
            + זום
          </button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative cursor-pointer bg-dj-dark rounded border border-dj-border overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          onClick={handleCanvasClick}
          onMouseDown={handlePlayheadMouseDown}
          className="w-full block"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </div>

      {/* Spectrogram */}
      {showSpectrogram && (
        <div className="bg-dj-dark rounded border border-dj-border overflow-hidden">
          <canvas
            ref={spectrogramCanvasRef}
            width={800}
            height={60}
            className="w-full block"
          />
        </div>
      )}

      {/* Time Markers */}
      {showTimeMarkers && (
        <div className="flex justify-between text-xs text-gray-500 font-mono px-2">
          <span>{formatTime(playerState.currentTime)}</span>
          <span>{formatTime(playerState.duration)}</span>
        </div>
      )}

      {/* Controls Info */}
      <div className="text-xs text-gray-400 text-center">
        לחץ וגרור כדי לנווט • גלול לזום
      </div>
    </div>
  );
}
