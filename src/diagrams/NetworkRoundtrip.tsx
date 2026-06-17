import type { CSSProperties } from 'react';
import { AnimatedArrow } from '../deck/AnimatedArrow';
import { Diagram } from '../deck/Diagram';

type ColumnKind = 'endpoint-code' | 'endpoint-data' | 'app' | 'kernel' | 'lan';

interface ColumnDef {
  topLabel?: string;
  botLabel?: string;
  centerLabel?: string;
  kind: ColumnKind;
}

const COLUMNS: ColumnDef[] = [
  { centerLabel: 'YOUR CODE', kind: 'endpoint-code' },
  { topLabel: 'SERIALIZE', botLabel: 'DESERIALIZE', kind: 'app' },
  { topLabel: 'SEND', botLabel: 'RECV', kind: 'app' },
  { topLabel: 'KERNEL BUFFER', botLabel: 'KERNEL BUFFER', kind: 'kernel' },
  { topLabel: 'IP LAYER', botLabel: 'IP LAYER', kind: 'kernel' },
  { topLabel: 'LINK LAYER', botLabel: 'LINK LAYER', kind: 'kernel' },
  { topLabel: 'NIC', botLabel: 'NIC', kind: 'kernel' },
  { centerLabel: 'LAN', kind: 'lan' },
  { topLabel: 'NIC', botLabel: 'NIC', kind: 'kernel' },
  { topLabel: 'LINK LAYER', botLabel: 'LINK LAYER', kind: 'kernel' },
  { topLabel: 'IP LAYER', botLabel: 'IP LAYER', kind: 'kernel' },
  { topLabel: 'KERNEL BUFFER', botLabel: 'KERNEL BUFFER', kind: 'kernel' },
  { topLabel: 'RECV', botLabel: 'SEND', kind: 'app' },
  { topLabel: 'PARSE', botLabel: 'SERIALIZE', kind: 'app' },
  { topLabel: 'PLAN/EXEC', botLabel: 'COPY', kind: 'app' },
  { centerLabel: 'YOUR DATA', kind: 'endpoint-data' },
];

const VIEW_W = 1680;
const VIEW_H = 540;
const ENDPOINT_W = 100;
const COL_W = 100;
const GAP = 4;
const TOP_Y = 30;
const COL_H = 480;

const FADE_OUT_MS = 300;
const SLIDE_MS = 800;
const SLIDE_DELAY_MS = 320;
const SLIDE_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

function fillFor(kind: ColumnKind): string {
  switch (kind) {
    case 'endpoint-code':
      return 'hsl(var(--primary))';
    case 'endpoint-data':
      return 'hsl(var(--foreground))';
    case 'app':
      return 'hsl(var(--chart-5))';
    case 'kernel':
      return 'hsl(var(--chart-1))';
    case 'lan':
      return 'hsl(var(--background))';
  }
}

function strokeFor(kind: ColumnKind): { color: string; width: number } {
  if (kind === 'lan') return { color: 'hsl(var(--foreground))', width: 2 };
  return { color: 'transparent', width: 0 };
}

function endpointLabelColor(kind: ColumnKind): string {
  if (kind === 'endpoint-code') return 'hsl(var(--primary-foreground))';
  if (kind === 'endpoint-data') return 'hsl(var(--background))';
  return 'hsl(var(--foreground))';
}

function stackLabelColor(kind: ColumnKind): string {
  if (kind === 'app') return 'hsl(var(--primary-foreground))';
  return 'hsl(var(--foreground))';
}

type ColumnLayout = ColumnDef & { x: number; width: number };

const LAYOUT: ColumnLayout[] = COLUMNS.reduce<ColumnLayout[]>((acc, col) => {
  const width = col.kind === 'endpoint-code' || col.kind === 'endpoint-data' ? ENDPOINT_W : COL_W;
  const prev = acc[acc.length - 1];
  const colX = prev ? prev.x + prev.width + GAP : 0;
  acc.push({ ...col, x: colX, width });
  return acc;
}, []);

const CODE_COL = LAYOUT[0]!;
const DATA_COL = LAYOUT[LAYOUT.length - 1]!;

