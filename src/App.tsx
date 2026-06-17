import { Code } from './deck/Code';
import { DeckShell } from './deck/DeckShell';
import { Image } from './deck/Image';
import { Slide } from './deck/Slide';
import { ApsLoop } from './diagrams/ApsLoop';

const HEALTH_FEATURE = `Feature: Health endpoint
  Infrastructure can verify the service is live by requesting the health
  endpoint over HTTP.

  Background:
    Given the server is running

  Scenario: Health endpoint reports the service is healthy
    When GET /health is requested
    Then the response status is 200
    And the response body is {"status":"ok"}

  Scenario: Unknown routes return not found
    When GET /unknown is requested
    Then the response status is 404`;

// New presentation — Agentic Tooling. Author slides here.
// The previous talk is kept for reference at src/reference/SpacetimeDBTalk.tsx
// (its diagrams live in src/diagrams/); none of it is part of this deck.
export default function App() {
  return (
    <DeckShell>
      <Slide id="title" transition="fade" notes="">
        <div className="flex h-[1080px] flex-col items-center justify-center text-center">
          <h1 className="text-primary-foreground mb-6 text-8xl">BDD + Agentic Tooling</h1>
          <p className="text-secondary-foreground text-4xl">
            Spesifikasjoner som kontrakt mellom menneske og maskin
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
        <div className="flex h-[1080px] flex-col items-center justify-center px-28">
          <div className="flex max-w-[60%] flex-col gap-14 text-left">
            <p className="text-primary-foreground text-7xl">Programmet er sekundært.</p>
            <p className="text-primary-foreground text-7xl">
              Produktet lever i programmørens hode
            </p>
          </div>
        </div>
      </Slide>

      <Slide id="programmering-2" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <Image src="/slides/programmering-2.svg" fit="contain" className="h-[880px] w-[880px]" />
        </div>
      </Slide>

      <Slide id="programmering-4" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <Image src="/slides/programmering-4.svg" fit="contain" className="h-[880px] w-[880px]" />
        </div>
      </Slide>

      <Slide id="programmering-11" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <Image src="/slides/programmering-11.svg" fit="contain" className="h-[880px] w-[880px]" />
        </div>
      </Slide>

      <Slide id="menneske-vs-agent" notes="Mennesker og agenter bygger kontekst på fundamentalt ulike måter — ikke ulike hastigheter på samme akse, men ulike typer kontekst.">
        <div className="flex h-[1080px] gap-40 px-40 pt-36">
          <div className="flex-1">
            <h2 className="text-primary-foreground mb-24 text-8xl">Menneske</h2>
            <ul className="text-secondary-foreground list-none space-y-9 text-4xl">
              <li>Langsomme</li>
              <li>Dyptgående</li>
              <li>Taust kontekst</li>
              <li>“Context Loss”</li>
              <li>Temporal eksistens</li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-primary-foreground mb-24 text-8xl">Agent</h2>
            <ul className="text-secondary-foreground list-none space-y-9 text-4xl">
              <li>Raske</li>
              <li>Tynn forståelse</li>
              <li>Eksplisitt kontekst</li>
              <li>“Context Rot”</li>
              <li>Øyeblikkelig eksistens</li>
            </ul>
          </div>
        </div>
      </Slide>

      <Slide id="agent-traktor" notes="Reframe av AI-agenten: ikke en Ferrari vi prøver å temme (fart), men en traktor — poenget er å løfte tyngre lass som én fører.">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-14">
          <div className="flex items-center justify-center gap-24">
            <img src="/slides/ferrari.jpg" alt="Ferrari" className="h-[420px] w-auto rounded-2xl opacity-40 grayscale" />
            <img src="/slides/tractor.png" alt="Traktor" className="h-[420px] w-auto rounded-2xl" />
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-primary-foreground text-6xl">Ikke en Ferrari. En traktor.</p>
            <p className="text-secondary-foreground text-4xl">
              Poenget er ikke fart — men å løfte tyngre lass, som én fører.
            </p>
          </div>
        </div>
      </Slide>

      <Slide id="friksjon" notes="Friksjon var alltid et designsignal — klønete kode betydde feil design. Agenten bulldoser gjennom friksjonen; koden kompilerer, men varsellampen er slukket. Vi trenger en ny — kommer tilbake til den (mutasjon).">
        <div className="flex h-[1080px] flex-col justify-center gap-12 px-32">
          <h2 className="text-primary-foreground text-7xl">Friksjon forteller deg noe</h2>
          <p className="text-secondary-foreground text-5xl leading-tight">
            Klønete kode var alltid et designsignal — “dette kjemper imot, designet er feil”.
          </p>
          <p className="text-primary-foreground text-5xl leading-tight">
            Agenten bulldoser gjennom friksjonen. Koden kompilerer. Varsellampen er slukket.
          </p>
        </div>
      </Slide>

      <Slide id="metodikk-veddemaal" notes="Hver metodikk er et veddemål om hvordan kontekst oppfører seg. Waterfall: stabil. Agile: driver, så synkroniser. BDD / spec-som-kontrakt: kod konteksten som en kjørbar kontrakt — neste veddemål, for AI-alderen.">
        <div className="flex h-[1080px] flex-col justify-center gap-10 px-32">
          <h2 className="text-primary-foreground text-6xl">Metodikk er et veddemål om kontekst</h2>
          <ul className="text-secondary-foreground flex list-none flex-col gap-6 text-4xl">
            <li><span className="text-primary-foreground">Waterfall</span> — konteksten er stabil og kjent på forhånd</li>
            <li><span className="text-primary-foreground">Agile</span> — konteksten driver, så synkroniser hele tiden</li>
            <li><span className="text-primary-foreground">BDD</span> — kod konteksten som en kjørbar kontrakt</li>
          </ul>
        </div>
      </Slide>

      <Slide id="hva-er-bdd" transition="fade" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <h2 className="text-primary-foreground text-8xl">Hva er BDD?</h2>
        </div>
      </Slide>

      <Slide id="bdd-what" notes="BDD lukker gapet mellom forretning og teknikk. Det vanskeligste er ikke å skrive koden, men å bli enige om hva som faktisk skal bygges.">
        <div className="flex h-[1080px] flex-col justify-center gap-14 px-32">
          <p className="text-primary-foreground text-6xl leading-tight">
            Det vanskeligste er å bestemme presist{' '}
            <span className="text-secondary-foreground">hva</span> som skal bygges.
          </p>
          <ul className="text-secondary-foreground flex list-none flex-col gap-6 text-4xl">
            <li>Samarbeid på tvers av roller → felles forståelse</li>
            <li>Korte iterasjoner → raskere tilbakemelding</li>
            <li>Dokumentasjon som sjekkes mot systemet</li>
          </ul>
        </div>
      </Slide>

      <Slide id="bdd-three-practices" notes="Discovery: utforsk hva systemet kan gjøre via konkrete eksempler. Formulation: skriv eksemplene i Gherkin (menneske + maskin). Automation: eksemplene blir kjørbare tester.">
        <div className="flex h-[1080px] flex-col justify-center gap-10 px-32">
          <h2 className="text-primary-foreground mb-2 text-5xl">Tre praksiser</h2>
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-primary-foreground text-5xl">
                Discovery <span className="text-secondary-foreground text-3xl">— hva systemet kan gjøre</span>
              </p>
              <p className="text-secondary-foreground text-3xl">Utforsk med konkrete eksempler</p>
            </div>
            <div>
              <p className="text-primary-foreground text-5xl">
                Formulation <span className="text-secondary-foreground text-3xl">— hva det skal gjøre</span>
              </p>
              <p className="text-secondary-foreground text-3xl">
                Skriv eksemplene så både menneske og maskin kan lese dem (Gherkin)
              </p>
            </div>
            <div>
              <p className="text-primary-foreground text-5xl">
                Automation <span className="text-secondary-foreground text-3xl">— hva det faktisk gjør</span>
              </p>
              <p className="text-secondary-foreground text-3xl">Eksemplene blir kjørbare tester</p>
            </div>
          </div>
        </div>
      </Slide>

      <Slide id="bdd-reframe" notes="Mange er brent av BDD — limet (step-handlerne) var dyrt. Men det er nettopp kostnaden AI fjerner. Løftet — én delt, kjørbar kontrakt — blir endelig ekte. Og .feature blir rattet ditt.">
        <div className="flex h-[1080px] flex-col justify-center gap-10 px-32">
          <h2 className="text-primary-foreground text-6xl">Hvorfor BDD nå?</h2>
          <ul className="text-secondary-foreground flex list-none flex-col gap-6 text-4xl">
            <li>Kostnaden var limet (step-handlerne) → <span className="text-primary-foreground">AI skriver det</span></li>
            <li>Løftet var én delt, kjørbar kontrakt → <span className="text-primary-foreground">endelig ekte</span></li>
            <li>.feature er ikke et testformat → <span className="text-primary-foreground">det er rattet ditt</span></li>
          </ul>
        </div>
      </Slide>

      <Slide id="aps-intro" transition="fade" notes="Kjernen i verktøyet bygger på Uncle Bobs Acceptance Pipeline Specification og Matt Pococks grilling av spesifikasjoner.">
        <div className="flex h-[1080px] flex-col items-center justify-center text-center">
          <h1 className="text-primary-foreground mb-4 text-8xl">APS</h1>
          <p className="text-secondary-foreground text-4xl">Acceptance Pipeline Specification</p>
          <p className="text-secondary-foreground mt-6 text-3xl opacity-60">etter Robert C. Martin</p>
        </div>
      </Slide>

      <Slide id="aps-pipeline" notes="Spesifikasjonen er kontrakten. .feature pluss step-handlerne kompileres til en kjørbar akseptansetest — å kjøre den øver appen slik spec-en beskriver. <br/><br/> Grønt = appen oppfyller kontrakten; rødt = den gjør det ikke. Akseptansetesten ER den kjørbare kontrakten — samme artefakt mennesket leser og maskinen sjekker. <br/><br/> Mennesket eier .feature-filene og step-handlerne; pipelinen genererer selve testen. Språk- og prosjektnøytralt.">
        <div className="relative flex h-[1080px] flex-col justify-center gap-10 px-32">
          <h2 className="text-primary-foreground text-7xl">Spesifikasjonen er kontrakten</h2>
          <p className="text-secondary-foreground text-5xl">.feature → genererte tester → kjør</p>
          <ul className="text-secondary-foreground flex list-none flex-col gap-5 text-4xl">
            <li>Du eier spesifikasjonen og step-handlerne</li>
            <li>Pipelinen genererer testene</li>
            <li>Språk- og prosjektnøytralt</li>
          </ul>
          <p className="text-secondary-foreground absolute bottom-12 left-32 text-2xl opacity-50">
            Acceptance Pipeline Specification · Robert C. Martin
          </p>
        </div>
      </Slide>

      <Slide id="gherkin-example" notes="En .feature i Gherkin. Feature sier hva og hvorfor; Background er en felles forutsetning som kjører før hvert scenario; hvert Scenario er ett konkret eksempel. <br/><br/> Linjene Given/When/Then/And er steps: Given setter tilstanden, When er handlingen, Then er forventet resultat. Stegene er skrevet i vanlig, lesbart språk — domenets vokabular. <br/><br/> Hver step-tekst matches (på eksakt tekst) til en step-handler: en liten kodebit som faktisk utfører steget mot den kjørende appen — her en ekte HTTP-forespørsel til /health. Step-handlerne binder den lesbare spec-en til systemet. <br/><br/> Viktig: vi binder alltid mot den ekte overflaten brukeren treffer (HTTP), aldri en intern funksjon — ellers kan testen være grønn mens appen er ødelagt.">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-8">
          <h2 className="text-primary-foreground text-5xl">health.feature</h2>
          <Code lang="gherkin">{HEALTH_FEATURE}</Code>
        </div>
      </Slide>

      <Slide id="aps-mutation" notes="Mutasjon er den nye varsellampen — designsignalet AI slo av, gjenoppbygd. Endre noe smått i koden eller eksemplene; hvis testene fortsatt er grønne, fanger ikke spec-en det. Overlevende mutant = løs spesifikasjon. Da strammer mennesket inn .feature-en, ikke koden.">
        <div className="flex h-[1080px] flex-col justify-center gap-10 px-32">
          <h2 className="text-primary-foreground text-7xl">Mutasjon: den nye varsellampen</h2>
          <p className="text-secondary-foreground text-5xl leading-tight">
            Endre noe smått. Hvis testene fortsatt er grønne, fanger ikke spesifikasjonen det.
          </p>
          <p className="text-primary-foreground text-4xl">Overlevende mutant = løs spesifikasjon</p>
        </div>
      </Slide>

      <Slide id="aps-grilling" notes="Før du bygger: grill spesifikasjonen mot dokumentene. Ett spørsmål om gangen med et anbefalt svar, håndhev vokabular, stress-test med eksempler, fang beslutninger som ADR-er.">
        <div className="relative flex h-[1080px] flex-col justify-center gap-10 px-32">
          <h2 className="text-primary-foreground text-7xl">Grill spesifikasjonen</h2>
          <p className="text-secondary-foreground text-5xl">Før du bygger: avhør spesifikasjonen mot dokumentene.</p>
          <ul className="text-secondary-foreground flex list-none flex-col gap-5 text-4xl">
            <li>Ett spørsmål om gangen, med et anbefalt svar</li>
            <li>Håndhev vokabularet (CONTEXT.md), stress-test med konkrete eksempler</li>
            <li>Fang beslutninger som ADR-er</li>
          </ul>
          <p className="text-secondary-foreground absolute bottom-12 left-32 text-2xl opacity-50">
            grilling specs · Matt Pocock
          </p>
        </div>
      </Slide>

      <Slide id="aps-loop" notes="">
        <div className="flex h-[1080px] items-center justify-center">
          <ApsLoop />
        </div>
      </Slide>

      <Slide id="hva-betyr-dette" transition="fade" notes="Pose spørsmålene — ikke svar på dem. La rommet tenke sammen. Timeboks ~7 min per spørsmål; seed-svarene i baklomma som stillhets-bryter.">
        <div className="flex h-[1080px] items-center justify-center">
          <h2 className="text-primary-foreground text-8xl">Hva betyr dette?</h2>
        </div>
      </Slide>

      <Slide id="q-utviklerrollen" notes="Provokasjon: hvis du aldri skriver koden, er du fortsatt utvikler? Spenning: deskilling vs å løfte seg; “men jeg liker å skrive kode”; hvordan lærer juniorer? Frø (hold igjen): den knappe ferdigheten flyttes fra å taste implementasjonen til å vite hva som skal bygges og bevise at det er riktig — pattern designer-jobben.">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-8 px-32 text-center">
          <p className="text-secondary-foreground text-3xl uppercase tracking-widest opacity-70">Utviklerrollen</p>
          <p className="text-primary-foreground text-7xl leading-tight">
            Hvis du aldri skriver koden — er du fortsatt utvikler?
          </p>
        </div>
      </Slide>

      <Slide id="q-kvalitetssikring" notes="Provokasjon: hvis spec-en er testen og AI skriver koden — er QA død, eller plutselig den mest verdifulle rollen? Spenning: gatekeeper-fasen forsvinner vs spec-tetthet blir hele spillet; hvem eier .feature? Frø: QA blir den løpende målingen av spec-tetthet (mutasjon) — spec/mutasjons-eksperten er den nye QA.">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-8 px-32 text-center">
          <p className="text-secondary-foreground text-3xl uppercase tracking-widest opacity-70">Kvalitetssikring</p>
          <p className="text-primary-foreground text-7xl leading-tight">
            Hvis spec-en er testen — er QA død, eller den mest verdifulle rollen?
          </p>
        </div>
      </Slide>

      <Slide id="q-samarbeid" notes="Provokasjon: hvis alle teamenes AI kjører på samme skinner — dreper det autonomi, eller gir det endelig konsistens? Spenning: konsistens vs autonomi; .feature som felles språk på tvers av PM/dev/QA; drift i maskinfart. Frø: .feature er kontrakten alle deler; organisasjonen setter skinnene så AI-fart blir konsistens, ikke kaos.">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-8 px-32 text-center">
          <p className="text-secondary-foreground text-3xl uppercase tracking-widest opacity-70">Samarbeid i team</p>
          <p className="text-primary-foreground text-7xl leading-tight">
            Samme skinner for alle team — dreper det autonomi, eller gir det konsistens?
          </p>
        </div>
      </Slide>

      <Slide id="close" transition="fade" notes="Landing: rollene skilte seg igjen; mennesket flyttet opp et nivå — fra å skrive kode til å eie kontrakten maskinen holdes til.">
        <div className="flex h-[1080px] flex-col items-center justify-center gap-10 text-center">
          <p className="text-secondary-foreground text-6xl">
            <span className="line-through opacity-60">vibe coding</span> → autopilot coding
          </p>
          <p className="text-primary-foreground text-5xl leading-tight">Fra å skrive kode til å eie kontrakten.</p>
        </div>
      </Slide>
    </DeckShell>
  );
}
