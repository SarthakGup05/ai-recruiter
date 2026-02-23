import { NextRequest, NextResponse } from "next/server";

// Mock jobs data for now (will be replaced with actual DB queries)
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    employmentType: "full_time",
    salaryMin: 150000,
    salaryMax: 200000,
    status: "active",
    applicantCount: 12,
    createdAt: "2026-02-20T00:00:00Z",
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    employmentType: "remote",
    salaryMin: 120000,
    salaryMax: 160000,
    status: "active",
    applicantCount: 8,
    createdAt: "2026-02-18T00:00:00Z",
  },
  {
    id: "3",
    title: "Backend Engineer",
    department: "Engineering",
    location: "New York, NY",
    employmentType: "full_time",
    salaryMin: 140000,
    salaryMax: 190000,
    status: "draft",
    applicantCount: 0,
    createdAt: "2026-02-15T00:00:00Z",
  },
];

export async function GET() {
  return NextResponse.json({ jobs: mockJobs });
}

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 },
      );
    }

    // Stub: return the new job
    const newJob = {
      id: crypto.randomUUID(),
      title,
      department: department || null,
      location: location || null,
      employmentType: employmentType || "full_time",
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      description: description || null,
      requirements: requirements || null,
      responsibilities: responsibilities || null,
      status: "active",
      publicSlug: title.toLowerCase().replace(/\s+/g, "-").slice(0, 64),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
