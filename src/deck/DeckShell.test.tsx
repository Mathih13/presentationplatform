import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrictMode } from 'react';
import { render, waitFor } from '@testing-library/react';
import { Slide } from './Slide';

interface MockRevealInstance {
  root: HTMLElement;
  config: unknown;
  inited: boolean;
  destroyed: boolean;
  listeners: Map<string, Set<(payload?: unknown) => void>>;
  dispatched: string[];
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

    dispatched: string[] = [];
    dispatchEvent = ({ type }: { type: string }) => {
      this.dispatched.push(type);
    };

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

describe('DeckShell speaker notes', () => {
  it('gives each slide its section of the notes file', () => {
    const { container } = render(
      <DeckShell notes={'## intro\nSay **hi**\n\n## outro\nBye'}>
        <Slide id="intro">Intro</Slide>
        <Slide id="outro">Outro</Slide>
      </DeckShell>
    );
    expect(container.querySelector('#intro aside.notes')!.innerHTML).toBe(
      '<p>Say <strong>hi</strong></p>'
    );
    expect(container.querySelector('#outro aside.notes')!.innerHTML).toBe('<p>Bye</p>');
  });

  it("prefers a slide's own notes prop over the file", () => {
    const { container } = render(
      <DeckShell notes={'## intro\nFrom the file'}>
        <Slide id="intro" notes="Inline">
          Intro
        </Slide>
      </DeckShell>
    );
    expect(container.querySelector('#intro aside.notes')!.innerHTML).toBe('Inline');
  });

  it('nudges the speaker window when the notes change', async () => {
    const { rerender } = render(
      <DeckShell notes={'## intro\nBefore'}>
        <Slide id="intro">Intro</Slide>
      </DeckShell>
    );
    await waitFor(() => expect(mockState.instances).toHaveLength(1));
    const instance = mockState.instances[0]!;
    instance.dispatched.length = 0;

    rerender(
      <DeckShell notes={'## intro\nAfter'}>
        <Slide id="intro">Intro</Slide>
      </DeckShell>
    );
    expect(instance.dispatched).toEqual(['resumed']);
  });

  it('warns about notes for slides that do not exist', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <DeckShell notes={'## intro\nHi\n\n## gone\nOld'}>
        <Slide id="intro">Intro</Slide>
      </DeckShell>
    );
    expect(warn).toHaveBeenCalledWith("Speaker notes for slides that don't exist: gone");
    warn.mockRestore();
  });
});
