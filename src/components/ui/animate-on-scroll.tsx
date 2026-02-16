'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

type AnimateOnScrollProps = {
  children: ReactNode;
  animation?: 'fade-up' | 'scale-up';
  delay?: number;
  className?: string;
};

export function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  className = ''
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const animationClass =
    animation === 'scale-up'
      ? isVisible
        ? 'translate-y-0 scale-100 opacity-100'
        : 'translate-y-2 scale-95 opacity-0'
      : isVisible
        ? 'translate-y-0 opacity-100'
        : 'translate-y-6 opacity-0';

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${animationClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
