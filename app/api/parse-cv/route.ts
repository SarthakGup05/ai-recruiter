import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile, parseCVText } from "@/lib/ai/parse-cv";
import { db } from "@/utils/db";
import { applications } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const applicationId = formData.get("applicationId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File must be smaller than 5MB" },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are accepted" },
        { status: 400 },
      );
    }

    // Extract text from file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractTextFromFile(buffer, file.type);

    // Parse extracted text with AI
    const parsedData = await parseCVText(text);

    // If applicationId provided, save parsed data to application
    if (applicationId) {
      await db
        .update(applications)
        .set({ cvParsedData: parsedData })
        .where(eq(applications.id, applicationId));
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      parsedData,
    });
  } catch (error) {
    console.error("CV parse error:", error);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
