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
interface Props {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function CountUp({ target, duration = 2000, suffix = '', className = '' }: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(Math.floor(eased * target));

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
