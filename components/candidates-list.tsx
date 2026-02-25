"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Users,
    Search,
    ArrowRight,
    Brain,
    Calendar,
    Mail,
    X
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Candidate {
    id: string;
    name: string;
    email: string;
    status: string;
    score: number | null;
    createdAt: string;
    jobTitle: string;
}

interface CandidatesListProps {
    initialCandidates: Candidate[];
}

export function CandidatesList({ initialCandidates }: CandidatesListProps) {
    const [search, setSearch] = useState("");

    const filteredCandidates = initialCandidates.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Candidates</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Manage all applicants across your recruitment pipeline
                    </p>
                </div>
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name, email, or job..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-9 bg-card/50 border-border/60 focus:border-primary/50 focus:ring-primary/20"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredCandidates.length === 0 ? (
                    <Card className="border-dashed py-12 text-center bg-transparent">
                        <CardContent className="space-y-3">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
                            <div className="space-y-1">
                                <h3 className="font-medium text-lg">
                                    {search ? "No matches found" : "No candidates yet"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {search
                                        ? `We couldn't find any candidates matching "${search}"`
                                        : "Applications will appear here once candidates apply to your jobs."
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCandidates.map((candidate) => (
                        <Link key={candidate.id} href={`/application/${candidate.id}`}>
                            <Card className="group transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer overflow-hidden border-border/60 bg-card/40 backdrop-blur-sm">
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-between p-4 sm:p-5">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold truncate group-hover:text-primary transition-colors">
                                                        {candidate.name}
                                                    </h3>
                                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 h-5 border-primary/20 bg-primary/5 text-primary">
                                                        {candidate.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                                                        <Brain className="h-3.5 w-3.5 text-primary/60" />
                                                        {candidate.jobTitle}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {candidate.email}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(candidate.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 sm:gap-8 shrink-0 pl-4">
                                            {candidate.score !== null && (
                                                <div className="text-right hidden xs:block">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <span className="text-xl font-black text-foreground leading-none">
                                                            {candidate.score}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">AI Score</span>
                                                    </div>
                                                    <div className="h-1.5 w-16 bg-secondary/50 rounded-full mt-1.5 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary to-violet-500"
                                                            style={{ width: `${candidate.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
