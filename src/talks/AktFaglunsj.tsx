import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DeckShell } from '../deck/DeckShell';
import { Image } from '../deck/Image';
import { Slide } from '../deck/Slide';
import { useFragment } from '../deck/useFragment';
import { useSlideActive } from '../deck/useSlideActive';
import { useStep } from '../deck/useStep';
import { ContextPeopleMap } from '../diagrams/ContextPeopleMap';
import { RINGS } from '../diagrams/contextRings';
import { BonsaiJourney } from '../diagrams/BonsaiJourney';
import { PrivateContexts } from '../diagrams/PrivateContexts';

// AKT faglunsj — «Claude og oss andre – hvor går vi nå, sammen og hver for oss?»
// 45 min: ~29 min talk + ~15 min discussion, two speakers (Mathias + colleague).
// Core question: how do we collaborate when each of us has a Claude?
// Spine: collaboration = keeping shared understanding in sync → Agile synced by *push*
// (rituals, because context lived in heads) → Claude breaks push (distance, private
// contexts, tempo) → the third bet is *pull*: context lives in one place and the whole team
// owns it, as a property of the team. The garden metaphor from Act 1 pays off in Act 4
// as a bonsai: context grows by itself; the team's job is pruning.
// Assets from the Keynote «Konteksthåndtering — Fra Jacquard til Claude» live in
// public/slides/akt/. Every slide's notes open with the speaker and a time cue.

const SPEAKERS = 'Mathias Hartveit · Kollega'; // TODO: colleague's name
const ME = '<strong>🎤 Mathias</strong>';
const COLLEAGUE = '<strong>🎤 Kollega</strong>';
const BOTH = '<strong>🎤 Begge</strong>';

const ROLES = [
  { src: '/slides/akt/monsterdesigner.jpg', label: 'Mønsterdesigneren', sub: 'forstår' },
  { src: '/slides/akt/kortmaker.jpg', label: 'Kortmakeren', sub: 'oversetter' },
  { src: '/slides/akt/vevstol.jpg', label: 'Vevstolen', sub: 'utfører' },
];

// The three methodology bets. Act 2 opens with the third one unanswered; Act 4 fills it in.
const BETS = [
  { name: 'Waterfall', belief: 'Konteksten er kjent og stabil', answer: 'Skriv alt ned først' },
  {
    name: 'Agile',
    belief: 'Konteksten driver — og bor i hodene',
    answer: 'Push: synk i faste ritualer',
  },
  {
    name: 'Med Claude',
    belief: 'Den driver raskere enn ritualene',
    answer: 'Pull: konteksten bor ett sted — og hele teamet eier den',
  },
];

const SHARED_PROJECT = {
  name: 'Billett og takst',
  sharedWith: 'Billett · Kundesenter · Utvikling',
  // Illustrative only — replace with real AKT rules, or keep them this generic.
  instructions: [
    'Takster og soner følger fylkeskommunens gjeldende vedtak — se takstregulativet.',
    'Skoleruter har egen ordning. Endringer avklares med billettavdelingen.',
    'Forklar alltid hvorfor en regel finnes, ikke bare hva den sier.',
  ],
  knowledge: ['Takstregulativ.pdf', 'Unntak og særordninger.md', 'Beslutningslogg.md'],
};

// The ownership habit, as a three-step loop.
const FIX_THE_CONTEXT = [
  'Claude bommer',
  'Den som ser det, retter konteksten',
  'Ingen bommer på det samme igjen',
];

// Per role: what Claude does for you alone, and how you tend the shared context.
const ROLE_PRACTICES = [
  {
    role: 'Utvikler',
    alone: 'Deleger koden',
    together: 'Skriv inn reglene og hvorfor — når du oppdager dem',
  },
  {
    role: 'Fagperson',
    alone: 'La Claude lete etter hull og unntak',
    together: 'Eie fagkunnskapen i konteksten',
  },
  {
    role: 'Leder / produkteier',
    alone: 'La Claude grille idéen først',
    together: 'Beslutninger med hvorfor — rett inn i konteksten',
  },
];

