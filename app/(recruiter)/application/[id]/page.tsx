"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Application {
    id: string;
    candidateName: string;
    email: string;
    phone: string | null;
    linkedinUrl: string | null;
    cvUrl: string | null;
    matchScore: number | null;
    matchReasoning: string | null;
    redFlags: string[] | null;
    status: string;
    createdAt: string;
    cvParsedData: {
        name?: string;
        email?: string;
        skills?: string[];
        experience?: { title: string; company: string; duration: string; years: number }[];
        education?: { degree: string; institution: string; year: string }[];
        soft_indicators?: string[];
    } | null;
    matchBreakdown: {
        skills: { score: number; weight: number; matched: string[]; missing: string[] };
        experience: { score: number; weight: number; reasoning: string };
        education: { score: number; weight: number; reasoning: string };
        soft_skills: { score: number; weight: number; reasoning: string };
    } | null;
}

interface Job {
    id: string;
    title: string;
    matchThreshold: number;
}

function ScoreRing({ score, size = 80, label }: { score: number; size?: number; label: string }) {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth="6" fill="none" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="6" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute flex items-center justify-center" style={{ width: size, height: size }}>
                <span className="text-lg font-bold text-white">{score}%</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">{label}</span>
        </div>
    );
}

function ScoreBar({ label, score, weight, detail }: { label: string; score: number; weight: number; detail: string }) {
    const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Weight: {weight}%</span>
                    <span className="text-sm font-bold text-white">{score}%</span>
                </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }} />
            </div>
            <p className="text-xs text-slate-400">{detail}</p>
        </div>
    );
}

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [app, setApp] = useState<Application | null>(null);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [scoring, setScoring] = useState(false);
    const [scheduling, setScheduling] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/applications/${id}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setApp(data.application);
                setJob(data.job);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    async function handleScore() {
        if (!app) return;
        setScoring(true);
        try {
            const res = await fetch("/api/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId: app.id }),
            });
            const data = await res.json();
            if (res.ok) {
                setApp(data.application);
            } else {
                alert(data.error || "Scoring failed");
            }
        } finally {
            setScoring(false);
        }
    }

    async function handleScheduleInterview() {
        if (!app) return;
        setScheduling(true);
        try {
            const res = await fetch("/api/interviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId: app.id }),
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Interview created! Link: ${data.interviewLink}`);
                setApp((prev) => prev ? { ...prev, status: "scheduled" } : null);
            } else {
                alert(data.error || "Failed to schedule");
            }
        } finally {
            setScheduling(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!app) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-white">Application not found</h2>
                <button onClick={() => router.back()} className="mt-4 text-indigo-400 hover:underline">Go back</button>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        applied: "bg-blue-500/20 text-blue-400",
        matched: "bg-green-500/20 text-green-400",
        rejected: "bg-red-500/20 text-red-400",
        scheduled: "bg-yellow-500/20 text-yellow-400",
        interviewed: "bg-purple-500/20 text-purple-400",
        decision: "bg-indigo-500/20 text-indigo-400",
        hired: "bg-emerald-500/20 text-emerald-400",
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <button onClick={() => router.back()} className="text-sm text-slate-400 hover:text-white mb-2 flex items-center gap-1">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-white">{app.candidateName}</h1>
                    <p className="text-slate-400">{app.email} {app.phone ? `· ${app.phone}` : ""}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[app.status] || "bg-slate-700 text-slate-300"}`}>
                    {app.status}
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                {!app.matchScore && app.cvParsedData && (
                    <button onClick={handleScore} disabled={scoring}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition">
                        {scoring ? "Scoring..." : "🎯 Run AI Score"}
                    </button>
                )}
                {app.matchScore && app.matchScore >= (job?.matchThreshold || 75) && app.status !== "scheduled" && (
                    <button onClick={handleScheduleInterview} disabled={scheduling}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition">
                        {scheduling ? "Scheduling..." : "🎙️ Schedule Interview"}
                    </button>
                )}
                {app.linkedinUrl && (
                    <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition">
                        LinkedIn ↗
                    </a>
                )}
            </div>

            {/* Score Section */}
            {app.matchScore !== null && app.matchBreakdown && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">AI Match Score</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Threshold: {job?.matchThreshold || 75}%</span>
                            <span className={`text-2xl font-bold ${app.matchScore >= (job?.matchThreshold || 75) ? "text-green-400" : "text-red-400"}`}>
                                {app.matchScore}%
                            </span>
                        </div>
                    </div>

                    {/* Score Breakdown Bars */}
                    <div className="space-y-4">
                        <ScoreBar
                            label="Technical Skills"
                            score={app.matchBreakdown.skills.score}
                            weight={app.matchBreakdown.skills.weight}
                            detail={`Matched: ${app.matchBreakdown.skills.matched.join(", ") || "none"}`}
                        />
                        <ScoreBar
                            label="Experience"
                            score={app.matchBreakdown.experience.score}
                            weight={app.matchBreakdown.experience.weight}
                            detail={app.matchBreakdown.experience.reasoning}
                        />
                        <ScoreBar
                            label="Education"
                            score={app.matchBreakdown.education.score}
                            weight={app.matchBreakdown.education.weight}
                            detail={app.matchBreakdown.education.reasoning}
                        />
                        <ScoreBar
                            label="Soft Skills"
                            score={app.matchBreakdown.soft_skills.score}
                            weight={app.matchBreakdown.soft_skills.weight}
                            detail={app.matchBreakdown.soft_skills.reasoning}
                        />
                    </div>

                    {/* Missing Skills */}
                    {app.matchBreakdown.skills.missing.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-2">Missing Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {app.matchBreakdown.skills.missing.map((skill) => (
                                    <span key={skill} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Red Flags */}
                    {app.redFlags && app.redFlags.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-red-400 mb-2">⚠️ Red Flags</h3>
                            <ul className="space-y-1">
                                {app.redFlags.map((flag, i) => (
                                    <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                                        <span className="text-red-500 mt-0.5">•</span> {flag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Reasoning */}
                    {app.matchReasoning && (
                        <div className="pt-4 border-t border-slate-700">
                            <h3 className="text-sm font-medium text-slate-300 mb-1">AI Reasoning</h3>
                            <p className="text-sm text-slate-400">{app.matchReasoning}</p>
                        </div>
                    )}
                </div>
            )}

            {/* CV Parsed Data */}
            {app.cvParsedData && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Parsed CV Data</h2>

                    {/* Skills */}
                    {app.cvParsedData.skills && app.cvParsedData.skills.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {app.cvParsedData.skills.map((skill) => (
                                    <span key={skill} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {app.cvParsedData.experience && app.cvParsedData.experience.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-2">Experience</h3>
                            <div className="space-y-2">
                                {app.cvParsedData.experience.map((exp, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                                        <div>
                                            <p className="text-sm text-white font-medium">{exp.title}</p>
                                            <p className="text-xs text-slate-400">{exp.company}</p>
                                        </div>
                                        <span className="text-xs text-slate-500">{exp.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {app.cvParsedData.education && app.cvParsedData.education.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-2">Education</h3>
                            <div className="space-y-2">
                                {app.cvParsedData.education.map((edu, i) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                                        <div>
                                            <p className="text-sm text-white font-medium">{edu.degree}</p>
                                            <p className="text-xs text-slate-400">{edu.institution}</p>
                                        </div>
                                        <span className="text-xs text-slate-500">{edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
