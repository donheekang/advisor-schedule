'use client';

import { type ReactNode } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: string;
  delay?: number;
  className?: string;
  [key: string]: unknown;
}

export function AnimateOnScroll({ children, className = '' }: AnimateOnScrollProps) {
  return <div className={className}>{children}</div>;
}

export default AnimateOnScroll;
