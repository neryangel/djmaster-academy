# Tech Stack — מפרט טכני מלא

## שלב א׳ — MVP (No-Code / Low-Code)

```
┌─────────────────────────────────────────┐
│  djmaster.academy (Framer / HTML Static) │
│  - Landing Page                          │
│  - 3 שיעורים חינמיים                     │
│  - BPM Calc + Harmonic Wheel (HTML)      │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───▼───┐          ┌─────▼────┐
│Gumroad│          │ Discord  │
│Payment│          │Community │
└───────┘          └──────────┘
    │
┌───▼──────────┐
│ Mailchimp    │
│ Email List   │
└──────────────┘
```

### כלים שלב א׳

| תפקיד | כלי | עלות |
|-------|-----|------|
| Site | Framer / GitHub Pages | חינם |
| Payments | Gumroad | 10% עמלה |
| Email | Mailchimp (free) | חינם עד 500 |
| Community | Discord | חינם |
| Video | YouTube Unlisted | חינם |
| Forms | Typeform | חינם |

---

## שלב ב׳ — Full Platform

```
┌──────────────────────────────────────────────┐
│              Next.js 14 (App Router)          │
│              TypeScript + Tailwind CSS        │
│              djmaster.academy                 │
└──────────────┬───────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼──────┐       ┌──────▼──────┐
│ Supabase │       │    Mux.com  │
│ Auth/DB  │       │ Video Host  │
│ Storage  │       │  + DRM      │
└──────────┘       └─────────────┘
    │
┌───▼──────┐
│  Stripe  │
│ Payments │
│  + Subs  │
└──────────┘
```

### Next.js 14 — מבנה תיקיות

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx        # Landing
│   │   ├── courses/        # Course catalog
│   │   └── tools/          # Free tools
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   └── (dashboard)/
│       ├── lessons/[id]/   # Lesson player
│       ├── progress/       # Progress tracker
│       └── profile/        # User profile
├── components/
│   ├── ui/                 # Shadcn components
│   ├── lesson/             # Lesson-specific
│   └── tools/              # BPM, Harmonic
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── mux.ts
└── types/
    └── database.ts         # Generated from Supabase
```

### Supabase Schema

```sql
-- Users (extended from auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',  -- free | pro | mentorship | lifetime
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT,  -- beginner | intermediate | advanced
  order_index INT,
  is_published BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INT REFERENCES courses,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  mux_playback_id TEXT,
  duration_seconds INT,
  order_index INT,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  lesson_id INT REFERENCES lessons,
  completed BOOLEAN DEFAULT FALSE,
  progress_seconds INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Subscriptions (synced from Stripe webhooks)
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,  -- Stripe subscription ID
  user_id UUID REFERENCES profiles,
  plan TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## שלב ג׳ — Scale

| Component | כלי | עלות חודשי |
|-----------|-----|------------|
| Mobile App | React Native (Expo) | חינם |
| Community | Circle.so | $89 |
| Search | Algolia | $50+ |
| CDN | Cloudflare | חינם |
| Analytics | Mixpanel | חינם עד 100K |
| Monitoring | Sentry | חינם |
| Uptime | Better Uptime | חינם |

---

## 🔐 Security

- Auth: Supabase Auth (JWT)
- RLS: Row Level Security על כל טבלה
- Stripe: Webhooks עם signature verification
- Video: Mux Signed URLs (פגות תוך 24h)
- HTTPS: Vercel SSL אוטומטי
- Rate Limit: Upstash Redis

---

## 📊 Analytics Events

```typescript
// Events לtrack
track('page_view', { page: '/courses' })
track('lesson_started', { lesson_id, course_id })
track('lesson_completed', { lesson_id, duration })
track('tool_used', { tool: 'bpm-calculator' })
track('signup', { source: 'landing' | 'tool' | 'social' })
track('trial_started')
track('subscription_created', { plan, mrr })
track('subscription_cancelled', { reason })
```
