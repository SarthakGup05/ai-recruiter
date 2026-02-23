"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CvUpload } from "@/components/cv-upload";
import { MapPin, Clock, DollarSign, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Mock job data
const job = {
    title: "Senior Frontend Engineer",
    company: "HireAI Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150k – $200k",
    description:
        "We are looking for a senior frontend engineer to lead the development of our next-generation web applications.",
};

export default function ApplyPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload your CV");
            return;
        }

        setLoading(true);

        try {
            // Simulated submission
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSubmitted(true);
            toast.success("Application submitted!");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="py-12 space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold">Application Submitted!</h2>
                        <p className="text-muted-foreground">
                            Thank you for applying. We&apos;ll review your CV and get back to you
                            within 48 hours. If matched, you&apos;ll receive an AI interview
                            invitation via email.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="mx-auto max-w-2xl px-4 space-y-6">
                {/* Job Preview */}
                <Card className="border-primary/20">
                    <CardContent className="p-6">
                        <h1 className="text-xl font-bold">{job.title}</h1>
                        <p className="text-sm font-medium text-primary">{job.company}</p>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            {job.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                <Clock className="h-3 w-3" />
                                {job.type}
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                <DollarSign className="h-3 w-3" />
                                {job.salary}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Application Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Apply for this position</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input id="name" name="name" placeholder="Jane Smith" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input id="email" name="email" type="email" placeholder="jane@email.com" required />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                    <Input id="linkedin" name="linkedin" placeholder="linkedin.com/in/janesmith" />
                                </div>
                            </div>

                            {/* CV Upload */}
                            <div className="space-y-2">
                                <Label>Resume / CV *</Label>
                                <CvUpload onFileSelect={(f) => setFile(f)} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gradient-bg border-0 text-white hover:opacity-90 h-11"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Submit Application
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
