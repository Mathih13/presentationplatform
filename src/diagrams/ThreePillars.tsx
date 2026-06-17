interface Pillar {
  need: string;
  needBlurb: string;
  primitive?: string;
  primitiveBlurb?: string;
}

const PILLARS: Pillar[] = [
  {
    need: 'Transactional storage',
    needBlurb: 'Durable, consistent state every client agrees on.',
    primitive: 'Tables',
    primitiveBlurb: 'A relational database, built in.',
  },
  {
    need: 'Server-side compute',
    needBlurb: 'A trusted place to validate moves, run game logic, mutate state.',
    primitive: 'Reducers',
    primitiveBlurb: 'Cloud functions over your tables — atomic, server-authoritative.',
  },
  {
    need: 'Real-time networking',
    needBlurb: 'Push state to every connected client as soon as it changes.',
    primitive: 'Subscription queries',
    primitiveBlurb: 'Clients subscribe with SQL; SpacetimeDB streams the rows.',
  },
];

interface ThreePillarsProps {
  showPrimitives?: boolean;
}

export function ThreePillars({ showPrimitives = false }: ThreePillarsProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1600px] grid-cols-3 gap-8 px-4">
      {PILLARS.map((p) => (
        <div
          key={p.need}
          className="flex flex-col rounded-2xl border border-border bg-[hsl(var(--foreground)/0.06)] p-8 text-left"
        >
          <div className="text-3xl font-semibold text-[hsl(var(--primary))]">{p.need}</div>
          <p className="mt-3 text-xl opacity-70">{p.needBlurb}</p>

          {showPrimitives && p.primitive ? (
            <>
              <div className="my-6 h-px bg-border" />
              <div className="font-mono text-2xl text-[hsl(var(--destructive))]">{p.primitive}</div>
              <p className="mt-2 text-lg opacity-70">{p.primitiveBlurb}</p>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
