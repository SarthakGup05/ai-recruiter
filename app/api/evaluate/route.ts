import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { interviews, evaluations, applications, jobs } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { evaluateInterview } from "@/lib/ai/evaluate";
import type { ParsedCV } from "@/lib/ai/parse-cv";
import type { ParsedJD } from "@/lib/ai/parse-jd";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interviewId } = body;

    if (!interviewId) {
      return NextResponse.json(
        { error: "interviewId is required" },
        { status: 400 },
      );
    }

    // Fetch interview
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    if (!interview.transcript || interview.transcript.length === 0) {
      return NextResponse.json(
        { error: "Interview transcript is empty" },
        { status: 400 },
      );
    }

    // Fetch application and job for context
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, interview.applicationId))
      .limit(1);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, application.jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Run AI evaluation
    const result = await evaluateInterview({
      transcript: interview.transcript,
      parsedJd: (job.parsedJd || {}) as ParsedJD,
      parsedCv: (application.cvParsedData || {}) as ParsedCV,
      jobTitle: job.title,
    });

    // Store evaluation
    const [evaluation] = await db
      .insert(evaluations)
      .values({
        interviewId,
        technicalScore: result.technical_score,
        communicationScore: result.communication_score,
        culturalFitScore: result.cultural_fit_score,
        overallScore: result.overall_score,
        strengths: result.strengths,
        concerns: result.concerns,
        redFlags: result.red_flags,
        notableQuotes: result.notable_quotes,
        recommendation: result.recommendation,
        report: result.report,
      })
      .returning();

    // Update interview status
    await db
      .update(interviews)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(interviews.id, interviewId));

    // Update application status to decision
    await db
      .update(applications)
      .set({ status: "decision" })
      .where(eq(applications.id, interview.applicationId));

    return NextResponse.json({ evaluation, result });
  } catch (error) {
    console.error("Evaluate error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate interview" },
      { status: 500 },
    );
  }
}
