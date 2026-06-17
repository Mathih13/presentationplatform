# Plan: Presentation Platform Scaffold

> Source PRD: `/PRD.md` — React + reveal.js single-deck scaffold, clone-per-talk workflow, local-only.

## Architectural decisions

Durable decisions that apply across all phases. Restate from PRD so any phase can reference these without re-deriving.

- **Stack**: Vite + React 18 + TypeScript (strict) + Bun (runtime + package manager) + Tailwind CSS. ESLint + Prettier, no Husky.
- **Slide canvas**: reveal.js logical dimensions 1920 × 1080, aspect ratio 16:9. Decided once at the reveal config level; all slide content reasons in these units.
- **Theming**: shadcn-flavored CSS variable tokens (light + dark) wired through Tailwind. Dark is the default. `chart-1..5` tokens are the diagram color palette. The `cn` helper and `lucide-react` icons are included; no shadcn components are scaffolded by default.
- **Typography**: Open Sans for body, JetBrains Mono for code.
- **Authoring model**: each slide is a React `<Slide>` component containing JSX. Hybrid JSX-first with helpers (`<Code>`, `<Image>`, `<Diagram>`, `<Demo>`, `<IframeDemo>`). All slides live in `App.tsx` to start; per-slide files only if it grows unwieldy.
- **Reveal-React bridge**: a single `DeckShell` component owns reveal.js initialization, cleanup, and HMR/StrictMode safety. It exposes the reveal instance and slide/fragment state via React context. Slide-author code MUST NOT call `Reveal.initialize()` directly.
- **Animation vocabulary**: reveal-native fragments + Auto-Animate by default. The `useFragment()` hook surfaces fragment state to React. Framer Motion is intentionally NOT installed by default; held as a per-clone escape hatch.
- **Reveal plugins**: Notes only. Math, Search, Zoom, Menu, and Highlight (Shiki replaces highlight) are intentionally excluded from defaults.
- **Code rendering**: Shiki (build-time tokenization, VS Code-quality output). No highlight.js, no Prism.
- **Distribution**: local presentation via `bun dev`. PDF export via `bun run pdf` (Puppeteer + reveal `?print-pdf`). No hosting, no CI.
- **Testing**: Vitest + `@testing-library/react` + `jsdom`. Behavior-only tests on the four deep modules (`DeckShell`, `useFragment`, `Code`, PDF script). Visual primitives are not unit-tested.
- **Workflow**: clone-or-branch-per-talk. The scaffold IS the artifact; there is no `create-...` CLI.

---

## Phase 1: Bootstrap — hello slide on a dark canvas

**User stories**: 1, 2, 4, 5, 22, 24, 25, 26, 28, 29, 33

### What to build

A working `bun dev` that opens a single static slide at 1920×1080 logical dimensions on a dark Nord-style background, using the stack and theming locked in the PRD. This is the smoke test that proves every layer of the foundation is wired together: package manager, build tool, language, styling, theme tokens, fonts, and a minimal reveal.js initialization.

The reveal init at this phase is a stub: enough to render one section with text and accept arrow-key navigation, but not yet the hardened `DeckShell` module — that arrives in Phase 2. All slide source lives in `App.tsx`.

### Acceptance criteria

- [ ] `bun install` from a fresh clone completes without warnings on a supported Node/Bun version.
- [ ] `bun dev` starts a local dev server and serves the deck.
- [ ] Opening the served URL renders one slide at a 16:9 1920×1080 logical canvas, scaled to fit the viewport.
- [ ] Background uses the dark Nord-style `--background` token; foreground text uses `--foreground`.
- [ ] Body text renders in Open Sans; any monospace text renders in JetBrains Mono.
- [ ] The `dark` class is applied to `<html>` by default; toggling it manually switches the palette to the light theme variables.
- [ ] Pressing right/left arrows triggers reveal's navigation behavior (visually evident even on a single-slide deck).
- [ ] `tsc --noEmit` exits clean under `strict: true`.
- [ ] `bun run lint` exits clean with ESLint + Prettier.
- [ ] No `Reveal.initialize` calls exist outside the reveal-bridge module.

---

