import { ReactNode } from 'react';

type IconBadgeProps = {
  icon: ReactNode;
  color?: 'orange';
  size?: 'sm' | 'lg';
};

export function IconBadge({ icon, color = 'orange', size = 'sm' }: IconBadgeProps) {
  const sizeClass = size === 'lg' ? 'h-12 w-12' : 'h-9 w-9';
  const colorClass = color === 'orange' ? 'bg-[#FFF3E6] text-[#F97316]' : 'bg-gray-100 text-gray-700';

  return <div className={`${sizeClass} ${colorClass} flex items-center justify-center rounded-xl`}>{icon}</div>;
import type { ReactNode } from 'react';

type IconBadgeProps = {
  icon: ReactNode;
  color?: 'orange' | 'blue' | 'purple';
  size?: 'md' | 'lg';
};

const colorMap = {
  orange: 'bg-[#FFF4E8] text-[#F97316] ring-[#F97316]/15',
  blue: 'bg-[#EEF6FF] text-[#2563EB] ring-[#2563EB]/15',
  purple: 'bg-[#F5F0FF] text-[#7C3AED] ring-[#7C3AED]/15'
} as const;

const sizeMap = {
  md: 'h-11 w-11',
  lg: 'h-14 w-14'
} as const;

export function IconBadge({ icon, color = 'orange', size = 'md' }: IconBadgeProps) {
  return (
    <div className={`inline-flex items-center justify-center rounded-2xl ring-1 ${colorMap[color]} ${sizeMap[size]}`}>
type Color = 'orange' | 'blue' | 'green' | 'purple' | 'red';
type Size = 'sm' | 'md' | 'lg';

const colorMap: Record<Color, string> = {
  orange: 'bg-[#FFF3E6] text-[#F97316]',
  blue: 'bg-[#EFF6FF] text-[#3B82F6]',
  green: 'bg-[#F0FFF4] text-[#16A34A]',
  purple: 'bg-[#F5F3FF] text-[#8B5CF6]',
  red: 'bg-[#FFF1F0] text-[#EF4444]'
};

const sizeMap: Record<Size, string> = {
  sm: 'w-9 h-9 [&>svg]:w-4 [&>svg]:h-4',
  md: 'w-12 h-12 [&>svg]:w-6 [&>svg]:h-6',
  lg: 'w-16 h-16 [&>svg]:w-8 [&>svg]:h-8'
};

interface Props {
  icon: ReactNode;
  color?: Color;
  size?: Size;
}

export function IconBadge({ icon, color = 'orange', size = 'md' }: Props) {
  return (
    <div
      className={`${colorMap[color]} ${sizeMap[size]} rounded-2xl flex items-center justify-center flex-shrink-0`}
    >
      {icon}
    </div>
  );
}
