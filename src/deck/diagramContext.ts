import { createContext } from 'react';

export interface DiagramContextValue {
  arrowMarkerId: string;
}

export const DiagramContext = createContext<DiagramContextValue | null>(null);
