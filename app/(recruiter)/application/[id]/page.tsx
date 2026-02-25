"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Mail,
    Phone,
    Linkedin,
    Calendar,
    Target,
    AlertCircle,
    CheckCircle2,
    FileText,
    MessageSquare,
    Star,
    Zap,
    Clock,
    Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        phone?: string;
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
    interviewDuration: number;
}

interface Interview {
    id: string;
    status: string;
    token: string;
    transcript: { speaker: string; text: string; timestamp: string }[] | null;
    createdAt: string;
    completedAt: string | null;
}

interface Evaluation {
    id: string;
    interviewId: string;
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    culturalFitScore: number;
    strengths: string[];
    concerns: string[];
    redFlags: string[];
    recommendation: string;
    report: string;
    notableQuotes: { quote: string; context: string }[];
}

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [app, setApp] = useState<Application | null>(null);
    const [job, setJob] = useState<Job | null>(null);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
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
                setInterviews(data.interviews || []);
                setEvaluations(data.evaluations || []);
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
                toast.success("AI Analysis complete!");
            } else {
                toast.error(data.error || "Scoring failed");
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
                toast.success("Interview created!");
                setApp((prev) => (prev ? { ...prev, status: "scheduled" } : null));
                // Reload interviews
                const updatedRes = await fetch(`/api/applications/${id}`);
                const updatedData = await updatedRes.json();
                setInterviews(updatedData.interviews || []);

                // Show a special toast with the link or just put it in a copyable field
                toast.info("You can now copy the interview link from the header.");
            } else {
                toast.error(data.error || "Failed to schedule");
            }
        } finally {
            setScheduling(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!app) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-bold">Candidate not found</h2>
                <Button variant="link" onClick={() => router.back()} className="mt-2">
                    Go back to dashboard
                </Button>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        applied: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        matched: "bg-violet-500/10 text-violet-600 border-violet-500/20",
        rejected: "bg-red-500/10 text-red-600 border-red-500/20",
        scheduled: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
        interviewed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        decision: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        hired: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20",
    };

    const latestEvaluation = evaluations[0];
    const latestInterview = interviews[0];

    return (
        <div className="mx-auto max-w-6xl space-y-8 pb-12">
            {/* Navigation */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
                <span>/</span>
                <span className="text-foreground font-medium">Candidate Profile</span>
            </div>

            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/30 backdrop-blur-xl p-6 sm:p-8">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center">
                    <Avatar className="h-24 w-24 rounded-2xl shadow-xl shadow-primary/10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-2xl font-bold text-white uppercase">
                            {app.candidateName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-extrabold tracking-tight">{app.candidateName}</h1>
                            <Badge className={`capitalize font-bold border ${statusColors[app.status] || ""}`}>
                                {app.status}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {app.email}</span>
                            {app.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> {app.phone}</span>}
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {app.linkedinUrl && (
                            <Button variant="outline" asChild>
                                <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                                </a>
                            </Button>
                        )}
                        {!app.matchScore && app.cvParsedData && (
                            <Button onClick={handleScore} disabled={scoring} className="gradient-bg border-0 text-white font-bold">
                                {scoring ? "Analyzing..." : "Run AI Analysis"}
                            </Button>
                        )}
                        {app.matchScore && app.matchScore >= (job?.matchThreshold || 75) && app.status !== "scheduled" && !latestInterview && (
                            <Button onClick={handleScheduleInterview} disabled={scheduling} className="bg-violet-600 hover:bg-violet-700 text-white font-bold border-0 transition-all hover:scale-105">
                                {scheduling ? "Scheduling..." : "Invite to AI Interview"}
                            </Button>
                        )}
                        {latestInterview && (
                            <Button
                                variant="outline"
                                className="border-primary/30 text-primary font-bold hover:bg-primary/5"
                                onClick={() => {
                                    const link = `${window.location.origin}/room/${latestInterview.token}`;
                                    navigator.clipboard.writeText(link);
                                    toast.success("Interview link copied to clipboard!");
                                }}
                            >
                                <Copy className="mr-2 h-4 w-4" /> Copy Room Link
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: AI Insight & Actions */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Overall Score Card */}
                    {app.matchScore !== null && (
                        <Card className="rounded-3xl border-border/60 shadow-lg shadow-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Match Accuracy</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-5xl font-extrabold text-foreground">{app.matchScore}%</div>
                                    <Target className={`h-12 w-12 ${app.matchScore >= (job?.matchThreshold || 75) ? "text-emerald-500" : "text-amber-500"} opacity-20`} />
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between font-medium">
                                        <span>Confidence</span>
                                        <span>High</span>
                                    </div>
                                    <Progress value={app.matchScore} className="h-2" />
                                </div>
                                {app.matchReasoning && (
                                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                                        "{app.matchReasoning}"
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Red Flags Section */}
                    {app.redFlags && app.redFlags.length > 0 && (
                        <Card className="rounded-3xl border-red-500/20 bg-red-500/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase text-red-600 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" /> Critical Flags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {app.redFlags.map((flag, i) => (
                                        <li key={i} className="text-sm font-medium text-red-700 leading-tight flex items-start gap-2">
                                            <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats/Metadata */}
                    <Card className="rounded-3xl border-border/60">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Quick Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-border/50">
                                <span className="text-sm font-medium text-muted-foreground">Match Score</span>
                                <Badge variant="outline" className="font-bold">{app.matchScore ?? "N/A"}%</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-border/50">
                                <span className="text-sm font-medium text-muted-foreground">Interview Status</span>
                                <Badge variant="outline" className="font-bold capitalize">{interviews[0]?.status ?? "None"}</Badge>
                            </div>
                            {latestEvaluation && (
                                <div className="flex items-center justify-between py-2 border-b border-border/50">
                                    <span className="text-sm font-medium text-muted-foreground">Rec. Level</span>
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase text-[10px] font-bold">
                                        {latestEvaluation.recommendation?.replace("_", " ")}
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="breakdown" className="w-full">
                        <TabsList className="bg-secondary/50 p-1 rounded-2xl mb-6">
                            <TabsTrigger value="breakdown" className="rounded-xl font-bold">Match Breakdown</TabsTrigger>
                            <TabsTrigger value="resume" className="rounded-xl font-bold">Parsed Resume</TabsTrigger>
                            {latestInterview && <TabsTrigger value="interview" className="rounded-xl font-bold">AI Interview</TabsTrigger>}
                        </TabsList>

                        {/* TAB: Match Breakdown */}
                        <TabsContent value="breakdown" className="space-y-6">
                            {app.matchBreakdown ? (
                                <div className="grid gap-6">
                                    <Card className="rounded-3xl border-border/60">
                                        <CardContent className="pt-6 space-y-8">
                                            <ScoreItem
                                                title="Technical Skills"
                                                score={app.matchBreakdown.skills.score}
                                                weight={app.matchBreakdown.skills.weight}
                                                matched={app.matchBreakdown.skills.matched}
                                                missing={app.matchBreakdown.skills.missing}
                                            />
                                            <ScoreItem
                                                title="Experience & Relevance"
                                                score={app.matchBreakdown.experience.score}
                                                weight={app.matchBreakdown.experience.weight}
                                                reasoning={app.matchBreakdown.experience.reasoning}
                                            />
                                            <ScoreItem
                                                title="Education & Credentials"
                                                score={app.matchBreakdown.education.score}
                                                weight={app.matchBreakdown.education.weight}
                                                reasoning={app.matchBreakdown.education.reasoning}
                                            />
                                            <ScoreItem
                                                title="Soft Skills & Culture"
                                                score={app.matchBreakdown.soft_skills.score}
                                                weight={app.matchBreakdown.soft_skills.weight}
                                                reasoning={app.matchBreakdown.soft_skills.reasoning}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <Card className="p-12 text-center border-dashed rounded-3xl">
                                    <Zap className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-20" />
                                    <p className="font-medium text-muted-foreground">Run AI Score Analysis to see a detailed match breakdown.</p>
                                </Card>
                            )}
                        </TabsContent>

                        {/* TAB: Parsed Resume */}
                        <TabsContent value="resume" className="space-y-6">
                            {app.cvParsedData ? (
                                <div className="space-y-6">
                                    {/* Experience Loop */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Professional Experience</h3>
                                        <div className="grid gap-4">
                                            {app.cvParsedData.experience?.map((exp, i) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-secondary/20">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border font-bold text-xs">Exp</div>
                                                    <div className="space-y-1">
                                                        <div className="font-bold text-sm">{exp.title}</div>
                                                        <div className="text-xs text-muted-foreground font-medium">{exp.company} · {exp.duration}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills Cloud */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold flex items-center gap-2"><Zap className="h-4 w-4 text-violet-500" /> Key Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {app.cvParsedData.skills?.map(skill => (
                                                <Badge key={skill} variant="secondary" className="bg-background border font-medium px-3 py-1">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Education */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold flex items-center gap-2"><Star className="h-4 w-4 text-amber-400" /> Education</h3>
                                        <div className="grid gap-4">
                                            {app.cvParsedData.education?.map((edu, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-secondary/10">
                                                    <div>
                                                        <div className="font-bold text-sm tracking-tight">{edu.degree}</div>
                                                        <div className="text-xs text-muted-foreground font-medium italic">{edu.institution}</div>
                                                    </div>
                                                    <div className="text-xs font-bold text-muted-foreground whitespace-nowrap">{edu.year}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center border-dashed rounded-3xl">Parsed resume data is unavailable.</div>
                            )}
                        </TabsContent>

                        {/* TAB: Interview & Evaluation */}
                        <TabsContent value="interview" className="space-y-8">
                            {/* Evaluation Report */}
                            {latestEvaluation && (
                                <div className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <EvalCard title="Technical" score={latestEvaluation.technicalScore} />
                                        <EvalCard title="Communication" score={latestEvaluation.communicationScore} />
                                        <EvalCard title="Cultural Fit" score={latestEvaluation.culturalFitScore} />
                                        <EvalCard title="Overall Interview" score={latestEvaluation.overallScore} highlight />
                                    </div>

                                    <Card className="rounded-3xl border-border/60">
                                        <CardContent className="pt-6 space-y-6">
                                            <div className="grid gap-8 sm:grid-cols-2">
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-bold uppercase text-emerald-600 flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4" /> Observed Strengths
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {latestEvaluation.strengths?.map((s, i) => (
                                                            <li key={i} className="text-sm font-medium text-foreground/80 flex items-start gap-2">
                                                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" /> {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-bold uppercase text-amber-600 flex items-center gap-2">
                                                        <Clock className="h-4 w-4" /> Potential Concerns
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {latestEvaluation.concerns?.map((c, i) => (
                                                            <li key={i} className="text-sm font-medium text-foreground/80 flex items-start gap-2">
                                                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" /> {c}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-border/50">
                                                <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" /> Summary Report
                                                </h3>
                                                <p className="text-sm text-foreground/70 leading-relaxed bg-secondary/20 p-4 rounded-2xl italic">
                                                    {latestEvaluation.report}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Transcript View */}
                            {latestInterview?.transcript && (
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Interview Transcript</h3>
                                    <Card className="rounded-3xl overflow-hidden">
                                        <ScrollArea className="h-[400px] bg-secondary/10">
                                            <div className="p-6 space-y-6">
                                                {latestInterview.transcript.map((m, i) => (
                                                    <div key={i} className={`flex flex-col ${m.speaker.toLowerCase() === 'you' || m.speaker.toLowerCase() === 'candidate' ? 'items-end' : 'items-start'} gap-1.5`}>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground px-2">
                                                            {m.speaker} · {m.timestamp}
                                                        </div>
                                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] sm:max-w-[70%] ${m.speaker.toLowerCase() === 'you' || m.speaker.toLowerCase() === 'candidate' ? 'bg-primary text-white' : 'bg-background border shadow-sm text-foreground'}`}>
                                                            {m.text}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </Card>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

function ScoreItem({ title, score, weight, matched, missing, reasoning }: { title: string; score: number; weight: number; matched?: string[]; missing?: string[]; reasoning?: string }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h4 className="font-bold text-sm tracking-tight">{title}</h4>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Importance: {weight}%</span>
                </div>
                <div className="text-xl font-extrabold text-primary">{score}%</div>
            </div>
            <Progress value={score} className="h-2.5 rounded-full" />

            {(matched?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {matched?.map(s => <Badge key={s} variant="secondary" className="bg-emerald-500/5 text-emerald-700 border-emerald-500/10 text-[9px] uppercase font-bold py-0">{s}</Badge>)}
                    {missing?.map(s => <Badge key={s} variant="secondary" className="bg-red-500/5 text-red-700 border-red-500/10 text-[9px] uppercase font-bold py-0">MISSING: {s}</Badge>)}
                </div>
            )}

            {reasoning && <p className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-border/50">{reasoning}</p>}
        </div>
    );
}

function EvalCard({ title, score, highlight = false }: { title: string; score: number; highlight?: boolean }) {
    const color = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-red-500";
    return (
        <Card className={`rounded-2xl border-border/60 ${highlight ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
                <span className={`text-xs font-bold uppercase ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>{title}</span>
                <span className={`text-xl font-black ${highlight ? 'text-primary' : color}`}>{score}%</span>
            </CardContent>
        </Card>
    );
}
