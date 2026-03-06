export type AnalyticsParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event' | 'config' | 'js', eventName: string | Date, params?: AnalyticsParams) => void;
  }
}

export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
