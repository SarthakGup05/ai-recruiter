import { NextRequest, NextResponse } from "next/server";

const interviewResponses: Record<string, string> = {
  greeting:
    "Hello! Thank you for joining the interview. Could you start by telling me about your background?",
  technical:
    "Great. Let me ask you a technical question — how would you optimize a React application that's rendering thousands of items in a list?",
  behavioral:
    "Interesting approach. Now, tell me about a time you had to deal with a difficult team situation. How did you handle it?",
  closing:
    "Thank you for your thoughtful answers. We'll review your responses and get back to you within 48 hours. Do you have any questions for us?",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, message } = body;

    if (!token || !message) {
      return NextResponse.json(
        { error: "Token and message are required" },
        { status: 400 },
      );
    }

    // Determine response type based on message content
    const lowerMsg = message.toLowerCase();
    let responseType = "technical";
    if (
      lowerMsg.includes("hello") ||
      lowerMsg.includes("hi") ||
      lowerMsg.includes("hey")
    ) {
      responseType = "greeting";
    } else if (
      lowerMsg.includes("team") ||
      lowerMsg.includes("conflict") ||
      lowerMsg.includes("challenge")
    ) {
      responseType = "behavioral";
    } else if (lowerMsg.includes("question") || lowerMsg.includes("thank")) {
      responseType = "closing";
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      role: "ai",
      content: interviewResponses[responseType] || interviewResponses.technical,
      timestamp: new Date().toISOString(),
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
