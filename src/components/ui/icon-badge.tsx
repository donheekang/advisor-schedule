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
}
