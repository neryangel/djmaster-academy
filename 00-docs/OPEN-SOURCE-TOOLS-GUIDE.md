# 🔧 מדריך כלי קוד פתוח — DJMaster Academy

> מחקר מקיף של כלים וספריות קוד פתוח לפלטפורמת לימוד DJ מקצועית

## סיכום מהיר

| קטגוריה | כלים שנמצאו | מומלץ ראשי |
|---------|-------------|------------|
| אודיו ו-DJ | 25+ | Tone.js, wavesurfer.js |
| תיאוריה מוזיקלית | 8+ | Tonal, Camelot-Wheel-Notation |
| MIDI | 6+ | WEBMIDI.js |
| ויזואליזציה | 12+ | audioMotion-analyzer, Wave.js |
| UI קומפוננטות (נובים, פיידרים) | 8+ | input-knob, react-dial-knob |
| גיימיפיקציה | 6+ | ts-fsrs, canvas-confetti |
| קוויזים ולמידה | 8+ | react-quiz-component, ts-fsrs |
| אנימציות וחגיגות | 6+ | canvas-confetti, lottie-react |
| PWA ו-Offline | 5+ | @vite-pwa/astro |
| ביצועים | 5+ | web-vitals, vite-bundle-analyzer |
| Drag & Drop | 5+ | @dnd-kit |
| RTL / עברית / i18n | 6+ | RTLCSS, astro-i18n |
| AI/ML למוזיקה | 5+ | Magenta.js, essentia.js |
| גרפים ותרשימים | 4+ | lightweight-charts, react-circular-progressbar |

---

## 🎵 קטגוריה 1: אודיו וספריות DJ

### Essential (חובה)

#### Tone.js ⭐⭐⭐
- **Repo:** Tonejs/Tone.js
- **Stars:** ~14,000
- **License:** MIT
- **npm:** `tone`
- **תיאור:** Web Audio framework מקצועי ליצירת מוזיקה אינטראקטיבית. כולל סינתסייזרים, אפקטים, scheduler, ו-transport.
- **שימוש בפרויקט:** בסיס למנוע האודיו, סינתזה, אפקטים, ו-beatmatch trainer.

#### wavesurfer.js ⭐⭐⭐
- **Repo:** katspaugh/wavesurfer.js
- **Stars:** ~8,500
- **License:** BSD 3-Clause
- **npm:** `wavesurfer.js`
- **תיאור:** ויזואליזציית waveform אינטראקטיבית עם Canvas. כולל plugins ל-regions, timeline, spectrogram.
- **שימוש בפרויקט:** תצוגת waveform, ניווט בשירים, cue points.

#### Howler.js ⭐⭐⭐
- **Repo:** goldfire/howler.js
- **Stars:** ~23,000
- **License:** MIT
- **npm:** `howler`
- **תיאור:** ספריית אודיו אמינה עם fallback ל-HTML5. שליטה מלאה: fading, rate, seek, volume.
- **שימוש בפרויקט:** השמעת אודיו אמינה cross-browser.

### BPM Detection

#### web-audio-beat-detector ⭐⭐
- **Repo:** chrisguttandin/web-audio-beat-detector
- **Stars:** ~1,000
- **License:** MIT
- **npm:** `web-audio-beat-detector`
- **תיאור:** זיהוי BPM אוטומטי באמצעות Web Audio API. אופטימלי למוזיקה אלקטרונית.
- **שימוש בפרויקט:** זיהוי קצב אוטומטי במחשבון BPM.

#### realtime-bpm-analyzer ⭐⭐
- **Repo:** dlepaux/realtime-bpm-analyzer
- **Stars:** ~700
- **License:** MIT
- **npm:** `realtime-bpm-analyzer`
- **תיאור:** TypeScript, ניתוח BPM בזמן אמת ממיקרופון וקבצים.
- **שימוש בפרויקט:** ניתוח BPM חי בזמן נגינה.

#### bpm-detective ⭐
- **Repo:** tornqvist/bpm-detective
- **Stars:** ~1,200
- **License:** MIT
- **npm:** `bpm-detective`
- **שימוש בפרויקט:** אלטרנטיבה לזיהוי BPM.

#### music-tempo ⭐
- **Repo:** killercrush/music-tempo
- **Stars:** ~200
- **License:** MIT
- **npm:** `music-tempo`
- **תיאור:** אלגוריתם "Beatroot" לעקיבת beats.

### Audio Analysis

