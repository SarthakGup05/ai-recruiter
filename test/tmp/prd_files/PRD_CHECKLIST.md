# HireAI — PRD Checklist

> Last updated: **2026-02-25**
> Update this file daily to track progress.

---

## Legend

- ✅ Done
- 🔨 In Progress
- ⬜ Not Started
- ❌ Blocked / Deferred

---

## Sprint 1: Foundation & Core (Target: Week 1)

### 1.1 Project Setup

- ✅ Next.js 16 + TypeScript + Tailwind CSS
- ✅ PostgreSQL + Drizzle ORM setup
- ✅ Database schema (users, jobs, applications, interviews, evaluations, calendar_events)
- ✅ Environment config (.env with DATABASE_URL, JWT_SECRET)
- ✅ Drizzle config + migration support

### 1.2 Authentication

- ✅ Registration page + API (`/register`, `POST /api/auth/register`)
- ✅ Login page + API (`/login`, `POST /api/auth/login`)
- ✅ Logout API (`POST /api/auth/logout`)
- ✅ JWT-based session management (cookie: `hireai-token`)
- ✅ Password hashing with bcrypt
- ✅ Route protection middleware (`/dashboard/*`, `/job/*`)
- ❌ OAuth (Google/LinkedIn) — deferred to future sprint

### 1.3 Marketing Site

- ✅ Landing page with hero, features, how-it-works, pricing
- ✅ Responsive marketing header with mobile menu
- ✅ Marketing footer
- ✅ Careers link in navigation

---

## Sprint 2: Recruiter Dashboard & Job Management (Target: Week 2)

### 2.1 Recruiter Dashboard

- ✅ Dashboard layout with collapsible sidebar
- ✅ Stat cards (Total Jobs, Applications, Interviews Done, Avg Match Score)
- ✅ Candidate pipeline kanban board (Applied → Matched → Scheduled → Interviewed → Decision)
- ✅ Real-time data from database (server component)
- ✅ "Post New Job" button in sidebar
- ✅ Dashboard search/filter functionality (Jobs and Candidates lists)
- ⬜ Date range filter for stats
- ⬜ Export pipeline data (CSV)

### 2.2 Job CRUD

- ✅ Create job form (`/job/new`) with all fields
- ✅ Job detail page (`/job/[id]`) with applications table
- ✅ AI Interview Config (match threshold, duration, custom questions)
- ✅ Save as Draft / Publish flow
- ✅ API: `GET/POST /api/jobs`, `GET/PATCH/DELETE /api/jobs/[id]`
- ✅ Soft delete (archive) for jobs
- ✅ Auto-generated public slug per job
- ⬜ Edit job page (pre-filled form)
- ⬜ Duplicate job functionality
- ⬜ Job analytics (views, application rate)

### 2.3 Application Management

- ✅ API: `POST /api/applications`, `GET/PATCH /api/applications/[id]`
- ✅ Applications table on job detail page
- ✅ Status badges with color coding
- ✅ Match score display
- ⬜ Drag-and-drop kanban for individual job pipeline
- ⬜ Bulk status update
- ✅ Application detail modal/page (Fully redesigned with AI insights)
- ⬜ Email notifications to candidates

---

## Sprint 3: Public Job Board (Target: Week 2-3)

### 3.1 Careers Page

- ✅ Public job listing page (`/careers`)
- ✅ Job cards with title, location, type, salary
- ✅ Empty state for no open positions
- ⬜ Search / filter by department, location, type
- ⬜ Pagination for large job lists

### 3.2 Application Flow

- ✅ Apply page (`/apply/[slug]`) with job preview + form
- ✅ Public API: `GET /api/public/jobs`, `GET /api/public/jobs/[slug]`
- ✅ Application submission to database
- ✅ Success confirmation screen
- ⬜ CV upload to cloud storage (currently client-side only)
- ⬜ CV parsing integration with `/api/parse-cv`
- ⬜ Application confirmation email

---

## Sprint 4: AI Interview System (Target: Week 3-4)

### 4.1 AI Interview

- ✅ Interview scheduling flow (recruiter triggers)
- ⬜ Interview invitation email to candidate
- ✅ AI interview room (`/room/[token]`) — real-time chat
- ✅ AI question generation based on job requirements + custom questions
- ✅ Interview timer (configurable duration)
- ✅ Interview transcript recording

### 4.2 Evaluation

- ✅ AI-powered candidate evaluation
- ✅ Match score calculation based on CV + interview
- ✅ Evaluation detail page with scores breakdown
- ✅ AI-generated recommendation (hire/reject/maybe)

---

## Sprint 5: Calendar & Scheduling (Target: Week 4-5)

- ⬜ Calendar view for scheduled interviews
- ⬜ Google Calendar integration
- ⬜ Webhook handler for calendar sync (`/api/webhooks/calendar`)
- ⬜ Availability management for recruiters
- ⬜ Candidate timezone detection

---

## Sprint 6: Polish & Scale (Target: Week 5-6)

### 6.1 UX Improvements

- ⬜ Dark mode toggle
- ✅ Global search (Implemented in Jobs and Candidates dashboard pages)
- ⬜ Notifications panel
- ⬜ Onboarding flow for new recruiters
- ✅ Mobile-responsive dashboard improvements

### 6.2 Security & Performance

- ⬜ Rate limiting on public endpoints
- ⬜ Input sanitization / XSS protection
- ⬜ Database indexes for query performance
- ⬜ Image/avatar upload (S3 or similar)
- ⬜ Error boundary components

### 6.3 Analytics & Reporting

- ⬜ Recruiter analytics dashboard (hire rate, time-to-hire)
- ⬜ Job posting performance metrics
- ⬜ Pipeline conversion funnel chart
- ⬜ Weekly email summary for recruiters

---

## Future Sprints

- ⬜ OAuth (Google / LinkedIn) authentication
- ⬜ Team collaboration (multiple recruiters per org)
- ⬜ Role-based access control (admin, recruiter, viewer)
- ⬜ API key management for third-party integrations
- ⬜ Job board embedding (widget for external sites)
- ⬜ Multi-language support
- ⬜ Candidate self-service portal
