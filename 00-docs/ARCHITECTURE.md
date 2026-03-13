# ארכיטקטורת DJMaster Academy — מדריך ארכיטקטורה מלא

**גרסה:** v2.0 (Production-Grade)
**תאריך עדכון:** 2026-03-13
**שלב:** Full Platform (שלב ב׳)

---

## 1. דיאגרמת ארכיטקטורה כללית

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Next.js 14 (App Router) + TypeScript + Tailwind CSS   │    │
│  │  - Landing Page           - Course Player              │    │
│  │  - Auth Pages             - Progress Dashboard         │    │
│  │  - Tools (BPM, Harmonic)  - Community Forum            │    │
│  │  - Pricing Page           - User Profiles              │    │
│  └────────────────┬───────────────────────────────────────┘    │
│                   │                                             │
│              [Vercel CDN]                                      │
└────────────────┬──────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐  ┌───▼────┐  ┌───▼────┐
│ API    │  │ Auth   │  │ WebSock│
│Gateway │  │ Handlers│ │ets     │
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    └───────────┼───────────┘
                │
┌───────────────▼─────────────────────────────────────────────────┐
│                     BACKEND LAYER (Supabase)                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Supabase Auth Service                               │      │
│  │  - JWT tokens + Refresh tokens                       │      │
│  │  - OAuth (Google, GitHub)                            │      │
│  │  - Magic links                                       │      │
│  │  - Row Level Security (RLS)                          │      │
│  └──────────────────────────────────────────────────────┘      │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────┐      │
│  │  PostgreSQL Database + Realtime Subscriptions        │      │
│  │  - Profiles, Courses, Lessons, Progress            │      │
│  │  - Subscriptions, Payments, Quizzes                │      │
│  │  - Achievements, Certificates                       │      │
│  └──────────────────────────────────────────────────────┘      │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────┐      │
│  │  Supabase Storage (S3-compatible)                    │      │
│  │  - User avatars, course materials                    │      │
│  │  - Mix submissions, certificates                     │      │
│  └──────────────────────────────────────────────────────┘      │
└───────────────┬─────────────────────────────────────────────────┘
                │
    ┌───────────┼────────────┬────────────┬──────────────┐
    │           │            │            │              │
┌───▼──┐ ┌─────▼────┐ ┌────▼────┐ ┌───▼──┐ ┌────▼─────┐
│Stripe│ │ Mux.com  │ │ Mailchimp│ │Redis │ │Cloudflare│
│API   │ │Video CDN │ │ Email   │ │Cache │ │  CDN     │
└──────┘ └──────────┘ └─────────┘ └──────┘ └──────────┘
    │           │            │            │              │
    └───────────┴────────────┴────────────┴──────────────┘
                │
┌───────────────▼──────────────────────────────────────┐
│          MONITORING & LOGGING LAYER                  │
│                                                      │
│  ┌──────────────┬──────────────┬────────────────┐  │
│  │   Sentry     │   Vercel     │   Mixpanel    │  │
│  │   (Errors)   │   (Analytics)│   (Events)    │  │
│  └──────────────┴──────────────┴────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 2. 6 מודולי ליבה

| # | מודול | תיאור | טכנולוגיה |
|---|-------|--------|-----------|
| 1 | **LMS** (Learning Management System) | שיעורים, tracking progress, תעודות דיגיטליות | Next.js + Supabase + Mux |
| 2 | **Interactive Tools** | BPM Calculator, Harmonic Wheel, Set Planner, Mix Assistant | React components + Web Audio API |
| 3 | **Community & Social** | פורום, mix submissions, leaderboards, achievements | Supabase Realtime + Discord integration |
| 4 | **Content Library** | cheatsheets, templates, glossary, sample packs | Supabase Storage + Full-text search |
| 5 | **Commerce & Billing** | מנויים, תשלומים, management, invoices | Stripe + Supabase webhooks |
| 6 | **Analytics & Insights** | dashboard, funnels, retention, NPS, user journey | Mixpanel + Supabase analytics |

---

## 3. Database Schema (ERD מלא)

### 3.1 Entities עיקרייים

