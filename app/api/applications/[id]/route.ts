import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { applications, jobs, interviews, evaluations } from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Fetch job info
    const [job] = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        matchThreshold: jobs.matchThreshold,
        interviewDuration: jobs.interviewDuration,
      })
      .from(jobs)
      .where(eq(jobs.id, application.jobId))
      .limit(1);

    // Fetch interviews for this application
    const interviewList = await db
      .select()
      .from(interviews)
      .where(eq(interviews.applicationId, id))
      .orderBy(desc(interviews.createdAt));

    // Fetch evaluations for completed interviews
    const evaluationList = [];
    for (const interview of interviewList) {
      const [evaluation] = await db
        .select()
        .from(evaluations)
        .where(eq(evaluations.interviewId, interview.id))
        .limit(1);
      if (evaluation) {
        evaluationList.push({ ...evaluation, interviewId: interview.id });
      }
    }

    return NextResponse.json({
      application,
      job: job || null,
      interviews: interviewList,
      evaluations: evaluationList,
    });
  } catch (error) {
    console.error("Get application error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = [
      "applied",
      "matched",
      "scheduled",
      "interviewed",
      "decision",
      "rejected",
      "hired",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const [updated] = await db
      .update(applications)
      .set({
        ...(status && { status }),
        ...(body.matchScore !== undefined && {
          matchScore: Number(body.matchScore),
        }),
        ...(body.cvParsedData !== undefined && {
          cvParsedData: body.cvParsedData,
        }),
      })
      .where(eq(applications.id, id))
      .returning();

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}
