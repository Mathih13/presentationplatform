import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { useStep } from './useStep';

const fragment = vi.hoisted(() => ({ index: -1 }));

vi.mock('./useFragment', () => ({
  useFragment: () => ({
    index: fragment.index,
    total: 3,
    isVisible: (n: number) => fragment.index >= n,
  }),
}));

const STEPS = ['pot', 'grown', 'pruned'] as const;

function Probe() {
  return <span data-testid="step">{useStep(STEPS)}</span>;
}

const stepAt = (index: number) => {
  fragment.index = index;
  const { getByTestId, unmount } = render(<Probe />);
  const step = getByTestId('step').textContent;
  unmount();
  return step;
};

describe('useStep', () => {
  beforeEach(() => {
    fragment.index = -1;
  });

  it('returns the first step before any fragment is shown', () => {
    expect(stepAt(-1)).toBe('pot');
  });

  it('advances one step per shown fragment', () => {
    expect(stepAt(0)).toBe('grown');
    expect(stepAt(1)).toBe('pruned');
  });

  it('clamps to the last step when there are more fragments than steps', () => {
    expect(stepAt(5)).toBe('pruned');
  });
});