```
PROFILES (Users)
├── id (UUID, PRIMARY KEY)
├── auth_id (UUID, FOREIGN KEY → auth.users)
├── email (TEXT, UNIQUE)
├── username (TEXT, UNIQUE)
├── full_name (TEXT)
├── avatar_url (TEXT)
├── bio (TEXT)
├── language (TEXT: 'he', 'en')
├── plan (TEXT: 'free', 'pro_monthly', 'pro_yearly', 'mentorship', 'lifetime')
├── plan_expires_at (TIMESTAMPTZ)
├── total_spent (NUMERIC)
├── created_at (TIMESTAMPTZ)
├── updated_at (TIMESTAMPTZ)
└── deleted_at (TIMESTAMPTZ, soft delete)

COURSES
├── id (INTEGER, PRIMARY KEY)
├── slug (TEXT, UNIQUE, NOT NULL)
├── title_he (TEXT)
├── title_en (TEXT)
├── description_he (TEXT)
├── description_en (TEXT)
├── thumbnail_url (TEXT)
├── level (TEXT: 'beginner', 'intermediate', 'advanced')
├── duration_minutes (INTEGER)
├── order_index (INTEGER)
├── is_published (BOOLEAN)
├── instructor_id (UUID, FOREIGN KEY → profiles)
├── category (TEXT: 'fundamentals', 'production', 'performance', 'business')
├── prerequisites (TEXT[])
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

LESSONS
├── id (INTEGER, PRIMARY KEY)
├── course_id (INTEGER, FOREIGN KEY → courses, NOT NULL)
├── slug (TEXT)
├── title_he (TEXT)
├── title_en (TEXT)
├── description_he (TEXT)
├── description_en (TEXT)
├── mux_playback_id (TEXT)
├── mux_thumbnail_url (TEXT)
├── duration_seconds (INTEGER)
├── order_index (INTEGER)
├── is_free (BOOLEAN)
├── transcript_he (TEXT)
├── transcript_en (TEXT)
├── resources_url (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

USER_PROGRESS
├── id (INTEGER, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY → profiles)
├── lesson_id (INTEGER, FOREIGN KEY → lessons)
├── completed (BOOLEAN)
├── progress_percentage (INTEGER: 0-100)
├── progress_seconds (INTEGER)
├── last_watched_at (TIMESTAMPTZ)
├── completed_at (TIMESTAMPTZ)
├── notes (TEXT)
├── rating (INTEGER: 1-5)
├── UNIQUE(user_id, lesson_id)
└── created_at (TIMESTAMPTZ)

QUIZZES
├── id (INTEGER, PRIMARY KEY)
├── lesson_id (INTEGER, FOREIGN KEY → lessons)
├── title_he (TEXT)
├── title_en (TEXT)
├── description (TEXT)
├── passing_score (INTEGER: 0-100)
├── max_attempts (INTEGER)
├── time_limit_minutes (INTEGER)
├── order_index (INTEGER)
└── created_at (TIMESTAMPTZ)

QUIZ_QUESTIONS
├── id (INTEGER, PRIMARY KEY)
├── quiz_id (INTEGER, FOREIGN KEY → quizzes)
├── question_text_he (TEXT)
├── question_text_en (TEXT)
├── question_type (TEXT: 'multiple_choice', 'true_false', 'short_answer')
├── options (JSONB: {text, is_correct})
├── explanation_he (TEXT)
├── explanation_en (TEXT)
├── order_index (INTEGER)
└── created_at (TIMESTAMPTZ)

QUIZ_RESULTS
├── id (INTEGER, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY → profiles)
├── quiz_id (INTEGER, FOREIGN KEY → quizzes)
├── score (INTEGER: 0-100)
├── passed (BOOLEAN)
├── answers (JSONB)
├── time_spent_seconds (INTEGER)
├── attempt_number (INTEGER)
├── completed_at (TIMESTAMPTZ)
└── created_at (TIMESTAMPTZ)

SUBSCRIPTIONS
├── id (TEXT, PRIMARY KEY)  -- Stripe subscription ID
├── user_id (UUID, FOREIGN KEY → profiles)
├── plan (TEXT: 'pro_monthly', 'pro_yearly', 'mentorship', 'lifetime')
├── status (TEXT: 'active', 'past_due', 'canceled', 'unpaid')
├── stripe_customer_id (TEXT)
├── stripe_price_id (TEXT)
├── current_period_start (TIMESTAMPTZ)
├── current_period_end (TIMESTAMPTZ)
├── cancel_at_period_end (BOOLEAN)
├── canceled_at (TIMESTAMPTZ)
├── updated_at (TIMESTAMPTZ)
└── created_at (TIMESTAMPTZ)

PAYMENTS
├── id (TEXT, PRIMARY KEY)  -- Stripe payment intent ID
├── subscription_id (TEXT, FOREIGN KEY → subscriptions)
├── user_id (UUID, FOREIGN KEY → profiles)
├── amount_cents (INTEGER)
├── currency (TEXT: 'ILS', 'USD')
├── status (TEXT: 'succeeded', 'pending', 'failed')
├── receipt_url (TEXT)
├── payment_method (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

CERTIFICATES
├── id (INTEGER, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY → profiles)
├── course_id (INTEGER, FOREIGN KEY → courses)
├── completion_date (DATE)
├── certificate_url (TEXT)
├── verification_token (TEXT, UNIQUE)
├── shared (BOOLEAN)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

ACHIEVEMENTS
├── id (INTEGER, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY → profiles)
├── achievement_type (TEXT: 'first_lesson', 'course_complete', 'quiz_perfect', 'mix_submitted', 'streak_7')
├── title_he (TEXT)
├── title_en (TEXT)
├── icon_url (TEXT)
├── unlocked_at (TIMESTAMPTZ)
└── created_at (TIMESTAMPTZ)

MIX_SUBMISSIONS
├── id (INTEGER, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY → profiles)
├── lesson_id (INTEGER, FOREIGN KEY → lessons, nullable)
├── title (TEXT)
├── description (TEXT)
├── audio_url (TEXT)
├── duration_seconds (INTEGER)
├── genre (TEXT)
├── status (TEXT: 'pending', 'approved', 'rejected')
├── feedback (TEXT)
├── likes_count (INTEGER)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

COMMUNITY_POSTS
├── id (INTEGER, PRIMARY KEY)
├── user_id (UUID, FOREIGN KEY → profiles)
├── title (TEXT)
├── content (TEXT)
├── category (TEXT: 'questions', 'tips', 'showcases', 'events')
├── likes_count (INTEGER)
├── replies_count (INTEGER)
├── pinned (BOOLEAN)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### 3.2 Relationships

```
PROFILES (1) ──────→ (many) USER_PROGRESS
PROFILES (1) ──────→ (many) QUIZ_RESULTS
PROFILES (1) ──────→ (many) SUBSCRIPTIONS
PROFILES (1) ──────→ (many) PAYMENTS
PROFILES (1) ──────→ (many) CERTIFICATES
PROFILES (1) ──────→ (many) ACHIEVEMENTS
PROFILES (1) ──────→ (many) MIX_SUBMISSIONS
PROFILES (1) ──────→ (many) COMMUNITY_POSTS

