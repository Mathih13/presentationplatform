import { useCallback, useContext, useSyncExternalStore } from 'react';
import { SlideContext } from './slideContext';
import { useDeck } from './useDeck';

export interface UseFragmentResult {
  index: number;
  total: number;
  isVisible: (n: number) => boolean;
}

export function useFragment(): UseFragmentResult {
  const slideCtx = useContext(SlideContext);
  if (!slideCtx) {
    throw new Error('useFragment must be called inside <Slide>');
  }
  const { reveal } = useDeck();

  const subscribe = useCallback(
    (notify: () => void) => {
      queueMicrotask(notify);
      if (!reveal) return () => {};
      const trigger = () => notify();
      reveal.on('ready', trigger);
      reveal.on('slidechanged', trigger);
      reveal.on('fragmentshown', trigger);
      reveal.on('fragmenthidden', trigger);
      return () => {
        reveal.off('ready', trigger);
        reveal.off('slidechanged', trigger);
        reveal.off('fragmentshown', trigger);
        reveal.off('fragmenthidden', trigger);
      };
    },
    [reveal]
  );

  const index = useSyncExternalStore(subscribe, () => {
    const section = slideCtx.sectionRef.current;
    if (!section) return -1;
    const fragments = section.querySelectorAll('.fragment');
    const visibleCount = Array.from(fragments).filter((f) =>
      f.classList.contains('visible')
    ).length;
    return visibleCount - 1;
  });

  const total = useSyncExternalStore(subscribe, () => {
    const section = slideCtx.sectionRef.current;
    if (!section) return 0;
    return section.querySelectorAll('.fragment').length;
  });

  return {
    index,
    total,
    isVisible: (n: number) => index >= n,
  };
}
