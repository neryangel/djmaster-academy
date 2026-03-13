# DJMaster Academy — מחקר מעמיק v2

> מחקר שני, מעמיק יותר — ספריות קוד פתוח חדשות, CDN מדויקים, ודפוסי ארכיטקטורה מקצועיים.

---

## 1. ספריות חדשות שהתגלו במחקר

### 🔴 השפעה גבוהה — לשילוב מיידי

#### A. audioMotion-analyzer (ספקטרום מקצועי)
- **GitHub**: github.com/hvianna/audioMotion-analyzer
- **גרסה**: v4.x (חשוב לנעול ל-@4 ב-CDN)
- **גודל**: ~30KB minified, אפס תלויות
- **CDN ESM**:
  ```html
  <script type="module">
  import AudioMotionAnalyzer from 'https://cdn.jsdelivr.net/npm/audiomotion-analyzer@4/+esm';
  </script>
  ```
- **יכולות**:
  - ספקטרום בזמן אמת עם 240 רצועות תדר
  - סקלות: logarithmic, linear, Bark, Mel
  - פילטרים: A, B, C, D, ITU-R 468 weighting
  - אפקטים: LED bars, luminance, mirroring, radial
  - Dual-channel (L/R) visualization
- **למה עדיף על Canvas ידני**: הספקטרום ב-EQ Trainer שלנו משתמש ב-canvas ידני עם ~50 שורות קוד. audioMotion-analyzer נותן תוצאה מקצועית יותר ב-3 שורות.

#### B. Meyda.js (חילוץ פיצ'רים מאודיו)
- **GitHub**: github.com/meyda/meyda
- **CDN**: `https://unpkg.com/meyda/dist/web/meyda.min.js`
- **יכולות**: spectral centroid (brightness), loudness, MFCC, spectral flatness, rolloff, flux
- **רלוונטיות**: משלים את Tone.js — Tone.js לסינתזה ואפקטים, Meyda לניתוח מתקדם של צליל
- **ביצועים**: 288 ops/sec, 3.34x real-time

#### C. realtime-bpm-analyzer (זיהוי BPM בזמן אמת)
- **GitHub**: github.com/dlepaux/realtime-bpm-analyzer
- **גרסה**: 5.0.1 (עודכן לפני חודש!)
- **CDN**: `https://cdn.jsdelivr.net/npm/realtime-bpm-analyzer@5/+esm`
- **יכולות**:
  - זיהוי BPM מ-audio/video elements, מיקרופון, streams
  - טווח: 60-220 BPM (מתכוונן)
  - אפס תלויות — Web Audio API בלבד
  - TypeScript native
- **למה חשוב**: ה-BPM Calculator שלנו משתמש ב-tap detection ידני. ספרייה זו יכולה לזהות BPM אוטומטית מקובץ אודיו!

#### D. Camelot-Wheel-Notation (כללי מיקס הרמוני)
- **GitHub**: github.com/regorxxx/Camelot-Wheel-Notation
- **שימוש**: קובץ JS יחיד, import ישיר
- **9 כללי מיקס**:
  1. Perfect Match (nX → nX)
  2. Energy Boost (nX → n+1X) — עולה חמישית
  3. Energy Drop (nX → n-1X) — יורד חמישית
  4. Energy Switch (nA → nB) — מינור ↔ מז'ור יחסי
  5. Mood Boost (nA → n+3B)
  6. Mood Drop (nX → n-3B)
  7. Dom Key, Sub Dom Key
  8. Energy Raise (±2, ±7)
  9. createHarmonicMixingPattern() — יצירת תבניות אוטומטיות
