import { Diagram } from '../deck/Diagram';

const VIEW_W = 1920;
const VIEW_MIN_Y = -80;
const VIEW_H = 1320;

const R = 380;
const COMPUTE = { cx: 960, cy: 380, color: 'var(--primary)' };
const STORAGE = { cx: 680, cy: 720, color: 'var(--destructive)' };
const NETWORK = { cx: 1240, cy: 720, color: 'var(--foreground)' };

interface Box {
  x: number;
  y: number;
  w?: number;
  label: string;
}

const BH = 70;
const DEFAULT_BW = 150;

// Solutions placed in the correct Venn region (verified geometrically)
const BOXES: Box[] = [
  // Compute only — above storage/network reach
  { x: 810, y: 210, label: 'AWS\nLAMBDA' },
  { x: 990, y: 210, label: 'HATHORA' },

  // Compute ∩ Storage only
  { x: 640, y: 470, label: 'APACHE\nSPARK' },

  // Compute ∩ Network only — stacked, right of triple center
  { x: 1040, y: 400, label: 'PHOTON\nFUSION' },
  { x: 1040, y: 490, label: 'UNREAL\nBACKEND' },
  { x: 1070, y: 580, label: 'UNITY\nNETCODE' },

  // Storage only — bottom-left lobe
  { x: 320, y: 770, label: 'POSTGRES' },
  { x: 450, y: 880, label: 'PLAYFAB' },

  // Storage ∩ Network only — bottom-center, below compute
  { x: 895, y: 800, w: 130, label: 'FIREBASE' },

  // Network only — bottom-right lobe
  { x: 1370, y: 470, label: 'MIRROR' },
  { x: 1320, y: 800, label: 'PHOTON\nQUANTUM' },
];

interface PillarCircleProps {
  cx: number;
  cy: number;
  color: string;
}

function PillarCircle({ cx, cy, color }: PillarCircleProps) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={R}
      fill={`hsl(${color} / 0.16)`}
      stroke={`hsl(${color} / 0.7)`}
      strokeWidth={2}
    />
  );
}

interface CircleLabelProps {
  x: number;
  y: number;
  color: string;
  children: string;
}

function CircleLabel({ x, y, color, children }: CircleLabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={`hsl(${color})`}
      fontSize={32}
      fontWeight={700}
      fontFamily="JetBrains Mono, ui-monospace, monospace"
      letterSpacing={2}
    >
      {children}
    </text>
  );
}

function SolutionBox({ x, y, w = DEFAULT_BW, label }: Box) {
  const lines = label.split('\n');
  const lineHeight = 22;
  const startY = y + BH / 2 - ((lines.length - 1) * lineHeight) / 2 + 6;
  return (
    <g>
      <rect x={x} y={y} width={w} height={BH} rx={6} fill="hsl(var(--background))" />
      <rect
        x={x}
        y={y}
        width={w}
        height={BH}
        rx={6}
        fill="hsl(var(--foreground) / 0.12)"
        stroke="hsl(var(--foreground) / 0.4)"
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={startY}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
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

export function PillarsVenn() {
  return (
    <Diagram
      viewBox={`0 ${VIEW_MIN_Y} ${VIEW_W} ${VIEW_H}`}
      className="mx-auto h-[82vh] w-full"
    >
      <PillarCircle {...COMPUTE} />
      <PillarCircle {...STORAGE} />
      <PillarCircle {...NETWORK} />

      {/* Labels outside the circles */}
      <CircleLabel x={COMPUTE.cx} y={COMPUTE.cy - R - 30} color={COMPUTE.color}>
        SERVER COMPUTE
      </CircleLabel>
      <CircleLabel x={STORAGE.cx - 60} y={STORAGE.cy + R + 60} color={STORAGE.color}>
        TRANSACTIONAL STORAGE
      </CircleLabel>
      <CircleLabel x={NETWORK.cx + 60} y={NETWORK.cy + R + 60} color={NETWORK.color}>
        REAL-TIME NETWORKING
      </CircleLabel>

      {BOXES.map((b, i) => (
        <SolutionBox key={i} {...b} />
      ))}

      {/* Triple-overlap: SpacetimeDB-shaped hole */}
      <text
        x={960}
        y={680}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize={120}
        fontWeight={700}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        ?
      </text>
    </Diagram>
  );
}
