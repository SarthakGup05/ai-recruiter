import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { interviews, evaluations } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id))
      .limit(1);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    // Also fetch evaluation if exists
    const [evaluation] = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.interviewId, id))
      .limit(1);

    return NextResponse.json({ interview, evaluation: evaluation || null });
  } catch (error) {
    console.error("Get interview error:", error);
    return NextResponse.json(
      { error: "Failed to get interview" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.status) updateData.status = body.status;
    if (body.transcript) updateData.transcript = body.transcript;
    if (body.status === "in_progress" && !body.startedAt) {
      updateData.startedAt = new Date();
    }
    if (body.status === "completed") {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(interviews)
      .set(updateData)
      .where(eq(interviews.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ interview: updated });
  } catch (error) {
    console.error("Update interview error:", error);
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 },
    );
  }
}
