"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SearchHit } from "@/lib/crm/repo";

/**
 * One box across the whole CRM. Debounced, closes on route change, and never
 * blocks the header — an empty or failing search simply shows nothing.
 */
export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [hits, setHits] = useState<SearchHit[]>([]);
    const [open, setOpen] = useState(false);
    const box = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
        setQuery("");
    }, [pathname]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setHits([]);
            return;
        }
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                setHits(data.hits ?? []);
                setOpen(true);
            } catch {
                /* aborted or offline — leave the previous result alone */
            }
        }, 220);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            if (!box.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    return (
        <div ref={box} className="relative hidden w-64 sm:block">
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => hits.length && setOpen(true)}
                placeholder="Поиск по CRM"
                aria-label="Поиск по CRM"
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm transition-colors focus-visible:border-ring focus-visible:outline-none"
            />

            {open && hits.length > 0 ? (
                <ul className="absolute right-0 top-11 z-50 max-h-96 w-80 overflow-y-auto rounded-md border border-border bg-background p-1 shadow-lg">
                    {hits.map((hit) => (
                        <li key={`${hit.kind}-${hit.id}`}>
                            <Link
                                href={hit.href}
                                onClick={() => setOpen(false)}
                                className="flex items-baseline justify-between gap-3 rounded-sm px-3 py-2 transition-colors hover:bg-surface"
                            >
                                <span className="min-w-0">
                                    <span className="block truncate text-sm">{hit.title}</span>
                                    <span className="block truncate text-xs text-muted-foreground">
                                        {hit.subtitle}
                                    </span>
                                </span>
                                <span className="label shrink-0">{hit.kind}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : null}

            {open && query.trim().length >= 2 && hits.length === 0 ? (
                <p className="absolute right-0 top-11 z-50 w-80 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground shadow-lg">
                    Ничего не найдено
                </p>
            ) : null}
        </div>
    );
}
