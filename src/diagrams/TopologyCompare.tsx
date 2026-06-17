import { Diagram } from '../deck/Diagram';

const VIEW_W = 1920;
const VIEW_H = 900;

const CLIENT_R = 50;
const SERVER_W = 180;
const SERVER_H = 140;

function ClientNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={CLIENT_R}
        fill="hsl(var(--background))"
        stroke="hsl(var(--foreground))"
        strokeWidth={3}
      />
      <text
        x={x}
        y={y + 7}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize={20}
        fontWeight={700}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        {label}
      </text>
    </g>
  );
}

function ServerNode({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect
        x={x - SERVER_W / 2}
        y={y - SERVER_H / 2}
        width={SERVER_W}
        height={SERVER_H}
        rx={10}
        fill="hsl(var(--background))"
        stroke="hsl(var(--primary))"
        strokeWidth={3}
      />
      <text
        x={x}
        y={y + 9}
        textAnchor="middle"
        fill="hsl(var(--primary))"
        fontSize={26}
        fontWeight={700}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        SERVER
      </text>
    </g>
  );
}

function Link({
  x1,
  y1,
  x2,
  y2,
  color = 'hsl(var(--foreground) / 0.55)',
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} />;
}

function SectionTitle({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="hsl(var(--foreground))"
      fontSize={32}
      fontWeight={700}
      fontFamily="JetBrains Mono, ui-monospace, monospace"
      letterSpacing={2}
    >
      {children}
    </text>
  );
}

function SectionSubtitle({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="hsl(var(--foreground) / 0.65)"
      fontSize={22}
      fontFamily="Open Sans, ui-sans-serif, sans-serif"
    >
      {children}
    </text>
  );
}

function GameExamples({ x, y, games }: { x: number; y: number; games: string[] }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="hsl(var(--foreground) / 0.85)"
      fontSize={26}
      fontWeight={600}
      fontFamily="Open Sans, ui-sans-serif, sans-serif"
    >
      {games.join('  ·  ')}
    </text>
  );
}

// 4 clients in a square layout per panel
function squarePositions(cx: number, cy: number, size: number) {
  const half = size / 2;
  return [
    { x: cx - half, y: cy - half, label: 'A' },
    { x: cx + half, y: cy - half, label: 'B' },
    { x: cx - half, y: cy + half, label: 'C' },
    { x: cx + half, y: cy + half, label: 'D' },
  ];
}

export function TopologyCompare() {
  const PANEL_HALF = 220;

  const P2P_CX = VIEW_W * 0.26;
  const P2P_CY = 460;
  const p2pClients = squarePositions(P2P_CX, P2P_CY, PANEL_HALF * 2);

  const SA_CX = VIEW_W * 0.74;
  const SA_CY = 460;
  const saClients = squarePositions(SA_CX, SA_CY, PANEL_HALF * 2);

  // All pairs for P2P mesh
  const p2pPairs: [number, number][] = [];
  for (let i = 0; i < p2pClients.length; i++) {
    for (let j = i + 1; j < p2pClients.length; j++) {
      p2pPairs.push([i, j]);
    }
  }

  return (
    <Diagram viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mx-auto h-[70vh] w-full">
      {/* Section titles */}
      <SectionTitle x={P2P_CX} y={80}>
        PEER-TO-PEER
      </SectionTitle>
      <SectionSubtitle x={P2P_CX} y={120}>
        Every client talks to every other client
      </SectionSubtitle>

      <SectionTitle x={SA_CX} y={80}>
        SERVER-AUTHORITATIVE
      </SectionTitle>
      <SectionSubtitle x={SA_CX} y={120}>
        Clients only talk to the server
      </SectionSubtitle>

      {/* Divider */}
      <line
        x1={VIEW_W / 2}
        y1={170}
        x2={VIEW_W / 2}
        y2={VIEW_H - 80}
        stroke="hsl(var(--foreground) / 0.2)"
        strokeWidth={2}
        strokeDasharray="6 8"
      />

      {/* P2P links (drawn before nodes so nodes sit on top) */}
      {p2pPairs.map(([i, j]) => (
        <Link
          key={`p2p-${i}-${j}`}
          x1={p2pClients[i].x}
          y1={p2pClients[i].y}
          x2={p2pClients[j].x}
          y2={p2pClients[j].y}
        />
      ))}

      {/* Server-auth links */}
      {saClients.map((c, i) => (
        <Link
          key={`sa-${i}`}
          x1={c.x}
          y1={c.y}
          x2={SA_CX}
          y2={SA_CY}
          color="hsl(var(--primary) / 0.7)"
        />
      ))}

      {/* Nodes */}
      {p2pClients.map((c, i) => (
        <ClientNode key={`p2p-c-${i}`} x={c.x} y={c.y} label={c.label} />
      ))}
      {saClients.map((c, i) => (
        <ClientNode key={`sa-c-${i}`} x={c.x} y={c.y} label={c.label} />
      ))}
      <ServerNode x={SA_CX} y={SA_CY} />

      {/* Game examples */}
      <GameExamples x={P2P_CX} y={VIEW_H - 90} games={['Among Us', 'GTA Online', 'Age of Empires II']} />
      <GameExamples
        x={SA_CX}
        y={VIEW_H - 90}
        games={['World of Warcraft', 'Counter-Strike', 'League of Legends']}
      />

      {/* Footnotes */}
      <text
        x={P2P_CX}
        y={VIEW_H - 40}
        textAnchor="middle"
        fill="hsl(var(--foreground) / 0.6)"
        fontSize={20}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        n² connections · no single source of truth · easy to cheat
      </text>
      <text
        x={SA_CX}
        y={VIEW_H - 40}
        textAnchor="middle"
        fill="hsl(var(--foreground) / 0.6)"
        fontSize={20}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        n connections · server owns the state · cheat-resistant
      </text>
    </Diagram>
  );
}
