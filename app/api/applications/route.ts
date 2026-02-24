import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { applications, jobs } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, candidateName, email, phone, linkedinUrl } = body;

    if (!jobId || !candidateName || !email) {
      return NextResponse.json(
        { error: "Job ID, name, and email are required" },
        { status: 400 },
      );
    }

    // Verify the job exists and is active
    const [job] = await db
      .select({ id: jobs.id, status: jobs.status })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status !== "active") {
      return NextResponse.json(
        { error: "This job is not accepting applications" },
        { status: 400 },
      );
    }

    const [application] = await db
      .insert(applications)
      .values({
        jobId,
        candidateName,
        email: email.toLowerCase(),
        phone: phone || null,
        linkedinUrl: linkedinUrl || null,
        status: "applied",
      })
      .returning();

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Submit application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
