import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AuthzError, listLeads, listTasks } from "@/lib/crm/repo";
import { PRIORITIES, type Task } from "@/types/crm";
import {
  EmptyState, PageHeader, PRIORITY_LABEL, PriorityTag, formatDate,
} from "@/components/crm/ui";
import { ActionForm } from "@/components/crm/action-form";
import { Field, FieldRow, SelectField, TextField } from "@/components/crm/fields";
import { TaskToggle } from "@/components/crm/task-toggle";
import { addTaskAction } from "../actions";

export default async function TasksPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  let tasks: Task[];
  let leads;
  try {
    [tasks, leads] = await Promise.all([listTasks(), listLeads()]);
  } catch (error) {
    if (error instanceof AuthzError) redirect("/admin");
    throw error;
  }

  const today = new Date().toISOString().slice(0, 10);
  const open = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED");

  const overdue = open.filter((t) => t.dueAt && t.dueAt.slice(0, 10) < today);
  const dueToday = open.filter((t) => t.dueAt?.slice(0, 10) === today);
  const upcoming = open.filter((t) => !t.dueAt || t.dueAt.slice(0, 10) > today);
  const done = tasks.filter((t) => t.status === "DONE").slice(0, 10);

  const leadName = (id?: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return null;
    return lead.company ?? `${lead.firstName} ${lead.lastName ?? ""}`.trim();
  };

  function Group({ title, rows, tone }: { title: string; rows: Task[]; tone?: "warn" }) {
    if (rows.length === 0) return null;
    return (
      <section>
        <h2 className={tone === "warn" ? "label text-destructive" : "label"}>
          {title} · {rows.length}
        </h2>
        <ul className="mt-3 border-t border-border">
          {rows.map((task) => (
            <li key={task.id} className="flex items-start gap-3 border-b border-border py-4">
              <TaskToggle taskId={task.id} status={task.status} />
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem]">{task.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-subtle-foreground">
                  <span className={tone === "warn" ? "text-destructive" : ""}>
                    {task.dueAt ? formatDate(task.dueAt) : "без срока"}
                  </span>
                  <PriorityTag priority={task.priority} />
                  {task.entityId && leadName(task.entityId) ? (
                    <Link
                      href={`/admin/crm/leads/${task.entityId}`}
                      className="hover:text-foreground"
                    >
                      {leadName(task.entityId)}
                    </Link>
                  ) : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader label="Продажи" title="Задачи" hint={`${open.length} открытых`} />

      <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          {open.length === 0 && done.length === 0 ? (
            <EmptyState title="Задач пока нет" hint="Добавьте первую — она появится и на дашборде." />
          ) : (
            <>
              <Group title="Просрочено" rows={overdue} tone="warn" />
              <Group title="Сегодня" rows={dueToday} />
              <Group title="Дальше" rows={upcoming} />
              {done.length > 0 ? (
                <section>
                  <h2 className="label">Выполнено</h2>
                  <ul className="mt-3 border-t border-border">
                    {done.map((task) => (
                      <li key={task.id} className="flex items-start gap-3 border-b border-border py-4">
                        <TaskToggle taskId={task.id} status={task.status} />
                        <p className="text-[0.9375rem] text-muted-foreground line-through">
                          {task.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </div>

        <aside>
          <h2 className="label border-b border-border pb-3">Новая задача</h2>
          <div className="mt-6">
            <ActionForm action={addTaskAction} submitLabel="Добавить" pendingLabel="Добавляем…">
              <Field label="Что сделать" name="title" required placeholder="Позвонить в ABC Coffee" />
              <FieldRow>
                <Field label="Срок" name="dueAt" type="date" />
                <SelectField
                  label="Приоритет" name="priority" defaultValue="MEDIUM"
                  options={PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABEL[p] }))}
                />
              </FieldRow>
              <SelectField
                label="Связать с лидом" name="entityId" defaultValue=""
                options={[
                  { value: "", label: "— без связи —" },
                  ...leads.map((l) => ({
                    value: l.id,
                    label: l.company ?? `${l.firstName} ${l.lastName ?? ""}`.trim(),
                  })),
                ]}
              />
              <input type="hidden" name="entityType" value="lead" />
              <TextField label="Описание" name="description" rows={2} />
            </ActionForm>
          </div>
        </aside>
      </div>
    </div>
  );
}
