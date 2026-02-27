import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { RecentApplications } from "@/components/recent-applications";
import { Briefcase, Users, CalendarCheck, TrendingUp, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { jobs, applications, interviews } from "@/utils/db/schema";
import { eq, count, avg, sql, and, gte, desc } from "drizzle-orm";
import { DashboardFilters } from "@/components/dashboard-filters";
import { ExportButton } from "@/components/export-button";

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

        // Pipeline: recent applications for the table
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
            )
            .orderBy(desc(applications.createdAt))
            .limit(20),
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

    const formattedCandidates = pipelineData.map((app) => ({
        id: app.id,
        name: app.name,
        email: app.email,
        score: app.score ?? undefined,
        status: app.status,
        createdAt: app.createdAt,
    }));

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Overview of your recruitment pipeline and active roles.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <DashboardFilters />
                    <ExportButton />
                    <Button asChild className="shrink-0 group">
                        <Link href="/job/new" className="flex items-center gap-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Post New Job
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards - 4 Column Layout for Desktop */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

            {/* Recent Candidates Box */}
            <div className="rounded-xl bg-card border border-border shadow-sm p-5 pb-2 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        Recent Applications
                    </h2>
                    <Button variant="ghost" size="sm" asChild className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        <Link href="/jobs">View all candidates &rarr;</Link>
                    </Button>
                </div>
                <RecentApplications candidates={formattedCandidates} />
            </div>
        </div>
    );
}

// Helper wrapper to avoid React hydration issues with Button asChild
function ButtonChildWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={className}>{children}</div>
}
