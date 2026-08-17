"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteProjectButton({ slug }: { slug: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
        setLoading(false);

        if (!res.ok) {
            // Deleting writes to Blob, which can fail on configuration —
            // say so rather than silently doing nothing.
            const data = await res.json().catch(() => ({}));
            setError(data.error ?? "Не удалось удалить.");
            return;
        }
        router.refresh();
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        type="button"
                        className="text-sm text-muted-foreground transition-colors hover:text-destructive"
                    >
                        Удалить
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-border bg-background">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl tracking-[-0.02em]">
                            Удалить проект?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            Проект «{slug}» будет удалён без возможности восстановления.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={loading}
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {loading ? "Удаляем…" : "Удалить"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {error ? (
                <span className="text-xs text-destructive">{error}</span>
            ) : null}
        </>
    );
}
