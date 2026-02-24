"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    BrainCircuit,
    LayoutDashboard,
    Briefcase,
    Users,
    Settings,
    LogOut,
    Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-foreground/70" />,
    },
    {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: <Briefcase className="h-5 w-5 shrink-0 text-foreground/70" />,
    },
    {
        label: "Candidates",
        href: "/dashboard/candidates",
        icon: <Users className="h-5 w-5 shrink-0 text-foreground/70" />,
    },
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="h-5 w-5 shrink-0 text-foreground/70" />,
    },
];

export function AppSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return (
        <Sidebar open={open} setOpen={setOpen} animate={true}>
            <SidebarBody className="justify-between gap-10">
                {/* Top section: Logo + Nav */}
                <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                    {/* Brand Logo */}
                    <Link href="/dashboard" className="relative z-20 flex items-center gap-2 py-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                            <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: open ? 1 : 0 }}
                            className="font-bold text-lg whitespace-pre text-foreground"
                        >
                            Hire<span className="text-primary">AI</span>
                        </motion.span>
                    </Link>

                    {/* Post New Job Button */}
                    <Link
                        href="/job/new"
                        className={cn(
                            "mt-6 flex items-center gap-2 rounded-lg gradient-bg text-white transition-all hover:opacity-90",
                            open ? "px-3 py-2.5 justify-start" : "p-2 justify-center"
                        )}
                    >
                        <Plus className="h-5 w-5 shrink-0" />
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: open ? 1 : 0 }}
                            className="text-sm font-semibold whitespace-pre"
                        >
                            Post New Job
                        </motion.span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="mt-4 flex flex-col gap-1">
                        {navItems.map((item) => (
                            <SidebarLink
                                key={item.label}
                                link={item}
                                className={cn(
                                    "rounded-lg px-2 py-2 hover:bg-primary/10",
                                    pathname === item.href &&
                                    "bg-primary/10 text-primary font-medium"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom section: Logout */}
                <div className="border-t border-border pt-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: open ? 1 : 0 }}
                            className="whitespace-pre"
                        >
                            Sign Out
                        </motion.span>
                    </button>
                </div>
            </SidebarBody>
        </Sidebar>
    );
}
