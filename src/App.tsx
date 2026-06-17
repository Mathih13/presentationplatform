import { useState } from 'react';
import { AnimatedArrow } from './deck/AnimatedArrow';
import { AnimatedBox } from './deck/AnimatedBox';
import { Code } from './deck/Code';
import { DeckShell } from './deck/DeckShell';
import { Demo } from './deck/Demo';
import { Diagram } from './deck/Diagram';
import { IframeDemo } from './deck/IframeDemo';
import { Image } from './deck/Image';
import { Slide } from './deck/Slide';
import { useFragment } from './deck/useFragment';
import { NetworkRoundtrip } from './diagrams/NetworkRoundtrip';
import { AlternativesQuadrant } from './diagrams/AlternativesQuadrant';
import { EntityUpdateBenchmark } from './diagrams/EntityUpdateBenchmark';
import { PillarsVenn } from './diagrams/PillarsVenn';
import { ServerAuthDiagram } from './diagrams/ServerAuthDiagram';
import { ThreePillars } from './diagrams/ThreePillars';
import { TopologyCompare } from './diagrams/TopologyCompare';
import { FIGMA_LABELS, SLACK_LABELS } from './diagrams/serverAuthLabels';



function NetworkRoundtripSlide() {
  const { index } = useFragment();
  // Fragments on this slide, in DOM order: outbound arrow, inbound arrow, hidden collapse trigger.
  // After both arrows are drawn (index >= 1), the next advance (index === 2) collapses the stack.
  const collapsed = index >= 2;
  return <NetworkRoundtrip collapsed={collapsed} />;
}

const SAMPLE_USER_TABLE = `const user = table(
  { name: 'user', public: true },
  {
    identity: t.identity().primaryKey(),
    name: t.string(),
    color: t.string(),
    online: t.bool(),
    x: t.f64(), // live cursor position, in canvas coordinates
    y: t.f64(),
  }
);`;

const SAMPLE_SHAPE_TABLE = `const shape = table(
  { name: 'shape', public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    kind: t.string(), // 'rect' | 'ellipse' | 'note'
    x: t.f64(),
    y: t.f64(),
    w: t.f64(),
    h: t.f64(),
    color: t.string(),
    text: t.string(), // sticky-note text ('' for rect / ellipse)
    owner: t.identity(),
  }
);`

const SAMPLE_ONCONNECT_REDUCER = `export const onConnect = spacetimedb.clientConnected(ctx => {
  ctx.db.connection.insert({ connectionId: ctx.connectionId!, identity: ctx.sender });

  const existing = ctx.db.user.identity.find(ctx.sender);
  if (existing) {
    ctx.db.user.identity.update({ ...existing, online: true });
  } else {
    ctx.db.user.insert({
      identity: ctx.sender,
      name: generateDefaultName()
      color: getRandomUserColor(),
      online: true,
      x: 0,
      y: 0,
    });
  }
});`

const SAMPLE_MOVECURSOR_REDUCER = `export const moveCursor = spacetimedb.reducer({ x: t.f64(), y: t.f64() }, (ctx, { x, y }) => {
  const me = ctx.db.user.identity.find(ctx.sender);
  if (me) ctx.db.user.identity.update({ ...me, x, y });
});`

const SAMPLE_MOVESHAPE_REDUCER = `export const moveShape = spacetimedb.reducer(
  { id: t.u64(), x: t.f64(), y: t.f64() },
  (ctx, { id, x, y }) => {
    const s = ctx.db.shape.id.find(id);
    if (s) ctx.db.shape.id.update({ ...s, x, y });
  }
);`

const SAMPLE_FRONTEND_WIREUP = `import { useSpacetimeDB, useTable, useReducer } from 'spacetimedb/react';
import { tables, reducers } from './module_bindings';

function App() {
  const { identity, isActive, connectionError } = useSpacetimeDB();

  const [shapes] = useTable(tables.shape);

  const moveShape = useReducer(reducers.moveShape);

 ...
}`

