"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectTranslation, Locale } from "@/types/project";
import { emptyTranslation, LOCALES } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LOCALE_LABEL: Record<Locale, string> = { en: "English", ru: "Русский", uz: "O'zbek" };
const GLYPHS = ["platform", "dashboard", "mobile", "warehouse", "store", "site"] as const;

type FormState = Omit<Project, "id">;

function linesToArray(v: string) {
    return v.split("\n").map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(v: string[] | undefined) {
    return (v ?? []).join("\n");
}

export function ProjectForm({ initial }: { initial?: Project }) {
    const router = useRouter();
    const isEdit = Boolean(initial);

    const [form, setForm] = useState<FormState>(
        initial ?? {
            slug: "",
            title: "",
            kind: "product",
            glyph: "site",
            cover: undefined,
            images: [],
            href: "",
            domain: "",
            technologies: [],
            year: "",
            featured: false,
            span: "half",
            i18n: {
                en: { ...emptyTranslation },
                ru: { ...emptyTranslation },
                uz: { ...emptyTranslation },
            },
        },
    );

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function updateTranslation(locale: Locale, patch: Partial<ProjectTranslation>) {
        setForm((f) => ({
            ...f,
            i18n: { ...f.i18n, [locale]: { ...f.i18n[locale], ...patch } },
        }));
    }

    async function handleCoverUpload(file: File) {
        setUploading(true);
        setError(null);
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        setUploading(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error ?? "Не удалось загрузить фото");
            return;
        }
        const { src } = await res.json();

        const img = new Image();
        img.onload = () => {
            setForm((f) => ({
                ...f,
                cover: { src, width: img.naturalWidth, height: img.naturalHeight, ratio: "wide" },
            }));
        };
        img.src = src;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const url = isEdit ? `/api/admin/projects/${form.slug}` : "/api/admin/projects";
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setSaving(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error ?? "Ошибка сохранения");
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-base">Основное</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Название (не переводится)</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug {isEdit ? "(нельзя изменить)" : "(необязательно — сгенерируется из названия)"}</Label>
                        <Input
                            value={form.slug}
                            disabled={isEdit}
                            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                            placeholder="oson-uy"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Тип</Label>
                        <Select
                            value={form.kind}
                            onValueChange={(v: Project["kind"]) => setForm((f) => ({ ...f, kind: v }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="product">product (проект SDS)</SelectItem>
                                <SelectItem value="commercial">commercial (Dotlabs)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Заглушка-иконка (если нет фото)</Label>
                        <Select
                            value={form.glyph}
                            onValueChange={(v: Project["glyph"]) => setForm((f) => ({ ...f, glyph: v }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {GLYPHS.map((g) => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Ссылка (href)</Label>
                        <Input
                            value={form.href ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                            placeholder="https://oson-uy.uz"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Домен для отображения</Label>
                        <Input
                            value={form.domain ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                            placeholder="oson-uy.uz"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Год</Label>
                        <Input
                            value={form.year ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                            placeholder="2024"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Технологии (через запятую)</Label>
                        <Input
                            value={form.technologies.join(", ")}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                }))
                            }
                            placeholder="Next.js, PostgreSQL"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Switch
                            checked={form.featured}
                            onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                        />
                        <Label>Показывать на главной (featured)</Label>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-base">Обложка</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {form.cover ? (
                        <img
                            src={form.cover.src}
                            alt=""
                            className="aspect-video w-full max-w-md rounded-lg border border-zinc-800 object-cover"
                        />
                    ) : null}
                    <Input
                        type="file"
                        accept="image/webp,image/png,image/jpeg,image/avif"
                        disabled={uploading}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleCoverUpload(file);
                        }}
                    />
                    {uploading ? <p className="text-sm text-zinc-400">Загружаем...</p> : null}
                </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-base">Переводы</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="en">
                        <TabsList className="mb-4">
                            {LOCALES.map((locale) => (
                                <TabsTrigger key={locale} value={locale}>
                                    {LOCALE_LABEL[locale]}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {LOCALES.map((locale) => {
                            const t = form.i18n[locale];
                            return (
                                <TabsContent key={locale} value={locale} className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Категория</Label>
                                            <Input
                                                value={t.category}
                                                onChange={(e) => updateTranslation(locale, { category: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Роль</Label>
                                            <Input
                                                value={t.role}
                                                onChange={(e) => updateTranslation(locale, { role: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Краткое описание</Label>
                                        <Textarea
                                            value={t.description}
                                            onChange={(e) => updateTranslation(locale, { description: e.target.value })}
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Overview (каждый абзац с новой строки)</Label>
                                        <Textarea
                                            value={arrayToLines(t.overview)}
                                            onChange={(e) => updateTranslation(locale, { overview: linesToArray(e.target.value) })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Challenge</Label>
                                        <Textarea
                                            value={arrayToLines(t.challenge)}
                                            onChange={(e) => updateTranslation(locale, { challenge: linesToArray(e.target.value) })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Solution</Label>
                                        <Textarea
                                            value={arrayToLines(t.solution)}
                                            onChange={(e) => updateTranslation(locale, { solution: linesToArray(e.target.value) })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Features (по одному пункту на строку)</Label>
                                        <Textarea
                                            value={arrayToLines(t.features)}
                                            onChange={(e) => updateTranslation(locale, { features: linesToArray(e.target.value) })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Result</Label>
                                        <Textarea
                                            value={arrayToLines(t.result)}
                                            onChange={(e) => updateTranslation(locale, { result: linesToArray(e.target.value) })}
                                            rows={3}
                                        />
                                    </div>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </CardContent>
            </Card>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => router.push("/admin")}>
                    Отмена
                </Button>
                <Button type="submit" disabled={saving || uploading}>
                    {saving ? "Сохраняем..." : "Сохранить"}
                </Button>
            </div>
        </form>
    );
}