COURSES (1) ──────→ (many) LESSONS
COURSES (1) ──────→ (many) QUIZZES
COURSES (1) ──────→ (many) CERTIFICATES

LESSONS (1) ──────→ (many) USER_PROGRESS
LESSONS (1) ──────→ (many) QUIZZES
LESSONS (1) ──────→ (many) MIX_SUBMISSIONS

QUIZZES (1) ──────→ (many) QUIZ_QUESTIONS
QUIZZES (1) ──────→ (many) QUIZ_RESULTS

SUBSCRIPTIONS (1) ──→ (many) PAYMENTS
```

---

## 4. API Specification (RESTful)

### 4.1 Authentication Endpoints

```
POST /api/auth/signup
├── Description: Register new user
├── Method: POST
├── Request:
│   {
│     "email": "user@example.com",
│     "password": "SecurePass123!",
│     "full_name": "John Doe",
│     "language": "he"
│   }
├── Response (201):
│   {
│     "user_id": "uuid-123",
│     "email": "user@example.com",
│     "access_token": "jwt-token",
│     "refresh_token": "refresh-token",
│     "expires_in": 3600
│   }
└── Error (400, 409): Validation or user exists

POST /api/auth/login
├── Description: Login with email/password
├── Method: POST
├── Request:
│   {
│     "email": "user@example.com",
│     "password": "SecurePass123!"
│   }
├── Response (200):
│   {
│     "user_id": "uuid-123",
│     "access_token": "jwt-token",
│     "refresh_token": "refresh-token",
│     "expires_in": 3600
│   }
└── Error (401): Invalid credentials

POST /api/auth/refresh
├── Description: Refresh access token
├── Method: POST
├── Headers: Authorization: Bearer {refresh_token}
├── Response (200):
│   {
│     "access_token": "jwt-new-token",
│     "expires_in": 3600
│   }
└── Error (401): Invalid refresh token

POST /api/auth/logout
├── Description: Logout user (invalidate refresh token)
├── Method: POST
├── Headers: Authorization: Bearer {access_token}
├── Response (200): { "message": "Logged out successfully" }
└── Error (401): Not authenticated

POST /api/auth/magic-link
├── Description: Send magic link for passwordless login
├── Method: POST
├── Request:
│   {
│     "email": "user@example.com",
│     "redirect_to": "https://djmaster.academy/dashboard"
│   }
├── Response (200): { "message": "Magic link sent to email" }
└── Error (400, 429): Invalid email or rate limited

GET /api/auth/oauth/google
├── Description: OAuth redirect to Google
├── Method: GET
└── Query: redirect_uri, state

