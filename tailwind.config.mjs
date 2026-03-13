import starlightPlugin from '@astrojs/starlight-tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0dfff',
          200: '#c4c1ff',
          300: '#a5a0ff',
          400: '#8b83ff',
          500: '#6C63FF',
          600: '#5a50e6',
          700: '#4840bf',
          800: '#383299',
          900: '#2a2573',
        },
        accent: {
          50: '#fff0f3',
          100: '#ffe0e8',
          200: '#ffc1d1',
          300: '#ff99b4',
          400: '#FF6584',
          500: '#ff3d6b',
          600: '#e62e5c',
          700: '#bf1f4d',
          800: '#99183f',
          900: '#731230',
        },
        dj: {
          dark: '#0A0A0F',
          card: '#1A1A2E',
          panel: '#16213E',
          border: '#2A2A3E',
          cyan: '#00D4FF',
          purple: '#7B2FFF',
          green: '#00FF88',
          orange: '#FF8C00',
        },
      },
      fontFamily: {
        hebrew: ['Heebo', 'Assistant', 'sans-serif'],
        mono: ['Space Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'beat': 'beat 0.5s ease-in-out',
        'slide-rtl': 'slide-rtl 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 99, 255, 0.6)' },
        },
        'beat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'slide-rtl': {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [starlightPlugin()],
};
