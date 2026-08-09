import type { GlyphId } from "@/types/project";

/**
 * The five things SDS builds. Copy lives in `messages/*.json` under
 * `Services.items.<id>`; the glyph is reused from the project diagram set so
 * the interactive services list has a visual without needing new artwork.
 */
export type ServiceId = "web" | "mobile" | "crm" | "wms" | "automation";

export interface Service {
  id: ServiceId;
  glyph: GlyphId;
  /** Anchor on the about page. */
  anchor: string;
}

export const services: Service[] = [
  { id: "web", glyph: "platform", anchor: "web" },
  { id: "mobile", glyph: "mobile", anchor: "mobile" },
  { id: "crm", glyph: "dashboard", anchor: "crm" },
  { id: "wms", glyph: "warehouse", anchor: "wms" },
  { id: "automation", glyph: "site", anchor: "automation" },
];