export default function App() {
  return (
    <DeckShell>
      <Slide id="intro" transition="fade" notes="I'm here to talk about video games. Who here plays video games? Who here plays online games? You play an MMO every day.">
        <div className='relative flex h-[1080px] flex-col items-center justify-center'>
          <h1 className='text-primary-foreground text-8xl mb-10'>Multiplayer for Voksne</h1>
          <div className='flex text-5xl justify-center items-center gap-2'>
            <p className='text-secondary-foreground'>med</p>
          </div>
          <img className='w-1/3' src='https://spacetimedb.com/images/brand.svg' />

          <div id="nameandcompany" className='absolute bottom-0 left-0 flex gap-2 items-center'>
            <p className='text-3xl'>Mathias Hartveit -</p>
            <div><svg width="48" height="15" viewBox="0 0 48 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-logo h-auto w-20"><path d="M10.6241 2.58771H6.75702V14.8585H3.8671V2.58771H0L0 0L10.6241 0V2.58771Z" fill="currentColor"></path><path d="M19.121 10.3175H12.4111C12.4111 11.7264 13.2344 12.7209 14.7575 12.7209C15.9307 12.7209 16.507 12.3687 17.1862 11.7057L18.8122 13.3011C17.7214 14.4199 16.6717 15 14.7369 15C12.2053 15 9.77655 13.8398 9.77655 9.46798C9.77655 5.94569 11.6701 3.95663 14.4488 3.95663C17.4332 3.95663 19.121 6.11145 19.121 9.17791V10.3175ZM16.4864 8.47345C16.4658 7.99691 16.4247 7.70684 16.2394 7.31317C15.9513 6.67087 15.3544 6.19432 14.4488 6.19432C13.5431 6.19432 12.9462 6.67087 12.6581 7.31317C12.4728 7.70684 12.4317 7.99691 12.4111 8.47345H16.4864Z" fill="currentColor"></path><path d="M26.6311 14.8585H25.1424C22.9199 14.8585 21.9764 13.2986 21.9764 11.7596L21.9764 6.09196H20.8232V4.03299H21.9764L21.9764 1.13205H24.7021L24.7021 4.03299H26.6311V6.09196H24.7021L24.7021 11.5932C24.7021 12.2172 24.9957 12.5707 25.6456 12.5707H26.6311V14.8585Z" fill="currentColor"></path><path d="M47.3282 5.69618L47.7706 3.41818H44.1964L44.8577 0H42.4741L41.8128 3.41583H38.2385L38.8993 0H36.5156L35.8543 3.41583H32.28L31.8399 5.69383H35.4142L34.7529 9.11201H31.1792L30.7391 11.3894H34.3133L33.652 14.8076H36.0356L36.697 11.3894H40.2712L39.6099 14.8076H41.9935L42.6548 11.3894H46.2291L46.6716 9.11142H43.0973L43.7586 5.69325H47.3305L47.3282 5.69559V5.69618ZM40.709 9.11142H37.1347L37.7961 5.69325H41.3703L40.709 9.11142Z" fill="currentColor"></path></svg></div>
          </div>
        </div>
      </Slide>

      <Slide
        id="topology"
        notes="Two network shapes for multiplayer games. Peer-to-peer: every client a source of truth, easy to cheat (host advantage) — Among Us, GTA Online, AoE2. <br> <br> Server-authoritative: server owns the state — WoW, CS, League. P2P scales to a handful of friends; <br> <br> server-auth is what every MMO / competitive shooter / persistent-world game uses."
      >
        <TopologyCompare />
      </Slide>

      <Slide id="server-auth" notes="Let's look at a server-authoritative game example with World of Warcraft."
      >
        <ServerAuthDiagram
          clientImageA="https://assets.rockpapershotgun.com/images/2018/11/world-of-warcraft-classic.jpeg"
          clientImageB="https://assets.rockpapershotgun.com/images/2018/11/world-of-warcraft-classic.jpeg"
        />
      </Slide>
      <Slide id="server-auth-slack" notes="But, this is the same pattern used in business applications like Slack. In fact, slack was started by an MMO-company that pivoted!">
        <ServerAuthDiagram
          labels={SLACK_LABELS}
          clientImageA="/slack.jpeg"
          clientImageB="/slack.jpeg"
        />
      </Slide>
      <Slide id="server-auth-figma" notes="Same pattern: Figma. In fact, Figma calls its collaboration-capabilities for multiplayer internally. <br> <br> Figma and Slack are MMOs (Slack is PvP, Figma is PvE)">
        <ServerAuthDiagram
          labels={FIGMA_LABELS}
          clientImageA="/figma.png"
          clientImageB="/figma.png"
        />
      </Slide>
      <Slide
        id="three-needs"
        notes="What clockwork labs/Spacetimedb asserts is that there are Three ingredients every realtime backend needs to be able to support this type of functionality: transactional storage, server-side compute, real-time networking. None of the alternatives have all three."
      >
        <ThreePillars />
      </Slide>
      <Slide
        id="alternatives"
        notes="Landscape of multiplayer / real-time backends — completeness vs. ease of use."
      >
        <AlternativesQuadrant />
      </Slide>

      <Slide
        id="three-needs-venn"
        notes="Every tool covers one or two, there are no easy to use complete solutions. AWS Websocket? SignalR "
      >
        <PillarsVenn />
      </Slide>
      <Slide
        id="three-primitives"
        notes="SpacetimeDB has exactly three features that correspond to those three ingredients: tables (storage), reducers (compute), subscription queries (real-time networking). You write your backend as a single module in Rust, C# or TypeScript. SpacetimeDB is a database, a server and an eventhub all in one. And they're fast"
      >
        <ThreePillars showPrimitives />
        <p className="mt-10 text-2xl opacity-60">
          One module, full coverage. <br></br> Supports Rust, C#, TypeScript
        </p>
      </Slide>

      <Slide
        id="entity-benchmark"
        notes="Here's the speed of spacetimedb updating the positions of a million entities in x, y, z coordinates "
      >
        <div className="flex h-[1080px] flex-col items-center justify-center gap-8">
          <h2>Updating 1 million entity positions</h2>
          <EntityUpdateBenchmark />
        </div>
      </Slide>

      <Slide id="network" notes="Spacetimedb achieves this precisely by being that single module. In a classical server->db architecture your commands have to run the entire stack, over the LAN. Then back again to go back to the server. In spacetimedb your code lives in memory next to your data.">
        <NetworkRoundtripSlide />
        <span className="fragment" aria-hidden="true" style={{ display: 'none' }} />
      </Slide>

      <Slide id="code-static" transition="slide" notes="So let's look at an example spacetimedb app. I want to build a figma-like application where multiple users can create and move shapes around collaboratively.">
        <h2>User Table</h2>
        <Code lang="typescript">{SAMPLE_USER_TABLE}</Code>
      </Slide>

      <Slide id="code-static" transition="slide" notes="Static Shiki block.">
        <h2>Shape Table</h2>
        <Code lang="typescript">{SAMPLE_SHAPE_TABLE}</Code>
      </Slide>

      <Slide id="code-static" transition="slide" notes="Static Shiki block.">
        <h2>OnConnect Reducer</h2>
        <Code steps={[{ lines: "1-99" }, { lines: "1-2", focus: true }, { lines: "3-6" }, { lines: "7-99" }]} lang="typescript">{SAMPLE_ONCONNECT_REDUCER}</Code>
      </Slide>

      <Slide id="code-static" transition="slide" notes="Static Shiki block.">
        <h2>Move Cursor Reducer</h2>
        <Code steps={[{ lines: "1-99" }, { lines: "3" }]} lang="typescript">{SAMPLE_MOVECURSOR_REDUCER}</Code>
      </Slide>

      <Slide id="code-static" transition="slide" notes="Static Shiki block.">
        <h2>Move Shape Reducer</h2>
        <Code steps={[{ lines: "1-99" }, { lines: "3-6" }]} lang="typescript">{SAMPLE_MOVESHAPE_REDUCER}</Code>
      </Slide>

      <Slide>
        <h2>Frontend Wireup</h2>
        <Code lang="typescript">{SAMPLE_FRONTEND_WIREUP}</Code>
      </Slide>

     
      <Slide>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h2>Demo</h2>
          <img className='w-1/3' src='/shapesync-qr.svg' />
        </div>
      </Slide>

      <Slide id="iframe" transition="slide" notes="Embedded iframe with chrome.">
        <div className="flex h-[1080px] flex-col items-center justify-start pt-4">
          <IframeDemo
            src={`https://shapesync-tawny.vercel.app/`}
            className="w-[1920px]"
            height={980}
          />
        </div>
      </Slide>

    </DeckShell>
  );
}
