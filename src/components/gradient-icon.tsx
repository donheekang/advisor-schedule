'use client';

import { Sparkles } from 'lucide-react';

type LucideIcon = typeof Sparkles;

type GradientVariant = 'blue' | 'lavender' | 'teal' | 'sky';

const GRADIENTS: Record<GradientVariant, string> = {
  blue: 'from-[#48B8D0] to-[#3A9BB0]',
  lavender: 'from-[#C084FC] to-[#A855F7]',
  teal: 'from-[#5CC4D8] to-[#48B8D0]',
  sky: 'from-[#38BDF8] to-[#0EA5E9]',
};

interface GradientIconProps {
  icon: LucideIcon;
  variant?: GradientVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'h-8 w-8', icon: 16, radius: 'rounded-lg' },
  md: { box: 'h-12 w-12', icon: 24, radius: 'rounded-xl' },
  lg: { box: 'h-14 w-14', icon: 28, radius: 'rounded-2xl' },
};

export function GradientIcon({ icon: Icon, variant = 'blue', size = 'md', className }: GradientIconProps) {
  const s = SIZES[size];
  return (
    <div
      className={
        'inline-flex items-center justify-center bg-gradient-to-br ' +
        GRADIENTS[variant] + ' ' + s.box + ' ' + s.radius + ' ' +
        (className || '')
      }
    >
      <Icon size={s.icon} className="text-white" />
    </div>
  );
}
