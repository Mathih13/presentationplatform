import { AnimatedArrow } from '../deck/AnimatedArrow';
import { Diagram } from '../deck/Diagram';

interface IconProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MonitorProps extends IconProps {
  src?: string;
}

function ServerIcon({ x, y, w, h }: IconProps) {
  const units = 3;
  const unitGap = 4;
  const unitH = h / units;
  const innerH = unitH - unitGap;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      {Array.from({ length: units }, (_, i) => {
        const cy = i * unitH + innerH / 2;
        return (
          <g key={i}>
            <rect
              x={0}
              y={i * unitH}
              width={w}
              height={innerH}
              fill="hsl(var(--foreground))"
              rx={6}
            />
            <rect
              x={16}
              y={cy - 3}
              width={Math.max(48, w * 0.32)}
              height={6}
              fill="hsl(var(--background))"
              rx={2}
            />
            <rect
              x={16 + w * 0.32 + 12}
              y={cy - 3}
              width={Math.max(16, w * 0.12)}
              height={6}
              fill="hsl(var(--background))"
              rx={2}
            />
            <circle cx={w - 22} cy={cy} r={8} fill="hsl(var(--background))" />
          </g>
        );
      })}
    </g>
  );
}

function DatabaseIcon({ x, y, w, h }: IconProps) {
  const ry = 22;
  const sectionH = h / 3;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <path
        d={`M 0 ${ry} L 0 ${h - ry} A ${w / 2} ${ry} 0 0 0 ${w} ${h - ry} L ${w} ${ry} Z`}
        fill="hsl(var(--foreground))"
      />
      <ellipse cx={w / 2} cy={ry} rx={w / 2} ry={ry} fill="hsl(var(--foreground))" />
      <ellipse
        cx={w / 2}
        cy={sectionH}
        rx={w / 2}
        ry={ry}
        fill="none"
        stroke="hsl(var(--background))"
        strokeWidth={4}
      />
      <ellipse
        cx={w / 2}
        cy={2 * sectionH}
        rx={w / 2}
        ry={ry}
        fill="none"
        stroke="hsl(var(--background))"
        strokeWidth={4}
      />
    </g>
  );
}

function ClientMonitor({ x, y, w, h, src }: MonitorProps) {
  const bezel = 12;
  const screenW = w - 2 * bezel;
  const screenH = h - 2 * bezel;
  const standW = 56;
  const baseW = 130;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect width={w} height={h} rx={12} fill="hsl(var(--foreground))" />
      <rect x={bezel} y={bezel} width={screenW} height={screenH} fill="hsl(var(--background))" />
      {src ? (
        <image
          href={src}
          x={bezel}
          y={bezel}
          width={screenW}
          height={screenH}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : null}
      <rect x={(w - standW) / 2} y={h} width={standW} height={18} fill="hsl(var(--foreground))" />
      <rect
        x={(w - baseW) / 2}
        y={h + 16}
        width={baseW}
        height={10}
        fill="hsl(var(--foreground))"
        rx={4}
      />
    </g>
  );
}

interface LabelProps {
  x: number;
  y: number;
  children: string;
  anchor?: 'start' | 'middle' | 'end';
}

function Label({ x, y, children, anchor = 'middle' }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="hsl(var(--foreground))"
      fontSize={16}
      fontFamily="JetBrains Mono, ui-monospace, monospace"
    >
      {children}
    </text>
  );
}

const VIEW_W = 1680;
const VIEW_H = 1000;

const SERVER = { x: VIEW_W * 0.46, y: 220, w: 220, h: 220 };
const DB = { x: VIEW_W * 0.82, y: 220, w: 160, h: 220 };
const MONITOR_W = 300;
const MONITOR_H = 230;
const CLIENT_A = { x: VIEW_W * 0.25, y: 760, w: MONITOR_W, h: MONITOR_H };
const CLIENT_B = { x: VIEW_W * 0.67, y: 760, w: MONITOR_W, h: MONITOR_H };

const ARROW_COLOR = 'foreground';

import { WOW_LABELS } from './serverAuthLabels';
import type { ServerAuthLabels } from './serverAuthLabels';

export interface ServerAuthDiagramProps {
  clientImageA?: string;
  clientImageB?: string;
  labels?: ServerAuthLabels;
}

export function ServerAuthDiagram({
  clientImageA,
  clientImageB,
  labels = WOW_LABELS,
}: ServerAuthDiagramProps) {
  // Anchor points
  const serverBottom = SERVER.y + SERVER.h / 2;
  const serverRight = SERVER.x + SERVER.w / 2;
  const dbLeft = DB.x - DB.w / 2;
  const monitorATop = CLIENT_A.y - CLIENT_A.h / 2;
  const monitorBTop = CLIENT_B.y - CLIENT_B.h / 2;

  return (
    <Diagram viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mx-auto h-[80vh] w-full">
      <ServerIcon {...SERVER} />
      <DatabaseIcon {...DB} />
      <ClientMonitor {...CLIENT_A} src={clientImageA} />
      <ClientMonitor {...CLIENT_B} src={clientImageB} />

      {/* Client A → Server: tryMove (parallel, left of the pair) */}
      <AnimatedArrow
        from={{ x: CLIENT_A.x - 30, y: monitorATop - 4 }}
        to={{ x: SERVER.x - 50, y: serverBottom + 4 }}
        appear="draw"
        color={ARROW_COLOR}
        strokeWidth={3}
      />
      <Label x={340} y={monitorATop - 65} anchor="middle">
        {labels.clientRequest}
      </Label>

      {/* Server → Client A: movePlayer + createMonster (parallel, right of the pair) */}
      <AnimatedArrow
        from={{ x: SERVER.x + 10, y: serverBottom + 4 }}
        to={{ x: CLIENT_A.x + 30, y: monitorATop - 4 }}
        appear="draw"
        color={ARROW_COLOR}
        strokeWidth={3}
      />
      <Label x={690} y={monitorATop - 105} anchor="middle">
        {labels.serverBroadcast}
      </Label>
      <Label x={690} y={monitorATop - 67} anchor="middle">
        {labels.serverInitiated}
      </Label>

      {/* Server → Client B: movePlayer + createMonster */}
      <AnimatedArrow
        from={{ x: SERVER.x + 100, y: serverBottom + 4 }}
        to={{ x: CLIENT_B.x, y: monitorBTop - 4 }}
        appear="draw"
        color={ARROW_COLOR}
        strokeWidth={3}
      />
      <Label x={920} y={monitorBTop - 105} anchor="middle">
        {labels.serverBroadcast}
      </Label>
      <Label x={920} y={monitorBTop - 67} anchor="middle">
        {labels.serverInitiated}
      </Label>

      {/* Server → DB: updatePlayerPos */}
      <AnimatedArrow
        from={{ x: serverRight + 4, y: SERVER.y - 30 }}
        to={{ x: dbLeft - 4, y: DB.y - 30 }}
        appear="draw"
        color={ARROW_COLOR}
        strokeWidth={3}
      />
      <Label x={(serverRight + dbLeft) / 2} y={SERVER.y - 50}>
        {labels.serverPersist}
      </Label>

      {/* DB → Server: getMonsterTimer */}
      <AnimatedArrow
        from={{ x: dbLeft - 4, y: DB.y + 30 }}
        to={{ x: serverRight + 4, y: SERVER.y + 30 }}
        appear="draw"
        color={ARROW_COLOR}
        strokeWidth={3}
      />
      <Label x={(serverRight + dbLeft) / 2} y={SERVER.y + 60}>
        {labels.serverRead}
      </Label>
    </Diagram>
  );
}
