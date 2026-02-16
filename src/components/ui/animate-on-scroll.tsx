'use client';

import { useEffect, useRef, useState } from 'react';

type AnimateOnScrollProps = Readonly<{
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in';
  className?: string;
}>;

export function AnimateOnScroll({ children, animation = 'fade-up', className = '' }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const initialClass = animation === 'fade-up' ? 'translate-y-4 opacity-0' : 'opacity-0';

  return (
    <div
      ref={ref}
      className={`${className} transform-gpu transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : initialClass
      }`}
    >
      {children}
    </div>
  );
}
