'use client';

import { useEffect, useRef, useState } from 'react';

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
