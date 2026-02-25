"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MoreHorizontal } from "lucide-react";

export interface KanbanCandidate {
    id: string;
    name: string;
    email: string;
    score?: number;
    appliedAt: string;
}

export interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    candidates: KanbanCandidate[];
}

interface KanbanBoardProps {
    columns: KanbanColumn[];
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function getScoreColor(score: number) {
    if (score >= 80)
        return "border-emerald-500/20 text-emerald-700 bg-emerald-500/10 dark:text-emerald-400";
    if (score >= 60)
        return "border-yellow-500/20 text-yellow-700 bg-yellow-500/10 dark:text-yellow-400";
    return "border-red-500/20 text-red-700 bg-red-500/10 dark:text-red-400";
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
    return (
        <div className="relative w-full">
            {/* ── Scroll Container ── */}
            {/* Added custom hide-scrollbar utilities but kept smooth snapping */}
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-2 px-4 sm:px-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {columns.map((column) => (
                    <div
                        key={column.id}
                        // Mobile: Takes up 85% of screen to peek next column. Desktop: Fixed 320px
                        className="flex w-[85vw] max-w-[320px] sm:w-[320px] shrink-0 snap-start flex-col rounded-2xl border border-border/60 bg-secondary/20 shadow-sm backdrop-blur-xl"
                    >
                        {/* ── Column Header ── */}
                        <div className="flex items-center justify-between p-4 pb-3">
                            <div className="flex items-center gap-2.5">
                                {/* Glowing color indicator */}
                                <div className="relative flex h-3 w-3 items-center justify-center">
                                    <div
                                        className="absolute h-full w-full rounded-full opacity-40 animate-pulse"
                                        style={{ backgroundColor: column.color }}
                                    />
                                    <div
                                        className="h-2 w-2 rounded-full z-10"
                                        style={{ backgroundColor: column.color }}
                                    />
                                </div>
                                <h3 className="text-sm font-semibold tracking-tight">
                                    {column.title}
                                </h3>
                            </div>
                            <Badge variant="secondary" className="h-6 px-2 text-xs font-semibold rounded-full bg-background border-border/50">
                                {column.candidates.length}
                            </Badge>
                        </div>

                        {/* ── Cards Area ── */}
                        <div className="flex flex-col gap-3 px-3 pb-3 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50">
                            {column.candidates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background/50 py-10 text-center">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-3">
                                        <span className="text-muted-foreground text-xs">0</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground/70">No candidates yet</p>
                                    <p className="text-xs text-muted-foreground mt-1">Move someone here</p>
                                </div>
                            ) : (
                                column.candidates.map((candidate) => (
                                    <Link
                                        key={candidate.id}
                                        href={`/application/${candidate.id}`}
                                        className="block transition-transform active:scale-[0.98]"
                                    >
                                        <Card
                                            className="group cursor-pointer rounded-xl border-border/50 bg-background shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                                        >
                                            <CardContent className="p-3.5">
                                                {/* Top Row: Avatar & Info */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border/50">
                                                            <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-semibold">
                                                                {getInitials(candidate.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-foreground/90 leading-none mb-1.5">
                                                                {candidate.name}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground font-medium">
                                                                {candidate.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button className="text-muted-foreground/50 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Bottom Row: Badges & Dates */}
                                                <div className="mt-4 flex items-center justify-between">
                                                    {candidate.score !== undefined ? (
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[10px] px-2 py-0.5 font-bold tracking-wide border ${getScoreColor(
                                                                candidate.score
                                                            )}`}
                                                        >
                                                            {candidate.score}% MATCH
                                                        </Badge>
                                                    ) : (
                                                        <div />
                                                    )}

                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-[10px] font-medium uppercase tracking-wider">
                                                            {candidate.appliedAt}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Mobile Scroll Fade Indicators ── */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent sm:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
        </div >
    );
}