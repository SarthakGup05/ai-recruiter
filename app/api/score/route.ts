import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { applications, jobs } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { calculateMatchScore } from "@/lib/ai/scoring";
import type { ParsedCV } from "@/lib/ai/parse-cv";
import type { ParsedJD } from "@/lib/ai/parse-jd";

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

    // Fetch application with parsed CV data
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

    if (!application.cvParsedData) {
      return NextResponse.json(
        { error: "CV has not been parsed yet. Parse CV first." },
        { status: 400 },
      );
    }

    // Fetch the job with parsed JD
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, application.jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.parsedJd) {
      return NextResponse.json(
        { error: "Job description has not been parsed yet." },
        { status: 400 },
      );
    }

    // Run scoring engine
    const parsedCv = application.cvParsedData as unknown as ParsedCV;
    const parsedJd = job.parsedJd as unknown as ParsedJD;
    const result = calculateMatchScore(parsedCv, parsedJd);

    // Determine new status based on threshold
    const newStatus =
      result.overall_score >= job.matchThreshold ? "matched" : "rejected";

    // Update application with score
    const [updated] = await db
      .update(applications)
      .set({
        matchScore: result.overall_score,
        matchBreakdown: result.breakdown,
        matchReasoning: result.reasoning,
        redFlags: result.red_flags,
        status: newStatus,
      })
      .where(eq(applications.id, applicationId))
      .returning();

    return NextResponse.json({
      application: updated,
      result,
      qualified: newStatus === "matched",
    });
  } catch (error) {
    console.error("Score error:", error);
    return NextResponse.json(
      { error: "Failed to score application" },
      { status: 500 },
    );
  }
}
