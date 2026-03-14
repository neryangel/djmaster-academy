---
title: "Export Mode ו-Performance Mode"
description: "הבן את שני המצבים של Rekordbox ואיך לעבוד עם USB ובקר"
lesson_number: 5
module_id: "01-rekordbox-basics"
course_id: "03-rekordbox"
duration_minutes: 12
difficulty: "beginner"
key_terms:
  - term: "Export Mode"
    definition: "מצב הכנה — ייבוא, ניתוח, ארגון, וייצוא ל-USB"
  - term: "Performance Mode"
    definition: "מצב ביצוע — DJing חי עם בקר מחובר"
  - term: "USB Export"
    definition: "ייצוא ספרייה ופלייליסטים לדיסק-און-קי לשימוש ב-CDJ"
learning_objectives:
  - "להבין מתי להשתמש בExport ומתי ב-Performance"
  - "ללמוד לייצא מוזיקה ל-USB בפורמט הנכון"
  - "להכיר את הממשק של Performance Mode"
tags: ["export-mode", "performance-mode", "usb", "workflow"]
---

# Export Mode ו-Performance Mode

## שני מצבים, שתי מטרות

Rekordbox עובד בשני מצבים שונים לחלוטין:

| מאפיין | Export Mode | Performance Mode |
|---------|------------|-----------------|
| מטרה | הכנה וארגון | DJing חי |
| ציוד | מחשב בלבד | מחשב + בקר/CDJ |
| מה עושים | ייבוא, ניתוח, Cues, פלייליסטים | מיקס, אפקטים, הקלטה |
| יציאה | USB לCDJ | ישירות לרמקולים |
| חינמי? | ✅ כן | ✅ בסיסי חינם |

## Export Mode — הכנה

### זרימת עבודה

```
מוזיקה חדשה
    ↓
ייבוא ל-Rekordbox
    ↓
ניתוח אוטומטי (BPM, Key, Waveform)
    ↓
בדיקת Beat Grid + תיקון
    ↓
הגדרת Hot Cues
    ↓
ארגון בפלייליסטים
    ↓
ייצוא ל-USB
    ↓
USB → CDJ במועדון
```

### ייצוא ל-USB

#### הכנת USB
1. **פורמט**: FAT32 (עד 32GB) או exFAT (מעל 32GB)
2. **מחשב Mac**: Disk Utility → Erase → FAT32/exFAT
3. **מחשב PC**: Right Click → Format → FAT32/exFAT

#### תהליך הייצוא
1. חבר USB למחשב
2. ב-Rekordbox — ה-USB יופיע בצד שמאל
3. **גרור** פלייליסט אל ה-USB
4. חכה שהייצוא יסתיים (אל תנתק!)
5. בצע **Safely Eject** לפני ניתוק

#### מה מיוצא?
- קבצי האודיו עצמם
- Beat Grid, BPM, Key
- Hot Cues ו-Memory Cues
- Waveforms
- כל המטא-דאטה

> **חשוב:** תמיד שמור **2 USB זהים** — גיבוי במקרה שאחד נהרס.

## Performance Mode — ביצוע חי

### מתי משתמשים?
- כשמנגנים עם **DDJ-FLX4** או בקר אחר
- כשהמחשב הוא מקור האודיו (לא USB+CDJ)
- כשרוצים **הקלטה** של הסט

### ממשק Performance Mode

| אזור | מה מוצג |
|-------|---------|
| Decks (למעלה) | 2-4 שחקנים עם Waveform |
| Browser (למטה) | ספרייה, פלייליסטים, חיפוש |
| Mixer (אמצע) | EQ, Faders, Effects |
| Sampler | Pads של סאונדים |

### תכונות ב-Performance Mode

#### חינמיות:
- מיקס 2 ערוצים
- EQ ואפקטים בסיסיים
- הגדרת Hot Cues
- Beat Sync

#### בתשלום (או עם בקר):
- מיקס 4 ערוצים
- הקלטת סטים
- DVS (Vinyl Control)
- אפקטים מתקדמים

## איך הFLX4 פותח Performance Mode

כשמחברים DDJ-FLX4 ל-Rekordbox:
1. Rekordbox מזהה אוטומטית
2. עובר ל-Performance Mode
3. כל כפתור בFLX4 ממופה אוטומטית
4. מוכנים לנגן

> **טיפ:** פתח Rekordbox **לפני** שמחבר את הFLX4. ככה Rekordbox טוען את הDriver הנכון.

## סיכום: מתי מה?

| אני רוצה... | מצב | הסבר |
|-------------|------|-------|
| לארגן מוזיקה | Export | ייבוא, תיוג, פלייליסטים |
| להכין שירים לאירוע | Export | Beat Grid, Hot Cues, ייצוא USB |
| לתרגל מיקס בבית | Performance | FLX4 + Rekordbox |
| לנגן באירוע עם בקר | Performance | FLX4 + לפטופ + רמקולים |
| לנגן במועדון עם CDJs | Export → USB | USB בלבד, בלי לפטופ |
