import { useFragment } from './useFragment';

/**
 * Maps the slide's fragment progress onto named steps — the bridge between reveal's clicks
 * and Motion's state-driven `animate`. The first name is the state before any fragment is
 * shown; each shown fragment advances one name; extra fragments clamp to the last.
 *
 *   const step = useStep(['pot', 'grown', 'pruned'] as const);
 *   <motion.g animate={step === 'pot' ? { scale: 0 } : { scale: 1 }} />
 *
 * The fragments themselves can be visible content (`className="fragment"`) or hidden
 * triggers (`<span className="fragment" style={{ display: 'none' }} />`).
 */
export function useStep<const T extends string>(steps: readonly [T, ...T[]]): T {
  const { index } = useFragment();
  const position = Math.min(Math.max(index + 1, 0), steps.length - 1);
  return steps[position] as T;
}
