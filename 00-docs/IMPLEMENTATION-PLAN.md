# DJMaster Academy — תוכנית יישום מקצועית

> מבוסס על מחקר מעמיק של 50+ פרויקטי קוד פתוח, ארכיטקטורות LMS מודרניות, וכלי DJ מקצועיים.

---

## 1. ארכיטקטורה מומלצת — Stack מלא

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Astro + Starlight (course site)                    │
│  + React components (interactive tools)             │
│  + Tailwind CSS + RTL support                       │
├─────────────────────────────────────────────────────┤
│                  CONTENT LAYER                       │
│  Markdown lessons → Astro Content Collections       │
│  JSON quizzes → JSON Schema validation              │
│  YAML metadata → Type-safe schemas                  │
│  Keystatic → Visual editor (Git-based CMS)          │
├─────────────────────────────────────────────────────┤
│                   AUDIO ENGINE                       │
│  wavesurfer.js (waveform visualization)             │
│  howler.js (playback engine)                        │
│  Tone.js (effects & synthesis)                      │
│  essentia.js (BPM, key detection)                   │
│  Web MIDI API (DDJ-FLX4 integration)                │
├─────────────────────────────────────────────────────┤
│                    BACKEND                           │
│  Supabase (Auth, DB, Storage)                       │
│  xAPI / SCORM export (LiaScript Exporter)           │
│  Edge Functions (analytics, progress)               │
├─────────────────────────────────────────────────────┤
│                    CI/CD                             │
│  GitHub Actions (validate, lint, build, deploy)     │
│  Pre-commit hooks (husky + lint-staged)             │
│  Lychee (link checking)                             │
│  ajv-cli (JSON Schema validation)                   │
└─────────────────────────────────────────────────────┘
```

---

## 2. כלים לשילוב בפרויקט — לפי עדיפות

### 🔴 חובה (MVP)

| כלי | GitHub | כוכבים | תפקיד |
|-----|--------|--------|--------|
| **wavesurfer.js** | github.com/katspaugh/wavesurfer.js | 8,200+ | ויזואליזציית גלי קול בשיעורים |
| **Tone.js** | github.com/Tonejs/Tone.js | 11,000+ | אפקטים, סינתזה, תרגול אינטראקטיבי |
| **essentia.js** | github.com/MTG/essentia.js | — | זיהוי BPM, סולם, ביטים (WebAssembly) |
| **howler.js** | github.com/goldfire/howler.js | — | נגינת אודיו cross-browser |
| **Astro + Starlight** | github.com/withastro/starlight | 8,000+ | פלטפורמת הקורסים הראשית |
| **Keystatic** | github.com/Thinkmill/keystatic | 1,900+ | עורך תוכן ויזואלי מבוסס Git |

### 🟡 חשוב (Phase 2)

| כלי | GitHub | תפקיד |
|-----|--------|--------|
| **peaks.js** (BBC) | github.com/bbc/peaks.js | עריכת Cue Points מתקדמת |
| **audioMotion-analyzer** | github.com/hvianna/audioMotion-analyzer | ספקטרום ו-EQ בזמן אמת |
| **realtime-bpm-analyzer** | github.com/dlepaux/realtime-bpm-analyzer | זיהוי BPM בזמן אמת |
| **webmidi.js** | github.com/djipco/webmidi | חיבור DDJ-FLX4 דרך Web MIDI |
| **LiaScript Exporter** | github.com/LiaScript/LiaScript-Exporter | ייצוא ל-SCORM 1.2/2004 |
| **H5P** | github.com/h5p | תרגילים אינטראקטיביים (drag & drop, timeline) |

### 🟢 שיפור (Phase 3)

| כלי | GitHub | תפקיד |
|-----|--------|--------|
| **Camelot-Wheel-Notation** | github.com/regorxxx/Camelot-Wheel-Notation | מערכת כללי מיקס הרמוני |
| **Beatmatcher** | github.com/codebox/beatmatcher | משחק אימון Beatmatching |
| **waveform-playlist** | — | עורך מולטי-טראק בדפדפן |
| **ClassroomIO** | github.com/classroomio/classroomio | LMS קל לניהול תלמידים |
| **Frappe LMS** | github.com/frappe/lms | LMS מלא (אם צריך) |

---

## 3. CI/CD Pipeline — ברמה מקצועית

### `.github/workflows/ci.yml`

```yaml
name: Content Validation & Build
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Validate JSON Schemas
        run: npx ajv-cli validate -s 01-courses/_schema/*.json -d '01-courses/**/*.json'

      - name: Lint YAML
        run: pip install yamllint && yamllint .

      - name: Lint Markdown
        run: npx markdownlint-cli2 '**/*.md'

      - name: Check Links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose '**/*.md'

      - name: Accessibility Check (HTML tools)
        run: npx axe-core-cli 02-tools/**/*.html --tags wcag2aa
