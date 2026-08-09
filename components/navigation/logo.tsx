import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * The mark plus an "SDS" wordmark. The full company name is spelled out only
 * where there is room — the footer, and the header on wide screens.
 */
export function Logo({
  className,
  showFullName = false,
  tone = "default",
}: {
  className?: string;
  showFullName?: boolean;
  tone?: "default" | "ink";
}) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn(
        "inline-flex items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={72}
        height={72}
        priority
        className="size-8 shrink-0 rounded-full object-contain"
      />
      <span className="flex items-baseline gap-2.5">
        <span
          className={cn(
            "text-[0.9375rem] font-semibold leading-none tracking-[-0.02em]",
            tone === "ink" ? "text-ink-foreground" : "text-foreground",
          )}
        >
          SDS
        </span>
        {showFullName ? (
          <span
            className={cn(
              "hidden text-[0.8125rem] leading-none tracking-[-0.01em] xl:inline",
              tone === "ink" ? "text-ink-muted" : "text-muted-foreground",
            )}
          >
            Sardor &amp; Danila Systems
          </span>
        ) : null}
      </span>
    </Link>
  );
}
