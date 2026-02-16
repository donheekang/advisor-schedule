'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up';

interface Props {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = ''
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const base = 'transition-all ease-out';
  const styles: Record<Animation, { visible: string; hidden: string }> = {
    'fade-up': {
      visible: 'opacity-100 translate-y-0',
      hidden: 'opacity-0 translate-y-8'
    },
    'fade-in': {
      visible: 'opacity-100',
      hidden: 'opacity-0'
    },
    'slide-left': {
      visible: 'opacity-100 translate-x-0',
      hidden: 'opacity-0 -translate-x-8'
    },
    'slide-right': {
      visible: 'opacity-100 translate-x-0',
      hidden: 'opacity-0 translate-x-8'
    },
    'scale-up': {
      visible: 'opacity-100 scale-100',
      hidden: 'opacity-0 scale-95'
    }
  };

  const s = styles[animation];

  return (
    <div
      ref={ref}
      className={`${base} ${isVisible ? s.visible : s.hidden} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
}
