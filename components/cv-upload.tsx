"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CvUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSizeMB?: number;
}

export function CvUpload({
    onFileSelect,
    accept = ".pdf,.doc,.docx",
    maxSizeMB = 5,
}: CvUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateAndSet = useCallback(
        (f: File) => {
            setError(null);

            const maxBytes = maxSizeMB * 1024 * 1024;
            if (f.size > maxBytes) {
                setError(`File must be smaller than ${maxSizeMB}MB`);
                return;
            }

            const validExts = accept.split(",").map((e) => e.trim().toLowerCase());
            const ext = "." + f.name.split(".").pop()?.toLowerCase();
            if (!validExts.includes(ext)) {
                setError(`Only ${accept} files are accepted`);
                return;
            }

            setFile(f);
            onFileSelect(f);
        },
        [accept, maxSizeMB, onFileSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) validateAndSet(f);
        },
        [validateAndSet]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (f) validateAndSet(f);
        },
        [validateAndSet]
    );

    const clearFile = () => {
        setFile(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-2">
            {!file ? (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`
            group cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200
            ${isDragOver
                            ? "border-primary bg-primary/5 scale-[1.02]"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                        }
          `}
                >
                    <Upload
                        className={`mx-auto mb-3 h-10 w-10 transition-colors ${isDragOver
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-primary"
                            }`}
                    />
                    <p className="text-sm font-medium">
                        Drop your CV here, or{" "}
                        <span className="text-primary underline underline-offset-2">
                            browse
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        PDF, DOC, or DOCX up to {maxSizeMB}MB
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatSize(file.size)}</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-600">Ready to upload</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={clearFile}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
            )}
        </div>
    );
}
