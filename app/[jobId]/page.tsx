"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Clock,
    DollarSign,
    BrainCircuit,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Send,
} from "lucide-react";
import { toast } from "sonner";

const employmentTypeLabels: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
    remote: "Remote",
};

interface Job {
    id: string;
    title: string;
    department: string | null;
    location: string | null;
    employmentType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    description: string | null;
    requirements: string | null;
    responsibilities: string | null;
    publicSlug: string;
}

export default function ApplyPage() {
    const params = useParams();
    const slug = params.jobId as string;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await fetch(`/api/public/jobs/${slug}`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setJob(data.job);
            } catch {
                setJob(null);
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [slug]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!job) return;
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: job.id,
                    candidateName: formData.get("name"),
                    email: formData.get("email"),
                    phone: formData.get("phone") || undefined,
                    linkedinUrl: formData.get("linkedin") || undefined,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || "Failed to submit application");
                return;
            }

            setSubmitted(true);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not found
    if (!job) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
                <h1 className="text-2xl font-bold">Job not found</h1>
                <p className="text-muted-foreground">
                    This position may no longer be available.
                </p>
                <Button asChild>
                    <Link href="/careers">Browse Open Positions</Link>
                </Button>
            </div>
        );
    }

    // Success state
    if (submitted) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold">Application Submitted!</h1>
                <p className="max-w-md text-muted-foreground">
                    Thank you for applying to <strong>{job.title}</strong>. We&apos;ll
                    review your application and get back to you soon.
                </p>
                <Button variant="outline" asChild className="mt-2">
                    <Link href="/careers">Browse More Positions</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg">
                            Hire<span className="text-primary">AI</span>
                        </span>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Back */}
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    All Positions
                </Link>

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Left: Job Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    {job.title}
                                </h1>
                                {job.department && (
                                    <Badge variant="secondary">{job.department}</Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {job.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        {job.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {employmentTypeLabels[job.employmentType] || job.employmentType}
                                </span>
                                {job.salaryMin && job.salaryMax && (
                                    <span className="flex items-center gap-1.5">
                                        <DollarSign className="h-4 w-4" />
                                        ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content sections */}
                        {job.description && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2">About this role</h2>
                                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {job.description}
                                </p>
                            </div>
                        )}
                        {job.requirements && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Requirements</h2>
                                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {job.requirements}
                                </p>
                            </div>
                        )}
                        {job.responsibilities && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
                                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {job.responsibilities}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Application Form */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <Card className="border-primary/20 shadow-lg shadow-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg">Apply Now</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Submit your application for this position
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                        <Input
                                            id="linkedin"
                                            name="linkedin"
                                            type="url"
                                            placeholder="https://linkedin.com/in/johndoe"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full gradient-bg border-0 text-white hover:opacity-90"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="mr-2 h-4 w-4" />
                                        )}
                                        Submit Application
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-border/50 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    Powered by{" "}
                    <span className="font-semibold text-foreground">
                        Hire<span className="text-primary">AI</span>
                    </span>{" "}
                    — AI-powered recruiting
                </div>
            </footer>
        </div>
    );
}
