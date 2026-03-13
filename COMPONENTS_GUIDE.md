# Advanced React Components Guide - DJMaster Academy

This guide documents the 4 advanced React components created for the DJMaster Academy project. All components are built with React 19, TypeScript, Tailwind CSS, and feature Hebrew RTL support with a professional DJ dark theme.

## Component Overview

### 1. WaveformVisualizer.tsx (334 lines)
**Location:** `/src/components/audio/WaveformVisualizer.tsx`

A professional audio waveform visualization component with real-time playback position and interactive controls.

#### Features:
- Real-time Canvas API waveform rendering
- Cyan (#00D4FF) waveform with pink (#FF6584) playhead
- Draggable playhead for seeking
- Interactive zoom in/out controls (0.5x - 4x)
- Frequency spectrogram visualization below waveform
- Time markers and duration display
- Responsive design with RTL support
- Grid overlay for visual reference
- Animated playhead circle indicator

#### Props:
```typescript
interface WaveformVisualizerProps {
  audioUrl: string;              // Audio file URL to visualize
  playerState: AudioPlayerState;  // Current playback state
  onSeek?: (time: number) => void; // Callback on seek
  height?: number;               // Canvas height (default: 200)
  showSpectrogram?: boolean;      // Show frequency spectrum (default: true)
  showTimeMarkers?: boolean;      // Show time display (default: true)
}
```

#### Usage Example:
```tsx
import WaveformVisualizer from '@/components/audio/WaveformVisualizer';

export function TrackPlayer() {
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 180,
    volume: 100,
    playbackRate: 1,
    isLoading: false,
    error: null,
  });

  return (
    <WaveformVisualizer
      audioUrl="/tracks/sample.mp3"
      playerState={playerState}
      onSeek={(time) => setPlayerState(prev => ({ ...prev, currentTime: time }))}
      height={200}
      showSpectrogram={true}
      showTimeMarkers={true}
    />
  );
}
```

#### Technical Details:
- Loads and decodes audio using Web Audio API
- Uses requestAnimationFrame for smooth animation
- Supports multi-channel audio with stereo visualization
- FFT-based frequency band analysis for spectrogram
- Draggable playhead with smooth interaction
- Responsive canvas scaling

---

### 2. MIDIControllerUI.tsx (503 lines)
**Location:** `/src/components/midi/MIDIControllerUI.tsx`

A visual representation of the Pioneer DDJ-FLX4 controller with interactive controls.

#### Features:
- Two virtual jog wheels (Deck A & B) with SVG rotation animation
- Interactive EQ knobs (Hi/Mid/Lo) per deck with rotary SVG visualization
- Volume faders for each deck with percentage display
- Play/Cue/Sync buttons with LED-style indicators
- 8 performance pads (4x2 grid) per deck with color states
- Visual crossfader slider between decks
- VU meter displays for volume levels
- MIDI connection status indicator
- All labels in Hebrew
- Responsive grid layout
- Touch-friendly button sizing

#### Props:
```typescript
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
```

#### Usage Example:
```tsx
import MIDIControllerUI from '@/components/midi/MIDIControllerUI';
import { MidiConnectionState } from '@/types/midi';

export function ControllerPanel() {
  const [connectionState, setConnectionState] = useState<MidiConnectionState>({
    isSupported: true,
    isConnected: true,
    deviceName: 'DDJ-FLX4',
    deviceId: null,
    error: null,
  });

  const [decksState, setDecksState] = useState({
    playing: { A: false, B: false },
    cued: { A: false, B: false },
    synced: { A: false, B: false },
    volume: { A: 100, B: 100 },
    tempo: { A: 0, B: 0 },
  });

  return (
    <MIDIControllerUI
      connectionState={connectionState}
      decksState={decksState}
      activePads={{ A: [0, 2], B: [] }}
      crossfaderPosition={64}
      onMidiEvent={(event) => console.log('MIDI Event:', event)}
    />
  );
}
```

#### Technical Details:
- SVG-based jog wheels with smooth rotation animation
- Rotary knob visualization with gradient effects
- Interactive range sliders for EQ and faders
- Color-coded pads with rarity-based color scheme
- Real-time connection status updates
- MIDI mapping integration with DDJ_FLX4_MAPPING
- Responsive design with compact layout

---

### 3. AchievementToast.tsx (255 lines)
**Location:** `/src/components/ui/AchievementToast.tsx`

A notification toast component for displaying achievements with animated confetti effects.

#### Features:
- Slides in from top-right (top-left in RTL)
- Displays achievement icon, name (Hebrew), XP reward
- Animated confetti particle system
- Auto-dismisses after 5 seconds with progress bar
- Stacks multiple toasts automatically
- Rarity-based styling (Common/Uncommon/Rare/Epic/Legendary)
- Gold gradient for legendary, purple for rare, cyan for uncommon
- Close button for manual dismissal
- Smooth fade-out animation
- Full Hebrew text support

#### Props:
```typescript
interface AchievementToastProps {
  badge: Badge;
  onDismiss?: () => void;
  duration?: number;    // Auto-dismiss duration (default: 5000ms)
  stackPosition?: number; // Position in stack (default: 0)
}
```

#### Usage Example:
```tsx
import AchievementToast, { AchievementToastContainer } from '@/components/ui/AchievementToast';
import { Badge } from '@/types/gamification';

export function AchievementDemo() {
  const [toasts, setToasts] = useState<(Badge & { id: string })[]>([]);

  const showAchievement = (badge: Badge) => {
    const toastId = `${badge.id}-${Date.now()}`;
    const toastWithId = { ...badge, id: toastId };
    setToasts(prev => [...prev, toastWithId]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      <button
        onClick={() => showAchievement({
          id: 'midi-wizard',
          name: 'MIDI Wizard',
          nameHe: 'קוסם ה-MIDI',
          description: 'Connect your DDJ-FLX4',
          descriptionHe: 'חבר את ה-DDJ-FLX4 שלך',
          icon: '🎛️',
          category: 'midi',
          requirement: 'Use all controls',
          xpReward: 500,
          rarity: 'epic',
        })}
      >
        Show Achievement
      </button>

      <AchievementToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </>
  );
}
```

#### Technical Details:
- Particle system with physics simulation
- Canvas rendering for confetti effects
- Auto-dismiss timer with linear progress bar
- Stack positioning for multiple toasts
- Rarity-based color scheme with glowing effects
- Smooth CSS transitions
- Memory-efficient particle cleanup

---

### 4. LessonNavigator.tsx (316 lines)
**Location:** `/src/components/course/LessonNavigator.tsx`

A sidebar lesson navigator with expandable modules and progress tracking.

#### Features:
- Accordion-style module expansion
- Lesson completion checkmarks
- Lesson type indicators (Video/Text/Quiz/Exercise)
- Duration display per lesson
- Lock icons for inaccessible lessons
- Module-level progress bars
- Overall course progress bar
- Sticky sidebar behavior
- Mobile-responsive collapsible drawer
- All Hebrew text
- Visual highlighting of current lesson

#### Props:
```typescript
interface LessonNavigatorProps {
  modules: Module[];
  currentLessonId?: string;
  currentModuleId?: string;
  onLessonSelect?: (lessonId: string, moduleId: string) => void;
  courseProgress?: number;  // 0-100 percentage
  isCompact?: boolean;      // Mobile drawer mode
}
```

#### Data Types:
```typescript
interface Lesson {
  id: string;
  title: string;
  titleHe: string;
  duration: number;         // seconds
  type: 'video' | 'text' | 'quiz' | 'exercise';
  completed: boolean;
  locked: boolean;
  order: number;
}

interface Module {
  id: string;
  title: string;
  titleHe: string;
  lessons: Lesson[];
  order: number;
}
```

#### Usage Example:
```tsx
import LessonNavigator from '@/components/course/LessonNavigator';

export function CourseView() {
  const [currentLessonId, setCurrentLessonId] = useState<string>();
  const [currentModuleId, setCurrentModuleId] = useState<string>();

  const modules = [
    {
      id: 'mod-1',
      title: 'Foundations',
      titleHe: 'יסודות',
      order: 1,
      lessons: [
        {
          id: 'les-1-1',
          title: 'What is DJing?',
          titleHe: 'מה זה DJing?',
          duration: 600,
          type: 'video',
          completed: true,
          locked: false,
          order: 1,
        },
        {
          id: 'les-1-2',
          title: 'Equipment Overview',
          titleHe: 'סקירת הציוד',
          duration: 900,
          type: 'text',
          completed: false,
          locked: false,
          order: 2,
        },
      ],
    },
    {
      id: 'mod-2',
      title: 'Beatmatching',
      titleHe: 'התאמת ביטים',
      order: 2,
      lessons: [
        {
          id: 'les-2-1',
          title: 'Understanding BPM',
          titleHe: 'הבנת BPM',
          duration: 1200,
          type: 'video',
          completed: false,
          locked: false,
          order: 1,
        },
        {
          id: 'les-2-2',
          title: 'Practice Session',
          titleHe: 'מושב תרגול',
          duration: 1800,
          type: 'exercise',
          completed: false,
          locked: true,
          order: 2,
        },
      ],
    },
  ];

  return (
    <LessonNavigator
      modules={modules}
      currentLessonId={currentLessonId}
      currentModuleId={currentModuleId}
      courseProgress={25}
      onLessonSelect={(lessonId, moduleId) => {
        setCurrentLessonId(lessonId);
        setCurrentModuleId(moduleId);
      }}
    />
  );
}
```

#### Technical Details:
- Expandable accordion with smooth animations
- Module progress calculation
- Course-wide progress aggregation
- Responsive grid layout for modules
- Mobile drawer with overlay
- Lesson type icons and badges
- Sticky positioning for desktop sidebar
- Smooth scroll behavior

---

## Common Integration Patterns

### Using All Components Together

```tsx
import WaveformVisualizer from '@/components/audio/WaveformVisualizer';
import MIDIControllerUI from '@/components/midi/MIDIControllerUI';
import AchievementToast, { AchievementToastContainer } from '@/components/ui/AchievementToast';
import LessonNavigator from '@/components/course/LessonNavigator';
import { AudioPlayerState } from '@/types/audio';

export function DJTrainingDashboard() {
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 300,
    volume: 100,
    playbackRate: 1,
    isLoading: false,
    error: null,
  });

  const [midiConnected, setMidiConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [currentLesson, setCurrentLesson] = useState('');

  return (
    <div className="flex h-screen bg-dj-dark font-hebrew" dir="rtl">
      {/* Sidebar Navigator */}
      <div className="w-80">
        <LessonNavigator
          modules={coursesModules}
          currentLessonId={currentLesson}
          courseProgress={45}
          onLessonSelect={(lessonId) => setCurrentLesson(lessonId)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Audio Player and Waveform */}
        <section className="mb-8">
          <WaveformVisualizer
            audioUrl="/sample-track.mp3"
            playerState={playerState}
            onSeek={(time) => setPlayerState(p => ({ ...p, currentTime: time }))}
          />
        </section>

        {/* MIDI Controller */}
        <section>
          <MIDIControllerUI
            connectionState={{
              isSupported: true,
              isConnected: midiConnected,
              deviceName: 'DDJ-FLX4',
              deviceId: null,
              error: null,
            }}
            decksState={{
              playing: { A: false, B: false },
              cued: { A: false, B: false },
              synced: { A: false, B: false },
              volume: { A: 100, B: 100 },
              tempo: { A: 0, B: 0 },
            }}
          />
        </section>
      </div>

      {/* Toast Notifications */}
      <AchievementToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  );
}
```

## Styling and Theme

All components use the DJ dark theme defined in `tailwind.config.mjs`:

### Color Palette:
- **Dark Background:** `#0A0A0F` (dj-dark)
- **Card Background:** `#1A1A2E` (dj-card)
- **Panel Background:** `#16213E` (dj-panel)
- **Primary Cyan:** `#00D4FF` (dj-cyan)
- **Primary Purple:** `#7B2FFF` (dj-purple)
- **Accent Pink:** `#FF6584` (accent)
- **Success Green:** `#00FF88` (dj-green)
- **Warning Orange:** `#FF8C00` (dj-orange)

### Typography:
- **Font Family:** Heebo, Assistant (Hebrew optimized)
- **Monospace:** Space Mono, Fira Code (for time displays)
- **Direction:** RTL by default, LTR compatible

## Performance Optimization Tips

1. **WaveformVisualizer:**
   - Limit canvas height for better performance
   - Reduce spectrogram granularity for large files
   - Use `showSpectrogram={false}` if not needed

2. **MIDIControllerUI:**
   - Memoize knob value calculations
   - Throttle MIDI event callbacks
   - Use React.memo for sub-components

3. **AchievementToast:**
   - Limit particle count for lower-end devices
   - Cache rarity color values
   - Clean up particles aggressively

4. **LessonNavigator:**
   - Use React.memo for Module accordion items
   - Implement virtual scrolling for 100+ lessons
   - Debounce expansion state changes

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills Needed:
- Web Audio API
- Canvas 2D Context
- requestAnimationFrame

## Testing

Each component includes TypeScript interfaces for easy testing:

```tsx
import { render, screen } from '@testing-library/react';
import WaveformVisualizer from '@/components/audio/WaveformVisualizer';

test('renders waveform visualizer', () => {
  const mockPlayerState = {
    isPlaying: true,
    currentTime: 10,
    duration: 100,
    volume: 100,
    playbackRate: 1,
    isLoading: false,
    error: null,
  };

  render(
    <WaveformVisualizer
      audioUrl="/test.mp3"
      playerState={mockPlayerState}
    />
  );

  expect(screen.getByText('גרף צליל')).toBeInTheDocument();
});
```

## Accessibility

All components include:
- Semantic HTML structure
- ARIA labels where applicable
- Keyboard navigation support
- RTL/LTR text direction handling
- High contrast color schemes
- Focus management

## Future Enhancements

1. **WaveformVisualizer:**
   - Beat grid overlay
   - Loop region visualization
   - Cue point markers
   - Multiple waveform comparison

2. **MIDIControllerUI:**
   - Customizable button mapping
   - Effect chain visualization
   - Sample triggering feedback
   - Real MIDI connection integration

3. **AchievementToast:**
   - Toast queue management system
   - Custom animations per rarity
   - Sound effects on unlock
   - Persistent achievement history

4. **LessonNavigator:**
   - Search functionality
   - Lesson filtering/sorting
   - Breadcrumb navigation
   - Progress persistence
