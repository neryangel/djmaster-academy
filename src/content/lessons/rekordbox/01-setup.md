---
title: "התקנת Rekordbox והגדרות ראשוניות"
description: "מדריך התקנה מלא — Audio Settings, Buffer Size, Latency, הגדרות תצוגה, קיצורי מקלדת, ו-MIDI Mapping"
lesson_number: 1
module_id: "01-rekordbox-basics"
course_id: "03-rekordbox"
duration_minutes: 25
difficulty: "beginner"
key_terms:
  - term: "Rekordbox"
    definition: "תוכנת DJ וניהול מוזיקה של Pioneer DJ — סטנדרט תעשייתי בכל המועדונים בעולם"
  - term: "Export Mode"
    definition: "מצב הכנה — ייבוא, ניתוח, ארגון, ויצוא ל-USB לשימוש ב-CDJ"
  - term: "Performance Mode"
    definition: "מצב ביצוע — DJing חי עם בקר (DDJ-FLX4) מחובר ללפטופ"
  - term: "Buffer Size"
    definition: "גודל חוצץ האודיו — משפיע על Latency. קטן = מהיר אבל עמסני, גדול = יציב אבל איטי"
  - term: "Sample Rate"
    definition: "תדר דגימה — 44.1kHz (CD) או 48kHz (מקצועי). כמה פעמים בשנייה נדגם הקול"
  - term: "Auto-Gain"
    definition: "נרמול אוטומטי — Rekordbox מתאים את עוצמת כל שיר לרמה אחידה"
  - term: "Quantize"
    definition: "הצמדה לביט — כל פעולה (Cue, Loop) נופלת בדיוק על הביט הקרוב"
learning_objectives:
  - "להתקין Rekordbox בצורה נכונה"
  - "להגדיר Audio Settings מקצועיים (Buffer, Sample Rate)"
  - "להבין את ההבדל בין Export ל-Performance Mode"
  - "להכיר קיצורי מקלדת חשובים"
  - "להגדיר את DDJ-FLX4 ב-Rekordbox"
tags: ["rekordbox", "setup", "installation", "audio-settings", "configuration"]
---

# התקנת Rekordbox והגדרות ראשוניות

## מה זו Rekordbox?

**Rekordbox** היא התוכנה הרשמית של **Pioneer DJ** — הסטנדרט התעשייתי בכל המועדונים בעולם. היא משמשת ל:
- **ניהול ספרייה** — ייבוא, ניתוח, תיוג, ופלייליסטים
- **DJing חי** — שני Decks, EQ, Effects, Loops
- **הכנה למועדון** — יצוא ל-USB לשימוש ב-CDJ-3000

> **למה Rekordbox ולא תוכנה אחרת?** כי ה-DDJ-FLX4 תוכנן ל-Rekordbox. מה שתלמד בבית — **אותו ממשק, אותם קיצורים** — תראה על CDJ-3000 במועדון.

---

## התקנה — שלב אחר שלב

### 1. צור חשבון Pioneer DJ

```
1. גלוש ל: rekordbox.com
2. לחץ "Sign Up" (או "Create Account")
3. הכנס email + סיסמה
4. אשר במייל
```

### 2. הורד והתקן

```
1. היכנס לחשבון → Downloads → Rekordbox
2. בחר Mac / Windows
3. הורד (כ-1.2 GB)
4. Mac: גרור ל-Applications
   Windows: הפעל .exe → Next → Install
5. הפעל Rekordbox → התחבר עם החשבון
```

### 3. בחר Plan

| Plan | מחיר | מה כלול | מתאים ל... |
|------|------|---------|-----------|
| **Free** | חינם | 2 Decks, ייבוא, ניתוח | מתחילים (מספיק!) |
| **Core** | ~₪50/חודש | + הקלטה, Cloud Library | בינוניים |
| **Creative** | ~₪100/חודש | + DVS, Video, Lyrics | מתקדמים |

> **למתחילים: Free מספיק לחלוטין.** כל עוד יש לך DDJ-FLX4 מחובר, ה-Performance Mode פתוח בלי תשלום.

---

## Audio Settings — ההגדרות הכי חשובות

### Preferences → Audio

| הגדרה | ערך מומלץ | הסבר | למה זה חשוב |
|--------|-----------|------|-------------|
| **Audio Device** | DDJ-FLX4 | הבקר כמכשיר Audio | בלי זה — אין צליל |
| **Sample Rate** | 48,000 Hz | איכות מקצועית | 44.1k = CD, 48k = Pro |
| **Buffer Size** | 256 samples | איזון Latency/יציבות | קטן מדי = קפיצות |
| **Output** | Master: DDJ-FLX4 | יציאה לרמקולים | |
| **Headphones** | Phones: DDJ-FLX4 | יציאה לאוזניות | |

### Buffer Size — טבלת החלטות

| Buffer | Latency | עומס CPU | מתאים ל... |
|--------|---------|---------|-----------|
| 64 | ~3ms | גבוה מאוד | מק M2+/M3 בלבד |
| 128 | ~6ms | גבוה | מחשבים חזקים |
| **256** | **~12ms** | **בינוני** | **רוב המחשבים — מומלץ** |
| 512 | ~23ms | נמוך | מחשבים ישנים |
| 1024 | ~46ms | נמוך מאוד | מרגישים עיכוב — לא מומלץ |

