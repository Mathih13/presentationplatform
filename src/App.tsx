import { DeckShell } from './deck/DeckShell';
import { Image } from './deck/Image';
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

      <Slide id="hva-er-programmering" transition="fade" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <h2 className="text-primary-foreground text-8xl">Hva er programmering?</h2>
        </div>
      </Slide>

      <Slide id="programmet-sekundaert" notes="">
        <div className="flex h-[1080px] flex-col justify-center px-28">
          <div className="flex max-w-[60%] flex-col gap-14">
            <p className="text-primary-foreground text-7xl">Programmet er sekundært.</p>
            <p className="text-primary-foreground text-7xl">
              Produktet lever i programmørens hode
            </p>
          </div>
        </div>
      </Slide>

      <Slide id="programmering-2" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <div className="rounded-2xl bg-white p-6">
            <Image src="/slides/programmering-2.svg" fit="contain" className="h-[880px] w-[880px]" />
          </div>
        </div>
      </Slide>

      <Slide id="programmering-4" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <div className="rounded-2xl bg-white p-6">
            <Image src="/slides/programmering-4.svg" fit="contain" className="h-[880px] w-[880px]" />
          </div>
        </div>
      </Slide>

      <Slide id="programmering-11" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <div className="rounded-2xl bg-white p-6">
            <Image src="/slides/programmering-11.svg" fit="contain" className="h-[880px] w-[880px]" />
          </div>
        </div>
      </Slide>
    </DeckShell>
  );
}
