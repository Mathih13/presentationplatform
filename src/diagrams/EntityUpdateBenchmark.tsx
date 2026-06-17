import { Diagram } from '../deck/Diagram';

const VIEW_W = 1920;
const VIEW_H = 1000;

// Plot area
const PLOT_L = 250;
const PLOT_R = 1850;
const PLOT_W = PLOT_R - PLOT_L;

const PLOT_TOP = 130;
const PLOT_BOTTOM = 810;

const MAX_SEC = 3.3;
const PX_PER_SEC = PLOT_W / MAX_SEC;

const BAR_H = 150;

const TICKS = [0, 1, 2, 3];

interface Bench {
  label: string;
  seconds: number;
  display: string;
  color: string;
}

const DATA: Bench[] = [
  { label: 'POSTGRES', seconds: 3.05, display: '', color: 'hsl(var(--foreground) / 0.45)' },
  { label: 'SQLITE', seconds: 1.35, display: '', color: 'hsl(var(--foreground) / 0.7)' },
  { label: 'SPACETIMEDB', seconds: 0.6, display: '600 ms', color: 'hsl(var(--primary))' },
];

function secToX(sec: number) {
  return PLOT_L + sec * PX_PER_SEC;
}

export function EntityUpdateBenchmark() {
  const rowCenter = (i: number) => {
    const span = PLOT_BOTTOM - PLOT_TOP;
    const step = span / DATA.length;
    return PLOT_TOP + step * (i + 0.5);
  };

  return (
    <Diagram viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mx-auto h-[80vh] w-full">
      {/* Vertical gridlines */}
      {TICKS.map((t) => (
        <line
          key={`grid-${t}`}
          x1={secToX(t)}
          y1={PLOT_TOP - 20}
          x2={secToX(t)}
          y2={PLOT_BOTTOM + 20}
          stroke="hsl(var(--foreground) / 0.12)"
          strokeWidth={2}
        />
      ))}

      {/* Bars */}
      {DATA.map((d, i) => {
        const cy = rowCenter(i);
        const barW = d.seconds * PX_PER_SEC;
        return (
          <g key={d.label}>
            <rect
              x={PLOT_L}
              y={cy - BAR_H / 2}
              width={barW}
              height={BAR_H}
              rx={14}
              fill={d.color}
            />
            {/* Row label */}
            <text
              x={PLOT_L - 30}
              y={cy + 9}
              textAnchor="end"
              fill={d.color}
              fontSize={28}
              fontWeight={700}
              letterSpacing={2}
              fontFamily="JetBrains Mono, ui-monospace, monospace"
            >
              {d.label}
            </text>
            {/* Value label */}
            <text
              x={PLOT_L + barW + 28}
              y={cy + 12}
              textAnchor="start"
              fill={d.color}
              fontSize={34}
              fontWeight={700}
              fontFamily="JetBrains Mono, ui-monospace, monospace"
            >
              {d.display}
            </text>
          </g>
        );
      })}

      {/* X axis tick labels */}
      {TICKS.map((t) => (
        <text
          key={`tick-${t}`}
          x={secToX(t)}
          y={PLOT_BOTTOM + 70}
          textAnchor="middle"
          fill="hsl(var(--foreground) / 0.55)"
          fontSize={26}
          fontFamily="JetBrains Mono, ui-monospace, monospace"
        >
          {t}
        </text>
      ))}

      {/* Axis caption */}
      <text
        x={PLOT_L}
        y={PLOT_BOTTOM + 130}
        textAnchor="start"
        fill="hsl(var(--foreground) / 0.45)"
        fontSize={24}
        letterSpacing={4}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        SECONDS
      </text>
    </Diagram>
  );
}
