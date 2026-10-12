// The context rings recast as a map of people: who in the organisation holds each ring.
// Same palette and order as the Excalidraw ring diagrams (programmering-*.svg) so the
// audience recognises it. Rows on the right reveal inside-out, one per fragment, so the
// room can be asked "who holds this ring here?" before the answer appears.

import { RINGS } from './contextRings';

const FONT = 'Open Sans, system-ui, sans-serif';
const FG = 'hsl(var(--foreground))';
const MUTED = 'hsl(var(--muted-foreground))';
const INK = '#1e1e1e';

const CX = 540;
const CY = 560;

const ROW_X = 1120;
const ROW_TOP = 330;
const ROW_STEP = 130;

export function ContextPeopleMap({ revealed }: { revealed: number }) {
  return (
    <svg
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      {/* rings, drawn outside-in so inner rings sit on top */}
      {[...RINGS].reverse().map((ring) => (
        <circle
          key={ring.name}
          cx={CX}
          cy={CY}
          r={ring.r}
          fill={ring.fill}
          stroke={INK}
          strokeWidth={3}
        />
      ))}
      {RINGS.map((ring, i) => {
        const inner = i === 0 ? 0 : RINGS[i - 1]!.r;
        const y = i === 0 ? CY + 12 : CY - (ring.r + inner) / 2 + 12;
        return (
          <text
            key={ring.name}
            x={CX}
            y={y}
            textAnchor="middle"
            fill={INK}
            fontSize={32}
            fontFamily={FONT}
          >
            {ring.name}
          </text>
        );
      })}

      <text x={ROW_X} y={200} fill={FG} fontSize={56} fontFamily={FONT} fontWeight={700}>
        Hvem holder ringen?
      </text>

      {RINGS.map((ring, i) => (
        <g
          key={ring.name}
          opacity={i < revealed ? 1 : 0}
          style={{ transition: 'opacity 400ms ease' }}
        >
          <circle
            cx={ROW_X + 22}
            cy={ROW_TOP + i * ROW_STEP - 12}
            r={20}
            fill={ring.fill}
            stroke={INK}
            strokeWidth={2}
          />
          <text
            x={ROW_X + 64}
            y={ROW_TOP + i * ROW_STEP}
            fill={FG}
            fontSize={40}
            fontFamily={FONT}
            fontWeight={600}
          >
            {ring.name}
          </text>
          <text
            x={ROW_X + 64}
            y={ROW_TOP + i * ROW_STEP + 46}
            fill={MUTED}
            fontSize={30}
            fontFamily={FONT}
          >
            {ring.who}
          </text>
        </g>
      ))}
    </svg>
  );
}
