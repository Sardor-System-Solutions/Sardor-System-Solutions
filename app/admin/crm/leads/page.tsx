import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { canSeeFinance } from "@/lib/crm/rbac";
import { AuthzError, listLeads } from "@/lib/crm/repo";
import { LEAD_STAGES } from "@/types/crm";
import {
  EmptyState, PageHeader, PrimaryAction, PriorityTag, StageBadge,
  formatDate, formatMoney,
} from "@/components/crm/ui";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; q?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  let leads;
  try {
    leads = await listLeads();
  } catch (error) {
    if (error instanceof AuthzError) redirect("/admin");
    throw error;
  }

  const { stage, q } = await searchParams;
  const needle = q?.toLowerCase().trim();
  const showMoney = canSeeFinance(user.role);

  const filtered = leads.filter((l) => {
    if (stage && l.stage !== stage) return false;
    if (!needle) return true;
    return [l.firstName, l.lastName, l.company, l.email, l.phone, l.city]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(needle));
  });

  return (
    <div className="space-y-10">
      <PageHeader
        label="CRM"
        title="Лиды"
        hint={`${leads.length} всего`}
        action={<PrimaryAction href="/admin/crm/leads/new">Новый лид</PrimaryAction>}
      />

      <form className="flex flex-wrap items-end gap-4" method="get">
        <div className="min-w-56 flex-1">
          <label htmlFor="q" className="label">Поиск</label>
          <input
            id="q" name="q" defaultValue={q ?? ""}
            placeholder="имя, компания, email, телефон"
            className="mt-2.5 flex h-11 w-full rounded-md border border-input bg-background px-4 text-[0.9375rem] focus-visible:border-ring focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="stage" className="label">Этап</label>
          <select
            id="stage" name="stage" defaultValue={stage ?? ""}
            className="mt-2.5 flex h-11 rounded-md border border-input bg-background px-4 text-[0.9375rem]"
          >
            <option value="">Все</option>
            {LEAD_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button type="submit" className="h-11 rounded-md border border-border-strong px-5 text-[0.9375rem] transition-colors hover:border-foreground">
          Применить
        </button>
      </form>

      {filtered.length === 0 ? (
        <EmptyState
          title={leads.length ? "Ничего не найдено" : "Лидов пока нет"}
          hint={leads.length ? "Измените фильтры." : "Добавьте первого потенциального клиента."}
          action={leads.length ? undefined : <PrimaryAction href="/admin/crm/leads/new">Добавить лид</PrimaryAction>}
        />
      ) : (
        <ul className="border-t border-border">
          {filtered.map((lead) => (
            <li key={lead.id} className="border-b border-border">
              <Link
                href={`/admin/crm/leads/${lead.id}`}
                className="group grid gap-3 py-5 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <div className="md:col-span-4">
                  <p className="font-medium tracking-[-0.02em] transition-colors group-hover:text-primary">
                    {lead.company ?? `${lead.firstName} ${lead.lastName ?? ""}`}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lead.company ? `${lead.firstName} ${lead.lastName ?? ""}` : lead.email ?? "—"}
                  </p>
                </div>
                <div className="md:col-span-2"><StageBadge stage={lead.stage} /></div>
                <div className="text-sm text-muted-foreground md:col-span-2">
                  {lead.service ?? "—"}
                  <span className="mt-1 block"><PriorityTag priority={lead.priority} /></span>
                </div>
                <div className="text-sm md:col-span-2">
                  {showMoney ? formatMoney(lead.proposedPrice ?? lead.budget) : "—"}
                </div>
                <div className="text-sm md:col-span-2 md:text-right">
                  {lead.nextActionTitle ? (
                    <>
                      <span className="block truncate">{lead.nextActionTitle}</span>
                      <span className="text-subtle-foreground">{formatDate(lead.nextActionAt)}</span>
                    </>
                  ) : (
                    <span className="text-subtle-foreground">нет действия</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
