import {
  ShieldCheck,
  Gauge,
  MessagesSquare,
  Layers,
  type LucideIcon,
} from "lucide-react";

export type ValueId = "ownership" | "craft" | "transparency" | "longevity";

export const values: { id: ValueId; icon: LucideIcon }[] = [
  { id: "ownership", icon: ShieldCheck },
  { id: "craft", icon: Gauge },
  { id: "transparency", icon: MessagesSquare },
  { id: "longevity", icon: Layers },
];
