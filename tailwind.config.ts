import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out'
      },
      colors: {
        brand: {
          primary: '#1B3A4B',
          secondary: '#E67E22',
          background: '#F8FAFB',
          card: '#FFFFFF',
          ctaHover: '#CF6D17',
          textSecondary: '#6B7280',
          warning: '#F59E0B',
          error: '#EF4444',
          navyDark: '#162F3C'
        }
      }
    }
  },
  plugins: []
};

export default config;
