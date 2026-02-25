import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { jobs, applications } from "@/utils/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { parseJobDescription } from "@/lib/ai/parse-jd";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        department: jobs.department,
        location: jobs.location,
        employmentType: jobs.employmentType,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        status: jobs.status,
        publicSlug: jobs.publicSlug,
        createdAt: jobs.createdAt,
        applicantCount: sql<number>`cast(count(${applications.id}) as int)`,
      })
      .from(jobs)
      .leftJoin(applications, eq(applications.jobId, jobs.id))
      .where(eq(jobs.recruiterId, user.id))
      .groupBy(jobs.id)
      .orderBy(desc(jobs.createdAt));

    return NextResponse.json({ jobs: result });
  } catch (error) {
    console.error("List jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      department,
      location,
      employmentType,
      salaryMin,
      salaryMax,
      description,
      requirements,
      responsibilities,
      matchThreshold,
      interviewDuration,
      customQuestions,
      status,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 },
      );
    }

    // Generate a URL-safe slug from the title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 56);
    const publicSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const [newJob] = await db
      .insert(jobs)
      .values({
        recruiterId: user.id,
        title,
        department: department || null,
        location: location || null,
        employmentType: employmentType || "full_time",
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        description: description || null,
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        matchThreshold: matchThreshold ? Number(matchThreshold) : 75,
        interviewDuration: interviewDuration ? Number(interviewDuration) : 30,
        customQuestions: customQuestions || null,
        status: status === "draft" ? "draft" : "active",
        publicSlug,
      })
      .returning();

    // Fire-and-forget: parse JD in background so the response isn't delayed
    parseJobDescription({
      title,
      description,
      requirements,
      responsibilities,
    })
      .then(async (parsedJd) => {
        await db.update(jobs).set({ parsedJd }).where(eq(jobs.id, newJob.id));
      })
      .catch((err) => {
        console.error("Background JD parse failed:", err);
      });

    revalidatePath("/dashboard");

    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
