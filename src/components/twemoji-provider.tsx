'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { parseTwemoji } from '@/lib/twemoji';

/**
 * Convert emoji across the full page into Twemoji SVG images.
 * Re-parse on route change and DOM mutations.
 */
export function TwemojiProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      void parseTwemoji(document.body);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      void parseTwemoji(document.body);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
