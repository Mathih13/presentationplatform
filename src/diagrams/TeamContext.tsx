import { motion, useTime, useTransform, type MotionValue } from 'motion/react';

// How context moves through a team — one geometry, three modes, so the talk's argument is a
// single picture that changes behaviour:
//
//   push    (Act 2) a ritual in the middle broadcasts on a fixed beat; dots fly out to everyone
//                   at once, and the person who wasn't there misses them
//   private (Act 3) each person feeds their own agent; the dots never leave their bubble
//   pull    (Act 4) one shared context in the middle; each agent reaches in when it needs to
//                   (a request ping) and context flows back out to it — on demand, not on a beat
//
// The particle layer only mounts while the slide is presented, and its clock starts then.

export type TeamMode = 'push' | 'private' | 'pull';

type Pt = { x: number; y: number };

const FONT = 'Open Sans, system-ui, sans-serif';
const FG = 'hsl(var(--foreground))';
const MUTED = 'hsl(var(--muted-foreground))';
const HUMAN = 'hsl(var(--chart-2))';
const AGENT = '#d97757';

const BUBBLE_R = 200;
const ORB_OFFSET = 170;
const PERSON_R = 40;
const ORB_R = 30;

const PEOPLE = [
  { label: 'Utvikler', x: 360, y: 340, side: 1 },
  { label: 'Produkteier', x: 1560, y: 340, side: -1 },
  { label: 'Fagperson', x: 360, y: 800, side: 1 },
  { label: 'Leder', x: 1560, y: 800, side: -1 },
];
const ABSENT = 1; // in push mode, the produkteier wasn't at the standup

const HUB: Pt = { x: 960, y: 560 };
const HUB_R = 110;
const SHARED = { x: 720, y: 450, w: 480, h: 220 };
const RITUALS = ['Standup', 'Retro', 'Sprint review'];

const TITLES: Record<TeamMode, string> = {
  push: 'Agile',
  private: 'Hver sin agent',
  pull: 'Agentisk samarbeid',
};

const orbOf = (p: (typeof PEOPLE)[number]): Pt => ({ x: p.x + p.side * ORB_OFFSET, y: p.y });
const anchorOf = (p: (typeof PEOPLE)[number]): Pt => ({
  x: p.side === 1 ? SHARED.x : SHARED.x + SHARED.w,
  y: p.y < 540 ? SHARED.y + 40 : SHARED.y + SHARED.h - 40,
});

// ── Particle maths (time in seconds) ────────────────────────────────────────────────────
const easeInOut = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
const lerp = (a: Pt, b: Pt, p: number): Pt => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
});
const towards = (from: Pt, to: Pt, inset: number): Pt => {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  return lerp(from, to, inset / d);
};
type Frame = { x: number; y: number; o: number };
const HIDDEN: Frame = { x: 0, y: 0, o: 0 };

/** A dot whose position and opacity are a pure function of the clock. */
function Dot({
  time,
  at,
  r,
  fill,
  stroke,
}: {
  time: MotionValue<number>;
  at: (s: number) => Frame;
  r: number;
  fill?: string;
  stroke?: string;
}) {
  const cx = useTransform(time, (ms) => at(ms / 1000).x);
  const cy = useTransform(time, (ms) => at(ms / 1000).y);
  const opacity = useTransform(time, (ms) => at(ms / 1000).o);
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      style={{ opacity }}
      fill={fill ?? 'none'}
      stroke={stroke}
      strokeWidth={stroke ? 4 : undefined}
    />
  );
}

// ── Push ────────────────────────────────────────────────────────────────────────────────
const BEAT = 3.4; // seconds between rituals
const FLIGHT = 1.4;

function PushLayer() {
  const time = useTime();
  const pulseR = useTransform(time, (ms) => HUB_R + (((ms / 1000) % BEAT) / 1.8) * 820);
  const pulseO = useTransform(time, (ms) => Math.max(0, 0.55 * (1 - ((ms / 1000) % BEAT) / 1.8)));
  return (
    <g>
      <motion.circle
        cx={HUB.x}
        cy={HUB.y}
        r={pulseR}
        fill="none"
        stroke={HUMAN}
        strokeWidth={4}
        style={{ opacity: pulseO }}
      />
      {PEOPLE.flatMap((person, pi) => {
        const from = towards(HUB, person, HUB_R);
        const to = towards(person, HUB, PERSON_R + 8);
        return [0, 1, 2, 3].map((k) => (
          <Dot
            key={`${pi}-${k}`}
            time={time}
            r={9}
            fill={HUMAN}
            at={(s) => {
              const p = ((s % BEAT) - k * 0.1) / FLIGHT;
              if (p < 0 || p > 1) return HIDDEN;
              const pos = lerp(from, to, easeInOut(p));
              // the absent person: the broadcast fizzles out before it reaches them
              const o = pi === ABSENT ? Math.max(0, 1 - p / 0.55) : 1;
              return { ...pos, o };
            }}
          />
        ));
      })}
    </g>
  );
}

