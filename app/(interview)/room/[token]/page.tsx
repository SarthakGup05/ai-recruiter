"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "@/components/chat-message";
import {
    BrainCircuit,
    Send,
    StopCircle,
    Clock,
    User,
    Briefcase,
    AlertTriangle,
} from "lucide-react";

type Message = {
    id: string;
    role: "ai" | "candidate";
    content: string;
    timestamp: string;
};

type InterviewMeta = {
    jobTitle: string;
    department: string;
    duration: number;
    candidateName: string;
    status: string;
};

function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function InterviewRoomPage() {
    const { token } = useParams();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"loading" | "waiting" | "in_progress" | "completed" | "error">("loading");
    const [isTyping, setIsTyping] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [meta, setMeta] = useState<InterviewMeta>({
        jobTitle: "Loading...",
        department: "",
        duration: 30,
        candidateName: "Candidate",
        status: "pending",
    });
    const [questionCount, setQuestionCount] = useState(0);
    const [endingInterview, setEndingInterview] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isTyping]);

    // Timer
    useEffect(() => {
        if (status !== "in_progress") return;
        const interval = setInterval(() => setElapsed((p) => p + 1), 1000);
        return () => clearInterval(interval);
    }, [status]);

    const formatElapsed = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    // Duration warning — flash when 80% time used
    const timeWarning = meta.duration > 0 && elapsed >= meta.duration * 60 * 0.8;
    const timeUp = meta.duration > 0 && elapsed >= meta.duration * 60;

    // Initialize interview — fetch opening message
    const initInterview = useCallback(async () => {
        if (initialized.current) return;
        initialized.current = true;

        try {
            // First, fetch interview metadata
            const metaRes = await fetch(`/api/interviews/by-token?token=${token}`);
            if (metaRes.ok) {
                const metaData = await metaRes.json();
                if (metaData.interview) {
                    setMeta({
                        jobTitle: metaData.job?.title || "Position",
                        department: metaData.job?.department || "",
                        duration: metaData.interview.duration || 30,
                        candidateName: metaData.application?.candidateName || "Candidate",
                        status: metaData.interview.status,
                    });

                    // If already completed, show completed state
                    if (metaData.interview.status === "completed") {
                        setStatus("completed");
                        // Load existing transcript
                        if (metaData.interview.transcript) {
                            setMessages(
                                metaData.interview.transcript.map((t: { speaker: string; text: string; timestamp: string }, i: number) => ({
                                    id: `existing-${i}`,
                                    role: t.speaker === "ai" ? "ai" : "candidate",
                                    content: t.text,
                                    timestamp: new Date(t.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                                }))
                            );
                        }
                        return;
                    }
                }
            }

            // Get opening message from AI
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to start interview");
            }

            const data = await res.json();
            setMessages([
                {
                    id: "opening",
                    role: "ai",
                    content: data.content,
                    timestamp: formatTime(new Date()),
                },
            ]);
            setQuestionCount(1);
            setStatus("in_progress");
        } catch (err) {
            console.error("Init error:", err);
            setError(err instanceof Error ? err.message : "Failed to connect");
            setStatus("error");
        }
    }, [token]);

    useEffect(() => {
        initInterview();
    }, [initInterview]);

    // Send message
    async function handleSend() {
        if (!input.trim() || status === "completed" || isTyping) return;

        const userMessage = input.trim();
        const userMsg: Message = {
            id: Date.now().toString(),
            role: "candidate",
            content: userMessage,
            timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, message: userMessage }),
            });

            if (!res.ok) {
                throw new Error("Failed to get AI response");
            }

            const data = await res.json();
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.content,
                timestamp: formatTime(new Date()),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setQuestionCount((prev) => prev + 1);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: "I encountered an issue. Could you please repeat your last answer?",
                    timestamp: formatTime(new Date()),
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    }

    // End interview
    async function handleEndInterview() {
        setEndingInterview(true);
        try {
            // Update interview status to completed
            const metaRes = await fetch(`/api/interviews/by-token?token=${token}`);
            if (metaRes.ok) {
                const metaData = await metaRes.json();
                if (metaData.interview) {
                    // Mark completed
                    await fetch(`/api/interviews/${metaData.interview.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "completed" }),
                    });

                    // Trigger evaluation in background
                    fetch("/api/evaluate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ interviewId: metaData.interview.id }),
                    }).catch(console.error);
                }
            }

            setStatus("completed");
        } catch (err) {
            console.error("End interview error:", err);
        } finally {
            setEndingInterview(false);
        }
    }

    // Estimated progress based on time
    const progressPercent = meta.duration > 0
        ? Math.min((elapsed / (meta.duration * 60)) * 100, 100)
        : Math.min((questionCount / 8) * 100, 100);

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-muted-foreground">Preparing your interview...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center space-y-4 max-w-md px-6">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-xl font-semibold">Unable to Start Interview</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Top Bar */}
            <header className="flex items-center justify-between border-b border-border px-4 py-3 bg-background/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
                        <BrainCircuit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold">AI Interview</h1>
                        <p className="text-xs text-muted-foreground">
                            {meta.jobTitle}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant="secondary"
                        className={
                            status === "in_progress"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }
                    >
                        <span className="relative mr-1.5 flex h-2 w-2">
                            {status === "in_progress" && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            )}
                            <span
                                className={`relative inline-flex h-2 w-2 rounded-full ${status === "in_progress" ? "bg-emerald-500" : "bg-zinc-400"}`}
                            />
                        </span>
                        {status === "in_progress" ? "In Progress" : "Completed"}
                    </Badge>
                    <div className={`flex items-center gap-1.5 text-sm ${timeWarning ? "text-amber-500 font-medium" : timeUp ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                        <Clock className="h-4 w-4" />
                        {formatElapsed(elapsed)}
                        <span className="text-xs opacity-60">/ {meta.duration}m</span>
                    </div>
                </div>
            </header>

            {/* Time warning banner */}
            {timeWarning && status === "in_progress" && (
                <div className={`px-4 py-1.5 text-xs text-center font-medium ${timeUp ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {timeUp ? "⏰ Time is up! Please wrap up the interview." : "⏳ Less than 20% of your interview time remaining."}
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Chat Panel */}
                <div className="flex flex-1 flex-col">
                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
                    >
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                role={msg.role}
                                content={msg.content}
                                timestamp={msg.timestamp}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg">
                                    <BrainCircuit className="h-4 w-4 text-white" />
                                </div>
                                <span className="flex gap-1">
                                    <span className="animate-bounce [animation-delay:0ms]">●</span>
                                    <span className="animate-bounce [animation-delay:150ms]">●</span>
                                    <span className="animate-bounce [animation-delay:300ms]">●</span>
                                </span>
                            </div>
                        )}

                        {/* Completed banner */}
                        {status === "completed" && (
                            <div className="text-center py-6 space-y-3">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
                                    ✅ Interview completed
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Your responses are being evaluated. You&apos;ll hear back from the recruiter soon.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Input Bar */}
                    <div className="border-t border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={
                                    status === "completed"
                                        ? "Interview completed"
                                        : "Type your answer..."
                                }
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                disabled={status === "completed" || isTyping}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || status === "completed" || isTyping}
                                className="gradient-bg border-0 text-white hover:opacity-90"
                                size="icon"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                            {status === "in_progress" && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={handleEndInterview}
                                    disabled={endingInterview}
                                    title="End Interview"
                                >
                                    <StopCircle className={`h-4 w-4 ${endingInterview ? "animate-spin" : ""}`} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="hidden w-72 border-l border-border bg-muted/20 p-4 lg:block">
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{meta.candidateName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Interview Session
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-xs font-medium">Role Details</p>
                                </div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p><strong className="text-foreground">Position:</strong> {meta.jobTitle}</p>
                                    {meta.department && (
                                        <p><strong className="text-foreground">Department:</strong> {meta.department}</p>
                                    )}
                                    <p><strong className="text-foreground">Duration:</strong> {meta.duration} minutes</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 space-y-2">
                                <p className="text-xs font-medium">Interview Progress</p>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 rounded-full ${timeUp ? "bg-red-500" : timeWarning ? "bg-amber-500" : "gradient-bg"}`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground text-right">
                                    {Math.round(progressPercent)}% complete
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    );
}
