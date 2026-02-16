'use client';

import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  target: number;
  duration?: number;
  suffix?: string;
};

export function CountUp({ target, duration = 1500, suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let started = false;
    let rafId = 0;

    const runAnimation = () => {
      const startAt = performance.now();

      const update = (now: number) => {
        const progress = Math.min((now - startAt) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.floor(target * eased));

        if (progress < 1) {
          rafId = requestAnimationFrame(update);
          return;
        }

        setCount(target);
      };

      rafId = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          runAnimation();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [duration, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
