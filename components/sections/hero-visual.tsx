/**
 * A restrained, abstract product UI mock for the hero.
 * Built from primitives — no images, no glow, no neon.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 font-mono text-[11px] text-muted-foreground">
            app.sds.uz
          </span>
        </div>

        <div className="grid grid-cols-[88px_1fr]">
          {/* Sidebar */}
          <div className="flex flex-col gap-2 border-r border-border p-3">
            <div className="h-6 rounded-md bg-primary/15" />
            <div className="h-6 rounded-md bg-muted" />
            <div className="h-6 rounded-md bg-muted" />
            <div className="h-6 rounded-md bg-muted" />
            <div className="mt-auto h-6 rounded-md bg-muted/60" />
          </div>

          {/* Content */}
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded-full bg-foreground/20" />
              <div className="h-7 w-16 rounded-md bg-primary/80" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-surface p-3"
                >
                  <div className="h-2 w-8 rounded-full bg-muted-foreground/30" />
                  <div className="mt-2 h-4 w-12 rounded bg-foreground/25" />
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="mb-3 h-2 w-16 rounded-full bg-muted-foreground/30" />
              <div className="flex h-24 items-end gap-2">
                {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-full bg-muted" />
              <div className="h-2.5 w-4/5 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
