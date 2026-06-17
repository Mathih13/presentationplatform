// The APS loop as a workflow graph: the human writes the spec, agents implement /
// review / run it, mutation tests how tightly the spec pins behavior, and a surviving
// mutant sends the human back to tighten the spec — closing the loop. Static themed SVG.

const STEPS = [
  { label: 'Spec', sub: '.feature · human', color: 'hsl(var(--chart-2))' },
  { label: 'Dispatch', sub: 'agent implements', color: 'hsl(var(--chart-1))' },
  { label: 'Review', sub: 'independent agent', color: 'hsl(var(--chart-1))' },
  { label: 'Run', sub: 'acceptance tests', color: 'hsl(var(--chart-1))' },
  { label: 'Mutate', sub: 'spec strength', color: 'hsl(var(--chart-1))' },
];

const BOX_W = 290;
const BOX_H = 170;
const TOP = 360;
const START_X = 95;
const STEP_X = 360;
const CY = TOP + BOX_H / 2;
const BOTTOM = TOP + BOX_H;
const ARROW = 'hsl(var(--muted-foreground))';
const LOOP = 'hsl(var(--chart-2))';
const FONT = 'Open Sans, system-ui, sans-serif';

const boxLeft = (i: number) => START_X + i * STEP_X;
const boxCx = (i: number) => boxLeft(i) + BOX_W / 2;

export function ApsLoop() {
  return (
    <svg
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      <defs>
        <marker id="aps-arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
        </marker>
      </defs>

      <text x={960} y={170} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={60} fontFamily={FONT} fontWeight={700}>
        The APS loop
      </text>

      {/* forward arrows, step → step */}
      {STEPS.slice(0, -1).map((_, i) => (
        <line
          key={`arrow-${i}`}
          x1={boxLeft(i) + BOX_W + 8}
          y1={CY}
          x2={boxLeft(i + 1) - 8}
          y2={CY}
          stroke={ARROW}
          strokeWidth={4}
          markerEnd="url(#aps-arrowhead)"
          style={{ color: ARROW }}
        />
      ))}

      {/* feedback arc: Mutate → Spec */}
      <path
        d={`M ${boxCx(4)} ${BOTTOM} C ${boxCx(4)} 830, ${boxCx(0)} 830, ${boxCx(0)} ${BOTTOM + 4}`}
        fill="none"
        stroke={LOOP}
        strokeWidth={4}
        markerEnd="url(#aps-arrowhead)"
        style={{ color: LOOP }}
      />
      <text x={960} y={688} textAnchor="middle" fill={LOOP} fontSize={34} fontFamily={FONT} fontWeight={600}>
        tighten the spec
      </text>
      <text x={960} y={726} textAnchor="middle" fill={ARROW} fontSize={24} fontFamily={FONT}>
        surviving mutant = loose spec
      </text>

      {/* step nodes */}
      {STEPS.map((s, i) => (
        <g key={s.label}>
          <rect
            x={boxLeft(i)}
            y={TOP}
            width={BOX_W}
            height={BOX_H}
            rx={16}
            fill={s.color}
            fillOpacity={0.16}
            stroke={s.color}
            strokeWidth={3}
          />
          <text x={boxCx(i)} y={CY - 8} textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--foreground))" fontSize={42} fontFamily={FONT} fontWeight={600}>
            {s.label}
          </text>
          <text x={boxCx(i)} y={CY + 34} textAnchor="middle" dominantBaseline="middle" fill={ARROW} fontSize={22} fontFamily={FONT}>
            {s.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
