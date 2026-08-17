import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { canSeeFinance } from "@/lib/crm/rbac";
import { AuthzError, listLeads, listProposals } from "@/lib/crm/repo";
import { EmptyState, PageHeader, formatDate, formatMoney } from "@/components/crm/ui";
import { ActionForm } from "@/components/crm/action-form";
import { Field, FieldRow, SelectField, TextField } from "@/components/crm/fields";
import { ProposalStatusPicker } from "@/components/crm/proposal-status";
import { addProposalAction } from "../actions";

/**
 * Commercial proposals. The record carries everything a PDF would need —
 * services, price, timeline — so generating one later is a rendering job, not
 * a data migration.
 */
export default async function ProposalsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  if (!canSeeFinance(user.role)) redirect("/admin");

  let proposals, leads;
  try {
    [proposals, leads] = await Promise.all([listProposals(), listLeads()]);
  } catch (error) {
    if (error instanceof AuthzError) redirect("/admin");
    throw error;
  }

  const leadName = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    return lead ? (lead.company ?? `${lead.firstName} ${lead.lastName ?? ""}`.trim()) : "—";
  };

  const pending = proposals.filter((p) => ["SENT", "VIEWED", "NEGOTIATION"].includes(p.status));

  return (
    <div className="space-y-10">
      <PageHeader
        label="CRM"
        title="Коммерческие предложения"
        hint={`${proposals.length} всего · ${pending.length} в ожидании ответа`}
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div>
          {proposals.length === 0 ? (
            <EmptyState
              title="КП пока нет"
              hint="Подготовьте предложение по лиду — цена автоматически попадёт в воронку."
            />
          ) : (
            <ul className="border-t border-border">
              {proposals.map((p) => (
                <li key={p.id} className="border-b border-border py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="font-medium tracking-[-0.02em]">{p.title}</p>
                      <Link
                        href={`/admin/crm/leads/${p.leadId}`}
                        className="mt-1 block text-sm text-muted-foreground hover:text-foreground"
                      >
                        {leadName(p.leadId)}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="text-lg tabular">{formatMoney(p.price)}</p>
                      <p className="num mt-1 text-subtle-foreground">
                        {p.sentAt ? `отправлено ${formatDate(p.sentAt)}` : formatDate(p.createdAt)}
                      </p>
                    </div>
                  </div>

                  {p.services.length > 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {p.services.join(" · ")}
                    </p>
                  ) : null}

                  <div className="mt-4">
                    <ProposalStatusPicker proposalId={p.id} status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside>
          <h2 className="label border-b border-border pb-3">Новое КП</h2>
          <div className="mt-6">
            {leads.length === 0 ? (
              <p className="text-[0.9375rem] text-muted-foreground">
                Сначала нужен хотя бы один лид.
              </p>
            ) : (
              <ActionForm action={addProposalAction} submitLabel="Создать" pendingLabel="Создаём…">
                <SelectField
                  label="Лид" name="leadId"
                  options={leads.map((l) => ({
                    value: l.id,
                    label: l.company ?? `${l.firstName} ${l.lastName ?? ""}`.trim(),
                  }))}
                />
                <Field label="Название" name="title" required placeholder="Разработка CRM" />
                <TextField
                  label="Состав работ" name="services" rows={4}
                  placeholder={"Проектирование\nРазработка\nЗапуск"}
                />
                <FieldRow>
                  <Field label="Сумма" name="amount" required placeholder="6000" />
                  <SelectField
                    label="Валюта" name="currency" defaultValue="USD"
                    options={[
                      { value: "USD", label: "USD" }, { value: "GBP", label: "GBP" },
                      { value: "EUR", label: "EUR" }, { value: "UZS", label: "UZS" },
                    ]}
                  />
                </FieldRow>
                <Field label="Сроки" name="timeline" placeholder="8 недель" />
                <TextField label="Описание" name="description" rows={2} />
              </ActionForm>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
