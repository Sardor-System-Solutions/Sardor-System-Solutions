/**
 * The team. Only what is actually known: two founders, both full-stack.
 * No invented headcount, titles or biographies.
 */
export interface TeamMember {
  id: "sardor" | "danila";
  name: string;
  initials: string;
}

export const team: TeamMember[] = [
  { id: "sardor", name: "Sardor", initials: "S" },
  { id: "danila", name: "Danila", initials: "D" },
];
