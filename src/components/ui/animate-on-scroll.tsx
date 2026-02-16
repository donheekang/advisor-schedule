'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
}

const visibleMap: Record<Animation, string> = {
  'fade-up': 'opacity-100 translate-y-0',
  'fade-in': 'opacity-100',
  'slide-left': 'opacity-100 translate-x-0',
  'slide-right': 'opacity-100 translate-x-0',
  'scale-up': 'opacity-100 scale-100',
};

const hiddenMap: Record<Animation, string> = {
  'fade-up': 'opacity-0 translate-y-8',
  'fade-in': 'opacity-0',
  'slide-left': 'opacity-0 -translate-x-8',
  'slide-right': 'opacity-0 translate-x-8',
  'scale-up': 'opacity-0 scale-95',
};

export function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
}: AnimateOnScrollProps) {
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
      { threshold: 0.1, rootMargin: '50px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stateClass = isVisible ? visibleMap[animation] : hiddenMap[animation];
  const fullClass = "transition-all ease-out " + stateClass + " " + className;
  const styleObj = { transitionDelay: delay + "ms", transitionDuration: duration + "ms" };

  return (
    <div ref={ref} className={fullClass} style={styleObj}>
      {children}
    </div>
  );
}

