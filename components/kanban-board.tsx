"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MoreHorizontal, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";

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

function SortableCandidateCard({ candidate }: { candidate: KanbanCandidate }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: candidate.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card
                className={`group cursor-pointer rounded-xl border-border/50 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 ${isDragging ? "bg-muted cursor-grabbing" : "bg-background"
                    }`}
            >
                <CardContent className="p-3.5 relative">
                    {/* Drag Handle Overlay */}
                    <div
                        {...listeners}
                        className="absolute inset-y-0 left-0 w-8 flex justify-center pt-4 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                    </div>

                    <Link href={`/application/${candidate.id}`} className="block pl-4">
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
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

export function KanbanBoard({ columns: initialColumns }: KanbanBoardProps) {
    const [columns, setColumns] = useState(initialColumns);
    const [activeId, setActiveId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find source and destination columns
        let sourceCol = columns.find(c => c.candidates.some(cand => cand.id === activeId));
        let destCol = columns.find(c => c.id === overId || c.candidates.some(cand => cand.id === overId));

        if (!sourceCol || !destCol) return;

        if (sourceCol === destCol && activeId === overId) return;

        // Same column
        if (sourceCol.id === destCol.id) {
            const sourceIndex = sourceCol.candidates.findIndex(c => c.id === activeId);
            const destIndex = sourceCol.candidates.findIndex(c => c.id === overId);

            if (sourceIndex !== destIndex && destIndex !== -1) {
                const newCandidates = arrayMove(sourceCol.candidates, sourceIndex, destIndex);
                setColumns(cols => cols.map(c => c.id === sourceCol?.id ? { ...c, candidates: newCandidates } : c));
            }
            return;
        }

        // Different columns: moving candidate across columns
        const candidateToMove = sourceCol.candidates.find(c => c.id === activeId);
        if (!candidateToMove) return;

        const updatedSourceCol = {
            ...sourceCol,
            candidates: sourceCol.candidates.filter(c => c.id !== activeId)
        };

        let updatedDestCol = { ...destCol };
        const overIndex = destCol.candidates.findIndex(c => c.id === overId);
        if (overIndex >= 0) {
            updatedDestCol.candidates = [
                ...destCol.candidates.slice(0, overIndex),
                candidateToMove,
                ...destCol.candidates.slice(overIndex)
            ];
        } else {
            updatedDestCol.candidates = [...destCol.candidates, candidateToMove];
        }

        setColumns(cols => cols.map(c => {
            if (c.id === sourceCol?.id) return updatedSourceCol;
            if (c.id === destCol?.id) return updatedDestCol;
            return c;
        }));

        // Fire API to update status
        try {
            const res = await fetch(`/api/applications/${activeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: destCol.id }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }

            toast.success(`Application moved to ${destCol.title}`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update candidate status");
            // Revert on failure
            setColumns(initialColumns);
        }
    };

    const activeCandidate = activeId ? columns.flatMap(c => c.candidates).find(c => c.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="relative w-full">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-2 px-4 sm:px-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className="flex w-[85vw] max-w-[320px] sm:w-[320px] shrink-0 snap-start flex-col rounded-2xl border border-border/60 bg-secondary/20 shadow-sm backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between p-4 pb-3">
                                <div className="flex items-center gap-2.5">
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

                            <SortableContext
                                id={column.id}
                                items={column.candidates.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
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
                                            <SortableCandidateCard key={candidate.id} candidate={candidate} />
                                        ))
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    ))}
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent sm:hidden" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
            </div>

            <DragOverlay>
                {activeId && activeCandidate ? (
                    <Card className="rounded-xl border-border/50 bg-background shadow-xl opacity-90 scale-105 cursor-grabbing">
                        <CardContent className="p-3.5">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border/50">
                                        <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-semibold">
                                            {getInitials(activeCandidate.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-foreground/90 leading-none mb-1.5">
                                            {activeCandidate.name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground font-medium">
                                            {activeCandidate.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// Needed to make columns directly droppable if empty
function DroppableColumnWrapper({ children, id }: { children: React.ReactNode, id: string }) {
    // Actually dnd-kit SortableContext handles empty lists fine if we use the right hook, but
    // sometimes a separate useDroppable is needed for the column itself.
    // Given our simple setup, dropping into the column bounds themselves should work if
    // closestCorners is used. We can enhance if needed.
    return <>{children}</>;
}