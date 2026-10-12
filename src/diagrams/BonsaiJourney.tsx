import { useState } from 'react';
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from 'motion/react';

// A camera journey through an illustrated bonsai — the garden payoff.
//
//   roots    → inside a cutaway pot: roots grow through the soil as the camera drifts along them
//   trunk    → the camera rises up the trunk while it grows; branches extend, foliage puffs pop
//              in on springs, one wild, overgrown branch sprouts, and the tree gives a "boing"
//   prune    → the camera settles on the wild branch; scissors snip it and it falls away
//   overview → the camera pulls back to the whole tree, which dims into the background
//
// The world is far larger than the screen; the camera is the SVG viewBox. Forward steps play
// their choreography; anything else snaps to the step's final state.

export type JourneyStep = 'roots' | 'trunk' | 'prune' | 'overview';
type Stage = 'dark' | JourneyStep; // 'dark' = the slide hasn't been presented yet

const ORDER: Stage[] = ['dark', 'roots', 'trunk', 'prune', 'overview'];
const rank = (s: Stage) => ORDER.indexOf(s);

type Pt = { x: number; y: number };

const BARK = '#8c6b52';
const BARK_LIGHT = '#a8876b';
const ROOT = '#7a5c45';
const LEAF_DARK = '#7f9a68';
const LEAF = '#a3be8c';
const SHOOT = '#b8d39c';
const MOSS = '#8fa876';
const POT = '#a0735a';
const POT_DARK = '#7d5844';
const SOIL = '#3b4252';
const SOIL_GRAIN = '#2e3440';
const STEEL = '#e5e9f0';
const HANDLE = '#bf616a';

// ── Camera ──────────────────────────────────────────────────────────────────────────────
// Views are 16:9; the subject sits right of centre so the text column stays clear.
type View = { x: number; y: number; w: number };
const VIEWS: Record<Stage, View> = {
  dark: { x: 232, y: 1020, w: 820 },
  roots: { x: 292, y: 1020, w: 820 },
  trunk: { x: -55, y: 360, w: 1400 },
  prune: { x: 492, y: 350, w: 820 },
  overview: { x: -270, y: 335, w: 1867 },
};
const viewBox = ({ x, y, w }: View) => `${x} ${y} ${w} ${(w * 9) / 16}`;
const GLIDE: [number, number, number, number] = [0.65, 0, 0.35, 1];

// ── The world (coordinates in world units) ──────────────────────────────────────────────
const TRUNK_BASE: Pt = { x: 799, y: 1186 };

// Cutaway pot: terracotta shell, soil inside, rim cut away at the front.
const POT_SHELL = 'M486 1190 L1114 1190 L1074 1316 L526 1316 Z';
const POT_SOIL = 'M502 1190 L1098 1190 L1060 1300 L540 1300 Z';
const SOIL_GRAINS = [
  { x: 560, y: 1214, r: 4 },
  { x: 640, y: 1276, r: 3 },
  { x: 700, y: 1206, r: 3 },
  { x: 770, y: 1290, r: 4 },
  { x: 880, y: 1222, r: 3 },
  { x: 960, y: 1284, r: 4 },
  { x: 1030, y: 1210, r: 3 },
  { x: 600, y: 1248, r: 2 },
  { x: 1000, y: 1250, r: 2 },
  { x: 850, y: 1270, r: 3 },
];
const MOSS_DOTS = [
  { x: 640, y: 1188, r: 9 },
  { x: 668, y: 1186, r: 6 },
  { x: 930, y: 1188, r: 10 },
  { x: 958, y: 1186, r: 6 },
  { x: 990, y: 1188, r: 7 },
];

const ROOTS = [
  { d: 'M770 1192 C 740 1212, 680 1226, 610 1250 C 580 1260, 562 1274, 550 1288', w: 13 },
  { d: 'M790 1194 C 780 1222, 762 1256, 734 1290', w: 11 },
  { d: 'M812 1194 C 832 1218, 872 1240, 930 1258 C 980 1272, 1008 1280, 1036 1290', w: 13 },
  { d: 'M830 1192 C 870 1202, 940 1206, 1010 1218 C 1036 1224, 1054 1234, 1066 1246', w: 11 },
  { d: 'M800 1196 C 805 1232, 813 1262, 818 1292', w: 10 },
];
const ROOTLETS = [
  'M640 1243 C 625 1262, 616 1278, 613 1292',
  'M700 1230 C 690 1218, 672 1212, 654 1208',
  'M900 1252 C 905 1270, 900 1282, 894 1294',
  'M975 1212 C 985 1230, 998 1244, 1004 1260',
  'M745 1270 C 722 1278, 704 1286, 694 1294',
  'M572 1264 C 562 1260, 552 1260, 544 1262',
];

