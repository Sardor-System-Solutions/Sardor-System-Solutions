"use client";

import { useState } from "react";
import Link from "next/link";
import type { Notification } from "@/lib/crm/repo";
import { cn } from "@/lib/utils";

/**
 * Notifications are derived on the server from the records themselves, so the
 * bell can never disagree with what the CRM actually holds.
 */
export function Notifications({ items }: { items: Notification[] }) {
    const [open, setOpen] = useState(false);
    const warn = items.filter((i) => i.tone === "warn").length;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={`Уведомления: ${items.length}`}
                className="relative flex h-9 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                Уведомления
                {items.length > 0 ? (
                    <span
                        className={cn(
                            "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs",
                            warn > 0
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-surface-2 text-foreground",
                        )}
                    >
                        {items.length}
                    </span>
                ) : null}
            </button>

            {open ? (
                <div className="absolute right-0 top-11 z-50 w-80 rounded-md border border-border bg-background p-1 shadow-lg">
                    {items.length === 0 ? (
                        <p className="px-3 py-4 text-sm text-muted-foreground">
                            Всё спокойно — просроченного нет.
                        </p>
                    ) : (
                        <ul>
                            {items.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-surface"
                                    >
                                        <span
                                            className={cn(
                                                "mt-1.5 size-1.5 shrink-0 rounded-full",
                                                item.tone === "warn" ? "bg-destructive" : "bg-primary",
                                            )}
                                        />
                                        <span className="min-w-0">{item.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : null}
        </div>
    );
}