POST /api/auth/profile
├── Description: Get authenticated user profile
├── Method: GET
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "id": "uuid-123",
│     "email": "user@example.com",
│     "full_name": "John Doe",
│     "avatar_url": "https://...",
│     "plan": "pro_monthly",
│     "plan_expires_at": "2026-06-13",
│     "created_at": "2024-03-13T00:00:00Z"
│   }
└── Error (401): Not authenticated
```

### 4.2 Courses & Lessons Endpoints

```
GET /api/courses
├── Description: List all published courses
├── Query params:
│   - level: beginner|intermediate|advanced
│   - category: fundamentals|production|performance|business
│   - page: 1 (default)
│   - limit: 10 (default)
├── Response (200):
│   {
│     "data": [
│       {
│         "id": 1,
│         "slug": "dj-fundamentals",
│         "title": "DJ Fundamentals",
│         "description": "...",
│         "level": "beginner",
│         "duration_minutes": 120,
│         "thumbnail_url": "https://...",
│         "lessons_count": 8,
│         "user_progress": { "completed": 3, "percentage": 37 }
│       }
│     ],
│     "pagination": {
│       "page": 1,
│       "limit": 10,
│       "total": 24,
│       "pages": 3
│     }
│   }
└── Error (401): Not authenticated for progress info

GET /api/courses/{courseId}
├── Description: Get course details with lessons
├── Response (200):
│   {
│     "id": 1,
│     "slug": "dj-fundamentals",
│     "title": "DJ Fundamentals",
│     "description": "Learn the basics...",
│     "level": "beginner",
│     "duration_minutes": 120,
│     "lessons": [
│       {
│         "id": 1,
│         "slug": "lesson-1",
│         "title": "Getting Started",
│         "is_free": true,
│         "duration_seconds": 600,
│         "is_completed": true
│       }
│     ]
│   }
└── Error (404): Course not found

GET /api/lessons/{lessonId}
├── Description: Get lesson details and video
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "id": 1,
│     "course_id": 1,
│     "title": "Getting Started",
│     "description": "...",
│     "duration_seconds": 600,
│     "mux_playback_id": "playback-id",
│     "mux_signed_url": "https://image.mux.com/...",
│     "transcript": "...",
│     "resources": [
│       {
│         "title": "Cheatsheet",
│         "url": "https://..."
│       }
│     ]
│   }
└── Error (401, 403): Not authenticated or no access

POST /api/lessons/{lessonId}/watch
├── Description: Update lesson progress
├── Method: POST
├── Request:
│   {
│     "progress_seconds": 300,
│     "completed": false
│   }
├── Response (200):
│   {
│     "user_id": "uuid-123",
│     "lesson_id": 1,
│     "progress_percentage": 50,
│     "completed": false,
│     "updated_at": "2026-03-13T12:00:00Z"
│   }
└── Error (401, 404): Not authenticated or lesson not found
```

### 4.3 Quiz Endpoints

```
GET /api/quizzes/{quizId}
├── Description: Get quiz questions (not answers)
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "id": 1,
│     "lesson_id": 1,
│     "title": "Lesson Quiz",
│     "passing_score": 80,
│     "questions": [
│       {
│         "id": 1,
│         "question_text": "What is BPM?",
│         "question_type": "multiple_choice",
│         "options": ["Option A", "Option B", "Option C"]
│       }
│     ],
│     "user_results": {
│       "attempts": 1,
│       "best_score": 85,
│       "passed": true
│     }
│   }
└── Error (401, 403): Not authorized

POST /api/quizzes/{quizId}/submit
├── Description: Submit quiz answers
├── Method: POST
├── Request:
│   {
│     "answers": [
│       { "question_id": 1, "answer": "Option A" },
│       { "question_id": 2, "answer": "true" }
│     ]
│   }
├── Response (200):
│   {
│     "score": 85,
│     "passed": true,
│     "feedback": "Great job! You passed with 85%",
│     "results": {
│       "total_questions": 10,
│       "correct": 8,
│       "incorrect": 2
│     }
│   }
└── Error (400, 401, 429): Invalid, unauthorized, or rate limited
```

### 4.4 Subscription Endpoints

```
POST /api/subscriptions/create
├── Description: Create subscription (Stripe checkout)
├── Method: POST
├── Headers: Authorization: Bearer {access_token}
├── Request:
│   {
│     "plan": "pro_monthly",
│     "coupon_code": "LAUNCH50" (optional),
│     "success_url": "https://djmaster.academy/success",
│     "cancel_url": "https://djmaster.academy/pricing"
│   }
├── Response (200):
│   {
│     "checkout_url": "https://checkout.stripe.com/...",
│     "session_id": "cs_live_..."
│   }
└── Error (400, 401): Invalid plan or not authenticated

GET /api/subscriptions/current
├── Description: Get user's current subscription
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "id": "sub_123",
│     "plan": "pro_monthly",
│     "status": "active",
│     "current_period_start": "2026-02-13",
│     "current_period_end": "2026-03-13",
│     "amount_cents": 7900,
│     "currency": "ILS"
│   }
└── Error (401, 404): Not authenticated or no subscription

