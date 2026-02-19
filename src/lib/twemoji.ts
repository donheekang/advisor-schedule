const TWEMOJI_SCRIPT_ID = 'twemoji-cdn-script';

interface TwemojiApi {
  parse: (node: HTMLElement | HTMLBodyElement, options: Record<string, string>) => void;
}

declare global {
  interface Window {
    twemoji?: TwemojiApi;
  }
}

const parseOptions = {
  folder: 'svg',
  ext: '.svg',
  base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/',
};

function loadTwemoji(): Promise<TwemojiApi | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.twemoji) {
    return Promise.resolve(window.twemoji);
  }

  return new Promise((resolve) => {
    const existing = document.getElementById(TWEMOJI_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(window.twemoji || null), { once: true });
      existing.addEventListener('error', () => resolve(null), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TWEMOJI_SCRIPT_ID;
    script.src = 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js';
    script.async = true;
    script.onload = () => resolve(window.twemoji || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

export async function parseTwemoji(node: HTMLElement | HTMLBodyElement): Promise<void> {
  const twemoji = await loadTwemoji();
  if (!twemoji) {
    return;
  }

  twemoji.parse(node, parseOptions);
}
