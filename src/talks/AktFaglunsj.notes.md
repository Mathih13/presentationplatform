# Talenotater — «Claude og oss andre»

Én seksjon per slide: `## slide-id` (samme id som i URL-en, f.eks. `#/hagen`).
Tom linje gir nytt avsnitt, **fet** og *kursiv* virker. Lagre, så oppdateres talevisningen (S).

## title

Kort hvem vi er — én utvikler, én engineering manager med produkteier-blod.

Bro (Mathias): «For å svare på hvordan vi samarbeider nå, må vi først se på hva samarbeid egentlig er. Og det starter i et veveri i Ytre Arna.»

## arne-fabrikker

Akt 1

Jeg er barnebarn av en programmerer. På slutten av 50-tallet flyttet bestefar til Ytre Arna og fikk jobb på Arne Fabrikker — Norges første mekaniserte veveri — som designer av vevmønster.

Vevstolene der var Jacquard-vevstoler: de leste hullkort, ett per rad i stoffet. Hullkortene regnes som det første steget i dataprogrammering.

## tre-roller

Tre roller som samarbeidet om ett mønster.
**Mønsterdesigneren** tok imot kundens bestilling og intensjon og gjorde den til en spesifikasjon på rutepapir — inkludert *hvorfor*.
**Kortmakeren** oversatte spesifikasjonen til hullkort. Presist fagarbeid, men ingen avgjørelser om mønsteret.
**Vevstolen** kjørte kortene uten å vite hva den lagde.

Samarbeidet handlet om å flytte forståelse fra én rolle til den neste. Og bestefar kunne holde hele konteksten i hodet: én vevstol, én kunde, en tradisjon som endret seg sakte.

## programmet-sekundaert

Så hva er det vi egentlig lager — vi som jobber med digitale tjenester, uansett rolle? Peter Naur skrev i 1985 at programmet nesten er et biprodukt. Det egentlige produktet er forståelsen — teorien teamet har om hva løsningen er til for. Mister du den, dreper du produktet, selv om koden fortsatt kjører.

Og den forståelsen bor ikke i ett hode. Den bor i teamets. Samarbeid er å holde den felles.

## hvem-holder-ringene

**Interaktivt**

Den forståelsen kaller jeg konteskt er alt som gjør arbeidet *riktig*. Den har lag: Kode → Team → Domene → Selskap → Industri.

Poenget: ingen holder alle ringene. Forståelsen er spredt på folk som ser forskjellige ting.

## ringer-i-bevegelse

Og ringene beveger seg — i ulik fart. Kode: daglig. Team: ukentlig. Domene: årlig — takster, ruter, regelverk. Selskap: over år. Industri: over tiår.

Siden ringene holdes av forskjellige folk, betyr det at *folk* glir fra hverandre. Domenet endrer seg hos fagfolkene, koden hos utviklerne, og ingen merker det før noe skurrer: «jamen det virket jo forrige uke».

*Animasjonen:* ringene går faktisk rundt — Kode raskt, Industri knapt merkbart, annenhver vei.

## kontekstdrift

En leder som virkelig ville forstå utviklerne, sa en gang at programvare er som en hage — uten stell gror den igjen. Det beskriver noe ekte, men plasserer årsaken feil sted. Koden er en maskin: den gjør nøyaktig det samme som dagen den ble sluppet.

Det som driver er passformen mellom arbeidet og forståelsen rundt det. *(Hold på hagen — den kommer tilbake, som en bonsai.)*

→ Overlevering til kollega.

## metodikk-veddemaal

Måten vi samarbeider på er et veddemål om hvordan konteksten oppfører seg.
**Waterfall** vedder på at den er kjent og stabil: skriv alt ned først, så er resten mekanisk. Resultatet er 400-siders spesifikasjoner som ikke stemmer — fordi verden endret seg underveis.

**Agile** vedder på at den driver, og at den bor i hodene våre. Svaret er å synke ofte.

## synkroniseringsritualer

De fleste agile praksiser er synkroniseringsritualer: standup synker teamet, retro synker hvordan vi jobber, sprint review synker med domenet.

Legg merke til mekanismen: det er **push**. Fordi konteksten bor i hodene, må folk samles til faste tider og dele den til hverandre.

*Animasjonen:* hvert slag er et ritual (standup, retro, review). Prikkene går ut til alle på én gang — og produkteieren som ikke var der, får dem aldri.

## ritual-duett

Erfarne utviklere som lever i koden time for time synes ofte standup er bortkastet tid — og det er helt innafor: de har liten drift å korrigere for.

Men standupen er ikke for deg. Den er for produkteieren som kommer innom én gang i uka, for nyansatte, for drift.

Det er prisen av agile: de som deler og de som får nytte er ikke de samme.

## better-call-claude

Alt dette er laget for mennesker som synker med mennesker. Så: hva er utfordringene når en helt annen type kollega er med?

