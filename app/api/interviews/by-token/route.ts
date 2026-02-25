import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { interviews, applications, jobs } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/interviews/by-token?token=xxx
 * Fetches interview metadata by token — used by the interview room page.
 * This is a public endpoint (no auth) since candidates access it via token.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.token, token))
      .limit(1);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found. This link may be invalid or expired." },
        { status: 404 },
      );
    }

    // Fetch application and job data
    const [application] = await db
      .select({
        id: applications.id,
        candidateName: applications.candidateName,
        email: applications.email,
        cvParsedData: applications.cvParsedData,
      })
      .from(applications)
      .where(eq(applications.id, interview.applicationId))
      .limit(1);

    let job = null;
    if (application) {
      // Get full application to extract jobId
      const [fullApp] = await db
        .select({ jobId: applications.jobId })
        .from(applications)
        .where(eq(applications.id, interview.applicationId))
        .limit(1);

      if (fullApp) {
        const [jobData] = await db
          .select({
            id: jobs.id,
            title: jobs.title,
            department: jobs.department,
            interviewDuration: jobs.interviewDuration,
          })
          .from(jobs)
          .where(eq(jobs.id, fullApp.jobId))
          .limit(1);

        job = jobData || null;
      }
    }

    return NextResponse.json({
      interview: {
        id: interview.id,
        token: interview.token,
        status: interview.status,
        duration: job?.interviewDuration || 30,
        transcript: interview.transcript,
        startedAt: interview.startedAt,
        completedAt: interview.completedAt,
      },
      application: application
        ? {
            id: application.id,
            candidateName: application.candidateName,
            email: application.email,
          }
        : null,
      job: job
        ? {
            id: job.id,
            title: job.title,
            department: job.department,
          }
        : null,
    });
  } catch (error) {
    console.error("Get interview by token error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview data" },
      { status: 500 },
    );
  }
}
