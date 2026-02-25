import { generateJSON } from "./gemini";

export interface ParsedJD {
  required_skills: string[];
  preferred_skills: string[];
  experience_years: number;
  education_level: string;
  soft_skills: string[];
  key_responsibilities: string[];
}

/**
 * Parse a job description into structured data using Gemini.
 */
export async function parseJobDescription(job: {
  title: string;
  description?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
}): Promise<ParsedJD> {
  const prompt = `You are an expert recruiter. Analyze this job posting and extract structured data.

JOB TITLE: ${job.title}

DESCRIPTION:
${job.description || "N/A"}

REQUIREMENTS:
${job.requirements || "N/A"}

RESPONSIBILITIES:
${job.responsibilities || "N/A"}

Return a JSON object with these exact fields:
{
  "required_skills": string[] — hard technical skills explicitly required,
  "preferred_skills": string[] — nice-to-have skills mentioned,
  "experience_years": number — minimum years of experience (0 if not stated),
  "education_level": string — one of "high_school", "associate", "bachelor", "master", "phd", "any",
  "soft_skills": string[] — communication, leadership, teamwork, etc.,
  "key_responsibilities": string[] — main job responsibilities
}`;

  return generateJSON<ParsedJD>(prompt);
}
