'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

type AnimateOnScrollProps = {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in';
  delay?: number;
  className?: string;
};

export function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const base = animation === 'fade-in' ? 'translate-y-0' : 'translate-y-2';
  const hidden = animation === 'fade-in' ? 'opacity-0' : 'opacity-0 translate-y-2';

  return (
    <div
      ref={ref}
      className={`${className ?? ''} transition-all duration-500 ${visible ? `opacity-100 ${base}` : hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
