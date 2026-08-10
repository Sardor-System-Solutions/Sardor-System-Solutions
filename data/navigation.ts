/**
 * The one-page sections, in document order. `id` is the anchor on the home
 * page; `key` resolves against the `Nav` message namespace.
 *
 * The hero deliberately has no nav entry — nothing should be highlighted
 * while the visitor is still at the top.
 */
export type NavKey = "about" | "projects" | "contact";

export interface NavSection {
  key: NavKey;
  id: string;
}

export const navSections: NavSection[] = [
  { key: "about", id: "about" },
  { key: "projects", id: "projects" },
  { key: "contact", id: "contact" },
];

export const navSectionIds = navSections.map((section) => section.id);
