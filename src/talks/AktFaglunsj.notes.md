# Talenotater — «Claude og oss andre»

Én seksjon per slide: `## slide-id` (samme id som i URL-en, f.eks. `#/hagen`).
Tom linje gir nytt avsnitt, **fet** og *kursiv* virker. Lagre, så oppdateres talevisningen (S).

## title

**🎤 Begge** · ⏱ 0:00

Kort hvem vi er — én utvikler, én engineering manager med produkteier-blod.

Bro (Mathias): «For å svare på hvordan vi samarbeider nå, må vi først se på hva samarbeid egentlig er. Og det starter i et veveri i Ytre Arna.»

## arne-fabrikker

**🎤 Mathias** · ⏱ 3:00 · Akt 1

Jeg er barnebarn av en programmør. På slutten av 50-tallet flyttet bestefar til Ytre Arna og fikk jobb på Arne Fabrikker — Norges første mekaniserte veveri — som designer av vevmønster.

Vevstolene der var Jacquard-vevstoler: de leste hullkort, ett per rad i stoffet. Hullkortene regnes som det første steget i dataprogrammering.

## tre-roller

**🎤 Mathias** · ⏱ 3:45

Tre roller som samarbeidet om ett mønster.
**Mønsterdesigneren** tok imot kundens bestilling og intensjon og gjorde den til en spesifikasjon på rutepapir — inkludert *hvorfor*.
**Kortmakeren** oversatte spesifikasjonen til hullkort. Presist fagarbeid, men ingen avgjørelser om mønsteret.
**Vevstolen** kjørte kortene uten å vite hva den lagde.

Samarbeidet handlet om å flytte forståelse fra én rolle til den neste. Og bestefar kunne holde hele konteksten i hodet: én vevstol, én kunde, en tradisjon som endret seg sakte.

## programmet-sekundaert

**🎤 Mathias** · ⏱ 4:45

Så hva er det vi egentlig lager — vi som jobber med digitale tjenester, uansett rolle? Peter Naur skrev i 1985 at programmet nesten er et biprodukt. Det egentlige produktet er forståelsen — teorien teamet har om hva løsningen er til for. Mister du den, dreper du produktet, selv om koden fortsatt kjører.

Og den forståelsen bor ikke i ett hode. Den bor i teamets. Samarbeid er å holde den felles.

## hvem-holder-ringene

**🎤 Mathias** · ⏱ 5:45 · **Interaktivt**

Den forståelsen kaller jeg kontekst — ikke en AI sitt prompt-vindu, men alt som gjør arbeidet *riktig*. Den har lag: Kode → Team → Domene → Selskap → Industri.

Spør salen før hver rad: «Hvem hos dere holder denne ringen?» Ta ett-to svar, så avslør.

Poenget: ingen holder alle ringene. Forståelsen er spredt på folk som ser forskjellige ting.

Tilpass radene til AKTs faktiske roller (src/diagrams/contextRings.ts).

## ringer-i-bevegelse

**🎤 Mathias** · ⏱ 7:15

Og ringene beveger seg — i ulik fart. Kode: daglig. Team: ukentlig. Domene: årlig — takster, ruter, regelverk. Selskap: over år. Industri: over tiår.

Siden ringene holdes av forskjellige folk, betyr det at *folk* glir fra hverandre. Domenet endrer seg hos fagfolkene, koden hos utviklerne, og ingen merker det før noe skurrer: «jamen det virket jo forrige uke».

*Animasjonen:* ringene går faktisk rundt — Kode raskt, Industri knapt merkbart, annenhver vei.

## kontekstdrift

**🎤 Mathias** · ⏱ 8:00

En leder som virkelig ville forstå utviklerne, sa en gang at programvare er som en hage — uten stell gror den igjen. Det beskriver noe ekte, men plasserer årsaken feil sted. Koden er en maskin: den gjør nøyaktig det samme som dagen den ble sluppet.

Det som driver er passformen mellom arbeidet og forståelsen rundt det. *(Hold på hagen — den kommer tilbake, som en bonsai.)*

→ Overlevering til kollega.

## metodikk-veddemaal

**🎤 Kollega** · ⏱ 9:00 · Akt 2

Måten vi samarbeider på er et veddemål om hvordan konteksten oppfører seg.
**Waterfall** vedder på at den er kjent og stabil: skriv alt ned først, så er resten mekanisk. Resultatet er 400-siders spesifikasjoner som ikke stemmer — fordi verden endret seg underveis.
**Agile** vedder på at den driver, og at den bor i hodene våre. Svaret er å synke ofte.

Det tredje feltet lar vi stå åpent.

## synkroniseringsritualer

