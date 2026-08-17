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
        <div>
            <div className="border-b border-border pb-8">
                <span className="label">Проекты · /{project.slug}</span>
                <h1 className="display-3 mt-3">{project.title}</h1>
            </div>
            <div className="mt-10">
                <ProjectForm initial={project} />
            </div>
        </div>
    );
}
