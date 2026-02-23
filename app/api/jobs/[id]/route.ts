import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Stub: return mock job data
  const job = {
    id,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    employmentType: "full_time",
    salaryMin: 150000,
    salaryMax: 200000,
    status: "active",
    matchThreshold: 75,
    interviewDuration: 30,
    description: "We are looking for a senior frontend engineer...",
    requirements: "5+ years of React experience...",
    responsibilities: "Lead frontend architecture decisions...",
    createdAt: "2026-02-20T00:00:00Z",
  };

  return NextResponse.json({ job });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();

    return NextResponse.json({
      job: { id, ...body, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return NextResponse.json({
    success: true,
    message: `Job ${id} archived`,
  });
}
