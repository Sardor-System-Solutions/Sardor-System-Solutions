import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The single measure everything on the site lines up to. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-12 xl:px-16",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
