import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { jobs } from "@/utils/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { applications } from "@/utils/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        department: jobs.department,
        location: jobs.location,
        employmentType: jobs.employmentType,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        publicSlug: jobs.publicSlug,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .where(eq(jobs.status, "active"))
      .orderBy(desc(jobs.createdAt));

    return NextResponse.json({ jobs: result });
  } catch (error) {
    console.error("Public jobs list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
