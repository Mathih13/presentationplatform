import { useEffect, useMemo, useState } from 'react';
import { codeToTokens } from 'shiki';
import type { ThemedToken } from 'shiki';
import { useFragment } from './useFragment';

export interface CodeStep {
  lines: string;
  focus?: boolean;
}

export interface CodeProps {
  lang: string;
  theme?: string;
  steps?: CodeStep[];
  children: string;
}

function parseLineRanges(spec: string): Set<number> {
  const result = new Set<number>();
  for (const rawPart of spec.split(',')) {
    const part = rawPart.trim();
    if (!part) continue;
    if (part.includes('-')) {
      const [aRaw, bRaw] = part.split('-');
      const a = aRaw ? parseInt(aRaw.trim(), 10) : NaN;
      const b = bRaw ? parseInt(bRaw.trim(), 10) : NaN;
      if (!Number.isNaN(a) && !Number.isNaN(b)) {
        for (let i = a; i <= b; i++) result.add(i);
      }
    } else {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n)) result.add(n);
    }
  }
  return result;
}

export function Code({ lang, theme = 'kanagawa-wave', steps, children }: CodeProps) {
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
  const { index: fragmentIndex } = useFragment();

  useEffect(() => {
    let cancelled = false;
    void codeToTokens(children, { lang, theme }).then((result) => {
      if (!cancelled) setTokens(result.tokens);
    });
    return () => {
      cancelled = true;
    };
  }, [children, lang, theme]);

  const stepIdx = useMemo(() => {
    if (!steps || steps.length === 0) return 0;
    return Math.min(Math.max(fragmentIndex + 1, 0), steps.length - 1);
  }, [steps, fragmentIndex]);

  const activeSet = useMemo(() => {
    if (!steps || steps.length === 0) return null;
    const step = steps[stepIdx];
    if (!step) return null;
    return parseLineRanges(step.lines);
  }, [steps, stepIdx]);

  const fragmentCount = steps && steps.length > 1 ? steps.length - 1 : 0;

  if (!tokens) {
    return (
      <pre>
        <code />
      </pre>
    );
  }

  return (
    <pre>
      <code>
        {tokens.map((line, idx) => {
          const lineNum = idx + 1;
          const state = activeSet ? (activeSet.has(lineNum) ? 'active' : 'dim') : 'active';
          return (
            <div key={idx} data-line={lineNum} data-state={state}>
              {line.length === 0
                ? ' '
                : line.map((tok, i) => (
                    <span key={i} style={{ color: tok.color }}>
                      {tok.content}
                    </span>
                  ))}
            </div>
          );
        })}
      </code>
      {Array.from({ length: fragmentCount }, (_, i) => (
        <span key={i} className="fragment" data-code-fragment="true" aria-hidden="true" />
      ))}
    </pre>
  );
}
