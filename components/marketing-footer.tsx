import Link from "next/link";
import { BrainCircuit } from "lucide-react";

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Changelog", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Careers", href: "#" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "GDPR", href: "#" },
        ],
    },
];

export function MarketingFooter() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                                <BrainCircuit className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                Hire<span className="gradient-text">AI</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The autonomous AI recruitment platform that screens, interviews,
                            and evaluates candidates — so you can focus on hiring the best.
                        </p>
                    </div>

                    {/* Link Columns */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h3 className="mb-3 text-sm font-semibold">{group.title}</h3>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} HireAI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
