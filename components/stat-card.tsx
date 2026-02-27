

import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: { value: number; positive: boolean };
}

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
}: StatCardProps) {
    return (
        <Card className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>

                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-3xl font-semibold tracking-tight text-foreground">
                                {value}
                            </p>

                            {trend && (
                                <span
                                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${trend.positive
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                        }`}
                                >
                                    {trend.positive ? (
                                        <ArrowUpRight className="h-3 w-3" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3" />
                                    )}
                                    {Math.abs(trend.value)}%
                                </span>
                            )}
                        </div>

                        {subtitle && (
                            <p className="text-xs text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}