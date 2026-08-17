import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { readProjects } from "@/lib/projects-store";
import { LOCALES, type Locale } from "@/types/project";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

/**
 * The project list. A hairline table rather than boxed cards — same device the
 * public site uses, so the admin reads as part of the same product.
 */
export default async function AdminProjectsPage() {
    const projects = await readProjects();
    const products = projects.filter((p) => p.kind === "product");
    const commercial = projects.filter((p) => p.kind === "commercial");

    return (
        <div>
            <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="label">Контент</span>
                    <h1 className="display-3 mt-3">Проекты</h1>
                    <p className="mt-3 text-[0.9375rem] text-muted-foreground">
                        {projects.length} всего · {products.length} продуктов SDS ·{" "}
                        {commercial.length} опыт команды
                    </p>
                </div>

                <Link
                    href="/admin/content/projects/new"
                    className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                    <Plus className="size-4" />
                    Новый проект
                </Link>
            </div>

            <div className="mt-10">
                {/* Column headings, hidden on small screens where rows stack. */}
                <div className="hidden grid-cols-12 gap-x-6 border-b border-border pb-3 md:grid">
                    <span className="label col-span-5">Проект</span>
                    <span className="label col-span-2">Тип</span>
                    <span className="label col-span-1">Главная</span>
                    <span className="label col-span-2">Переводы</span>
                    <span className="label col-span-2 text-right">Действия</span>
                </div>

                <ul>
                    {projects.map((project, i) => {
                        const filled = LOCALES.filter(
                            (locale: Locale) => project.i18n[locale]?.description?.trim(),
                        );

                        return (
                            <li
                                key={project.slug}
                                className="grid grid-cols-1 items-center gap-x-6 gap-y-3 border-b border-border py-5 md:grid-cols-12"
                            >
                                <div className="flex items-baseline gap-4 md:col-span-5">
                                    <span className="num text-subtle-foreground">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="min-w-0">
                                        <Link
                                            href={`/admin/content/projects/${project.slug}/edit`}
                                            className="text-lg font-medium tracking-[-0.02em] transition-colors hover:text-primary"
                                        >
                                            {project.title}
                                        </Link>
                                        <p className="num mt-1 truncate text-subtle-foreground">
                                            /{project.slug}
                                        </p>
                                    </div>
                                </div>

                                <div className="pl-9 md:col-span-2 md:pl-0">
                                    <span className="inline-flex items-center rounded-sm border border-border px-2 py-0.5 text-xs text-muted-foreground">
                                        {project.kind === "product" ? "продукт" : "опыт команды"}
                                    </span>
                                </div>

                                <div className="pl-9 text-[0.9375rem] md:col-span-1 md:pl-0">
                                    {project.featured ? (
                                        <span className="text-primary">да</span>
                                    ) : (
                                        <span className="text-subtle-foreground">—</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 pl-9 md:col-span-2 md:pl-0">
                                    {LOCALES.map((locale: Locale) => (
                                        <span
                                            key={locale}
                                            title={
                                                filled.includes(locale)
                                                    ? `${locale}: заполнено`
                                                    : `${locale}: пусто`
                                            }
                                            className={
                                                "num rounded-sm px-1.5 py-0.5 uppercase " +
                                                (filled.includes(locale)
                                                    ? "bg-primary-soft text-primary"
                                                    : "text-subtle-foreground")
                                            }
                                        >
                                            {locale}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 pl-9 md:col-span-2 md:justify-end md:pl-0">
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Открыть
                                        <ArrowUpRight className="size-3.5" />
                                    </Link>
                                    <Link
                                        href={`/admin/content/projects/${project.slug}/edit`}
                                        className="text-sm font-medium transition-colors hover:text-primary"
                                    >
                                        Изменить
                                    </Link>
                                    <DeleteProjectButton slug={project.slug} />
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {projects.length === 0 ? (
                    <p className="py-16 text-center text-muted-foreground">
                        Пока ни одного проекта.
                    </p>
                ) : null}
            </div>
        </div>
    );
}
