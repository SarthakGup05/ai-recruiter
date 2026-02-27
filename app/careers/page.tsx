import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Clock,
    DollarSign,
    BrainCircuit,
    Briefcase,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react";
import { db } from "@/utils/db";
import { jobs } from "@/utils/db/schema";
import { eq, desc, ilike, and, or, count } from "drizzle-orm";
import { JobFilters } from "./job-filters";
import { Suspense } from "react";

const employmentTypeLabels: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
    remote: "Remote",
};

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function CareersPage(props: Props) {
    const searchParams = await props.searchParams;
    const q = searchParams.q || "";
    const department = searchParams.department || "";
    const employmentType = searchParams.type || "";
    const page = parseInt(searchParams.page || "1", 10);
    const limit = 10;
    const offset = (page - 1) * limit;

    const filters = [eq(jobs.status, "active")];

    if (q) {
        filters.push(
            or(
                ilike(jobs.title, `%${q}%`),
                ilike(jobs.department, `%${q}%`),
                ilike(jobs.location, `%${q}%`)
            )!
        );
    }
    if (department) filters.push(eq(jobs.department, department));
    if (employmentType) filters.push(eq(jobs.employmentType, employmentType as any));

    const whereClause = and(...filters);

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
        .where(whereClause)
        .orderBy(desc(jobs.createdAt))
        .limit(limit)
        .offset(offset);

    const [countResult] = await db
        .select({ total: count() })
        .from(jobs)
        .where(whereClause);

    const totalCount = countResult.total;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />
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
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="rounded-full font-medium" asChild>
                            <Link href="/login">Recruiter Login</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                {/* Hero */}
                <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-20">
                    <div className="container relative mx-auto px-4 sm:px-8 text-center">
                        <div className="inline-flex items-center justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
                            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary backdrop-blur-md">
                                <Briefcase className="mr-2 h-4 w-4" />
                                <span className="font-medium text-sm">Join Our Team</span>
                            </Badge>
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both leading-[1.1]">
                            Find Your Next <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-primary bg-300% animate-gradient">
                                Dream Role
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed font-medium">
                            Browse open positions and apply in minutes. Our AI-powered process ensures a fast, fair evaluation for every candidate.
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <div className="container mx-auto px-4 sm:px-8 max-w-5xl -mt-6 sm:-mt-8 mb-12 relative z-20">
                    <Suspense fallback={<div className="h-[96px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />}>
                        <JobFilters />
                    </Suspense>
                </div>

                {/* Job Listings */}
                <section className="container mx-auto px-4 sm:px-8 max-w-5xl pb-24">
                    {activeJobs.length === 0 ? (
                        <div className="py-32 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 animate-in fade-in duration-1000">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                                <Search className="h-8 w-8 text-muted-foreground/60" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">No positions found</h2>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                Try adjusting your search filters. We're always growing, so check back soon!
                            </p>
                            {(q || department || employmentType) && (
                                <Button variant="outline" className="mt-6 rounded-full" asChild>
                                    <Link href="/careers">Clear all filters</Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-6 px-1">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <span className="text-primary">{totalCount}</span> Open {totalCount === 1 ? 'Role' : 'Roles'}
                                </h3>
                            </div>

                            <div className="grid gap-4">
                                {activeJobs.map((job, index) => (
                                    <Link
                                        key={job.id}
                                        href={`/apply/${job.publicSlug}`}
                                        className="group block animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                                        style={{ animationDelay: `${100 + index * 50}ms`, animationDuration: "800ms" }}
                                    >
                                        <Card className="border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:bg-background/80 overflow-hidden relative">
                                            {/* Hover Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                                            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8">
                                                <div className="space-y-4 w-full min-w-0">
                                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                                        <h3 className="font-bold text-xl sm:text-2xl group-hover:text-primary transition-colors tracking-tight">
                                                            {job.title}
                                                        </h3>
                                                        {job.department && (
                                                            <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 px-3 py-1 text-xs shrink-0 font-medium">
                                                                {job.department}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-muted-foreground font-medium">
                                                        {job.location && (
                                                            <span className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 opacity-70" />
                                                                {job.location}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 opacity-70" />
                                                            {employmentTypeLabels[job.employmentType] || job.employmentType}
                                                        </span>
                                                        {job.salaryMin && job.salaryMax && (
                                                            <span className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-emerald-500 opacity-70" />
                                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                                    ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-12">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={page <= 1}
                                        asChild={page > 1}
                                        className="rounded-full h-10 w-10 border-border/50"
                                    >
                                        {page > 1 ? (
                                            <Link href={`/careers?page=${page - 1}${q ? `&q=${q}` : ''}${department ? `&department=${department}` : ''}${employmentType ? `&type=${employmentType}` : ''}`}>
                                                <ChevronLeft className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <ChevronLeft className="h-4 w-4 opacity-50" />
                                        )}
                                    </Button>

                                    <div className="text-sm font-medium px-4">
                                        Page {page} of {totalPages}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={page >= totalPages}
                                        asChild={page < totalPages}
                                        className="rounded-full h-10 w-10 border-border/50"
                                    >
                                        {page < totalPages ? (
                                            <Link href={`/careers?page=${page + 1}${q ? `&q=${q}` : ''}${department ? `&department=${department}` : ''}${employmentType ? `&type=${employmentType}` : ''}`}>
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <ChevronRight className="h-4 w-4 opacity-50" />
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 py-12 relative z-10 bg-background/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                            <BrainCircuit className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-bold tracking-tight">
                            Hire<span className="text-primary">AI</span>
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                        AI-powered recruiting platform for modern teams.
                    </p>
                </div>
            </footer>
        </div>
    );
}

