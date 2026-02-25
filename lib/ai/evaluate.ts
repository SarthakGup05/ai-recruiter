import { generateJSON } from "./gemini";
import type { ParsedCV } from "./parse-cv";
import type { ParsedJD } from "./parse-jd";

export interface NotableQuote {
  quote: string;
  context: string;
}

export interface EvaluationResult {
  technical_score: number;
  communication_score: number;
  cultural_fit_score: number;
  overall_score: number;
  recommendation: "strong_hire" | "hire" | "maybe" | "no_hire";
  strengths: string[];
  concerns: string[];
  red_flags: string[];
  notable_quotes: NotableQuote[];
  report: string;
}

/**
 * Evaluate a candidate after their interview.
 */
export async function evaluateInterview(params: {
  transcript: { speaker: string; text: string; timestamp: string }[];
  parsedJd: ParsedJD;
  parsedCv: ParsedCV;
  jobTitle: string;
}): Promise<EvaluationResult> {
  const transcriptText = params.transcript
    .map((t) => `[${t.speaker}]: ${t.text}`)
    .join("\n");

  const prompt = `You are a senior hiring manager evaluating a candidate interview. Analyze the transcript thoroughly and produce a detailed evaluation.

JOB: ${params.jobTitle}
Required Skills: ${params.parsedJd.required_skills.join(", ")}
Experience Required: ${params.parsedJd.experience_years} years

CANDIDATE CV SKILLS: ${params.parsedCv.skills.join(", ")}
CANDIDATE EXPERIENCE: ${params.parsedCv.experience.map((e) => `${e.title} at ${e.company}`).join("; ")}

INTERVIEW TRANSCRIPT:
${transcriptText}

Return a JSON object with these exact fields:
{
  "technical_score": number (0-100) — depth of technical knowledge demonstrated,
  "communication_score": number (0-100) — clarity, articulation, and professionalism,
  "cultural_fit_score": number (0-100) — teamwork, values alignment, adaptability,
  "overall_score": number (0-100) — weighted average considering all factors,
  "recommendation": string — one of "strong_hire", "hire", "maybe", "no_hire",
  "strengths": string[] — top 3-5 strengths demonstrated in the interview,
  "concerns": string[] — any concerns or areas needing follow-up,
  "red_flags": string[] — serious issues like dishonesty, toxicity, fundamental skill gaps,
  "notable_quotes": [{ "quote": string, "context": string }] — 2-4 memorable candidate quotes with context,
  "report": string — 3-5 sentence executive summary for the recruiter
}

Be fair but thorough. Base scores on evidence from the transcript.`;

  return generateJSON<EvaluationResult>(prompt);
}
