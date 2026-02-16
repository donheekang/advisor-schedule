'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

type AnimateOnScrollProps = {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in';
  delay?: number;
  className?: string;
};
import { type ReactNode, useEffect, useRef, useState } from 'react';

type AnimateOnScrollProps = {
  children: ReactNode;
  animation?: 'fade-up' | 'scale-up';
  delay?: number;
  className?: string;
};
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
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
  className = ''
}: AnimateOnScrollProps) {
  duration = 700,
  className = ''
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }
    const el = ref.current;
    if (!el) return;

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
      className={`${className ?? ''} transition-all duration-500 ${visible ? `opacity-100 ${base}` : hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${animationClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
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
