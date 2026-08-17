"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Project, ProjectTranslation, Locale } from "@/types/project";
import { emptyTranslation, LOCALES } from "@/types/project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

/** A titled block of fields — hairline rule and a small label, like the site. */
function Fieldset({
    title,
    hint,
    children,
}: {
    title: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="grid gap-6 border-t border-border pt-8 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
                <h2 className="label">{title}</h2>
                {hint ? (
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                        {hint}
                    </p>
                ) : null}
            </div>
            <div className="md:col-span-9">{children}</div>
        </section>
    );
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

        router.push("/admin/content");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <Fieldset
                title="Основное"
                hint="Название и slug не переводятся — они одинаковы во всех локалях."
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2.5">
                        <Label>Название</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2.5">
                        <Label>
                            Slug{" "}
                            <span className="font-normal normal-case tracking-normal text-subtle-foreground">
                                {isEdit ? "(нельзя изменить)" : "(можно оставить пустым)"}
                            </span>
                        </Label>
                        <Input
                            value={form.slug}
                            disabled={isEdit}
                            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                            placeholder="oson-uy"
                        />
                    </div>

                    <div className="space-y-2.5">
                        <Label>Тип</Label>
                        <Select
                            value={form.kind}
                            onValueChange={(v: Project["kind"]) => setForm((f) => ({ ...f, kind: v }))}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="product">Проект SDS</SelectItem>
                                <SelectItem value="commercial">Опыт команды (Dotlabs)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2.5">
                        <Label>Схема, если нет фото</Label>
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

                    <div className="space-y-2.5">
                        <Label>Ссылка</Label>
                        <Input
                            value={form.href ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                            placeholder="https://oson-uy.uz"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <Label>Домен для показа</Label>
                        <Input
                            value={form.domain ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                            placeholder="oson-uy.uz"
                        />
                    </div>

                    <div className="space-y-2.5">
                        <Label>Год</Label>
                        <Input
                            value={form.year ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                            placeholder="оставьте пустым, если не подтверждён"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <Label>Технологии через запятую</Label>
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
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                    <Switch
                        id="featured"
                        checked={form.featured}
                        onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                        Показывать на главной
                    </Label>
                </div>
            </Fieldset>

            <Fieldset
                title="Обложка"
                hint="Реальный скриншот продукта. Если фото нет — на сайте покажется схема."
            >
                <div className="space-y-4">
                    {form.cover ? (
                        // Preview of an arbitrary uploaded URL — optimisation is pointless here.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={form.cover.src}
                            alt=""
                            className="aspect-video w-full max-w-lg rounded-lg border border-border object-cover"
                        />
                    ) : (
                        <div className="flex aspect-video w-full max-w-lg items-center justify-center rounded-lg border border-dashed border-border bg-surface text-sm text-subtle-foreground">
                            Обложка не загружена
                        </div>
                    )}

                    <Input
                        type="file"
                        accept="image/webp,image/png,image/jpeg,image/avif"
                        disabled={uploading}
                        className="max-w-lg cursor-pointer file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-sm file:text-background"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleCoverUpload(file);
                        }}
                    />
                    {uploading ? (
                        <p className="text-sm text-muted-foreground">Загружаем…</p>
                    ) : null}
                </div>
            </Fieldset>

            <Fieldset
                title="Переводы"
                hint="Пустые поля просто не отображаются на сайте — лучше оставить пусто, чем придумать."
            >
                <Tabs defaultValue="ru">
                    <TabsList className="mb-6">
                        {LOCALES.map((locale) => (
                            <TabsTrigger key={locale} value={locale}>
                                {LOCALE_LABEL[locale]}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {LOCALES.map((locale) => {
                        const t = form.i18n[locale];
                        return (
                            <TabsContent key={locale} value={locale} className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2.5">
                                        <Label>Категория</Label>
                                        <Input
                                            value={t.category}
                                            onChange={(e) => updateTranslation(locale, { category: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label>Роль</Label>
                                        <Input
                                            value={t.role}
                                            onChange={(e) => updateTranslation(locale, { role: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <Label>Краткое описание</Label>
                                    <Textarea
                                        value={t.description}
                                        onChange={(e) => updateTranslation(locale, { description: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                {(
                                    [
                                        ["overview", "О проекте", "Каждый абзац с новой строки"],
                                        ["challenge", "Задача", "Каждый абзац с новой строки"],
                                        ["solution", "Решение", "Каждый абзац с новой строки"],
                                        ["features", "Возможности", "По одному пункту на строку"],
                                        ["result", "Результат", "Без выдуманных цифр"],
                                    ] as const
                                ).map(([field, title, hint]) => (
                                    <div key={field} className="space-y-2.5">
                                        <Label>
                                            {title}{" "}
                                            <span className="font-normal normal-case tracking-normal text-subtle-foreground">
                                                — {hint}
                                            </span>
                                        </Label>
                                        <Textarea
                                            value={arrayToLines(t[field])}
                                            onChange={(e) =>
                                                updateTranslation(locale, {
                                                    [field]: linesToArray(e.target.value),
                                                })
                                            }
                                            rows={3}
                                        />
                                    </div>
                                ))}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </Fieldset>

            {error ? (
                <p className="border-l-2 border-destructive pl-4 text-sm leading-relaxed text-destructive">
                    {error}
                </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-end gap-4 border-t border-border pt-8">
                <button
                    type="button"
                    onClick={() => router.push("/admin/content")}
                    className="text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    disabled={saving || uploading}
                    className="group inline-flex h-11 items-center gap-2.5 rounded-md bg-primary px-6 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                    {saving ? "Сохраняем…" : "Сохранить"}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
            </div>
        </form>
    );
}
