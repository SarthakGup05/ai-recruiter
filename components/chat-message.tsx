import { cn } from "@/lib/utils";
import { BrainCircuit, User } from "lucide-react";

interface ChatMessageProps {
    role: "ai" | "candidate";
    content: string;
    timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
    const isAI = role === "ai";

    return (
        <div
            className={cn("flex gap-3", isAI ? "justify-start" : "flex-row-reverse")}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isAI ? "gradient-bg" : "bg-secondary"
                )}
            >
                {isAI ? (
                    <BrainCircuit className="h-4 w-4 text-white" />
                ) : (
                    <User className="h-4 w-4 text-secondary-foreground" />
                )}
            </div>

            {/* Bubble */}
            <div
                className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5",
                    isAI
                        ? "rounded-tl-sm bg-muted text-foreground"
                        : "rounded-tr-sm gradient-bg text-white"
                )}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                {timestamp && (
                    <p
                        className={cn(
                            "mt-1 text-[10px]",
                            isAI ? "text-muted-foreground" : "text-white/60"
                        )}
                    >
                        {timestamp}
                    </p>
                )}
            </div>
        </div>
    );
}
