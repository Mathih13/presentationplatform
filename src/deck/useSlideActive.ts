import { useCallback, useContext, useSyncExternalStore } from 'react';
import { SlideContext } from './slideContext';
import { useDeck } from './useDeck';

/**
 * Whether the slide this component lives in is the one being presented.
 *
 * Every slide is mounted when the deck loads, so Motion animations that run on mount play
 * off-screen. Gate entrance choreography on this instead:
 *
 *   const active = useSlideActive();
 *   <motion.path animate={{ pathLength: active ? 1 : 0 }} />
 */
export function useSlideActive(): boolean {
  const slideCtx = useContext(SlideContext);
  if (!slideCtx) {
    throw new Error('useSlideActive must be called inside <Slide>');
  }
  const { reveal } = useDeck();

  const subscribe = useCallback(
    (notify: () => void) => {
      queueMicrotask(notify);
      if (!reveal) return () => {};
      reveal.on('ready', notify);
      reveal.on('slidechanged', notify);
      return () => {
        reveal.off('ready', notify);
        reveal.off('slidechanged', notify);
      };
    },
    [reveal]
  );

  return useSyncExternalStore(subscribe, () => {
    const section = slideCtx.sectionRef.current;
    return !!section && !!reveal && reveal.getCurrentSlide() === section;
  });
}
