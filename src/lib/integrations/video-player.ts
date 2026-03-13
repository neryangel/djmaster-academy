/**
 * Video.js + HLS.js Integration
 * אינטגרציה של Video.js ו-HLS.js לשיעורי וידאו
 */

import videojs from 'video.js';
type VideoJsPlayer = ReturnType<typeof videojs>;
type VideoJsPlayerOptions = Parameters<typeof videojs>[1];
// @ts-ignore — no type declarations available
import HlsPlugin from '@videojs/http-streaming';

/**
 * Lesson marker configuration
 */
export interface LessonMarker {
  time: number;
  label: string;
  id?: string;
  color?: string;
}

/**
 * Video lesson options
 */
export interface VideoLessonOptions extends VideoJsPlayerOptions {
  hls?: {
    withCredentials: boolean;
    maxRetries: number;
  };
  markers?: LessonMarker[];
  autoplay?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
}

/**
 * VideoLessonPlayer class - עטיפה על Video.js עם HLS support
 * Wrapper around Video.js with HLS.js support for lesson playback
 */
export class VideoLessonPlayer {
  private player: VideoJsPlayer | null = null;
  private markers: Map<number, LessonMarker> = new Map();
  private completionCallback: (() => void) | null = null;
  private currentPlaybackRate: number = 1;
  private elementId: string = '';

  /**
   * Initialize video player on DOM element
   * אתחול player על אלמנט DOM
   */
  async init(
    element: HTMLVideoElement | string,
    options: VideoLessonOptions = {}
  ): Promise<VideoJsPlayer> {
    // Ensure Video.js and HLS plugin are registered
    videojs.registerPlugin('httpSourceSelector', HlsPlugin);

    const elementId = typeof element === 'string' ? element : element.id;
    this.elementId = elementId;

    const defaultOptions: VideoJsPlayerOptions = {
      controls: true,
      autoplay: false,
      preload: 'metadata',
      responsive: true,
      fluid: true,
      controlBar: {
        children: [
          'playToggle',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'volumePanel',
          'playbackRateMenuButton',
          'fullscreenToggle',
        ],
      },
      plugins: {
        httpSourceSelector: {
          default: 'auto',
        },
      },
      html5: {
        hls: {
          overrideNative: true,
          withCredentials: options.hls?.withCredentials ?? false,
        },
      },
      ...options,
    };

    this.player = videojs(elementId, defaultOptions);

    // Setup event listeners
    this.setupEventListeners();

    // Initialize markers if provided
    if (options.markers && options.markers.length > 0) {
      options.markers.forEach(marker => {
        this.addMarker(marker.time, marker.label, marker.id, marker.color);
      });
    }

    return this.player;
  }

  /**
   * Setup event listeners for player
   */
  private setupEventListeners(): void {
    if (!this.player) return;

    // Track playback time for marker updates
    this.player.on('timeupdate', () => {
      this.checkMarkers();
    });

    // Handle end of video
    this.player.on('ended', () => {
      this.onVideoComplete();
    });

    // Error handling
    this.player.on('error', () => {
      const error = this.player?.error();
      console.error('Video playback error:', error?.message);
    });

    // Pause detection
    this.player.on('pause', () => {
      // Video paused
    });

    // Play detection
    this.player.on('play', () => {
      // Video playing
    });
  }

  /**
   * Load HLS stream
   * טעינת HLS stream
   */
  async loadLesson(url: string): Promise<void> {
    if (!this.player) {
      throw new Error('Player not initialized');
    }

    // Support for both HLS and regular video URLs
    if (url.endsWith('.m3u8')) {
      // HLS stream
      this.player.src({
        src: url,
        type: 'application/x-mpegURL',
      });
    } else {
      // Regular video file
      this.player.src(url);
    }

    // Reset player state
    this.currentPlaybackRate = 1;
    this.markers.clear();
  }

  /**
   * Set playback rate (0.5x to 2x)
   * הגדרת מהירות ההשמעה
   */
  setPlaybackRate(rate: number): void {
    if (!this.player) {
      throw new Error('Player not initialized');
    }

    const clampedRate = Math.max(0.5, Math.min(2, rate));
    this.player.playbackRate(clampedRate);
    this.currentPlaybackRate = clampedRate;
  }

  /**
   * Get current playback rate
   */
  getPlaybackRate(): number {
    return this.currentPlaybackRate;
  }

