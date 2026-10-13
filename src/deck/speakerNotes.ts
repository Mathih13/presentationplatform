// Speaker notes for a whole talk, kept in one Markdown file instead of inline `notes` strings:
//
//   ## slide-id
//   🎤 Mathias · ⏱ 3:00
//
//   A paragraph with **bold** and *italics*.
//   A single line break stays a line break.
//
//   - a list item
//
// Each `## heading` is a slide id; everything under it, up to the next heading, becomes that
// slide's notes as HTML. Text before the first heading is ignored, so the file can open with a
// title or reminders. Raw HTML passes through untouched.

export type SpeakerNotes = Record<string, string>;

const inline = (text: string) =>
  text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

function blockToHtml(block: string): string {
  const lines = block.split('\n').map((line) => line.trim());
  if (lines.every((line) => /^[-*] /.test(line))) {
    return `<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
  }
  return `<p>${lines.map(inline).join('<br/>')}</p>`;
}

const toHtml = (markdown: string) =>
  markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(blockToHtml)
    .join('');

export function parseSpeakerNotes(markdown: string): SpeakerNotes {
  const notes: SpeakerNotes = {};
  let id: string | null = null;
  let body: string[] = [];
  const flush = () => {
    if (id) notes[id] = toHtml(body.join('\n'));
  };
  for (const line of markdown.split(/\r?\n/)) {
    const heading = /^##\s+(\S+)\s*$/.exec(line);
    if (heading) {
      flush();
      id = heading[1]!;
      body = [];
    } else {
      body.push(line);
    }
  }
  flush();
  return notes;
}
