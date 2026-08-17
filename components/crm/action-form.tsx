"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/app/admin/crm/actions";

/*
  One wrapper for every CRM form, so each screen gets a pending state, an
  inline error and a consistent submit without repeating the plumbing.
*/

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-[0.9375rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function ActionForm({
  action,
  children,
  submitLabel = "Сохранить",
  pendingLabel = "Сохраняем…",
  className,
  footer,
}: {
  action: (form: FormData) => Promise<ActionResult>;
  children: ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
  className?: string;
  footer?: ReactNode;
}) {
  const [state, formAction] = useActionState(
    async (_prev: ActionResult | null, form: FormData) => action(form),
    null,
  );

  return (
    <form action={formAction} className={cn("space-y-6", className)}>
      {children}

      {state && !state.ok ? (
        <p className="border-l-2 border-destructive pl-4 text-sm leading-relaxed text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-4">
        <Submit label={submitLabel} pendingLabel={pendingLabel} />
        {footer}
      </div>
    </form>
  );
}

/** A button that fires an action with no form fields — convert, advance, etc. */
export function ActionButton({
  action,
  children,
  variant = "ghost",
  confirm,
}: {
  action: () => Promise<ActionResult>;
  children: ReactNode;
  variant?: "primary" | "ghost";
  confirm?: string;
}) {
  const [state, formAction] = useActionState(
    async () => action(),
    null,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
      className="inline-flex flex-col gap-1"
    >
      <SubmitInline variant={variant}>{children}</SubmitInline>
      {state && !state.ok ? (
        <span className="text-xs text-destructive">{state.error}</span>
      ) : null}
    </form>
  );
}

function SubmitInline({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "primary" | "ghost";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-[0.9375rem] transition-colors disabled:opacity-60",
        variant === "primary"
          ? "h-11 bg-primary px-5 font-medium text-primary-foreground hover:bg-primary-hover"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {pending ? "…" : children}
    </button>
  );
}
