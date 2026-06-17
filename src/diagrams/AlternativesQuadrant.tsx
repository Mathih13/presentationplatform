import { Diagram } from '../deck/Diagram';

const VIEW_W = 1920;
const VIEW_H = 1000;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;

type Tint = 'maroon' | 'olive' | 'purple';

interface Box {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  tint: Tint;
}

// Use the deck's own palette: destructive (Nord aurora red, already in :root),
// foreground (neutral steel), primary (Nord frost blue).
const COLORS: Record<Tint, { fill: string; text: string }> = {
  maroon: { fill: 'hsl(var(--destructive) / 0.28)', text: 'hsl(var(--destructive))' },
  olive: { fill: 'hsl(var(--foreground) / 0.12)', text: 'hsl(var(--foreground))' },
  purple: { fill: 'hsl(var(--primary) / 0.28)', text: 'hsl(var(--primary))' },
};

const BW = 140;
const BH = 120;

// Upper-left cluster (HARD × COMPLETE) — staggered, no overlap
const HARD_COMPLETE: Box[] = [
  { x: 220, y: 100, label: 'AWS', tint: 'maroon' },
  { x: 380, y: 180, label: 'AZURE', tint: 'maroon' },
  { x: 220, y: 240, label: 'GCP', tint: 'maroon' },
  { x: 380, y: 320, label: 'BARE\nMETAL', tint: 'maroon' },
];

// Center cluster (around axis)
const CENTER: Box[] = [
  { x: 640, y: 280, label: 'SPATIAL\nOS', tint: 'olive' },
  { x: 640, y: 420, label: 'PHOTON\nQUANTUM', tint: 'olive' },
  { x: 800, y: 350, label: 'MIRROR', tint: 'olive' },
  { x: 800, y: 490, label: 'UNREAL\nBACKEND', tint: 'olive' },
  { x: 960, y: 420, label: 'PHOTON\nFUSION', tint: 'olive' },
  { x: 960, y: 560, label: 'UNITY\nNETCODE', tint: 'olive' },
];

// Lower-right cluster (EASY × PARTIAL)
const EASY_PARTIAL: Box[] = [
  { x: 1200, y: 540, label: 'APACHE\nSPARK', tint: 'purple' },
  { x: 1200, y: 680, label: 'AWS\nLAMBDA', tint: 'purple' },
  { x: 1360, y: 610, label: 'FIREBASE', tint: 'purple' },
  { x: 1360, y: 750, label: 'POSTGRES', tint: 'purple' },
  { x: 1520, y: 680, label: 'HATHORA', tint: 'purple' },
  { x: 1520, y: 820, label: 'PLAYFAB', tint: 'purple' },
];

const ALL_BOXES: Box[] = [...HARD_COMPLETE, ...CENTER, ...EASY_PARTIAL];

function TintedBox({ x, y, w = BW, h = BH, label, tint }: Box) {
  const { fill, text } = COLORS[tint];
  const lines = label.split('\n');
  const lineHeight = 22;
  const startY = y + h / 2 - ((lines.length - 1) * lineHeight) / 2 + 6;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="hsl(var(--background))" />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} />
      <text
        x={x + w / 2}
        y={startY}
        textAnchor="middle"
        fill={text}
        fontSize={20}
        fontWeight={700}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        letterSpacing={1.5}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={x + w / 2} dy={i === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function AlternativesQuadrant() {
  const axisStroke = 'hsl(var(--foreground) / 0.45)';
  const axisDotR = 6;
  const axisLeft = 60;
  const axisRight = VIEW_W - 60;
  const axisTop = 60;
  const axisBottom = VIEW_H - 60;

  return (
    <Diagram viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mx-auto h-[80vh] w-full">
      {/* Axes */}
      <line x1={axisLeft} y1={CY} x2={axisRight} y2={CY} stroke={axisStroke} strokeWidth={1.5} />
      <line x1={CX} y1={axisTop} x2={CX} y2={axisBottom} stroke={axisStroke} strokeWidth={1.5} />
      <circle cx={axisLeft} cy={CY} r={axisDotR} fill={axisStroke} />
      <circle cx={axisRight} cy={CY} r={axisDotR} fill={axisStroke} />
      <circle cx={CX} cy={axisTop} r={axisDotR} fill={axisStroke} />
      <circle cx={CX} cy={axisBottom} r={axisDotR} fill={axisStroke} />

      {/* Axis labels */}
      <text
        x={CX}
        y={axisTop - 18}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize={24}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        letterSpacing={2}
      >
        COMPLETE SOLUTION
      </text>
      <text
        x={CX}
        y={axisBottom + 36}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize={24}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        letterSpacing={2}
      >
        PARTIAL SOLUTION
      </text>
      <text
        x={axisLeft + 16}
        y={CY + 36}
        textAnchor="start"
        fill="hsl(var(--foreground))"
        fontSize={24}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        letterSpacing={2}
      >
        HARD TO USE
      </text>
      <text
        x={axisRight - 16}
        y={CY + 36}
        textAnchor="end"
        fill="hsl(var(--foreground))"
        fontSize={24}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        letterSpacing={2}
      >
        EASY TO USE
      </text>

      {ALL_BOXES.map((b, i) => (
        <TintedBox key={i} {...b} />
      ))}
    </Diagram>
  );
}
