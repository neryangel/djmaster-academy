# Design System — DJMaster Academy

## 🎨 Color Palette

### Primary
| Token | Hex | שימוש |
|-------|-----|-------|
| `brand-orange` | `#FF6B35` | CTA, Highlights, Active states |
| `brand-purple` | `#A855F7` | Secondary, Harmonic tool |
| `brand-green` | `#2ECC71` | Success, Compatible keys |

### Background
| Token | Hex | שימוש |
|-------|-----|-------|
| `bg-base` | `#0A0A0F` | Body background |
| `bg-surface` | `#12121F` | Cards |
| `bg-elevated` | `#1A1A2E` | Modals, Inputs |
| `bg-border` | `#2A2A3E` | Borders, Dividers |

### Text
| Token | Hex | שימוש |
|-------|-----|-------|
| `text-primary` | `#E8E8E8` | Body text |
| `text-secondary` | `#AAAAAA` | Subtitles, Labels |
| `text-muted` | `#666666` | Placeholders |
| `text-brand` | `#FF6B35` | Links, Emphasis |

---

## 📐 Typography

### Font Stack
```css
--font-primary: 'Heebo', 'Segoe UI', sans-serif; /* עברית */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* קוד */
```

### Scale
| Token | Size | Line Height | שימוש |
|-------|------|-------------|-------|
| `text-xs` | 12px | 1.4 | Labels |
| `text-sm` | 14px | 1.5 | Body small |
| `text-base` | 16px | 1.6 | Body |
| `text-lg` | 18px | 1.5 | Lead |
| `text-xl` | 24px | 1.3 | H3 |
| `text-2xl` | 32px | 1.2 | H2 |
| `text-3xl` | 48px | 1.1 | H1 |
| `text-hero` | 64px | 1.0 | Hero |

---

## 📦 Spacing

```
4px  = xs
8px  = sm
12px = md
16px = base
24px = lg
32px = xl
48px = 2xl
64px = 3xl
```

---

## 🔲 Components

### Button — Primary
```css
background: #FF6B35;
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
font-size: 16px;
border: none;
cursor: pointer;
transition: all 0.2s;

:hover { background: #e55a27; transform: translateY(-1px); }
:active { transform: translateY(0); }
```

### Button — Secondary
```css
background: transparent;
color: #FF6B35;
border: 1.5px solid #FF6B35;
/* same padding/radius */
:hover { background: rgba(255,107,53,0.1); }
```

### Card
```css
background: #12121F;
border: 1px solid #2A2A3E;
border-radius: 12px;
padding: 24px;
```

### Input
```css
background: #1A1A2E;
border: 1px solid #2A2A3E;
border-radius: 8px;
padding: 12px 16px;
color: #E8E8E8;
font-size: 16px;
direction: rtl;

:focus { border-color: #FF6B35; outline: none; box-shadow: 0 0 0 3px rgba(255,107,53,0.15); }
```

### Badge
```css
/* Success */
background: rgba(46,204,113,0.15);
color: #2ECC71;
border: 1px solid rgba(46,204,113,0.3);
border-radius: 20px;
padding: 4px 12px;
font-size: 12px;
font-weight: 600;
```

---

## 🌊 Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulse (Active/Recording) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

/* Flash (Tap BPM) */
@keyframes flash {
  0%   { background: #FF6B35; }
  100% { background: #1A1A2E; }
}
```

---

## 📱 Breakpoints

| Name | Min Width | שימוש |
|------|-----------|-------|
| `sm` | 480px | Mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide |

---

## 🖼️ Icons

Library: **Lucide Icons** (https://lucide.dev)

| Icon | שימוש |
|------|-------|
| `Music` | שיעורים |
| `Headphones` | האזנה / מיקסינג |
| `Zap` | Energy / מהירות |
| `Target` | יעד / Hot Cue |
| `RotateCw` | Loop |
| `Volume2` | שמע |
| `Award` | תעודה |
| `Users` | קהילה |
| `TrendingUp` | התקדמות |

---

## ✅ Accessibility

- Contrast ratio: 4.5:1 מינימום (WCAG AA)
- Focus visible: `box-shadow: 0 0 0 3px rgba(255,107,53,0.4)`
- RTL: `dir="rtl"` על `<html>`
- Font size: לא פחות מ-14px
- Touch targets: לא פחות מ-44×44px

---

*DJMaster Academy Design System v1.0*
