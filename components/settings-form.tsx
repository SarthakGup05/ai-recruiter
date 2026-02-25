"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    User,
    Bell,
    Shield,
    Save,
    Lock,
    LogOut,
    Building,
    Mail
} from "lucide-react";
import { toast } from "sonner";

interface SettingsFormProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export function SettingsForm({ user }: SettingsFormProps) {
    const [name, setName] = useState(user.name);
    const [saving, setSaving] = useState(false);

    async function handleSaveProfile() {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                toast.success("Profile updated successfully");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="grid gap-6">
            {/* Profile Section */}
            <Card className="border-border/60 shadow-lg shadow-primary/5 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Recruiter Profile</CardTitle>
                            <CardDescription>
                                Your public information visible to candidates
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="E.g. Jane Smith"
                                className="bg-background/50 border-border/60 focus:border-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold">Email Address</Label>
                            <Input
                                id="email"
                                defaultValue={user.email}
                                disabled
                                className="bg-secondary/20 text-muted-foreground border-border/40"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium">To change your email, contact support.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-sm font-bold">Company Name</Label>
                            <Input id="company" placeholder="Acme Inc." className="bg-background/50 border-border/60" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-bold">Your Role</Label>
                            <Input id="role" placeholder="Senior Talent Acquisition" className="bg-background/50 border-border/60" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="gradient-bg border-0 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                            {saving ? "Saving..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Profile
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications & Security */}
            <div className="grid gap-6 sm:grid-cols-2">
                <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Bell className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg">Notifications</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold">Candidate Applications</p>
                                <p className="text-xs text-muted-foreground">Notify me when someone applies</p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary/20 p-1 cursor-not-allowed opacity-60">
                                <div className="h-4 w-4 rounded-full bg-primary translate-x-5" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold">Interview Updates</p>
                                <p className="text-xs text-muted-foreground">Alerts on interview completions</p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary/20 p-1 cursor-not-allowed opacity-60">
                                <div className="h-4 w-4 rounded-full bg-primary translate-x-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Shield className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg">Security & Privacy</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start border-border/60 hover:bg-primary/5 hover:border-primary/30 font-medium">
                            <Lock className="mr-2 h-4 w-4 text-primary/60" />
                            Change Security Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/5 hover:border-destructive/30 border-border/40 font-medium">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out from All Devices
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