```

### `.pre-commit-config.yaml`

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json

  - repo: https://github.com/igorshubovych/markdownlint-cli
    rev: v0.38.0
    hooks:
      - id: markdownlint

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        types_or: [markdown, yaml, json]

  - repo: https://github.com/adrienverge/yamllint
    rev: v1.35.1
    hooks:
      - id: yamllint
```

---

## 4. כלי DJ מקצועיים — מפת שילוב

### A. ויזואליזציית אודיו (שיעורי מיקס)

```
תלמיד טוען שיר
    ↓
howler.js מנגן את השיר
    ↓
wavesurfer.js מציג גלי קול עם Cue Points
    ↓
audioMotion-analyzer מציג ספקטרום בזמן אמת
    ↓
essentia.js מזהה BPM + סולם אוטומטית
    ↓
מידע מוצג על השיעור → תלמיד מתרגל
```

### B. Beatmatching Trainer (תרגול)

```
שני שירים נטענים → שני wavesurfer instances
    ↓
BPM מזוהה אוטומטית (essentia.js)
    ↓
תלמיד מתאים טמפו ידנית (slider / DDJ-FLX4)
    ↓
ציון בזמן אמת: כמה קרוב ל-sync
    ↓
gamification: XP + badge על הצלחה
```

### C. חיבור DDJ-FLX4 ישיר לדפדפן

```javascript
// Web MIDI API — חיבור ל-DDJ-FLX4
navigator.requestMIDIAccess().then(access => {
  const inputs = access.inputs;
  inputs.forEach(input => {
    input.onmidimessage = (msg) => {
      // Fader, knob, button events
      // Map to wavesurfer.js controls
    };
  });
});
```

**מקור MIDI Mapping**: github.com/mixxxdj/mixxx — Pioneer-DDJ-FLX4.midi.xml

### D. גלגל הרמוני אינטראקטיבי (משודרג)

הכלי הקיים ב-`02-tools/harmonic-wheel/` ישודרג עם:
- **Camelot-Wheel-Notation** — כללי מיקס אוטומטיים
- **essentia.js** — זיהוי סולם מקובץ אודיו
- **Drag & Drop** — גרירת שירים לגלגל

---

## 5. פלטפורמות LMS — השוואה

| פלטפורמה | סוג | שפה | כוכבים | מתאים ל-DJMaster? |
|-----------|------|-----|--------|---------------------|
| **Astro + Starlight** | Static site | TypeScript | 8K | ✅ הכי מתאים — מהיר, i18n, RTL |
| **LiaScript** | Markdown LMS | Elm | — | ✅ מצוין — SCORM export, quizzes in MD |
| **ClassroomIO** | Full LMS | TypeScript | 1.5K | 🟡 טוב לשלב 2 — ניהול תלמידים |
| **Frappe LMS** | Full LMS | Python | 2.6K | 🟡 אם צריך LMS מלא |
| **Canvas LMS** | Enterprise | Ruby | 6.5K | ❌ כבד מדי לפרויקט הזה |
| **Open edX** | Enterprise | Python | 4.2K | ❌ כבד מדי |

**המלצה**: **Astro + Starlight** כפלטפורמה ראשית + **LiaScript** לייצוא SCORM.

---

## 6. תמיכה בעברית (RTL)

### כללי CSS

```css
/* Base RTL */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Logical Properties (modern) */
.content {
  margin-inline-start: 1rem;  /* instead of margin-left */
  padding-inline-end: 1rem;   /* instead of padding-right */
}

/* Mixed content (Hebrew + English terms) */
.technical-term {
  direction: ltr;
  unicode-bidi: isolate;
}
```

### כלי i18n

- **Astro i18n** — built-in, מתאים מצוין
- **i18next** — אם צריך תרגום דינמי
- **Tolgee** (github.com/tolgee/tolgee-platform) — פלטפורמת תרגום collaborative

---

## 7. Gamification — מערכת XP ובאדג'ים

### מבנה נתונים

```json
{
  "student_id": "student-001",
  "xp": 1250,
  "level": 5,
  "badges": [
    { "id": "first-mix", "name": "מיקס ראשון", "earned_at": "2026-01-15" },
    { "id": "bpm-master", "name": "אלוף ה-BPM", "earned_at": "2026-02-20" }
  ],
  "progress": {
    "01-world-of-dj": { "completed": 3, "total": 3, "score": 92 },
    "02-flx4-equipment": { "completed": 1, "total": 3, "score": 0 }
  }
}
```