#### essentia.js ⭐⭐⭐
- **Repo:** MTG/essentia.js
- **Stars:** ~1,200
- **License:** AGPL-3.0 ⚠️
- **npm:** `essentia.js`
- **תיאור:** ספרייה מקצועית לניתוח אודיו מבוססת WebAssembly. כוללת מודלי ML מאומנים.
- **שימוש בפרויקט:** ניתוח אודיו מתקדם (timbre, spectral, key detection).
- **⚠️ אזהרה:** רישיון AGPL — דורש שחרור קוד מקור.

#### meyda ⭐⭐
- **Repo:** meyda/meyda
- **Stars:** ~1,500
- **License:** MIT ✅
- **npm:** `meyda`
- **תיאור:** חילוץ features מאודיו (spectral centroid, MFCC, ZCR). real-time ו-offline.
- **שימוש בפרויקט:** ניתוח audio features למודול אימון EQ.

#### Pizzicato.js ⭐⭐
- **Repo:** alemangui/Pizzicato
- **Stars:** ~2,000
- **License:** MIT
- **npm:** `pizzicato`
- **תיאור:** ממשק פשוט ליצירה ועיבוד צלילים עם אפקטים מובנים.
- **שימוש בפרויקט:** הדגמת אפקטים בשיעורים.

### Pitch Detection

#### pitchfinder ⭐⭐
- **Repo:** peterkhayes/pitchfinder
- **Stars:** ~1,000
- **License:** MIT
- **npm:** `pitchfinder`
- **תיאור:** מספר אלגוריתמים לזיהוי תדר (YIN, McLeod, AMDF, Dynamic Wavelet).

#### pitchy ⭐
- **Repo:** ianprime0509/pitchy
- **Stars:** ~900
- **License:** MIT
- **npm:** `pitchy`
- **תיאור:** זיהוי תדר בזמן אמת, אידיאלי לטיונר.

### Waveform Libraries

#### peaks.js ⭐⭐
- **Repo:** bbc/peaks.js
- **Stars:** ~3,500
- **License:** LGPL-3.0 ⚠️
- **npm:** `peaks.js`
- **תיאור:** קומפוננטת waveform מ-BBC עם zoom, scroll, ו-annotations.

#### waveform-playlist ⭐⭐
- **Repo:** naomiaro/waveform-playlist
- **Stars:** ~2,500
- **License:** MIT
- **npm:** `waveform-playlist`
- **תיאור:** עורך אודיו multitrack עם waveform, cues, fades, ואפקטים.

#### waveform-data.js ⭐
- **Repo:** bbc/waveform-data.js
- **Stars:** ~1,500
- **License:** LGPL-3.0
- **npm:** `waveform-data`

---

## 🎼 קטגוריה 2: תיאוריה מוזיקלית

#### Tonal ⭐⭐⭐
- **Repo:** tonaljs/tonal
- **Stars:** ~3,500
- **License:** MIT
- **npm:** `@tonaljs/tonal`
- **תיאור:** ספרייה מקיפה לתיאוריה מוזיקלית ב-TypeScript. Notes, intervals, chords, scales, modes, keys.
- **שימוש בפרויקט:** בסיס חישובי תיאוריה מוזיקלית, זיהוי אקורדים, תאימות הרמונית.

#### Camelot-Wheel-Notation ⭐⭐⭐
- **Repo:** regorxxx/Camelot-Wheel-Notation
- **Stars:** ~400
- **License:** MIT
- **npm:** `camelot-wheel-notation`
- **תיאור:** מימוש JavaScript של גלגל Camelot עם חוקי מיקס הרמוני ותרגום מפתחות.
- **שימוש בפרויקט:** בסיס לגלגל ההרמוני ולהמלצות מעברים.

#### Teoria.js ⭐⭐
- **Repo:** saebekassebil/teoria
- **Stars:** ~2,200
- **License:** MIT
- **npm:** `teoria`
- **תיאור:** ספריית תיאוריה מוזיקלית קלת משקל (Jazz ו-Classical).

#### webKeyFinder ⭐
- **Repo:** dogayuksel/webKeyFinder
- **Stars:** ~200
- **License:** MIT
- **תיאור:** זיהוי מפתח מוזיקלי בדפדפן באמצעות AudioWorklet ו-WebAssembly.

---

## 🎹 קטגוריה 3: MIDI

