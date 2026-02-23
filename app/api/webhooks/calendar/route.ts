import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Calendar webhook received:", body);

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Calendar webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
