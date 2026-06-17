import { DeckShell } from './deck/DeckShell';
import { Slide } from './deck/Slide';

// New presentation — Agentic Tooling. Author slides here.
// The previous talk is kept for reference at src/reference/SpacetimeDBTalk.tsx
// (its diagrams live in src/diagrams/); none of it is part of this deck.
export default function App() {
  return (
    <DeckShell>
      <Slide id="title" transition="fade" notes="">
        <div className="flex h-[1080px] flex-col items-center justify-center text-center">
          <h1 className="text-primary-foreground mb-6 text-8xl">Agentic Tooling</h1>
          <p className="text-secondary-foreground text-4xl">
            specs as the contract between human and machine
          </p>
          <p className="absolute bottom-0 left-0 text-3xl">Mathias Hartveit</p>
        </div>
      </Slide>
    </DeckShell>
  );
}
