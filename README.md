# 🎧 DJMaster Academy

> פלטפורמת DJ Education #1 בישראל — סטנדרטים בינלאומיים, תוכן בעברית

**Phase:** 0 (MVP) | **Status:** In Progress | **Last Updated:** March 13, 2026

---

## סקירה כללית

DJMaster Academy היא פלטפורמת הכשרה מקיפה לדיגיי בישראל. אנחנו מספקים:
- 5 קורסים בסדר לוגי (World of DJ → Manual Beatmatching)
- 3 כלים אינטראקטיביים (BPM, Harmonic Wheel, Set Planner)
- דף נחיתה מקצועי + אתר קורס מלא עם חידונים ותעודות
- מודל עסקי מוכח (Freemium-to-Pro עם 5 רמות)

**Target Audience:** DJ החדשים בישראל שחשים lost עם FLX4 ו-Rekordbox

---

## Quick Start

### 1️⃣ קרא את ארכיטקטורת הפרויקט
```bash
cat 00-docs/ARCHITECTURE.md
```

### 2️⃣ בדוק את התוכנית לשנתיים
```bash
cat 00-docs/ROADMAP.md
```

### 3️⃣ פתח את דף הנחיתה
```bash
open app/landing-page.html
```

### 4️⃣ פתח את אתר הקורס
```bash
open app/dj-course.html
```

---

## מבנה הפרויקט

```
djmaster-academy/
├── 📋 00-docs/                    # תיעוד ותכנון
│   ├── ARCHITECTURE.md            # DB Schema, 25+ APIs, Security
│   ├── ROADMAP.md                 # תוכנית 24 חודשים
│   ├── BUSINESS-MODEL.md          # מודל הכנסות מפורט
│   ├── KPIs.md                    # מדדי הצלחה וניטור
│   ├── PROJECT-STATUS.md          # סטטוס פרויקט נוכחי
│   └── README.md                  # קראו תחת —>
│
├── 🎓 01-courses/                 # 5 קורסים בסיסיים
│   ├── COURSES-MAP.md             # מפת הקורסים
│   ├── 01-world-of-dj/            # Lesson 1: יסודות (lesson + exercises + quiz)
│   ├── 02-flx4-equipment/         # Lesson 2: DDJ-FLX4
│   ├── 03-rekordbox/              # Lesson 3: Rekordbox Software
│   ├── 04-music-structure/        # Lesson 4: Phrasing & Harmonic Key
│   ├── 05-manual-beatmatching/    # Lesson 5: Manual Beatmatching
│   └── README.md                  # קראו תחת —>
│
├── 🛠️ 02-tools/                   # כלים אינטראקטיביים (HTML)
│   ├── bpm-calculator/            # מחשבון BPM (22 KB)
│   ├── harmonic-wheel/            # גלגל Camelot (36 KB)
│   ├── set-planner/               # מתכנן סט (46 KB)
│   ├── TOOLS-LIST.md              # תיעוד מלא
│   └── README.md                  # קראו תחת —>
│
├── 📚 03-assets/                  # חומרי עזר ורפרנס
│   ├── glossary/                  # מילון DJ (עברית-אנגלית)
│   ├── cheatsheets/               # כרטיסי עזר מהיר
│   │   ├── FLX4-QUICK-REF.md
│   │   ├── MIXING-RULES.md
│   │   └── flx4-cheatsheet.pdf
│   └── README.md                  # קראו תחת —>
│
├── 📧 04-marketing/               # שיווק ותוכן
│   ├── email-sequences/           # 7 דוא״לים ברכישה
│   ├── social/                    # לוח תוכן 90 ימים
│   └── README.md                  # קראו תחת —>
│
├── 🎨 05-platform/                # עיצוב ופיתוח
│   ├── design/                    # Design System
│   ├── tech/                      # Tech Stack
│   └── README.md                  # קראו תחת —>
│
├── 💼 06-business/                # עסקים ושותפויות
│   ├── partnerships/              # 4 רמות, 20+ יעדים
│   ├── pricing/                   # אסטרטגיית תמחור
│   └── README.md                  # קראו תחת —>
│
├── 💻 app/                        # אפליקציות Main
│   ├── dj-course.html             # אתר קורס (3,077 שורות, 10 שיעורים)
│   ├── landing-page.html          # דף נחיתה (1,681 שורות)
│   └── README.md                  # קראו תחת —>
│
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── DJMaster-Pitch-Deck.pptx       # מצגת משקיעים
└── DJMaster-Project-Plan.docx     # תוכנית מפורטת
```

---

## 🧭 מדריך מודולים

| מודול | תיאור | סטטוס | קבצים עיקריים |
|--------|-------|--------|--------------|
| **00-docs** | ארכיטקטורה, Roadmap, עסקים, KPIs | ✅ | ARCHITECTURE.md, ROADMAP.md |
| **01-courses** | 5 קורסים + 40+ בתוכנית | ✅ Phase 1 | lesson.md, exercises.md, quiz.json |
| **02-tools** | 3 כלים HTML | ✅ | bpm-calculator, harmonic-wheel, set-planner |
| **03-assets** | מילון וכרטיסי עזר | ✅ | DJ-GLOSSARY.md, MIXING-RULES.md |
| **04-marketing** | Email + Social | ✅ | WELCOME-SEQUENCE.md, CONTENT-CALENDAR.md |
| **05-platform** | Design System + Tech | ✅ Design | DESIGN-SYSTEM.md, TECH-STACK.md |
| **06-business** | שותפויות + תמחור | ✅ | PARTNERSHIPS.md, PRICING-STRATEGY.md |
| **app** | אתרים ראשיים | ✅ | dj-course.html, landing-page.html |
| **00-docs** | + סטטוס פרויקט | ✅ Active | PROJECT-STATUS.md |

