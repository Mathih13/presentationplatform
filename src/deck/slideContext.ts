import { createContext } from 'react';
import type { RefObject } from 'react';

export interface SlideContextValue {
  sectionRef: RefObject<HTMLElement | null>;
}

export const SlideContext = createContext<SlideContextValue | null>(null);
