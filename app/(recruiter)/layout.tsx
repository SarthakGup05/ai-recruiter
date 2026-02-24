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
                "mx-auto flex w-full flex-1 flex-col overflow-hidden md:flex-row",
                "h-screen bg-card dark:bg-card"
            )}
        >
            <AppSidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col">
                <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border-l border-t border-border bg-background md:p-0">
                    {/* Sticky Top Bar */}
                    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-6">
                        <div className="flex-1" />
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
