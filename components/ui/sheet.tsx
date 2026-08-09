"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Enter/exit motion is driven by the `data-sheet-overlay` / `data-sheet-panel`
  hooks in globals.css, keyed off Radix's own `data-state`.
*/

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    data-sheet-overlay=""
    className={cn("fixed inset-0 z-50 bg-ink/50", className)}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    /** Hide the built-in corner close when the panel supplies its own. */
    hideClose?: boolean;
  }
>(({ className, children, hideClose = false, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      data-sheet-panel=""
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex h-full w-80 max-w-[85vw] flex-col gap-6 border-l border-border bg-background p-6",
        className,
      )}
      {...props}
    >
      {children}
      {hideClose ? null : (
        <SheetPrimitive.Close className="absolute right-5 top-5 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

function SheetTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn("text-base font-medium text-foreground", className)}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle };
