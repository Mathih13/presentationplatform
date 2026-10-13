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
import { Code } from './Code';

beforeEach(() => {
  mockState.reset();
});

describe('Code', () => {
  it('renders source split into one line element per source line', async () => {
    const source = 'const a = 1;\nconst b = 2;\nconst c = 3;';
    const { container } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <Code lang="typescript">{source}</Code>
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      const lines = container.querySelectorAll('[data-line]');
      expect(lines).toHaveLength(3);
    });
  });

  it('marks every line active in static mode (no steps)', async () => {
    const source = 'const a = 1;\nconst b = 2;\nconst c = 3;';
    const { container } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <Code lang="typescript">{source}</Code>
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      const lines = container.querySelectorAll('[data-line]');
      expect(lines).toHaveLength(3);
      lines.forEach((line) => {
        expect(line.getAttribute('data-state')).toBe('active');
      });
    });
  });

  it('marks step 0 lines active and others dim when steps are provided', async () => {
    const source = 'line1\nline2\nline3\nline4\nline5';
    const { container } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <Code lang="typescript" steps={[{ lines: '1-2' }, { lines: '4-5' }]}>
              {source}
            </Code>
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      const lines = container.querySelectorAll('[data-line]');
      expect(lines).toHaveLength(5);
      expect(lines[0]!.getAttribute('data-state')).toBe('active');
      expect(lines[1]!.getAttribute('data-state')).toBe('active');
      expect(lines[2]!.getAttribute('data-state')).toBe('dim');
      expect(lines[3]!.getAttribute('data-state')).toBe('dim');
      expect(lines[4]!.getAttribute('data-state')).toBe('dim');
    });
  });

  it('advances the active set as fragments are shown', async () => {
    const source = 'line1\nline2\nline3\nline4\nline5';
    const { container } = render(
      <StrictMode>
        <DeckShell>
          <Slide id="s1">
            <Code lang="typescript" steps={[{ lines: '1-2' }, { lines: '4-5' }]}>
              {source}
            </Code>
          </Slide>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(1);
      const line1 = container.querySelector('[data-line="1"]');
      expect(line1?.getAttribute('data-state')).toBe('active');
    });

    const instance = mockState.instances[0]!;
    const s1 = document.getElementById('s1')!;
    instance.navigateToSlide(s1, 0, 0);
    instance.showFragment(0);

    await waitFor(() => {
      expect(container.querySelector('[data-line="1"]')?.getAttribute('data-state')).toBe('dim');
      expect(container.querySelector('[data-line="4"]')?.getAttribute('data-state')).toBe('active');
      expect(container.querySelector('[data-line="5"]')?.getAttribute('data-state')).toBe('active');
    });
  });
});
