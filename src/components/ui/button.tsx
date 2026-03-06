import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] text-white shadow-[0_8px_20px_rgba(255,122,69,0.25)] hover:shadow-[0_12px_28px_rgba(255,122,69,0.3)] hover:brightness-[1.03]',
  secondary:
    'bg-[#17191f] text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-[#2a2d35]',
  outline:
    'border border-black/15 bg-white text-[#17191f] hover:border-[#ff7a45]/30 hover:bg-[#fff8f5]',
  ghost:
    'text-[#4f5868] hover:bg-black/5 hover:text-[#17191f]'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base'
};

export function Button({ variant = 'primary', size = 'md', children, className = '', arrow, ...props }: ButtonProps) {
  const baseStyles = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {children}
      {arrow ? (
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      ) : null}
    </>
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={`group ${baseStyles}`}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href: _href, ...buttonProps } = props as ButtonAsButton;

  return (
    <button type="button" className={`group ${baseStyles}`} {...buttonProps}>
      {content}
    </button>
  );
}
