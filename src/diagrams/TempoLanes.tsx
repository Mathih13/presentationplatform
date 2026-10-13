import { motion, useTime, useTransform, type MotionValue } from 'motion/react';

// "Ritualene går i menneskefart. Agentene gjør ikke det." — two lanes sliding past a "nå" line
// at the same speed. The ritual lane carries a big beat every few seconds; the agent lane
// carries a dense stream of small pieces of work. The mismatch is the point: by the time the
// next standup reaches "nå", dozens of changes have already gone by.

const FONT = 'Open Sans, system-ui, sans-serif';
const FG = 'hsl(var(--foreground))';
const MUTED = 'hsl(var(--muted-foreground))';
const HUMAN = 'hsl(var(--chart-2))';
const AGENT = '#d97757';

const LEFT = 320;
const RIGHT = 1840;
const NOW_X = 1260;
const SPEED = 120; // px per second, both lanes

const RITUAL_Y = 130;
const AGENT_Y = 330;
const RITUAL_GAP = 620;
const TICK_GAP = 26;

const RITUAL_NAMES = ['Standup', 'Retro', 'Standup', 'Review'];

const laneX = (s: number, i: number, gap: number, count: number) => {
  const span = gap * count;
  return RIGHT - ((s * SPEED + i * gap) % span);
};
const edgeFade = (x: number) => Math.max(0, Math.min(1, (x - LEFT) / 80, (RIGHT - x) / 80));

function Ritual({ time, index }: { time: MotionValue<number>; index: number }) {
  const count = RITUAL_NAMES.length;
  const x = useTransform(time, (ms) => laneX(ms / 1000, index, RITUAL_GAP, count));
  const opacity = useTransform(x, edgeFade);
  // a ring pulses out as the ritual passes "nå"
  const ringR = useTransform(x, (v) =>
    v < NOW_X && v > NOW_X - 140 ? 34 + (NOW_X - v) * 0.7 : 34
  );
  const ringO = useTransform(x, (v) =>
    v < NOW_X && v > NOW_X - 140 ? 0.7 * (1 - (NOW_X - v) / 140) : 0
  );
  return (
    <motion.g style={{ opacity }}>
      <motion.circle
        cx={x}
        cy={RITUAL_Y}
        r={ringR}
        fill="none"
        stroke={HUMAN}
        strokeWidth={4}
        style={{ opacity: ringO }}
      />
      <motion.circle cx={x} cy={RITUAL_Y} r={34} fill={HUMAN} />
      <motion.text
        x={x}
        y={RITUAL_Y + 74}
        textAnchor="middle"
        fill={FG}
        fontSize={26}
        fontFamily={FONT}
        fontWeight={600}
      >
        {RITUAL_NAMES[index]}
      </motion.text>
    </motion.g>
  );
}

function Tick({ time, index, count }: { time: MotionValue<number>; index: number; count: number }) {
  const x = useTransform(time, (ms) => laneX(ms / 1000, index, TICK_GAP, count));
  const opacity = useTransform(x, (v) => edgeFade(v) * (Math.abs(v - NOW_X) < 14 ? 1 : 0.75));
  const height = 22 + ((index * 37) % 5) * 9; // uneven sizes: small and larger changes
  const y = useTransform(x, (v) => AGENT_Y - height / 2 - (Math.abs(v - NOW_X) < 14 ? 6 : 0));
  return (
    <motion.rect x={x} y={y} width={10} height={height} rx={3} fill={AGENT} style={{ opacity }} />
  );
}

export function TempoLanes({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 1920 460" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {/* lanes */}
      <line
        x1={LEFT}
        y1={RITUAL_Y}
        x2={RIGHT}
        y2={RITUAL_Y}
        stroke={MUTED}
        strokeWidth={2}
        opacity={0.4}
      />
      <line
        x1={LEFT}
        y1={AGENT_Y}
        x2={RIGHT}
        y2={AGENT_Y}
        stroke={MUTED}
        strokeWidth={2}
        opacity={0.4}
      />
      <text
        x={LEFT - 40}
        y={RITUAL_Y + 12}
        textAnchor="end"
        fill={FG}
        fontSize={34}
        fontFamily={FONT}
        fontWeight={600}
      >
        Ritualer
      </text>
      <text
        x={LEFT - 40}
        y={AGENT_Y + 12}
        textAnchor="end"
        fill={FG}
        fontSize={34}
        fontFamily={FONT}
        fontWeight={600}
      >
        Agent
      </text>

      {/* "nå" */}
      <line
        x1={NOW_X}
        y1={50}
        x2={NOW_X}
        y2={410}
        stroke={FG}
        strokeWidth={2}
        strokeDasharray="8 8"
        opacity={0.6}
      />
      <text x={NOW_X} y={444} textAnchor="middle" fill={MUTED} fontSize={26} fontFamily={FONT}>
        nå
      </text>

      {active ? <Lanes /> : null}
    </svg>
  );
}

function Lanes() {
  const time = useTime();
  const tickCount = Math.ceil((RIGHT - LEFT) / TICK_GAP) + 2;
  return (
    <>
      {RITUAL_NAMES.map((_, i) => (
        <Ritual key={i} time={time} index={i} />
      ))}
      {Array.from({ length: tickCount }, (_, i) => (
        <Tick key={i} time={time} index={i} count={tickCount} />
      ))}
    </>
  );
}
