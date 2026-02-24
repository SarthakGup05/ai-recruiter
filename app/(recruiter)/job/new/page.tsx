"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Briefcase, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [customQuestions, setCustomQuestions] = useState<string[]>([]);
    const [newQuestion, setNewQuestion] = useState("");

    function addQuestion() {
        const q = newQuestion.trim();
        if (q && customQuestions.length < 10) {
            setCustomQuestions([...customQuestions, q]);
            setNewQuestion("");
        }
    }

    function removeQuestion(index: number) {
        setCustomQuestions(customQuestions.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>, asDraft = false) {
        e.preventDefault();
        if (asDraft) {
            setSavingDraft(true);
        } else {
            setLoading(true);
        }

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            department: formData.get("department"),
            location: formData.get("location"),
            employmentType: formData.get("employmentType"),
            salaryMin: formData.get("salaryMin") ? Number(formData.get("salaryMin")) : undefined,
            salaryMax: formData.get("salaryMax") ? Number(formData.get("salaryMax")) : undefined,
            description: formData.get("description"),
            requirements: formData.get("requirements"),
            responsibilities: formData.get("responsibilities"),
            matchThreshold: formData.get("matchThreshold") ? Number(formData.get("matchThreshold")) : 75,
            interviewDuration: formData.get("interviewDuration") ? Number(formData.get("interviewDuration")) : 30,
            customQuestions: customQuestions.length > 0 ? customQuestions : undefined,
            status: asDraft ? "draft" : "active",
        };

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || "Failed to create job");
                return;
            }

            toast.success(asDraft ? "Job saved as draft!" : "Job posted successfully!");
            router.push("/dashboard");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            setSavingDraft(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Back Link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-bg">
                    <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Post a New Job</h1>
                    <p className="text-muted-foreground text-sm">Fill in the details to create a new job listing</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input id="title" name="title" placeholder="e.g. Senior Frontend Engineer" required />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" name="department" placeholder="e.g. Engineering" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" placeholder="e.g. San Francisco, CA" />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="employmentType">Employment Type</Label>
                                <Select name="employmentType" defaultValue="full_time">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full_time">Full-time</SelectItem>
                                        <SelectItem value="part_time">Part-time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salaryMin">Min Salary ($)</Label>
                                <Input id="salaryMin" name="salaryMin" type="number" placeholder="e.g. 100000" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salaryMax">Max Salary ($)</Label>
                                <Input id="salaryMax" name="salaryMax" type="number" placeholder="e.g. 150000" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the role, team, and what makes this opportunity exciting..."
                                className="min-h-[120px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements</Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                placeholder="List the skills, experience, and qualifications required..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="responsibilities">Responsibilities</Label>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                placeholder="Describe the key responsibilities and day-to-day activities..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* AI Interview Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">AI Interview Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="matchThreshold">Match Threshold (%)</Label>
                                <Input
                                    id="matchThreshold"
                                    name="matchThreshold"
                                    type="number"
                                    min={0}
                                    max={100}
                                    defaultValue={75}
                                    placeholder="75"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum score to auto-qualify candidates
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interviewDuration">Interview Duration</Label>
                                <Select name="interviewDuration" defaultValue="30">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">60 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Length of each AI interview session
                                </p>
                            </div>
                        </div>

                        {/* Custom Questions */}
                        <div className="space-y-3">
                            <Label>Custom Interview Questions</Label>
                            <p className="text-xs text-muted-foreground">
                                Add up to 10 custom questions for the AI to ask during interviews
                            </p>
                            {customQuestions.length > 0 && (
                                <div className="space-y-2">
                                    {customQuestions.map((q, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3"
                                        >
                                            <span className="text-xs font-semibold text-muted-foreground mt-0.5 shrink-0">
                                                {i + 1}.
                                            </span>
                                            <span className="text-sm flex-1">{q}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(i)}
                                                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {customQuestions.length < 10 && (
                                <div className="flex gap-2">
                                    <Input
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        placeholder="e.g. Describe a challenging project you led..."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addQuestion();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={addQuestion}
                                        disabled={!newQuestion.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={savingDraft || loading}
                        onClick={(e) => {
                            const form = (e.target as HTMLElement).closest("form");
                            if (form) {
                                const fakeEvent = { preventDefault: () => { }, currentTarget: form } as unknown as React.FormEvent<HTMLFormElement>;
                                handleSubmit(fakeEvent, true);
                            }
                        }}
                    >
                        {savingDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save as Draft
                    </Button>
                    <Button
                        type="submit"
                        className="gradient-bg border-0 text-white hover:opacity-90"
                        disabled={loading || savingDraft}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Publish Job
                    </Button>
                </div>
            </form>
        </div>
    );
}
