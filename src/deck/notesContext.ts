import { createContext } from 'react';
import type { SpeakerNotes } from './speakerNotes';

// Notes from the talk's Markdown file, keyed by slide id. Provided by DeckShell, read by Slide.
export const NotesContext = createContext<SpeakerNotes>({});
