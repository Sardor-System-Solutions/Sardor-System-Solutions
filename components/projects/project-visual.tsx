import Image from "next/image";
import type { Project, ProjectImage } from "@/types/project";
import { cn } from "@/lib/utils";
import { ProjectGlyph } from "./project-glyph";

/**
 * The visual slot of a project.
 *
 * Either a real screenshot of the shipped product, or — when we have no
 * capture — a schematic plate. We never dress an abstract plate up as an
 * interface.
 *
 * Screenshots keep the 16:9 frame the captures were cropped to. Plates are
 * free of that constraint, so a full-width one runs as a shallow band instead
 * of a half-empty billboard.
 */
export function ProjectVisual({
  project,
  alt,
  sizes,
  span = "half",
  priority = false,
  className,
  image,
  tone = "default",
}: {
  project: Project;
  alt: string;
  sizes: string;
  span?: "full" | "half";
  priority?: boolean;
  className?: string;
  /** Override the cover, e.g. when rendering a gallery entry. */
  image?: ProjectImage;
  tone?: "default" | "ink";
}) {
  const source = image ?? project.cover;
  const surface = tone === "ink" ? "bg-ink-2" : "bg-surface";
  const edge = tone === "ink" ? "border-ink-line" : "border-border";

  if (source) {
    return (
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-lg border",
          surface,
          edge,
          className,
        )}
      >
        <Image
          src={source.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg border",
        // A full-width plate runs as a shallow band on desktop, but on a phone
        // that leaves the diagram too small to read — so it keeps 16:9 there.
        span === "full" ? "aspect-video sm:aspect-32/9" : "aspect-video",
        surface,
        edge,
        className,
      )}
    >
      <ProjectGlyph
        id={project.glyph}
        className="h-[58%] transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
    </div>
  );
}