POST /api/subscriptions/{subscriptionId}/cancel
├── Description: Cancel subscription (at period end)
├── Method: POST
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "id": "sub_123",
│     "status": "active",
│     "cancel_at_period_end": true,
│     "current_period_end": "2026-03-13"
│   }
└── Error (401, 403): Not authorized
```

### 4.5 Achievements & Certificates Endpoints

```
GET /api/achievements
├── Description: Get user's achievements
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "achievements": [
│       {
│         "id": 1,
│         "type": "first_lesson",
│         "title": "First Step",
│         "icon_url": "https://...",
│         "unlocked_at": "2026-03-13T00:00:00Z"
│       }
│     ],
│     "total_unlocked": 5
│   }
└── Error (401): Not authenticated

GET /api/certificates
├── Description: List user's certificates
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "certificates": [
│       {
│         "id": 1,
│         "course_title": "DJ Fundamentals",
│         "completion_date": "2026-03-01",
│         "certificate_url": "https://djmaster.academy/cert/abc123",
│         "verification_url": "https://djmaster.academy/verify/abc123",
│         "shared": true
│       }
│     ]
│   }
└── Error (401): Not authenticated

POST /api/certificates/{certificateId}/share
├── Description: Generate shareable link
├── Method: POST
├── Response (200):
│   {
│     "share_url": "https://djmaster.academy/cert/abc123",
│     "shared": true
│   }
└── Error (401, 404): Not authorized or certificate not found
```

### 4.6 Community Endpoints

```
GET /api/community/posts
├── Description: Get community posts (paginated)
├── Query params:
│   - category: questions|tips|showcases|events
│   - sort: latest|trending|oldest
│   - page: 1
│   - limit: 20
├── Response (200):
│   {
│     "posts": [
│       {
│         "id": 1,
│         "user": { "id": "uuid-123", "username": "dj_user", "avatar": "https://..." },
│         "title": "How to beatmatch?",
│         "content": "...",
│         "category": "questions",
│         "likes_count": 42,
│         "replies_count": 7,
│         "created_at": "2026-03-13T00:00:00Z"
│       }
│     ],
│     "pagination": { "page": 1, "limit": 20, "total": 156 }
│   }
└── Error: None (public endpoint)

POST /api/community/posts
├── Description: Create community post
├── Method: POST
├── Headers: Authorization: Bearer {access_token}
├── Request:
│   {
│     "title": "How to beatmatch?",
│     "content": "I'm struggling with...",
│     "category": "questions"
│   }
├── Response (201):
│   {
│     "id": 123,
│     "user_id": "uuid-123",
│     "title": "How to beatmatch?",
│     "created_at": "2026-03-13T12:00:00Z"
│   }
└── Error (401, 400): Not authenticated or invalid data

POST /api/community/posts/{postId}/like
├── Description: Like a post
├── Method: POST
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "post_id": 123,
│     "likes_count": 43,
│     "user_liked": true
│   }
└── Error (401, 404): Not authorized or post not found
```

### 4.7 Mix Submissions Endpoints

```
POST /api/mixes/submit
├── Description: Upload a mix
├── Method: POST
├── Headers:
│   - Authorization: Bearer {access_token}
│   - Content-Type: multipart/form-data
├── Form data:
│   - audio_file: File (mp3, wav, max 50MB)
│   - title: string
│   - description: string
│   - genre: string
│   - lesson_id: integer (optional)
├── Response (201):
│   {
│     "id": 1,
│     "title": "My First Mix",
│     "audio_url": "https://storage.djmaster.academy/mixes/...",
│     "status": "pending",
│     "created_at": "2026-03-13T12:00:00Z"
│   }
└── Error (400, 401, 413): Invalid, unauthorized, or file too large

GET /api/mixes
├── Description: Get user's mix submissions
├── Headers: Authorization: Bearer {access_token}
├── Query: status=pending|approved|rejected, page=1
├── Response (200):
│   {
│     "mixes": [
│       {
│         "id": 1,
│         "title": "My First Mix",
│         "status": "approved",
│         "audio_url": "https://...",
│         "feedback": "Great energy! ...",
│         "likes_count": 12
│       }
│     ]
│   }
└── Error (401): Not authenticated
```

### 4.8 Tools Endpoints

```
GET /api/tools/bpm-calculator
├── Description: Get BPM calculation history
├── Headers: Authorization: Bearer {access_token} (optional)
├── Response (200):
│   {
│     "history": [
│       {
│         "taps": [100, 200, 300],
│         "calculated_bpm": 120,
│         "created_at": "2026-03-13T12:00:00Z"
│       }
│     ]
│   }
└── Error: None

