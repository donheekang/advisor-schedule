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
      {icon}
    </div>
  );
}
