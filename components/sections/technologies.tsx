import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { technologies } from "@/content/tech";

export function Technologies() {
  const t = useTranslations("Technologies");

  return (
    <section className="border-y border-border py-12">
      <Container>
        <p className="eyebrow mb-8 text-center">{t("label")}</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {technologies.map((tech) => (
            <li
              key={tech}
              className="text-base font-medium tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-lg"
            >
              {tech}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
