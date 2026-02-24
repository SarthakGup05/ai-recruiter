import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MapPin,
    Clock,
    DollarSign,
    Search,
    BrainCircuit,
    Briefcase,
    ArrowRight,
} from "lucide-react";
import { db } from "@/utils/db";
import { jobs } from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";

const employmentTypeLabels: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
    remote: "Remote",
};

export default async function CareersPage() {
    const activeJobs = await db
        .select({
            id: jobs.id,
            title: jobs.title,
            department: jobs.department,
            location: jobs.location,
            employmentType: jobs.employmentType,
            salaryMin: jobs.salaryMin,
            salaryMax: jobs.salaryMax,
            publicSlug: jobs.publicSlug,
            createdAt: jobs.createdAt,
        })
        .from(jobs)
        .where(eq(jobs.status, "active"))
        .orderBy(desc(jobs.createdAt));

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
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Recruiter Login</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
                <div className="container relative mx-auto px-4 py-16 sm:py-24 text-center">
                    <Badge variant="secondary" className="mb-4 px-3 py-1">
                        <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                        {activeJobs.length} Open Position{activeJobs.length !== 1 ? "s" : ""}
                    </Badge>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                        Find Your Next{" "}
                        <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                            Dream Role
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Browse open positions and apply in minutes. Our AI-powered process
                        ensures a fast, fair evaluation for every candidate.
                    </p>
                </div>
            </section>

            {/* Job Listings */}
            <section className="container mx-auto px-4 py-12">
                {activeJobs.length === 0 ? (
                    <div className="py-24 text-center">
                        <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                        <h2 className="text-xl font-semibold">No open positions right now</h2>
                        <p className="mt-2 text-muted-foreground">
                            Check back soon — we&apos;re always growing!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 max-w-3xl mx-auto">
                        {activeJobs.map((job) => (
                            <Link key={job.id} href={`/apply/${job.publicSlug}`}>
                                <Card className="group transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 cursor-pointer">
                                    <CardContent className="flex items-center justify-between gap-4 p-5">
                                        <div className="space-y-2 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                    {job.title}
                                                </h3>
                                                {job.department && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {job.department}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                {job.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {job.location}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {employmentTypeLabels[job.employmentType] || job.employmentType}
                                                </span>
                                                {job.salaryMin && job.salaryMax && (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-3.5 w-3.5" />
                                                        ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 py-8">
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
