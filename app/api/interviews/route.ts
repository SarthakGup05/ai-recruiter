import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { interviews, applications, jobs } from "@/utils/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 },
      );
    }

    // Verify application exists
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId))
      .limit(1);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Get job for interview duration
    const [job] = await db
      .select({ interviewDuration: jobs.interviewDuration })
      .from(jobs)
      .where(eq(jobs.id, application.jobId))
      .limit(1);

    // Generate unique token for interview room
    const token = randomUUID();

    // Create interview record
    const [interview] = await db
      .insert(interviews)
      .values({
        applicationId,
        token,
        status: "pending",
        duration: job?.interviewDuration || 30,
        transcript: [],
      })
      .returning();

    // Update application status to scheduled
    await db
      .update(applications)
      .set({ status: "scheduled" })
      .where(eq(applications.id, applicationId));

    return NextResponse.json(
      {
        interview,
        interviewLink: `/room/${token}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create interview error:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId query param required" },
        { status: 400 },
      );
    }

    const interviewList = await db
      .select()
      .from(interviews)
      .where(eq(interviews.applicationId, applicationId))
      .orderBy(desc(interviews.createdAt));

    return NextResponse.json({ interviews: interviewList });
  } catch (error) {
    console.error("List interviews error:", error);
    return NextResponse.json(
      { error: "Failed to list interviews" },
      { status: 500 },
    );
  }
}
