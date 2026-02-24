import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { jobs, applications } from "@/utils/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

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
        matchThreshold: jobs.matchThreshold,
        interviewDuration: jobs.interviewDuration,
        customQuestions: jobs.customQuestions,
        status: jobs.status,
        publicSlug: jobs.publicSlug,
        createdAt: jobs.createdAt,
        applicantCount: sql<number>`cast(count(${applications.id}) as int)`,
      })
      .from(jobs)
      .leftJoin(applications, eq(applications.jobId, jobs.id))
      .where(and(eq(jobs.id, id), eq(jobs.recruiterId, user.id)))
      .groupBy(jobs.id)
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Get job error:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Only allow updating own jobs
    const [existing] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.recruiterId, user.id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(jobs)
      .set({
        ...(body.title && { title: body.title }),
        ...(body.department !== undefined && { department: body.department }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.employmentType && { employmentType: body.employmentType }),
        ...(body.salaryMin !== undefined && {
          salaryMin: body.salaryMin ? Number(body.salaryMin) : null,
        }),
        ...(body.salaryMax !== undefined && {
          salaryMax: body.salaryMax ? Number(body.salaryMax) : null,
        }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.requirements !== undefined && {
          requirements: body.requirements,
        }),
        ...(body.responsibilities !== undefined && {
          responsibilities: body.responsibilities,
        }),
        ...(body.matchThreshold !== undefined && {
          matchThreshold: Number(body.matchThreshold),
        }),
        ...(body.interviewDuration !== undefined && {
          interviewDuration: Number(body.interviewDuration),
        }),
        ...(body.customQuestions !== undefined && {
          customQuestions: body.customQuestions,
        }),
        ...(body.status && { status: body.status }),
      })
      .where(eq(jobs.id, id))
      .returning();

    return NextResponse.json({ job: updated });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Soft-delete: archive the job
    const [archived] = await db
      .update(jobs)
      .set({ status: "archived" })
      .where(and(eq(jobs.id, id), eq(jobs.recruiterId, user.id)))
      .returning({ id: jobs.id });

    if (!archived) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Job ${id} archived`,
    });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { error: "Failed to archive job" },
      { status: 500 },
    );
  }
}
