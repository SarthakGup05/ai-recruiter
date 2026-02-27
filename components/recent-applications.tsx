import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, ChevronRight } from "lucide-react";

type PipelineCandidate = {
    id: string;
    name: string;
    email: string;
    score?: number;
    status: string;
    createdAt: Date;
};

const STATUS_CONFIG: Record<string, { label: string; colorClass: string }> = {
    applied: { label: "Applied", colorClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20" },
    matched: { label: "Matched", colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    scheduled: { label: "Scheduled", colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    interviewed: { label: "Interviewed", colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    decision: { label: "Decision", colorClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
};

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function RecentApplications({ candidates }: { candidates: PipelineCandidate[] }) {
    // Sort by most recent first
    const sorted = [...candidates].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (sorted.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-t border-border/40">
                <div className="mb-4 rounded-full bg-muted/50 p-3">
                    <Clock className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">No applications yet</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    When candidates apply to your jobs, they will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border/40">
                        <TableHead className="w-[300px] text-xs font-semibold text-muted-foreground">Candidate</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Match Score</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground hidden sm:table-cell">Applied</TableHead>
                        <TableHead className="text-right text-xs font-semibold text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sorted.map((candidate) => {
                        const statusConfig = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.applied;
                        return (
                            <TableRow
                                key={candidate.id}
                                className="group hover:bg-muted/40 border-border/40 transition-colors"
                            >
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border/50">
                                            <AvatarFallback className="text-[11px] bg-secondary text-secondary-foreground font-medium">
                                                {getInitials(candidate.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <span className="truncate text-sm font-medium text-foreground tracking-tight">
                                                {candidate.name}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {candidate.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className={`font-semibold text-[11px] border shadow-sm ${statusConfig.colorClass}`}>
                                        {statusConfig.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    {candidate.score !== undefined ? (
                                        <div className="flex items-center gap-1.5">
                                            <div className={`h-1.5 w-1.5 rounded-full ${candidate.score >= 80 ? 'bg-emerald-500' : candidate.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                            <span className="text-sm font-medium text-foreground">
                                                {candidate.score}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="py-4 hidden sm:table-cell text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <Link
                                        href={`/application/${candidate.id}`}
                                        className="inline-flex items-center justify-center rounded-lg h-8 w-8 text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm border border-transparent hover:border-border transition-all"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
