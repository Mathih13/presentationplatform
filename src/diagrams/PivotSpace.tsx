import type { ReactNode } from 'react';

// A nested <svg> whose viewport origin is the user-space origin, so `pivot(p)` (see pivot.ts)
// rotates and scales around exactly p — whatever the outer viewBox or camera is doing.
export function PivotSpace({ children }: { children: ReactNode }) {
  return <svg overflow="visible">{children}</svg>;
}
