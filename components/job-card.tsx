import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, DollarSign } from "lucide-react";

interface JobCardProps {
    id: string;
    title: string;
    department?: string;
    location?: string;
    employmentType: string;
    salaryMin?: number;
    salaryMax?: number;
    status: string;
    applicantCount?: number;
    createdAt: string;
}

const typeLabels: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
    remote: "Remote",
};

const statusStyles: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    archived: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

function formatSalary(min?: number, max?: number) {
    if (!min && !max) return null;
    const fmt = (n: number) =>
        n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
}

export function JobCard({
    id,
    title,
    department,
    location,
    employmentType,
    salaryMin,
    salaryMax,
    status,
    applicantCount = 0,
    createdAt,
}: JobCardProps) {
    const salary = formatSalary(salaryMin, salaryMax);

    return (
        <Link href={`/job/${id}`}>
            <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/30">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-3">
                            {/* Title & Department */}
                            <div>
                                <h3 className="text-base font-semibold group-hover:text-primary transition-colors truncate">
                                    {title}
                                </h3>
                                {department && (
                                    <p className="text-sm text-muted-foreground">{department}</p>
                                )}
                            </div>

                            {/* Meta Row */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                {location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {typeLabels[employmentType] || employmentType}
                                </span>
                                {salary && (
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3.5 w-3.5" />
                                        {salary}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {applicantCount} applicant{applicantCount !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <Badge
                            variant="secondary"
                            className={`shrink-0 capitalize ${statusStyles[status] || ""}`}
                        >
                            {status}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