**🎤 Kollega** · ⏱ 10:15

De fleste agile praksiser er synkroniseringsritualer: standup synker teamet, retro synker hvordan vi jobber, sprint review synker med domenet.

Legg merke til mekanismen: det er **push**. Fordi konteksten bor i hodene, må folk samles til faste tider og kringkaste den til hverandre.

Del gjerne et eget eksempel: et ritual du har innført eller kuttet som leder — og hva som skjedde.

*Animasjonen:* hvert slag er et ritual (standup, retro, review). Prikkene går ut til alle på én gang — og produkteieren som ikke var der, får dem aldri.

## ritual-duett

**🎤 Begge** · ⏱ 11:45 · **Duett**

**Mathias:** Erfarne utviklere som lever i koden time for time synes ofte standup er bortkastet tid — og det er helt innafor: de har ingen drift å korrigere.
**Kollega:** Men standupen er ikke for deg. Den er for produkteieren som kommer innom én gang i uka, for nyansatte, for drift. Du kringkaster til de ytre ringene — betalt med din tid, høstet av resten.

Det er prisen for push: de som betaler og de som får nytte er ikke de samme.

## hva-er-veddemaalet

**🎤 Kollega** · ⏱ 13:15

Alt dette er laget for mennesker som synker med mennesker. Så: hva er veddemålet når en helt annen type kollega er med?

→ Overlevering til Mathias.

## better-call-claude

**🎤 Mathias** · ⏱ 14:00 · Akt 3

Kortmakeren har fått en ny kollega. Rask, flink, alltid tilgjengelig. Men hva ser den egentlig?

## agent-ringer

**🎤 Mathias** · ⏱ 14:30

Dette er kontekstbildet til agenten. Den ser det innerste — det du har gitt den akkurat nå — men du skal være heldig om den forstår domenet, selskapet eller bransjen.

**Callback:** Husk hvem som holdt de ytre ringene. Det er dere — fagfolk, ledere, produkteiere. Det er «oss andre» i tittelen.

## menneske-vs-agent

**🎤 Mathias** · ⏱ 15:30

Mennesker og agenter bygger kontekst på ulike måter — ikke ulike hastigheter, men ulike *typer* kontekst.

En agent leser 100 000 ord på sekunder, men holder seg på overflaten. Vi bruker måneder, men forstår dypt — og mye er taust: en erfaren saksbehandler eller utvikler reagerer riktig uten å kunne forklare hvorfor.

Og tid: vi holder fortid, nåtid og fremtid samtidig. Agenten har bare nå — det som står i vinduet. Den kan ikke delta i et ritual; den kan bare lese det som er skrevet ned.

Så hva gjør dette med samarbeidet? Tre ting.

## alle-blir-po

**🎤 Mathias** · ⏱ 17:00 · **1 av 3: avstand**

Husk duetten: utvikleren trengte ikke standupen fordi hen levde i koden. Når agenten skriver koden, lever hen ikke der lenger — og har fått samme avstand som produkteieren alltid hadde.

Og det gjelder alle. Saksbehandleren som lar AI skrive utkastene, analytikeren som lar AI lage rapporten — alle glir litt fra sitt eget arbeid.

## hver-sin-agent

**🎤 Mathias** · ⏱ 18:00 · **2 av 3: private kontekster**

Hver av oss har vår egen agent, og hver av dem vet bare det *én person* har fortalt den. Fagpersonen har gitt sin agent unntakene i takstregelverket. Utvikleren har gitt sin agent koden. Ingen av dem vet om hverandre.

Hver av oss blir raskere. Men den felles forståelsen — produktet, ifølge Naur — sprekker opp i private kopier.

## menneskefart

**🎤 Mathias** · ⏱ 19:15 · **3 av 3: tempo**

Og push-modellen henger ikke med. En ukentlig standup var i takt med arbeid som endret seg ukentlig. Nå endrer arbeidet seg i timen. Ritualene kan ikke kringkaste raskt nok — og agenten sitter uansett ikke i møtet.

Avstand, private kontekster, tempo. Push er brukt opp.

→ Overlevering til kollega.

*Animasjonen:* ritualene passerer «nå» med noen sekunders mellomrom; agent-strømmen under er tett. Innen neste standup har dusinvis av endringer gått forbi.

## tredje-veddemaal

**🎤 Kollega** · ⏱ 20:00 · Akt 4

Tilbake til det tomme feltet. Det tredje veddemålet er **pull**: konteksten bor ett sted, eksplisitt, og hele teamet eier den. I stedet for å samles og kringkaste, henter alle — mennesker og agenter — det de trenger når de trenger det.

