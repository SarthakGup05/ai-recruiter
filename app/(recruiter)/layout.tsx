"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";

export default function RecruiterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                "flex w-full flex-col overflow-hidden md:flex-row",
                "h-dvh bg-card dark:bg-card"
            )}
        >
            <AppSidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col min-h-0">
                <div className="flex h-full w-full flex-1 flex-col md:rounded-tl-2xl md:border-l md:border-t border-border bg-background">
                    {/* Sticky Top Bar */}
                    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6">
                        <h2 className="text-sm font-semibold text-foreground md:hidden">
                            HireAI
                        </h2>
                        <div className="flex-1" />
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
