import { createContext, useContext } from 'react';
import type Reveal from 'reveal.js';

export interface DeckIndices {
  h: number;
  v: number;
  f: number;
}

export interface DeckContextValue {
  reveal: Reveal.Api | null;
  indices: DeckIndices;
  isDark: boolean;
  setDark: (dark: boolean) => void;
}

export const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeck(): DeckContextValue {
  const ctx = useContext(DeckContext);
  if (!ctx) {
    throw new Error('useDeck must be called inside <DeckShell>');
  }
  return ctx;
}
