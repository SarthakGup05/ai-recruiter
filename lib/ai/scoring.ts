import type { ParsedCV } from "./parse-cv";
import type { ParsedJD } from "./parse-jd";

export interface ScoreBreakdown {
  skills: {
    score: number;
    weight: number;
    matched: string[];
    missing: string[];
  };
  experience: {
    score: number;
    weight: number;
    reasoning: string;
  };
  education: {
    score: number;
    weight: number;
    reasoning: string;
  };
  soft_skills: {
    score: number;
    weight: number;
    reasoning: string;
  };
}

export interface MatchResult {
  overall_score: number;
  breakdown: ScoreBreakdown;
  reasoning: string;
  red_flags: string[];
}

// ── Weights ─────────────────────────────────────────────────────────────────

const WEIGHTS = {
  skills: 0.4,
  experience: 0.3,
  education: 0.15,
  soft_skills: 0.15,
};

// ── Education Levels (hierarchical) ─────────────────────────────────────────

const EDUCATION_LEVELS: Record<string, number> = {
  high_school: 1,
  associate: 2,
  bachelor: 3,
  master: 4,
  phd: 5,
  any: 0,
};

// ── Scoring Functions ───────────────────────────────────────────────────────

function scoreSkills(
  cv: ParsedCV,
  jd: ParsedJD,
): { score: number; matched: string[]; missing: string[] } {
  const cvSkillsLower = cv.skills.map((s) => s.toLowerCase());
  const allRequired = jd.required_skills.map((s) => s.toLowerCase());
  const allPreferred = jd.preferred_skills.map((s) => s.toLowerCase());

  const matchedRequired = allRequired.filter((s) =>
    cvSkillsLower.some((cs) => cs.includes(s) || s.includes(cs)),
  );
  const matchedPreferred = allPreferred.filter((s) =>
    cvSkillsLower.some((cs) => cs.includes(s) || s.includes(cs)),
  );

  const missingRequired = jd.required_skills.filter(
    (s) =>
      !cvSkillsLower.some(
        (cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs),
      ),
  );

  // Required skills: 70% weight, preferred: 30% weight
  const requiredScore =
    allRequired.length > 0
      ? (matchedRequired.length / allRequired.length) * 100
      : 100;
  const preferredScore =
    allPreferred.length > 0
      ? (matchedPreferred.length / allPreferred.length) * 100
      : 100;

  const score = Math.round(requiredScore * 0.7 + preferredScore * 0.3);

  return {
    score: Math.min(100, score),
    matched: [
      ...jd.required_skills.filter((s) =>
        matchedRequired.includes(s.toLowerCase()),
      ),
      ...jd.preferred_skills.filter((s) =>
        matchedPreferred.includes(s.toLowerCase()),
      ),
    ],
    missing: missingRequired,
  };
}

function scoreExperience(
  cv: ParsedCV,
  jd: ParsedJD,
): { score: number; reasoning: string } {
  const totalYears = cv.experience.reduce((sum, exp) => sum + exp.years, 0);
  const requiredYears = jd.experience_years || 0;

  if (requiredYears === 0) {
    return {
      score: 80,
      reasoning: "No specific experience requirement stated.",
    };
  }

  const ratio = totalYears / requiredYears;
  let score: number;
  let reasoning: string;

  if (ratio >= 1.5) {
    score = 95;
    reasoning = `Exceeds requirement: ${totalYears} years vs ${requiredYears} required.`;
  } else if (ratio >= 1.0) {
    score = 85;
    reasoning = `Meets requirement: ${totalYears} years vs ${requiredYears} required.`;
  } else if (ratio >= 0.7) {
    score = 65;
    reasoning = `Slightly below: ${totalYears} years vs ${requiredYears} required.`;
  } else if (ratio >= 0.5) {
    score = 45;
    reasoning = `Below requirement: ${totalYears} years vs ${requiredYears} required.`;
  } else {
    score = 25;
    reasoning = `Significantly below: ${totalYears} years vs ${requiredYears} required.`;
  }

  return { score, reasoning };
}

