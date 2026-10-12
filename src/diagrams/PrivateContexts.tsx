// "Hver sin Claude" vs "felles kontekst". Four roles, each with their own Claude inside a
// dashed bubble: the private context that Claude only knows because that one person told it.
// Shared (shared=true), every Claude also reads from one explicit context in the middle and
// the private bubbles fade. Both states share geometry so the Act 4 slide reads as the
// Act 3 slide, fixed.

const FONT = 'Open Sans, system-ui, sans-serif';
const FG = 'hsl(var(--foreground))';
const MUTED = 'hsl(var(--muted-foreground))';
const HUMAN = 'hsl(var(--chart-2))';
const CLAUDE = '#d97757';

const BUBBLE_R = 200;
const ORB_OFFSET = 170;

const PEOPLE = [
  { label: 'Utvikler', x: 360, y: 340, side: 1 },
  { label: 'Produkteier', x: 1560, y: 340, side: -1 },
  { label: 'Fagperson', x: 360, y: 800, side: 1 },
  { label: 'Leder', x: 1560, y: 800, side: -1 },
];

const SHARED = { x: 720, y: 450, w: 480, h: 220 };

export function PrivateContexts({ shared }: { shared: boolean }) {
  return (
    <svg
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      <text
        x={960}
        y={100}
        textAnchor="middle"
        fill={FG}
        fontSize={56}
        fontFamily={FONT}
        fontWeight={700}
      >
        {shared ? 'Felles kontekst' : 'Hver sin Claude'}
      </text>

      {/* links from each Claude into the shared context, drawn first so they pass beneath */}
      {shared &&
        PEOPLE.map((p) => {
          const ox = p.x + p.side * ORB_OFFSET;
          const tx = p.side === 1 ? SHARED.x : SHARED.x + SHARED.w;
          const ty = p.y < 540 ? SHARED.y + 40 : SHARED.y + SHARED.h - 40;
          return (
            <line
              key={p.label}
              x1={ox}
              y1={p.y}
              x2={tx}
              y2={ty}
              stroke={CLAUDE}
              strokeWidth={3}
              opacity={0.6}
            />
          );
        })}

      {PEOPLE.map((p) => {
        const ox = p.x + p.side * ORB_OFFSET;
        return (
          <g key={p.label}>
            {/* private context: what this one Claude has been told */}
            <circle
              cx={(p.x + ox) / 2}
              cy={p.y}
              r={BUBBLE_R}
              fill={MUTED}
              fillOpacity={shared ? 0.02 : 0.06}
              stroke={MUTED}
              strokeWidth={3}
              strokeDasharray="12 10"
              opacity={shared ? 0.35 : 1}
            />
            <circle cx={p.x} cy={p.y} r={40} fill={HUMAN} />
            <text
              x={p.x}
              y={p.y + 80}
              textAnchor="middle"
              fill={FG}
              fontSize={30}
              fontFamily={FONT}
              fontWeight={600}
            >
              {p.label}
            </text>
            <circle cx={ox} cy={p.y} r={30} fill={CLAUDE} />
            <text
              x={ox}
              y={p.y + 64}
              textAnchor="middle"
              fill={MUTED}
              fontSize={22}
              fontFamily={FONT}
            >
              Claude
            </text>
          </g>
        );
      })}

      {shared && (
        <g>
          <rect
            x={SHARED.x}
            y={SHARED.y}
            width={SHARED.w}
            height={SHARED.h}
            rx={24}
            fill={CLAUDE}
            fillOpacity={0.14}
            stroke={CLAUDE}
            strokeWidth={3}
          />
          <text
            x={960}
            y={SHARED.y + 90}
            textAnchor="middle"
            fill={FG}
            fontSize={36}
            fontFamily={FONT}
            fontWeight={700}
          >
            Teamets kontekst
          </text>
          <text
            x={960}
            y={SHARED.y + 140}
            textAnchor="middle"
            fill={MUTED}
            fontSize={24}
            fontFamily={FONT}
          >
            regler · beslutninger · fagkunnskap
          </text>
          <text
            x={960}
            y={SHARED.y + 174}
            textAnchor="middle"
            fill={MUTED}
            fontSize={24}
            fontFamily={FONT}
          >
            eid og beskåret av alle
          </text>
        </g>
      )}
    </svg>
  );
}
