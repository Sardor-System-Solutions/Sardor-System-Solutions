"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

    async function handleDelete() {
        setLoading(true);
        await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
        setLoading(false);
        router.refresh();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    Удалить
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                        Проект «{slug}» будет удалён без возможности восстановления.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={handleDelete}>
                        {loading ? "Удаляем..." : "Удалить"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
