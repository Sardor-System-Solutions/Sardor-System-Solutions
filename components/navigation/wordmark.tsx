import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Text wordmark. The circular logo image is reserved for the favicon and the
 * share card — inside the header it would fight the typography.
 */
export function Wordmark({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "ink";
}) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn(
        "group inline-flex items-baseline gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        className,
      )}
    >
      <span
        className={cn(
          "text-[1.0625rem] font-semibold leading-none tracking-[-0.045em]",
          tone === "ink" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        SDS
      </span>
      <span
        aria-hidden
        className="size-1 shrink-0 translate-y-[-0.15em] rounded-full bg-primary"
      />
    </Link>
  );
}