// Trunk as tapered stroke segments along its centreline; round caps hide the joins.
const TRUNK = [
  { d: 'M799 1186 C 750 1100, 900 1000, 828 900', w: 88, at: 0.15, dur: 0.9 },
  { d: 'M828 900 C 780 830, 830 765, 805 640', w: 58, at: 0.85, dur: 0.7 },
  { d: 'M805 640 C 797 600, 799 570, 800 536', w: 32, at: 1.35, dur: 0.4 },
];
const NEBARI = [
  'M799 1182 C 770 1186, 740 1190, 712 1194',
  'M799 1182 C 828 1186, 858 1190, 886 1194',
];
const BARK_STREAK = 'M782 1150 C 748 1080, 868 1004, 818 922';
const BRANCHES = [
  { d: 'M785 930 C 720 910, 640 900, 560 870', w: 22, at: 0.9 },
  { d: 'M860 860 C 940 840, 1010 830, 1070 800', w: 20, at: 1.05 },
  { d: 'M790 740 C 730 720, 680 700, 620 672', w: 16, at: 1.25 },
  { d: 'M800 545 C 801 530, 800 520, 800 500', w: 24, at: 1.5 },
];

// Foliage pads: clusters of puffs, dark layer behind a light one.
const PAD_BLOBS = [
  { x: 0, y: -12, r: 46 },
  { x: -52, y: 10, r: 38 },
  { x: 52, y: 8, r: 38 },
  { x: -22, y: 24, r: 34 },
  { x: 28, y: 24, r: 34 },
];
const PADS = [
  { x: 520, y: 846, s: 1.25, at: 1.4 },
  { x: 1120, y: 784, s: 1.3, at: 1.6 },
  { x: 590, y: 646, s: 1.0, at: 1.8 },
  { x: 800, y: 462, s: 1.55, at: 2.0 },
];
const PUFF_STAGGER = 0.06;

// The wild, overgrown branch the team prunes.
const CUT: Pt = { x: 880, y: 652 };
const WILD = {
  limb: 'M832 680 C 900 640, 980 600, 1060 560 C 1120 530, 1180 480, 1240 420',
  shoots: ['M1100 540 C 1130 500, 1150 470, 1160 436', 'M1180 485 C 1220 470, 1258 470, 1296 480'],
  tufts: [
    { x: 1244, y: 414, s: 0.9 },
    { x: 1160, y: 430, s: 0.6 },
    { x: 1302, y: 476, s: 0.55 },
  ],
};
const WILD_AT = 2.4;
const TREE_BOING_AT = 3.4;

// ── Timing helpers ──────────────────────────────────────────────────────────────────────
const SNAP: Transition = { duration: 0 };
const grow = (delay: number, duration = 0.9): Transition => ({
  pathLength: { delay, duration, ease: [0.3, 0.7, 0.4, 1] },
  opacity: { delay, duration: 0.01 },
});
const grown = (on: boolean): TargetAndTransition => ({
  pathLength: on ? 1 : 0,
  opacity: on ? 1 : 0,
});
// Mismatched X/Y springs give each puff a hint of squash & stretch. Both are well damped
// (X ≈ 0.73, Y ≈ 0.57 of critical) so they settle with a single soft overshoot, not a wobble.
const squashSpring = (delay: number): Transition => ({
  scaleX: { type: 'spring', stiffness: 120, damping: 16, delay },
  scaleY: { type: 'spring', stiffness: 170, damping: 15, delay },
});
const popSpring = (delay: number): Transition => ({
  type: 'spring',
  stiffness: 260,
  damping: 26,
  delay,
});
const pivot = (p: Pt) => ({
  transformBox: 'view-box' as const,
  transformOrigin: `${p.x}px ${p.y}px`,
});

