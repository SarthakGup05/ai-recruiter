import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { applications, jobs } from "@/utils/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { CandidatesList } from "@/components/candidates-list";

export default async function CandidatesPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    // Fetch user's job IDs
    const userJobs = await db
        .select({ id: jobs.id })
        .from(jobs)
        .where(eq(jobs.recruiterId, user.id));

    const jobIds = userJobs.map(j => j.id);

    // Fetch all candidates for these jobs
    const rawCandidates = jobIds.length > 0 ? await db
        .select({
            id: applications.id,
            name: applications.candidateName,
            email: applications.email,
            status: applications.status,
            score: applications.matchScore,
            createdAt: applications.createdAt,
            jobTitle: jobs.title,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .where(inArray(applications.jobId, jobIds))
        .orderBy(desc(applications.createdAt))
        : [];

    // Serialize dates for the client component
    const candidates = rawCandidates.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
    }));

    return (
        <div className="mx-auto max-w-5xl">
            <CandidatesList initialCandidates={candidates} />
        </div>
    );
}
