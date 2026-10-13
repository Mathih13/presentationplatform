import { useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { DeckShell } from '../deck/DeckShell';
import notes from './AktFaglunsj.notes.md?raw';
import { Image } from '../deck/Image';
import { Slide } from '../deck/Slide';
import { useFragment } from '../deck/useFragment';
import { useSlideActive } from '../deck/useSlideActive';
import { LivingRings, RingsLegend } from '../diagrams/LivingRings';
import { RINGS } from '../diagrams/contextRings';
import { BonsaiJourney } from '../diagrams/BonsaiJourney';
import { TeamContext, type TeamMode } from '../diagrams/TeamContext';
import { TempoLanes } from '../diagrams/TempoLanes';

// AKT faglunsj — «Claude og oss andre – hvor går vi nå, sammen og hver for oss?»
// 45 min: ~29 min talk + ~15 min discussion, two speakers (Mathias + colleague).
// Core question: how do we collaborate when each of us has an AI agent?
// Spine: collaboration = keeping shared understanding in sync → Agile synced by *push*
// (rituals, because context lived in heads) → agents break push (distance, private
// contexts, tempo) → the third bet is *pull*: context lives in one place and the whole team
// owns it, as a property of the team. The garden metaphor from Act 1 pays off in Act 4
// as a bonsai: context grows by itself; the team's job is pruning.
// Assets from the Keynote «Konteksthåndtering — Fra Jacquard til Claude» live in
// public/slides/akt/. Speaker notes live in AktFaglunsj.notes.md, one section per slide id.

const SPEAKERS = 'Nicklas · Mathias';

const ROLES = [
  { src: '/slides/akt/monsterdesigner.jpg', label: 'Mønsterdesigneren' },
  { src: '/slides/akt/kortmaker.jpg', label: 'Kortmakeren' },
  { src: '/slides/akt/vevstol.jpg', label: 'Vevstolen' },
];

// The three methodology bets. Act 2 opens with the third one unanswered; Act 4 fills it in.
const BETS = [
  { name: 'Waterfall', line: 'Skriv alt ned først' },
  { name: 'Agile', line: 'Møtes ofte' },
  { name: 'Med AI', line: 'Felles kontekst' },
];

// Per role: what the agent does for you alone, and how you tend the shared context.
const ROLE_PRACTICES = [
  { role: 'Utvikler', alone: 'Koden', together: 'Reglene' },
  { role: 'Fagperson', alone: 'Hull og unntak', together: 'Fagkunnskapen' },
  { role: 'Leder', alone: 'Idéene', together: 'Beslutningene' },
];

const GEAR = 'hsl(var(--primary))';

// A plain gear: a ring with eight teeth. Marks a role as automated — it pops in when the slide
// is presented, then keeps turning (neighbouring gears turn opposite ways).
function Gear({ index, active }: { index: number; active: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={
        active
          ? { type: 'spring', stiffness: 180, damping: 18, delay: 0.5 + index * 0.3 }
          : { duration: 0 }
      }
    >
      <motion.svg
        viewBox="-50 -50 100 100"
        className="h-64 w-64 drop-shadow-xl"
        animate={active ? { rotate: index % 2 ? -360 : 360 } : { rotate: 0 }}
        transition={active ? { duration: 9, ease: 'linear', repeat: Infinity } : { duration: 0 }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x={-9}
            y={-48}
            width={18}
            height={20}
            rx={3}
            fill={GEAR}
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r={30} fill="none" stroke={GEAR} strokeWidth={18} />
      </motion.svg>
    </motion.div>
  );
}

function RoleTriptych({ automated, active = false }: { automated: boolean; active?: boolean }) {
  return (
    <div className="flex gap-10">
      {ROLES.map((role, i) => (
        <figure key={role.label} className="flex flex-col items-center gap-6">
          <div className="relative h-[560px] w-[520px] overflow-hidden rounded-2xl">
            <img src={role.src} alt={role.label} className="h-full w-full object-cover" />
            {automated && i > 0 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'hsl(var(--background) / 0.55)' }}
                initial={false}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: active ? 0.6 : 0, delay: active ? 0.3 + i * 0.3 : 0 }}
              >
                <Gear index={i} active={active} />
              </motion.div>
            )}
          </div>
          <figcaption className="text-center">
            <p className="text-primary-foreground text-5xl">{role.label}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function RolesSplitting() {
  return <RoleTriptych automated active={useSlideActive()} />;
}

// The third bet: left empty in Act 2; in Act 4 a "?" spins away and the answer reveals itself
// line by line.
function Bets({ answered }: { answered: boolean }) {
  const active = useSlideActive();
  const snap = { duration: 0 };
  const reveal = (delay: number) =>
    active
      ? { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' as const } }
      : { opacity: 0, y: 16, transition: snap };
  return (
    <div className="flex h-[1080px] flex-col justify-center gap-24 px-32">
      <h2 className="text-primary-foreground text-6xl">Metodikk er et veddemål</h2>
      <div className="flex gap-16 text-left">
        {BETS.map((bet, i) => {
          const third = i === 2;
          if (third && !answered) return <div key={bet.name} className="flex-1" />;
          return (
            <div key={bet.name} className="relative flex-1">
              {third && (
                <motion.h3
                  className="text-primary-foreground absolute left-0 top-0 text-6xl"
                  initial={false}
                  animate={
                    active
                      ? { opacity: 0, rotate: 120, scale: 0.3 }
                      : { opacity: 1, rotate: 0, scale: 1 }
                  }
                  transition={active ? { duration: 0.6, delay: 0.5, ease: 'easeIn' } : snap}
                >
                  ?
                </motion.h3>
              )}
              <motion.h3
                className="text-primary-foreground mb-10 text-6xl"
                initial={false}
                animate={third ? reveal(1.0) : { opacity: 1, y: 0 }}
              >
                {bet.name}
              </motion.h3>
              <motion.p
                className={`text-4xl ${third ? 'text-primary-foreground' : 'text-secondary-foreground'}`}
                initial={false}
                animate={third ? reveal(1.5) : { opacity: 1, y: 0 }}
              >
                {bet.line}
              </motion.p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// "Hvem holder ringen?": rings on the left (they morph to centre on the next slide), rows of
// people revealed one per click on the right.
function PeopleMapSlide() {
  const { index } = useFragment();
  const active = useSlideActive();
  return (
    <div className="flex h-[1080px] items-center gap-20 pl-20">
      <div data-id="context-rings" className="h-[940px] w-[940px] shrink-0">
        <LivingRings mode="people" active={active} revealed={index + 1} />
      </div>
      <RingsLegend revealed={index + 1} />
      {RINGS.map((ring) => (
        <span key={ring.name} className="fragment" aria-hidden="true" style={{ display: 'none' }} />
      ))}
    </div>
  );
}

function RingsSlide() {
  return (
    <div className="flex h-[1080px] items-center justify-center">
      <div data-id="context-rings" className="h-[940px] w-[940px]">
        <LivingRings mode="drift" active={useSlideActive()} />
      </div>
    </div>
  );
}

// Diagrams with continuous motion only run while their slide is on screen.
function TeamSlide({ mode, sharedLabel }: { mode: TeamMode; sharedLabel?: string }) {
  return <TeamContext mode={mode} active={useSlideActive()} sharedLabel={sharedLabel} />;
}
function TempoSlideLanes() {
  return <TempoLanes active={useSlideActive()} />;
}

// "Programvare råtner ikke. Konteksten driver." — "råtner" crumbles and snaps back (the code
// doesn't rot), then the two words of the second line slowly drift apart (the context does).
function ContextDriftText() {
  const active = useSlideActive();
  const snap = { duration: 0 };
  return (
    <div className="flex h-[1080px] flex-col items-center justify-center gap-6 px-28 text-center">
      <p className="text-primary-foreground text-7xl">
        Programvare{' '}
        <span className="inline-block">
          {'råtner'.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={false}
              animate={
                active
                  ? {
                      y: [0, 0, 16 + i * 4, 0],
                      rotate: [0, 0, (i % 2 ? 1 : -1) * (8 + i * 3), 0],
                      opacity: [1, 1, 0.5, 1],
                    }
                  : { y: 0, rotate: 0, opacity: 1 }
              }
              transition={
                active
                  ? {
                      duration: 1.7,
                      times: [0, 0.2, 0.55, 1],
                      ease: 'easeInOut',
                      delay: 0.4 + i * 0.06,
                    }
                  : snap
              }
            >
              {ch}
            </motion.span>
          ))}
        </span>{' '}
        ikke.
      </p>
      <p className="text-primary-foreground text-7xl">
        {['Konteksten', 'driver.'].map((word, i) => (
          <motion.span
            key={word}
            className="inline-block"
            initial={false}
            animate={active ? { x: i ? 44 : -44, y: i ? 10 : -6 } : { x: 0, y: 0 }}
            transition={active ? { duration: 7, ease: [0.2, 0.6, 0.3, 1], delay: 2.4 } : snap}
          >
            {word}
            {i === 0 ? '\u00a0' : ''}
          </motion.span>
        ))}
      </p>
    </div>
  );
}

// The garden payoff: a camera journey through an illustrated bonsai, from the roots up to one
// overgrown branch the team prunes, then out to the whole tree dimmed into the background.
// One line of text per stop; all three return together on the overview.
const HAGEN_LINES = [
  { text: 'Konteksten vokser av seg selv.', className: 'text-secondary-foreground text-6xl' },
  { text: 'Teamets jobb er å beskjære.', className: 'text-primary-foreground text-7xl' },
];

// The bonsai's final frame — the whole tree, dimmed — behind the three lines.
function HagenSlide() {
  return (
    <div className="relative h-[1080px] overflow-hidden">
      <BonsaiJourney step="overview" active />
      <div className="absolute inset-y-0 left-32 flex flex-col justify-center gap-10 whitespace-nowrap text-left">
        {HAGEN_LINES.map((l) => (
          <p key={l.text} className={l.className}>
            {l.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AktFaglunsj() {
  // The talk's own palette (see globals.css); light, so it holds up in a bright lunch room.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains('dark');
    html.classList.add('theme-vevstue');
    html.classList.remove('dark');
    return () => {
      html.classList.remove('theme-vevstue');
      html.classList.toggle('dark', wasDark);
    };
  }, []);
  return (
    <DeckShell notes={notes}>
      {/* ───────────── Åpning (begge, 0–3) ───────────── */}

      <Slide id="title" transition="fade">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-8 text-center">
          <h1 className="text-primary-foreground text-8xl">Claude og oss andre</h1>
          <p className="text-secondary-foreground text-5xl">
            hvor går vi nå, sammen og hver for oss?
          </p>
          <p className="absolute bottom-0 left-0 text-3xl">{SPEAKERS}</p>
        </div>
      </Slide>

      {/* ───────────── Akt 1: Samarbeid er felles forståelse (Mathias, 3–9) ───────────── */}

      <Slide id="arne-fabrikker" transition="fade">
        <div className="flex h-[1080px] items-center justify-center">
          <Image
            src="/slides/akt/arne-fabrikker.jpg"
            alt="Arne Fabrikker, Ytre Arna"
            className="h-[900px] rounded-2xl"
          />
        </div>
      </Slide>

      <Slide id="tre-roller">
        <div className="flex h-[1080px] items-center justify-center">
          <RoleTriptych automated={false} />
        </div>
      </Slide>

      <Slide id="programmet-sekundaert">
        <div className="flex h-[1080px] flex-col items-center justify-center px-28">
          <div className="flex flex-col gap-8 text-center">
            <p className="text-primary-foreground text-7xl">Programming as Theory Building</p>
            <p className="text-secondary-foreground text-4xl">Peter Naur, 1985</p>
          </div>
        </div>
      </Slide>

      <Slide id="hvem-holder-ringene" autoAnimate>
        <PeopleMapSlide />
      </Slide>

      <Slide id="ringer-i-bevegelse" autoAnimate>
        <RingsSlide />
      </Slide>

      <Slide id="kontekstdrift">
        <ContextDriftText />
      </Slide>

      {/* ───────────── Akt 2: Slik har vi samarbeidet — push (Kollega, 9–14) ───────────── */}

      <Slide id="metodikk-veddemaal" transition="fade">
        <Bets answered={false} />
      </Slide>

      <Slide id="synkroniseringsritualer">
        <div className="h-[1080px]">
          <TeamSlide mode="push" />
        </div>
      </Slide>

      <Slide id="ritual-duett">
        <div className="flex h-[1080px] flex-col justify-center gap-20 px-40">
          <p className="text-secondary-foreground text-7xl leading-tight">
            «Standupen er bortkastet tid.»
          </p>
        </div>
      </Slide>

      {/* ───────────── Akt 3: Hva AI gjør med samarbeidet (Mathias, 14–20) ───────────── */}

      <Slide id="better-call-claude" transition="fade">
        <div className="flex h-[1080px] items-center justify-center gap-16">
          <Image
            src="/slides/akt/better-call-claude.jpg"
            alt="Better Call Claude"
            className="h-[880px] rounded-2xl"
          />
          <Image
            src="/slides/akt/kortmaker-claude.png"
            alt="Kortmakeren som Claude"
            className="h-[700px] rounded-2xl"
          />
        </div>
      </Slide>

      <Slide id="agent-ringer">
        <div className="flex h-[1080px] items-center justify-center">
          <Image src="/slides/programmering-11.svg" fit="contain" className="h-[880px] w-[880px]" />
        </div>
      </Slide>

      <Slide id="menneske-vs-agent">
        <div className="flex h-[1080px] gap-40 px-40 pt-44">
          <div className="flex-1">
            <h2 className="text-primary-foreground mb-20 text-8xl">Menneske</h2>
            <ul className="text-secondary-foreground list-none space-y-8 text-5xl">
              <li>Langsom</li>
              <li>Dyp</li>
              <li>Taus kontekst</li>
              <li>Fortid, nå og fremtid</li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-primary-foreground mb-20 text-8xl">Agent</h2>
            <ul className="text-secondary-foreground list-none space-y-8 text-5xl">
              <li>Rask</li>
              <li>Tynn</li>
              <li>Eksplisitt kontekst</li>
              <li>Bare nå</li>
            </ul>
          </div>
        </div>
      </Slide>

      <Slide id="alle-blir-po">
        <div className="flex h-[1080px] items-center justify-center">
          <p className="text-primary-foreground text-9xl">Avstand</p>
        </div>
      </Slide>

      <Slide id="hver-sin-agent">
        <div className="h-[1080px]">
          <TeamSlide mode="private" />
        </div>
      </Slide>

      <Slide id="menneskefart">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-4 text-center">
          <p className="text-primary-foreground text-8xl">Tempo</p>
          <div className="mt-10 h-[460px] w-full">
            <TempoSlideLanes />
          </div>
        </div>
      </Slide>

      {/* ───────────── Akt 4: Vi eier konteksten sammen — pull (Kollega, 20–27) ───────────── */}

      <Slide id="tredje-veddemaal" transition="fade">
        <Bets answered={true} />
      </Slide>

      <Slide id="hagen">
        <HagenSlide />
      </Slide>

      <Slide id="felles-kontekst">
        <div className="h-[1080px]">
          <TeamSlide mode="pull" />
        </div>
      </Slide>

      <Slide id="hva-er-felles-kontekst">
        <div className="h-[1080px]">
          <TeamSlide mode="pull" sharedLabel="? ? ?" />
        </div>
      </Slide>

      <Slide id="hver-for-oss-sammen">
        <div className="flex h-[1080px] flex-col justify-center px-32">
          <div className="grid grid-cols-[1fr_1.4fr_1.6fr] gap-x-16 gap-y-14 text-left">
            <span />
            <h2 className="text-primary-foreground text-6xl">Hver for oss</h2>
            <h2 className="text-primary-foreground text-6xl">Sammen</h2>
            {ROLE_PRACTICES.flatMap((r) => [
              <p key={`${r.role}-role`} className="text-primary-foreground text-4xl font-semibold">
                {r.role}
              </p>,
              <p
                key={`${r.role}-alone`}
                className="text-secondary-foreground text-4xl leading-snug"
              >
                {r.alone}
              </p>,
              <p
                key={`${r.role}-together`}
                className="text-primary-foreground text-4xl leading-snug"
              >
                {r.together}
              </p>,
            ])}
          </div>
        </div>
      </Slide>

      {/* ───────────── Avslutning (begge, 27–29) ───────────── */}

      <Slide id="rollene-skiller-seg" transition="fade">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-12">
          <h2 className="text-primary-foreground text-6xl">Rollene skiller seg igjen</h2>
          <RolesSplitting />
        </div>
      </Slide>

      <Slide id="close" transition="fade">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-14 px-32 text-center">
          <p className="text-primary-foreground text-8xl leading-tight">
            Hvordan samarbeider vi nå?
          </p>
        </div>
      </Slide>

      {/* ───────────── Diskusjon (begge, 29–45) ───────────── */}

      <Slide id="diskusjon" transition="fade">
        <div className="flex h-[1080px] flex-col justify-center gap-14 px-40">
          <h2 className="text-secondary-foreground text-4xl uppercase tracking-widest opacity-70">
            Diskusjon
          </h2>
          <ul className="text-primary-foreground list-none space-y-12 text-5xl leading-snug">
            <li>Hvem beskjærer konteksten hos dere?</li>
            <li>Hva vet du som ikke står skrevet noe sted?</li>
            <li>Hver for oss eller sammen?</li>
          </ul>
        </div>
      </Slide>
    </DeckShell>
  );
}
