

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
        <Card className="group relative overflow-hidden rounded-2xl border-border/60 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
            {/* Soft background glow that appears on hover */}
            <div className="absolute -inset-px bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <CardContent className="relative z-10 p-5 sm:p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 sm:space-y-2">
                        <p className="text-sm font-medium text-muted-foreground tracking-tight">
                            {title}
                        </p>
                        
                        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
                            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                {value}
                            </p>
                            
                            {trend && (
                                <span
                                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-bold transition-colors ${
                                        trend.positive
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                    }`}
                                >
                                    {trend.positive ? (
                                        <ArrowUpRight className="h-3 w-3 stroke-[3]" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 stroke-[3]" />
                                    )}
                                    {Math.abs(trend.value)}%
                                </span>
                            )}
                        </div>
                        
                        {subtitle && (
                            <p className="text-xs font-medium text-muted-foreground/70">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    
                    {/* Icon Container with hover inversion */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:scale-110">
                        <Icon className="h-6 w-6 text-primary transition-colors duration-500 group-hover:text-primary-foreground" />
                    </div>
                </div>
            </CardContent>

            {/* Decorative bottom gradient bar that expands on hover */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-blue-500 opacity-60 transition-all duration-500 group-hover:h-1.5 group-hover:opacity-100" />
        </Card>
    );
}