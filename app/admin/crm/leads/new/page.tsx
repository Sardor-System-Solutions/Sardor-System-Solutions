import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { PRIORITIES, SOURCES } from "@/types/crm";
import { PageHeader, PRIORITY_LABEL } from "@/components/crm/ui";
import { ActionForm } from "@/components/crm/action-form";
import { Field, FieldRow, SelectField, TextField } from "@/components/crm/fields";
import { addLeadAction } from "../../actions";

const SOURCE_LABEL: Record<string, string> = {
  INSTAGRAM: "Instagram", TELEGRAM: "Telegram", WEBSITE: "Сайт",
  REFERRAL: "Рекомендация", COLD_CALL: "Холодный звонок", EMAIL: "Email",
  LINKEDIN: "LinkedIn", PERSONAL: "Личный контакт",
  LONDON_OUTREACH: "London outreach", OTHER: "Другое",
};

/** Only what is needed to start — the rest is filled in on the card later. */
export default async function NewLeadPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="max-w-3xl space-y-10">
      <PageHeader label="CRM · Лиды" title="Новый лид" />
      <ActionForm action={addLeadAction} submitLabel="Создать лид" pendingLabel="Создаём…">
        <FieldRow>
          <Field label="Имя" name="firstName" required />
          <Field label="Фамилия" name="lastName" />
        </FieldRow>
        <FieldRow>
          <Field label="Компания" name="company" />
          <Field label="Должность" name="position" />
        </FieldRow>
        <FieldRow>
          <Field label="Телефон" name="phone" />
          <Field label="Email" name="email" type="email" />
        </FieldRow>
        <FieldRow>
          <Field label="Telegram" name="telegram" placeholder="@username" />
          <Field label="LinkedIn" name="linkedin" />
        </FieldRow>
        <FieldRow>
          <Field label="Город" name="city" />
          <Field label="Страна" name="country" />
        </FieldRow>
        <FieldRow>
          <SelectField
            label="Источник" name="source" defaultValue="WEBSITE"
            options={SOURCES.map((s) => ({ value: s, label: SOURCE_LABEL[s] ?? s }))}
          />
          <SelectField
            label="Приоритет" name="priority" defaultValue="MEDIUM"
            options={PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABEL[p] }))}
          />
        </FieldRow>
        <Field label="Интересующая услуга" name="service" placeholder="CRM-система" />
        <TextField label="Что нужно клиенту" name="description" rows={3} />
        <FieldRow>
          <Field label="Бюджет" name="budget" placeholder="5000" />
          <SelectField
            label="Валюта" name="currency" defaultValue="USD"
            options={[
              { value: "USD", label: "USD" }, { value: "GBP", label: "GBP" },
              { value: "EUR", label: "EUR" }, { value: "UZS", label: "UZS" },
            ]}
          />
        </FieldRow>
        <FieldRow>
          <Field label="Следующее действие" name="nextActionTitle" placeholder="Позвонить" />
          <Field label="Когда" name="nextActionAt" type="date" />
        </FieldRow>
      </ActionForm>
    </div>
  );
}
