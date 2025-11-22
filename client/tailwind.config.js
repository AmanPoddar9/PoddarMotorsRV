/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to bottom, rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 1))',
      },
      colors: {
        custom: {
          yellow: '#F59E0B', // Amber-500: More premium gold/yellow
          black: '#020617', // Slate-950: Deep rich black/blue
          jet: '#1E293B',   // Slate-800: Card backgrounds
          platinum: '#94A3B8', // Slate-400: Secondary text
          seasalt: '#F8FAFC', // Slate-50: Primary text
          accent: '#EAB308', // Yellow-500
          surface: '#0F172A', // Slate-900
        },
        workshop: {
          blue: '#0C3C8C',
          red: '#E82020',
          gray: '#F3F4F6',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}
