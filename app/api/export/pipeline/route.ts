import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { jobs, applications } from "@/utils/db/schema";
import { eq, and, gte } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";

    let dateConstraint = null;
    if (period !== "all") {
      const now = new Date();
      if (period === "7d")
        dateConstraint = new Date(now.setDate(now.getDate() - 7));
      else if (period === "30d")
        dateConstraint = new Date(now.setDate(now.getDate() - 30));
      else if (period === "90d")
        dateConstraint = new Date(now.setDate(now.getDate() - 90));
      else if (period === "1y")
        dateConstraint = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    const pipelineData = await db
      .select({
        candidateName: applications.candidateName,
        email: applications.email,
        phone: applications.phone,
        jobTitle: jobs.title,
        status: applications.status,
        matchScore: applications.matchScore,
        appliedDate: applications.createdAt,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(
        and(
          eq(jobs.recruiterId, user.id),
          dateConstraint
            ? gte(applications.createdAt, dateConstraint)
            : undefined,
        ),
      );

    if (!pipelineData || pipelineData.length === 0) {
      return new NextResponse("No data to export", { status: 404 });
    }

    const headers = [
      "Candidate Name",
      "Email",
      "Phone",
      "Job Title",
      "Status",
      "Match (%)",
      "Applied Date",
    ];

    const csvRows = [headers.join(",")];
    for (const row of pipelineData) {
      const values = [
        `"${row.candidateName}"`,
        `"${row.email}"`,
        `"${row.phone || ""}"`,
        `"${row.jobTitle}"`,
        `"${row.status}"`,
        row.matchScore ?? "",
        `"${new Date(row.appliedDate).toISOString().split("T")[0]}"`,
      ];
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");

    return new NextResponse(csvString, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="pipeline-export-${period}.csv"`,
      },
    });
  } catch (error) {
    console.error("Pipeline export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
