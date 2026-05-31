import {
  Compass,
  PenTool,
  Code2,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export type ProcessStepId = "discovery" | "design" | "build" | "launch";

export const processSteps: { id: ProcessStepId; icon: LucideIcon }[] = [
  { id: "discovery", icon: Compass },
  { id: "design", icon: PenTool },
  { id: "build", icon: Code2 },
  { id: "launch", icon: Rocket },
];
