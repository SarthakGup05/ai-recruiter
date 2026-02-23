"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

type Message = {
    id: string;
    role: "ai" | "candidate";
    content: string;
    timestamp: string;
};

const aiResponses = [
    "That's a great point. Could you tell me more about your experience with React and how you've applied it in production environments?",
    "Interesting. What would you say is your biggest technical achievement in the past year?",
    "I see. How do you approach debugging a complex production issue when you're under time pressure?",
    "Thank you for sharing that. Let's move on to a team-oriented question — how do you handle disagreements with colleagues about technical decisions?",
    "That's very insightful. One last question — what's the most challenging project you've worked on and what did you learn from it?",
    "Excellent. Thank you so much for your time today. We'll be in touch with the results shortly. Do you have any questions for us?",
];

function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function InterviewRoomPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content:
                "Hello! Welcome to your interview for the Senior Frontend Engineer position. I'm your AI interviewer today. Before we begin, could you please introduce yourself and tell me a little about your background?",
            timestamp: formatTime(new Date()),
        },
    ]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"waiting" | "in_progress" | "completed">("in_progress");
    const [aiResponseIndex, setAiResponseIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [elapsed, setElapsed] = useState(0);

    // Timer
    useEffect(() => {
        if (status !== "in_progress") return;
        const interval = setInterval(() => setElapsed((p) => p + 1), 1000);
        return () => clearInterval(interval);
    }, [status]);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isTyping]);

    const formatElapsed = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    function handleSend() {
        if (!input.trim() || status === "completed") return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "candidate",
            content: input.trim(),
            timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const response =
                aiResponseIndex < aiResponses.length
                    ? aiResponses[aiResponseIndex]
                    : "Thank you for your answers. This concludes our interview. We'll be reviewing your responses and will get back to you soon.";

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: response,
                timestamp: formatTime(new Date()),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setAiResponseIndex((prev) => prev + 1);
            setIsTyping(false);

            if (aiResponseIndex >= aiResponses.length - 1) {
                setStatus("completed");
            }
        }, 1500 + Math.random() * 1000);
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
                            Senior Frontend Engineer
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant="secondary"
                        className={
                            status === "in_progress"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : status === "completed"
                                    ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }
                    >
                        <span className="relative mr-1.5 flex h-2 w-2">
                            {status === "in_progress" && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            )}
                            <span
                                className={`relative inline-flex h-2 w-2 rounded-full ${status === "in_progress"
                                        ? "bg-emerald-500"
                                        : status === "completed"
                                            ? "bg-zinc-400"
                                            : "bg-yellow-500"
                                    }`}
                            />
                        </span>
                        {status === "in_progress"
                            ? "In Progress"
                            : status === "completed"
                                ? "Completed"
                                : "Waiting"}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatElapsed(elapsed)}
                    </div>
                </div>
            </header>

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
                                    onClick={() => setStatus("completed")}
                                    title="End Interview"
                                >
                                    <StopCircle className="h-4 w-4" />
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
                                        <p className="font-medium text-sm">Candidate</p>
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
                                    <p><strong className="text-foreground">Position:</strong> Senior Frontend Engineer</p>
                                    <p><strong className="text-foreground">Department:</strong> Engineering</p>
                                    <p><strong className="text-foreground">Duration:</strong> 30 minutes</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 space-y-2">
                                <p className="text-xs font-medium">Interview Progress</p>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full gradient-bg transition-all duration-500 rounded-full"
                                        style={{
                                            width: `${Math.min(
                                                ((aiResponseIndex + 1) / (aiResponses.length + 1)) * 100,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground text-right">
                                    {Math.round(
                                        ((aiResponseIndex + 1) / (aiResponses.length + 1)) * 100
                                    )}
                                    % complete
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    );
}
