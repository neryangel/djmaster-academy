# Quick Reference - DJMaster Academy Components

## File Locations

```
src/components/
├── audio/
│   └── WaveformVisualizer.tsx          (334 lines)
├── midi/
│   └── MIDIControllerUI.tsx            (503 lines)
├── ui/
│   └── AchievementToast.tsx            (255 lines)
└── course/
    └── LessonNavigator.tsx             (316 lines)
```

## Import Examples

### WaveformVisualizer
```typescript
import WaveformVisualizer from '@/components/audio/WaveformVisualizer';
import { AudioPlayerState } from '@/types/audio';
```

### MIDIControllerUI
```typescript
import MIDIControllerUI from '@/components/midi/MIDIControllerUI';
import { MidiConnectionState, MidiEvent } from '@/types/midi';
```

### AchievementToast
```typescript
import AchievementToast, { AchievementToastContainer } 
  from '@/components/ui/AchievementToast';
import { Badge, BADGES } from '@/types/gamification';
```

### LessonNavigator
```typescript
import LessonNavigator from '@/components/course/LessonNavigator';
// Interface definitions included in component
```

## Minimal Examples

### WaveformVisualizer
```tsx
<WaveformVisualizer
  audioUrl="/track.mp3"
  playerState={{
    isPlaying: false,
    currentTime: 0,
    duration: 300,
    volume: 100,
    playbackRate: 1,
    isLoading: false,
    error: null,
  }}
  onSeek={(time) => console.log('Seek to:', time)}
/>
```

### MIDIControllerUI
```tsx
<MIDIControllerUI
  connectionState={{
    isSupported: true,
    isConnected: true,
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
```

### AchievementToast
```tsx
<AchievementToast
  badge={{
    id: 'midi-wizard',
    name: 'MIDI Wizard',
    nameHe: 'קוסם ה-MIDI',
    description: 'Connect your controller',
    descriptionHe: 'חבר את הבקר שלך',
    icon: '🎛️',
    category: 'midi',
    requirement: 'Use all controls',
    xpReward: 500,
    rarity: 'epic',
  }}
  onDismiss={() => console.log('Dismissed')}
/>
```

### LessonNavigator
```tsx
<LessonNavigator
  modules={[
    {
      id: 'mod-1',
      title: 'Basics',
      titleHe: 'יסודות',
      order: 1,
      lessons: [
        {
          id: 'les-1',
          title: 'Introduction',
          titleHe: 'הקדמה',
          duration: 600,
          type: 'video',
          completed: true,
          locked: false,
          order: 1,
        },
      ],
    },
  ]}
  courseProgress={25}
  onLessonSelect={(lessonId, moduleId) => {
    console.log(`Selected: ${lessonId} in ${moduleId}`);
  }}
/>
```

## Key Features Summary

| Component | Lines | Key Feature | Theme Color |
|-----------|-------|------------|-------------|
| WaveformVisualizer | 334 | Canvas waveform + spectrogram | Cyan #00D4FF |
| MIDIControllerUI | 503 | Interactive controller UI | Multi-color |
| AchievementToast | 255 | Animated notifications | Rarity-based |
| LessonNavigator | 316 | Expandable course outline | Cyan + Purple |

## Color References

```javascript
// Primary Theme Colors
const colors = {
  cyan: '#00D4FF',      // Waveform, primary UI
  purple: '#7B2FFF',    // Accents, modals
  pink: '#FF6584',      // Playhead, secondary
  green: '#00FF88',     // Success, completion
  orange: '#FF8C00',    // Warnings, progress
  dark: '#0A0A0F',      // Background
  card: '#1A1A2E',      // Card backgrounds
};

// Rarity Colors (AchievementToast)
const rarityColors = {
  common: '#00FF88',    // Green
  uncommon: '#00D4FF',  // Cyan
  rare: '#7B2FFF',      // Purple
  epic: '#FF8C00',      // Orange
  legendary: '#FFD700', // Gold
};
```

## RTL Configuration

All components automatically support RTL:

```tsx
<div dir="rtl" lang="he" className="font-hebrew">
  {/* Components are RTL-ready */}
</div>
```

