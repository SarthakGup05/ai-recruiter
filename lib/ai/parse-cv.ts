import { generateJSON } from "./gemini";

export interface ParsedCV {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    years: number;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  soft_indicators: string[];
}

/**
 * Extract text from a PDF file buffer.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (
    buf: Buffer,
  ) => Promise<{ text: string }>;
  const data = await pdfParse(buffer);
  return data.text;
}

/**
 * Extract text from a DOCX file buffer.
 */
async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Extract text from a CV file (PDF or DOCX).
 */
export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractPdfText(buffer);
  }
  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractDocxText(buffer);
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}

/**
 * Parse extracted CV text into structured data using Gemini.
 */
export async function parseCVText(text: string): Promise<ParsedCV> {
  const prompt = `You are an expert resume parser. Analyze this resume/CV text and extract structured data.

RESUME TEXT:
${text}

Return a JSON object with these exact fields:
{
  "name": string — full name of the candidate,
  "email": string — email address (empty string if not found),
  "phone": string — phone number (empty string if not found),
  "skills": string[] — all technical and professional skills mentioned,
  "experience": [
    {
      "title": string — job title,
      "company": string — company name,
      "duration": string — e.g. "2020 – 2023",
      "years": number — approximate years at this role
    }
  ],
  "education": [
    {
      "degree": string — e.g. "B.S. Computer Science",
      "institution": string — university/school name,
      "year": string — graduation year or year range
    }
  ],
  "soft_indicators": string[] — phrases indicating soft skills, leadership, mentoring, teamwork, etc. extracted from the text
}

Be thorough in extracting skills. Include programming languages, frameworks, tools, platforms, methodologies.`;

  return generateJSON<ParsedCV>(prompt);
}
