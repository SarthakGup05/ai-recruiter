import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

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

    // Stub: return mock parsed data
    const parsedData = {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 123-4567",
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "CSS",
        "Node.js",
        "PostgreSQL",
      ],
      experience: [
        {
          title: "Senior Frontend Engineer",
          company: "TechCorp",
          duration: "2021 – Present",
        },
        {
          title: "Frontend Developer",
          company: "StartupXYZ",
          duration: "2018 – 2021",
        },
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          institution: "Stanford University",
          year: "2018",
        },
      ],
    };

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