### כללי XP

| פעולה | XP |
|-------|-----|
| השלמת שיעור | +50 |
| תרגיל (ציון 70%+) | +100 |
| חידון מודול (ציון 80%+) | +200 |
| חידון סופי (ציון 75%+) | +500 |
| Beatmatch מושלם | +150 |
| שימוש ב-DDJ-FLX4 | +75 |

### באדג'ים

| באדג' | תנאי |
|-------|-------|
| 🎧 DJ מתחיל | השלמת קורס 01 |
| 🎚️ שולט בציוד | השלמת קורס 02 |
| 💻 אלוף Rekordbox | השלמת קורס 03 |
| 🎵 מבין מוזיקה | השלמת קורס 04 |
| 🔥 Beatmatch Pro | 10 beatmatches מושלמים |
| 👑 DJ Master | השלמת כל 5 הקורסים |

---

## 8. לוח זמנים מומלץ

### Phase 1 — MVP (4 שבועות)

- [ ] הקמת Astro + Starlight עם RTL
- [ ] מיגרציית כל התוכן ל-Content Collections
- [ ] שילוב wavesurfer.js + howler.js בשיעורים
- [ ] מנוע חידונים מ-JSON
- [ ] GitHub Actions CI pipeline
- [ ] Deploy ל-Vercel/Netlify

### Phase 2 — אינטראקטיביות (4 שבועות)

- [ ] Beatmatching Trainer עם essentia.js
- [ ] חיבור DDJ-FLX4 דרך Web MIDI
- [ ] שדרוג Harmonic Wheel עם Camelot-Wheel-Notation
- [ ] Keystatic CMS לעריכת תוכן
- [ ] מערכת XP ובאדג'ים

### Phase 3 — LMS מלא (4 שבועות)

- [ ] Supabase Auth + Progress tracking
- [ ] ייצוא SCORM עם LiaScript Exporter
- [ ] ClassroomIO או Frappe LMS לניהול תלמידים
- [ ] PDF generation מהקורסים
- [ ] אנליטיקס ודשבורד מדריך

---

## 9. מבנה תיקיות מומלץ (אחרי שדרוג)

```
djmaster-academy/
├── .github/workflows/ci.yml      # CI/CD pipeline
├── .pre-commit-config.yaml        # Pre-commit hooks
├── .editorconfig                  # Editor settings
├── .markdownlint.yaml             # MD lint rules
├── Makefile                       # Build automation
├── astro.config.mjs               # Astro configuration
├── package.json                   # Dependencies
│
├── src/                           # Astro source
│   ├── content/                   # Content Collections
│   │   ├── courses/               # Course content (from 01-courses)
│   │   └── config.ts              # Schema definitions
│   ├── components/                # React components
│   │   ├── QuizRenderer.tsx       # JSON quiz engine
│   │   ├── WaveformPlayer.tsx     # wavesurfer.js wrapper
│   │   ├── BeatmatchTrainer.tsx   # Beatmatching exercise
│   │   ├── HarmonicWheel.tsx      # Camelot wheel
│   │   └── ProgressTracker.tsx    # XP & badges
│   ├── layouts/                   # Page layouts (RTL)
│   └── pages/                     # Routes
│
├── 00-docs/                       # Project documentation
├── 01-courses/                    # Raw content (source of truth)
├── 02-tools/                      # Standalone HTML tools
├── 03-assets/                     # Static assets
├── 04-marketing/                  # Marketing content
├── 05-platform/                   # Platform docs
├── 06-business/                   # Business docs
│
├── scripts/                       # Build & validation scripts
│   ├── validate-schemas.js
│   ├── generate-api.js
│   ├── check-freshness.js
│   └── export-scorm.js
│
└── public/                        # Static files
    ├── audio/                     # Sample tracks
    └── images/                    # Course images
```

---

## 10. סיכום — מה עושה את הפרויקט הזה ברמה הגבוהה ביותר

1. **Content-as-Code** — תוכן ב-Git, ולידציה אוטומטית, סכמות מחמירות
2. **Audio-First** — wavesurfer.js + essentia.js + Tone.js = חוויית DJ אמיתית
3. **Hardware Integration** — DDJ-FLX4 ישירות בדפדפן דרך Web MIDI
4. **Professional CI/CD** — כל push עובר ולידציה, lint, link checking
5. **SCORM Ready** — ייצוא ל-Moodle/Canvas עם LiaScript Exporter
6. **Hebrew RTL Native** — Astro i18n + logical CSS properties
7. **Gamification** — XP, badges, levels מותאמים ל-DJ
8. **Scalable** — ממתחיל (Astro static) ועד enterprise (ClassroomIO/Frappe)
