import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <span className="num text-primary">404</span>
      <h1 className="display-2 mt-6 max-w-2xl text-balance">{t("title")}</h1>
      <p className="lead mt-6 max-w-md text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-10">
        <Button asChild size="lg">
          <Link href="/">
            {t("cta")}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </Container>
  );
}
