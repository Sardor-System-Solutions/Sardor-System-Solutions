import type { GlyphId } from "@/types/project";
import { cn } from "@/lib/utils";

/*
  Schematic line diagrams, used only where no real screenshot of a project
  exists. They are deliberately abstract — structure, never invented UI, and
  never anything that could be mistaken for a captured interface.

  One hairline weight, one accent element each. Each glyph carries its own
  viewBox so a phone stays phone-shaped next to a landscape layout.
*/

const line = "stroke-current text-diagram";
const accent = "stroke-current text-primary";

type Glyph = { viewBox: string; Shape: () => React.JSX.Element };

const platform: Glyph = {
  viewBox: "0 0 160 90",
  Shape: () => (
    <>
      <rect x="1" y="1" width="158" height="88" rx="2" className={line} />
      <line x1="1" y1="13" x2="159" y2="13" className={line} />
      <rect x="60" y="24" width="40" height="9" rx="1" className={accent} />
      <line x1="46" y1="43" x2="114" y2="43" className={line} />
      <line x1="56" y1="49" x2="104" y2="49" className={line} />
      {[14, 60, 106].map((x) => (
        <rect key={x} x={x} y="60" width="40" height="20" rx="1" className={line} />
      ))}
    </>
  ),
};

const dashboard: Glyph = {
  viewBox: "0 0 160 90",
  Shape: () => (
    <>
      <rect x="1" y="1" width="158" height="88" rx="2" className={line} />
      <line x1="38" y1="1" x2="38" y2="89" className={line} />
      <rect x="8" y="10" width="22" height="7" rx="1" className={accent} />
      {[24, 34, 44, 54].map((y) => (
        <line key={y} x1="8" y1={y} x2="30" y2={y} className={line} />
      ))}
      {[46, 74, 102, 130].map((x) => (
        <rect key={x} x={x} y="10" width="22" height="18" rx="1" className={line} />
      ))}
      <rect x="46" y="36" width="106" height="44" rx="1" className={line} />
      {[47, 58, 69].map((y) => (
        <line key={y} x1="52" y1={y} x2="146" y2={y} className={line} />
      ))}
    </>
  ),
};

const mobile: Glyph = {
  viewBox: "0 0 56 90",
  Shape: () => (
    <>
      <rect x="1" y="1" width="54" height="88" rx="7" className={line} />
      <line x1="21" y1="8" x2="35" y2="8" className={line} />
      <rect x="8" y="16" width="40" height="20" rx="1" className={accent} />
      {[42, 53, 64, 75].map((y) => (
        <rect key={y} x="8" y={y} width="40" height="7" rx="1" className={line} />
      ))}
    </>
  ),
};

const warehouse: Glyph = {
  viewBox: "0 0 160 90",
  Shape: () => (
    <>
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4, 5].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={6 + col * 25}
            y={8 + row * 24}
            width="20"
            height="18"
            rx="1"
            className={row === 1 && col === 3 ? accent : line}
          />
        )),
      )}
      <line x1="6" y1="84" x2="151" y2="84" className={line} />
    </>
  ),
};

const store: Glyph = {
  viewBox: "0 0 160 90",
  Shape: () => (
    <>
      <rect x="1" y="1" width="158" height="88" rx="2" className={line} />
      <line x1="1" y1="15" x2="159" y2="15" className={line} />
      <circle cx="146" cy="8" r="3.5" className={accent} />
      {[0, 1, 2, 3].map((col) => (
        <g key={col}>
          <rect
            x={10 + col * 37}
            y="24"
            width="30"
            height="30"
            rx="1"
            className={line}
          />
          <line
            x1={10 + col * 37}
            y1="62"
            x2={30 + col * 37}
            y2="62"
            className={line}
          />
          <line
            x1={10 + col * 37}
            y1="70"
            x2={24 + col * 37}
            y2="70"
            className={line}
          />
        </g>
      ))}
    </>
  ),
};

const site: Glyph = {
  viewBox: "0 0 160 90",
  Shape: () => (
    <>
      <rect x="1" y="1" width="158" height="88" rx="2" className={line} />
      <line x1="1" y1="13" x2="159" y2="13" className={line} />
      <rect x="14" y="24" width="70" height="38" rx="1" className={accent} />
      <line x1="96" y1="28" x2="146" y2="28" className={line} />
      <line x1="96" y1="36" x2="138" y2="36" className={line} />
      <line x1="96" y1="44" x2="146" y2="44" className={line} />
      <line x1="96" y1="52" x2="120" y2="52" className={line} />
      <line x1="14" y1="74" x2="146" y2="74" className={line} />
    </>
  ),
};

const glyphs: Record<GlyphId, Glyph> = {
  platform,
  dashboard,
  mobile,
  warehouse,
  store,
  site,
};

export function ProjectGlyph({
  id,
  className,
}: {
  id: GlyphId;
  className?: string;
}) {
  const { viewBox, Shape } = glyphs[id];
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      aria-hidden
      className={cn("w-auto", className)}
    >
      <Shape />
    </svg>
  );
}
