# HireAI — The Intelligent Recruitment Platform

HireAI is a premium, AI-powered recruitment engine designed to streamline the hiring process from job posting to final evaluation. Leveraging the power of Google Gemini, HireAI automates candidate screening, match scoring, and first-stage interviews, allowing recruiters to focus on top talent.

![Hero Image](file:///d:/app/ai-recruiter/public/hero-preview.png) _(Note: Placeholder for actual hero image if available)_

## 🚀 Key Features

### 🤖 AI-Powered Intelligence

- **Intelligent CV Parsing**: Automatic extraction of skills, experience, and education from PDF/DOCX resumes.
- **Precision Match Scoring**: Weighted scoring (Skills 40%, Experience 30%, Education 15%, Soft Skills 15%) comparing candidates directly against Job Descriptions.
- **AI Interview Room**: A real-time, LLM-powered chat environment where an AI interviewer screens candidates based on specific JD requirements.
- **Automated Evaluations**: Detailed post-interview reports including Strengths, Concerns, Notable Quotes, and automated Hire/No-Hire recommendations.

### 💼 Recruiter Command Center

- **Interactive Kanban Pipeline**: Manage candidates through a visual "Applied → Matched → Scheduled → Interviewed → Decision" funnel.
- **Job Management Dashboard**: Complete CRUD for job roles with search, filtering, and status management (Active, Draft, Archived).
- **Global Candidate Search**: Real-time filtering across your entire candidate pool by name, email, or role.
- **Premium Aesthetics**: A stunning "Indigo-Violet" design system featuring glassmorphism, smooth animations, and responsive layouts.

### 🌐 Candidate Experience

- **Public Career Portal**: Professional job listing page for your company.
- **Seamless Application Flow**: Quick, mobile-responsive forms for candidate submissions.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/)
- **Authentication**: JWT-based session management using `jose` and `bcryptjs`
- **Notifications**: [Sonner](https://sonner.stevenly.me/)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Google Gemini API Key

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/ai-recruiter.git
   cd ai-recruiter
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/hireai
   JWT_SECRET=your-secure-random-string
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Initialize the database:**

   ```bash
   npx drizzle-kit push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```bash
├── app/               # Next.js App Router (Pages & API Routes)
├── components/        # Reusable UI Components
├── lib/               # Shared logic & AI Engine
│   ├── ai/            # Gemini-powered matching and interview logic
│   └── auth.ts        # Authentication helpers
├── public/            # Static assets
├── utils/             # Utility functions & Database config
│   └── db/            # Drizzle schema and connection
├── .env               # Environment secrets
└── drizzle.config.ts  # Database migration config
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

_Powered by [Gemini AI](https://ai.google.dev/)_