GET /api/tools/harmonic-wheel
├── Description: Get harmonic wheel data
├── Response (200):
│   {
│     "keys": [
│       {
│         "key": "A",
│         "compatible_keys": ["E", "D", "B", "F#"]
│       }
│     ]
│   }
└── Error: None
```

### 4.9 Search Endpoints

```
GET /api/search
├── Description: Global search (courses, lessons, posts)
├── Query params:
│   - q: search query (required)
│   - type: courses|lessons|posts|community
│   - limit: 10
├── Response (200):
│   {
│     "results": [
│       {
│         "type": "lesson",
│         "id": 1,
│         "title": "...",
│         "description": "...",
│         "url": "..."
│       }
│     ]
│   }
└── Error (400): Missing query

GET /api/analytics/dashboard
├── Description: Get user analytics (dashboard stats)
├── Headers: Authorization: Bearer {access_token}
├── Response (200):
│   {
│     "total_courses": 8,
│     "courses_completed": 2,
│     "lessons_completed": 24,
│     "achievements_unlocked": 5,
│     "study_streak_days": 7,
│     "total_study_hours": 42.5
│   }
└── Error (401): Not authenticated
```

---

## 5. Authentication Flow

### 5.1 JWT + Refresh Tokens

```
User Signup/Login
├── POST /api/auth/login
├── ↓
├── Backend validates credentials
├── ↓
├── Generate JWT (15 min expiry)
├── Generate Refresh Token (7 days expiry, stored in DB)
├── ↓
└── Return { access_token, refresh_token, expires_in }

Authenticated Request
├── Send: Authorization: Bearer {access_token}
├── ↓
├── Middleware validates JWT signature + expiry
├── ↓
├── ✓ Valid → Proceed with request
├── ✗ Expired → Return 401
└── ↓ (Frontend detects 401)

Token Refresh
├── POST /api/auth/refresh
├── Send: Bearer {refresh_token}
├── ↓
├── Validate refresh token in DB
├── ↓
├── Generate new access_token
└── Return { access_token, expires_in }

Token Expiry Cycle
└── access_token → expires 15 min → Frontend calls refresh
└── refresh_token → expires 7 days → User must login again
```

### 5.2 OAuth 2.0 (Google)

```
Click "Sign in with Google"
├── Redirect to: /api/auth/oauth/google?redirect_uri=...&state={random}
├── ↓
├── User authorizes on Google
├── ↓
├── Google redirects to: /api/auth/callback?code={auth_code}&state={state}
├── ↓
├── Backend validates state + code
├── ↓
├── Exchange code for Google tokens
├── ↓
├── Get user info (email, name, avatar)
├── ↓
├── Create/update user in Supabase
├── ↓
└── Generate DJMaster JWT + Refresh token → Redirect to dashboard
```

### 5.3 Magic Links (Passwordless)

```
User enters email → POST /api/auth/magic-link
├── Generate token (valid 30 min)
├── Store in supabase.auth.users → email_confirmed_at
├── Send email: "Click here to login: https://djmaster.academy/auth/callback?token={token}"
├── ↓
User clicks link
├── Frontend: GET /api/auth/callback?token={token}
├── ↓
Backend validates token
├── ↓
├── Create session
├── ↓
└── Redirect to dashboard with access_token
```

---

## 6. Security Layer

### 6.1 Authentication & Authorization

- **JWT Tokens**: HS256 signature, verified on every request
- **Refresh Tokens**: Stored in Supabase `auth.refresh_tokens` table with expiry
- **Row Level Security (RLS)**: Every table has RLS policies
  - Users can only see their own data
  - Public courses are visible to all
  - Quizzes restricted to enrolled users
- **OAuth**: Google OAuth 2.0 for federated auth
- **Email Verification**: Magic links for passwordless login

### 6.2 Rate Limiting

```
Global Rate Limit
├── 100 requests per IP per 15 min
├── Enforced at Cloudflare level

Per-Endpoint Limits
├── /api/auth/login: 5 attempts per IP per 15 min
├── /api/auth/magic-link: 3 per email per hour
├── /api/mixes/submit: 10 uploads per user per day
├── /api/community/posts: 20 posts per user per day
```

### 6.3 CORS Policy

```javascript
// Allow requests from
- https://djmaster.academy
- https://www.djmaster.academy
- http://localhost:3000 (dev only)

// Allowed methods: GET, POST, PUT, DELETE, OPTIONS
// Allowed headers: Content-Type, Authorization
// Credentials: true (for cookies)
```

### 6.4 Input Validation

```typescript
// All inputs validated via Zod schemas
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  full_name: z.string().min(2).max(100)
});

