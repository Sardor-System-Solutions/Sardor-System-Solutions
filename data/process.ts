/** How a project runs, from first conversation to ongoing development. */
export type ProcessStepId =
  | "analysis"
  | "design"
  | "build"
  | "launch"
  | "growth";

export const processSteps: ProcessStepId[] = [
  "analysis",
  "design",
  "build",
  "launch",
  "growth",
];
