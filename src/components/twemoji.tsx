'use client';

import { useEffect, useRef } from 'react';
import { parseTwemoji } from '@/lib/twemoji';

interface TwemojiTextProps {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

/**
 * Convert emoji text in children to Twemoji SVG images.
 * Usage: <Twemoji>🐶 토링</Twemoji>
 */
export function Twemoji({ children, className, tag: Tag = 'span' }: TwemojiTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      void parseTwemoji(ref.current);
    }
  }, [children]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Render a single emoji as Twemoji image.
 * Usage: <TwemojiIcon emoji="🐶" size={24} />
 */
export function TwemojiIcon({ emoji, size = 20, className }: { emoji: string; size?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const apply = async () => {
      if (!ref.current) {
        return;
      }

      await parseTwemoji(ref.current);
      const img = ref.current.querySelector('img');
      if (img) {
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.display = 'inline-block';
        img.style.verticalAlign = 'middle';
      }
    };

    void apply();
  }, [emoji, size]);

  return <span ref={ref} className={'inline-flex items-center ' + (className || '')}>{emoji}</span>;
}
