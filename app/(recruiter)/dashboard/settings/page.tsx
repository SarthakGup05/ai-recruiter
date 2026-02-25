import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold font-heading">Settings</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    Manage your account preferences and recruiter profile
                </p>
            </div>

            <SettingsForm user={{
                id: user.id,
                name: user.name,
                email: user.email
            }} />
        </div>
    );
}
