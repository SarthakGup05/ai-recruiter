import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { jobs } from "@/utils/db/schema";
import { eq, desc, asc, ilike, and, or, sql, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const department = searchParams.get("department");
    const location = searchParams.get("location");
    const employmentType = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const filters = [eq(jobs.status, "active")];

    if (q) {
      filters.push(
        or(
          ilike(jobs.title, `%${q}%`),
          ilike(jobs.department, `%${q}%`),
          ilike(jobs.location, `%${q}%`),
        )!,
      );
    }
    if (department) filters.push(eq(jobs.department, department));
    if (location) filters.push(eq(jobs.location, location));
    if (employmentType)
      filters.push(eq(jobs.employmentType, employmentType as any));

    const whereClause = and(...filters);

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
      .where(whereClause)
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ total: count() })
      .from(jobs)
      .where(whereClause);

    const totalCount = countResult.total;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      jobs: result,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Public jobs list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