> **כלל:** אם שומעים **קפיצות או נתקים** — הגדל Buffer. אם מרגישים **עיכוב** — הקטן Buffer.

---

## הגדרות חשובות נוספות

### Preferences → Analysis

| הגדרה | ערך | הסבר |
|--------|------|------|
| **BPM Range** | Normal (70-180) | טווח חיפוש BPM |
| **Key Analysis** | ON | ניתוח מפתח (Camelot) |
| **Auto Analysis** | ON | ניתוח אוטומטי בייבוא |
| **Track Color** | Waveform | צביעה לפי תדרים |

### Preferences → View

| הגדרה | ערך מומלץ | למה |
|--------|-----------|-----|
| **Waveform Type** | 3Band | צבעים לפי תדרים (כחול/ירוק/אדום) |
| **Beat Count Display** | Bars | ספירת תיבות ולא ביטים |
| **Language** | English | רוב המונחים באנגלית |

### Preferences → Controller

| הגדרה | ערך |
|--------|------|
| **Jog Mode** | Vinyl (ברירת מחדל) |
| **Crossfader Curve** | Smooth |
| **Smart Fader** | ON |

---

## קיצורי מקלדת חשובים

| קיצור | פעולה | מתי |
|--------|--------|-----|
| **Space** | Play/Pause (Deck Active) | כל הזמן |
| **Ctrl/Cmd + P** | עבור ל-Performance Mode | התחלת ניגון |
| **Ctrl/Cmd + E** | עבור ל-Export Mode | הכנת מוזיקה |
| **Ctrl/Cmd + R** | הקלטה Start/Stop | הקלטת סט |
| **Ctrl/Cmd + L** | Load Track to Deck | טעינת שיר |
| **F** | Full Screen | מסך מלא |
| **Tab** | Switch Browser Panel | מעבר בספרייה |

---

## הגדרת DDJ-FLX4 ב-Rekordbox

### בדיקת חיבור

```
1. חבר USB-C מ-FLX4 ל-Laptop
2. פתח Rekordbox
3. בפינה השמאלית העליונה צריך להופיע:
   "DDJ-FLX4 Connected" ✅
4. אם לא — הורד Pioneer DJ Drivers מ-pioneerdj.com
```

### MIDI Mapping

ה-FLX4 ממופה **אוטומטית** — כל כפתור פועל ישר. אלה הפקדים שממופים:

| FLX4 Control | Rekordbox Function |
|--------------|--------------------|
| Jog Wheel (Top) | Scratch / Cue Search |
| Jog Wheel (Edge) | Pitch Bend |
| Pitch Fader | Tempo Change |
| Play/Pause | Play/Pause |
| Cue | Set/Return to Cue |
| Performance Pads 1-8 | Hot Cue / Loop / etc. |
| Channel Fader | Channel Volume |
| Crossfader | A↔B Balance |
| EQ Hi/Mid/Lo | 3-Band EQ |
| Filter/Smart CFX | Color FX |
| Trim | Input Gain |
| Master | Master Volume |

---

## Auto-Gain — נרמול אוטומטי

### מה זה?

שירים שונים מוקלטים ברמות עוצמה שונות. **Auto-Gain** גורם לכל שיר לנגן **באותה רמה** — בלי שתצטרך לתקן Trim בכל מעבר.

### הגדרה

Preferences → Audio → Auto Gain:
- **Target Level:** -1.0 dB (מומלץ)
- **ON/OFF:** ON (תמיד!)

> **למה לא 0 dB?** כי צריך **Headroom** — מרווח בטחון של 1dB למנוע Clipping כשמוסיפים EQ boost.

---

## Quantize — הצמדה לביט

### מה זה?

כש-Quantize מופעל, כל פעולה שתעשה **תיפול בדיוק על הביט הקרוב**:
- **Hot Cue** → נופל על Beat מדויק
- **Loop In/Out** → מתחיל/נגמר על Beat
- **Play** (אחרי Pause) → ממשיך מהBeat הקרוב

### מתי להפעיל?

| מצב | Quantize | למה |
|------|---------|-----|
| **הגדרת Cues** | ✅ ON | דיוק — Cue בדיוק על הביט |
| **Loops** | ✅ ON | Loop מדויק בלי דריפט |
| **Scratching** | ❌ OFF | צריך חופש תנועה |
| **Beatmatching ידני** | ❌ OFF | לפתח דיוק עצמי |

---

## סיכום: צ'קליסט הגדרות ראשוניות

```
□ התקנת Rekordbox ✓
□ חשבון Pioneer DJ ✓
□ Audio Device: DDJ-FLX4 ✓
□ Sample Rate: 48kHz ✓
□ Buffer Size: 256 ✓
□ Auto-Gain: ON (-1.0 dB) ✓
□ Quantize: ON ✓
□ BPM Range: Normal ✓
□ Key Analysis: ON ✓
□ Auto Analysis: ON ✓
□ Waveform: 3Band ✓
□ Jog Mode: Vinyl ✓
□ DDJ-FLX4 Connected ✓
```

> **אחרי שכל ✓ ירוק — אתה מוכן להתחיל!**
