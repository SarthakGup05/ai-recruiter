import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["recruiter", "admin"]);

export const jobStatusEnum = pgEnum("job_status", [
  "draft",
  "active",
  "archived",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "remote",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "matched",
  "scheduled",
  "interviewed",
  "decision",
  "rejected",
  "hired",
]);

export const interviewStatusEnum = pgEnum("interview_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const recommendationEnum = pgEnum("recommendation", [
  "strong_hire",
  "hire",
  "maybe",
  "no_hire",
]);

// ── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("recruiter"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  recruiterId: uuid("recruiter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 128 }),
  location: varchar("location", { length: 255 }),
  employmentType: employmentTypeEnum("employment_type")
    .notNull()
    .default("full_time"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  description: text("description"),
  matchThreshold: integer("match_threshold").notNull().default(75),
  interviewDuration: integer("interview_duration").notNull().default(30),
  customQuestions: jsonb("custom_questions").$type<string[]>(),
  parsedJd: jsonb("parsed_jd").$type<{
    required_skills: string[];
    preferred_skills: string[];
    experience_years: number;
    education_level: string;
    soft_skills: string[];
    key_responsibilities: string[];
  }>(),
  status: jobStatusEnum("status").notNull().default("draft"),
  publicSlug: varchar("public_slug", { length: 64 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  candidateName: varchar("candidate_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  linkedinUrl: text("linkedin_url"),
  cvUrl: text("cv_url"),
  cvParsedData: jsonb("cv_parsed_data").$type<{
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: {
      title: string;
      company: string;
      duration: string;
      years: number;
    }[];
    education?: { degree: string; institution: string; year: string }[];
    soft_indicators?: string[];
  }>(),
  matchScore: integer("match_score"),
  matchBreakdown: jsonb("match_breakdown").$type<{
    skills: {
      score: number;
      weight: number;
      matched: string[];
      missing: string[];
    };
    experience: { score: number; weight: number; reasoning: string };
    education: { score: number; weight: number; reasoning: string };
    soft_skills: { score: number; weight: number; reasoning: string };
  }>(),
  matchReasoning: text("match_reasoning"),
  redFlags: jsonb("red_flags").$type<string[]>(),
  status: applicationStatusEnum("status").notNull().default("applied"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 128 }).notNull().unique(),
  status: interviewStatusEnum("status").notNull().default("pending"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  duration: integer("duration"),
  transcript:
    jsonb("transcript").$type<
      { speaker: string; text: string; timestamp: string }[]
    >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const evaluations = pgTable("evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  interviewId: uuid("interview_id")
    .notNull()
    .references(() => interviews.id, { onDelete: "cascade" }),
  technicalScore: integer("technical_score"),
  communicationScore: integer("communication_score"),
  culturalFitScore: integer("cultural_fit_score"),
  overallScore: integer("overall_score"),
  strengths: jsonb("strengths").$type<string[]>(),
  concerns: jsonb("concerns").$type<string[]>(),
  redFlags: jsonb("red_flags").$type<string[]>(),
  notableQuotes:
    jsonb("notable_quotes").$type<{ quote: string; context: string }[]>(),
  recommendation: recommendationEnum("recommendation"),
  report: text("report"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  interviewId: uuid("interview_id")
    .notNull()
    .references(() => interviews.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 32 }),
  eventId: varchar("event_id", { length: 255 }),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull().default("UTC"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  recruiter: one(users, {
    fields: [jobs.recruiterId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(
  applications,
  ({ one, many }) => ({
    job: one(jobs, {
      fields: [applications.jobId],
      references: [jobs.id],
    }),
    interviews: many(interviews),
  }),
);

export const interviewsRelations = relations(interviews, ({ one, many }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  evaluations: many(evaluations),
  calendarEvents: many(calendarEvents),
}));

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  interview: one(interviews, {
    fields: [evaluations.interviewId],
    references: [interviews.id],
  }),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  interview: one(interviews, {
    fields: [calendarEvents.interviewId],
    references: [interviews.id],
  }),
}));

// ── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;
