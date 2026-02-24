"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Careers", href: "/careers" },
];

export function MarketingHeader() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
                        <BrainCircuit className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Hire<span className="gradient-text">AI</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden items-center gap-3 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="gradient-bg border-0 text-white hover:opacity-90">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-border md:hidden">
                    <div className="flex flex-col gap-2 px-4 py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                            <Button variant="outline" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild className="gradient-bg border-0 text-white">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
