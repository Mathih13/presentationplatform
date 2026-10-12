import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import 'reveal.js/reveal.css';
import './styles/globals.css';
import App from './App';
import AktFaglunsj from './talks/AktFaglunsj';

// ?talk=agentic opens the BDD + Agentic Tooling deck; default is the AKT faglunsj talk.
const deck =
  new URLSearchParams(window.location.search).get('talk') === 'agentic' ? <App /> : <AktFaglunsj />;

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(<StrictMode>{deck}</StrictMode>);