#### WEBMIDI.js ⭐⭐⭐
- **Repo:** djipco/webmidi
- **Stars:** ~1,400
- **License:** MIT
- **npm:** `webmidi`
- **תיאור:** ממשק ידידותי ל-Web MIDI API. שליחה וקבלת הודעות MIDI בקלות. פונקציות כמו playNote, sendPitchBend.
- **שימוש בפרויקט:** חיבור DDJ-FLX4, מיפוי כפתורים, LED feedback.

#### JZZ.js ⭐⭐
- **Repo:** jazz-soft/JZZ
- **Stars:** ~1,000
- **License:** MIT
- **npm:** `jzz`
- **תיאור:** תמיכה cross-browser ב-MIDI כולל fallback לדפדפנים ישנים.

#### MIDI.js ⭐
- **Repo:** mudcube/MIDI.js
- **Stars:** ~4,500
- **License:** MIT
- **npm:** `midi.js`
- **תיאור:** MIDI playback עם soundfonts ותזמון מדויק.

#### MidiWriterJS ⭐
- **Repo:** grimmdude/MidiWriterJS
- **Stars:** ~1,200
- **License:** MIT
- **npm:** `midi-writer-js`
- **תיאור:** יצירת קבצי MIDI פרוגרמטית.

---

## 📊 קטגוריה 4: ויזואליזציית אודיו

#### audioMotion-analyzer ⭐⭐⭐
- **Repo:** Gomezy/audioMotion-analyzer
- **Stars:** ~1,500
- **License:** MIT
- **npm:** `audiomotion-analyzer`
- **תיאור:** ויזואליזציית spectrum בזמן אמת ברזולוציה גבוהה. ללא תלויות חיצוניות.
- **שימוש בפרויקט:** אנלייזר תדרים למודול אימון EQ.

#### Wave.js ⭐⭐
- **Repo:** foobar404/Wave.js
- **Stars:** ~2,400
- **License:** Apache 2.0
- **npm:** `wave.js`
- **תיאור:** ויזואליזציות אודיו דינמיות המגיבות לשירים או סטרימים.

#### r3f-audio-visualizer ⭐⭐
- **Repo:** dcyoung/r3f-audio-visualizer
- **Stars:** ~1,200
- **License:** MIT
- **תיאור:** ויזואליזציית אודיו 3D עם React Three Fiber.
- **שימוש בפרויקט:** ויזואליזציות מתקדמות לדפי נחיתה.

#### react-audio-visualizer-pro ⭐
- **Repo:** SujalXplores/react-audio-visualizer-pro
- **Stars:** ~300
- **License:** MIT
- **npm:** `react-audio-visualizer-pro`
- **תיאור:** React component עם TypeScript לויזואליזציית אודיו.

---

## 🎛️ קטגוריה 5: UI קומפוננטות DJ

#### input-knob (Google Chrome Labs) ⭐⭐⭐
- **Repo:** GoogleChromeLabs/input-knob
- **Stars:** ~1,800
- **License:** Apache 2.0
- **תיאור:** Web Component לנוב מסתובב, רגיש למגע. עובד כמו `<input type="range">`.
- **שימוש בפרויקט:** נובי EQ, Filter, Volume בממשק מיקסר.

#### react-dial-knob ⭐⭐
- **Repo:** pavelkukov/react-dial-knob
- **Stars:** ~420
- **License:** MIT
- **npm:** `react-dial-knob`
- **תיאור:** נוב React עם תמיכה במקלדת, עכבר, ומגע.

#### volume-meter ⭐⭐
- **Repo:** cwilso/volume-meter
- **Stars:** ~1,200
- **License:** Apache 2.0
- **תיאור:** VU meter עם זיהוי clipping באמצעות Web Audio API.

#### dj-react ⭐⭐
- **Repo:** mikeymaio/dj-react
- **Stars:** ~500
- **License:** MIT
- **תיאור:** מיקסר DJ שלם ב-React. קוד ייחוס מעולה.

#### circular-slider ⭐
- **Repo:** volkmaster/circular-slider
- **Stars:** ~280
- **License:** MIT
- **תיאור:** סליידר מעגלי SVG. מצוין ל-jog wheel.

---

## 🏆 קטגוריה 6: גיימיפיקציה ואנימציות

#### canvas-confetti ⭐⭐⭐
- **Repo:** catdad/canvas-confetti
- **Stars:** ~7,000
- **License:** ISC
- **npm:** `canvas-confetti`
- **תיאור:** אנימציית קונפטי ביצועית על Canvas. ~15KB.
- **שימוש בפרויקט:** חגיגת סיום קוויז, השגת badge, level up.