// A plain gear: a ring with eight teeth. Marks a role as automated.
function Gear() {
  return (
    <svg viewBox="-50 -50 100 100" className="h-64 w-64 drop-shadow-xl">
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={-9}
          y={-48}
          width={18}
          height={20}
          rx={3}
          fill="#f28b9a"
          transform={`rotate(${i * 45})`}
        />
      ))}
      <circle r={30} fill="none" stroke="#f28b9a" strokeWidth={18} />
    </svg>
  );
}

function RoleTriptych({ automated }: { automated: boolean }) {
  return (
    <div className="flex gap-10">
      {ROLES.map((role, i) => (
        <figure key={role.label} className="flex flex-col items-center gap-6">
          <div className="relative h-[560px] w-[520px] overflow-hidden rounded-2xl">
            <img src={role.src} alt={role.label} className="h-full w-full object-cover" />
            {automated && i > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Gear />
              </div>
            )}
          </div>
          <figcaption className="text-center">
            <p className="text-primary-foreground text-5xl">{role.label}</p>
            <p className="text-secondary-foreground text-3xl">{role.sub}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function Bets({ answered }: { answered: boolean }) {
  return (
    <div className="flex h-[1080px] flex-col justify-center gap-24 px-32">
      <h2 className="text-primary-foreground text-6xl">Metodikk er et veddemål om kontekst</h2>
      <div className="flex gap-16 text-left">
        {BETS.map((bet, i) => {
          const open = i === 2 && !answered;
          return (
            <div key={bet.name} className="flex-1">
              <h3 className="text-primary-foreground mb-10 text-6xl">{open ? '?' : bet.name}</h3>
              {!open && (
                <ul className="text-secondary-foreground list-none space-y-8 text-4xl leading-snug">
                  <li>{bet.belief}</li>
                  <li className={i === 2 ? 'text-primary-foreground' : ''}>→ {bet.answer}</li>
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PeopleMapSlide() {
  const { index } = useFragment();
  return (
    <>
      <ContextPeopleMap revealed={index + 1} />
      {RINGS.map((ring) => (
        <span key={ring.name} className="fragment" aria-hidden="true" style={{ display: 'none' }} />
      ))}
    </>
  );
}

// The garden payoff: a camera journey through an illustrated bonsai, from the roots up to one
// overgrown branch the team prunes, then out to the whole tree dimmed into the background.
// One line of text per stop; all three return together on the overview.
const HAGEN_STEPS = ['roots', 'trunk', 'prune', 'overview'] as const;
const HAGEN_LINES = [
  {
    step: 'roots',
    text: 'Koden er ikke en hage.',
    className: 'text-secondary-foreground text-6xl',
  },
  { step: 'trunk', text: 'Men konteksten er det.', className: 'text-primary-foreground text-7xl' },
  {
    step: 'prune',
    text: 'Og teamets jobb er å beskjære den.',
    className: 'text-primary-foreground text-6xl',
  },
] as const;

function HagenSlide() {
  const step = useStep(HAGEN_STEPS);
  const active = useSlideActive();
  const line = HAGEN_LINES.find((l) => l.step === step);
  // The overview's lines wait for the camera to pull back — unless we arrive from elsewhere.
  const [from, setFrom] = useState({ step, prev: step });
  if (from.step !== step) setFrom({ step, prev: from.step });
  const pulledBack =
    step === 'overview' && (from.step !== step ? from.step : from.prev) === 'prune';
  return (
    <div className="relative h-[1080px] overflow-hidden">
      <BonsaiJourney step={step} active={active} />
      <div className="absolute inset-y-0 left-32 flex flex-col justify-center whitespace-nowrap text-left">
        <AnimatePresence mode="wait">
          {line ? (
            <motion.p
              key={line.step}
              className={line.className}
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.8, ease: 'easeOut' },
              }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
            >
              {line.text}
            </motion.p>
          ) : (
            <motion.div
              key="all"
              className="flex flex-col gap-10"
              initial="hidden"
              animate="shown"
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              variants={{
                shown: {
                  transition: pulledBack ? { staggerChildren: 0.4, delayChildren: 1.5 } : {},
                },
              }}
            >
              {HAGEN_LINES.map((l) => (
                <motion.p
                  key={l.step}
                  className={l.className}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    shown: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                  }}
                >
                  {l.text}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {HAGEN_STEPS.slice(1).map((s) => (
        <span key={s} className="fragment" aria-hidden="true" style={{ display: 'none' }} />
      ))}
    </div>
  );
}

export default function AktFaglunsj() {
  return (
    <DeckShell>
      {/* ───────────── Åpning (begge, 0–3) ───────────── */}

      <Slide
        id="title"
        transition="fade"
        notes={`${BOTH} · ⏱ 0:00<br/><br/>Kort hvem vi er — én utvikler, én engineering manager med produkteier-blod.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-8 text-center">
          <h1 className="text-primary-foreground text-8xl">Claude og oss andre</h1>
          <p className="text-secondary-foreground text-5xl">
            hvor går vi nå, sammen og hver for oss?
          </p>
          <p className="absolute bottom-0 left-0 text-3xl">{SPEAKERS}</p>
        </div>
      </Slide>

      <Slide
        id="hver-for-oss-i-dag"
        notes={`${BOTH} · ⏱ 0:45<br/><br/>Én setning hver: hvordan bruker du Claude selv i dag? Det er «hver for oss» i praksis — og det er der de fleste av oss er.`}
      >
        <div className="flex h-[1080px] flex-col justify-center gap-12 px-40">
          <p className="text-secondary-foreground text-5xl">Én setning hver:</p>
          <p className="text-primary-foreground text-8xl leading-tight">
            Hvordan bruker du Claude i dag?
          </p>
        </div>
      </Slide>

      <Slide
        id="kjernesporsmaal"
        transition="fade"
        notes={`${BOTH} · ⏱ 2:15<br/><br/>La spørsmålet stå et øyeblikk. Dette er det hele foredraget handler om — og det vi svarer på helt til slutt.<br/><br/>Bro (Mathias): «For å svare på det, må vi først se på hva samarbeid egentlig er. Og det starter i et veveri i Ytre Arna.»`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-10 px-32 text-center">
          <p className="text-primary-foreground text-8xl leading-tight">Hvordan samarbeider vi —</p>
          <p className="text-secondary-foreground text-7xl leading-tight">
            når hver av oss har en Claude?
          </p>
        </div>
      </Slide>

      {/* ───────────── Akt 1: Samarbeid er felles forståelse (Mathias, 3–9) ───────────── */}

      <Slide
        id="arne-fabrikker"
        transition="fade"
        notes={`${ME} · ⏱ 3:00 · Akt 1<br/><br/>Jeg er barnebarn av en programmør. På slutten av 50-tallet flyttet bestefar til Ytre Arna og fikk jobb på Arne Fabrikker — Norges første mekaniserte veveri — som designer av vevmønster.<br/><br/>Vevstolene der var Jacquard-vevstoler: de leste hullkort, ett per rad i stoffet. Hullkortene regnes som det første steget i dataprogrammering.`}
      >
        <div className="flex h-[1080px] items-center justify-center">
          <Image
            src="/slides/akt/arne-fabrikker.jpg"
            alt="Arne Fabrikker, Ytre Arna"
            className="h-[900px] rounded-2xl"
          />
        </div>
      </Slide>

      <Slide
        id="tre-roller"
        notes={`${ME} · ⏱ 3:45<br/><br/>Tre roller som samarbeidet om ett mønster.<br/><strong>Mønsterdesigneren</strong> tok imot kundens bestilling og intensjon og gjorde den til en spesifikasjon på rutepapir — inkludert <em>hvorfor</em>.<br/><strong>Kortmakeren</strong> oversatte spesifikasjonen til hullkort. Presist fagarbeid, men ingen avgjørelser om mønsteret.<br/><strong>Vevstolen</strong> kjørte kortene uten å vite hva den lagde.<br/><br/>Samarbeidet handlet om å flytte forståelse fra én rolle til den neste. Og bestefar kunne holde hele konteksten i hodet: én vevstol, én kunde, en tradisjon som endret seg sakte.`}
      >
        <div className="flex h-[1080px] items-center justify-center">
          <RoleTriptych automated={false} />
        </div>
      </Slide>

      <Slide
        id="programmet-sekundaert"
        notes={`${ME} · ⏱ 4:45<br/><br/>Så hva er det vi egentlig lager — vi som jobber med digitale tjenester, uansett rolle? Peter Naur skrev i 1985 at programmet nesten er et biprodukt. Det egentlige produktet er forståelsen — teorien teamet har om hva løsningen er til for. Mister du den, dreper du produktet, selv om koden fortsatt kjører.<br/><br/>Og den forståelsen bor ikke i ett hode. Den bor i teamets. Samarbeid er å holde den felles.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center px-28">
          <div className="flex max-w-[65%] flex-col gap-14 text-left">
            <p className="text-primary-foreground text-7xl">Programmet er sekundært.</p>
            <p className="text-primary-foreground text-7xl">
              Produktet lever i <em>teamets</em> hode.
            </p>
          </div>
        </div>
      </Slide>

      <Slide
        id="hvem-holder-ringene"
        notes={`${ME} · ⏱ 5:45 · <strong>Interaktivt</strong><br/><br/>Den forståelsen kaller jeg kontekst — ikke en AI sitt prompt-vindu, men alt som gjør arbeidet <em>riktig</em>. Den har lag: Kode → Team → Domene → Selskap → Industri.<br/><br/>Spør salen før hver rad: «Hvem hos dere holder denne ringen?» Ta ett-to svar, så avslør.<br/><br/>Poenget: ingen holder alle ringene. Forståelsen er spredt på folk som ser forskjellige ting.<br/><br/>Tilpass radene til AKTs faktiske roller (src/diagrams/contextRings.ts).`}
      >
        <div className="h-[1080px]">
          <PeopleMapSlide />
        </div>
      </Slide>

      <Slide
        id="ringer-i-bevegelse"
        notes={`${ME} · ⏱ 7:15<br/><br/>Og ringene beveger seg — i ulik fart. Kode: daglig. Team: ukentlig. Domene: årlig — takster, ruter, regelverk. Selskap: over år. Industri: over tiår.<br/><br/>Siden ringene holdes av forskjellige folk, betyr det at <em>folk</em> glir fra hverandre. Domenet endrer seg hos fagfolkene, koden hos utviklerne, og ingen merker det før noe skurrer: «jamen det virket jo forrige uke».`}
      >
        <div className="flex h-[1080px] items-center justify-center">
          <Image src="/slides/programmering-4.svg" fit="contain" className="h-[880px] w-[880px]" />
        </div>
      </Slide>

      <Slide
        id="kontekstdrift"
        notes={`${ME} · ⏱ 8:00<br/><br/>En leder som virkelig ville forstå utviklerne, sa en gang at programvare er som en hage — uten stell gror den igjen. Det beskriver noe ekte, men plasserer årsaken feil sted. Koden er en maskin: den gjør nøyaktig det samme som dagen den ble sluppet.<br/><br/>Det som driver er passformen mellom arbeidet og forståelsen rundt det. <em>(Hold på hagen — den kommer tilbake, som en bonsai.)</em><br/><br/>→ Overlevering til kollega.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-6 px-28 text-center">
          <p className="text-primary-foreground text-7xl">Programvare råtner ikke.</p>
          <p className="text-primary-foreground text-7xl">Konteksten driver.</p>
        </div>
      </Slide>

      {/* ───────────── Akt 2: Slik har vi samarbeidet — push (Kollega, 9–14) ───────────── */}

      <Slide
        id="metodikk-veddemaal"
        transition="fade"
        notes={`${COLLEAGUE} · ⏱ 9:00 · Akt 2<br/><br/>Måten vi samarbeider på er et veddemål om hvordan konteksten oppfører seg.<br/><strong>Waterfall</strong> vedder på at den er kjent og stabil: skriv alt ned først, så er resten mekanisk. Resultatet er 400-siders spesifikasjoner som ikke stemmer — fordi verden endret seg underveis.<br/><strong>Agile</strong> vedder på at den driver, og at den bor i hodene våre. Svaret er å synke ofte.<br/><br/>Det tredje feltet lar vi stå åpent.`}
      >
        <Bets answered={false} />
      </Slide>

      <Slide
        id="synkroniseringsritualer"
        notes={`${COLLEAGUE} · ⏱ 10:15<br/><br/>De fleste agile praksiser er synkroniseringsritualer: standup synker teamet, retro synker hvordan vi jobber, sprint review synker med domenet.<br/><br/>Legg merke til mekanismen: det er <strong>push</strong>. Fordi konteksten bor i hodene, må folk samles til faste tider og kringkaste den til hverandre.<br/><br/>Del gjerne et eget eksempel: et ritual du har innført eller kuttet som leder — og hva som skjedde.`}
      >
        <div className="flex h-[1080px] items-center justify-center gap-24">
          <Image src="/slides/programmering-5.svg" fit="contain" className="h-[880px] w-[880px]" />
          <div className="flex max-w-[640px] flex-col gap-8 text-left">
            <p className="text-primary-foreground text-6xl leading-tight">
              Ritualer er synkronisering
            </p>
            <p className="text-secondary-foreground text-5xl">— ved push</p>
          </div>
        </div>
      </Slide>

      <Slide
        id="ritual-duett"
        notes={`${BOTH} · ⏱ 11:45 · <strong>Duett</strong><br/><br/><strong>Mathias:</strong> Erfarne utviklere som lever i koden time for time synes ofte standup er bortkastet tid — og det er helt innafor: de har ingen drift å korrigere.<br/><strong>Kollega:</strong> Men standupen er ikke for deg. Den er for produkteieren som kommer innom én gang i uka, for nyansatte, for drift. Du kringkaster til de ytre ringene — betalt med din tid, høstet av resten.<br/><br/>Det er prisen for push: de som betaler og de som får nytte er ikke de samme.`}
      >
        <div className="flex h-[1080px] flex-col justify-center gap-20 px-40">
          <p className="text-secondary-foreground text-7xl leading-tight">
            «Standupen er bortkastet tid.»
          </p>
          <p className="fragment text-primary-foreground text-7xl leading-tight">
            «Standupen er ikke for deg.»
          </p>
        </div>
      </Slide>

      <Slide
        id="hva-er-veddemaalet"
        transition="fade"
        notes={`${COLLEAGUE} · ⏱ 13:15<br/><br/>Alt dette er laget for mennesker som synker med mennesker. Så: hva er veddemålet når en helt annen type kollega er med?<br/><br/>→ Overlevering til Mathias.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-10 px-32 text-center">
          <p className="text-secondary-foreground text-6xl">Waterfall → Agile → ?</p>
          <p className="text-primary-foreground text-7xl leading-tight">
            Hva er veddemålet når Claude er med?
          </p>
        </div>
      </Slide>

      {/* ───────────── Akt 3: Hva Claude gjør med samarbeidet (Mathias, 14–20) ───────────── */}

      <Slide
        id="better-call-claude"
        transition="fade"
        notes={`${ME} · ⏱ 14:00 · Akt 3<br/><br/>Kortmakeren har fått en ny kollega. Rask, flink, alltid tilgjengelig. Men hva ser den egentlig?`}
      >
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

      <Slide
        id="agent-ringer"
        notes={`${ME} · ⏱ 14:30<br/><br/>Dette er kontekstbildet til Claude. Den ser det innerste — det du har gitt den akkurat nå — men du skal være heldig om den forstår domenet, selskapet eller bransjen.<br/><br/><strong>Callback:</strong> Husk hvem som holdt de ytre ringene. Det er dere — fagfolk, ledere, produkteiere. Det er «oss andre» i tittelen.`}
      >
        <div className="flex h-[1080px] items-center justify-center">
          <Image src="/slides/programmering-11.svg" fit="contain" className="h-[880px] w-[880px]" />
        </div>
      </Slide>

      <Slide
        id="menneske-vs-agent"
        notes={`${ME} · ⏱ 15:30<br/><br/>Mennesker og Claude bygger kontekst på ulike måter — ikke ulike hastigheter, men ulike <em>typer</em> kontekst.<br/><br/>Claude leser 100 000 ord på sekunder, men holder seg på overflaten. Vi bruker måneder, men forstår dypt — og mye er taust: en erfaren saksbehandler eller utvikler reagerer riktig uten å kunne forklare hvorfor.<br/><br/>Og tid: vi holder fortid, nåtid og fremtid samtidig. Claude har bare nå — det som står i vinduet. Den kan ikke delta i et ritual; den kan bare lese det som er skrevet ned.<br/><br/>Så hva gjør dette med samarbeidet? Tre ting.`}
      >
        <div className="flex h-[1080px] gap-40 px-40 pt-44">
          <div className="flex-1">
            <h2 className="text-primary-foreground mb-20 text-8xl">Menneske</h2>
            <ul className="text-secondary-foreground list-none space-y-8 text-5xl">
              <li>Langsom, dyp</li>
              <li>Taus kontekst</li>
              <li>Glemmer over tid</li>
              <li>Fortid · nåtid · fremtid</li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-primary-foreground mb-20 text-8xl">Claude</h2>
            <ul className="text-secondary-foreground list-none space-y-8 text-5xl">
              <li>Rask, tynn</li>
              <li>Eksplisitt kontekst</li>
              <li>Drukner i for mye</li>
              <li>Bare nå</li>
            </ul>
          </div>
        </div>
      </Slide>

      <Slide
        id="alle-blir-po"
        notes={`${ME} · ⏱ 17:00 · <strong>1 av 3: avstand</strong><br/><br/>Husk duetten: utvikleren trengte ikke standupen fordi hen levde i koden. Når Claude skriver koden, lever hen ikke der lenger — og har fått samme avstand som produkteieren alltid hadde.<br/><br/>Og det gjelder alle. Saksbehandleren som lar Claude skrive utkastene, analytikeren som lar Claude lage rapporten — alle glir litt fra sitt eget arbeid.`}
      >
        <div className="flex h-[1080px] flex-col justify-center gap-14 px-40">
          <p className="text-secondary-foreground text-6xl">Når Claude gjør jobben …</p>
          <p className="text-primary-foreground text-7xl leading-tight">
            … blir alle den som kommer innom én gang i uka.
          </p>
        </div>
      </Slide>

      <Slide
        id="hver-sin-claude"
        notes={`${ME} · ⏱ 18:00 · <strong>2 av 3: private kontekster</strong><br/><br/>Hver av oss har vår egen Claude, og hver av dem vet bare det <em>én person</em> har fortalt den. Fagpersonen har gitt sin Claude unntakene i takstregelverket. Utvikleren har gitt sin Claude koden. Ingen av dem vet om hverandre.<br/><br/>Hver av oss blir raskere. Men den felles forståelsen — produktet, ifølge Naur — sprekker opp i private kopier.`}
      >
        <div className="flex h-[1080px] items-center justify-center">
          <PrivateContexts shared={false} />
        </div>
      </Slide>

      <Slide
        id="menneskefart"
        notes={`${ME} · ⏱ 19:15 · <strong>3 av 3: tempo</strong><br/><br/>Og push-modellen henger ikke med. En ukentlig standup var i takt med arbeid som endret seg ukentlig. Nå endrer arbeidet seg i timen. Ritualene kan ikke kringkaste raskt nok — og Claude sitter uansett ikke i møtet.<br/><br/>Avstand, private kontekster, tempo. Push er brukt opp.<br/><br/>→ Overlevering til kollega.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-6 px-28 text-center">
          <p className="text-primary-foreground text-7xl">Ritualene går i menneskefart.</p>
          <p className="text-secondary-foreground text-7xl">Claude gjør ikke det.</p>
        </div>
      </Slide>

      {/* ───────────── Akt 4: Vi eier konteksten sammen — pull (Kollega, 20–27) ───────────── */}

      <Slide
        id="tredje-veddemaal"
        transition="fade"
        notes={`${COLLEAGUE} · ⏱ 20:00 · Akt 4<br/><br/>Tilbake til det tomme feltet. Det tredje veddemålet er <strong>pull</strong>: konteksten bor ett sted, eksplisitt, og hele teamet eier den. I stedet for å samles og kringkaste, henter alle — mennesker og Claude — det de trenger når de trenger det.<br/><br/>Eierskapet er en egenskap ved teamet, ikke en oppgave i et møte eller én persons dokument.`}
      >
        <Bets answered={true} />
      </Slide>

      <Slide
        id="hagen"
        notes={`${COLLEAGUE} · ⏱ 21:00 · <strong>Callback til hagen</strong> · 3 klikk<br/><br/><strong>Røttene</strong> (sliden åpner her): Husker dere lederen med hagen? Hen tok feil om koden — koden er en maskin. Men hen hadde rett om noe annet. Konteksten har røtter: historikk, beslutninger, hvorfor.<br/><br/>(klikk) <strong>Stammen</strong> — vi reiser opp mens treet tegner seg: konteksten vokser av seg selv. Alle legger til, og Claude legger til enda raskere. Se grenen til høyre — den vokser ut av form når ingen styrer.<br/><br/>(klikk) <strong>Beskjæringen</strong> — veksten trenger vi ikke hjelpe på. Det teamet må gjøre er å beskjære: fjerne det som er utdatert, styre retningen. Ett klipp.<br/><br/>(klikk) <strong>Hele treet</strong> — en bonsai er ikke et tre som får vokse fritt. Formen er resultatet av små klipp over lang tid, fra flere hender. La sliden stå et øyeblikk.`}
      >
        <HagenSlide />
      </Slide>

      <Slide
        id="felles-kontekst"
        notes={`${COLLEAGUE} · ⏱ 21:45<br/><br/>Samme bilde som i stad — men nå henter alle Claudene fra det samme stedet. De private boblene forsvinner ikke, men de er ikke lenger det eneste Claude vet. Og produkteieren som kommer innom én gang i uka, kan lese seg opp når hen vil — uten at noen må kringkaste.`}
      >
        <div className="flex h-[1080px] items-center justify-center">
          <PrivateContexts shared={true} />
        </div>
      </Slide>

      <Slide
        id="felles-prosjekt"
        notes={`${COLLEAGUE} · ⏱ 22:45<br/><br/>Slik kan midten se ut i praksis: et felles Claude-prosjekt som fagfolkene eier. Instruksjonene er skrevet av de som kan reglene — med <em>hvorfor</em>. Når kundesenteret, billettavdelingen og utviklerne spør Claude, jobber alle fra samme forståelse.<br/><br/>Ingen nye verktøy — dette kan dere gjøre nå som Claude tas i bruk.<br/><br/><strong>Før foredraget:</strong> bytt reglene med ekte eksempler fra AKT, eller hold dem så generelle som nå.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-12">
          <h2 className="text-primary-foreground text-6xl">Ett eksempel: et felles prosjekt</h2>
          <div className="border-border/40 bg-muted/40 w-[1300px] rounded-3xl border p-14 text-left">
            <div className="mb-10 flex items-baseline justify-between">
              <p className="text-primary-foreground text-5xl font-semibold">
                Prosjekt: {SHARED_PROJECT.name}
              </p>
              <p className="text-secondary-foreground text-3xl">
                Delt med {SHARED_PROJECT.sharedWith}
              </p>
            </div>
            <p className="text-secondary-foreground mb-5 text-2xl uppercase tracking-widest">
              Instruksjoner
            </p>
            <ul className="text-primary-foreground mb-12 list-none space-y-5 text-4xl leading-snug">
              {SHARED_PROJECT.instructions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="text-secondary-foreground mb-5 text-2xl uppercase tracking-widest">
              Kunnskap
            </p>
            <div className="flex gap-6">
              {SHARED_PROJECT.knowledge.map((file) => (
                <span
                  key={file}
                  className="bg-muted text-secondary-foreground rounded-xl px-6 py-3 text-3xl"
                >
                  {file}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      <Slide
        id="rett-konteksten"
        notes={`${COLLEAGUE} · ⏱ 24:00<br/><br/>Hvordan ser beskjæringen ut i hverdagen? Én vane: når Claude bommer, retter du ikke bare svaret — du retter konteksten, så ingen andre bommer på det samme. Ett lite klipp.<br/><br/><strong>Nevn risikoen ærlig:</strong> «alles ansvar» blir fort «ingens ansvar». Det løser seg ikke av seg selv — det er en vane teamet må bygge, og noe vi gjerne vil diskutere med dere etterpå.`}
      >
        <div className="flex h-[1080px] flex-col justify-center gap-20 px-32">
          <h2 className="text-primary-foreground text-7xl">Rett konteksten — ikke bare svaret.</h2>
          <div className="flex items-center gap-8 text-4xl">
            {FIX_THE_CONTEXT.map((step, i) => (
              <div key={step} className="flex items-center gap-8">
                {i > 0 && <span className="text-secondary-foreground">→</span>}
                <p
                  className={`rounded-2xl border px-8 py-6 ${i === 1 ? 'border-primary text-primary-foreground' : 'border-border/40 text-secondary-foreground'}`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      <Slide
        id="tid-til-valg"
        notes={`${COLLEAGUE} · ⏱ 25:15<br/><br/>Så hva skjer med møtene? De forsvinner ikke — de skifter formål. Når informasjonen bor i konteksten, trenger vi ikke samles for å kringkaste den.<br/><br/>Men å lage ting er blitt billig, og da blir valget om hva som er verdt å lage det dyre. Tiden sammen går til valg og dømmekraft — ikke til å dele informasjon.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-16 px-28 text-center">
          <div className="flex flex-col gap-6">
            <p className="text-primary-foreground text-7xl">Om oversettelse er billig,</p>
            <p className="text-primary-foreground text-7xl">blir ikke valget billig.</p>
          </div>
          <p className="fragment text-secondary-foreground text-5xl">
            Tiden sammen er til valg — ikke til å dele informasjon.
          </p>
        </div>
      </Slide>

      <Slide
        id="hver-for-oss-sammen"
        notes={`${COLLEAGUE} · ⏱ 26:15<br/><br/>Så hva betyr det for hver rolle? Venstre kolonne er det Claude gjør for deg alene — fortsett med det. Høyre kolonne er beskjæringen: slik eier du din del av den felles konteksten.<br/><br/>Gjør eksemplene konkrete for AKT der dere kan.`}
      >
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

      <Slide
        id="rollene-skiller-seg"
        transition="fade"
        notes={`${ME} · ⏱ 27:15<br/><br/>Tilbake til veveriet. I lang tid slo vi de tre rollene sammen og kalte det «programmør» — en historisk tilfeldighet som varte så lenge at vi glemte at de var separate.<br/><br/>Nå skiller de seg igjen. Oversettelsen blir billig, utførelsen har vært automatisk lenge. Mønsterdesignet står igjen: forståelsen. Men den får ikke plass i ett hode lenger.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-12">
          <h2 className="text-primary-foreground text-6xl">Rollene skiller seg igjen</h2>
          <RoleTriptych automated={true} />
        </div>
      </Slide>

      <Slide
        id="close"
        transition="fade"
        notes={`${BOTH} · ⏱ 28:15<br/><br/><strong>Kollega:</strong> «Så — hvordan samarbeider vi, når hver av oss har en Claude?»<br/><strong>Mathias:</strong> les svaret på sliden, pause. Så: «Bestefar satt alene ved mønsterbordet. Det gjør ingen av oss lenger.»<br/><br/><strong>Kollega:</strong> «Vi har gitt dere vårt svar. Nå vil vi høre deres.» → diskusjon.`}
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-14 px-32 text-center">
          <p className="text-secondary-foreground text-5xl">
            Hvordan samarbeider vi — når hver av oss har en Claude?
          </p>
          <p className="text-primary-foreground text-8xl leading-tight">
            Fra hver sin Claude —
            <br />
            til en kontekst vi eier sammen.
          </p>
        </div>
      </Slide>

      {/* ───────────── Diskusjon (begge, 29–45) ───────────── */}

      <Slide
        id="diskusjon"
        transition="fade"
        notes={`${BOTH} · ⏱ 29:00 · Diskusjon ~15 min<br/><br/>Start med den trygge åpneren (siste spørsmål) om det er stille. Én av dere modererer hvert spørsmål; plukk 2–3.<br/><br/>Frø i baklomma: fagfolk vet hvorfor reglene er som de er (unntak, historikk, politiske hensyn) — det står aldri i koden. Det første som bør inn i den felles konteksten er ofte det alle spør den samme personen om.`}
      >
        <div className="flex h-[1080px] flex-col justify-center gap-14 px-40">
          <h2 className="text-secondary-foreground text-4xl uppercase tracking-widest opacity-70">
            Diskusjon
          </h2>
          <ul className="text-primary-foreground list-none space-y-12 text-5xl leading-snug">
            <li>Hvem beskjærer konteksten hos dere i dag — om noen?</li>
            <li>Hvilket møte kunne vært en side i konteksten i stedet?</li>
            <li>Hva vet du som Claude aldri vil finne på egen hånd?</li>
            <li className="text-secondary-foreground">
              Bruker dere Claude mest hver for dere eller sammen?
            </li>
          </ul>
        </div>
      </Slide>
    </DeckShell>
  );
}
