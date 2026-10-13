import { createContext, useContext, useId, type ReactNode } from 'react';
import { motion, useTime, useTransform, type MotionValue } from 'motion/react';
import { RINGS } from './contextRings';
import { pivot } from './pivot';
import { PivotSpace } from './PivotSpace';

// The context rings as one living diagram, replacing the static Excalidraw exports:
//
//   people → who holds each ring; a ring lights up as its row of people is revealed
//   drift  → every ring turns at its own speed and direction (code fast, industry barely),
//            so "ulik fart, ulik retning" is something the room watches happen
//   agent  → what an AI agent sees, held still: the two inner rings, the domain faded, and the
//            outer rings greyed out — the agent barely sees them
//
// The SVG is square and centred on the rings, so a slide can place it anywhere and reveal's
// auto-animate can move it between slides.

export type RingsMode = 'people' | 'drift' | 'agent';

const INK = '#1e1e1e';
const GREY = '#e5e9f0';
const AGENT = '#d97757';
const FONT = 'Open Sans, system-ui, sans-serif';
const SEEN_BY_AGENT = 2; // Kode + Team

const innerOf = (i: number) => (i === 0 ? 0 : RINGS[i - 1]!.r);
const midOf = (i: number) => (i === 0 ? 66 : (RINGS[i]!.r + innerOf(i)) / 2);
const angleAt = (i: number, s: number) => (RINGS[i]!.dir * 360 * s) / RINGS[i]!.period;
// Unique per diagram instance: the rings appear on several slides, and textPath ids must not clash.
const IdPrefix = createContext('rings');
const circlePath = (m: number) => `M 0 ${-m} A ${m} ${m} 0 1 1 0 ${m} A ${m} ${m} 0 1 1 0 ${-m}`;

// Label riding on the ring band, plus two chevrons showing which way it turns.
function BandMarks({ i }: { i: number }) {
  const ring = RINGS[i]!;
  const m = midOf(i);
  const id = `${useContext(IdPrefix)}-label-${i}`;
  return (
    <g>
      <path id={id} d={circlePath(m)} fill="none" />
      <text
        fill={INK}
        fontSize={i === 0 ? 30 : 28}
        fontFamily={FONT}
        fontWeight={600}
        letterSpacing={1}
      >
        <textPath href={`#${id}`} startOffset="2%">
          {ring.name}
        </textPath>
      </text>
      {[150, 330].map((deg) => (
        <path
          key={deg}
          d="M -9 -7 L 0 7 L 9 -7"
          transform={`rotate(${deg}) translate(${m} 0) scale(1 ${ring.dir})`}
          fill="none"
          stroke={INK}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.75}
        />
      ))}
    </g>
  );
}

function Turning({ rotate, children }: { rotate: MotionValue<number>; children: ReactNode }) {
  return <motion.g style={{ rotate, ...pivot({ x: 0, y: 0 }) }}>{children}</motion.g>;
}

function LiveRing({ i, time }: { i: number; time: MotionValue<number> }) {
  const rotate = useTransform(time, (ms) => angleAt(i, ms / 1000));
  return (
    <Turning rotate={rotate}>
      <BandMarks i={i} />
    </Turning>
  );
}

function Moving() {
  const time = useTime();
  return (
    <>
      {RINGS.map((_, i) => (
        <LiveRing key={i} i={i} time={time} />
      ))}
    </>
  );
}

export function LivingRings({
  mode,
  active,
  revealed = RINGS.length,
}: {
  mode: RingsMode;
  active: boolean;
  revealed?: number;
}) {
  const prefix = useId().replace(/:/g, '');
  const outer = RINGS[RINGS.length - 1]!.r;
  const greyed = (i: number) => mode === 'agent' && i >= SEEN_BY_AGENT + 1;
  return (
    <svg
      viewBox={`${-outer - 8} ${-outer - 8} ${2 * outer + 16} ${2 * outer + 16}`}
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full overflow-visible"
    >
      <IdPrefix.Provider value={prefix}>
        <PivotSpace>
          {/* ring bands, outside-in */}
          {[...RINGS].reverse().map((ring) => {
            const i = RINGS.indexOf(ring);
            const lit = mode === 'people' && i === revealed - 1;
            return (
              <motion.circle
                key={ring.name}
                r={ring.r}
                fill={greyed(i) ? GREY : ring.fill}
                stroke={INK}
                initial={false}
                animate={{
                  strokeWidth: lit ? [3, 12, 3] : 3,
                  opacity: mode === 'agent' && i === SEEN_BY_AGENT ? 0.7 : 1,
                }}
                transition={{ duration: lit ? 0.9 : 0.3, ease: 'easeOut' }}
              />
            );
          })}

          {/* labels: horizontal and still for "who holds it"; riding the bands, turning only in drift */}
          {mode !== 'drift' || !active ? (
            RINGS.map((ring, i) =>
              mode === 'people' ? (
                <text
                  key={ring.name}
                  x={0}
                  y={i === 0 ? 10 : -midOf(i) + 10}
                  textAnchor="middle"
                  fill={INK}
                  fontSize={32}
                  fontFamily={FONT}
                >
                  {ring.name}
                </text>
              ) : (
                <BandMarks key={ring.name} i={i} />
              )
            )
          ) : (
            <Moving />
          )}

          {/* the agent, in the middle of what it can see */}
          {mode === 'agent' && (
            <g>
              <circle cx={0} cy={-56} r={30} fill={AGENT} stroke={INK} strokeWidth={3} />
              <text
                x={0}
                y={-48}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={20}
                fontFamily={FONT}
                fontWeight={700}
              >
                Agent
              </text>
            </g>
          )}
        </PivotSpace>
      </IdPrefix.Provider>
    </svg>
  );
}

// The "who holds it" column for the people slide; rows slide in as they're revealed.
export function RingsLegend({ revealed }: { revealed: number }) {
  return (
    <div className="flex flex-col gap-10 text-left">
      <h2 className="text-primary-foreground mb-4 text-6xl font-bold">Hvem holder ringen?</h2>
      {RINGS.map((ring, i) => (
        <motion.div
          key={ring.name}
          className="flex items-start gap-6"
          initial={false}
          animate={i < revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        >
          <span
            className="mt-2 inline-block h-9 w-9 shrink-0 rounded-full border-2 border-black"
            style={{ background: ring.fill }}
          />
          <div>
            <p className="text-primary-foreground text-4xl font-semibold">{ring.name}</p>
            <p className="text-secondary-foreground text-3xl">{ring.who}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
