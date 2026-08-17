import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects-store";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) notFound();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Редактировать: {project.title}</h1>
            <ProjectForm initial={project} />
        </div>
    );
}
