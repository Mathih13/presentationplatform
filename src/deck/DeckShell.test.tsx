import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrictMode } from 'react';
import { render, waitFor } from '@testing-library/react';

interface MockRevealInstance {
  root: HTMLElement;
  config: unknown;
  inited: boolean;
  destroyed: boolean;
  listeners: Map<string, Set<(payload?: unknown) => void>>;
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

    constructor(root: HTMLElement, config: unknown) {
      this.root = root;
      this.config = config;
      mockState.instances.push(this);
    }

    initialize = async () => {
      this.inited = true;
    };

    destroy = () => {
      this.destroyed = true;
      this.listeners.clear();
    };

    getIndices = () => ({ h: 0, v: 0, f: -1 });

    on = (event: string, fn: (payload?: unknown) => void) => {
      if (!this.listeners.has(event)) this.listeners.set(event, new Set());
      this.listeners.get(event)!.add(fn);
    };

    off = (event: string, fn: (payload?: unknown) => void) => {
      this.listeners.get(event)?.delete(fn);
    };
  }

  return { default: MockReveal };
});

vi.mock('reveal.js/plugin/notes', () => {
  return { default: () => ({ id: 'notes' }) };
});

import { DeckShell } from './DeckShell';

beforeEach(() => {
  mockState.reset();
});

describe('DeckShell lifecycle', () => {
  it('initializes reveal exactly once under React.StrictMode', async () => {
    render(
      <StrictMode>
        <DeckShell>
          <section>Hello</section>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(1);
      expect(mockState.instances[0]!.inited).toBe(true);
    });

    expect(mockState.instances).toHaveLength(1);
  });

  it('attaches event listeners during life and clears them on unmount', async () => {
    const { unmount } = render(
      <StrictMode>
        <DeckShell>
          <section>Hello</section>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(1);
      expect(mockState.instances[0]!.inited).toBe(true);
    });

    const instance = mockState.instances[0]!;
    const totalListenersBefore = [...instance.listeners.values()].reduce(
      (sum, set) => sum + set.size,
      0
    );
    expect(totalListenersBefore).toBeGreaterThan(0);

    unmount();

    expect(instance.destroyed).toBe(true);
    const totalListenersAfter = [...instance.listeners.values()].reduce(
      (sum, set) => sum + set.size,
      0
    );
    expect(totalListenersAfter).toBe(0);
  });

  it('produces a fresh reveal instance on re-mount after teardown', async () => {
    const { unmount } = render(
      <StrictMode>
        <DeckShell>
          <section>Hello</section>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(1);
      expect(mockState.instances[0]!.inited).toBe(true);
    });

    const first = mockState.instances[0]!;
    unmount();
    expect(first.destroyed).toBe(true);

    render(
      <StrictMode>
        <DeckShell>
          <section>Hello again</section>
        </DeckShell>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mockState.instances).toHaveLength(2);
      expect(mockState.instances[1]!.inited).toBe(true);
    });

    const second = mockState.instances[1]!;
    expect(second).not.toBe(first);
    expect(second.destroyed).toBe(false);
  });
});
