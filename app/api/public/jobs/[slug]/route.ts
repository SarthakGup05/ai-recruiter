import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { jobs } from "@/utils/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const [job] = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        department: jobs.department,
        location: jobs.location,
        employmentType: jobs.employmentType,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        description: jobs.description,
        requirements: jobs.requirements,
        responsibilities: jobs.responsibilities,
        publicSlug: jobs.publicSlug,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .where(eq(jobs.publicSlug, slug))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Increment views in the background
    await db
      .update(jobs)
      .set({ views: sql`${jobs.views} + 1` })
      .where(eq(jobs.id, job.id));

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Public job detail error:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}
