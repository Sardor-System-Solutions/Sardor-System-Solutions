/** Primary navigation. `key` resolves against the `Nav` message namespace. */
export type NavKey = "about" | "projects" | "contact";

export const navItems: { key: NavKey; href: string }[] = [
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "contact", href: "/contact" },
];
