import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LeadStage, Priority, ProspectStage, Source, TaskStatus } from "@/types/crm";

/*
  The small pieces every CRM screen is built from. Same hairline language as
  the site: rules and type, no boxed cards.
*/

export function PageHeader({
  label,
  title,
  hint,
  action,
}: {
  label: string;
  title: string;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="label">{label}</span>
        <h1 className="display-3 mt-3">{title}</h1>
        {hint ? (
          <p className="mt-3 text-[0.9375rem] text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PrimaryAction({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
    >
      {children}
    </Link>
  );
}

/** Nothing here yet — say what to do about it rather than showing blank space. */
export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 border border-dashed border-border px-6 py-20 text-center">
      <p className="text-lg tracking-[-0.02em]">{title}</p>
      {hint ? (
        <p className="max-w-sm text-[0.9375rem] text-muted-foreground">{hint}</p>
      ) : null}
      {action}
    </div>
  );
}

const STAGE_TONE: Record<string, string> = {
  NEW: "border-border text-muted-foreground",
  TO_CONTACT: "border-border text-muted-foreground",
  CONTACTED: "border-border-strong text-foreground",
  INTERESTED: "border-primary/40 text-primary",
  MEETING: "border-primary/40 text-primary",
  PROPOSAL: "border-primary/40 text-primary",
  NEGOTIATION: "border-primary/40 text-primary",
  WON: "border-emerald-600/40 text-emerald-700",
  LOST: "border-border text-subtle-foreground",
  NOT_NOW: "border-border text-subtle-foreground",
};

export const STAGE_LABEL: Record<string, string> = {
  NEW: "Новый",
  TO_CONTACT: "Связаться",
  CONTACTED: "Связались",
  INTERESTED: "Интерес",
  MEETING: "Встреча",
  PROPOSAL: "КП",
  NEGOTIATION: "Переговоры",
  WON: "Сделка",
  LOST: "Отказ",
  NOT_NOW: "Не сейчас",
};

export function StageBadge({ stage }: { stage: LeadStage | ProspectStage }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-sm border px-2 py-0.5 text-xs",
        STAGE_TONE[stage] ?? "border-border text-muted-foreground",
      )}
    >
      {STAGE_LABEL[stage] ?? stage}
    </span>
  );
}

/*
  Sources, currencies and their labels live here rather than being retyped on
  every screen — they were drifting apart across three files.
*/

/** Every value that can appear in a record, including ones no longer offered. */
export const SOURCE_LABEL: Record<string, string> = {
  INSTAGRAM: "Instagram",
  TELEGRAM: "Telegram",
  WEBSITE: "Сайт",
  REFERRAL: "Рекомендация",
  COLD_CALL: "Звонок",
  PERSONAL: "Личный контакт",
  EMAIL: "Email",
  LINKEDIN: "LinkedIn",
  LONDON_OUTREACH: "London outreach",
  OTHER: "Другое",
};

/** Offered when adding — the channels work actually arrives through here. */
export const SOURCE_OPTIONS: Source[] = [
  "INSTAGRAM",
  "TELEGRAM",
  "REFERRAL",
  "COLD_CALL",
  "WEBSITE",
  "PERSONAL",
  "OTHER",
];

export const DEFAULT_CURRENCY = "UZS";

/** Sums first — the other currency is for the occasional export job. */
export const CURRENCY_OPTIONS = [
  { value: "UZS", label: "сум" },
  { value: "USD", label: "USD" },
];

export function sourceOptions() {
  return SOURCE_OPTIONS.map((value) => ({
    value,
    label: SOURCE_LABEL[value] ?? value,
  }));
}

const PRIORITY_TONE: Record<Priority, string> = {
  LOW: "text-subtle-foreground",
  MEDIUM: "text-muted-foreground",
  HIGH: "text-foreground",
  URGENT: "text-destructive",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  LOW: "низкий",
  MEDIUM: "средний",
  HIGH: "высокий",
  URGENT: "срочно",
};

export function PriorityTag({ priority }: { priority: Priority }) {
  return (
    <span className={cn("text-xs", PRIORITY_TONE[priority])}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "К выполнению",
  IN_PROGRESS: "В работе",
  DONE: "Готово",
  CANCELLED: "Отменена",
};

/** A KPI figure. Deliberately plain — the number is the point. */
export function Stat({
  value,
  label,
  tone = "default",
  href,
}: {
  value: string;
  label: string;
  tone?: "default" | "accent" | "warn";
  href?: string;
}) {
  const body = (
    <>
      <p
        className={cn(
          "text-[2rem] font-medium leading-none tracking-[-0.04em] tabular",
          tone === "accent" && "text-primary",
          tone === "warn" && "text-destructive",
        )}
      >
        {value}
      </p>
      <p className="mt-2.5 text-sm text-muted-foreground">{label}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block border-t border-border-strong pt-5 transition-colors hover:border-primary"
      >
        {body}
      </Link>
    );
  }
  return <div className="border-t border-border-strong pt-5">{body}</div>;
}

/** Dates are shown in one place and one way across the CRM. */
export function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(money?: { amount: number; currency: string }) {
  if (!money || !money.amount) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: money.currency || DEFAULT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(money.amount);
}