#### lottie-react ⭐⭐
- **Repo:** Gamote/lottie-react
- **Stars:** ~1,500
- **License:** MIT
- **npm:** `lottie-react`
- **תיאור:** אנימציות Lottie ב-React. קלת משקל.
- **שימוש בפרויקט:** אנימציות מרשימות להישגים ואבני דרך.

#### ts-fsrs ⭐⭐⭐
- **Repo:** open-spaced-repetition/ts-fsrs
- **Stars:** ~700
- **License:** MIT
- **npm:** `ts-fsrs`
- **תיאור:** מימוש TypeScript של אלגוריתם FSRS ל-Spaced Repetition.
- **שימוש בפרויקט:** תזמון חכם של חזרה על חומר לימוד וקוויזים.

#### react-joyride ⭐⭐
- **Repo:** gilbarbara/react-joyride
- **Stars:** ~3,000
- **License:** MIT
- **npm:** `react-joyride`
- **תיאור:** סיורים מודרכים באפליקציות React.
- **שימוש בפרויקט:** Onboarding חדש למשתמשים חדשים.

#### react-step-progress-bar ⭐
- **Repo:** pierreericgarcia/react-step-progress-bar
- **Stars:** ~350
- **License:** MIT
- **npm:** `react-step-progress-bar`

---

## 📝 קטגוריה 7: קוויזים ולמידה

#### react-quiz-component ⭐⭐
- **Repo:** wingkwong/react-quiz-component
- **Stars:** ~650
- **License:** MIT
- **npm:** `react-quiz-component`
- **תיאור:** קומפוננטת קוויז React עם JSON input, מספר סוגי תשובות, ותגובה מיידית.

#### MDX ⭐⭐⭐
- **Repo:** mdx-js/mdx
- **Stars:** ~15,000
- **License:** MIT
- **npm:** `@mdx-js/mdx`, `@mdx-js/react`
- **תיאור:** Markdown עם JSX. קומפוננטות React בתוך תוכן.
- **שימוש בפרויקט:** תוכן קורסים אינטראקטיבי עם קומפוננטות מוטמעות.

---

## 🔌 קטגוריה 8: PWA ו-Offline

#### @vite-pwa/astro ⭐⭐⭐
- **Repo:** vite-pwa/astro
- **Stars:** ~950
- **License:** MIT
- **npm:** `@vite-pwa/astro`
- **תיאור:** שילוב PWA ב-Astro ללא הגדרות. Workbox, manifest אוטומטי.
- **שימוש בפרויקט:** תמיכה offline, התקנה כאפליקציה, cache אודיו.

---

## ⚡ קטגוריה 9: ביצועים

#### web-vitals ⭐⭐⭐
- **Repo:** GoogleChrome/web-vitals
- **Stars:** ~8,100
- **License:** Apache 2.0
- **npm:** `web-vitals`
- **תיאור:** ספרייה רשמית של Google למדידת Core Web Vitals. ~2KB.

#### vite-bundle-analyzer ⭐⭐
- **Repo:** nonzzz/vite-bundle-analyzer
- **Stars:** ~1,800
- **License:** MIT
- **npm:** `vite-bundle-analyzer`

---

## 🔀 קטגוריה 10: Drag & Drop

#### @dnd-kit ⭐⭐⭐
- **Repo:** clauderic/dnd-kit
- **Stars:** ~9,200
- **License:** MIT
- **npm:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **תיאור:** Drag & Drop מודרני ונגיש ל-React. Sortable preset מושלם לרשימות.
- **שימוש בפרויקט:** סידור שירים ב-Set Planner, ארגון תוכן.

#### react-dropzone ⭐⭐
- **Repo:** react-dropzone/react-dropzone
- **Stars:** ~6,800
- **License:** MIT
- **npm:** `react-dropzone`
- **תיאור:** אזור גרירת קבצים HTML5 ל-React.
- **שימוש בפרויקט:** העלאת קבצי אודיו לניתוח.

---

## 🌐 קטגוריה 11: RTL / עברית / i18n

#### RTLCSS ⭐⭐⭐
- **Repo:** MohammadYounes/rtlcss
- **Stars:** ~3,000
- **License:** MIT
- **npm:** `rtlcss`
- **תיאור:** המרה אוטומטית של CSS מ-LTR ל-RTL.

#### astro-i18n ⭐⭐
- **Repo:** Alexandre-Fernandez/astro-i18n
- **Stars:** ~200
- **License:** MIT
- **npm:** `astro-i18n`
- **תיאור:** i18n עם TypeScript ל-Astro.

