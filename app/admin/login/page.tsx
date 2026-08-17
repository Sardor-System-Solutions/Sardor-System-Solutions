"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Sign-in. Same light system as the rest of the site — no separate dark tool
 * aesthetic. The submit logic is unchanged.
 */
export default function AdminLoginPage() {
    const router = useRouter();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, password }),
        });

        setLoading(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error ?? "Ошибка входа");
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="border-b border-border pb-6">
                    <span className="label">SDS · Админка</span>
                    <h1 className="display-3 mt-3">Вход</h1>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="space-y-2.5">
                        <Label htmlFor="login">Логин</Label>
                        <Input
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error ? (
                        <p className="border-l-2 border-destructive pl-3 text-sm text-destructive">
                            {error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-md bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
                    >
                        {loading ? "Входим…" : "Войти"}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
