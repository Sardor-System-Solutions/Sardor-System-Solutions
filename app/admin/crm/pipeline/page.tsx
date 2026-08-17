import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { canSeeFinance } from "@/lib/crm/rbac";
import { AuthzError, listLeads } from "@/lib/crm/repo";
import { EmptyState, PageHeader, PrimaryAction } from "@/components/crm/ui";
import { PipelineBoard } from "@/components/crm/pipeline-board";

export default async function PipelinePage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  let leads;
  try {
    leads = await listLeads();
  } catch (error) {
    if (error instanceof AuthzError) redirect("/admin");
    throw error;
  }

  return (
    <div className="space-y-10">
      <PageHeader
        label="CRM"
        title="Воронка"
        hint="Перетащите карточку, чтобы сменить этап — изменение попадёт в историю лида."
        action={<PrimaryAction href="/admin/crm/leads/new">Новый лид</PrimaryAction>}
      />

      {leads.length === 0 ? (
        <EmptyState
          title="В воронке пусто"
          hint="Создайте лид или переведите компанию из реестра prospects."
          action={<PrimaryAction href="/admin/crm/leads/new">Добавить лид</PrimaryAction>}
        />
      ) : (
        <PipelineBoard leads={leads} showMoney={canSeeFinance(user.role)} />
      )}
    </div>
  );
}
