import type { ReactNode } from 'react';

export type DemoVariant = 'plain' | 'browser';

export interface DemoProps {
  children?: ReactNode;
  variant?: DemoVariant;
  url?: string;
  className?: string;
}

export function Demo({ children, variant = 'plain', url, className }: DemoProps) {
  const wrapperClass = `demo demo-${variant}${className ? ` ${className}` : ''}`;
  if (variant === 'browser') {
    return (
      <div className={wrapperClass}>
        <div className="demo-chrome">
          <span className="demo-chrome-dot demo-chrome-dot-red" />
          <span className="demo-chrome-dot demo-chrome-dot-yellow" />
          <span className="demo-chrome-dot demo-chrome-dot-green" />
          {url ? <span className="demo-chrome-url">{url}</span> : null}
        </div>
        <div className="demo-content">{children}</div>
      </div>
    );
  }
  return <div className={wrapperClass}>{children}</div>;
}
