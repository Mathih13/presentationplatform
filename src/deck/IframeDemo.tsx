export interface IframeDemoProps {
  src: string;
  width?: number | string;
  height?: number | string;
  title?: string;
  sandbox?: string;
  showChrome?: boolean;
  className?: string;
}

export function IframeDemo({
  src,
  width = '100%',
  height = '100vh',
  title = 'Demo',
  sandbox = 'allow-scripts allow-same-origin',
  showChrome = true,
  className,
}: IframeDemoProps) {
  const wrapperClass = `iframe-demo${className ? ` ${className}` : ''}`;
  return (
    <div className={wrapperClass}>
      {showChrome ? (
        <div className="demo-chrome">
          <span className="demo-chrome-dot demo-chrome-dot-red" />
          <span className="demo-chrome-dot demo-chrome-dot-yellow" />
          <span className="demo-chrome-dot demo-chrome-dot-green" />
          <span className="demo-chrome-url">{src}</span>
        </div>
      ) : null}
      <iframe
        src={src}
        width={width}
        height={height}
        title={title}
        sandbox={sandbox}
        className="iframe-demo-frame"
      />
    </div>
  );
}