// File uploads
- Max size: 50MB (audio), 5MB (images)
- Allowed types: audio/mp3, audio/wav, image/jpeg, image/png
- Scanned for malware via VirusTotal API
```

### 6.5 XSS/CSRF Protection

```
CSRF Tokens
├── Generated per session
├── Stored in HTTP-only cookie
├── Validated on state-changing requests

XSS Prevention
├── Sanitize all user inputs (DOMPurify)
├── Escape output in templates
├── Content Security Policy headers
├── No inline scripts

Content Security Policy
├── script-src 'self' https://cdn.*.com
├── style-src 'self' https://fonts.googleapis.com
├── img-src 'self' data: https:
├── connect-src 'self' https://api.*.com
```

### 6.6 Data Encryption

```
In Transit
├── HTTPS/TLS 1.3 (automatic on Vercel)
├── All API calls encrypted

At Rest
├── Database (Supabase PostgreSQL)
│   ├── Encryption enabled
│   ├── Backups encrypted
├── Storage (Supabase S3)
│   ├── Server-side encryption (AES-256)
├── Sensitive fields
│   ├── Passwords: bcrypt + salt
│   ├── Stripe tokens: tokenized + not stored
│   ├── API keys: encrypted via Vercel secrets
```

---

## 7. Caching Strategy

### 7.1 Redis (Sessions & Rate Limiting)

```
Cache Keys
├── session:{user_id} → User session data (24h TTL)
├── rate_limit:{endpoint}:{ip} → Request count (15 min TTL)
├── user_subscriptions:{user_id} → Subscription info (1h TTL)
├── course_catalog:{page} → Course list (6h TTL)

