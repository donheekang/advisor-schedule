import Link from 'next/link';
import type { ReactNode } from 'react';

function DefaultIcon() {
  return (
    <svg className="h-10 w-10 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 8h20" />
      <path d="M9 12h6M9 15h4" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="h-10 w-10 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-10 w-10 text-[#ff7a45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="3" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-[linear-gradient(180deg,#fff_0%,#fffaf7_100%)] px-6 py-14 text-center ring-1 ring-black/5">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7a45]/[0.08]">
        {icon ?? <DefaultIcon />}
      </div>
      <p className="mt-4 text-lg font-bold text-[#17191f]">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#697182]">{description}</p>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,122,69,0.25)] transition hover:brightness-95 active:scale-[0.98]"
        >
          {actionLabel}
        </Link>
      ) : actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff7a45,#ff9b5e)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,122,69,0.25)] transition hover:brightness-95 active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export { WarningIcon, LockIcon };

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<WarningIcon />}
      title="문제가 발생했어요"
      description={message || '잠시 후 다시 시도해주세요. 문제가 계속되면 support@pluslabkorea.com으로 문의해주세요.'}
      actionLabel={onRetry ? '다시 시도' : undefined}
      onAction={onRetry}
    />
  );
}
