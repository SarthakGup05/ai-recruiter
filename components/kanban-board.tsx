"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    if (score >= 80) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400";
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
                <div
                    key={column.id}
                    className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-muted/30"
                >
                    {/* Column Header */}
                    <div className="flex items-center gap-2 p-4 pb-3">
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: column.color }}
                        />
                        <h3 className="text-sm font-semibold">{column.title}</h3>
                        <span className="ml-auto text-xs font-medium text-muted-foreground rounded-full bg-muted px-2 py-0.5">
                            {column.candidates.length}
                        </span>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-2 px-3 pb-3">
                        {column.candidates.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                                No candidates
                            </div>
                        ) : (
                            column.candidates.map((candidate) => (
                                <Card
                                    key={candidate.id}
                                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                                                    {getInitials(candidate.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {candidate.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {candidate.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            {candidate.score !== undefined && (
                                                <Badge
                                                    variant="secondary"
                                                    className={`text-[10px] px-1.5 py-0 ${getScoreColor(candidate.score)}`}
                                                >
                                                    {candidate.score}% match
                                                </Badge>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">
                                                {candidate.appliedAt}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