const TREE_BOING: TargetAndTransition = {
  scaleX: [1, 1, 1.015, 0.994, 1.002, 1],
  scaleY: [1, 1, 0.98, 1.012, 0.998, 1],
  transition: {
    duration: TREE_BOING_AT + 0.8,
    times: [
      0,
      TREE_BOING_AT,
      TREE_BOING_AT + 0.24,
      TREE_BOING_AT + 0.48,
      TREE_BOING_AT + 0.66,
      TREE_BOING_AT + 0.8,
    ].map((t) => t / (TREE_BOING_AT + 0.8)),
    ease: 'easeInOut',
  },
};
const AT_REST: TargetAndTransition = { scaleX: 1, scaleY: 1, transition: SNAP };

// ── Pieces ──────────────────────────────────────────────────────────────────────────────

function Puffs({ on, delay, playing }: { on: boolean; delay: number; playing: boolean }) {
  return (
    <motion.g
      style={{ originX: 0.5, originY: 1 }}
      initial={false}
      animate={{ scaleX: on ? 1 : 0, scaleY: on ? 1 : 0 }}
      transition={playing ? squashSpring(delay) : SNAP}
    >
      {PAD_BLOBS.map((b, j) => (
        <motion.g
          key={`${b.x}${b.y}`}
          initial={false}
          animate={{ scale: on ? 1 : 0 }}
          transition={playing ? popSpring(delay + j * PUFF_STAGGER) : SNAP}
        >
          <circle cx={b.x} cy={b.y + 8} r={b.r} fill={LEAF_DARK} />
          <circle cx={b.x} cy={b.y} r={b.r - 6} fill={LEAF} />
        </motion.g>
      ))}
    </motion.g>
  );
}

// Pruning timeline (seconds from the prune click). The camera lands at ~2.3s; the scissors
// appear, open, ease in to the branch, pause, then close in one decisive snip.
const SCISSORS_AT = 2.1;
const SCISSORS_DUR = 2.4;
// Phase marks as fractions of SCISSORS_DUR: appear, open, approach, hold, snip, linger, leave.
const PHASES = [0, 0.15, 0.35, 0.6, 0.7, 0.76, 0.9, 1];
const SNIP_AT = SCISSORS_AT + 0.76 * SCISSORS_DUR;
const FALL_AT = SNIP_AT + 0.35; // let the snip register before the branch goes

// Scissors, pivot at the origin, blades pointing along -x (towards the cut).
function Scissors() {
  const dir = Math.atan2(560 - CUT.y, 1060 - CUT.x);
  const p = {
    x: CUT.x + Math.cos(dir + Math.PI / 2) * 58,
    y: CUT.y + Math.sin(dir + Math.PI / 2) * 58,
  };
  const angle = (dir * 180) / Math.PI + 90;
  const timing: Transition = {
    duration: SCISSORS_DUR,
    times: PHASES,
    ease: 'easeInOut',
    delay: SCISSORS_AT,
  };
  const blade = (sign: 1 | -1) => (
    <motion.g
      style={pivot({ x: 0, y: 0 })}
      initial={{ rotate: -22 * sign }}
      animate={{ rotate: [-22, -22, -32, -32, -32, 0, 0, 0].map((v) => v * sign) }}
      transition={timing}
    >
      <g transform={`scale(1 ${sign})`}>
        <path d="M2 -5 L-62 -3 Q-68 0 -62 1 L2 4 Z" fill={STEEL} />
        <path d="M0 0 L16 -10" stroke={STEEL} strokeWidth={5} strokeLinecap="round" />
        <circle cx={26} cy={-14} r={11} fill="none" stroke={HANDLE} strokeWidth={6} />
      </g>
    </motion.g>
  );
  return (
    <>
      <g transform={`translate(${p.x} ${p.y}) rotate(${angle})`}>
        <motion.g
          style={pivot({ x: 0, y: 0 })}
          initial={{ scale: 0, rotate: -20, x: 44, opacity: 0 }}
          animate={{
            scale: [0, 1, 1, 1, 1, 1, 1, 0.85],
            rotate: [-20, 0, 0, 0, 0, 0, 0, 10],
            x: [44, 44, 44, 0, 0, 0, 0, 26],
            opacity: [0, 1, 1, 1, 1, 1, 1, 0],
          }}
          transition={timing}
        >
          {blade(1)}
          {blade(-1)}
          <circle r={4} fill={SOIL} />
        </motion.g>
      </g>
      <motion.circle
        cx={CUT.x}
        cy={CUT.y}
        r={22}
        fill="none"
        stroke="#eceff4"
        strokeWidth={5}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 2], opacity: [1, 0] }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: SNIP_AT }}
      />
    </>
  );
}

