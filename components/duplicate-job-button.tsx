"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DuplicateJobButtonProps {
    jobId: string;
}

export function DuplicateJobButton({ jobId }: DuplicateJobButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDuplicate() {
        setLoading(true);
        try {
            const res = await fetch(`/api/jobs/${jobId}/duplicate`, {
                method: "POST",
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || "Failed to duplicate job");
                return;
            }

            const data = await res.json();
            toast.success("Job duplicated successfully!");
            router.push(`/job/${data.job.id}/edit`);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={loading}>
            {loading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
                <Copy className="mr-2 h-3.5 w-3.5" />
            )}
            Duplicate
        </Button>
    );
}
