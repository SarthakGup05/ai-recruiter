import { createChatSession } from "./gemini";
import type { ParsedCV } from "./parse-cv";
import type { ParsedJD } from "./parse-jd";
import type { ChatSession } from "@google/generative-ai";

export interface InterviewContext {
  jobTitle: string;
  parsedJd: ParsedJD;
  parsedCv: ParsedCV;
  customQuestions: string[];
  duration: number; // minutes
}

/**
 * Build the system prompt for the AI interviewer.
 */
function buildSystemPrompt(ctx: InterviewContext): string {
  return `You are a professional AI interviewer conducting a real-time interview for the position of "${ctx.jobTitle}".

YOUR ROLE:
- You are friendly, professional, and thorough.
- You ask one question at a time and wait for the candidate's response.
- You adapt your follow-up questions based on the candidate's answers.
- You cover technical skills, experience, behavioral/situational scenarios, and culture fit.
- Keep the interview within approximately ${ctx.duration} minutes (about ${Math.ceil(ctx.duration / 5)} questions).

JOB REQUIREMENTS:
- Required Skills: ${ctx.parsedJd.required_skills.join(", ")}
- Preferred Skills: ${ctx.parsedJd.preferred_skills.join(", ")}
- Experience: ${ctx.parsedJd.experience_years} years
- Key Responsibilities: ${ctx.parsedJd.key_responsibilities.join("; ")}

CANDIDATE BACKGROUND (from their CV):
- Skills: ${ctx.parsedCv.skills.join(", ")}
- Experience: ${ctx.parsedCv.experience.map((e) => `${e.title} at ${e.company} (${e.duration})`).join("; ")}
- Education: ${ctx.parsedCv.education.map((e) => `${e.degree} from ${e.institution}`).join("; ")}

${ctx.customQuestions.length > 0 ? `CUSTOM QUESTIONS (must include these during the interview):\n${ctx.customQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}` : ""}

GUIDELINES:
- Start by greeting the candidate and asking them to introduce themselves.
- Probe deeper when answers are vague.
- Ask about specific technologies from their CV and the JD.
- Include at least one behavioral question (e.g., "Tell me about a time...").
- When wrapping up, ask if they have any questions.
- Keep responses concise (2-4 sentences per question).
- Do NOT reveal the evaluation criteria or scoring.`;
}

/**
 * Create an AI interview chat session.
 */
export function createInterviewSession(ctx: InterviewContext): ChatSession {
  const systemPrompt = buildSystemPrompt(ctx);
  return createChatSession(systemPrompt);
}

/**
 * Send a message to the interview session and get the AI response.
 */
export async function sendInterviewMessage(
  session: ChatSession,
  message: string,
): Promise<string> {
  const result = await session.sendMessage(message);
  return result.response.text();
}

/**
 * Get the opening message for an interview.
 */
export async function getOpeningMessage(session: ChatSession): Promise<string> {
  const result = await session.sendMessage(
    "The candidate has just joined the interview room. Please greet them and begin the interview.",
  );
  return result.response.text();
}
