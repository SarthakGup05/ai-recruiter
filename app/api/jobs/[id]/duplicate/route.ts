import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { jobs } from "@/utils/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch original job
    const [originalJob] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.recruiterId, user.id)))
      .limit(1);

    if (!originalJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Insert duplicated job
    const [newJob] = await db
      .insert(jobs)
      .values({
        recruiterId: originalJob.recruiterId,
        title: `${originalJob.title} (Copy)`,
        department: originalJob.department,
        location: originalJob.location,
        employmentType: originalJob.employmentType,
        salaryMin: originalJob.salaryMin,
        salaryMax: originalJob.salaryMax,
        requirements: originalJob.requirements,
        responsibilities: originalJob.responsibilities,
        description: originalJob.description,
        matchThreshold: originalJob.matchThreshold,
        interviewDuration: originalJob.interviewDuration,
        customQuestions: originalJob.customQuestions,
        parsedJd: originalJob.parsedJd,
        status: "draft", // Copies always start as draft
      })
      .returning({ id: jobs.id });

    revalidatePath("/dashboard");

    return NextResponse.json({ job: newJob });
  } catch (error) {
    console.error("Duplicate job error:", error);
    return NextResponse.json(
      { error: "Failed to duplicate job" },
      { status: 500 },
    );
  }
}