function RitualLabels() {
  const time = useTime();
  return (
    <>
      {RITUALS.map((name, i) => (
        <RitualLabel key={name} name={name} index={i} time={time} />
      ))}
    </>
  );
}
function RitualLabel({
  name,
  index,
  time,
}: {
  name: string;
  index: number;
  time: MotionValue<number>;
}) {
  const opacity = useTransform(time, (ms) => {
    const s = ms / 1000;
    if (Math.floor(s / BEAT) % RITUALS.length !== index) return 0;
    const into = s % BEAT;
    return Math.min(1, into / 0.25, (BEAT - into) / 0.25);
  });
  return (
    <motion.text
      x={HUB.x}
      y={HUB.y + 12}
      textAnchor="middle"
      fill={FG}
      fontSize={32}
      fontFamily={FONT}
      fontWeight={700}
      style={{ opacity }}
    >
      {name}
    </motion.text>
  );
}

// ── Private ─────────────────────────────────────────────────────────────────────────────
function PrivateLayer() {
  const time = useTime();
  return (
    <g>
      {PEOPLE.flatMap((person, pi) => {
        const from = towards(person, orbOf(person), PERSON_R + 4);
        const to = towards(orbOf(person), person, ORB_R + 4);
        const period = 1.8 + pi * 0.25;
        return [0, 1, 2].map((k) => (
          <Dot
            key={`${pi}-${k}`}
            time={time}
            r={7}
            fill={AGENT}
            at={(s) => {
              const p = ((s + pi * 0.4 + (k * period) / 3) % period) / period;
              const pos = lerp(from, to, easeInOut(p));
              // a gentle arc so it reads as "telling", not a conveyor belt
              return { x: pos.x, y: pos.y - Math.sin(p * Math.PI) * 26, o: Math.sin(p * Math.PI) };
            }}
          />
        ));
      })}
    </g>
  );
}

// ── Pull ────────────────────────────────────────────────────────────────────────────────
const PING = 0.45; // request travels agent → shared context
const FLOW_AT = 0.6; // context starts flowing back
const pullCycle = (pi: number) => ({ period: 3.0 + pi * 0.55, offset: pi * 0.8 });
const phaseOf = (s: number, pi: number) => {
  const { period, offset } = pullCycle(pi);
  return (((s - offset) % period) + period) % period;
};

function PullLayer() {
  const time = useTime();
  // The shared context glows briefly whenever any request reaches it.
  const glow = useTransform(time, (ms) => {
    const s = ms / 1000;
    return PEOPLE.reduce((g, _, pi) => {
      const t = phaseOf(s, pi);
      return Math.max(g, t > PING && t < PING + 0.5 ? 1 - Math.abs(t - PING - 0.15) / 0.35 : 0);
    }, 0);
  });
  const glowWidth = useTransform(glow, (g) => 3 + g * 5);
  return (
    <g>
      <motion.rect
        x={SHARED.x}
        y={SHARED.y}
        width={SHARED.w}
        height={SHARED.h}
        rx={24}
        fill="none"
        stroke={AGENT}
        strokeWidth={glowWidth}
      />
      {PEOPLE.flatMap((person, pi) => {
        const orb = towards(orbOf(person), anchorOf(person), ORB_R + 6);
        const anchor = anchorOf(person);
        const ping = (
          <Dot
            key={`ping-${pi}`}
            time={time}
            r={11}
            stroke={AGENT}
            at={(s) => {
              const t = phaseOf(s, pi);
              if (t > PING) return HIDDEN;
              return { ...lerp(orb, anchor, easeInOut(t / PING)), o: 1 };
            }}
          />
        );
        const flow = [0, 1, 2, 3].map((k) => (
          <Dot
            key={`flow-${pi}-${k}`}
            time={time}
            r={8}
            fill={AGENT}
            at={(s) => {
              const p = (phaseOf(s, pi) - FLOW_AT - k * 0.12) / 0.8;
              if (p < 0 || p > 1) return HIDDEN;
              return { ...lerp(anchor, orb, easeInOut(p)), o: 1 };
            }}
          />
        ));
        return [ping, ...flow];
      })}
    </g>
  );
}

