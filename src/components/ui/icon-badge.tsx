import type { ReactNode } from 'react';

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
