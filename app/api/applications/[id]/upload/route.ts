import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/utils/db";
import { applications } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { extractTextFromFile, parseCVText } from "@/lib/ai/parse-cv";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate type
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

    // 1. Upload to Blob Storage
    // Use the file.name but give it a safe path using the application ID
    const blobPrefix = `resumes/${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    let blobUrl: string | undefined;

    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(blobPrefix, file, { access: "public" });
        blobUrl = blob.url;
      } else {
        console.warn(
          "BLOB_READ_WRITE_TOKEN not set. Storing only DB reference.",
        );
      }
    } catch (e) {
      console.error("Vercel blob upload failed:", e);
      // We continue to parse even if storage fails in dev
    }

    // 2. Parse the CV for AI recruitment functionality
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractTextFromFile(buffer, file.type);
    const parsedData = await parseCVText(text);

    // 3. Update the Application record
    await db
      .update(applications)
      .set({
        ...(blobUrl ? { cvUrl: blobUrl } : {}),
        cvParsedData: parsedData,
      })
      .where(eq(applications.id, id));

    revalidatePath("/dashboard", "layout");

    return NextResponse.json({
      success: true,
      url: blobUrl,
      parsedData,
    });
  } catch (error) {
    console.error("CV upload and parse error:", error);
    return NextResponse.json(
      { error: "Failed to process CV" },
      { status: 500 },
    );
  }
}
