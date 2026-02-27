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
            <div className="flex flex-1 flex-col min-h-0 relative">
                <div className="flex h-full w-full flex-1 flex-col bg-background relative z-10 overflow-hidden md:rounded-tl-[32px] md:border-l md:border-t md:border-border shadow-md">
                    {/* Sticky Top Bar (Mobile) */}
                    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6 md:hidden">
                        <h2 className="text-[15px] font-bold tracking-tight text-foreground drop-shadow-sm">
                            HireAI
                        </h2>
                        <div className="flex-1" />
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-border/80">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
