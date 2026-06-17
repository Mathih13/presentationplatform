import { useContext, useEffect, useRef } from 'react';
import { DiagramContext } from './diagramContext';

export interface Point {
  x: number;
  y: number;
}

export type ArrowAppear = 'draw' | 'fade' | 'slide';
export type ChartColor = 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5';
export type ThemeColor =
  | ChartColor
  | 'foreground'
  | 'muted-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | (string & {});

function isRawColor(value: string): boolean {
  return (
    value.startsWith('#') ||
    value.startsWith('hsl') ||
    value.startsWith('rgb') ||
    value.startsWith('oklch') ||
    value === 'currentColor' ||
    value === 'transparent'
  );
}

export interface AnimatedArrowProps {
  from: Point;
  to: Point;
  appear?: ArrowAppear;
  color?: ThemeColor;
  strokeWidth?: number;
  id?: string;
  showOriginDot?: boolean;
}

export function AnimatedArrow({
  from,
  to,
  appear = 'fade',
  color = 'chart-1',
  strokeWidth = 4,
  id,
  showOriginDot = false,
}: AnimatedArrowProps) {
  const ctx = useContext(DiagramContext);
  if (!ctx) {
    throw new Error('AnimatedArrow must be rendered inside <Diagram>');
  }
  const groupRef = useRef<SVGGElement | null>(null);
  const lineRef = useRef<SVGLineElement | null>(null);
  const headRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const fullLength = Math.sqrt(dx * dx + dy * dy);
  const colorValue = isRawColor(color) ? color : `hsl(var(--${color}))`;

  const angle = Math.atan2(dy, dx);
  const headSize = strokeWidth * 3.5;
  const headAngle = Math.PI / 6;
  const hx1 = to.x - headSize * Math.cos(angle - headAngle);
  const hy1 = to.y - headSize * Math.sin(angle - headAngle);
  const hx2 = to.x - headSize * Math.cos(angle + headAngle);
  const hy2 = to.y - headSize * Math.sin(angle + headAngle);
  const headD = `M ${to.x} ${to.y} L ${hx1} ${hy1} L ${hx2} ${hy2} Z`;

  // Stop the line geometry at the back of the arrowhead, so the filled
  // triangle visually continues the stroke rather than floating past it.
  const headProjection = headSize * Math.cos(headAngle);
  const ux = fullLength === 0 ? 0 : dx / fullLength;
  const uy = fullLength === 0 ? 0 : dy / fullLength;
  const lineX2 = to.x - ux * headProjection;
  const lineY2 = to.y - uy * headProjection;
  const length = Math.max(0, fullLength - headProjection);

  const reactDriven = appear === 'draw' || appear === 'slide';

  useEffect(() => {
    const group = groupRef.current;
    const line = lineRef.current;
    const head = headRef.current;
    if (!group || !line || !head) return;
    if (!reactDriven) return;

    let shown = group.classList.contains('visible');

    const reconcile = () => {
      const nowVisible = group.classList.contains('visible');
      if (nowVisible === shown) return;
      shown = nowVisible;
      if (appear === 'draw') {
        line.animate(
          nowVisible
            ? [{ strokeDashoffset: length }, { strokeDashoffset: 0 }]
            : [{ strokeDashoffset: 0 }, { strokeDashoffset: length }],
          { duration: nowVisible ? 700 : 250, easing: 'ease', fill: 'forwards' }
        );
        head.animate(
          nowVisible ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
          {
            duration: nowVisible ? 180 : 150,
            delay: nowVisible ? 600 : 0,
            easing: 'ease',
            fill: 'forwards',
          }
        );
        const dot = dotRef.current;
        if (dot) {
          dot.animate(
            nowVisible ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
            { duration: 150, easing: 'ease', fill: 'forwards' }
          );
        }
      } else if (appear === 'slide') {
        const keyframesIn = [
          { opacity: 0, transform: 'translateX(-40px)' },
          { opacity: 1, transform: 'translateX(0)' },
        ];
        group.animate(nowVisible ? keyframesIn : keyframesIn.slice().reverse(), {
          duration: nowVisible ? 300 : 200,
          easing: 'ease',
          fill: 'forwards',
        });
      }
    };

    const observer = new MutationObserver(reconcile);
    observer.observe(group, { attributes: true, attributeFilter: ['class'] });
    reconcile();
    return () => observer.disconnect();
  }, [appear, length, reactDriven]);

  const className = reactDriven ? 'fragment custom arrow-anchor' : 'fragment';

  const lineInitialStyle =
    appear === 'draw' ? { strokeDasharray: length, strokeDashoffset: length } : undefined;
  const headInitialStyle = appear === 'draw' ? { opacity: 0 } : undefined;

  return (
    <g
      ref={groupRef}
      className={className}
      data-id={id}
      data-arrow-marker-fallback={ctx.arrowMarkerId}
    >
      <line
        ref={lineRef}
        x1={from.x}
        y1={from.y}
        x2={lineX2}
        y2={lineY2}
        stroke={colorValue}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        data-arrow-appear={appear}
        style={lineInitialStyle}
      />
      <path ref={headRef} d={headD} fill={colorValue} style={headInitialStyle} />
      {showOriginDot ? (
        <circle
          ref={dotRef}
          cx={from.x}
          cy={from.y}
          r={strokeWidth * 1.5}
          fill={colorValue}
          style={reactDriven ? { opacity: 0 } : undefined}
        />
      ) : null}
    </g>
  );
}
