"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
            <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900 text-zinc-100">
                <CardHeader>
                    <CardTitle className="text-xl">Вход в админку</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login">Логин</Label>
                            <Input
                                id="login"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="space-y-2">
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
                        {error ? <p className="text-sm text-red-400">{error}</p> : null}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Входим..." : "Войти"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
