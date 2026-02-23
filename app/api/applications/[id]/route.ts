import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Stub: return mock application data
  const application = {
    id,
    jobId: "1",
    candidateName: "Sarah Chen",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    linkedinUrl: "linkedin.com/in/sarahchen",
    cvUrl: "/uploads/sarah-chen-cv.pdf",
    matchScore: 92,
    status: "interviewed",
    cvParsedData: {
      skills: ["React", "TypeScript", "Next.js"],
      experience: [
        {
          title: "Senior Frontend Engineer",
          company: "TechCorp",
          duration: "3 years",
        },
      ],
    },
    createdAt: "2026-02-20T00:00:00Z",
  };

  return NextResponse.json({ application });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    const validStatuses = [
      "applied",
      "matched",
      "scheduled",
      "interviewed",
      "decision",
      "rejected",
      "hired",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      application: { id, ...body, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}