---

## 🔧 כלים אינטראקטיביים

| כלי | תיאור | Lead Magnet | קובץ |
|-----|-------|-------------|------|
| **BPM Calculator** | Tap Tempo, המרה BPM, מטרונום | ✅ Free Tier | `02-tools/bpm-calculator/index.html` |
| **Harmonic Wheel** | גלגל Camelot, key matching | ✅ Free Tier | `02-tools/harmonic-wheel/index.html` |
| **Set Planner** | ניהול סטים, עלייה אנרגיה | ✅ Pro Tier | `02-tools/set-planner/index.html` |

---

## 📚 קורסים (Phase 1)

| # | קורס | תיאור | סטטוס | Lessons |
|---|------|-------|--------|---------|
| 1 | **World of DJ** | יסודות, כרטוגרפיה, אודיו | ✅ | lesson.md + exercises + quiz |
| 2 | **FLX4 Equipment** | DDJ-FLX4, לחצנים, פאדים | ✅ | lesson.md + exercises + quiz |
| 3 | **Rekordbox** | ספריה, cueing, effects | ✅ | lesson.md + exercises + quiz |
| 4 | **Music Structure** | Phrasing, harmonic key, 16/32 bars | ✅ | lesson.md + exercises + quiz |
| 5 | **Manual Beatmatching** | Pitch control, BPM, jog wheel | ✅ | lesson.md + exercises + quiz |
| 6-15 | (עתידיים) | Looping, Sampling, Scratching, etc. | 📋 Phase 2-3 | |

**סה״כ:** 40+ שיעורים בתוכנית (5 בשלב 1, 35+ בשלבים 2-3)

---

## 💰 מודל התמחור

| מסלול | חודשי | שנתי | תכולה |
|-------|-------|------|-------|
| 🆓 **Free** | ₪0 | ₪0 | 3 שיעורים בסיסיים + כלים |
| 🟠 **Pro** | ₪79 | ₪649/שנה* | כל הקורסים + כלים + קהילה |
| 💜 **Mentorship** | ₪299 | N/A | Pro + Zoom 1×1 + Feedback |
| 🌟 **Lifetime** | — | ₪1,999 | הכל לנצח |

*חיסכון 31% בתכנית שנתית

---

## 💹 תחזוקה 3 שנתית

### Year 1 (2026)
- **Customers (End of Year):** 500
- **Annual Recurring Revenue (ARR):** ₪180K
- **Team Size:** 1 → 3

### Year 2 (2027)
- **Customers:** 2,500
- **ARR:** ₪850K
- **Team Size:** 3 → 6

### Year 3 (2028)
- **Customers:** 8,000
- **ARR:** ₪2.4M
- **Team Size:** 6 → 12

---

## 🛠️ Tech Stack

### Phase 0 (נוכחי)
- HTML5, CSS3, Vanilla JavaScript
- Self-contained files (no build process)
- LocalStorage for progress tracking

### Phase 1 (2026-Q2)
- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe
- **Hosting:** Vercel
- **Video:** Mux (streaming)

### Phase 2 (2026-Q4)
- **Mobile:** React Native (iOS/Android)
- **Real-time:** WebSockets for live chat

---

## 🎯 הצלחה — KPIs לניטור

| KPI | Target (Y1 Q4) | Metric |
|-----|----------------|--------|
| **CAC (Cost per Acquisition)** | ₪50 | כוללות שיווק / חדשים |
| **LTV (Lifetime Value)** | ₪800 | ממוצע הכנסה לתלמיד |
| **Churn Rate** | <5%/חודש | % התלמידים שעוזבים |
| **Engagement** | >60% completion | % שמשלימים לפחות קורס אחד |
| **NPS (Net Promoter Score)** | >50 | כמה יווה 0-100 |

---

## 🤝 עסקים

### Partnerships (4 Tiers)

**Tier 1 — Integrations:** Rekordbox, Serato, Pioneer
**Tier 2 — Co-Marketing:** DJ Schools, Music Producers
**Tier 3 — Affiliates:** YouTubers, Music Blogs
**Tier 4 — Revenue Share:** Equipment Distributors

👉 פרטים: `06-business/partnerships/PARTNERSHIPS.md`

### Revenue Diversification

- **90%:** Subscriptions (Pro, Mentorship, Lifetime)
- **10%:** Affiliate (DJ Equipment) + Workshops

---

## 📖 Contributing

קרא את [CONTRIBUTING.md](CONTRIBUTING.md) לפני תרומה.

### Workflow

1. Read [ARCHITECTURE.md](00-docs/ARCHITECTURE.md)
2. Fork the project
3. Create feature branch (`git checkout -b feature/your-feature`)
4. Commit changes (`git commit -m 'Add new feature'`)
5. Push to branch (`git push origin feature/your-feature`)
6. Open Pull Request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for all updates and version history.

---

## 👥 Team

**Founder:** [שם כאן]
**Current:** 1 person (Founder)
**Target (Y1 Q4):** 3 people (Founder + Content Manager + Community Manager)

---

## 📞 Support

- **Email:** support@djmaster.co.il
- **Discord:** [Join Community](#)
- **Issues:** Open an issue on GitHub

---

**DJMaster Academy** — Learning to DJ made simple, professional, and available to everyone in Israel.

*v2.0 | Last Updated: March 13, 2026*
