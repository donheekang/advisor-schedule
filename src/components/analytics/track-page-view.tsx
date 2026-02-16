'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';

type TrackPageViewProps = {
  eventName: string;
  params?: Record<string, string | number | undefined>;
};

export function TrackPageView({ eventName, params }: TrackPageViewProps) {
  useEffect(() => {
    trackEvent(eventName, params);
  }, [eventName, params]);

  return null;
}
