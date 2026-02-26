import { redirect, notFound } from "next/navigation";
import { JobForm } from "@/components/job-form";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { jobs } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";

export default async function EditJobPage(props: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { id } = await props.params;

    const [job] = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, id), eq(jobs.recruiterId, user.id)))
        .limit(1);

    if (!job) {
        notFound();
    }

    return <JobForm initialData={job} jobId={job.id} />;
}