// Each agent swells a touch as context lands in it.
function AgentOrb({
  person,
  pi,
  pulling,
}: {
  person: (typeof PEOPLE)[number];
  pi: number;
  pulling: boolean;
}) {
  const time = useTime();
  const scale = useTransform(time, (ms) => {
    if (!pulling) return 1;
    const t = phaseOf(ms / 1000, pi);
    const landing = FLOW_AT + 0.8;
    return t > landing && t < landing + 0.6
      ? 1 + 0.14 * Math.sin(((t - landing) / 0.6) * Math.PI)
      : 1;
  });
  const orb = orbOf(person);
  return (
    <motion.circle
      cx={orb.x}
      cy={orb.y}
      r={ORB_R}
      fill={AGENT}
      style={{ scale, originX: 0.5, originY: 0.5 }}
    />
  );
}

// ── The diagram ─────────────────────────────────────────────────────────────────────────

export function TeamContext({ mode, active }: { mode: TeamMode; active: boolean }) {
  const withAgent = mode !== 'push';
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
        fontSize={52}
        fontFamily={FONT}
        fontWeight={700}
      >
        {TITLES[mode]}
      </text>

      {/* the centre: a ritual (push) or the shared context (pull) */}
      {mode === 'push' && (
        <g>
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={HUB_R}
            fill={HUMAN}
            fillOpacity={0.14}
            stroke={HUMAN}
            strokeWidth={3}
          />
          {active ? (
            <RitualLabels />
          ) : (
            <text
              x={HUB.x}
              y={HUB.y + 12}
              textAnchor="middle"
              fill={FG}
              fontSize={32}
              fontFamily={FONT}
              fontWeight={700}
            >
              {RITUALS[0]}
            </text>
          )}
        </g>
      )}
      {mode === 'pull' && (
        <g>
          {PEOPLE.map((p) => {
            const orb = orbOf(p);
            const a = anchorOf(p);
            return (
              <line
                key={p.label}
                x1={orb.x}
                y1={orb.y}
                x2={a.x}
                y2={a.y}
                stroke={AGENT}
                strokeWidth={3}
                opacity={0.35}
              />
            );
          })}
          <rect
            x={SHARED.x}
            y={SHARED.y}
            width={SHARED.w}
            height={SHARED.h}
            rx={24}
            fill={AGENT}
            fillOpacity={0.14}
            stroke={AGENT}
            strokeWidth={3}
          />
          <text
            x={960}
            y={SHARED.y + SHARED.h / 2 + 12}
            textAnchor="middle"
            fill={FG}
            fontSize={36}
            fontFamily={FONT}
            fontWeight={700}
          >
            Teamets kontekst
          </text>
        </g>
      )}

      {PEOPLE.map((p, pi) => {
        const orb = orbOf(p);
        const absent = mode === 'push' && pi === ABSENT;
        return (
          <g key={p.label} opacity={absent ? 0.35 : 1}>
            {withAgent && (
              <circle
                cx={(p.x + orb.x) / 2}
                cy={p.y}
                r={BUBBLE_R}
                fill={MUTED}
                fillOpacity={mode === 'pull' ? 0.02 : 0.06}
                stroke={MUTED}
                strokeWidth={3}
                strokeDasharray="12 10"
                opacity={mode === 'pull' ? 0.35 : 1}
              />
            )}
            <circle cx={p.x} cy={p.y} r={PERSON_R} fill={HUMAN} />
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
            {absent && (
              <text
                x={p.x}
                y={p.y + 114}
                textAnchor="middle"
                fill={MUTED}
                fontSize={22}
                fontFamily={FONT}
              >
                ikke til stede
              </text>
            )}
            {withAgent && (
              <>
                {active ? (
                  <AgentOrb person={p} pi={pi} pulling={mode === 'pull'} />
                ) : (
                  <circle cx={orb.x} cy={orb.y} r={ORB_R} fill={AGENT} />
                )}
                <text
                  x={orb.x}
                  y={p.y + 64}
                  textAnchor="middle"
                  fill={MUTED}
                  fontSize={22}
                  fontFamily={FONT}
                >
                  Agent
                </text>
              </>
            )}
          </g>
        );
      })}

      {active && mode === 'push' && <PushLayer />}
      {active && mode === 'private' && <PrivateLayer />}
      {active && mode === 'pull' && <PullLayer />}
    </svg>
  );
}
