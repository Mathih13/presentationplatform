import { useContext } from 'react';
import { DiagramContext } from './diagramContext';
import { useFragment } from './useFragment';
import type { ChartColor } from './AnimatedArrow';

export type BoxState = 'idle' | 'highlight' | 'dim';

export interface AnimatedBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  activeAt?: number;
  color?: ChartColor;
  id?: string;
}

export function AnimatedBox({
  x,
  y,
  width,
  height,
  label,
  activeAt,
  color = 'chart-1',
  id,
}: AnimatedBoxProps) {
  const ctx = useContext(DiagramContext);
  if (!ctx) {
    throw new Error('AnimatedBox must be rendered inside <Diagram>');
  }
  const { index } = useFragment();

  const state: BoxState =
    activeAt === undefined ? 'idle' : index >= activeAt ? 'highlight' : 'idle';
  const fillColor = `hsl(var(--${color}))`;

  const rectStyle = {
    opacity: state === 'highlight' ? 1 : state === 'dim' ? 0.2 : 0.55,
    strokeWidth: state === 'highlight' ? 6 : 2,
    filter: state === 'highlight' ? 'drop-shadow(0 0 12px currentColor)' : 'none',
  };

  return (
    <g data-id={id} data-state={state} className="animated-box">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={fillColor}
        stroke={fillColor}
        style={rectStyle}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="hsl(var(--foreground))"
        fontSize={width / 8}
        fontFamily="Open Sans, system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}
