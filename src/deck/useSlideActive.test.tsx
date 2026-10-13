import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrictMode } from 'react';
import { act, render, waitFor } from '@testing-library/react';

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
import { useSlideActive } from './useSlideActive';

beforeEach(() => {
  mockState.reset();
});

function ActiveInspector({ testId }: { testId: string }) {
  return <span data-testid={testId}>{String(useSlideActive())}</span>;
}

describe('useSlideActive', () => {
  it('is true only for the slide currently being presented', async () => {
    const { getByTestId } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <ActiveInspector testId="s1" />
          </Slide>
          <Slide id="s2">
            <ActiveInspector testId="s2" />
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => expect(mockState.instances.at(-1)?.inited).toBe(true));
    const reveal = mockState.instances.at(-1)!;
    act(() => reveal.navigateToSlide(reveal.root.querySelector('section')!, 0));

    await waitFor(() => {
      expect(getByTestId('s1').textContent).toBe('true');
      expect(getByTestId('s2').textContent).toBe('false');
    });

    const second = reveal.root.querySelectorAll('section')[1] as HTMLElement;
    act(() => reveal.navigateToSlide(second, 1));

    await waitFor(() => {
      expect(getByTestId('s1').textContent).toBe('false');
      expect(getByTestId('s2').textContent).toBe('true');
    });
  });
});
