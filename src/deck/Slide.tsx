import { useContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { NotesContext } from './notesContext';
import { SlideContext } from './slideContext';

export type SlideTransition = 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';

export interface SlideProps {
  children?: ReactNode;
  /** Notes as HTML. Without it, the slide uses its section from the talk's notes file. */
  notes?: string;
  transition?: SlideTransition;
  autoAnimate?: boolean;
  autoAnimateDuration?: number;
  autoAnimateEasing?: string;
  autoAnimateDelay?: number;
  id?: string;
}

export function Slide({
  children,
  notes,
  transition,
  autoAnimate,
  autoAnimateDuration,
  autoAnimateEasing,
  autoAnimateDelay,
  id,
}: SlideProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const fromFile = useContext(NotesContext);
  const html = notes ?? (id ? fromFile[id] : undefined);
  return (
    <SlideContext.Provider value={{ sectionRef }}>
      <section
        ref={sectionRef}
        id={id}
        data-id={id}
        data-transition={transition}
        data-auto-animate={autoAnimate ? '' : undefined}
        data-auto-animate-duration={autoAnimateDuration}
        data-auto-animate-easing={autoAnimateEasing}
        data-auto-animate-delay={autoAnimateDelay}
      >
        {children}
        {html ? (
          // Rendered as HTML so notes can contain markup like <br/>, <strong>, <ul>, etc.
          <aside className="notes" dangerouslySetInnerHTML={{ __html: html }} />
        ) : null}
      </section>
    </SlideContext.Provider>
  );
}
