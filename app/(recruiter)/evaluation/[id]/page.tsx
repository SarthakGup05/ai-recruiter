"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Evaluation {
    id: string;
    interviewId: string;
    technicalScore: number | null;
    communicationScore: number | null;
    culturalFitScore: number | null;
    overallScore: number | null;
    strengths: string[] | null;
    concerns: string[] | null;
    redFlags: string[] | null;
    notableQuotes: { quote: string; context: string }[] | null;
    recommendation: string | null;
    report: string | null;
    createdAt: string;
}

interface Interview {
    id: string;
    token: string;
    status: string;
    startedAt: string | null;
    completedAt: string | null;
    duration: number | null;
    transcript: { speaker: string; text: string; timestamp: string }[] | null;
}

function ScoreCard({ label, score, icon }: { label: string; score: number | null; icon: string }) {
    if (score === null) return null;
    const color = score >= 80 ? "text-green-400 border-green-500/30 bg-green-500/10"
        : score >= 60 ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
            : score >= 40 ? "text-orange-400 border-orange-500/30 bg-orange-500/10"
                : "text-red-400 border-red-500/30 bg-red-500/10";

    return (
        <div className={`border rounded-xl p-4 text-center ${color}`}>
            <span className="text-2xl">{icon}</span>
            <p className="text-3xl font-bold mt-2">{score}%</p>
            <p className="text-sm font-medium mt-1 opacity-80">{label}</p>
        </div>
    );
}

const recommendationConfig: Record<string, { label: string; color: string; icon: string }> = {
    strong_hire: { label: "Strong Hire", color: "bg-green-500/20 text-green-400 border-green-500/40", icon: "🌟" },
    hire: { label: "Hire", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40", icon: "✅" },
    maybe: { label: "Maybe", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40", icon: "🤔" },
    no_hire: { label: "No Hire", color: "bg-red-500/20 text-red-400 border-red-500/40", icon: "❌" },
};

export default function EvaluationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTranscript, setShowTranscript] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/interviews/${id}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setInterview(data.interview);
                setEvaluation(data.evaluation);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-white">Interview not found</h2>
                <button onClick={() => router.back()} className="mt-4 text-indigo-400 hover:underline">Go back</button>
            </div>
        );
    }

    const rec = evaluation?.recommendation ? recommendationConfig[evaluation.recommendation] : null;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
            {/* Header */}
            <div>
                <button onClick={() => router.back()} className="text-sm text-slate-400 hover:text-white mb-2 flex items-center gap-1">
                    ← Back
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Interview Evaluation</h1>
                    {rec && (
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border ${rec.color}`}>
                            {rec.icon} {rec.label}
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-sm mt-1">
                    Interview ID: {interview.id} · Status: {interview.status}
                    {interview.completedAt && ` · Completed: ${new Date(interview.completedAt).toLocaleDateString()}`}
                </p>
            </div>

            {/* Overall Score */}
            {evaluation && (
                <>
                    {/* Score Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ScoreCard label="Overall" score={evaluation.overallScore} icon="📊" />
                        <ScoreCard label="Technical" score={evaluation.technicalScore} icon="💻" />
                        <ScoreCard label="Communication" score={evaluation.communicationScore} icon="🗣️" />
                        <ScoreCard label="Cultural Fit" score={evaluation.culturalFitScore} icon="🤝" />
                    </div>

                    {/* Report */}
                    {evaluation.report && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-3">Executive Summary</h2>
                            <p className="text-slate-300 leading-relaxed">{evaluation.report}</p>
                        </div>
                    )}

                    {/* Strengths & Concerns */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {evaluation.strengths && evaluation.strengths.length > 0 && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-green-400 mb-3">💪 Strengths</h2>
                                <ul className="space-y-2">
                                    {evaluation.strengths.map((s, i) => (
                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {evaluation.concerns && evaluation.concerns.length > 0 && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-yellow-400 mb-3">⚠️ Concerns</h2>
                                <ul className="space-y-2">
                                    {evaluation.concerns.map((c, i) => (
                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                            <span className="text-yellow-500 mt-0.5">!</span> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Red Flags */}
                    {evaluation.redFlags && evaluation.redFlags.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-red-400 mb-3">🚩 Red Flags</h2>
                            <ul className="space-y-2">
                                {evaluation.redFlags.map((f, i) => (
                                    <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                                        <span className="text-red-500 mt-0.5">•</span> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Notable Quotes */}
                    {evaluation.notableQuotes && evaluation.notableQuotes.length > 0 && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-3">💬 Notable Quotes</h2>
                            <div className="space-y-4">
                                {evaluation.notableQuotes.map((q, i) => (
                                    <div key={i} className="border-l-2 border-indigo-500 pl-4">
                                        <p className="text-slate-200 italic">&ldquo;{q.quote}&rdquo;</p>
                                        <p className="text-xs text-slate-500 mt-1">{q.context}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!evaluation && interview.status === "completed" && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                    <p className="text-slate-400">Evaluation not yet generated for this interview.</p>
                </div>
            )}

            {/* Transcript */}
            {interview.transcript && interview.transcript.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Interview Transcript</h2>
                        <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="text-sm text-indigo-400 hover:text-indigo-300"
                        >
                            {showTranscript ? "Hide" : "Show"} ({interview.transcript.length} messages)
                        </button>
                    </div>
                    {showTranscript && (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {interview.transcript.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.speaker === "ai" ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.speaker === "ai"
                                                ? "bg-slate-700 text-slate-200"
                                                : "bg-indigo-600 text-white"
                                            }`}
                                    >
                                        <p className="text-xs font-medium opacity-60 mb-1 capitalize">
                                            {msg.speaker === "ai" ? "AI Interviewer" : "Candidate"}
                                        </p>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
