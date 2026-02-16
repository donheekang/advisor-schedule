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
          bg: '#FFF8F0',
          card: '#FFFFFF',
          highlight: '#FFF3E6',
          dark: '#3D2518'
        },
        text: {
          heading: '#4F2A1D',
          body: '#6B4226',
          sub: '#8B6B4E',
          muted: '#B8A08A'
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FB923C',
          bg: '#FFF7ED'
        },
        border: {
          DEFAULT: 'rgba(248, 199, 159, 0.3)',
          strong: 'rgba(248, 199, 159, 0.5)'
        }
      }
    }
  },
  plugins: []
};

export default config;
