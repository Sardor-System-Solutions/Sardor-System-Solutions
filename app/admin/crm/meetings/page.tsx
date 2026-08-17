import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AuthzError, listLeads, listMeetings } from "@/lib/crm/repo";
import { MEETING_TYPES } from "@/types/crm";
import { EmptyState, PageHeader, formatDateTime } from "@/components/crm/ui";
import { ActionForm } from "@/components/crm/action-form";
import { Field, FieldRow, SelectField, TextField } from "@/components/crm/fields";
import { addMeetingAction } from "../actions";

const TYPE_LABEL: Record<string, string> = {
  CALL: "Звонок", VIDEO: "Видеозвонок", MEETING: "Встреча", OTHER: "Другое",
};

export default async function MeetingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  let meetings, leads;
  try {
    [meetings, leads] = await Promise.all([listMeetings(), listLeads()]);
  } catch (error) {
    if (error instanceof AuthzError) redirect("/admin");
    throw error;
  }

  const now = new Date().toISOString();
  const upcoming = meetings.filter((m) => m.startAt >= now);
  const past = meetings.filter((m) => m.startAt < now).reverse();

  const leadName = (id?: string) => {
    const lead = leads.find((l) => l.id === id);
    return lead ? (lead.company ?? `${lead.firstName} ${lead.lastName ?? ""}`.trim()) : null;
  };

  return (
    <div className="space-y-10">
      <PageHeader label="CRM" title="Встречи" hint={`${upcoming.length} впереди`} />

      <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          {meetings.length === 0 ? (
            <EmptyState title="Встреч пока нет" hint="Запланируйте первую — она появится на дашборде в день встречи." />
          ) : (
            <>
              <section>
                <h2 className="label">Ближайшие</h2>
                {upcoming.length === 0 ? (
                  <p className="mt-3 text-[0.9375rem] text-muted-foreground">Ничего не запланировано.</p>
                ) : (
                  <ul className="mt-3 border-t border-border">
                    {upcoming.map((m) => (
                      <li key={m.id} className="grid gap-2 border-b border-border py-4 sm:grid-cols-12 sm:gap-4">
                        <span className="num text-subtle-foreground sm:col-span-3">{formatDateTime(m.startAt)}</span>
                        <div className="sm:col-span-9">
                          <p className="text-[0.9375rem]">
                            <span className="label mr-2 inline">{TYPE_LABEL[m.type] ?? m.type}</span>
                            {m.title}
                          </p>
                          <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-subtle-foreground">
                            {m.location ? <span>{m.location}</span> : null}
                            {m.entityId && leadName(m.entityId) ? (
                              <Link href={`/admin/crm/leads/${m.entityId}`} className="hover:text-foreground">
                                {leadName(m.entityId)}
                              </Link>
                            ) : null}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {past.length > 0 ? (
                <section>
                  <h2 className="label">Прошедшие</h2>
                  <ul className="mt-3 border-t border-border">
                    {past.slice(0, 10).map((m) => (
                      <li key={m.id} className="grid gap-2 border-b border-border py-4 text-muted-foreground sm:grid-cols-12 sm:gap-4">
                        <span className="num sm:col-span-3">{formatDateTime(m.startAt)}</span>
                        <span className="text-[0.9375rem] sm:col-span-9">{m.title}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </div>

        <aside>
          <h2 className="label border-b border-border pb-3">Запланировать</h2>
          <div className="mt-6">
            <ActionForm action={addMeetingAction} submitLabel="Запланировать" pendingLabel="Сохраняем…">
              <Field label="Тема" name="title" required placeholder="Демо CRM" />
              <FieldRow>
                <Field label="Дата" name="date" type="date" required />
                <Field label="Время" name="time" type="time" defaultValue="10:00" />
              </FieldRow>
              <SelectField
                label="Формат" name="type" defaultValue="CALL"
                options={MEETING_TYPES.map((t) => ({ value: t, label: TYPE_LABEL[t] ?? t }))}
              />
              <Field label="Место или ссылка" name="location" placeholder="Google Meet" />
              <SelectField
                label="Лид" name="entityId" defaultValue=""
                options={[
                  { value: "", label: "— без связи —" },
                  ...leads.map((l) => ({
                    value: l.id,
                    label: l.company ?? `${l.firstName} ${l.lastName ?? ""}`.trim(),
                  })),
                ]}
              />
              <TextField label="Заметки" name="description" rows={2} />
            </ActionForm>
          </div>
        </aside>
      </div>
    </div>
  );
}
