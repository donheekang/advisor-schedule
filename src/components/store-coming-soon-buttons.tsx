type StoreComingSoonButtonsProps = {
  tone?: 'dark' | 'light';
  className?: string;
};

export function StoreComingSoonButtons({ tone = 'light', className }: StoreComingSoonButtonsProps) {
  const buttonClassName =
    tone === 'dark'
      ? 'inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white/40 cursor-not-allowed select-none'
      : 'inline-flex items-center gap-2 rounded-xl bg-[#0B3041]/5 px-5 py-3 text-sm font-semibold text-[#0B3041]/40 cursor-not-allowed select-none';

  return (
    <div className={'flex gap-3 ' + (className ?? '')}>
      <div className={buttonClassName}>
        <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.5-81.5-105.8-207.6-105.8-327.6 0-192.8 125.3-295.2 248.6-295.2 65.5 0 120.1 43 161.2 43s99.8-45.6 177.6-45.6c28.7 0 131.5 2.6 199.4 99.8zm-234-184.5c31.4-37.1 53.6-88.7 53.6-140.3 0-7.1-.6-14.3-1.9-20.1-51.1 1.9-111.9 34-148.4 76.5-27.5 31.4-55.2 83-55.2 135.5 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.9 0 103.7-30.7 140.4-71.1z" />
        </svg>
        App Store · 출시 예정
      </div>
      <div className={buttonClassName}>
        <svg width="16" height="16" viewBox="0 0 512 512" fill="none">
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#FFD900" />
          <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#4CAF50" />
          <path d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" fill="#FFD900" />
          <path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#FF3333" />
        </svg>
        Google Play · 출시 예정
      </div>
    </div>
  );
}
