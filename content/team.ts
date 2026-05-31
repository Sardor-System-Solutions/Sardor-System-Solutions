export type TeamMemberId = "sardor" | "danila" | "engineering" | "design";

export type TeamMember = {
  id: TeamMemberId;
  initials: string;
};

/** Presented as a small, senior, growing studio. */
export const team: TeamMember[] = [
  { id: "sardor", initials: "S" },
  { id: "danila", initials: "D" },
  { id: "engineering", initials: "E" },
  { id: "design", initials: "P" },
];