Kortmakeren har fått en ny kollega. Rask, flink, alltid tilgjengelig.

## agent-ringer

Dette er kontekstbildet til agenten. Den ser det innerste — det du har gitt den akkurat nå — men du skal være heldig om den forstår domenet, selskapet eller bransjen.

**Callback:** Husk hvem som holdt de ytre ringene. Det er dere — fagfolk, ledere, produkteiere.

## menneske-vs-agent

Mennesker og agenter bygger kontekst på ulike måter — ikke ulike hastigheter, men ulike *typer* kontekst.

En agent leser 100 000 ord på sekunder, men holder seg på overflaten. Vi bruker måneder, men forstår dypt — og mye er taust: en erfaren saksbehandler eller utvikler reagerer riktig uten å kunne forklare hvorfor.

Og tid: vi holder fortid, nåtid og fremtid samtidig. Agenten har bare nå — det som står i vinduet. Den kan ikke delta i et ritual; den kan bare lese det som er skrevet ned.

Dette påvirker samarbeidet mellom oss som mennesker på tre måter.

## alle-blir-po

**1 av 3: avstand til arbeidet**

**Callback** utvikleren trengte ikke standupen fordi hen levde i koden. Når agenten skriver koden, lever utvikleren heller ikke der — og har fått samme avstand som produkteieren alltid hadde.

Og det gjelder alle. Saksbehandleren som lar AI skrive utkastene, analytikeren som lar AI lage rapporten — alle abstraherer bort deler av arbeidet.

## hver-sin-agent

**2 av 3: private kontekster**

Hver av oss har vår egen agent, og hver av dem vet bare det *én person* har fortalt den. 

Fagpersonen har f.eks gitt sin agent oversikt over regler for TT reiserett. 

Utvikleren har gitt sin agent koden. Ingen av dem vet om hverandre.

Hver av oss blir raskere. Den felles forståelsen — produktet, ifølge Naur — fordeles i private kopier.

## menneskefart

**3 av 3: tempo**

Og push-modellen henger ikke med. En ukentlig standup var i takt med arbeid som endret seg ukentlig. Nå endrer arbeidet seg flere ganger i timen. Ritualene kan ikke dele raskt nok — og agenten sitter uansett ikke i møtet.

Push modellen fra agilt trenger en oppdatering.

*Animasjonen:* ritualene passerer «nå» med noen sekunders mellomrom; agent-strømmen under er tett. Innen neste standup har dusinvis av endringer gått forbi.

## tredje-veddemaal

Tilbake til det tomme feltet. Det tredje veddemålet er **pull**: konteksten bor ett sted, eksplisitt, og hele teamet eier den. I stedet for å samles og dele, henter mennesker og agenter det de trenger når de trenger det.

Eierskapet er en egenskap av teamet, ikke en oppgave i et møte eller én persons dokument.

## hagen

Konteksten vokser av seg selv, og med agenter vokser den raskere enn før. Teamets jobb blir å beskjære den: fjerne det som er utdatert og bestemme hva som får vokse. Det er det vi tror utviklingsarbeid blir framover.

## felles-kontekst

For å dele og behandle denne konteksten henter alle agentene fra det samme stedet. 

De private boblene forsvinner ikke, men de er ikke lenger det eneste agenten vet. Og produkteieren som kommer innom én gang i uka, kan lese seg opp når hen vil — uten at noen må dele.

*Animasjonen:* hver agent sender en forespørsel inn (ringen), og konteksten strømmer tilbake — når den trenger det, ikke på et fast slag.

## hva-er-felles-kontekst

Dette er det vi jobber med i dag. Hvordan kan vi skape en løsning som lar team dele kontekst og domenekunnskap internt og med andre team og agenter. 

**Mathias** - Agent kan hente kontekst fra et annet team ved integrering.

## hver-for-oss-sammen

Så hva betyr det for hver rolle? Venstre kolonne er det agenten gjør for deg alene — fortsett med det. Høyre kolonne er beskjæringen: slik eier du din del av den felles konteksten.


## rollene-skiller-seg

Tilbake til veveriet. I lang tid slo vi de tre rollene sammen og kalte det «programmerer» — en historisk tilfeldighet som varte så lenge at vi glemte at de var separate.

Nå skiller de seg igjen. Oversettelsen blir billig, utførelsen har vært automatisk lenge. Mønsterdesignet står igjen: forståelsen. Men den får ikke plass i ett hode lenger.

## close

**Kollega:** «Så — hvordan samarbeider vi, når hver av oss har en agent?»

## diskusjon

Diskusjon ~15 min

Start med den trygge åpneren (siste spørsmål) om det er stille. Én av dere modererer hvert spørsmål; plukk 2–3.

Frø i baklomma: fagfolk vet hvorfor reglene er som de er (unntak, historikk, politiske hensyn) — det står aldri i koden. Det første som bør inn i den felles konteksten er ofte det alle spør den samme personen om.
