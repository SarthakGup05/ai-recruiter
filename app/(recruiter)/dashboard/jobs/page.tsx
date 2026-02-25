import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { jobs, applications } from "@/utils/db/schema";
import { eq, count, desc, sql } from "drizzle-orm";
import { JobsList } from "@/components/jobs-list";

export default async function JobsManagementPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    // Fetch jobs with application counts
    const rawJobs = await db
        .select({
            id: jobs.id,
            title: jobs.title,
            department: jobs.department,
            location: jobs.location,
            status: jobs.status,
            createdAt: jobs.createdAt,
            appCount: sql<number>`cast(count(${applications.id}) as int)`,
        })
        .from(jobs)
        .leftJoin(applications, eq(jobs.id, applications.jobId))
        .where(eq(jobs.recruiterId, user.id))
        .groupBy(jobs.id)
        .orderBy(desc(jobs.createdAt));

    // Serialize for client component
    const serializedJobs = rawJobs.map(j => ({
        ...j,
        createdAt: j.createdAt.toISOString(),
    }));

    return (
        <div className="mx-auto max-w-5xl">
            <JobsList initialJobs={serializedJobs} />
        </div>
    );
}
