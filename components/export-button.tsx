"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function ExportButton() {
    const searchParams = useSearchParams();

    const handleExport = () => {
        const period = searchParams.get("period") || "all";
        window.location.href = `/api/export/pipeline?period=${period}`;
    };

    return (
        <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
    );
}
