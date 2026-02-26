"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusColors: Record<string, string> = {
  applied: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  matched:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  scheduled: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  interviewed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  decision:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hired:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const PIPELINE_STATUSES = [
  { id: "applied", title: "Applied" },
  { id: "matched", title: "Matched" },
  { id: "scheduled", title: "Scheduled" },
  { id: "interviewed", title: "Interviewed" },
  { id: "decision", title: "Waitlist" },
  { id: "hired", title: "Hired" },
  { id: "rejected", title: "Rejected" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export interface ApplicationRow {
  id: string;
  name: string;
  email: string;
  score: number | null;
  status: string;
  createdAt: Date;
}

export function ApplicationsTable({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (applications.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
        <p className="font-medium">No applications yet</p>
        <p className="text-sm">
          Applications will appear here as candidates apply.
        </p>
      </div>
    );
  }

  const toggleAll = () => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(applications.map((app) => app.id)));
    }
  };

  const toggleOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedIds.size === 0) return;

    setIsUpdating(true);
    try {
      // Using Promise.all to PATCH individually for simplicity since we don't have a bulk API endpoint
      await Promise.all(
        Array.from(selectedIds).map(async (id) => {
          const res = await fetch(`/api/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: bulkStatus }),
          });
          if (!res.ok) throw new Error("Failed to update");
        }),
      );

      toast.success(`Successfully updated ${selectedIds.size} applications`);
      setSelectedIds(new Set());
      setBulkStatus("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update some applications. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-muted-foreground font-medium">
          {selectedIds.size} selected
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Move to..." />
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_STATUSES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-8 text-xs"
              disabled={!bulkStatus || isUpdating}
              onClick={handleBulkUpdate}
            >
              {isUpdating && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Apply
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={
                    selectedIds.size === applications.length &&
                    applications.length > 0
                  }
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow
                key={app.id}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedIds.has(app.id)}
                    onCheckedChange={() => toggleOne(app.id)}
                    aria-label={`Select ${app.name}`}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/application/${app.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-8 w-8 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(app.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {app.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.email}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/application/${app.id}`}
                    className="flex items-center gap-2"
                  >
                    {app.score != null ? (
                      <>
                        <span
                          className={`font-bold text-sm ${app.score >= 80 ? "text-emerald-600" : app.score >= 60 ? "text-yellow-600" : "text-red-500"}`}
                        >
                          {app.score}%
                        </span>
                        {app.score >= 85 && (
                          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[10px] h-4 px-1.5 uppercase font-bold tracking-wider hidden sm:inline-flex">
                            Top Match
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Calculating...
                      </span>
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/application/${app.id}`}>
                    <Badge
                      variant="secondary"
                      className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[app.status] || ""}`}
                    >
                      {app.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <Link href={`/application/${app.id}`} className="block">
                    {formatDate(new Date(app.createdAt))}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