- **3 סימנים**: Standard (G#m), Camelot (1A), Open Key (6m)
- **למה חשוב**: ה-Harmonic Wheel שלנו (1312 שורות) מממש כללים ידנית. הספרייה הזו מחליפה מאות שורות קוד.

### 🟡 השפעה בינונית — Phase 2

#### E. essentia.js (ניתוח אודיו WebAssembly)
- **GitHub**: github.com/MTG/essentia.js
- **CDN** (WASM backend):
  ```html
  <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.1/dist/essentia-wasm.web.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.1/dist/essentia.js-core.js"></script>
  ```
- **יכולות**:
  - BPM detection: `essentia.PercivalBpmEstimator(data).bpm`
  - Key detection: `essentia.KeyExtractor(data).key + data.scale`
  - Beat positions, chords, chroma, MFCC
  - WebAssembly — ביצועים כמעט כמו C++
- **אזהרה**: WASM file ~2MB, צריך loading strategy חכמה

#### F. wavesurfer.js v7 (שדרוג)
- **שינויים ב-v7**:
  - TypeScript rewrite מלא
  - Shadow DOM isolation
  - HTML audio playback כברירת מחדל
  - Regions plugin חדש (מחליף markers)
  - Record plugin חדש (מחליף microphone)
- **CDN**:
  ```html
  <script type="module">
  import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';
  import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js';
  </script>
  ```
- **למה חשוב**: ה-Beatmatch Trainer שלנו משתמש ב-wavesurfer — צריך לשדרג ל-v7 API

#### G. webmidi.js v3 (חיבור DDJ-FLX4)
- **GitHub**: github.com/djipco/webmidi
- **אתר**: webmidijs.org
- **גרסה**: 3.1.14
- **CDN**: `https://cdn.jsdelivr.net/npm/webmidi@3/dist/esm/webmidi.esm.min.js`
- **Pioneer DDJ-FLX4 MIDI Map**:
  - מפת MIDI רשמית: pioneerdj.com MIDI message list PDF
  - Mixxx mapping: github.com/mixxxdj/mixxx — Pioneer-DDJ-FLX4.midi.xml
  - USB Class Compliant — עובד ללא דרייברים
- **קוד דוגמה**:
  ```javascript
  import { WebMidi } from 'webmidi';
  await WebMidi.enable();
  const flx4 = WebMidi.getInputByName('DDJ-FLX4');
  flx4.addListener('controlchange', e => {
    console.log(e.controller.number, e.value); // CC number + value
  });
  ```

#### H. peaks.js (BBC — עריכת Cue Points)
- **GitHub**: github.com/bbc/peaks.js (פיתוח עבר ל-Codeberg)
- **יכולות**: zoom, scroll, point markers, segment markers, cue events
- **CDN**: `https://unpkg.com/peaks.js@3/dist/peaks.esm.js`
- **Cue Events**: `peaks.on('points.enter', callback)` — אירוע כשהנגינה מגיעה ל-cue point

### 🟢 השפעה נמוכה — Phase 3

#### I. dsssp (React EQ Visualization)
- **GitHub**: github.com/NumberOneBot/dsssp
- **תיאור**: React component library לויזואליזציית פילטרים ו-EQ
- **רלוונטיות**: אם נעבור ל-Astro+React, אפשר להשתמש בזה ל-EQ Trainer

#### J. JZZ (MIDI מתקדם)
- **GitHub**: github.com/jazz-soft/JZZ
- **יכולות**: Cross-platform MIDI, Node.js + Browser, SysEx support
- **אלטרנטיבה ל**: webmidi.js — יותר low-level

#### K. howler.js (נגינת אודיו)
- **GitHub**: github.com/goldfire/howler.js — 25K ⭐
- **גודל**: 7KB
- **יכולות**: sprites, auto-caching, HTML5 Audio fallback, spatial audio
- **מתי להשתמש**: כשצריך רק playback פשוט (לא סינתזה)
- **vs Tone.js**: howler.js ל-playback, Tone.js ל-synthesis/effects

---

## 2. מפת שדרוגים לכלים קיימים

### BPM Calculator (984 שורות)
| מה יש | מה צריך | ספרייה |
|--------|---------|--------|
| Tap detection ידני | + זיהוי BPM אוטומטי מאודיו | **realtime-bpm-analyzer** |
| MetalSynth click (Tone.js) | ✅ טוב | — |
| ספקטרום אין | + ספקטרום בזמן אמת | **audioMotion-analyzer** |
| מטרונום בסיסי | ✅ טוב | — |

### EQ Trainer (1226 שורות)
| מה יש | מה צריך | ספרייה |
|--------|---------|--------|
| Canvas ספקטרום ידני | שדרוג ל-ספקטרום מקצועי | **audioMotion-analyzer** |
| Tone.Analyser FFT | + Meyda spectral features | **Meyda.js** |
| Pink noise בלבד | + אפשרות לטעון שיר אמיתי | **howler.js** |
| 12 תדרים | ✅ מקיף | — |

### Beatmatch Trainer (745 שורות)
| מה יש | מה צריך | ספרייה |
|--------|---------|--------|
| wavesurfer.js (גרסה ישנה?) | שדרוג ל-v7 + Regions | **wavesurfer.js v7** |
| BPM ידני | + זיהוי BPM אוטומטי | **essentia.js** |
| Tone.js effects | ✅ טוב | — |
| אין MIDI | + תמיכה ב-DDJ-FLX4 | **webmidi.js v3** |

### Harmonic Wheel (1312 שורות)
| מה יש | מה צריך | ספרייה |
|--------|---------|--------|
| כללי מיקס ידניים | החלפה בספרייה מלאה | **Camelot-Wheel-Notation** |
| Camelot בלבד | + Open Key + Standard | **Camelot-Wheel-Notation** |
| אין ניתוח אודיו | + זיהוי סולם מקובץ | **essentia.js** |
| אין drag & drop | + גרירת שירים | HTML5 DnD API |

### Set Planner (1333 שורות)
| מה יש | מה צריך | ספרייה |
|--------|---------|--------|
| תכנון ידני | + ניתוח אוטומטי של שירים | **essentia.js** |
| אין waveforms | + תצוגת waveform לכל שיר | **peaks.js** |
| אין harmonic flow | + בדיקת תאימות הרמונית | **Camelot-Wheel-Notation** |

---

## 3. SRI Hashes — אבטחת CDN

### כלי ליצירת SRI
```bash
# יצירת hash מקובץ CDN
curl -s https://cdn.jsdelivr.net/npm/audiomotion-analyzer@4/dist/audiomotion-analyzer.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A

# או דרך srihash.org
```

### תבנית script tag עם SRI
```html
<script src="https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.min.js"
        integrity="sha384-XXXX..."
        crossorigin="anonymous"
        defer></script>
```

### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com;
               style-src 'self' 'unsafe-inline';
               media-src 'self' blob:;
               worker-src 'self' blob:;">
```

---

## 4. ארכיטקטורת Audio Pipeline מקצועית

### Pipeline מומלץ לכל כלי
```
User Action (tap / upload / MIDI)
    ↓
[howler.js] — Playback engine (cross-browser, sprites)
    ↓
[Web Audio API] — AudioContext, nodes, routing
    ├→ [Tone.js] — Effects (EQ, filter, reverb, delay)
    ├→ [essentia.js] — Analysis (BPM, key, beats) via WASM
    ├→ [Meyda.js] — Features (centroid, loudness, MFCC)
    ├→ [realtime-bpm-analyzer] — Live BPM tracking
    └→ [audioMotion-analyzer] — Spectrum visualization
    ↓
[wavesurfer.js v7] — Waveform display + regions
    ↓
[peaks.js] — Cue point editing (advanced)
    ↓
[Camelot-Wheel-Notation] — Harmonic analysis
    ↓
[webmidi.js v3] — DDJ-FLX4 hardware control
```

### Loading Strategy — Progressive Enhancement
```html
<!-- Phase 1: Core (sync, small) -->
<script defer src="tone.min.js" crossorigin="anonymous"></script>

<!-- Phase 2: Visualization (async, medium) -->
<script type="module">
  // Dynamic import — loads only when needed
  const { default: AudioMotion } = await import('audiomotion-analyzer@4/+esm');
</script>

<!-- Phase 3: Analysis (lazy, large WASM) -->
<script type="module">
  // Load essentia.js only when user uploads audio
  async function loadEssentia() {
    const module = await import('essentia.js/dist/essentia-wasm.web.js');
    const essentia = new module.Essentia(module.EssentiaWASM);
    return essentia;
  }
</script>
```

---

## 5. דפוסים מ-Mixxx (DJ קוד פתוח מוביל)

### MIDI Mapping Architecture
Mixxx (13K+ ⭐) משתמש ב-JavaScript ES7 ל-MIDI mappings:
- **Components.js** — ספרייה שממפה MIDI CC → פעולות DJ
- **Pioneer-DDJ-FLX4.midi.xml** — מפת CC מלאה ל-FLX4
- **דפוס**: כל כפתור/נוב/פיידר = Component object עם `input()` ו-`output()`

### מה ללמוד מ-Mixxx:
1. **MIDI CC Numbers** ל-DDJ-FLX4 (מתוך ה-XML)
2. **Jog wheel handling** — velocity-sensitive scratching
3. **Effect chain routing** — איך לחבר FX ב-chain
4. **Beat grid alignment** — אלגוריתם יישור ביטים

---

## 6. Ableton Learning Music — דפוסי חינוך מוזיקלי

### מה עושה learningmusic.ableton.com נכון:
1. **Progressive disclosure** — כל שלב חושף קונספט אחד
2. **Instant feedback** — שומעים מיד מה שינוי עושה
3. **No prerequisites** — לא צריך ידע מוקדם
4. **Visual + Audio** — תמיד רואים + שומעים ביחד

### מה לאמץ ב-DJMaster:
- כל כלי מתחיל במצב "beginner" עם הסברים
- אינטראקציה מיידית — לחיצה = שמיעה
- ויזואליזציה תמיד מסונכרנת עם האודיו
- Gamification כמוטיבציה, לא כמטרה

---

## 7. סדר עדיפויות לשדרוג

### 🔴 עכשיו (השפעה מקסימלית, מאמץ נמוך)

1. **audioMotion-analyzer → EQ Trainer** — מחליף canvas ידני ב-3 שורות
2. **Camelot-Wheel-Notation → Harmonic Wheel** — מחליף מאות שורות כללים ידניים
3. **realtime-bpm-analyzer → BPM Calculator** — מוסיף זיהוי אוטומטי מאודיו

### 🟡 בקרוב (השפעה גבוהה, מאמץ בינוני)

4. **wavesurfer.js v7 → Beatmatch Trainer** — שדרוג ל-API חדש + Regions
5. **webmidi.js v3 → כל הכלים** — תמיכה ב-DDJ-FLX4
6. **Meyda.js → EQ Trainer** — spectral features לפידבק מתקדם

### 🟢 Phase 2 (השפעה בינונית, מאמץ גבוה)

7. **essentia.js → BPM + Harmonic Wheel + Set Planner** — WASM analysis
8. **peaks.js → Set Planner** — cue points ו-waveform editing
9. **howler.js → כל הכלים** — unified playback engine

---

## 8. CDN Summary — כתובות מדויקות

| ספרייה | CDN URL | סוג |
|--------|---------|-----|
| Tone.js 14.8.49 | `cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js` | UMD |
| audioMotion v4 | `cdn.jsdelivr.net/npm/audiomotion-analyzer@4/+esm` | ESM |
| wavesurfer.js v7 | `unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js` | ESM |
| wavesurfer Regions | `unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js` | ESM |
| realtime-bpm-analyzer v5 | `cdn.jsdelivr.net/npm/realtime-bpm-analyzer@5/+esm` | ESM |
| essentia.js WASM | `cdn.jsdelivr.net/npm/essentia.js@0.1.1/dist/essentia-wasm.web.js` | Script |
| essentia.js Core | `cdn.jsdelivr.net/npm/essentia.js@0.1.1/dist/essentia.js-core.js` | Script |
| webmidi.js v3 | `cdn.jsdelivr.net/npm/webmidi@3/dist/esm/webmidi.esm.min.js` | ESM |
| Meyda.js | `unpkg.com/meyda/dist/web/meyda.min.js` | UMD |
| peaks.js v3 | `unpkg.com/peaks.js@3/dist/peaks.esm.js` | ESM |
| howler.js | `cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js` | UMD |

---

*מסמך זה מבוסס על מחקר של 20+ ספריות קוד פתוח, ניתוח ארכיטקטורת Mixxx, ודפוסי חינוך מוזיקלי מ-Ableton.*