## Component Props Checklist

### WaveformVisualizer
- [x] audioUrl (required)
- [x] playerState (required)
- [ ] onSeek (optional)
- [ ] height (optional, default: 200)
- [ ] showSpectrogram (optional, default: true)
- [ ] showTimeMarkers (optional, default: true)

### MIDIControllerUI
- [x] connectionState (required)
- [ ] onMidiEvent (optional)
- [ ] decksState (optional)
- [ ] activePads (optional)
- [ ] crossfaderPosition (optional)

### AchievementToast
- [x] badge (required)
- [ ] onDismiss (optional)
- [ ] duration (optional, default: 5000ms)
- [ ] stackPosition (optional, default: 0)

### LessonNavigator
- [x] modules (required)
- [ ] currentLessonId (optional)
- [ ] currentModuleId (optional)
- [ ] onLessonSelect (optional)
- [ ] courseProgress (optional, default: 0)
- [ ] isCompact (optional, default: false)

## State Management Examples

### Using with useState
```typescript
const [playerState, setPlayerState] = useState<AudioPlayerState>({
  isPlaying: false,
  currentTime: 0,
  duration: 300,
  volume: 100,
  playbackRate: 1,
  isLoading: false,
  error: null,
});
```

### Using with useCallback
```typescript
const handleSeek = useCallback((time: number) => {
  setPlayerState(prev => ({
    ...prev,
    currentTime: Math.max(0, Math.min(time, prev.duration)),
  }));
}, []);
```

## Common Issues & Solutions

### WaveformVisualizer not rendering
- Ensure audio URL is accessible and CORS-enabled
- Check browser console for audio decode errors
- Verify AudioContext is supported

### MIDIControllerUI unresponsive
- Check MIDI connection status indicator
- Verify `onMidiEvent` callback is connected
- Ensure DDJ-FLX4 is recognized by the browser

### AchievementToast not visible
- Check if parent has `z-index: 50` or higher
- Verify toast is added to container
- Check viewport for positioning

### LessonNavigator mobile drawer not opening
- Ensure `isCompact={false}` for desktop sidebar
- Set `isCompact={true}` for mobile drawer mode
- Check viewport width and responsive breakpoints

## Performance Tips

1. **Memoization**
   ```typescript
   const MemoizedComponent = React.memo(MyComponent);
   ```

2. **Lazy Loading**
   ```typescript
   const LazyWaveform = lazy(() => import('@/components/audio/WaveformVisualizer'));
   ```

3. **useCallback for Event Handlers**
   ```typescript
   const handleSeek = useCallback((time: number) => {
     // handler logic
   }, [dependencies]);
   ```

## TypeScript Definitions

All components export their interface definitions:

```typescript
// Use these for type safety
import type { 
  WaveformVisualizerProps,
  MIDIControllerUIProps,
  AchievementToastProps,
  LessonNavigatorProps 
} from '@/components/...';
```

## Tailwind Classes Used

```
// Spacing
p-4, px-6, py-3, gap-2, gap-4, gap-8

// Display
flex, flex-col, flex-1, w-full, h-screen

// Colors
text-dj-cyan, bg-dj-card, border-dj-border

// Effects
rounded-lg, shadow-lg, transition-all

// Text
font-hebrew, font-bold, text-sm, text-xs

// Responsive
md:hidden, md:flex, grid-cols-2, grid-cols-4
```

## Browser DevTools Tips

### Debug WaveformVisualizer
```javascript
// Check audio context
console.log(audioContext.state);

// Monitor animation frame
console.log(requestAnimationFrame);
```

### Debug MIDI
```javascript
// List connected MIDI devices
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(access => {
    console.log('MIDI inputs:', access.inputs);
  });
}
```

### Debug Toast Stack
```javascript
// Monitor toast stack
console.log('Current toasts:', toasts);
```

## Version Compatibility

- React 19+
- TypeScript 5.0+
- Tailwind CSS 3.0+
- Modern browsers (ES2020+)

## License & Credits

Created for DJMaster Academy - Hebrew RTL DJ Education Platform
All components follow the DJ dark theme design system.
