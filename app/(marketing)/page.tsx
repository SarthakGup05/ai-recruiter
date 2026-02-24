"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { GlowingEffect } from "@/components/ui/glowing-effect";
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
    Sparkles,
} from "lucide-react";

// Split into two lines
const heroWordsLine1 = [
    { text: "Hire" },
    { text: "Smarter" },
    { text: "with" },
];

const heroWordsLine2 = [
    { text: "AI-Powered", className: "text-primary dark:text-primary" },
    { text: "Recruiting" },
];

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
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            {/* Decreased pt and pb here */}
            <section className="relative overflow-hidden pt-16 pb-16 sm:pt-24 sm:pb-24">
                {/* Tech Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Gradient Orbs */}
                <div className="pointer-events-none absolute inset-0 flex justify-center">
                    <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse-glow" />
                    <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    {/* Decreased mb from 8 to 6 */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 shadow-[0_0_15px_rgba(var(--primary),0.2)] backdrop-blur-sm transition-all hover:bg-primary/20">
                        <Sparkles className="h-4 w-4" />
                        <span>Autonomous AI Recruitment</span>
                    </div>

                    {/* Two-Line Typewriter Effect */}
                    {/* Decreased mb from 6 to 4 */}
                    <div className="flex flex-col items-center justify-center font-extrabold tracking-tight mb-4">
                        <TypewriterEffectSmooth
                            words={heroWordsLine1}
                            className="my-0"
                            cursorClassName="hidden"
                            delay={0.5}
                        />
                        <TypewriterEffectSmooth
                            words={heroWordsLine2}
                            className="my-0"
                            delay={2.5}
                        />
                    </div>

                    {/* Decreased mt from 6 to 4 */}
                    <p className="mx-auto mt-4 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                        Screen candidates, conduct live AI interviews, and get instant
                        evaluations — all on autopilot. Save{" "}
                        <span className="text-foreground font-semibold">70%</span> of your
                        hiring time and never miss top talent again.
                    </p>

                    {/* Decreased mt from 10 to 6 */}
                    <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            asChild
                            className="group relative overflow-hidden bg-primary text-primary-foreground border-0 px-8 h-14 text-base font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.7)]"
                        >
                            <Link href="/register">
                                <span className="relative z-10 flex items-center">
                                    Start Hiring Free
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 h-full w-full scale-[2.0] blur-lg bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="h-14 px-8 text-base font-medium backdrop-blur-sm bg-background/50 hover:bg-muted/50 transition-all hover:scale-105"
                        >
                            <Link href="#features">See How It Works</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Stats Glass Bar ───────────────────────────────────────────── */}
            <section className="relative z-10 -mt-8 pb-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border bg-card/40 backdrop-blur-xl p-8 shadow-2xl shadow-primary/5">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/50">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="text-center pt-4 md:pt-0 first:pt-0"
                                >
                                    <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50">
                                        {stat.value}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────────────── */}
            <section id="features" className="py-24 relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold sm:text-5xl tracking-tight mb-4">
                            Everything You Need to Hire
                        </h2>
                        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
                            From resume screening to final evaluation, HireAI handles the
                            entire pipeline autonomously.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                // 1. Moved hover animations here & added h-full
                                className="group relative h-full rounded-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                            >
                                <GlowingEffect
                                    disabled={false}
                                    glow={true}
                                    proximity={64}
                                    spread={40}
                                    blur={4}
                                    borderWidth={2}
                                    inactiveZone={0.01}
                                    movementDuration={2}
                                    variant="default"
                                />
                                {/* 2. Removed hover translations from the card, added h-full, and tweaked bg-opacity so glow stays on the border */}
                                <Card className="relative h-full rounded-[inherit] bg-card/95 backdrop-blur-md border-muted/50 overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                                            <feature.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-blue-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works (Timeline) ──────────────────────────────────── */}
            <section id="how-it-works" className="relative py-24 bg-muted/30 border-y border-border/50 overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl font-extrabold sm:text-5xl tracking-tight mb-4">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
                            Four simple steps from job post to hire.
                        </p>
                    </div>

                    <div className="relative grid gap-16 md:gap-8 md:grid-cols-4">

                        {/* ── Continuous Glowing Connecting Line (Desktop) ── */}
                        <div className="hidden md:block absolute top-[2.3rem] left-[12%] w-[76%] h-[2px]">
                            {/* 1. Static continuous glow bleed */}
                            <div className="absolute inset-0 bg-primary/40 blur-[4px] rounded-full" />

                            {/* 2. Track & Moving Energy Segment (Using globals.css animation) */}
                            <div className="absolute inset-0 overflow-hidden rounded-full bg-primary/20">
                                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-100 blur-[1px] animate-timeline-shimmer" />
                            </div>
                        </div>

                        {steps.map((step) => (
                            <div key={step.num} className="relative text-center group cursor-default">
                                {/* Inner wrapper for whole-column hover lift */}
                                <div className="transition-transform duration-500 ease-out group-hover:-translate-y-3">

                                    {/* Step Node / Number Wrapper */}
                                    <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">

                                        {/* ── Continuous Pulsing Aura ── */}
                                        <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl animate-pulse" style={{ animationDuration: '3s' }} />

                                        {/* Outer bloom ring (expands on hover) */}
                                        <div className="absolute inset-0 rounded-full bg-primary/30 scale-50 opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.75] group-hover:opacity-20" />

                                        {/* Inner ambient glow (intensifies on hover) */}
                                        <div className="absolute inset-1 rounded-full bg-primary/30 blur-md transition-all duration-500 group-hover:bg-primary/50 group-hover:blur-xl" />

                                        {/* Solid Step Circle */}
                                        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary/40 text-2xl font-bold text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]">
                                            {step.num}
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-primary">
                                        {step.title}
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed px-2 transition-colors duration-300 group-hover:text-foreground">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 sm:py-32 relative overflow-hidden">
                <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
                    {/* Animated Gradient Border Wrapper */}
                    <div className="relative group rounded-[2.5rem] p-[2px] overflow-hidden">
                        {/* Spinning gradient background for the border */}
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(var(--primary),0.2)_0%,rgba(var(--primary),1)_50%,rgba(var(--primary),0.2)_100%)] animate-[spin_4s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Main CTA Card */}
                        <div className="relative overflow-hidden rounded-[2.4rem] bg-primary px-6 py-20 sm:px-20 sm:py-28 shadow-2xl z-10">

                            {/* ── Background Textures & Lighting ── */}
                            {/* Base dot pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                            {/* Floating ambient light orbs */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[80px] mix-blend-overlay animate-pulse" style={{ animationDuration: '4s' }} />
                                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[100px] mix-blend-overlay animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                            </div>

                            {/* ── Content ── */}
                            <div className="relative z-20 flex flex-col items-center">
                                {/* Icon inside a glassmorphic pill */}
                                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20">
                                    <BrainCircuit
                                        className="h-10 w-10 text-white animate-bounce"
                                        style={{ animationDuration: "3s" }}
                                    />
                                </div>

                                <h2 className="text-4xl font-extrabold text-white sm:text-6xl tracking-tight mb-6 max-w-3xl leading-[1.1]">
                                    Ready to Transform Your Hiring?
                                </h2>

                                <p className="text-lg sm:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
                                    Join hundreds of recruiters who&apos;ve automated their
                                    pipeline. Start free — no credit card required.
                                </p>

                                <div className="flex flex-col items-center gap-4 w-full sm:w-auto sm:flex-row sm:justify-center">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="group relative overflow-hidden bg-white text-primary hover:bg-white h-16 px-10 text-lg font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] w-full sm:w-auto"
                                    >
                                        <Link href="/register">
                                            <span className="relative z-10 flex items-center">
                                                Get Started Free
                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                            {/* Inner button shine effect */}
                                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        </Link>
                                    </Button>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-10 gap-y-6 text-base font-medium text-white/80">
                                    <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                        <div className="p-1 rounded-full bg-white/20">
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                        Free forever plan
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                        <div className="p-1 rounded-full bg-white/20">
                                            <Shield className="h-4 w-4 text-white" />
                                        </div>
                                        GDPR compliant
                                    </div>
                                    <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                        <div className="p-1 rounded-full bg-white/20">
                                            <BarChart3 className="h-4 w-4 text-white" />
                                        </div>
                                        Real-time analytics
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