Eierskapet er en egenskap ved teamet, ikke en oppgave i et møte eller én persons dokument.

## hagen

**🎤 Kollega** · ⏱ 21:00 · **Callback til hagen** · 3 klikk

**Røttene** (sliden åpner her): Husker dere lederen med hagen? Hen tok feil om koden — koden er en maskin. Men hen hadde rett om noe annet. Konteksten har røtter: historikk, beslutninger, hvorfor.

(klikk) **Stammen** — vi reiser opp mens treet tegner seg: konteksten vokser av seg selv. Alle legger til, og agentene legger til enda raskere. Se grenen til høyre — den vokser ut av form når ingen styrer.

(klikk) **Beskjæringen** — veksten trenger vi ikke hjelpe på. Det teamet må gjøre er å beskjære: fjerne det som er utdatert, styre retningen. Ett klipp.

(klikk) **Hele treet** — en bonsai er ikke et tre som får vokse fritt. Formen er resultatet av små klipp over lang tid, fra flere hender. La sliden stå et øyeblikk.

## felles-kontekst

**🎤 Kollega** · ⏱ 21:45

Samme bilde som i stad — men nå henter alle agentene fra det samme stedet. De private boblene forsvinner ikke, men de er ikke lenger det eneste agenten vet. Og produkteieren som kommer innom én gang i uka, kan lese seg opp når hen vil — uten at noen må kringkaste.

*Animasjonen:* hver agent sender en forespørsel inn (ringen), og konteksten strømmer tilbake — når den trenger det, ikke på et fast slag.

## felles-prosjekt

**🎤 Kollega** · ⏱ 22:45

Slik kan midten se ut i praksis: et felles AI-prosjekt som fagfolkene eier. Instruksjonene er skrevet av de som kan reglene — med *hvorfor*. Når kundesenteret, billettavdelingen og utviklerne spør AI-en, jobber alle fra samme forståelse.

Ingen nye verktøy — dette kan dere gjøre nå som AI tas i bruk.

**Før foredraget:** bytt reglene med ekte eksempler fra AKT, eller hold dem så generelle som nå.

## rett-konteksten

**🎤 Kollega** · ⏱ 24:00

Hvordan ser beskjæringen ut i hverdagen? Én vane: når agenten bommer, retter du ikke bare svaret — du retter konteksten, så ingen andre bommer på det samme. Ett lite klipp.

**Nevn risikoen ærlig:** «alles ansvar» blir fort «ingens ansvar». Det løser seg ikke av seg selv — det er en vane teamet må bygge, og noe vi gjerne vil diskutere med dere etterpå.

## tid-til-valg

**🎤 Kollega** · ⏱ 25:15

Så hva skjer med møtene? De forsvinner ikke — de skifter formål. Når informasjonen bor i konteksten, trenger vi ikke samles for å kringkaste den.

Men å lage ting er blitt billig, og da blir valget om hva som er verdt å lage det dyre. Tiden sammen går til valg og dømmekraft — ikke til å dele informasjon.

## hver-for-oss-sammen

**🎤 Kollega** · ⏱ 26:15

Så hva betyr det for hver rolle? Venstre kolonne er det agenten gjør for deg alene — fortsett med det. Høyre kolonne er beskjæringen: slik eier du din del av den felles konteksten.

Gjør eksemplene konkrete for AKT der dere kan.

## rollene-skiller-seg

**🎤 Mathias** · ⏱ 27:15

Tilbake til veveriet. I lang tid slo vi de tre rollene sammen og kalte det «programmør» — en historisk tilfeldighet som varte så lenge at vi glemte at de var separate.

Nå skiller de seg igjen. Oversettelsen blir billig, utførelsen har vært automatisk lenge. Mønsterdesignet står igjen: forståelsen. Men den får ikke plass i ett hode lenger.

## close

**🎤 Begge** · ⏱ 28:15

**Kollega:** «Så — hvordan samarbeider vi, når hver av oss har en agent?»
**Mathias:** les svaret på sliden, pause. Så: «Bestefar satt alene ved mønsterbordet. Det gjør ingen av oss lenger.»

**Kollega:** «Vi har gitt dere vårt svar. Nå vil vi høre deres.» → diskusjon.

## diskusjon

**🎤 Begge** · ⏱ 29:00 · Diskusjon ~15 min

Start med den trygge åpneren (siste spørsmål) om det er stille. Én av dere modererer hvert spørsmål; plukk 2–3.

Frø i baklomma: fagfolk vet hvorfor reglene er som de er (unntak, historikk, politiske hensyn) — det står aldri i koden. Det første som bør inn i den felles konteksten er ofte det alle spør den samme personen om.
