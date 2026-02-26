import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { KanbanBoard, type KanbanColumn } from "@/components/kanban-board";
import { Briefcase, Users, CalendarCheck, TrendingUp, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { jobs, applications, interviews } from "@/utils/db/schema";
import { eq, count, avg, sql, and, gte } from "drizzle-orm";
import { DashboardFilters } from "@/components/dashboard-filters";
import { ExportButton } from "@/components/export-button";

const PIPELINE_STATUSES = [
    { id: "applied", title: "Applied", color: "#6366f1" },
    { id: "matched", title: "Matched", color: "#8b5cf6" },
    { id: "scheduled", title: "Scheduled", color: "#06b6d4" },
    { id: "interviewed", title: "Interviewed", color: "#10b981" },
    { id: "decision", title: "Decision", color: "#f59e0b" },
] as const;

export default async function DashboardPage(props: { searchParams: Promise<{ period?: string }> }) {
    const searchParams = await props.searchParams;
    const period = searchParams?.period || "all";

    const user = await getCurrentUser();
    if (!user) redirect("/login");

    let dateConstraint = null;
    if (period !== "all") {
        const now = new Date();
        if (period === "7d") dateConstraint = new Date(now.setDate(now.getDate() - 7));
        else if (period === "30d") dateConstraint = new Date(now.setDate(now.getDate() - 30));
        else if (period === "90d") dateConstraint = new Date(now.setDate(now.getDate() - 90));
        else if (period === "1y") dateConstraint = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    // ── Fetch all stats ─────────────────────────────────────────────────────
    const [
        jobStats,
        applicationStats,
        interviewStats,
        avgScoreResult,
        pipelineData,
    ] = await Promise.all([
        // Total jobs + active jobs
        db
            .select({
                total: count(),
                active: sql<number>`cast(count(*) filter (where ${jobs.status} = 'active') as int)`,
            })
            .from(jobs)
            .where(
                and(
                    eq(jobs.recruiterId, user.id),
                    dateConstraint ? gte(jobs.createdAt, dateConstraint) : undefined
                )
            ),

        // Total applications for this recruiter's jobs
        db
            .select({ total: count() })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .where(
                and(
                    eq(jobs.recruiterId, user.id),
                    dateConstraint ? gte(applications.createdAt, dateConstraint) : undefined
                )
            ),

        // Completed/Scheduled interviews
        db
            .select({
                completed: sql<number>`cast(count(*) filter (where ${interviews.status} = 'completed') as int)`,
                scheduled: sql<number>`cast(count(*) filter (where ${interviews.status} = 'pending') as int)`,
            })
            .from(interviews)
            .innerJoin(applications, eq(interviews.applicationId, applications.id))
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .where(
                and(
                    eq(jobs.recruiterId, user.id),
                    dateConstraint ? gte(interviews.createdAt, dateConstraint) : undefined
                )
            ),

        // Average match score
        db
            .select({ avg: avg(applications.matchScore) })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .where(
                and(
                    eq(jobs.recruiterId, user.id),
                    sql`${applications.matchScore} is not null`,
                    dateConstraint ? gte(applications.createdAt, dateConstraint) : undefined
                ),
            ),

        // Pipeline: applications grouped by status for kanban
        db
            .select({
                id: applications.id,
                name: applications.candidateName,
                email: applications.email,
                score: applications.matchScore,
                status: applications.status,
                createdAt: applications.createdAt,
            })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .where(
                and(
                    eq(jobs.recruiterId, user.id),
                    dateConstraint ? gte(applications.createdAt, dateConstraint) : undefined
                )
            ),
    ]);

    // ── Derive stat card values ──────────────────────────────────────────────
    const totalJobs = jobStats[0]?.total ?? 0;
    const activeJobs = jobStats[0]?.active ?? 0;
    const totalApps = applicationStats[0]?.total ?? 0;
    const completedInterviews = interviewStats[0]?.completed ?? 0;
    const scheduledInterviews = interviewStats[0]?.scheduled ?? 0;
    const avgScore = avgScoreResult[0]?.avg
        ? `${Math.round(Number(avgScoreResult[0].avg))}%`
        : "—";

    // ── Build kanban columns ─────────────────────────────────────────────────
    function timeAgo(date: Date): string {
        const diff = Date.now() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    const columns: KanbanColumn[] = PIPELINE_STATUSES.map((col) => ({
        id: col.id,
        title: col.title,
        color: col.color,
        candidates: pipelineData
            .filter((app) => app.status === col.id)
            .map((app) => ({
                id: app.id,
                name: app.name,
                email: app.email,
                score: app.score ?? undefined,
                appliedAt: timeAgo(new Date(app.createdAt)),
            })),
    }));

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Overview of your recruitment pipeline
                    </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <DashboardFilters />
                    <ExportButton />
                    <Button asChild className="gradient-bg border-0 text-white hover:opacity-90 w-full sm:w-auto">
                        <Link href="/job/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Post New Job
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Jobs"
                    value={totalJobs}
                    subtitle={`${activeJobs} active`}
                    icon={Briefcase}
                />
                <StatCard
                    title="Applications"
                    value={totalApps}
                    icon={Users}
                />
                <StatCard
                    title="Interviews Done"
                    value={completedInterviews}
                    subtitle={`${scheduledInterviews} scheduled`}
                    icon={CalendarCheck}
                />
                <StatCard
                    title="Avg. Match Score"
                    value={avgScore}
                    icon={TrendingUp}
                />
            </div>

            {/* Kanban Board */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Candidate Pipeline</h2>
                <KanbanBoard columns={columns} />
            </div>
        </div>
    );
}
