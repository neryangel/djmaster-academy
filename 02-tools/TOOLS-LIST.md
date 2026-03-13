# כלים אינטראקטיביים — DJMaster Academy

## סטאטוס כללי

| כלי | סטאטוס | גודל | תכונות |
|-----|--------|------|--------|
| **BPM Calculator** | ✅ הושלם | 22 KB | Tap Tempo, Multipliers, Metronome |
| **Harmonic Wheel** | ✅ הושלם | 36 KB | Camelot System, Compatibility Mode, Key Finder |
| **Set Planner** | ✅ הושלם | 46 KB | Track Management, Energy Graph, Drag & Drop |
| **Rekordbox Guide** | 📋 מתוכנן | — | Interactive Walkthrough |
| **FLX4 Virtual Map** | 📋 מתוכנן | — | Hardware Mapping, Simulation |
| **Practice Metronome** | 📋 מתוכנן | — | BPM Control, Visual Guide |

---

## 🎯 כלים שהושלמו — תיעוד שימוש

### 1. BPM Calculator (מחשבון BPM)

**קישור:** `/tools/bpm-calculator/index.html`

**למה זה שימושי:**
- חשמלית BPM של שיר בדקה אחת
- לא צריך YouTube Metronome או BPM Detector
- מתאים עבור Beatmatching בתרגול

#### עיצוב השימוש:

```
1. פתח את BPM Calculator
2. לחץ על כפתור "START" או spacebar
3. לחץ בקצב השיר על זמן:
   - 2–4 לחיצות בסדיר = BPM מדויק
   - 8–16 לחיצות = דיוק גבוה יותר
4. קרא את ה-BPM בתחתית
```

#### תכונות עיקריות:

| תכונה | השימוש |
|------|--------|
| **Tap Tempo** | לחץ בקצב = BPM חשמלית |
| **Multipliers** | אם לחצת חצי קצב, הכפל ב-2 |
| **Metronome** | שמע צליל בקצב שהזנת |
| **History** | ראה את 5 האחרונות tapstream |

#### טיפים Pro:

- **אם בספק:** לחץ קצת פעמים וקח ממוצע
- **עבור Half-Time Songs:** לחץ כל beat 2, אח"כ כפל
- **Sync עם Controller:** השווה ל-DDJ-FLX4 Sync

#### דוגמה זמן:

```
שיר: "My World" (Club Music)
לחיצות: 8 לחיצות בקצב
תוצאה: 128 BPM
אימות: זה כנראה House/Techno
```

---

### 2. Harmonic Mixing Wheel (גלגל הרמוני)

**קישור:** `/tools/harmonic-wheel/index.html`

**למה זה שימושי:**
- שיר בתיישור מוזיקלי טבעי
- הימנע מ-"צליל מגרד" כשעוברים בין טרקים
- תרגול Key Matching

#### עיצוב השימוש:

```
1. פתח את Harmonic Mixing Wheel
2. בחר Key של שיר 1 (לדוגמה: 6A)
3. ראה את מפתחות תואמים (באדום = בטוח)
4. בחר שיר מתאים מה-Library שלך
5. שחרר transition חלק
```

#### תכונות עיקריות:

| תכונה | השימוש |
|------|--------|
| **Camelot System** | גלגל 24 מפתחות (1A–12B) |
| **Compatibility Mode** | הצג אילו מפתחות הרמוניות |
| **Key Finder** | טעינה של שיר → detect key אוטומטי |
| **Color Coding** | ירוק = בטוח, כתום = זהיר, אדום = הימנע |

#### הנושאים:

**שורות בטוחות:**
- **Camelot 1A** → **Camelot 12B** (סמוך)
- **Camelot 1A** → **Camelot 2A** (קצת יותר מעבר)
- **Camelot 1A** → **Camelot 1B** (Major → Minor, סדרה טובה)

**שורות זהירות:**
- קפיצה של 3+ מקומות = יוצר "כשל הרמוני"

#### דוגמה זמן:

```
שיר 1: "Move Your Body" (Key: 6A — D Major)
עברה אפשר ל:
✅ 6B (D Minor)
✅ 5A (C Major)
✅ 7A (E Major)
❌ 1A (מרוחק מדי)

בחרתי 5A → Transition חלק!
```

---

### 3. Set Planner (מתכנן הסט)

**קישור:** `/tools/set-planner/index.html`

**למה זה שימושי:**
- תכנון סט שלם לפני ביצוע
- ויזואליזציה של אנרגיה (Energy Graph)
- הדפסת Cue Sheet עבור ביצוע

#### עיצוב השימוש:

```
1. פתח את Set Planner
2. הזן שיר ראשון:
   - שם, אמן, BPM, Key, Genre, Duration
3. לחץ "Add Track"
4. חזור על 2–3 עד 15 שירים
5. גרור לסדר חדש אם צריך
6. ראה Energy Graph בתחתית
7. לחץ "Export as PDF" להדפסה
```