// Exit: once cut, the branch sags at the cut for a beat, then drops out of frame.
const wildExit = (falling: boolean): TargetAndTransition =>
  falling
    ? {
        y: [0, 8, 620],
        x: [0, 0, 60],
        rotate: [0, 7, 40],
        opacity: [1, 1, 0],
        transition: {
          duration: 2.2,
          times: [0, 0.25, 1],
          ease: ['easeInOut', [0.5, 0, 0.9, 0.5]],
          delay: FALL_AT,
        },
      }
    : { opacity: 0, transition: SNAP };

// ── The journey ─────────────────────────────────────────────────────────────────────────

export function BonsaiJourney({ step, active }: { step: JourneyStep; active: boolean }) {
  // Until the slide is first presented, nothing grows — roots grow on arrival.
  const [visited, setVisited] = useState(active);
  if (active && !visited) setVisited(true);
  const stage: Stage = visited ? step : 'dark';

  // Where we came from, captured once per stage change.
  const [history, setHistory] = useState({ stage, prev: stage });
  if (history.stage !== stage) setHistory({ stage, prev: history.stage });
  const prev = history.stage !== stage ? history.stage : history.prev;
  const forward = rank(stage) === rank(prev) + 1;
  const back = rank(stage) === rank(prev) - 1;
  const arriving = (s: Stage) => forward && stage === s;

  const camera: Transition = arriving('roots')
    ? { duration: 3.2, ease: 'easeOut' }
    : forward
      ? { duration: stage === 'overview' ? 2.6 : 2.3, ease: GLIDE }
      : back
        ? { duration: 1.2, ease: GLIDE }
        : SNAP;

  const rootsOn = rank(stage) >= rank('roots');
  const treeOn = rank(stage) >= rank('trunk');
  const t = (s: Stage, tr: Transition) => (arriving(s) ? tr : SNAP);
  const growingTree = arriving('trunk');
  const wildTransition = (delay: number, dur: number): Transition =>
    growingTree ? grow(delay, dur) : back ? grow(0, 0.4) : SNAP;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      initial={false}
      animate={{ viewBox: viewBox(VIEWS[stage]) }}
      transition={camera}
    >
      <motion.g
        fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: stage === 'overview' ? 0.26 : 1 }}
        transition={
          stage === 'overview' && forward ? { duration: 1.8, delay: 0.7, ease: 'easeInOut' } : SNAP
        }
      >
        {/* cutaway pot with soil — the stage for the roots */}
        <path d={POT_SHELL} fill={POT_DARK} />
        <path d={POT_SOIL} fill={SOIL} />
        {SOIL_GRAINS.map((g) => (
          <circle key={`${g.x}-${g.y}`} cx={g.x} cy={g.y} r={g.r} fill={SOIL_GRAIN} />
        ))}
        <rect x={478} y={1176} width={30} height={18} rx={4} fill={POT} />
        <rect x={1092} y={1176} width={30} height={18} rx={4} fill={POT} />
        <rect x={588} y={1316} width={54} height={16} rx={3} fill={POT_DARK} />
        <rect x={958} y={1316} width={54} height={16} rx={3} fill={POT_DARK} />

        {/* roots growing through the soil */}
        {ROOTS.map((r, i) => (
          <motion.path
            key={r.d}
            d={r.d}
            stroke={ROOT}
            strokeWidth={r.w}
            initial={false}
            animate={grown(rootsOn)}
            transition={t('roots', grow(0.4 + i * 0.28, 1.4))}
          />
        ))}
        {ROOTLETS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke={ROOT}
            strokeWidth={5}
            initial={false}
            animate={grown(rootsOn)}
            transition={t('roots', grow(1.5 + i * 0.18, 0.7))}
          />
        ))}

        {/* the tree, with a little boing once it has grown */}
        <motion.g
          style={pivot(TRUNK_BASE)}
          initial={false}
          animate={growingTree ? TREE_BOING : AT_REST}
        >
          {NEBARI.map((d) => (
            <motion.path
              key={d}
              d={d}
              stroke={BARK}
              strokeWidth={22}
              initial={false}
              animate={grown(treeOn)}
              transition={t('trunk', grow(0.05, 0.4))}
            />
          ))}
          {TRUNK.map((seg) => (
            <motion.path
              key={seg.d}
              d={seg.d}
              stroke={BARK}
              strokeWidth={seg.w}
              initial={false}
              animate={grown(treeOn)}
              transition={t('trunk', grow(seg.at, seg.dur))}
            />
          ))}
          <motion.path
            d={BARK_STREAK}
            stroke={BARK_LIGHT}
            strokeWidth={10}
            initial={false}
            animate={grown(treeOn)}
            transition={t('trunk', grow(0.9, 0.8))}
          />
          {BRANCHES.map((b) => (
            <motion.path
              key={b.d}
              d={b.d}
              stroke={BARK}
              strokeWidth={b.w}
              initial={false}
              animate={grown(treeOn)}
              transition={t('trunk', grow(b.at, 0.6))}
            />
          ))}

          {/* the wild branch: grows with the tree, snapped off when pruned */}
          <AnimatePresence custom={arriving('prune')}>
            {rank(stage) <= rank('trunk') && (
              <motion.g
                key="wild"
                style={pivot(CUT)}
                custom={arriving('prune')}
                variants={{ exit: (falling: boolean) => wildExit(falling) }}
                exit="exit"
              >
                <motion.path
                  d={WILD.limb}
                  stroke={BARK}
                  strokeWidth={12}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={grown(treeOn)}
                  transition={wildTransition(WILD_AT, 0.8)}
                />
                {WILD.shoots.map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    stroke={BARK}
                    strokeWidth={6}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={grown(treeOn)}
                    transition={wildTransition(WILD_AT + 0.5 + i * 0.15, 0.5)}
                  />
                ))}
                {WILD.tufts.map((tuft, i) => (
                  <g
                    key={`${tuft.x}-${tuft.y}`}
                    transform={`translate(${tuft.x} ${tuft.y}) scale(${tuft.s})`}
                  >
                    <motion.g
                      style={{ originX: 0.5, originY: 0.9 }}
                      initial={{ scaleX: 0, scaleY: 0 }}
                      animate={{ scaleX: treeOn ? 1 : 0, scaleY: treeOn ? 1 : 0 }}
                      transition={
                        growingTree
                          ? squashSpring(WILD_AT + 0.9 + i * 0.15)
                          : back
                            ? squashSpring(0.3)
                            : SNAP
                      }
                    >
                      <circle cx={-22} cy={6} r={34} fill={SHOOT} />
                      <circle cx={22} cy={-6} r={38} fill={SHOOT} />
                      <circle cx={4} cy={22} r={28} fill={LEAF} />
                    </motion.g>
                  </g>
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* foliage pads: puffs bubble up on springs, then breathe */}
          {PADS.map((pad, i) => (
            <g key={`${pad.x}-${pad.y}`} transform={`translate(${pad.x} ${pad.y}) scale(${pad.s})`}>
              <motion.g
                style={{ originX: 0.5, originY: 1 }}
                initial={false}
                animate={
                  treeOn && stage !== 'overview'
                    ? { scaleX: [1, 1.015], scaleY: [1, 0.985] }
                    : { scaleX: 1, scaleY: 1 }
                }
                transition={
                  treeOn && stage !== 'overview'
                    ? {
                        duration: 2.6 + i * 0.35,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'mirror',
                        delay: growingTree ? pad.at + 1.4 : 0,
                      }
                    : SNAP
                }
              >
                <Puffs on={treeOn} delay={pad.at} playing={growingTree} />
              </motion.g>
            </g>
          ))}
        </motion.g>

        {/* moss on the soil surface, once the tree is up */}
        {MOSS_DOTS.map((m, i) => (
          <motion.circle
            key={`${m.x}-${m.y}`}
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill={MOSS}
            initial={false}
            animate={{ scale: treeOn ? 1 : 0 }}
            transition={growingTree ? popSpring(2.8 + i * 0.08) : SNAP}
          />
        ))}

        {arriving('prune') && <Scissors />}
      </motion.g>
    </motion.svg>
  );
}
