import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    BrainCircuit,
    FileSearch,
    CalendarClock,
    Mic,
    ArrowRight,
    Zap,
    Shield,
    BarChart3,
    CheckCircle2,
} from "lucide-react";

const features = [
    {
        icon: FileSearch,
        title: "AI CV Screening",
        description:
            "Automatically parse and evaluate CVs against job requirements with 95%+ accuracy. Score candidates in seconds, not hours.",
    },
    {
        icon: CalendarClock,
        title: "Smart Scheduling",
        description:
            "Sync with Google Calendar and Outlook. Auto-detect availability and let candidates book slots — zero back-and-forth.",
    },
    {
        icon: Mic,
        title: "Live AI Interviews",
        description:
            "Conduct real-time voice interviews powered by AI. Dynamic follow-up questions, natural conversation, instant evaluation.",
    },
];

const stats = [
    { value: "70%", label: "Time Saved per Hire" },
    { value: "<500ms", label: "Interview Latency" },
    { value: "99.9%", label: "Platform Uptime" },
    { value: "50+", label: "Concurrent Sessions" },
];

const steps = [
    {
        num: "01",
        title: "Post a Job",
        desc: "Create a listing with requirements, salary, and custom questions.",
    },
    {
        num: "02",
        title: "Candidates Apply",
        desc: "Share a public link. CVs are parsed and scored automatically.",
    },
    {
        num: "03",
        title: "AI Interviews",
        desc: "Qualified candidates are scheduled and interviewed by AI.",
    },
    {
        num: "04",
        title: "Hire the Best",
        desc: "Review scores, transcripts, and AI recommendations to decide.",
    },
];

export default function MarketingPage() {
    return (
        <>
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-24 sm:py-32">
                {/* Gradient Orbs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[128px] animate-pulse-glow" />
                    <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-chart-5/20 blur-[128px] animate-pulse-glow [animation-delay:2s]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                        <Zap className="h-3.5 w-3.5" />
                        Autonomous AI Recruitment
                    </div>

                    <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Hire Smarter with{" "}
                        <span className="gradient-text">AI-Powered</span> Recruiting
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                        Screen candidates, conduct live AI interviews, and get instant
                        evaluations — all on autopilot. Save 70% of your hiring time and
                        never miss top talent again.
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            asChild
                            className="gradient-bg border-0 text-white px-8 h-12 text-base hover:opacity-90"
                        >
                            <Link href="/register">
                                Start Hiring Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                            <Link href="#features">See How It Works</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────────────── */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold sm:text-4xl">
                            Everything You Need to Hire
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                            From resume screening to final evaluation, HireAI handles the
                            entire pipeline autonomously.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20"
                            >
                                <CardContent className="p-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg mb-5">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                                <div className="absolute bottom-0 left-0 h-1 w-0 gradient-bg transition-all duration-500 group-hover:w-full" />
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats ────────────────────────────────────────────────────── */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-4xl font-bold gradient-text">{stat.value}</p>
                                <p className="mt-2 text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────────────── */}
            <section id="how-it-works" className="py-24 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                            Four simple steps from job post to hire.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-4">
                        {steps.map((step) => (
                            <div key={step.num} className="relative text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg text-xl font-bold text-white">
                                    {step.num}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ────────────────────────────────────────────────── */}
            <section className="py-24">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="rounded-3xl gradient-bg p-12 sm:p-16">
                        <BrainCircuit className="mx-auto mb-6 h-12 w-12 text-white/90" />
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Ready to Transform Your Hiring?
                        </h2>
                        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                            Join hundreds of recruiters who&apos;ve automated their pipeline.
                            Start free — no credit card required.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <Button
                                size="lg"
                                asChild
                                className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-base font-semibold"
                            >
                                <Link href="/register">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/70">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4" />
                                Free forever plan
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Shield className="h-4 w-4" />
                                GDPR compliant
                            </span>
                            <span className="flex items-center gap-1.5">
                                <BarChart3 className="h-4 w-4" />
                                Real-time analytics
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
