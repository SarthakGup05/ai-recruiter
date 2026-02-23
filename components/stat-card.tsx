import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

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
        <Card className="relative overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold">{value}</p>
                            {trend && (
                                <span
                                    className={`text-xs font-semibold ${trend.positive ? "text-emerald-600" : "text-red-500"
                                        }`}
                                >
                                    {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
                                </span>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </CardContent>
            {/* Decorative gradient bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full gradient-bg opacity-60" />
        </Card>
    );
}
