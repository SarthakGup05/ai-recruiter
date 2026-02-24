import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MapPin,
    Clock,
    DollarSign,
    Pencil,
    ArrowLeft,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/utils/db";
import { jobs, applications } from "@/utils/db/schema";
import { eq, and, desc } from "drizzle-orm";

const statusColors: Record<string, string> = {
    applied: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    matched: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    scheduled: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    interviewed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    decision: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    hired: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const employmentTypeLabels: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
    remote: "Remote",
};

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { id } = await params;

    // Fetch job (must belong to current user)
    const [job] = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, id), eq(jobs.recruiterId, user.id)))
        .limit(1);

    if (!job) notFound();

    // Fetch applications for this job
    const jobApplications = await db
        .select({
            id: applications.id,
            name: applications.candidateName,
            email: applications.email,
            score: applications.matchScore,
            status: applications.status,
            createdAt: applications.createdAt,
        })
        .from(applications)
        .where(eq(applications.jobId, id))
        .orderBy(desc(applications.createdAt));

    const jobStatusBadge =
        job.status === "active"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : job.status === "draft"
                ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>

            {/* Job Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{job.title}</h1>
                        <Badge
                            variant="secondary"
                            className={`capitalize ${jobStatusBadge}`}
                        >
                            {job.status}
                        </Badge>
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
                <div className="flex gap-2">
                    {job.publicSlug && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/apply/${job.publicSlug}`} target="_blank">
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                Public Link
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="applications">
                <TabsList>
                    <TabsTrigger value="applications">
                        Applications ({jobApplications.length})
                    </TabsTrigger>
                    <TabsTrigger value="details">Job Details</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Applications Tab */}
                <TabsContent value="applications" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            {jobApplications.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                                    <p className="font-medium">No applications yet</p>
                                    <p className="text-sm">Applications will appear here as candidates apply.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Candidate</TableHead>
                                            <TableHead>Match Score</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Applied</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {jobApplications.map((app) => (
                                            <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                                {getInitials(app.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-sm">{app.name}</p>
                                                            <p className="text-xs text-muted-foreground">{app.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {app.score != null ? (
                                                        <span className={`font-semibold text-sm ${app.score >= 75 ? "text-emerald-600" : app.score >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                                                            {app.score}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">Pending</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={`capitalize text-xs ${statusColors[app.status] || ""}`}>
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(new Date(app.createdAt))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Job Details Tab */}
                <TabsContent value="details" className="mt-4">
                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            {job.description && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                                </div>
                            )}
                            {job.requirements && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-2">Requirements</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
                                </div>
                            )}
                            {job.responsibilities && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-2">Responsibilities</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.responsibilities}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Job Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div>
                                    <p className="font-medium text-sm">Match Threshold</p>
                                    <p className="text-xs text-muted-foreground">Minimum score to auto-qualify candidates</p>
                                </div>
                                <span className="text-lg font-bold text-primary">{job.matchThreshold}%</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                <div>
                                    <p className="font-medium text-sm">Interview Duration</p>
                                    <p className="text-xs text-muted-foreground">Length of AI interview session</p>
                                </div>
                                <span className="text-lg font-bold text-primary">{job.interviewDuration} min</span>
                            </div>
                            {job.customQuestions && job.customQuestions.length > 0 && (
                                <div className="rounded-lg border border-border p-4">
                                    <p className="font-medium text-sm mb-3">Custom Interview Questions</p>
                                    <ol className="list-decimal list-inside space-y-2">
                                        {job.customQuestions.map((q, i) => (
                                            <li key={i} className="text-sm text-muted-foreground">{q}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Users({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
