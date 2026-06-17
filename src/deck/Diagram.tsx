import { useId } from 'react';
import type { ReactNode } from 'react';
import { DiagramContext } from './diagramContext';

export interface DiagramProps {
  viewBox?: string;
  className?: string;
  children?: ReactNode;
}

export function Diagram({ viewBox = '0 0 1920 1080', className, children }: DiagramProps) {
  const reactId = useId().replace(/:/g, '');
  const arrowMarkerId = `arrow-${reactId}`;

  return (
    <DiagramContext.Provider value={{ arrowMarkerId }}>
      <svg
        viewBox={viewBox}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id={arrowMarkerId}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
          </marker>
        </defs>
        {children}
      </svg>
    </DiagramContext.Provider>
  );
}
