"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    UploadCloud,
    FileText,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    const slug = params.slug as string;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error("Please upload a PDF or DOCX file.");
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File size must be under 5MB.");
            return;
        }
        setFile(selectedFile);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!job) return;
        if (!file) {
            toast.error("Please upload your CV before submitting.");
            return;
        }

        setSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            // 1. Create the application
            const appRes = await fetch("/api/applications", {
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

            if (!appRes.ok) {
                const err = await appRes.json();
                toast.error(err.error || "Failed to submit application");
                setSubmitting(false);
                return;
            }

            const appData = await appRes.json();
            const applicationId = appData.application.id;

            // 2. Upload and Parse CV
            const cvData = new FormData();
            cvData.append("file", file);

            const uploadRes = await fetch(`/api/applications/${applicationId}/upload`, {
                method: "POST",
                body: cvData,
            });

            if (!uploadRes.ok) {
                // Non-blocking error, application was submitted but CV failed parsing/upload
                console.error("CV upload/parse failed in background.");
                toast.warning("Application submitted, but there was an issue processing your CV.");
            }

            setSubmitted(true);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 bg-background selection:bg-primary/30 text-center">
                <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center border border-border">
                    <BrainCircuit className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Job not found</h1>
                    <p className="text-muted-foreground text-lg mb-6">
                        This position may no longer be available.
                    </p>
                    <Button variant="default" size="lg" className="rounded-full shadow-lg" asChild>
                        <Link href="/careers">Browse Open Positions</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 bg-background selection:bg-primary/30 text-center animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 shadow-xl">
                        <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                </div>
                <div className="max-w-md">
                    <h1 className="text-3xl font-bold tracking-tight mb-3">Application Submitted!</h1>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Thank you for applying to <strong className="text-foreground">{job.title}</strong>. We've received your application and will review your profile shortly. Keep an eye on your inbox!
                    </p>
                    <Button variant="outline" size="lg" className="rounded-full shadow-sm" asChild>
                        <Link href="/careers">Browse More Positions</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />
            </div>

            {/* Navigation */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            Hire<span className="text-primary">AI</span>
                        </span>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-16 relative z-10">
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10 group"
                >
                    <div className="p-1.5 rounded-full bg-muted/50 group-hover:bg-muted transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Back to All Positions
                </Link>

                <div className="grid gap-12 lg:grid-cols-[1fr_440px]">
                    {/* Left: Job Details */}
                    <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                        {/* Header Details */}
                        <div className="space-y-6 border-b border-border/40 pb-8">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                                    {job.title}
                                </h1>
                                {job.department && (
                                    <Badge variant="outline" className="text-sm px-3 py-1 rounded-full bg-primary/5 text-primary border-primary/20">
                                        {job.department}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-base text-muted-foreground font-medium">
                                {job.location && (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary/60" />
                                        {job.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary/60" />
                                    {employmentTypeLabels[job.employmentType] || job.employmentType}
                                </span>
                                {job.salaryMin && job.salaryMax && (
                                    <span className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-emerald-500/80" />
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                            ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content Blocks */}
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight space-y-10">
                            {job.description && (
                                <div>
                                    <h2 className="text-2xl mb-4">About this role</h2>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                                </div>
                            )}
                            {job.requirements && (
                                <div>
                                    <h2 className="text-2xl mb-4">Requirements</h2>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
                                </div>
                            )}
                            {job.responsibilities && (
                                <div>
                                    <h2 className="text-2xl mb-4">Responsibilities</h2>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{job.responsibilities}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Application Form */}
                    <div className="lg:sticky lg:top-24 h-fit animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        <Card className="border border-white/10 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden relative">
                            {/* Card Subtle Glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none" />

                            <CardContent className="p-8 sm:p-10 relative z-10">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">Apply for this position</h2>
                                    <p className="text-muted-foreground">Submit your details and resume below.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Full Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="e.g. Jane Doe"
                                                required
                                                className="h-12 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email Address *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="jane@example.com"
                                                required
                                                className="h-12 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                className="h-12 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedin" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">LinkedIn URL</Label>
                                            <Input
                                                id="linkedin"
                                                name="linkedin"
                                                type="url"
                                                placeholder="https://linkedin.com/in/janedoe"
                                                className="h-12 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl shadow-sm"
                                            />
                                        </div>

                                        {/* Resume Drag and Drop */}
                                        <div className="space-y-2 pt-2">
                                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Resume/CV *</Label>
                                            <div
                                                className={cn(
                                                    "relative group border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ease-in-out cursor-pointer",
                                                    isDragging
                                                        ? "border-primary bg-primary/5 scale-[1.02]"
                                                        : file
                                                            ? "border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500"
                                                            : "border-border/60 hover:border-primary/50 bg-background/30 hover:bg-background/50"
                                                )}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                onClick={() => !file && fileInputRef.current?.click()}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                                                    }}
                                                />

                                                {file ? (
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                                            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                                                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="rounded-full hover:bg-destructive/10 hover:text-destructive shrink-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFile(null);
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/20">
                                                            <UploadCloud className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <p className="text-sm font-medium mb-1">
                                                            Click or drag file to upload
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            PDF or DOCX up to 5MB
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full h-14 rounded-xl font-bold bg-gradient-to-r from-primary to-violet-600 text-white hover:opacity-90 shadow-lg shadow-primary/25 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="mr-2 h-5 w-5" />
                                            )}
                                            Submit Application
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 py-12 relative z-10 mt-12 bg-background/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                        Powered by{" "}
                        <span className="font-semibold text-foreground">
                            Hire<span className="text-primary">AI</span>
                        </span>
                    </p>
                </div>
            </footer>
        </div>
    );
}

