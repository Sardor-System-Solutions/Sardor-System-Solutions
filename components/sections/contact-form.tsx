"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/site";

type Field = "name" | "company" | "contact" | "message";
type Errors = Partial<Record<Field, string>>;

/**
 * There is no backend, so the form validates locally and hands a pre-filled
 * message to the visitor's mail client.
 *
 * "Контакт" is free text on purpose — people reach us on Telegram as often as
 * by email, and we should not reject a handle for not looking like an address.
 */
export function ContactForm() {
  const t = useTranslations("Contact.form");
  const [values, setValues] = useState({
    name: "",
    company: "",
    contact: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function update(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t("errors.name");
    if (!values.contact.trim()) next.contact = t("errors.contact");
    if (values.message.trim().length < 10) next.message = t("errors.message");
    return next;
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const subject = `${t("emailSubject")} — ${values.name}`;
    const body = [
      `${t("name")}: ${values.name}`,
      values.company ? `${t("company")}: ${values.company}` : null,
      `${t("contact")}: ${values.contact}`,
      "",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted(true);
    window.location.href = `${siteConfig.contacts.emailHref}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  if (submitted) {
    return (
      <div className="flex items-start gap-4 border-t border-primary pt-6">
        <Check className="mt-1 size-5 shrink-0 text-primary" />
        <p className="text-pretty leading-relaxed">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            autoComplete="name"
          />
          {errors.name ? (
            <p id="name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="company">{t("company")}</Label>
          <Input
            id="company"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder={t("companyPlaceholder")}
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="contact">{t("contact")}</Label>
        <Input
          id="contact"
          value={values.contact}
          onChange={(e) => update("contact", e.target.value)}
          placeholder={t("contactPlaceholder")}
          aria-invalid={!!errors.contact}
          aria-describedby={errors.contact ? "contact-error" : undefined}
        />
        {errors.contact ? (
          <p id="contact-error" className="text-xs text-destructive">
            {errors.contact}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={t("messagePlaceholder")}
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? (
          <p id="message-error" className="text-xs text-destructive">
            {errors.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {t("submit")}
        <ArrowRight />
      </Button>
    </form>
  );
}
