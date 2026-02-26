"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Briefcase,
    Users,
    MoreHorizontal,
    Plus,
    Eye,
    Archive,
    Trash2,
    CheckCircle2,
    ChevronRight,
    MapPin,
    Calendar,
    Search,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Job {
    id: string;
    title: string;
    department: string | null;
    location: string | null;
    status: string;
    createdAt: string;
    appCount: number;
}

interface JobsListProps {
    initialJobs: Job[];
}

export function JobsList({ initialJobs }: JobsListProps) {
    const [jobs, setJobs] = useState(initialJobs);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const filteredJobs = jobs.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        (j.department?.toLowerCase() || "").includes(search.toLowerCase())
    );

    async function handleArchive(id: string) {
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Job archived successfully");
                setJobs(prev => prev.map(j => j.id === id ? { ...j, status: "archived" } : j));
            } else {
                toast.error("Failed to archive job");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    }

    async function handleStatusChange(id: string, newStatus: string) {
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                toast.success(`Job status updated to ${newStatus}`);
                setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-heading">Job Management</h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Post, edit, and track your active job openings
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64 group">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Filter jobs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-card/40 border-border/60 focus:border-primary/50 focus:ring-primary/20"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button asChild className="gradient-bg border-0 text-white hover:opacity-90 shadow-lg shadow-primary/20">
                        <Link href="/job/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Post Job
                        </Link>
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredJobs.length === 0 ? (
                    <Card className="border-dashed py-16 text-center bg-transparent">
                        <CardContent className="space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center">
                                <Briefcase className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-xl">
                                    {search ? "No matches found" : "No jobs posted"}
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    {search
                                        ? `We couldn't find any jobs matching "${search}"`
                                        : "Attract the best talent by posting your first job opening."
                                    }
                                </p>
                            </div>
                            {!search && (
                                <Button asChild variant="outline" className="mt-4 border-primary/20 hover:bg-primary/5">
                                    <Link href="/job/new">Create Your First Job</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    filteredJobs.map((job) => (
                        <Card key={job.id} className="group relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 border-border/60 bg-card/40 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                                            <Briefcase className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">
                                                    {job.title}
                                                </h3>
                                                <Badge
                                                    variant={job.status === "active" ? "default" : "secondary"}
                                                    className={job.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-secondary/50 text-muted-foreground border-border"}
                                                >
                                                    {job.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground font-medium">
                                                {job.department && (
                                                    <span className="text-foreground/70 font-bold">{job.department}</span>
                                                )}
                                                {job.location && (
                                                    <span className="flex items-center gap-1.5 line-clamp-1">
                                                        <MapPin className="h-3.5 w-3.5 text-primary/60" />
                                                        {job.location}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 pt-4 sm:pt-0 border-t sm:border-0 border-border/40">
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-xl font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                                                    {job.appCount}
                                                </div>
                                                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Applicants</div>
                                            </div>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary/60 border border-primary/10">
                                                <Users className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                                <Link href={`/job/${job.id}`}>
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/80">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-md border-border/60">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/job/${job.id}`} className="flex items-center cursor-pointer font-medium">
                                                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {job.status !== "active" && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(job.id, "active")}
                                                            className="flex items-center cursor-pointer font-medium text-emerald-600 hover:text-emerald-700"
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Re-activate Job
                                                        </DropdownMenuItem>
                                                    )}
                                                    {job.status === "active" && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(job.id, "draft")}
                                                            className="flex items-center cursor-pointer font-medium text-amber-600 hover:text-amber-700"
                                                        >
                                                            <Archive className="mr-2 h-4 w-4" /> Close for Applications
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleArchive(job.id)}
                                                        className="flex items-center cursor-pointer font-medium text-destructive hover:text-destructive/90"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Archive & Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <Button variant="ghost" size="sm" asChild className="hidden md:flex rounded-full group/btn font-bold">
                                                <Link href={`/job/${job.id}`} className="flex items-center">
                                                    Manage
                                                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-violet-500 opacity-0 transition-all duration-500 group-hover:opacity-100" />
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
