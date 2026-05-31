import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        priority
        className="size-8 shrink-0 rounded-full object-contain sm:size-9"
      />
      {showWordmark ? (
        <span className="text-[0.95rem] font-semibold leading-none tracking-tight text-foreground sm:text-base">
          Sardor <span className="text-muted-foreground">&amp;</span> Danila
          <span className="text-muted-foreground"> Systems</span>
        </span>
      ) : null}
    </Link>
  );
}
