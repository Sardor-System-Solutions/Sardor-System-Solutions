import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
    return (
        <div>
            <div className="border-b border-border pb-8">
                <span className="label">Проекты</span>
                <h1 className="display-3 mt-3">Новый проект</h1>
            </div>
            <div className="mt-10">
                <ProjectForm />
            </div>
        </div>
    );
}
