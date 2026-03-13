/**
 * Integration Barrel Export
 * ייצוא מרכזי של כל האינטגרציות
 */

// Audio Stack Integration
export {
  AudioStack,
  getAudioStack,
  AudioFeatures,
  CompatibleKey,
} from './audio-stack';

// MIDI Stack Integration
export {
  MidiStack,
  getMidiStack,
  MidiControlHandler,
  MidiNoteHandler,
  DDJFLXMapping,
} from './midi-stack';

// UI Toolkit Integration
export {
  ANIMATION_PRESETS,
  DJ_THEME_COLORS,
  BREAKPOINTS,
  createDJComponentStyle,
  getRTLVariants,
  createRTLAnimation,
  RTLProps,
  DialogContentProps,
  // Radix UI exports
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Progress,
  Slider,
  Switch,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  // Headless UI exports
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  // Lucide Icons exports
  Music,
  Headphones,
  Volume2,
  VolumeX,
  Disc3,
  Timer,
  Zap,
  Trophy,
  Star,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume,
  Radio,
  Waveform,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  Trash2,
  Edit2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  LogOut,
  LogIn,
  User,
  Users,
  Heart,
  MessageSquare,
  Send,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Sliders,
  Mic,
  Loader,
  CheckCircle,
  AlertTriangle,
  Globe,
} from './ui-toolkit';

// Drag & Drop Playlist Integration
export {
  DndPlaylistProvider,
  SortableTrack,
  useSortablePlaylist,
  formatDuration,
  PlaylistTrack,
  DndPlaylistProviderProps,
  SortableTrackProps,
  SortableTrackComponentProps,
  UseSortablePlaylistOptions,
} from './dnd-playlist';

// PWA Configuration
export {
  vitePWAConfig,
  offlinePageConfig,
  swUpdateNotificationConfig,
  setupPWAUpdateListener,
  VitePWAOptions,
} from './pwa-config';

// Video Player Integration
export {
  VideoLessonPlayer,
  createVideoPlayer,
  LessonMarker,
  VideoLessonOptions,
} from './video-player';

// Charts Configuration
export {
  DJ_CHART_COLORS,
  CHART_THEME,
  RESPONSIVE_CONTAINER_DEFAULTS,
  DJChartTooltip,
  XPProgressChart,
  FrequencySpectrum,
  BPMHistoryChart,
  EnergyFlowChart,
  MixingSkillsRadar,
  TimeSpentChart,
  createDJChart,
  // Recharts exports
  ResponsiveContainer,
  BarChart,
  LineChart,
  AreaChart,
  PieChart as RechartsPieChart,
  RadarChart,
  ScatterChart,
  ComposedChart,
  Bar,
  Line,
  Area,
  Pie,
  Radar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from './charts-config';

/**
 * Storybook Configuration Paths
 * נתיבים להגדרות Storybook
 */
export const STORYBOOK_CONFIG_PATHS = {
  main: './storybook-config/.storybook/main.ts',
  preview: './storybook-config/.storybook/preview.ts',
} as const;

/**
 * Integration versions
 * גרסאות ספריות האינטגרציה
 */
export const INTEGRATION_VERSIONS = {
  'tone': '^14.8.0',
  'howler': '^2.2.3',
  'wavesurfer.js': '^7.0.0',
  '@tonaljs/tonal': '^4.8.0',
  'meyda': '^4.4.4',
  '@dnd-kit/core': '^8.0.0',
  '@dnd-kit/sortable': '^8.0.0',
  '@dnd-kit/utilities': '^3.2.0',
  '@radix-ui/react-dialog': '^1.1.2',
  '@radix-ui/react-tabs': '^1.0.4',
  '@radix-ui/react-tooltip': '^1.0.7',
  '@radix-ui/react-progress': '^1.0.3',
  '@radix-ui/react-slider': '^1.1.2',
  '@radix-ui/react-switch': '^1.0.3',
  '@radix-ui/react-dropdown-menu': '^2.0.6',
  '@headlessui/react': '^1.7.18',
  'framer-motion': '^10.16.4',
  'lucide-react': '^0.323.0',
  'recharts': '^2.10.3',
  'video.js': '^8.10.0',
  '@videojs/http-streaming': '^2.15.3',
  '@vite-pwa/astro': '^0.2.0',
  'workbox-core': '^7.0.0',
  'workbox-precaching': '^7.0.0',
  'workbox-routing': '^7.0.0',
  'workbox-strategies': '^7.0.0',
} as const;

/**
 * Initialize all integrations
 * אתחול כל האינטגרציות
 */
export async function initializeIntegrations(): Promise<{
  audioStack: ReturnType<typeof getAudioStack>;
  midiStack: ReturnType<typeof getMidiStack>;
}> {
  const { getAudioStack } = await import('./audio-stack');
  const { getMidiStack } = await import('./midi-stack');

  const audioStack = getAudioStack();
  const midiStack = getMidiStack();

  // Initialize audio stack
  await audioStack.initialize();

  // Initialize MIDI stack
  await midiStack.initialize();

  return {
    audioStack,
    midiStack,
  };
}

/**
 * Default export with all integrations
 */
export default {
  AudioStack: (await import('./audio-stack')).AudioStack,
  getAudioStack: (await import('./audio-stack')).getAudioStack,
  MidiStack: (await import('./midi-stack')).MidiStack,
  getMidiStack: (await import('./midi-stack')).getMidiStack,
  DndPlaylistProvider: (await import('./dnd-playlist')).DndPlaylistProvider,
  SortableTrack: (await import('./dnd-playlist')).SortableTrack,
  useSortablePlaylist: (await import('./dnd-playlist')).useSortablePlaylist,
  VideoLessonPlayer: (await import('./video-player')).VideoLessonPlayer,
  createVideoPlayer: (await import('./video-player')).createVideoPlayer,
  vitePWAConfig: (await import('./pwa-config')).vitePWAConfig,
  STORYBOOK_CONFIG_PATHS,
  INTEGRATION_VERSIONS,
  initializeIntegrations,
};
