import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </BaseIcon>
  );
}

export function PawPrint(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 0-5 5c0 2.5 2.5 4 5 4s5-1.5 5-4a5 5 0 0 0-5-5Z" />
    </BaseIcon>
  );
}

export function Search(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </BaseIcon>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3 1.6 3.4L17 8l-3.4 1.6L12 13l-1.6-3.4L7 8l3.4-1.6L12 3Z" />
      <path d="M5 14 6 16 8 17 6 18 5 20 4 18 2 17l2-1 1-2Z" />
      <path d="m19 13 .8 1.7L21.5 16l-1.7.8L19 18.5l-.8-1.7L16.5 16l1.7-.8L19 13Z" />
    </BaseIcon>
  );
}

export function Stethoscope(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 3v5a4 4 0 0 0 8 0V3" />
      <path d="M9 3v5" />
      <path d="M15 10a4 4 0 1 0 8 0v-1" />
      <circle cx="19" cy="9" r="2" />
      <path d="M12 15a5 5 0 0 0 10 0" />
    </BaseIcon>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6 9 6 6 6-6" />
    </BaseIcon>
  );
}
