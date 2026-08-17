import Link from "next/link";
import { readProjects } from "@/lib/projects-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

export default async function AdminProjectsPage() {
    const projects = await readProjects();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Проекты</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        {projects.length} проектов · en / ru / uz
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/projects/new">+ Новый проект</Link>
                </Button>
            </div>

            <div className="rounded-lg border border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400">Проект</TableHead>
                            <TableHead className="text-zinc-400">Тип</TableHead>
                            <TableHead className="text-zinc-400">Featured</TableHead>
                            <TableHead className="text-zinc-400">Переводы</TableHead>
                            <TableHead className="text-right text-zinc-400">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => {
                            const translated = (["en", "ru", "uz"] as const).filter(
                                (l) => project.i18n[l]?.description,
                            );
                            return (
                                <TableRow key={project.slug} className="border-zinc-800">
                                    <TableCell>
                                        <div className="font-medium">{project.title}</div>
                                        <div className="text-xs text-zinc-500">/{project.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                                            {project.kind}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{project.featured ? "✓" : "—"}</TableCell>
                                    <TableCell>
                                        <span className="text-xs text-zinc-400">
                                            {translated.length}/3 {translated.join(", ")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="secondary" size="sm">
                                                <Link href={`/admin/projects/${project.slug}/edit`}>Изменить</Link>
                                            </Button>
                                            <DeleteProjectButton slug={project.slug} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
