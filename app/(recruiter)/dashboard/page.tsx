import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { KanbanBoard, type KanbanColumn } from "@/components/kanban-board";
import { Briefcase, Users, CalendarCheck, TrendingUp, Plus } from "lucide-react";

// Mock data for demonstration
const mockColumns: KanbanColumn[] = [
    {
        id: "applied",
        title: "Applied",
        color: "#6366f1",
        candidates: [
            { id: "1", name: "Sarah Chen", email: "sarah@example.com", score: 92, appliedAt: "2h ago" },
            { id: "2", name: "James Wilson", email: "james@example.com", score: 78, appliedAt: "5h ago" },
            { id: "3", name: "Maria Garcia", email: "maria@example.com", appliedAt: "1d ago" },
        ],
    },
    {
        id: "matched",
        title: "Matched",
        color: "#8b5cf6",
        candidates: [
            { id: "4", name: "Alex Park", email: "alex@example.com", score: 88, appliedAt: "1d ago" },
            { id: "5", name: "Emily Brown", email: "emily@example.com", score: 85, appliedAt: "2d ago" },
        ],
    },
    {
        id: "scheduled",
        title: "Scheduled",
        color: "#06b6d4",
        candidates: [
            { id: "6", name: "David Kim", email: "david@example.com", score: 91, appliedAt: "3d ago" },
        ],
    },
    {
        id: "interviewed",
        title: "Interviewed",
        color: "#10b981",
        candidates: [
            { id: "7", name: "Lisa Wang", email: "lisa@example.com", score: 95, appliedAt: "5d ago" },
        ],
    },
    {
        id: "decision",
        title: "Decision",
        color: "#f59e0b",
        candidates: [],
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Overview of your recruitment pipeline
                    </p>
                </div>
                <Button asChild className="gradient-bg border-0 text-white hover:opacity-90 w-full sm:w-auto">
                    <Link href="/job/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Post New Job
                    </Link>
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Jobs"
                    value={12}
                    subtitle="3 active"
                    icon={Briefcase}
                    trend={{ value: 8, positive: true }}
                />
                <StatCard
                    title="Active Applications"
                    value={48}
                    subtitle="12 this week"
                    icon={Users}
                    trend={{ value: 23, positive: true }}
                />
                <StatCard
                    title="Interviews Done"
                    value={18}
                    subtitle="5 scheduled"
                    icon={CalendarCheck}
                    trend={{ value: 12, positive: true }}
                />
                <StatCard
                    title="Avg. Match Score"
                    value="82%"
                    subtitle="Above industry avg"
                    icon={TrendingUp}
                    trend={{ value: 5, positive: true }}
                />
            </div>

            {/* Kanban Board */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Candidate Pipeline</h2>
                <KanbanBoard columns={mockColumns} />
            </div>
        </div>
    );
}
