---
title: "Beat Grid — ניתוח קצב ותיקון"
description: "למד לעבוד עם Beat Grid ב-Rekordbox — ניתוח, תיקון ידני, ו-Quantize"
lesson_number: 3
module_id: "01-rekordbox-basics"
course_id: "03-rekordbox"
duration_minutes: 15
difficulty: "intermediate"
key_terms:
  - term: "Beat Grid"
    definition: "רשת ויזואלית שמסמנת את מיקום הביטים בתוך השיר"
  - term: "Downbeat"
    definition: "הביט הראשון של תיבה — הביט החזק ביותר (ה-1)"
  - term: "Quantize"
    definition: "תכונה שמצמידה פעולות (Cue, Loop) אוטומטית לביט הקרוב"
  - term: "Grid Adjust"
    definition: "תיקון ידני של ה-Beat Grid כשהניתוח האוטומטי שגוי"
learning_objectives:
  - "להבין מה זה Beat Grid ולמה הוא חשוב"
  - "לדעת מתי ואיך לתקן Beat Grid ידנית"
  - "להשתמש ב-Quantize נכון"
tags: ["beat-grid", "quantize", "track-preparation"]
---

# Beat Grid — ניתוח קצב ותיקון

## מה זה Beat Grid?

Beat Grid הוא **רשת של קווים** שRekordbox מציבה על שיר, כשכל קו מסמן ביט. הקווים האלו מאפשרים:
- **Sync מדויק** בין שירים
- **Quantize** — Cue Points ו-Loops שנופלים בדיוק על ביט
- **ויזואליזציה** — לראות את מבנה השיר

## ניתוח אוטומטי

כשRekordbox מנתח שיר, הוא:
1. מזהה את ה-BPM
2. מציב Beat Grid
3. מזהה את ה-Downbeat (ביט 1)

### מתי הניתוח מדויק?

| סוג מוזיקה | דיוק | הערה |
|-------------|-------|------|
| House / Techno | 99% | קצב קבוע, Kick חזקה |
| Pop / Rock | 90% | לרוב מדויק |
| Hip-Hop | 85% | לפעמים לא קולט את הקצב |
| מוזיקה חיה | 70% | קצב לא קבוע — צריך תיקון |
| Transition Tracks | 50% | BPM משתנה — צריך Beat Grid מרובה |

## מתי לתקן Beat Grid?

### סימנים שהGrid שגוי:
- הקווים **לא נופלים על הKick Drum**
- ה-**Downbeat** מסומן במקום הלא נכון
- ה-**BPM מוצג שגוי** (למשל 63 BPM במקום 126)
- Sync בין שירים נשמע לא מסונכרן

## איך לתקן?

### שלב 1: גש ל-Grid Editor
- לחץ על השיר פעמיים ב-Collection
- או לחץ על כפתור Grid בחלון ה-Player

### שלב 2: אתר את הDownbeat
- מצא את הKick הראשון של התיבה הראשונה
- לחץ עליו — ה-Grid יזדקק אליו

### שלב 3: בדוק יישור
- הריצו את השיר
- ודא שכל קו בGrid נופל **בדיוק** על Kick
- אם לא — השתמש ב:
  - **Shift Grid** — הזז את כל הGrid ימינה/שמאלה
  - **Expand/Contract** — שנה את המרווח בין קווים

### שלב 4: אמת
- הריצו את השיר **עד הסוף**
- ודא שהGrid לא "זז" לאורך השיר
- אם כן — ייתכן שה-BPM לא אחיד (שיר עם שינויי קצב)

## Quantize

### מה זה?
Quantize מצמיד אוטומטית כל פעולה לביט הקרוב:
- **Hot Cue** → נופל בדיוק על ביט
- **Loop In/Out** → מתחיל ונגמר בדיוק על ביט
- **Beat Jump** → קופץ מספר ביטים מדויק

### מתי להפעיל?
- ✅ **תמיד** כשמגדירים Hot Cues (Quantize = דיוק)
- ✅ כשעובדים עם Loops
- ❌ כש-Scratching (Quantize מפריע לתנועה חופשית)

## Beat Grid מרובה (Advanced)

לשירים עם שינויי BPM (למשל Transition Track שעובר מ-100 ל-128 BPM):
1. הגדר Grid ראשון על החלק ב-100 BPM
2. מצא את הנקודה שבה ה-BPM משתנה
3. הגדר Grid שני על החלק ב-128 BPM

> **טיפ:** רוב השירים לא צריכים Beat Grid מרובה. רק שירים מיוחדים עם שינויי קצב דורשים את זה.

## סיכום

| פעולה | תדירות | זמן |
|--------|---------|------|
| ניתוח אוטומטי | לכל שיר חדש | אוטומטי |
| בדיקת Grid | לכל שיר שתנגן באירוע | 30 שניות |
| תיקון Grid | רק כשהניתוח שגוי | 1-2 דקות |
