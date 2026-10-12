# PRD — Presentation Platform Scaffold

> A reusable React + reveal.js scaffold for building rich, animated, code-and-diagram-heavy presentations locally. Clone or branch per talk.

## Problem Statement

I give technical presentations that are heavy on hand-built diagrams (often animated), syntax-highlighted code, and occasional live React or iframe demos. Off-the-shelf tools either lock me out of React composition (Keynote, Google Slides), don't support proper code highlighting and live demos (PowerPoint), or sacrifice fine-grained animation control (Slidev). I want to author every slide as a real React component with full access to JSX, but lean on a battle-tested presentation runtime (reveal.js) for navigation, transitions, fragments, auto-animate morphing, and a speaker-notes window.

Every time I start a new talk I end up reinventing the same boilerplate: Vite + React + reveal config, theme, code-highlighter, diagram helpers, speaker-notes plumbing, PDF export. The setup cost is high enough that I default to lesser tools. I need this scaffold to exist once, well, so I can `git clone && cd && bun install && bun dev` and start writing slides within 60 seconds.

## Solution

A single repository that serves as the starting point for one presentation. The workflow is **clone-or-branch-per-talk**: each new talk gets its own clone (or branch), and the author edits slides directly in that copy. There is no multi-deck routing, no hosting, no CI. Decks are presented locally from `bun dev` or distributed as a PDF.

The scaffold provides:

- **Stack**: Vite + React 18 + TypeScript strict + Bun + Tailwind CSS, with ESLint + Prettier (no pre-commit hooks).
- **Theme**: a custom Nord-style theme expressed as shadcn-flavored CSS variables, supporting light/dark with dark as the default. `chart-1..5` tokens repurposed as the diagram color palette. The `cn` helper and `lucide-react` icons are included; no shadcn components are scaffolded.
- **Reveal-React bridge**: a `DeckShell` wrapper handling reveal.js initialization, plugin registration, HMR safety, and React 18 StrictMode resilience. Exposes slide state and the reveal instance via React context.
- **Slide canvas**: 16:9 at 1920×1080 logical dimensions.
- **Authoring model**: hybrid JSX-first. Every slide is a `<Slide>` component holding any JSX. Helper components — `<Code>`, `<Image>`, `<Diagram>`, `<Demo>`, `<IframeDemo>` — handle the recurring patterns. Start with all slides in `App.tsx`, evolve to per-slide files only when needed.
- **Code blocks**: `<Code>` powered by Shiki (VS Code-quality output), with a step-through mode that reveals lines or ranges as fragments advance.
- **Diagram primitives**: `<Diagram>` (themed SVG canvas), `<AnimatedArrow>` (draw-on or move-between behavior), `<AnimatedBox>` (fragment-aware highlight states). Diagrams can also be drawn in Excalidraw and dropped in as SVG/PNG exports.
- **Animation vocabulary**: reveal-native fragments + Auto-Animate for slide-level motion. A `useFragment()` hook gives React components access to fragment state for fragment-driven logic. [Motion](https://motion.dev) (formerly Framer Motion) is pre-installed for component-level choreography — springs, squash & stretch, staggering, exit animations — and `useStep()` maps a slide's fragments onto named Motion states.
- **Speaker view**: reveal's Notes plugin wired so pressing `s` opens a second window with notes, a timer, and a next-slide preview.
- **PDF export**: `bun run pdf` spawns the dev server, drives headless Chromium against `?print-pdf`, and writes `slides.pdf` at the configured logical dimensions.

## User Stories

### Authoring experience

1. As a presenter, I want to write each slide as a React component, so that I can compose UI primitives and JSX without learning a markdown variant.
2. As a presenter, I want to start with all slides in a single file, so that early-stage decks have no file overhead.
3. As a presenter, I want hot module reload to preserve my current slide position while I edit, so that I don't lose my place when iterating.
4. As a presenter, I want TypeScript strict mode on by default, so that incorrect prop usage on slides/helpers fails at compile time.
5. As a presenter, I want the scaffold to install and boot in under 60 seconds from a fresh clone, so that starting a new talk has near-zero friction.

### Code blocks

6. As a presenter, I want a `<Code>` block with VS Code-quality syntax highlighting, so that code on slides reads cleanly at projector distance.
7. As a presenter, I want to step through code line-by-line during a slide using reveal fragments, so that I can walk the audience through code without changing slides.
8. As a presenter, I want to declare a sequence of focus ranges (e.g. lines 1-2, then 3-5, then 8) on a code block, so that emphasis advances naturally with my talking points.
9. As a presenter, I want code themes that match the deck's overall theme, so that code blocks don't look pasted in.

### Diagrams

10. As a presenter, I want to hand-code diagrams as React/SVG components, so that I can animate parts of them with reveal fragments and tweak layout in source.
11. As a presenter, I want an `<AnimatedArrow>` primitive that can draw-on or move between elements, so that I don't have to wire stroke-dasharray math each time.
12. As a presenter, I want an `<AnimatedBox>` primitive with fragment-driven highlight states (idle, highlight, dimmed), so that walking through a diagram step-by-step is one prop, not five class toggles.
13. As a presenter, I want diagram colors to come from the theme's `chart-1..5` tokens, so that retheming the deck reflows my diagrams automatically.
14. As a presenter, I want to drop Excalidraw SVG/PNG exports into a slide via `<Image>`, so that hand-drawn diagrams work alongside coded ones.
15. As a presenter, I want Auto-Animate to morph a diagram between two adjacent slides, so that "request travels across the network stack" looks animated without writing animation code.

### Animation primitives

16. As a presenter, I want a `useFragment()` hook returning the current fragment index and total, so that React components on a slide can react to fragment progression.
17. As a presenter, I want reveal's fragment classes (`fade-in`, `grow`, `highlight-current-blue`, etc.) available on any element, so that I can opt into simple per-element animations without writing custom hooks.
18. As a presenter, I want the scaffold to NOT ship Framer Motion or GSAP, so that the default footprint stays small; I will add them per-clone only when reveal-native is insufficient.

### Demos

19. As a presenter, I want a `<Demo>` wrapper for inline React components with consistent framing, so that demos look intentional and not like raw page content.
20. As a presenter, I want an `<IframeDemo src=...>` wrapper, so that I can embed deployed apps with a controlled aspect ratio and graceful focus handling.
21. As a presenter, I want demos to remain interactive while the slide is active, so that I can click into a demo mid-talk without breaking reveal navigation.

### Theme and typography

22. As a presenter, I want a Nord-style dark theme by default, so that my slides match a deliberate aesthetic without configuration.
23. As a presenter, I want a matching light theme available, so that I can switch for venues with bright rooms or printed-PDF distribution.
24. As a presenter, I want Open Sans for body text and JetBrains Mono for code, so that typography is decided once and consistent.
25. As a presenter, I want theme tokens expressed as CSS variables consumed by Tailwind, so that I can adjust the palette in one place.

### Presentation runtime

26. As a presenter, I want slides rendered at a 16:9 1920×1080 logical canvas, so that decks look right on modern projectors.
27. As a presenter, I want a speaker-notes window opened via `s`, with notes, a timer, and next-slide preview, so that I can stay on time without the audience seeing my prep.
28. As a presenter, I want reveal's standard keyboard navigation working out of the box, so that I don't need to learn new controls per deck.
29. As a presenter, I want slide transitions configurable per slide, so that the default is consistent but I can override for specific moments.

### Distribution and backup

30. As a presenter, I want a `bun run pdf` command that produces `slides.pdf` matching the deck's logical dimensions, so that I have a backup if my laptop fails at the venue.
31. As a presenter, I want the PDF export to include speaker-notes-free output by default, so that what I distribute is what the audience saw.

### Workflow

32. As a presenter, I want to clone the scaffold for each new talk, so that experiments in one deck don't risk breaking others.
33. As a presenter, I want minimal default dependencies, so that the cold-clone install is fast and stable; per-talk additions (shadcn components, Framer Motion, KaTeX, etc.) are explicit per-clone choices.
34. As a presenter, I want the README to document the scaffold's primitives, conventions, and PDF/notes commands, so that a returning future-me can re-orient without re-reading source.

### Developer experience (for the scaffold itself)

35. As a developer of the scaffold, I want each deep module testable in isolation with Vitest, so that I can refactor reveal-bridge or fragment logic confidently.
36. As a developer of the scaffold, I want ESLint + Prettier configured but no commit hooks, so that linting and formatting are opt-in per author.
37. As a developer of the scaffold, I want all reveal.js + React HMR and StrictMode quirks isolated inside `DeckShell`, so that slide-authoring code never needs to know about the bridge.

## Implementation Decisions

### Stack and tooling

- **Runtime/PM**: Bun. Single binary, fast installs, the scaffold's clone-per-talk pattern benefits from Bun's speed without needing pnpm's content-addressable store gains.
- **Build**: Vite (SPA). No SSR, no MDX-routes, no Next.js.
- **Language**: TypeScript with `strict: true`. Slide-author code and helper APIs are typed.
- **UI**: React 18 (not 19, to avoid reveal.js + ecosystem rough edges in the near term).
- **Styling**: Tailwind CSS reading from CSS-variable tokens. The user's provided Nord theme variables are dropped verbatim into the global stylesheet. The `dark` class on `<html>` toggles mode, with `dark` applied by default.
- **Helpers**: borrow `cn` (clsx + tailwind-merge) and `lucide-react` for icons. No shadcn components.
- **Lint/format**: ESLint + Prettier with sensible defaults. No Husky, no lint-staged.

### Dependency list (default install)

Production: `react`, `react-dom`, `reveal.js`, `shiki`, `motion`, `clsx`, `tailwind-merge`, `lucide-react`.
Development: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`, `prettier`, `@types/react`, `@types/react-dom`, `vitest`, `@testing-library/react`, `jsdom`, `puppeteer` (for PDF script).

Held out (per-clone additions when needed): KaTeX, shadcn components, any chart library.

### Module breakdown

**Deep modules** (the four that get unit-tested):

1. **`DeckShell`** — wraps the deck root. Responsible for:
   - Initializing reveal with the configured options (width 1920, height 1080, plugins: [Notes], hash routing optional, transition default).
   - Surviving React 18 StrictMode's double-mount via a guard that ensures `Reveal.initialize()` runs exactly once per real mount.
   - Cleaning up reveal on unmount and re-initializing on HMR without leaking event listeners.
   - Exposing a context with the reveal instance, current slide indices, current fragment indices, and dark-mode state.
   - Applying the `dark` class to the document root (default: on).

2. **`useFragment`** — returns `{ index, total, isVisible }` for the active slide's fragments.
   - Subscribes to `slidechanged`, `fragmentshown`, `fragmenthidden`.
   - Scoped: only reflects fragments on the slide where the consuming component is rendered.
   - Cleans up subscriptions on unmount.

3. **`Code`** — Shiki-rendered code block with step-through.
   - Props: `lang`, `theme` (optional override), `code` (string, or children), `steps` (ordered list of `{ lines: string, focus?: boolean }`), `startStep` (default 0).
   - Internally tokenizes via Shiki, computes per-step line decoration sets, and uses `useFragment()` to advance through steps.
   - When `steps` is omitted, renders as a static block.

4. **PDF export script** — orchestrates:
   - Starts dev server (or builds and serves the `dist/` output).
   - Launches headless Chromium via Puppeteer.
   - Navigates to `<dev-url>/?print-pdf`.
   - Waits for reveal `ready` state.
   - Calls `page.pdf()` with width/height matching reveal's logical canvas (1920×1080).
   - Writes output to a configurable path (default `slides.pdf`).
   - Cleans up: closes browser, kills server.

**Component primitives** (not unit-tested individually — visual concerns):

5. **`Slide`** — wraps children in a `<section>` with optional `notes`, `transition`, `autoAnimate`, `id` props. The `notes` prop renders an `<aside class="notes">` child so reveal's Notes plugin picks it up.
6. **`Diagram`** — themed `<svg>` wrapper with a default viewBox (typically 1920×1080 or a configurable subregion). Injects palette colors derived from `chart-1..5` via CSS custom properties.
7. **`AnimatedArrow`** — props: `from`, `to` (each accepts a point `{x,y}` or a ref to a DOM/SVG element), `appear` (`"draw" | "fade" | "slide"`), `strokeWidth`, `color` (token name). Implements draw-on via stroke-dasharray; movement via SVG `transform`.
8. **`AnimatedBox`** — labeled rectangle with named states (`idle`, `highlight`, `dim`). State driven by `useFragment()` plus an `activeAt` prop (fragment index or range).
9. **`Image`** — wrapper around `<img>` with consistent object-fit defaults, lazy loading, and optional `lightSrc`/`darkSrc` for theme-aware variants.
10. **`Demo`** — frame around inline React components, providing consistent padding, background, and an optional "browser-chrome" decoration variant.
11. **`IframeDemo`** — sandboxed `<iframe>` wrapper with `src`, dimensions matched to slide canvas region, and a focus-trap so reveal navigation doesn't fire while interacting.

**Configuration / styling modules** (shallow but central):

12. **Reveal config** — single source of truth for reveal options.
13. **Theme module** — Tailwind config, CSS variable wiring, font registration, dark-mode class strategy.

### Key API shapes

(Conceptual — final TypeScript signatures decided during implementation.)

- `<DeckShell>{slides}</DeckShell>` — no props at the top level; configuration lives in the reveal config module.
- `useFragment(): { index: number; total: number; isVisible: (n: number) => boolean }`
- `useStep(['idle', 'shown', 'done'] as const): 'idle' | 'shown' | 'done'` — the slide's fragment progress as a named step, for Motion's `animate`.
- `<Code lang="ts" steps={[{ lines: "1-3" }, { lines: "5", focus: true }]}>{source}</Code>`
- `<Diagram viewBox="0 0 1920 1080">{children}</Diagram>`
- `<AnimatedArrow from={pointA} to={pointB} appear="draw" color="chart-1" />`
- `<AnimatedBox label="LAN" x={...} y={...} activeAt={3} />`
- `<Demo>{<MyComponent />}</Demo>` and `<IframeDemo src="http://localhost:3001" />`

### HMR and StrictMode strategy

- `DeckShell` uses a module-scoped guard plus `useEffect` cleanup to ensure exactly one `Reveal.initialize()` per real mount.
- On HMR, the cleanup runs first (destroying the reveal instance and removing listeners), then the new effect re-initializes.
- The reveal root DOM (`.reveal > .slides`) is owned by React; children are React-managed `<section>` elements.

### Slide canvas

- Reveal logical dimensions: 1920 × 1080. Margins, padding, font sizes can be reasoned about in real-pixel terms.
- Default transition: `slide`. Per-slide overrides via `<Slide transition="fade">`.
- Auto-animate enabled at deck level (cheap; only kicks in for adjacent slides marked `data-auto-animate`).

### Speaker notes

- Notes authored via `<Slide notes="...">` (renders `<aside class="notes">`).
- Notes plugin registered in `DeckShell`. `s` key opens the speaker view as standard.

### PDF export

- Script entry: `bun run pdf`.
- Optional flag: `--out <path>`.
- Page size: derived from reveal config (1920×1080 in pixels translated to PDF page dimensions).
- Notes excluded by default (audience-facing output).

## Testing Decisions

**What makes a good test in this scaffold**: tests target the externally visible behavior of a deep module — its inputs/outputs, the effects it causes (events fired, DOM emitted, files written) — never its internal implementation. Tests should survive an internal rewrite of the module they cover.

**Test framework**: Vitest with `jsdom` environment. `@testing-library/react` for component-level tests.

**Modules covered**:

1. **`DeckShell` lifecycle**:
   - Asserts reveal is initialized exactly once on mount (even under StrictMode double-mount).
   - Asserts reveal is destroyed on unmount with no dangling event listeners.
   - Asserts re-mounting after HMR-like teardown produces a fresh, working reveal instance.
   - Does NOT test what reveal renders internally — that's reveal's concern.

2. **`useFragment` event handling**:
   - With a mocked reveal instance (event emitter contract), asserts the hook updates state on `fragmentshown`/`fragmenthidden`/`slidechanged`.
   - Asserts fragment state is scoped to the active slide.
   - Asserts subscriptions are cleaned up on unmount (no leaks).

3. **`Code` step-through behavior**:
   - Asserts Shiki tokenization produces expected line/token structure for a given input (snapshot-level, not byte-perfect — language-aware token classes).
   - Asserts the rendered decoration set matches the active step's `lines` spec.
   - Asserts advancing fragments advances the step.
   - Does NOT test exact CSS classes — uses semantic queries (e.g. "line N has the focus state").

4. **PDF export script**:
   - Asserts the script invokes Puppeteer with the configured page size.
   - Asserts the dev server lifecycle (started, awaited, killed) under success and failure paths.
   - Asserts the output file path defaulting and override behavior.
   - Does NOT verify visual PDF content — that's a manual smoke step.

**What is intentionally NOT tested**: `AnimatedArrow`, `AnimatedBox`, `Diagram`, `Image`, `Demo`, `IframeDemo`, `Slide`. These are thin visual wrappers; their behavior is best verified by running a deck. Writing reveal-aware integration tests for them would cost more than they'd catch.

**Prior art**: not applicable — this is a greenfield scaffold. Test style will follow general Vitest + React Testing Library conventions: arrange-act-assert, no implementation snooping, explicit cleanup.

## Out of Scope

- Hosting, deployment, CI/CD. Decks run from local `bun dev` or a PDF.
- Multi-deck routing or a multi-presentation index.
- shadcn UI component library installation (per-clone choice when a specific talk needs UI primitives).
- Reveal plugins: Math (KaTeX), Search, Zoom, Menu, Highlight. Notes is the only plugin shipped.
- Framer Motion / GSAP / Motion One. Held as escape hatches; per-clone choice.
- A pre-built example diagram (e.g. the network round-trip). To be authored after the scaffold is up and running, in a real talk.
- Husky / lint-staged / pre-commit hooks.
- Mobile-optimized layouts or touch gesture support beyond reveal's defaults.
- Authoring UI / GUI / WYSIWYG editor — slides are code.
- Internationalization. Decks are authored in a single locale per clone.
- Image optimization pipelines (Sharp, AVIF). Static `<Image>` is sufficient.
- Auth, telemetry, analytics.

## Further Notes

- **Workflow assumption**: the canonical lifecycle is `git clone <scaffold> my-talk && cd my-talk && bun install && bun dev`. There is no `npx create-…` CLI; the scaffold itself is the artifact.
- **HMR caveat**: reveal.js + React 18 + Vite HMR has known quirks (double-mount on StrictMode, stale plugin state). All of this is encapsulated in `DeckShell`. Slide-author code must NOT call `Reveal.initialize()` or import the reveal global directly.
- **Why no Highlight plugin**: Shiki is strictly better for code presentation than reveal's bundled highlight.js plugin, and the step-through helper depends on Shiki's tokenization.
- **Auto-Animate and Motion, side by side**: reveal's Auto-Animate gives Keynote-style "Magic Move" between adjacent slides for free and stays the default for slide-to-slide morphs. Motion covers what reveal-native vocabulary can't: sequenced choreography on a single fragment trigger, spring physics, squash & stretch, exit animations, SVG path drawing. It was originally held out to keep the default install minimal, but hand-rolling that choreography in CSS keyframes proved fragile (animation-name matching, fill-mode stacking, manual delay arithmetic), so it now ships with the scaffold. Simple fades and static diagrams should still stay plain CSS/reveal.
- **Why no shadcn components**: the scaffold renders presentation content, not application UI. The shadcn-flavored CSS variables and `cn` helper are borrowed because they're convention-friendly and any per-clone shadcn additions will integrate cleanly.
- **Theme variables source**: provided verbatim by the user during the design interview (Nord daisyUI shadcn style, light + dark, with chart and sidebar scales).
- **Single-author assumption**: no PR review process, no shared style guide enforcement, no multi-contributor concerns baked into tooling.
- **Next step**: feed this PRD into `/prd-to-plan` to produce a phased implementation plan with tracer-bullet vertical slices.
