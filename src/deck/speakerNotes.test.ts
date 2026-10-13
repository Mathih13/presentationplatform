import { describe, it, expect } from 'vitest';
import { parseSpeakerNotes } from './speakerNotes';

describe('parseSpeakerNotes', () => {
  it('keys each section by its ## heading', () => {
    const notes = parseSpeakerNotes('## intro\nHello\n\n## outro\nBye\n');
    expect(notes).toEqual({ intro: '<p>Hello</p>', outro: '<p>Bye</p>' });
  });

  it('ignores text before the first heading', () => {
    expect(parseSpeakerNotes('# My talk\nReminders\n\n## intro\nHi')).toEqual({
      intro: '<p>Hi</p>',
    });
  });

  it('turns blank lines into paragraphs and single newlines into line breaks', () => {
    const { s } = parseSpeakerNotes('## s\nOne\nstill one\n\nTwo');
    expect(s).toBe('<p>One<br/>still one</p><p>Two</p>');
  });

  it('renders bold and italics', () => {
    const { s } = parseSpeakerNotes('## s\n**Callback:** husk *hagen*');
    expect(s).toBe('<p><strong>Callback:</strong> husk <em>hagen</em></p>');
  });

  it('renders a block of dashed lines as a list', () => {
    const { s } = parseSpeakerNotes('## s\n- one\n- **two**');
    expect(s).toBe('<ul><li>one</li><li><strong>two</strong></li></ul>');
  });

  it('passes raw HTML through', () => {
    const { s } = parseSpeakerNotes('## s\nSee <code>src/x.ts</code>');
    expect(s).toBe('<p>See <code>src/x.ts</code></p>');
  });

  it('gives a heading with no body empty notes', () => {
    expect(parseSpeakerNotes('## empty\n\n## next\nText')).toEqual({
      empty: '',
      next: '<p>Text</p>',
    });
  });

  it('handles Windows line endings', () => {
    expect(parseSpeakerNotes('## s\r\nOne\r\n\r\nTwo')).toEqual({ s: '<p>One</p><p>Two</p>' });
  });
});