const COLLAPSED_TOTAL_W = 2 * ENDPOINT_W + GAP;
const COLLAPSED_CODE_X = (VIEW_W - COLLAPSED_TOTAL_W) / 2;
const COLLAPSED_DATA_X = COLLAPSED_CODE_X + ENDPOINT_W + GAP;
const CODE_DELTA = COLLAPSED_CODE_X - CODE_COL.x;
const DATA_DELTA = COLLAPSED_DATA_X - DATA_COL.x;

export interface NetworkRoundtripProps {
  collapsed?: boolean;
}

export function NetworkRoundtrip({ collapsed = false }: NetworkRoundtripProps) {
  const topY = TOP_Y + COL_H * 0.18;
  const botY = TOP_Y + COL_H * 0.82;
  const midY = TOP_Y + COL_H / 2;

  const fadeStyle: CSSProperties = {
    opacity: collapsed ? 0 : 1,
    transition: `opacity ${FADE_OUT_MS}ms ease`,
  };

  const endpointTransform = (delta: number): CSSProperties => ({
    transform: collapsed ? `translateX(${delta}px)` : 'translateX(0px)',
    transition: `transform ${SLIDE_MS}ms ${SLIDE_EASE} ${SLIDE_DELAY_MS}ms`,
  });

  return (
    <Diagram viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mx-auto h-[72vh] w-full">
      {LAYOUT.map((col, i) => {
        const stroke = strokeFor(col.kind);
        const cx = col.x + col.width / 2;
        const isEndpoint = col.kind === 'endpoint-code' || col.kind === 'endpoint-data';
        const isLan = col.kind === 'lan';
        const style: CSSProperties = isEndpoint
          ? endpointTransform(col.kind === 'endpoint-code' ? CODE_DELTA : DATA_DELTA)
          : fadeStyle;

        return (
          <g key={i} style={style}>
            <rect
              x={col.x}
              y={TOP_Y}
              width={col.width}
              height={COL_H}
              fill={fillFor(col.kind)}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              rx={6}
            />
            {col.centerLabel && isLan ? (
              <text
                x={cx}
                y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={endpointLabelColor(col.kind)}
                fontSize={26}
                fontFamily="Open Sans, system-ui, sans-serif"
                fontWeight={700}
                letterSpacing={2}
              >
                {col.centerLabel}
              </text>
            ) : null}
            {col.centerLabel && isEndpoint ? (
              <text
                x={cx}
                y={midY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={endpointLabelColor(col.kind)}
                fontSize={22}
                fontFamily="Open Sans, system-ui, sans-serif"
                fontWeight={700}
                letterSpacing={2}
                transform={`rotate(-90, ${cx}, ${midY})`}
              >
                {col.centerLabel}
              </text>
            ) : null}
            {col.topLabel ? (
              <text
                x={cx}
                y={topY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={stackLabelColor(col.kind)}
                fontSize={16}
                fontFamily="Open Sans, system-ui, sans-serif"
                fontWeight={600}
                letterSpacing={1}
                transform={`rotate(-90, ${cx}, ${topY})`}
              >
                {col.topLabel}
              </text>
            ) : null}
            {col.botLabel ? (
              <text
                x={cx}
                y={botY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={stackLabelColor(col.kind)}
                fontSize={16}
                fontFamily="Open Sans, system-ui, sans-serif"
                fontWeight={600}
                letterSpacing={1}
                transform={`rotate(-90, ${cx}, ${botY})`}
              >
                {col.botLabel}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Outbound arrow — Your Code → Your Data */}
      <g style={fadeStyle}>
        <AnimatedArrow
          from={{ x: CODE_COL.x + CODE_COL.width, y: TOP_Y + COL_H * 0.06 }}
          to={{ x: DATA_COL.x, y: TOP_Y + COL_H * 0.06 }}
          appear="draw"
          color="#bf616a"
          strokeWidth={4}
          showOriginDot
        />
      </g>

      {/* Inbound arrow — Your Data → Your Code */}
      <g style={fadeStyle}>
        <AnimatedArrow
          from={{ x: DATA_COL.x, y: TOP_Y + COL_H * 0.94 }}
          to={{ x: CODE_COL.x + CODE_COL.width, y: TOP_Y + COL_H * 0.94 }}
          appear="draw"
          color="#bf616a"
          strokeWidth={4}
          showOriginDot
        />
      </g>
    </Diagram>
  );
}
