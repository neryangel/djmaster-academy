/**
 * UI Toolkit - ערכת UI משולבת עם Radix UI, Headless UI, Framer Motion, ו-Lucide Icons
 * Comprehensive UI toolkit combining Radix, Headless UI, Framer Motion, and Lucide
 */

// Re-export Radix UI components
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@radix-ui/react-dialog';

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@radix-ui/react-tabs';

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@radix-ui/react-tooltip';

export {
  Progress,
} from '@radix-ui/react-progress';

export {
  Slider,
} from '@radix-ui/react-slider';

export {
  Switch,
} from '@radix-ui/react-switch';

export {
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
} from '@radix-ui/react-dropdown-menu';

// Re-export Headless UI components
export {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

// Framer Motion Animation Presets
export const ANIMATION_PRESETS = {
  /**
   * אנימציה fade in פשוטה
   * Simple fade in animation
   */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  /**
   * אנימציה slide ל-RTL
   * RTL-aware slide animation
   */
  slideRTL: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { type: 'spring', stiffness: 100 },
  },

  /**
   * אנימציה slide ל-LTR (default RTL project)
   * LTR slide animation
   */
  slideLTR: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { type: 'spring', stiffness: 100 },
  },

  /**
   * פולס עם קצב
   * Beat pulse animation
   */
  beatPulse: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1],
    },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  /**
   * scale in animation
   * Scale entrance effect
   */
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { duration: 0.2 },
  },

  /**
   * rotate in animation
   * Spinning entrance
   */
  rotateIn: {
    initial: { rotate: -10, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 10, opacity: 0 },
    transition: { duration: 0.3 },
  },

  /**
   * smooth collapse/expand
   * Accordion-style animation
   */
  expandCollapse: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3 },
  },

  /**
   * DJ deck spin effect
   * Continuous rotation for spinners
   */
  deckSpin: {
    animate: {
      rotate: 360,
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Lucide Icons - DJ themed curated set
export {
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
} from 'lucide-react';

// RTL-aware utility types
export interface RTLProps {
  rtl?: boolean;
}

/**
 * RTL-safe motion variants provider
 * עזר ליצירת variants בחסינות RTL
 */
export function getRTLVariants(
  ltrVariant: any,
  rtlVariant: any,
  isRTL: boolean = true
) {
  return isRTL ? rtlVariant : ltrVariant;
}

/**
 * Create RTL-aware animation values
 * יצירת ערכי אנימציה בחסינות RTL
 */
export function createRTLAnimation(
  property: 'x' | 'rotate',
  value: number,
  isRTL: boolean = true
) {
  if (property === 'x') {
    return isRTL ? -value : value;
  }
  return value;
}

/**
 * DJ Theme Colors
 * הגדרות צבעים לתימת DJ
 */
export const DJ_THEME_COLORS = {
  background: '#0A0A0F',
  primary: '#6C63FF',
  secondary: '#9F7AEA',
  accent: '#FF006E',
  warning: '#FFB703',
  success: '#10B981',
  error: '#EF4444',
  surface: '#1A1A2E',
  border: '#2D2D44',
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B5',
    muted: '#6B6B78',
  },
};

/**
 * Responsive breakpoints
 * נקודות שבירה responsive
 */
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * UI component configuration helper
 * עזר להגדרת רכיבי UI
 */
export function createDJComponentStyle(variant: 'default' | 'primary' | 'secondary' = 'default') {
  const baseClasses = [
    'transition-all duration-200',
    'rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
  ];

  const variantClasses = {
    default: [
      'bg-gray-200 text-gray-900',
      'hover:bg-gray-300',
      'focus:ring-offset-gray-100',
    ],
    primary: [
      'bg-[#6C63FF] text-white',
      'hover:bg-[#9F7AEA]',
      'focus:ring-[#6C63FF]',
    ],
    secondary: [
      'bg-[#9F7AEA] text-white',
      'hover:bg-[#6C63FF]',
      'focus:ring-[#9F7AEA]',
    ],
  };

  return [...baseClasses, ...variantClasses[variant]].join(' ');
}

/**
 * Modal/Dialog RTL wrapper
 * עטיפת RTL לדיאלוג
 */
export interface DialogContentProps {
  isRTL?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export default {
  ANIMATION_PRESETS,
  DJ_THEME_COLORS,
  BREAKPOINTS,
  createDJComponentStyle,
  getRTLVariants,
  createRTLAnimation,
};
