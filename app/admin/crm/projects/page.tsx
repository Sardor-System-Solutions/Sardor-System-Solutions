import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { canSeeFinance } from "@/lib/crm/rbac";
import {
  AuthzError, listClients, listProjects, projectFinance,
} from "@/lib/crm/repo";
import { EmptyState, PageHeader, formatDate, formatMoney } from "@/components/crm/ui";
import { ActionForm } from "@/components/crm/action-form";
import { Field, FieldRow, SelectField, TextField } from "@/components/crm/fields";
import { ProjectStatusPicker } from "@/components/crm/project-status";
import { addClientProjectAction, addPaymentAction } from "../actions";

/**
 * Client projects — the commercial work, deliberately separate from the
 * portfolio entries the public site renders. Money lives here: price, what has
 * been paid, what is left.
 */
export default async function ClientProjectsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  let projects, clients;
  try {
    [projects, clients] = await Promise.all([listProjects(), listClients()]);
  } catch (error) {
    if (error instanceof AuthzError) redirect("/admin");
    throw error;
  }

  const showMoney = canSeeFinance(user.role);
  const clientName = (id: string) => {
    const client = clients.find((c) => c.id === id);
    return client ? (client.company ?? client.name) : "—";
  };

  const totals = projects.reduce(
    (acc, project) => {
      const f = projectFinance(project);
      return { total: acc.total + f.total, paid: acc.paid + f.paid, currency: f.currency };
    },
    { total: 0, paid: 0, currency: "USD" },
  );

  return (
    <div className="space-y-10">
      <PageHeader
        label="CRM"
        title="Проекты клиентов"
        hint={
          showMoney && projects.length
            ? `${projects.length} проектов · оплачено ${formatMoney({ amount: totals.paid, currency: totals.currency })} из ${formatMoney({ amount: totals.total, currency: totals.currency })}`
            : `${projects.length} проектов`
        }
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          {projects.length === 0 ? (
            <EmptyState
              title="Проектов пока нет"
              hint="Проект создаётся из клиента — данные подтянутся из выигранного лида."
            />
          ) : (
            projects.map((project) => {
              const f = projectFinance(project);
              return (
                <section key={project.id} className="border-t border-border-strong pt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <h2 className="text-xl tracking-[-0.025em]">{project.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {clientName(project.clientId)}
                        {project.deadline ? ` · до ${formatDate(project.deadline)}` : ""}
                      </p>
                    </div>
                    {showMoney ? (
                      <div className="text-right">
                        <p className="text-lg tabular">
                          {formatMoney({ amount: f.remaining, currency: f.currency })}
                        </p>
                        <p className="num mt-1 text-subtle-foreground">осталось</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <ProjectStatusPicker projectId={project.id} status={project.status} />
                  </div>

                  {showMoney ? (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <div className="flex justify-between border-b border-border py-2 text-sm">
                          <span className="text-muted-foreground">Стоимость</span>
                          <span className="tabular">{formatMoney({ amount: f.total, currency: f.currency })}</span>
                        </div>
                        <div className="flex justify-between border-b border-border py-2 text-sm">
                          <span className="text-muted-foreground">Оплачено</span>
                          <span className="tabular text-primary">{formatMoney({ amount: f.paid, currency: f.currency })}</span>
                        </div>
                        <div className="flex justify-between border-b border-border py-2 text-sm">
                          <span className="text-muted-foreground">Остаток</span>
                          <span className="tabular">{formatMoney({ amount: f.remaining, currency: f.currency })}</span>
                        </div>

                        {project.payments.length > 0 ? (
                          <ul className="mt-4 space-y-1">
                            {project.payments.map((payment) => (
                              <li key={payment.id} className="flex justify-between text-xs text-muted-foreground">
                                <span>{formatDate(payment.paidAt)} · {payment.note ?? "платёж"}</span>
                                <span className="tabular">
                                  {formatMoney({ amount: payment.amount, currency: payment.currency })}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div>
                        <p className="label mb-3">Добавить платёж</p>
                        <ActionForm
                          action={addPaymentAction.bind(null, project.id)}
                          submitLabel="Записать"
                          pendingLabel="Записываем…"
                        >
                          <FieldRow>
                            <Field label="Сумма" name="amount" placeholder="3000" />
                            <Field label="Дата" name="paidAt" type="date" />
                          </FieldRow>
                          <input type="hidden" name="currency" value={f.currency} />
                          <Field label="Комментарий" name="note" placeholder="Предоплата" />
                        </ActionForm>
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })
          )}
        </div>

        <aside>
          <h2 className="label border-b border-border pb-3">Новый проект</h2>
          <div className="mt-6">
            {clients.length === 0 ? (
              <p className="text-[0.9375rem] text-muted-foreground">
                Сначала переведите выигранный лид в клиента.{" "}
                <Link href="/admin/crm/leads" className="text-primary hover:underline">
                  К лидам →
                </Link>
              </p>
            ) : (
              <ActionForm action={addClientProjectAction} submitLabel="Создать" pendingLabel="Создаём…">
                <SelectField
                  label="Клиент" name="clientId"
                  options={clients.map((c) => ({ value: c.id, label: c.company ?? c.name }))}
                />
                <Field label="Название" name="name" required placeholder="CRM-система" />
                <FieldRow>
                  <Field label="Стоимость" name="price" placeholder="6000" />
                  <SelectField
                    label="Валюта" name="currency" defaultValue="USD"
                    options={[
                      { value: "USD", label: "USD" }, { value: "GBP", label: "GBP" },
                      { value: "EUR", label: "EUR" }, { value: "UZS", label: "UZS" },
                    ]}
                  />
                </FieldRow>
                <Field label="Дедлайн" name="deadline" type="date" />
                <TextField label="Требования" name="requirements" rows={3} />
              </ActionForm>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