function scoreEducation(
  cv: ParsedCV,
  jd: ParsedJD,
): { score: number; reasoning: string } {
  const requiredLevel = EDUCATION_LEVELS[jd.education_level] || 0;

  if (requiredLevel === 0) {
    return { score: 80, reasoning: "No specific education requirement." };
  }

  if (cv.education.length === 0) {
    return { score: 30, reasoning: "No education information found in CV." };
  }

  // Check highest education level from CV
  const degreeText = cv.education.map((e) => e.degree.toLowerCase()).join(" ");

  let candidateLevel = 1;
  if (degreeText.includes("phd") || degreeText.includes("doctorate")) {
    candidateLevel = 5;
  } else if (
    degreeText.includes("master") ||
    degreeText.includes("m.s") ||
    degreeText.includes("mba")
  ) {
    candidateLevel = 4;
  } else if (
    degreeText.includes("bachelor") ||
    degreeText.includes("b.s") ||
    degreeText.includes("b.a") ||
    degreeText.includes("b.tech")
  ) {
    candidateLevel = 3;
  } else if (degreeText.includes("associate")) {
    candidateLevel = 2;
  }

  if (candidateLevel >= requiredLevel) {
    return {
      score: 90,
      reasoning: `Education meets or exceeds requirement.`,
    };
  } else if (candidateLevel === requiredLevel - 1) {
    return {
      score: 60,
      reasoning: `Education one level below requirement.`,
    };
  }

  return {
    score: 35,
    reasoning: `Education significantly below requirement.`,
  };
}

function scoreSoftSkills(
  cv: ParsedCV,
  jd: ParsedJD,
): { score: number; reasoning: string } {
  const requiredSoft = jd.soft_skills.map((s) => s.toLowerCase());

  if (requiredSoft.length === 0) {
    return { score: 75, reasoning: "No specific soft skills required." };
  }

  const indicators = cv.soft_indicators.map((s) => s.toLowerCase()).join(" ");
  const cvSkillsText = cv.skills.map((s) => s.toLowerCase()).join(" ");
  const allText = indicators + " " + cvSkillsText;

  const matched = requiredSoft.filter((s) => allText.includes(s));
  const ratio = matched.length / requiredSoft.length;

  return {
    score: Math.round(ratio * 100),
    reasoning: `Matched ${matched.length}/${requiredSoft.length} soft skills: ${matched.join(", ") || "none"}.`,
  };
}

function detectRedFlags(cv: ParsedCV, jd: ParsedJD): string[] {
  const flags: string[] = [];

  // Short tenure detection
  const shortTenure = cv.experience.filter((e) => e.years > 0 && e.years < 1);
  if (shortTenure.length >= 2) {
    flags.push(`Multiple short tenures (${shortTenure.length} roles < 1 year)`);
  }

  // Missing critical skills
  const cvSkillsLower = cv.skills.map((s) => s.toLowerCase());
  const missingCritical = jd.required_skills.filter(
    (s) => !cvSkillsLower.some((cs) => cs.includes(s.toLowerCase())),
  );
  if (missingCritical.length > jd.required_skills.length * 0.5) {
    flags.push(
      `Missing majority of required skills: ${missingCritical.join(", ")}`,
    );
  }

  // Very low experience
  const totalYears = cv.experience.reduce((sum, e) => sum + e.years, 0);
  if (jd.experience_years > 0 && totalYears < jd.experience_years * 0.5) {
    flags.push(
      `Experience significantly below requirement (${totalYears}y vs ${jd.experience_years}y)`,
    );
  }

  // No education info
  if (cv.education.length === 0) {
    flags.push("No education information provided");
  }

  return flags;
}

// ── Main Scoring Function ───────────────────────────────────────────────────

export function calculateMatchScore(cv: ParsedCV, jd: ParsedJD): MatchResult {
  const skills = scoreSkills(cv, jd);
  const experience = scoreExperience(cv, jd);
  const education = scoreEducation(cv, jd);
  const soft = scoreSoftSkills(cv, jd);
  const redFlags = detectRedFlags(cv, jd);

  const overall_score = Math.round(
    skills.score * WEIGHTS.skills +
      experience.score * WEIGHTS.experience +
      education.score * WEIGHTS.education +
      soft.score * WEIGHTS.soft_skills,
  );

  const breakdown: ScoreBreakdown = {
    skills: {
      score: skills.score,
      weight: WEIGHTS.skills * 100,
      matched: skills.matched,
      missing: skills.missing,
    },
    experience: {
      score: experience.score,
      weight: WEIGHTS.experience * 100,
      reasoning: experience.reasoning,
    },
    education: {
      score: education.score,
      weight: WEIGHTS.education * 100,
      reasoning: education.reasoning,
    },
    soft_skills: {
      score: soft.score,
      weight: WEIGHTS.soft_skills * 100,
      reasoning: soft.reasoning,
    },
  };

  const reasoning = `Overall match: ${overall_score}%. Skills (${skills.score}%), Experience (${experience.score}%), Education (${education.score}%), Soft Skills (${soft.score}%). ${redFlags.length > 0 ? `Red flags: ${redFlags.join("; ")}` : "No red flags detected."}`;

  return {
    overall_score,
    breakdown,
    reasoning,
    red_flags: redFlags,
  };
}
