# HireAI — Feature Walkthrough

> Last updated: **2026-02-24**

---

## 1. Marketing & Landing

| Route | Description                                                                    |
| ----- | ------------------------------------------------------------------------------ |
| `/`   | Marketing landing page with hero, features, how-it-works, and pricing sections |

- Gradient hero with CTA buttons (Get Started / Sign In)
- Navigation links: Features, How it Works, Pricing, **Careers**
- Responsive mobile menu with hamburger toggle

---

## 2. Authentication

| Route                     | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `/login`                  | Email + password login                         |
| `/register`               | New account registration                       |
| `POST /api/auth/login`    | Validates credentials, returns JWT cookie      |
| `POST /api/auth/register` | Creates user with hashed password, returns JWT |
| `POST /api/auth/logout`   | Clears session cookie                          |

- **JWT-based** session stored in `hireai-token` cookie
- Passwords hashed with **bcrypt**
- Middleware protects `/dashboard/*` and `/job/*` routes
- Auto-redirect to `/login` if unauthenticated

---

## 3. Recruiter Dashboard

| Route        | Description                          |
| ------------ | ------------------------------------ |
| `/dashboard` | Main recruiter dashboard (protected) |

### Features

- **Stat Cards** — Total Jobs, Applications, Interviews Done, Avg. Match Score
- **Kanban Board** — Candidate pipeline with columns: Applied → Matched → Scheduled → Interviewed → Decision
- **Sidebar** — Collapsible navigation with HireAI branding, Post New Job button, nav links, sign out
- All data is **real** — fetched from PostgreSQL via Drizzle ORM
- Server component with 5 parallel DB queries for performance

---

## 4. Job Management

| Route       | Description                                |
| ----------- | ------------------------------------------ |
| `/job/new`  | Create a new job posting (protected)       |
| `/job/[id]` | View job detail + applications (protected) |

### Job Creation (`/job/new`)

- **Basic Info** — Title, department, location, employment type, salary range
- **Job Details** — Description, requirements, responsibilities
- **AI Interview Config** — Match threshold (%), interview duration (15/30/45/60 min), custom questions (up to 10)
- **Two submit modes**: Publish (active) or Save as Draft

### Job Detail (`/job/[id]`)

- **Applications tab** — Table of all applicants (name, email, score, status, date)
- **Job Details tab** — Full description, requirements, responsibilities
- **Settings tab** — Match threshold, interview duration, custom questions list
- Status badge, public link button, edit button
- Empty state when no applications yet

---

## 5. Public Job Board (Applicant-Facing)

| Route           | Description                       |
| --------------- | --------------------------------- |
| `/careers`      | Public listing of all active jobs |
| `/apply/[slug]` | Job detail + application form     |

### Careers Page (`/careers`)

- Hero with gradient text and open positions count
- Job cards with title, department badge, location, type, salary
- Links directly to the apply page
- No login required

### Apply Page (`/apply/[slug]`)

- Full job details: description, requirements, responsibilities
- Application form: name, email, phone, LinkedIn, CV upload
- Loading, not-found, and success confirmation states
- Submits to `POST /api/applications`

---

## 6. API Endpoints

### Jobs (Protected — Recruiter)

| Method   | Endpoint         | Description                                           |
| -------- | ---------------- | ----------------------------------------------------- |
| `GET`    | `/api/jobs`      | List all jobs for current user (with applicant count) |
| `POST`   | `/api/jobs`      | Create new job (auto-generates public slug)           |
| `GET`    | `/api/jobs/[id]` | Get single job by ID                                  |
| `PATCH`  | `/api/jobs/[id]` | Update job fields                                     |
| `DELETE` | `/api/jobs/[id]` | Soft-delete (archive)                                 |

### Jobs (Public — Applicants)

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| `GET`  | `/api/public/jobs`        | List all active jobs   |
| `GET`  | `/api/public/jobs/[slug]` | Get job by public slug |

### Applications

| Method  | Endpoint                 | Description                    |
| ------- | ------------------------ | ------------------------------ |
| `POST`  | `/api/applications`      | Submit an application (public) |
| `GET`   | `/api/applications/[id]` | Get application details        |
| `PATCH` | `/api/applications/[id]` | Update status / match score    |

### Other

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| `POST` | `/api/ai-chat`           | AI chat endpoint         |
| `POST` | `/api/parse-cv`          | CV parsing endpoint      |
| `POST` | `/api/webhooks/calendar` | Calendar webhook handler |

---

## 7. Database Schema

| Table             | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| `users`           | Recruiter accounts (name, email, password hash, role, avatar)         |
| `jobs`            | Job postings (title, dept, location, salary, status, slug, AI config) |
| `applications`    | Candidate applications (name, email, CV data, match score, status)    |
| `interviews`      | AI interview sessions (status, scheduled time, duration)              |
| `evaluations`     | Interview evaluations (scores, feedback, recommendation)              |
| `calendar_events` | Scheduled events linked to interviews                                 |

**Tech Stack**: PostgreSQL + Drizzle ORM, connected via `utils/db/index.ts`

---

## 8. UI Components

| Component       | Location                                                                |
| --------------- | ----------------------------------------------------------------------- |
| AppSidebar      | `components/app-sidebar.tsx` — Collapsible sidebar with animated labels |
| StatCard        | `components/stat-card.tsx` — Metric display card with icon              |
| KanbanBoard     | `components/kanban-board.tsx` — Pipeline visualization                  |
| CvUpload        | `components/cv-upload.tsx` — Drag-and-drop file upload                  |
| MarketingHeader | `components/marketing-header.tsx` — Landing page nav                    |
| MarketingFooter | `components/marketing-footer.tsx` — Landing page footer                 |

---

## 9. Interview Room (Stubbed)

| Route           | Description                                               |
| --------------- | --------------------------------------------------------- |
| `/room/[token]` | AI interview room (exists but not yet wired to real data) |