## Phase 2: DeckShell — HMR-safe reveal-React bridge + Notes plugin

**User stories**: 3, 27, 28, 37, 35 (DeckShell lifecycle tests)

### What to build

Replace the Phase-1 stub with the real `DeckShell` deep module. `DeckShell` owns the reveal.js lifecycle end-to-end: initializes exactly once per real mount (surviving React 18 StrictMode's double-mount), destroys cleanly on unmount, re-initializes correctly under Vite HMR, registers the Notes plugin, and applies the `dark` class to the document root. It exposes a React context carrying the reveal instance, current slide indices, current fragment indices, and dark-mode state.

After this phase, pressing `s` during a deck opens reveal's speaker-notes window. Editing the slide source while presenting hot-reloads without losing slide position or leaking listeners.

### Acceptance criteria

- [ ] `DeckShell` mounts reveal exactly once even under React 18 `StrictMode`.
- [ ] Unmounting `DeckShell` destroys the reveal instance and removes all attached event listeners (no leaks detectable by mount/unmount cycles in test).
- [ ] Vite HMR on a slide-source change preserves the current slide index after the reload.
- [ ] The reveal Notes plugin is registered at init; pressing `s` opens the speaker-notes window.
- [ ] `DeckShell` exposes a React context with: reveal instance, current slide indices, current fragment indices, dark-mode state.
- [ ] Dark mode is on by default; the `dark` class is applied to the document root via `DeckShell`.
- [ ] Vitest lifecycle tests pass: (a) single-init under StrictMode, (b) clean teardown on unmount, (c) re-mount produces a fresh working instance.
- [ ] No slide-authoring code imports `reveal.js` directly.

---

## Phase 3: Slide component — multi-slide authoring with notes and transitions

**User stories**: 1, 27, 29

### What to build

A `<Slide>` component that emits a real `<section>` for reveal to discover, with props for `notes`, `transition`, `autoAnimate`, and `id`. The `notes` prop renders an `<aside class="notes">` child so the Notes plugin picks it up automatically. The deck grows from one to three or more slides authored side-by-side in `App.tsx`, each demonstrating different transitions and carrying speaker notes visible in the speaker view.

This phase confirms the authoring shape locked in the PRD: slides are React components, notes are inline, transitions are per-slide overrides on top of a deck-level default.

### Acceptance criteria

- [ ] `<Slide>` renders a single `<section>` element per slide; deck navigation cycles through all `<Slide>` children of `DeckShell`.
- [ ] `<Slide notes="...">` renders the notes such that the speaker-view window shows them on the matching slide.
- [ ] `<Slide transition="fade">` overrides the deck-level default transition for that single slide.
- [ ] `<Slide autoAnimate>` marks the section so reveal Auto-Animate engages with adjacent auto-animated slides.
- [ ] `<Slide id="...">` sets `data-id` / slide id so hash routing and `data-auto-animate-id` references work.
- [ ] The demo deck contains at least three slides with distinct transitions and notes, all reachable via arrow keys, all showing notes in speaker view.
- [ ] Type errors on misused `<Slide>` props are caught at compile time.

---

## Phase 4: `useFragment` hook — fragment-driven React state

**User stories**: 16, 17, 35 (useFragment event-handling tests)

### What to build

The `useFragment()` hook returning `{ index, total, isVisible(n) }` scoped to the slide where the consuming component is rendered. The hook subscribes to reveal's `slidechanged`, `fragmentshown`, and `fragmenthidden` events through `DeckShell`'s context, filters to the active slide, and cleans up on unmount.

This phase also documents the standard reveal fragment classes available on any element (`fade-in`, `grow`, `highlight-current-blue`, etc.) so authors know the no-React-needed path for simple cases. A smoke slide demonstrates a small React component reading from `useFragment()` to display "Step N of M" as the audience advances fragments.

### Acceptance criteria

- [ ] `useFragment()` returns the active slide's fragment index, total, and an `isVisible(n)` predicate.
- [ ] State updates on `fragmentshown` and `fragmenthidden`.
- [ ] State resets/refreshes on `slidechanged` so it always reflects the active slide.
- [ ] A component rendered on slide A does not observe fragment state of slide B.
- [ ] Subscriptions are cleaned up on unmount (no listeners left attached, verified in test).
- [ ] Vitest tests pass against a mocked reveal event emitter for: update on show/hide, scope to active slide, cleanup on unmount.
- [ ] Smoke slide renders a "Step N of M" component that advances in lockstep with fragment progression.

---

## Phase 5: `Code` block — Shiki rendering with step-through

**User stories**: 6, 7, 8, 9, 35 (Code step-through tests)

### What to build

The `<Code>` deep module: a code block component powered by Shiki, theme-integrated (consumes the deck's CSS variables for background/foreground), and supporting both static and step-through modes. In step-through mode, `<Code>` takes an ordered `steps` array (each step naming a `lines` range and an optional `focus` flag) and uses `useFragment()` to advance which lines are highlighted as fragments progress.

When `steps` is omitted, `<Code>` renders as a normal Shiki-highlighted block. A smoke slide demonstrates both modes side-by-side or on adjacent slides.

### Acceptance criteria

- [ ] `<Code lang="..." >` renders syntax-highlighted code using Shiki.
- [ ] `<Code theme="...">` allows per-block theme override; default uses the deck's theme.
- [ ] In static mode (no `steps`), code renders fully visible with all lines un-dimmed.
- [ ] In step-through mode, the initial render shows the first step's highlighted lines.
- [ ] Advancing fragments advances the active step; un-highlighted lines render dimmed but legible.
- [ ] Code blocks visually match the deck theme (background, border, monospace font).
- [ ] Vitest tests pass: Shiki tokenization produces expected line/token structure for a sample input; decoration set matches the active step; fragment advancement advances the step.

---

## Phase 6: Diagram primitives — `Diagram`, `AnimatedArrow`, `AnimatedBox`

**User stories**: 10, 11, 12, 13, 15

### What to build

The three primitives for hand-coded React/SVG diagrams. `<Diagram>` provides a themed SVG canvas with a default viewBox and injects palette colors derived from `chart-1..5` as CSS custom properties scoped to the SVG. `<AnimatedArrow>` accepts `from`/`to` (points or refs), an `appear` mode (`"draw"`, `"fade"`, or `"slide"`), and renders an arrow that draws on, fades in, or slides in; movement between slides uses Auto-Animate via consistent `data-id`. `<AnimatedBox>` is a labeled rectangle with fragment-aware named states (`idle`, `highlight`, `dim`), driven by `useFragment()` plus an `activeAt` prop.

A minimal smoke diagram demonstrates the primitives working together: two boxes, an arrow that draws on a fragment, a box that highlights on another fragment. This is NOT the network round-trip diagram from the PRD — that's authored per-talk after the scaffold ships.

### Acceptance criteria

- [ ] `<Diagram>` renders an SVG with a configurable viewBox (default 1920×1080).
- [ ] Diagram children receive theme palette colors via CSS custom properties; changing `chart-N` tokens reflows diagrams without code changes.
- [ ] `<AnimatedArrow from to appear="draw">` draws on stroke-by-stroke when the corresponding fragment becomes visible.
- [ ] `<AnimatedArrow from to appear="fade">` fades in via the standard reveal fragment behavior.
- [ ] `<AnimatedArrow from to appear="slide">` translates from a hidden offset to the final position when the fragment shows.
- [ ] `<AnimatedArrow>` reused with the same `data-id` across adjacent auto-animated slides smoothly translates between positions via reveal Auto-Animate.
- [ ] `<AnimatedBox label x y activeAt={N}>` transitions between `idle` and `highlight` states as fragments cross `N`.
- [ ] Smoke diagram demonstrates `Diagram` + `AnimatedArrow` + `AnimatedBox` together in one slide.

---

## Phase 7: Media helpers — `Image`, `Demo`, `IframeDemo`

**User stories**: 14, 19, 20, 21

### What to build

Three thin-but-useful wrappers for embedding non-text content on slides.

- `<Image>` wraps `<img>` with consistent object-fit defaults, lazy loading, and optional `lightSrc`/`darkSrc` for theme-aware variants. Excalidraw exports drop in via this component.
- `<Demo>` provides a frame around inline React components — consistent padding, background, and an optional "browser-chrome" decoration variant — so demos look intentional, not like raw page content.
- `<IframeDemo>` renders a sandboxed `<iframe>` with `src`, configurable dimensions, and a focus-trap so clicking into the demo doesn't fire reveal navigation while interacting.

A smoke slide for each — image with light/dark variants, an inline counter demo, an iframe to a placeholder URL — confirms the wrappers work end-to-end.

### Acceptance criteria

- [ ] `<Image src="..." />` renders with `object-fit: contain` (default) and `loading="lazy"`.
- [ ] `<Image lightSrc="..." darkSrc="..." />` swaps source based on the current theme mode.
- [ ] `<Demo>` renders children with consistent framing; the optional browser-chrome variant adds a stylized chrome decoration.
- [ ] `<IframeDemo src="...">` renders a sandboxed iframe at the configured dimensions.
- [ ] Clicking into an `<IframeDemo>` does not advance reveal slides; reveal navigation only resumes after focus leaves the iframe.
- [ ] One demo slide each for `Image`, `Demo`, and `IframeDemo` exists in the deck.

---

## Phase 8: PDF export script

**User stories**: 30, 31, 35 (PDF script tests)

### What to build

The `bun run pdf` script. It spawns the dev server (or alternatively serves the built `dist/` output), launches Puppeteer in headless mode, navigates to `<dev-url>/?print-pdf`, waits for reveal's ready state, calls `page.pdf()` with page dimensions matching reveal's logical canvas (1920×1080 mapped to PDF units), and writes the output to a default path (`slides.pdf`) overridable via `--out`. On completion (success or failure) the script kills the dev server and closes the browser.

Speaker notes are excluded from the rendered PDF by default — what's distributed matches what the audience saw.

### Acceptance criteria

- [ ] `bun run pdf` produces a `slides.pdf` in the project root.
- [ ] The PDF page size matches the deck's logical 1920×1080 dimensions (16:9).
- [ ] Each slide in the deck appears as a page in the PDF, in the same order, with the same content.
- [ ] Speaker notes are NOT rendered into the PDF output.
- [ ] `bun run pdf --out custom/path.pdf` writes to the specified path.
- [ ] The dev server is started and killed cleanly by the script; no orphan processes remain after success or failure.
- [ ] Vitest tests pass: Puppeteer invoked with configured page size; dev server lifecycle (start, await, kill) under success and failure paths; output-path defaulting and override.

---

## Phase 9: Polish — README, lint clean, cold-clone smoke

**User stories**: 5, 32, 33, 34, 36

### What to build

The final-mile work that turns "scaffold that exists" into "scaffold that's pleasant to clone." A README documents the scaffold's primitives (`Slide`, `Code`, `Diagram`, `AnimatedArrow`, `AnimatedBox`, `Image`, `Demo`, `IframeDemo`, `useFragment`), conventions (where slides live, how to add a new slide, how to write notes, when to reach for Auto-Animate vs `useFragment`), and the four commands (`bun dev`, `bun run lint`, `bun run test`, `bun run pdf`). Held-out dependencies (Framer Motion, KaTeX, shadcn components) are documented with one-liner "when to add" guidance.

All four deep-module test suites pass. ESLint and Prettier are clean across the codebase. A cold-clone smoke run (delete `node_modules`, `bun install`, `bun dev`) is measured to confirm the under-60-second target from the PRD.

### Acceptance criteria

- [ ] README documents all helper components with prop summaries and at least one usage example each.
- [ ] README documents the four commands and what they do.
- [ ] README documents the held-out dependencies and the "when to add" rationale for each.
- [ ] `bun run test` exits clean with all four deep-module suites passing.
- [ ] `bun run lint` exits clean.
- [ ] `tsc --noEmit` exits clean under `strict: true`.
- [ ] Cold-clone install (fresh `node_modules`, `bun install` → `bun dev`) completes in under 60 seconds on a developer machine.
- [ ] A future-me (or new clone of the scaffold) can read the README and author a working slide deck without reading source.
