import type { CSSProperties } from 'react';
import { useDeck } from './useDeck';

export interface ImageProps {
  src?: string;
  lightSrc?: string;
  darkSrc?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export function Image({
  src,
  lightSrc,
  darkSrc,
  alt = '',
  width,
  height,
  className,
  fit = 'contain',
}: ImageProps) {
  const { isDark } = useDeck();
  const themedSrc =
    lightSrc || darkSrc
      ? isDark
        ? (darkSrc ?? src ?? lightSrc ?? '')
        : (lightSrc ?? src ?? darkSrc ?? '')
      : (src ?? '');

  const style: CSSProperties = {
    objectFit: fit,
    maxWidth: '100%',
    maxHeight: '100%',
  };

  return (
    <img
      src={themedSrc}
      alt={alt}
      loading="lazy"
      width={width}
      height={height}
      style={style}
      className={className}
    />
  );
}
