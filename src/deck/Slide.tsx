import { useRef } from 'react';
import type { ReactNode } from 'react';
import { SlideContext } from './slideContext';

export type SlideTransition = 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';

export interface SlideProps {
  children?: ReactNode;
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
        {notes ? (
          // Rendered as HTML so notes can contain markup like <br/>, <strong>, <ul>, etc.
          <aside className="notes" dangerouslySetInnerHTML={{ __html: notes }} />
        ) : null}
      </section>
    </SlideContext.Provider>
  );
}
