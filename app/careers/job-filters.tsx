"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";

export function JobFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [debouncedSearch] = useDebounce(search, 500);

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        // Reset page to 1 when filters change
        if (name !== "page") {
            params.delete("page");
        }
        return params.toString();
    };

    useEffect(() => {
        router.push(pathname + "?" + createQueryString("q", debouncedSearch));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleTypeChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("type", value === "all" ? "" : value));
    };

    const handleDepartmentChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("department", value === "all" ? "" : value));
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] supports-[backdrop-filter]:bg-background/40 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by job title, location, or department..."
                        className="pl-11 h-12 bg-background/50 border-input/50 focus:bg-background transition-all text-base rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="md:col-span-3">
                    <Select
                        defaultValue={searchParams.get("department") || "all"}
                        onValueChange={handleDepartmentChange}
                    >
                        <SelectTrigger className="h-12 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Department" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-white/10 glass-panel">
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="HR">HR & Operations</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3">
                    <Select
                        defaultValue={searchParams.get("type") || "all"}
                        onValueChange={handleTypeChange}
                    >
                        <SelectTrigger className="h-12 bg-background/50 border-input/50 focus:bg-background transition-all rounded-xl">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Work Type" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-white/10 glass-panel">
                            <SelectItem value="all">Any Type</SelectItem>
                            <SelectItem value="full_time">Full-time</SelectItem>
                            <SelectItem value="part_time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