#### react-with-direction (Airbnb) ⭐⭐
- **Repo:** airbnb/react-with-direction
- **Stars:** ~600
- **License:** MIT
- **npm:** `react-with-direction`
- **תיאור:** תמיכה RTL/LTR מ-Airbnb ל-React.

---

## 🤖 קטגוריה 12: AI/ML למוזיקה

#### Magenta.js ⭐⭐⭐
- **Repo:** magenta/magenta-js
- **Stars:** ~2,100
- **License:** Apache 2.0
- **npm:** `@magenta/music`
- **תיאור:** מודלי AI של Google ליצירת מוזיקה בדפדפן (MusicVAE, MelodyRNN, DrumsRNN).
- **שימוש בפרויקט:** יצירת לופים אוטומטית, הדגמת AI במוזיקה.

---

## 📈 קטגוריה 13: גרפים ותרשימים

#### lightweight-charts (TradingView) ⭐⭐⭐
- **Repo:** tradingview/lightweight-charts
- **Stars:** ~9,500
- **License:** Apache 2.0
- **npm:** `lightweight-charts`
- **תיאור:** גרפים ביצועיים עם Canvas. ~15KB בלבד.
- **שימוש בפרויקט:** גרפי BPM, עקומת אנרגיה, סטטיסטיקות תרגול.

#### react-circular-progressbar ⭐⭐⭐
- **Repo:** kevinsqi/react-circular-progressbar
- **Stars:** ~3,200
- **License:** MIT
- **npm:** `react-circular-progressbar`
- **תיאור:** Progress bar מעגלי SVG, מותאם אישית.
- **שימוש בפרויקט:** התקדמות קורס, רמת מיומנות, XP.

---

## 📋 רשימות Awesome

- **awesome-webaudio** — notthetup/awesome-webaudio — אוסף כלי Web Audio
- **awesome-audio-visualization** — willianjusten/awesome-audio-visualization — ויזואליזציות אודיו
- **awesome-javascript-audio** — sc0ttj/awesome-javascript-audio — כלי אודיו JS

---

## 🎯 המלצות לפי שלב פיתוח

### שלב 1: MVP (שבועות 1-4)
| כלי | npm | סיבה |
|-----|-----|------|
| Tone.js | `tone` | סינתזה ואפקטים |
| wavesurfer.js | `wavesurfer.js` | תצוגת waveform |
| WEBMIDI.js | `webmidi` | חיבור DDJ-FLX4 |
| Tonal | `@tonaljs/tonal` | תיאוריה מוזיקלית |
| canvas-confetti | `canvas-confetti` | חגיגות |
| @dnd-kit | `@dnd-kit/core` | גרירה ושחרור |

### שלב 2: שיפורים (שבועות 5-8)
| כלי | npm | סיבה |
|-----|-----|------|
| meyda | `meyda` | ניתוח תדרים |
| web-audio-beat-detector | `web-audio-beat-detector` | זיהוי BPM אוטומטי |
| ts-fsrs | `ts-fsrs` | חזרה מרווחת |
| react-joyride | `react-joyride` | Onboarding |
| @vite-pwa/astro | `@vite-pwa/astro` | PWA |
| web-vitals | `web-vitals` | ביצועים |

### שלב 3: מתקדם (שבועות 9-12)
| כלי | npm | סיבה |
|-----|-----|------|
| Magenta.js | `@magenta/music` | AI מוזיקלי |
| audioMotion-analyzer | `audiomotion-analyzer` | אנלייזר spectrum |
| react-circular-progressbar | `react-circular-progressbar` | ויזואליזציית התקדמות |
| pitchfinder | `pitchfinder` | זיהוי תדר |
| react-dropzone | `react-dropzone` | העלאת קבצים |

---

## ⚠️ אזהרות רישוי

| כלי | רישיון | סיכון |
|-----|--------|-------|
| essentia.js | AGPL-3.0 | **גבוה** — דורש שחרור כל הקוד |
| peaks.js | LGPL-3.0 | **בינוני** — יש להפריד כ-module |
| waveform-data.js | LGPL-3.0 | **בינוני** — יש להפריד כ-module |
| aubiojs | GPL-3.0 | **גבוה** — מומלץ להימנע |

**מומלץ:** העדיפו תמיד ספריות MIT / Apache 2.0 / BSD.

---

*נוצר: מרץ 2026 | DJMaster Academy Research Team*