Invalidation
├── On user logout → Delete session:*
├── On subscription change → Delete user_subscriptions:*
└── Cron job → Cleanup expired keys nightly
```

### 7.2 CDN Caching (Cloudflare)

```
Static Assets (Cache-Control: max-age=31536000)
├── /public/images/* → 1 year
├── /_next/static/* → 1 year (immutable)
├── /fonts/* → 1 year

Dynamic Content (Cache-Control: max-age=3600)
├── /api/courses → 1 hour
├── /api/lessons/{id} → 30 min
├── /api/community/posts → 5 min

No Cache
├── /api/auth/* → no-cache
├── /api/user/profile → no-cache
├── /api/subscriptions/current → no-cache
```

### 7.3 Browser Caching

```
Service Worker
├── Cache app shell on first load
├── Offline support for cached pages
├── Background sync for failed requests

Versioning
├── CSS/JS: Hashed filenames (/main.abc123def.js)
├── Images: Content-hash based
└── No need for manual cache busting
```

---

## 8. Error Handling & Logging

### 8.1 Standardized Error Codes

```
1xx - Informational (continue_processing)
2xx - Success (200_ok, 201_created)
4xx - Client Error
├── 400_bad_request: Invalid input
├── 401_unauthorized: Missing/invalid auth
├── 403_forbidden: Insufficient permissions
├── 404_not_found: Resource doesn't exist
├── 409_conflict: Resource already exists (email taken)
├── 429_rate_limited: Too many requests
├── 413_payload_too_large: File > max size
5xx - Server Error
├── 500_internal_error: Unexpected error
├── 503_service_unavailable: Maintenance
```

### 8.2 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "not-an-email"
    }
  },
  "trace_id": "trace_uuid_for_debugging"
}
```

### 8.3 Logging (Sentry + Vercel)

```
Sentry Configuration
├── Log all exceptions + errors
├── Performance monitoring (LCP, FCP, TTFB)
├── Session replay (sample 10% of users)
├── Breadcrumbs (user actions leading to error)

Vercel Function Logs
├── Stdout/stderr → Vercel dashboard
├── Queryable via Vercel logs API
├── 30-day retention

Custom Logging
├── Winston logger for structured logs
├── Log level: DEBUG (dev), INFO (prod)
├── Include: timestamp, user_id, endpoint, duration, status
```

---

## 9. Deployment Pipeline (CI/CD)

### 9.1 GitHub Actions

```yaml
Trigger: Push to main / Pull Request

Steps:
1. Checkout code
2. Install dependencies (pnpm)
3. Run linter (ESLint)
4. Run tests (Jest)
5. Build project (next build)
6. Run type check (tsc --noEmit)
7. Deploy to Vercel (auto on main)
8. Run E2E tests (Playwright) on staging
9. Smoke tests on production

On Failure
├── Notify Slack #deployments
├── Comment on PR with error
└── Rollback (automatic on errors)
```

### 9.2 Environment Strategy

```
Development (localhost:3000)
├── No analytics
├── Mock payment (Stripe test mode)
├── Verbose logging
├── Hot reload enabled

Staging (staging.djmaster.academy)
├── Real Stripe (test card)
├── Real Supabase (test data)
├── E2E tests before merge
├── Performance benchmarks

Production (djmaster.academy)
├── Real Stripe + payments
├── Real Supabase data
├── Analytics enabled
├── Error tracking enabled
└── Automatic backups 3x daily
```

---

## 10. Infrastructure

### 10.1 Deployment Stack

```
Frontend: Vercel
├── Auto-scaling serverless functions
├── Global CDN (75+ edge locations)
├── Automatic SSL/TLS
├── Deployments on every git push
├── Preview deployments for PRs

Backend: Supabase (PostgreSQL)
├── Managed PostgreSQL 15
├── Auto-backups (hourly + daily)
├── 99.99% SLA
├── DDoS protection included

Storage: Supabase S3 + Cloudflare
├── S3-compatible object storage
├── Cloudflare R2 for cost savings ($0.015/GB)
├── Auto-expiry for temp files (7 days)
└── CDN acceleration

Video: Mux
├── Video storage + streaming
├── Signed URLs (24h expiry)
├── HLS + DASH streaming
├── DRM (optional premium content)
├── Analytics per video
```

### 10.2 Infrastructure Diagram

```
┌────────────────────────────────────────────────────┐
│            Cloudflare (Global CDN)                 │
│  - DDoS Protection                                 │
│  - Rate Limiting                                   │
│  - WAF Rules                                       │
└──────────────┬─────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│        Vercel (Frontend + Functions)                │
│  - Next.js 14 (App Router)                         │
│  - Edge Functions (middleware)                      │
│  - Auto-scaling                                     │
│  - Global CDN                                       │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
┌───▼───┐ ┌───▼────┐ ┌──▼──┐ ┌───▼──┐
│Supabase│ │  Mux  │ │Redis│ │Stripe│
│ (DB)   │ │(Video)│ │Cache│ │(Pay) │
└────────┘ └───────┘ └─────┘ └──────┘
```

---

## 11. Monitoring & Observability

### 11.1 Health Checks

```
Endpoint Health Checks
├── Every 30 seconds
├── Check: /api/health → { "status": "ok", "timestamp" }
├── Response time: < 200ms
├── Success rate: > 99.5%

Database Health
├── Connection pool: max 20 connections
├── Query performance: P99 < 500ms
├── Replication lag: < 1s

API Availability
├── Monitored by Better Uptime
├── Alerts if downtime > 2 min
├── Slack notifications
```

### 11.2 Performance Metrics

```
Web Vitals (Tracked by Vercel Analytics)
├── Largest Contentful Paint (LCP): < 2.5s
├── First Input Delay (FID): < 100ms
├── Cumulative Layout Shift (CLS): < 0.1
├── First Contentful Paint (FCP): < 1.8s

Backend Performance
├── API response time (p50): < 100ms
├── API response time (p99): < 500ms
├── Database query time: < 200ms
├── Video serving: < 1s to first frame

Resource Usage
├── Frontend bundle size: < 200KB
├── Edge function: < 10MB RAM
├── Database storage: Monitor monthly
```

### 11.3 Error Tracking (Sentry)

```
Configured Alerts
├── Error rate > 0.1% → Alert
├── Specific error threshold > 10 in 5 min → Alert
├── Performance degradation > 50% → Alert

Reporting
├── Daily digest email (top 5 errors)
├── Slack #errors-critical for P0
├── Quarterly incident review
```

---

## 12. Next Steps (Implementation Order)

**Phase 2A (Weeks 1-4)**
1. Setup Supabase project + schema
2. Deploy frontend to Vercel
3. Implement auth (JWT + magic links)
4. Build course player + progress tracking
5. Stripe integration

**Phase 2B (Weeks 5-8)**
1. Launch community features
2. Implement quizzes + achievements
3. Add certificates
4. Setup monitoring (Sentry, Vercel)
5. Load testing + optimization

---

## Appendix: Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| **Frontend Framework** | Next.js 14 | App Router, Server Components, edge functions |
| **Language** | TypeScript | Type safety, better DX, fewer bugs |
| **Styling** | Tailwind CSS | Utility-first, fast development, small bundle |
| **Database** | PostgreSQL | Relational, RLS support, Supabase managed |
| **Auth** | Supabase Auth | Built-in, JWT, OAuth, passwordless |
| **Payment** | Stripe | Best Hebrew support, webhooks, powerful API |
| **Video** | Mux | HLS streaming, signed URLs, DRM-ready |
| **Storage** | Supabase S3 | Integrated, simple API, cost-effective |
| **Monitoring** | Sentry | Error tracking, performance monitoring |
| **Analytics** | Mixpanel | Event tracking, funnel analysis, cohorts |
