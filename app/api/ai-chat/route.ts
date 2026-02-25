import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { interviews, applications, jobs } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import {
  createInterviewSession,
  sendInterviewMessage,
  getOpeningMessage,
  type InterviewContext,
} from "@/lib/ai/interview-ai";
import type { ParsedCV } from "@/lib/ai/parse-cv";
import type { ParsedJD } from "@/lib/ai/parse-jd";
import type { ChatSession } from "@google/generative-ai";

// In-memory session store (per-process; fine for dev/single-server)
const activeSessions = new Map<string, ChatSession>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, message } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Interview token is required" },
        { status: 400 },
      );
    }

    // Look up interview by token
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.token, token))
      .limit(1);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    // Fetch application and job for context
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, interview.applicationId))
      .limit(1);

    const [job] = application
      ? await db
          .select()
          .from(jobs)
          .where(eq(jobs.id, application.jobId))
          .limit(1)
      : [null];

    // Build interview context
    const ctx: InterviewContext = {
      jobTitle: job?.title || "Position",
      parsedJd: (job?.parsedJd as ParsedJD) || {
        required_skills: [],
        preferred_skills: [],
        experience_years: 0,
        education_level: "any",
        soft_skills: [],
        key_responsibilities: [],
      },
      parsedCv: (application?.cvParsedData as unknown as ParsedCV) || {
        name: application?.candidateName || "Candidate",
        email: application?.email || "",
        phone: "",
        skills: [],
        experience: [],
        education: [],
        soft_indicators: [],
      },
      customQuestions: (job?.customQuestions as string[]) || [],
      duration: interview.duration || 30,
    };

    // Get or create chat session
    let session = activeSessions.get(token);
    if (!session) {
      session = createInterviewSession(ctx);
      activeSessions.set(token, session);
    }

    let aiResponse: string;

    if (!message) {
      // First call — get opening message
      aiResponse = await getOpeningMessage(session);

      // Mark interview as in progress
      if (interview.status === "pending") {
        await db
          .update(interviews)
          .set({ status: "in_progress", startedAt: new Date() })
          .where(eq(interviews.id, interview.id));
      }
    } else {
      // Send candidate message and get AI response
      aiResponse = await sendInterviewMessage(session, message);
    }

    // Build transcript entries
    const timestamp = new Date().toISOString();
    const newEntries: { speaker: string; text: string; timestamp: string }[] =
      [];

    if (message) {
      newEntries.push({ speaker: "candidate", text: message, timestamp });
    }
    newEntries.push({ speaker: "ai", text: aiResponse, timestamp });

    // Append to transcript in DB
    const existingTranscript = interview.transcript || [];
    const updatedTranscript = [...existingTranscript, ...newEntries];

    await db
      .update(interviews)
      .set({ transcript: updatedTranscript })
      .where(eq(interviews.id, interview.id));

    return NextResponse.json({
      role: "ai",
      content: aiResponse,
      timestamp,
      token,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
