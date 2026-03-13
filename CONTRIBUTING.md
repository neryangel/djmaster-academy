# תנאים להשתתפות (Contributing)

תודה על התעניינותך בתיקיית DJMaster Academy! מסמך זה מסביר כיצד לתרום לפרויקט.

## כללי כלליים

- כל התרומות חייבות להיות כתובות בעברית (לפחות תיאורים ותיעוד)
- יש לעמוד בתקני עיצוב וארכיטקטורה שהוגדרו במסמך זה
- כל PR יעבור review לפני merge

## מבנה תוכן קורס

כל שיעור צריך להכיל:

### 1. `lessons/lesson-{N}.md`
```markdown
# שיעור {N}: שם השיעור

## מטרות למידה
- מטרה 1
- מטרה 2

## תוכן

### חלק 1
[תוכן]

### חלק 2
[תוכן]

## קישורים משאבים
- [קישור 1](url)
```

### 2. `exercises/exercises-{N}.json`
```json
{
  "lesson": N,
  "exercises": [
    {
      "id": "ex-N-1",
      "title": "שם תרגיל",
      "description": "תיאור המשימה",
      "difficulty": "beginner|intermediate|advanced",
      "points": 10,
      "hints": ["רמז 1", "רמז 2"]
    }
  ]
}
```

### 3. `quizzes/quiz-{N}.json`
```json
{
  "lesson": N,
  "questions": [
    {
      "id": "q-N-1",
      "type": "multiple-choice|true-false|short-answer",
      "question": "השאלה",
      "options": ["א", "ב", "ג", "ד"],
      "correct": 0,
      "explanation": "הסבר התשובה"
    }
  ]
}
```

## פיתוח כלים אינטראקטיביים

### כללים כלליים
- כל כלי צריך להיות **קובץ HTML עצמאי** (self-contained)
- תמכו ב-RTL (Right-to-Left) לעברית
- השתמשו בצבעי המותג (ראו design system)
- יש להוסיף RWD (Responsive Web Design)

### מבנה HTML
```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>שם הכלי</title>
    <style>
        /* CSS embedded */
    </style>
</head>
<body>
    <!-- HTML content -->
    <script>
        // JavaScript embedded
    </script>
</body>
</html>
```

### צבעי המותג
- Primary: `#FF6B35` (כתום בוער)
- Secondary: `#004E89` (כחול עמוק)
- Success: `#2ECC71`
- Warning: `#F39C12`
- Danger: `#E74C3C`
- Background: `#F5F5F5`
- Text: `#333333`

## תקני קוד

### Git Workflow
1. צרו branch חדש: `git checkout -b feature/description`
2. התחייבו לשינויים: `git commit -m "feat: description"`
3. דחפו ל-branch: `git push origin feature/description`
4. פתחו Pull Request

### Commit Messages
- השתמשו בקונבנציית Conventional Commits
- `feat:` תכונה חדשה
- `fix:` תיקון באג
- `docs:` עדכון תיעוד
- `style:` שינויי עיצוב (לא שינוי לוגיקה)
- `refactor:` שיפור קוד

דוגמה:
```
feat: add BPM calculator tool

- Interactive calculator for DJ BPM calculations
- Supports tap tempo functionality
- RTL support for Hebrew language
- Responsive design
```

## תקני תיעוד

### Markdown
- כותרות: `#` עבור H1, `##` עבור H2, וכו'
- קישורים: `[טקסט](url)`
- קוד: `` `inline code` `` או fence ` ``` `
- רשימות: `-` עבור unordered, `1.` עבור ordered

### דוקומנטציה בקוד
כל פונקציה חייבת להכיל JSDoc:
```javascript
/**
 * חישוב ממוצע BPM של שני טראקים
 * @param {number} bpm1 - BPM ראשון
 * @param {number} bpm2 - BPM שני
 * @returns {number} ממוצע BPM
 */
function calculateAverageBPM(bpm1, bpm2) {
    return (bpm1 + bpm2) / 2;
}
```

## תהליך Review

1. **Automated Checks**: בדיקות בסיסיות ל-HTML/CSS/JS validity
2. **Manual Review**: עדכון יד של לפחות reviewer אחד
3. **Approval**: אישור reviewer וה-maintainer
4. **Merge**: Squash merge עם commit message מעודן

## דוח באגים

אם מצאתם באג:
1. בדקו אם הוא כבר דוח
2. פתחו Issue חדש עם:
   - כותרת ברורה
   - תיאור מפורט
   - צעדים להשחזור
   - סקרינשוט / וידאו (במידת הצורך)

דוגמה:
```markdown
## באג: BPM Calculator לא עובד עם מספרים שליליים

### תיאור
כאשר אני מנסה להזין -120 בשדה BPM, הכלי מתעד שגיאה ברדפד הדפדפן.

### צעדים להשחזור
1. לך ל-tools/bpm-calculator.html
2. הזן -120 בשדה הראשון
3. לחץ על "חישוב"

### התנהגות צפויה
יש להציג הודעת שגיאה ברורה או לדחות קלט שלילי.

### סביבה
- דפדפן: Chrome 120
- OS: Windows 11
```

## צורת עבודה עם תוכן

### דירוג קורסים (Course Rating)
בחרו דרגה אחת:
- `beginner`: אין ידע קודם בנושא
- `intermediate`: ידע בסיסי יש
- `advanced`: ידע עמוק יש

### משך שיעור
תאימו לטבלה:
| משך | מספר משימות | עומס |
|-----|-------------|------|
| 15 דק | 2-3 | קל |
| 30 דק | 4-5 | בינוני |
| 60 דק | 6+ | כבד |

## תנאי קוד (Code of Conduct)

- כבדו כל תורמים בלי קשר לרקע
- אנו אפס-סובלנות לחרדלה, גזענות או אפליה
- תגובות קונסטרוקטיביות בלבד ב-review
- שמרו על מקום עבודה חיובי ומכיל

## שאלות?

צרו contact עם ה-maintainer:
- Email: admin@djmaster-academy.co.il
- WhatsApp: [לקבל מ-maintainer]
- GitHub Issues: לבעיות טכניות

תודה על התרומה שלכם!
