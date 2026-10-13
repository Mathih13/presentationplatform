import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrictMode } from 'react';
import { render, waitFor } from '@testing-library/react';

interface MockRevealInstance {
  root: HTMLElement;
  config: unknown;
  inited: boolean;
  destroyed: boolean;
  listeners: Map<string, Set<(payload?: unknown) => void>>;
  currentSlide: HTMLElement | null;
  navigateToSlide: (section: HTMLElement, h?: number, v?: number) => void;
  showFragment: (fragmentIndex: number) => void;
  hideFragment: (fragmentIndex: number) => void;
}

const mockState = vi.hoisted(() => {
  const instances: MockRevealInstance[] = [];
  return {
    instances,
    reset: () => {
      instances.length = 0;
    },
  };
});

vi.mock('reveal.js', () => {
  class MockReveal {
    root: HTMLElement;
    config: unknown;
    inited = false;
    destroyed = false;
    listeners = new Map<string, Set<(payload?: unknown) => void>>();
    currentSlide: HTMLElement | null = null;
    currentIndices: { h: number; v: number; f: number } = { h: 0, v: 0, f: -1 };

    constructor(root: HTMLElement, config: unknown) {
      this.root = root;
      this.config = config;
      mockState.instances.push(this as unknown as MockRevealInstance);
    }

    initialize = async () => {
      this.inited = true;
      const firstSection = this.root.querySelector('section');
      this.currentSlide = (firstSection as HTMLElement | null) ?? null;
    };

    destroy = () => {
      this.destroyed = true;
      this.listeners.clear();
    };

    on = (event: string, fn: (payload?: unknown) => void) => {
      if (!this.listeners.has(event)) this.listeners.set(event, new Set());
      this.listeners.get(event)!.add(fn);
    };

    off = (event: string, fn: (payload?: unknown) => void) => {
      this.listeners.get(event)?.delete(fn);
    };

    getCurrentSlide = () => this.currentSlide;
    getIndices = () => this.currentIndices;
    dispatchEvent = () => {};

    fire = (event: string, payload?: unknown) => {
      this.listeners.get(event)?.forEach((fn) => fn(payload));
    };

    navigateToSlide = (section: HTMLElement, h = 0, v = 0) => {
      this.currentSlide = section;
      this.currentIndices = { h, v, f: -1 };
      this.fire('slidechanged', { currentSlide: section, indexh: h, indexv: v });
    };

    showFragment = (fragmentIndex: number) => {
      if (!this.currentSlide) return;
      const fragments = Array.from(this.currentSlide.querySelectorAll('.fragment'));
      const target = fragments[fragmentIndex];
      if (target) target.classList.add('visible');
      this.currentIndices = { ...this.currentIndices, f: fragmentIndex };
      this.fire('fragmentshown', { fragment: target });
    };

    hideFragment = (fragmentIndex: number) => {
      if (!this.currentSlide) return;
      const fragments = Array.from(this.currentSlide.querySelectorAll('.fragment'));
      const target = fragments[fragmentIndex];
      if (target) target.classList.remove('visible');
      this.currentIndices = { ...this.currentIndices, f: fragmentIndex - 1 };
      this.fire('fragmenthidden', { fragment: target });
    };
  }
  return { default: MockReveal };
});

vi.mock('reveal.js/plugin/notes', () => ({
  default: () => ({ id: 'notes', init: () => {} }),
}));

import { DeckShell } from './DeckShell';
import { Slide } from './Slide';
import { useFragment } from './useFragment';

beforeEach(() => {
  mockState.reset();
});

function FragmentInspector({ testId }: { testId: string }) {
  const { index, total } = useFragment();
  return <span data-testid={testId}>{`${index}|${total}`}</span>;
}

describe('useFragment', () => {
  it('reports the total fragment count for the slide it lives in', async () => {
    const { getByTestId } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <p className="fragment">A</p>
            <p className="fragment">B</p>
            <p className="fragment">C</p>
            <FragmentInspector testId="frag" />
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(getByTestId('frag').textContent).toBe('-1|3');
    });
  });

  it('increments index when fragmentshown fires on this slide', async () => {
    const { getByTestId } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <p className="fragment">A</p>
            <p className="fragment">B</p>
            <FragmentInspector testId="frag" />
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(1);
      expect(mockState.instances[0]!.inited).toBe(true);
      expect(getByTestId('frag').textContent).toBe('-1|2');
    });

    const instance = mockState.instances[0]!;
    const s1Section = document.getElementById('s1');
    expect(s1Section).not.toBeNull();
    instance.navigateToSlide(s1Section!, 0, 0);
    instance.showFragment(0);

    await waitFor(() => {
      expect(getByTestId('frag').textContent).toBe('0|2');
    });

    instance.showFragment(1);

    await waitFor(() => {
      expect(getByTestId('frag').textContent).toBe('1|2');
    });
  });

  it('scopes fragment state to the slide containing the consumer', async () => {
    const { getByTestId } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="sA">
            <p className="fragment">A1</p>
            <p className="fragment">A2</p>
            <FragmentInspector testId="frag-A" />
          </Slide>
          <Slide id="sB">
            <p className="fragment">B1</p>
            <p className="fragment">B2</p>
            <FragmentInspector testId="frag-B" />
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(1);
      expect(mockState.instances[0]!.inited).toBe(true);
    });

    const instance = mockState.instances[0]!;
    const sA = document.getElementById('sA')!;
    const sB = document.getElementById('sB')!;

    instance.navigateToSlide(sA, 0, 0);
    instance.showFragment(0);

    await waitFor(() => {
      expect(getByTestId('frag-A').textContent).toBe('0|2');
      expect(getByTestId('frag-B').textContent).toBe('-1|2');
    });

    instance.navigateToSlide(sB, 1, 0);
    instance.showFragment(0);

    await waitFor(() => {
      expect(getByTestId('frag-A').textContent).toBe('0|2');
      expect(getByTestId('frag-B').textContent).toBe('0|2');
    });
  });

  it('decrements index when fragmenthidden fires on this slide', async () => {
    const { getByTestId } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <p className="fragment">A</p>
            <p className="fragment">B</p>
            <FragmentInspector testId="frag" />
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(1);
      expect(mockState.instances[0]!.inited).toBe(true);
    });

    const instance = mockState.instances[0]!;
    const s1Section = document.getElementById('s1')!;
    instance.navigateToSlide(s1Section, 0, 0);
    instance.showFragment(0);
    instance.showFragment(1);

    await waitFor(() => {
      expect(getByTestId('frag').textContent).toBe('1|2');
    });

    instance.hideFragment(1);
    await waitFor(() => {
      expect(getByTestId('frag').textContent).toBe('0|2');
    });

    instance.hideFragment(0);
    await waitFor(() => {
      expect(getByTestId('frag').textContent).toBe('-1|2');
    });
  });
});
