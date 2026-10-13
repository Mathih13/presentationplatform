import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes';
import { DeckContext } from './useDeck';
import { NotesContext } from './notesContext';
import { parseSpeakerNotes } from './speakerNotes';
import type { DeckIndices } from './useDeck';

function readInitialDark(): boolean {
  if (typeof document === 'undefined') return true;
  return document.documentElement.classList.contains('dark');
}

export interface DeckShellProps {
  children: ReactNode;
  /** The talk's speaker notes as Markdown, one `## slide-id` section per slide. */
  notes?: string;
}

export function DeckShell({ children, notes }: DeckShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState<Reveal.Api | null>(null);
  const [indices, setIndices] = useState<DeckIndices>({ h: 0, v: 0, f: -1 });
  const [isDark, setIsDarkState] = useState<boolean>(readInitialDark);

  const speakerNotes = useMemo(() => parseSpeakerNotes(notes ?? ''), [notes]);

  // A heading that matches no slide is almost always a typo or a removed slide.
  useEffect(() => {
    const ids = new Set(
      [...(rootRef.current?.querySelectorAll('section[id]') ?? [])].map((section) => section.id)
    );
    const orphans = Object.keys(speakerNotes).filter((id) => !ids.has(id));
    if (orphans.length > 0) {
      console.warn(`Speaker notes for slides that don't exist: ${orphans.join(', ')}`);
    }
  }, [speakerNotes]);

  const setDark = useCallback((dark: boolean) => {
    setIsDarkState(dark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', dark);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const sync = () => {
      setIsDarkState(html.classList.contains('dark'));
    };
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let instance: Reveal.Api | null = null;

    const timer = setTimeout(() => {
      if (cancelled || !rootRef.current) return;
      const deck = new Reveal(rootRef.current, {
        width: 1920,
        height: 1080,
        hash: true,
        progress: false,
        plugins: [RevealNotes()],
      });

      const syncIndices = () => {
        const idx = deck.getIndices();
        setIndices({ h: idx.h, v: idx.v, f: idx.f ?? -1 });
      };

      deck.on('ready', syncIndices);
      deck.on('slidechanged', syncIndices);
      deck.on('fragmentshown', syncIndices);
      deck.on('fragmenthidden', syncIndices);

      instance = deck;
      setReveal(deck);
      void deck.initialize();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      instance?.destroy();
      instance = null;
      setReveal(null);
    };
  }, []);

  return (
    <DeckContext.Provider value={{ reveal, indices, isDark, setDark }}>
      <NotesContext.Provider value={speakerNotes}>
        <div ref={rootRef} className="reveal">
          <div className="slides">{children}</div>
        </div>
      </NotesContext.Provider>
    </DeckContext.Provider>
  );
}