  /**
   * Add marker (lesson section/chapter)
   * הוספת marker לשיעור
   */
  addMarker(
    time: number,
    label: string,
    id?: string,
    color: string = '#6C63FF'
  ): void {
    const markerId = id || `marker-${time}`;
    const marker: LessonMarker = {
      time,
      label,
      id: markerId,
      color,
    };

    this.markers.set(time, marker);

    // Add visual marker to progress bar if player is initialized
    if (this.player && (this.player as any).progressControl) {
      // Create marker element on progress bar
      const progressBar = (this.player as any).progressControl.el();
      if (progressBar) {
        const markerEl = document.createElement('div');
        markerEl.className = 'lesson-marker';
        markerEl.setAttribute('data-time', time.toString());
        markerEl.setAttribute('data-label', label);
        markerEl.style.cssText = `
          position: absolute;
          width: 3px;
          height: 100%;
          background-color: ${color};
          cursor: pointer;
          top: 0;
          left: ${(time / (this.player.duration() || 1)) * 100}%;
          transition: opacity 0.2s;
        `;

        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.seekToMarker(time);
        });

        markerEl.addEventListener('mouseenter', () => {
          const tooltip = document.createElement('div');
          tooltip.className = 'marker-tooltip';
          tooltip.textContent = label;
          tooltip.style.cssText = `
            position: absolute;
            background: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            bottom: 100%;
            left: -50%;
            transform: translateX(50%);
            pointer-events: none;
          `;
          markerEl.appendChild(tooltip);
        });

        markerEl.addEventListener('mouseleave', () => {
          const tooltip = markerEl.querySelector('.marker-tooltip');
          tooltip?.remove();
        });

        progressBar.appendChild(markerEl);
      }
    }
  }

  /**
   * Remove marker
   */
  removeMarker(id: string): void {
    // Find and remove from map
    for (const [time, marker] of this.markers) {
      if (marker.id === id) {
        this.markers.delete(time);
        break;
      }
    }

    // Remove from DOM
    const markerEl = document.querySelector(`[data-marker-id="${id}"]`);
    markerEl?.remove();
  }

  /**
   * Check if we've reached any markers
   */
  private checkMarkers(): void {
    if (!this.player) return;

    const currentTime = this.player.currentTime?.() ?? 0;
    const threshold = 0.5; // within 0.5 seconds

    this.markers.forEach((marker, time) => {
      if (
        Math.abs(currentTime - time) < threshold &&
        Math.abs(currentTime - time - (threshold + 0.1)) > 0
      ) {
        // Marker reached
        this.onMarkerReached(marker);
      }
    });
  }

  /**
   * Callback when marker is reached
   */
  private onMarkerReached(marker: LessonMarker): void {
    // Reached marker at the specified time

    // Dispatch custom event
    const event = new CustomEvent('markerReached', {
      detail: marker,
    });
    window.dispatchEvent(event);
  }

  /**
   * Seek to specific marker
   */
  seekToMarker(time: number): void {
    if (!this.player) return;
    this.player.currentTime(time);
    this.player.play();
  }

  /**
   * Get all markers
   */
  getMarkers(): LessonMarker[] {
    return Array.from(this.markers.values()).sort((a, b) => a.time - b.time);
  }

  /**
   * Set completion callback
   * הגדרת callback עבור סיום שיעור
   */
  onComplete(callback: () => void): void {
    this.completionCallback = callback;
  }

  /**
   * Handle video completion
   */
  private onVideoComplete(): void {
    // Lesson completed
    this.completionCallback?.();

    // Dispatch custom event
    const event = new CustomEvent('lessonCompleted', {
      detail: {
        duration: this.player?.duration(),
        playedTime: this.player?.currentTime(),
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Get current time in seconds
   */
  getCurrentTime(): number {
    return this.player?.currentTime() || 0;
  }

  /**
   * Get video duration in seconds
   */
  getDuration(): number {
    return this.player?.duration() || 0;
  }

  /**
   * Get progress percentage (0-100)
   */
  getProgress(): number {
    const duration = this.getDuration();
    if (duration === 0) return 0;
    return (this.getCurrentTime() / duration) * 100;
  }

  /**
   * Check if video is playing
   */
  isPlaying(): boolean {
    return !this.player?.paused() || false;
  }

  /**
   * Play the video
   */
  play(): void {
    this.player?.play();
  }

  /**
   * Pause the video
   */
  pause(): void {
    this.player?.pause();
  }

  /**
   * Seek to time
   */
  seek(time: number): void {
    if (this.player) {
      this.player.currentTime(time);
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.player) {
      this.player.volume(Math.max(0, Math.min(1, volume)));
    }
  }

  /**
   * Enter fullscreen
   */
  requestFullscreen(): void {
    this.player?.requestFullscreen();
  }

  /**
   * Exit fullscreen
   */
  exitFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  /**
   * Cleanup and destroy player
   * ניקוי והרסת player
   */
  destroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }

    this.markers.clear();
    this.completionCallback = null;
  }

  /**
   * Get player instance
   */
  getPlayer(): VideoJsPlayer | null {
    return this.player;
  }

  /**
   * Get player element ID
   */
  getElementId(): string {
    return this.elementId;
  }
}

/**
 * Factory function to create and initialize video player
 */
export async function createVideoPlayer(
  element: HTMLVideoElement | string,
  options: VideoLessonOptions = {}
): Promise<VideoLessonPlayer> {
  const player = new VideoLessonPlayer();
  await player.init(element, options);
  return player;
}

export default VideoLessonPlayer;
