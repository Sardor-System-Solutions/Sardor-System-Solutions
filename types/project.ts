/**
 * Project shape.
 *
 * Structure and assets live here; all human-readable copy lives in
 * `messages/*.json` under `Projects.<slug>` so it can be translated. A field
 * left empty means we do not have that information — the case study renders
 * only the sections it actually has, rather than padding them out.
 */

export type ProjectSlug =
  | "oson-uy"
  | "oson-uy-mobile"
  | "oson-uy-crm"
  | "wms"
  | "kidscity"
  | "evro-plaza"
  | "pishcool"
  | "samyak"
  | "tespack";

/**
 * `product`    — built and developed by SDS, as SDS.
 * `commercial` — developed by the team as part of Dotlabs. Listed as team
 *                experience; never presented as an SDS client.
 */
export type ProjectKind = "product" | "commercial";

/** Abstract line diagram shown when a project has no real screenshot. */
export type GlyphId =
  | "platform"
  | "dashboard"
  | "mobile"
  | "warehouse"
  | "store"
  | "site";

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  /** `wide` for browser captures, `tall` for phone captures. */
  ratio?: "wide" | "tall";
  /** Message key under `Projects.<slug>.captions`, when the shot needs one. */
  captionKey?: string;
}

export interface Project {
  id: number;
  slug: ProjectSlug;
  /** Product name — not translated. */
  title: string;
  kind: ProjectKind;
  glyph: GlyphId;
  /** Lead visual. Absent when we have no capture of the product. */
  cover?: ProjectImage;
  /** Additional real captures shown in the case study's PRODUCT section. */
  images: ProjectImage[];
  /** Live product, when it is public. */
  href?: string;
  domain?: string;
  /**
   * Per-project stack. Deliberately empty: the studio-level stack is stated on
   * the About page, and we do not assert a stack per project that has not been
   * confirmed. Fill this in and the TECHNOLOGY section appears by itself.
   */
  technologies: string[];
  /** Year shipped. Empty until confirmed — we do not guess dates. */
  year?: string;
  /** Shown on the home page's selected work. */
  featured: boolean;
  /** Width in the editorial gallery on the projects page. */
  span: "full" | "half";
}
