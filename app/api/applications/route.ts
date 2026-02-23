import { NextRequest, NextResponse } from "next/server";

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

    // Stub: return mock application
    const application = {
      id: crypto.randomUUID(),
      jobId,
      candidateName,
      email,
      phone: phone || null,
      linkedinUrl: linkedinUrl || null,
      status: "applied",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Submit application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
