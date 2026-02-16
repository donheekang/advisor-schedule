'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type AnimateOnScrollProps = {
  children: ReactNode;
  animation?: string;
  delay?: number;
  className?: string;
};

export function AnimateOnScroll({ children, animation = 'fade-up', delay = 0, className = '' }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const triggerVisibility = () => {
      window.setTimeout(() => setIsVisible(true), delay);
    };

    const rect = element.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewport) {
      triggerVisibility();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerVisibility();
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  const animationClass = animation === 'fade-up' ? 'opacity-0 translate-y-8' : 'opacity-0';
  const visibleClass = animation === 'fade-up' ? 'opacity-100 translate-y-0' : 'opacity-100';

  return (
    <div
      ref={ref}
      className={'transition-all duration-700 ease-out ' + (isVisible ? visibleClass : animationClass) + (className ? ' ' + className : '')}
      style={{ transitionDelay: isVisible ? delay + 'ms' : '0ms' }}
    >
      {children}
    </div>
  );
}