#### תכונות עיקריות:

| תכונה | השימוש |
|------|--------|
| **Track Management** | הוספה, עריכה, מחיקה של שירים |
| **Drag & Drop** | גרור שירים לסדר חדש |
| **Energy Graph** | גרף BPM וכד׳ בסריגה |
| **PDF Export** | הדפסה עבור ביצוע בלעדי |
| **Duration Counter** | סך זמן הסט |

#### דוגמה זמן:

```
סט: Club Warmup (11 PM start)

Track | BPM | Duration
------|-----|--------
1. "Deep Intro" | 90 | 5:00
2. "Rising" | 95 | 4:30
3. "Build" | 100 | 4:00
4. "Peak" | 120 | 4:00
5. "Climax" | 130 | 3:30

סך: 21 דקות
אנרגיה: עלייה הדרגתית ✅
```

#### טיפים Pro:

- **שמור PDF** — הדפסה קודם הביצוע
- **בדוק Duration** — תרגלו חד לנייר
- **כתוב Cue Numbers** — "כנס Hot Cue 1 בדקה 2:30"

---

## 📋 כלים בתכנון — Timeline

### Rekordbox Guide (מדריך Rekordbox)

**סטאטוס:** 📋 מתוכנן
**עדיפות:** גבוה
**זמן משוער:** Q2 2025

**תוכן צפוי:**
- Interactive walkthrough של Rekordbox UI
- הדרכה על:
  - Browser (ספריית מוזיקה)
  - Waveform (גרפיקה של שיר)
  - Hot Cues, Loops, Cue Points
  - Beatgrid (סימון beatים)
  - Playlist & Folders
  - Sync עם DDJ-FLX4

**דוגמה שימוש:**
```
תלמיד פותח את Rekordbox לראשונה.
Rekordbox Guide = סרטון אינטראקטיבי.
כל כפתור = הדרכה מה זה עושה.
```

---

### FLX4 Virtual Map (מפת וירטואלית של FLX4)

**סטאטוס:** 📋 מתוכנן (חלקי עד כה)
**עדיפות:** גבוה
**זמן משוער:** Q2 2025

**תוכן צפוי:**
- 3D Model של DDJ-FLX4
- Click on any button → להבין את התפקיד
- Visual legend של כל חלק
- Simulation של Jog Wheels, Faders

**דוגמה שימוש:**
```
תלמיד לא בטוח מה Trim עושה.
לחץ על "Trim" בבקר הוירטואלי.
ראה הסבר + שינוי בצליל.
```

---

### Practice Metronome (מטרונום תרגול)

**סטאטוס:** 📋 מתוכנן
**עדיפות:** בינוני
**זמן משוער:** Q3 2025

**תוכן צפוי:**
- BPM Slider (40–200)
- Visual Beat Indicator (פולס)
- Audio Metronome (צליל)
- Pattern Options (4/4, 3/4, House Kick)

**דוגמה שימוש:**
```
תרגול Beatmatching עם 120 BPM.
Metronome מנגן בקצב 120.
תלמיד מתחפש עם הטראק שלו.
```

---

## 📊 Roadmap Pengembangan

### Q1 2025 (עכשיו)
- ✅ BPM Calculator — שדרוג ממשקים
- ✅ Harmonic Wheel — הוסף Key Finder

### Q2 2025
- 🔄 Rekordbox Guide — Development
- 🔄 FLX4 Virtual Map — Design Phase

### Q3 2025
- 🔄 Practice Metronome — Development
- 🔄 Integration עם Courses

### Q4 2025
- 🎯 כלים בדיקה מלא
- 🎯 בדיקות וחידודים

---

## 🔧 Troubleshooting & Support

### בעיה: BPM Calculator לא מגיב

**פתרון:**
1. רענן את העמוד (F5)
2. בדוק אם JavaScript מופעל בדפדפן
3. נסה דפדפן שונה (Chrome, Firefox)

### בעיה: Harmonic Wheel Key Finder לא עובד

**פתרון:**
1. וודא שהשיר ב-Spotify / Rekordbox
2. ודא שלה Audio Permission ב-Browser
3. נסה איתור ידני (בחר מפתח ידנית)

### בעיה: Set Planner PDF לא יוצא

**פתרון:**
1. בדוק אם יש דיסק פנוי
2. בדוק הדפסה הגדרות (printer selection)
3. שנסה "Save as PDF" במקום print

---

## 📞 כמו עזרה?

**בפורום DJMaster:** `#tools-help`
**דוא"ל:** support@djmaster.academy
**סרטון:** YouTube "DJMaster Tools Tutorial"
