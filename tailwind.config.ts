import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1B3A4B',
          secondary: '#2A9D8F',
          background: '#F8FAFB',
          card: '#FFFFFF',
          ctaHover: '#238B7E',
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
