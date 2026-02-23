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

// Mock data
const job = {
    id: "1",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    employmentType: "Full-time",
    salaryMin: 150000,
    salaryMax: 200000,
    status: "active",
    matchThreshold: 75,
    interviewDuration: 30,
    description: "We are looking for a senior frontend engineer to lead the development of our next-generation web applications. You will work closely with our design and product teams to create exceptional user experiences.",
    requirements: "5+ years of React experience, TypeScript proficiency, experience with Next.js, strong understanding of CSS and responsive design.",
    responsibilities: "Lead frontend architecture decisions, mentor junior developers, collaborate with cross-functional teams, ensure code quality and best practices.",
};

const applications = [
    { id: "1", name: "Sarah Chen", email: "sarah@example.com", score: 92, status: "interviewed", date: "Feb 20" },
    { id: "2", name: "Alex Park", email: "alex@example.com", score: 88, status: "scheduled", date: "Feb 19" },
    { id: "3", name: "James Wilson", email: "james@example.com", score: 78, status: "matched", date: "Feb 18" },
    { id: "4", name: "Emily Brown", email: "emily@example.com", score: 65, status: "rejected", date: "Feb 17" },
    { id: "5", name: "Maria Garcia", email: "maria@example.com", score: 45, status: "applied", date: "Feb 16" },
];

const statusColors: Record<string, string> = {
    applied: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    matched: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    scheduled: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    interviewed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    decision: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function JobDetailPage() {
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
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 capitalize"
                        >
                            {job.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {job.employmentType}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4" />
                            ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Public Link
                    </Button>
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
                        Applications ({applications.length})
                    </TabsTrigger>
                    <TabsTrigger value="interviews">Interview Schedule</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Applications Tab */}
                <TabsContent value="applications" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
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
                                    {applications.map((app) => (
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
                                                <span className={`font-semibold text-sm ${app.score >= 75 ? "text-emerald-600" : app.score >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                                                    {app.score}%
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`capitalize text-xs ${statusColors[app.status] || ""}`}>
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {app.date}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Interview Schedule Tab */}
                <TabsContent value="interviews" className="mt-4">
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <CalendarIcon className="mx-auto mb-3 h-10 w-10 opacity-40" />
                            <p className="font-medium">No interviews scheduled yet</p>
                            <p className="text-sm">Interviews will appear here once candidates are matched and scheduled.</p>
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
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
        </svg>
    );
}
